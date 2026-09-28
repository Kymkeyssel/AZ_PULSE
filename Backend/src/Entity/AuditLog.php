<?php

namespace App\Entity;

use App\Repository\AuditLogRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * Journal d'audit — la mémoire de ce qui s'est passé sur la plateforme.
 *
 * Pourquoi une entité dédiée alors qu'il existe déjà `Activity` (CRM) :
 * `Activity` décrit un *fait commercial* attaché à un client. `AuditLog` décrit
 * une *décision ou un effet de bord*, y compris techniques : qui a approuvé
 * quel accès, quel document a été publié, quelle recommandation IA a été
 * proposée, depuis quelle IP. Il ne doit jamais disparaître quand un compte est
 * supprimé — d'où `onDelete: SET NULL` sur l'acteur et la conservation de son
 * email en clair dénormalisé.
 *
 * Principe de rétention : ces lignes sont en lecture seule. Aucune API ne
 * permet de modifier ou supprimer une entrée (cf. NotificationController /
 * AuditController : seules des opérations de lecture et d'export existent).
 */
#[ORM\Entity(repositoryClass: AuditLogRepository::class)]
#[ORM\Table(name: 'audit_logs')]
#[ORM\Index(name: 'idx_audit_created', columns: ['created_at'])]
#[ORM\Index(name: 'idx_audit_action', columns: ['action'])]
#[ORM\Index(name: 'idx_audit_category', columns: ['category'])]
class AuditLog
{
    public const CATEGORY_IAM = 'IAM';
    public const CATEGORY_CRM = 'CRM';
    public const CATEGORY_WORKSPACE = 'WORKSPACE';
    public const CATEGORY_FORMATION = 'FORMATION';
    public const CATEGORY_KNOWLEDGE = 'KNOWLEDGE';
    public const CATEGORY_INFRA = 'INFRA';
    public const CATEGORY_AI = 'AI';
    public const CATEGORY_SECURITY = 'SECURITY';

    public const SEVERITY_INFO = 'INFO';
    public const SEVERITY_WARNING = 'WARNING';
    public const SEVERITY_CRITICAL = 'CRITICAL';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    /** Code d'action stable et lisible, ex. ACCESS_REQUEST_APPROVED. */
    #[ORM\Column(type: 'string', length: 100)]
    private string $action;

    #[ORM\Column(type: 'string', length: 50)]
    private string $category = self::CATEGORY_SECURITY;

    #[ORM\Column(type: 'string', length: 20)]
    private string $severity = self::SEVERITY_INFO;

    #[ORM\Column(type: 'text')]
    private string $description;

    /**
     * Auteur de l'action. `SET NULL` et non `CASCADE` : supprimer un compte
     * ne doit pas effacer la trace de ce qu'il a fait.
     */
    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    private ?User $actor = null;

    /**
     * Email de l'auteur, dénormalisé.
     *
     * Volontairement dupliqué : si le compte est supprimé, la ligne d'audit
     * reste attribuable à une personne et pas à un identifiant orphelin.
     */
    #[ORM\Column(type: 'string', length: 180, nullable: true)]
    private ?string $actorEmail = null;

    #[ORM\Column(type: 'string', length: 45, nullable: true)]
    private ?string $actorIp = null;

    /** Type d'entité concernée, ex. AccessRequest, Project, Document. */
    #[ORM\Column(type: 'string', length: 50, nullable: true)]
    private ?string $targetType = null;

    /** Identifiant de l'entité concernée, en texte (UUID ou int). */
    #[ORM\Column(type: 'string', length: 100, nullable: true)]
    private ?string $targetId = null;

    /** Contexte libre : ancien/nouveau statut, valeurs, identifiants tiers. */
    #[ORM\Column(type: 'json', nullable: true)]
    private ?array $metadata = null;

    #[ORM\Column(type: 'datetime_immutable')]
    private \DateTimeImmutable $createdAt;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAction(): string
    {
        return $this->action;
    }

    public function setAction(string $action): self
    {
        $this->action = $action;

        return $this;
    }

    public function getCategory(): string
    {
        return $this->category;
    }

    public function setCategory(string $category): self
    {
        $this->category = $category;

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

    public function getDescription(): string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getActor(): ?User
    {
        return $this->actor;
    }

    public function setActor(?User $actor): self
    {
        $this->actor = $actor;
        $this->actorEmail = $actor?->getEmail();

        return $this;
    }

    public function getActorEmail(): ?string
    {
        return $this->actorEmail;
    }

    public function getActorIp(): ?string
    {
        return $this->actorIp;
    }

    public function setActorIp(?string $actorIp): self
    {
        $this->actorIp = $actorIp;

        return $this;
    }

    public function getTargetType(): ?string
    {
        return $this->targetType;
    }

    public function setTargetType(?string $targetType): self
    {
        $this->targetType = $targetType;

        return $this;
    }

    public function getTargetId(): ?string
    {
        return $this->targetId;
    }

    public function setTargetId(?string $targetId): self
    {
        $this->targetId = $targetId;

        return $this;
    }

    public function getMetadata(): ?array
    {
        return $this->metadata;
    }

    public function setMetadata(?array $metadata): self
    {
        $this->metadata = $metadata;

        return $this;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }
}
