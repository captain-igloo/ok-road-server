<?php

declare(strict_types=1);

namespace App\Command;

use App\Entity\Device;
use App\Entity\Location;
use App\Entity\User;
use App\Repository\DeviceRepository;
use App\Repository\SpeedLimitRepository;
use App\Repository\UserRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use LongitudeOne\Spatial\PHP\Types\Geometry\Point;
use PhpMqtt\Client\MqttClient;
use Psr\Log\LoggerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(name: 'app:subscribe')]
class SubscribeCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private DeviceRepository $deviceRepository,
        private SpeedLimitRepository $speedLimitRepository,
        private UserRepository $userRepository,
        private LoggerInterface $logger,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $mqtt = new MqttClient('mosquitto', 1883, 'test-subscriber');
        $mqtt->connect();

        $mqtt->subscribe('owntracks/+/+', function ($topic, $message, $retained, $matchedWildcards) {
            $username = $matchedWildcards[0];
            $user = $this->userRepository->findOneBy([
                'username' => $username,
            ]);
            if (!$user) {
                $this->logger->error('Failed to find user');
                return;
            }
            if (!($device = $this->getDevice($user, $matchedWildcards[1]))) {
                $this->logger->error('Failed to find device: ' . $matchedWildcards[1]);
                return;
            }
            if (($json = json_decode($message, true)) === null) {
                $this->logger->error('Failed to decode: ' . $message);
                return;
            }
            if (
                !is_array($json)
                || !array_key_exists('_type', $json)
                || !array_key_exists('lat', $json)
                || !is_numeric($json['lat'])
                || !array_key_exists('lon', $json)
                || !is_numeric($json['lon'])
            ) {
                $this->logger->error('Invalid json: ' . $message);
                return;
            }
            try {
                $point = new Point($json['lon'], $json['lat'], 4326);
                $location = new Location();
                $location->setDevice($device);
                $location->setSpeedLimit($this->getSpeedLimit($point));
                $location->setTimestamp(new DateTime(date('Y-m-d H:i:s', $json['tst'])));
                $location->setLocation($point);
                if (array_key_exists('acc', $json)) {
                    $location->setAccuracy($json['acc']);
                }
                if (array_key_exists('vel', $json)) {
                    $location->setSpeed($json['vel']);
                }
                $this->entityManager->persist($location);
                $this->entityManager->flush();
            } catch (Exception $e) {
                $this->logger->error($e->getMessage());
            }

        }, 0);

        $mqtt->loop(true);

        return 0;
    }

    private function getSpeedLimit(Point $point): ?SpeedLimit
    {
        try {
            return $this->speedLimitRepository->findByPoint($point);
        } catch (Exception $e) {
            // probably speed limit polygons overlap
            $this->logger->error('Failed to find speed limit at: ' . $point->getX() . ', ' . $point->getY(), [
                'exception' => $e,
            ]);
        }
        return null;
    }

    private function getDevice(User $user, string $deviceName): Device
    {
        $device = $this->deviceRepository->findByUser($user, $deviceName);
        if ($device) {
            return $device;
        }
        $device = new Device();
        $device->setUser($user);
        $device->setName($deviceName);
        $this->entityManager->persist($device);
        $this->entityManager->flush();
        return $device;
    }
}
