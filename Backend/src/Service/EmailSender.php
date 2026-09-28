<?php

declare(strict_types=1);

namespace App\Service;

use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;

final readonly class EmailSender
{
    private const FROM_ADDRESS = 'onboarding@resend.dev';
    private const FROM_NAME = 'AZ PULSE';

    public function __construct(
        private MailerInterface $mailer
    ) {
    }

    private function createTemplatedEmail(string $to, string $subject, string $template, array $context): TemplatedEmail
    {
        return (new TemplatedEmail())
            ->from(new Address(self::FROM_ADDRESS, self::FROM_NAME))
            ->to($to)
            ->subject($subject)
            ->htmlTemplate($template)
            ->context($context);
    }

    public function sendWelcome(string $toEmail, string $fullName): void
    {
        $email = $this->createTemplatedEmail(
            $toEmail,
            'Bienvenue sur AZ PULSE',
            'emails/welcome.html.twig',
            ['fullName' => $fullName]
        );

        $this->mailer->send($email);
    }

    public function sendPasswordReset(string $toEmail, string $resetUrl): void
    {
        $email = $this->createTemplatedEmail(
            $toEmail,
            'Réinitialisation de votre mot de passe',
            'emails/password_reset.html.twig',
            ['resetUrl' => $resetUrl]
        );

        $this->mailer->send($email);
    }

    public function sendAccessRequestPending(string $toEmail, string $fullName, string $uuid): void
    {
        $email = $this->createTemplatedEmail(
            $toEmail,
            'Votre demande d\'accès est en cours de traitement',
            'emails/access_request_pending.html.twig',
            [
                'fullName' => $fullName,
                'uuid' => $uuid,
                'statusUrl' => 'http://localhost:5173/request-status/' . $uuid
            ]
        );

        $this->mailer->send($email);
    }

    public function sendAccessRequestApproved(string $toEmail, string $fullName): void
    {
        $email = $this->createTemplatedEmail(
            $toEmail,
            'Votre demande d\'accès a été validée !',
            'emails/access_request_approved.html.twig',
            [
                'fullName' => $fullName,
                'loginUrl' => 'http://localhost:5173/login'
            ]
        );

        $this->mailer->send($email);
    }
}
