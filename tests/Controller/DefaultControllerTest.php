<?php

declare(strict_types=1);

namespace App\Tests\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Test\WebTestCase;

final class DefaultControllerTest extends WebTestCase
{
    public function testMap()
    {
        $userRepository = static::getContainer()->get(UserRepository::class);
        $user = $userRepository->find(1);
        $this->client->loginUser($user);
        $this->client->request('GET', '/map');
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());
    }

    public function testLoginRequired()
    {
        $this->client->request('GET', '/map');
        $this->assertEquals(302, $this->client->getResponse()->getStatusCode());
    }
}
