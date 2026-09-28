<?php

namespace App\Controller;

use App\Entity\Customer;
use App\Entity\Opportunity;
use App\Entity\Reminder;
use App\Entity\User;
use App\Repository\CustomerRepository;
use App\Repository\OpportunityRepository;
use App\Repository\ReminderRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

/**
 * Relances commerciales.
 *
 * Règle d'accès retenue : un collaborateur voit et traite ses propres relances.
 * Le CRM d'équipe (toutes les relances du portefeuille) exige `crm.manage`,
 * réservé aux responsables. Sans cela, chaque commercial verrait le carnet
 * de son collègue — ce qui n'a pas de sens dans une société.
 */
#[Route('/api/reminders')]
class CrmReminderController extends AbstractController
{
    public function __construct(
        private readonly ReminderRepository $reminderRepository,
        private readonly CustomerRepository $customerRepository,
        private readonly OpportunityRepository $opportunityRepository,
        private readonly UserRepository $userRepository,
        private readonly EntityManagerInterface $em,
    ) {
    }

    // ── Lecture ───────────────────────────────────────────────────────────

    #[Route('', name: 'api_reminders_list', methods: ['GET'])]
    #[IsGranted('crm.read')]
    public function list(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        $scope = $request->query->get('scope', 'mine');
        $filters = [
            'status' => $request->query->get('status'),
            'customer' => $request->query->get('customer'),
            'opportunity' => $request->query->get('opportunity'),
            'overdueOnly' => $request->query->getBoolean('overdue'),
            'limit' => $request->query->getInt('limit') ?: null,
        ];

        // « Mes relances » par défaut ; le portefeuille complet est réservé.
        if ($scope !== 'all' || !$this->isGranted('crm.manage')) {
            $scope = 'mine';
            $filters['assignedTo'] = $user->getId()->toRfc4122();
        } elseif ($owner = $request->query->get('assignedTo')) {
            $filters['assignedTo'] = $owner;
        }

        $reminders = $this->reminderRepository->search($filters);

        return $this->json([
            'success' => true,
            'data' => array_map($this->format(...), $reminders),
        ]);
    }

    /**
     * Compteurs pour l'accueil : en retard / aujourd'hui / à venir.
     */
    #[Route('/summary', name: 'api_reminders_summary', methods: ['GET'])]
    #[IsGranted('crm.read')]
    public function summary(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        return $this->json([
            'success' => true,
            'data' => $this->reminderRepository->countUpcoming($user->getId()->toRfc4122()),
        ]);
    }

    #[Route('/{id}', name: 'api_reminders_read', methods: ['GET'])]
    #[IsGranted('crm.read')]
    public function read(Reminder $reminder): JsonResponse
    {
        $this->assertCanHandle($reminder);

        return $this->json(['success' => true, 'data' => $this->format($reminder)]);
    }

    // ── Écriture ──────────────────────────────────────────────────────────

    #[Route('', name: 'api_reminders_create', methods: ['POST'])]
    #[IsGranted('crm.create')]
    public function create(Request $request): JsonResponse
    {
        $payload = json_decode($request->getContent(), true) ?? [];

        $title = trim((string) ($payload['title'] ?? ''));
        if ($title === '') {
            return $this->json(['success' => false, 'message' => 'L\'intitulé est obligatoire.'], 400);
        }

        $dueAt = $this->parseDate($payload['dueAt'] ?? null);
        if ($dueAt === null) {
            return $this->json(['success' => false, 'message' => 'L\'échéance est obligatoire.'], 400);
        }

        $type = strtoupper((string) ($payload['type'] ?? Reminder::TYPE_CALL));
        if (!in_array($type, Reminder::TYPES, true)) {
            return $this->json(['success' => false, 'message' => 'Type de relance inconnu.'], 400);
        }

        $priority = strtoupper((string) ($payload['priority'] ?? Reminder::PRIORITY_NORMAL));
        if (!in_array($priority, Reminder::PRIORITIES, true)) {
            $priority = Reminder::PRIORITY_NORMAL;
        }

        /** @var User $user */
        $user = $this->getUser();

        $reminder = new Reminder();
        $reminder->setTitle($title);
        $reminder->setDueAt($dueAt);
        $reminder->setType($type);
        $reminder->setPriority($priority);
        $reminder->setDescription($this->nullableText($payload['description'] ?? null));
        $reminder->setCreatedBy($user);

        // Par défaut, la relance est pour soi : c'est le cas d'usage dominant.
        $reminder->setAssignedTo($this->resolveUser($payload['assignedTo'] ?? null) ?? $user);

        if ($customerId = $payload['customer_id'] ?? null) {
            $customer = $this->customerRepository->find((int) $customerId);
            if (!$customer) {
                return $this->json(['success' => false, 'message' => 'Client introuvable.'], 404);
            }
            $reminder->setCustomer($customer);
        }

        if ($opportunityId = $payload['opportunity_id'] ?? null) {
            $opportunity = $this->opportunityRepository->find((int) $opportunityId);
            if (!$opportunity) {
                return $this->json(['success' => false, 'message' => 'Opportunité introuvable.'], 404);
            }
            $reminder->setOpportunity($opportunity);

            // Rattacher l'affaire rattache aussi le client, pour éviter
            // une relance orpheline que personne ne saura retrouver.
            if ($reminder->getCustomer() === null) {
                $reminder->setCustomer($opportunity->getCustomer());
            }
        }

        $this->em->persist($reminder);
        $this->em->flush();

        return $this->json(['success' => true, 'data' => $this->format($reminder)], 201);
    }

    #[Route('/{id}', name: 'api_reminders_update', methods: ['PATCH'])]
    #[IsGranted('crm.update')]
    public function update(Reminder $reminder, Request $request): JsonResponse
    {
        $this->assertCanHandle($reminder);

        $payload = json_decode($request->getContent(), true) ?? [];

        if (isset($payload['title'])) {
            $title = trim((string) $payload['title']);
            if ($title === '') {
                return $this->json(['success' => false, 'message' => 'L\'intitulé ne peut pas être vide.'], 400);
            }
            $reminder->setTitle($title);
        }

        if (array_key_exists('description', $payload)) {
            $reminder->setDescription($this->nullableText($payload['description']));
        }

        if (isset($payload['dueAt'])) {
            $dueAt = $this->parseDate($payload['dueAt']);
            if ($dueAt === null) {
                return $this->json(['success' => false, 'message' => 'Échéance invalide.'], 400);
            }
            $reminder->setDueAt($dueAt);
        }

        if (isset($payload['type'])) {
            $type = strtoupper((string) $payload['type']);
            if (!in_array($type, Reminder::TYPES, true)) {
                return $this->json(['success' => false, 'message' => 'Type de relance inconnu.'], 400);
            }
            $reminder->setType($type);
        }

        if (isset($payload['priority'])) {
            $priority = strtoupper((string) $payload['priority']);
            if (!in_array($priority, Reminder::PRIORITIES, true)) {
                return $this->json(['success' => false, 'message' => 'Priorité inconnue.'], 400);
            }
            $reminder->setPriority($priority);
        }

        // Réaffecter une relance est réservé à l'encadrement.
        if (isset($payload['assignedTo'])) {
            if (!$this->isGranted('crm.manage')) {
                throw new AccessDeniedHttpException('Seul un responsable peut réaffecter une relance.');
            }
            $assignee = $this->resolveUser($payload['assignedTo']);
            if ($assignee === null) {
                return $this->json(['success' => false, 'message' => 'Collaborateur introuvable.'], 404);
            }
            $reminder->setAssignedTo($assignee);
        }

        $this->em->flush();

        return $this->json(['success' => true, 'data' => $this->format($reminder)]);
    }

    /**
     * Clôture d'une relance. C'est l'action la plus fréquente : elle deserves
     * sa propre route plutôt qu'un PATCH générique, pour être appelable en un
     * clic depuis l'interface.
     */
    #[Route('/{id}/complete', name: 'api_reminders_complete', methods: ['POST'])]
    #[IsGranted('crm.update')]
    public function complete(Reminder $reminder): JsonResponse
    {
        $this->assertCanHandle($reminder);
        $reminder->markDone();

        $this->em->flush();

        return $this->json(['success' => true, 'data' => $this->format($reminder)]);
    }

    #[Route('/{id}/reopen', name: 'api_reminders_reopen', methods: ['POST'])]
    #[IsGranted('crm.update')]
    public function reopen(Reminder $reminder): JsonResponse
    {
        $this->assertCanHandle($reminder);
        $reminder->reopen();

        $this->em->flush();

        return $this->json(['success' => true, 'data' => $this->format($reminder)]);
    }

    #[Route('/{id}', name: 'api_reminders_delete', methods: ['DELETE'])]
    #[IsGranted('crm.delete')]
    public function delete(Reminder $reminder): JsonResponse
    {
        $this->assertCanHandle($reminder);
        $this->em->remove($reminder);
        $this->em->flush();

        return $this->json(['success' => true]);
    }

    // ── Interne ───────────────────────────────────────────────────────────

    /**
     * Sérialise une relance pour l'interface.
     *
     * @return array<string, mixed>
     */
    private function format(Reminder $reminder): array
    {
        return [
            'id' => $reminder->getId(),
            'title' => $reminder->getTitle(),
            'description' => $reminder->getDescription(),
            'type' => $reminder->getType(),
            'status' => $reminder->getStatus(),
            'priority' => $reminder->getPriority(),
            'dueAt' => $reminder->getDueAt()?->format(\DateTimeInterface::ATOM),
            'completedAt' => $reminder->getCompletedAt()?->format(\DateTimeInterface::ATOM),
            'overdue' => $reminder->isOverdue(),
            'customer' => $reminder->getCustomer() ? [
                'id' => $reminder->getCustomer()->getId(),
                'name' => $reminder->getCustomer()->getName(),
            ] : null,
            'opportunity' => $reminder->getOpportunity() ? [
                'id' => $reminder->getOpportunity()->getId(),
                'title' => $reminder->getOpportunity()->getTitle(),
                'stage' => $reminder->getOpportunity()->getStage(),
            ] : null,
            'assignedTo' => $reminder->getAssignedTo() ? [
                'id' => $reminder->getAssignedTo()->getId()->toRfc4122(),
                'name' => $reminder->getAssignedTo()->getFullName(),
            ] : null,
            'createdAt' => $reminder->getCreatedAt()?->format(\DateTimeInterface::ATOM),
        ];
    }

    /**
     * Un collaborateur ne manipule que ses propres relances.
     * `crm.manage` (responsable) lève cette restriction.
     */
    private function assertCanHandle(Reminder $reminder): void
    {
        if ($this->isGranted('crm.manage')) {
            return;
        }

        /** @var User $user */
        $user = $this->getUser();
        $assigneeId = $reminder->getAssignedTo()?->getId()->toRfc4122();

        if ($assigneeId !== $user->getId()->toRfc4122()) {
            throw new AccessDeniedHttpException('Cette relance ne vous est pas affectée.');
        }
    }

    private function resolveUser(mixed $id): ?User
    {
        if ($id === null || $id === '') {
            return null;
        }

        return $this->userRepository->find($id);
    }

    /**
     * Accepte une date ISO 8601 (avec ou sans heure) et la normalise.
     * Le jour seul suffit : une relance se pense « le 12 », pas « le 12 à 14h37 ».
     */
    private function parseDate(mixed $value): ?\DateTimeImmutable
    {
        if (!is_string($value) || trim($value) === '') {
            return null;
        }

        try {
            return new \DateTimeImmutable(trim($value));
        } catch (\Exception) {
            return null;
        }
    }

    private function nullableText(mixed $value): ?string
    {
        if (!is_string($value)) {
            return null;
        }

        $value = trim($value);

        return $value === '' ? null : $value;
    }
}
