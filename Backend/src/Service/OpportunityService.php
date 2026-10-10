<?php

namespace App\Service;

use App\Entity\Opportunity;
use App\Entity\Activity;
use App\Entity\Reminder;
use App\Entity\User;
use App\Event\OpportunityStageChangedEvent;
use App\Event\OpportunityWonEvent;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;

class OpportunityService
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly EventDispatcherInterface $eventDispatcher
    ) {
    }

    /**
     * Change the stage of an opportunity and apply business rules.
     */
    public function changeStage(Opportunity $opportunity, string $newStage, array $transition = [], ?User $actor = null): void
    {
        // Le document d'architecture (§15.2) retient NEW → QUALIFIED → NEGOTIATION.
        // Le CRM opérationnel conserve un pipeline plus fin ; ces alias évitent
        // deux vocabulaires incompatibles.
        $aliases = [
            'NEW' => 'PROSPECTING',
            'QUALIFIED' => 'QUALIFICATION',
        ];
        $newStage = $aliases[$newStage] ?? $newStage;

        $validStages = ['PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'];
        
        if (!in_array($newStage, $validStages, true)) {
            throw new \InvalidArgumentException(sprintf('Invalid stage "%s".', $newStage));
        }

        // L'ancienne phase est relevée avant écriture : `Opportunity` ne garde
        // que l'état courant, et une trace sans point de départ ne permet pas
        // de reconstituer l'historique d'une opportunité.
        $previousStage = $opportunity->getStage() ?? '';

        if ($previousStage === $newStage) {
            throw new \InvalidArgumentException('Cette affaire est déjà à cette étape.');
        }
        if (in_array($previousStage, ['WON', 'LOST'], true)) {
            throw new \InvalidArgumentException('Une affaire clôturée ne peut pas changer d’étape.');
        }
        $sequence = ['PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'WON'];
        $previousIndex = array_search($previousStage, $sequence, true);
        if ($previousIndex === false || ($newStage !== 'LOST' && array_search($newStage, $sequence, true) !== $previousIndex + 1)) {
            throw new \InvalidArgumentException('Suivez les étapes du pipeline dans l’ordre, une étape à la fois.');
        }

        $this->validateTransition($newStage, $transition);

        if ($newStage === 'PROPOSAL' && isset($transition['amount'])) {
            $opportunity->setAmount((string) $transition['amount']);
        } elseif ($newStage === 'WON' && isset($transition['finalAmount'])) {
            $opportunity->setAmount((string) $transition['finalAmount']);
        }
        if (!empty($transition['expectedCloseDate'])) {
            $opportunity->setExpectedCloseDate(new \DateTimeImmutable($transition['expectedCloseDate']));
        }

        if ($actor !== null) {
            $this->recordTransition($opportunity, $newStage, $transition, $actor);
        }

        $opportunity->setStage($newStage);
        $probabilities = ['QUALIFICATION' => 25, 'PROPOSAL' => 50, 'NEGOTIATION' => 75];
        if (isset($probabilities[$newStage])) $opportunity->setProbability($probabilities[$newStage]);

        if ($newStage === 'WON') {
            $this->handleWon($opportunity);
        } elseif ($newStage === 'LOST') {
            $this->handleLost($opportunity);
        }

        $this->em->flush();

        // Diffusé après le flush, pour que la trace décrive une phase
        // effectivement enregistrée. `handleWon` a déjà diffusé son propre
        // événement plus haut : `WON` produit donc deux lignes d'audit
        // distinctes — le franchissement de phase, puis le gain — ce qui est le
        // comportement voulu.
        if ($previousStage !== $newStage) {
            $this->eventDispatcher->dispatch(
                (new OpportunityStageChangedEvent($opportunity, $previousStage, $newStage))
                    ->withActor($actor)
                    ->withContext(['previousStage' => $previousStage, 'newStage' => $newStage]),
                OpportunityStageChangedEvent::NAME
            );
        }
    }

    /** @param array<string, mixed> $transition */
    private function validateTransition(string $stage, array $transition): void
    {
        $required = match ($stage) {
            'QUALIFICATION' => ['needSummary' => 12, 'nextAction' => 3, 'followUpAt' => 1],
            'PROPOSAL' => ['proposalSummary' => 12, 'amount' => 1, 'expectedCloseDate' => 1, 'nextAction' => 3, 'followUpAt' => 1],
            'NEGOTIATION' => ['decisionMaker' => 2, 'proposalSummary' => 8, 'nextAction' => 3, 'followUpAt' => 1],
            'WON' => ['contractReference' => 2, 'finalAmount' => 1, 'handoffSummary' => 12],
            'LOST' => ['lossReason' => 5],
            default => [],
        };
        $fieldLabels = [
            'needSummary' => 'le besoin du prospect', 'proposalSummary' => 'le contenu des échanges',
            'amount' => 'le montant proposé', 'finalAmount' => 'le montant signé',
            'expectedCloseDate' => 'la date de décision visée', 'nextAction' => 'la prochaine action',
            'followUpAt' => 'la date de relance', 'decisionMaker' => 'le décideur',
            'contractReference' => 'la référence du contrat', 'handoffSummary' => 'les consignes de démarrage',
            'lossReason' => 'le motif de perte',
        ];

        foreach ($required as $field => $minimumLength) {
            $value = $transition[$field] ?? null;
            $isAmount = in_array($field, ['amount', 'finalAmount'], true);
            $invalid = $value === null || !is_scalar($value) || trim((string) $value) === ''
                || ($isAmount && (!is_numeric($value) || (float) $value <= 0))
                || (!$isAmount && strlen(trim((string) $value)) < $minimumLength);
            if ($invalid) {
                throw new \InvalidArgumentException(sprintf('Renseignez %s pour valider cette étape.', $fieldLabels[$field] ?? $field));
            }
        }
        foreach (['followUpAt', 'expectedCloseDate'] as $dateField) {
            if (!empty($transition[$dateField])) {
                try { $date = new \DateTimeImmutable((string) $transition[$dateField]); }
                catch (\Throwable) { throw new \InvalidArgumentException(sprintf('La date « %s » est invalide.', $fieldLabels[$dateField] ?? $dateField)); }
                if ($dateField === 'followUpAt' && $date < new \DateTimeImmutable('today')) {
                    throw new \InvalidArgumentException('La date de relance doit être aujourd’hui ou ultérieure.');
                }
            }
        }
    }

    /** @param array<string, mixed> $transition */
    private function recordTransition(Opportunity $opportunity, string $stage, array $transition, User $actor): void
    {
        $labels = [
            'QUALIFICATION' => 'Qualification', 'PROPOSAL' => 'Proposition',
            'NEGOTIATION' => 'Négociation', 'WON' => 'Affaire gagnée', 'LOST' => 'Affaire perdue',
        ];
        $details = array_filter([
            isset($transition['needSummary']) ? 'Besoin identifié : ' . $transition['needSummary'] : null,
            isset($transition['proposalSummary']) ? 'Proposition : ' . $transition['proposalSummary'] : null,
            isset($transition['decisionMaker']) ? 'Décideur : ' . $transition['decisionMaker'] : null,
            isset($transition['contractReference']) ? 'Référence du contrat : ' . $transition['contractReference'] : null,
            isset($transition['lossReason']) ? 'Motif de perte : ' . $transition['lossReason'] : null,
            isset($transition['handoffSummary']) ? 'Passage en réalisation : ' . $transition['handoffSummary'] : null,
            isset($transition['amount']) ? 'Montant proposé : ' . $transition['amount'] : null,
            isset($transition['finalAmount']) ? 'Montant signé : ' . $transition['finalAmount'] : null,
            isset($transition['expectedCloseDate']) ? 'Clôture visée : ' . $transition['expectedCloseDate'] : null,
            isset($transition['nextAction']) ? 'Prochaine action : ' . $transition['nextAction'] : null,
        ]);
        $activity = (new Activity())
            ->setType('STAGE_TRANSITION')
            ->setDescription(($labels[$stage] ?? $stage) . "\n" . implode("\n", $details))
            ->setCustomer($opportunity->getCustomer())
            ->setOpportunity($opportunity)
            ->setAuthor($actor);
        $this->em->persist($activity);

        if (!in_array($stage, ['WON', 'LOST'], true)) {
            $followUp = (new Reminder())
                ->setTitle(trim((string) $transition['nextAction']))
                ->setDescription('Créée automatiquement lors du passage à l’étape ' . ($labels[$stage] ?? $stage) . '.')
                ->setType(Reminder::TYPE_TASK)
                ->setPriority(Reminder::PRIORITY_NORMAL)
                ->setDueAt(new \DateTimeImmutable((string) $transition['followUpAt']))
                ->setCustomer($opportunity->getCustomer())
                ->setOpportunity($opportunity)
                ->setAssignedTo($opportunity->getOwner() ?? $actor)
                ->setCreatedBy($actor);
            $this->em->persist($followUp);
        }
    }

    /**
     * Logic applied when an opportunity is won.
     */
    private function handleWon(Opportunity $opportunity): void
    {
        $opportunity->setProbability(100);
        $opportunity->setClosedAt(new \DateTime());

        // Convert the customer to CLIENT
        $customer = $opportunity->getCustomer();
        if ($customer && $customer->getStatus() !== 'CLIENT') {
            $customer->setStatus('CLIENT');
        }

        // Dispatch the OPPORTUNITY_WON event
        $event = new OpportunityWonEvent($opportunity);
        $this->eventDispatcher->dispatch($event, OpportunityWonEvent::NAME);
    }

    /**
     * Logic applied when an opportunity is lost.
     */
    private function handleLost(Opportunity $opportunity): void
    {
        $opportunity->setProbability(0);
        $opportunity->setClosedAt(new \DateTime());
    }
}
