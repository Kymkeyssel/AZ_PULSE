<?php

namespace App\Controller;

use App\Entity\Opportunity;
use App\Entity\User;
use App\Repository\OpportunityRepository;
use App\Repository\ReminderRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

/**
 * Vue pipeline du CRM.
 *
 * Endpoint unique alimentant le tableau Kanban : le navigateur reçoit les
 * opportunités déjà regroupées par étape, avec les totaux. Regrouper côté
 * client obligerait à tout télécharger, alors que le filtre « mes affaires »
 * est souvent plus restrictif que l'ensemble du portefeuille.
 */
#[Route('/api/crm')]
class CrmPipelineController extends AbstractController
{
    /** Libellés français des étapes, pour éviter de les dupliquer dans le front. */
    private const STAGE_LABELS = [
        'PROSPECTING' => 'Prospection',
        'QUALIFICATION' => 'Qualification',
        'PROPOSAL' => 'Proposition',
        'NEGOTIATION' => 'Négociation',
        'WON' => 'Gagné',
        'LOST' => 'Perdu',
    ];

    public function __construct(
        private readonly OpportunityRepository $opportunityRepository,
        private readonly ReminderRepository $reminderRepository,
    ) {
    }

    /**
     * Pipeline groupé par étape, filtré par défaut sur le collaborateur
     * connecté : un commercial voit son portefeuille, pas celui des autres.
     */
    #[Route('/pipeline', name: 'api_crm_pipeline', methods: ['GET'])]
    #[IsGranted('crm.read')]
    public function pipeline(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        $scope = $request->query->get('scope', 'mine');
        $includeClosed = $request->query->getBoolean('includeClosed');

        // Le portefeuille complet est réservé à l'encadrement (crm.manage).
        $ownerId = ($scope === 'all' && $this->isGranted('crm.manage'))
            ? null
            : $user->getId()->toRfc4122();

        $opportunities = $this->opportunityRepository->findForPipeline($ownerId, $includeClosed);

        // Prépare toutes les colonnes, y compris celles qui seraient vides :
        // une colonne disparaissant selon la donnée, le tableau « saute ».
        $stages = OpportunityRepository::STAGES;
        if (!$includeClosed) {
            $stages = OpportunityRepository::OPEN_STAGES;
        }

        $columns = [];
        foreach ($stages as $stage) {
            $columns[] = [
                'code' => $stage,
                'label' => self::STAGE_LABELS[$stage] ?? $stage,
                'totalAmount' => 0.0,
                'weightedAmount' => 0.0,
                'count' => 0,
                'opportunities' => [],
            ];
        }

        $byCode = array_column($columns, null, 'code');

        $totalAmount = 0.0;

        foreach ($opportunities as $opportunity) {
            $stage = $opportunity->getStage();
            if (!isset($byCode[$stage])) {
                continue;
            }

            $amount = (float) ($opportunity->getAmount() ?? 0);
            $probability = $opportunity->getProbability() ?? 0;

            $totalAmount += $amount;

            $byCode[$stage]['count']++;
            $byCode[$stage]['totalAmount'] += $amount;
            $byCode[$stage]['weightedAmount'] += $amount * $probability / 100;
            $byCode[$stage]['opportunities'][] = $this->formatOpportunity($opportunity);
        }

        return $this->json([
            'success' => true,
            'data' => [
                'scope' => $ownerId === null ? 'all' : 'mine',
                'columns' => array_values($byCode),
                'totals' => [
                    'count' => count($opportunities),
                    'totalAmount' => $totalAmount,
                    'weightedAmount' => $this->opportunityRepository->sumWeightedAmount($ownerId),
                ],
            ],
        ]);
    }

    /**
     * Indicateurs de l'accueil collaborateur.
     */
    #[Route('/stats', name: 'api_crm_stats', methods: ['GET'])]
    #[IsGranted('crm.read')]
    public function stats(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $userId = $user->getId()->toRfc4122();

        $open = $this->opportunityRepository->findForPipeline($userId);

        return $this->json([
            'success' => true,
            'data' => [
                'openOpportunities' => count($open),
                'weightedAmount' => $this->opportunityRepository->sumWeightedAmount($userId),
                'reminders' => $this->reminderRepository->countUpcoming($userId),
            ],
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function formatOpportunity(Opportunity $opportunity): array
    {
        return [
            'id' => $opportunity->getId(),
            'title' => $opportunity->getTitle(),
            'amount' => $opportunity->getAmount() !== null ? (float) $opportunity->getAmount() : null,
            'stage' => $opportunity->getStage(),
            'probability' => $opportunity->getProbability(),
            'expectedCloseDate' => $opportunity->getExpectedCloseDate()?->format('Y-m-d'),
            'customer' => $opportunity->getCustomer() ? [
                'id' => $opportunity->getCustomer()->getId(),
                'name' => $opportunity->getCustomer()->getName(),
            ] : null,
            'owner' => $opportunity->getOwner() ? [
                'id' => $opportunity->getOwner()->getId()->toRfc4122(),
                'name' => $opportunity->getOwner()->getFullName(),
            ] : null,
            'createdAt' => $opportunity->getCreatedAt()?->format(\DateTimeInterface::ATOM),
        ];
    }
}
