<?php

namespace App\Command;

use App\Entity\Item;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Helper\ProgressBar;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

#[AsCommand(
    name: 'app:dofusdb:retrieve-items',
    description: 'Populate items from DofusDB API'
)]
class RetrieveDofusDBDataCommand extends Command
{
    const DOFUSDB_API = 'https://api.dofusdb.fr';
    const MAXIMUM_LIMIT = 50;

    const ITEM_ENDPOINT = '/items';
    const BASE_ITEM_ENDPOINT = self::DOFUSDB_API . self::ITEM_ENDPOINT . '?$limit=' . self::MAXIMUM_LIMIT . '&isSaleable=true';

    public function __construct(
        private readonly HttpClientInterface $client,
        private readonly EntityManagerInterface $entityManager
    )
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $this->entityManager->getConnection()->getConfiguration()
            ->setMiddlewares([new \Doctrine\DBAL\Logging\Middleware(new \Psr\Log\NullLogger())]);

        // retrieve stored items
        $dbItems = $this->entityManager->getRepository(Item::class)->getAllWithTitleOnly();

        $response = $this->client->request(
            'GET',
            self::BASE_ITEM_ENDPOINT
        );

        $data = json_decode($response->getContent(), true);

        // total elements in the database
        $totalApiElements = $data['total'];

        $output->writeln(sprintf('Processing %s items from DofusDB API', $totalApiElements));
        $progressBar = new ProgressBar($output, $totalApiElements);
        $progressBar->setFormat('debug');
        $progressBar->start();

        // process each page
        $i = 0;
        do {
            $response = $this->client->request(
                'GET',
                self::BASE_ITEM_ENDPOINT . '&$skip=' . $i
            );

            $data = json_decode($response->getContent(), true);

            // upsert data into our database
            foreach ($data['data'] as $item) {
                $title = $item['name']['fr'];
                $slug = $item['slug']['fr'];

                if (!in_array($title, $dbItems)) {
                    $this->addItem($title, $item['img'], $slug);
                } else {
                    $this->updateItem($title, $item['slug']['fr']);
                }

                $progressBar->advance();
            }

            $this->entityManager->flush();
            $this->entityManager->clear();

            $i += self::MAXIMUM_LIMIT;
            usleep(500);
        } while ($i < $totalApiElements);

        $progressBar->finish();
        $output->writeln('');

        return Command::SUCCESS;
    }

    protected function addItem(string $title, string $imgPath, string $slug): void
    {
        $item = new Item();

        $item->setTitle($title)
            ->setImgPath($imgPath)
            ->setSlug($slug);

        $this->entityManager->persist($item);
    }

    protected function updateItem(string $title, string $slug): mixed
    {
        return $this->entityManager->createQueryBuilder()
            ->update(Item::class, 'i')
            ->set('i.slug', ':slug')
            ->setParameter('slug', $slug)
            ->andWhere('i.title = :title')
            ->setParameter('title', $title)
            ->getQuery()
            ->execute();
    }
}
