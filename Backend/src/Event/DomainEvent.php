<?php

namespace App\Event;

use App\Entity\User;
use Symfony\Contracts\EventDispatcher\Event;

/**
 * Base commune à tous les événements métier du domaine.
 *
 * Un événement n'est pas une notification : c'est le fait qui vient de se
 * produire. Les abonnés en tirent ce qu'ils doivent en faire — une ligne
 * d'audit, une notification, une action métier. Le vocabulaire doit donc rester
 * celui des faits (« une opportunité est passée en phase négociation »), jamais
 * celui de l'affichage (« une notification a été créée »).
 *
 * Deux informations voyagent avec le fait, ce qui permet aux abonnés de rester
 * génériques :
 *  - l'**acteur**, pour attribuer la ligne d'audit à une personne et non au
 *    système ;
 *  - le **contexte**, un tableau libre de valeurs techniques (ancien statut,
 *    montant, identifiant tiers) utile à l'export comme à l'investigation.
 *
 * L'acteur est renseigné par le service qui émet l'événement, et non lu dans
 * le `TokenStorage` : en console (commandes, traitements de fond) il n'y a pas
 * de requête HTTP, et l'on veut pouvoir tracer « action automatique » sans
 * inventer un utilisateur.
 *
 * @see \App\EventSubscriber\AuditSubscriber
 * @see \App\EventSubscriber\NotificationSubscriber
 */
abstract class DomainEvent extends Event
{
    private ?User $actor = null;

    /** @var array<string, mixed> */
    private array $context = [];

    /**
     * Renseigne l'auteur de l'action. Chaînable, pour rester lisible au
     * point d'émission : `->withActor($user)->withContext([...])`.
     */
    public function withActor(?User $actor): static
    {
        $this->actor = $actor;

        return $this;
    }

    public function getActor(): ?User
    {
        return $this->actor;
    }

    /**
     * @param array<string, mixed> $context
     */
    public function withContext(array $context): static
    {
        $this->context = $context;

        return $this;
    }

    /**
     * @return array<string, mixed>
     */
    public function getContext(): array
    {
        return $this->context;
    }

    /**
     * Code d'action pour le journal d'audit, dérivé du nom de l'événement.
     *
     * `access_request.approved` devient `ACCESS_REQUEST_APPROVED`. Le nom de
     * l'événement étant déjà une constante stable, cette dérivation évite
     * d'entretenir une seconde liste de codes qui finirait par diverger.
     */
    public function getAuditAction(): string
    {
        return strtoupper(str_replace('.', '_', static::NAME));
    }

    /**
     * Phrase décrivant le fait, en une ligne.
     *
     * Sert à la fois de description de la ligne d'audit et de base au message
     * de notification. Elle doit rester factuelle et datable : c'est la trace,
     * pas un habillage marketing.
     */
    abstract public function getSummary(): string;

    /**
     * Catégorie d'audit à laquelle rattacher le fait (`AuditLog::CATEGORY_*`).
     */
    abstract public function getAuditCategory(): string;

    /**
     * Classe de l'entité concernée, pour renvoyer l'utilisateur vers le bon
     * écran. Vide si le fait ne porte sur aucune entité.
     */
    abstract public function getTargetType(): string;

    /**
     * Identifiant de l'entité concernée, en texte. `null` si l'entité n'a pas
     * encore été persistée.
     */
    abstract public function getTargetId(): ?string;
}
