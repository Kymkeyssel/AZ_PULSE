<?php

namespace App\Controller;

use App\Entity\Customer;
use App\Entity\Project;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/client/portal', name: 'api_client_portal_')]
final class ClientPortalController extends AbstractController
{
    #[Route('', name: 'read', methods: ['GET'])]
    public function read(EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User || !$user->hasRoleCode('CLIENT')) {
            return $this->json(['success' => false, 'error' => 'Accès réservé aux clients'], 403);
        }

        $customer = $em->getRepository(Customer::class)->createQueryBuilder('c')
            ->andWhere('LOWER(c.email) = :email')
            ->setParameter('email', strtolower($user->getEmail()))
            ->getQuery()->getOneOrNullResult();

        if (!$customer) {
            return $this->json(['success' => false, 'error' => 'Aucune fiche client ne correspond à ce compte'], 404);
        }

        $projects = $em->getRepository(Project::class)->findBy(['customer' => $customer], ['createdAt' => 'DESC']);
        $data = array_map(static fn(Project $project) => [
            'id' => $project->getId(),
            'name' => $project->getName(),
            'description' => $project->getDescription(),
            'status' => $project->getStatus(),
            'progress' => $project->getProgress(),
            'startDate' => $project->getStartDate()?->format(\DateTimeInterface::ATOM),
            'endDate' => $project->getEndDate()?->format(\DateTimeInterface::ATOM),
            'manager_name' => $project->getManager()?->getFullName(),
            'tasks' => $project->getTasks()->map(static fn($task) => [
                'id' => $task->getId(),
                'title' => $task->getTitle(),
                'status' => $task->getStatus(),
                'progress' => $task->getProgress(),
                'dueDate' => $task->getDueDate()?->format(\DateTimeInterface::ATOM),
            ])->toArray(),
        ], $projects);

        return $this->json(['success' => true, 'data' => [
            'customer' => [
                'id' => $customer->getId(),
                'name' => $customer->getName(),
                'email' => $customer->getEmail(),
                'phone' => $customer->getPhone(),
                'industry' => $customer->getIndustry(),
                'status' => $customer->getStatus(),
            ],
            'projects' => $data,
        ]]);
    }
}
