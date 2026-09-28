<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Colonnes de réinitialisation de mot de passe.
 *
 * Ces deux colonnes portaient `resetToken` et `resetTokenExpiresAt` dans
 * l'entité `User`, mais aucune migration ne les créait : elles avaient été
 * ajoutées directement sur la base de développement. La base était donc en
 * accord avec le mapping, mais **une installation neuve n'aurait pas eu ces
 * colonnes** — et la fonctionnalité « mot de passe oublié » aurait échoué sur
 * une erreur SQL au premier envoi de jeton.
 *
 * Cette migration referme l'écart. Elle est volontairement idempotente : la
 * base de développement possède déjà les colonnes, et un `ALTER TABLE ... ADD`
 * y échouerait. Le test porte donc sur le schéma observé plutôt que sur une
 * hypothèse, ce qui rend la migration sûre aussi bien sur une base neuve que
 * sur une base déjà alignée.
 */
final class Version20260928093000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Utilisateurs : jeton et expiration de réinitialisation de mot de passe';
    }

    public function up(Schema $schema): void
    {
        $users = $schema->getTable('users');

        if (!$users->hasColumn('reset_token')) {
            $this->addSql('ALTER TABLE users ADD reset_token VARCHAR(100) DEFAULT NULL');
        }

        if (!$users->hasColumn('reset_token_expires_at')) {
            $this->addSql('ALTER TABLE users ADD reset_token_expires_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL');
        }
    }

    public function down(Schema $schema): void
    {
        $users = $schema->getTable('users');

        if ($users->hasColumn('reset_token_expires_at')) {
            $this->addSql('ALTER TABLE users DROP reset_token_expires_at');
        }

        if ($users->hasColumn('reset_token')) {
            $this->addSql('ALTER TABLE users DROP reset_token');
        }
    }
}
