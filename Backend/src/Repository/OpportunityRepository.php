<?php

namespace App\Repository;

use App\Entity\Opportunity;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Opportunity>
 */
class OpportunityRepository extends ServiceEntityRepository
{
    /** Étapes du pipeline, dans l'ordre du cycle de vente. */
    public const STAGES = ['PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'];

    /** Étapes « ouvertes » : tout ce qui n'est pas encore gagné ou perdu. */
    public const OPEN_STAGES = ['PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION'];

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Opportunity::class);
    }

    /**
     * Opportunités du pipeline, prêtes à alimenter le tableau Kanban.
     *
     * @param string|null $ownerId Limiter à un commercial (identifiant public UUID)
     *
     * @return Opportunity[]
     */
    public function findForPipeline(?string $ownerId = null, bool $includeClosed = false): array
    {
        $qb = $this->createQueryBuilder('o')
            ->leftJoin('o.customer', 'c')->addSelect('c')
            ->leftJoin('o.owner', 'u')->addSelect('u')
            ->orderBy('o.expectedCloseDate', 'ASC')
            ->addOrderBy('o.createdAt', 'DESC');

        if (!$includeClosed) {
            $qb->andWhere('o.stage IN (:openStages)')
                ->setParameter('openStages', self::OPEN_STAGES);
        }

        if ($ownerId !== null) {
            $qb->andWhere('IDENTITY(o.owner) = :ownerId')
                ->setParameter('ownerId', $ownerId);
        }

        return $qb->getQuery()->getResult();
    }

    /**
     * Total pondéré du portefeuille : somme des montants × probabilité.
     *
     * C'est la seule mesure qui a du sens pour un responsable : la somme brute
     * des montants Suppose que tout se gagne, ce qui n'est jamais vrai.
     */
    public function sumWeightedAmount(?string $ownerId = null): float
    {
        $qb = $this->createQueryBuilder('o')
            ->select('COALESCE(SUM(o.amount * o.probability / 100), 0)')
            ->where('o.stage IN (:openStages)')
            ->setParameter('openStages', self::OPEN_STAGES);

        if ($ownerId !== null) {
            $qb->andWhere('IDENTITY(o.owner) = :ownerId')
                ->setParameter('ownerId', $ownerId);
        }

        return (float) $qb->getQuery()->getSingleScalarResult();
    }
}
