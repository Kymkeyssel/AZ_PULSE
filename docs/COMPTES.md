# Comptes Actifs - AZ PULSE

Ce document liste les comptes principaux générés par défaut via les scripts de fixtures (`app:reset-and-seed-requests`). 
Ces comptes vous permettent de tester les différentes interfaces et rôles de l'application AZ PULSE.

## 1. Direction Générale (Super Administrateur)

Accès total à tous les modules, configurations et validations de requêtes.

*   **Rôle :** Super Admin (`SUPER_ADMIN`)
*   **Email :** `admin@azpulse.local`
*   **Mot de passe :** `Admin@2026!`

---

## 2. Responsables de Modules (Admins Sectoriels)

Ces comptes gèrent les modules spécifiques de l'entreprise.

**Mot de passe commun :** `Password123!`

| Rôle / Domaine | Email |
| :--- | :--- |
| **Directeur Général Adjoint** | `directeur.admin@azpulse.local` |
| **Responsable Formation (Formateur)** | `resp.formation@azpulse.local` |
| **Responsable Workspace** | `resp.workspace@azpulse.local` |

---

## 2 bis. Collaborateur (rôle générique multi-vocations)

Un collaborateur porte **un seul rôle** (`COLLABORATEUR`) complété par une
**spécialisation** choisie par l'administrateur lors de la validation de la
demande. La spécialisation sert à deux choses : elle détermine **l'interface**
affichée, et elle **pré-coche les droits** suggérés — que l'administrateur peut
ajuster avant de confirmer.

| Spécialisation | Interface | Droits accordés en plus du socle |
| :--- | :--- | :--- |
| **Commercial** | `/collaborateur/commercial` | `crm.create`, `crm.update`, `crm.delete` |
| **Formateur** | `/collaborateur/formateur` | `formation.create`, `formation.update` |
| **Support IT** | `/collaborateur/support-it` | `it.read`, `it.manage`, `workspace.update` — et `crm.read` est **retiré** |
| **Communication** | `/collaborateur/communication` | `knowledge.create`, `knowledge.update`, `knowledge.delete` |
| **Générique** | `/collaborateur` | aucun droit supplémentaire |

**Socle commun** hérité du rôle : `crm.read`, `workspace.read`,
`knowledge.read`, `analytics.read`, `ai.read`, `formation.read`.

Pour créer un collaborateur : connectez-vous en Super Admin →
*Administration → Demandes d'accès → Valider* → choisissez le rôle
`Collaborateur`, puis une spécialisation, ajustez les droits, confirmez.

### Première connexion

Le mot de passe saisi à l'inscription est **jeté au hasard** (protection contre
le rejeu d'un mot de passe choisi en clair sur un formulaire public). Le
collaborateur doit donc passer une fois par *Activer mon compte* avec le mot de
passe de son choix, puis se connecter normalement.

### Écrans livrés pour la spécialisation Commercial

| Écran | Route | Contenu |
| :--- | :--- | :--- |
| Accueil | `/collaborateur` | KPI réels : affaires ouvertes, montant pondéré, relances en retard / aujourd'hui / à venir |
| Pipeline | `/collaborateur/crm` | Tableau kanban (Prospection → Négociation), glisser-déposer, échéance de closing |
| Relances | `/collaborateur/relances` | Liste triée par urgence, clôture en un clic, creation / modification |
| Clients | `/collaborateur/clients` | Répertoire, recherche, création |

Les autres spécialisations renvoient pour l'instant sur un écran
« module en cours de livraison » : le bloc adaptatif est en place, il reste à
coder les contenus propres à chaque métier.

### Périmètre : ce qu'un collaborateur ne voit pas

- **Le portefeuille des collègues** est réservé à `crm.manage` (encadrement).
  Un commercial qui demande la vue « tout le portefeuille » reste donc sur la
  sienne — c'est volontaire, pas un bug.
- **Les relances des autres** lui sont invisibles, et il ne peut ni les traiter
  ni les supprimer. Un encadrant, lui, voit et répartit l'ensemble des relances.

---

## 3. Utilisateurs Finaux (Module Formation)

Comptes standards pour tester l'interface éducative.

**Mot de passe commun :** `NouvoPass2026!`

| Profil | Email |
| :--- | :--- |
| **Apprenant (Étudiant)** | `boris.nnanga@academie-az.cm` |
| **Parent (Tuteur Légal)** | `parent@azpulse.local` |
| **Parent (Tuteur Légal)** | `aminata.diallo@gmail.com` |

---

> **Note de développement :** 
> Si vous ne parvenez pas à vous connecter avec les comptes (autre que Super Admin), il est possible que leur statut soit encore `PENDING_APPROVAL` dans la base de données. 
> Pour y remédier : 
> 1. Connectez-vous avec `admin@azpulse.local`
> 2. Allez dans la gestion des demandes d'accès
> 3. Approuvez les comptes souhaités.

---

## Anomalies corrigées en chemin

Ces corrections n'étaient pas demandées, mais elles bloquaient la livraison du
CRM : sans elles, des écrans entiers renvoyaient une erreur 500. Elles sont
listées pour la traçabilité.

| Symptôme | Cause réelle | Correction |
| :--- | :--- | :--- |
| Le passage d'une affaire en « Gagné » plantait | `Opportunity` n'a pas de méthode `getExpectedValue()` ; lemontant s'appelle `getAmount()` | Appel corrigé + conversion `string` → `float` pour le budget du projet |
| Le passage en « Gagné » plantait (2ᵉ cause) | `Project` déclarait un `ProjectRepository` qui n'existait pas dans le projet | `src/Repository/ProjectRepository.php` créé |
| Créer une affaire avec une date de closing plantait | La colonne `date` de DBAL n'accepte qu'un `\DateTime` **mutable**, alors que le projet manipule des `\DateTimeImmutable` | Colonne passée en `date_immutable` (même SQL, aucune migration) |
| Résumé des relances et statistiques plantaient | DQL interdit de comparer une association par un chemin pointé (`r.assignedTo.id = :x`) | `IDENTITY(r.assignedTo) = :x` |
| `doctrine:migrations:diff` refusait de fonctionner | 3 associations pointaient vers un côté inverse inexistant : `Document#owner`, `Project#customer`, `Project#opportunity` | Les 3 côtés inverses ajoutés (`User#documents`, `Customer#projects`, `Opportunity#project`) |
| Les droits `crm.create` / `crm.update` étaient refusés | Le contrôleur des affaires testait des codes de permission qui n'existent pas (`opportunity.create`) | Remplacés par `crm.create` / `crm.update` |

Vérifications passées après correction : mapping Doctrine valide, base de
données alignée sur les entités,outes les routes CRM enregistrées, build
frontend et analyse statique sans erreur sur le périmètre livré.
