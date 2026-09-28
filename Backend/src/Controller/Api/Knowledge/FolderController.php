<?php

namespace App\Controller\Api\Knowledge;

use App\Entity\Folder;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/knowledge/folders', name: 'api_knowledge_folders_')]
class FolderController extends AbstractController
{
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(EntityManagerInterface $em): JsonResponse
    {
        $folders = $em->getRepository(Folder::class)->findBy([], ['name' => 'ASC']);

        $data = array_map(fn($f) => [
            'id' => $f->getId(),
            'name' => $f->getName(),
            'description' => $f->getDescription(),
            'parent_id' => $f->getParent()?->getId(),
            'status' => $f->getStatus(),
            'createdAt' => $f->getCreatedAt()->format(\DateTimeInterface::ATOM)
        ], $folders);

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

        $folder = new Folder();
        $folder->setName($payload['name']);
        
        if (!empty($payload['description'])) {
            $folder->setDescription($payload['description']);
        }

        if (!empty($payload['parent_id'])) {
            $parent = $em->getRepository(Folder::class)->find($payload['parent_id']);
            if ($parent) {
                $folder->setParent($parent);
            }
        }

        /** @var \App\Entity\User $user */
        $user = $this->getUser();
        $folder->setOwner($user);

        $em->persist($folder);
        $em->flush();

        return $this->json([
            'success' => true,
            'data' => [
                'id' => $folder->getId(),
                'name' => $folder->getName(),
                'parent_id' => $folder->getParent()?->getId()
            ]
        ], 201);
    }
}
