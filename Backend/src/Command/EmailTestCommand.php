<?php

declare(strict_types=1);

namespace App\Command;

use App\Service\EmailSender;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(
    name: 'app:email:test',
    description: 'Envoie un email de bienvenue pour tester la configuration Resend.'
)]
final class EmailTestCommand extends Command
{
    public function __construct(
        private readonly EmailSender $emailSender
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addArgument('to', InputArgument::REQUIRED, 'L\'adresse email de destination');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $to = $input->getArgument('to');
        
        $output->writeln("Envoi de l'email à $to...");
        
        $this->emailSender->sendWelcome($to, 'Utilisateur Test');
        
        $output->writeln("<info>Email envoyé (mis en queue) !</info>");

        return Command::SUCCESS;
    }
}
