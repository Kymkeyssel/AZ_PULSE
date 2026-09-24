<?php

namespace App\Service;

use App\Entity\AccessRequest;
use App\Entity\Role;
use App\Entity\User;
use App\Entity\UserPermissionOverride;
use App\Repository\AccessRequestRepository;
use App\Repository\PermissionRepository;
use App\Repository\RoleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Uid\Uuid;

class AccessRequestService
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly AccessRequestRepository $accessRequestRepository,
        private readonly RoleRepository $roleRepository,
        private readonly PermissionRepository $permissionRepository,
    ) {
    }

    public function listRequests(?string $status = null): array
    {
        $requests = $this->accessRequestRepository->findByStatusOrdered($status);
        $data = [];

        foreach ($requests as $req) {
            $data[] = $this->formatRequest($req);
        }

        return $data;
    }

    public function getRequestById(string $id): AccessRequest
    {
        if (!Uuid::isValid($id)) {
            throw new BadRequestException('Identifiant de demande invalide.');
        }

        $request = $this->accessRequestRepository->find(Uuid::fromString($id));
        if (!$request) {
            throw new NotFoundHttpException('Demande d\'accès introuvable.');
        }

        return $request;
    }

    public function approve(AccessRequest $request, string $roleCode, ?User $admin, array $customGrants = [], array $customRevokes = []): array
    {
        if ($request->getStatus() !== AccessRequest::STATUS_PENDING) {
            throw new BadRequestException('Cette demande a déjà été traitée (Statut actuel : ' . $request->getStatus() . ').');
        }

        $role = $this->roleRepository->findOneByCode($roleCode);
        if (!$role) {
            throw new BadRequestException(sprintf('Le rôle "%s" est introuvable.', $roleCode));
        }

        $user = $request->getUser();

        // 1. Mise à jour de la demande
        $request->setStatus(AccessRequest::STATUS_APPROVED);
        $request->setAssignedRole($role);
        $request->setProcessedBy($admin);
        $request->setProcessedAt(new \DateTimeImmutable());

        // 2. Activation du compte & assignation du rôle
        $user->setStatus(User::STATUS_ACTIVE);
        $user->clearRoles();
        $user->addRole($role);

        // 3. Gestion des overrides de permissions optionnels
        foreach ($customGrants as $permCode) {
            $perm = $this->permissionRepository->findOneByCode($permCode);
            if ($perm) {
                $override = new UserPermissionOverride();
                $override->setUser($user);
                $override->setPermission($perm);
                $override->setIsGranted(true);
                $override->setGrantedBy($admin);
                $this->entityManager->persist($override);
            }
        }

        foreach ($customRevokes as $permCode) {
            $perm = $this->permissionRepository->findOneByCode($permCode);
            if ($perm) {
                $override = new UserPermissionOverride();
                $override->setUser($user);
                $override->setPermission($perm);
                $override->setIsGranted(false);
                $override->setGrantedBy($admin);
                $this->entityManager->persist($override);
            }
        }

        $this->entityManager->flush();

        return [
            'success' => true,
            'message' => sprintf('Demande validée. Compte activé avec le rôle %s (%s).', $role->getLabel(), $role->getCode()),
            'request' => $this->formatRequest($request),
        ];
    }

    public function reject(AccessRequest $request, string $reason, ?User $admin): array
    {
        if ($request->getStatus() !== AccessRequest::STATUS_PENDING) {
            throw new BadRequestException('Cette demande a déjà été traitée.');
        }

        if (empty(trim($reason))) {
            throw new BadRequestException('Veuillez indiquer un motif de refus.');
        }

        $user = $request->getUser();

        $request->setStatus(AccessRequest::STATUS_REJECTED);
        $request->setRejectionReason(trim($reason));
        $request->setProcessedBy($admin);
        $request->setProcessedAt(new \DateTimeImmutable());

        $user->setStatus(User::STATUS_REJECTED);

        $this->entityManager->flush();

        return [
            'success' => true,
            'message' => 'Demande d\'accès refusée.',
            'request' => $this->formatRequest($request),
        ];
    }

    public function formatRequest(AccessRequest $req): array
    {
        $user = $req->getUser();
        return [
            'id' => $req->getId()->toRfc4122(),
            'user' => [
                'id' => $user->getId()->toRfc4122(),
                'email' => $user->getEmail(),
                'firstName' => $user->getFirstName(),
                'lastName' => $user->getLastName(),
                'fullName' => $user->getFullName(),
                'phone' => $user->getPhone(),
                'status' => $user->getStatus(),
            ],
            'requestedDomain' => $req->getRequestedDomain(),
            'motivation' => $req->getMotivation(),
            'status' => $req->getStatus(),
            'rejectionReason' => $req->getRejectionReason(),
            'assignedRole' => $req->getAssignedRole() ? [
                'code' => $req->getAssignedRole()->getCode(),
                'label' => $req->getAssignedRole()->getLabel(),
            ] : null,
            'processedBy' => $req->getProcessedBy() ? $req->getProcessedBy()->getFullName() : null,
            'processedAt' => $req->getProcessedAt()?->format(\DateTimeInterface::ATOM),
            'createdAt' => $req->getCreatedAt()->format(\DateTimeInterface::ATOM),
        ];
    }
}
