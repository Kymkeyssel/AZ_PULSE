<?php

namespace App\Entity;

use App\Repository\NotificationRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * Notification adressée à un utilisateur.
 *
 * Séparée de l'e-mail et de l'audit, et volontairement : une notification est
 * un message *adressé à quelqu'un* (« votre demande a été approuvée »), alors
 * que l'audit est une trace *impersonnelle* de ce qui s'est produit. Confondre
 * les deux conduit soit à spammer les utilisateurs, soit à polluer le journal.
 *
 * La notification porte un lien vers la route React concernée : l'interface
 * n'a plus à deviner où l'utilisateur doit se rendre.
 */
#[ORM\Entity(repositoryClass: NotificationRepository::class)]
#[ORM\Table(name: 'notifications')]
#[ORM\Index(name: 'idx_notif_recipient_read', columns: ['recipient_id', 'is_read'])]
#[ORM\Index(name: 'idx_notif_created', columns: ['created_at'])]
class Notification
{
    public const SEVERITY_INFO = 'INFO';
    public const SEVERITY_SUCCESS = 'SUCCESS';
    public const SEVERITY_WARNING = 'WARNING';
    public const SEVERITY_DANGER = 'DANGER';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private User $recipient;

    /** Code du type, aligné sur l'action d'audit correspondante. */
    #[ORM\Column(type: 'string', length: 100)]
    private string $type;

    #[ORM\Column(type: 'string', length: 200)]
    private string $title;

    #[ORM\Column(type: 'text')]
    private string $body;

    /** Route React vers laquelle l'utilisateur est conduit. */
    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $link = null;

    #[ORM\Column(type: 'string', length: 20)]
    private string $severity = self::SEVERITY_INFO;

    #[ORM\Column(type: 'boolean')]
    private bool $isRead = false;

    #[ORM\Column(type: 'datetime_immutable', nullable: true)]
    private ?\DateTimeImmutable $readAt = null;

    #[ORM\Column(type: 'datetime_immutable')]
    private \DateTimeImmutable $createdAt;

    public function __construct(User $recipient, string $type, string $title, string $body)
    {
        $this->recipient = $recipient;
        $this->type = $type;
        $this->title = $title;
        $this->body = $body;
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRecipient(): User
    {
        return $this->recipient;
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function getBody(): string
    {
        return $this->body;
    }

    public function getLink(): ?string
    {
        return $this->link;
    }

    public function setLink(?string $link): self
    {
        $this->link = $link;

        return $this;
    }

    public function getSeverity(): string
    {
        return $this->severity;
    }

    public function setSeverity(string $severity): self
    {
        $this->severity = $severity;

        return $this;
    }

    public function isRead(): bool
    {
        return $this->isRead;
    }

    /**
     * Marque comme lue. Idempotent : marquer deux fois ne réécrit pas
     * `readAt`, pour que l'horodatage corresponde à la *première* lecture.
     */
    public function markAsRead(): self
    {
        if (!$this->isRead) {
            $this->isRead = true;
            $this->readAt = new \DateTimeImmutable();
        }

        return $this;
    }

    public function getReadAt(): ?\DateTimeImmutable
    {
        return $this->readAt;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }
}
