<?php

declare(strict_types=1);

namespace Tests\Controller;

use App\Repository\UserRepository;
use App\Test\WebTestCase;

final class FriendsControllerTest extends WebTestCase
{
    public function testFetchFriends(): void
    {
        $this->client->loginUser(static::getContainer()->get(UserRepository::class)->find(1));
        $this->client->request('GET', '/api/friends');
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());
        $this->assertEquals(
            '[{"id":2,"username":"test2","full_name":"Test User2"}]',
            $this->client->getResponse()->getContent(),
        );
    }

    public function testFetchFriend(): void
    {
        $this->client->loginUser(static::getContainer()->get(UserRepository::class)->find(1));
        $this->client->request('GET', '/api/friends/2');
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());
        $this->assertEquals(
            '{"id":2,"username":"test2","full_name":"Test User2"}',
            $this->client->getResponse()->getContent(),
        );
    }

    public function testFetchFriendNotFound(): void
    {
        $this->client->loginUser(static::getContainer()->get(UserRepository::class)->find(1));
        // user 1 is not his own friend
        $this->client->request('GET', '/api/friends/1');
        $this->assertEquals(404, $this->client->getResponse()->getStatusCode());
    }

    public function testFetchFriendDoesNotExist(): void
    {
        $this->client->loginUser(static::getContainer()->get(UserRepository::class)->find(1));
        // user 99 doesn't exist
        $this->client->request('GET', '/api/friends/99');
        $this->assertEquals(404, $this->client->getResponse()->getStatusCode());
    }

    public function testAddFriendNotFound(): void
    {
        $this->client->loginUser(static::getContainer()->get(UserRepository::class)->find(1));
        $this->client->request('POST', '/api/friends', [], [], [], json_encode(['username' => 'abc']));
        $this->assertEquals(404, $this->client->getResponse()->getStatusCode());
    }

    public function testAddFriend(): void
    {
        $this->client->loginUser(static::getContainer()->get(UserRepository::class)->find(1));
        $this->client->request('POST', '/api/friends', [], [], [], json_encode(['username' => 'test3']));
        $this->assertEquals(201, $this->client->getResponse()->getStatusCode());
    }

    public function testAddFriendBadRequest(): void
    {
        $this->client->loginUser(static::getContainer()->get(UserRepository::class)->find(1));
        $this->client->request('POST', '/api/friends');
        $this->assertEquals(400, $this->client->getResponse()->getStatusCode());
    }

    public function testDeleteFriend(): void
    {
        $this->client->loginUser(static::getContainer()->get(UserRepository::class)->find(1));
        $this->client->request('DELETE', '/api/friends/2');
        $this->assertEquals(204, $this->client->getResponse()->getStatusCode());
    }
}
