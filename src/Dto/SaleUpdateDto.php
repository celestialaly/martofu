<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

final class SaleUpdateDto {
    #[Assert\Range(min: 1)]
    public int $quantity;

    #[Assert\Range(min: 0)]
    public int $price = 0;

    #[Assert\Range(min: 1)]
    public int $sellPrice = 1;

    #[Assert\Range(min: 0)]
    public float $taxPrice = 0;

    public ?bool $sold;
}
