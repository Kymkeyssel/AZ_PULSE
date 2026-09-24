<?php

namespace App\Service\AI;

use App\Entity\Project;

class ProjectContextBuilder
{
    public function build(Project $project): array
    {
        $tasks = [];
        foreach ($project->getTasks() as $task) {
            $tasks[] = [
                'title' => $task->getTitle(),
                'status' => $task->getStatus(),
                'priority' => $task->getPriority(),
                'progress' => $task->getProgress(),
                'due_date' => $task->getDueDate() ? $task->getDueDate()->format('Y-m-d') : null,
            ];
        }

        $milestones = [];
        foreach ($project->getMilestones() as $milestone) {
            $milestones[] = [
                'name' => $milestone->getName(),
                'status' => $milestone->getStatus(),
                'due_date' => $milestone->getDueDate() ? $milestone->getDueDate()->format('Y-m-d') : null,
            ];
        }

        return [
            'name' => $project->getName(),
            'description' => $project->getDescription(),
            'status' => $project->getStatus(),
            'priority' => $project->getPriority(),
            'progress' => $project->getProgress(),
            'budget' => $project->getBudget(),
            'start_date' => $project->getStartDate() ? $project->getStartDate()->format('Y-m-d') : null,
            'end_date' => $project->getEndDate() ? $project->getEndDate()->format('Y-m-d') : null,
            'tasks' => $tasks,
            'milestones' => $milestones,
        ];
    }
}
