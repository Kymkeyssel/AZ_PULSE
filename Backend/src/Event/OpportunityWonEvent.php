<?php

namespace App\Event;

use App\Entity\AuditLog;
use App\Entity\Opportunity;

/**
 * Une opportunité a été gagnée.
 *
 * Cet événement existait déjà et alimentait `ProjectCreationSubscriber`, qui
 * fabrique le projet correspondant. Il n'héritait alors que de `Event` : il
 * n'était donc ni journalisé, ni notifié. Le rattachement à `DomainEvent` ne
 * change ni le constructeur ni `getOpportunity()`, donc la chaîne
 * `OpportunityService` → `ProjectCreationSubscriber` continue de fonctionner
 * à l'identique — elle gagne seulement la couverture d'audit qui lui manquait.
 */
class OpportunityWonEvent extends DomainEvent
{
    public const NAME = 'opportunity.won';

    public function __construct(private readonly Opportunity $opportunity)
    {
    }

    public function getOpportunity(): Opportunity
    {
        return $this->opportunity;
    }

    public function getSummary(): string
    {
        $amount = $this->opportunity->getAmount();

        return sprintf(
            'Opportunité « %s » gagnée%s',
            $this->opportunity->getTitle(),
            $amount !== null ? ' pour un montant de ' . $amount : ''
        );
    }

    public function getAuditCategory(): string
    {
        return AuditLog::CATEGORY_CRM;
    }

    public function getTargetType(): string
    {
        return Opportunity::class;
    }

    public function getTargetId(): ?string
    {
        return $this->opportunity->getId() !== null ? (string) $this->opportunity->getId() : null;
    }
}
