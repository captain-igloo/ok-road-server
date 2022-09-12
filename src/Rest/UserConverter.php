<?php

declare(strict_types=1);

namespace App\Rest;

use App\Entity\User;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Request\ParamConverter\ParamConverterInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class UserConverter implements ParamConverterInterface
{
    public function __construct(private UserPasswordHasherInterface $passwordHasher)
    {
    }

    public function apply(Request $request, ParamConverter $configuration): bool
    {
        if (
            $request->getMethod() === Request::METHOD_POST &&
            ($email = $request->request->get('email')) &&
            ($password = $request->request->get('password'))
        ) {
            $user = new User();
            $user->setEmail((string) $email);
            $user->setPassword($this->passwordHasher->hashPassword($user, $password));
            $request->attributes->set($configuration->getName(), $user);
            return true;
        }
        throw new BadRequestHttpException();
    }

    public function supports(ParamConverter $configuration): bool
    {
        return $configuration->getClass() === User::class;
    }
}
