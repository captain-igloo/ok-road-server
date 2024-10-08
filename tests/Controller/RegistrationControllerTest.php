<?php

declare(strict_types=1);

namespace Tests\Controller;

use App\Repository\UserRepository;
use App\Test\WebTestCase;

final class RegistrationControllerTest extends WebTestCase
{
    public function testLoggedInUserShouldRedirect(): void
    {
        $this->client->loginUser(static::getContainer()->get(UserRepository::class)->find(1));
        $this->client->request('GET', '/register');
        $this->assertEquals(302, $this->client->getResponse()->getStatusCode());
    }

    public function testRegister(): void
    {
        $this->client->request('GET', '/register');
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());
    }
}
