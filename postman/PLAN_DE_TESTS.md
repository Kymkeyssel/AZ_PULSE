# Plan d’exécution Postman — AZ PULSE

Collection : `postman/AZPULSE.postman_collection.json`
Environnement : `postman/AZPULSE.postman_environment.json`
Fixtures : `postman/fixtures/document-test.txt`, `postman/fixtures/justificatif-test.txt`

---

## 1. Prérequis
- Backend Symfony : `http://localhost:8000/api` (port 8000)
- FastAPI IA : `http://localhost:8001` (port 8001)
- Frontend React : `http://localhost:5173` (port 5173)
- Base de données seedée : `cd Backend && php bin/console app:seed-dashboard-data`
- n8n pour le chatbot : `http://localhost:5678` (optionnel, UI uniquement)

---

## 2. Comptes de test (identifiants exacts)

| Rôle | Email | Mot de passe | Variable d'env |
|---|---|---|---|
| SUPER_ADMIN | `admin@azpulse.local` | Admin@2026!`` | `accountSuperAdmin` / `pwdSuperAdmin` |
| ADMIN / Direction | `directeur.admin@azpulse.local` | `Password123!` | `accountAdmin` / `pwdAdmin` |
| RESPONSABLE_CRM | `resp.crm@azpulse.local` | `password123` | `accountCrm` / `pwdCrm` |
| RESPONSABLE_WORKSPACE | `resp.workspace@azpulse.local` | `Password123!` | `accountWorkspace` / `pwdWorkspace` |
| RESPONSABLE_IT | `resp.it@azpulse.local` | `Password123!` | `accountIt` / `pwdIt` |
| RESPONSABLE_FORMATION | `resp.formation@azpulse.local` | `Password123!` | `accountFormation` / `pwdFormation` |
| APPRENANT | `apprenant@azpulse.local` | `Password123!` | `accountApprenant` / `pwdApprenant` |
| PARENT | `parent@azpulse.local` | `Password123!` | `accountParent` / `pwdParent` |

> ⚠️ `docs/COMPTES.md` est **obsolète** — les mots de passe `password123` annoncés ne correspondent pas à la base actuelle.

---

## 3. Ordre d’exécution des dossiers

| # | Dossier | Description | Jeton utilisé | Capture d’écran frontend suggérée |
|---|---|---|---|---|
| 00 | **Amorçage** | Connexion Super Admin, inventaire GLPI, diagnostics | `tokenSuperAdmin` (auto) | `/superadmin` |
| 01 | **Authentification & IAM** | Inscriptions, connexions multi-rôles, workflow accès, RBAC | `tokenCrm`, `tokenWorkspace`, `tokenIt`, `tokenFormation`, `tokenApprenant`, `tokenParent`, `tokenAdmin` | `/login`, `/superadmin`, `/collaborateur/crm`, `/collaborateur/workspace`, `/collaborateur/it`, `/collaborateur/formation`, `/apprenant`, `/parent` |
| 02 | **CRM** | Prospects, opportunités, relances, pipeline, stats | `tokenCrm` | `/collaborateur/crm`, `/collaborateur/crm/opportunities`, `/collaborateur/crm/reminders` |
| 03 | **Workspace** | Projets, tâches, diagnostic `TaskRepository` manquant | `token` (Super Admin) | `/collaborateur/workspace/projects`, `/collaborateur/workspace/tasks` |
| 04 | **Knowledge Hub** | Upload, publication, téléchargement, tags, périmètre | `token` (Super Admin) | `/superadmin/knowledge`, `/collaborateur/knowledge` |
| 05 | **Infrastructure & IT** | Inventaire GLPI, détails matériel, incidents | `token` (Super Admin) | `/superadmin` (bloc « Santé du Système »), `/collaborateur/infrastructure` |
| 06 | **Formation — Académie** | Dashboard apprenant, cours, planning, notes, upload, dashboard parent (stub) | `tokenApprenant`, `tokenParent` | `/apprenant`, `/apprenant/planning`, `/apprenant/evaluations`, `/apprenant/formations`, `/apprenant/paiements`, `/apprenant/documents`, `/parent` |
| 07 | **Formation — Paiements** | Dépôt justificatif, file, validation (idempotente), refus, périmètres | `tokenApprenant`, `token` (Responsable Formation) | `/apprenant/paiements` |
| 08 | **Dashboards** | Super Admin, Admin, CRM, Workspace (500), Apprenant, Parent (stub), Responsable | `token`, `tokenCrm`, `tokenApprenant`, `tokenParent` | `/superadmin`, `/admin`, `/collaborateur/crm`, `/collaborateur/workspace`, `/apprenant`, `/parent`, `/collaborateur` |
| 09 | **Notifications** | Compteur cloche, liste, filtre non lues, lecture (idempotente), tout marquer lu, périmètre | `token`, `tokenApprenant` | Composant cloche (header), page `/notifications` |
| 10 | **AI Workspace** | Healthcheck FastAPI, analyse projet, défaut, périmètre, audit IA | `token`, `tokenApprenant` | `/collaborateur/ai-workspace` (bouton « Analyser ») |
| 11 | **Analytics** | KPIs (500 — `TaskRepository` manquant), périmètre CRM (500), périmètre IT (403) | `token`, `tokenCrm`, `tokenIt` | `/superadmin/analytics`, `/collaborateur/analytics` |
| 12 | **Sécurité — tests négatifs** | Sans jeton, jeton invalide, apprenant sur CRM, écriture CRM par apprenant, admin roles (403), audit, filtres, date invalide, audit réservé, POST audit (405), notification tiers (404), IT ne peut pas écrire Knowledge | `tokenApprenant`, `tokenParent`, `tokenIt` | N/A (tests d’intrusion) |

---

## 4. Variables dynamiques (chaînage)

Les tests définissent ces variables pour les requêtes suivantes :

| Variable | Origine | Utilisée par |
|---|---|---|
| `suffix` | Pre-request racine (base32 aléatoire) | Toutes les créations (emails, références) |
| `token` / `tokenSuperAdmin` | 00.1 | Auth racine, dossiers 03, 04, 05, 08, 10, 11, 12 |
| `tokenCrm` | 01.3 | 02.*, 08.3, 11.3, 12.3 |
| `tokenWorkspace` | 01.4 | (réservé) |
| `tokenIt` | 01.5 | 05.*, 11.4, 12.12 |
| `tokenFormation` | 01.6 | (réservé) |
| `tokenApprenant` | 01.7 | 06.*, 07.1, 08.5, 09.8, 10.4, 11.2, 12.3, 12.4, 12.5, 12.9, 12.11 |
| `tokenParent` | 01.8 | 06.6, 07.8, 12.8 |
| `tokenAdmin` | 01.9 | (réservé) |
| `accessRequestUuid` | 01.1 | 01.2, 01.11, 01.12 |
| `accessRequestId` | 01.11 | 01.12 (approve) |
| `candidateEmail` | 01.1 | 01.11, 01.15, 01.16 |
| `accessRequestUuidReject` | 01.13 | 01.14, 01.15 |
| `candidateEmailReject` | 01.13 | (info) |
| `roleCrmId` | 01.20 | 01.21 (restore) |
| `roleCrmOriginal` | 01.20 (JSON string) | 01.21 (restore) |
| `roleSuperAdminId` | 01.20 | 01.22 |
| `customerId` | 02.1 | 02.4 |
| `opportunityId` | 02.4 | 02.12 |
| `reminderId` | 02.7 | 02.9, 02.10, 02.11, 02.15 |
| `projectId` | 02.13 / 03.1 | 03.*, 10.1 |
| `taskId` | 03.4 | 03.5, 03.6 |
| `documentId` | 04.1 | 04.4, 04.5, 04.6 |
| `tagId` | 04.9 | (info) |
| `paymentId` | 07.1 | 07.2, 07.3, 07.4 |
| `paymentIdReject` | 07.5 | 07.6 |
| `notificationId` | 09.2 | 09.4, 09.5, 09.7 |
| `incidentId` | 05.3 | 05.4, 05.5, 05.6 |
| `computerId` | 05.1 | 05.2 |

---

## 5. Bugs connus / Limitations documentées

| Module | Endpoint | Symptôme | Cause | Statut |
|---|---|---|---|---|
| Analytics | `GET /api/analytics/kpis` | 500 | `TaskRepository` manquante | À corriger (créer le fichier) |
| Workspace | `GET /api/dashboard/workspace` | 500 | Même cause | À corriger |
| Workspace | `GET /api/workspace/projects/{id}/tasks` | 500 | Même cause | À corriger |
| Workspace | `PATCH /api/workspace/tasks/{id}` | 500 | Même cause | À corriger |
| Dashboard Parent | `GET /api/dashboard/parent` | Renvoie stub `{enrolledChildren:1,balance:0}` | Collision de route avec `DashboardController::parentStats()` | Supprimer la route dupliquée |
| Dashboard Apprenant (agrégé) | `GET /api/dashboard/apprenant` | Valeurs codées en dur si `DashboardController` gagne | Même collision | Supprimer la route dupliquée |
| Paiements | Upload justificatif | Pas d’endpoint de téléchargement du fichier | `documentUrl` non servie | Interface doit reconstruire le chemin |
| Paiements | OCR | Non implémenté | Fausses confiances affichées | À implémenter |
| Knowledge Hub | Upload support | Rattache au 1er cours (`findOneBy([])`) | Pas de `course_id` dans le corps | À corriger |
| Knowledge Hub | `knowledge.write` | Réservé à Super Admin + Admin | Responsables IT/CRM/Workspace n’ont pas le droit | Comportement voulu |

---

## 6. Assertions clés par dossier

| Dossier | Test clé | Résultat attendu |
|---|---|---|
| 00.1 | `user.permissions.length` | `38` |
| 01.3 | `user.primaryRole` | `RESPONSABLE_CRM` |
| 01.19 | `roles.length` / `permissions.length` | `13` / `38` |
| 02.1 | `data.id` (entier) | Créé |
| 02.12 | Prospect → Client, projet créé | `stage: WON`, `data.projectId` |
| 03.1 | Projet créé | `201`, `data.id` |
| 03.3 | `PATCH /tasks/{id}` | **500** (bug connu) |
| 04.1 | Upload document | `201`, `status: DRAFT` |
| 04.4 | Publication | `200`, `status: PUBLISHED` |
| 05.1 | Inventaire GLPI | `200`, `data.length > 0` |
| 06.1 | Dashboard apprenant | 6 blocs présents |
| 07.3 | Validation paiement | `VALIDATED`, `paidTranches++`, solde décrémenté |
| 07.4 | Idempotence validation | Deuxième appel = `200`, même état |
| 08.1 | Super Admin dashboard | Volumétrie + RBAC exposé |
| 09.4 | Idempotence lecture | `readAt` inchangé |
| 10.1 | Analyse IA | `status: completed`, `response` non vide |
| 11.1 | KPIs | **500** (bug), `TaskRepository` dans le corps |
| 12.3 | Apprenant → CRM | `403 Access Denied` |
| 12.11 | Notification tiers | `404` (pas `403`) |

---

## 7. Lancement rapide (CLI Newman)

```bash
cd postman
npm install -g newman          # si absent
newman run AZPULSE.postman_collection.json \
  -e AZPULSE.postman_environment.json \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export ../newman-report.html
```

Le rapport HTML liste chaque requête avec statut ✅/❌, temps de réponse, et sorties `console.log`.

---

## 8. Checklist de validation manuelle (captures)

Pour chaque dossier cocher : ▢ collection verte ▢ capture frontend correspondante ▢ pas de 500 inattendu.

| Dossier | Route frontend à capturer | ✅ |
|---|---|---|
| 00 | `/superadmin` | ▢ |
| 01 | `/login`, puis chaque rôle vers son tableau de bord | ▢ |
| 02 | `/collaborateur/crm` (liste prospects + pipeline Kanban) | ▢ |
| 03 | `/collaborateur/workspace/projects` + détail tâche | ▢ |
| 04 | `/superadmin/knowledge` (upload → publier → télécharger) | ▢ |
| 05 | `/superadmin` (bloc inventaire) + `/collaborateur/infrastructure` | ▢ |
| 06 | `/apprenant` (6 onglets) + `/parent` (stub visible) | ▢ |
| 07 | `/apprenant/paiements` (dépôt → validation → refus) | ▢ |
| 08 | 7 dashboards (noter Workspace 500, Parent stub) | ▢ |
| 09 | Cloche header + page `/notifications` (lecture, tout marquer) | ▢ |
| 10 | `/collaborateur/ai-workspace` (analyse → attente 9 s → résultat) | ▢ |
| 11 | `/superadmin/analytics` (500), `/collaborateur/analytics` (403 IT) | ▢ |
| 12 | N/A (tests API) | ▢ |

---

## 9. Nettoyage post-exécution

- Les données créées portent le `suffix` unique → pas de collision entre runs.
- Les paiements validés incrémentent `paidTranches` → relancer `app:seed-dashboard-data` si besoin de réinitialiser.
- Les demandes d’accès approuvées créent des utilisateurs `ACTIVE` ; les refusées mettent `REJECTED`.
- Les incidents résolus restent en base ; supprimer manuellement si besoin.

---

*Généré le 2026-10-05 — Collection AZ PULSE v1.0*