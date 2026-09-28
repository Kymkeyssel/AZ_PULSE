<?php

namespace App\Event;

use App\Entity\AccessRequest;
use App\Entity\AuditLog;

/**
 * Un utilisateur a déposé une demande d'accès et attend une décision.
 *
 * Émis par `AuthService::requestAccess()`. C'est l'amorce du circuit IAM : le
 * fait déclenche une notification aux administrateurs, qui sans lui n'auraient
 * aucun moyen de savoir qu'une demande attend.
 */
class AccessRequestSubmittedEvent extends DomainEvent
{
    public const NAME = 'access_request.submitted';

    public function __construct(private readonly AccessRequest $accessRequest)
    {
    }

    public function getAccessRequest(): AccessRequest
    {
        return $this->accessRequest;
    }

    public function getSummary(): string
    {
        return sprintf(
            'Demande d\'accès déposée par %s pour le profil « %s »',
            $this->accessRequest->getUser()->getEmail(),
            $this->accessRequest->getRequestedProfile() ?? 'non précisé'
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
