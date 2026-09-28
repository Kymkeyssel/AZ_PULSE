<?php

namespace App\Event;

use App\Entity\AccessRequest;
use App\Entity\AuditLog;

/**
 * Une demande d'accès a été approuvée et le compte a été activé.
 *
 * Émis par `AccessRequestService::approve()`. L'acteur est l'administrateur
 * qui a arbitré, pas le demandeur : sans cela, la trace attribuerait l'activation
 * à la personne qui l'a obtenue, ce qui n'a aucun sens.
 */
class AccessRequestApprovedEvent extends DomainEvent
{
    public const NAME = 'access_request.approved';

    public function __construct(private readonly AccessRequest $accessRequest)
    {
    }

    public function getAccessRequest(): AccessRequest
    {
        return $this->accessRequest;
    }

    public function getSummary(): string
    {
        $role = $this->accessRequest->getAssignedRole()?->getLabel() ?? 'aucun rôle';

        return sprintf(
            'Demande d\'accès de %s approuvée, rôle attribué : %s',
            $this->accessRequest->getUser()->getEmail(),
            $role
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
