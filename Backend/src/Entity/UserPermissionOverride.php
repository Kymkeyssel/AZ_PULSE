<?php

namespace App\Entity;

use App\Repository\UserPermissionOverrideRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserPermissionOverrideRepository::class)]
#[ORM\Table(name: 'user_permission_overrides')]
#[ORM\UniqueConstraint(name: 'user_permission_unique', columns: ['user_id', 'permission_id'])]
class UserPermissionOverride
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'permissionOverrides')]
    #[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private User $user;

    #[ORM\ManyToOne(targetEntity: Permission::class)]
    #[ORM\JoinColumn(name: 'permission_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private Permission $permission;

    #[ORM\Column(type: 'boolean')]
    private bool $isGranted = true;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'granted_by_id', referencedColumnName: 'id', nullable: true, onDelete: 'SET NULL')]
    private ?User $grantedBy = null;

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

    public function getUser(): User
    {
        return $this->user;
    }

    public function setUser(User $user): self
    {
        $this->user = $user;
        return $this;
    }

    public function getPermission(): Permission
    {
        return $this->permission;
    }

    public function setPermission(Permission $permission): self
    {
        $this->permission = $permission;
        return $this;
    }

    public function isGranted(): bool
    {
        return $this->isGranted;
    }

    public function setIsGranted(bool $isGranted): self
    {
        $this->isGranted = $isGranted;
        return $this;
    }

    public function getGrantedBy(): ?User
    {
        return $this->grantedBy;
    }

    public function setGrantedBy(?User $grantedBy): self
    {
        $this->grantedBy = $grantedBy;
        return $this;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }
}
