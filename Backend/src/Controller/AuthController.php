<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\AuthService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api/auth')]
class AuthController extends AbstractController
{
    public function __construct(
        private readonly AuthService $authService,
    ) {
    }

    #[Route('/register', name: 'api_auth_register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];
        $clientIp = $request->getClientIp() ?? '127.0.0.1';

        try {
            $result = $this->authService->register($data, $clientIp);
            return $this->json($result, Response::HTTP_CREATED);
        } catch (HttpExceptionInterface $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], $e->getStatusCode());
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/login', name: 'api_auth_login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
        $clientIp = $request->getClientIp() ?? '127.0.0.1';

        try {
            $result = $this->authService->login($email, $password, $clientIp);
            return $this->json([
                'success' => true,
                'token' => $result['token'],
                'expiresAt' => $result['expiresAt'],
                'user' => $result['user'],
            ]);
        } catch (HttpExceptionInterface $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], $e->getStatusCode());
        } catch (AuthenticationException $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], Response::HTTP_UNAUTHORIZED);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => 'Erreur lors de la connexion. Veuillez vérifier vos informations.',
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/me', name: 'api_auth_me', methods: ['GET'])]
    public function me(#[CurrentUser] ?User $user): JsonResponse
    {
        if (!$user) {
            return $this->json([
                'success' => false,
                'message' => 'Non authentifié.',
            ], Response::HTTP_UNAUTHORIZED);
        }

        return $this->json([
            'success' => true,
            'user' => $this->authService->formatUserPayload($user),
        ]);
    }

    #[Route('/activate', name: 'api_auth_activate', methods: ['POST'])]
    public function activate(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        try {
            $result = $this->authService->activate($email, $password);
            return $this->json($result, Response::HTTP_OK);
        } catch (HttpExceptionInterface $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], $e->getStatusCode());
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/logout', name: 'api_auth_logout', methods: ['POST'])]
    public function logout(Request $request, #[CurrentUser] ?User $user): JsonResponse
    {
        if ($user) {
            $authHeader = $request->headers->get('Authorization');
            $this->authService->logout($user, $authHeader);
        }

        return $this->json([
            'success' => true,
            'message' => 'Déconnexion réussie.',
        ]);
    }
}
