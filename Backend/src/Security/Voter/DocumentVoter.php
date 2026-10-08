<?php

namespace App\Security\Voter;

use App\Entity\Document;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class DocumentVoter extends Voter
{
    public const DOWNLOAD = 'DOCUMENT_DOWNLOAD';
    public const PUBLISH = 'DOCUMENT_PUBLISH';

    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::DOWNLOAD, self::PUBLISH], true)
            && $subject instanceof Document;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();
        if (!$user instanceof User) {
            return false;
        }

        /** @var Document $document */
        $document = $subject;

        if ($user->hasRoleCode('SUPER_ADMIN') || $user->hasPermission('knowledge.manage')) {
            return true;
        }

        if ($attribute === self::PUBLISH) {
            return $user->hasPermission('knowledge.write') || $document->getOwner() === $user;
        }

        if ($document->getStatus() === 'PUBLISHED' && $user->hasPermission('knowledge.read')) {
            return true;
        }

        return $document->getOwner() === $user;
    }
}
