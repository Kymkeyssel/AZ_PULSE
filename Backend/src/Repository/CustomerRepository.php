<?php

namespace App\Repository;

use App\Entity\Customer;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Customer>
 */
class CustomerRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Customer::class);
    }

    /**
     * Recherche par nom, pour l'autocomplétion du champ « client ».
     *
     * `q` sur le nom et l'email : au téléphone, on cherche souvent par l'adresse
     * mail plutôt que par la raison sociale.
     *
     * @return Customer[]
     */
    public function search(string $q, int $limit = 20): array
    {
        $q = trim($q);

        if ($q === '') {
            return [];
        }

        return $this->createQueryBuilder('c')
            ->where('c.name LIKE :q')
            ->orWhere('c.email LIKE :q')
            ->setParameter('q', '%' . $q . '%')
            ->orderBy('c.name', 'ASC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }
}
