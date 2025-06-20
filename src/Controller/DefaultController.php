<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\User;
use App\Repository\LocationRepository;
use App\Repository\UserRepository;
use RuntimeException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

final class DefaultController extends AbstractController
{
    public function __construct(
        private string $speedLimitTilesUrl,
        private array $mapCenter,
        private int $mapZoom,
        private string $sentryDsn,
    ) {
    }

    #[Route('/')]
    public function index(#[CurrentUser] ?User $user): Response
    {
        $configuration = [
            'sentryDsn' => $this->sentryDsn,
        ];
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
            'configuration' => $this->getConfig($user, false),
        ]);
    }

    #[Route('/demo')]
    public function demo(#[CurrentUser] ?User $user): Response
    {
        return $this->render('map.html.twig', [
            'configuration' => $this->getConfig($user, true),
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

    private function getConfig(?User $user, bool $demo): array
    {
        $config = [
            'demo' => $demo,
            'map' => [
                'center' => $this->mapCenter,
                'zoom' => $this->mapZoom,
            ],
            'maxResults' => LocationRepository::MAX_RESULTS,
            'sentryDsn' => $this->sentryDsn,
            'speedLimitTilesUrl' => $this->speedLimitTilesUrl,
        ];
        if ($user !== null) {
            $config['user'] = [
                'fullName' => $user->getFullName(),
                'username' => $user->getUsername(),
            ];
        }
        return $config;
    }
}
