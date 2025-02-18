<?php

namespace App\Factory;

use App\Entity\Sale;
use Zenstruck\Foundry\Persistence\PersistentProxyObjectFactory;

/**
 * @extends PersistentProxyObjectFactory<Sale>
 */
final class SaleFactory extends PersistentProxyObjectFactory
{
    public static function class(): string
    {
        return Sale::class;
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#model-factories
     */
    protected function defaults(): array|callable
    {
        return [
            'createdAt' => \DateTimeImmutable::createFromMutable(self::faker()->dateTime()),
            'item' => ItemFactory::new(),
            'price' => self::faker()->numberBetween(100000, 1000000),
            'quantity' => self::faker()->numberBetween(1, 20),
            'sellPrice' => self::faker()->numberBetween(1100000, 2000000),
            'sold' => self::faker()->boolean(),
            'taxPrice' => self::faker()->randomNumber(),
            'updatedAt' => \DateTimeImmutable::createFromMutable(self::faker()->dateTime()),
            'user' => UserFactory::new(),
        ];
    }
}
