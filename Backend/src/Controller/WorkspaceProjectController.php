<?php

namespace App\Controller;

use App\Entity\Project;
use App\Entity\Customer;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/workspace/projects', name: 'api_workspace_projects_')]
class WorkspaceProjectController extends AbstractController
{
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $qb = $em->getRepository(Project::class)->createQueryBuilder('p');

        // RBAC: Si pas admin ou pas les droits globaux, limiter aux projets où l'utilisateur est manager ou membre
        if (!$this->isGranted('SUPER_ADMIN') && !$this->isGranted('workspace.read')) {
            $qb->leftJoin('p.members', 'm')
               ->where('p.manager = :user')
               ->orWhere('m = :user')
               ->setParameter('user', $user);
        }

        $qb->orderBy('p.createdAt', 'DESC');
        $projects = $qb->getQuery()->getResult();

        $data = array_map(fn($p) => [
            'id' => $p->getId(),
            'name' => $p->getName(),
            'status' => $p->getStatus(),
            'priority' => $p->getPriority(),
            'progress' => $p->getProgress(),
            'startDate' => $p->getStartDate()?->format(\DateTimeInterface::ATOM),
            'endDate' => $p->getEndDate()?->format(\DateTimeInterface::ATOM),
            'customer_name' => $p->getCustomer()?->getName(),
            'manager_name' => $p->getManager()?->getFirstName() . ' ' . $p->getManager()?->getLastName()
        ], $projects);

        return $this->json(['success' => true, 'data' => $data]);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        if (!$this->isGranted('SUPER_ADMIN') && !$this->isGranted('workspace.write')) {
            return $this->json(['success' => false, 'error' => 'Access Denied'], 403);
        }

        $payload = json_decode($request->getContent(), true);
        if (empty($payload['name'])) {
            return $this->json(['success' => false, 'error' => 'Missing "name" field'], 400);
        }

        $project = new Project();
        $project->setName($payload['name']);
        
        if (!empty($payload['description'])) $project->setDescription($payload['description']);
        if (!empty($payload['status'])) $project->setStatus($payload['status']);
        if (!empty($payload['priority'])) $project->setPriority($payload['priority']);
        if (!empty($payload['budget'])) $project->setBudget($payload['budget']);
        if (!empty($payload['startDate'])) $project->setStartDate(new \DateTime($payload['startDate']));
        if (!empty($payload['endDate'])) $project->setEndDate(new \DateTime($payload['endDate']));

        if (!empty($payload['customer_id'])) {
            $customer = $em->getRepository(Customer::class)->find($payload['customer_id']);
            if ($customer) $project->setCustomer($customer);
        }

        if (!empty($payload['manager_id'])) {
            $manager = $em->getRepository(User::class)->find($payload['manager_id']);
            if ($manager) $project->setManager($manager);
        } else {
            /** @var User $user */
            $user = $this->getUser();
            $project->setManager($user);
        }

        $em->persist($project);
        $em->flush();

        return $this->json(['success' => true, 'data' => ['id' => $project->getId()]], 201);
    }

    #[Route('/{id}', name: 'read', methods: ['GET'])]
    public function read(Project $project): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$this->isGranted('SUPER_ADMIN') && !$this->isGranted('workspace.read')) {
            if ($project->getManager() !== $user && !$project->getMembers()->contains($user)) {
                return $this->json(['success' => false, 'error' => 'Access Denied'], 403);
            }
        }

        $data = [
            'id' => $project->getId(),
            'name' => $project->getName(),
            'description' => $project->getDescription(),
            'status' => $project->getStatus(),
            'priority' => $project->getPriority(),
            'progress' => $project->getProgress(),
            'budget' => $project->getBudget(),
            'startDate' => $project->getStartDate()?->format(\DateTimeInterface::ATOM),
            'endDate' => $project->getEndDate()?->format(\DateTimeInterface::ATOM),
            'customer_id' => $project->getCustomer()?->getId(),
            'customer_name' => $project->getCustomer()?->getName(),
            'manager_id' => $project->getManager()?->getId(),
            'manager_name' => $project->getManager()?->getFirstName() . ' ' . $project->getManager()?->getLastName(),
            'members' => $project->getMembers()->map(fn($m) => [
                'id' => $m->getId(),
                'name' => $m->getFirstName() . ' ' . $m->getLastName()
            ])->toArray(),
            'tasks_count' => $project->getTasks()->count(),
        ];

        return $this->json(['success' => true, 'data' => $data]);
    }

    #[Route('/{id}', name: 'update', methods: ['PATCH'])]
    public function update(Project $project, Request $request, EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$this->isGranted('SUPER_ADMIN') && !$this->isGranted('workspace.write')) {
            if ($project->getManager() !== $user) {
                return $this->json(['success' => false, 'error' => 'Seul le manager ou un admin peut modifier ce projet'], 403);
            }
        }

        $payload = json_decode($request->getContent(), true);

        if (isset($payload['name'])) $project->setName($payload['name']);
        if (isset($payload['description'])) $project->setDescription($payload['description']);
        if (isset($payload['status'])) $project->setStatus($payload['status']);
        if (isset($payload['priority'])) $project->setPriority($payload['priority']);
        if (isset($payload['progress'])) $project->setProgress($payload['progress']);
        if (isset($payload['budget'])) $project->setBudget($payload['budget']);
        
        $project->setUpdatedAt(new \DateTime());
        $em->flush();

        return $this->json(['success' => true, 'data' => ['id' => $project->getId()]]);
    }
}
