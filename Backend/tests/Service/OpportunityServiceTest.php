<?php

namespace App\Tests\Service;

use App\Entity\Customer;
use App\Entity\Opportunity;
use App\Event\OpportunityStageChangedEvent;
use App\Event\OpportunityWonEvent;
use App\Service\OpportunityService;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;

class OpportunityServiceTest extends TestCase
{
    /**
     * Enregistre les événements diffusés plutôt que d'en compter.
     *
     * Compter suffirait pour « au moins un », mais `changeStage` diffuse
     * aujourd'hui deux événements distincts sur un gain — le franchissement de
     * phase et le gain lui-même. Lister les noms permet d'affirmer *lequel* a
     * été émis, ce qui est l'information qui compte : voir le test suivant.
     *
     * @param string[] $dispatchedNames Rempli par référence
     */
    private function recordingDispatcher(array &$dispatchedNames, array &$dispatchedEvents): EventDispatcherInterface
    {
        $dispatcher = $this->createMock(EventDispatcherInterface::class);
        $dispatcher->method('dispatch')
            ->willReturnCallback(function (object $event, ?string $name = null) use (&$dispatchedNames, &$dispatchedEvents) {
                if ($name !== null) {
                    $dispatchedNames[] = $name;
                }
                $dispatchedEvents[] = $event;

                return $event;
            });

        return $dispatcher;
    }

    public function testChangeStageToWon(): void
    {
        $em = $this->createMock(EntityManagerInterface::class);
        $names = [];
        $events = [];
        $dispatcher = $this->recordingDispatcher($names, $events);

        $service = new OpportunityService($em, $dispatcher);

        $customer = new Customer();
        $customer->setStatus('PROSPECT');

        $opportunity = new Opportunity();
        $opportunity->setCustomer($customer);
        $opportunity->setStage('PROSPECTING');

        $em->expects($this->once())->method('flush');

        $service->changeStage($opportunity, 'WON');

        $this->assertEquals('WON', $opportunity->getStage());
        $this->assertEquals(100, $opportunity->getProbability());
        $this->assertNotNull($opportunity->getClosedAt());
        $this->assertEquals('CLIENT', $customer->getStatus());

        // Un gain produit deux faits distincts, et c'est volontaire : le gain
        // (qui déclenche la création du projet) et le franchissement de phase
        // (qui trace le mouvement dans le pipeline). Les confondre ferait
        // perdre l'un des deux dans le journal d'audit.
        $this->assertContains(OpportunityWonEvent::NAME, $names);
        $this->assertContains(OpportunityStageChangedEvent::NAME, $names);

        $won = $events[array_search(OpportunityWonEvent::NAME, $names, true)];
        $this->assertInstanceOf(OpportunityWonEvent::class, $won);
    }

    public function testStageChangeEventCarriesThePreviousStage(): void
    {
        $em = $this->createMock(EntityManagerInterface::class);
        $names = [];
        $events = [];
        $dispatcher = $this->recordingDispatcher($names, $events);

        $service = new OpportunityService($em, $dispatcher);

        $customer = new Customer();
        $customer->setStatus('PROSPECT');

        $opportunity = new Opportunity();
        $opportunity->setCustomer($customer);
        $opportunity->setStage('QUALIFICATION');

        $service->changeStage($opportunity, 'NEGOTIATION');

        $stageEvent = $events[array_search(OpportunityStageChangedEvent::NAME, $names, true)];

        $this->assertInstanceOf(OpportunityStageChangedEvent::class, $stageEvent);
        // Sans l'ancienne phase, la trace ne permettrait pas de reconstituer le
        // parcours de l'affaire.
        $this->assertSame('QUALIFICATION', $stageEvent->getPreviousStage());
        $this->assertSame('NEGOTIATION', $stageEvent->getNewStage());
    }

    /**
     * Un changement de phase vers le même état ne doit rien diffuser : sinon
     * réenregistrer une opportunité déjà gagnée créerait une fausse trace et
     * surtout une fausse notification « opportunité gagnée ».
     */
    public function testNoStageEventWhenTheStageDoesNotChange(): void
    {
        $em = $this->createMock(EntityManagerInterface::class);
        $names = [];
        $events = [];
        $dispatcher = $this->recordingDispatcher($names, $events);

        $service = new OpportunityService($em, $dispatcher);

        $customer = new Customer();
        $customer->setStatus('PROSPECT');

        $opportunity = new Opportunity();
        $opportunity->setCustomer($customer);
        $opportunity->setStage('NEGOTIATION');

        $service->changeStage($opportunity, 'NEGOTIATION');

        $this->assertNotContains(
            OpportunityStageChangedEvent::NAME,
            $names,
            'Un changement de phase doit être un événement, pas une sauvegarde.'
        );
    }

    public function testChangeStageToLost(): void
    {
        $em = $this->createMock(EntityManagerInterface::class);
        $names = [];
        $events = [];
        $dispatcher = $this->recordingDispatcher($names, $events);

        $service = new OpportunityService($em, $dispatcher);

        $customer = new Customer();
        $customer->setStatus('PROSPECT');

        $opportunity = new Opportunity();
        $opportunity->setCustomer($customer);
        $opportunity->setStage('PROSPECTING');

        $em->expects($this->once())->method('flush');

        $service->changeStage($opportunity, 'LOST');

        $this->assertEquals('LOST', $opportunity->getStage());
        $this->assertEquals(0, $opportunity->getProbability());
        $this->assertNotNull($opportunity->getClosedAt());
        $this->assertEquals('PROSPECT', $customer->getStatus(), 'Customer should remain PROSPECT when opportunity is lost.');

        // L'intention d'origine est préservée : une perte ne doit créer aucun
        // projet. On vérifie l'absence de l'événement « gagné » — et non
        // l'absence de tout événement, puisqu'un franchissement de phase est
        // bel et bien survenu.
        $this->assertNotContains(
            OpportunityWonEvent::NAME,
            $names,
            'Une opportunité perdue ne doit pas déclencher la création d\'un projet.'
        );
        $this->assertContains(OpportunityStageChangedEvent::NAME, $names);
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
