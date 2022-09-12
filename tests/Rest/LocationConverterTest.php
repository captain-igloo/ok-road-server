<?php

declare(strict_types=1);

namespace App\Tests\Rest;

use App\Entity\Device;
use App\Entity\Location;
use App\Entity\User;
use App\Repository\DeviceRepository;
use App\Repository\LocationRepository;
use App\Rest\LocationConverter;
use LogicException;
use PHPUnit\Framework\TestCase;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\Security;

final class LocationConverterTest extends TestCase
{
    public function testApplyGet(): void
    {
        $security = $this->createMock(Security::class);
        $security->method('getUser')
            ->willReturn(new User());
        $deviceRepository = $this->createMock(DeviceRepository::class);
        $location = new Location();
        $locationRepository = $this->createMock(LocationRepository::class);
        $locationRepository->method('findDeviceLocation')
            ->willReturn($location);
        $locationConverter = new LocationConverter($security, $deviceRepository, $locationRepository);
        $request = new Request();
        $request->attributes->set('deviceId', 1);
        $request->attributes->set('locationId', 1);
        $this->assertTrue(
            $locationConverter->apply($request, new ParamConverter(['name' => 'location'], Location::class)),
        );
        $this->assertEquals($location, $request->attributes->get('location'));
    }

    public function testApplyGetRequiresLogin(): void
    {
        $locationConverter = new LocationConverter(
            $this->createMock(Security::class),
            $this->createMock(DeviceRepository::class),
            $this->createMock(LocationRepository::class),
        );
        $request = new Request();
        $request->attributes->set('deviceId', 1);
        $request->attributes->set('locationId', 1);
        $this->expectException(LogicException::class);
        $locationConverter->apply($request, new ParamConverter(['name' => 'location'], Location::class));
    }

    public function testApplyGetBadRequest(): void
    {
        $locationConverter = new LocationConverter(
            $this->createMock(Security::class),
            $this->createMock(DeviceRepository::class),
            $this->createMock(LocationRepository::class),
        );
        $this->expectException(BadRequestHttpException::class);
        $locationConverter->apply(new Request(), new ParamConverter(['name' => 'location'], Location::class));
    }

    public function testApplyGetNotFound(): void
    {
        $security = $this->createMock(Security::class);
        $security->method('getUser')
            ->willReturn(new User());
        $locationConverter = new LocationConverter(
            $security,
            $this->createMock(DeviceRepository::class),
            $this->createMock(LocationRepository::class),
        );
        $request = new Request();
        $request->attributes->set('deviceId', 1);
        $request->attributes->set('locationId', 1);
        $this->expectException(NotFoundHttpException::class);
        $locationConverter->apply($request, new ParamConverter(['name' => 'location'], Location::class));
    }

    public function testApplyPost(): void
    {
        $security = $this->createMock(Security::class);
        $security->method('getUser')
            ->willReturn(new User());
        $deviceRepository = $this->createMock(DeviceRepository::class);
        $deviceRepository->method('findOneBy')
            ->willReturn(new Device());
        $locationConverter = new LocationConverter(
            $security,
            $deviceRepository,
            $this->createMock(LocationRepository::class),
        );
        $request = new Request();
        $request->attributes->set('deviceId', 1);
        $request->request->set('speed', 1);
        $request->request->set('accuracy', 1);
        $request->request->set('date_time', '2022-07-28 00:00:00');
        $request->request->set('longitude', 174);
        $request->request->set('latitude', -40);
        $request->setMethod(Request::METHOD_POST);
        $this->assertTrue(
            $locationConverter->apply($request, new ParamConverter(['name' => 'location'], Location::class)),
        );
    }

    public function testApplyPostNotFound(): void
    {
        $security = $this->createMock(Security::class);
        $security->method('getUser')
            ->willReturn(new User());
        $locationConverter = new LocationConverter(
            $security,
            $this->createMock(DeviceRepository::class),
            $this->createMock(LocationRepository::class),
        );
        $request = new Request();
        $request->attributes->set('deviceId', 1);
        $request->request->set('speed', 1);
        $request->request->set('accuracy', 1);
        $request->request->set('date_time', '2022-07-28 00:00:00');
        $request->request->set('longitude', 174);
        $request->request->set('latitude', -40);
        $request->setMethod(Request::METHOD_POST);
        $this->expectException(NotFoundHttpException::class);
        $locationConverter->apply($request, new ParamConverter(['name' => 'location'], Location::class));
    }

    public function testApplyPostBadRequest(): void
    {
        $locationConverter = new LocationConverter(
            $this->createMock(Security::class),
            $this->createMock(DeviceRepository::class),
            $this->createMock(LocationRepository::class),
        );
        $request = new Request();
        $request->setMethod(Request::METHOD_POST);
        $this->expectException(BadRequestHttpException::class);
        $locationConverter->apply($request, new ParamConverter(['name' => 'location'], Location::class));
    }

    public function testApplyInvalidMethod(): void
    {
        $locationConverter = new LocationConverter(
            $this->createMock(Security::class),
            $this->createMock(DeviceRepository::class),
            $this->createMock(LocationRepository::class),
        );
        $request = new Request();
        $request->setMethod(Request::METHOD_DELETE);
        $this->expectException(BadRequestHttpException::class);
        $locationConverter->apply($request, new ParamConverter([], Location::class));
    }

    public function testSupports(): void
    {
        $locationConverter = new LocationConverter(
            $this->createMock(Security::class),
            $this->createMock(DeviceRepository::class),
            $this->createMock(LocationRepository::class),
        );
        $this->assertTrue($locationConverter->supports(new ParamConverter([], Location::class)));
    }
}
