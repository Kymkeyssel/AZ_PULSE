<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'activities')]
class Activity
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 100)]
    private ?string $type = null; // CALL, EMAIL, MEETING, NOTE

    #[ORM\Column(type: 'text')]
    private ?string $description = null;

    #[ORM\ManyToOne(targetEntity: Customer::class, inversedBy: 'activities')]
    #[ORM\JoinColumn(nullable: true, onDelete: 'CASCADE')]
    private ?Customer $customer = null;

    #[ORM\ManyToOne(targetEntity: Opportunity::class, inversedBy: 'activities')]
    #[ORM\JoinColumn(nullable: true, onDelete: 'CASCADE')]
    private ?Opportunity $opportunity = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'activities')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?User $author = null;

    #[ORM\Column(type: 'datetime')]
    private ?\DateTimeInterface $createdAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
    }

    // Getters and Setters
    public function getId(): ?int { return $this->id; }
    
    public function getType(): ?string { return $this->type; }
    public function setType(string $type): self { $this->type = $type; return $this; }
    
    public function getDescription(): ?string { return $this->description; }
    public function setDescription(string $description): self { $this->description = $description; return $this; }
    
    public function getCustomer(): ?Customer { return $this->customer; }
    public function setCustomer(?Customer $customer): self { $this->customer = $customer; return $this; }
    
    public function getOpportunity(): ?Opportunity { return $this->opportunity; }
    public function setOpportunity(?Opportunity $opportunity): self { $this->opportunity = $opportunity; return $this; }
    
    public function getAuthor(): ?User { return $this->author; }
    public function setAuthor(?User $author): self { $this->author = $author; return $this; }
    
    public function getCreatedAt(): ?\DateTimeInterface { return $this->createdAt; }
}
