<?php

namespace App\Controller\Api\Knowledge;

use App\Entity\Tag;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/knowledge/tags', name: 'api_knowledge_tags_')]
class TagController extends AbstractController
{
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(EntityManagerInterface $em): JsonResponse
    {
        $tags = $em->getRepository(Tag::class)->findBy([], ['name' => 'ASC']);

        $data = array_map(fn($t) => [
            'id' => $t->getId(),
            'name' => $t->getName(),
            'color' => $t->getColor(),
        ], $tags);

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

        $tag = new Tag();
        $tag->setName($payload['name']);
        
        if (!empty($payload['color'])) {
            $tag->setColor($payload['color']);
        }

        $em->persist($tag);
        $em->flush();

        return $this->json([
            'success' => true,
            'data' => [
                'id' => $tag->getId(),
                'name' => $tag->getName(),
                'color' => $tag->getColor()
            ]
        ], 201);
    }
}
