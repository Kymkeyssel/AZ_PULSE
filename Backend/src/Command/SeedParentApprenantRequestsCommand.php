<?php

namespace App\Command;

use App\Entity\AccessRequest;
use App\Entity\User;
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
    name: 'app:seed-parent-apprenant-requests',
    description: 'Crée 20 demandes d\'accès PENDING pour les rôles PARENT et APPRENANT',
)]
class SeedParentApprenantRequestsCommand extends Command
{
    public function __construct(
        private readonly EntityManagerInterface       $entityManager,
        private readonly UserRepository              $userRepository,
        private readonly RoleRepository              $roleRepository,
        private readonly UserPasswordHasherInterface $passwordHasher,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Création de 20 demandes d\'accès PENDING — Rôles PARENT & APPRENANT');

        // ── Vérifier que les rôles existent ──────────────────────────────
        $roleParent    = $this->roleRepository->findOneByCode('PARENT');
        $roleApprenant = $this->roleRepository->findOneByCode('APPRENANT');

        if (!$roleParent || !$roleApprenant) {
            $io->error('Les rôles PARENT ou APPRENANT sont introuvables. Exécutez d\'abord : php bin/console app:init-rbac');
            return Command::FAILURE;
        }

        // ── Données de seed ───────────────────────────────────────────────
        $seedData = [
            // ── 10 APPRENANTS ──
            [
                'email'      => 'theo.mballa@academie-az.cm',
                'firstName'  => 'Théodore',
                'lastName'   => 'Mballa',
                'phone'      => '+237 691 11 22 33',
                'domain'     => 'Apprenant / Formation',
                'motivation' => 'Inscrit en Licence 3 Génie Logiciel — besoin d\'accès aux cours et devoirs en ligne.',
                'roleCode'   => 'APPRENANT',
            ],
            [
                'email'      => 'fatou.diallo@academie-az.cm',
                'firstName'  => 'Fatou',
                'lastName'   => 'Diallo',
                'phone'      => '+237 692 22 33 44',
                'domain'     => 'Apprenant / Formation',
                'motivation' => 'Étudiante en Master 1 Finance — accès requis aux ressources pédagogiques et évaluations.',
                'roleCode'   => 'APPRENANT',
            ],
            [
                'email'      => 'boris.nnanga@academie-az.cm',
                'firstName'  => 'Boris',
                'lastName'   => 'Nnanga',
                'phone'      => '+237 693 33 44 55',
                'domain'     => 'Apprenant / Formation',
                'motivation' => 'Candidat MINEFOP — cohorte développement web, besoin d\'accès à la plateforme.',
                'roleCode'   => 'APPRENANT',
            ],
            [
                'email'      => 'celestine.fomba@academie-az.cm',
                'firstName'  => 'Céléstine',
                'lastName'   => 'Fomba',
                'phone'      => '+237 694 44 55 66',
                'domain'     => 'Apprenant / Formation',
                'motivation' => 'Programme certifiant en Marketing Digital — suivi de progression et accès aux modules.',
                'roleCode'   => 'APPRENANT',
            ],
            [
                'email'      => 'rodrigue.essomba@academie-az.cm',
                'firstName'  => 'Rodrigue',
                'lastName'   => 'Essomba',
                'phone'      => '+237 695 55 66 77',
                'domain'     => 'Apprenant / Formation',
                'motivation' => 'Apprenant en reconversion professionnelle (Data Science) — accès aux cours et supports.',
                'roleCode'   => 'APPRENANT',
            ],
            [
                'email'      => 'adele.biyong@academie-az.cm',
                'firstName'  => 'Adèle',
                'lastName'   => 'Biyong',
                'phone'      => '+237 696 66 77 88',
                'domain'     => 'Apprenant / Formation',
                'motivation' => 'Étudiante en DTS Informatique — inscription aux modules de programmation avancée.',
                'roleCode'   => 'APPRENANT',
            ],
            [
                'email'      => 'jean.paul.mvondo@academie-az.cm',
                'firstName'  => 'Jean-Paul',
                'lastName'   => 'Mvondo',
                'phone'      => '+237 697 77 88 99',
                'domain'     => 'Apprenant / Formation',
                'motivation' => 'Étudiant boursier MINESUP — accès requis au contenu pédagogique et résultats.',
                'roleCode'   => 'APPRENANT',
            ],
            [
                'email'      => 'patricia.akam@academie-az.cm',
                'firstName'  => 'Patricia',
                'lastName'   => 'Akam',
                'phone'      => '+237 698 88 99 00',
                'domain'     => 'Apprenant / Formation',
                'motivation' => 'Inscrite en formation comptabilité-gestion — suivi des notes et devoirs en ligne.',
                'roleCode'   => 'APPRENANT',
            ],
            [
                'email'      => 'yves.nkono@academie-az.cm',
                'firstName'  => 'Yves',
                'lastName'   => 'Nkono',
                'phone'      => '+237 670 12 34 56',
                'domain'     => 'Apprenant / Formation',
                'motivation' => 'Candidat au certificat professionnel Cybersécurité — accès aux labs et ressources.',
                'roleCode'   => 'APPRENANT',
            ],
            [
                'email'      => 'solange.manga@academie-az.cm',
                'firstName'  => 'Solange',
                'lastName'   => 'Manga',
                'phone'      => '+237 671 23 45 67',
                'domain'     => 'Apprenant / Formation',
                'motivation' => 'Lycéenne en terminale préparant les concours — accès aux cours préparatoires AZ.',
                'roleCode'   => 'APPRENANT',
            ],

            // ── 10 PARENTS ──
            [
                'email'      => 'claude.mballa@gmail.com',
                'firstName'  => 'Claude',
                'lastName'   => 'Mballa',
                'phone'      => '+237 699 10 20 30',
                'domain'     => 'Parent / Tuteur',
                'motivation' => 'Père de Théodore Mballa — suivi pédagogique et paiement des frais d\'inscription.',
                'roleCode'   => 'PARENT',
            ],
            [
                'email'      => 'aminata.diallo@gmail.com',
                'firstName'  => 'Aminata',
                'lastName'   => 'Diallo',
                'phone'      => '+237 699 20 30 40',
                'domain'     => 'Parent / Tuteur',
                'motivation' => 'Mère de Fatou Diallo — consultation du relevé de notes et bulletins académiques.',
                'roleCode'   => 'PARENT',
            ],
            [
                'email'      => 'pierre.nnanga@outlook.com',
                'firstName'  => 'Pierre',
                'lastName'   => 'Nnanga',
                'phone'      => '+237 699 30 40 50',
                'domain'     => 'Parent / Tuteur',
                'motivation' => 'Tuteur de Boris Nnanga — accès au tableau de bord parental pour suivi d\'assiduité.',
                'roleCode'   => 'PARENT',
            ],
            [
                'email'      => 'anne.fomba@yahoo.fr',
                'firstName'  => 'Anne',
                'lastName'   => 'Fomba',
                'phone'      => '+237 699 40 50 60',
                'domain'     => 'Parent / Tuteur',
                'motivation' => 'Mère de Céléstine Fomba — suivi des présences et facturation du programme.',
                'roleCode'   => 'PARENT',
            ],
            [
                'email'      => 'gustave.essomba@gmail.com',
                'firstName'  => 'Gustave',
                'lastName'   => 'Essomba',
                'phone'      => '+237 699 50 60 70',
                'domain'     => 'Parent / Tuteur',
                'motivation' => 'Père de Rodrigue — responsable légal, suivi pédagogique et paiement mensuel.',
                'roleCode'   => 'PARENT',
            ],
            [
                'email'      => 'michelle.biyong@gmail.com',
                'firstName'  => 'Michelle',
                'lastName'   => 'Biyong',
                'phone'      => '+237 699 60 70 80',
                'domain'     => 'Parent / Tuteur',
                'motivation' => 'Tutrice légale d\'Adèle — consultation de l\'espace parent et historique des notes.',
                'roleCode'   => 'PARENT',
            ],
            [
                'email'      => 'paul.mvondo@gmail.com',
                'firstName'  => 'Paul',
                'lastName'   => 'Mvondo',
                'phone'      => '+237 699 70 80 90',
                'domain'     => 'Parent / Tuteur',
                'motivation' => 'Père de Jean-Paul Mvondo — suivi académique et gestion des factures en ligne.',
                'roleCode'   => 'PARENT',
            ],
            [
                'email'      => 'henriette.akam@orange.cm',
                'firstName'  => 'Henriette',
                'lastName'   => 'Akam',
                'phone'      => '+237 699 80 90 01',
                'domain'     => 'Parent / Tuteur',
                'motivation' => 'Mère de Patricia — accès au portail parent pour suivi des résultats et inscriptions.',
                'roleCode'   => 'PARENT',
            ],
            [
                'email'      => 'felix.nkono@gmail.com',
                'firstName'  => 'Félix',
                'lastName'   => 'Nkono',
                'phone'      => '+237 699 90 01 12',
                'domain'     => 'Parent / Tuteur',
                'motivation' => 'Père d\'Yves — suivi formation cybersécurité et accès au rapport pédagogique mensuel.',
                'roleCode'   => 'PARENT',
            ],
            [
                'email'      => 'rachel.manga@gmail.com',
                'firstName'  => 'Rachel',
                'lastName'   => 'Manga',
                'phone'      => '+237 699 01 12 23',
                'domain'     => 'Parent / Tuteur',
                'motivation' => 'Mère de Solange — consultation de l\'espace parental et paiement des frais scolaires.',
                'roleCode'   => 'PARENT',
            ],
        ];

        // ── Insertion ─────────────────────────────────────────────────────
        $created = 0;
        $skipped = 0;

        foreach ($seedData as $item) {
            // Ne pas créer en doublon si l'email existe déjà
            if ($this->userRepository->findOneByEmail($item['email'])) {
                $io->comment(sprintf('⚠  Ignoré (email déjà existant) : %s', $item['email']));
                $skipped++;
                continue;
            }

            $user = new User();
            $user->setEmail($item['email']);
            $user->setFirstName($item['firstName']);
            $user->setLastName($item['lastName']);
            $user->setPhone($item['phone']);
            $user->setStatus(User::STATUS_PENDING_APPROVAL);
            $user->setPassword($this->passwordHasher->hashPassword($user, 'Password123!'));

            $this->entityManager->persist($user);

            $req = new AccessRequest();
            $req->setUser($user);
            $req->setRequestedDomain($item['domain']);
            $req->setMotivation($item['motivation']);
            $req->setStatus(AccessRequest::STATUS_PENDING);

            // Décaler légèrement la date pour avoir un historique réaliste
            $minutesAgo = random_int(10, 2880); // entre 10 min et 48h
            $reflectionClass = new \ReflectionClass($req);
            $createdAtProp   = $reflectionClass->getProperty('createdAt');
            $createdAtProp->setAccessible(true);
            $createdAtProp->setValue($req, new \DateTimeImmutable("-{$minutesAgo} minutes"));

            $this->entityManager->persist($req);
            $created++;
        }

        $this->entityManager->flush();

        $io->success(sprintf(
            '%d demandes PENDING créées avec succès (%d ignorées car email déjà existant).',
            $created,
            $skipped
        ));

        $io->table(
            ['Rôle', 'Nombre créé'],
            [
                ['APPRENANT', min(10, $created)],
                ['PARENT',    max(0, $created - 10)],
            ]
        );

        return Command::SUCCESS;
    }
}
