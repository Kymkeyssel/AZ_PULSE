<?php

namespace App\Controller;

use App\Entity\Opportunity;
use App\Entity\Customer;
use App\Service\OpportunityService;
use App\Service\EmailSender;
use Psr\Log\LoggerInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/opportunities', name: 'api_opportunities_')]
#[IsGranted('crm.read')]
class CrmOpportunityController extends AbstractController
{
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $stage = $request->query->get('stage');
        $customerId = $request->query->get('customer');
        $ownerId = $request->query->get('owner');

        $criteria = [];
        if ($stage) $criteria['stage'] = $stage;
        if ($customerId) $criteria['customer'] = (int) $customerId;

        // `owner` est un identifiant public (UUID) : il faut résoudre l'entité,
        // Doctrine n'accepte pas la chaîne telle quelle sur une association.
        if ($ownerId) {
            $owner = $em->getRepository(\App\Entity\User::class)->find($ownerId);
            if ($owner) $criteria['owner'] = $owner;
        }

        $opportunities = $em->getRepository(Opportunity::class)->findBy($criteria);

        $data = array_map(fn($o) => $this->format($o), $opportunities);

        return $this->json(['success' => true, 'data' => $data]);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    #[IsGranted('crm.create')]
    public function create(Request $request, EntityManagerInterface $em, EmailSender $emails, LoggerInterface $logger): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);

        if (empty($payload['title']) || empty($payload['customer_id'])) {
            return $this->json(['success' => false, 'error' => 'Missing "title" or "customer_id" fields'], 400);
        }

        $customer = $em->getRepository(Customer::class)->find($payload['customer_id']);
        if (!$customer) {
            return $this->json(['success' => false, 'error' => 'Customer not found'], 404);
        }
        if (!filter_var(trim((string) $customer->getEmail()), FILTER_VALIDATE_EMAIL)) {
            return $this->json(['success' => false, 'error' => 'Ajoutez une adresse email valide au client avant de créer une affaire.'], 422);
        }

        $opportunity = new Opportunity();
        $opportunity->setTitle($payload['title']);
        $opportunity->setCustomer($customer);
        if (isset($payload['amount'])) $opportunity->setAmount($payload['amount']);
        if (isset($payload['probability'])) $opportunity->setProbability((int) $payload['probability']);
        $opportunity->setStage('PROSPECTING');
        if (isset($payload['expectedCloseDate'])) {
            $opportunity->setExpectedCloseDate($this->parseDate($payload['expectedCloseDate']));
        }

        /** @var \App\Entity\User $user */
        $user = $this->getUser();
        $opportunity->setOwner($user);

        $em->persist($opportunity);
        $em->flush();

        try {
            $emails->sendCrmJourneyUpdate($customer, $opportunity->getTitle(), 'Affaire ouverte', 'Une opportunité a été ouverte à la suite de nos échanges. Votre interlocuteur AZ PULSE vous accompagnera pour en préciser le périmètre.');
        } catch (\Throwable $error) {
            $logger->warning('Notification CRM email mise en file impossible', ['opportunity' => $opportunity->getId(), 'error' => $error->getMessage()]);
        }

        return $this->json([
            'success' => true,
            'data' => [
                'id' => $opportunity->getId(),
                'title' => $opportunity->getTitle(),
                'stage' => $opportunity->getStage()
            ]
        ], 201);
    }

    #[Route('/{id}', name: 'read', methods: ['GET'])]
    public function read(Opportunity $opportunity): JsonResponse
    {
        return $this->json([
            'success' => true,
            'data' => $this->format($opportunity),
        ]);
    }

    #[Route('/{id}', name: 'update', methods: ['PATCH'])]
    #[IsGranted('crm.update')]
    public function update(Opportunity $opportunity, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);

        if (isset($payload['title'])) $opportunity->setTitle($payload['title']);
        if (isset($payload['amount'])) $opportunity->setAmount($payload['amount']);
        if (isset($payload['probability'])) $opportunity->setProbability((int) $payload['probability']);
        if (array_key_exists('expectedCloseDate', $payload)) {
            $opportunity->setExpectedCloseDate($this->parseDate($payload['expectedCloseDate']));
        }

        $em->flush();

        return $this->json([
            'success' => true,
            'data' => [
                'id' => $opportunity->getId(),
                'title' => $opportunity->getTitle()
            ]
        ]);
    }

    #[Route('/{id}/stage', name: 'update_stage', methods: ['PATCH'])]
    #[IsGranted('crm.update')]
    public function updateStage(Opportunity $opportunity, Request $request, OpportunityService $opportunityService, EntityManagerInterface $em, EmailSender $emails, LoggerInterface $logger): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);

        if (empty($payload['stage'])) {
            return $this->json(['success' => false, 'error' => 'Missing "stage" field'], 400);
        }
        if (isset($payload['transition']) && !is_array($payload['transition'])) {
            return $this->json(['success' => false, 'error' => 'Les informations de l’étape doivent être un objet.'], 422);
        }
        if (!filter_var(trim((string) $opportunity->getCustomer()?->getEmail()), FILTER_VALIDATE_EMAIL)) {
            return $this->json(['success' => false, 'error' => 'Ajoutez une adresse email valide au client avant de faire progresser cette affaire.'], 422);
        }

        $actor = $this->getUser();
        try {
            $opportunityService->changeStage($opportunity, (string) $payload['stage'], $payload['transition'] ?? [], $actor instanceof \App\Entity\User ? $actor : null);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['success' => false, 'error' => $e->getMessage()], 422);
        }

        $customer = $opportunity->getCustomer();
        $stageMessages = [
            'QUALIFICATION' => ['Qualification en cours', 'Votre besoin a été pris en compte. Votre interlocuteur vous proposera la prochaine étape de nos échanges.'],
            'PROPOSAL' => ['Préparation de la proposition', 'Votre dossier est à l’étape de préparation de la proposition. Celle-ci vous sera transmise séparément par votre interlocuteur.'],
            'NEGOTIATION' => ['Échanges sur la proposition', 'Nous poursuivons les échanges autour de la proposition et restons disponibles pour répondre à vos questions.'],
            'WON' => ['Collaboration confirmée', 'La collaboration est confirmée. Notre équipe projet organisera avec vous les prochaines étapes de démarrage.'],
            'LOST' => ['Clôture du dossier', 'Votre dossier a été clôturé. Nous vous remercions pour nos échanges et restons à votre disposition.'],
        ];
        if ($customer && isset($stageMessages[$opportunity->getStage()])) {
            try {
                [$milestone, $publicDetails] = $stageMessages[$opportunity->getStage()];
                $emails->sendCrmJourneyUpdate($customer, $opportunity->getTitle(), $milestone, $publicDetails);
            } catch (\Throwable $error) {
                $logger->warning('Notification de progression CRM email mise en file impossible', ['opportunity' => $opportunity->getId(), 'error' => $error->getMessage()]);
            }
        }

        // L'événement de gain crée et persiste le projet avant le retour HTTP.
        // Lire à nouveau la relation évite d'affirmer côté UI qu'il a été créé
        // quand un subscriber aurait échoué ou n'aurait pas été enregistré.
        $project = $opportunity->getStage() === 'WON'
            ? $em->getRepository(\App\Entity\Project::class)->findOneBy(['opportunity' => $opportunity])
            : null;

        return $this->json([
            'success' => true,
            'data' => [
                'id' => $opportunity->getId(),
                'stage' => $opportunity->getStage(),
                'probability' => $opportunity->getProbability(),
                'customer_status' => $opportunity->getCustomer()?->getStatus(),
                'project' => $project ? ['id' => $project->getId(), 'name' => $project->getName()] : null,
            ]
        ]);
    }

    /**
     * Sérialise une opportunité.
     *
     * @return array<string, mixed>
     */
    private function format(Opportunity $opportunity): array
    {
        return [
            'id' => $opportunity->getId(),
            'title' => $opportunity->getTitle(),
            'amount' => $opportunity->getAmount(),
            'stage' => $opportunity->getStage(),
            'probability' => $opportunity->getProbability(),
            'expectedCloseDate' => $opportunity->getExpectedCloseDate()?->format('Y-m-d'),
            'customer_id' => $opportunity->getCustomer()?->getId(),
            'customer_name' => $opportunity->getCustomer()?->getName(),
            'owner_id' => $opportunity->getOwner()?->getId()->toRfc4122(),
            'createdAt' => $opportunity->getCreatedAt()?->format(\DateTimeInterface::ATOM),
            'closedAt' => $opportunity->getClosedAt()?->format(\DateTimeInterface::ATOM),
        ];
    }

    /**
     * Convertit une date reçue en objet, ou renvoie null si elle est absente.
     *
     * Une date illisible ne doit pas faire échouer l'enregistrement : on
     * préfère une échéance vide à une opportunity perdue.
     */
    private function parseDate(mixed $value): ?\DateTimeInterface
    {
        if (!is_string($value) || trim($value) === '') {
            return null;
        }

        try {
            return new \DateTimeImmutable(trim($value));
        } catch (\Exception) {
            return null;
        }
    }
}
