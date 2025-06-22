<?php

declare(strict_types=1);

namespace Tests\Rest;

use App\Entity\Device;
use App\Entity\User;
use App\Repository\DeviceRepository;
use App\Repository\UserRepository;
use App\Rest\DevicesResolver;
use PHPUnit\Framework\TestCase;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\ControllerMetadata\ArgumentMetadata;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

final class DevicesResolverTest extends TestCase
{
    public function testResolve(): void
    {
        $device = new Device();
        $deviceRepository = $this->createMock(DeviceRepository::class);
        $deviceRepository->method('findByUser')
            ->willReturn([$device]);
        $devicesResolver = new DevicesResolver(
            $this->getSecurity(),
            $deviceRepository,
            $this->createMock(UserRepository::class),
        );
        $argumentMetadata = new ArgumentMetadata('devices', null, false, false, null);
        $this->assertEquals($device, $devicesResolver->resolve(new Request(), $argumentMetadata)[0][0]);
    }

    public function testNoUserShouldThrow(): void
    {
        $device = new Device();
        $deviceRepository = $this->createMock(DeviceRepository::class);
        $deviceRepository->method('findByUser')
            ->willReturn([$device]);
        $devicesResolver = new DevicesResolver(
            $this->createMock(Security::class),
            $deviceRepository,
            $this->createMock(UserRepository::class),
        );
        $argumentMetadata = new ArgumentMetadata('devices', null, false, false, null);
        $this->expectException(AccessDeniedHttpException::class);
        $devicesResolver->resolve(new Request(), $argumentMetadata);
    }

    private function getSecurity(): Security
    {
        $security = $this->createMock(Security::class);
        $security->method('getUser')
            ->willReturn(new User());
        return $security;
    }
}