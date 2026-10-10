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
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

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

    #[Route('/profile', name: 'api_auth_profile_update', methods: ['PATCH'])]
    public function updateProfile(Request $request, #[CurrentUser] ?User $user, EntityManagerInterface $em, UserPasswordHasherInterface $hasher): JsonResponse
    {
        if (!$user) return $this->json(['success' => false, 'message' => 'Non authentifié.'], Response::HTTP_UNAUTHORIZED);
        $data = json_decode($request->getContent(), true) ?? [];
        $firstName = trim((string) ($data['firstName'] ?? ''));
        $lastName = trim((string) ($data['lastName'] ?? ''));
        $email = strtolower(trim((string) ($data['email'] ?? '')));
        if ($firstName === '' || $lastName === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->json(['success' => false, 'message' => 'Nom, prénom et adresse email valides obligatoires.'], 422);
        }
        $existing = $em->getRepository(User::class)->findOneByEmail($email);
        if ($existing && !$existing->getId()->equals($user->getId())) return $this->json(['success' => false, 'message' => 'Cette adresse email est déjà utilisée.'], 409);
        if (isset($data['newPassword']) && $data['newPassword'] !== '') {
            if (strlen($data['newPassword']) < 10 || !$hasher->isPasswordValid($user, (string) ($data['currentPassword'] ?? ''))) {
                return $this->json(['success' => false, 'message' => 'Mot de passe actuel incorrect ou nouveau mot de passe trop court (10 caractères minimum).'], 422);
            }
            $user->setPassword($hasher->hashPassword($user, $data['newPassword']));
        }
        $user->setFirstName($firstName)->setLastName($lastName)->setEmail($email)->setPhone(isset($data['phone']) ? trim((string) $data['phone']) : null);
        $em->flush();
        return $this->json(['success' => true, 'user' => $this->authService->formatUserPayload($user)]);
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

    #[Route('/status', name: 'api_auth_status', methods: ['POST'])]
    public function status(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];
        $uuid = $data['uuid'] ?? '';

        try {
            $result = $this->authService->checkStatus($uuid);
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

    #[Route('/forgot-password', name: 'api_auth_forgot_password', methods: ['POST'])]
    public function forgotPassword(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];
        $email = $data['email'] ?? '';

        try {
            $this->authService->forgotPassword($email);
            // On retourne toujours OK, même si l'email n'existe pas
            return $this->json([
                'success' => true,
                'message' => 'Si l\'adresse existe, un email de récupération a été envoyé.',
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de la demande de réinitialisation.',
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/reset-password', name: 'api_auth_reset_password', methods: ['POST'])]
    public function resetPassword(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];
        $token = $data['token'] ?? '';
        $newPassword = $data['password'] ?? '';

        try {
            $this->authService->resetPassword($token, $newPassword);
            return $this->json([
                'success' => true,
                'message' => 'Votre mot de passe a été réinitialisé avec succès.',
            ]);
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
