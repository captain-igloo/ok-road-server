<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\User;
use App\Repository\LocationRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

final class DefaultController extends AbstractController
{
    public function __construct()
    {
    }

    #[Route('/')]
    public function index(#[CurrentUser] ?User $user): Response
    {
        $configuration = [];
        if ($user !== null) {
            $configuration['user'] = [
                'fullName' => $user->getFullName(),
                'username' => $user->getUsername(),
            ];
        }
        return $this->render('index.html.twig', [
            'configuration' => $configuration,
        ]);
    }

    #[Route('/map')]
    public function map(#[CurrentUser] User $user): Response
    {
        return $this->render('map.html.twig', [
            'configuration' => [
                'maxResults' => LocationRepository::MAX_RESULTS,
                'user' => [
                    'fullName' => $user->getFullName(),
                    'username' => $user->getUsername(),
                ],
            ]
        ]);
    }

    #[Route('/img/{speedLimit}.svg')]
    public function speedLimitSvg(int $speedLimit): Response
    {
        if ($speedLimit >= 100) {
            $fontSize = 8;
            $x = 3.5;
            $y = 12.5;
        } else {
            $fontSize = 10;
            $x = 4.5;
            $y = 13.5;
        }

        $response = new Response($this->renderView('speedLimit.svg.twig', [
            'fontSize' => $fontSize,
            'speedLimit' => $speedLimit,
            'x' => $x,
            'y' => $y,
        ]));
        $response->headers->set('Content-Type', 'image/svg+xml');
        return $response;
    }
}
