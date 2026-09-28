<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260924181611 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE assignments (id UUID NOT NULL, title VARCHAR(255) NOT NULL, description TEXT DEFAULT NULL, due_date TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, coefficient DOUBLE PRECISION NOT NULL, format_required VARCHAR(255) DEFAULT NULL, course_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_308A50DD591CC992 ON assignments (course_id)');
        $this->addSql('CREATE TABLE course_documents (id UUID NOT NULL, title VARCHAR(255) NOT NULL, type VARCHAR(50) NOT NULL, size_str VARCHAR(50) DEFAULT NULL, file_url VARCHAR(255) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, course_id UUID NOT NULL, uploaded_by_id UUID DEFAULT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_20113224591CC992 ON course_documents (course_id)');
        $this->addSql('CREATE INDEX IDX_20113224A2B28FE8 ON course_documents (uploaded_by_id)');
        $this->addSql('CREATE TABLE enrollments (id UUID NOT NULL, status VARCHAR(50) NOT NULL, progress DOUBLE PRECISION NOT NULL, validated_modules INT NOT NULL, total_modules INT NOT NULL, next_milestone VARCHAR(255) DEFAULT NULL, student_id UUID NOT NULL, promotion_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_CCD8C132CB944F1A ON enrollments (student_id)');
        $this->addSql('CREATE INDEX IDX_CCD8C132139DF194 ON enrollments (promotion_id)');
        $this->addSql('CREATE TABLE payment_receipts (id UUID NOT NULL, amount DOUBLE PRECISION NOT NULL, status VARCHAR(50) NOT NULL, document_url VARCHAR(255) DEFAULT NULL, reference VARCHAR(100) DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, tuition_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_5D2DA1CA7FFA6BA ON payment_receipts (tuition_id)');
        $this->addSql('CREATE TABLE programs (id UUID NOT NULL, name VARCHAR(255) NOT NULL, description TEXT DEFAULT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE TABLE promotions (id UUID NOT NULL, name VARCHAR(255) NOT NULL, start_date DATE DEFAULT NULL, end_date DATE DEFAULT NULL, program_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_EA1B30343EB8070A ON promotions (program_id)');
        $this->addSql('CREATE TABLE student_submissions (id UUID NOT NULL, status VARCHAR(50) NOT NULL, submission_url VARCHAR(255) DEFAULT NULL, submitted_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, assignment_id UUID NOT NULL, student_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_E88164F4D19302F8 ON student_submissions (assignment_id)');
        $this->addSql('CREATE INDEX IDX_E88164F4CB944F1A ON student_submissions (student_id)');
        $this->addSql('CREATE TABLE tuitions (id UUID NOT NULL, total_amount DOUBLE PRECISION NOT NULL, remaining_balance DOUBLE PRECISION NOT NULL, total_tranches INT NOT NULL, paid_tranches INT NOT NULL, student_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_E716F529CB944F1A ON tuitions (student_id)');
        $this->addSql('ALTER TABLE assignments ADD CONSTRAINT FK_308A50DD591CC992 FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE course_documents ADD CONSTRAINT FK_20113224591CC992 FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE course_documents ADD CONSTRAINT FK_20113224A2B28FE8 FOREIGN KEY (uploaded_by_id) REFERENCES users (id) ON DELETE SET NULL NOT DEFERRABLE');
        $this->addSql('ALTER TABLE enrollments ADD CONSTRAINT FK_CCD8C132CB944F1A FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE enrollments ADD CONSTRAINT FK_CCD8C132139DF194 FOREIGN KEY (promotion_id) REFERENCES promotions (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE payment_receipts ADD CONSTRAINT FK_5D2DA1CA7FFA6BA FOREIGN KEY (tuition_id) REFERENCES tuitions (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE promotions ADD CONSTRAINT FK_EA1B30343EB8070A FOREIGN KEY (program_id) REFERENCES programs (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE student_submissions ADD CONSTRAINT FK_E88164F4D19302F8 FOREIGN KEY (assignment_id) REFERENCES assignments (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE student_submissions ADD CONSTRAINT FK_E88164F4CB944F1A FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE tuitions ADD CONSTRAINT FK_E716F529CB944F1A FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE CASCADE NOT DEFERRABLE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE assignments DROP CONSTRAINT FK_308A50DD591CC992');
        $this->addSql('ALTER TABLE course_documents DROP CONSTRAINT FK_20113224591CC992');
        $this->addSql('ALTER TABLE course_documents DROP CONSTRAINT FK_20113224A2B28FE8');
        $this->addSql('ALTER TABLE enrollments DROP CONSTRAINT FK_CCD8C132CB944F1A');
        $this->addSql('ALTER TABLE enrollments DROP CONSTRAINT FK_CCD8C132139DF194');
        $this->addSql('ALTER TABLE payment_receipts DROP CONSTRAINT FK_5D2DA1CA7FFA6BA');
        $this->addSql('ALTER TABLE promotions DROP CONSTRAINT FK_EA1B30343EB8070A');
        $this->addSql('ALTER TABLE student_submissions DROP CONSTRAINT FK_E88164F4D19302F8');
        $this->addSql('ALTER TABLE student_submissions DROP CONSTRAINT FK_E88164F4CB944F1A');
        $this->addSql('ALTER TABLE tuitions DROP CONSTRAINT FK_E716F529CB944F1A');
        $this->addSql('DROP TABLE assignments');
        $this->addSql('DROP TABLE course_documents');
        $this->addSql('DROP TABLE enrollments');
        $this->addSql('DROP TABLE payment_receipts');
        $this->addSql('DROP TABLE programs');
        $this->addSql('DROP TABLE promotions');
        $this->addSql('DROP TABLE student_submissions');
        $this->addSql('DROP TABLE tuitions');
    }
}
