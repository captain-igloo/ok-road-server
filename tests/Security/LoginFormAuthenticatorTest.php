<?php
declare(strict_types=1);

namespace App\Tests\Security;

use App\Security\LoginFormAuthenticator;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

final class LoginFormAuthenticatorTest extends TestCase
{
    public function testAuthenticate(): void
    {
        $loginFormAuthenticator = new LoginFormAuthenticator($this->createMock(UrlGeneratorInterface::class));
        $request = new Request([], [
            'password' => 'secret',
            '_csrf_token' => 'token',
        ]);
        $request->setSession($this->createMock(SessionInterface::class));
        $passport = $loginFormAuthenticator->authenticate($request);
        // print_r($passport->getUser());
        $this->assertTrue(true);
    }
}
