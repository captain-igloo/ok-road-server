<?php

declare(strict_types=1);

namespace Tests\Controller;

use App\Test\WebTestCase;

final class SecurityControllerTest extends WebTestCase
{
    public function testLogin(): void
    {
        $this->client->request('GET', '/login');
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());
    }

    public function testLogout(): void
    {
        $this->client->request('GET', '/logout');
        $this->assertEquals(302, $this->client->getResponse()->getStatusCode());
    }
}
