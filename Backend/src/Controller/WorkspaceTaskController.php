<?php

namespace App\Controller;

use App\Entity\Project;
use App\Entity\Task;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class WorkspaceTaskController extends AbstractController
{
    #[Route('/api/workspace/projects/{projectId}/tasks', name: 'api_workspace_project_tasks_list', methods: ['GET'])]
    public function listProjectTasks(int $projectId, EntityManagerInterface $em): JsonResponse
    {
        $project = $em->getRepository(Project::class)->find($projectId);
        if (!$project) {
            return $this->json(['success' => false, 'error' => 'Project not found'], 404);
        }

        /** @var User $user */
        $user = $this->getUser();
        if (!$this->isGranted('SUPER_ADMIN') && !$this->isGranted('workspace.read')) {
            if ($project->getManager() !== $user && !$project->getMembers()->contains($user)) {
                return $this->json(['success' => false, 'error' => 'Access Denied'], 403);
            }
        }

        $tasks = $em->getRepository(Task::class)->findBy(['project' => $project], ['createdAt' => 'DESC']);

        $data = array_map(fn($t) => [
            'id' => $t->getId(),
            'title' => $t->getTitle(),
            'status' => $t->getStatus(),
            'priority' => $t->getPriority(),
            'progress' => $t->getProgress(),
            'dueDate' => $t->getDueDate()?->format(\DateTimeInterface::ATOM),
            'assignee_id' => $t->getAssignee()?->getId(),
            'assignee_name' => $t->getAssignee() ? $t->getAssignee()->getFirstName() . ' ' . $t->getAssignee()->getLastName() : null,
        ], $tasks);

        return $this->json(['success' => true, 'data' => $data]);
    }

    #[Route('/api/workspace/projects/{projectId}/tasks', name: 'api_workspace_project_tasks_create', methods: ['POST'])]
    public function createTask(int $projectId, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $project = $em->getRepository(Project::class)->find($projectId);
        if (!$project) {
            return $this->json(['success' => false, 'error' => 'Project not found'], 404);
        }

        /** @var User $user */
        $user = $this->getUser();
        // Le manager ou un admin ou quelqu'un avec workspace.write peut créer une tâche
        if (!$this->isGranted('SUPER_ADMIN') && !$this->isGranted('workspace.write')) {
            if ($project->getManager() !== $user) {
                return $this->json(['success' => false, 'error' => 'Seul le manager peut créer des tâches'], 403);
            }
        }

        $payload = json_decode($request->getContent(), true);
        if (empty($payload['title'])) {
            return $this->json(['success' => false, 'error' => 'Missing "title" field'], 400);
        }

        $task = new Task();
        $task->setProject($project);
        $task->setTitle($payload['title']);
        
        if (!empty($payload['description'])) $task->setDescription($payload['description']);
        if (!empty($payload['status'])) $task->setStatus($payload['status']);
        if (!empty($payload['priority'])) $task->setPriority($payload['priority']);
        if (!empty($payload['dueDate'])) $task->setDueDate(new \DateTime($payload['dueDate']));

        if (!empty($payload['assignee_id'])) {
            $assignee = $em->getRepository(User::class)->find($payload['assignee_id']);
            if ($assignee) $task->setAssignee($assignee);
        }

        $em->persist($task);
        $em->flush();

        return $this->json(['success' => true, 'data' => ['id' => $task->getId()]], 201);
    }

    #[Route('/api/workspace/tasks/{id}', name: 'api_workspace_tasks_update', methods: ['PATCH'])]
    public function updateTask(Task $task, Request $request, EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $project = $task->getProject();
        
        // Seul l'assigné, le manager ou un admin peut modifier la tâche
        if (!$this->isGranted('SUPER_ADMIN') && !$this->isGranted('workspace.write')) {
            if ($project->getManager() !== $user && $task->getAssignee() !== $user) {
                return $this->json(['success' => false, 'error' => 'Access Denied'], 403);
            }
        }

        $payload = json_decode($request->getContent(), true);

        if (isset($payload['title'])) $task->setTitle($payload['title']);
        if (isset($payload['description'])) $task->setDescription($payload['description']);
        if (isset($payload['status'])) $task->setStatus($payload['status']);
        if (isset($payload['priority'])) $task->setPriority($payload['priority']);
        if (isset($payload['progress'])) $task->setProgress($payload['progress']);
        
        $task->setUpdatedAt(new \DateTime());
        $em->flush();

        return $this->json(['success' => true, 'data' => ['id' => $task->getId()]]);
    }
}
