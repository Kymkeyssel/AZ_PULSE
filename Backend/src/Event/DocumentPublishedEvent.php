<?php

namespace App\Event;

use App\Entity\AuditLog;
use App\Entity\Document;

/**
 * Un document de la base de connaissances a été publié.
 *
 * La publication rend le document consultable par les profils qui n'avaient
 * que la version de travail. Notifier tout le monde serait contre-productif :
 * seuls le propriétaire et les Supers Admins ont une raison d'être informés,
 * et c'est à eux que l'événement notifie.
 */
class DocumentPublishedEvent extends DomainEvent
{
    public const NAME = 'document.published';

    public function __construct(private readonly Document $document)
    {
    }

    public function getDocument(): Document
    {
        return $this->document;
    }

    public function getSummary(): string
    {
        return sprintf(
            'Document « %s » publié (version %s)',
            $this->document->getTitle(),
            $this->document->getCurrentVersion() ?? '1'
        );
    }

    public function getAuditCategory(): string
    {
        return AuditLog::CATEGORY_KNOWLEDGE;
    }

    public function getTargetType(): string
    {
        return Document::class;
    }

    public function getTargetId(): ?string
    {
        return $this->document->getId() !== null ? (string) $this->document->getId() : null;
    }
}
