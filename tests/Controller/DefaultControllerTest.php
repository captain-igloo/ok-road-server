<?php

declare(strict_types=1);

namespace Tests\Controller;

use App\Repository\UserRepository;
use App\Test\WebTestCase;

final class DefaultControllerTest extends WebTestCase
{
    public function testIndex(): void
    {
        $this->client->loginUser(static::getContainer()->get(UserRepository::class)->find(1));
        $this->client->request('GET', '/');
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());
    }

    public function testMap(): void
    {
        $this->client->loginUser(static::getContainer()->get(UserRepository::class)->find(1));
        $this->client->request('GET', '/map');
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());
    }

    public function test50Svg(): void
    {
        $this->client->loginUser(static::getContainer()->get(UserRepository::class)->find(1));
        $this->client->request('GET', '/img/50.svg');
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());
        $this->assertEquals(file_get_contents(__DIR__ . '/fixtures/50.svg'), $this->client->getResponse()->getContent());
    }

    public function test100Svg(): void
    {
        $this->client->loginUser(static::getContainer()->get(UserRepository::class)->find(1));
        $this->client->request('GET', '/img/100.svg');
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());
        $this->assertEquals(file_get_contents(__DIR__ . '/fixtures/100.svg'), $this->client->getResponse()->getContent());
    }
}
