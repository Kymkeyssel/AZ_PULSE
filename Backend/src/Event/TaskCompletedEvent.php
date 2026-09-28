<?php

namespace App\Event;

use App\Entity\AuditLog;
use App\Entity\Task;
use App\Entity\User;

/**
 * Une tâche a été marquée comme terminée.
 *
 * Se déclenche sur le passage *effectif* au statut terminé, pas sur toute
 * sauvegarde : sinon chaque ouverture d'un formulaire de tâche produirait une
 * notification au chef de projet, et l'utile deviendrait le bruit.
 */
class TaskCompletedEvent extends DomainEvent
{
    public const NAME = 'task.completed';

    public function __construct(private readonly Task $task)
    {
    }

    public function getTask(): Task
    {
        return $this->task;
    }

    public function getSummary(): string
    {
        $project = $this->task->getProject()?->getName() ?? 'sans projet';

        return sprintf('Tâche « %s » (%s) terminée', $this->task->getTitle(), $project);
    }

    public function getAuditCategory(): string
    {
        return AuditLog::CATEGORY_WORKSPACE;
    }

    public function getTargetType(): string
    {
        return Task::class;
    }

    public function getTargetId(): ?string
    {
        return $this->task->getId() !== null ? (string) $this->task->getId() : null;
    }

    /**
     * Le chef de projet, destinataire naturel de la notification : c'est lui
     * qui arbitre la charge de l'équipe.
     */
    public function getProjectManager(): ?User
    {
        return $this->task->getProject()?->getManager();
    }
}
