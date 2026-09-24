<?php

namespace App\Event;

use App\Entity\Opportunity;
use Symfony\Contracts\EventDispatcher\Event;

class OpportunityWonEvent extends Event
{
    public const NAME = 'opportunity.won';

    private Opportunity $opportunity;

    public function __construct(Opportunity $opportunity)
    {
        $this->opportunity = $opportunity;
    }

    public function getOpportunity(): Opportunity
    {
        return $this->opportunity;
    }
}
