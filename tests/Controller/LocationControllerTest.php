<?php

declare(strict_types=1);

namespace App\Tests\Controller;

use App\Repository\UserRepository;
use App\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Request;

final class LocationControllerTest extends WebTestCase
{
    public function testGetLocations(): void
    {
        $this->client->loginUser(static::getContainer()->get(UserRepository::class)->find(1));
        $this->client->request(Request::METHOD_GET, '/api/v1/devices/1/locations');
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());
        $this->assertEquals(
            '[{"id":1,"accuracy":99.0,"speed":99.0,"time":"2022-07-31T00:00:00+00:00","location":{"srid":4326,"x":174.0,"y":-40.0}}]',
            $this->client->getResponse()->getContent(),
        );
    }

    public function testGetLocation(): void
    {
        $this->client->loginUser(static::getContainer()->get(UserRepository::class)->find(1));
        $this->client->request(Request::METHOD_GET, '/api/v1/devices/1/locations/1');
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());
    }

    public function testCreateLocation(): void
    {
        $tokenStorage = static::getContainer()->get('security.csrf.token_storage');
        $tokenStorage->setToken('ok-road', 'token');
        $this->client->loginUser(static::getContainer()->get(UserRepository::class)->find(1));
        $this->client->request(Request::METHOD_POST, '/api/v1/devices/1/locations', [
            'accuracy' => 321,
            'csrf' => 'token',
            'date_time' => '2022-08-01 00:00:00',
            'latitude' => -40,
            'longitude' => 174,
            'speed' => 123,
        ]);
        $this->assertEquals(201, $this->client->getResponse()->getStatusCode());
        $this->assertEquals('/api/v1/devices/1/locations/2', $this->client->getResponse()->headers->get('Location'));
    }

    public function testCreateLocationRequiresCsrf(): void
    {
        $this->client->loginUser(static::getContainer()->get(UserRepository::class)->find(1));
        $this->client->request(Request::METHOD_POST, '/api/v1/devices/1/locations', [
            'accuracy' => 321,
            'csrf' => 'token',
            'date_time' => '2022-08-01 00:00:00',
            'latitude' => -40,
            'longitude' => 174,
            'speed' => 123,
        ]);
        $this->assertEquals(403, $this->client->getResponse()->getStatusCode());
    }
}
