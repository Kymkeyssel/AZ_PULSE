<?php

namespace App\Service;

use App\Entity\AccessRequest;
use App\Entity\ApiToken;
use App\Entity\User;
use App\Repository\ApiTokenRepository;
use App\Repository\UserRepository;
use App\Security\UserChecker;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\RateLimiter\RateLimiterFactory;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;

class AuthService
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserRepository $userRepository,
        private readonly ApiTokenRepository $apiTokenRepository,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly UserChecker $userChecker,
        #[Autowire(service: 'limiter.login_limiter')]
        private readonly RateLimiterFactory $loginLimiter,
        #[Autowire(service: 'limiter.register_limiter')]
        private readonly RateLimiterFactory $registerLimiter,
    ) {
    }

    /**
     * Public Registration = Access Request creation
     */
    public function register(array $data, string $clientIp): array
    {
        // 1. Rate Limiting par IP
        $limiter = $this->registerLimiter->create($clientIp);
        if (false === $limiter->consume()->isAccepted()) {
            throw new TooManyRequestsHttpException(300, 'Trop de tentatives d\'inscription. Veuillez patienter avant de réessayer.');
        }

        $email = strtolower(trim($data['email'] ?? ''));
        $firstName = trim($data['firstName'] ?? '');
        $lastName = trim($data['lastName'] ?? '');
        $phone = isset($data['phone']) ? trim($data['phone']) : null;
        $requestedDomain = trim($data['requestedDomain'] ?? 'Général');
        $motivation = trim($data['motivation'] ?? '');

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new BadRequestException('Format d\'adresse email invalide.');
        }

        if (empty($firstName) || empty($lastName)) {
            throw new BadRequestException('Le nom et le prénom sont obligatoires.');
        }

        if (empty($motivation)) {
            throw new BadRequestException('Veuillez renseigner votre motivation ou fonction au sein d\'AZ CORPORATION.');
        }

        // Vérification unicité email
        $existing = $this->userRepository->findOneByEmail($email);
        if ($existing) {
            // Sécurité anti-énumération : on retourne un message neutre ou explicite si compte en attente
            if ($existing->getStatus() === User::STATUS_PENDING_APPROVAL) {
                throw new BadRequestException('Une demande d\'accès avec cette adresse email est déjà en attente d\'examen.');
            }
            throw new BadRequestException('Un compte existe déjà avec cette adresse email.');
        }

        // Création Utilisateur PENDING
        $user = new User();
        $user->setEmail($email);
        $user->setFirstName($firstName);
        $user->setLastName($lastName);
        $user->setPhone($phone);
        $user->setStatus(User::STATUS_PENDING_APPROVAL);
        
        $tempPassword = bin2hex(random_bytes(16));
        $user->setPassword($this->passwordHasher->hashPassword($user, $tempPassword));

        $this->entityManager->persist($user);

        // Création Demande d'accès
        $request = new AccessRequest();
        $request->setUser($user);
        $request->setRequestedDomain($requestedDomain);
        $request->setMotivation($motivation);
        $request->setStatus(AccessRequest::STATUS_PENDING);

        $this->entityManager->persist($request);
        $this->entityManager->flush();

        return [
            'success' => true,
            'message' => 'Votre demande d\'accès a été soumise avec succès. Elle sera examinée par la Direction.',
            'status' => User::STATUS_PENDING_APPROVAL,
        ];
    }

    /**
     * Authentification sécurisée
     */
    public function login(string $email, string $password, string $clientIp): array
    {
        $email = strtolower(trim($email));

        // 1. Rate Limiting anti brute-force par couple (email + IP)
        $limiter = $this->loginLimiter->create($email . '_' . $clientIp);
        if (false === $limiter->consume()->isAccepted()) {
            throw new TooManyRequestsHttpException(60, 'Trop de tentatives de connexion échouées. Veuillez patienter 1 minute.');
        }

        $user = $this->userRepository->findOneByEmail($email);
        if (!$user) {
            throw new BadCredentialsException('Identifiants de connexion invalides.');
        }

        if (!$this->passwordHasher->isPasswordValid($user, $password)) {
            throw new BadCredentialsException('Identifiants de connexion invalides.');
        }

        // 2. Vérification statut du compte via UserChecker
        $this->userChecker->checkPreAuth($user);

        // 3. Génération d'un jeton d'accès sécurisé (7 jours d'expiration)
        $plainToken = bin2hex(random_bytes(32));
        $expiresAt = new \DateTimeImmutable('+7 days');
        $apiToken = new ApiToken($user, $plainToken, $expiresAt);

        $user->setLastLoginAt(new \DateTimeImmutable());

        $this->entityManager->persist($apiToken);
        $this->entityManager->flush();

        return [
            'token' => $plainToken,
            'expiresAt' => $expiresAt->format(\DateTimeInterface::ATOM),
            'user' => $this->formatUserPayload($user),
        ];
    }

    /**
     * Déconnexion / Révocation de jeton
     */
    public function logout(User $user, ?string $bearerToken): void
    {
        if ($bearerToken) {
            $plain = str_starts_with($bearerToken, 'Bearer ') ? substr($bearerToken, 7) : $bearerToken;
            $tokenEntity = $this->apiTokenRepository->findValidToken($plain);
            if ($tokenEntity && $tokenEntity->getUser()->getId()->equals($user->getId())) {
                $this->entityManager->remove($tokenEntity);
                $this->entityManager->flush();
            }
        }
    }

    public function activate(string $email, string $password): array
    {
        $email = strtolower(trim($email));

        $user = $this->userRepository->findOneByEmail($email);
        if (!$user) {
            throw new BadRequestException('Utilisateur introuvable.');
        }

        if ($user->getStatus() !== User::STATUS_ACTIVE) {
            throw new BadRequestException('Ce compte n\'est pas encore validé ou est désactivé.');
        }

        if ($user->getLastLoginAt() !== null) {
            throw new BadRequestException('Ce compte a déjà été activé.');
        }

        if (strlen($password) < 8) {
            throw new BadRequestException('Le mot de passe doit comporter au minimum 8 caractères.');
        }

        $user->setPassword($this->passwordHasher->hashPassword($user, $password));
        $this->entityManager->flush();

        return [
            'success' => true,
            'message' => 'Compte activé avec succès. Vous pouvez maintenant vous connecter.',
        ];
    }

    public function formatUserPayload(User $user): array
    {
        $roleCodes = [];
        $roleLabels = [];
        foreach ($user->getRolesEntities() as $role) {
            $roleCodes[] = $role->getCode();
            $roleLabels[] = $role->getLabel();
        }

        // Déterminer le rôle principal pour l'aiguillage UX
        $primaryRole = 'APPRENANT';
        if ($user->hasRoleCode('SUPER_ADMIN')) {
            $primaryRole = 'SUPER_ADMIN';
        } elseif ($user->hasRoleCode('ADMIN')) {
            $primaryRole = 'ADMIN';
        } elseif (preg_grep('/^RESPONSABLE_/', $roleCodes)) {
            $primaryRole = 'RESPONSABLE';
        } elseif ($user->hasRoleCode('PARENT')) {
            $primaryRole = 'PARENT';
        }

        return [
            'id' => $user->getId()->toRfc4122(),
            'email' => $user->getEmail(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'fullName' => $user->getFullName(),
            'phone' => $user->getPhone(),
            'status' => $user->getStatus(),
            'roles' => $roleCodes,
            'roleLabels' => $roleLabels,
            'primaryRole' => $primaryRole,
            'permissions' => $user->getComputedPermissions(),
            'lastLoginAt' => $user->getLastLoginAt()?->format(\DateTimeInterface::ATOM),
            'createdAt' => $user->getCreatedAt()->format(\DateTimeInterface::ATOM),
        ];
    }
}
