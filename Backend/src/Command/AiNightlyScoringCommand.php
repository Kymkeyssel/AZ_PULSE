<?php

namespace App\Command;

use App\Entity\Project;
use App\Event\AiRecommendationProposedEvent;
use App\Service\AI\AIService;
use App\Service\AI\ProjectContextBuilder;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;

#[AsCommand(
    name: 'app:ai:nightly-scoring',
    description: 'Analyse tous les projets actifs pour détecter des risques (Batch nocturne).',
)]
class AiNightlyScoringCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $em,
        private AIService $aiService,
        private ProjectContextBuilder $contextBuilder,
        private EventDispatcherInterface $eventDispatcher
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Lancement du scoring IA nocturne des projets');

        // Récupérer les projets actifs (ONGOING, PLANNING)
        $projects = $this->em->getRepository(Project::class)->findBy([
            'status' => ['PLANNING', 'ONGOING']
        ]);

        if (empty($projects)) {
            $io->success('Aucun projet actif à analyser.');
            return Command::SUCCESS;
        }

        $io->progressStart(count($projects));

        foreach ($projects as $project) {
            try {
                $context = $this->contextBuilder->build($project);
                $question = "Analyse ce projet pour identifier spécifiquement les risques de dépassement de budget, de délai, ou de blocage majeur. Réponds uniquement avec le schéma JSON attendu.";
                
                $result = $this->aiService->analyzeProject($project->getId(), $question, $context);
                
                // Si l'IA identifie des risques, on lève un événement de proposition
                if (!empty($result['risks'])) {
                    $summary = sprintf("Risques détectés pour le projet %s : %s", $project->getName(), implode(', ', $result['risks']));
                    
                    $event = new AiRecommendationProposedEvent(
                        kind: AiRecommendationProposedEvent::KIND_RISK,
                        summary: substr($summary, 0, 250),
                        projectId: $project->getId(),
                        confidence: 0.85, // Confiance simulée/arbitraire
                        payload: $result
                    );
                    
                    // On attribue l'événement au manager du projet pour que la notification lui soit adressée
                    $this->eventDispatcher->dispatch($event->withActor($project->getManager()), AiRecommendationProposedEvent::NAME);
                }
            } catch (\Exception $e) {
                $io->warning(sprintf('Erreur lors de l\'analyse du projet %d: %s', $project->getId(), $e->getMessage()));
            }
            $io->progressAdvance();
        }

        $io->progressFinish();
        $io->success('Scoring nocturne terminé avec succès.');

        return Command::SUCCESS;
    }
}
