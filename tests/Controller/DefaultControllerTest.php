<?php

declare(strict_types=1);

namespace Tests\Controller;

use App\Repository\UserRepository;
use App\Test\WebTestCase;

final class DefaultControllerTest extends WebTestCase
{
    public function testMap(): void
    {
        $this->client->loginUser(static::getContainer()->get(UserRepository::class)->find(1));
        $this->client->request('GET', '/map');
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());
    }
}
