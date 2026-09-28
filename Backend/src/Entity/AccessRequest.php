<?php

namespace App\Entity;

use App\Repository\AccessRequestRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: AccessRequestRepository::class)]
#[ORM\Table(name: 'access_requests')]
#[ORM\HasLifecycleCallbacks]
class AccessRequest
{
    public const STATUS_PENDING = 'PENDING';
    public const STATUS_APPROVED = 'APPROVED';
    public const STATUS_REJECTED = 'REJECTED';

    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    private Uuid $id;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'accessRequests')]
    #[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private User $user;

    #[ORM\Column(type: 'string', length: 100)]
    private string $requestedDomain;

    #[ORM\Column(type: 'text')]
    private string $motivation;

    /**
     * Spécialisation attendue par le demandeur (ex. COMMERCIAL, FORMATEUR).
     *
     * Purement indicative : le demandeur expresses un besoin, il ne s'attribue
     * aucun droit. La valeur décisive reste assignedProfile, arbitrée par
     * l'administrateur lors de l'approbation.
     */
    #[ORM\Column(type: 'string', length: 50, nullable: true)]
    private ?string $requestedProfile = null;

    /**
     * Spécialisation effectivement retenue par l'administrateur.
     */
    #[ORM\Column(type: 'string', length: 50, nullable: true)]
    private ?string $assignedProfile = null;

    #[ORM\Column(type: 'string', length: 30)]
    private string $status = self::STATUS_PENDING;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $rejectionReason = null;

    #[ORM\ManyToOne(targetEntity: Role::class)]
    #[ORM\JoinColumn(name: 'assigned_role_id', referencedColumnName: 'id', nullable: true, onDelete: 'SET NULL')]
    private ?Role $assignedRole = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'processed_by_id', referencedColumnName: 'id', nullable: true, onDelete: 'SET NULL')]
    private ?User $processedBy = null;

    #[ORM\Column(type: 'datetime_immutable', nullable: true)]
    private ?\DateTimeImmutable $processedAt = null;

    #[ORM\Column(type: 'datetime_immutable')]
    private \DateTimeImmutable $createdAt;

    #[ORM\Column(type: 'datetime_immutable')]
    private \DateTimeImmutable $updatedAt;

    public function __construct()
    {
        $this->id = Uuid::v7();
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    #[ORM\PreUpdate]
    public function setUpdatedAtValue(): void
    {
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function getId(): Uuid
    {
        return $this->id;
    }

    public function getUser(): User
    {
        return $this->user;
    }

    public function setUser(User $user): self
    {
        $this->user = $user;
        return $this;
    }

    public function getRequestedDomain(): string
    {
        return $this->requestedDomain;
    }

    public function setRequestedDomain(string $requestedDomain): self
    {
        $this->requestedDomain = $requestedDomain;
        return $this;
    }

    public function getMotivation(): string
    {
        return $this->motivation;
    }

    public function setMotivation(string $motivation): self
    {
        $this->motivation = $motivation;
        return $this;
    }

    public function getRequestedProfile(): ?string
    {
        return $this->requestedProfile;
    }

    public function setRequestedProfile(?string $requestedProfile): self
    {
        $this->requestedProfile = $requestedProfile !== null
            ? strtoupper(trim($requestedProfile))
            : null;

        return $this;
    }

    public function getAssignedProfile(): ?string
    {
        return $this->assignedProfile;
    }

    public function setAssignedProfile(?string $assignedProfile): self
    {
        $this->assignedProfile = $assignedProfile !== null
            ? strtoupper(trim($assignedProfile))
            : null;

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

    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function getRejectionReason(): ?string
    {
        return $this->rejectionReason;
    }

    public function setRejectionReason(?string $rejectionReason): self
    {
        $this->rejectionReason = $rejectionReason;
        return $this;
    }

    public function getAssignedRole(): ?Role
    {
        return $this->assignedRole;
    }

    public function setAssignedRole(?Role $assignedRole): self
    {
        $this->assignedRole = $assignedRole;
        return $this;
    }

    public function getProcessedBy(): ?User
    {
        return $this->processedBy;
    }

    public function setProcessedBy(?User $processedBy): self
    {
        $this->processedBy = $processedBy;
        return $this;
    }

    public function getProcessedAt(): ?\DateTimeImmutable
    {
        return $this->processedAt;
    }

    public function setProcessedAt(?\DateTimeImmutable $processedAt): self
    {
        $this->processedAt = $processedAt;
        return $this;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): \DateTimeImmutable
    {
        return $this->updatedAt;
    }
}
