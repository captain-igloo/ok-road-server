<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Device;
use App\Entity\Location;
use App\Repository\LocationRepository;
use App\Repository\DeviceRepository;
use App\Repository\SpeedLimitRepository;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use LongitudeOne\Spatial\PHP\Types\Geometry\Point;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/", defaults={ "_format" = "json" })
 */
final class LocationController extends AbstractFOSRestController
{
    public function __construct(
        private LocationRepository $locationRepository,
        private SpeedLimitRepository $speedLimitRepository,
    ) {
    }

    #[Route(path: '/api/v1/devices/{id}/locations', methods: ['GET'])]
    public function getLocations(Device $device): Response
    {
        $locations = $this->locationRepository->findBy([
            'device' => $device,
        ]);
        return $this->handleView($this->view($locations, 200));
    }

    #[Route(path: '/api/v1/devices/{deviceId}/locations/{locationId}', methods: ['GET'])]
    public function getLocation(Location $location): Response
    {
        return $this->handleView($this->view($location, 200));
    }

    #[Route(path: '/api/v1/devices/{deviceId}/locations', methods: ['POST'])]
    public function createLocation(Request $request, Location $location): Response
    {
        if ($this->isCsrfTokenValid('ok-road', $request->request->get('csrf'))) {
            $this->locationRepository->add($location, true);
            return $this->handleView(
                $this->view($location, 201)->setHeader(
                    'Location',
                    '/api/v1/devices/' . $request->attributes->get('deviceId') . '/locations/' . $location->getId(),
                ),
            );
        }
        throw new AccessDeniedHttpException();
    }

    #[Route(path: '/api/v1/speed-limit', methods: ['GET'])]
    public function getSpeedLimit(Point $point): Response
    {
        if ($speedLimit = $this->speedLimitRepository->findByPoint($point)) {
            return $this->handleView($this->view($speedLimit, 200));
        }
        throw new NotFoundHttpException();
    }
}
