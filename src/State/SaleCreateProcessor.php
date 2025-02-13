<?php

namespace App\State;

use ApiPlatform\Doctrine\Common\State\PersistProcessor;
use ApiPlatform\Metadata\DeleteOperationInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Dto\SaleCreateDto;
use App\Dto\SaleUpdateDto;
use App\Entity\Sale;
use App\Repository\SaleRepository;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

/**
 * @implements ProcessorInterface<SaleCreateProcessor, Sale>
 */
readonly class SaleCreateProcessor implements ProcessorInterface {
    public function __construct(
        #[Autowire(service: PersistProcessor::class)] private ProcessorInterface $persistProcessor
    )
    {
    }

    /**
     * @param SaleCreateDto $data
     *
     * @throws NotFoundHttpException
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): Sale
    {
        $sale = new Sale();

        $sale->setQuantity($data->quantity)
            ->setPrice($data->price)
            ->setSellPrice($data->sellPrice)
            ->setTaxPrice($data->taxPrice)
            ->setSold($data->sold)
            ->setItem($data->item);

        $this->persistProcessor->process($sale, $operation, $uriVariables, $context);

        return $sale;
    }
}
