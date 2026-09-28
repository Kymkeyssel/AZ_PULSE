<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260926051935 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE documents DROP CONSTRAINT fk_a2b07288f675f31b');
        $this->addSql('DROP INDEX idx_a2b07288f675f31b');
        $this->addSql('ALTER TABLE documents ADD mime_type VARCHAR(100) NOT NULL');
        $this->addSql('ALTER TABLE documents ADD size INT NOT NULL');
        $this->addSql('ALTER TABLE documents ADD storage_path VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE documents ADD folder VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE documents ADD current_version VARCHAR(50) NOT NULL');
        $this->addSql('ALTER TABLE documents RENAME COLUMN file_path TO original_name');
        $this->addSql('ALTER TABLE documents RENAME COLUMN version TO type');
        $this->addSql('ALTER TABLE documents RENAME COLUMN author_id TO owner_id');
        $this->addSql('ALTER TABLE documents ADD CONSTRAINT FK_A2B072887E3C61F9 FOREIGN KEY (owner_id) REFERENCES users (id) NOT DEFERRABLE');
        $this->addSql('CREATE INDEX IDX_A2B072887E3C61F9 ON documents (owner_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE "documents" DROP CONSTRAINT FK_A2B072887E3C61F9');
        $this->addSql('DROP INDEX IDX_A2B072887E3C61F9');
        $this->addSql('ALTER TABLE "documents" ADD file_path VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE "documents" ADD version VARCHAR(50) NOT NULL');
        $this->addSql('ALTER TABLE "documents" DROP original_name');
        $this->addSql('ALTER TABLE "documents" DROP mime_type');
        $this->addSql('ALTER TABLE "documents" DROP size');
        $this->addSql('ALTER TABLE "documents" DROP storage_path');
        $this->addSql('ALTER TABLE "documents" DROP type');
        $this->addSql('ALTER TABLE "documents" DROP folder');
        $this->addSql('ALTER TABLE "documents" DROP current_version');
        $this->addSql('ALTER TABLE "documents" RENAME COLUMN owner_id TO author_id');
        $this->addSql('ALTER TABLE "documents" ADD CONSTRAINT fk_a2b07288f675f31b FOREIGN KEY (author_id) REFERENCES users (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_a2b07288f675f31b ON "documents" (author_id)');
    }
}
