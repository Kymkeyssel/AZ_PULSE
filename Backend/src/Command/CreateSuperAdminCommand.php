<?php

namespace App\Command;

use App\Entity\User;
use App\Repository\RoleRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:create-super-admin',
    description: 'Crée de façon sécurisée le premier compte Super Administrateur / Administrateur',
)]
class CreateSuperAdminCommand extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserRepository $userRepository,
        private readonly RoleRepository $roleRepository,
        private readonly UserPasswordHasherInterface $passwordHasher,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('email', InputArgument::OPTIONAL, 'Adresse email de l\'administrateur')
            ->addArgument('password', InputArgument::OPTIONAL, 'Mot de passe sécurisé')
            ->addOption('first-name', null, InputOption::VALUE_OPTIONAL, 'Prénom', 'Admin')
            ->addOption('last-name', null, InputOption::VALUE_OPTIONAL, 'Nom', 'AZ CORPORATION')
            ->addOption('role', null, InputOption::VALUE_OPTIONAL, 'Code du rôle (SUPER_ADMIN ou ADMIN)', 'SUPER_ADMIN');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Création d\'un Administrateur Système AZ PULSE');

        $email = $input->getArgument('email') ?? $io->ask('Email de l\'administrateur', 'admin@azpulse.local');
        $password = $input->getArgument('password') ?? $io->askHidden('Mot de passe (min. 8 caractères)');
        $firstName = $input->getOption('first-name') ?? $io->ask('Prénom', 'Directeur');
        $lastName = $input->getOption('last-name') ?? $io->ask('Nom', 'AZ');
        $roleCode = strtoupper($input->getOption('role') ?? 'SUPER_ADMIN');

        if (!$password || strlen($password) < 8) {
            $io->error('Le mot de passe doit contenir au minimum 8 caractères.');
            return Command::FAILURE;
        }

        $existingUser = $this->userRepository->findOneByEmail($email);
        if ($existingUser) {
            $io->warning(sprintf('Un utilisateur avec l\'email "%s" existe déjà. Mise à jour de ses privilèges et activation...', $email));
            $user = $existingUser;
        } else {
            $user = new User();
            $user->setEmail($email);
            $this->entityManager->persist($user);
        }

        $user->setFirstName($firstName);
        $user->setLastName($lastName);
        $user->setStatus(User::STATUS_ACTIVE);
        $user->setPassword($this->passwordHasher->hashPassword($user, $password));

        // Rôle
        $role = $this->roleRepository->findOneByCode($roleCode);
        if (!$role) {
            $io->error(sprintf('Le rôle "%s" n\'existe pas. Veuillez exécuter "php bin/console app:init-rbac" au préalable.', $roleCode));
            return Command::FAILURE;
        }

        $user->clearRoles();
        $user->addRole($role);

        $this->entityManager->flush();

        $io->success([
            sprintf('Compte administrateur configuré avec succès : %s', $email),
            sprintf('Rôle assigné : %s (%s)', $role->getLabel(), $role->getCode()),
            'Statut : ACTIF (Prêt pour la connexion)'
        ]);

        return Command::SUCCESS;
    }
}
