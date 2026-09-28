<?php

namespace App\Event;

use App\Entity\AuditLog;

/**
 * L'IA a proposé une recommandation.
 *
 * Règle structurante du projet : **une recommandation IA n'est jamais exécutée
 * automatiquement**. Cet événement annonce une *proposition*, et c'est
 * volontairement le seul point d'entrée du circuit : il produit une trace et
 * une notification, rien de plus. L'exécution passe obligatoirement par la
 * validation humaine, qui émettra son propre événement.
 *
 * Aucune entité ne porte la recommandation : elle est décrite par son contexte
 * (projet, tâche, type) et son contenu, le tout conservé en clair dans le
 * journal d'audit pour que la décision humaine puisse être comprise plus tard.
 */
class AiRecommendationProposedEvent extends DomainEvent
{
    public const NAME = 'ai.recommendation_proposed';

    public const KIND_TASK_SUGGESTION = 'TASK_SUGGESTION';
    public const KIND_RISK = 'RISK';
    public const KIND_PREDICTION = 'PREDICTION';

    /**
     * @param array<string, mixed> $payload Contenu de la proposition, tel que renvoyé par le service IA
     */
    public function __construct(
        private readonly string $kind,
        private readonly string $summary,
        private readonly ?int $projectId = null,
        private readonly ?int $taskId = null,
        private readonly ?float $confidence = null,
        private readonly array $payload = []
    ) {
    }

    public function getKind(): string
    {
        return $this->kind;
    }

    public function getProjectId(): ?int
    {
        return $this->projectId;
    }

    public function getTaskId(): ?int
    {
        return $this->taskId;
    }

    public function getConfidence(): ?float
    {
        return $this->confidence;
    }

    /**
     * @return array<string, mixed>
     */
    public function getPayload(): array
    {
        return $this->payload;
    }

    public function getSummary(): string
    {
        $confidence = $this->confidence !== null
            ? sprintf(' (confiance %d %%)', (int) round($this->confidence * 100))
            : '';

        $project = $this->projectId !== null ? ' projet #' . $this->projectId : '';

        return sprintf(
            'Recommandation IA de type %s proposée%s : %s%s',
            $this->kind,
            $project !== '' ? ' pour' . $project : '',
            $this->summary,
            $confidence
        );
    }

    public function getAuditCategory(): string
    {
        return AuditLog::CATEGORY_AI;
    }

    public function getTargetType(): string
    {
        return 'AiRecommendation';
    }

    public function getTargetId(): ?string
    {
        return $this->taskId !== null ? (string) $this->taskId : null;
    }
}
