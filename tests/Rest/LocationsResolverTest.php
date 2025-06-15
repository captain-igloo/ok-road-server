<?php

declare(strict_types=1);

namespace Tests\Rest;

use App\Entity\Device;
use App\Entity\Location;
use App\Entity\User;
use App\Repository\DeviceRepository;
use App\Repository\LocationRepository;
use App\Repository\UserRepository;
use App\Rest\LocationsResolver;
use PHPUnit\Framework\TestCase;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\ControllerMetadata\ArgumentMetadata;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class LocationsResolverTest extends TestCase
{
    public function testResolve(): void
    {
        $deviceRepository = $this->createMock(DeviceRepository::class);
        $deviceRepository->method('findById')
            ->willReturn(new Device());
        $locationRepository = $this->createMock(LocationRepository::class);
        $location = new Location();
        $locationRepository->method('findLocations')
            ->willReturn([$location]);
        $locationsResolver = new LocationsResolver(
            $this->getSecurity(),
            $deviceRepository,
            $locationRepository,
            $this->createMock(UserRepository::class),
        );
        $argumentMetadata = new ArgumentMetadata('locations', null, false, false, null);
        $request = new Request([
            'device' => 1,
            'from' => '2024-07-15 00:00:00',
            'to' => '2024-07-16 00:00:00',
        ]);
        $this->assertEquals($location, $locationsResolver->resolve($request, $argumentMetadata)[0][0]);
    }

    public function testResolveDemo(): void
    {
        $deviceRepository = $this->createMock(DeviceRepository::class);
        $deviceRepository->method('findById')
            ->willReturn(new Device());
        $locationRepository = $this->createMock(LocationRepository::class);
        $location = new Location();
        $locationRepository->method('findDemoLocations')
            ->willReturn([$location]);
        $userRepository = $this->createMock(UserRepository::class);
        $userRepository->method('findDemoUser')
            ->willReturn(new User());
        $locationsResolver = new LocationsResolver(
            $this->getSecurity(),
            $deviceRepository,
            $locationRepository,
            $userRepository,
        );
        $argumentMetadata = new ArgumentMetadata('locations', null, false, false, null);
        $request = new Request([
            'demo' => 'true',
            'device' => 1,
            'from' => '2024-07-15 00:00:00',
            'to' => '2024-07-16 00:00:00',
        ]);
        $this->assertEquals($location, $locationsResolver->resolve($request, $argumentMetadata)[0][0]);
    }

    public function testDeviceNotFound(): void
    {
        $locationsResolver = new LocationsResolver(
            $this->getSecurity(),
            $this->createMock(DeviceRepository::class),
            $this->createMock(LocationRepository::class),
            $this->createMock(UserRepository::class),
        );
        $argumentMetadata = new ArgumentMetadata('locations', null, false, false, null);
        $request = new Request(['device' => 1]);
        $this->expectException(NotFoundHttpException::class);
        $locationsResolver->resolve($request, $argumentMetadata);
    }

    public function testMissingParamsShouldThrow(): void
    {
        $locationsResolver = new LocationsResolver(
            $this->getSecurity(),
            $this->createMock(DeviceRepository::class),
            $this->createMock(LocationRepository::class),
            $this->createMock(UserRepository::class),
        );
        $this->expectException(BadRequestHttpException::class);
        $locationsResolver->resolve(new Request(), new ArgumentMetadata('locations', null, false, false, null));
    }

    public function testSkip(): void
    {
        $locationsResolver = new LocationsResolver(
            $this->getSecurity(),
            $this->createMock(DeviceRepository::class),
            $this->createMock(LocationRepository::class),
            $this->createMock(UserRepository::class),
        );
        $this->assertEquals(
            [],
            $locationsResolver->resolve(new Request(), new ArgumentMetadata('skip', null, false, false, null)),
        );
    }

    private function getSecurity(): Security
    {
        $security = $this->createMock(Security::class);
        $security->method('getUser')
            ->willReturn(new User());
        return $security;
    }
}
