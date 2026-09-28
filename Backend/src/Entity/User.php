<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: 'users')]
#[ORM\HasLifecycleCallbacks]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    public const STATUS_PENDING_APPROVAL = 'PENDING_APPROVAL';
    public const STATUS_ACTIVE = 'ACTIVE';
    public const STATUS_INACTIVE = 'INACTIVE';
    public const STATUS_BLOCKED = 'BLOCKED';
    public const STATUS_REJECTED = 'REJECTED';

    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    private Uuid $id;

    #[ORM\Column(type: 'string', length: 180, unique: true)]
    private string $email;

    #[ORM\Column(type: 'string')]
    private string $password;

    #[ORM\Column(type: 'string', length: 100)]
    private string $firstName;

    #[ORM\Column(type: 'string', length: 100)]
    private string $lastName;

    #[ORM\Column(type: 'string', length: 30, nullable: true)]
    private ?string $phone = null;

    #[ORM\Column(type: 'string', length: 30)]
    private string $status = self::STATUS_PENDING_APPROVAL;

    /**
     * Spécialisation du rôle COLLABORATEUR (ex. COMMERCIAL, FORMATEUR).
     *
     * Ce champ n'est jamais utilisé pour autoriser quoi que ce soit : il sert
     * uniquement à déterminer l'interface de l'espace personnel. Les droits
     * effectifs restent portés par le rôle COLLABORATEUR et les
     * UserPermissionOverride posés à l'approbation.
     */
    #[ORM\Column(type: 'string', length: 50, nullable: true)]
    private ?string $collaboratorProfile = null;

    #[ORM\Column(type: 'datetime_immutable', nullable: true)]
    private ?\DateTimeImmutable $lastLoginAt = null;

    #[ORM\Column(type: 'datetime_immutable')]
    private \DateTimeImmutable $createdAt;

    #[ORM\Column(type: 'datetime_immutable')]
    private \DateTimeImmutable $updatedAt;

    /**
     * @var Collection<int, Role>
     */
    #[ORM\ManyToMany(targetEntity: Role::class, inversedBy: 'users')]
    #[ORM\JoinTable(name: 'user_roles')]
    private Collection $roles;

    /**
     * @var Collection<int, UserPermissionOverride>
     */
    #[ORM\OneToMany(targetEntity: UserPermissionOverride::class, mappedBy: 'user', cascade: ['persist', 'remove'], orphanRemoval: true)]
    private Collection $permissionOverrides;

    /**
     * @var Collection<int, AccessRequest>
     */
    #[ORM\OneToMany(targetEntity: AccessRequest::class, mappedBy: 'user', cascade: ['persist', 'remove'])]
    private Collection $accessRequests;

    /**
     * @var Collection<int, ApiToken>
     */
    #[ORM\OneToMany(targetEntity: ApiToken::class, mappedBy: 'user', cascade: ['persist', 'remove'], orphanRemoval: true)]
    private Collection $apiTokens;

    /**
     * @var Collection<int, Customer>
     */
    #[ORM\OneToMany(mappedBy: 'owner', targetEntity: Customer::class)]
    private Collection $customers;

    /**
     * @var Collection<int, Opportunity>
     */
    #[ORM\OneToMany(mappedBy: 'owner', targetEntity: Opportunity::class)]
    private Collection $opportunities;

    /**
     * @var Collection<int, Activity>
     */
    #[ORM\OneToMany(mappedBy: 'author', targetEntity: Activity::class)]
    private Collection $activities;

    /**
     * Relances qui me sont affectées.
     *
     * @var Collection<int, Reminder>
     */
    #[ORM\OneToMany(mappedBy: 'assignedTo', targetEntity: Reminder::class)]
    private Collection $reminders;

    /**
     * @var Collection<int, self>
     */
    #[ORM\ManyToMany(targetEntity: self::class, inversedBy: 'parents')]
    private Collection $children;

    /**
     * Documents déposés par ce collaborateur.
     *
     * @var Collection<int, Document>
     */
    #[ORM\OneToMany(mappedBy: 'owner', targetEntity: Document::class)]
    private Collection $documents;

    /**
     * @var Collection<int, self>
     */
    #[ORM\ManyToMany(targetEntity: self::class, mappedBy: 'children')]
    private Collection $parents;

    public function __construct()
    {
        $this->id = Uuid::v7();
        $this->roles = new ArrayCollection();
        $this->permissionOverrides = new ArrayCollection();
        $this->accessRequests = new ArrayCollection();
        $this->apiTokens = new ArrayCollection();
        $this->customers = new ArrayCollection();
        $this->opportunities = new ArrayCollection();
        $this->activities = new ArrayCollection();
        $this->reminders = new ArrayCollection();
        $this->documents = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
        $this->children = new ArrayCollection();
        $this->parents = new ArrayCollection();
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

    public function getEmail(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = strtolower(trim($email));
        return $this;
    }

    public function getUserIdentifier(): string
    {
        return $this->email;
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;
        return $this;
    }

    public function eraseCredentials(): void
    {
    }

    public function getFirstName(): string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;
        return $this;
    }

    public function getLastName(): string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;
        return $this;
    }

    public function getFullName(): string
    {
        return trim($this->firstName . ' ' . $this->lastName);
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(?string $phone): self
    {
        $this->phone = $phone;
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

    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    public function getCollaboratorProfile(): ?string
    {
        return $this->collaboratorProfile;
    }

    public function setCollaboratorProfile(?string $collaboratorProfile): self
    {
        $this->collaboratorProfile = $collaboratorProfile !== null
            ? strtoupper(trim($collaboratorProfile))
            : null;

        return $this;
    }

    public function getLastLoginAt(): ?\DateTimeImmutable
    {
        return $this->lastLoginAt;
    }

    public function setLastLoginAt(?\DateTimeImmutable $lastLoginAt): self
    {
        $this->lastLoginAt = $lastLoginAt;
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

    /**
     * @return Collection<int, Role>
     */
    public function getRolesEntities(): Collection
    {
        return $this->roles;
    }

    /**
     * Returns Symfony roles string array (e.g. ROLE_SUPER_ADMIN, ROLE_ADMIN, ROLE_USER)
     * @return string[]
     */
    public function getRoles(): array
    {
        $symfonyRoles = ['ROLE_USER'];

        foreach ($this->roles as $role) {
            $roleCode = $role->getCode();
            $symfonyRoles[] = 'ROLE_' . $roleCode;
        }

        return array_unique($symfonyRoles);
    }

    public function addRole(Role $role): self
    {
        if (!$this->roles->contains($role)) {
            $this->roles->add($role);
        }
        return $this;
    }

    public function removeRole(Role $role): self
    {
        $this->roles->removeElement($role);
        return $this;
    }

    public function clearRoles(): self
    {
        $this->roles->clear();
        return $this;
    }

    /**
     * Checks whether the user has a specific role code (e.g. 'SUPER_ADMIN', 'ADMIN')
     */
    public function hasRoleCode(string $code): bool
    {
        $target = strtoupper($code);
        foreach ($this->roles as $role) {
            if (strtoupper($role->getCode()) === $target) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns all computed permission codes (Inherited from Roles + Overrides)
     * @return string[]
     */
    public function getComputedPermissions(): array
    {
        $permissions = [];

        // 1. Permissions inherited from Roles
        foreach ($this->roles as $role) {
            foreach ($role->getPermissions() as $permission) {
                $permissions[$permission->getCode()] = true;
            }
        }

        // 2. Custom overrides (can grant or explicitly revoke)
        foreach ($this->permissionOverrides as $override) {
            $code = $override->getPermission()->getCode();
            if ($override->isGranted()) {
                $permissions[$code] = true;
            } else {
                unset($permissions[$code]);
            }
        }

        return array_keys($permissions);
    }

    public function hasPermission(string $permissionCode): bool
    {
        if ($this->hasRoleCode('SUPER_ADMIN')) {
            return true;
        }

        return in_array($permissionCode, $this->getComputedPermissions(), true);
    }

    /**
     * @return Collection<int, UserPermissionOverride>
     */
    public function getPermissionOverrides(): Collection
    {
        return $this->permissionOverrides;
    }

    public function addPermissionOverride(UserPermissionOverride $override): self
    {
        if (!$this->permissionOverrides->contains($override)) {
            $this->permissionOverrides->add($override);
            $override->setUser($this);
        }
        return $this;
    }

    /**
     * @return Collection<int, AccessRequest>
     */
    public function getAccessRequests(): Collection
    {
        return $this->accessRequests;
    }

    /**
     * @return Collection<int, ApiToken>
     */
    public function getApiTokens(): Collection
    {
        return $this->apiTokens;
    }

    /**
     * @return Collection<int, Customer>
     */
    public function getCustomers(): Collection
    {
        return $this->customers;
    }

    /**
     * @return Collection<int, Opportunity>
     */
    public function getOpportunities(): Collection
    {
        return $this->opportunities;
    }

    /**
     * @return Collection<int, Activity>
     */
    public function getActivities(): Collection
    {
        return $this->activities;
    }

    /**
     * Relances qui me sont affectées.
     *
     * @return Collection<int, Reminder>
     */
    public function getReminders(): Collection
    {
        return $this->reminders;
    }

    /**
     * Documents que j'ai déposés.
     *
     * @return Collection<int, Document>
     */
    public function getDocuments(): Collection
    {
        return $this->documents;
    }

    /**
     * @return Collection<int, self>
     */
    public function getChildren(): Collection
    {
        return $this->children;
    }

    public function addChild(self $child): static
    {
        if (!$this->children->contains($child)) {
            $this->children->add($child);
        }

        return $this;
    }

    public function removeChild(self $child): static
    {
        $this->children->removeElement($child);

        return $this;
    }

    /**
     * @return Collection<int, self>
     */
    public function getParents(): Collection
    {
        return $this->parents;
    }

    public function addParent(self $parent): static
    {
        if (!$this->parents->contains($parent)) {
            $this->parents->add($parent);
            $parent->addChild($this);
        }

        return $this;
    }

    public function removeParent(self $parent): static
    {
        if ($this->parents->removeElement($parent)) {
            $parent->removeChild($this);
        }

        return $this;
    }
}
