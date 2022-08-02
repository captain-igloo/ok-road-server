<?php
declare(strict_types=1);

namespace App\Rest;

use App\Entity\Location;
use App\Entity\User;
use App\Repository\DeviceRepository;
use App\Repository\LocationRepository;
use DateTime;
use LogicException;
use LongitudeOne\Spatial\PHP\Types\Geometry\Point;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Request\ParamConverter\ParamConverterInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\Security;

final class LocationConverter implements ParamConverterInterface
{
    public function __construct(
        private Security $security,
        private DeviceRepository $deviceRepository,
        private LocationRepository $locationRepository,
    ) {
    }

    public function apply(Request $request, ParamConverter $configuration): bool
    {
        if ($request->getMethod() === Request::METHOD_GET) {
            return $this->applyGet($request, $configuration);
        } elseif ($request->getMethod() === Request::METHOD_POST) {
            return $this->applyPost($request, $configuration);
        }
        throw new BadRequestHttpException();
    }

    public function supports(ParamConverter $configuration): bool
    {
        return $configuration->getClass() === Location::class;
    }

    private function getUser(): User
    {
        if ($user = $this->security->getUser()) {
            return $user;
        }
        throw new LogicException();
    }

    private function applyGet(Request $request, ParamConverter $configuration): bool
    {
        if (
            ($deviceId = $request->attributes->get('deviceId')) &&
            ($locationId = $request->attributes->get('locationId'))
        ) {
            $location = $this->locationRepository->findDeviceLocation(
                $this->getUser(),
                (int) $deviceId,
                (int) $locationId,
            );
            if ($location !== null) {
                $request->attributes->set($configuration->getName(), $location);
                return true;
            }
            throw new NotFoundHttpException();
        }
        throw new BadRequestHttpException();
    }

    private function applyPost(Request $request, ParamConverter $configuration): bool
    {
        if (
            ($deviceId = $request->attributes->get('deviceId')) &&
            ($speed = $request->request->get('speed')) !== null &&
            ($accuracy = $request->request->get('accuracy')) !== null &&
            ($dateTime = $request->request->get('date_time')) &&
            ($longitude = $request->request->get('longitude')) !== null &&
            ($latitude = $request->request->get('latitude')) !== null
        ) {
            $device = $this->deviceRepository->findOneBy([
                'id' => $deviceId,
                'user' => $this->getUser(),
            ]);
            if ($device) {
                $location = new Location();
                $location->setDevice($device);
                $location->setAccuracy((float) $accuracy);
                $location->setSpeed((float) $speed);
                $location->setTime(new DateTime($dateTime));
                $location->setLocation(new Point($longitude, $latitude));
                $request->attributes->set($configuration->getName(), $location);
                return true;
            }
            throw new NotFoundHttpException();
        }
        throw new BadRequestHttpException();
    }
}
