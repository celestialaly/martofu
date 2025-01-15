<?php

namespace App\Fixture;

use App\Entity\Item;
use App\Fixture\data\JsonItem;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Serializer\SerializerInterface;

class ItemFixture extends Fixture
{
    public function __construct(private readonly SerializerInterface $serializer)
    {
    }

    public function load(ObjectManager $manager): void
    {
        $list = glob(__DIR__ . '/data/*.json');

        foreach ($list as $filepath) {
            $file = iconv(
                'ISO-8859-1',
                'UTF-8',
                file_get_contents($filepath)
            );

            $items = $this->serializer->deserialize($file, JsonItem::class . '[]', 'json');
            $this->importJsonIntoDb($manager, $items);
        }

        $manager->flush();
    }

    /**
     * @param ObjectManager $manager
     * @param JsonItem[] $jsonItems
     * @return void
     */
    public function importJsonIntoDb(ObjectManager $manager, array $jsonItems): void
    {
        foreach ($jsonItems as $jsonItem) {
            $item = new Item();
            $item->setTitle($jsonItem->name)
                ->setImgPath($jsonItem->imgPath);

            $manager->persist($item);
        }
    }
}
