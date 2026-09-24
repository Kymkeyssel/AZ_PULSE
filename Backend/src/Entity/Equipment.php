<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'equipments')]
class Equipment
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 255)]
    private ?string $name = null;

    #[ORM\Column(type: 'string', length: 100)]
    private ?string $type = null; // LAPTOP, MONITOR, SERVER, PHONE

    #[ORM\Column(type: 'string', length: 100, nullable: true)]
    private ?string $serialNumber = null;

    #[ORM\Column(type: 'string', length: 50)]
    private ?string $status = 'ACTIVE'; // ACTIVE, MAINTENANCE, RETIRED, LOST

    #[ORM\ManyToOne(targetEntity: User::class)]
    private ?User $assignedTo = null;

    #[ORM\Column(type: 'datetime')]
    private ?\DateTimeInterface $purchasedAt = null;

    public function __construct()
    {
        $this->purchasedAt = new \DateTime();
    }

    // Getters and Setters
    public function getId(): ?int { return $this->id; }
    public function getName(): ?string { return $this->name; }
    public function setName(string $name): self { $this->name = $name; return $this; }
    public function getType(): ?string { return $this->type; }
    public function setType(string $type): self { $this->type = $type; return $this; }
    public function getSerialNumber(): ?string { return $this->serialNumber; }
    public function setSerialNumber(?string $serialNumber): self { $this->serialNumber = $serialNumber; return $this; }
    public function getStatus(): ?string { return $this->status; }
    public function setStatus(string $status): self { $this->status = $status; return $this; }
    public function getAssignedTo(): ?User { return $this->assignedTo; }
    public function setAssignedTo(?User $assignedTo): self { $this->assignedTo = $assignedTo; return $this; }
    public function getPurchasedAt(): ?\DateTimeInterface { return $this->purchasedAt; }
    public function setPurchasedAt(\DateTimeInterface $purchasedAt): self { $this->purchasedAt = $purchasedAt; return $this; }
}
