<?php

declare(strict_types=1);

namespace App\Rest;

use App\Entity\Device;
use App\Entity\User;
use App\Repository\DeviceRepository;
use LogicException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Request\ParamConverter\ParamConverterInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

final class DeviceConverter implements ParamConverterInterface
{
    public function __construct(
        private Security $security,
        private DeviceRepository $deviceRepository,
        private CsrfTokenManagerInterface $csrfTokenManager,
    ) {
    }

    public function apply(Request $request, ParamConverter $configuration): bool
    {
        if ($request->getMethod() === Request::METHOD_GET) {
            return $this->applyGet($request, $configuration);
        } elseif ($request->getMethod() === Request::METHOD_POST) {
            return $this->applyPost($request, $configuration);
        }
        throw new BadRequestHttpException();
    }

    public function supports(ParamConverter $configuration): bool
    {
        return $configuration->getClass() === Device::class;
    }

    private function getUser(): User
    {
        if ($user = $this->security->getUser()) {
            return $user;
        }
        throw new LogicException();
    }

    private function applyGet(Request $request, ParamConverter $configuration): bool
    {
        if ($deviceId = $request->attributes->get('id')) {
            $device = $this->deviceRepository->findOneBy([
                'id' => $deviceId,
                'user' => $this->getUser(),
            ]);
            if ($device) {
                $request->attributes->set($configuration->getName(), $device);
                return true;
            }
            throw new NotFoundHttpException();
        }
        throw new BadRequestHttpException();
    }

    private function applyPost(Request $request, ParamConverter $configuration): bool
    {
        $device = new Device();
        $device->setUser($this->getUser());
        if ($macAddress = $request->request->get('mac_address')) {
            $device->setMacAddress((string) $macAddress);
            $request->attributes->set($configuration->getName(), $device);
            return true;
        }
        throw new BadRequestHttpException();
    }
}
