<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Security\LoginFormAuthenticator;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use LogicException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Security\Http\Authentication\UserAuthenticatorInterface;

class SecurityController extends AbstractController
{
    public function __construct(
        private UserRepository $userRepository,
        private UserAuthenticatorInterface $userAuthenticator,
        private LoginFormAuthenticator $loginFormAuthenticator,
    ) {
    }

    #[Route(path: '/register2', methods: ['GET'])]
    public function register(): Response
    {
        $this->createFormBuilder(new User())
            ->add('email', EmailType::class)
            ->add('register', SubmitType::class, ['label' => 'Register'])
            ->getForm();

        if ($this->getUser()) {
            return $this->redirect('/map');
        }
        return $this->render('security/register.html.twig');
    }

    #[Route(path: '/register2', methods: ['POST'])]
    public function createUser(Request $request, User $user): Response
    {
        if ($this->isCsrfTokenValid('ok-road', (string) $request->request->get('_csrf_token'))) {
            $this->userRepository->add($user, true);
            return $this->userAuthenticator->authenticateUser($user, $this->loginFormAuthenticator, $request);
        }
        throw new AccessDeniedHttpException();
    }

    #[Route(path: '/login', name: 'app_login')]
    public function login(AuthenticationUtils $authenticationUtils): Response
    {
        if ($this->getUser()) {
            return $this->redirect('/map');
        }

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
