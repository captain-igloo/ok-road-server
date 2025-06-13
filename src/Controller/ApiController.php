<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Location;
use App\Entity\User;
use App\Repository\DeviceRepository;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/', defaults: array('_format' => 'json'))]
final class ApiController extends AbstractFOSRestController
{
    public function __construct(private DeviceRepository $deviceRepository)
    {
    }

    /** @param Location[] $locations */
    #[Route('/api/locations')]
    public function fetchLocations(array $locations): Response
    {
        return $this->handleView($this->view($locations, 200));
    }

    /** @param Device[] $devices */
    #[Route('/api/devices')]
    public function fetchDevices(array $devices): Response
    {
        return $this->handleView($this->view($devices));
    }
}
