<main className="relative pt-16 bg-surface min-h-screen w-full px-space-lg"><div className="flex flex-col w-full pb-space-xl tab-pane" id="view-dashboard">
{/*  Top Banner & Context Control Area  */}
<div className="py-space-md flex flex-col md:flex-row md:items-center justify-between gap-space-md">
<div className="flex flex-col">
<div className="flex items-center gap-space-xs text-secondary font-label-md">
<span className="material-symbols-outlined text-[16px]">verified_user</span>
<span className="uppercase tracking-wider">Portail Sécurisé Famille &amp; Tuteurs</span>
</div>
<h1 className="font-headline-lg text-headline-lg text-primary mt-1">Espace Parents &amp; Tuteurs • Suivi Académique et Financier</h1>
<p className="font-body-md text-body-md text-on-surface-variant">Supervision pédagogique, présences en temps réel et quittances d'inscriptions AZ Pulse</p>
</div>
{/*  Active Child Switcher Selector Dropdown  */}
<div className="relative inline-block text-left self-start md:self-auto">
<label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Apprenant supervisé</label>
<div className="relative">
<button className="flex items-center justify-between gap-space-md px-space-md py-2.5 rounded-xl bg-surface-container-lowest text-primary shadow-sm hover:shadow transition-all group min-w-[320px]" id="childSelectorBtn" type="button">
<div className="flex items-center gap-space-sm text-left">
<div className="w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-sm">
              JD
            </div>
<div className="flex flex-col min-w-0">
<span className="font-label-lg text-label-lg text-primary font-bold truncate" id="currentChildName">Junior Dupont</span>
<span className="font-label-sm text-label-sm text-on-surface-variant truncate" id="currentChildPromo">Promo Dev Web &amp; Mobile MINEFOP</span>
</div>
</div>
<div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary-fixed transition-colors">
<span className="material-symbols-outlined text-[20px]">expand_more</span>
</div>
</button>
{/*  Dropdown Menu  */}
<div className="hidden absolute right-0 mt-2 w-full min-w-[340px] rounded-xl bg-surface-container-lowest shadow-xl z-30 p-space-xs transition-all" id="childDropdown">
<div className="px-space-sm py-space-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
            Sélectionner un autre enfant
          </div>
<button className="w-full flex items-center gap-space-sm px-space-sm py-2 rounded-lg bg-surface-container-high text-left hover:bg-surface-container transition-colors" onclick="switchChild('Junior Dupont', 'Promo Dev Web &amp; Mobile MINEFOP', 'JD', 'Dev Web &amp; Mobile Fullstack', '68%')" type="button">
<div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-xs font-bold">JD</div>
<div className="flex flex-col min-w-0 flex-1">
<span className="font-label-md text-label-md text-primary font-bold">Junior Dupont</span>
<span className="font-label-sm text-label-sm text-on-surface-variant truncate">Promo Dev Web &amp; Mobile MINEFOP</span>
</div>
<span className="material-symbols-outlined text-secondary text-[18px]">check</span>
</button>
<button className="w-full flex items-center gap-space-sm px-space-sm py-2 rounded-lg hover:bg-surface-container text-left transition-colors mt-1" onclick="switchChild('Sarah Dupont', 'Anglais Professionnel Intensif', 'SD', 'Anglais Certifié B2 Business', '42%')" type="button">
<div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-xs font-bold">SD</div>
<div className="flex flex-col min-w-0 flex-1">
<span className="font-label-md text-label-md text-primary font-bold">Sarah Dupont</span>
<span className="font-label-sm text-label-sm text-on-surface-variant truncate">Anglais Professionnel Intensif</span>
</div>
<span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant">B2</span>
</button>
<div className="mt-2 pt-2 px-space-xs flex justify-between items-center text-secondary">
<a className="font-label-sm text-label-sm font-semibold flex items-center gap-1 hover:underline" href="#">
<span className="material-symbols-outlined text-[16px]">add_circle</span> Inscrire un autre membre du foyer
            </a>
</div>
</div>
</div>
</div>
</div>
{/*  Hero Profile Bento Box  */}
<section className="mt-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-sm"><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs pb-space-sm border-b border-surface-variant"><div className="flex items-center gap-space-sm"><div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary"><span className="material-symbols-outlined text-[20px]">supervisor_account</span></div><div><h2 className="font-headline-sm text-headline-sm text-primary font-bold leading-tight">Mes Enfants Supervisés</h2><p className="font-body-sm text-body-sm text-on-surface-variant">Sélectionnez un profil pour adapter l'affichage du suivi académique et financier</p></div></div><div className="flex items-center gap-2"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface-variant font-medium"><span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span>2 Apprenants rattachés</span></div></div><div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md pt-space-md"><div className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low border border-secondary/40 shadow-sm"><div className="flex items-center gap-space-sm min-w-0"><div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm shrink-0 ring-2 ring-secondary/30">JD</div><div className="flex flex-col min-w-0"><div className="flex items-center gap-2"><span className="font-label-lg text-label-lg text-primary font-bold truncate">Junior Dupont</span><span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-semibold">#084</span><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-800 text-[11px] font-semibold"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>Actif</span></div><span className="font-label-sm text-label-sm text-on-surface-variant truncate">Dév. Web &amp; Mobile Fullstack</span></div></div><div className="flex items-center gap-space-md shrink-0"><div className="flex items-center gap-space-md text-right"><div className="flex flex-col"><span className="text-[10px] uppercase text-on-surface-variant font-medium">Moyenne</span><span className="font-label-md text-label-md font-bold text-primary">15.8 / 20</span></div><div className="flex flex-col"><span className="text-[10px] uppercase text-on-surface-variant font-medium">Assiduité</span><span className="font-label-md text-label-md font-bold text-secondary">96%</span></div></div><span className="p-1.5 rounded-lg bg-secondary text-on-secondary flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">check</span></span></div></div><div className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low/60 hover:bg-surface-container-low border border-transparent hover:border-surface-variant transition-colors"><div className="flex items-center gap-space-sm min-w-0"><div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-sm shrink-0">SD</div><div className="flex flex-col min-w-0"><div className="flex items-center gap-2"><span className="font-label-lg text-label-lg text-primary font-bold truncate">Sarah Dupont</span><span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-semibold">#112</span><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-medium">Apprenant</span></div><span className="font-label-sm text-label-sm text-on-surface-variant truncate">Design UI/UX &amp; 3D</span></div></div><div className="flex items-center gap-space-md shrink-0"><div className="flex items-center gap-space-md text-right"><div className="flex flex-col"><span className="text-[10px] uppercase text-on-surface-variant font-medium">Moyenne</span><span className="font-label-md text-label-md font-bold text-primary">16.5 / 20</span></div><div className="flex flex-col"><span className="text-[10px] uppercase text-on-surface-variant font-medium">Assiduité</span><span className="font-label-md text-label-md font-bold text-secondary">98%</span></div></div><button className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold transition-colors flex items-center gap-1" onclick="switchChild('Sarah Dupont', 'Anglais &amp; UI/UX Design', 'SD', 'Certification Infographie &amp; UI/UX 3D', '42%')" type="button"><span className="">Basculer</span><span className="material-symbols-outlined text-[14px]">sync_alt</span></button></div></div></div></section>
{/*  Dashboard KPIs Grid (4 Pillars)  */}
<div className="mt-space-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
{/*  KPI 1: Moyenne Générale  */}
<div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm hover:shadow-md transition-shadow relative">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Moyenne Générale</span>
<div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[18px]">workspace_premium</span>
</div>
</div>
<div className="flex items-baseline gap-2 mt-2">
<span className="font-headline-xl text-headline-xl text-primary font-extrabold tracking-tight">15.8</span>
<span className="font-body-md text-body-md text-on-surface-variant font-semibold">/ 20</span>
</div>
<div className="flex items-center justify-between mt-3 pt-2">
<span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">trending_up</span> Rang: 4e / 32
        </span>
<span className="font-label-sm text-label-sm text-on-surface-variant">Mention Bien</span>
</div>
</div>
{/*  KPI 2: Prochaines Évaluations  */}
<div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm hover:shadow-md transition-shadow">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Évaluations à venir</span>
<div className="w-8 h-8 rounded-lg bg-secondary-fixed text-secondary flex items-center justify-center">
<span className="material-symbols-outlined text-[18px]">event_upcoming</span>
</div>
</div>
<div className="flex items-baseline gap-2 mt-2">
<span className="font-headline-xl text-headline-xl text-primary font-extrabold tracking-tight">2</span>
<span className="font-body-md text-body-md text-on-surface-variant font-semibold">épreuves</span>
</div>
<div className="mt-3 text-on-surface-variant font-label-sm text-label-sm flex flex-col gap-0.5">
<div className="flex items-center justify-between">
<span className="truncate">Examen React &amp; API</span>
<span className="font-semibold text-primary shrink-0">14 Nov</span>
</div>
<div className="flex items-center justify-between">
<span className="truncate">Soutenance Projet</span>
<span className="font-semibold text-primary shrink-0">28 Nov</span>
</div>
</div>
</div>
{/*  KPI 3: Frais & Tranches  */}
<div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm hover:shadow-md transition-shadow">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Scolarité &amp; Solde</span>
<div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
</div>
</div>
<div className="flex items-baseline gap-1 mt-2">
<span className="font-headline-xl text-headline-xl text-primary font-extrabold tracking-tight">350,000</span>
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase">XAF</span>
</div>
<div className="mt-2">
<div className="flex justify-between font-label-sm text-label-sm mb-1">
<span className="text-on-surface-variant">Solde: 100,000 XAF</span>
<span className="font-semibold text-error">Échéance 30 Nov</span>
</div>
<div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden">
<div className="bg-primary h-full rounded-full" style={{ width: '77.7%' }}></div>
</div>
</div>
</div>
{/*  KPI 4: Statut Dossier Administratif  */}
<div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm hover:shadow-md transition-shadow">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Dossier Administratif</span>
<div className="w-8 h-8 rounded-lg bg-surface-container-high text-primary flex items-center justify-center">
<span className="material-symbols-outlined text-[18px]">task_alt</span>
</div>
</div>
<div className="flex items-center gap-2 mt-2">
<span className="w-2.5 h-2.5 rounded-full bg-secondary shrink-0"></span>
<span className="font-headline-md text-headline-md text-primary font-bold">À jour</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-tight">
        Justificatif bancaire validé par AZ Finance. Dossier d'examen d'état transmis.
      </p>
<div className="mt-2 flex items-center gap-1 text-secondary font-label-sm text-label-sm font-semibold">
<span className="material-symbols-outlined text-[14px]">lock</span> Authentifié SHA-256
      </div>
</div>
</div>
{/*  Priority Alert & Pedagogical Notice  */}
<div className="mt-space-md rounded-xl bg-primary-container text-on-primary p-space-md shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md relative overflow-hidden">
<div className="flex items-start gap-space-md">
<div className="w-10 h-10 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0 mt-0.5">
<span className="material-symbols-outlined text-[24px]">campaign</span>
</div>
<div className="flex flex-col">
<div className="flex items-center gap-2">
<span className="px-2 py-0.5 rounded bg-tertiary-fixed-dim text-on-tertiary-fixed font-label-sm text-label-sm font-bold uppercase tracking-wider">Important</span>
<span className="font-label-sm text-label-sm text-on-primary-container">Direction des Études AZ Pulse • 08 Nov 2025</span>
</div>
<h3 className="font-headline-sm text-headline-sm font-bold mt-1 text-on-primary">Convocation Réunion Parents - Formateurs de Mi-Parcours</h3>
<p className="font-body-md text-body-md text-surface-variant max-w-3xl mt-0.5">
          Faisant suite à la validation du bloc Frontend, nous invitons les parents d'élèves à la session de restitution pédagogique en visioconférence ou au campus Akwa ce Samedi à 10h00.
        </p>
</div>
</div>
<div className="flex items-center gap-space-sm shrink-0 w-full md:w-auto">
<button className="px-space-md py-2 rounded-lg bg-surface-container-lowest text-primary font-label-md text-label-md font-bold hover:bg-surface-variant transition-colors flex items-center gap-1.5 shadow-sm" type="button">
<span className="material-symbols-outlined text-[18px]">event_available</span> Confirmer présence
      </button>
<button className="p-2 rounded-lg bg-primary/40 text-on-primary hover:bg-primary/60 transition-colors" title="Télécharger l'ordre du jour" type="button">
<span className="material-symbols-outlined text-[20px]">download</span>
</button>
</div>
</div>
{/*  Section Split: Planning & Recent Grades  */}
<div className="mt-space-md grid grid-cols-1 lg:grid-cols-12 gap-space-md">
{/*  Left Column: Planning & Upcoming Sessions (5 cols)  */}
<div className="lg:col-span-5 rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col justify-between">
<div>
<div className="flex items-center justify-between pb-space-sm">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-[22px]">calendar_today</span>
<h2 className="font-headline-sm text-headline-sm text-primary font-bold">Planning des cours de la semaine</h2>
</div>
<span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Semaine 46 • En cours</span>
</div>
<div className="mt-space-md flex flex-col gap-space-sm">
{/*  Session 1: Mardi  */}
<div className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-start justify-between gap-space-md">
<div className="flex items-start gap-space-sm">
<div className="flex flex-col items-center justify-center w-12 py-1.5 rounded-lg bg-surface-container text-primary font-bold shrink-0">
<span className="font-label-sm text-label-sm uppercase">Mar</span>
<span className="font-headline-sm text-headline-sm">11</span>
</div>
<div className="flex flex-col">
<span className="font-label-lg text-label-lg text-primary font-bold">Framework Frontend React &amp; State</span>
<div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm mt-0.5">
<span className="material-symbols-outlined text-[16px]">schedule</span> 10h00 - 13h00 (3h)
                  <span className="mx-1">•</span>
<span className="material-symbols-outlined text-[16px]">meeting_room</span> Lab Tech 2
                </div>
<span className="font-label-sm text-label-sm text-secondary font-medium mt-1">Intervenant: Dr. M. Kamga</span>
</div>
</div>
<span className="px-2 py-1 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold shrink-0">
              Présentiel
            </span>
</div>
{/*  Session 2: Jeudi  */}
<div className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-start justify-between gap-space-md">
<div className="flex items-start gap-space-sm">
<div className="flex flex-col items-center justify-center w-12 py-1.5 rounded-lg bg-surface-container text-primary font-bold shrink-0">
<span className="font-label-sm text-label-sm uppercase">Jeu</span>
<span className="font-headline-sm text-headline-sm">13</span>
</div>
<div className="flex flex-col">
<span className="font-label-lg text-label-lg text-primary font-bold">Base de données PostgreSQL &amp; Modélisation</span>
<div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm mt-0.5">
<span className="material-symbols-outlined text-[16px]">schedule</span> 14h00 - 17h00 (3h)
                  <span className="mx-1">•</span>
<span className="material-symbols-outlined text-[16px]">meeting_room</span> Amphithéâtre Turing
                </div>
<span className="font-label-sm text-label-sm text-secondary font-medium mt-1">Intervenant: Ing. E. Bopda</span>
</div>
</div>
<span className="px-2 py-1 rounded bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold shrink-0">
              Présentiel
            </span>
</div>
{/*  Session 3: Samedi Workshop  */}
<div className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-start justify-between gap-space-md">
<div className="flex items-start gap-space-sm">
<div className="flex flex-col items-center justify-center w-12 py-1.5 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed font-bold shrink-0">
<span className="font-label-sm text-label-sm uppercase">Sam</span>
<span className="font-headline-sm text-headline-sm">15</span>
</div>
<div className="flex flex-col">
<span className="font-label-lg text-label-lg text-primary font-bold">Projet Hackathon Sprint #2</span>
<div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm mt-0.5">
<span className="material-symbols-outlined text-[16px]">schedule</span> 09h00 - 13h00 (4h)
                  <span className="mx-1">•</span>
<span className="material-symbols-outlined text-[16px]">devices</span> En distanciel guidé
                </div>
<span className="font-label-sm text-label-sm text-secondary font-medium mt-1">Co-mentorat AZ Hub</span>
</div>
</div>
<span className="px-2 py-1 rounded bg-tertiary-fixed-dim text-on-tertiary-fixed font-label-sm text-label-sm font-bold shrink-0">
              En Ligne
            </span>
</div>
</div>
</div>
<div className="pt-space-md mt-space-md flex items-center justify-between text-on-surface-variant">
<span className="font-label-sm text-label-sm flex items-center gap-1">
<span className="material-symbols-outlined text-secondary text-[16px]">notifications_active</span> Alertes SMS de présence activées
        </span>
<a className="font-label-md text-label-md text-secondary font-bold hover:underline" href="#">Voir l'emploi du temps complet →</a>
</div>
</div>
{/*  Right Column: Grades and Teacher Evaluation (7 cols)  */}
<div className="lg:col-span-7 rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col justify-between">
<div>
<div className="flex items-center justify-between pb-space-sm">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-[22px]">assignment_turned_in</span>
<h2 className="font-headline-sm text-headline-sm text-primary font-bold">Dernières Notes &amp; Évaluations Certifiantes</h2>
</div>
<span className="px-2.5 py-1 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-semibold">
            Semestre 1 • 2025/2026
          </span>
</div>
{/*  Grade Table  */}
<div className="mt-space-md overflow-x-auto">
<table className="w-full text-left">
<thead>
<tr className="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider bg-surface-container-low rounded-lg">
<th className="py-2.5 px-space-sm rounded-l-lg">Module / Compétence</th>
<th className="py-2.5 px-space-sm">Date</th>
<th className="py-2.5 px-space-sm">Note / 20</th>
<th className="py-2.5 px-space-sm rounded-r-lg">Appréciation Pédagogique</th>
</tr>
</thead>
<tbody className="divide-y-0 font-body-md text-body-md">
{/*  Item 1  */}
<tr className="hover:bg-surface-container-low/50 transition-colors">
<td className="py-3 px-space-sm">
<div className="font-label-md text-label-md font-bold text-primary">HTML5 / CSS3 Avancé &amp; Responsive</div>
<span className="font-label-sm text-label-sm text-on-surface-variant">Évaluation continue #1</span>
</td>
<td className="py-3 px-space-sm font-label-sm text-label-sm text-on-surface-variant">14 Oct 2025</td>
<td className="py-3 px-space-sm">
<span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed font-bold font-label-md text-label-md">
                    17.0 / 20
                  </span>
</td>
<td className="py-3 px-space-sm font-body-sm text-body-sm text-on-surface-variant">
<span className="font-semibold text-primary">"Excellent travail."</span> Maîtrise irréprochable de CSS Grid et accessibilité.
                </td>
</tr>
{/*  Item 2  */}
<tr className="hover:bg-surface-container-low/50 transition-colors">
<td className="py-3 px-space-sm">
<div className="font-label-md text-label-md font-bold text-primary">JavaScript Moderne &amp; ES6+</div>
<span className="font-label-sm text-label-sm text-on-surface-variant">Contrôle sur table</span>
</td>
<td className="py-3 px-space-sm font-label-sm text-label-sm text-on-surface-variant">28 Oct 2025</td>
<td className="py-3 px-space-sm">
<span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-surface-container-high text-primary font-bold font-label-md text-label-md">
                    15.0 / 20
                  </span>
</td>
<td className="py-3 px-space-sm font-body-sm text-body-sm text-on-surface-variant">
                  Bonne compréhension de l'asynchrone. Approfondir la gestion des exceptions Promises.
                </td>
</tr>
{/*  Item 3  */}
<tr className="hover:bg-surface-container-low/50 transition-colors">
<td className="py-3 px-space-sm">
<div className="font-label-md text-label-md font-bold text-primary">Architecture Base de données &amp; SQL</div>
<span className="font-label-sm text-label-sm text-on-surface-variant">Mini-projet pratique</span>
</td>
<td className="py-3 px-space-sm font-label-sm text-label-sm text-on-surface-variant">04 Nov 2025</td>
<td className="py-3 px-space-sm">
<span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-surface-container-high text-primary font-bold font-label-md text-label-md">
                    16.0 / 20
                  </span>
</td>
<td className="py-3 px-space-sm font-body-sm text-body-sm text-on-surface-variant">
                  Très bon modèle relationnel. Requêtes complexes optimisées avec succès.
                </td>
</tr>
</tbody>
</table>
</div>
</div>
<div className="pt-space-md mt-space-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm">
<div className="flex items-center gap-2">
<span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed-dim"></span>
<span className="font-label-sm text-label-sm text-on-surface-variant">Prochain bulletin officiel téléchargeable le 05 Décembre 2025</span>
</div>
<button className="px-space-md py-2 rounded-lg bg-surface-container text-primary font-label-md text-label-md font-bold hover:bg-surface-container-high transition-colors flex items-center gap-1.5" type="button">
<span className="material-symbols-outlined text-[18px]">print</span> Relevé semestriel provisoire
        </button>
</div>
</div>
</div>
{/*  Section: Payment Ledger & AZ Official Receipts (Full Width)  */}
<div className="mt-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
<div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-md">
<div className="flex flex-col">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-[22px]">verified</span>
<h2 className="font-headline-sm text-headline-sm text-primary font-bold">État des Paiements &amp; Quittances Certifiées AZ</h2>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Historique des transactions d'écolage et certificats d'enregistrement comptables</p>
</div>
{/*  Action Button for immediate payment  */}
<button className="px-space-md py-2.5 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md font-bold hover:bg-secondary-container transition-all flex items-center gap-2 shadow-sm shrink-0" type="button">
<span className="material-symbols-outlined text-[20px]">add_card</span>
        Régulariser la tranche restante (Paiement en ligne / Déposer reçu)
      </button>
</div>
{/*  Payment Breakdown Summary Bar  */}
<div className="bg-surface-container-low rounded-xl p-space-md grid grid-cols-1 sm:grid-cols-3 gap-space-md mb-space-md">
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Montant total cursus</span>
<span className="font-headline-sm text-headline-sm text-primary font-extrabold mt-0.5">450,000 XAF</span>
</div>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Montant versé validé</span>
<span className="font-headline-sm text-headline-sm text-secondary font-extrabold mt-0.5">350,000 XAF (77.8%)</span>
</div>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-error uppercase tracking-wider font-bold">Reliquat à payer</span>
<span className="font-headline-sm text-headline-sm text-error font-extrabold mt-0.5">100,000 XAF</span>
</div>
</div>
{/*  Receipts Table  */}
<div className="overflow-x-auto">
<table className="w-full text-left">
<thead>
<tr className="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider bg-surface-container-low">
<th className="py-2.5 px-space-sm rounded-l-lg">Tranche / Libellé</th>
<th className="py-2.5 px-space-sm">Date d'encaissement</th>
<th className="py-2.5 px-space-sm">Référence Bancaire</th>
<th className="py-2.5 px-space-sm">Montant Réglé</th>
<th className="py-2.5 px-space-sm">Statut Reçu</th>
<th className="py-2.5 px-space-sm rounded-r-lg text-right">Document Officiel</th>
</tr>
</thead>
<tbody className="divide-y-0 font-body-md text-body-md">
{/*  Row 1  */}
<tr className="hover:bg-surface-container-low/40 transition-colors">
<td className="py-3 px-space-sm">
<span className="font-label-md text-label-md font-bold text-primary">Acompte Inscription &amp; Matériel Pédagogique</span>
<div className="font-label-sm text-label-sm text-on-surface-variant">Validation dossier MINEFOP</div>
</td>
<td className="py-3 px-space-sm font-body-sm text-body-sm text-on-surface-variant">12 Septembre 2025</td>
<td className="py-3 px-space-sm font-mono text-label-sm text-primary">VIR-AZ-2025-99810-AFRILAND</td>
<td className="py-3 px-space-sm font-label-md text-label-md font-bold text-primary">150,000 XAF</td>
<td className="py-3 px-space-sm">
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-semibold">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Comptabilisé
              </span>
</td>
<td className="py-3 px-space-sm text-right">
<button className="inline-flex items-center gap-1.5 px-space-sm py-1.5 rounded-lg bg-surface-container text-secondary hover:bg-secondary hover:text-on-secondary transition-colors font-label-sm text-label-sm font-bold" type="button">
<span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                Télécharger Reçu AZ certifié (PDF/SHA-256)
              </button>
</td>
</tr>
{/*  Row 2  */}
<tr className="hover:bg-surface-container-low/40 transition-colors">
<td className="py-3 px-space-sm">
<span className="font-label-md text-label-md font-bold text-primary">Tranche #1 • Scolarité Semestre 1</span>
<div className="font-label-sm text-label-sm text-on-surface-variant">Modules Frontend &amp; Frameworks</div>
</td>
<td className="py-3 px-space-sm font-body-sm text-body-sm text-on-surface-variant">10 Octobre 2025</td>
<td className="py-3 px-space-sm font-mono text-label-sm text-primary">VIR-AZ-2025-10442-UBA</td>
<td className="py-3 px-space-sm font-label-md text-label-md font-bold text-primary">200,000 XAF</td>
<td className="py-3 px-space-sm">
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-semibold">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Comptabilisé
              </span>
</td>
<td className="py-3 px-space-sm text-right">
<button className="inline-flex items-center gap-1.5 px-space-sm py-1.5 rounded-lg bg-surface-container text-secondary hover:bg-secondary hover:text-on-secondary transition-colors font-label-sm text-label-sm font-bold" type="button">
<span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                Télécharger Reçu AZ certifié (PDF/SHA-256)
              </button>
</td>
</tr>
{/*  Row 3: Pending  */}
<tr className="hover:bg-surface-container-low/40 transition-colors">
<td className="py-3 px-space-sm">
<span className="font-label-md text-label-md font-bold text-on-surface-variant">Tranche Finale #2 • Clôture &amp; Dépôt Examen</span>
<div className="font-label-sm text-label-sm text-on-surface-variant">Frais jury et diplôme MINEFOP</div>
</td>
<td className="py-3 px-space-sm font-body-sm text-body-sm text-error font-semibold">Attendue avant le 30 Nov 2025</td>
<td className="py-3 px-space-sm font-mono text-label-sm text-on-surface-variant">En attente de versement</td>
<td className="py-3 px-space-sm font-label-md text-label-md font-bold text-error">100,000 XAF</td>
<td className="py-3 px-space-sm">
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">
<span className="w-1.5 h-1.5 rounded-full bg-error"></span> En cours
              </span>
</td>
<td className="py-3 px-space-sm text-right">
<button className="inline-flex items-center gap-1.5 px-space-sm py-1.5 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed hover:bg-tertiary-fixed-dim transition-colors font-label-sm text-label-sm font-bold" type="button">
<span className="material-symbols-outlined text-[16px]">credit_card</span>
                Régler en ligne maintenant
              </button>
</td>
</tr>
</tbody>
</table>
</div>
{/*  Security & Institutional Assurance Badge  */}
<div className="mt-space-lg p-space-sm rounded-xl bg-surface-container flex flex-col sm:flex-row items-center justify-between gap-space-sm text-on-surface-variant font-label-sm text-label-sm">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-[18px]">verified_user</span>
<span className="">Tous les reçus émis par l'Institut AZ Corporation sont scellés par horodatage cryptographique conforme aux normes CEMAC.</span>
</div>
<span className="font-mono text-on-surface font-semibold shrink-0">AZ-HASH: 8f9b...4c12</span>
</div>
</div>
</div>
{/*  Tab: Mes Enfants  */}
<div id="view-mes-enfants" className="tab-pane hidden flex-col w-full pb-space-xl pt-space-md">
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-md border-b border-surface-variant">
    <div>
      <div className="flex items-center gap-space-xs text-secondary font-label-md uppercase tracking-wider">
        <span className="material-symbols-outlined text-[18px]">supervisor_account</span>
        <span className="">Profils Apprenants Rattachés</span>
      </div>
      <h1 className="font-headline-lg text-headline-lg text-primary mt-1">Mes Enfants Supervisés</h1>
      <p className="font-body-md text-body-md text-on-surface-variant">Consultez les dossiers pédagogiques, assiduité, cartes d'étudiant et contacts formateurs.</p>
    </div>
    <button className="px-space-md py-2.5 rounded-lg bg-primary text-on-primary font-label-md font-bold hover:bg-primary-container transition-colors flex items-center gap-2 shadow-sm self-start md:self-auto">
      <span className="material-symbols-outlined text-[20px]">person_add</span>
      Rattacher un nouvel apprenant
    </button>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg mt-space-lg">
    {/*  Junior Card  */}
    <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm border border-secondary/30 relative flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-space-md pb-space-md border-b border-surface-variant">
          <div className="flex items-center gap-space-md">
            <img src="https://lh3.googleusercontent.com/aida/AEtjO1U-8kPb3QZOqKQIP2f6uXy6bTpN1k7-7KJZQ9n9qWuNph8uj06jFpcLl_wqK2bM-whXjK5akcijL7bxG_6jZQQByNVyp_PL_yHAwbwXS1JA0dTDIy7c7dsHeDYnaHqJRVLRB0n1743MHcjOl1-tol_65lHCmL8e2BiEW890Hc9uAR_RJbeeqUuNz-w1f-yUJhzXxkomXj_nQZtR-txD4oxsIIaSg8XS-fhVanZvJeEyXJmdSuuUcoWME2A" alt="Junior Dupont" className="w-16 h-16 rounded-xl object-cover ring-2 ring-secondary/40 shadow-sm" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-sm text-headline-sm text-primary font-bold">Junior Dupont</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-800 text-[11px] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> En formation
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Matricule: #AZ-2025-084 • Né le 14/05/2004</span>
              <p className="font-label-sm text-label-sm text-secondary font-semibold mt-0.5">Promotion Dev Web &amp; Mobile Fullstack (MINEFOP)</p>
            </div>
          </div>
          <button className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors" title="Options"><span className="material-symbols-outlined text-[20px]">more_vert</span></button>
        </div>

        <div className="grid grid-cols-3 gap-space-sm py-space-md">
          <div className="p-space-sm rounded-lg bg-surface-container-low text-center">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Moyenne</span>
            <p className="font-headline-sm text-headline-sm font-extrabold text-primary mt-1">15.8 <span className="text-body-sm font-normal text-on-surface-variant">/20</span></p>
          </div>
          <div className="p-space-sm rounded-lg bg-surface-container-low text-center">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Assiduité</span>
            <p className="font-headline-sm text-headline-sm font-extrabold text-secondary mt-1">96%</p>
          </div>
          <div className="p-space-sm rounded-lg bg-surface-container-low text-center">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Rang</span>
            <p className="font-headline-sm text-headline-sm font-extrabold text-primary mt-1">4<sup className="text-xs font-normal">e</sup> / 32</p>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-xl p-space-sm flex flex-col gap-1.5">
          <div className="flex justify-between text-body-sm text-on-surface-variant">
            <span className="">Progression du cursus (720h)</span>
            <span className="font-bold text-primary">68% validé</span>
          </div>
          <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
            <div className="bg-secondary h-full rounded-full" style={{ width: '68%' }}></div>
          </div>
        </div>
      </div>

      <div className="mt-space-md pt-space-sm border-t border-surface-variant flex items-center justify-between">
        <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
          <span className="material-symbols-outlined text-secondary text-[16px]">school</span> Formateur référent: Dr. Kamga
        </span>
        <button className="px-3 py-1.5 rounded-lg bg-secondary-fixed text-on-secondary-fixed font-label-sm font-bold hover:bg-secondary hover:text-on-secondary transition-colors" onclick="switchChild('Junior Dupont', 'Promo Dev Web &amp; Mobile MINEFOP', 'JD', 'Dev Web &amp; Mobile Fullstack', '68%')">Voir le dossier complet</button>
      </div>
    </div>

    {/*  Sarah Card  */}
    <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm border border-surface-variant relative flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-space-md pb-space-md border-b border-surface-variant">
          <div className="flex items-center gap-space-md">
            <img src="https://lh3.googleusercontent.com/aida/AEtjO1UsYW-NeiFKlrvNrGTP4XwNxuZGimWKvtea-7ViIX-v91VFJrZs2un7DxK1rghdSyJx1u5IZ0-xCg0fyAToc9vwRujL9K3RCr2MqQcjE7-z2nnhXRQqEOfo9xdA_juO7bIcNY_jQBBga82NCHPc-C8Q79KvCTfQdbueeWyZIYiltZ_gXYOpp1fhvHzCinokngwYkqOjx4aRTeSihOyVCuVH0TFI4VLrtfda5ZX24C9zvRxsi2CHpLRza-o" alt="Sarah Dupont" className="w-16 h-16 rounded-xl object-cover ring-2 ring-primary/20 shadow-sm" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-sm text-headline-sm text-primary font-bold">Sarah Dupont</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-800 text-[11px] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> En formation
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Matricule: #AZ-2025-112 • Née le 20/09/2006</span>
              <p className="font-label-sm text-label-sm text-secondary font-semibold mt-0.5">Parcours Design Graphique &amp; Motion UI (MINEFOP)</p>
            </div>
          </div>
          <button className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors" title="Options"><span className="material-symbols-outlined text-[20px]">more_vert</span></button>
        </div>

        <div className="grid grid-cols-3 gap-space-sm py-space-md">
          <div className="p-space-sm rounded-lg bg-surface-container-low text-center">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Moyenne</span>
            <p className="font-headline-sm text-headline-sm font-extrabold text-primary mt-1">16.5 <span className="text-body-sm font-normal text-on-surface-variant">/20</span></p>
          </div>
          <div className="p-space-sm rounded-lg bg-surface-container-low text-center">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Assiduité</span>
            <p className="font-headline-sm text-headline-sm font-extrabold text-secondary mt-1">98%</p>
          </div>
          <div className="p-space-sm rounded-lg bg-surface-container-low text-center">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Rang</span>
            <p className="font-headline-sm text-headline-sm font-extrabold text-primary mt-1">2<sup className="text-xs font-normal">e</sup> / 28</p>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-xl p-space-sm flex flex-col gap-1.5">
          <div className="flex justify-between text-body-sm text-on-surface-variant">
            <span className="">Progression du cursus (600h)</span>
            <span className="font-bold text-primary">42% validé</span>
          </div>
          <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
            <div className="bg-secondary h-full rounded-full" style={{ width: '42%' }}></div>
          </div>
        </div>
      </div>

      <div className="mt-space-md pt-space-sm border-t border-surface-variant flex items-center justify-between">
        <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
          <span className="material-symbols-outlined text-secondary text-[16px]">school</span> Formateur référent: Ing. Bopda
        </span>
        <button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-sm font-bold transition-colors" onclick="switchChild('Sarah Dupont', 'Anglais &amp; UI/UX Design', 'SD', 'Certification Infographie &amp; UI/UX 3D', '42%')">Basculer sur ce profil</button>
      </div>
    </div>
  </div>
</div>

{/*  Tab: Formations & Suivi  */}
<div id="view-formations" className="tab-pane hidden flex-col w-full pb-space-xl pt-space-md">
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-md border-b border-surface-variant">
    <div>
      <div className="flex items-center gap-space-xs text-secondary font-label-md uppercase tracking-wider">
        <span className="material-symbols-outlined text-[18px]">timeline</span>
        <span className="">Curriculum &amp; Progression Pédagogique</span>
      </div>
      <h1 className="font-headline-lg text-headline-lg text-primary mt-1">Formations &amp; Validation de Compétences</h1>
      <p className="font-body-md text-body-md text-on-surface-variant">Suivi modulaire certifié MINEFOP avec taux de complétion, projets et assiduité biométrique.</p>
    </div>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md mt-space-lg">
    <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm">
      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Module 1 • Fondamentaux Web</span>
      <h3 className="font-headline-sm text-headline-sm font-bold text-primary mt-1">HTML5, CSS3 Grid &amp; Accessibilité</h3>
      <div className="flex items-center justify-between text-body-sm text-on-surface-variant mt-3">
        <span className="">Heures: 60h / 60h</span>
        <span className="text-emerald-800 font-bold flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">check_circle</span> Validé</span>
      </div>
      <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden mt-1.5">
        <div className="bg-emerald-400 h-full rounded-full" style={{ width: '100%' }}></div>
      </div>
    </div>
    <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm">
      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Module 2 • Programmation Client</span>
      <h3 className="font-headline-sm text-headline-sm font-bold text-primary mt-1">JavaScript ES6+ &amp; React Ecosystem</h3>
      <div className="flex items-center justify-between text-body-sm text-on-surface-variant mt-3">
        <span className="">Heures: 85h / 100h</span>
        <span className="text-secondary font-bold flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">sync</span> En cours (85%)</span>
      </div>
      <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden mt-1.5">
        <div className="bg-secondary h-full rounded-full" style={{ width: '85%' }}></div>
      </div>
    </div>
    <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm">
      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Module 3 • Backend &amp; Data</span>
      <h3 className="font-headline-sm text-headline-sm font-bold text-primary mt-1">Node.js, PostgreSQL &amp; APIs REST</h3>
      <div className="flex items-center justify-between text-body-sm text-on-surface-variant mt-3">
        <span className="">Heures: 20h / 90h</span>
        <span className="text-on-surface-variant font-bold flex items-center gap-1">À débuter</span>
      </div>
      <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden mt-1.5">
        <div className="bg-surface-container-high h-full rounded-full" style={{ width: '22%' }}></div>
      </div>
    </div>
  </div>
</div>

{/*  Tab: Planning  */}
<div id="view-planning" className="tab-pane hidden flex-col w-full pb-space-xl pt-space-md">
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-md border-b border-surface-variant">
    <div>
      <div className="flex items-center gap-space-xs text-secondary font-label-md uppercase tracking-wider">
        <span className="material-symbols-outlined text-[18px]">event_available</span>
        <span className="">Calendrier Académique</span>
      </div>
      <h1 className="font-headline-lg text-headline-lg text-primary mt-1">Emploi du Temps Hebdomadaire</h1>
      <p className="font-body-md text-body-md text-on-surface-variant">Consultez les sessions en présentiel, séances de lab et ateliers en distanciel.</p>
    </div>
    <div className="flex items-center gap-2">
      <button className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-md font-semibold">Junior (Dev Web)</button>
      <button className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-md font-semibold hover:bg-surface-container-high transition-colors">Sarah (Design UI)</button>
    </div>
  </div>

  <div className="mt-space-lg rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
    <div className="space-y-space-md">
      <div className="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between">
        <div className="flex items-center gap-space-md">
          <div className="w-12 h-12 rounded-xl bg-secondary text-on-secondary flex flex-col items-center justify-center font-bold">
            <span className="text-[11px] uppercase">Mar</span>
            <span className="text-[16px]">11</span>
          </div>
          <div>
            <h4 className="font-headline-sm text-headline-sm font-bold text-primary">React &amp; State Management (Redux Toolkit)</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">10h00 - 13h00 • Lab Tech 2 • Dr. Kamga</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm font-bold">Présentiel</span>
      </div>

      <div className="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between">
        <div className="flex items-center gap-space-md">
          <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex flex-col items-center justify-center font-bold">
            <span className="text-[11px] uppercase">Jeu</span>
            <span className="text-[16px]">13</span>
          </div>
          <div>
            <h4 className="font-headline-sm text-headline-sm font-bold text-primary">Base de données SQL &amp; Normalisation</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">14h00 - 17h00 • Amphithéâtre Turing • Ing. Bopda</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-surface-container font-label-sm text-primary font-bold">Présentiel</span>
      </div>

      <div className="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between">
        <div className="flex items-center gap-space-md">
          <div className="w-12 h-12 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex flex-col items-center justify-center font-bold">
            <span className="text-[11px] uppercase">Sam</span>
            <span className="text-[16px]">15</span>
          </div>
          <div>
            <h4 className="font-headline-sm text-headline-sm font-bold text-primary">Hackathon Sprint #2 • Live Coding Review</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">09h00 - 13h00 • Distanciel guidé • Mentorat AZ Hub</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-tertiary-fixed-dim text-on-tertiary-fixed font-label-sm font-bold">En Ligne</span>
      </div>
    </div>
  </div>
</div>

{/*  Tab: Bulletins & Notes  */}
<div id="view-bulletins" className="tab-pane hidden flex-col w-full pb-space-xl pt-space-md">
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-md border-b border-surface-variant">
    <div>
      <div className="flex items-center gap-space-xs text-secondary font-label-md uppercase tracking-wider">
        <span className="material-symbols-outlined text-[18px]">grade</span>
        <span className="">Relevés de Notes &amp; Bulletins</span>
      </div>
      <h1 className="font-headline-lg text-headline-lg text-primary mt-1">Bulletins Certifiés &amp; Appréciations</h1>
      <p className="font-body-md text-body-md text-on-surface-variant">Relevés trimestriels officiels scellés avec mentions et classements de la commission académique.</p>
    </div>
    <button className="px-space-md py-2.5 rounded-lg bg-secondary text-on-secondary font-label-md font-bold hover:bg-secondary-container transition-colors flex items-center gap-2 shadow-sm self-start md:self-auto">
      <span className="material-symbols-outlined text-[20px]">download</span>
      Télécharger Relevé Officiel (PDF)
    </button>
  </div>

  <div className="mt-space-lg rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
    <div className="flex items-center justify-between pb-space-md border-b border-surface-variant">
      <div>
        <h3 className="font-headline-sm text-headline-sm font-bold text-primary">Junior Dupont • Semestre 1 (2025/2026)</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Moyenne générale pondérée: <span className="font-bold text-primary">15.8 / 20</span> • Rang: <span className="font-bold text-secondary">4e / 32</span> • Mention: Bien</p>
      </div>
      <span className="px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-800 font-label-sm font-bold">Admis à la soutenance</span>
    </div>

    <div className="mt-space-md overflow-x-auto">
      <table className="w-full text-left font-body-md">
        <thead>
          <tr className="font-label-sm uppercase tracking-wider bg-surface-container-low text-on-surface-variant">
            <th className="p-3 rounded-l-lg">Unité d'Enseignement (UE)</th>
            <th className="p-3">Coefficient</th>
            <th className="p-3">Note CC</th>
            <th className="p-3">Note Examen</th>
            <th className="p-3">Moyenne UE</th>
            <th className="p-3 rounded-r-lg">Décision Jury</th>
          </tr>
        </thead>
        <tbody className="divide-y-0">
          <tr className="hover:bg-surface-container-low/50">
            <td className="p-3 font-bold text-primary">UE1: Algorithmique &amp; JS Avancé</td>
            <td className="p-3">4</td>
            <td className="p-3">15.0</td>
            <td className="p-3">16.5</td>
            <td className="p-3 font-bold text-primary">16.0 / 20</td>
            <td className="p-3"><span className="text-emerald-800 font-bold font-label-sm">Validé (A)</span></td>
          </tr>
          <tr className="hover:bg-surface-container-low/50">
            <td className="p-3 font-bold text-primary">UE2: Interface Réactive (React / Tailwind)</td>
            <td className="p-3">5</td>
            <td className="p-3">17.0</td>
            <td className="p-3">17.0</td>
            <td className="p-3 font-bold text-primary">17.0 / 20</td>
            <td className="p-3"><span className="text-emerald-800 font-bold font-label-sm">Validé (A+)</span></td>
          </tr>
          <tr className="hover:bg-surface-container-low/50">
            <td className="p-3 font-bold text-primary">UE3: Conception &amp; Modélisation SQL</td>
            <td className="p-3">3</td>
            <td className="p-3">14.0</td>
            <td className="p-3">15.0</td>
            <td className="p-3 font-bold text-primary">14.7 / 20</td>
            <td className="p-3"><span className="text-emerald-800 font-bold font-label-sm">Validé (B+)</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

{/*  Tab: Inscriptions  */}
<div id="view-inscriptions" className="tab-pane hidden flex-col w-full pb-space-xl pt-space-md">
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-md border-b border-surface-variant">
    <div>
      <div className="flex items-center gap-space-xs text-secondary font-label-md uppercase tracking-wider">
        <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
        <span className="">Dossiers d'Admission &amp; Documents Légaux</span>
      </div>
      <h1 className="font-headline-lg text-headline-lg text-primary mt-1">Dossiers d'Inscription MINEFOP</h1>
      <p className="font-body-md text-body-md text-on-surface-variant">État d'homologation légale, contrat d'apprentissage et pièces administratives transmises.</p>
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg mt-space-lg">
    <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm">
      <div className="flex items-center justify-between pb-space-sm border-b border-surface-variant">
        <h3 className="font-headline-sm font-bold text-primary">Junior Dupont • Dossier MINEFOP</h3>
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-800 font-label-sm font-bold">Conforme à 100%</span>
      </div>
      <ul className="mt-space-md space-y-space-sm text-body-sm">
        <li className="flex items-center justify-between p-2 rounded bg-surface-container-low">
          <span className="">Acte de naissance certifié</span>
          <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
        </li>
        <li className="flex items-center justify-between p-2 rounded bg-surface-container-low">
          <span className="">Photocopie CNI Tuteur légal</span>
          <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
        </li>
        <li className="flex items-center justify-between p-2 rounded bg-surface-container-low">
          <span className="">Relevé du Baccalauréat / Diplôme requis</span>
          <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
        </li>
        <li className="flex items-center justify-between p-2 rounded bg-surface-container-low">
          <span className="">Contrat d'engagement pédagogique signé</span>
          <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
        </li>
      </ul>
    </div>

    <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm">
      <div className="flex items-center justify-between pb-space-sm border-b border-surface-variant">
        <h3 className="font-headline-sm font-bold text-primary">Sarah Dupont • Dossier MINEFOP</h3>
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-800 font-label-sm font-bold">Conforme à 100%</span>
      </div>
      <ul className="mt-space-md space-y-space-sm text-body-sm">
        <li className="flex items-center justify-between p-2 rounded bg-surface-container-low">
          <span className="">Certificat médical d'aptitude</span>
          <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
        </li>
        <li className="flex items-center justify-between p-2 rounded bg-surface-container-low">
          <span className="">Photocopie CNI Tuteur légal</span>
          <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
        </li>
        <li className="flex items-center justify-between p-2 rounded bg-surface-container-low">
          <span className="">Quittance de frais d'inscription</span>
          <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
        </li>
        <li className="flex items-center justify-between p-2 rounded bg-surface-container-low">
          <span className="">Règlement intérieur contresigné</span>
          <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
        </li>
      </ul>
    </div>
  </div>
</div>

{/*  Tab: Paiements & Reçus  */}
<div id="view-paiements" className="tab-pane hidden flex-col w-full pb-space-xl pt-space-md">
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-md border-b border-surface-variant">
    <div>
      <div className="flex items-center gap-space-xs text-secondary font-label-md uppercase tracking-wider">
        <span className="material-symbols-outlined text-[18px]">receipt_long</span>
        <span className="">Grand Livre Financier Tuteurs</span>
      </div>
      <h1 className="font-headline-lg text-headline-lg text-primary mt-1">Comptabilité &amp; Quittances Numériques</h1>
      <p className="font-body-md text-body-md text-on-surface-variant">Relevé complet des versements, attestations fiscales et reçu certifiés par hash cryptographique.</p>
    </div>
    <button className="px-space-md py-2.5 rounded-lg bg-secondary text-on-secondary font-label-md font-bold hover:bg-secondary-container transition-colors flex items-center gap-2 shadow-sm self-start md:self-auto">
      <span className="material-symbols-outlined text-[20px]">payment</span>
      Payer la tranche restante en ligne
    </button>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md mt-space-lg mb-space-md">
    <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm">
      <span className="font-label-sm uppercase text-on-surface-variant">Total Écolage Dû</span>
      <p className="font-headline-md font-extrabold text-primary mt-1">450,000 XAF</p>
    </div>
    <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm">
      <span className="font-label-sm uppercase text-on-surface-variant">Montant Déjà Réglé</span>
      <p className="font-headline-md font-extrabold text-secondary mt-1">350,000 XAF</p>
    </div>
    <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm">
      <span className="font-label-sm uppercase text-error font-bold">Solde à Régulariser</span>
      <p className="font-headline-md font-extrabold text-error mt-1">100,000 XAF</p>
    </div>
  </div>

  <div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
    <div className="p-space-sm rounded-lg bg-surface-container-low text-body-sm text-on-surface-variant flex items-center gap-2">
      <span className="material-symbols-outlined text-secondary">lock</span>
      <span className="">Toutes les transactions bancaires sont vérifiées par rapprochement automatique UBA &amp; Afriland First Bank.</span>
    </div>
  </div>
</div></main>