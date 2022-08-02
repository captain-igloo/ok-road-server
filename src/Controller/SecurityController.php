<?php
declare(strict_types=1);

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use LogicException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class SecurityController extends AbstractController
{
    public function __construct(private UserRepository $userRepository)
    {}

    #[Route(path: '/register', methods: ['GET'])]
    public function register(): Response
    {
        return $this->render('security/register.html.twig');
    }

    #[Route(path: '/register', methods: ['POST'])]
    public function createUser(User $user): Response
    {
        $this->userRepository->add($user, true);
        // print $user->getEmail();
        // die;
    }

    #[Route(path: '/login', name: 'app_login')]
    public function login(AuthenticationUtils $authenticationUtils): Response
    {
        // if ($this->getUser()) {
        //     return $this->redirectToRoute('target_path');
        // }

        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();
        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();

        return $this->render('security/login.html.twig', ['last_username' => $lastUsername, 'error' => $error]);
    }

    #[Route(path: '/logout', name: 'app_logout')]
    public function logout(): void
    {
        // This method can be blank - it will be intercepted by the logout key on your firewall.
        throw new LogicException();
    }
}
