<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\PermissionRepository;
use App\Repository\RoleRepository;
use App\Service\AccessRequestService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api/admin')]
class AdminAccessRequestController extends AbstractController
{
    public function __construct(
        private readonly AccessRequestService $accessRequestService,
        private readonly RoleRepository $roleRepository,
        private readonly PermissionRepository $permissionRepository,
    ) {
    }

    #[Route('/access-requests', name: 'api_admin_access_requests_list', methods: ['GET'])]
    public function listRequests(Request $request, #[CurrentUser] ?User $user): JsonResponse
    {
        if (!$user || (!$user->hasRoleCode('ADMIN') && !$user->hasRoleCode('SUPER_ADMIN') && !$user->hasPermission('access_request.read'))) {
            return $this->json(['success' => false, 'message' => 'Accès refusé. Droits insuffisants.'], Response::HTTP_FORBIDDEN);
        }

        $status = $request->query->get('status');
        $data = $this->accessRequestService->listRequests($status);

        return $this->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    #[Route('/access-requests/{id}/approve', name: 'api_admin_access_requests_approve', methods: ['POST'])]
    public function approveRequest(string $id, Request $request, #[CurrentUser] ?User $user): JsonResponse
    {
        if (!$user || (!$user->hasRoleCode('ADMIN') && !$user->hasRoleCode('SUPER_ADMIN') && !$user->hasPermission('access_request.manage'))) {
            return $this->json(['success' => false, 'message' => 'Accès refusé. Droits insuffisants.'], Response::HTTP_FORBIDDEN);
        }

        $body = json_decode($request->getContent(), true) ?? [];
        $roleCode = $body['roleCode'] ?? '';
        $customGrants = $body['customGrants'] ?? [];
        $customRevokes = $body['customRevokes'] ?? [];

        if (empty($roleCode)) {
            return $this->json(['success' => false, 'message' => 'Le rôle à attribuer est obligatoire.'], Response::HTTP_BAD_REQUEST);
        }

        // Seul un SUPER_ADMIN peut nommer un autre SUPER_ADMIN
        if ($roleCode === 'SUPER_ADMIN' && !$user->hasRoleCode('SUPER_ADMIN')) {
            return $this->json(['success' => false, 'message' => 'Seul le Super Administrateur peut promouvoir au rang de Super Admin.'], Response::HTTP_FORBIDDEN);
        }

        try {
            $accessRequest = $this->accessRequestService->getRequestById($id);
            $result = $this->accessRequestService->approve($accessRequest, $roleCode, $user, $customGrants, $customRevokes);
            return $this->json($result);
        } catch (HttpExceptionInterface $e) {
            return $this->json(['success' => false, 'message' => $e->getMessage()], $e->getStatusCode());
        } catch (\Exception $e) {
            return $this->json(['success' => false, 'message' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/access-requests/{id}/reject', name: 'api_admin_access_requests_reject', methods: ['POST'])]
    public function rejectRequest(string $id, Request $request, #[CurrentUser] ?User $user): JsonResponse
    {
        if (!$user || (!$user->hasRoleCode('ADMIN') && !$user->hasRoleCode('SUPER_ADMIN') && !$user->hasPermission('access_request.manage'))) {
            return $this->json(['success' => false, 'message' => 'Accès refusé. Droits insuffisants.'], Response::HTTP_FORBIDDEN);
        }

        $body = json_decode($request->getContent(), true) ?? [];
        $reason = $body['reason'] ?? '';

        try {
            $accessRequest = $this->accessRequestService->getRequestById($id);
            $result = $this->accessRequestService->reject($accessRequest, $reason, $user);
            return $this->json($result);
        } catch (HttpExceptionInterface $e) {
            return $this->json(['success' => false, 'message' => $e->getMessage()], $e->getStatusCode());
        } catch (\Exception $e) {
            return $this->json(['success' => false, 'message' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/roles-permissions', name: 'api_admin_roles_permissions', methods: ['GET'])]
    public function getRolesAndPermissions(#[CurrentUser] ?User $user): JsonResponse
    {
        if (!$user || (!$user->hasRoleCode('ADMIN') && !$user->hasRoleCode('SUPER_ADMIN'))) {
            return $this->json(['success' => false, 'message' => 'Accès refusé.'], Response::HTTP_FORBIDDEN);
        }

        $roles = $this->roleRepository->findAll();
        $permissions = $this->permissionRepository->findAll();

        $rolesData = [];
        foreach ($roles as $r) {
            // Un Admin classique ne peut pas attribuer le rôle SUPER_ADMIN
            if ($r->getCode() === 'SUPER_ADMIN' && !$user->hasRoleCode('SUPER_ADMIN')) {
                continue;
            }

            $permCodes = [];
            foreach ($r->getPermissions() as $p) {
                $permCodes[] = $p->getCode();
            }

            $rolesData[] = [
                'id' => $r->getId(),
                'code' => $r->getCode(),
                'label' => $r->getLabel(),
                'description' => $r->getDescription(),
                'permissions' => $permCodes,
            ];
        }

        $permsData = [];
        foreach ($permissions as $p) {
            $permsData[] = [
                'id' => $p->getId(),
                'code' => $p->getCode(),
                'module' => $p->getModule(),
                'description' => $p->getDescription(),
            ];
        }

        return $this->json([
            'success' => true,
            'roles' => $rolesData,
            'permissions' => $permsData,
        ]);
    }
}
