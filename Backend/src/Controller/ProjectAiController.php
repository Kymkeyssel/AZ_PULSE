<?php

namespace App\Controller;

use App\Entity\Project;
use App\Security\Voter\ProjectVoter;
use App\Service\AI\AIService;
use App\Service\AI\ProjectContextBuilder;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/projects')]
class ProjectAiController extends AbstractController
{
    public function __construct(
        private AIService $aiService,
        private ProjectContextBuilder $contextBuilder
    ) {}

    #[Route('/{id}/ai-analysis', name: 'api_project_ai_analyze', methods: ['POST'])]
    #[IsGranted(ProjectVoter::ANALYZE, subject: 'project')]
    public function analyze(Request $request, Project $project): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $question = $data['question'] ?? 'Analyse générale du projet et de ses risques.';

        // Construire le contexte sécurisé côté Symfony
        $context = $this->contextBuilder->build($project);

        // Appeler FastAPI
        try {
            $analysisResult = $this->aiService->analyzeProject($project->getId(), $question, $context);
            return $this->json($analysisResult);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Erreur lors de l\'appel au service IA.', 'details' => $e->getMessage()], 500);
        }
    }
}
