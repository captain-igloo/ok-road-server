<?php
declare(strict_types=1);

namespace App\Controller;

use App\Entity\Device;
use App\Repository\DeviceRepository;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use LogicException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/", defaults={ "_format" = "json" })
 */
final class DeviceController extends AbstractFOSRestController
{
    public function __construct(private DeviceRepository $deviceRepository)
    {
    }

    #[Route(path: '/api/v1/devices', methods: ['GET'])]
    public function getDevices(Request $request): Response
    {
        $criteria = [
            'user' => $this->getUser(),
        ];
        if ($macAddress = $request->query->get('mac_address')) {
            $criteria['macAddress'] = $macAddress;
        }
        return $this->handleView($this->view($this->deviceRepository->findBy($criteria), 200));
    }

    #[Route(path: '/api/v1/devices/{id}', methods: ['GET'])]
    public function getDevice(Device $device): Response
    {
        return $this->handleView($this->view($device, 200));
    }

    #[Route(path: '/api/v1/devices', methods: ['POST'])]
    public function createDevice(Request $request, Device $device): Response
    {
        if ($this->isCsrfTokenValid('ok-road', $request->request->get('csrf'))) {
            $this->deviceRepository->add($device, true);
            return $this->handleView(
                $this->view($device, 201)->setHeader('Location', '/api/v1/devices/' . $device->getId()),
            );
        }
        throw new AccessDeniedHttpException();
    }
}
