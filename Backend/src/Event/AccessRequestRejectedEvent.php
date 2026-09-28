<?php

namespace App\Event;

use App\Entity\AccessRequest;
use App\Entity\AuditLog;

/**
 * Une demande d'accès a été refusée.
 *
 * La raison du refus est conservée dans le contexte d'audit : c'est
 * précisément elle qu'un administrateur cherchera dans six mois pour comprendre
 * pourquoi quelqu'un n'a pas eu d'accès.
 */
class AccessRequestRejectedEvent extends DomainEvent
{
    public const NAME = 'access_request.rejected';

    public function __construct(private readonly AccessRequest $accessRequest)
    {
    }

    public function getAccessRequest(): AccessRequest
    {
        return $this->accessRequest;
    }

    public function getSummary(): string
    {
        $reason = $this->accessRequest->getRejectionReason() ?? 'motif non renseigné';

        return sprintf(
            'Demande d\'accès de %s refusée : %s',
            $this->accessRequest->getUser()->getEmail(),
            $reason
        );
    }

    public function getAuditCategory(): string
    {
        return AuditLog::CATEGORY_IAM;
    }

    public function getTargetType(): string
    {
        return AccessRequest::class;
    }

    public function getTargetId(): ?string
    {
        return (string) $this->accessRequest->getId();
    }
}
