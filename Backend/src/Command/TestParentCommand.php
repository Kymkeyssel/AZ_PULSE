<?php

namespace App\Command;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:test-parent',
    description: 'Test parent children'
)]
class TestParentCommand extends Command
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
        
        foreach ($users as $u) {
            $roles = [];
            foreach ($u->getRoles() as $r) {
                $roles[] = is_object($r) ? $r->getCode() : $r;
            }
            if (in_array('PARENT', $roles) || in_array('ROLE_PARENT', $roles)) {
                $io->info("Parent: " . $u->getEmail());
                $children = $u->getChildren();
                $io->info("Children count via getChildren: " . count($children));
                foreach ($children as $c) {
                    $io->text(" - Child: " . $c->getEmail());
                }

                // Removed SQL check
            }
        }

        return Command::SUCCESS;
    }
}
