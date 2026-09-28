<?php

namespace App\Enum;

/**
 * Catalogue des spécialisations du rôle générique COLLABORATEUR.
 *
 * Principe : COLLABORATEUR est un rôle « conteneur » qui porte les permissions
 * de lecture communes à tous les collaborateurs. La spécialisation (ce profile)
 * n'accorde QUE des droits supplémentaires, et n'est jamais utilisée comme
 * référence de autorisation : l'interface React adapte l'expérience, mais
 * Symfony reste l'unique autorité (cf. SECURITY_NOTES.md et règle structurante n°3).
 *
 * Ajouter une nouvelle spécialisation = ajouter un case + ses permissions.
 * Aucune migration n'est nécessaire : le catalogue vit dans le code, ce qui
 * le rend explicite et auditable lors de la soutenance.
 */
enum CollaboratorProfile: string
{
    case COMMERCIAL = 'COMMERCIAL';
    case FORMATEUR = 'FORMATEUR';
    case SUPPORT_IT = 'SUPPORT_IT';
    case COMMUNICATION = 'COMMUNICATION';
    case GENERIQUE = 'GENERIQUE';

    /**
     * Libellé affiché dans l'interface d'administration.
     */
    public function label(): string
    {
        return match ($this) {
            self::COMMERCIAL => 'Commercial / Chargé d\'affaires',
            self::FORMATEUR => 'Formateur / Intervenant',
            self::SUPPORT_IT => 'Support IT / Technicien',
            self::COMMUNICATION => 'Chargé de communication',
            self::GENERIQUE => 'Collaborateur — profil générique',
        };
    }

    /**
     * Description métier affichée à l'administrateur lors de l'arbitrage,
     * pour lui permettre de choisir le bon profil en connaissance de cause.
     */
    public function description(): string
    {
        return match ($this) {
            self::COMMERCIAL => 'Saisit et suit les prospects, clients et opportunités commerciales. Peut faire avancer une opportunité dans le pipeline et enregistrer les relances.',
            self::FORMATEUR => 'Anime les sessions de formation, suit ses apprenants et construit les évaluations. Ne valide pas les paiements (réservé à la Direction).',
            self::SUPPORT_IT => 'Traite les incidents, la maintenance et le parc informatique. N\'accède pas aux données commerciales clients.',
            self::COMMUNICATION => 'Rédige, met à jour et publie la documentation interne (Knowledge Hub).',
            self::GENERIQUE => 'Aucun droit spécifique au-delà des lectures communes. Sert de valeur par défaut lorsqu\'aucun profil ne correspond au poste.',
        };
    }

    /**
     * Icône Material Symbols (même langage visuel que le reste du projet).
     */
    public function icon(): string
    {
        return match ($this) {
            self::COMMERCIAL => 'handshake',
            self::FORMATEUR => 'co_present',
            self::SUPPORT_IT => 'support_agent',
            self::COMMUNICATION => 'campaign',
            self::GENERIQUE => 'badge',
        };
    }

    /**
     * Permissions accordées EN PLUS du socle COLLABORATEUR.
     *
     * @return string[]
     */
    public function grantedPermissions(): array
    {
        return match ($this) {
            // Pilotage du cycle commercial, sans les droits d'administration du module
            self::COMMERCIAL => ['crm.create', 'crm.update', 'crm.delete'],

            // Production pédagogique : création de contenu et suivi, validation réservée
            self::FORMATEUR => ['formation.create', 'formation.update'],

            // Opérations IT : gestion du parc et des incidents, plus une marge sur les tâches
            self::SUPPORT_IT => ['it.read', 'it.manage', 'workspace.update'],

            self::COMMUNICATION => ['knowledge.create', 'knowledge.update', 'knowledge.delete'],

            self::GENERIQUE => [],
        };
    }

    /**
     * Permissions explicitement retirées du socle COLLABORATEUR.
     *
     * Le support IT n'a aucune raison de consulter le référentiel commercial :
     * on matérialise ici le « périmètre » décrit dans le document fonctionnel
     * (règle structurante : l'accès dépend du rôle ET du périmètre).
     *
     * @return string[]
     */
    public function revokedPermissions(): array
    {
        return match ($this) {
            self::SUPPORT_IT => ['crm.read'],
            default => [],
        };
    }

    /**
     * Route d'entrée dans l'espace personnel du collaborateur.
     */
    public function interfaceRoute(): string
    {
        return match ($this) {
            self::COMMERCIAL => '/collaborateur/commercial',
            self::FORMATEUR => '/collaborateur/formateur',
            self::SUPPORT_IT => '/collaborateur/support-it',
            self::COMMUNICATION => '/collaborateur/communication',
            self::GENERIQUE => '/collaborateur',
        };
    }

    /**
     * Résolution tolérante : accepte un code valide, ou null / valeur inconnue.
     */
    public static function fromCode(?string $code): ?self
    {
        if ($code === null || trim($code) === '') {
            return null;
        }

        return self::tryFrom(strtoupper(trim($code)));
    }

    /**
     * Le profil de repli : celui qu'on attribue par défaut si l'administrateur
     * oublie de trancher. Garantit qu'un COLLABORATEUR n'est jamais sans interface.
     */
    public static function default(): self
    {
        return self::GENERIQUE;
    }

    /**
     * Catalogue sérialisable exposé à l'API d'administration.
     *
     * @return array<int, array<string, mixed>>
     */
    public static function catalog(): array
    {
        return array_map(
            static fn (self $profile): array => [
                'code' => $profile->value,
                'label' => $profile->label(),
                'description' => $profile->description(),
                'icon' => $profile->icon(),
                'interfaceRoute' => $profile->interfaceRoute(),
                'grantedPermissions' => $profile->grantedPermissions(),
                'revokedPermissions' => $profile->revokedPermissions(),
            ],
            self::cases(),
        );
    }
}
