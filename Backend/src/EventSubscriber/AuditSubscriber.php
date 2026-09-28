<?php

namespace App\EventSubscriber;

use App\Event\AccessRequestApprovedEvent;
use App\Event\AccessRequestRejectedEvent;
use App\Event\AccessRequestSubmittedEvent;
use App\Event\AiRecommendationProposedEvent;
use App\Event\DocumentPublishedEvent;
use App\Event\DomainEvent;
use App\Event\EnrollmentCreatedEvent;
use App\Event\GradePublishedEvent;
use App\Event\IncidentOpenedEvent;
use App\Event\IncidentResolvedEvent;
use App\Event\OpportunityStageChangedEvent;
use App\Event\OpportunityWonEvent;
use App\Event\ProjectCreatedEvent;
use App\Event\TaskCompletedEvent;
use App\Event\TuitionPaymentReceivedEvent;
use App\Event\UserActivatedEvent;
use App\Service\AuditLogService;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Journalise automatiquement tous les événements métier du domaine.
 *
 * Un événement publié sur le bus produit sa ligne d'audit sans que l'appelant
 * ait quoi que ce soit à faire : c'est le moyen de garantir qu'aucun fait métier
 * ne soit oublié dans la trace, y compris ceux ajoutés après coup par un
 * collègue. Les actions qui ne sont pas des faits métier (connexion, changement
 * de rôle, dépôt de fichier) ne passent pas par ici — elles appellent
 * directement `AuditLogService::record()`.
 *
 * Choix délibéré : une exception ici est journalisée puis avalée. Une ligne
 * d'audit en retard est réparable ; une inscription qui échoue parce que la
 * table `audit_logs` est momentanément indisponible, non. Le domaine reste la
 * source de vérité, la trace en est la mémoire.
 */
class AuditSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly AuditLogService $auditLog,
        private readonly EntityManagerInterface $em,
        private readonly LoggerInterface $logger
    ) {
    }

    /**
     * Le même traitement pour tous les événements du domaine.
     *
     * L'abonnement se fait par nom d'événement (`public const NAME`) et non par
     * classe : c'est la convention déjà en place, `OpportunityService` diffusant
     * via `dispatch($event, OpportunityWonEvent::NAME)`. Les deux
     * formulations coexistent dans l'application, mais mélanger les deux sur un
     * même événement ne déclencherait que l'une des deux.
     */
    public static function getSubscribedEvents(): array
    {
        return [
            AccessRequestSubmittedEvent::NAME  => 'onDomainEvent',
            AccessRequestApprovedEvent::NAME   => 'onDomainEvent',
            AccessRequestRejectedEvent::NAME   => 'onDomainEvent',
            UserActivatedEvent::NAME           => 'onDomainEvent',
            OpportunityStageChangedEvent::NAME => 'onDomainEvent',
            OpportunityWonEvent::NAME          => 'onDomainEvent',
            ProjectCreatedEvent::NAME          => 'onDomainEvent',
            TaskCompletedEvent::NAME           => 'onDomainEvent',
            EnrollmentCreatedEvent::NAME       => 'onDomainEvent',
            GradePublishedEvent::NAME          => 'onDomainEvent',
            TuitionPaymentReceivedEvent::NAME  => 'onDomainEvent',
            DocumentPublishedEvent::NAME       => 'onDomainEvent',
            IncidentOpenedEvent::NAME          => 'onDomainEvent',
            IncidentResolvedEvent::NAME        => 'onDomainEvent',
            AiRecommendationProposedEvent::NAME => 'onDomainEvent',
        ];
    }

    public function onDomainEvent(DomainEvent $event): void
    {
        try {
            $this->auditLog->recordEvent($event);
            $this->em->flush();
        } catch (\Throwable $e) {
            $this->logger->error('Échec de l\'écriture de la ligne d\'audit', [
                'event'  => $event::class,
                'action' => $event->getAuditAction(),
                'error'  => $e->getMessage(),
            ]);
        }
    }
}
