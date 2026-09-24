<?php

namespace App\Controller;

use App\Entity\Customer;
use App\Entity\Equipment;
use App\Entity\Incident;
use App\Entity\Opportunity;
use App\Entity\Project;
use App\Entity\Task;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/dashboard', name: 'api_dashboard_')]
class DashboardController extends AbstractController
{
    #[Route('/super-admin', name: 'super_admin', methods: ['GET'])]
    #[IsGranted('ROLE_SUPER_ADMIN')]
    public function superAdminStats(EntityManagerInterface $em): JsonResponse
    {
        $userCount = $em->getRepository(User::class)->count([]);
        $customerCount = $em->getRepository(Customer::class)->count([]);
        $projectCount = $em->getRepository(Project::class)->count([]);
        $incidentCount = $em->getRepository(Incident::class)->count(['status' => 'OPEN']);
        $wonOpportunityAmount = $em->createQueryBuilder()
            ->select('SUM(o.amount)')
            ->from(Opportunity::class, 'o')
            ->where('o.stage = :stage')
            ->setParameter('stage', 'WON')
            ->getQuery()
            ->getSingleScalarResult();

        return $this->json([
            'success' => true,
            'data' => [
                'users' => $userCount,
                'customers' => $customerCount,
                'projects' => $projectCount,
                'openIncidents' => $incidentCount,
                'totalRevenue' => $wonOpportunityAmount ?? 0,
            ]
        ]);
    }

    #[Route('/admin', name: 'admin', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function adminStats(EntityManagerInterface $em): JsonResponse
    {
        // Admin stats can be similar or focused on security/users
        $activeUsers = $em->getRepository(User::class)->count(['status' => 'ACTIVE']);
        $pendingUsers = $em->getRepository(User::class)->count(['status' => 'PENDING_APPROVAL']);
        
        return $this->json([
            'success' => true,
            'data' => [
                'activeUsers' => $activeUsers,
                'pendingRequests' => $pendingUsers,
                'systemStatus' => 'OK', // placeholder
            ]
        ]);
    }

    #[Route('/workspace', name: 'workspace', methods: ['GET'])]
    public function workspaceStats(EntityManagerInterface $em): JsonResponse
    {
        $projectCount = $em->getRepository(Project::class)->count([]);
        $activeProjectCount = $em->getRepository(Project::class)->count(['status' => 'IN_PROGRESS']);
        $completedProjectCount = $em->getRepository(Project::class)->count(['status' => 'COMPLETED']);
        
        $myTasks = $em->getRepository(Task::class)->count([
            'assignee' => $this->getUser(),
            'status' => 'TODO'
        ]);

        return $this->json([
            'success' => true,
            'data' => [
                'totalProjects' => $projectCount,
                'activeProjects' => $activeProjectCount,
                'completedProjects' => $completedProjectCount,
                'myOpenTasks' => $myTasks,
            ]
        ]);
    }

    #[Route('/crm', name: 'crm', methods: ['GET'])]
    public function crmStats(EntityManagerInterface $em): JsonResponse
    {
        $opportunities = $em->getRepository(Opportunity::class)->findAll();
        
        $pipelineValue = 0;
        $wonValue = 0;
        $wonCount = 0;
        $totalCount = count($opportunities);

        foreach ($opportunities as $opp) {
            if ($opp->getStage() === 'WON') {
                $wonValue += (float) $opp->getAmount();
                $wonCount++;
            } else if ($opp->getStage() !== 'LOST') {
                $pipelineValue += (float) $opp->getAmount();
            }
        }

        return $this->json([
            'success' => true,
            'data' => [
                'totalOpportunities' => $totalCount,
                'wonOpportunities' => $wonCount,
                'pipelineValue' => $pipelineValue,
                'wonValue' => $wonValue,
            ]
        ]);
    }

    #[Route('/it', name: 'it', methods: ['GET'])]
    public function itStats(EntityManagerInterface $em): JsonResponse
    {
        $equipmentCount = $em->getRepository(Equipment::class)->count([]);
        $openIncidents = $em->getRepository(Incident::class)->count(['status' => 'OPEN']);
        $inProgressIncidents = $em->getRepository(Incident::class)->count(['status' => 'IN_PROGRESS']);

        return $this->json([
            'success' => true,
            'data' => [
                'totalEquipments' => $equipmentCount,
                'openIncidents' => $openIncidents,
                'inProgressIncidents' => $inProgressIncidents,
                'serverStatus' => 'Online',
            ]
        ]);
    }
    #[Route('/responsable', name: 'responsable', methods: ['GET'])]
    public function responsableStats(EntityManagerInterface $em): JsonResponse
    {
        $myTasks = $em->getRepository(Task::class)->count(['assignee' => $this->getUser()]);
        $completedTasks = $em->getRepository(Task::class)->count(['assignee' => $this->getUser(), 'status' => 'COMPLETED']);
        
        return $this->json([
            'success' => true,
            'data' => [
                'assignedTasks' => $myTasks,
                'completedTasks' => $completedTasks,
                'hoursWorked' => 32, // placeholder
            ]
        ]);
    }

    #[Route('/apprenant', name: 'apprenant', methods: ['GET'])]
    public function apprenantStats(): JsonResponse
    {
        return $this->json([
            'success' => true,
            'data' => [
                'activeCourses' => 3,
                'averageGrade' => '15.5 / 20',
                'nextClass' => "Aujourd'hui, 14:00"
            ]
        ]);
    }

    #[Route('/parent', name: 'parent', methods: ['GET'])]
    public function parentStats(): JsonResponse
    {
        return $this->json([
            'success' => true,
            'data' => [
                'enrolledChildren' => 1,
                'balance' => 0,
            ]
        ]);
    }
}
