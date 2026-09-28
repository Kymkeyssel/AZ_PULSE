<?php

namespace App\Controller;

use App\Entity\Customer;
use App\Repository\CustomerRepository;
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

        // `owner` est un identifiant public (UUID) : il faut résoudre l'entité,
        // Doctrine n'accepte pas la chaîne telle quelle sur une association.
        if ($ownerId) {
            $owner = $em->getRepository(\App\Entity\User::class)->find($ownerId);
            if ($owner) $criteria['owner'] = $owner;
        }

        $customers = $em->getRepository(Customer::class)->findBy($criteria, ['name' => 'ASC']);

        $data = array_map(fn($c) => $this->format($c), $customers);

        return $this->json(['success' => true, 'data' => $data]);
    }

    /**
     * Autocomplétion pour les saisies : chercher un client par son nom
     * ou son email, sans attendre d'avoir tout le carnet chargé.
     */
    #[Route('/search', name: 'search', methods: ['GET'])]
    public function search(Request $request, CustomerRepository $customerRepository): JsonResponse
    {
        $q = (string) $request->query->get('q', '');

        $data = array_map(
            fn($c) => $this->format($c),
            $customerRepository->search($q, min(50, max(5, $request->query->getInt('limit') ?: 20)))
        );

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
            'data' => $this->format($customer)
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

    /**
     * Sérialise un client pour l'interface.
     *
     * @return array<string, mixed>
     */
    private function format(Customer $customer): array
    {
        return [
            'id' => $customer->getId(),
            'name' => $customer->getName(),
            'email' => $customer->getEmail(),
            'phone' => $customer->getPhone(),
            'industry' => $customer->getIndustry(),
            'status' => $customer->getStatus(),
            'owner_id' => $customer->getOwner()?->getId()->toRfc4122(),
            'createdAt' => $customer->getCreatedAt()?->format(\DateTimeInterface::ATOM),
        ];
    }
}
