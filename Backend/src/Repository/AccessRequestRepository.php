<?php

namespace App\Repository;

use App\Entity\AccessRequest;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<AccessRequest>
 */
class AccessRequestRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AccessRequest::class);
    }

    /**
     * @return AccessRequest[]
     */
    public function findByStatusOrdered(?string $status = null): array
    {
        $qb = $this->createQueryBuilder('ar')
            ->leftJoin('ar.user', 'u')
            ->addSelect('u')
            ->leftJoin('ar.assignedRole', 'r')
            ->addSelect('r')
            ->orderBy('ar.createdAt', 'DESC');

        if ($status !== null && $status !== '') {
            $qb->andWhere('ar.status = :status')
                ->setParameter('status', strtoupper(trim($status)));
        }

        return $qb->getQuery()->getResult();
    }
}
