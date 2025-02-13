<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Dto\SaleCreateDto;
use App\Dto\SaleUpdateDto;
use App\Repository\SaleRepository;
use App\State\SaleCreateProcessor;
use App\State\SaleUpdateProcessor;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: SaleRepository::class)]
#[ApiResource(
    operations: [
        new Get(),
        new GetCollection(),
        new Post(normalizationContext: ['groups' => ['sale:write']], input: SaleCreateDto::class, processor: SaleCreateProcessor::class),
        new Put(normalizationContext: ['groups' => ['sale:write']], input: SaleUpdateDto::class, processor: SaleUpdateProcessor::class),
        new Delete(),
    ],
    normalizationContext: ['groups' => ['sale:read']],
    order: ['id' => 'desc']
)]
#[ApiFilter(OrderFilter::class, properties: ['item.title', 'price', 'sellPrice', 'taxPrice', 'sold'], arguments: ['orderParameterName' => 'order'])]
#[ApiFilter(SearchFilter::class, properties: ['item.title' => 'partial'])]
class Sale
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['sale:read'])]
    private ?int $id = null;

    #[ORM\Column(type: Types::SMALLINT)]
    #[Groups(['sale:read', 'sale:write'])]
    private ?int $quantity = 1;

    #[ORM\Column]
    #[Groups(['sale:read', 'sale:write'])]
    private ?int $price = 0;

    #[ORM\Column(nullable: false)]
    #[Groups(['sale:read', 'sale:write'])]
    private ?int $sellPrice = 0;

    #[ORM\Column(nullable: false)]
    #[Groups(['sale:read', 'sale:write'])]
    private ?int $taxPrice = 0;

    #[ORM\Column]
    #[Groups(['sale:read', 'sale:write'])]
    private ?bool $sold = false;

    #[ORM\Column]
    #[Gedmo\Timestampable]
    #[Groups(['sale:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    #[Gedmo\Timestampable]
    #[Groups(['sale:read'])]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['sale:read', 'sale:write'])]
    private ?Item $item = null;

    #[ORM\ManyToOne(inversedBy: 'sales')]
    #[ORM\JoinColumn(nullable: false)]
    #[Gedmo\Blameable]
    private ?User $user = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable;
        $this->updatedAt = new \DateTimeImmutable;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): static
    {
        $this->quantity = $quantity;

        return $this;
    }

    public function getPrice(): ?int
    {
        return $this->price;
    }

    public function setPrice(int $price): static
    {
        $this->price = $price;

        return $this;
    }

    public function getSellPrice(): ?int
    {
        return $this->sellPrice;
    }

    public function setSellPrice(?int $sellPrice): static
    {
        $this->sellPrice = $sellPrice;

        return $this;
    }

    public function getItem(): ?Item
    {
        return $this->item;
    }

    public function setItem(?Item $item): static
    {
        $this->item = $item;

        return $this;
    }

    public function getTaxPrice(): ?int
    {
        return $this->taxPrice;
    }

    public function setTaxPrice(?int $taxPrice): static
    {
        $this->taxPrice = $taxPrice;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function isSold(): ?bool
    {
        return $this->sold;
    }

    public function setSold(bool $sold): static
    {
        $this->sold = $sold;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }
}
