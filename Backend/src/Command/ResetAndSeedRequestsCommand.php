<?php

namespace App\Command;

use App\Entity\AccessRequest;
use App\Entity\User;
use App\Repository\AccessRequestRepository;
use App\Repository\RoleRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:reset-and-seed-requests',
    description: 'Supprime tous les comptes sauf le super-admin, réinitialise son mot de passe et crée des demandes pour chaque rôle',
)]
class ResetAndSeedRequestsCommand extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserRepository $userRepository,
        private readonly RoleRepository $roleRepository,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly AccessRequestRepository $accessRequestRepository,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Nettoyage des comptes & Création des demandes d\'accès');

        // 1. Trouver ou sécuriser le Super Admin
        $superAdminEmail = 'admin@azpulse.local';
        $superAdminPassword = 'Admin@2026!'; // Mot de passe réinitialisé pour le super admin

        $superAdmin = $this->userRepository->findOneByEmail($superAdminEmail);
        $superAdminRole = $this->roleRepository->findOneByCode('SUPER_ADMIN');

        if (!$superAdminRole) {
            $io->error('Le rôle SUPER_ADMIN est introuvable. Exécutez d\'abord php bin/console app:init-rbac');
            return Command::FAILURE;
        }

        if (!$superAdmin) {
            $superAdmin = new User();
            $superAdmin->setEmail($superAdminEmail);
            $superAdmin->setFirstName('Directeur');
            $superAdmin->setLastName('AZ CORP');
            $this->entityManager->persist($superAdmin);
        }

        $superAdmin->setStatus(User::STATUS_ACTIVE);
        $superAdmin->setPassword($this->passwordHasher->hashPassword($superAdmin, $superAdminPassword));
        $superAdmin->clearRoles();
        $superAdmin->addRole($superAdminRole);
        $this->entityManager->flush();

        $io->success([
            sprintf('Super Admin configuré : %s', $superAdminEmail),
            sprintf('Nouveau mot de passe : %s', $superAdminPassword),
            'Statut : ACTIF'
        ]);

        // 2. Supprimer tous les autres comptes
        $allUsers = $this->userRepository->findAll();
        $deletedCount = 0;

        foreach ($allUsers as $user) {
            if ($user->getEmail() === $superAdminEmail) {
                continue;
            }

            // Suppression explicite des relations liées
            foreach ($user->getAccessRequests() as $ar) {
                $this->entityManager->remove($ar);
            }
            foreach ($user->getApiTokens() as $at) {
                $this->entityManager->remove($at);
            }
            foreach ($user->getPermissionOverrides() as $po) {
                $this->entityManager->remove($po);
            }

            $this->entityManager->remove($user);
            $deletedCount++;
        }

        $this->entityManager->flush();
        $io->info(sprintf('%d ancien(s) compte(s) supprimé(s). Seul le Super Admin est conservé.', $deletedCount));

        // 3. Créer un compte + une demande d'accès pour chaque profil/rôle métier
        $seedRequests = [
            [
                'email' => 'directeur.admin@azpulse.local',
                'firstName' => 'Alexandre',
                'lastName' => 'Zogo',
                'phone' => '+237 690 12 34 56',
                'domain' => 'Direction Générale / Admin',
                'motivation' => 'Directeur Général adjoint - Nécessite une visibilité globale sur l\'ensemble des opérations d\'AZ CORPORATION.',
            ],
            [
                'email' => 'resp.crm@azpulse.local',
                'firstName' => 'Marc',
                'lastName' => 'Ewondo',
                'phone' => '+237 671 23 45 67',
                'domain' => 'CRM & Partenariats',
                'motivation' => 'Responsable Commercial & Partenariats - Gestion des prospects, contrats et opportunités d\'affaires.',
            ],
            [
                'email' => 'resp.formation@azpulse.local',
                'firstName' => 'Sarah',
                'lastName' => 'Manga',
                'phone' => '+237 692 34 56 78',
                'domain' => 'Formation & Académie',
                'motivation' => 'Responsable Pédagogique - Planification des cours, coordination des formateurs et évaluations.',
            ],
            [
                'email' => 'resp.workspace@azpulse.local',
                'firstName' => 'David',
                'lastName' => 'Talla',
                'phone' => '+237 673 45 67 89',
                'domain' => 'Workspace & Projets',
                'motivation' => 'Chef de Projets Opérationnels - Gestion des tableaux agiles, des sprints et suivi documentaire.',
            ],
            [
                'email' => 'resp.it@azpulse.local',
                'firstName' => 'Kevin',
                'lastName' => 'Ndong',
                'phone' => '+237 694 56 78 90',
                'domain' => 'Infrastructure & IT',
                'motivation' => 'Administrateur Systèmes & Réseaux - Gestion du parc matériel, monitoring et déploiements techniques.',
            ],
            [
                'email' => 'apprenant@azpulse.local',
                'firstName' => 'Lucas',
                'lastName' => 'Kamga',
                'phone' => '+237 675 67 89 01',
                'domain' => 'Apprenant / Formation',
                'motivation' => 'Étudiant en Licence 3 Ingénierie - Accès aux cours, devoirs et ressources de l\'académie.',
            ],
            [
                'email' => 'parent@azpulse.local',
                'firstName' => 'Marie',
                'lastName' => 'Kamga',
                'phone' => '+237 696 78 90 12',
                'domain' => 'Parent / Tuteur',
                'motivation' => 'Tuteur légal de Lucas Kamga - Suivi pédagogique des notes, assiduité et facturation des cours.',
            ],
        ];

        $defaultCandidatePassword = 'Password123!';

        foreach ($seedRequests as $item) {
            $user = new User();
            $user->setEmail($item['email']);
            $user->setFirstName($item['firstName']);
            $user->setLastName($item['lastName']);
            $user->setPhone($item['phone']);
            $user->setStatus(User::STATUS_PENDING_APPROVAL);
            $user->setPassword($this->passwordHasher->hashPassword($user, $defaultCandidatePassword));

            $this->entityManager->persist($user);

            $req = new AccessRequest();
            $req->setUser($user);
            $req->setRequestedDomain($item['domain']);
            $req->setMotivation($item['motivation']);
            $req->setStatus(AccessRequest::STATUS_PENDING);

            $this->entityManager->persist($req);
        }

        $this->entityManager->flush();
        $io->success(sprintf('%d demandes d\'accès en attente (PENDING) créées avec succès.', count($seedRequests)));

        return Command::SUCCESS;
    }
}
