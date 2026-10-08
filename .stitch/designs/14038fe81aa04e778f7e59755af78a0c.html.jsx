<main className="w-full pt-20 px-space-sm pb-space-lg"><div className="flex flex-col w-full gap-space-lg">
{/*  1. EN-TÊTE / BANNIÈRE DE BIENVENUE DG  */}
<section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary-container to-primary text-on-primary shadow-xl p-space-lg lg:p-space-xl">
<div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-secondary-container/10 blur-3xl pointer-events-none"></div>
<div className="absolute right-48 -bottom-24 w-80 h-80 rounded-full bg-tertiary-fixed-dim/10 blur-2xl pointer-events-none"></div>
<div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
<div className="flex flex-col gap-space-xs max-w-2xl">
<div className="inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded-full bg-surface-container-lowest/10 backdrop-blur-md text-on-primary text-label-sm font-label-sm w-fit">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
<span className="">DIRECTION GÉNÉRALE • GOUVERNANCE AZ PULSE</span>
</div>
<h1 className="text-headline-xl font-headline-xl text-on-primary tracking-tight">Bonjour, Dr. Marc V. <span className="inline-block animate-bounce">👋</span></h1>
<p className="text-body-md font-body-md text-primary-fixed-dim">
          Supervision et administration d’AZ PULSE • Hubs opérationnels Yaoundé &amp; Paris
        </p>
</div>
<div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center lg:items-end xl:items-center gap-space-md">
<div className="flex items-center gap-space-xs px-space-md py-2 rounded-xl bg-surface-container-lowest/10 backdrop-blur-md text-on-primary">
<span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
<span className="text-label-md font-label-md">Plateforme opérationnelle</span>
<span className="text-body-sm font-body-sm text-primary-fixed-dim">• 10:42</span>
</div>
<div className="flex items-center gap-space-xs">
<button className="inline-flex items-center gap-space-xs px-space-md py-2 rounded-xl bg-secondary-container hover:bg-secondary text-on-secondary text-label-md font-label-md shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer" type="button">
<span className="material-symbols-outlined text-[18px]">person_add</span>
<span className="">+ Nouvel Utilisateur</span>
</button>
<button className="inline-flex items-center gap-space-xs px-space-md py-2 rounded-xl bg-tertiary-fixed-dim hover:bg-tertiary-fixed text-on-tertiary-fixed text-label-md font-label-md shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer" type="button">
<span className="material-symbols-outlined text-[18px]">how_to_reg</span>
<span className="">Traiter les Accès (12)</span>
</button>
</div>
</div>
</div><div className="relative z-10 mt-space-md p-space-md rounded-xl bg-surface-container-lowest/10 backdrop-blur-md border border-surface-container-lowest/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm"><div className="flex items-center gap-space-sm"><div className="w-8 h-8 rounded-lg bg-tertiary-fixed-dim/20 flex items-center justify-center text-tertiary-fixed-dim shrink-0"><span className="material-symbols-outlined text-[20px]">auto_awesome</span></div><div className="flex flex-col"><div className="flex items-center gap-space-xs"><span className="text-label-md font-label-md text-on-primary font-bold">Synthèse Prédictive AZ Copilot</span><span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-wide">Confiance 98.4%</span></div><p className="text-body-sm font-body-sm text-primary-fixed-dim">Pic d'activité estimé à +18% sur le pôle CRM cette semaine. 2 accès B2B recommandés pour approbation immédiate sans anomalie de sécurité.</p></div></div><button className="inline-flex items-center gap-1 px-space-sm py-1 rounded-lg bg-surface-container-lowest/20 hover:bg-surface-container-lowest/30 text-on-primary text-label-sm font-label-sm transition-colors shrink-0" type="button"><span className="material-symbols-outlined text-[16px]">insights</span><span className="">Détails prédictifs</span></button></div>
</section>
{/*  2. BLOC ACTIONS REQUISES & ALERTES MÉTIER PRIORITAIRES  */}
<section className="rounded-2xl bg-surface-container-lowest shadow-md p-space-md lg:p-space-lg flex flex-col gap-space-md">
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
<div className="flex items-center gap-space-sm">
<div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center text-on-tertiary-container">
<span className="material-symbols-outlined text-[20px]">warning</span>
</div>
<div className="flex flex-col">
<span className="text-headline-sm font-headline-sm text-on-surface">Actions Requises &amp; Arbitrages Prioritaires</span>
<span className="text-body-sm font-body-sm text-on-surface-variant">Décisions d'administration nécessitant validation du Directeur Général</span>
</div>
</div>
<span className="px-space-sm py-0.5 rounded-full bg-surface-container-high text-on-surface text-label-sm font-label-sm w-fit">
        4 points de vigilance
      </span>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-sm">
<div className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
<div className="flex items-center gap-space-sm">
<span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
<div className="flex flex-col">
<span className="text-label-md font-label-md text-on-surface">12 demandes d'accès</span>
<span className="text-body-sm font-body-sm text-on-surface-variant">En attente d'arbitrage</span>
</div>
</div>
<button className="px-space-xs py-1 rounded-lg bg-surface-container-lowest text-secondary text-label-sm font-label-sm shadow-sm hover:bg-secondary-fixed transition-colors" type="button">
          Arbitrer
        </button>
</div>
<div className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
<div className="flex items-center gap-space-sm">
<span className="w-2.5 h-2.5 rounded-full bg-error shrink-0"></span>
<div className="flex flex-col">
<span className="text-label-md font-label-md text-on-surface">3 comptes suspendus</span>
<span className="text-body-sm font-body-sm text-on-surface-variant">À surveiller / Revue</span>
</div>
</div>
<button className="px-space-xs py-1 rounded-lg bg-surface-container-lowest text-secondary text-label-sm font-label-sm shadow-sm hover:bg-secondary-fixed transition-colors" type="button">
          Vérifier
        </button>
</div>
<div className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
<div className="flex items-center gap-space-sm">
<span className="w-2.5 h-2.5 rounded-full bg-secondary-container shrink-0"></span>
<div className="flex flex-col">
<span className="text-label-md font-label-md text-on-surface">4 sans département</span>
<span className="text-body-sm font-body-sm text-on-surface-variant">Profils non affiliés</span>
</div>
</div>
<button className="px-space-xs py-1 rounded-lg bg-surface-container-lowest text-secondary text-label-sm font-label-sm shadow-sm hover:bg-secondary-fixed transition-colors" type="button">
          Résoudre
        </button>
</div>
<div className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
<div className="flex items-center gap-space-sm">
<span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed-dim shrink-0"></span>
<div className="flex flex-col">
<span className="text-label-md font-label-md text-on-surface">2 droits sensibles</span>
<span className="text-body-sm font-body-sm text-on-surface-variant">Délégations modifiées</span>
</div>
</div>
<button className="px-space-xs py-1 rounded-lg bg-surface-container-lowest text-secondary text-label-sm font-label-sm shadow-sm hover:bg-secondary-fixed transition-colors" type="button">
          Audit
        </button>
</div>
</div>
</section>
{/*  3. RANGÉE ACTIONS RAPIDES CLÉS  */}
<section className="flex items-center gap-space-xs overflow-x-auto pb-1">
<a className="inline-flex items-center gap-space-xs px-space-md py-2 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-secondary-container hover:text-on-secondary transition-all shadow-sm shrink-0 text-label-md font-label-md" data-path="utilisateurs" href="#">
<span className="material-symbols-outlined text-[18px]">person_add</span>
<span className="">+ Ajouter utilisateur</span>
</a>
<a className="inline-flex items-center gap-space-xs px-space-md py-2 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-secondary-container hover:text-on-secondary transition-all shadow-sm shrink-0 text-label-md font-label-md" data-path="demandes-acces" href="#">
<span className="material-symbols-outlined text-[18px]">rule</span>
<span className="">✓ Traiter demandes d'accès</span>
</a>
<a className="inline-flex items-center gap-space-xs px-space-md py-2 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-secondary-container hover:text-on-secondary transition-all shadow-sm shrink-0 text-label-md font-label-md" data-path="roles-permissions" href="#">
<span className="material-symbols-outlined text-[18px]">shield</span>
<span className="">🔐 Gérer rôles &amp; permissions</span>
</a>
<a className="inline-flex items-center gap-space-xs px-space-md py-2 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-secondary-container hover:text-on-secondary transition-all shadow-sm shrink-0 text-label-md font-label-md" data-path="utilisateurs" href="#">
<span className="material-symbols-outlined text-[18px]">groups</span>
<span className="">👥 Voir annuaire complet</span>
</a>
<a className="inline-flex items-center gap-space-xs px-space-md py-2 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-secondary-container hover:text-on-secondary transition-all shadow-sm shrink-0 text-label-md font-label-md" data-path="analytics" href="#">
<span className="material-symbols-outlined text-[18px]">priority_high</span>
<span className="">⚠ Voir alertes prioritaires</span>
</a>
</section>
{/*  4. 6 CARTES KPIS PRINCIPAUX  */}
<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-space-md">
{/*  KPI 1  */}
<a className="group rounded-2xl bg-surface-container-lowest p-space-md shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between" data-path="utilisateurs" href="#">
<div className="flex items-center justify-between">
<span className="text-body-sm font-body-sm text-on-surface-variant font-medium">Utilisateurs actifs</span>
<div className="w-8 h-8 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-[18px]">group</span>
</div>
</div>
<div className="flex flex-col gap-0.5 mt-space-sm">
<span className="text-headline-xl font-headline-xl text-on-surface tracking-tight">248</span>
<span className="text-body-sm font-body-sm text-emerald-600 font-medium">+14 ce mois • 96% actif</span>
</div>
</a>
{/*  KPI 2  */}
<a className="group rounded-2xl bg-surface-container-lowest p-space-md shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between" data-path="demandes-acces" href="#">
<div className="flex items-center justify-between">
<span className="text-body-sm font-body-sm text-on-surface-variant font-medium">Demandes d'accès</span>
<div className="w-8 h-8 rounded-xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-container group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-[18px]">how_to_reg</span>
</div>
</div>
<div className="flex flex-col gap-0.5 mt-space-sm">
<span className="text-headline-xl font-headline-xl text-on-surface tracking-tight">12</span>
<span className="text-body-sm font-body-sm text-on-tertiary-container font-semibold">En attente • 4 B2B</span>
</div>
</a>
{/*  KPI 3  */}
<div className="group rounded-2xl bg-surface-container-lowest p-space-md shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between">
<div className="flex items-center justify-between">
<span className="text-body-sm font-body-sm text-on-surface-variant font-medium">Comptes suspendus</span>
<div className="w-8 h-8 rounded-xl bg-error-container flex items-center justify-center text-on-error-container group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-[18px]">person_off</span>
</div>
</div>
<div className="flex flex-col gap-0.5 mt-space-sm">
<span className="text-headline-xl font-headline-xl text-on-surface tracking-tight">3</span>
<span className="text-body-sm font-body-sm text-error font-semibold">Revue requise</span>
</div>
</div>
{/*  KPI 4  */}
<div className="group rounded-2xl bg-surface-container-lowest p-space-md shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between">
<div className="flex items-center justify-between">
<span className="text-body-sm font-body-sm text-on-surface-variant font-medium">Activité du jour</span>
<div className="w-8 h-8 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-[18px]">history</span>
</div>
</div>
<div className="flex flex-col gap-0.5 mt-space-sm">
<span className="text-headline-xl font-headline-xl text-on-surface tracking-tight">184</span>
<span className="text-body-sm font-body-sm text-on-surface-variant">Actions / 24h</span>
</div>
</div>
{/*  KPI 5  */}
<a className="group rounded-2xl bg-surface-container-lowest p-space-md shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between" data-path="workspace" href="#">
<div className="flex items-center justify-between">
<span className="text-body-sm font-body-sm text-on-surface-variant font-medium">Projets actifs</span>
<div className="w-8 h-8 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-[18px]">folder_open</span>
</div>
</div>
<div className="flex flex-col gap-0.5 mt-space-sm">
<span className="text-headline-xl font-headline-xl text-on-surface tracking-tight">26</span>
<span className="text-body-sm font-body-sm text-secondary font-medium">Workspace actif</span>
</div>
</a>
{/*  KPI 6  */}
<div className="group rounded-2xl bg-surface-container-lowest p-space-md shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between">
<div className="flex items-center justify-between">
<span className="text-body-sm font-body-sm text-on-surface-variant font-medium">Alertes métier</span>
<div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-700 group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-[18px]">notifications_active</span>
</div>
</div>
<div className="flex flex-col gap-0.5 mt-space-sm">
<span className="text-headline-xl font-headline-xl text-on-surface tracking-tight">7</span>
<span className="text-body-sm font-body-sm text-amber-700 font-semibold">Attention admin</span>
</div>
</div>
</section>
{/*  5. BLOC PRINCIPAL : DEMANDES D'ACCÈS & RÉPARTITION  */}
<section className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg">
{/*  GAUCHE : DEMANDES D'ACCÈS À TRAITER (7 COLS)  */}
<div className="xl:col-span-7 flex flex-col rounded-2xl bg-surface-container-lowest shadow-md p-space-md lg:p-space-lg gap-space-md">
<div className="flex items-center justify-between pb-space-xs">
<div className="flex items-center gap-space-sm">
<div className="w-8 h-8 rounded-xl bg-secondary-container text-on-secondary flex items-center justify-center">
<span className="material-symbols-outlined text-[20px]">verified_user</span>
</div>
<div>
<h2 className="text-headline-sm font-headline-sm text-on-surface">Demandes d'accès à traiter</h2>
<p className="text-body-sm font-body-sm text-on-surface-variant">Arbitrages et validations hiérarchiques des rôles</p>
</div>
</div>
<span className="px-space-sm py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-label-sm font-label-sm font-bold">
          12 en attente
        </span>
</div>
{/*  Liste des demandes  */}
<div className="flex flex-col gap-space-sm max-h-[380px] overflow-y-auto pr-1">
{/*  Demande 1  */}
<div className="flex flex-col sm:flex-row sm:items-center justify-between p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all gap-space-sm">
<div className="flex items-start gap-space-sm">
<div className="w-10 h-10 rounded-full bg-primary-container text-on-primary font-bold flex items-center justify-center text-label-md font-label-md shrink-0">
              JD
            </div>
<div className="flex flex-col">
<div className="flex items-center gap-space-xs flex-wrap">
<span className="text-label-lg font-label-lg text-on-surface">Jean Dupont</span>
<span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-sm font-label-sm">Collaborateur</span>
<span className="text-body-sm font-body-sm text-on-surface-variant">• Pôle Formation</span>
</div>
<div className="flex items-center gap-space-xs text-body-sm font-body-sm text-on-surface-variant mt-0.5">
<span className="">Rôle demandé : <strong className="text-on-surface font-label-md">Instructeur Systèmes</strong></span>
<span className="">• Score eIDAS : 98%</span>
</div><div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary-container/10 text-secondary text-[11px] font-medium mt-1 w-fit"><span className="material-symbols-outlined text-[14px] text-tertiary-fixed-dim">auto_awesome</span><span className="">Recommandation IA : <strong>Approuver</strong> (Risque calculé: 0.02%)</span></div>
<span className="text-label-sm font-label-sm text-on-surface-variant mt-1 flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">schedule</span> Il y a 12 min
              </span>
</div>
</div>
<div className="flex items-center gap-space-xs self-end sm:self-center">
<button className="px-space-sm py-1.5 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-on-surface text-label-sm font-label-sm shadow-sm transition-colors" type="button">
              Examiner
            </button>
<button className="px-space-sm py-1.5 rounded-lg bg-secondary-container hover:bg-secondary text-on-secondary text-label-sm font-label-sm shadow-sm transition-colors" type="button">
              Approuver
            </button>
<button className="px-space-sm py-1.5 rounded-lg bg-surface-container-high hover:bg-error-container hover:text-on-error-container text-on-surface-variant text-label-sm font-label-sm transition-colors" type="button">
              Rejeter
            </button>
</div>
</div>
{/*  Demande 2  */}
<div className="flex flex-col sm:flex-row sm:items-center justify-between p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all gap-space-sm">
<div className="flex items-start gap-space-sm">
<div className="w-10 h-10 rounded-full bg-secondary text-on-secondary font-bold flex items-center justify-center text-label-md font-label-md shrink-0">
              MX
            </div>
<div className="flex flex-col">
<div className="flex items-center gap-space-xs flex-wrap">
<span className="text-label-lg font-label-lg text-on-surface">Marie X</span>
<span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface text-label-sm font-label-sm">Responsable</span>
<span className="text-body-sm font-body-sm text-on-surface-variant">• AZ Corp Yaoundé</span>
</div>
<div className="flex items-center gap-space-xs text-body-sm font-body-sm text-on-surface-variant mt-0.5">
<span className="">Rôle demandé : <strong className="text-on-surface font-label-md">Responsable Pipeline CRM</strong></span>
<span className="">• Justificatif RH validé</span>
</div><div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary-container/10 text-secondary text-[11px] font-medium mt-1 w-fit"><span className="material-symbols-outlined text-[14px] text-tertiary-fixed-dim">auto_awesome</span><span className="">Recommandation IA : <strong>Approuver</strong> (Risque calculé: 0.02%)</span></div>
<span className="text-label-sm font-label-sm text-on-surface-variant mt-1 flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">schedule</span> Il y a 28 min
              </span>
</div>
</div>
<div className="flex items-center gap-space-xs self-end sm:self-center">
<button className="px-space-sm py-1.5 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-on-surface text-label-sm font-label-sm shadow-sm transition-colors" type="button">
              Examiner
            </button>
<button className="px-space-sm py-1.5 rounded-lg bg-secondary-container hover:bg-secondary text-on-secondary text-label-sm font-label-sm shadow-sm transition-colors" type="button">
              Approuver
            </button>
<button className="px-space-sm py-1.5 rounded-lg bg-surface-container-high hover:bg-error-container hover:text-on-error-container text-on-surface-variant text-label-sm font-label-sm transition-colors" type="button">
              Rejeter
            </button>
</div>
</div>
{/*  Demande 3  */}
<div className="flex flex-col sm:flex-row sm:items-center justify-between p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all gap-space-sm">
<div className="flex items-start gap-space-sm">
<div className="w-10 h-10 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center text-label-md font-label-md shrink-0">
              DY
            </div>
<div className="flex flex-col">
<div className="flex items-center gap-space-xs flex-wrap">
<span className="text-label-lg font-label-lg text-on-surface">David Y</span>
<span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-label-sm font-label-sm">Client B2B</span>
<span className="text-body-sm font-body-sm text-on-surface-variant">• Global Tech SARL</span>
</div>
<div className="flex items-center gap-space-xs text-body-sm font-body-sm text-on-surface-variant mt-0.5">
<span className="">Rôle demandé : <strong className="text-on-surface font-label-md">Portail Projets &amp; Facturation</strong></span>
<span className="">• Score eIDAS : 94%</span>
</div><div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary-container/10 text-secondary text-[11px] font-medium mt-1 w-fit"><span className="material-symbols-outlined text-[14px] text-tertiary-fixed-dim">auto_awesome</span><span className="">Recommandation IA : <strong>Approuver</strong> (Partenaire certifié vérifié)</span></div><div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary-container/10 text-secondary text-[11px] font-medium mt-1 w-fit"><span className="material-symbols-outlined text-[14px] text-tertiary-fixed-dim">auto_awesome</span><span className="">Recommandation IA : <strong>Approuver</strong> (Risque calculé: 0.02%)</span></div>
<span className="text-label-sm font-label-sm text-on-surface-variant mt-1 flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">schedule</span> Il y a 1h
              </span>
</div>
</div>
<div className="flex items-center gap-space-xs self-end sm:self-center">
<button className="px-space-sm py-1.5 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-on-surface text-label-sm font-label-sm shadow-sm transition-colors" type="button">
              Examiner
            </button>
<button className="px-space-sm py-1.5 rounded-lg bg-secondary-container hover:bg-secondary text-on-secondary text-label-sm font-label-sm shadow-sm transition-colors" type="button">
              Approuver
            </button>
<button className="px-space-sm py-1.5 rounded-lg bg-surface-container-high hover:bg-error-container hover:text-on-error-container text-on-surface-variant text-label-sm font-label-sm transition-colors" type="button">
              Rejeter
            </button>
</div>
</div>
{/*  Demande 4  */}
<div className="flex flex-col sm:flex-row sm:items-center justify-between p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all gap-space-sm">
<div className="flex items-start gap-space-sm">
<div className="w-10 h-10 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-bold flex items-center justify-center text-label-md font-label-md shrink-0">
              BF
            </div>
<div className="flex flex-col">
<div className="flex items-center gap-space-xs flex-wrap">
<span className="text-label-lg font-label-lg text-on-surface">Blandine Fotso</span>
<span className="px-2 py-0.5 rounded-full bg-tertiary-fixed-dim/30 text-on-surface text-label-sm font-label-sm">Apprenante</span>
<span className="text-body-sm font-body-sm text-on-surface-variant">• Certifiée MINEFOP</span>
</div>
<div className="flex items-center gap-space-xs text-body-sm font-body-sm text-on-surface-variant mt-0.5">
<span className="">Rôle demandé : <strong className="text-on-surface font-label-md">Accès E-Learning Avancé</strong></span>
<span className="">• Matricule certifié</span>
</div><div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary-container/10 text-secondary text-[11px] font-medium mt-1 w-fit"><span className="material-symbols-outlined text-[14px] text-tertiary-fixed-dim">auto_awesome</span><span className="">Recommandation IA : <strong>Approuver</strong> (Risque calculé: 0.02%)</span></div>
<span className="text-label-sm font-label-sm text-on-surface-variant mt-1 flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">schedule</span> Il y a 1h 40min
              </span>
</div>
</div>
<div className="flex items-center gap-space-xs self-end sm:self-center">
<button className="px-space-sm py-1.5 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-on-surface text-label-sm font-label-sm shadow-sm transition-colors" type="button">
              Examiner
            </button>
<button className="px-space-sm py-1.5 rounded-lg bg-secondary-container hover:bg-secondary text-on-secondary text-label-sm font-label-sm shadow-sm transition-colors" type="button">
              Approuver
            </button>
<button className="px-space-sm py-1.5 rounded-lg bg-surface-container-high hover:bg-error-container hover:text-on-error-container text-on-surface-variant text-label-sm font-label-sm transition-colors" type="button">
              Rejeter
            </button>
</div>
</div>
</div>
<div className="pt-space-xs flex justify-end">
<a className="inline-flex items-center gap-space-xs text-secondary hover:text-secondary-container font-label-md text-label-md" data-path="demandes-acces" href="#">
<span className="">Voir toutes les 12 demandes</span>
<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</a>
</div>
</div>
{/*  DROITE : SYNTHÈSE DES COMPTES & RÉPARTITION (5 COLS)  */}
<div className="xl:col-span-5 flex flex-col rounded-2xl bg-surface-container-lowest shadow-md p-space-md lg:p-space-lg gap-space-md">
<div className="flex items-center justify-between pb-space-xs">
<div className="flex items-center gap-space-sm">
<div className="w-8 h-8 rounded-xl bg-primary text-on-primary flex items-center justify-center">
<span className="material-symbols-outlined text-[20px]">badge</span>
</div>
<div>
<h2 className="text-headline-sm font-headline-sm text-on-surface">Synthèse des comptes</h2>
<p className="text-body-sm font-body-sm text-on-surface-variant">Statut global des 271 identités</p>
</div>
</div>
</div>
{/*  Statuts rapides  */}
<div className="grid grid-cols-4 gap-space-xs">
<div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col items-center text-center">
<div className="flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-emerald-500"></span>
<span className="text-headline-sm font-headline-sm text-on-surface">248</span>
</div>
<span className="text-label-sm font-label-sm text-on-surface-variant">Actifs</span>
</div>
<div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col items-center text-center">
<div className="flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-amber-500"></span>
<span className="text-headline-sm font-headline-sm text-on-surface">12</span>
</div>
<span className="text-label-sm font-label-sm text-on-surface-variant">Attente</span>
</div>
<div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col items-center text-center">
<div className="flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-error"></span>
<span className="text-headline-sm font-headline-sm text-on-surface">3</span>
</div>
<span className="text-label-sm font-label-sm text-on-surface-variant">Suspendus</span>
</div>
<div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col items-center text-center">
<div className="flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-outline"></span>
<span className="text-headline-sm font-headline-sm text-on-surface">8</span>
</div>
<span className="text-label-sm font-label-sm text-on-surface-variant">Inactifs</span>
</div>
</div>
{/*  Répartition graphique (Donut SVG + Légendes)  */}
<div className="flex flex-col gap-space-sm pt-space-xs">
<span className="text-label-md font-label-md text-on-surface font-bold">Répartition par collège d'utilisateurs</span>
<div className="flex items-center gap-space-md">
{/*  Donut SVG  */}
<div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
<svg className="w-36 h-36 -rotate-90" viewBox="0 0 100 100">
{/*  Collaborateurs 38%  */}
<circle cx="50" cy="50" fill="none" r="38" stroke="#004ad1" stroke-dasharray="238.76" stroke-dashoffset="0" stroke-width="12"></circle>
{/*  Clients 25%  */}
<circle cx="50" cy="50" fill="none" r="38" stroke="#1a62fe" stroke-dasharray="238.76" stroke-dashoffset="-90.73" stroke-width="12"></circle>
{/*  Apprenants 23%  */}
<circle cx="50" cy="50" fill="none" r="38" stroke="#ffba20" stroke-dasharray="238.76" stroke-dashoffset="-150.42" stroke-width="12"></circle>
{/*  Parents 11%  */}
<circle cx="50" cy="50" fill="none" r="38" stroke="#0b2545" stroke-dasharray="238.76" stroke-dashoffset="-205.33" stroke-width="12"></circle>
{/*  Responsables 3%  */}
<circle cx="50" cy="50" fill="none" r="38" stroke="#74777f" stroke-dasharray="238.76" stroke-dashoffset="-231.6" stroke-width="12"></circle>
</svg>
<div className="absolute inset-0 flex flex-col items-center justify-center text-center">
<span className="text-headline-md font-headline-md text-on-surface font-bold">248</span>
<span className="text-label-sm font-label-sm text-on-surface-variant">Membres</span>
</div>
</div>
{/*  Légendes avec effectifs  */}
<div className="flex flex-col gap-1.5 flex-1 text-label-sm font-label-sm">
<div className="flex items-center justify-between">
<span className="flex items-center gap-1.5 text-on-surface"><span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>Collaborateurs (38%)</span>
<span className="text-on-surface-variant font-bold">94</span>
</div>
<div className="flex items-center justify-between">
<span className="flex items-center gap-1.5 text-on-surface"><span className="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>Clients Entreprises (25%)</span>
<span className="text-on-surface-variant font-bold">61</span>
</div>
<div className="flex items-center justify-between">
<span className="flex items-center gap-1.5 text-on-surface"><span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed-dim"></span>Apprenants MINEFOP (23%)</span>
<span className="text-on-surface-variant font-bold">58</span>
</div>
<div className="flex items-center justify-between">
<span className="flex items-center gap-1.5 text-on-surface"><span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span>Parents d'élèves (11%)</span>
<span className="text-on-surface-variant font-bold">27</span>
</div>
<div className="flex items-center justify-between">
<span className="flex items-center gap-1.5 text-on-surface"><span className="w-2.5 h-2.5 rounded-full bg-outline"></span>Responsables Pôles (3%)</span>
<span className="text-on-surface-variant font-bold">8</span>
</div>
</div>
</div>
</div>
<div className="pt-space-xs flex justify-end">
<a className="inline-flex items-center gap-space-xs text-secondary hover:text-secondary-container font-label-md text-label-md" data-path="utilisateurs" href="#">
<span className="">Gérer l'annuaire des utilisateurs</span>
<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</a>
</div>
</div>
</section>
{/*  6. VUE MÉTIER GLOBALE : PILOTAGE DES 5 PÔLES AZ CORP  */}
<section className="flex flex-col rounded-2xl bg-surface-container-lowest shadow-md p-space-md lg:p-space-lg gap-space-md">
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
<div className="flex items-center gap-space-sm">
<div className="w-8 h-8 rounded-xl bg-primary-container text-on-primary flex items-center justify-center">
<span className="material-symbols-outlined text-[20px]">domain</span>
</div>
<div>
<h2 className="text-headline-sm font-headline-sm text-on-surface">Vue Métier Globale • 5 Pôles Opérationnels</h2>
<p className="text-body-sm font-body-sm text-on-surface-variant">Pilotage exécutif des divisions stratégiques AZ Corporation</p>
</div>
</div>
<div className="flex items-center gap-space-sm"><span className="text-label-sm font-label-sm text-on-surface-variant hidden sm:inline">Semaine 42 • Q4</span><button className="inline-flex items-center gap-1 px-space-sm py-1 rounded-lg bg-surface-container-low hover:bg-secondary-fixed/40 text-secondary font-label-sm text-label-sm transition-colors cursor-pointer border border-secondary-container/20"><span className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim">auto_awesome</span><span className="">Audit IA des Pôles</span></button></div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-space-md">
{/*  Pôle 1 : CRM & Ventes  */}
<a className="group p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col justify-between gap-space-sm" data-path="crm" href="#">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-secondary text-[20px]">hub</span>
<span className="text-label-md font-label-md text-on-surface font-bold">CRM &amp; Ventes</span>
</div>
<span className="w-2 h-2 rounded-full bg-emerald-500"></span>
</div>
<div className="flex flex-col gap-1">
<span className="text-headline-lg font-headline-lg text-on-surface">14</span>
<span className="text-body-sm font-body-sm text-on-surface-variant">opportunités actives</span>
<div className="mt-1 pt-2 border-t border-surface-container flex flex-col gap-0.5">
<span className="text-label-sm font-label-sm text-secondary font-bold">48.2M FCFA</span>
<span className="text-body-sm font-body-sm text-on-surface-variant">3 contrats prêts à signer</span>
</div>
</div>
</a>
{/*  Pôle 2 : Formation  */}
<a className="group p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col justify-between gap-space-sm" data-path="formation" href="#">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-on-tertiary-container text-[20px]">school</span>
<span className="text-label-md font-label-md text-on-surface font-bold">Formation MINEFOP</span>
</div>
<span className="w-2 h-2 rounded-full bg-emerald-500"></span>
</div>
<div className="flex flex-col gap-1">
<span className="text-headline-lg font-headline-lg text-on-surface">86</span>
<span className="text-body-sm font-body-sm text-on-surface-variant">apprenants inscrits</span>
<div className="mt-1 pt-2 border-t border-surface-container flex flex-col gap-0.5">
<span className="text-label-sm font-label-sm text-on-tertiary-container font-bold">6 cohortes actives</span>
<span className="text-body-sm font-body-sm text-on-surface-variant">42 cours programmés</span>
</div>
</div>
</a>
{/*  Pôle 3 : Workspace  */}
<a className="group p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col justify-between gap-space-sm" data-path="workspace" href="#">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-secondary-container text-[20px]">workspaces</span>
<span className="text-label-md font-label-md text-on-surface font-bold">Workspace &amp; Projets</span>
</div>
<span className="w-2 h-2 rounded-full bg-emerald-500"></span>
</div>
<div className="flex flex-col gap-1">
<span className="text-headline-lg font-headline-lg text-on-surface">21</span>
<span className="text-body-sm font-body-sm text-on-surface-variant">projets en cours</span>
<div className="mt-1 pt-2 border-t border-surface-container flex flex-col gap-0.5">
<span className="text-label-sm font-label-sm text-on-surface font-bold">Douala Edge: 85%</span>
<span className="text-body-sm font-body-sm text-on-surface-variant">Refonte Cloud: 62%</span>
</div>
</div>
</a>
{/*  Pôle 4 : IT & Infrastructure  */}
<a className="group p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col justify-between gap-space-sm" data-path="infrastructure-it" href="#">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[20px]">dns</span>
<span className="text-label-md font-label-md text-on-surface font-bold">IT &amp; Systèmes</span>
</div>
<span className="w-2 h-2 rounded-full bg-emerald-500"></span>
</div>
<div className="flex flex-col gap-1">
<span className="text-headline-lg font-headline-lg text-on-surface">8</span>
<span className="text-body-sm font-body-sm text-on-surface-variant">incidents ouverts</span>
<div className="mt-1 pt-2 border-t border-surface-container flex flex-col gap-0.5">
<span className="text-label-sm font-label-sm text-emerald-600 font-bold">0 critique bloquant</span>
<span className="text-body-sm font-body-sm text-on-surface-variant">7 maintenances planifiées</span>
</div>
</div>
</a>
{/*  Pôle 5 : Knowledge Hub  */}
<a className="group p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col justify-between gap-space-sm" data-path="knowledge-hub" href="#">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-on-surface text-[20px]">menu_book</span>
<span className="text-label-md font-label-md text-on-surface font-bold">Knowledge Hub</span>
</div>
<span className="w-2 h-2 rounded-full bg-emerald-500"></span>
</div>
<div className="flex flex-col gap-1">
<span className="text-headline-lg font-headline-lg text-on-surface">34</span>
<span className="text-body-sm font-body-sm text-on-surface-variant">documents publiés</span>
<div className="mt-1 pt-2 border-t border-surface-container flex flex-col gap-0.5">
<span className="text-label-sm font-label-sm text-on-surface font-bold">12 procédures RH</span>
<span className="text-body-sm font-body-sm text-on-surface-variant">22 manuels techniques</span>
</div>
</div>
</a>
</div>
</section>
{/*  7. SECTION DU BAS : ACTIVITÉ RÉCENTE (ACTIONS MÉTIER) & DISPONIBILITÉ DES MODULES  */}
<section className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg">
{/*  ACTIVITÉ RÉCENTE (8 COLS)  */}
<div className="xl:col-span-8 flex flex-col rounded-2xl bg-surface-container-lowest shadow-md p-space-md lg:p-space-lg gap-space-md">
<div className="flex items-center justify-between pb-space-xs">
<div className="flex items-center gap-space-sm">
<div className="w-8 h-8 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center">
<span className="material-symbols-outlined text-[20px]">history_toggle_off</span>
</div>
<div>
<h2 className="text-headline-sm font-headline-sm text-on-surface">Activité Récente • Gouvernance &amp; Organisation</h2>
<p className="text-body-sm font-body-sm text-on-surface-variant">Journal des décisions administratives et mouvements RH</p>
</div>
</div>
<span className="text-label-sm font-label-sm text-on-surface-variant">Aujourd'hui</span>
</div>
<div className="flex flex-col gap-space-sm">
<div className="flex items-start gap-space-sm p-space-sm rounded-xl hover:bg-surface-container-low transition-colors">
<div className="w-8 h-8 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center shrink-0 mt-0.5">
<span className="material-symbols-outlined text-[18px]">verified</span>
</div>
<div className="flex flex-col flex-1">
<div className="flex items-center justify-between">
<span className="text-label-md font-label-md text-on-surface">Rôle attribué par DG (Dr. Marc V.)</span>
<span className="text-body-sm font-body-sm text-on-surface-variant">10:42</span>
</div>
<p className="text-body-sm font-body-sm text-on-surface-variant">
              Attribution du rôle <strong className="text-on-surface">Responsable CRM</strong> au collaborateur <strong className="text-on-surface">Jean Dupont</strong> avec permissions devis.
            </p>
</div>
</div>
<div className="flex items-start gap-space-sm p-space-sm rounded-xl hover:bg-surface-container-low transition-colors">
<div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
<span className="material-symbols-outlined text-[18px]">check_circle</span>
</div>
<div className="flex flex-col flex-1">
<div className="flex items-center justify-between">
<span className="text-label-md font-label-md text-on-surface">Demande d'accès #REQ-8849 approuvée</span>
<span className="text-body-sm font-body-sm text-on-surface-variant">10:31</span>
</div>
<p className="text-body-sm font-body-sm text-on-surface-variant">
              Validation de l'onboarding pour <strong className="text-on-surface">Marie X</strong> (Responsable CRM AZ Corp Yaoundé).
            </p>
</div>
</div>
<div className="flex items-start gap-space-sm p-space-sm rounded-xl hover:bg-surface-container-low transition-colors">
<div className="w-8 h-8 rounded-full bg-error-container text-on-error-container flex items-center justify-center shrink-0 mt-0.5">
<span className="material-symbols-outlined text-[18px]">lock_clock</span>
</div>
<div className="flex flex-col flex-1">
<div className="flex items-center justify-between">
<span className="text-label-md font-label-md text-error">Compte suspendu : Boris Deffo</span>
<span className="text-body-sm font-body-sm text-on-surface-variant">10:18</span>
</div>
<p className="text-body-sm font-body-sm text-on-surface-variant">
              Fin de contrat de stage N1. Les accès aux modules Workspace et Knowledge Hub ont été révoqués par sécurité.
            </p>
</div>
</div>
<div className="flex items-start gap-space-sm p-space-sm rounded-xl hover:bg-surface-container-low transition-colors">
<div className="w-8 h-8 rounded-full bg-tertiary-fixed text-on-tertiary-container flex items-center justify-center shrink-0 mt-0.5">
<span className="material-symbols-outlined text-[18px]">key</span>
</div>
<div className="flex flex-col flex-1">
<div className="flex items-center justify-between">
<span className="text-label-md font-label-md text-on-surface">Permission sensible modifiée</span>
<span className="text-body-sm font-body-sm text-on-surface-variant">09:52</span>
</div>
<p className="text-body-sm font-body-sm text-on-surface-variant">
              Mise à jour de la délégation de signature financière pour les propositions commerciales excédant <strong className="text-on-surface">5 000 000 FCFA</strong>.
            </p>
</div>
</div>
<div className="flex items-start gap-space-sm p-space-sm rounded-xl hover:bg-surface-container-low transition-colors">
<div className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center shrink-0 mt-0.5">
<span className="material-symbols-outlined text-[18px]">person_add</span>
</div>
<div className="flex flex-col flex-1">
<div className="flex items-center justify-between">
<span className="text-label-md font-label-md text-on-surface">Nouveau collaborateur enregistré</span>
<span className="text-body-sm font-body-sm text-on-surface-variant">09:40</span>
</div>
<p className="text-body-sm font-body-sm text-on-surface-variant">
              Création du profil de <strong className="text-on-surface">Samuel Ekwalla</strong> (Ingénieur DevOps, Bureau Douala).
            </p>
</div>
</div>
</div>
<div className="pt-space-xs flex justify-end">
<a className="inline-flex items-center gap-space-xs text-secondary hover:text-secondary-container font-label-md text-label-md" data-path="journal-activite" href="#">
<span className="">Consulter le journal d'activité complet</span>
<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</a>
</div>
</div>
{/*  DISPONIBILITÉ DES 7 MODULES OPÉRATIONNELS (4 COLS)  */}
<div className="xl:col-span-4 flex flex-col rounded-2xl bg-surface-container-lowest shadow-md p-space-md lg:p-space-lg gap-space-md">
<div className="flex items-center justify-between pb-space-xs">
<div className="flex items-center gap-space-sm">
<div className="w-8 h-8 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center">
<span className="material-symbols-outlined text-[20px]">toggle_on</span>
</div>
<div>
<h2 className="text-headline-sm font-headline-sm text-on-surface">Modules Opérationnels</h2>
<p className="text-body-sm font-body-sm text-on-surface-variant">État des services plateforme</p>
</div>
</div>
<span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
</div>
<div className="flex flex-col gap-2">
<div className="flex items-center justify-between p-space-xs px-space-sm rounded-xl bg-surface-container-low">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-secondary text-[18px]">hub</span>
<span className="text-label-md font-label-md text-on-surface">CRM Commercial</span>
</div>
<span className="inline-flex items-center gap-1.5 text-emerald-600 font-label-sm text-label-sm">
<span className="w-2 h-2 rounded-full bg-emerald-500"></span>
<span className="">Opérationnel</span>
</span>
</div>
<div className="flex items-center justify-between p-space-xs px-space-sm rounded-xl bg-surface-container-low">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-on-tertiary-container text-[18px]">school</span>
<span className="text-label-md font-label-md text-on-surface">Formation Institut</span>
</div>
<span className="inline-flex items-center gap-1.5 text-emerald-600 font-label-sm text-label-sm">
<span className="w-2 h-2 rounded-full bg-emerald-500"></span>
<span className="">Opérationnel</span>
</span>
</div>
<div className="flex items-center justify-between p-space-xs px-space-sm rounded-xl bg-surface-container-low">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-secondary-container text-[18px]">workspaces</span>
<span className="text-label-md font-label-md text-on-surface">Workspace &amp; Projets</span>
</div>
<span className="inline-flex items-center gap-1.5 text-emerald-600 font-label-sm text-label-sm">
<span className="w-2 h-2 rounded-full bg-emerald-500"></span>
<span className="">Opérationnel</span>
</span>
</div>
<div className="flex items-center justify-between p-space-xs px-space-sm rounded-xl bg-surface-container-low">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-on-surface text-[18px]">menu_book</span>
<span className="text-label-md font-label-md text-on-surface">Knowledge Hub</span>
</div>
<span className="inline-flex items-center gap-1.5 text-emerald-600 font-label-sm text-label-sm">
<span className="w-2 h-2 rounded-full bg-emerald-500"></span>
<span className="">Opérationnel</span>
</span>
</div>
<div className="flex items-center justify-between p-space-xs px-space-sm rounded-xl bg-surface-container-low">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-primary text-[18px]">dns</span>
<span className="text-label-md font-label-md text-on-surface">Infrastructure &amp; IT</span>
</div>
<span className="inline-flex items-center gap-1.5 text-emerald-600 font-label-sm text-label-sm">
<span className="w-2 h-2 rounded-full bg-emerald-500"></span>
<span className="">Opérationnel</span>
</span>
</div>
<div className="flex items-center justify-between p-space-xs px-space-sm rounded-xl bg-surface-container-low">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-secondary text-[18px]">query_stats</span>
<span className="text-label-md font-label-md text-on-surface">Analytics Direction</span>
</div>
<span className="inline-flex items-center gap-1.5 text-emerald-600 font-label-sm text-label-sm">
<span className="w-2 h-2 rounded-full bg-emerald-500"></span>
<span className="">Opérationnel</span>
</span>
</div>
<div className="flex items-center justify-between p-space-xs px-space-sm rounded-xl bg-surface-container-low">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-tertiary-fixed-dim text-[18px]">auto_awesome</span>
<span className="text-label-md font-label-md text-on-surface">AI Workspace</span>
</div>
<span className="inline-flex items-center gap-1.5 text-emerald-600 font-label-sm text-label-sm">
<span className="w-2 h-2 rounded-full bg-emerald-500"></span>
<span className="">Opérationnel</span>
</span>
</div>
</div>
<div className="p-space-sm rounded-xl bg-surface-container-low mt-auto flex items-center justify-between">
<div className="flex flex-col">
<span className="text-label-sm font-label-sm text-on-surface font-bold">Disponibilité globale</span>
<span className="text-body-sm font-body-sm text-on-surface-variant">SLA 99.98% respecté</span>
</div>
<span className="material-symbols-outlined text-emerald-600 text-[22px]">verified</span>
</div>
</div>
</section>
</div>
<aside className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 group"><div className="hidden group-hover:flex flex-col w-80 bg-surface-container-lowest rounded-2xl shadow-[0_12px_32px_-4px_rgba(11,37,69,0.35)] border border-secondary-container/20 p-space-md transition-all duration-200 animate-pulse-none"><div className="flex items-center justify-between pb-space-xs border-b border-surface-container"><div className="flex items-center gap-space-xs"><div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-tertiary-fixed-dim"><span className="material-symbols-outlined text-[18px]">auto_awesome</span></div><div><h4 className="text-label-md font-label-md text-on-surface font-bold">AZ Copilot IA</h4><p className="text-[11px] text-emerald-600 font-medium">● Prêt pour analyse DG</p></div></div><span className="px-1.5 py-0.5 rounded-full bg-secondary-fixed text-secondary text-[10px] font-bold uppercase">v2.4</span></div><div className="py-space-xs flex flex-col gap-1.5 text-body-sm font-body-sm"><p className="text-on-surface-variant text-[12px]">Suggestions d'actions exécutives :</p><button className="text-left px-2.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-secondary-fixed/30 text-on-surface text-[12px] transition-colors flex items-center justify-between"><span className="">"Résumer les alertes de la semaine"</span><span className="material-symbols-outlined text-[14px] text-secondary">arrow_forward</span></button><button className="text-left px-2.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-secondary-fixed/30 text-on-surface text-[12px] transition-colors flex items-center justify-between"><span className="">"Auditer les permissions sensibles"</span><span className="material-symbols-outlined text-[14px] text-secondary">arrow_forward</span></button><button className="text-left px-2.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-secondary-fixed/30 text-on-surface text-[12px] transition-colors flex items-center justify-between"><span className="">"Générer rapport d'arbitrage 12 accès"</span><span className="material-symbols-outlined text-[14px] text-secondary">arrow_forward</span></button></div><div className="relative flex items-center mt-1"><input className="w-full pl-3 pr-8 py-1.5 bg-surface-container-low text-on-surface rounded-xl text-body-sm font-body-sm placeholder:text-on-surface-variant focus:outline-none text-[12px]" placeholder="Poser une question à l'IA..." type="text" /><span className="material-symbols-outlined absolute right-2 text-secondary text-[18px] cursor-pointer">send</span></div></div><button className="flex items-center gap-space-xs px-space-md py-3 rounded-full bg-primary hover:bg-primary-container text-on-primary shadow-[0_12px_32px_-4px_rgba(11,37,69,0.35)] hover:shadow-xl transition-all duration-200 cursor-pointer border border-tertiary-fixed-dim/30"><span className="material-symbols-outlined text-[20px] text-tertiary-fixed-dim animate-bounce">auto_awesome</span><span className="text-label-md font-label-md">AZ Copilot IA</span><span className="w-2 h-2 rounded-full bg-emerald-400"></span></button></aside></main>