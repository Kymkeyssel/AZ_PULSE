<?php

namespace App\Controller;

use App\Entity\Document;
use App\Entity\Folder;
use App\Entity\Category;
use App\Entity\Tag;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;

#[Route('/api/knowledge/documents', name: 'api_knowledge_documents_')]
class KnowledgeHubController extends AbstractController
{
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $criteria = [];
        // Si l'utilisateur n'a pas les droits pour voir tout, il ne voit que les PUBLISHED
        if (!$this->isGranted('knowledge.read_all')) {
            $criteria['status'] = 'PUBLISHED';
        }

        $documents = $em->getRepository(Document::class)->findBy($criteria, ['createdAt' => 'DESC']);

        $data = array_map(fn($d) => [
            'id' => $d->getId(),
            'title' => $d->getTitle(),
            'description' => $d->getDescription(),
            'originalName' => $d->getOriginalName(),
            'mimeType' => $d->getMimeType(),
            'size' => $d->getSize(),
            'type' => $d->getType(),
            'currentVersion' => $d->getCurrentVersion(),
            'status' => $d->getStatus(),
            'category' => $d->getCategory() ? ['id' => $d->getCategory()->getId(), 'name' => $d->getCategory()->getName()] : null,
            'folder' => $d->getFolder() ? ['id' => $d->getFolder()->getId(), 'name' => $d->getFolder()->getName()] : null,
            'tags' => $d->getTags()->map(fn($t) => ['id' => $t->getId(), 'name' => $t->getName(), 'color' => $t->getColor()])->toArray(),
            'owner_name' => $d->getOwner()?->getFirstName() . ' ' . $d->getOwner()?->getLastName(),
            'createdAt' => $d->getCreatedAt()?->format(\DateTimeInterface::ATOM),
            'publishedAt' => $d->getPublishedAt()?->format(\DateTimeInterface::ATOM),
        ], $documents);

        return $this->json(['success' => true, 'data' => $data]);
    }

    #[Route('', name: 'upload', methods: ['POST'])]
    #[IsGranted('knowledge.write')]
    public function upload(Request $request, EntityManagerInterface $em, SluggerInterface $slugger): JsonResponse
    {
        /** @var UploadedFile $file */
        $file = $request->files->get('file');
        $title = $request->request->get('title');

        if (!$file) {
            return $this->json(['success' => false, 'error' => 'No file provided'], 400);
        }

        if (!$title) {
            $title = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        }

        // Configuration du répertoire de stockage local
        $storageDir = $this->getParameter('kernel.project_dir') . '/var/storage/knowledge';
        if (!is_dir($storageDir)) {
            mkdir($storageDir, 0777, true);
        }

        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $slugger->slug($originalFilename);
        $newFilename = $safeFilename . '-' . uniqid() . '.' . $file->guessExtension();

        try {
            $file->move($storageDir, $newFilename);
        } catch (\Exception $e) {
            return $this->json(['success' => false, 'error' => 'Could not save the file'], 500);
        }

        $document = new Document();
        $document->setTitle($title);
        $document->setOriginalName($file->getClientOriginalName());
        $document->setMimeType($file->getClientMimeType() ?? 'application/octet-stream');
        $document->setSize(filesize($storageDir . '/' . $newFilename)); 
        $document->setStoragePath($newFilename);

        if ($request->request->has('description')) $document->setDescription($request->request->get('description'));
        if ($request->request->has('type')) $document->setType($request->request->get('type'));
        
        // Handle relations
        if ($request->request->has('category_id')) {
            $category = $em->getRepository(Category::class)->find($request->request->get('category_id'));
            if ($category) $document->setCategory($category);
        }
        
        if ($request->request->has('folder_id')) {
            $folder = $em->getRepository(Folder::class)->find($request->request->get('folder_id'));
            if ($folder) $document->setFolder($folder);
        }
        
        $tagsStr = $request->request->get('tag_ids');
        if ($tagsStr) {
            $tagIds = json_decode($tagsStr, true);
            if (is_array($tagIds)) {
                foreach ($tagIds as $tagId) {
                    $tag = $em->getRepository(Tag::class)->find($tagId);
                    if ($tag) $document->addTag($tag);
                }
            }
        }

        /** @var \App\Entity\User $user */
        $user = $this->getUser();
        $document->setOwner($user);

        $em->persist($document);
        $em->flush();

        return $this->json([
            'success' => true,
            'data' => [
                'id' => $document->getId(),
                'title' => $document->getTitle(),
                'status' => $document->getStatus()
            ]
        ], 201);
    }

    #[Route('/{id}/download', name: 'download', methods: ['GET'])]
    public function download(Document $document): BinaryFileResponse|JsonResponse
    {
        // TODO: Implémenter le DocumentVoter pour vérifier les permissions de téléchargement
        // if (!$this->isGranted('DOWNLOAD', $document)) {
        //     return $this->json(['success' => false, 'error' => 'Access Denied'], 403);
        // }

        $storageDir = $this->getParameter('kernel.project_dir') . '/var/storage/knowledge';
        $filePath = $storageDir . '/' . $document->getStoragePath();

        if (!file_exists($filePath)) {
            return $this->json(['success' => false, 'error' => 'File not found on disk'], 404);
        }

        $response = new BinaryFileResponse($filePath);
        $response->setContentDisposition(
            ResponseHeaderBag::DISPOSITION_ATTACHMENT,
            $document->getOriginalName()
        );

        return $response;
    }
}
