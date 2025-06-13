<?php

declare(strict_types=1);

namespace App\Rest;

use App\Entity\Device;
use App\Entity\User;
use App\Repository\DeviceRepository;
use App\Repository\LocationRepository;
use App\Repository\UserRepository;
use DateTime;
use DateTimeInterface;
use Override;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Controller\ValueResolverInterface;
use Symfony\Component\HttpKernel\ControllerMetadata\ArgumentMetadata;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

final class LocationsResolver implements ValueResolverInterface
{
    private User $user;

    public function __construct(
        private Security $security,
        private DeviceRepository $deviceRepository,
        private LocationRepository $locationRepository,
        private UserRepository $userRepository
    ) {
    }

    #[Override]
    public function resolve(Request $request, ArgumentMetadata $argument): iterable
    {
        if ($argument->getName() === 'locations') {
            $isDemo = $request->query->get('demo') === 'true';
            if (
                ($deviceId = (int) $request->query->get('device'))
                && ($device = $this->getDevice($deviceId, $isDemo))
                && $request->query->has('from')
                && ($from = new DateTime($request->query->get('from')))
                && $request->query->has('to')
                && ($to = new DateTime($request->query->get('to')))
            ) {
                return $isDemo
                    ? [$this->locationRepository->findDemoLocations($device, $from, $to)]
                    : [$this->locationRepository->findLocations($device, $from, $to)];
            }
            throw new BadRequestHttpException();
        }
        return [];
    }

    private function getDevice(int $deviceId, bool $isDemo): ?Device
    {
        if ($isDemo) {
            if (
                ($user = $this->userRepository->findDemoUser())
                && $device = $this->deviceRepository->findById($user, $deviceId)
            ) {
                return $device;
            }
        } elseif (
            ($user = $this->security->getUser())
            && $device = $this->deviceRepository->findById($user, $deviceId)
        ) {
            return $device;
        }
        return null;
    }
}
