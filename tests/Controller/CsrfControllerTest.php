<?php

declare(strict_types=1);

namespace App\Tests\Controller;

use App\Test\WebTestCase;

final class CsrfControllerTest extends WebTestCase
{
    public function testCsrfToken(): void
    {
        $this->client->request('GET', '/api/v1/csrf-token');
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());
    }
}
