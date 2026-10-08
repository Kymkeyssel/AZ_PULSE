<main className="w-full pt-16 bg-surface px-gutter min-h-screen"><div className="flex flex-col w-full pb-margin-lg space-y-gutter">
{/*  1. Secondary Navigation Tabs  */}
<div className="flex items-center justify-between overflow-x-auto pb-space-xs">
<div className="flex items-center gap-space-xs p-1 bg-surface-container rounded-xl shadow-sm">
<a className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all" href="#">Utilisateurs</a>
<a className="flex items-center gap-space-xs px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all" href="#">
<span>Administrateurs</span>
<span className="px-1.5 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm">5</span>
</a>
<a className="flex items-center gap-space-xs px-space-md py-space-xs rounded-lg font-label-md text-label-md bg-secondary text-on-secondary shadow-sm transition-all" href="#">
<span className="material-symbols-outlined text-[16px]">shield_person</span>
<span>Rôles &amp; permissions</span>
</a>
<a className="flex items-center gap-space-xs px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all" href="#">
<span>Demandes d'accès</span>
<span className="px-1.5 py-0.5 rounded-full bg-secondary-container text-on-secondary font-label-sm text-label-sm font-bold">7</span>
</a>
<a className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all" href="#">Journal des accès / sécurité</a>
</div>
<div className="flex items-center gap-space-sm">
<span className="flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">
<span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
<span>Audit Continu : Synchronisé</span>
</span>
<span className="font-label-sm text-label-sm text-outline">Cluster-ID: FR-PAR-09</span>
</div>
</div>
{/*  2. Header & Action Command Suite  */}
<div className="relative overflow-hidden bg-primary-container text-on-primary rounded-xl p-space-lg shadow-md">
<div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-secondary/15 blur-3xl pointer-events-none"></div>
<div className="absolute right-1/3 -bottom-20 w-64 h-64 rounded-full bg-tertiary-fixed/10 blur-2xl pointer-events-none"></div>
<div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-md">
<div className="space-y-space-xs max-w-3xl">
<div className="flex items-center gap-space-xs font-label-sm text-label-sm uppercase tracking-wider text-tertiary-fixed-dim">
<span className="material-symbols-outlined text-[15px]">verified_user</span>
<span>Cadre de Confiance Zéro-Trust • Règlements MINEFOP • Norme ISO/IEC 27001</span>
</div>
<h1 className="font-headline-xl text-headline-xl text-on-primary tracking-tight font-extrabold">
          Matrice RBAC &amp; Gouvernance Granulaire des Privilèges
        </h1>
<p className="font-body-md text-body-md text-on-primary-container leading-relaxed">
          Cartographie matricielle des permissions par pôle métier conforme aux normes ISO 27001 et MINEFOP. Gestion stricte du principe de moindre privilège et ségrégation des tâches (SoD).
        </p>
</div>
{/*  Action Buttons  */}
<div className="flex flex-wrap items-center gap-space-sm shrink-0">
<button className="flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-surface-container-lowest/10 hover:bg-surface-container-lowest/20 text-on-primary font-label-md text-label-md transition-all" onclick="document.getElementById('exportDialog').classList.toggle('hidden')">
<span className="material-symbols-outlined text-[18px]">file_download</span>
<span>Exporter Rapport</span>
</button>
<button className="flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-tertiary-fixed-dim text-on-tertiary-fixed hover:bg-tertiary-fixed transition-all shadow-sm font-label-md text-label-md" onclick="toggleAuditDrawer()">
<span className="material-symbols-outlined text-[18px]">smart_toy</span>
<span>Auditer les Rôles (IA)</span>
</button>
<button className="flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-secondary-container text-on-secondary hover:bg-secondary font-label-md text-label-md shadow-md hover:shadow-lg transition-all" onclick="alert('Modal de création de rôle initialisée avec profil ISO 27001.')">
<span className="material-symbols-outlined text-[18px]">add_moderator</span>
<span>+ Créer un Rôle</span>
</button>
</div>
</div>
</div>
{/*  3. KPI Telemetry Bar  */}
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter">
{/*  Card 1  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
<div className="flex items-start justify-between">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Rôles Définis</span>
<div className="w-8 h-8 rounded-lg bg-secondary-fixed/30 flex items-center justify-center text-secondary">
<span className="material-symbols-outlined text-[18px]">badge</span>
</div>
</div>
<div className="mt-space-sm flex items-baseline gap-space-xs">
<span className="font-headline-xl text-headline-xl text-on-surface font-extrabold">38</span>
<span className="font-label-md text-label-md text-secondary font-bold">Rôles</span>
</div>
<div className="mt-space-xs flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
<span>8 rôles système • 30 métiers</span>
<span className="font-label-sm text-label-sm text-secondary font-semibold">+2 ce mois</span>
</div>
</div>
{/*  Card 2  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
<div className="flex items-start justify-between">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Règles &amp; Politiques Granulaires</span>
<div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
<span className="material-symbols-outlined text-[18px]">rule_settings</span>
</div>
</div>
<div className="mt-space-sm flex items-baseline gap-space-xs">
<span className="font-headline-xl text-headline-xl text-on-surface font-extrabold">142</span>
<span className="font-label-md text-label-md text-outline font-medium">directives actives</span>
</div>
<div className="mt-space-xs flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
<span className="w-2 h-2 rounded-full bg-secondary-container"></span>
<span>Contrôles ABAC &amp; RBAC hybrides</span>
</div>
</div>
{/*  Card 3  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
<div className="flex items-start justify-between">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Conformité ISO 27001 &amp; RGPD</span>
<div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
<span className="material-symbols-outlined text-[18px]">verified</span>
</div>
</div>
<div className="mt-space-sm flex items-baseline gap-space-xs">
<span className="font-headline-xl text-headline-xl text-on-surface font-extrabold">100%</span>
<span className="font-label-md text-label-md text-secondary-container font-bold">Validé A.9.2</span>
</div>
<div className="mt-space-xs flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
<span>Recertification trimestrielle</span>
<span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container text-on-surface">J-42</span>
</div>
</div>
{/*  Card 4  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
<div className="flex items-start justify-between">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Conflits de Séparation (SoD)</span>
<div className="w-8 h-8 rounded-lg bg-tertiary-fixed-dim/30 flex items-center justify-center text-tertiary">
<span className="material-symbols-outlined text-[18px]">balance</span>
</div>
</div>
<div className="mt-space-sm flex items-baseline gap-space-xs">
<span className="font-headline-xl text-headline-xl text-on-surface font-extrabold">0</span>
<span className="font-label-md text-label-md text-on-surface-variant font-medium">conflit actif</span>
</div>
<div className="mt-space-xs flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
<span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
<span>Aucun cumul toxique détecté</span>
</div>
</div>
</div>
{/*  Legend & Quick Filter Bar  */}
<div className="bg-surface-container-lowest px-space-md py-space-sm rounded-xl shadow-sm flex flex-wrap items-center justify-between gap-space-sm">
<div className="flex flex-wrap items-center gap-space-md">
<span className="font-label-sm text-label-sm uppercase text-outline tracking-wider">Légende des Permissions :</span>
<div className="flex items-center gap-1.5">
<span className="w-3 h-3 rounded-sm bg-primary flex items-center justify-center text-[9px] text-on-primary font-bold">F</span>
<span className="font-label-sm text-label-sm text-on-surface">Full Control (R/W/D)</span>
</div>
<div className="flex items-center gap-1.5">
<span className="w-3 h-3 rounded-sm bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center text-[9px] font-bold">R</span>
<span className="font-label-sm text-label-sm text-on-surface">Lecture Seule (Read)</span>
</div>
<div className="flex items-center gap-1.5">
<span className="w-3 h-3 rounded-sm bg-tertiary-fixed-dim text-on-tertiary-fixed flex items-center justify-center text-[9px] font-bold">V</span>
<span className="font-label-sm text-label-sm text-on-surface">Validation Spécifique (Visa/Sign)</span>
</div>
<div className="flex items-center gap-1.5">
<span className="w-3 h-3 rounded-sm bg-surface-container-high text-outline flex items-center justify-center text-[9px]">✕</span>
<span className="font-label-sm text-label-sm text-outline">Aucun Accès (Verrouillé)</span>
</div>
</div>
<div className="flex items-center gap-space-xs">
<div className="relative">
<span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-outline">search</span>
<input className="pl-8 pr-3 py-1 bg-surface rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:bg-surface-container shadow-inner" id="matrixFilter" onkeyup="filterMatrix()" placeholder="Filtrer module ou ressource..." type="text" />
</div>
<button className="px-space-sm py-1 rounded-lg bg-surface-container font-label-sm text-label-sm text-on-surface hover:bg-surface-container-high transition-all" id="highlightToggleBtn" onclick="toggleHighlightValidations()">
        Mettre en évidence validations
      </button>
</div>
</div>
{/*  4. Granular RBAC Matrix Table Container  */}
<div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse" id="rbacTable">
<thead>
<tr className="bg-surface-container-high/50 text-on-surface font-label-md text-label-md">
<th className="py-space-md px-space-md sticky left-0 bg-surface-container-high z-20 min-w-[280px]">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-[18px] text-secondary">tune</span>
<span>Modules &amp; Périmètres Système</span>
</div>
</th>
<th className="py-space-md px-space-sm text-center min-w-[130px] font-bold text-on-surface">
<div className="flex flex-col items-center">
<span>Super Admin</span>
<span className="font-label-sm text-label-sm text-secondary">Global Root</span>
</div>
</th>
<th className="py-space-md px-space-sm text-center min-w-[130px] font-bold text-on-surface">
<div className="flex flex-col items-center">
<span>Direction Générale</span>
<span className="font-label-sm text-label-sm text-outline">Stratégique</span>
</div>
</th>
<th className="py-space-md px-space-sm text-center min-w-[130px] font-bold text-on-surface">
<div className="flex flex-col items-center">
<span>Resp. CRM</span>
<span className="font-label-sm text-label-sm text-outline">Business Dev</span>
</div>
</th>
<th className="py-space-md px-space-sm text-center min-w-[130px] font-bold text-on-surface">
<div className="flex flex-col items-center">
<span>Formateur Réf.</span>
<span className="font-label-sm text-label-sm text-outline">Pédagogie</span>
</div>
</th>
<th className="py-space-md px-space-sm text-center min-w-[130px] font-bold text-on-surface">
<div className="flex flex-col items-center">
<span>Collab. Ops</span>
<span className="font-label-sm text-label-sm text-outline">Exploitation</span>
</div>
</th>
<th className="py-space-md px-space-sm text-center min-w-[120px] font-bold text-on-surface">
<div className="flex flex-col items-center">
<span>Apprenant</span>
<span className="font-label-sm text-label-sm text-outline">Portail Élève</span>
</div>
</th>
<th className="py-space-md px-space-sm text-center min-w-[120px] font-bold text-on-surface">
<div className="flex flex-col items-center">
<span>Parent Élève</span>
<span className="font-label-sm text-label-sm text-outline">Tuteur</span>
</div>
</th>
<th className="py-space-md px-space-sm text-center min-w-[120px] font-bold text-on-surface">
<div className="flex flex-col items-center">
<span>Client B2B</span>
<span className="font-label-sm text-label-sm text-outline">Commanditaire</span>
</div>
</th>
</tr>
</thead>
<tbody className="divide-y-0 font-body-sm text-body-sm">
{/*  Row 1: Core Platform & Dashboard  */}
<tr className="hover:bg-surface-container-low transition-colors matrix-row">
<td className="py-space-sm px-space-md sticky left-0 bg-surface-container-lowest z-10 font-label-md text-label-md text-on-surface">
<div className="flex items-center gap-space-sm">
<div className="w-7 h-7 rounded-md bg-surface-container flex items-center justify-center text-secondary">
<span className="material-symbols-outlined text-[16px]">dashboard</span>
</div>
<div>
<div className="font-bold">Core Platform &amp; Dashboard</div>
<div className="font-body-sm text-body-sm text-outline">Vues d'ensemble globales, KPIs &amp; widgets</div>
</div>
</div>
</td>
{/*  Super Admin  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary text-on-primary font-label-sm text-label-sm font-bold shadow-xs">
<span className="material-symbols-outlined text-[13px]">lock_open</span> Full Control
              </span>
</td>
{/*  DG  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
<span className="material-symbols-outlined text-[13px]">visibility</span> Lecture Seule
              </span>
</td>
{/*  CRM  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
<span className="material-symbols-outlined text-[13px]">visibility</span> Vue Métier
              </span>
</td>
{/*  Formateur  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
<span className="material-symbols-outlined text-[13px]">visibility</span> Vue Cours
              </span>
</td>
{/*  Ops  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
<span className="material-symbols-outlined text-[13px]">visibility</span> Vue Dédiée
              </span>
</td>
{/*  Apprenant  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
<span className="material-symbols-outlined text-[13px]">visibility</span> Espace Perso
              </span>
</td>
{/*  Parent  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
<span className="material-symbols-outlined text-[13px]">visibility</span> Espace Suivi
              </span>
</td>
{/*  Client  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
<span className="material-symbols-outlined text-[13px]">visibility</span> Suivi Contrat
              </span>
</td>
</tr>
{/*  Row 2: Gestion Utilisateurs & Privilèges  */}
<tr className="hover:bg-surface-container-low transition-colors matrix-row bg-surface-container-lowest">
<td className="py-space-sm px-space-md sticky left-0 bg-surface-container-lowest z-10 font-label-md text-label-md text-on-surface">
<div className="flex items-center gap-space-sm">
<div className="w-7 h-7 rounded-md bg-surface-container flex items-center justify-center text-secondary">
<span className="material-symbols-outlined text-[16px]">manage_accounts</span>
</div>
<div>
<div className="font-bold">Gestion Utilisateurs &amp; Privilèges</div>
<div className="font-body-sm text-body-sm text-outline">Création comptes, réinitialisations MFA, rôles</div>
</div>
</div>
</td>
{/*  Super Admin  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary text-on-primary font-label-sm text-label-sm font-bold shadow-xs">
<span className="material-symbols-outlined text-[13px]">admin_panel_settings</span> Full Control
              </span>
</td>
{/*  DG  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-tertiary-fixed-dim text-on-tertiary-fixed font-label-sm text-label-sm font-bold validation-pill">
<span className="material-symbols-outlined text-[13px]">draw</span> Visa DG Nominatif
              </span>
</td>
{/*  CRM  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container text-outline font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[13px]">lock</span> Aucun Accès
              </span>
</td>
{/*  Formateur  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container text-outline font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[13px]">lock</span> Aucun Accès
              </span>
</td>
{/*  Ops  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
<span className="material-symbols-outlined text-[13px]">sync_lock</span> Reset MFA seul
              </span>
</td>
{/*  Apprenant  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container text-outline font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[13px]">lock</span> Aucun Accès
              </span>
</td>
{/*  Parent  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container text-outline font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[13px]">lock</span> Aucun Accès
              </span>
</td>
{/*  Client  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container text-outline font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[13px]">lock</span> Aucun Accès
              </span>
</td>
</tr>
{/*  Row 3: Demandes d'accès & Arbitrage  */}
<tr className="hover:bg-surface-container-low transition-colors matrix-row">
<td className="py-space-sm px-space-md sticky left-0 bg-surface-container-lowest z-10 font-label-md text-label-md text-on-surface">
<div className="flex items-center gap-space-sm">
<div className="w-7 h-7 rounded-md bg-surface-container flex items-center justify-center text-secondary">
<span className="material-symbols-outlined text-[16px]">how_to_reg</span>
</div>
<div>
<div className="font-bold">Demandes d'accès &amp; Arbitrage</div>
<div className="font-body-sm text-body-sm text-outline">Workflow d'élévation ponctuelle (JIT / PIM)</div>
</div>
</div>
</td>
{/*  Super Admin  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary text-on-primary font-label-sm text-label-sm font-bold shadow-xs">
<span className="material-symbols-outlined text-[13px]">gavel</span> Arbitre Final
              </span>
</td>
{/*  DG  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-tertiary-fixed-dim text-on-tertiary-fixed font-label-sm text-label-sm font-bold validation-pill">
<span className="material-symbols-outlined text-[13px]">task_alt</span> Validation DG
              </span>
</td>
{/*  CRM  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container text-on-surface font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[13px]">send</span> Demandeur
              </span>
</td>
{/*  Formateur  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container text-on-surface font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[13px]">send</span> Demandeur
              </span>
</td>
{/*  Ops  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
<span className="material-symbols-outlined text-[13px]">rule</span> 1er Niveau
              </span>
</td>
{/*  Apprenant  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container text-outline font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[13px]">lock</span> Aucun Accès
              </span>
</td>
{/*  Parent  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container text-outline font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[13px]">lock</span> Aucun Accès
              </span>
</td>
{/*  Client  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container text-outline font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[13px]">lock</span> Aucun Accès
              </span>
</td>
</tr>
{/*  Row 4: Pôle Formation & Notes MINEFOP  */}
<tr className="hover:bg-surface-container-low transition-colors matrix-row bg-surface-container-lowest">
<td className="py-space-sm px-space-md sticky left-0 bg-surface-container-lowest z-10 font-label-md text-label-md text-on-surface">
<div className="flex items-center gap-space-sm">
<div className="w-7 h-7 rounded-md bg-surface-container flex items-center justify-center text-secondary">
<span className="material-symbols-outlined text-[16px]">school</span>
</div>
<div>
<div className="font-bold">Pôle Formation &amp; Notes MINEFOP</div>
<div className="font-body-sm text-body-sm text-outline">Relevés officiels, examens certifiants, fiches élèves</div>
</div>
</div>
</td>
{/*  Super Admin  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
<span className="material-symbols-outlined text-[13px]">visibility</span> Audit Read
              </span>
</td>
{/*  DG  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-tertiary-fixed-dim text-on-tertiary-fixed font-label-sm text-label-sm font-bold validation-pill">
<span className="material-symbols-outlined text-[13px]">approval</span> Sceau MINEFOP
              </span>
</td>
{/*  CRM  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
<span className="material-symbols-outlined text-[13px]">assignment_ind</span> Assiduité
              </span>
</td>
{/*  Formateur  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-tertiary-fixed-dim text-on-tertiary-fixed font-label-sm text-label-sm font-bold validation-pill">
<span className="material-symbols-outlined text-[13px]">edit_note</span> Saisie &amp; Visa
              </span>
</td>
{/*  Ops  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
<span className="material-symbols-outlined text-[13px]">print</span> Édition Certif.
              </span>
</td>
{/*  Apprenant  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
<span className="material-symbols-outlined text-[13px]">grade</span> Notes Propres
              </span>
</td>
{/*  Parent  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
<span className="material-symbols-outlined text-[13px]">family_restroom</span> Bulletins
              </span>
</td>
{/*  Client  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
<span className="material-symbols-outlined text-[13px]">badge</span> Relevé Salariés
              </span>
</td>
</tr>
{/*  Row 5: Pôle CRM & Données Financières  */}
<tr className="hover:bg-surface-container-low transition-colors matrix-row">
<td className="py-space-sm px-space-md sticky left-0 bg-surface-container-lowest z-10 font-label-md text-label-md text-on-surface">
<div className="flex items-center gap-space-sm">
<div className="w-7 h-7 rounded-md bg-surface-container flex items-center justify-center text-secondary">
<span className="material-symbols-outlined text-[16px]">attach_money</span>
</div>
<div>
<div className="font-bold">Pôle CRM &amp; Données Financières</div>
<div className="font-body-sm text-body-sm text-outline">Facturation B2B, devis, solvabilité et opportunités</div>
</div>
</div>
</td>
{/*  Super Admin  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
<span className="material-symbols-outlined text-[13px]">visibility</span> Audit Read
              </span>
</td>
{/*  DG  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary text-on-primary font-label-sm text-label-sm font-bold shadow-xs">
<span className="material-symbols-outlined text-[13px]">history_edu</span> Full Control
              </span>
</td>
{/*  CRM  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary text-on-primary font-label-sm text-label-sm font-bold shadow-xs">
<span className="material-symbols-outlined text-[13px]">edit</span> R/W Pipeline
              </span>
</td>
{/*  Formateur  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container text-outline font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[13px]">lock</span> Bloqué SoD
              </span>
</td>
{/*  Ops  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
<span className="material-symbols-outlined text-[13px]">receipt</span> Lecture Devis
              </span>
</td>
{/*  Apprenant  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
<span className="material-symbols-outlined text-[13px]">credit_card</span> Paiement Seul
              </span>
</td>
{/*  Parent  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
<span className="material-symbols-outlined text-[13px]">receipt_long</span> Factures Frais
              </span>
</td>
{/*  Client  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
<span className="material-symbols-outlined text-[13px]">paid</span> Commandes &amp; BL
              </span>
</td>
</tr>
{/*  Row 6: Infrastructure, Serveurs & GLPI  */}
<tr className="hover:bg-surface-container-low transition-colors matrix-row bg-surface-container-lowest">
<td className="py-space-sm px-space-md sticky left-0 bg-surface-container-lowest z-10 font-label-md text-label-md text-on-surface">
<div className="flex items-center gap-space-sm">
<div className="w-7 h-7 rounded-md bg-surface-container flex items-center justify-center text-secondary">
<span className="material-symbols-outlined text-[16px]">dns</span>
</div>
<div>
<div className="font-bold">Infrastructure, Serveurs &amp; GLPI</div>
<div className="font-body-sm text-body-sm text-outline">Clusters Kubernetes, backups bare-metal, inventaire IT</div>
</div>
</div>
</td>
{/*  Super Admin  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary text-on-primary font-label-sm text-label-sm font-bold shadow-xs">
<span className="material-symbols-outlined text-[13px]">terminal</span> Root Infra
              </span>
</td>
{/*  DG  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container text-outline font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[13px]">lock</span> Aucun Accès
              </span>
</td>
{/*  CRM  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container text-outline font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[13px]">lock</span> Aucun Accès
              </span>
</td>
{/*  Formateur  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container text-outline font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[13px]">lock</span> Aucun Accès
              </span>
</td>
{/*  Ops  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary text-on-primary font-label-sm text-label-sm font-bold shadow-xs">
<span className="material-symbols-outlined text-[13px]">confirmation_number</span> Tickets GLPI
              </span>
</td>
{/*  Apprenant  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container text-outline font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[13px]">lock</span> Aucun Accès
              </span>
</td>
{/*  Parent  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container text-outline font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[13px]">lock</span> Aucun Accès
              </span>
</td>
{/*  Client  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container text-outline font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[13px]">lock</span> Aucun Accès
              </span>
</td>
</tr>
{/*  Row 7: IA Copilot & Vector Embeddings  */}
<tr className="hover:bg-surface-container-low transition-colors matrix-row">
<td className="py-space-sm px-space-md sticky left-0 bg-surface-container-lowest z-10 font-label-md text-label-md text-on-surface">
<div className="flex items-center gap-space-sm">
<div className="w-7 h-7 rounded-md bg-surface-container flex items-center justify-center text-tertiary">
<span className="material-symbols-outlined text-[16px]">smart_toy</span>
</div>
<div>
<div className="font-bold">IA Copilot &amp; Vector Embeddings</div>
<div className="font-body-sm text-body-sm text-outline">Modèles LLM souverains, fine-tuning, RAG d'entreprise</div>
</div>
</div>
</td>
{/*  Super Admin  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary text-on-primary font-label-sm text-label-sm font-bold shadow-xs">
<span className="material-symbols-outlined text-[13px]">tune</span> Modèles &amp; Clés
              </span>
</td>
{/*  DG  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
<span className="material-symbols-outlined text-[13px]">psychology</span> Prompt DG
              </span>
</td>
{/*  CRM  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
<span className="material-symbols-outlined text-[13px]">assistant</span> Aide Pitch/Email
              </span>
</td>
{/*  Formateur  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
<span className="material-symbols-outlined text-[13px]">quiz</span> QCM Assistant
              </span>
</td>
{/*  Ops  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
<span className="material-symbols-outlined text-[13px]">support_agent</span> Diagnostic IT
              </span>
</td>
{/*  Apprenant  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
<span className="material-symbols-outlined text-[13px]">forum</span> Tutorat Limité
              </span>
</td>
{/*  Parent  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container text-outline font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[13px]">lock</span> Désactivé
              </span>
</td>
{/*  Client  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
<span className="material-symbols-outlined text-[13px]">analytics</span> Synthèse ROI
              </span>
</td>
</tr>
{/*  Row 8: Télémétrie Système & SIEM  */}
<tr className="hover:bg-surface-container-low transition-colors matrix-row bg-surface-container-lowest">
<td className="py-space-sm px-space-md sticky left-0 bg-surface-container-lowest z-10 font-label-md text-label-md text-on-surface">
<div className="flex items-center gap-space-sm">
<div className="w-7 h-7 rounded-md bg-surface-container flex items-center justify-center text-secondary">
<span className="material-symbols-outlined text-[16px]">security</span>
</div>
<div>
<div className="font-bold">Télémétrie Système &amp; SIEM</div>
<div className="font-body-sm text-body-sm text-outline">Logs d'audit immuables, détection d'intrusions, traçabilité</div>
</div>
</div>
</td>
{/*  Super Admin  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary text-on-primary font-label-sm text-label-sm font-bold shadow-xs">
<span className="material-symbols-outlined text-[13px]">verified</span> SIEM Admin
              </span>
</td>
{/*  DG  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
<span className="material-symbols-outlined text-[13px]">insights</span> Synthèse Mensuelle
              </span>
</td>
{/*  CRM  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container text-outline font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[13px]">lock</span> Aucun Accès
              </span>
</td>
{/*  Formateur  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container text-outline font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[13px]">lock</span> Aucun Accès
              </span>
</td>
{/*  Ops  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
<span className="material-symbols-outlined text-[13px]">monitor_heart</span> Métriques Infra
              </span>
</td>
{/*  Apprenant  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container text-outline font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[13px]">lock</span> Aucun Accès
              </span>
</td>
{/*  Parent  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container text-outline font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[13px]">lock</span> Aucun Accès
              </span>
</td>
{/*  Client  */}
<td className="py-space-sm px-space-xs text-center">
<span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container text-outline font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[13px]">lock</span> Aucun Accès
              </span>
</td>
</tr>
</tbody>
</table>
</div>
{/*  Table Footer Note  */}
<div className="px-space-md py-space-sm bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs font-body-sm text-body-sm text-outline">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-[16px] text-secondary">info</span>
<span>Modification en temps réel soumise à double validation cryptographique par clé FIDO2.</span>
</div>
<div className="flex items-center gap-space-sm text-on-surface-variant font-label-sm text-label-sm">
<span>Matrice révisée le 24 Mai 2025</span>
<button className="text-secondary hover:underline font-bold" onclick="alert('Historique des versions chargé.')">Historique v4.2</button>
</div>
</div>
</div>
{/*  5. Secondary Card / Interactive Drawer: Auditeur de Rôles & Analyseur de Dérive  */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
{/*  Audit Box  */}
<div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
<div>
<div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md">
<div className="flex items-center gap-space-sm">
<div className="w-10 h-10 rounded-xl bg-primary text-tertiary-fixed-dim flex items-center justify-center shadow-sm">
<span className="material-symbols-outlined text-[24px]">smart_toy</span>
</div>
<div>
<h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Auditeur de Rôles &amp; Analyseur de Dérive de Privilèges
              </h2>
<span className="font-body-sm text-body-sm text-outline">Moteur IA heuristique inspectant les cumuls de droits et la conformité SoD</span>
</div>
</div>
<span className="px-space-sm py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
            Scan continu actif
          </span>
</div>
{/*  Metric & Verification Cards  */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md mt-space-sm">
<div className="p-space-md bg-surface-container-low rounded-xl">
<span className="font-label-sm text-label-sm uppercase text-outline">Score Posture IA</span>
<div className="mt-space-xs flex items-baseline gap-1">
<span className="font-headline-lg text-headline-lg font-extrabold text-on-surface">99.8%</span>
<span className="font-label-sm text-label-sm text-secondary font-bold">Optimal</span>
</div>
<div className="w-full bg-surface-container-high h-1.5 rounded-full mt-2 overflow-hidden">
<div className="bg-secondary h-full rounded-full" style={{ width: '99.8%' }}></div>
</div>
</div>
<div className="p-space-md bg-surface-container-low rounded-xl">
<span className="font-label-sm text-label-sm uppercase text-outline">Contrôle SoD Formateur/Finance</span>
<div className="mt-space-xs flex items-center gap-1.5 text-on-surface font-bold font-label-md text-label-md">
<span className="material-symbols-outlined text-[18px] text-secondary">check_circle</span>
<span>Hermétique</span>
</div>
<p className="font-body-sm text-body-sm text-outline mt-1 leading-tight">
              Pas de cumul facturation + émargement notes.
            </p>
</div>
<div className="p-space-md bg-surface-container-low rounded-xl">
<span className="font-label-sm text-label-sm uppercase text-outline">Règles Moindre Privilège</span>
<div className="mt-space-xs flex items-center gap-1.5 text-on-surface font-bold font-label-md text-label-md">
<span className="material-symbols-outlined text-[18px] text-secondary">verified_user</span>
<span>100% Appliquées</span>
</div>
<p className="font-body-sm text-body-sm text-outline mt-1 leading-tight">
              Revocation automatique des sessions PIM expirées.
            </p>
</div>
</div>
{/*  AI Recommendations Stream  */}
<div className="mt-space-lg space-y-space-xs">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Recommandations &amp; Arbitrages IA Prioritaires :</span>
<div className="p-space-sm bg-surface rounded-lg flex items-start justify-between gap-space-sm">
<div className="flex items-start gap-space-sm">
<span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">lightbulb</span>
<div>
<div className="font-label-md text-label-md text-on-surface font-bold">Élévation Temporaire JIT (Just-In-Time) conseillée</div>
<div className="font-body-sm text-body-sm text-outline">
                  3 collaborateurs Ops possèdent des droits de purge des conteneurs sans ticket d'incident ouvert. Suggestion: limiter à 2h avec approbation DG.
                </div>
</div>
</div>
<button className="px-space-sm py-1 rounded bg-secondary-container text-on-secondary hover:bg-secondary font-label-sm text-label-sm font-semibold shrink-0 transition-all" onclick="this.innerText='Appliqué'; this.classList.add('bg-surface-container','text-outline');">
              Appliquer Durcissement
            </button>
</div>
<div className="p-space-sm bg-surface rounded-lg flex items-start justify-between gap-space-sm">
<div className="flex items-start gap-space-sm">
<span className="material-symbols-outlined text-tertiary text-[20px] shrink-0 mt-0.5">policy</span>
<div>
<div className="font-label-md text-label-md text-on-surface font-bold">Signature Numérique MINEFOP : Horodatage RFC 3161</div>
<div className="font-body-sm text-body-sm text-outline">
                  Validation Formateur Référent couplée au certificat PKI matériel pour sceller les relevés d'évaluation officiels.
                </div>
</div>
</div>
<span className="px-space-sm py-1 rounded bg-surface-container font-label-sm text-label-sm text-on-surface-variant font-bold shrink-0">
              Actif &amp; Signé
            </span>
</div>
</div>
</div>
<div className="mt-space-md pt-space-sm border-t border-surface-container flex items-center justify-between font-label-sm text-label-sm text-outline">
<span>Dernière analyse heuristique exécutée à l'instant (Cluster France DC-1)</span>
<button className="text-secondary font-bold hover:underline flex items-center gap-1" onclick="runManualScan(this)">
<span className="material-symbols-outlined text-[15px]">refresh</span> Relancer Scan
        </button>
</div>
</div>
{/*  Secondary Side Widget: Visual Auditing Context  */}
<div className="lg:col-span-4 space-y-space-md">
{/*  Role Distribution Donut Card  */}
<div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
<div className="flex items-center justify-between mb-space-sm">
<span className="font-headline-sm text-headline-sm font-bold text-on-surface">Distribution des Comptes</span>
<span className="material-symbols-outlined text-outline text-[20px]">pie_chart</span>
</div>
<div className="flex items-center gap-space-md py-space-xs">
{/*  Inline Mini Vector Donut  */}
<svg className="shrink-0" height="100" viewBox="0 0 42 42" width="100">
<circle cx="21" cy="21" fill="transparent" r="15.91549430918954" stroke="#eaeef2" stroke-width="5"></circle>
{/*  Ops: 25%  */}
<circle cx="21" cy="21" fill="transparent" r="15.91549430918954" stroke="#004ad1" stroke-dasharray="25 75" stroke-dashoffset="25" stroke-width="5"></circle>
{/*  Formateurs: 40%  */}
<circle cx="21" cy="21" fill="transparent" r="15.91549430918954" stroke="#1a62fe" stroke-dasharray="40 60" stroke-dashoffset="0" stroke-width="5"></circle>
{/*  Admins: 10%  */}
<circle cx="21" cy="21" fill="transparent" r="15.91549430918954" stroke="#001026" stroke-dasharray="10 90" stroke-dashoffset="60" stroke-width="5"></circle>
{/*  DG/VIP: 5%  */}
<circle cx="21" cy="21" fill="transparent" r="15.91549430918954" stroke="#ffba20" stroke-dasharray="5 95" stroke-dashoffset="50" stroke-width="5"></circle>
</svg>
<div className="space-y-1 font-body-sm text-body-sm flex-1">
<div className="flex items-center justify-between">
<span className="flex items-center gap-1.5 text-on-surface">
<span className="w-2 h-2 rounded-full bg-primary"></span> Admins
              </span>
<span className="font-bold">5 (1.2%)</span>
</div>
<div className="flex items-center justify-between">
<span className="flex items-center gap-1.5 text-on-surface">
<span className="w-2 h-2 rounded-full bg-secondary-container"></span> Formateurs
              </span>
<span className="font-bold">48 (12%)</span>
</div>
<div className="flex items-center justify-between">
<span className="flex items-center gap-1.5 text-on-surface">
<span className="w-2 h-2 rounded-full bg-secondary"></span> Ops / Support
              </span>
<span className="font-bold">24 (6%)</span>
</div>
<div className="flex items-center justify-between">
<span className="flex items-center gap-1.5 text-on-surface">
<span className="w-2 h-2 rounded-full bg-surface-container-high"></span> Usagers / Apprenants
              </span>
<span className="font-bold">340 (80.8%)</span>
</div>
</div>
</div>
<div className="mt-space-sm pt-space-xs border-t border-surface-container flex items-center justify-between text-outline font-label-sm text-label-sm">
<span>Total Identités Gérées</span>
<span className="font-bold text-on-surface">417 comptes</span>
</div>
</div>
{/*  Security Certification Banner with Photo & Seal  */}
<div className="relative overflow-hidden rounded-xl bg-primary text-on-primary p-space-md shadow-sm">
<div className="relative z-10">
<div className="flex items-center justify-between mb-space-xs">
<span className="px-2 py-0.5 rounded bg-secondary text-on-secondary font-label-sm text-label-sm font-bold uppercase tracking-wider">
              ISO 27001 : 2022
            </span>
<span className="material-symbols-outlined text-tertiary-fixed-dim text-[18px]">verified</span>
</div>
<h3 className="font-label-lg text-label-lg font-bold text-on-primary">
            Ségrégation des Tâches (SoD) Active
          </h3>
<p className="font-body-sm text-body-sm text-on-primary-container mt-1">
            Les rôles avec validation budgétaire ont interdiction cryptographique d'approuver leurs propres feuilles de temps ou relevés de notes.
          </p>
<div className="mt-space-sm flex items-center gap-space-sm">
<div className="w-7 h-7 rounded-full bg-surface-container-lowest/20 flex items-center justify-center font-bold text-tertiary-fixed-dim text-[12px]">
              AZ
            </div>
<div className="text-on-primary-container font-label-sm text-label-sm">
              Attestation d'audit #AZ-SOD-20250524
            </div>
</div>
</div>
<div className="absolute -right-8 -bottom-8 w-28 h-28 bg-secondary-container/20 rounded-full blur-xl pointer-events-none"></div>
</div>
</div>
</div>
{/*  Hidden Export / Modal Dialog Example  */}
<div className="hidden fixed inset-0 z-50 flex items-center justify-center bg-primary/40 backdrop-blur-sm" id="exportDialog">
<div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-space-lg shadow-xl m-space-md space-y-space-md">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs font-headline-sm text-headline-sm font-bold text-on-surface">
<span className="material-symbols-outlined text-secondary">description</span>
<span>Exporter Rapport RBAC</span>
</div>
<button className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-outline" onclick="document.getElementById('exportDialog').classList.add('hidden')">
<span className="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
<p className="font-body-md text-body-md text-on-surface-variant">
        Génération du rapport d'audit certifié pour les auditeurs ISO 27001 et les inspecteurs académiques MINEFOP.
      </p>
<div className="space-y-space-xs font-body-sm text-body-sm">
<label className="flex items-center gap-space-sm p-space-xs rounded bg-surface-container-low cursor-pointer">
<input checked="" className="rounded text-secondary" type="checkbox" />
<span>Inclure la cartographie complète des 38 rôles</span>
</label>
<label className="flex items-center gap-space-sm p-space-xs rounded bg-surface-container-low cursor-pointer">
<input checked="" className="rounded text-secondary" type="checkbox" />
<span>Preuve formelle de conformité SoD (Anti-cumul)</span>
</label>
<label className="flex items-center gap-space-sm p-space-xs rounded bg-surface-container-low cursor-pointer">
<input checked="" className="rounded text-secondary" type="checkbox" />
<span>Signature cryptographique horodatée de l'audit</span>
</label>
</div>
<div className="flex items-center justify-end gap-space-xs pt-space-xs">
<button className="px-space-md py-space-sm rounded-lg bg-surface-container hover:bg-surface-container-high font-label-md text-label-md text-on-surface" onclick="document.getElementById('exportDialog').classList.add('hidden')">
          Annuler
        </button>
<button className="px-space-md py-space-sm rounded-lg bg-secondary text-on-secondary hover:bg-secondary-container font-label-md text-label-md font-bold shadow-sm" onclick="alert('Rapport PDF/A certifié généré et téléchargé.'); document.getElementById('exportDialog').classList.add('hidden');">
          Télécharger (.PDF certifié)
        </button>
</div>
</div>
</div>
</div>
</main>