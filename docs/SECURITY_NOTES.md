# AZ PULSE - Analyse & Cartographie de la Sécurité de l'Authentification

> **Note interne de développement & soutenance (L3 Licence Ingénierie)**  
> Ce document résume l'audit de sécurité du système d'authentification et de gestion des accès du projet AZ PULSE.

---

## 1. Menaces et Attaques Contrées

### A. Attaques par Brute-Force & Bourrage d'Identifiants (Credential Stuffing)
* **Protection** : Intégration du composant `Symfony RateLimiter` (`sliding_window`).
* **Détails techniques** :
  * **Connexion (`/api/auth/login`)** : Limitée à **5 tentatives par minute** par couple `email + adresse IP client`.
  * **Inscription (`/api/auth/register`)** : Limitée à **5 requêtes par tranche de 5 minutes** par IP client.
  * **Comportement** : Déclenchement d'une exception HTTP `429 Too Many Requests` avec délai d'attente imposé dès dépassement.
* **Fichiers** : `Backend/config/packages/rate_limiter.yaml`, `Backend/src/Service/AuthService.php`.

---

### B. Cassage de Mots de Passe Hors-Ligne (Offline Cracking & Rainbow Tables)
* **Protection** : Hashage cryptographique fort avec sel aléatoire intégré via `UserPasswordHasherInterface`.
* **Détails techniques** :
  * Algorithme dynamique moderne (`'auto'` dans `security.yaml`), utilisant **Argon2id** ou **Bcrypt** avec coût de calcul élevé.
  * Aucun mot de passe en clair n'est stocké en base ni consigné dans les logs.
* **Fichiers** : `Backend/config/packages/security.yaml`, `Backend/src/Service/AuthService.php`.

---

### C. Fuite de la Base de Données des Jetons (Token Database Leak)
* **Protection** : **Stockage haché des jetons d'accès API**.
* **Détails techniques** :
  * L'entité `ApiToken` ne stocke jamais le jeton brut généré. Elle enregistre uniquement son empreinte SHA-256 (`tokenHash = hash('sha256', $plainToken)`).
  * **Impact de sécurité** : Même si un attaquant effectue une extraction SQL complète de la table `api_tokens`, les hashs SHA-256 sont inexploitables pour s'authentifier auprès de l'API.
* **Fichiers** : `Backend/src/Entity/ApiToken.php`, `Backend/src/Repository/ApiTokenRepository.php`.

---

### D. Prédiction et Rejeu de Jetons (Token Guessing & Replay Attacks)
* **Protection** : Générateur pseudo-aléatoire cryptographiquement sécurisé (CSPRNG).
* **Détails techniques** :
  * Génération via `bin2hex(random_bytes(32))`, garantissant **256 bits d'entropie** (chaîne hexadécimale de 64 caractères).
  * Durée de vie limitée : expiration stricte à **7 jours** (`expiresAt`), contrôlée lors de chaque requête dans la clause SQL (`t.expiresAt > :now`).
  * Révocation immédiate : la déconnexion (`/api/auth/logout`) supprime immédiatement le jeton de la base de données.
* **Fichiers** : `Backend/src/Service/AuthService.php`, `Backend/src/Security/ApiTokenAuthenticator.php`.

---

### E. Injections SQL (SQL Injection - SQLi)
* **Protection** : Couche d'abstraction Doctrine ORM 3.6 et requêtes paramétrées.
* **Détails techniques** :
  * Toutes les requêtes d'authentification passent par le QueryBuilder et des requêtes préparées avec typage strict des paramètres (`:hash`, `:now`, `:email`).
  * Aucune concaténation de variables utilisateurs dans du SQL brut.
* **Fichiers** : `Backend/src/Repository/ApiTokenRepository.php`, `Backend/src/Repository/UserRepository.php`.

---

### F. Attaques CSRF (Cross-Site Request Forgery)
* **Protection** : Architecture API 100% **Stateless**.
* **Détails techniques** :
  * La directive `stateless: true` dans `security.yaml` désactive les sessions côté serveur et les cookies implicites.
  * L'authentification requiert obligatoirement l'en-tête HTTP explicite `Authorization: Bearer <token>`. Les requêtes forgées par un navigateur depuis un site tiers malveillant ne peuvent pas injecter cet en-tête.
* **Fichiers** : `Backend/config/packages/security.yaml`, `Frontend/src/api/client.js`.

---

### G. Énumération des Comptes Utilisateurs (User Enumeration)
* **Protection** : Réponse unifiée et opaque lors des échecs d'authentification.
* **Détails techniques** :
  * Que l'adresse email n'existe pas ou que le mot de passe soit erroné, l'API renvoie le même message : `"Identifiants de connexion invalides."` (HTTP 401).
  * Un attaquant ne peut pas savoir si un compte existe à partir du comportement du formulaire de login.
* **Fichiers** : `Backend/src/Service/AuthService.php`.

---

### H. Contournement du Statut du Compte (Status & Privilege Bypass)
* **Protection** : Contrôle centralisé de l'état du compte via `UserChecker`.
* **Détails techniques** :
  * `UserChecker` intervient avant (`checkPreAuth`) et après (`checkPostAuth`) l'authentification.
  * Tout compte avec le statut `PENDING_APPROVAL`, `REJECTED`, `INACTIVE` ou `BLOCKED` est immédiatement refoulé, même si le mot de passe est correct.
  * L'`ApiTokenAuthenticator` vérifie également `$user->isActive()` à chaque appel d'API.
* **Fichiers** : `Backend/src/Security/UserChecker.php`, `Backend/src/Security/ApiTokenAuthenticator.php`.

---

## 2. Points de Vigilance & Recommandations (Pour la Soutenance & Production)

| Point de vigilance | Situation actuelle | Amélioration recommandée |
| :--- | :--- | :--- |
| **Stockage Token (XSS)** | Token stocké dans `localStorage` côté React | Utiliser des cookies `HttpOnly; Secure; SameSite=Strict` pour immuniser contre le vol de jeton par script XSS. |
| **Chiffrement réseau (MitM)** | HTTP en développement local (`http://localhost:8000`) | Obligation d'activer **HTTPS (TLS/SSL)** avec HSTS en production pour éviter l'interception du Bearer token sur le réseau. |
| **Complexité du mot de passe** | Longueur minimale de 8 caractères | Ajouter des contraintes de complexité (majuscule, minuscule, chiffre, symbole) via `PasswordStrength` de Symfony. |
| **Double Authentification (2FA)** | Non implémentée | Ajouter l'authentification TOTP (Google Authenticator / Authy) pour les comptes sensibles (`ADMIN`, `SUPER_ADMIN`). |

---

## 3. Traçabilité : le journal d'audit

### I. Absence de Preuve (Non-Répudiation)

* **Menace** : en cas de litige (« je n'ai jamais approuvé cette demande »,
  « ce n'est pas moi qui a modifié cette opportunité »), un état courant de la
  base ne prouve rien. Une table ne dit pas *qui* a fait *quoi*, ni *quand*, ni
  *depuis quelle machine*. Sans trace, le RBAC protège l'accès mais ne protège
  pas la responsabilité.
* **Protection** : un journal d'audit **nominatif, en écriture seule**, alimenté
  automatiquement par le bus d'événements métier.
* **Détails techniques** :
  * **Écriture seule, jamais de réécriture** : l'API `/api/audit` n'expose que
    `GET` et `GET /filters`. Il n'existe **aucun** `POST`, `PUT` ni `DELETE`.
    Une API d'écriture permettrait à un administrateur de fabriquer une trace
    accusée contre un collègue, ce qui serait pire que l'absence de trace :
    la trace deviendrait alors un outil de mensonge.
  * **Alimentation automatique** : `AuditSubscriber` est abonné aux **15
    événements** du domaine. Un événement publié produit sa ligne d'audit sans
    que l'appelant n'ait rien à faire. Conséquence directe : un événement
    métier ajouté plus tard est tracé *par construction*, et non *si quelqu'un
    y pense*.
  * **Complément explicite** : les gestes qui ne sont pas des faits métier
    (connexion, changement de rôle, dépôt de fichier) appellent directement
    `AuditLogService::record()`, parce qu'ils n'ont pas de sens dans le domaine.
  * **L'acteur est renseigné par l'émetteur, pas lu dans le `TokenStorage`**.
    En console (commandes, traitements de fond) il n'y a pas de requête HTTP, et
    l'on veut pouvoir tracer « action automatique » sans inventer un
    utilisateur. Pour l'approbation d'une demande d'accès, l'acteur est
    l'administrateur qui arbitre, **pas** le demandeur : confondre les deux
    attribuerait l'activation à celui qui l'a obtenue.
  * **La trace survit à la suppression du compte** : `audit_logs.actor_id` est
    en `ON DELETE SET NULL`, et l'email de l'auteur est dénormalisé dans
    `actor_email`. Supprimer un compte effacerait sinon les traces de ce qu'il a
    fait, c'est-à-dire exactement ce que la trace doit conserver.
  * **L'adresse IP** est relevée via `RequestStack` et `getClientIp()`, qui
    applique la configuration des proxies de confiance : l'application ne
    remonte donc pas une adresse spoofable de l'en-tête `X-Forwarded-For`.
  * **Une trace ne peut pas faire échouer l'action métier** : les deux
    subscribers journalisent puis avalent leurs exceptions. Un paiement encaissé
    reste encaissé si l'écriture de la ligne d'audit échoue. On préfère une
    trace en retard et visible dans les journaux applicatifs à une opération
    perdue.
  * **Lecture réservée à `audit.read`** : l'attribut est posé sur la *classe*
    du contrôleur (`#[IsGranted('audit.read')]`), donc une route ajoutée plus
    tard sans y penser n'ouvre pas un accès. La permission est accordée au Super
    Administrateur et à la Direction, et à eux seuls.

* **Événements couverts** :

  | Domaine | Événements |
  | :--- | :--- |
  | Identité & Accès | `access_request.submitted`, `access_request.approved`, `access_request.rejected`, `user.activated` |
  | CRM | `opportunity.stage_changed`, `opportunity.won` |
  | Workspace | `project.created`, `task.completed` |
  | Formation | `enrollment.created`, `grade.published`, `tuition.payment_received` |
  | Knowledge Hub | `document.published` |
  | Infrastructure | `incident.opened`, `incident.resolved` |
  | IA | `ai.recommendation_proposed` |

* **Fichiers** : `Backend/src/Entity/AuditLog.php`,
  `Backend/src/Service/AuditLogService.php`,
  `Backend/src/EventSubscriber/AuditSubscriber.php`,
  `Backend/src/Controller/AuditLogController.php`,
  `Backend/src/Event/DomainEvent.php`,
  `Backend/tests/Service/TraceSubscriberTest.php`.

---

## 4. Notifications : informer sans dérouter

* **Rôle** : une notification dit à une personne qu'une action l'attend. Elle
  n'est pas une trace et ne remplace pas l'e-mail : c'est un effet de bord du
  bus d'événements, jamais une information saisie à la main.
* **Destinataires** : c'est le seul endroit du code où l'on décide *qui* doit
  être prévenu. Un événement décrit un fait, pas ses destinataires ; les deux
  notions sont volontairement séparées (`Event` vs `NotificationSubscriber`).
* **Garde-fous** :
  * **On ne notifie jamais quelqu'un de sa propre action**, sans quoi la
    notification deviendrait du bruit pour celui qui vient d'agir.
  * **Déduplication des destinataires** : cibler `['SUPER_ADMIN', 'ADMIN']` ne
    produit pas deux notifications pour qui porte les deux rôles.
  * **Un échec de notification ne fait pas échouer l'action métier** (même
    règle que pour l'audit).
* **Comptes en attente exclus** : les destinataires sont recherchés parmi les
  comptes `ACTIVE` uniquement. Laisser croire à un demandeur qu'une action est
  attendue de lui, alors que son compte n'est pas encore activé, n'a pas de
  sens.
* **Recommandations IA** : `ai.recommendation_proposed` notifie le responsable
  avec la mention explicite qu'**aucune action n'est exécutée**. La validation
  humaine est une règle structurante du projet ; elle doit être visible là où la
  proposition apparaît, pas seulement dans la documentation.
* **Fichiers** : `Backend/src/Entity/Notification.php`,
  `Backend/src/Service/NotificationService.php`,
  `Backend/src/EventSubscriber/NotificationSubscriber.php`,
  `Backend/src/Controller/NotificationController.php`.

---




1. Identifiants du Super Administrateur

Super Administrateur	
admin@azpulse.local	Admin@2026!	ACTIF

2. Demandes d'accès créées en base de données

Rôle ciblé	Email candidat	Nom & Prénom	Domaine demandé	Mot de passe provisoire




Email : admin@azpulse.local       Mot de passe : Admin@2026!


GLPI Installation

Étape 6
L'installation est terminée
Les identifiants et mots de passe par défaut sont :


glpi/glpi pour le compte administrateur
tech/tech pour le compte technicien
normal/normal pour le compte normal
post-only/postonly pour le compte postonly
Vous pouvez supprimer ou modifier ces comptes ainsi que les données initiales.