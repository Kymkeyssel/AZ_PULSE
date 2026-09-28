<?php

namespace App\Event;

use App\Entity\AuditLog;
use App\Entity\PaymentReceipt;
use App\Entity\Tuition;

/**
 * Un règlement de scolarité a été encaissé.
 *
 * Événement central du parcours Formation (§7.2) : c'est lui qui solde une
 * tranche, met à jour le solde restant et prévient le secrétariat et
 * l'apprenant. Il est aussi le point le plus sensible sur le plan financier —
 * la ligne d'audit porte donc la référence du reçu, pour que la trace puisse
 * être rapprochée d'un virement bancaire sans passer par la base.
 */
class TuitionPaymentReceivedEvent extends DomainEvent
{
    public const NAME = 'tuition.payment_received';

    public function __construct(
        private readonly Tuition $tuition,
        private readonly PaymentReceipt $receipt
    ) {
    }

    public function getTuition(): Tuition
    {
        return $this->tuition;
    }

    public function getReceipt(): PaymentReceipt
    {
        return $this->receipt;
    }

    public function getSummary(): string
    {
        return sprintf(
            'Règlement de %.2f € reçu pour %s (reçu %s), solde restant : %.2f €',
            $this->receipt->getAmount(),
            $this->tuition->getStudent()?->getEmail() ?? 'apprenant inconnu',
            $this->receipt->getReference() ?? 'sans référence',
            $this->tuition->getRemainingBalance()
        );
    }

    public function getAuditCategory(): string
    {
        return AuditLog::CATEGORY_FORMATION;
    }

    public function getTargetType(): string
    {
        return PaymentReceipt::class;
    }

    public function getTargetId(): ?string
    {
        return $this->receipt->getId() !== null ? (string) $this->receipt->getId() : null;
    }
}
