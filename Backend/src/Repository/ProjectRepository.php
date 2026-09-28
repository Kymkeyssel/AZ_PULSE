<?php

namespace App\Repository;

use App\Entity\Project;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Project>
 */
class ProjectRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Project::class);
    }

    /**
     * Projets d'un client, du plus récent au plus ancien.
     *
     * @return Project[]
     */
    public function findForCustomer(int $customerId): array
    {
        return $this->createQueryBuilder('p')
            ->andWhere('IDENTITY(p.customer) = :customerId')
            ->setParameter('customerId', $customerId)
            ->orderBy('p.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Projets d'un chef de projet, tous statuts confondus.
     *
     * @return Project[]
     */
    public function findForManager(string $managerId): array
    {
        return $this->createQueryBuilder('p')
            ->andWhere('IDENTITY(p.manager) = :managerId')
            ->setParameter('managerId', $managerId)
            ->orderBy('p.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }
}
