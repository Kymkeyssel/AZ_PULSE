<?php

namespace App\DataFixtures;

use App\Entity\Activity;
use App\Entity\Customer;
use App\Entity\Equipment;
use App\Entity\Incident;
use App\Entity\Opportunity;
use App\Entity\Project;
use App\Entity\Task;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $userRepository = $manager->getRepository(User::class);
        $admin = $userRepository->findOneBy(['email' => 'admin@azpulse.local']);

        if (!$admin) {
            throw new \Exception("Veuillez d'abord exécuter les commandes app:init-rbac et app:reset-and-seed-requests pour créer le Super Admin.");
        }

        // === CRM : Customers ===
        $customersData = ['AZ Corporation', 'Tech Solutions', 'Global Industries', 'Innovatech'];
        $customers = [];
        
        foreach ($customersData as $name) {
            $customer = new Customer();
            $customer->setName($name);
            $customer->setEmail(strtolower(str_replace(' ', '.', $name)) . '@example.com');
            $customer->setIndustry('IT & Services');
            $manager->persist($customer);
            $customers[] = $customer;
        }

        // === CRM : Opportunities ===
        $opportunities = [];
        $stages = ['PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'];
        
        for ($i = 1; $i <= 10; $i++) {
            $opportunity = new Opportunity();
            $opportunity->setName('Opportunité ' . $i);
            $opportunity->setAmount((string) (rand(10, 500) * 1000));
            $opportunity->setStage($stages[array_rand($stages)]);
            $opportunity->setProbability(rand(10, 90));
            $opportunity->setCustomer($customers[array_rand($customers)]);
            
            if ($opportunity->getStage() === 'WON') {
                $opportunity->setProbability(100);
                $opportunity->setClosedAt(new \DateTime('-' . rand(1, 10) . ' days'));
            } elseif ($opportunity->getStage() === 'LOST') {
                $opportunity->setProbability(0);
                $opportunity->setClosedAt(new \DateTime('-' . rand(1, 10) . ' days'));
            }
            
            $manager->persist($opportunity);
            $opportunities[] = $opportunity;
        }

        // === CRM : Activities ===
        $activityTypes = ['CALL', 'EMAIL', 'MEETING', 'NOTE'];
        for ($i = 0; $i < 20; $i++) {
            $activity = new Activity();
            $activity->setType($activityTypes[array_rand($activityTypes)]);
            $activity->setDescription("Ceci est une description de l'activité CRM $i.");
            $activity->setCustomer($customers[array_rand($customers)]);
            if (rand(0, 1)) {
                $activity->setOpportunity($opportunities[array_rand($opportunities)]);
            }
            $activity->setAuthor($admin);
            $manager->persist($activity);
        }

        // === Workspace : Projects ===
        $projects = [];
        $projectStatuses = ['PLANNED', 'IN_PROGRESS', 'COMPLETED'];
        
        for ($i = 1; $i <= 5; $i++) {
            $project = new Project();
            $project->setName('Projet Stratégique ' . $i);
            $project->setDescription('Déploiement pour le client ' . $i);
            $project->setStatus($projectStatuses[array_rand($projectStatuses)]);
            $project->setCustomer($customers[array_rand($customers)]);
            $project->setStartDate(new \DateTime('-' . rand(10, 30) . ' days'));
            if ($project->getStatus() === 'COMPLETED') {
                $project->setEndDate(new \DateTime());
            }
            $manager->persist($project);
            $projects[] = $project;
        }

        // === Workspace : Tasks ===
        $taskStatuses = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];
        $taskPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
        
        foreach ($projects as $project) {
            for ($i = 1; $i <= 4; $i++) {
                $task = new Task();
                $task->setTitle("Tâche $i pour " . $project->getName());
                $task->setDescription("Détails de la tâche $i");
                $task->setStatus($taskStatuses[array_rand($taskStatuses)]);
                $task->setPriority($taskPriorities[array_rand($taskPriorities)]);
                $task->setProject($project);
                $task->setAssignee($admin);
                $task->setDueDate(new \DateTime('+' . rand(1, 15) . ' days'));
                $manager->persist($task);
            }
        }

        // === IT : Equipments ===
        $equipmentTypes = ['LAPTOP', 'MONITOR', 'SERVER', 'PHONE'];
        $equipmentStatuses = ['ACTIVE', 'MAINTENANCE', 'RETIRED'];
        
        for ($i = 1; $i <= 10; $i++) {
            $equipment = new Equipment();
            $equipment->setName('Équipement IT-' . str_pad((string)$i, 3, '0', STR_PAD_LEFT));
            $equipment->setType($equipmentTypes[array_rand($equipmentTypes)]);
            $equipment->setSerialNumber('SN-' . strtoupper(bin2hex(random_bytes(4))));
            $equipment->setStatus($equipmentStatuses[array_rand($equipmentStatuses)]);
            $equipment->setAssignedTo(rand(0,1) ? $admin : null);
            $manager->persist($equipment);
        }

        // === IT : Incidents ===
        $incidentCategories = ['HARDWARE', 'SOFTWARE', 'NETWORK', 'OTHER'];
        $incidentStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
        
        for ($i = 1; $i <= 8; $i++) {
            $incident = new Incident();
            $incident->setTitle("Incident #" . $i . " - Problème signalé");
            $incident->setDescription("Description détaillée de l'incident $i.");
            $incident->setCategory($incidentCategories[array_rand($incidentCategories)]);
            $incident->setStatus($incidentStatuses[array_rand($incidentStatuses)]);
            $incident->setPriority($taskPriorities[array_rand($taskPriorities)]);
            $incident->setReporter($admin);
            
            if (in_array($incident->getStatus(), ['IN_PROGRESS', 'RESOLVED', 'CLOSED'])) {
                $incident->setAssignee($admin);
            }
            if (in_array($incident->getStatus(), ['RESOLVED', 'CLOSED'])) {
                $incident->setResolvedAt(new \DateTime('-' . rand(1, 5) . ' days'));
            }
            
            $manager->persist($incident);
        }

        $manager->flush();
    }
}
