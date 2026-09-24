<?php

namespace App\Security\Voter;

use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class PermissionVoter extends Voter
{
    protected function supports(string $attribute, mixed $subject): bool
    {
        // Supporte les permissions sous format modulaire (ex: crm.read, user.manage, etc.)
        return str_contains($attribute, '.') || in_array($attribute, ['SUPER_ADMIN', 'ADMIN'], true);
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if (!$user instanceof User) {
            return false;
        }

        // Le Super Admin a tous les droits
        if ($user->hasRoleCode('SUPER_ADMIN')) {
            return true;
        }

        if ($attribute === 'SUPER_ADMIN') {
            return $user->hasRoleCode('SUPER_ADMIN');
        }

        if ($attribute === 'ADMIN') {
            return $user->hasRoleCode('ADMIN') || $user->hasRoleCode('SUPER_ADMIN');
        }

        return $user->hasPermission($attribute);
    }
}
