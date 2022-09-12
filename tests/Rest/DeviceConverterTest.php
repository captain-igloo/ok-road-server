<?php

declare(strict_types=1);

namespace App\Tests\Rest;

use App\Entity\Device;
use App\Entity\User;
use App\Repository\DeviceRepository;
use App\Rest\DeviceConverter;
use LogicException;
use PHPUnit\Framework\TestCase;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Csrf\CsrfTokenManager;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

final class DeviceConverterTest extends TestCase
{
    public function testApplyGet(): void
    {
        $security = $this->createMock(Security::class);
        $security->method('getUser')
            ->willReturn(new User());
        $deviceRepository = $this->createMock(DeviceRepository::class);
        $device = new Device();
        $deviceRepository->method('findOneBy')
            ->willReturn($device);
        $deviceConverter = new DeviceConverter($security, $deviceRepository, new CsrfTokenManager());
        $request = new Request();
        $request->attributes->set('id', 1);
        $this->assertTrue($deviceConverter->apply($request, new ParamConverter(['name' => 'device'], Device::class)));
        $this->assertEquals($device, $request->attributes->get('device'));
    }

    public function testApplyGetWithoutUser(): void
    {
        $deviceConverter = new DeviceConverter(
            $this->createMock(Security::class),
            $this->createMock(DeviceRepository::class),
            new CsrfTokenManager(),
        );
        $request = new Request();
        $request->attributes->set('id', 1);
        $this->expectException(LogicException::class);
        $deviceConverter->apply($request, new ParamConverter([], Device::class));
    }

    public function testApplyGetNotFound(): void
    {
        $security = $this->createMock(Security::class);
        $security->method('getUser')
            ->willReturn(new User());
        $deviceConverter = new DeviceConverter(
            $security,
            $this->createMock(DeviceRepository::class),
            new CsrfTokenManager(),
        );
        $request = new Request();
        $request->attributes->set('id', 1);
        $this->expectException(NotFoundHttpException::class);
        $deviceConverter->apply($request, new ParamConverter([], Device::class));
    }

    public function testApplyGetWithoutId(): void
    {
        $deviceConverter = new DeviceConverter(
            $this->createMock(Security::class),
            $this->createMock(DeviceRepository::class),
            new CsrfTokenManager(),
        );
        $this->expectException(BadRequestHttpException::class);
        $deviceConverter->apply(new Request(), new ParamConverter([], Device::class));
    }

    public function testApplyPostWithoutMacAddress(): void
    {
        $security = $this->createMock(Security::class);
        $security->method('getUser')
            ->willReturn(new User());
        $csrfTokenManager = $this->createMock(CsrfTokenManagerInterface::class);
        $csrfTokenManager->method('isTokenValid')
            ->willReturn(true);
        $deviceConverter = new DeviceConverter(
            $security,
            $this->createMock(DeviceRepository::class),
            $csrfTokenManager,
        );
        $request = new Request([], [
            'csrf' => 'token',
        ]);
        $request->setMethod(Request::METHOD_POST);
        $this->expectException(BadRequestHttpException::class);
        $deviceConverter->apply($request, new ParamConverter([], Device::class));
    }

    public function testApplyInvalidMethod(): void
    {
        $deviceConverter = new DeviceConverter(
            $this->createMock(Security::class),
            $this->createMock(DeviceRepository::class),
            new CsrfTokenManager(),
        );
        $request = new Request();
        $request->setMethod(Request::METHOD_DELETE);
        $this->expectException(BadRequestHttpException::class);
        $deviceConverter->apply($request, new ParamConverter([], Device::class));
    }

    public function testApplyPost(): void
    {
        $security = $this->createMock(Security::class);
        $security->method('getUser')
            ->willReturn(new User());
        $csrfTokenManager = $this->createMock(CsrfTokenManagerInterface::class);
        $csrfTokenManager->method('isTokenValid')
            ->willReturn(true);
        $deviceConverter = new DeviceConverter(
            $security,
            $this->createMock(DeviceRepository::class),
            $csrfTokenManager,
        );
        $request = new Request([], [
            'csrf' => 'token',
            'mac_address' => 'mac_address',
        ]);
        $request->setMethod(Request::METHOD_POST);
        $this->assertTrue($deviceConverter->apply($request, new ParamConverter(['name' => 'device'], Device::class)));
    }

    public function testSupports(): void
    {
        $deviceConverter = new DeviceConverter(
            $this->createMock(Security::class),
            $this->createMock(DeviceRepository::class),
            new CsrfTokenManager(),
        );
        $this->assertTrue($deviceConverter->supports(new ParamConverter([], Device::class)));
    }
}
