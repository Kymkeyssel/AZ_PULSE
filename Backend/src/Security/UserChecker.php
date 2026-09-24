<?php

namespace App\Security;

use App\Entity\User;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAccountStatusException;
use Symfony\Component\Security\Core\User\UserCheckerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class UserChecker implements UserCheckerInterface
{
    public function checkPreAuth(UserInterface $user): void
    {
        if (!$user instanceof User) {
            return;
        }

        switch ($user->getStatus()) {
            case User::STATUS_PENDING_APPROVAL:
                throw new CustomUserMessageAccountStatusException(
                    'Votre demande de création de compte est en attente de validation par l\'administration.'
                );

            case User::STATUS_REJECTED:
                throw new CustomUserMessageAccountStatusException(
                    'Votre demande d\'accès a été refusée par l\'administration.'
                );

            case User::STATUS_INACTIVE:
            case User::STATUS_BLOCKED:
                throw new CustomUserMessageAccountStatusException(
                    'Ce compte utilisateur est actuellement inactif ou suspendu.'
                );

            case User::STATUS_ACTIVE:
                // OK
                break;

            default:
                throw new CustomUserMessageAccountStatusException('Accès non autorisé.');
        }
    }

    public function checkPostAuth(UserInterface $user): void
    {
        if (!$user instanceof User) {
            return;
        }

        if (!$user->isActive()) {
            throw new CustomUserMessageAccountStatusException('Votre compte n\'est plus actif.');
        }
    }
}
