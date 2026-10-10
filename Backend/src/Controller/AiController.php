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

    #[Route('/system-chat', name: 'api_ai_system_chat', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function systemChat(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];
        $message = trim((string) ($data['message'] ?? ''));
        if ($message === '') return $this->json(['error' => 'Le message est obligatoire.'], 400);
        try {
            $result = $this->aiService->chat($message, $data['conversation_id'] ?? null, [
                'scope' => 'AZ PULSE — assistance interne administration et pilotage système',
                'user_id' => (string) $this->getUser()->getId(),
                'user_email' => $this->getUser()->getUserIdentifier(),
                'user_role' => $this->getUser()->hasRoleCode('SUPER_ADMIN') ? 'SUPER_ADMIN' : 'ADMIN',
                'system_context' => 'Répondre uniquement sur les opérations, modules et données AZ PULSE. Ne pas inventer de métriques ; demander le contexte manquant.',
            ]);
            return $this->json($result);
        } catch (\Throwable $e) {
            return $this->json(['error' => 'Le service IA est indisponible.', 'details' => $e->getMessage()], 503);
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
