<?php
declare(strict_types=1);

namespace App\Controller;

use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

/**
 * @Route("/", defaults={ "_format" = "json" })
 */
final class CsrfController extends AbstractFOSRestController
{
    public function __construct(private CsrfTokenManagerInterface $csrfTokenManager)
    {
    }

    #[Route(path: '/api/v1/csrf-token', methods: ['GET'])]
    public function getToken(): Response
    {
        return $this->handleView($this->view($this->csrfTokenManager->getToken('authenticate')->getValue(), 200));
    }
}
