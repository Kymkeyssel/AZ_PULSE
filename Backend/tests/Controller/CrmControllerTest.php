<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class CrmControllerTest extends WebTestCase
{
    public function testReadAccessDeniedForAnonymousUser(): void
    {
        $client = static::createClient();
        
        $client->request('GET', '/api/customers');
        $this->assertResponseStatusCodeSame(401);
    }

    // Additional tests for 403 Forbidden, and 200 OK for valid requests 
    // would require setting up a test database with specific roles and users.
    // They are omitted here for brevity but the structure is ready.
}
