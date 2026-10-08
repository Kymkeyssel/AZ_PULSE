<?php

namespace App\Controller;

use App\Entity\Customer;
use App\Entity\Incident;
use App\Entity\Opportunity;
use App\Entity\Permission;
use App\Entity\Project;
use App\Entity\Role;
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

        // ── Référentiel RBAC ─────────────────────────────────────────────
        // L'écran de supervision affichait des nombres saisis à la main
        // (rôles, permissions, sessions). On les calcule ici pour qu'un
        // écart entre le catalogue déclaré et la base reste visible.
        $roleCount    = $em->getRepository(Role::class)->count([]);
        $permissionCount = $em->getRepository(Permission::class)->count([]);

        // ── Sessions actives (jetons d'API non expirés) ─────────────────
        $activeTokens = (int) $em->getConnection()->fetchOne(
            'SELECT COUNT(*) FROM api_tokens WHERE expires_at > NOW()'
        );

        // ── Effectif par rôle ────────────────────────────────────────────
        $rowsByRole = $em->getConnection()->fetchAllAssociative(
            'SELECT r.code, r.label, COUNT(ur.user_id) AS total
             FROM roles r
             LEFT JOIN user_roles ur ON ur.role_id = r.id
             GROUP BY r.code, r.label
             ORDER BY r.code ASC'
        );
        $usersByRole = array_map(fn(array $r) => [
            'code'  => $r['code'],
            'label' => $r['label'],
            'total' => (int) $r['total'],
        ], $rowsByRole);

        // ── Journal d'audit : dernières actions de supervision ───────────
        $recentAudit = array_map(
            fn(array $r) => [
                'action'    => $r['action'],
                'actor'     => $r['actor_email'],
                'severity'  => $r['severity'],
                'createdAt' => $r['created_at'],
            ],
            $em->getConnection()->fetchAllAssociative(
                "SELECT action, actor_email, severity, created_at
                 FROM audit_logs
                 ORDER BY created_at DESC
                 LIMIT 6"
            )
        );

        return $this->json([
            'success' => true,
            'data' => [
                'users' => $userCount,
                'customers' => $customerCount,
                'projects' => $projectCount,
                'openIncidents' => $incidentCount,
                'totalRevenue' => $wonOpportunityAmount ?? 0,
                'roles' => $roleCount,
                'permissions' => $permissionCount,
                'activeSessions' => $activeTokens,
                'usersByRole' => $usersByRole,
                'recentAudit' => $recentAudit,
            ]
        ]);
    }

    #[Route('/admin', name: 'admin', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function adminStats(EntityManagerInterface $em): JsonResponse
    {
        // ── Utilisateurs ──────────────────────────────────────────────────
        $activeUsers   = $em->getRepository(User::class)->count(['status' => 'ACTIVE']);
        $pendingUsers  = $em->getRepository(User::class)->count(['status' => 'PENDING_APPROVAL']);
        $rejectedUsers = $em->getRepository(User::class)->count(['status' => 'REJECTED']);
        $blockedUsers  = $em->getRepository(User::class)->count(['status' => 'BLOCKED']);
        $totalUsers    = $em->getRepository(User::class)->count([]);

        // ── Demandes d'accès ──────────────────────────────────────────────
        $conn = $em->getConnection();

        $reqPending  = (int) $conn->fetchOne('SELECT COUNT(*) FROM access_requests WHERE status = ?', ['PENDING']);
        $reqApproved = (int) $conn->fetchOne('SELECT COUNT(*) FROM access_requests WHERE status = ?', ['APPROVED']);
        $reqRejected = (int) $conn->fetchOne('SELECT COUNT(*) FROM access_requests WHERE status = ?', ['REJECTED']);
        $totalReqs   = $reqPending + $reqApproved + $reqRejected;

        // ── Dernières demandes récentes (5 max) ───────────────────────────
        $recentRows = $conn->fetchAllAssociative(
            'SELECT ar.id, ar.requested_domain, ar.status, ar.created_at,
                    u.first_name, u.last_name, u.email
             FROM access_requests ar
             JOIN users u ON u.id = ar.user_id
             ORDER BY ar.created_at DESC
             LIMIT 5'
        );

        $recentRequests = array_map(fn($row) => [
            'id'              => $row['id'],
            'requestedDomain' => $row['requested_domain'],
            'status'          => $row['status'],
            'createdAt'       => $row['created_at'],
            'user'            => [
                'fullName' => trim($row['first_name'] . ' ' . $row['last_name']),
                'email'    => $row['email'],
            ],
        ], $recentRows);

        // ── Taux d'approbation ────────────────────────────────────────────
        $approvalRate = $totalReqs > 0
            ? round(($reqApproved / $totalReqs) * 100, 1)
            : 0;

        // ── Indicateurs métier (référentiels opérationnels) ─────────────
        $wonValue = $em->createQueryBuilder()
            ->select('SUM(o.amount)')
            ->from(Opportunity::class, 'o')
            ->where('o.stage = :stage')
            ->setParameter('stage', 'WON')
            ->getQuery()
            ->getSingleScalarResult();

        $projects = [
            'total'     => $em->getRepository(Project::class)->count([]),
            'inProgress' => $em->getRepository(Project::class)->count(['status' => 'IN_PROGRESS']),
        ];

        // ── Santé du système ─────────────────────────────────────────────
        // Elle était annoncée en dur à « OK » : l'écran affichait un feu vert
        // même base injoignable. On interroge réellement la base plutôt que de
        // mentir, et l'interface affiche ce qui a été mesuré.
        try {
            $conn->executeQuery('SELECT 1');
            $systemStatus = 'OK';
        } catch (\Throwable $e) {
            $systemStatus = 'DEGRADED';
        }

        return $this->json([
            'success' => true,
            'data' => [
                // Utilisateurs
                'totalUsers'    => $totalUsers,
                'activeUsers'   => $activeUsers,
                'pendingUsers'  => $pendingUsers,
                'rejectedUsers' => $rejectedUsers,
                'blockedUsers'  => $blockedUsers,

                // Demandes d'accès
                'requests' => [
                    'total'        => $totalReqs,
                    'pending'      => $reqPending,
                    'approved'     => $reqApproved,
                    'rejected'     => $reqRejected,
                    'approvalRate' => $approvalRate,
                ],

                // Activité récente
                'recentRequests' => $recentRequests,

                // Activité métier
                'revenue'       => (float) ($wonValue ?? 0),
                'customers'     => $em->getRepository(Customer::class)->count([]),
                'projects'      => $projects,
                'openIncidents' => $em->getRepository(Incident::class)->count(['status' => 'OPEN']),

                // Système
                'systemStatus' => $systemStatus,
                'generatedAt'  => (new \DateTimeImmutable())->format(DATE_ATOM),
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
    public function itStats(EntityManagerInterface $em, \App\Service\GlpiService $glpiService): JsonResponse
    {
        // §8 fait de GLPI la source de vérité du parc informatique. La table
        // `equipment` locale n'est qu'uncache périmé : la compter en repli
        // produirait un chiffre différent de celui de GLPI, sans aucun signal
        // permettant de les distinguer. On préfère donc une erreur franche à
        // un mensonge silencieux.
        try {
            $computers = $glpiService->getComputers();
        } catch (\Throwable $e) {
            // `\Throwable` et non `\Exception` : une réponse GLPI malformée
            // lève un TypeError, que `\Exception` ne capture pas et qui
            // remonterait en 500 sans message exploitable.
            return $this->json([
                'success' => false,
                'error' => [
                    'code' => 'GLPI_UNAVAILABLE',
                    'message' => "L'inventaire GLPI est injoignable. Le parc informatique ne peut pas être comptabilisé : aucun chiffre local n'est utilisé en repli, la donnée n'a pas de source de vérité disponible.",
                ],
            ], 503);
        }

        $openIncidents = $em->getRepository(Incident::class)->count(['status' => 'OPEN']);
        $inProgressIncidents = $em->getRepository(Incident::class)->count(['status' => 'IN_PROGRESS']);

        return $this->json([
            'success' => true,
            'data' => [
                'totalEquipments' => count($computers),
                'openIncidents' => $openIncidents,
                'inProgressIncidents' => $inProgressIncidents,
                // La source est annoncée explicitement : un lecteur doit
                // pouvoir savoir d'où vient chaque chiffre qu'on lui montre.
                'totalEquipmentsSource' => 'glpi',
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
