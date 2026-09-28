# Resend Integration (Mailer + Webhooks)

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
