<?php

namespace App\Controller;

use App\Entity\Role;
use App\Entity\Permission;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use App\Service\AuditLogService;

#[Route('/api/roles')]
#[IsGranted('ROLE_SUPER_ADMIN')]
class RolePermissionController extends AbstractController
{
    #[Route('', name: 'api_roles_list', methods: ['GET'])]
    public function list(EntityManagerInterface $em): JsonResponse
    {
        $roles = $em->getRepository(Role::class)->findAll();
        $permissions = $em->getRepository(Permission::class)->findAll();

        $rolesData = [];
        foreach ($roles as $role) {
            $rolePerms = [];
            foreach ($role->getPermissions() as $p) {
                $rolePerms[] = $p->getCode();
            }
            $rolesData[] = [
                'id' => $role->getId(),
                'code' => $role->getCode(),
                'label' => $role->getLabel(),
                'description' => $role->getDescription(),
                'isSystem' => $role->isSystem(),
                'permissions' => $rolePerms,
            ];
        }

        $permissionsData = [];
        foreach ($permissions as $p) {
            $permissionsData[] = [
                'code' => $p->getCode(),
                'module' => $p->getModule(),
                'description' => $p->getDescription(),
            ];
        }

        return $this->json([
            'success' => true,
            'data' => [
                'roles' => $rolesData,
                'permissions' => $permissionsData,
            ]
        ]);
    }

    #[Route('/{id}/permissions', name: 'api_roles_update_permissions', methods: ['POST', 'PUT'])]
    public function updatePermissions(int $id, Request $request, EntityManagerInterface $em, AuditLogService $auditLogger): JsonResponse
    {
        $role = $em->getRepository(Role::class)->find($id);
        if (!$role) {
            return $this->json(['error' => 'Rôle non trouvé'], 404);
        }

        $data = json_decode($request->getContent(), true);
        if (!isset($data['permissions']) || !is_array($data['permissions'])) {
            return $this->json(['error' => 'Tableau de permissions manquant'], 400);
        }

        // On ne modifie pas les droits du SUPER_ADMIN (sécurité hardcodée si besoin)
        if ($role->getCode() === 'SUPER_ADMIN') {
            return $this->json(['error' => 'Les droits du Super Administrateur ne peuvent pas être restreints.'], 403);
        }

        $requestedCodes = $data['permissions'];
        
        // Supprimer toutes les permissions actuelles
        $role->getPermissions()->clear();

        // Ajouter les nouvelles
        $permissionRepo = $em->getRepository(Permission::class);
        $addedCount = 0;
        foreach ($requestedCodes as $code) {
            $p = $permissionRepo->findOneBy(['code' => $code]);
            if ($p) {
                $role->addPermission($p);
                $addedCount++;
            }
        }

        $em->flush();

        $auditLogger->record(
            'ROLE_PERMISSIONS_UPDATED',
            "Mise à jour des permissions pour le rôle {$role->getLabel()} ({$role->getCode()}). {$addedCount} permission(s) accordée(s).",
            $this->getUser() // Need to pass the actor or null
        );

        return $this->json([
            'success' => true,
            'message' => 'Permissions mises à jour avec succès',
        ]);
    }
}
