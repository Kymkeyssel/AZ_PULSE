<?php

namespace App\Event;

use App\Entity\AuditLog;
use App\Entity\Incident;
use App\Entity\User;

/**
 * Un incident a été déclaré.
 *
 * L'infrastructure est pilotée par GLPI, qui reste la source de vérité (§8) :
 * cet événement décrit la déclaration vue par la plateforme AZ PULSE, et la
 * ligne d'audit y consigne l'identifiant GLPI afin que les deux référentiels
 * puissent être rapprochés.
 */
class IncidentOpenedEvent extends DomainEvent
{
    public const NAME = 'incident.opened';

    public function __construct(private readonly Incident $incident)
    {
    }

    public function getIncident(): Incident
    {
        return $this->incident;
    }

    public function getSummary(): string
    {
        return sprintf(
            'Incident %s déclaré : « %s » (priorité %s)',
            $this->incident->getId() !== null ? '#' . $this->incident->getId() : 'n° inconnu',
            $this->incident->getTitle(),
            $this->incident->getPriority() ?? 'non précisée'
        );
    }

    public function getAuditCategory(): string
    {
        return AuditLog::CATEGORY_INFRA;
    }

    public function getTargetType(): string
    {
        return Incident::class;
    }

    public function getTargetId(): ?string
    {
        return $this->incident->getId() !== null ? (string) $this->incident->getId() : null;
    }

    /**
     * Technicien affecté, s'il y en a déjà un.
     */
    public function getAssignee(): ?User
    {
        return $this->incident->getAssignee();
    }
}
