<?php

namespace App\Security\Voter;

use App\Entity\Project;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class ProjectVoter extends Voter
{
    public const ANALYZE = 'PROJECT_ANALYZE';

    protected function supports(string $attribute, mixed $subject): bool
    {
        return $attribute === self::ANALYZE && $subject instanceof Project;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();
        if (!$user) {
            return false;
        }

        /** @var Project $project */
        $project = $subject;

        if ($attribute === self::ANALYZE) {
            if (!$user instanceof \App\Entity\User) {
                return false;
            }
            if ($user->hasRoleCode('SUPER_ADMIN') || $user->hasRoleCode('ADMIN')) {
                return true;
            }
            if ($user->hasPermission('workspace.manage') && $user->hasPermission('ai.read')) {
                return true;
            }
            if ($project->getManager() === $user) {
                return true;
            }
            if ($project->getMembers()->contains($user)) {
                return true;
            }
            if ($user->hasRoleCode('CLIENT') && $project->getCustomer()?->getEmail() === $user->getEmail()) {
                return true;
            }
        }

        return false;
    }
}
