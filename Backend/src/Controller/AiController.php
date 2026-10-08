<?php

namespace App\Controller;

use App\Service\AI\AIService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/ai')]
#[IsGranted('IS_AUTHENTICATED_FULLY')]
class AiController extends AbstractController
{
    public function __construct(
        private AIService $aiService
    ) {}

    #[Route('/chat', name: 'api_ai_chat', methods: ['POST'])]
    public function chat(Request $request): JsonResponse
    {
        $user = $this->getUser();
        $data = json_decode($request->getContent(), true) ?? [];
        $message = trim($data['message'] ?? '');

        if (empty($message)) {
            return $this->json(['error' => 'Le champ message est obligatoire.'], 400);
        }

        $conversationId = $data['conversation_id'] ?? null;
        $clientContext = $data['context'] ?? [];

        // Enrichir le contexte sécurisé avec les rôles et l'identité
        $enrichedContext = array_merge($clientContext, [
            'user_id' => method_exists($user, 'getId') ? $user->getId() : null,
            'user_email' => $user->getUserIdentifier(),
            'user_roles' => $user->getRoles(),
            'user_role' => $user->getRoles()[0] ?? 'ROLE_USER',
        ]);

        try {
            $result = $this->aiService->chat($message, $conversationId, $enrichedContext);
            return $this->json($result);
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Erreur lors de la communication avec le moteur IA.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    #[Route('/insights', name: 'api_ai_insights', methods: ['POST'])]
    public function insights(Request $request): JsonResponse
    {
        $user = $this->getUser();
        $data = json_decode($request->getContent(), true) ?? [];
        $metrics = $data['metrics'] ?? [];
        $scope = $data['scope'] ?? 'CRM & Performance';

        $enrichedData = array_merge($metrics, [
            'scope' => $scope,
            'user_role' => $user->getRoles()[0] ?? 'ROLE_USER',
        ]);

        try {
            $result = $this->aiService->getAnalyticsInsights($enrichedData);
            return $this->json($result);
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Erreur lors de la génération des insights IA.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    #[Route('/recommendations', name: 'api_ai_recommendations', methods: ['POST'])]
    public function recommendations(Request $request): JsonResponse
    {
        $user = $this->getUser();
        $data = json_decode($request->getContent(), true) ?? [];
        $scope = $data['scope'] ?? 'Opérations & CRM';

        $enrichedContext = array_merge($data, [
            'user_role' => $user->getRoles()[0] ?? 'ROLE_USER',
        ]);

        try {
            $result = $this->aiService->getStrategicRecommendations($enrichedContext, $scope);
            return $this->json($result);
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Erreur lors de la génération des recommandations.',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}
