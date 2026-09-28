<?php

namespace App\EventSubscriber;

use App\Entity\Notification;
use App\Entity\Project;
use App\Entity\User;
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
use App\Repository\UserRepository;
use App\Service\NotificationService;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Traduit les événements métier en notifications adressées.
 *
 * C'est le seul endroit où l'on décide *qui* doit être prévenu : un événement
 * décrit un fait, pas ses destinataires. Le type de la notification est repris
 * tel quel de l'action d'audit (`$event->getAuditAction()`), ce qui permet de
 * relier les deux sans table de correspondance.
 *
 * Deux garde-fous :
 *  - on ne notifie jamais quelqu'un de sa propre action, sans quoi la
 *    notification deviendrait du bruit pour celui qui vient d'agir ;
 *  - une exception est journalisée puis avalée, comme dans `AuditSubscriber` :
 *    un échec de notification ne doit pas faire échouer l'action métier.
 */
class NotificationSubscriber implements EventSubscriberInterface
{
    /**
     * Rôles autorisés à arbitrer les demandes d'accès.
     */
    private const ACCESS_ARBITRATORS = ['SUPER_ADMIN', 'ADMIN'];

    public function __construct(
        private readonly NotificationService $notifications,
        private readonly UserRepository $users,
        private readonly EntityManagerInterface $em,
        private readonly LoggerInterface $logger
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            AccessRequestSubmittedEvent::NAME   => 'onDomainEvent',
            AccessRequestApprovedEvent::NAME    => 'onDomainEvent',
            AccessRequestRejectedEvent::NAME    => 'onDomainEvent',
            UserActivatedEvent::NAME            => 'onDomainEvent',
            OpportunityStageChangedEvent::NAME  => 'onDomainEvent',
            OpportunityWonEvent::NAME           => 'onDomainEvent',
            ProjectCreatedEvent::NAME           => 'onDomainEvent',
            TaskCompletedEvent::NAME            => 'onDomainEvent',
            EnrollmentCreatedEvent::NAME        => 'onDomainEvent',
            GradePublishedEvent::NAME           => 'onDomainEvent',
            TuitionPaymentReceivedEvent::NAME   => 'onDomainEvent',
            DocumentPublishedEvent::NAME        => 'onDomainEvent',
            IncidentOpenedEvent::NAME           => 'onDomainEvent',
            IncidentResolvedEvent::NAME         => 'onDomainEvent',
            AiRecommendationProposedEvent::NAME => 'onDomainEvent',
        ];
    }

    public function onDomainEvent(DomainEvent $event): void
    {
        try {
            foreach ($this->plan($event) as $message) {
                $recipients = self::withoutActor($message['recipients'], $event->getActor());

                if ($recipients === []) {
                    continue;
                }

                $this->notifications->notifyMany(
                    $recipients,
                    $event->getAuditAction(),
                    $message['title'],
                    $message['body'],
                    $message['link'],
                    $message['severity']
                );
            }

            $this->em->flush();
        } catch (\Throwable $e) {
            $this->logger->error('Échec de l\'envoi des notifications', [
                'event'  => $event::class,
                'action' => $event->getAuditAction(),
                'error'  => $e->getMessage(),
            ]);
        }
    }

    /**
     * Destinataires et libellés d'un événement donné.
     *
     * @return list<array{recipients: User[], title: string, body: string, link: ?string, severity: string}>
     */
    private function plan(DomainEvent $event): array
    {
        return match (true) {
            $event instanceof AccessRequestSubmittedEvent  => $this->planRequestSubmitted($event),
            $event instanceof AccessRequestApprovedEvent   => $this->planRequestApproved($event),
            $event instanceof AccessRequestRejectedEvent   => $this->planRequestRejected($event),
            $event instanceof UserActivatedEvent           => $this->planUserActivated($event),
            $event instanceof OpportunityStageChangedEvent => $this->planStageChanged($event),
            $event instanceof OpportunityWonEvent          => $this->planOpportunityWon($event),
            $event instanceof ProjectCreatedEvent          => $this->planProjectCreated($event),
            $event instanceof TaskCompletedEvent           => $this->planTaskCompleted($event),
            $event instanceof EnrollmentCreatedEvent       => $this->planEnrollmentCreated($event),
            $event instanceof GradePublishedEvent          => $this->planGradePublished($event),
            $event instanceof TuitionPaymentReceivedEvent  => $this->planPaymentReceived($event),
            $event instanceof DocumentPublishedEvent       => $this->planDocumentPublished($event),
            $event instanceof IncidentOpenedEvent          => $this->planIncidentOpened($event),
            $event instanceof IncidentResolvedEvent        => $this->planIncidentResolved($event),
            $event instanceof AiRecommendationProposedEvent => $this->planAiRecommendation($event),
            default => [],
        };
    }

    private function planRequestSubmitted(AccessRequestSubmittedEvent $event): array
    {
        return [[
            'recipients' => $this->users->findActiveByRoleCodes(self::ACCESS_ARBITRATORS),
            'title'     => 'Nouvelle demande d\'accès',
            'body'      => $event->getSummary() . ' — une décision est attendue.',
            'link'      => '/superadmin/requests',
            'severity'  => Notification::SEVERITY_INFO,
        ]];
    }

    private function planRequestApproved(AccessRequestApprovedEvent $event): array
    {
        return [[
            'recipients' => [$event->getAccessRequest()->getUser()],
            'title'     => 'Demande d\'accès approuvée',
            'body'      => 'Votre accès à la plateforme a été validé. Vous pouvez désormais vous connecter.',
            'link'      => '/activate',
            'severity'  => Notification::SEVERITY_SUCCESS,
        ]];
    }

    private function planRequestRejected(AccessRequestRejectedEvent $event): array
    {
        return [[
            'recipients' => [$event->getAccessRequest()->getUser()],
            'title'     => 'Demande d\'accès refusée',
            'body'      => $event->getSummary(),
            'link'      => '/rejected',
            'severity'  => Notification::SEVERITY_DANGER,
        ]];
    }

    private function planUserActivated(UserActivatedEvent $event): array
    {
        return [[
            'recipients' => [$event->getUser()],
            'title'     => 'Compte activé',
            'body'      => 'Votre compte est actif. Connectez-vous pour accéder à votre espace.',
            'link'      => '/',
            'severity'  => Notification::SEVERITY_SUCCESS,
        ]];
    }

    private function planStageChanged(OpportunityStageChangedEvent $event): array
    {
        $opportunity = $event->getOpportunity();

        return [[
            'recipients' => $opportunity->getOwner() !== null ? [$opportunity->getOwner()] : [],
            'title'     => 'Opportunité : changement de phase',
            'body'      => $event->getSummary(),
            'link'      => '/collaborateur/crm',
            'severity'  => Notification::SEVERITY_INFO,
        ]];
    }

    private function planOpportunityWon(OpportunityWonEvent $event): array
    {
        $opportunity = $event->getOpportunity();

        return [[
            'recipients' => $opportunity->getOwner() !== null ? [$opportunity->getOwner()] : [],
            'title'     => 'Opportunité gagnée',
            'body'      => $event->getSummary() . ' Un projet a été créé automatiquement.',
            'link'      => '/collaborateur/projets',
            'severity'  => Notification::SEVERITY_SUCCESS,
        ]];
    }

    private function planProjectCreated(ProjectCreatedEvent $event): array
    {
        $manager = $event->getProject()->getManager();

        return [[
            'recipients' => $manager !== null ? [$manager] : [],
            'title'     => 'Projet créé',
            'body'      => $event->getSummary(),
            'link'      => '/collaborateur/projets',
            'severity'  => Notification::SEVERITY_INFO,
        ]];
    }

    private function planTaskCompleted(TaskCompletedEvent $event): array
    {
        $manager = $event->getProjectManager();

        return [[
            'recipients' => $manager !== null ? [$manager] : [],
            'title'     => 'Tâche terminée',
            'body'      => $event->getSummary(),
            'link'      => '/collaborateur/projets',
            'severity'  => Notification::SEVERITY_INFO,
        ]];
    }

    private function planEnrollmentCreated(EnrollmentCreatedEvent $event): array
    {
        $student = $event->getEnrollment()->getStudent();

        return [
            [
                'recipients' => $student !== null ? [$student] : [],
                'title'     => 'Vous êtes inscrit',
                'body'      => $event->getSummary(),
                'link'      => '/apprenant/formations',
                'severity'  => Notification::SEVERITY_SUCCESS,
            ],
            [
                'recipients' => $this->users->findActiveByRoleCodes(['RESPONSABLE_FORMATION']),
                'title'     => 'Nouvelle inscription',
                'body'      => $event->getSummary(),
                'link'      => '/collaborateur/formations',
                'severity'  => Notification::SEVERITY_INFO,
            ],
        ];
    }

    private function planGradePublished(GradePublishedEvent $event): array
    {
        return [[
            'recipients' => $event->getStudent() !== null ? [$event->getStudent()] : [],
            'title'     => 'Nouvelle note publiée',
            'body'      => $event->getSummary(),
            'link'      => '/apprenant/evaluations',
            'severity'  => Notification::SEVERITY_SUCCESS,
        ]];
    }

    private function planPaymentReceived(TuitionPaymentReceivedEvent $event): array
    {
        $student = $event->getTuition()->getStudent();

        return [
            [
                'recipients' => $student !== null ? [$student] : [],
                'title'     => 'Règlement enregistré',
                'body'      => $event->getSummary(),
                'link'      => '/apprenant/paiements',
                'severity'  => Notification::SEVERITY_SUCCESS,
            ],
            [
                'recipients' => $this->users->findActiveByRoleCodes(['RESPONSABLE_FORMATION']),
                'title'     => 'Règlement de scolarité reçu',
                'body'      => $event->getSummary(),
                'link'      => '/collaborateur/formations',
                'severity'  => Notification::SEVERITY_INFO,
            ],
        ];
    }

    private function planDocumentPublished(DocumentPublishedEvent $event): array
    {
        $owner = $event->getDocument()->getOwner();

        return [[
            'recipients' => $owner !== null
                ? array_merge([$owner], $this->users->findActiveByRoleCodes(['SUPER_ADMIN']))
                : $this->users->findActiveByRoleCodes(['SUPER_ADMIN']),
            'title'     => 'Document publié',
            'body'      => $event->getSummary(),
            'link'      => '/collaborateur/documents',
            'severity'  => Notification::SEVERITY_INFO,
        ]];
    }

    private function planIncidentOpened(IncidentOpenedEvent $event): array
    {
        $assignee = $event->getAssignee();
        $recipients = $assignee !== null ? [$assignee] : [];

        return [[
            'recipients' => array_merge($recipients, $this->users->findActiveByRoleCodes(['RESPONSABLE_IT'])),
            'title'     => 'Incident déclaré',
            'body'      => $event->getSummary(),
            'link'      => '/collaborateur/infrastructure',
            'severity'  => Notification::SEVERITY_WARNING,
        ]];
    }

    private function planIncidentResolved(IncidentResolvedEvent $event): array
    {
        $reporter = $event->getReporter();

        return [[
            'recipients' => $reporter !== null ? [$reporter] : [],
            'title'     => 'Incident résolu',
            'body'      => $event->getSummary(),
            'link'      => '/collaborateur/infrastructure',
            'severity'  => Notification::SEVERITY_SUCCESS,
        ]];
    }

    /**
     * Une recommandation IA est adressée au chef de projet du projet concerné.
     *
     * Si le projet a disparu entre la proposition et le traitement, on se
     * rabat sur le responsable Workspace plutôt que de perdre l'information.
     *
     * Le libellé rappelle explicitement qu'aucune action n'est exécutée : la
     * validation humaine est une règle structurante, elle doit être visible là
     * où la proposition apparaît.
     */
    private function planAiRecommendation(AiRecommendationProposedEvent $event): array
    {
        $project = $event->getProjectId() !== null
            ? $this->em->find(Project::class, $event->getProjectId())
            : null;

        $recipients = $project?->getManager() !== null
            ? [$project->getManager()]
            : $this->users->findActiveByRoleCodes(['RESPONSABLE_WORKSPACE']);

        return [[
            'recipients' => $recipients,
            'title'     => 'Recommandation IA à valider',
            'body'      => $event->getSummary() . ' — aucune action n\'est exécutée sans votre validation.',
            'link'      => '/collaborateur/ia',
            'severity'  => Notification::SEVERITY_WARNING,
        ]];
    }

    /**
     * Retire l'auteur de l'action de ses propres destinataires.
     *
     * @param User[] $recipients
     *
     * @return User[]
     */
    private static function withoutActor(array $recipients, ?User $actor): array
    {
        if ($actor === null) {
            return $recipients;
        }

        return array_values(array_filter(
            $recipients,
            static fn (User $user): bool => (string) $user->getId() !== (string) $actor->getId()
        ));
    }
}
