<?php

namespace App\Controller;

use App\Entity\Role;
use App\Entity\User;
use App\Service\AuthService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/api/admin/users')]
#[IsGranted('ROLE_ADMIN')]
class AdminUserController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function index(EntityManagerInterface $em): JsonResponse
    {
        $users = $em->getRepository(User::class)->findBy([], ['lastName' => 'ASC', 'firstName' => 'ASC']);
        return $this->json(['success' => true, 'data' => array_map(fn (User $u) => $this->serializeUser($u), $users)]);
    }

    #[Route('', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em, UserPasswordHasherInterface $hasher, AuthService $auth): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];
        $email = strtolower(trim((string) ($data['email'] ?? '')));
        $firstName = trim((string) ($data['firstName'] ?? ''));
        $lastName = trim((string) ($data['lastName'] ?? ''));
        $roleCode = strtoupper(trim((string) ($data['role'] ?? 'COLLABORATEUR')));
        $role = $em->getRepository(Role::class)->findOneBy(['code' => $roleCode]);

        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $firstName === '' || $lastName === '' || !$role) {
            return $this->json(['success' => false, 'message' => 'Informations utilisateur ou rôle invalide.'], 422);
        }
        if (!$this->isGranted('ROLE_SUPER_ADMIN') && in_array($roleCode, ['ADMIN', 'SUPER_ADMIN'], true)) {
            throw $this->createAccessDeniedException('Seul le super administrateur peut créer un compte administrateur.');
        }
        if ($em->getRepository(User::class)->findOneByEmail($email)) {
            return $this->json(['success' => false, 'message' => 'Cette adresse email est déjà utilisée.'], 409);
        }

        $user = new User();
        $user->setEmail($email)->setFirstName($firstName)->setLastName($lastName)->setPhone($data['phone'] ?? null)->setStatus(User::STATUS_ACTIVE);
        $user->setPassword($hasher->hashPassword($user, bin2hex(random_bytes(32))));
        $user->addRole($role);
        $em->persist($user);
        $em->flush();
        if (!empty($data['sendInvite'])) {
            try { $auth->forgotPassword($email); } catch (\Throwable) { /* creation remains valid if mail delivery is unavailable */ }
        }
        return $this->json(['success' => true, 'data' => $this->serializeUser($user)], 201);
    }

    #[Route('/{id}', methods: ['PATCH'])]
    public function update(User $user, Request $request, EntityManagerInterface $em, #[CurrentUser] User $actor): JsonResponse
    {
        if (!$actor->hasRoleCode('SUPER_ADMIN') && ($user->hasRoleCode('ADMIN') || $user->hasRoleCode('SUPER_ADMIN'))) {
            throw $this->createAccessDeniedException('Un administrateur ne peut pas modifier un compte d’administration.');
        }
        if ($actor->getId()->equals($user->getId()) && (($data = json_decode($request->getContent(), true) ?? [])['status'] ?? null) !== null) {
            return $this->json(['success' => false, 'message' => 'Vous ne pouvez pas désactiver votre propre compte.'], 422);
        }
        $data = json_decode($request->getContent(), true) ?? [];
        if (isset($data['status'])) {
            $allowed = [User::STATUS_ACTIVE, User::STATUS_INACTIVE, User::STATUS_BLOCKED];
            if (!in_array($data['status'], $allowed, true)) return $this->json(['success' => false, 'message' => 'Statut invalide.'], 422);
            $user->setStatus($data['status']);
        }
        if (isset($data['role'])) {
            $roleCode = strtoupper(trim((string) $data['role']));
            if (!$this->isGranted('ROLE_SUPER_ADMIN') && in_array($roleCode, ['ADMIN', 'SUPER_ADMIN'], true)) {
                throw $this->createAccessDeniedException();
            }
            $role = $em->getRepository(Role::class)->findOneBy(['code' => $roleCode]);
            if (!$role) return $this->json(['success' => false, 'message' => 'Rôle introuvable.'], 404);
            $primaryRole = $user->getRolesEntities()->first();
            if ($primaryRole && strtoupper($primaryRole->getCode()) !== $roleCode) $user->removeRole($primaryRole);
            $user->addRole($role);
        }
        $em->flush();
        return $this->json(['success' => true, 'data' => $this->serializeUser($user)]);
    }

    private function serializeUser(User $user): array
    {
        $roles = $user->getRolesEntities();
        $firstRole = $roles->isEmpty() ? null : $roles->first();
        return [
            'id' => $user->getId()->toRfc4122(), 'firstName' => $user->getFirstName(), 'lastName' => $user->getLastName(),
            'email' => $user->getEmail(), 'phone' => $user->getPhone(), 'role' => $firstRole?->getCode() ?? 'USER',
            'roles' => $roles->map(fn (Role $r) => $r->getCode())->toArray(), 'status' => $user->getStatus(),
            'lastLogin' => $user->getLastLoginAt()?->format(\DateTimeInterface::ATOM), 'createdAt' => $user->getCreatedAt()->format(\DateTimeInterface::ATOM),
        ];
    }
}
