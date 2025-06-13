<?php

declare(strict_types=1);

namespace App\Rest;

use App\Repository\DeviceRepository;
use App\Repository\UserRepository;
use Override;
use RuntimeException;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Controller\ValueResolverInterface;
use Symfony\Component\HttpKernel\ControllerMetadata\ArgumentMetadata;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

final class DevicesResolver implements ValueResolverInterface
{
    public function __construct(
        private Security $security,
        private DeviceRepository $deviceRepository,
        private UserRepository $userRepository,
    ) {
    }

    #[Override]
    public function resolve(Request $request, ArgumentMetadata $argument): iterable
    {
        if ($argument->getName() === 'devices') {
            $isDemo = $request->query->get('demo') === 'true';
            $user = $isDemo ? $this->userRepository->findDemoUser() : $this->security->getUser();
            if ($user !== null) {
                return [$this->deviceRepository->findByUser($user)];
            }
            throw new UnauthorizedHttpException();
        }
        return [];
    }
}
