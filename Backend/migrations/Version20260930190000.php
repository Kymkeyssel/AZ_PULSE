<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260930190000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Lie un document Knowledge Hub à un projet Workspace (scénario transversal MVP).';
    }

    public function up(Schema $schema): void
    {
        if (!$schema->hasTable('documents')) {
            return;
        }

        $table = $schema->getTable('documents');
        if ($table->hasColumn('project_id')) {
            return;
        }

        $this->addSql('ALTER TABLE documents ADD project_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE documents ADD CONSTRAINT FK_A2B07288E166B1B FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE SET NULL NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_A2B07288E166B1B ON documents (project_id)');
    }

    public function down(Schema $schema): void
    {
        if (!$schema->hasTable('documents')) {
            return;
        }

        $table = $schema->getTable('documents');
        if (!$table->hasColumn('project_id')) {
            return;
        }

        $this->addSql('ALTER TABLE documents DROP CONSTRAINT FK_A2B07288E166B1B');
        $this->addSql('DROP INDEX IDX_A2B07288E166B1B');
        $this->addSql('ALTER TABLE documents DROP project_id');
    }
}
