<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260907064851 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE activities DROP CONSTRAINT fk_b5f1afe59395c3f3');
        $this->addSql('ALTER TABLE activities DROP CONSTRAINT fk_b5f1afe59a34590f');
        $this->addSql('ALTER TABLE activities DROP CONSTRAINT fk_b5f1afe5f675f31b');
        $this->addSql('ALTER TABLE activities ADD CONSTRAINT FK_B5F1AFE59395C3F3 FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE activities ADD CONSTRAINT FK_B5F1AFE59A34590F FOREIGN KEY (opportunity_id) REFERENCES opportunities (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE activities ADD CONSTRAINT FK_B5F1AFE5F675F31B FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE customers ADD status VARCHAR(50) NOT NULL');
        $this->addSql('ALTER TABLE customers ADD owner_id UUID NOT NULL');
        $this->addSql('ALTER TABLE customers ADD CONSTRAINT FK_62534E217E3C61F9 FOREIGN KEY (owner_id) REFERENCES users (id) NOT DEFERRABLE');
        $this->addSql('CREATE INDEX IDX_62534E217E3C61F9 ON customers (owner_id)');
        $this->addSql('ALTER TABLE opportunities ADD owner_id UUID NOT NULL');
        $this->addSql('ALTER TABLE opportunities RENAME COLUMN name TO title');
        $this->addSql('ALTER TABLE opportunities ADD CONSTRAINT FK_406D4DB07E3C61F9 FOREIGN KEY (owner_id) REFERENCES users (id) NOT DEFERRABLE');
        $this->addSql('CREATE INDEX IDX_406D4DB07E3C61F9 ON opportunities (owner_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE activities DROP CONSTRAINT FK_B5F1AFE59395C3F3');
        $this->addSql('ALTER TABLE activities DROP CONSTRAINT FK_B5F1AFE59A34590F');
        $this->addSql('ALTER TABLE activities DROP CONSTRAINT FK_B5F1AFE5F675F31B');
        $this->addSql('ALTER TABLE activities ADD CONSTRAINT fk_b5f1afe59395c3f3 FOREIGN KEY (customer_id) REFERENCES customers (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE activities ADD CONSTRAINT fk_b5f1afe59a34590f FOREIGN KEY (opportunity_id) REFERENCES opportunities (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE activities ADD CONSTRAINT fk_b5f1afe5f675f31b FOREIGN KEY (author_id) REFERENCES users (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE customers DROP CONSTRAINT FK_62534E217E3C61F9');
        $this->addSql('DROP INDEX IDX_62534E217E3C61F9');
        $this->addSql('ALTER TABLE customers DROP status');
        $this->addSql('ALTER TABLE customers DROP owner_id');
        $this->addSql('ALTER TABLE opportunities DROP CONSTRAINT FK_406D4DB07E3C61F9');
        $this->addSql('DROP INDEX IDX_406D4DB07E3C61F9');
        $this->addSql('ALTER TABLE opportunities DROP owner_id');
        $this->addSql('ALTER TABLE opportunities RENAME COLUMN title TO name');
    }
}
