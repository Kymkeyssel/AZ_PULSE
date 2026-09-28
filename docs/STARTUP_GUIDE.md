# Guide de Démarrage et Configuration (AZ PULSE)

Ce document centralise toutes les commandes et étapes nécessaires pour démarrer correctement le projet AZ PULSE (Frontend + Backend), configurer le système d'emails (Resend), et s'assurer que toutes les files d'attentes fonctionnent.

---

## 1. Démarrage des serveurs principaux

Vous devez lancer le Backend (Symfony) et le Frontend (React/Vite) dans deux terminaux séparés.

### Terminal 1 : Backend Symfony
```powershell
cd h:\PROJETS\VS_Projects\L3_LICENCE_ING\AZ_PULSE\backend
php bin/console cache:clear
php bin/console messenger:setup-transports
symfony server:start -d
```
*(Le paramètre `-d` lance le serveur en arrière-plan. Il tournera sur `http://localhost:8000` par défaut).*

### Terminal 2 : Frontend React (Vite)
```powershell
cd h:\PROJETS\VS_Projects\L3_LICENCE_ING\AZ_PULSE\frontend
npm run dev
```
*(Le frontend tournera généralement sur `http://localhost:5173`).*

---

## 2. Configuration des Clés API Resend (Emails)

OUI, il te faut **absolument** une clé API Resend ! Sans elle, aucun email ne partira. 
Voici comment remplacer les `CHANGE_ME` dans ton fichier `backend/.env` ou `backend/.env.local` :

1. **Créer un compte et obtenir la clé API :**
   - Rends-toi sur [Resend API Keys](https://resend.com/api-keys).
   - Crée une clé API. Elle commence généralement par `re_...` (ex: `re_123456789abcde`).
   - Remplace le premier `CHANGE_ME` dans le fichier `.env` :
     ```env
     # AVANT:
     MAILER_DSN=resend+api://CHANGE_ME@default
     # APRES:
     MAILER_DSN=resend+api://re_123456789abcde@default
     ```

2. **Configuration du Webhook (pour les accusés de réception) :**
   - Le Webhook de Resend permet d'informer Symfony quand un email est "Delivered", "Opened", etc.
   - Les webhooks nécessitent une URL Internet publique (en HTTPS). En développement local, on utilise `ngrok`.

---

## 3. Configuration et lancement de Ngrok (Webhooks en Local)

Puisque la commande `ngrok` n'était pas reconnue sur ta machine, il faut d'abord l'installer.

### Installation de Ngrok via NPM
Ouvre un terminal (en administrateur si nécessaire) et installe ngrok globalement :
```powershell
npm install -g ngrok
```
*(Alternative : Tu peux aussi le télécharger depuis [ngrok.com](https://ngrok.com/download) et ajouter l'exécutable à ton PATH Windows).*

### Lancement du tunnel HTTPS
Dans un nouveau terminal :
```powershell
ngrok http 8000
```
Cela va générer un écran noir avec une ligne "Forwarding". Copie l'URL HTTPS qui s'affiche (ex: `https://abcd-123-45-67-89.ngrok-free.app`).

### Ajout du Webhook sur Resend
1. Rends-toi sur [Resend Webhooks](https://resend.com/webhooks).
2. Ajoute un webhook avec comme "Endpoint URL" :
   `https://TON_URL_NGROK.ngrok-free.app/webhook/mailer_resend`
3. Coche les événements souhaités (ex: `email.delivered`, `email.bounced`).
4. **Récupère le "Signing Secret"** (Secret de signature) que Resend te donnera à la création.
5. Remplace le second `CHANGE_ME` dans ton `.env` :
   ```env
   # APRES:
   MAILER_RESEND_SECRET=whsec_mon_secret_donne_par_resend
   ```

---

## 4. Démarrage du "Worker" Messenger (Indispensable)

Les envois d'emails sont **asynchrones**. Cela signifie que Symfony les met dans une base de données (file d'attente) pour ne pas bloquer l'utilisateur.
Pour dépiler cette file et envoyer réellement les mails, il faut lancer le Worker.

### Terminal 3 : Le Worker Messenger
```powershell
cd h:\PROJETS\VS_Projects\L3_LICENCE_ING\AZ_PULSE\backend
php bin/console messenger:consume async -vv
```
**Important :** Ce terminal doit rester ouvert tant que tu développes. C'est lui qui attrape les emails et les expédie à Resend.

---

## Résumé : Les 4 processus à faire tourner

Pour avoir l'environnement de dev 100% fonctionnel :
1. `symfony server:start` (API Backend)
2. `npm run dev` (Frontend)
3. `ngrok http 8000` (Tunnel HTTPS pour les Webhooks)
4. `php bin/console messenger:consume async -vv` (Worker pour envoyer les emails)
