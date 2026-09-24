<?php

namespace App\Security;

use App\Repository\ApiTokenRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;

class ApiTokenAuthenticator extends AbstractAuthenticator
{
    public function __construct(
        private readonly ApiTokenRepository $apiTokenRepository,
    ) {
    }

    public function supports(Request $request): ?bool
    {
        return $request->headers->has('Authorization')
            && str_starts_with($request->headers->get('Authorization', ''), 'Bearer ');
    }

    public function authenticate(Request $request): Passport
    {
        $authorizationHeader = $request->headers->get('Authorization');
        if (null === $authorizationHeader) {
            throw new CustomUserMessageAuthenticationException('En-tête Authorization manquant.');
        }

        $plainToken = substr($authorizationHeader, 7);
        if (empty($plainToken)) {
            throw new CustomUserMessageAuthenticationException('Jeton d\'authentification vide.');
        }

        $apiToken = $this->apiTokenRepository->findValidToken($plainToken);

        if (!$apiToken) {
            throw new CustomUserMessageAuthenticationException('Jeton d\'accès invalide ou expiré.');
        }

        $user = $apiToken->getUser();

        if (!$user->isActive()) {
            throw new CustomUserMessageAuthenticationException('Compte utilisateur inactif ou non validé.');
        }

        return new SelfValidatingPassport(
            new UserBadge($user->getUserIdentifier(), fn() => $user)
        );
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        return null; // Laisser la requête continuer vers le contrôleur
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        return new JsonResponse([
            'success' => false,
            'message' => $exception->getMessageKey() !== 'An authentication exception occurred.'
                ? $exception->getMessage()
                : 'Authentification requise ou jeton invalide.',
        ], Response::HTTP_UNAUTHORIZED);
    }
}
