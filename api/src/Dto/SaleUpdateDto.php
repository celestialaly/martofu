<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

final class SaleUpdateDto {
    #[Assert\Range(min: 1)]
    public int $quantity;

    #[Assert\Range(min: 1)]
    public int $price;

    #[Assert\Range(min: 1)]
    public int $sellPrice = 1;

    #[Assert\Range(min: 1)]
    public int $taxPrice = 1;

    public ?bool $sold;
}
