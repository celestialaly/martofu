<?php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class UserTest extends ApiTestCase
{
    use ResetDatabase, Factories;

    const DEFAULT_USER = 'test@martofu.fr';
    const DEFAULT_PASSWORD = 'test';

    public function testRegister()
    {
        $email = 'testcreate@martofu.fr';

        static::createClient()->request('POST', '/api/register', ['json' => [
            'email' => $email,
            'plainPassword' => self::DEFAULT_PASSWORD
        ]]);

        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $this->assertJsonContains([
            '@context' => '/api/contexts/User',
            '@type' => 'User',
            'email' => $email
        ]);
    }

    public function testAuth()
    {
        $this->testRegister();

        $response = static::createClient()->request('POST', '/api/auth', ['json' => [
            'email' => self::DEFAULT_USER,
            'password' => self::DEFAULT_PASSWORD
        ]]);

        $this->assertResponseStatusCodeSame(200);

        $data = json_decode($response->getContent(), true);
        $this->assertArrayHasKey('token', $data);
    }
}
