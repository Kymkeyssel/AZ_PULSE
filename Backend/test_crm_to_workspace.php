<?php
require __DIR__ . '/vendor/autoload.php';

use App\Kernel;
use App\Entity\Opportunity;
use App\Entity\Project;
use App\Service\OpportunityService;

$kernel = new Kernel('dev', true);
$kernel->boot();

$container = $kernel->getContainer();
$em = $container->get('doctrine')->getManager();
$opportunityService = $container->get(OpportunityService::class);

// Trouver une opportunité qui n'est pas WON
$opportunity = $em->getRepository(Opportunity::class)->createQueryBuilder('o')
    ->where('o.stage != :won')
    ->setParameter('won', 'WON')
    ->setMaxResults(1)
    ->getQuery()
    ->getOneOrNullResult();

if (!$opportunity) {
    echo "Aucune opportunité disponible.\n";
    exit(1);
}

echo "Opportunité ciblée : " . $opportunity->getTitle() . " (actuellement " . $opportunity->getStage() . ")\n";

// Changer le statut en WON
$opportunityService->changeStage($opportunity, 'WON');

// Chercher si le projet a été créé
$project = $em->getRepository(Project::class)->findOneBy(['opportunity' => $opportunity]);

if ($project) {
    echo "SUCCÈS : Le projet '" . $project->getName() . "' a été créé automatiquement !\n";
} else {
    echo "ÉCHEC : Aucun projet n'a été créé.\n";
    exit(1);
}
