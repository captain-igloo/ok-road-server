<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

final class DefaultController extends AbstractController
{
    public function __construct()
    {
    }

    #[Route('/map')]
    public function map(#[CurrentUser] User $user): Response
    {
        return $this->render('map.html.twig', [
            'user' => [
                'fullName' => $user->getFullName(),
                'username' => $user->getUsername(),
            ],
        ]);
    }
}
