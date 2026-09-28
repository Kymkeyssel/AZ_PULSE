<?php

namespace App\Event;

use App\Entity\AuditLog;
use App\Entity\Project;

/**
 * Un projet a été créé.
 *
 * À distinguer de l'automatisme CRM existant : `ProjectCreationSubscriber`
 * fabrique un projet à partir d'une opportunité gagnée. Cet événement, lui,
 * annonce la création et sert à prévenir le chef de projet désigné. Les deux
 * peuvent se déclencher ensemble, sans que ce soit un doublon : l'un produit le
 * projet, l'autre prévient.
 */
class ProjectCreatedEvent extends DomainEvent
{
    public const NAME = 'project.created';

    public function __construct(private readonly Project $project)
    {
    }

    public function getProject(): Project
    {
        return $this->project;
    }

    public function getSummary(): string
    {
        $manager = $this->project->getManager()?->getEmail() ?? 'non désigné';

        return sprintf('Projet « %s » créé, chef de projet : %s', $this->project->getName(), $manager);
    }

    public function getAuditCategory(): string
    {
        return AuditLog::CATEGORY_WORKSPACE;
    }

    public function getTargetType(): string
    {
        return Project::class;
    }

    public function getTargetId(): ?string
    {
        return $this->project->getId() !== null ? (string) $this->project->getId() : null;
    }
}
