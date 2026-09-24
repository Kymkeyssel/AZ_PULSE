<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity]
#[ORM\Table(name: 'opportunities')]
class Opportunity
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 255)]
    private ?string $title = null;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2, nullable: true)]
    private ?string $amount = null;

    #[ORM\Column(type: 'string', length: 50)]
    private ?string $stage = 'PROSPECTING'; // PROSPECTING, QUALIFICATION, PROPOSAL, NEGOTIATION, WON, LOST

    #[ORM\Column(type: 'integer')]
    private ?int $probability = 0; // 0 to 100

    #[ORM\ManyToOne(targetEntity: Customer::class, inversedBy: 'opportunities')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Customer $customer = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'opportunities')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $owner = null;

    #[ORM\OneToMany(mappedBy: 'opportunity', targetEntity: Activity::class, cascade: ['persist', 'remove'])]
    private Collection $activities;

    #[ORM\Column(type: 'datetime')]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTimeInterface $closedAt = null;

    public function __construct()
    {
        $this->activities = new ArrayCollection();
        $this->createdAt = new \DateTime();
    }

    // Getters and Setters
    public function getId(): ?int { return $this->id; }
    
    public function getTitle(): ?string { return $this->title; }
    public function setTitle(string $title): self { $this->title = $title; return $this; }
    
    public function getAmount(): ?string { return $this->amount; }
    public function setAmount(?string $amount): self { $this->amount = $amount; return $this; }
    
    public function getStage(): ?string { return $this->stage; }
    public function setStage(string $stage): self { $this->stage = $stage; return $this; }
    
    public function getProbability(): ?int { return $this->probability; }
    public function setProbability(int $probability): self { $this->probability = $probability; return $this; }
    
    public function getCustomer(): ?Customer { return $this->customer; }
    public function setCustomer(?Customer $customer): self { $this->customer = $customer; return $this; }

    public function getOwner(): ?User { return $this->owner; }
    public function setOwner(?User $owner): self { $this->owner = $owner; return $this; }

    public function getActivities(): Collection { return $this->activities; }

    public function getCreatedAt(): ?\DateTimeInterface { return $this->createdAt; }
    
    public function getClosedAt(): ?\DateTimeInterface { return $this->closedAt; }
    public function setClosedAt(?\DateTimeInterface $closedAt): self { $this->closedAt = $closedAt; return $this; }
}
