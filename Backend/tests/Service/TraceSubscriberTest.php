<?php

namespace App\Tests\Service;

use App\Entity\AccessRequest;
use App\Entity\Notification;
use App\Entity\Opportunity;
use App\Entity\Role;
use App\Entity\User;
use App\Event\AccessRequestApprovedEvent;
use App\Event\OpportunityStageChangedEvent;
use App\Event\OpportunityWonEvent;
use App\Event\TaskCompletedEvent;
use App\Service\AuditLogService;
use App\Service\NotificationService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

/**
 * Vérifie que la chaîne de traces fonctionne de bout en bout sur une base
 * réelle : un événement publié produit bien une ligne d'audit persistée.
 *
 * On ne se contente pas de vérifier que le subscriber est enregistré au
 * conteneur. Un abonné enregistré mais dont `flush()` échoue, ou qui écrit dans
 * une transaction annulée, laisserait le journal vide en production — et la
 * démonstration le révélerait devant le jury.
 */
class TraceSubscriberTest extends KernelTestCase
{
    private EntityManagerInterface $em;
    private EventDispatcherInterface $dispatcher;
    private AuditLogService $auditLog;

    protected function setUp(): void
    {
        self::bootKernel();
        $container = static::getContainer();

        $this->em = $container->get(EntityManagerInterface::class);
        $this->dispatcher = $container->get(EventDispatcherInterface::class);
        $this->auditLog = $container->get(AuditLogService::class);
    }

    public function testOpportunityWonEventIsWrittenToTheAuditLog(): void
    {
        $opportunity = $this->createWonOpportunity();

        $action = (new OpportunityWonEvent($opportunity))->getAuditAction();

        $this->assertSame('OPPORTUNITY_WON', $action);

        $before = $this->countAuditEntries('OPPORTUNITY_WON');

        $this->dispatcher->dispatch(new OpportunityWonEvent($opportunity), OpportunityWonEvent::NAME);

        $this->assertSame(
            $before + 1,
            $this->countAuditEntries('OPPORTUNITY_WON'),
            'Le dispatch d\'opportunity.won doit produire une ligne d\'audit persistée.'
        );
    }

    public function testAuditActionIsDerivedFromTheEventName(): void
    {
        $opportunity = new Opportunity();
        $opportunity->setTitle('Audit test');

        $event = new OpportunityStageChangedEvent($opportunity, 'QUALIFICATION', 'NEGOTIATION');

        $this->assertSame('OPPORTUNITY_STAGE_CHANGED', $event->getAuditAction());
        $this->assertSame('CRM', $event->getAuditCategory());
        $this->assertStringContainsString('QUALIFICATION', $event->getSummary());
        $this->assertStringContainsString('NEGOTIATION', $event->getSummary());
    }

    /**
     * L'acteur d'un événement est celui qui agit, pas celui qui subit.
     *
     * C'est la propriété qui rend la trace exploitable : approbation d'accès,
     * la trace doit nommer l'administrateur.
     */
    public function testApprovedEventCarriesTheAdministratorAsActor(): void
    {
        $admin = $this->createUser('admin-trace@test.local');
        $requester = $this->createUser('requester-trace@test.local');
        $role = new Role();
        $role->setCode('COLLABORATEUR');
        $role->setLabel('Collaborateur');

        $request = new AccessRequest();
        $request->setUser($requester);
        $request->setRequestedDomain('commercial');
        $request->setMotivation('test');
        $request->setStatus(AccessRequest::STATUS_APPROVED);
        $request->setAssignedRole($role);

        $event = (new AccessRequestApprovedEvent($request))->withActor($admin);

        // L'acteur est l'administrateur qui a arbitré…
        $this->assertSame($admin, $event->getActor());

        // …et le résumé décrit le fait, c'est-à-dire qui a obtenu l'accès.
        // Confondre les deux attribuerait l'activation au demandeur.
        $this->assertStringContainsString('requester-trace@test.local', $event->getSummary());
        $this->assertStringNotContainsString('admin-trace@test.local', $event->getSummary());
    }

    public function testNotificationIsCreatedForTheRecipient(): void
    {
        /** @var NotificationService $notifications */
        $notifications = static::getContainer()->get(NotificationService::class);

        $user = $this->createUser('notif-trace@test.local');

        $notifications->notify($user, 'TEST_EVENT', 'Titre de test', 'Corps de test', '/pending');
        $this->em->flush();

        $found = $this->em->getRepository(Notification::class)
            ->findOneBy(['recipient' => $user, 'type' => 'TEST_EVENT']);

        $this->assertNotNull($found, 'La notification doit être persistée et lisible.');
        $this->assertSame('Titre de test', $found->getTitle());
        $this->assertFalse($found->isRead());
    }

    /**
     * Marquer comme lu ne doit réécrire l'horodatage qu'une fois : c'est la
     * première lecture qui fait foi, pas la dernière.
     */
    public function testMarkAsReadIsIdempotentOnTheTimestamp(): void
    {
        /** @var NotificationService $notifications */
        $notifications = static::getContainer()->get(NotificationService::class);

        $user = $this->createUser('notif-read@test.local');

        $notification = $notifications->notify($user, 'TEST_READ', 'Titre', 'Corps');
        $notification->markAsRead();
        $firstReadAt = $notification->getReadAt();

        self::assertNotNull($firstReadAt);

        $notification->markAsRead();

        $this->assertSame(
            $firstReadAt->format(\DateTimeInterface::ATOM),
            $notification->getReadAt()?->format(\DateTimeInterface::ATOM)
        );
    }

    public function testAuditEntryKeepsActorEmailWhenNoActor(): void
    {
        $entry = $this->auditLog->record(
            'TEST_SYSTEM_ACTION',
            'Action sans acteur humain',
            null,
            'SECURITY',
            'WARNING'
        );

        $this->em->flush();

        $this->assertNull($entry->getActor());
        $this->assertNull($entry->getActorEmail());
    }

    public function testTaskCompletedEventSummaryNamesTheProject(): void
    {
        $task = new \App\Entity\Task();
        $task->setTitle('Rédiger le cahier des charges');

        $event = new TaskCompletedEvent($task);

        $this->assertSame('TASK_COMPLETED', $event->getAuditAction());
        $this->assertStringContainsString('Rédiger le cahier des charges', $event->getSummary());
        // Sans projet rattaché, la phrase doit le dire plutôt que d'afficher « null ».
        $this->assertStringContainsString('sans projet', $event->getSummary());
    }

    /**
     * Opportunité gagnée, rattachée à un client et persistée.
     *
     * `Opportunity.customer` est `NOT NULL` et le subscriber historique
     * (`ProjectCreationSubscriber`) crée un projet à partir de l'opportunité :
     * il faut donc un graphe complet et valide, sinon c'est le subscriber —
     * et non le code testé — qui fait échouer le test.
     */
    private function createWonOpportunity(): Opportunity
    {
        $customer = new \App\Entity\Customer();
        $customer->setName('Client test audit');
        $customer->setStatus('PROSPECT');
        // `Customer.owner` est `NOT NULL` : un client sans commercial rattaché
        // n'est pas enregistrable.
        $customer->setOwner($this->createUser('owner-trace@test.local'));
        $this->em->persist($customer);

        $opportunity = new Opportunity();
        $opportunity->setTitle('Audit test');
        $opportunity->setStage('WON');
        $opportunity->setCustomer($customer);
        $opportunity->setOwner($this->createUser('sales-trace@test.local'));

        $this->em->persist($opportunity);
        $this->em->flush();

        return $opportunity;
    }

    private function countAuditEntries(string $action): int
    {
        return (int) $this->em->createQueryBuilder()
            ->select('COUNT(a.id)')
            ->from(\App\Entity\AuditLog::class, 'a')
            ->where('a.action = :action')
            ->setParameter('action', $action)
            ->getQuery()
            ->getSingleScalarResult();
    }

    private function createUser(string $email): User
    {
        $existing = $this->em->getRepository(User::class)->findOneByEmail($email);

        if ($existing instanceof User) {
            return $existing;
        }

        $user = new User();
        $user->setEmail($email);
        $user->setFirstName('Trace');
        $user->setLastName('Test');
        $user->setPassword('not-a-real-hash-used-only-in-tests');
        $user->setStatus(User::STATUS_ACTIVE);

        $this->em->persist($user);
        $this->em->flush();

        return $user;
    }
}
