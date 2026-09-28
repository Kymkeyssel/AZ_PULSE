<?php

namespace App\Controller\Api\Knowledge;

use App\Entity\Category;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/knowledge/categories', name: 'api_knowledge_categories_')]
class CategoryController extends AbstractController
{
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(EntityManagerInterface $em): JsonResponse
    {
        $categories = $em->getRepository(Category::class)->findBy([], ['name' => 'ASC']);

        $data = array_map(fn($c) => [
            'id' => $c->getId(),
            'name' => $c->getName(),
            'description' => $c->getDescription(),
        ], $categories);

        return $this->json(['success' => true, 'data' => $data]);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    #[IsGranted('knowledge.write')]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);

        if (empty($payload['name'])) {
            return $this->json(['success' => false, 'error' => 'Missing "name" field'], 400);
        }

        $category = new Category();
        $category->setName($payload['name']);
        
        if (!empty($payload['description'])) {
            $category->setDescription($payload['description']);
        }

        $em->persist($category);
        $em->flush();

        return $this->json([
            'success' => true,
            'data' => [
                'id' => $category->getId(),
                'name' => $category->getName()
            ]
        ], 201);
    }
}
