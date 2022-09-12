<?php

declare(strict_types=1);

namespace App\Controller;

use App\Repository\CameraRepository;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/", defaults={ "_format" = "json" })
 */
final class CameraController extends AbstractFOSRestController
{
    public function __construct(private CameraRepository $cameraRepository)
    {
    }

    #[Route(path: '/api/v1/cameras', methods: ['GET'])]
    public function getCameras(Request $request): Response
    {
        return $this->handleView($this->view($this->cameraRepository->findAll(), 200));
    }
}
