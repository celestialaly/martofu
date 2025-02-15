<?php

namespace App\Dto;

use App\Entity\Item;
use Symfony\Component\Validator\Constraints as Assert;

final class SaleCreateDto {
    #[Assert\Range(min: 1)]
    public int $quantity;

    #[Assert\Range(min: 1)]
    public int $price;

    #[Assert\Range(min: 1)]
    public int $sellPrice = 1;

    #[Assert\Range(min: 1)]
    public float $taxPrice = 1;

    public ?bool $sold = false;

    #[Assert\NotNull]
    public Item $item;
}
