<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity]
#[ORM\Table(name: 'customers')]
class Customer
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 255)]
    private ?string $name = null;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $email = null;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $phone = null;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $industry = null;

    #[ORM\Column(type: 'string', length: 50)]
    private ?string $status = 'PROSPECT'; // PROSPECT, CLIENT

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'customers')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $owner = null;

    #[ORM\OneToMany(mappedBy: 'customer', targetEntity: Opportunity::class, cascade: ['persist', 'remove'])]
    private Collection $opportunities;

    #[ORM\OneToMany(mappedBy: 'customer', targetEntity: Activity::class, cascade: ['persist', 'remove'])]
    private Collection $activities;

    #[ORM\Column(type: 'datetime')]
    private ?\DateTimeInterface $createdAt = null;

    public function __construct()
    {
        $this->opportunities = new ArrayCollection();
        $this->activities = new ArrayCollection();
        $this->createdAt = new \DateTime();
    }

    // Getters and Setters
    public function getId(): ?int { return $this->id; }
    public function getName(): ?string { return $this->name; }
    public function setName(string $name): self { $this->name = $name; return $this; }
    public function getEmail(): ?string { return $this->email; }
    public function setEmail(?string $email): self { $this->email = $email; return $this; }
    public function getPhone(): ?string { return $this->phone; }
    public function setPhone(?string $phone): self { $this->phone = $phone; return $this; }
    public function getIndustry(): ?string { return $this->industry; }
    public function setIndustry(?string $industry): self { $this->industry = $industry; return $this; }
    
    public function getStatus(): ?string { return $this->status; }
    public function setStatus(string $status): self { $this->status = $status; return $this; }

    public function getOwner(): ?User { return $this->owner; }
    public function setOwner(?User $owner): self { $this->owner = $owner; return $this; }

    public function getOpportunities(): Collection { return $this->opportunities; }
    public function getActivities(): Collection { return $this->activities; }
    
    public function getCreatedAt(): ?\DateTimeInterface { return $this->createdAt; }
}
