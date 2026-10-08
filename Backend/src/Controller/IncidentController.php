<?php

namespace App\Controller;

use App\Entity\Incident;
use App\Entity\User;
use App\Event\IncidentOpenedEvent;
use App\Event\IncidentResolvedEvent;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;

#[Route('/api/it/incidents', name: 'api_it_incidents_')]
class IncidentController extends AbstractController
{
    #[Route('', name: 'list', methods: ['GET'])]
    #[IsGranted('it.read')]
    public function list(EntityManagerInterface $em): JsonResponse
    {
        $incidents = $em->getRepository(Incident::class)->findBy([], ['createdAt' => 'DESC']);

        return $this->json(['success' => true, 'data' => array_map(fn (Incident $i) => $this->serialize($i), $incidents)]);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    #[IsGranted('it.manage')]
    public function create(Request $request, EntityManagerInterface $em, EventDispatcherInterface $dispatcher): JsonResponse
    {
        $payload = json_decode($request->getContent(), true) ?? [];
        if (empty($payload['title'])) {
            return $this->json(['success' => false, 'error' => 'Le titre est obligatoire.'], 400);
        }

        /** @var User $user */
        $user = $this->getUser();
        $incident = new Incident();
        $incident->setTitle($payload['title']);
        $incident->setDescription($payload['description'] ?? '');
        $incident->setPriority($payload['priority'] ?? 'MEDIUM');
        $incident->setCategory($payload['category'] ?? 'OTHER');
        $incident->setReporter($user);

        $em->persist($incident);
        $em->flush();

        $dispatcher->dispatch(
            (new IncidentOpenedEvent($incident))->withActor($user),
            IncidentOpenedEvent::NAME
        );

        return $this->json(['success' => true, 'data' => $this->serialize($incident)], 201);
    }

    #[Route('/{id}', name: 'update', methods: ['PATCH'])]
    #[IsGranted('it.manage')]
    public function update(Incident $incident, Request $request, EntityManagerInterface $em, EventDispatcherInterface $dispatcher): JsonResponse
    {
        $payload = json_decode($request->getContent(), true) ?? [];
        $previous = $incident->getStatus();

        if (isset($payload['title'])) {
            $incident->setTitle($payload['title']);
        }
        if (isset($payload['status'])) {
            $incident->setStatus($payload['status']);
        }
        if (isset($payload['priority'])) {
            $incident->setPriority($payload['priority']);
        }

        if (in_array($incident->getStatus(), ['RESOLVED', 'CLOSED'], true) && $incident->getResolvedAt() === null) {
            $incident->setResolvedAt(new \DateTime());
        }

        $em->flush();

        if ($previous !== $incident->getStatus() && in_array($incident->getStatus(), ['RESOLVED', 'CLOSED'], true)) {
            $dispatcher->dispatch(
                (new IncidentResolvedEvent($incident))->withActor($this->getUser()),
                IncidentResolvedEvent::NAME
            );
        }

        return $this->json(['success' => true, 'data' => $this->serialize($incident)]);
    }

    private function serialize(Incident $incident): array
    {
        return [
            'id' => $incident->getId(),
            'title' => $incident->getTitle(),
            'description' => $incident->getDescription(),
            'status' => $incident->getStatus(),
            'priority' => $incident->getPriority(),
            'category' => $incident->getCategory(),
            'reporter' => $incident->getReporter()?->getFullName(),
            'assignee' => $incident->getAssignee()?->getFullName(),
            'createdAt' => $incident->getCreatedAt()?->format(\DateTimeInterface::ATOM),
            'resolvedAt' => $incident->getResolvedAt()?->format(\DateTimeInterface::ATOM),
        ];
    }
}
