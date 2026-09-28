<?php

namespace App\Entity;

use App\Repository\ReminderRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

/**
 * Relance commerciale : une action à effectuer, datée, affectée à un collaborateur.
 *
 * Distincte de {@see Activity}, qui est un *journal* (ce qui a déjà été fait :
 * appel passé, email envoyé, note). Une Reminder est un *devoir* (ce qu'il
 * reste à faire), avec une échéance et un statut de traitement.
 *
 * Confondre les deux est l'erreur classique : l'historique ne dit jamais
 * au commercial s'il a oublié de rappeler quelqu'un.
 */
#[ORM\Entity(repositoryClass: ReminderRepository::class)]
#[ORM\Table(name: 'reminders')]
#[ORM\Index(name: 'idx_reminder_due', columns: ['status', 'due_at'])]
class Reminder
{
    public const TYPE_CALL = 'CALL';
    public const TYPE_EMAIL = 'EMAIL';
    public const TYPE_MEETING = 'MEETING';
    public const TYPE_TASK = 'TASK';

    public const STATUS_PENDING = 'PENDING';
    public const STATUS_DONE = 'DONE';
    public const STATUS_CANCELED = 'CANCELED';

    public const PRIORITY_LOW = 'LOW';
    public const PRIORITY_NORMAL = 'NORMAL';
    public const PRIORITY_HIGH = 'HIGH';

    public const TYPES = [self::TYPE_CALL, self::TYPE_EMAIL, self::TYPE_MEETING, self::TYPE_TASK];
    public const STATUSES = [self::STATUS_PENDING, self::STATUS_DONE, self::STATUS_CANCELED];
    public const PRIORITIES = [self::PRIORITY_LOW, self::PRIORITY_NORMAL, self::PRIORITY_HIGH];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 255)]
    private ?string $title = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $description = null;

    /** Appel, email, réunion ou tâche libre. */
    #[ORM\Column(type: 'string', length: 20)]
    private string $type = self::TYPE_CALL;

    #[ORM\Column(type: 'string', length: 20)]
    private string $status = self::STATUS_PENDING;

    #[ORM\Column(type: 'string', length: 10)]
    private string $priority = self::PRIORITY_NORMAL;

    /** Échéance. Base du tri « en retard / aujourd'hui / à venir ». */
    #[ORM\Column(type: 'datetime_immutable')]
    private ?\DateTimeImmutable $dueAt = null;

    #[ORM\Column(type: 'datetime_immutable', nullable: true)]
    private ?\DateTimeImmutable $completedAt = null;

    #[ORM\ManyToOne(targetEntity: Customer::class, inversedBy: 'reminders')]
    #[ORM\JoinColumn(nullable: true, onDelete: 'CASCADE')]
    private ?Customer $customer = null;

    #[ORM\ManyToOne(targetEntity: Opportunity::class, inversedBy: 'reminders')]
    #[ORM\JoinColumn(nullable: true, onDelete: 'CASCADE')]
    private ?Opportunity $opportunity = null;

    /** Qui doit exécuter la relance. */
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'reminders')]
    #[ORM\JoinColumn(nullable: true, onDelete: 'CASCADE')]
    private ?User $assignedTo = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?User $createdBy = null;

    #[ORM\Column(type: 'datetime')]
    private ?\DateTimeInterface $createdAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
    }

    public function getId(): ?int { return $this->id; }

    public function getTitle(): ?string { return $this->title; }
    public function setTitle(string $title): self { $this->title = $title; return $this; }

    public function getDescription(): ?string { return $this->description; }
    public function setDescription(?string $description): self { $this->description = $description; return $this; }

    public function getType(): string { return $this->type; }
    public function setType(string $type): self { $this->type = $type; return $this; }

    public function getStatus(): string { return $this->status; }
    public function setStatus(string $status): self { $this->status = $status; return $this; }

    public function getPriority(): string { return $this->priority; }
    public function setPriority(string $priority): self { $this->priority = $priority; return $this; }

    public function getDueAt(): ?\DateTimeImmutable { return $this->dueAt; }
    public function setDueAt(\DateTimeImmutable $dueAt): self { $this->dueAt = $dueAt; return $this; }

    public function getCompletedAt(): ?\DateTimeImmutable { return $this->completedAt; }
    public function setCompletedAt(?\DateTimeImmutable $completedAt): self { $this->completedAt = $completedAt; return $this; }

    public function getCustomer(): ?Customer { return $this->customer; }
    public function setCustomer(?Customer $customer): self { $this->customer = $customer; return $this; }

    public function getOpportunity(): ?Opportunity { return $this->opportunity; }
    public function setOpportunity(?Opportunity $opportunity): self { $this->opportunity = $opportunity; return $this; }

    public function getAssignedTo(): ?User { return $this->assignedTo; }
    public function setAssignedTo(?User $assignedTo): self { $this->assignedTo = $assignedTo; return $this; }

    public function getCreatedBy(): ?User { return $this->createdBy; }
    public function setCreatedBy(User $createdBy): self { $this->createdBy = $createdBy; return $this; }

    public function getCreatedAt(): ?\DateTimeInterface { return $this->createdAt; }

    // ── Règles métier ──────────────────────────────────────────────────

    /** Une relance est-elle en retard ? */
    public function isOverdue(): bool
    {
        return $this->status === self::STATUS_PENDING
            && $this->dueAt !== null
            && $this->dueAt < new \DateTimeImmutable('today');
    }

    /** Clôture : horodate automatiquement. */
    public function markDone(): self
    {
        $this->status = self::STATUS_DONE;
        $this->completedAt = new \DateTimeImmutable();

        return $this;
    }

    public function markCanceled(): self
    {
        $this->status = self::STATUS_CANCELED;
        $this->completedAt = null;

        return $this;
    }

    public function reopen(): self
    {
        $this->status = self::STATUS_PENDING;
        $this->completedAt = null;

        return $this;
    }
}
