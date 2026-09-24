<?php

namespace App\Command;

use App\Entity\Permission;
use App\Entity\Role;
use App\Repository\PermissionRepository;
use App\Repository\RoleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:init-rbac',
    description: 'Initialise les rôles et permissions du système AZ PULSE',
)]
class InitRbacCommand extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly RoleRepository $roleRepository,
        private readonly PermissionRepository $permissionRepository,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Initialisation des Rôles & Permissions AZ PULSE');

        // 1. Définition des permissions par module
        $permissionDefs = [
            // CRM
            ['code' => 'crm.read', 'module' => 'CRM', 'desc' => 'Consulter les contacts, leads et opportunités'],
            ['code' => 'crm.create', 'module' => 'CRM', 'desc' => 'Créer des prospects et opportunités'],
            ['code' => 'crm.update', 'module' => 'CRM', 'desc' => 'Modifier les données CRM'],
            ['code' => 'crm.delete', 'module' => 'CRM', 'desc' => 'Supprimer des fiches CRM'],
            ['code' => 'crm.manage', 'module' => 'CRM', 'desc' => 'Administration complète du module CRM'],

            // Formation
            ['code' => 'formation.read', 'module' => 'Formation', 'desc' => 'Consulter les cours, plannings et évaluations'],
            ['code' => 'formation.create', 'module' => 'Formation', 'desc' => 'Créer des sessions et contenus pédagogiques'],
            ['code' => 'formation.update', 'module' => 'Formation', 'desc' => 'Modifier les parcours et notes'],
            ['code' => 'formation.delete', 'module' => 'Formation', 'desc' => 'Supprimer des sessions ou modules'],
            ['code' => 'formation.manage', 'module' => 'Formation', 'desc' => 'Administration complète de la Formation'],

            // Workspace & Projets
            ['code' => 'workspace.read', 'module' => 'Workspace', 'desc' => 'Consulter les projets, tâches et tableaux'],
            ['code' => 'workspace.create', 'module' => 'Workspace', 'desc' => 'Créer des tâches et sous-projets'],
            ['code' => 'workspace.update', 'module' => 'Workspace', 'desc' => 'Modifier les assignations et statuts'],
            ['code' => 'workspace.delete', 'module' => 'Workspace', 'desc' => 'Supprimer des tâches ou documents'],
            ['code' => 'workspace.manage', 'module' => 'Workspace', 'desc' => 'Administration complète du Workspace'],

            // Knowledge Hub
            ['code' => 'knowledge.read', 'module' => 'Knowledge Hub', 'desc' => 'Consulter la base de connaissances'],
            ['code' => 'knowledge.create', 'module' => 'Knowledge Hub', 'desc' => 'Rédiger des articles et guides'],
            ['code' => 'knowledge.update', 'module' => 'Knowledge Hub', 'desc' => 'Modifier la documentation'],
            ['code' => 'knowledge.delete', 'module' => 'Knowledge Hub', 'desc' => 'Supprimer des articles'],
            ['code' => 'knowledge.manage', 'module' => 'Knowledge Hub', 'desc' => 'Administration du Knowledge Hub'],

            // Infrastructure & IT
            ['code' => 'it.read', 'module' => 'Infrastructure/IT', 'desc' => 'Consulter l\'état des parcs et serveurs'],
            ['code' => 'it.manage', 'module' => 'Infrastructure/IT', 'desc' => 'Gérer l\'infrastructure et équipements'],

            // Analytics
            ['code' => 'analytics.read', 'module' => 'Analytics', 'desc' => 'Consulter les tableaux de bord décisionnels'],
            ['code' => 'analytics.manage', 'module' => 'Analytics', 'desc' => 'Configurer les rapports et métriques'],

            // AI Workspace
            ['code' => 'ai.read', 'module' => 'AI Workspace', 'desc' => 'Utiliser les assistants IA'],
            ['code' => 'ai.manage', 'module' => 'AI Workspace', 'desc' => 'Configurer les modèles et agents IA'],

            // Administration & Sécurité
            ['code' => 'access_request.read', 'module' => 'Administration', 'desc' => 'Consulter les demandes d\'accès'],
            ['code' => 'access_request.manage', 'module' => 'Administration', 'desc' => 'Valider ou rejeter les demandes d\'inscription'],
            ['code' => 'user.read', 'module' => 'Administration', 'desc' => 'Consulter la liste des utilisateurs'],
            ['code' => 'user.manage', 'module' => 'Administration', 'desc' => 'Gérer les comptes utilisateurs (activation, rôles)'],
            ['code' => 'role.read', 'module' => 'Administration', 'desc' => 'Consulter les rôles'],
            ['code' => 'role.manage', 'module' => 'Administration', 'desc' => 'Gérer les rôles et attributions'],
            ['code' => 'permission.read', 'module' => 'Administration', 'desc' => 'Consulter les permissions'],
            ['code' => 'permission.manage', 'module' => 'Administration', 'desc' => 'Gérer les permissions du système'],
        ];

        $permissionsByCode = [];
        foreach ($permissionDefs as $def) {
            $permission = $this->permissionRepository->findOneByCode($def['code']);
            if (!$permission) {
                $permission = new Permission();
                $permission->setCode($def['code']);
                $permission->setModule($def['module']);
                $permission->setDescription($def['desc']);
                $this->entityManager->persist($permission);
            } else {
                $permission->setModule($def['module']);
                $permission->setDescription($def['desc']);
            }
            $permissionsByCode[$def['code']] = $permission;
        }

        $this->entityManager->flush();
        $io->success(sprintf('%d permissions synchronisées.', count($permissionDefs)));

        // 2. Définition des Rôles
        $roleDefs = [
            [
                'code' => 'SUPER_ADMIN',
                'label' => 'Super Administrateur',
                'desc' => 'Administrateur technique suprême de la plateforme AZ PULSE',
                'is_system' => true,
                'permissions' => array_keys($permissionsByCode), // Toutes les permissions
            ],
            [
                'code' => 'ADMIN',
                'label' => 'Directeur / Administrateur Général',
                'desc' => 'Directeur d\'AZ CORPORATION avec autorité métier centrale',
                'is_system' => true,
                'permissions' => array_keys($permissionsByCode), // Toutes les permissions
            ],
            [
                'code' => 'RESPONSABLE_CRM',
                'label' => 'Responsable CRM',
                'desc' => 'Gestion intégrale du CRM et lecture sur les autres domaines',
                'is_system' => false,
                'permissions' => [
                    'crm.read', 'crm.create', 'crm.update', 'crm.delete', 'crm.manage',
                    'formation.read', 'workspace.read', 'knowledge.read', 'analytics.read', 'ai.read'
                ],
            ],
            [
                'code' => 'RESPONSABLE_FORMATION',
                'label' => 'Responsable Formation',
                'desc' => 'Gestion intégrale de la Formation et lecture sur les autres domaines',
                'is_system' => false,
                'permissions' => [
                    'formation.read', 'formation.create', 'formation.update', 'formation.delete', 'formation.manage',
                    'crm.read', 'workspace.read', 'knowledge.read', 'analytics.read', 'ai.read'
                ],
            ],
            [
                'code' => 'RESPONSABLE_WORKSPACE',
                'label' => 'Responsable Workspace & Projets',
                'desc' => 'Gestion intégrale des Projets et Workspace',
                'is_system' => false,
                'permissions' => [
                    'workspace.read', 'workspace.create', 'workspace.update', 'workspace.delete', 'workspace.manage',
                    'knowledge.read', 'analytics.read', 'ai.read'
                ],
            ],
            [
                'code' => 'RESPONSABLE_IT',
                'label' => 'Responsable Infrastructure & IT',
                'desc' => 'Gestion du parc informatique et serveurs',
                'is_system' => false,
                'permissions' => [
                    'it.read', 'it.manage',
                    'workspace.read', 'knowledge.read', 'ai.read'
                ],
            ],
            [
                'code' => 'APPRENANT',
                'label' => 'Apprenant / Étudiant',
                'desc' => 'Accès aux formations et espaces collaboratifs étudiants',
                'is_system' => true,
                'permissions' => [
                    'formation.read', 'knowledge.read', 'workspace.read'
                ],
            ],
            [
                'code' => 'PARENT',
                'label' => 'Parent / Tuteur',
                'desc' => 'Consultation du suivi pédagogique et facturation',
                'is_system' => true,
                'permissions' => [
                    'formation.read'
                ],
            ],
        ];

        foreach ($roleDefs as $rDef) {
            $role = $this->roleRepository->findOneByCode($rDef['code']);
            if (!$role) {
                $role = new Role();
                $role->setCode($rDef['code']);
                $this->entityManager->persist($role);
            }

            $role->setLabel($rDef['label']);
            $role->setDescription($rDef['desc']);
            $role->setIsSystem($rDef['is_system']);

            // Nettoyage et réassignation des permissions par défaut du rôle
            foreach ($role->getPermissions() as $existingPerm) {
                $role->removePermission($existingPerm);
            }

            foreach ($rDef['permissions'] as $pCode) {
                if (isset($permissionsByCode[$pCode])) {
                    $role->addPermission($permissionsByCode[$pCode]);
                }
            }
        }

        $this->entityManager->flush();
        $io->success(sprintf('%d rôles configurés et reliés à leurs permissions.', count($roleDefs)));

        return Command::SUCCESS;
    }
}
