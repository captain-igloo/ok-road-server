<?php
declare(strict_types=1);

namespace App\Tests\Controller;

use App\Repository\UserRepository;
use App\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Request;

final class DeviceControllerTest extends WebTestCase
{
    public function testGetDevices(): void
    {
        $this->client->loginUser(static::getContainer()->get(UserRepository::class)->find(1));
        $this->client->request(Request::METHOD_GET, '/api/v1/devices');
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());
        $this->assertEquals('[{"id":1,"mac_address":"abc"}]', $this->client->getResponse()->getContent());
    }

    public function testGetDevicesByMacAddress(): void
    {
        $this->client->loginUser(static::getContainer()->get(UserRepository::class)->find(1));
        $this->client->request(Request::METHOD_GET, '/api/v1/devices?mac_address=abc');
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());
        $this->assertEquals('[{"id":1,"mac_address":"abc"}]', $this->client->getResponse()->getContent());
    }

    public function testGetDevice(): void
    {
        $this->client->loginUser(static::getContainer()->get(UserRepository::class)->find(1));
        $this->client->request(Request::METHOD_GET, '/api/v1/devices/1');
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());
        $this->assertEquals('{"id":1,"mac_address":"abc"}', $this->client->getResponse()->getContent());
    }

    public function testCreateDevice(): void
    {
        $tokenStorage = static::getContainer()->get('security.csrf.token_storage');
        $tokenStorage->setToken('ok-road', 'token');
        $this->client->loginUser(static::getContainer()->get(UserRepository::class)->find(1));
        $this->client->request(Request::METHOD_POST, '/api/v1/devices', [
            'mac_address' => 'abc',
            'csrf' => 'token',
        ]);
        $this->assertEquals(201, $this->client->getResponse()->getStatusCode());
        $this->assertEquals('/api/v1/devices/2', $this->client->getResponse()->headers->get('Location'));
    }

    public function testCreateRequiresCsrfToken(): void
    {
        $this->client->loginUser(static::getContainer()->get(UserRepository::class)->find(1));
        $this->client->request(Request::METHOD_POST, '/api/v1/devices', [
            'mac_address' => 'abc',
        ]);
        $this->assertEquals(403, $this->client->getResponse()->getStatusCode());
    }
}
