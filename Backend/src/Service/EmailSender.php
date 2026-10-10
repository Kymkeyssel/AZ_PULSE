<?php

declare(strict_types=1);

namespace App\Service;

use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use App\Entity\Customer;

final readonly class EmailSender
{
    private const FROM_NAME = 'AZ PULSE';

    public function __construct(
        private MailerInterface $mailer,
        private string $mailerFromAddress,
        private string $frontendAppUrl
    ) {
    }

    private function createTemplatedEmail(string $to, string $subject, string $template, array $context): TemplatedEmail
    {
        return (new TemplatedEmail())
            ->from(new Address($this->mailerFromAddress, self::FROM_NAME))
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
                'activationUrl' => 'http://localhost:5173/activate'
            ]
        );

        $this->mailer->send($email);
    }

    public function sendAccessRequestRejected(string $toEmail, string $fullName, string $reason): void
    {
        $email = $this->createTemplatedEmail(
            $toEmail,
            'Votre demande d\'accès a été refusée',
            'emails/access_request_rejected.html.twig',
            [
                'fullName' => $fullName,
                'reason' => $reason
            ]
        );

        $this->mailer->send($email);
    }

    public function sendPasswordResetEmail(string $toEmail, string $resetToken): void
    {
        $email = $this->createTemplatedEmail(
            $toEmail,
            'Réinitialisation de votre mot de passe AZ PULSE',
            'emails/forgot_password.html.twig',
            [
                'resetUrl' => rtrim($this->frontendAppUrl, '/') . '/reset-password?token=' . $resetToken
            ]
        );

        $this->mailer->send($email);
    }

    public function sendCrmJourneyUpdate(Customer $customer, string $opportunityTitle, string $milestone, string $details): void
    {
        $toEmail = trim((string) $customer->getEmail());
        if (!filter_var($toEmail, FILTER_VALIDATE_EMAIL)) return;

        $email = $this->createTemplatedEmail(
            $toEmail,
            sprintf('AZ PULSE · Suivi de votre dossier : %s', $milestone),
            'emails/crm_journey_update.html.twig',
            [
                'customerName' => $customer->getName(),
                'opportunityTitle' => $opportunityTitle,
                'milestone' => $milestone,
                'details' => $details,
            ]
        );
        $this->mailer->send($email);
    }
}
