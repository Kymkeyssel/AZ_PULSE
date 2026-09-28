<?php

namespace App\Repository;

use App\Entity\AuditLog;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<AuditLog>
 */
class AuditLogRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AuditLog::class);
    }

    /**
     * Journal paginé et filtrable.
     *
     * Chaque filtre est optionnel et se cumule. `$category` et `$severity`
     * servent aux onglets de l'écran d'audit ; `$action` et `$actorEmail` à une
     * recherche ciblée.
     *
     * La pagination est faite à la main (une requête `COUNT` puis la page
     * demandée) : le projet n'embarque pas doctrine/paginator, et l'écran
     * d'audit n'a besoin que d'un `total` et d'un `hasMore`.
     *
     * @return array{items: AuditLog[], total: int, page: int, limit: int, pages: int}
     */
    public function paginate(
        int $page = 1,
        int $limit = 50,
        ?string $category = null,
        ?string $severity = null,
        ?string $action = null,
        ?string $actorEmail = null,
        ?\DateTimeInterface $since = null
    ): array {
        $page = max(1, $page);
        $limit = max(1, min(200, $limit));

        $qb = $this->applyFilters($this->createQueryBuilder('a'), $category, $severity, $action, $actorEmail, $since);

        $total = (int) (clone $qb)
            ->select('COUNT(a.id)')
            ->getQuery()
            ->getSingleScalarResult();

        /** @var AuditLog[] $items */
        $items = $qb
            ->orderBy('a.createdAt', 'DESC')
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
     * Compteurs par catégorie, pour les onglets de l'écran d'audit.
     *
     * @return array<string, int>
     */
    public function countByCategory(): array
    {
        $rows = $this->createQueryBuilder('a')
            ->select('a.category AS category, COUNT(a.id) AS total')
            ->groupBy('a.category')
            ->getQuery()
            ->getArrayResult();

        $result = [];
        foreach ($rows as $row) {
            $result[(string) $row['category']] = (int) $row['total'];
        }

        return $result;
    }

    /**
     * Filtres mutualisés entre le comptage et la page, pour que `total` et
     * `items` portent toujours la même restriction.
     */
    private function applyFilters(
        QueryBuilder $qb,
        ?string $category,
        ?string $severity,
        ?string $action,
        ?string $actorEmail,
        ?\DateTimeInterface $since
    ): QueryBuilder {
        if ($category !== null && $category !== '') {
            $qb->andWhere('a.category = :category')->setParameter('category', $category);
        }

        if ($severity !== null && $severity !== '') {
            $qb->andWhere('a.severity = :severity')->setParameter('severity', $severity);
        }

        if ($action !== null && $action !== '') {
            $qb->andWhere('a.action LIKE :action')->setParameter('action', '%' . $action . '%');
        }

        if ($actorEmail !== null && $actorEmail !== '') {
            $qb->andWhere('a.actorEmail LIKE :actorEmail')
               ->setParameter('actorEmail', '%' . $actorEmail . '%');
        }

        if ($since !== null) {
            $qb->andWhere('a.createdAt >= :since')->setParameter('since', $since);
        }

        return $qb;
    }
}
