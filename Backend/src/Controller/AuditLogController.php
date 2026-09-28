<?php

namespace App\Controller;

use App\Entity\AuditLog;
use App\Repository\AuditLogRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

/**
 * Consultation du journal d'audit.
 *
 * Réservé à ceux qui ont le droit de le lire : c'est une trace nominative
 * (qui a fait quoi, depuis quelle IP) et la diffuser à tous la viderait de son
 * intérêt. L'attribut est posé sur la classe : ajouter une route ici plus tard
 * sans y penser ne doit pas ouvrir un accès.
 *
 * Comme pour les notifications, il n'existe **aucune** écriture. Ni POST, ni
 * PUT, ni DELETE : une ligne d'audit s'écrit par le code qui a commis l'action,
 * jamais depuis l'extérieur. Une API d'écriture serait la pire des portes
 * possibles — un administrateur pourrait y fabriquer une trace(accusation)
 * contre un collègue.
 */
#[Route('/api/audit')]
#[IsGranted('audit.read')]
class AuditLogController extends AbstractController
{
    public function __construct(
        private readonly AuditLogRepository $auditLogs
    ) {
    }

    #[Route('', name: 'api_audit_list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        $result = $this->auditLogs->paginate(
            page: max(1, $request->query->getInt('page', 1)),
            limit: $request->query->getInt('limit', 50),
            category: $this->clean($request->query->get('category')),
            severity: $this->clean($request->query->get('severity')),
            action: $this->clean($request->query->get('action')),
            actorEmail: $this->clean($request->query->get('actor')),
            since: $this->parseSince($request->query->get('since'))
        );

        return $this->json([
            'success' => true,
            'data'    => array_map([$this, 'format'], $result['items']),
            'meta'    => [
                'page'      => $result['page'],
                'limit'     => $result['limit'],
                'total'     => $result['total'],
                'pages'     => $result['pages'],
                'byCategory' => $this->auditLogs->countByCategory(),
            ],
        ]);
    }

    /**
     * Valeurs possibles des filtres, pour que l'interface n'invente pas de
     * libellés et que la liste reste fermée.
     */
    #[Route('/filters', name: 'api_audit_filters', methods: ['GET'])]
    public function filters(): JsonResponse
    {
        return $this->json([
            'success' => true,
            'data'    => [
                'categories' => [
                    AuditLog::CATEGORY_IAM,
                    AuditLog::CATEGORY_CRM,
                    AuditLog::CATEGORY_WORKSPACE,
                    AuditLog::CATEGORY_FORMATION,
                    AuditLog::CATEGORY_KNOWLEDGE,
                    AuditLog::CATEGORY_INFRA,
                    AuditLog::CATEGORY_AI,
                    AuditLog::CATEGORY_SECURITY,
                ],
                'severities' => [
                    AuditLog::SEVERITY_INFO,
                    AuditLog::SEVERITY_WARNING,
                    AuditLog::SEVERITY_CRITICAL,
                ],
            ],
        ]);
    }

    /**
     * Normalise une chaîne de filtre : `null` ou vide doivent vouloir dire la
     * même chose, sinon une chaîne d'URL `?category=` filtrerait sur la valeur
     * vide et renverrait un journal vide au lieu du journal entier.
     */
    private function clean(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $value = trim($value);

        return $value === '' ? null : $value;
    }

    /**
     * Date de début du filtre.
     *
     * Une valeur illisible est ignorée plutôt que fatale : une date mal saisie
     * depuis la barre d'URL ne doit pas renvoyer une erreur 500. Le journal
     * complet reste accessible en retirant le paramètre.
     */
    private function parseSince(?string $value): ?\DateTimeInterface
    {
        $value = $this->clean($value);

        if ($value === null) {
            return null;
        }

        try {
            return new \DateTimeImmutable($value);
        } catch (\Exception) {
            return null;
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function format(AuditLog $entry): array
    {
        return [
            'id'          => $entry->getId(),
            'action'      => $entry->getAction(),
            'category'    => $entry->getCategory(),
            'severity'    => $entry->getSeverity(),
            'description' => $entry->getDescription(),
            'actor'       => $entry->getActor() !== null ? [
                'id'    => (string) $entry->getActor()->getId(),
                'name'  => $entry->getActor()->getFullName(),
                'email' => $entry->getActor()->getEmail(),
            ] : null,
            // L'email est renvoyé même si le compte a été supprimé : c'est le
            // seul moyen de rattacher encore la ligne à une personne.
            'actorEmail'  => $entry->getActorEmail(),
            'actorIp'     => $entry->getActorIp(),
            'targetType'  => $entry->getTargetType(),
            'targetId'    => $entry->getTargetId(),
            'metadata'    => $entry->getMetadata(),
            'createdAt'   => $entry->getCreatedAt()->format(\DateTimeInterface::ATOM),
        ];
    }
}
