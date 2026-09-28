<?php

namespace App\Service;

use App\Entity\AuditLog;
use App\Entity\User;
use App\Event\DomainEvent;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;

/**
 * Écriture du journal d'audit.
 *
 * Règle de conception : une trace ne doit jamais pouvoir faire échouer
 * l'opération métier qu'elle accompagne. Un paiement encaissé reste encaissé
 * même si l'écriture de la ligne d'audit échoue ; on préfère une trace
 * manquante et visible dans les journaux applicatifs à une inscription
 * perdue. C'est pourquoi les subscribers aval attrapent les exceptions —
 * voir `AuditSubscriber`.
 *
 * Note sur le moment du `flush()` : la convention retenue dans ce projet est que
 * l'abonné écrit et valide lui-même, comme le fait déjà
 * `ProjectCreationSubscriber`. Un second `flush()` de l'appelant est sans
 * effet, un premier `flush()` oubliant ne perd rien.
 */
class AuditLogService
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly RequestStack $requestStack
    ) {
    }

    /**
     * Trace un événement métier du bus.
     *
     * Tout le générique est déduit de l'événement : l'action vient du nom de
     * l'événement, la catégorie et la cible de l'événement lui-même. Il n'y a
     * donc rien à renseigner ici, ce qui évite qu'un nouvel événement soit
     * oublié dans l'audit parce qu'on aurait oublié d'ajouter une ligne.
     *
     * L'acteur est celui porté par l'événement, avec un repli explicite pour
     * les cas où le service émetteur l'a omis.
     */
    public function recordEvent(DomainEvent $event, ?User $fallbackActor = null): AuditLog
    {
        $context = $event->getContext();

        return $this->record(
            action: $event->getAuditAction(),
            description: $event->getSummary(),
            actor: $event->getActor() ?? $fallbackActor,
            category: $event->getAuditCategory(),
            targetType: $event->getTargetType() !== '' ? $event->getTargetType() : null,
            targetId: $event->getTargetId(),
            metadata: $context !== [] ? $context : null
        );
    }

    /**
     * Trace une action qui ne passe par aucun événement.
     *
     * Réservé aux gestes qui n'ont pas de fait métier à produire : connexion,
     * changement de rôle, dépôt de fichier, lecture
     * sensible. Dès qu'un geste a un sens pour le domaine, on lui crée un
     * événement plutôt que d'appeler cette méthode depuis le contrôleur.
     */
    public function record(
        string $action,
        string $description,
        ?User $actor = null,
        string $category = AuditLog::CATEGORY_SECURITY,
        string $severity = AuditLog::SEVERITY_INFO,
        ?string $targetType = null,
        ?string $targetId = null,
        ?array $metadata = null
    ): AuditLog {
        $entry = new AuditLog();
        $entry
            ->setAction($action)
            ->setCategory($category)
            ->setSeverity($severity)
            ->setDescription($description)
            ->setActor($actor)
            ->setActorIp($this->currentIp())
            ->setTargetType($targetType)
            ->setTargetId($targetId)
            ->setMetadata($metadata);

        $this->em->persist($entry);

        return $entry;
    }

    /**
     * Adresse IP de l'appelant, ou `null` en console.
     *
     * `getClientIp()` applique la configuration des proxies de confiance : si
     * l'application est derrière un reverse proxy, elle ne remontra pas une
     * adresse spoofable de l'en-tête `X-Forwarded-For`.
     */
    private function currentIp(): ?string
    {
        $request = $this->requestStack->getCurrentRequest();

        if ($request === null) {
            return null;
        }

        $ip = $request->getClientIp();

        return $ip !== '' ? $ip : null;
    }
}
