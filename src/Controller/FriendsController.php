<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/', defaults: array('_format' => 'json'))]
final class FriendsController extends AbstractFOSRestController
{
    public function __construct(private UserRepository $userRepository, private EntityManagerInterface $entityManager)
    {
    }

    #[Route('/api/friends', methods: ['GET'])]
    public function fetchFriends(#[CurrentUser] User $currentUser): Response
    {
        return $this->handleView($this->view($currentUser->getFriends(), 200));
    }

    #[Route('/api/friends/{id}', methods: ['GET'])]
    public function fetchFriend(#[CurrentUser] User $currentUser, User $friend): Response
    {
        if ($currentUser->getFriends()->contains($friend)) {
            return $this->handleView($this->view($friend, 200));
        }
        throw new NotFoundHttpException();
    }

    #[Route('/api/friends', methods: ['POST'])]
    public function addFriend(#[CurrentUser] User $currentUser, Request $request): Response
    {
        $params = json_decode($request->getContent(), true);
        if (is_array($params) && array_key_exists('username', $params)) {
            $otherUser = $this->userRepository->findOneBy([
                'username' => $params['username'],
            ]);
            if ($otherUser !== null) {
                $currentUser->addFriend($otherUser);
                $this->entityManager->persist($currentUser);
                $this->entityManager->flush();
                return $this->handleView($this->view($otherUser, 201, [
                    'Location' => '/api/friends/' . $otherUser->getId(),
                ]));
            }
            throw new NotFoundHttpException();
        }
        throw new BadRequestHttpException();
    }

    #[Route('/api/friends/{id}', methods: ['DELETE'])]
    public function deleteFriend(#[CurrentUser] User $currentUser, User $friend): Response
    {
        $currentUser->removeFriend($friend);
        $this->entityManager->persist($currentUser);
        $this->entityManager->flush();
        return $this->handleView($this->view([], 204));
    }
}
