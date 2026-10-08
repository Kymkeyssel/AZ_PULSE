<?php

namespace App\Command;

use App\Entity\AccessRequest;
use App\Entity\Role;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:seed-all-users',
    description: 'Crée un jeu de données complet d\'utilisateurs pour tous les rôles.',
)]
class SeedAllUsersCommand extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserPasswordHasherInterface $passwordHasher,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Génération des comptes utilisateurs AZ PULSE (Tests)');

        $roleRepository = $this->entityManager->getRepository(Role::class);

        // Map roles
        $rolesToCreate = [
            'SUPER_ADMIN' => ['email' => 'superadmin@azpulse.local', 'first' => 'Super', 'last' => 'Admin'],
            'ADMIN' => ['email' => 'admin@azpulse.local', 'first' => 'Directeur', 'last' => 'Général'],
            'RESPONSABLE_CRM' => ['email' => 'crm@azpulse.local', 'first' => 'Resp', 'last' => 'CRM'],
            'RESPONSABLE_FORMATION' => ['email' => 'formation@azpulse.local', 'first' => 'Resp', 'last' => 'Formation'],
            'RESPONSABLE_WORKSPACE' => ['email' => 'workspace@azpulse.local', 'first' => 'Resp', 'last' => 'Projets'],
            'RESPONSABLE_IT' => ['email' => 'it@azpulse.local', 'first' => 'Resp', 'last' => 'IT'],
            'RESPONSABLE_KNOWLEDGE' => ['email' => 'knowledge@azpulse.local', 'first' => 'Resp', 'last' => 'Knowledge'],
            'CLIENT' => ['email' => 'client@azpulse.local', 'first' => 'Marc', 'last' => 'Essomba'],
        ];

        $users = [];

        foreach ($rolesToCreate as $roleCode => $data) {
            $roleEntity = $roleRepository->findOneBy(['code' => $roleCode]);
            if (!$roleEntity) {
                $io->warning("Le rôle $roleCode n'existe pas. Veuillez lancer app:init-rbac.");
                continue;
            }

            $user = new User();
            $user->setEmail($data['email']);
            $user->setFirstName($data['first']);
            $user->setLastName($data['last']);
            $user->setPassword($this->passwordHasher->hashPassword($user, 'password123'));
            $user->addRole($roleEntity);
            $user->setStatus(User::STATUS_ACTIVE);

            $this->entityManager->persist($user);
            $users[$roleCode] = $user;
            
            // Access Request bidon mais APPROVED
            $req = new AccessRequest();
            $req->setUser($user);
            $req->setAssignedRole($roleEntity);
            $req->setStatus(AccessRequest::STATUS_APPROVED);
            $req->setMotivation("Compte de test $roleCode");
            $req->setRequestedDomain("ALL");
            $this->entityManager->persist($req);
        }

        // Parent
        $parentRole = $roleRepository->findOneBy(['code' => 'PARENT']);
        $parent = new User();
        $parent->setEmail('parent@azpulse.local');
        $parent->setFirstName('Jean');
        $parent->setLastName('Dupont');
        $parent->setPassword($this->passwordHasher->hashPassword($parent, 'password123'));
        $parent->addRole($parentRole);
        $parent->setStatus(User::STATUS_ACTIVE);
        $this->entityManager->persist($parent);

        $req = new AccessRequest();
        $req->setUser($parent);
        $req->setAssignedRole($parentRole);
        $req->setStatus(AccessRequest::STATUS_APPROVED);
        $req->setMotivation("Compte test Parent");
        $req->setRequestedDomain("ALL");
        $this->entityManager->persist($req);

        // 5 Apprenants
        $appRole = $roleRepository->findOneBy(['code' => 'APPRENANT']);
        for ($i = 1; $i <= 5; $i++) {
            $apprenant = new User();
            $apprenant->setEmail("apprenant$i@azpulse.local");
            $apprenant->setFirstName("Étudiant");
            $apprenant->setLastName((string)$i);
            $apprenant->setPassword($this->passwordHasher->hashPassword($apprenant, 'password123'));
            $apprenant->addRole($appRole);
            $apprenant->setStatus(User::STATUS_ACTIVE);
            $apprenant->addParent($parent); // Lien Parent/Enfant
            $this->entityManager->persist($apprenant);

            $reqA = new AccessRequest();
            $reqA->setUser($apprenant);
            $reqA->setAssignedRole($appRole);
            $reqA->setStatus(AccessRequest::STATUS_APPROVED);
            $reqA->setMotivation("Compte test Apprenant $i");
            $reqA->setRequestedDomain("ALL");
            $this->entityManager->persist($reqA);
        }

        $this->entityManager->flush();
        $io->success('Comptes créés avec succès !');

        return Command::SUCCESS;
    }
}
