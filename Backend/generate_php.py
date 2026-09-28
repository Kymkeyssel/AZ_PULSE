import os

# Ensure directories exist
dirs = [
    r'h:\PROJETS\VS_Projects\L3_LICENCE_ING\AZ_PULSE\backend\src\Service',
    r'h:\PROJETS\VS_Projects\L3_LICENCE_ING\AZ_PULSE\backend\src\Webhook',
    r'h:\PROJETS\VS_Projects\L3_LICENCE_ING\AZ_PULSE\backend\src\Command',
    r'h:\PROJETS\VS_Projects\L3_LICENCE_ING\AZ_PULSE\backend\templates\emails',
    r'h:\PROJETS\VS_Projects\L3_LICENCE_ING\AZ_PULSE\docs'
]
for d in dirs:
    os.makedirs(d, exist_ok=True)

# 1. EmailSender.php
email_sender = """<?php

declare(strict_types=1);

namespace App\Service;

use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;

final readonly class EmailSender
{
    private const FROM_ADDRESS = 'no-reply@azpulse.local';
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
            'Votre demande d\\'accès est en cours de traitement',
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
            'Votre demande d\\'accès a été validée !',
            'emails/access_request_approved.html.twig',
            [
                'fullName' => $fullName,
                'loginUrl' => 'http://localhost:5173/login'
            ]
        );

        $this->mailer->send($email);
    }
}
"""

with open(r'h:\PROJETS\VS_Projects\L3_LICENCE_ING\AZ_PULSE\backend\src\Service\EmailSender.php', 'w') as f:
    f.write(email_sender)

# 2. ResendWebhookConsumer.php
webhook_consumer = """<?php

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
"""

with open(r'h:\PROJETS\VS_Projects\L3_LICENCE_ING\AZ_PULSE\backend\src\Webhook\ResendWebhookConsumer.php', 'w') as f:
    f.write(webhook_consumer)

# 3. EmailTestCommand.php
test_command = """<?php

declare(strict_types=1);

namespace App\Command;

use App\Service\EmailSender;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(
    name: 'app:email:test',
    description: 'Envoie un email de bienvenue pour tester la configuration Resend.'
)]
final class EmailTestCommand extends Command
{
    public function __construct(
        private readonly EmailSender $emailSender
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addArgument('to', InputArgument::REQUIRED, 'L\\'adresse email de destination');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $to = $input->getArgument('to');
        
        $output->writeln("Envoi de l'email à $to...");
        
        $this->emailSender->sendWelcome($to, 'Utilisateur Test');
        
        $output->writeln("<info>Email envoyé (mis en queue) !</info>");

        return Command::SUCCESS;
    }
}
"""

with open(r'h:\PROJETS\VS_Projects\L3_LICENCE_ING\AZ_PULSE\backend\src\Command\EmailTestCommand.php', 'w') as f:
    f.write(test_command)

# 4. Twig templates
base_twig = """<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f9; padding: 20px; }
        .container { background-color: #ffffff; padding: 30px; border-radius: 8px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { border-bottom: 2px solid #0056b3; padding-bottom: 20px; margin-bottom: 20px; text-align: center; }
        .footer { margin-top: 30px; font-size: 12px; color: #777; text-align: center; }
        .btn { display: inline-block; padding: 10px 20px; background-color: #0056b3; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="color: #0056b3; margin: 0;">AZ PULSE</h1>
        </div>
        <div class="content">
            {% block body %}{% endblock %}
        </div>
        <div class="footer">
            &copy; {{ 'now'|date('Y') }} AZ PULSE. Tous droits réservés.
        </div>
    </div>
</body>
</html>
"""

welcome_twig = """{% extends 'emails/base.html.twig' %}

{% block body %}
    <h2>Bienvenue {{ fullName }} !</h2>
    <p>Nous sommes ravis de vous compter parmi nous sur AZ PULSE.</p>
    <p>Vous pouvez vous connecter à votre espace dès maintenant pour découvrir nos fonctionnalités.</p>
    <p style="text-align: center; margin-top: 30px;">
        <a href="http://localhost:5173/login" class="btn">Accéder à mon espace</a>
    </p>
{% endblock %}
"""

password_reset_twig = """{% extends 'emails/base.html.twig' %}

{% block body %}
    <h2>Réinitialisation de mot de passe</h2>
    <p>Vous avez demandé à réinitialiser votre mot de passe sur AZ PULSE.</p>
    <p>Veuillez cliquer sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
    <p style="text-align: center; margin-top: 30px;">
        <a href="{{ resetUrl }}" class="btn">Réinitialiser mon mot de passe</a>
    </p>
    <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>
{% endblock %}
"""

access_pending_twig = """{% extends 'emails/base.html.twig' %}

{% block body %}
    <h2>Bonjour {{ fullName }},</h2>
    <p>Votre demande de création de compte a bien été reçue par notre administration.</p>
    <p>Elle est actuellement <strong>en cours de traitement</strong>.</p>
    <p>Votre référence unique de suivi est la suivante :</p>
    <div style="background-color: #f0f4f8; padding: 15px; border-radius: 5px; font-family: monospace; text-align: center; font-size: 18px; letter-spacing: 1px;">
        {{ uuid }}
    </div>
    <p style="text-align: center; margin-top: 30px;">
        <a href="{{ statusUrl }}" class="btn">Suivre ma demande</a>
    </p>
    <p>Veuillez conserver précieusement cette référence, elle est nécessaire pour vérifier l'état de votre demande.</p>
{% endblock %}
"""

access_approved_twig = """{% extends 'emails/base.html.twig' %}

{% block body %}
    <h2>Félicitations {{ fullName }} !</h2>
    <p>Votre demande de compte AZ PULSE a été <strong>validée</strong> par notre équipe d'administration.</p>
    <p>Vous avez désormais accès à l'espace correspondant à votre profil.</p>
    <p style="text-align: center; margin-top: 30px;">
        <a href="{{ loginUrl }}" class="btn">Me connecter</a>
    </p>
{% endblock %}
"""

with open(r'h:\PROJETS\VS_Projects\L3_LICENCE_ING\AZ_PULSE\backend\templates\emails\base.html.twig', 'w', encoding='utf-8') as f: f.write(base_twig)
with open(r'h:\PROJETS\VS_Projects\L3_LICENCE_ING\AZ_PULSE\backend\templates\emails\welcome.html.twig', 'w', encoding='utf-8') as f: f.write(welcome_twig)
with open(r'h:\PROJETS\VS_Projects\L3_LICENCE_ING\AZ_PULSE\backend\templates\emails\password_reset.html.twig', 'w', encoding='utf-8') as f: f.write(password_reset_twig)
with open(r'h:\PROJETS\VS_Projects\L3_LICENCE_ING\AZ_PULSE\backend\templates\emails\access_request_pending.html.twig', 'w', encoding='utf-8') as f: f.write(access_pending_twig)
with open(r'h:\PROJETS\VS_Projects\L3_LICENCE_ING\AZ_PULSE\backend\templates\emails\access_request_approved.html.twig', 'w', encoding='utf-8') as f: f.write(access_approved_twig)

# 5. Documentation
docs_md = """# Resend Integration (Mailer + Webhooks)

Cette documentation explique comment utiliser le service d'envoi d'emails via Resend dans le projet AZ PULSE.

## Prérequis

1. Récupérer une clé API sur [Resend API Keys](https://resend.com/api-keys)
2. Vérifier votre domaine d'envoi sur [Resend Domains](https://resend.com/domains)
3. Mettre à jour `.env.local` avec votre clé :
   ```env
   MAILER_DSN=resend+api://re_123456789@default
   MAILER_RESEND_SECRET=mon_secret_webhook_resend
   ```

## Configuration du Webhook

Le webhook permet de recevoir les événements (delivered, bounced, clicked, etc.). Resend n'accepte que des URL HTTPS.

1. Installez `ngrok` : `npm install -g ngrok` ou téléchargez-le sur https://ngrok.com/
2. Exposez votre port local : `ngrok http 8000` (remplacez 8000 par le port de votre serveur Symfony)
3. Allez sur [Resend Webhooks](https://resend.com/webhooks) et ajoutez un webhook :
   - URL : `https://<votre-id-ngrok>.ngrok-free.app/webhook/mailer_resend`
   - Événements : Sélectionnez tout (ou spécifiquement email.delivered, email.bounced, etc.)
4. Récupérez le "Signing Secret" fourni par Resend et mettez-le dans `MAILER_RESEND_SECRET` dans `.env.local`.

## Envoi d'emails

L'envoi est géré de manière asynchrone via Symfony Messenger.

Pour que les emails partent réellement, vous devez faire tourner le worker :
```bash
php bin/console messenger:consume async -vv
```

### En production (Supervisor)
Un exemple de config Supervisor :
```ini
[program:messenger-consume]
command=php /chemin/vers/projet/bin/console messenger:consume async --time-limit=3600
user=www-data
numprocs=2
autostart=true
autorestart=true
process_name=%(program_name)s_%(process_num)02d
```

## Tester le flux complet

1. Videz le cache : `php bin/console cache:clear`
2. Lancez le setup des queues (crée la table si besoin) : `php bin/console messenger:setup-transports`
3. Dans un terminal, lancez : `php bin/console messenger:consume async -vv`
4. Dans un autre terminal, envoyez un email test : `php bin/console app:email:test moi@domaine.com`
"""

with open(r'h:\PROJETS\VS_Projects\L3_LICENCE_ING\AZ_PULSE\docs\RESEND.md', 'w', encoding='utf-8') as f:
    f.write(docs_md)
