import { useAuth } from '../../../contexts/AuthContext'; // Might be wrong path, we'll fix it if needed

const FormateurDashboard = () => {
  // const { fullName } = useAuth();
  
  return (
    <main className="relative pt-16 bg-surface min-h-screen w-full px-space-lg"><div className="flex flex-col w-full pb-space-xl">
{/*  Dynamic Top Pulse Ribbon / Status Banner  */}
<section className="mb-space-lg">
<div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col xl:flex-row items-start xl:items-center justify-between gap-space-md relative overflow-hidden">
<div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-secondary/5 blur-3xl pointer-events-none"></div>
<div className="absolute right-48 bottom-0 w-32 h-32 rounded-full bg-tertiary-fixed-dim/10 blur-2xl pointer-events-none"></div>
<div className="flex flex-col gap-space-xs z-10">
<div className="flex flex-wrap items-center gap-space-sm">
<span className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm tracking-wider uppercase font-bold">
<span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
            MINEFOP Accrédité
          </span>
<span className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm font-semibold">
<span className="material-symbols-outlined text-[14px]">meeting_room</span>
            En cours de session présentielle (Salle 302 - Biyem-Assi)
          </span>
<span className="font-label-sm text-label-sm text-outline">Réf: AZ-INST-2025-CMR</span>
</div>
<h1 className="font-headline-xl text-headline-xl text-primary font-extrabold tracking-tight mt-1">
          Bonjour, Dr. Paulin T.
        </h1>
<p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
          Formateur Référent Cloud &amp; Cybersécurité MINEFOP • Institut Polytechnique AZ Pulse Yaoundé. Pilotez vos promotions, validez les émargements biométriques et gérez la conformité des évaluations certificatives.
        </p>
</div>
{/*  Quick Action Toolbar  */}
<div className="flex flex-col gap-2 z-10 mt-2 xl:mt-0 shrink-0 w-full sm:w-auto">
<button className="h-10 px-space-md rounded-lg bg-secondary text-on-secondary font-label-lg text-label-lg font-semibold hover:bg-secondary-container transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-95" type="button">
<span className="material-symbols-outlined text-[18px]">add_task</span>
<span className="">+ Programmer évaluation</span>
</button>
<button className="h-10 px-space-md rounded-lg bg-surface-container-high text-primary font-label-lg text-label-lg font-semibold hover:bg-surface-variant transition-colors flex items-center justify-center gap-2" type="button">
<span className="material-symbols-outlined text-[18px]">edit_note</span>
<span className="">Saisir notes</span>
</button>
<button className="h-10 px-space-md rounded-lg bg-surface-container-high text-primary font-label-lg text-label-lg font-semibold hover:bg-surface-variant transition-colors flex items-center justify-center gap-2" type="button">
<span className="material-symbols-outlined text-[18px]">upload_file</span>
<span className="">Partager support</span>
</button>
</div>
</div>
</section>
{/*  High-Density Analytical Metric Stream (KPIs)  */}
<section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md mb-space-lg">
{/*  Metric 1  */}
<div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
<div className="flex items-center justify-between mb-space-xs">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Promotions Actives</span>
<div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
<span className="material-symbols-outlined text-[20px]">groups</span>
</div>
</div>
<div className="flex items-baseline gap-space-xs">
<span className="font-display-hero-mobile text-display-hero-mobile text-primary font-extrabold tracking-tight">4</span>
<span className="font-label-md text-label-md text-secondary font-bold">promotions</span>
</div>
<div className="flex items-center justify-between mt-2 pt-2 border-none">
<span className="font-body-sm text-body-sm text-on-surface-variant">120 apprenants inscrits</span>
<span className="inline-flex items-center text-label-sm font-label-sm text-secondary font-bold gap-0.5">
<span className="material-symbols-outlined text-[14px]">verified</span> 100% audité
        </span>
</div>
<div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary"></div>
</div>
{/*  Metric 2  */}
<div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
<div className="flex items-center justify-between mb-space-xs">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Cours Aujourd'hui</span>
<div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
<span className="material-symbols-outlined text-[20px]">calendar_today</span>
</div>
</div>
<div className="flex items-baseline gap-space-xs">
<span className="font-display-hero-mobile text-display-hero-mobile text-primary font-extrabold tracking-tight">2</span>
<span className="font-label-md text-label-md text-primary font-bold">sessions (6.5h)</span>
</div>
<div className="flex items-center justify-between mt-2 pt-2">
<span className="font-body-sm text-body-sm text-on-surface-variant truncate">09h-12h30 • 14h-17h00</span>
<span className="inline-flex items-center px-2 py-0.5 rounded bg-tertiary-fixed-dim/20 text-on-tertiary-container font-label-sm text-label-sm font-bold">
          En direct
        </span>
</div>
<div className="absolute bottom-0 left-0 right-0 h-1 bg-tertiary-fixed-dim"></div>
</div>
{/*  Metric 3  */}
<div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
<div className="flex items-center justify-between mb-space-xs">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Évaluations à corriger</span>
<div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-error">
<span className="material-symbols-outlined text-[20px]">rate_review</span>
</div>
</div>
<div className="flex items-baseline gap-space-xs">
<span className="font-display-hero-mobile text-display-hero-mobile text-primary font-extrabold tracking-tight">28</span>
<span className="font-label-md text-label-md text-error font-bold">copies</span>
</div>
<div className="flex items-center justify-between mt-2 pt-2">
<span className="font-body-sm text-body-sm text-on-surface-variant">TP Docker Cloud - J+2</span>
<span className="font-label-sm text-label-sm text-error font-bold">Urgence note</span>
</div>
<div className="absolute bottom-0 left-0 right-0 h-1 bg-error"></div>
</div>
{/*  Metric 4  */}
<div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
<div className="flex items-center justify-between mb-space-xs">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Taux d'Assiduité</span>
<div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
<span className="material-symbols-outlined text-[20px]">insights</span>
</div>
</div>
<div className="flex items-baseline gap-space-xs">
<span className="font-display-hero-mobile text-display-hero-mobile text-primary font-extrabold tracking-tight">94.2%</span>
<span className="inline-flex items-center font-label-sm text-label-sm text-secondary font-bold">
<span className="material-symbols-outlined text-[16px]">trending_up</span> +1.8%
        </span>
</div>
<div className="flex items-center justify-between mt-2 pt-2">
<span className="font-body-sm text-body-sm text-on-surface-variant">Benchmark campus: 88%</span>
<span className="font-label-sm text-label-sm text-primary font-semibold">Excellence</span>
</div>
<div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary-container"></div>
</div>
</section>
{/*  Central Mosaic Grid: Sessions & Live Check-in + Evaluations  */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg mb-space-lg">
{/*  LEFT PANEL: Sessions du Jour & Appel en Direct (7 cols)  */}
<section className="lg:col-span-7 flex flex-col gap-space-md">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<div className="w-2.5 h-6 rounded-full bg-secondary"></div>
<h2 className="font-headline-lg text-headline-lg text-primary font-bold">Sessions du Jour &amp; Appel en direct</h2>
</div>
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-mono">Mercredi, 07 Novembre 2025</span>
</div>
{/*  Live Session Card 1 (In Progress)  */}
<div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md relative overflow-hidden">
<div className="flex flex-wrap items-start justify-between gap-space-sm">
<div className="flex items-start gap-space-sm">
<div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-bold font-headline-md text-headline-md shrink-0 shadow-inner">
              01
            </div>
<div>
<div className="flex flex-col gap-2 z-10 mt-2 xl:mt-0 shrink-0 w-full sm:w-auto">
<button className="h-10 px-space-md rounded-lg bg-secondary text-on-secondary font-label-lg text-label-lg font-semibold hover:bg-secondary-container transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-95" type="button">
<span className="material-symbols-outlined text-[18px]">add_task</span>
<span className="">+ Programmer évaluation</span>
</button>
<button className="h-10 px-space-md rounded-lg bg-surface-container-high text-primary font-label-lg text-label-lg font-semibold hover:bg-surface-variant transition-colors flex items-center justify-center gap-2" type="button">
<span className="material-symbols-outlined text-[18px]">edit_note</span>
<span className="">Saisir notes</span>
</button>
<button className="h-10 px-space-md rounded-lg bg-surface-container-high text-primary font-label-lg text-label-lg font-semibold hover:bg-surface-variant transition-colors flex items-center justify-center gap-2" type="button">
<span className="material-symbols-outlined text-[18px]">upload_file</span>
<span className="">Partager support</span>
</button>
</div>
<h3 className="font-headline-md text-headline-md text-primary font-bold mt-1">
                Sécurisation Infrastructures Cloud (Promo 2025-A)
              </h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">
                Module M-CYB402 • Architecture IAM, PKI interne et segmentation VPC AWS/Azure.
              </p>
</div>
</div>
<button className="h-9 px-space-sm rounded-lg bg-surface-container text-primary hover:bg-surface-variant font-label-md text-label-md font-semibold transition-colors flex items-center gap-1.5 shrink-0" type="button">
<span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
<span className="">QR Scanner</span>
</button>
</div>
{/*  Attendance Pulse Telemetry Bar  */}
<div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-sm">
<div className="flex items-center justify-between text-on-surface">
<div className="flex items-center gap-space-sm">
<span className="font-label-md text-label-md font-bold text-primary">Statut Présence Direct :</span>
<span className="font-label-md text-label-md text-secondary font-bold">26 Présents</span>
<span className="text-on-surface-variant font-body-sm text-body-sm">/</span>
<span className="font-label-md text-label-md text-error font-bold">2 Absents signalés</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">(Total 28)</span>
</div>
<span className="font-label-md text-label-md font-extrabold text-secondary">92.8% Présence</span>
</div>
{/*  Custom Gauge Bar  */}
<div className="w-full h-3 bg-surface-container rounded-full overflow-hidden flex shadow-inner">
<div className="bg-secondary h-full rounded-full transition-all duration-700" style={{ width: '92.8%' }}></div>
<div className="bg-error h-full rounded-full transition-all duration-700" style={{ width: '7.2%' }}></div>
</div>
{/*  Micro Student List for Quick Action  */}
<div className="flex items-center justify-between pt-1">
<div className="flex items-center -space-x-2 overflow-hidden">
<div className="inline-block h-7 w-7 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm text-center leading-7 font-bold ring-2 ring-surface-container-lowest">AB</div>
<div className="inline-block h-7 w-7 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm text-center leading-7 font-bold ring-2 ring-surface-container-lowest">ET</div>
<div className="inline-block h-7 w-7 rounded-full bg-tertiary-container text-on-tertiary font-label-sm text-label-sm text-center leading-7 font-bold ring-2 ring-surface-container-lowest">MN</div>
<div className="inline-block h-7 w-7 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm text-center leading-7 font-bold ring-2 ring-surface-container-lowest">+23</div>
</div>
<div className="flex items-center gap-2">
<span className="font-body-sm text-body-sm text-error flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">warning</span> Absents: N. Franck, O. Sarah
              </span>
<button className="px-2.5 py-1 rounded bg-surface-container-lowest text-primary hover:bg-surface font-label-sm text-label-sm font-bold shadow-sm transition-all" type="button">
                Clôturer émargement
              </button>
</div>
</div>
</div>
</div>
{/*  Afternoon Session Card (Upcoming)  */}
<div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
<div className="flex flex-wrap items-start justify-between gap-space-sm">
<div className="flex items-start gap-space-sm">
<div className="w-12 h-12 rounded-xl bg-surface-container-high text-on-surface-variant flex items-center justify-center font-bold font-headline-md text-headline-md shrink-0">
              02
            </div>
<div>
<div className="flex flex-col gap-2 z-10 mt-2 xl:mt-0 shrink-0 w-full sm:w-auto">
<button className="h-10 px-space-md rounded-lg bg-secondary text-on-secondary font-label-lg text-label-lg font-semibold hover:bg-secondary-container transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-95" type="button">
<span className="material-symbols-outlined text-[18px]">add_task</span>
<span className="">+ Programmer évaluation</span>
</button>
<button className="h-10 px-space-md rounded-lg bg-surface-container-high text-primary font-label-lg text-label-lg font-semibold hover:bg-surface-variant transition-colors flex items-center justify-center gap-2" type="button">
<span className="material-symbols-outlined text-[18px]">edit_note</span>
<span className="">Saisir notes</span>
</button>
<button className="h-10 px-space-md rounded-lg bg-surface-container-high text-primary font-label-lg text-label-lg font-semibold hover:bg-surface-variant transition-colors flex items-center justify-center gap-2" type="button">
<span className="material-symbols-outlined text-[18px]">upload_file</span>
<span className="">Partager support</span>
</button>
</div>
<h3 className="font-headline-md text-headline-md text-primary font-bold mt-1">
                Architecture Micro-services &amp; Orchestration Docker
              </h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">
                Master 1 Génie Logiciel • Déploiement clusters Swarm et registries privées sécurisées.
              </p>
</div>
</div>
</div>
<div className="bg-surface-container-low rounded-xl p-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
<div className="flex items-center gap-space-sm">
<div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
<span className="material-symbols-outlined text-[20px]">fingerprint</span>
</div>
<div className="flex flex-col">
<span className="font-label-md text-label-md font-bold text-primary">Émargement électronique prêt</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Généré via code PIN unique ou badge NFC AZ Card</span>
</div>
</div>
<div className="flex items-center gap-2">
<button className="h-9 px-space-md rounded-lg bg-secondary text-on-secondary font-label-md text-label-md font-semibold hover:bg-secondary-container transition-colors shadow-sm" type="button">
              Activer l'appel
            </button>
<button className="h-9 px-space-sm rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors" title="Télécharger fiche présence papier" type="button">
<span className="material-symbols-outlined text-[18px]">print</span>
</button>
</div>
</div>
</div>
</section>
{/*  RIGHT PANEL: Évaluations & Notes à Saisir (5 cols)  */}
<section className="lg:col-span-5 flex flex-col gap-space-md">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<div className="w-2.5 h-6 rounded-full bg-tertiary-fixed-dim"></div>
<h2 className="font-headline-lg text-headline-lg text-primary font-bold">Évaluations &amp; Notes</h2>
</div>
<button className="font-label-sm text-label-sm text-secondary font-bold hover:underline" type="button">
          Historique semestriel
        </button>
</div>
{/*  Action Card with Form Table Context  */}
<div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md flex-1">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Contrôles continus &amp; Certifications</span>
<span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">1 En attente</span>
</div>
{/*  Interactive Evaluation List  */}
<div className="flex flex-col gap-space-sm">
{/*  Item 1 : À Noter  */}
<div className="p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col gap-2">
<div className="flex items-center justify-between">
<span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">
                À NOTER IMMÉDIATEMENT
              </span>
<span className="font-label-sm text-label-sm text-outline font-mono">Date: 05 Nov 2025</span>
</div>
<div className="flex items-start justify-between gap-space-xs">
<div>
<h4 className="font-label-lg text-label-lg font-bold text-primary">Épreuve pratique Docker &amp; Containers</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">28 copies d'apprenants déposées sur GitLab</p>
</div>
<div className="text-right shrink-0">
<span className="font-headline-sm text-headline-sm font-extrabold text-error">28</span>
<span className="block font-label-sm text-label-sm text-outline">à valider</span>
</div>
</div>
<div className="flex items-center justify-between pt-1 border-none">
<span className="font-label-sm text-label-sm text-on-surface-variant font-mono">Barème: /20 • Coeff 3</span>
<button className="h-8 px-space-sm rounded bg-secondary text-on-secondary font-label-sm text-label-sm font-bold hover:bg-secondary-container transition-colors flex items-center gap-1 shadow-sm" type="button">
<span className="material-symbols-outlined text-[16px]">draw</span> Saisir les notes
              </button>
</div>
</div>
{/*  Item 2 : Publié  */}
<div className="p-space-sm rounded-xl bg-surface-container-lowest hover:bg-surface-container-low transition-all flex flex-col gap-2">
<div className="flex items-center justify-between">
<span className="px-2 py-0.5 rounded bg-surface-container text-secondary font-label-sm text-label-sm font-bold">
                TERMINÉ &amp; PUBLIÉ
              </span>
<span className="font-label-sm text-label-sm text-outline font-mono">Date: 28 Oct 2025</span>
</div>
<div className="flex items-start justify-between gap-space-xs">
<div>
<h4 className="font-label-lg text-label-lg font-bold text-primary">Examen partiel Linux RedHat Enterprise</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">Promo Cloud 2024-C • 32 apprenants</p>
</div>
<div className="text-right shrink-0">
<span className="font-headline-sm text-headline-sm font-extrabold text-secondary">15.4<span className="text-body-sm font-normal text-outline">/20</span></span>
<span className="block font-label-sm text-label-sm text-outline">Moyenne promo</span>
</div>
</div>
<div className="flex items-center justify-between pt-1">
<span className="font-label-sm text-label-sm text-secondary font-semibold flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">lock</span> Verrouillé MINEFOP
              </span>
<button className="text-secondary font-label-sm text-label-sm font-bold hover:underline" type="button">
                Consulter PV
              </button>
</div>
</div>
{/*  Item 3 : Planifié  */}
<div className="p-space-sm rounded-xl bg-surface-container-lowest hover:bg-surface-container-low transition-all flex flex-col gap-2">
<div className="flex items-center justify-between">
<span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-semibold">
                PLANIFIÉ
              </span>
<span className="font-label-sm text-label-sm text-outline font-mono">12 Nov 2025</span>
</div>
<div className="flex items-start justify-between gap-space-xs">
<div>
<h4 className="font-label-lg text-label-lg font-bold text-primary">TP Noté Terraform Infrastructure as Code</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">Promo 2025-A • Laboratoire Cloud 3</p>
</div>
<div className="text-right shrink-0">
<span className="material-symbols-outlined text-outline text-[22px]">event</span>
</div>
</div>
</div>
</div>
{/*  Official MINEFOP Export Action  */}
<div className="mt-auto pt-space-sm">
<button className="w-full h-11 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg font-bold hover:bg-primary transition-all flex items-center justify-center gap-2 shadow-sm" type="button">
<span className="material-symbols-outlined text-[20px]">verified_user</span>
<span className="">Exporter PV de notes officiel (MINEFOP)</span>
</button>
<p className="text-center font-label-sm text-label-sm text-outline mt-1.5">
            Génère le bordereau numérique certifié conforme avec signature électronique.
          </p>
</div>
</div>
</section>
</div>
{/*  Lower Section: Suivi & Alertes Pédagogiques + Feedback Apprenants  */}
<section className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
{/*  Pedagogical Alerts (7 cols)  */}
<div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-error"></div>
<h3 className="font-headline-md text-headline-md text-primary font-bold">Alertes &amp; Apprenants à Soutenir</h3>
</div>
<span className="px-2.5 py-0.5 rounded-full bg-error/10 text-error font-label-sm text-label-sm font-bold">
          3 dossiers urgents
        </span>
</div>
<div className="flex flex-col gap-space-sm">
{/*  Alert 1  */}
<div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm">
<div className="flex items-start gap-space-sm">
<div className="w-9 h-9 rounded-full bg-error-container text-on-error-container flex items-center justify-center font-bold text-label-md shrink-0">
<span className="material-symbols-outlined text-[18px]">priority_high</span>
</div>
<div>
<div className="flex items-center gap-2">
<h4 className="font-label-lg text-label-lg font-bold text-primary">N. Franck (Cyber-2025)</h4>
<span className="px-1.5 py-0.5 rounded bg-error/10 text-error font-label-sm text-label-sm font-semibold">2 absences consécutives</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Absence non justifiée aux modules Sécurité Réseaux du 03 et 05 nov. Risque de décrochage.</p>
</div>
</div>
<div className="flex items-center gap-2 self-end sm:self-center shrink-0">
<button className="h-8 px-space-sm rounded bg-surface-container text-primary font-label-sm text-label-sm font-bold hover:bg-surface-variant transition-colors" type="button">
              Contacter Parent / Tuteur
            </button>
</div>
</div>
{/*  Alert 2  */}
<div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm">
<div className="flex items-start gap-space-sm">
<div className="w-9 h-9 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-bold text-label-md flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-[18px]">assignment_late</span>
</div>
<div>
<div className="flex items-center gap-2">
<h4 className="font-label-lg text-label-lg font-bold text-primary">K. Jean-Marc (Cloud Architecture)</h4>
<span className="px-1.5 py-0.5 rounded bg-tertiary-fixed/50 text-on-tertiary-fixed-variant font-label-sm text-label-sm font-semibold">Rattrapage TP requis</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Échec de configuration du bastion SSH AWS. Session de tutorat recommandée avant le 10 nov.</p>
</div>
</div>
<div className="flex items-center gap-2 self-end sm:self-center shrink-0">
<button className="h-8 px-space-sm rounded bg-secondary text-on-secondary font-label-sm text-label-sm font-bold hover:bg-secondary-container transition-colors" type="button">
              Fixer créneau
            </button>
</div>
</div>
{/*  Alert 3  */}
<div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm">
<div className="flex items-start gap-space-sm">
<div className="w-9 h-9 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold text-label-md flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-[18px]">verified</span>
</div>
<div>
<div className="flex items-center gap-2">
<h4 className="font-label-lg text-label-lg font-bold text-primary">T. Danielle (Admin Sys)</h4>
<span className="px-1.5 py-0.5 rounded bg-secondary-fixed/50 text-secondary font-label-sm text-label-sm font-semibold">Validation certificat MINEFOP</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Dossier de compétences pratique complet. En attente de votre signature numérique de jury.</p>
</div>
</div>
<div className="flex items-center gap-2 self-end sm:self-center shrink-0">
<button className="h-8 px-space-sm rounded bg-primary-container text-on-primary font-label-sm text-label-sm font-bold hover:bg-primary transition-colors" type="button">
              Signer le PV
            </button>
</div>
</div>
</div>
</div>
{/*  Student Feedbacks / Qualitative Pulse (5 cols)  */}
<div className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md justify-between">
<div>
<div className="flex items-center justify-between mb-space-sm">
<div className="flex items-center gap-2">
<div className="w-2.5 h-6 rounded-full bg-secondary-container"></div>
<h3 className="font-headline-md text-headline-md text-primary font-bold">Retours &amp; Avis Apprenants</h3>
</div>
<span className="font-label-sm text-label-sm text-secondary font-bold">4.8 / 5.0 (Global)</span>
</div>
<div className="flex flex-col gap-space-sm">
{/*  Feedback 1  */}
<div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-1">
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md font-bold text-primary">Christian M. • Promo Cyber 2025</span>
<div className="flex text-tertiary-fixed-dim">
<span className="material-symbols-outlined text-[16px]">star</span>
<span className="material-symbols-outlined text-[16px]">star</span>
<span className="material-symbols-outlined text-[16px]">star</span>
<span className="material-symbols-outlined text-[16px]">star</span>
<span className="material-symbols-outlined text-[16px]">star</span>
</div>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant italic">
              "Excellente explication des règles de pare-feu iptables et du sniffing Wireshark. Les labs en présentiel sont ultra concrets."
            </p>
<span className="font-label-sm text-label-sm text-outline font-mono">Hier à 17:45 • Module CCNA Sec</span>
</div>
{/*  Feedback 2  */}
<div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-1">
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md font-bold text-primary">Béatrice S. • DevSecOps</span>
<div className="flex text-tertiary-fixed-dim">
<span className="material-symbols-outlined text-[16px]">star</span>
<span className="material-symbols-outlined text-[16px]">star</span>
<span className="material-symbols-outlined text-[16px]">star</span>
<span className="material-symbols-outlined text-[16px]">star</span>
<span className="material-symbols-outlined text-[16px] text-surface-variant">star</span>
</div>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant italic">
              "Le rythme était soutenu sur Terraform mais les supports partagés sur le portail AZ Pulse aident énormément pour réviser à la maison."
            </p>
<span className="font-label-sm text-label-sm text-outline font-mono">04 Nov 2025 • Module IaC</span>
</div>
</div>
</div>
{/*  Pedagogy Quality Badge  */}
<div className="p-space-sm rounded-xl bg-surface-container flex items-center justify-between mt-2">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-secondary text-[22px]">workspace_premium</span>
<div className="flex flex-col">
<span className="font-label-md text-label-md font-bold text-primary">Label d'Excellence Pédagogique AZ</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">Qualité certifiée selon le référentiel MINEFOP Cameroun</span>
</div>
</div>
<span className="font-label-sm text-label-sm text-secondary font-bold shrink-0">Semestre 1</span>
</div>
</div>
</section>
</div></main>
  );
};

export default FormateurDashboard;
