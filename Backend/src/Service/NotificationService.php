<?php

namespace App\Service;

use App\Entity\Notification;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Écriture des notifications destinées aux utilisateurs.
 *
 * Une notification ne part pas par e-mail : elle apparaît dans la cloche de
 * l'interface. L'e-mail reste réservé aux messages qui doivent exister hors de
 * la plateforme (confirmation de mot de passe, rejet d'une demande d'accès),
 * et c'est `AccessRequestService` qui le gère.
 */
class NotificationService
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly UserRepository $users
    ) {
    }

    /**
     * Notifie un destinataire.
     *
     * Le `type` reprend le code d'action d'audit du fait d'origine
     * (`ACCESS_REQUEST_APPROVED`), ce qui permet de relier une notification à
     * sa ligne d'audit sans ajouter de table de correspondance.
     */
    public function notify(
        User $recipient,
        string $type,
        string $title,
        string $body,
        ?string $link = null,
        string $severity = Notification::SEVERITY_INFO
    ): Notification {
        $notification = new Notification($recipient, $type, $title, $body);
        $notification
            ->setLink($link)
            ->setSeverity($severity);

        $this->em->persist($notification);

        return $notification;
    }

    /**
     * Notifie plusieurs destinataires.
     *
     * Les doublons sont écartés : un Super Admin porte aussi le rôle
     * `SUPER_ADMIN` dans certaines configurations, et il ne doit pas recevoir
     * deux fois le même message parce qu'on l'a ciblé par deux codes.
     *
     * @param User[] $recipients
     *
     * @return int nombre de notifications réellement créées
     */
    public function notifyMany(
        array $recipients,
        string $type,
        string $title,
        string $body,
        ?string $link = null,
        string $severity = Notification::SEVERITY_INFO
    ): int {
        $created = 0;

        foreach (self::uniqueById($recipients) as $recipient) {
            $this->notify($recipient, $type, $title, $body, $link, $severity);
            ++$created;
        }

        return $created;
    }

    /**
     * Notifie tous les comptes actifs portant au moins un des rôles donnés.
     *
     * @param string[] $roleCodes
     *
     * @return int nombre de notifications réellement créées
     */
    public function notifyRoleCodes(
        array $roleCodes,
        string $type,
        string $title,
        string $body,
        ?string $link = null,
        string $severity = Notification::SEVERITY_INFO
    ): int {
        return $this->notifyMany(
            $this->users->findActiveByRoleCodes($roleCodes),
            $type,
            $title,
            $body,
            $link,
            $severity
        );
    }

    /**
     * Déduplique une liste d'utilisateurs par identifiant.
     *
     * Sans cela, cibler `['SUPER_ADMIN', 'ADMIN']` produirait une notification
     * en double pour qui porte les deux rôles.
     *
     * @param User[] $recipients
     *
     * @return User[]
     */
    private static function uniqueById(array $recipients): array
    {
        $unique = [];

        foreach ($recipients as $recipient) {
            $unique[(string) $recipient->getId()] = $recipient;
        }

        return array_values($unique);
    }
}
