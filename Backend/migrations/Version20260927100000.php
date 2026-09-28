<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Introduction de la spécialisation « Collaborateur ».
 *
 * - users.collaborator_profile          : spécialisation retenue (interface + suggestions de droits)
 * - access_requests.requested_profile   : spécialisation souhaitée par le demandeur (indicative)
 * - access_requests.assigned_profile    : spécialisation arbitrée par l'administrateur (décisive)
 *
 * Le rôle COLLABORATEUR lui-même et ses permissions de lecture sont créés par
 * la commande `app:init-rbac`, pas par cette migration.
 */
final class Version20260927100000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Rôle COLLABORATEUR : colonnes de spécialisation sur users et access_requests';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE users ADD collaborator_profile VARCHAR(50) DEFAULT NULL');
        $this->addSql('ALTER TABLE access_requests ADD requested_profile VARCHAR(50) DEFAULT NULL');
        $this->addSql('ALTER TABLE access_requests ADD assigned_profile VARCHAR(50) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE access_requests DROP assigned_profile');
        $this->addSql('ALTER TABLE access_requests DROP requested_profile');
        $this->addSql('ALTER TABLE users DROP collaborator_profile');
    }
}
