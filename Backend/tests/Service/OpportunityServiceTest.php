<?php

namespace App\Tests\Service;

use App\Entity\Customer;
use App\Entity\Opportunity;
use App\Event\OpportunityWonEvent;
use App\Service\OpportunityService;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;

class OpportunityServiceTest extends TestCase
{
    public function testChangeStageToWon(): void
    {
        $em = $this->createMock(EntityManagerInterface::class);
        $dispatcher = $this->createMock(EventDispatcherInterface::class);

        $service = new OpportunityService($em, $dispatcher);

        $customer = new Customer();
        $customer->setStatus('PROSPECT');

        $opportunity = new Opportunity();
        $opportunity->setCustomer($customer);
        $opportunity->setStage('PROSPECTING');

        // Expect the event to be dispatched
        $dispatcher->expects($this->once())
            ->method('dispatch')
            ->with($this->isInstanceOf(OpportunityWonEvent::class), OpportunityWonEvent::NAME);

        // Expect flush to be called
        $em->expects($this->once())->method('flush');

        $service->changeStage($opportunity, 'WON');

        $this->assertEquals('WON', $opportunity->getStage());
        $this->assertEquals(100, $opportunity->getProbability());
        $this->assertNotNull($opportunity->getClosedAt());
        $this->assertEquals('CLIENT', $customer->getStatus());
    }

    public function testChangeStageToLost(): void
    {
        $em = $this->createMock(EntityManagerInterface::class);
        $dispatcher = $this->createMock(EventDispatcherInterface::class);

        $service = new OpportunityService($em, $dispatcher);

        $customer = new Customer();
        $customer->setStatus('PROSPECT');

        $opportunity = new Opportunity();
        $opportunity->setCustomer($customer);
        $opportunity->setStage('PROSPECTING');

        // Event should NOT be dispatched
        $dispatcher->expects($this->never())->method('dispatch');

        // Expect flush to be called
        $em->expects($this->once())->method('flush');

        $service->changeStage($opportunity, 'LOST');

        $this->assertEquals('LOST', $opportunity->getStage());
        $this->assertEquals(0, $opportunity->getProbability());
        $this->assertNotNull($opportunity->getClosedAt());
        $this->assertEquals('PROSPECT', $customer->getStatus(), 'Customer should remain PROSPECT when opportunity is lost.');
    }

    public function testInvalidStageThrowsException(): void
    {
        $em = $this->createMock(EntityManagerInterface::class);
        $dispatcher = $this->createMock(EventDispatcherInterface::class);

        $service = new OpportunityService($em, $dispatcher);
        $opportunity = new Opportunity();

        $this->expectException(\InvalidArgumentException::class);
        
        $service->changeStage($opportunity, 'INVALID_STAGE');
    }
}
