<?php

declare(strict_types=1);

namespace Tests\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Test\WebTestCase;

final class ApiControllerTest extends WebTestCase
{
    public function testFetchLocations(): void
    {
        $this->client->loginUser(static::getContainer()->get(UserRepository::class)->find(1));
        $this->client->request(
            'GET',
            '/api/locations?device=my-device&from=2024-07-16 00:00:00&to=2024-07-17 00:00:00',
        );
        $this->assertEquals(
            '[{"timestamp":1721088000,"id":1,"location":{"srid":4326,"x":174,"y":-40},"accuracy":100,"speed":100}]',
            $this->client->getResponse()->getContent(),
        );
    }

    public function testFetchDevices(): void
    {
        $this->client->loginUser(static::getContainer()->get(UserRepository::class)->find(1));
        $this->client->request('GET', '/api/devices');
        $this->assertEquals(
            '[{"id":1,"name":"my-device","description":"My Device"}]',
            $this->client->getResponse()->getContent(),
        );
    }
}
