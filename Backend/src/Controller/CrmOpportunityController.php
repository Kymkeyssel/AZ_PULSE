<?php

namespace App\Controller;

use App\Entity\Opportunity;
use App\Entity\Customer;
use App\Service\OpportunityService;
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
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);

        if (empty($payload['title']) || empty($payload['customer_id'])) {
            return $this->json(['success' => false, 'error' => 'Missing "title" or "customer_id" fields'], 400);
        }

        $customer = $em->getRepository(Customer::class)->find($payload['customer_id']);
        if (!$customer) {
            return $this->json(['success' => false, 'error' => 'Customer not found'], 404);
        }

        $opportunity = new Opportunity();
        $opportunity->setTitle($payload['title']);
        $opportunity->setCustomer($customer);
        if (isset($payload['amount'])) $opportunity->setAmount($payload['amount']);
        if (isset($payload['probability'])) $opportunity->setProbability((int) $payload['probability']);
        if (isset($payload['stage'])) $opportunity->setStage($payload['stage']);
        if (isset($payload['expectedCloseDate'])) {
            $opportunity->setExpectedCloseDate($this->parseDate($payload['expectedCloseDate']));
        }

        /** @var \App\Entity\User $user */
        $user = $this->getUser();
        $opportunity->setOwner($user);

        $em->persist($opportunity);
        $em->flush();

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
    public function updateStage(Opportunity $opportunity, Request $request, OpportunityService $opportunityService): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);

        if (empty($payload['stage'])) {
            return $this->json(['success' => false, 'error' => 'Missing "stage" field'], 400);
        }

        try {
            $opportunityService->changeStage($opportunity, $payload['stage']);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['success' => false, 'error' => $e->getMessage()], 400);
        }

        return $this->json([
            'success' => true,
            'data' => [
                'id' => $opportunity->getId(),
                'stage' => $opportunity->getStage(),
                'probability' => $opportunity->getProbability(),
                'customer_status' => $opportunity->getCustomer()?->getStatus()
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
