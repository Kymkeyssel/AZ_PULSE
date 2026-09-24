<?php

namespace App\Service;

use App\Entity\Opportunity;
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
        $validStages = ['PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'];
        
        if (!in_array($newStage, $validStages, true)) {
            throw new \InvalidArgumentException(sprintf('Invalid stage "%s".', $newStage));
        }

        $opportunity->setStage($newStage);

        if ($newStage === 'WON') {
            $this->handleWon($opportunity);
        } elseif ($newStage === 'LOST') {
            $this->handleLost($opportunity);
        }

        $this->em->flush();
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
