<?php

namespace App\Event;

use App\Entity\AuditLog;
use App\Entity\Opportunity;

/**
 * Une opportunité a changé de phase du pipeline.
 *
 * Porte l'ancienne *et* la nouvelle phase : `Opportunity` ne contient que
 * l'état courant, et une trace d'audit qui ne dit pas d'où l'on vient est
 * inexploitable pour reconstituer l'historique commercial d'un compte.
 */
class OpportunityStageChangedEvent extends DomainEvent
{
    public const NAME = 'opportunity.stage_changed';

    public function __construct(
        private readonly Opportunity $opportunity,
        private readonly string $previousStage,
        private readonly string $newStage
    ) {
    }

    public function getOpportunity(): Opportunity
    {
        return $this->opportunity;
    }

    public function getPreviousStage(): string
    {
        return $this->previousStage;
    }

    public function getNewStage(): string
    {
        return $this->newStage;
    }

    public function getSummary(): string
    {
        return sprintf(
            'Opportunité « %s » passée de la phase %s à la phase %s',
            $this->opportunity->getTitle(),
            $this->previousStage,
            $this->newStage
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
