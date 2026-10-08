<?php

namespace App\Service;

use App\Entity\Opportunity;
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
    public function changeStage(Opportunity $opportunity, string $newStage): void
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

        $opportunity->setStage($newStage);

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
                    ->withContext(['previousStage' => $previousStage, 'newStage' => $newStage]),
                OpportunityStageChangedEvent::NAME
            );
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
