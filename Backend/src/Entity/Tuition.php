<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Uuid;
use Symfony\Bridge\Doctrine\Types\UuidType;

#[ORM\Entity]
#[ORM\Table(name: 'tuitions')]
class Tuition
{
    #[ORM\Id]
    #[ORM\Column(type: UuidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    private ?Uuid $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?User $student = null;

    #[ORM\Column(type: 'float')]
    private float $totalAmount = 0;

    #[ORM\Column(type: 'float')]
    private float $remainingBalance = 0;

    #[ORM\Column(type: 'integer')]
    private int $totalTranches = 0;

    #[ORM\Column(type: 'integer')]
    private int $paidTranches = 0;

    public function getId(): ?Uuid
    {
        return $this->id;
    }

    public function getStudent(): ?User
    {
        return $this->student;
    }

    public function setStudent(?User $student): self
    {
        $this->student = $student;
        return $this;
    }

    public function getTotalAmount(): float
    {
        return $this->totalAmount;
    }

    public function setTotalAmount(float $totalAmount): self
    {
        $this->totalAmount = $totalAmount;
        return $this;
    }

    public function getRemainingBalance(): float
    {
        return $this->remainingBalance;
    }

    public function setRemainingBalance(float $remainingBalance): self
    {
        $this->remainingBalance = $remainingBalance;
        return $this;
    }

    public function getTotalTranches(): int
    {
        return $this->totalTranches;
    }

    public function setTotalTranches(int $totalTranches): self
    {
        $this->totalTranches = $totalTranches;
        return $this;
    }

    public function getPaidTranches(): int
    {
        return $this->paidTranches;
    }

    public function setPaidTranches(int $paidTranches): self
    {
        $this->paidTranches = $paidTranches;
        return $this;
    }
}
