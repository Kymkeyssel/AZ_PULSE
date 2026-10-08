# Audit Pixel-Perfect : Stitch vs React — AZ PULSE

> Comparaison des maquettes Stitch avec les composants React existants.  
> Objectif : aligner chaque interface sur son design Stitch **sans casser les données réelles**.

---

## Synthèse Globale

| Interface | Stitch | React Actuel | Score | Statut |
|---|---|---|---|---|
| **Auth (Login/Register)** | Split-screen, hero sombre gauche, form droite | CSS propre existant | 80% | ✅ Acceptable |
| **SuperAdmin Dashboard** | Hero "Supervision Critique" sombre, sidebar sombre avec badges IA | Présent mais simplifié | 65% | 🔶 Ajustements |
| **Admin/Direction Dashboard** | Hero "Direction Générale" sombre, cards demandes accès avec avatars | Présent mais couleurs off | 70% | 🔶 Ajustements |
| **Collaborateur Home** | Hero contextuel enrichi, Planning semaine inline, Incidents GLPI | Layout de base, manque planning | 60% | 🔶 Ajustements |
| **Formateur Dashboard** | Sessions numérotées, panel évaluations, alertes apprenants urgents | Structure ok, détails manquent | 75% | 🔶 Affinements |
| **Apprenant (Planning/Notes/Paiements/Docs)** | Layouts riches avec sidebar académique | Implémentés et proches | 80% | ✅ Acceptable |
| **Parent Dashboard** | Suivi enfant avec timeline académique | Implémenté | 75% | 🔶 Affinements |
| **IT/GLPI (InfrastructureManager)** | Sidebar GLPI avec compteurs, tiroir 5-tabs | Très proche — lazy-loading ajouté | 85% | ✅ Bon état |
| **Pages Erreur (403/404/500)** | Design premium, illustrations | Implémentées | 85% | ✅ Bon état |
| **PendingAccess / RejectedAccess** | Design centré avec statut | Implémentées | 85% | ✅ Bon état |

---

## Plan d'Action — Ajustements Prioritaires

### 1. SuperAdmin Dashboard — Priorité HAUTE

**Gaps identifiés :**
- [ ] Hero "Supervision Critique AZ Pulse" : fond très sombre (`#001020`), texte blanc, badge "Santé Globale 100%"
- [ ] Panneau "Insight Prédictif IA Système" avec badge de confiance (actuellement absent)
- [ ] Sidebar : badge "6 Agents IA actifs" + badge "182ms" dans le header
- [ ] Bloc "Actions Requises Prioritaires" avec 4 alertes colorées (actuellement une liste basique)
- [ ] Couleur sidebar correcte (dark navy `#001026`)

**Modifications React :**
- `SuperAdminDashboard.jsx` : Enrichir le Hero + ajouter bloc IA Insight
- `DashboardLayout.jsx` : Vérifier la colorimétrie sidebar

### 2. Admin Dashboard — Priorité HAUTE

**Gaps identifiés :**
- [ ] Hero "Direction Générale • Gouvernance AZ PULSE" : fond sombre, badge "Plateforme opérationnelle"
- [ ] Cards demandes d'accès : avatars colorés (JD, MX, DY), boutons Examiner/Approuver/Rejeter inline
- [ ] Section "Vue Métier Globale 5 Pôles Opérationnels" avec 5 KPI cards + sparklines
- [ ] Chart répartition des utilisateurs par collège (donut)
- [ ] Bloc "AZ Copilot IA" flottant en bas à droite

**Modifications React :**
- `AdminDashboard.jsx` : Hero enrichi + cards demandes avec avatars + vue métier

### 3. Collaborateur Home — Priorité HAUTE

**Gaps identifiés :**
- [ ] Header contextuel : badge Rôle ("Lead Manager"), Localisation, Disponibilité
- [ ] Mini Planning semaine (Lun-Ven avec statuts) — actuellement absent
- [ ] Bloc "Incidents & GLPI" inline avec 2 tickets récents
- [ ] Section "Activité & Retours Récents" avec avatars

**Modifications React :**
- `CollaborateurHome.jsx` : Ajouter planning semaine + bloc incidents

### 4. Formateur Dashboard — Priorité MOYENNE

**Gaps identifiés :**
- [ ] Sessions numérotées "01, 02" avec fond sombre (#001026) et badge salle
- [ ] Bloc QR Scanner pour émargement électronique
- [ ] Alertes apprenants : avatars + badge priorité (rouge/orange)
- [ ] Bloc "Exporter PV de notes officiel (MINEFOP)"

**Modifications React :**
- `FormateurDashboard.jsx` : Sessions numérotées + bloc émargement + alertes

### 5. Parent Dashboard — Priorité BASSE

**Gaps identifiés :**
- [ ] Timeline académique de l'enfant
- [ ] Indicateurs de présence visuels

---

## Système d'Authentification RBAC — Bilan

**Résultat : ✅ Système robuste et correctement implémenté**

| Composant | Statut | Notes |
|---|---|---|
| `AuthContext.jsx` | ✅ | JWT decode + refresh token |
| `ProtectedRoute.jsx` | ✅ | Vérification multi-rôles |
| `RoleRedirect.jsx` | ✅ | Aiguillage post-login par rôle |
| Routes SUPER_ADMIN | ✅ | `/superadmin/*` verrouillé |
| Routes ADMIN | ✅ | `/admin/*` verrouillé |
| Routes APPRENANT | ✅ | `/apprenant/*` verrouillé |
| Routes COLLABORATEUR | ✅ | `/collaborateur/*` sans garde (nécessite vérif API) |
| Routes PARENT | ✅ | `/parent/*` verrouillé |
| Routes FORMATEUR | ✅ | `/formation/*` verrouillé RESPONSABLE_FORMATION |
| Gestion PENDING/REJECTED | ✅ | Redirection vers pages dédiées |
| Activation premier login | ✅ | `lastLoginAt === null` → `/activate` |

**Point d'attention :**
- La route `/collaborateur` n'a pas de garde `ProtectedRoute` explicite dans `App.jsx` — elle est sous `<CollaborateurLayout>` mais sans rôle requis. La sécurité est assurée par l'API Symfony, mais il faudrait ajouter un wrapper pour être défensif côté frontend.

---

## Prochaine Étape

Exécution des ajustements en ordre de priorité :
1. SuperAdmin Dashboard — Hero + Insight IA + Alertes
2. Admin Dashboard — Hero DG + Cards demandes
3. Collaborateur Home — Planning semaine + Incidents
4. Formateur Dashboard — Sessions numérotées
