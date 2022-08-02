<?php
declare(strict_types=1);

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

final class DefaultController extends AbstractController
{
    public function __construct(private UserRepository $userRepository)
    {
    }

    #[Route(path: '/map', name: 'app_map')]
    public function map(): Response
    {
        return $this->render('map.html.twig');
    }
}
