<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Uuid;
use Symfony\Bridge\Doctrine\Types\UuidType;

#[ORM\Entity]
#[ORM\Table(name: 'enrollments')]
class Enrollment
{
    #[ORM\Id]
    #[ORM\Column(type: UuidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    private ?Uuid $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?User $student = null;

    #[ORM\ManyToOne(targetEntity: Promotion::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Promotion $promotion = null;

    #[ORM\Column(type: 'string', length: 50)]
    private string $status = 'ACTIVE';

    #[ORM\Column(type: 'float')]
    private float $progress = 0;

    #[ORM\Column(type: 'integer')]
    private int $validatedModules = 0;

    #[ORM\Column(type: 'integer')]
    private int $totalModules = 0;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $nextMilestone = null;

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

    public function getPromotion(): ?Promotion
    {
        return $this->promotion;
    }

    public function setPromotion(?Promotion $promotion): self
    {
        $this->promotion = $promotion;
        return $this;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;
        return $this;
    }

    public function getProgress(): float
    {
        return $this->progress;
    }

    public function setProgress(float $progress): self
    {
        $this->progress = $progress;
        return $this;
    }

    public function getValidatedModules(): int
    {
        return $this->validatedModules;
    }

    public function setValidatedModules(int $validatedModules): self
    {
        $this->validatedModules = $validatedModules;
        return $this;
    }

    public function getTotalModules(): int
    {
        return $this->totalModules;
    }

    public function setTotalModules(int $totalModules): self
    {
        $this->totalModules = $totalModules;
        return $this;
    }

    public function getNextMilestone(): ?string
    {
        return $this->nextMilestone;
    }

    public function setNextMilestone(?string $nextMilestone): self
    {
        $this->nextMilestone = $nextMilestone;
        return $this;
    }
}
