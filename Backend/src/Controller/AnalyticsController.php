<?php

namespace App\Controller;

use App\Entity\Customer;
use App\Entity\Document;
use App\Entity\Incident;
use App\Entity\Opportunity;
use App\Entity\Project;
use App\Entity\Task;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/analytics', name: 'api_analytics_')]
#[IsGranted('analytics.read')]
class AnalyticsController extends AbstractController
{
    #[Route('/kpis', name: 'kpis', methods: ['GET'])]
    public function kpis(EntityManagerInterface $em): JsonResponse
    {
        $opportunities = $em->getRepository(Opportunity::class)->findAll();
        $pipelineValue = 0.0;
        $wonValue = 0.0;
        $wonCount = 0;
        foreach ($opportunities as $opp) {
            $amount = (float) ($opp->getAmount() ?? 0);
            if ($opp->getStage() === 'WON') {
                $wonValue += $amount;
                $wonCount++;
            } elseif ($opp->getStage() !== 'LOST') {
                $pipelineValue += $amount;
            }
        }

        $projects = $em->getRepository(Project::class)->findAll();
        $activeProjects = 0;
        $overdueTasks = 0;
        $now = new \DateTime();
        foreach ($projects as $project) {
            if (in_array($project->getStatus(), ['IN_PROGRESS', 'REVIEW', 'PLANNED'], true)) {
                $activeProjects++;
            }
            foreach ($project->getTasks() as $task) {
                if ($task->getStatus() !== 'DONE' && $task->getDueDate() && $task->getDueDate() < $now) {
                    $overdueTasks++;
                }
            }
        }

        $prospects = $em->getRepository(Customer::class)->count(['status' => 'PROSPECT']);
        $clients = $em->getRepository(Customer::class)->count(['status' => 'CLIENT']);
        $openIncidents = $em->getRepository(Incident::class)->count(['status' => 'OPEN']);
        $publishedDocs = $em->getRepository(Document::class)->count(['status' => 'PUBLISHED']);
        $draftDocs = $em->getRepository(Document::class)->count(['status' => 'DRAFT']);
        $openTasks = $em->getRepository(Task::class)->count(['status' => 'TODO']);

        return $this->json([
            'success' => true,
            'data' => [
                'crm' => [
                    'prospects' => $prospects,
                    'clients' => $clients,
                    'opportunities' => count($opportunities),
                    'wonOpportunities' => $wonCount,
                    'pipelineValue' => $pipelineValue,
                    'wonValue' => $wonValue,
                ],
                'workspace' => [
                    'projects' => count($projects),
                    'activeProjects' => $activeProjects,
                    'openTasks' => $openTasks,
                    'overdueTasks' => $overdueTasks,
                ],
                'knowledge' => [
                    'published' => $publishedDocs,
                    'drafts' => $draftDocs,
                ],
                'it' => [
                    'openIncidents' => $openIncidents,
                ],
                'generatedAt' => (new \DateTimeImmutable())->format(\DateTimeInterface::ATOM),
            ],
        ]);
    }
}
