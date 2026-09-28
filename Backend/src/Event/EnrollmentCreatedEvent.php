<?php

namespace App\Event;

use App\Entity\AuditLog;
use App\Entity\Enrollment;
use App\Entity\Promotion;

/**
 * Un apprenant a été inscrit à une promotion.
 *
 * Prévient le secrétariat académique et l'apprenant lui-même, qui doit
 * pouvoir constater son inscription sans avoir à chercher où elle apparaît.
 */
class EnrollmentCreatedEvent extends DomainEvent
{
    public const NAME = 'enrollment.created';

    public function __construct(private readonly Enrollment $enrollment)
    {
    }

    public function getEnrollment(): Enrollment
    {
        return $this->enrollment;
    }

    public function getPromotion(): ?Promotion
    {
        return $this->enrollment->getPromotion();
    }

    public function getSummary(): string
    {
        $promotion = $this->enrollment->getPromotion()?->getName() ?? 'promotion non précisée';

        return sprintf(
            'Inscription de %s à la %s',
            $this->enrollment->getStudent()?->getEmail() ?? 'apprenant inconnu',
            $promotion
        );
    }

    public function getAuditCategory(): string
    {
        return AuditLog::CATEGORY_FORMATION;
    }

    public function getTargetType(): string
    {
        return Enrollment::class;
    }

    public function getTargetId(): ?string
    {
        return $this->enrollment->getId() !== null ? (string) $this->enrollment->getId() : null;
    }
}
