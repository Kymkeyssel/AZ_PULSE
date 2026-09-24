<?php

namespace App\Controller;

use App\Service\GlpiService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/it/inventory')]
class ItInfrastructureController extends AbstractController
{
    public function __construct(
        private readonly GlpiService $glpiService,
    ) {
    }

    #[Route('/computers', name: 'api_it_inventory_computers', methods: ['GET'])]
    // #[IsGranted('ROLE_RESP_IT')] // Assumed role for IT manager, commented for MVP to facilitate testing
    public function getComputers(): JsonResponse
    {
        try {
            $computers = $this->glpiService->getComputers();
            
            return $this->json([
                'success' => true,
                'data' => $computers,
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
