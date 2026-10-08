<?php

namespace App\Controller;

use App\Entity\Category;
use App\Entity\Document;
use App\Entity\Folder;
use App\Entity\Project;
use App\Entity\Tag;
use App\Event\DocumentPublishedEvent;
use App\Security\Voter\DocumentVoter;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;

#[Route('/api/knowledge/documents', name: 'api_knowledge_documents_')]
class KnowledgeHubController extends AbstractController
{
    #[Route('', name: 'list', methods: ['GET'])]
    #[IsGranted('knowledge.read')]
    public function list(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $qb = $em->getRepository(Document::class)->createQueryBuilder('d');

        if (!$this->isGranted('knowledge.read_all')) {
            $qb->andWhere('d.status = :published')->setParameter('published', 'PUBLISHED');
        }

        $q = trim((string) $request->query->get('q', ''));
        if ($q !== '') {
            $qb->andWhere('LOWER(d.title) LIKE :q OR LOWER(COALESCE(d.description, \'\')) LIKE :q OR LOWER(d.originalName) LIKE :q')
                ->setParameter('q', '%' . mb_strtolower($q) . '%');
        }

        $projectId = $request->query->get('project_id');
        if ($projectId) {
            $qb->andWhere('IDENTITY(d.project) = :projectId')->setParameter('projectId', (int) $projectId);
        }

        $qb->orderBy('d.createdAt', 'DESC');
        $documents = $qb->getQuery()->getResult();

        return $this->json(['success' => true, 'data' => array_map(fn (Document $d) => $this->serialize($d), $documents)]);
    }

    #[Route('', name: 'upload', methods: ['POST'])]
    #[IsGranted('knowledge.write')]
    public function upload(Request $request, EntityManagerInterface $em, SluggerInterface $slugger): JsonResponse
    {
        /** @var UploadedFile|null $file */
        $file = $request->files->get('file');
        $title = $request->request->get('title');

        if (!$file) {
            return $this->json(['success' => false, 'error' => 'No file provided'], 400);
        }

        if (!$title) {
            $title = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        }

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
        $document->setTitle((string) $title);
        $document->setOriginalName($file->getClientOriginalName());
        $document->setMimeType($file->getClientMimeType() ?? 'application/octet-stream');
        $document->setSize((int) filesize($storageDir . '/' . $newFilename));
        $document->setStoragePath($newFilename);

        if ($request->request->has('description')) {
            $document->setDescription($request->request->get('description'));
        }
        if ($request->request->has('type')) {
            $document->setType((string) $request->request->get('type'));
        }

        if ($request->request->get('category_id')) {
            $category = $em->getRepository(Category::class)->find($request->request->get('category_id'));
            if ($category) {
                $document->setCategory($category);
            }
        }

        if ($request->request->get('folder_id')) {
            $folder = $em->getRepository(Folder::class)->find($request->request->get('folder_id'));
            if ($folder) {
                $document->setFolder($folder);
            }
        }

        if ($request->request->get('project_id')) {
            $project = $em->getRepository(Project::class)->find($request->request->get('project_id'));
            if ($project) {
                $document->setProject($project);
            }
        }

        $tagsStr = $request->request->get('tag_ids');
        if ($tagsStr) {
            $tagIds = json_decode($tagsStr, true);
            if (is_array($tagIds)) {
                foreach ($tagIds as $tagId) {
                    $tag = $em->getRepository(Tag::class)->find($tagId);
                    if ($tag) {
                        $document->addTag($tag);
                    }
                }
            }
        }

        $document->setOwner($this->getUser());
        $em->persist($document);
        $em->flush();

        return $this->json(['success' => true, 'data' => $this->serialize($document)], 201);
    }

    #[Route('/{id}/publish', name: 'publish', methods: ['POST'])]
    public function publish(Document $document, EntityManagerInterface $em, EventDispatcherInterface $dispatcher): JsonResponse
    {
        $this->denyAccessUnlessGranted(DocumentVoter::PUBLISH, $document);

        $document->setStatus('PUBLISHED');
        $document->setPublishedAt(new \DateTime());
        $em->flush();

        $dispatcher->dispatch(
            (new DocumentPublishedEvent($document))->withActor($this->getUser()),
            DocumentPublishedEvent::NAME
        );

        return $this->json(['success' => true, 'data' => $this->serialize($document)]);
    }

    #[Route('/{id}/download', name: 'download', methods: ['GET'])]
    public function download(Document $document): BinaryFileResponse|JsonResponse
    {
        $this->denyAccessUnlessGranted(DocumentVoter::DOWNLOAD, $document);

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

    private function serialize(Document $d): array
    {
        return [
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
            'project' => $d->getProject() ? ['id' => $d->getProject()->getId(), 'name' => $d->getProject()->getName()] : null,
            'tags' => $d->getTags()->map(fn ($t) => ['id' => $t->getId(), 'name' => $t->getName(), 'color' => $t->getColor()])->toArray(),
            'owner_name' => trim(($d->getOwner()?->getFirstName() ?? '') . ' ' . ($d->getOwner()?->getLastName() ?? '')),
            'createdAt' => $d->getCreatedAt()?->format(\DateTimeInterface::ATOM),
            'publishedAt' => $d->getPublishedAt()?->format(\DateTimeInterface::ATOM),
        ];
    }
}
