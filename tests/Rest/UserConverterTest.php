<?php
declare(strict_types=1);

namespace App\Tests\Rest;

use App\Entity\User;
use App\Rest\UserConverter;
use PHPUnit\Framework\TestCase;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasher;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class UserConverterTest extends TestCase
{
    public function testApply(): void
    {
        $userConverter = new UserConverter($this->createMock(UserPasswordHasher::class));
        $request = new Request();
        $request->setMethod(Request::METHOD_POST);
        $request->request->set('email', 'test@example.com');
        $request->request->set('password', 'secret');
        $this->assertTrue($userConverter->apply($request, new ParamConverter(['name' => 'user'], User::class)));
        $this->assertInstanceOf(User::class, $request->attributes->get('user'));
    }

    public function testApplyBadRequest(): void
    {
        $userConverter = new UserConverter($this->createMock(UserPasswordHasherInterface::class));
        $this->expectException(BadRequestHttpException::class);
        $userConverter->apply(new Request(), new ParamConverter(['name' => 'user'], User::class));
    }

    public function testSupports(): void
    {
        $userConverter = new UserConverter($this->createMock(UserPasswordHasherInterface::class));
        $this->assertTrue($userConverter->supports(new ParamConverter([], User::class)));
    }
}
