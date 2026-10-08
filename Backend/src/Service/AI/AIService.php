<?php

namespace App\Service\AI;

use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class AIService
{
    public function __construct(
        private HttpClientInterface $httpClient,
        #[Autowire(env: 'AI_SERVICE_URL')]
        private string $aiServiceUrl,
        #[Autowire(env: 'AI_SERVICE_TOKEN')]
        private string $aiServiceToken
    ) {}

    public function analyzeProject(int $projectId, string $question, array $context): array
    {
        $response = $this->httpClient->request(
            'POST',
            $this->aiServiceUrl . '/api/v1/projects/analyze',
            [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->aiServiceToken,
                    'Accept' => 'application/json',
                ],
                'json' => [
                    'project_id' => $projectId,
                    'question' => $question,
                    'context' => $context,
                ],
            ]
        );

        return $response->toArray();
    }

    public function chat(string $message, ?string $conversationId = null, array $context = []): array
    {
        $response = $this->httpClient->request(
            'POST',
            $this->aiServiceUrl . '/chat/',
            [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->aiServiceToken,
                    'Accept' => 'application/json',
                ],
                'json' => [
                    'message' => $message,
                    'conversation_id' => $conversationId,
                    'context' => $context,
                ],
            ]
        );

        return $response->toArray();
    }

    public function getAnalyticsInsights(array $data, ?string $projectId = null): array
    {
        $response = $this->httpClient->request(
            'POST',
            $this->aiServiceUrl . '/analysis/',
            [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->aiServiceToken,
                    'Accept' => 'application/json',
                ],
                'json' => [
                    'project_id' => $projectId,
                    'data' => $data,
                ],
            ]
        );

        return $response->toArray();
    }

    public function getStrategicRecommendations(array $context, string $scope = 'Général'): array
    {
        $context['scope'] = $scope;
        $response = $this->httpClient->request(
            'POST',
            $this->aiServiceUrl . '/analysis/recommendations',
            [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->aiServiceToken,
                    'Accept' => 'application/json',
                ],
                'json' => $context,
            ]
        );

        return $response->toArray();
    }
}
