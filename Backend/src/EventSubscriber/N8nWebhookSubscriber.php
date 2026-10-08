<?php

namespace App\EventSubscriber;

use App\Event\AiRecommendationProposedEvent;
use App\Event\IncidentOpenedEvent;
use App\Event\OpportunityWonEvent;
use App\Event\ProjectCreatedEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Psr\Log\LoggerInterface;

class N8nWebhookSubscriber implements EventSubscriberInterface
{
    private string $n8nWebhookUrl;

    public function __construct(
        private HttpClientInterface $httpClient,
        private LoggerInterface $logger,
        string $n8nWebhookUrl = 'http://localhost:5678/webhook/az-pulse-events'
    ) {
        // En prod, l'URL viendrait des variables d'environnement.
        // Pour le MVP local avec le docker-compose, c'est généralement localhost:5678.
        $this->n8nWebhookUrl = $_ENV['N8N_WEBHOOK_URL'] ?? $n8nWebhookUrl;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            AiRecommendationProposedEvent::NAME => 'onAiRecommendation',
            ProjectCreatedEvent::NAME => 'onProjectCreated',
            IncidentOpenedEvent::NAME => 'onIncidentOpened',
            OpportunityWonEvent::NAME => 'onOpportunityWon',
        ];
    }

    public function onAiRecommendation(AiRecommendationProposedEvent $event): void
    {
        // On n'envoie à n8n que les recommandations ayant une haute confiance (ex: > 80%)
        // ou si elles nécessitent une action d'escalade (risque).
        if ($event->getKind() === AiRecommendationProposedEvent::KIND_RISK || $event->getConfidence() >= 0.8) {
            $this->sendToN8n('ai_recommendation', [
                'kind' => $event->getKind(),
                'summary' => $event->getSummary(),
                'projectId' => $event->getProjectId(),
                'payload' => $event->getPayload()
            ]);
        }
    }

    public function onProjectCreated(ProjectCreatedEvent $event): void
    {
        $this->sendToN8n('project_created', [
            'projectId' => $event->getProject()->getId(),
            'name' => $event->getProject()->getName(),
            'manager' => $event->getProject()->getManager()?->getEmail()
        ]);
    }

    public function onIncidentOpened(IncidentOpenedEvent $event): void
    {
        $this->sendToN8n('incident_opened', [
            'incidentId' => $event->getIncident()->getId(),
            'title' => $event->getIncident()->getTitle(),
            'priority' => $event->getIncident()->getPriority()
        ]);
    }

    public function onOpportunityWon(OpportunityWonEvent $event): void
    {
        $opportunity = $event->getOpportunity();
        $this->sendToN8n('opportunity_won', [
            'opportunityId' => $opportunity->getId(),
            'title' => $opportunity->getTitle(),
            'amount' => $opportunity->getAmount(),
            'customer' => $opportunity->getCustomer()?->getName(),
            'owner' => $opportunity->getOwner()?->getEmail(),
        ]);
    }

    private function sendToN8n(string $eventType, array $data): void
    {
        try {
            $response = $this->httpClient->request('POST', $this->n8nWebhookUrl, [
                'json' => [
                    'event' => $eventType,
                    'timestamp' => (new \DateTime())->format(\DateTimeInterface::ATOM),
                    'data' => $data
                ],
                'timeout' => 2 // Ne pas bloquer le thread Symfony si n8n est down
            ]);

            // On déclenche la requête asynchrone (Symfony HttpClient est asynchrone par défaut)
            $response->getStatusCode();
        } catch (\Exception $e) {
            $this->logger->warning('Impossible de contacter n8n : ' . $e->getMessage());
        }
    }
}
