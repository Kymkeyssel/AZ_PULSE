<?php

namespace App\Command;

use App\Entity\User;
use App\Entity\Role;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:fix-parents',
    description: 'Attach all apprenants to all parents for testing'
)]
class FixParentsCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $em
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $users = $this->em->getRepository(User::class)->findAll();
        $apprenants = [];
        $parents = [];

        foreach ($users as $user) {
            $roles = [];
            foreach ($user->getRoles() as $r) {
                $roles[] = is_object($r) ? $r->getCode() : $r;
            }

            if (in_array('APPRENANT', $roles) || in_array('ROLE_APPRENANT', $roles)) {
                $apprenants[] = $user;
            }
            if (in_array('PARENT', $roles) || in_array('ROLE_PARENT', $roles)) {
                $parents[] = $user;
            }
        }

        if (empty($parents)) {
            $io->warning('No parents found in database');
            return Command::FAILURE;
        }

        if (empty($apprenants)) {
            $io->warning('No apprenants found in database');
            return Command::FAILURE;
        }

        foreach ($parents as $parent) {
            foreach ($apprenants as $apprenant) {
                $apprenant->addParent($parent);
                // Also add child explicitly just to be safe
                $parent->addChild($apprenant);
            }
            $io->info("Parent {$parent->getEmail()} now has " . count($apprenants) . " children attached.");
        }

        $this->em->flush();

        $io->success('All apprenants successfully attached to all parents.');

        return Command::SUCCESS;
    }
}
