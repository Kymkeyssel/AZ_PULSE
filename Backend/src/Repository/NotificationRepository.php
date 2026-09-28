<?php

namespace App\Repository;

use App\Entity\Notification;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Notification>
 */
class NotificationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Notification::class);
    }

    /**
     * File de notifications d'un utilisateur, les plus récentes d'abord.
     *
     * `onlyUnread` sert à l'écran « non lues » ; sinon on renvoie tout pour
     * l'historique. La page est plafonnée à 100 lignes pour qu'un compte très
     * actif ne charge pas l'intégralité de sa file.
     *
     * @return array{items: Notification[], total: int, page: int, limit: int, pages: int}
     */
    public function paginateFor(User $user, int $page = 1, int $limit = 20, bool $onlyUnread = false): array
    {
        $page = max(1, $page);
        $limit = max(1, min(100, $limit));

        $qb = $this->createQueryBuilder('n')
            ->andWhere('n.recipient = :user')
            ->setParameter('user', $user);

        if ($onlyUnread) {
            $qb->andWhere('n.isRead = false');
        }

        $total = (int) (clone $qb)
            ->select('COUNT(n.id)')
            ->getQuery()
            ->getSingleScalarResult();

        /** @var Notification[] $items */
        $items = $qb
            ->orderBy('n.createdAt', 'DESC')
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();

        return [
            'items' => $items,
            'total' => $total,
            'page'  => $page,
            'limit' => $limit,
            'pages' => (int) ceil($total / $limit),
        ];
    }

    /**
     * Nombre de notifications non lues.
     *
     * Requête d'un simple `COUNT` et non un chargement de collection : c'est
     * appelé à chaque affichage de la cloche, y compris par des écrans qui
     * n'affichent jamais la liste.
     */
    public function countUnreadFor(User $user): int
    {
        return (int) $this->createQueryBuilder('n')
            ->select('COUNT(n.id)')
            ->andWhere('n.recipient = :user')
            ->andWhere('n.isRead = false')
            ->setParameter('user', $user)
            ->getQuery()
            ->getSingleScalarResult();
    }

    /**
     * Marque comme lues les notifications non lues d'un utilisateur.
     *
     * Retourne le nombre réellement basculé, pour que l'interface puisse
     * annoncer « n notifications traitées » plutôt que mentir sur un `total`.
     *
     * @return int
     */
    public function markAllAsReadFor(User $user): int
    {
        $now = new \DateTimeImmutable();

        return (int) $this->createQueryBuilder('n')
            ->update()
            ->set('n.isRead', ':isRead')
            ->set('n.readAt', ':readAt')
            ->andWhere('n.recipient = :user')
            ->andWhere('n.isRead = false')
            ->setParameter('isRead', true)
            ->setParameter('readAt', $now)
            ->setParameter('user', $user)
            ->getQuery()
            ->execute();
    }
}
