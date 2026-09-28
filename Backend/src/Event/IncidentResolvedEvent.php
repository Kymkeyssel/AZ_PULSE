<?php

namespace App\Event;

use App\Entity\AuditLog;
use App\Entity\Incident;
use App\Entity\User;

/**
 * Un incident a été résolu.
 *
 * La durée de résolution est calculée à partir de la création de l'incident :
 * c'est l'indicateur que le module Infrastructure doit pouvoir remonter sans
 * recalculer l'historique à la volée à chaque affichage.
 */
class IncidentResolvedEvent extends DomainEvent
{
    public const NAME = 'incident.resolved';

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
            'Incident « %s » résolu après %s',
            $this->incident->getTitle(),
            $this->elapsed()
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

    public function getReporter(): ?User
    {
        return $this->incident->getReporter();
    }

    /**
     * Durée écoulée entre la déclaration et la résolution.
     *
     * Null si l'incident n'a pas de date de création exploitable : on ne veut
     * pas afficher « résolu après » suivi d'un calcul vide.
     */
    private function elapsed(): string
    {
        $createdAt = $this->incident->getCreatedAt();
        $resolvedAt = $this->incident->getResolvedAt();

        if ($createdAt === null || $resolvedAt === null) {
            return 'durée indéterminée';
        }

        $start = new \DateTimeImmutable($createdAt->format('Y-m-d H:i:s'));
        $end = new \DateTimeImmutable($resolvedAt->format('Y-m-d H:i:s'));
        $diff = $end->getTimestamp() - $start->getTimestamp();

        // Un horodatage de résolution antérieur à la création est un défaut de
        // saisie : on l'affiche tel quel plutôt que de produire une durée
        // négative que personne ne saurait expliquer.
        if ($diff < 0) {
            return 'durée incohérente';
        }

        if ($diff < 3600) {
            return sprintf('%d min', intdiv($diff, 60));
        }

        if ($diff < 86400) {
            return sprintf('%d h', intdiv($diff, 3600));
        }

        return sprintf('%d j', intdiv($diff, 86400));
    }
}
