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

        $criteria = [];
        if ($stage) $criteria['stage'] = $stage;
        if ($customerId) $criteria['customer'] = $customerId;

        $opportunities = $em->getRepository(Opportunity::class)->findBy($criteria);

        $data = array_map(fn($o) => [
            'id' => $o->getId(),
            'title' => $o->getTitle(),
            'amount' => $o->getAmount(),
            'stage' => $o->getStage(),
            'probability' => $o->getProbability(),
            'customer_id' => $o->getCustomer()?->getId(),
            'owner_id' => $o->getOwner()?->getId(),
            'createdAt' => $o->getCreatedAt()->format(\DateTimeInterface::ATOM),
            'closedAt' => $o->getClosedAt()?->format(\DateTimeInterface::ATOM)
        ], $opportunities);

        return $this->json(['success' => true, 'data' => $data]);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    #[IsGranted('opportunity.create')]
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
        if (isset($payload['probability'])) $opportunity->setProbability($payload['probability']);
        if (isset($payload['stage'])) $opportunity->setStage($payload['stage']);

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
            'data' => [
                'id' => $opportunity->getId(),
                'title' => $opportunity->getTitle(),
                'amount' => $opportunity->getAmount(),
                'stage' => $opportunity->getStage(),
                'probability' => $opportunity->getProbability(),
                'customer_id' => $opportunity->getCustomer()?->getId(),
                'owner_id' => $opportunity->getOwner()?->getId(),
                'createdAt' => $opportunity->getCreatedAt()->format(\DateTimeInterface::ATOM),
                'closedAt' => $opportunity->getClosedAt()?->format(\DateTimeInterface::ATOM)
            ]
        ]);
    }

    #[Route('/{id}', name: 'update', methods: ['PATCH'])]
    #[IsGranted('opportunity.update')]
    public function update(Opportunity $opportunity, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);

        if (isset($payload['title'])) $opportunity->setTitle($payload['title']);
        if (isset($payload['amount'])) $opportunity->setAmount($payload['amount']);
        if (isset($payload['probability'])) $opportunity->setProbability($payload['probability']);

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
    #[IsGranted('opportunity.update')]
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
}
