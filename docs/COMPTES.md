# Comptes de test — AZ PULSE

> ⚠️ **Ce document a été corrigé.** L'ancienne version annonçait un mot de passe
> unique `password123` et des adresses erronées (`superadmin@`, `crm@`,
> `formation@`…). Les identifiants ci-dessous sont ceux réellement créés en base
> par la commande `php bin/console app:reset-and-seed-requests`.

## Comptes actifs (prêts à l'emploi)

| Rôle | Nom | Email | Mot de passe |
| :--- | :--- | :--- | :--- |
| **Super Administrateur** | Directeur AZ CORP | `admin@azpulse.local` | `Admin@2026!` |
| **Administrateur / Direction** | Alexandre Zogo | `directeur.admin@azpulse.local` | `Password123!` |
| **Responsable CRM** | Marc Ewondo | `resp.crm@azpulse.local` | `password123` ⚠️ |
| **Responsable Formation** | Sarah Manga | `resp.formation@azpulse.local` | `Password123!` |
| **Responsable Workspace** | David Talla | `resp.workspace@azpulse.local` | `Password123!` |
| **Responsable IT** | Kevin Ndong | `resp.it@azpulse.local` | `Password123!` |
| **Apprenant** | Lucas Kamga | `apprenant@azpulse.local` | `Password123!` |
| **Parent / Tuteur** | Marie Kamga | `parent@azpulse.local` | `Password123!` |

## Comptes présents en base (mot de passe non documenté)

| Rôle | Email | Statut |
| :--- | :--- | :--- |
| Responsable Knowledge | `knowledgeresponsable@azpulse.com` | ACTIVE |
| Client (B2B) | `kymekeyss19@gmail.com` | ACTIVE |

> Ces deux comptes existent en base mais leur mot de passe n'est pas défini par
> les commandes de seed. Demander une réinitialisation via
> `POST /api/auth/forgot-password` si nécessaire.

## Recréer les comptes

```bash
cd Backend

# 1. Réinitialise le Super Admin (admin@azpulse.local / Admin@2026!)
#    et crée les 7 comptes candidats + leurs demandes d'accès (PENDING)
php bin/console app:reset-and-seed-requests

# 2. Initialise les rôles et les 38 permissions (13 rôles)
php bin/console app:init-rbac

# 3. Peuple la base de données pédagogiques (cours, notes, échéancier…)
php bin/console app:seed-dashboard-data
```

## Circuit d'activation des comptes candidats

Les 7 comptes métier sont créés en statut **`PENDING_APPROVAL`** avec une
**demande d'accès en attente**. Deux façons de les activer :

1. **Par l'API** — `POST /api/admin/access-requests/{uuid}/approve` avec le
   jeton du Super Admin (rôle à attribuer dans le corps : `roleCode`).
2. **Par l'interface** — Super Admin → `/superadmin/requests` → « Traiter ».

Une fois approuvés, le compte passe `ACTIVE` et peut se connecter avec le
mot de passe indiqué ci-dessus.

## Notes

- **Identifiants vérifiés** le 2026-10-06 via `POST /api/auth/login`
  (HTTP 200) contre le backend en cours d'exécution.
- ⚠️ **Anomalie CRM** : `resp.crm@azpulse.local` utilise
  `password123` (sans majuscule ni `!`), alors que la commande de seed
  définit `Password123!` pour tous les candidats. Le mot de passe de
  ce compte a manifestement été modifié manuellement après le seed.
  Les 6 autres candidats utilisent bien `Password123!`.
- Le Super Admin (`admin@azpulse.local`) est créé **directement actif**, sans
  demande d'accès : c'est le seul compte utilisable immédiatement après le seed.
- Les adresses de l'ancien document (`superadmin@`, `crm@`, `formation@`,
  `workspace@`, `it@`, `knowledge@`, `client@`, `apprenant1@`) **n'existent
  plus** en base. Ne pas les utiliser.
- Les mots de passe sont hachés côté serveur (`auto` hasher) ; ils ne sont
  jamais stockés en clair.
