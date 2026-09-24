<?php

namespace App\EventSubscriber;

use App\Entity\Project;
use App\Event\OpportunityWonEvent;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class ProjectCreationSubscriber implements EventSubscriberInterface
{
    private EntityManagerInterface $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            OpportunityWonEvent::NAME => 'onOpportunityWon',
        ];
    }

    public function onOpportunityWon(OpportunityWonEvent $event): void
    {
        $opportunity = $event->getOpportunity();

        // Check if a project already exists for this opportunity to avoid duplicates
        $existingProject = $this->em->getRepository(Project::class)->findOneBy(['opportunity' => $opportunity]);
        if ($existingProject) {
            return;
        }

        $project = new Project();
        $project->setName('PROJET : ' . $opportunity->getTitle());
        $project->setDescription('Projet généré automatiquement suite à la signature de l\'opportunité : ' . $opportunity->getTitle());
        $project->setBudget($opportunity->getExpectedValue());
        $project->setCustomer($opportunity->getCustomer());
        $project->setOpportunity($opportunity);
        
        // Par défaut, le manager de l'opportunité devient le chef de projet,
        // ou on peut l'assigner à l'utilisateur courant si l'opportunity owner est nul.
        if ($opportunity->getOwner()) {
            $project->setManager($opportunity->getOwner());
            $project->addMember($opportunity->getOwner());
        }

        $this->em->persist($project);
        $this->em->flush();
    }
}
