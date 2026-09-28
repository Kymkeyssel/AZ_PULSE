<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;

/**
 * @extends ServiceEntityRepository<User>
 */
class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function upgradePassword(PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', $user::class));
        }

        $user->setPassword($newHashedPassword);
        $this->getEntityManager()->persist($user);
        $this->getEntityManager()->flush();
    }

    public function findOneByEmail(string $email): ?User
    {
        return $this->createQueryBuilder('u')
            ->where('LOWER(u.email) = :email')
            ->setParameter('email', strtolower(trim($email)))
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Comptes actifs portant au moins un des codes de rôles demandés.
     *
     * Utilisé pour router une notification vers une population
     * (« prévenir les administrateurs ») sans énumérer les destinataires à la
     * main. Les comptes en attente d'approbation sont exclus : leur laisser
     * croire qu'une action est attendue d'eux n'a pas de sens.
     *
     * @param string[] $roleCodes
     *
     * @return User[]
     */
    public function findActiveByRoleCodes(array $roleCodes): array
    {
        $roleCodes = array_values(array_filter(array_map('trim', $roleCodes)));

        if ($roleCodes === []) {
            return [];
        }

        return $this->createQueryBuilder('u')
            ->innerJoin('u.roles', 'r')
            ->andWhere('UPPER(r.code) IN (:codes)')
            ->andWhere('u.status = :status')
            ->setParameter('codes', array_map('strtoupper', $roleCodes))
            ->setParameter('status', User::STATUS_ACTIVE)
            ->orderBy('u.email', 'ASC')
            ->getQuery()
            ->getResult();
    }
}
