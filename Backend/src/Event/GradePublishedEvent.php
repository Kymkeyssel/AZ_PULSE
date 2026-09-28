<?php

namespace App\Event;

use App\Entity\AuditLog;
use App\Entity\Grade;
use App\Entity\User;

/**
 * Une note a été publiée à l'apprenant.
 *
 * Se déclenche à la publication, jamais à la saisie. Une note saisie puis
 * corrigée trois fois ne doit pas notifier l'apprenant trois fois : il ne
 * connaît son résultat que lorsque l'enseignant l'a validé.
 */
class GradePublishedEvent extends DomainEvent
{
    public const NAME = 'grade.published';

    public function __construct(private readonly Grade $grade)
    {
    }

    public function getGrade(): Grade
    {
        return $this->grade;
    }

    public function getSummary(): string
    {
        // Le barème n'est pas porté par le modèle : `Course` n'a pas de note
        // maximale et `Grade::score` est un float libre. On affiche donc la
        // valeur telle qu'elle est enregistrée, sans fabriquer un « /20 » qui
        // n'existe nulle part dans la base.
        $score = $this->grade->getScore();

        return sprintf(
            'Note publiée : %s pour %s au module %s',
            $score !== null ? (string) $score : 'non renseignée',
            $this->grade->getStudent()?->getEmail() ?? 'apprenant inconnu',
            $this->grade->getCourse()?->getTitle() ?? 'non précisé'
        );
    }

    public function getAuditCategory(): string
    {
        return AuditLog::CATEGORY_FORMATION;
    }

    public function getTargetType(): string
    {
        return Grade::class;
    }

    public function getTargetId(): ?string
    {
        return $this->grade->getId() !== null ? (string) $this->grade->getId() : null;
    }

    public function getStudent(): ?User
    {
        return $this->grade->getStudent();
    }
}
