<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'incidents')]
class Incident
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 255)]
    private ?string $title = null;

    #[ORM\Column(type: 'text')]
    private ?string $description = null;

    #[ORM\Column(type: 'string', length: 50)]
    private ?string $status = 'OPEN'; // OPEN, IN_PROGRESS, RESOLVED, CLOSED

    #[ORM\Column(type: 'string', length: 50)]
    private ?string $priority = 'MEDIUM'; // LOW, MEDIUM, HIGH, CRITICAL

    #[ORM\Column(type: 'string', length: 100, nullable: true)]
    private ?string $category = null; // HARDWARE, SOFTWARE, NETWORK, OTHER

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $reporter = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    private ?User $assignee = null;

    #[ORM\Column(type: 'datetime')]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTimeInterface $resolvedAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
    }

    // Getters and Setters
    public function getId(): ?int { return $this->id; }
    public function getTitle(): ?string { return $this->title; }
    public function setTitle(string $title): self { $this->title = $title; return $this; }
    public function getDescription(): ?string { return $this->description; }
    public function setDescription(string $description): self { $this->description = $description; return $this; }
    public function getStatus(): ?string { return $this->status; }
    public function setStatus(string $status): self { $this->status = $status; return $this; }
    public function getPriority(): ?string { return $this->priority; }
    public function setPriority(string $priority): self { $this->priority = $priority; return $this; }
    public function getCategory(): ?string { return $this->category; }
    public function setCategory(?string $category): self { $this->category = $category; return $this; }
    public function getReporter(): ?User { return $this->reporter; }
    public function setReporter(?User $reporter): self { $this->reporter = $reporter; return $this; }
    public function getAssignee(): ?User { return $this->assignee; }
    public function setAssignee(?User $assignee): self { $this->assignee = $assignee; return $this; }
    public function getCreatedAt(): ?\DateTimeInterface { return $this->createdAt; }
    public function getResolvedAt(): ?\DateTimeInterface { return $this->resolvedAt; }
    public function setResolvedAt(?\DateTimeInterface $resolvedAt): self { $this->resolvedAt = $resolvedAt; return $this; }
}
