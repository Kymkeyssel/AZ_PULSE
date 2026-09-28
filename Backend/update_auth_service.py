import re
import os

filepath = r'h:\PROJETS\VS_Projects\L3_LICENCE_ING\AZ_PULSE\backend\src\Service\AuthService.php'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports
imports = """use App\Repository\AccessRequestRepository;
use App\Service\EmailSender;"""
content = re.sub(r'(use App\\Repository\\UserRepository;)', r'\1\n' + imports, content)

# Modify constructor
old_constructor = """    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserRepository $userRepository,
        private readonly ApiTokenRepository $apiTokenRepository,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly UserChecker $userChecker,
        #[Autowire(service: 'limiter.login_limiter')]
        private readonly RateLimiterFactory $loginLimiter,
        #[Autowire(service: 'limiter.register_limiter')]
        private readonly RateLimiterFactory $registerLimiter,
    ) {"""

new_constructor = """    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserRepository $userRepository,
        private readonly ApiTokenRepository $apiTokenRepository,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly UserChecker $userChecker,
        #[Autowire(service: 'limiter.login_limiter')]
        private readonly RateLimiterFactory $loginLimiter,
        #[Autowire(service: 'limiter.register_limiter')]
        private readonly RateLimiterFactory $registerLimiter,
        private readonly AccessRequestRepository $accessRequestRepository,
        private readonly EmailSender $emailSender,
    ) {"""
content = content.replace(old_constructor, new_constructor)

# Modify register method
old_register_return = """        $this->entityManager->persist($request);
        $this->entityManager->flush();

        return [
            'success' => true,
            'message' => 'Votre demande d\\'accès a été soumise avec succès. Elle sera examinée par la Direction.',
            'status' => User::STATUS_PENDING_APPROVAL,
        ];"""

new_register_return = """        $this->entityManager->persist($request);
        $this->entityManager->flush();

        $uuid = $request->getId()->toBase32(); // using base32 for more compact UUID
        
        // Envoi de l'email asynchrone
        $this->emailSender->sendAccessRequestPending($email, $firstName . ' ' . $lastName, $uuid);

        return [
            'success' => true,
            'message' => 'Votre demande d\\'accès a été soumise avec succès. Elle sera examinée par la Direction.',
            'status' => User::STATUS_PENDING_APPROVAL,
            'uuid' => $uuid,
        ];"""
content = content.replace(old_register_return, new_register_return)

# Modify checkStatus method
old_checkStatus = """    public function checkStatus(string $email): array
    {
        $email = strtolower(trim($email));

        $user = $this->userRepository->findOneByEmail($email);
        if (!$user) {
            throw new BadRequestException('Aucun compte trouvé avec cette adresse email.');
        }

        return [
            'success' => true,
            'status' => $user->getStatus(),
        ];
    }"""

new_checkStatus = """    public function checkStatus(string $uuid): array
    {
        $request = $this->accessRequestRepository->find($uuid);
        if (!$request) {
            throw new BadRequestException('Aucune demande trouvée avec cette référence.');
        }

        return [
            'success' => true,
            'status' => $request->getStatus(), // PENDING, APPROVED, REJECTED
        ];
    }"""
content = content.replace(old_checkStatus, new_checkStatus)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated AuthService.php")
