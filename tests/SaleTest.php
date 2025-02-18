<?php

namespace App\Tests;

use App\Entity\Item;
use App\Entity\Sale;
use App\Factory\ItemFactory;
use App\Factory\SaleFactory;
use App\Factory\UserFactory;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class SaleTest extends AuthApiTestCase
{
    use ResetDatabase, Factories;

    public function testGetCollection()
    {
        SaleFactory::createMany(30, ['user' => UserFactory::first()]);
        SaleFactory::createMany(5, ['user' => UserFactory::new()]);

        static::createClient()->request('GET', '/api/sales');

        $this->assertResponseStatusCodeSame(401);

        $token = $this->authToken();
        $response = static::createClient()->request('GET', '/api/sales', ['auth_bearer' => $token]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        // Asserts that the returned JSON is a superset of this one
        $this->assertJsonContains([
            '@context' => '/api/contexts/Sale',
            '@id' => '/api/sales',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 30,
            'hydra:view' => [
                '@id' => '/api/sales?page=1',
                '@type' => 'hydra:PartialCollectionView',
                'hydra:first' => '/api/sales?page=1',
                'hydra:last' => '/api/sales?page=2',
                'hydra:next' => '/api/sales?page=2',
            ],
        ]);

        $this->assertCount(25, $response->toArray()['hydra:member']);
        $this->assertMatchesResourceCollectionJsonSchema(Sale::class);
    }

    public function testGetSale()
    {
        $sale = SaleFactory::createOne(['user' => UserFactory::first()]);
        $unauthorizedSale = SaleFactory::createOne(['user' => UserFactory::last()]);

        $token = $this->authToken();

        # assert that the user cannot access other users' sales
        static::createClient()->request('GET', '/api/sales/' . $unauthorizedSale->getId(), ['auth_bearer' => $token]);
        $this->assertResponseStatusCodeSame(404);

        static::createClient()->request('GET', '/api/sales/' . $sale->getId(), ['auth_bearer' => $token]);
        $this->assertResponseIsSuccessful();

        $this->assertMatchesResourceItemJsonSchema(Sale::class);
    }

    public function testCreateSale()
    {
        ItemFactory::createOne(['title' => 'Anneau']);

        $itemIri = $this->findIriBy(Item::class, []);
        $token = $this->authToken();

        $json = [
            'quantity' => 1,
            'price' => 10000,
            'sellPrice' => 15000,
            'taxPrice' => 300,
            'sold' => false,
            'item' => $itemIri
        ];
        $response = static::createClient()->request('POST', '/api/sales', ['auth_bearer' => $token, 'json' => $json]);

        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/api/contexts/Sale',
            '@type' => 'Sale',
            ...$json
        ]);

        $this->assertMatchesRegularExpression('~^/api/sales/\d+$~', $response->toArray()['@id']);
    }

    public function testUpdateSale()
    {
        $sale = SaleFactory::createOne(['user' => UserFactory::first()]);
        ItemFactory::createOne(['title' => 'Anneau']);

        $itemIri = $this->findIriBy(Item::class, []);
        $token = $this->authToken();

        $json = [
            'quantity' => 1,
            'price' => 10000,
            'sellPrice' => 15000,
            'taxPrice' => 300,
            'sold' => true,
            'item' => $itemIri
        ];
        $response = static::createClient()->request('PUT', '/api/sales/' . $sale->getId(), ['auth_bearer' => $token, 'json' => $json]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/api/contexts/Sale',
            '@type' => 'Sale',
            ...$json
        ]);

        $this->assertMatchesRegularExpression('~^/api/sales/\d+$~', $response->toArray()['@id']);
    }
}
