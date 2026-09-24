<?php

namespace App\Controller;

use App\Entity\Activity;
use App\Entity\Customer;
use App\Entity\Opportunity;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api', name: 'api_activities_')]
#[IsGranted('crm.read')]
class CrmActivityController extends AbstractController
{
    #[Route('/customers/{id}/activities', name: 'customer_activities', methods: ['GET'])]
    public function listCustomerActivities(Customer $customer, EntityManagerInterface $em): JsonResponse
    {
        $activities = $em->getRepository(Activity::class)->findBy(['customer' => $customer], ['createdAt' => 'DESC']);

        $data = array_map(fn($a) => [
            'id' => $a->getId(),
            'type' => $a->getType(),
            'description' => $a->getDescription(),
            'author_id' => $a->getAuthor()?->getId(),
            'createdAt' => $a->getCreatedAt()->format(\DateTimeInterface::ATOM)
        ], $activities);

        return $this->json(['success' => true, 'data' => $data]);
    }

    #[Route('/opportunities/{id}/activities', name: 'opportunity_activities', methods: ['GET'])]
    public function listOpportunityActivities(Opportunity $opportunity, EntityManagerInterface $em): JsonResponse
    {
        $activities = $em->getRepository(Activity::class)->findBy(['opportunity' => $opportunity], ['createdAt' => 'DESC']);

        $data = array_map(fn($a) => [
            'id' => $a->getId(),
            'type' => $a->getType(),
            'description' => $a->getDescription(),
            'author_id' => $a->getAuthor()?->getId(),
            'createdAt' => $a->getCreatedAt()->format(\DateTimeInterface::ATOM)
        ], $activities);

        return $this->json(['success' => true, 'data' => $data]);
    }

    #[Route('/activities', name: 'create', methods: ['POST'])]
    #[IsGranted('crm.update')]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);

        if (empty($payload['type']) || empty($payload['description'])) {
            return $this->json(['success' => false, 'error' => 'Missing "type" or "description" fields'], 400);
        }

        $activity = new Activity();
        $activity->setType($payload['type']);
        $activity->setDescription($payload['description']);

        /** @var \App\Entity\User $user */
        $user = $this->getUser();
        $activity->setAuthor($user);

        if (!empty($payload['customer_id'])) {
            $customer = $em->getRepository(Customer::class)->find($payload['customer_id']);
            if ($customer) $activity->setCustomer($customer);
        }

        if (!empty($payload['opportunity_id'])) {
            $opportunity = $em->getRepository(Opportunity::class)->find($payload['opportunity_id']);
            if ($opportunity) $activity->setOpportunity($opportunity);
        }

        $em->persist($activity);
        $em->flush();

        return $this->json([
            'success' => true,
            'data' => [
                'id' => $activity->getId(),
                'type' => $activity->getType()
            ]
        ], 201);
    }
}
