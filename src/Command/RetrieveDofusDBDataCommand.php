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

// the name of the command is what users type after "php bin/console"
#[AsCommand(
    name: 'app:dofus-db:retrieve-items',
    description: 'Populate items from DofusDB API'
)]
class RetrieveDofusDBDataCommand extends Command
{
    const DOFUSDB_API = 'https://api.dofusdb.fr';
    const ITEM_ENDPOINT = '/items';

    const MAXIMUM_LIMIT = 50;
    const BASE_QUERY_PARAMETERS = '?$limit=' . self::MAXIMUM_LIMIT . '&isSaleable=true';

    public function __construct(
        private HttpClientInterface    $client,
        private EntityManagerInterface $entityManager
    )
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $this->entityManager->getConnection()->getConfiguration()
            ->setMiddlewares([new \Doctrine\DBAL\Logging\Middleware(new \Psr\Log\NullLogger())]);

        // retrieve stored items
        $dbItems = $this->entityManager->getRepository(Item::class)->getAllWithOnlyTitle();

        $baseItemEndpoint = self::DOFUSDB_API . self::ITEM_ENDPOINT . '?$limit=' . self::MAXIMUM_LIMIT . '&isSaleable=true';

        $response = $this->client->request(
            'GET',
            $baseItemEndpoint
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
        $persisted = 0;
        do {
            $response = $this->client->request(
                'GET',
                $baseItemEndpoint . '&$skip=' . $i
            );

            $data = json_decode($response->getContent(), true);

            foreach ($data['data'] as $item) {
                $title = $item['name']['fr'];
                if (!in_array($title, $dbItems)) {
                    $this->addItem($title, $item['img']);
                    $persisted++;
                }

                $progressBar->advance();
            }

            if ($persisted >= 50) {
                $this->entityManager->flush();
                $this->entityManager->clear();
                $persisted = 0;
            }

            $i += self::MAXIMUM_LIMIT;
            usleep(500);
        } while ($i < $totalApiElements);

        $progressBar->finish();
        $output->writeln('');

        return Command::SUCCESS;
    }

    protected function addItem(string $title, string $imgPath): void
    {
        $item = new Item();

        $item->setTitle($title)
            ->setImgPath($imgPath);

        $this->entityManager->persist($item);
    }
}
