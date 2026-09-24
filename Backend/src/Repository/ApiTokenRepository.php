<?php

namespace App\Repository;

use App\Entity\ApiToken;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ApiToken>
 */
class ApiTokenRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ApiToken::class);
    }

    public function findValidToken(string $plainToken): ?ApiToken
    {
        $hash = hash('sha256', $plainToken);

        return $this->createQueryBuilder('t')
            ->leftJoin('t.user', 'u')
            ->addSelect('u')
            ->where('t.tokenHash = :hash')
            ->andWhere('t.expiresAt > :now')
            ->setParameter('hash', $hash)
            ->setParameter('now', new \DateTimeImmutable())
            ->getQuery()
            ->getOneOrNullResult();
    }
}
