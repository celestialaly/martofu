<?php

namespace App\Story;

use App\Factory\UserFactory;
use App\Tests\UserTest;
use Zenstruck\Foundry\Story;

final class DefaultUsersStory extends Story
{
    public function build(): void
    {
        UserFactory::createOne([
            'email' => UserTest::DEFAULT_USER,
            'password' => UserTest::DEFAULT_PASSWORD
        ]);

        UserFactory::createMany(3);
    }
}
