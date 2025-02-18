<?php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;

class AuthApiTestCase extends ApiTestCase
{
    protected function authToken(): string
    {
        $response = static::createClient()->request('POST', '/api/auth', ['json' => [
            'email' => UserTest::DEFAULT_USER,
            'password' => UserTest::DEFAULT_PASSWORD
        ]]);

        $json = $response->toArray();

        return $json['token'];
    }
}
