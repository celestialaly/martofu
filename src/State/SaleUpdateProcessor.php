<?php

namespace App\State;

use ApiPlatform\Doctrine\Common\State\PersistProcessor;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Dto\SaleUpdateDto;
use App\Entity\Sale;
use App\Repository\SaleRepository;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

/**
 * @implements ProcessorInterface<SaleUpdateProcessor, Sale>
 */
readonly class SaleUpdateProcessor implements ProcessorInterface {
    public function __construct(
        private SaleRepository $saleRepository,
        #[Autowire(service: PersistProcessor::class)] private ProcessorInterface $persistProcessor
    )
    {
    }

    /**
     * @param SaleUpdateDto $data
     *
     * @throws NotFoundHttpException
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): Sale
    {
        $sale = $this->saleRepository->find($uriVariables['id']);

        if (!$sale) {
            throw new NotFoundHttpException();
        }

        $sale->setQuantity($data->quantity)
            ->setPrice($data->price)
            ->setSellPrice($data->sellPrice)
            ->setTaxPrice($data->taxPrice)
            ->setSold($data->sold);

        $this->persistProcessor->process($sale, $operation, $uriVariables, $context);

        return $sale;
    }
}
