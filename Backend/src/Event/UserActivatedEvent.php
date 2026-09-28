<?php

namespace App\Event;

use App\Entity\AuditLog;
use App\Entity\User;

/**
 * Un compte est devenu actif.
 *
 * Cas particulier à ne pas confondre avec l'approbation : un Super Admin peut
 * réactiver un compte existant (suspension levée, retour de congé) sans qu'il
 * existe de demande d'accès derrière. La trace doit rester la même.
 */
class UserActivatedEvent extends DomainEvent
{
    public const NAME = 'user.activated';

    public function __construct(private readonly User $user)
    {
    }

    public function getUser(): User
    {
        return $this->user;
    }

    public function getSummary(): string
    {
        return sprintf('Compte %s activé', $this->user->getEmail());
    }

    public function getAuditCategory(): string
    {
        return AuditLog::CATEGORY_IAM;
    }

    public function getTargetType(): string
    {
        return User::class;
    }

    public function getTargetId(): ?string
    {
        return (string) $this->user->getId();
    }
}
