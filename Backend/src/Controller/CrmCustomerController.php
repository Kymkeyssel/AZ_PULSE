<?php

namespace App\Controller;

use App\Entity\Customer;
use App\Service\CustomerService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/customers', name: 'api_customers_')]
#[IsGranted('crm.read')]
class CrmCustomerController extends AbstractController
{
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $status = $request->query->get('status');
        $ownerId = $request->query->get('owner');

        $criteria = [];
        if ($status) $criteria['status'] = $status;
        if ($ownerId) $criteria['owner'] = $ownerId;

        $customers = $em->getRepository(Customer::class)->findBy($criteria);

        $data = array_map(fn($c) => [
            'id' => $c->getId(),
            'name' => $c->getName(),
            'email' => $c->getEmail(),
            'phone' => $c->getPhone(),
            'industry' => $c->getIndustry(),
            'status' => $c->getStatus(),
            'owner_id' => $c->getOwner()?->getId(),
            'createdAt' => $c->getCreatedAt()->format(\DateTimeInterface::ATOM)
        ], $customers);

        return $this->json(['success' => true, 'data' => $data]);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    #[IsGranted('crm.create')]
    public function create(Request $request, CustomerService $customerService): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);
        
        if (empty($payload['name'])) {
            return $this->json(['success' => false, 'error' => 'Missing "name" field'], 400);
        }

        $customer = new Customer();
        $customer->setName($payload['name']);
        if (isset($payload['email'])) $customer->setEmail($payload['email']);
        if (isset($payload['phone'])) $customer->setPhone($payload['phone']);
        if (isset($payload['industry'])) $customer->setIndustry($payload['industry']);
        
        /** @var \App\Entity\User $user */
        $user = $this->getUser();
        $customer->setOwner($user);

        $customerService->createCustomer($customer);

        return $this->json([
            'success' => true,
            'data' => [
                'id' => $customer->getId(),
                'name' => $customer->getName(),
                'status' => $customer->getStatus()
            ]
        ], 201);
    }

    #[Route('/{id}', name: 'read', methods: ['GET'])]
    public function read(Customer $customer): JsonResponse
    {
        return $this->json([
            'success' => true,
            'data' => [
                'id' => $customer->getId(),
                'name' => $customer->getName(),
                'email' => $customer->getEmail(),
                'phone' => $customer->getPhone(),
                'industry' => $customer->getIndustry(),
                'status' => $customer->getStatus(),
                'owner_id' => $customer->getOwner()?->getId(),
                'createdAt' => $customer->getCreatedAt()->format(\DateTimeInterface::ATOM)
            ]
        ]);
    }

    #[Route('/{id}', name: 'update', methods: ['PATCH'])]
    #[IsGranted('crm.update')]
    public function update(Customer $customer, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);

        if (isset($payload['name'])) $customer->setName($payload['name']);
        if (isset($payload['email'])) $customer->setEmail($payload['email']);
        if (isset($payload['phone'])) $customer->setPhone($payload['phone']);
        if (isset($payload['industry'])) $customer->setIndustry($payload['industry']);
        if (isset($payload['status'])) $customer->setStatus($payload['status']);

        $em->flush();

        return $this->json([
            'success' => true,
            'data' => [
                'id' => $customer->getId(),
                'name' => $customer->getName(),
                'status' => $customer->getStatus()
            ]
        ]);
    }
}
