<?php

namespace App\Repository;

use App\Entity\Reminder;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Reminder>
 */
class ReminderRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Reminder::class);
    }

    /**
     * Recherche de relances avec tous les filtres de l'interface.
     *
     * Les jointures vers client, affaire et collaborateur sont faites en
     * `leftJoin` + `addSelect` : l'affichage du tableau a besoin du nom du
     * client sur chaque ligne, sinon le navigateur ferait une requête par ligne.
     *
     * @param array{
     *     status?: string|null,
     *     assignedTo?: string|null,
     *     customer?: int|null,
     *     opportunity?: int|null,
     *     overdueOnly?: bool,
     *     limit?: int|null
     * } $filters
     *
     * @return Reminder[]
     */
    public function search(array $filters = []): array
    {
        $qb = $this->createQueryBuilder('r')
            ->leftJoin('r.customer', 'c')->addSelect('c')
            ->leftJoin('r.opportunity', 'o')->addSelect('o')
            ->leftJoin('r.assignedTo', 'u')->addSelect('u')
            // Une relance en retard remonte avant tout le reste, puis par échéance.
            ->orderBy('r.dueAt', 'ASC');

        if (!empty($filters['status'])) {
            $qb->andWhere('r.status = :status')
                ->setParameter('status', strtoupper(trim((string) $filters['status'])));
        }

        if (!empty($filters['assignedTo'])) {
            $qb->andWhere('IDENTITY(r.assignedTo) = :assignedTo')
                ->setParameter('assignedTo', $filters['assignedTo']);
        }

        if (!empty($filters['customer'])) {
            $qb->andWhere('c.id = :customer')
                ->setParameter('customer', (int) $filters['customer']);
        }

        if (!empty($filters['opportunity'])) {
            $qb->andWhere('o.id = :opportunity')
                ->setParameter('opportunity', (int) $filters['opportunity']);
        }

        if (!empty($filters['overdueOnly'])) {
            $qb->andWhere('r.status = :pending')
                ->andWhere('r.dueAt < :today')
                ->setParameter('pending', Reminder::STATUS_PENDING)
                ->setParameter('today', new \DateTimeImmutable('today'));
        }

        $qb->setMaxResults($filters['limit'] ?? 200);

        return $qb->getQuery()->getResult();
    }

    /**
     * Compte les relances à traiter, réparties par échéance.
     *
     * Alimente les indicateurs de l'accueil : c'est le nombre que le
     * commercial regarde en premier chaque matin.
     *
     * @return array{overdue: int, today: int, upcoming: int}
     */
    public function countUpcoming(string $userId): array
    {
        return [
            'overdue' => $this->countPending($userId, 'r.dueAt < :today'),
            'today' => $this->countPending($userId, 'r.dueAt = :today'),
            'upcoming' => $this->countPending($userId, 'r.dueAt > :today'),
        ];
    }

    /**
     * Compte les relances en attente d'un collaborateur selon un critère de date.
     *
     * @param string $dateCondition Fragment DQL comparant `r.dueAt` à :today
     */
    private function countPending(string $userId, string $dateCondition): int
    {
        return (int) $this->createQueryBuilder('r')
            ->select('COUNT(r.id)')
            ->where('r.status = :pending')
            // IDENTITY() extrait l'identifiant de l'association : DQL ne
            // permet pas de comparer une association par un chemin pointé.
            ->andWhere('IDENTITY(r.assignedTo) = :userId')
            ->andWhere($dateCondition)
            ->setParameter('pending', Reminder::STATUS_PENDING)
            ->setParameter('userId', $userId)
            ->setParameter('today', new \DateTimeImmutable('today'))
            ->getQuery()
            ->getSingleScalarResult();
    }
}
