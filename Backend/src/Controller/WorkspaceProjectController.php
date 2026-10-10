<?php

namespace App\Controller;

use App\Entity\Project;
use App\Entity\Customer;
use App\Entity\User;
use App\Event\ProjectCreatedEvent;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;

#[Route('/api/workspace/projects', name: 'api_workspace_projects_')]
class WorkspaceProjectController extends AbstractController
{
    #[Route('/team', name: 'team', methods: ['GET'])]
    public function team(EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$this->isGranted('SUPER_ADMIN') && !$this->isGranted('workspace.write') && !$user?->hasRoleCode('RESPONSABLE_WORKSPACE')) {
            return $this->json(['success' => false, 'error' => 'Access Denied'], 403);
        }
        $members = $em->getRepository(User::class)->findBy(['status' => User::STATUS_ACTIVE], ['lastName' => 'ASC']);
        return $this->json(['success' => true, 'data' => array_map(static fn(User $member) => [
            'id' => $member->getId()->toRfc4122(),
            'name' => $member->getFirstName() . ' ' . $member->getLastName(),
            'email' => $member->getEmail(),
        ], $members)]);
    }

    #[Route('', name: 'list', methods: ['GET'])]
    public function list(EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $qb = $em->getRepository(Project::class)->createQueryBuilder('p');

        $seesAll = $this->isGranted('SUPER_ADMIN')
            || $this->isGranted('workspace.manage')
            // Les responsables CRM ont un droit de lecture transverse sur
            // Workspace : ils doivent pouvoir suivre les projets créés après
            // la signature d'une affaire, même si un autre commercial en est
            // le chef de projet.
            || $user->hasRoleCode('RESPONSABLE_CRM')
            // Le responsable Workspace pilote l'ensemble du portefeuille, y
            // compris les projets générés depuis le CRM et gérés au quotidien
            // par leur propriétaire commercial.
            || $user->hasRoleCode('RESPONSABLE_WORKSPACE')
            || $user->hasRoleCode('ADMIN');

        if ($user->hasRoleCode('CLIENT')) {
            $qb->join('p.customer', 'c')
                ->andWhere('LOWER(c.email) = :email')
                ->setParameter('email', strtolower((string) $user->getEmail()));
        } elseif (!$seesAll) {
            $qb->leftJoin('p.members', 'm')
               ->andWhere('p.manager = :user OR m = :user')
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
            'manager_name' => $p->getManager()?->getFirstName() . ' ' . $p->getManager()?->getLastName(),
            'members' => $p->getMembers()->map(fn($m) => [
                'id' => $m->getId()->toRfc4122(),
                'name' => $m->getFirstName() . ' ' . $m->getLastName(),
            ])->toArray(),
            'tasks_count' => $p->getTasks()->count(),
            'description' => $p->getDescription(),
        ], $projects);

        return $this->json(['success' => true, 'data' => $data]);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em,
        EventDispatcherInterface $eventDispatcher
    ): JsonResponse {
        if (!$this->isGranted('SUPER_ADMIN') && !$this->isGranted('workspace.write') && !$this->getUser()?->hasRoleCode('RESPONSABLE_WORKSPACE')) {
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

        // Le chef de projet est prévenu qu'il a une charge à piloter. À noter :
        // `ProjectCreationSubscriber` produit aussi un projet à partir d'une
        // opportunité gagnée, et cet événement couvre ce chemin-là comme le
        // présent. Ce n'est pas un doublon — l'un crée, l'autre prévient.
        $eventDispatcher->dispatch(
            (new ProjectCreatedEvent($project))->withActor($project->getManager()),
            ProjectCreatedEvent::NAME
        );

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
            'manager_id' => $project->getManager()?->getId()->toRfc4122(),
            'manager_name' => $project->getManager()?->getFirstName() . ' ' . $project->getManager()?->getLastName(),
            'members' => $project->getMembers()->map(fn($m) => [
                'id' => $m->getId()->toRfc4122(),
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
        if (!$this->isGranted('SUPER_ADMIN') && !$this->isGranted('workspace.write') && !$user->hasRoleCode('RESPONSABLE_WORKSPACE')) {
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

    #[Route('/{id}/members', name: 'members_add', methods: ['POST'])]
    public function addMember(Project $project, Request $request, EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $canManage = $this->isGranted('SUPER_ADMIN') || $this->isGranted('workspace.write')
            || $user->hasRoleCode('RESPONSABLE_WORKSPACE') || $project->getManager() === $user;
        if (!$canManage) return $this->json(['success' => false, 'error' => 'Access Denied'], 403);

        $payload = json_decode($request->getContent(), true) ?: [];
        $member = $em->getRepository(User::class)->find($payload['user_id'] ?? null);
        if (!$member || $member->getStatus() !== User::STATUS_ACTIVE) {
            return $this->json(['success' => false, 'error' => 'Utilisateur actif introuvable'], 404);
        }
        $project->addMember($member);
        $em->flush();
        return $this->json(['success' => true, 'data' => [
            'id' => $member->getId()->toRfc4122(),
            'name' => $member->getFirstName() . ' ' . $member->getLastName(),
        ]], 201);
    }
}
