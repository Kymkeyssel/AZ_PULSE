import re

filepath = r'h:\PROJETS\VS_Projects\L3_LICENCE_ING\AZ_PULSE\backend\src\Service\AccessRequestService.php'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
imports = """use App\Repository\RoleRepository;
use App\Service\EmailSender;"""
content = re.sub(r'(use App\\Repository\\RoleRepository;)', imports, content)

# Modify constructor
old_constructor = """    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly AccessRequestRepository $accessRequestRepository,
        private readonly RoleRepository $roleRepository,
        private readonly PermissionRepository $permissionRepository,
    ) {"""

new_constructor = """    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly AccessRequestRepository $accessRequestRepository,
        private readonly RoleRepository $roleRepository,
        private readonly PermissionRepository $permissionRepository,
        private readonly EmailSender $emailSender,
    ) {"""
content = content.replace(old_constructor, new_constructor)

# Modify approve method return
old_approve_end = """
        $this->entityManager->flush();

        return [
            'success' => true,
            'message' => 'La demande d\\'accès a été approuvée, le rôle et les permissions ont été assignés.',
        ];
    }"""

new_approve_end = """
        $this->entityManager->flush();
        
        $this->emailSender->sendAccessRequestApproved(
            $user->getEmail(),
            $user->getFirstName() . ' ' . $user->getLastName()
        );

        return [
            'success' => true,
            'message' => 'La demande d\\'accès a été approuvée, le rôle et les permissions ont été assignés.',
        ];
    }"""
content = content.replace(old_approve_end, new_approve_end)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated AccessRequestService.php")
