<?php
namespace App\Command;

use App\Entity\User;
use App\Service\AuthService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(name: 'app:test-auth', description: 'Test auth payload')]
class TestAuthCommand extends Command
{
    private EntityManagerInterface $em;
    private AuthService $authService;

    public function __construct(EntityManagerInterface $em, AuthService $authService)
    {
        parent::__construct();
        $this->em = $em;
        $this->authService = $authService;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        try {
            $user = $this->em->getRepository(User::class)->findOneBy(['email' => 'resp.infrastructure@azpulse.local']);
            if (!$user) {
                $output->writeln('User not found');
                return Command::FAILURE;
            }
            $payload = $this->authService->formatUserPayload($user);
            $output->writeln(json_encode($payload, JSON_PRETTY_PRINT));
            return Command::SUCCESS;
        } catch (\Throwable $e) {
            $output->writeln('ERROR: ' . $e->getMessage());
            $output->writeln($e->getTraceAsString());
            return Command::FAILURE;
        }
    }
}
