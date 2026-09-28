<?php

declare(strict_types=1);

namespace App\Webhook;

use Psr\Log\LoggerInterface;
use Symfony\Component\Mailer\Event\MailerDeliveryEvent;
use Symfony\Component\Mailer\Event\MailerEngagementEvent;
use Symfony\Component\RemoteEvent\Attribute\AsRemoteEventConsumer;
use Symfony\Component\RemoteEvent\Consumer\ConsumerInterface;
use Symfony\Component\RemoteEvent\RemoteEvent;

#[AsRemoteEventConsumer('mailer_resend')]
final readonly class ResendWebhookConsumer implements ConsumerInterface
{
    public function __construct(
        private LoggerInterface $logger
    ) {
    }

    public function consume(RemoteEvent $event): void
    {
        if ($event instanceof MailerDeliveryEvent) {
            $this->logger->info('Email delivery event received from Resend', [
                'name' => $event->getName(),
                'id' => $event->getId(),
                'payload' => $event->getPayload(),
            ]);
            
            // TODO: persist to DB 
            // e.g. update EmailLog set status = 'delivered' where message_id = $event->getId()
        } elseif ($event instanceof MailerEngagementEvent) {
            $this->logger->info('Email engagement event received from Resend', [
                'name' => $event->getName(),
                'id' => $event->getId(),
                'payload' => $event->getPayload(),
            ]);

            // TODO: persist to DB
            // e.g. update EmailLog set opened = true where message_id = $event->getId()
        } else {
            $this->logger->warning('Unknown mailer event type received from Resend', [
                'name' => $event->getName(),
                'id' => $event->getId(),
            ]);
        }
    }
}
