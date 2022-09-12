<?php

declare(strict_types=1);

namespace App\Tests\Controller;

use App\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Request;

final class SecurityControllerTest extends WebTestCase
{
    public function testRegister(): void
    {
        $this->client->request(Request::METHOD_GET, '/register');
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());
    }

    /* public function testCreateUser(): void
    {
        $tokenStorage = static::getContainer()->get('security.csrf.token_storage');
        $tokenStorage->setToken('ok-road', 'token');
        $this->client->request(Request::METHOD_POST, '/register', [
            'csrf' => 'token',
            'email' => 'test@example.com',
            'password' => 'secret',
        ]);
        $this->assertEquals(201, $this->client->getResponse()->getStatusCode());
        // $this->assertEquals('/api/v1/users/2', $this->client->getResponse()->headers->get('Location'));
    }*/
}
