<main className="p-8 max-w-[1440px] w-full mx-auto space-y-6">
{/*  SECTION 1: HERO WELCOME BANNER  */}
<div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#0b2545] via-[#133e6d] to-[#1e549f] p-8 text-on-primary shadow-md specular-border">
{/*  Background Subtle Architecture Mesh Vector  */}
<div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
<div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none"></div>
<div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
<div className="space-y-2.5 max-w-3xl">
<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest/15 backdrop-blur-md border border-surface-container-lowest/25 text-tertiary-fixed-dim text-label-sm font-label-sm">
<span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim pulse-glow-amber"></span>
<span className="text-surface-container-lowest font-bold">CLIENT ENTREPRISE</span>
<span className="text-surface-container-lowest/60">•</span>
<span className="text-secondary-fixed">Contrat Actif (Formule Entreprise Pro)</span>
</div>
<h1 className="text-headline-xl font-headline-xl text-surface-container-lowest font-bold tracking-tight">
                Bonjour, Global Tech SARL
              </h1>
<p className="text-body-md font-body-md text-surface-container-lowest/80 leading-relaxed">
                Gestionnaire de compte référent : <span className="font-semibold text-surface-container-lowest">Dr. Paulin T. (AZ Corporation)</span> • Réf. Contrat : <span className="font-mono text-tertiary-fixed font-semibold">CTR-AZ-2025-B2B-049</span> • <span className="inline-flex items-center gap-1 text-emerald-300 font-semibold"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>SLA Garanti 99.9%</span>
</p>
</div>
{/*  Quick Action Glass Buttons  */}
<div className="flex flex-wrap items-center gap-2.5 shrink-0">
<button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container-lowest text-primary hover:bg-surface-container font-label-md text-label-md font-bold shadow-md transition-all active:scale-98">
<span className="material-symbols-outlined text-secondary" style={{ fontSize: '18px' }}>add_circle</span>
<span>Nouveau ticket</span>
</button>
<button className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 text-surface-container-lowest backdrop-blur-md border border-surface-container-lowest/30 font-label-md text-label-md font-semibold transition-all">
<span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
<span>Télécharger facture</span>
</button>
<button className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 text-surface-container-lowest backdrop-blur-md border border-surface-container-lowest/30 font-label-md text-label-md font-semibold transition-all">
<span className="material-symbols-outlined" style={{ fontSize: '18px' }}>visibility</span>
<span>Voir contrat</span>
</button>
</div>
</div>
</div>
{/*  SECTION 2: KPI STRIP (4 Analytical Cards)  */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
{/*  KPI 1: Projets en cours  */}
<div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/60 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
<div className="flex items-center justify-between mb-3">
<span className="text-label-md font-label-md text-outline font-semibold">Projets en cours</span>
<div className="w-10 h-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
<span className="material-symbols-outlined" style={{ fontSize: '22px' }}>folder_open</span>
</div>
</div>
<div className="flex items-baseline gap-2">
<span className="text-display-hero-mobile font-display-hero-mobile text-primary font-bold">3</span>
<span className="text-label-sm font-label-sm text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">+1 ce trimestre</span>
</div>
<p className="mt-2 text-body-sm font-body-sm text-on-surface-variant flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              actifs sur 4 commandés
            </p>
</div>
{/*  KPI 2: Formations souscrites  */}
<div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/60 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
<div className="flex items-center justify-between mb-3">
<span className="text-label-md font-label-md text-outline font-semibold">Formations souscrites</span>
<div className="w-10 h-10 rounded-lg bg-primary-container/10 text-primary-container flex items-center justify-center">
<span className="material-symbols-outlined" style={{ fontSize: '22px' }}>school</span>
</div>
</div>
<div className="flex items-baseline gap-2">
<span className="text-display-hero-mobile font-display-hero-mobile text-primary font-bold">18</span>
<span className="text-label-sm font-label-sm text-secondary bg-secondary/10 px-2 py-0.5 rounded-full font-semibold">94% complétion</span>
</div>
<p className="mt-2 text-body-sm font-body-sm text-on-surface-variant flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              collaborateurs formés • 2 cursus MINEFOP
            </p>
</div>
{/*  KPI 3: Factures en attente (Warning Amber Accent)  */}
<div className="bg-surface-container-lowest rounded-xl p-5 border border-tertiary-fixed-dim/40 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
<div className="flex items-center justify-between mb-3">
<span className="text-label-md font-label-md text-on-tertiary-container font-semibold">Factures en attente</span>
<div className="w-10 h-10 rounded-lg bg-tertiary-fixed/40 text-on-tertiary-container flex items-center justify-center">
<span className="material-symbols-outlined" style={{ fontSize: '22px' }}>warning</span>
</div>
</div>
<div className="flex items-baseline gap-2">
<span className="text-display-hero-mobile font-display-hero-mobile text-on-tertiary-container font-bold">1</span>
<span className="text-label-md font-label-md font-bold text-on-tertiary-container">1 450 000 FCFA</span>
</div>
<p className="mt-2 text-body-sm font-body-sm text-on-tertiary-container/80 flex items-center gap-1 font-medium">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim pulse-glow-amber"></span>
              à régler sous 8 jours (échéance 25 Nov)
            </p>
</div>
{/*  KPI 4: Tickets Support  */}
<div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/60 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
<div className="flex items-center justify-between mb-3">
<span className="text-label-md font-label-md text-outline font-semibold">Tickets Support</span>
<div className="w-10 h-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
<span className="material-symbols-outlined" style={{ fontSize: '22px' }}>support_agent</span>
</div>
</div>
<div className="flex items-baseline gap-2">
<span className="text-display-hero-mobile font-display-hero-mobile text-primary font-bold">1</span>
<span className="text-label-sm font-label-sm text-primary-container bg-surface-container-high px-2 py-0.5 rounded-full font-semibold">Urgence : Normale</span>
</div>
<p className="mt-2 text-body-sm font-body-sm text-on-surface-variant flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              ouvert • SLA &lt; 2h respecté
            </p>
</div>
</div>
{/*  SECTION 3: 2-COLUMN MAIN CONTENT GRID (7/5 split)  */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
{/*  LEFT COLUMN (7 cols): Mes Projets Actifs  */}
<div className="lg:col-span-7 space-y-4">
<div className="flex items-center justify-between px-1">
<div className="flex items-center gap-2.5">
<div className="w-1.5 h-6 rounded-full bg-secondary"></div>
<h2 className="text-headline-md font-headline-md text-primary font-bold">Mes Projets Actifs</h2>
</div>
<a className="text-label-md font-label-md text-secondary hover:text-on-secondary-fixed-variant font-semibold flex items-center gap-1" href="#">
<span>Voir tous les projets (3)</span>
<span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
</a>
</div>
{/*  Project Card 1: SD-WAN Infrastructure  */}
<div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/60 shadow-sm hover:border-secondary/30 transition-all space-y-4">
<div className="flex items-start justify-between gap-4">
<div className="space-y-1">
<div className="flex items-center gap-2 flex-wrap">
<span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      En cours (Phase 3/4)
                    </span>
<span className="text-label-sm font-label-sm text-outline">Code : PRJ-SDWAN-25</span>
</div>
<h3 className="text-headline-sm font-headline-sm text-primary font-bold hover:text-secondary cursor-pointer transition-colors">
                    Déploiement Infrastructure Réseau &amp; Sécurité SD-WAN
                  </h3>
<p className="text-body-sm font-body-sm text-on-surface-variant">
                    Migration des 4 agences vers le backbone sécurisé AZ Corporation.
                  </p>
</div>
<span className="text-label-lg font-label-lg font-bold text-secondary bg-secondary/5 px-2.5 py-1 rounded-lg">72%</span>
</div>
{/*  Progress bar with milestones  */}
<div className="space-y-1.5">
<div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
<div className="bg-secondary h-full rounded-full transition-all duration-500" style={{ width: '72%' }}></div>
</div>
<div className="flex items-center justify-between text-[11px] text-outline font-label-sm">
<span>Jalon : Recette des routeurs Biyem-Assi</span>
<span className="font-semibold text-primary">Échéance : 15 Décembre 2025</span>
</div>
</div>
{/*  Card footer: Team Avatars & Budget indicator  */}
<div className="pt-3 border-t border-outline-variant/40 flex items-center justify-between flex-wrap gap-3">
<div className="flex items-center gap-2">
<span className="text-[11px] font-label-sm text-outline uppercase font-semibold">Équipe AZ Pulse :</span>
<div className="flex -space-x-2 overflow-hidden">
<img className="inline-block h-7 w-7 rounded-full ring-2 ring-surface-container-lowest object-cover" data-alt="Corporate headshot of an African network engineer smiling warmly in a high-tech datacenter with blue glowing server racks." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkIdwKywy9AzZVy29x3rTJ46Kc0t1XDDFIRp0_HGx52Wrpdq7PcsarlI2bDN8j77x-ojjAAkMFfb_i6yqOy5QljdwPkUNR6CRT6Cqyto8TZ3yPAQbrJ2X07XOQzlE3YfgBjTkhRDJTk3tqX1Qu7Wrc4LVpRwVsW6LTEXNUjBgJwYCv3z0eLzbG1RgY8cylh9xAnYLosKPNiECEZcSm-Ijjuq3enRpJE96ZULJC4JjfO0tAuFLt4QOj5wNDLQUc9lT-0o9pZ7-d2Eo"/>
<img className="inline-block h-7 w-7 rounded-full ring-2 ring-surface-container-lowest object-cover" data-alt="Professional female telecommunication expert in business casual clothes in an ultra-modern glass office setting with crisp natural light." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrv4TkRIlSUnmo4kO96eJQ6u4RvpEFv6Nd88PARrECAGnCNu9_dAT00CHjN6Ki24l_zx903aLRf7hnPcJdZFRZAnRv5jje6W5OFj6US4ycyenZbEQ1rgh9IgBbZtW_Nfb_TvyCowRxR4psVur-jc5yqiRYHY_AssMWRuOdLV13WBB_S0Tim1q1v9F-mnMOMBDnQrKB5fbu3Gdxf7f-unkt0C0gFnhJ0Cn1yzIq8XUcvG1ndh8_ifOkVrN5lZEkULR8iVfLY6KaVSE"/>
<img className="inline-block h-7 w-7 rounded-full ring-2 ring-surface-container-lowest object-cover" data-alt="Portrait of a young male Cameroonian systems specialist holding a tablet in a bright tech corporate hub." src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_BjErN_w6JtyztgEFYqFk9AYTzoRoPd-Sz50dF1HHd4CzYTFE_qNLgi2JS943h7hXmAJhKQptrGL9KYD2UpIyH3S6IWZgffLlCak648iQkJtCG1yyIOPOIsnkBBd9s3hKNCjLqH7glv8TBeQ5DUBcWbdp-Xse79kr9HlvPjzwnKWufl6gHafAN9t8SkQ5LyItd2yL41c7KZV_QlFo2qkOTr5qtkrZfJD_RgLdSamnrmpg8o_1C6ZzsJbZpAo2Zg5mvwoEchBtqjg"/>
</div>
</div>
<div className="flex items-center gap-1.5 text-label-sm font-label-sm text-on-surface-variant">
<span className="material-symbols-outlined text-outline" style={{ fontSize: '16px' }}>account_balance_wallet</span>
<span className="font-bold text-primary">8 500 000</span> / 12 000 000 FCFA engagés
                </div>
</div>
</div>
{/*  Project Card 2: Formations DevOps & Cloud  */}
<div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/60 shadow-sm hover:border-secondary/30 transition-all space-y-4">
<div className="flex items-start justify-between gap-4">
<div className="space-y-1">
<div className="flex items-center gap-2 flex-wrap">
<span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-secondary/10 text-secondary border border-secondary/20">
                      En cours (Promotion B2B)
                    </span>
<span className="text-label-sm font-label-sm text-outline">Code : FORM-DVOPS-02</span>
</div>
<h3 className="text-headline-sm font-headline-sm text-primary font-bold hover:text-secondary cursor-pointer transition-colors">
                    Programme de Montée en Compétences DevOps &amp; Cloud
                  </h3>
<p className="text-body-sm font-body-sm text-on-surface-variant">
                    Formation certifiante MINEFOP de 12 ingénieurs télécoms.
                  </p>
</div>
<span className="text-label-lg font-label-lg font-bold text-secondary bg-secondary/5 px-2.5 py-1 rounded-lg">48%</span>
</div>
{/*  Progress bar  */}
<div className="space-y-1.5">
<div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
<div className="bg-secondary h-full rounded-full transition-all duration-500" style={{ width: '48%' }}></div>
</div>
<div className="flex items-center justify-between text-[11px] text-outline font-label-sm">
<span>Module 3/6 : Orchestration Kubernetes &amp; Helm</span>
<span className="font-semibold text-primary">Échéance : 28 Février 2026</span>
</div>
</div>
{/*  Card footer  */}
<div className="pt-3 border-t border-outline-variant/40 flex items-center justify-between flex-wrap gap-3">
<div className="flex items-center gap-2">
<span className="text-[11px] font-label-sm text-outline uppercase font-semibold">Formateurs :</span>
<div className="flex -space-x-2 overflow-hidden">
<img className="inline-block h-7 w-7 rounded-full ring-2 ring-surface-container-lowest object-cover" data-alt="Experienced African senior software instructor lecturing with confidence in a modern glass meeting room with smart presentation screens." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7GeNxnyJxx5DkLgvSR53uMsOEPYJwzTiUWPqYL60ZPwPHCkxq1lFqtYAEmFQZz8EwEnXNr6feXMOBau6oWEbiK0516WcftFnezaG66pq8I62kP7YPbYMCJ3iw5p4X6JfDpBA3RT5xiVgFFD3gLM7_m3CFCmXUH-tYzLxzzbuy7XrzB92NulILwNc0oVGd2Qbe5X_oM-J0zvESYG0lsvIIN5cVfcBc-LZ8aPd5yAD5BYzEuvuLo6Gr1nAFHjLzJo6Rxa0NHittJ4k"/>
<img className="inline-block h-7 w-7 rounded-full ring-2 ring-surface-container-lowest object-cover" data-alt="Portrait of a female African cloud architect professional in modern glasses and formal business wear." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbb4VfhWEJ-xLm2cVxA2_KBMlHhmqZHMo_mkrDf3_CemmeGnSVQYEir7bH4-TLcT8apvqEazo4EIX2bTCOhuOrVejUJJ0JRXb-C3TJ5mDewRAbBW1j_GoSznnWwz-rs1HFJ8oTNVP_evXe-butwLKW24d4br2giBCsBUsu--UrqgUxQeKsCS4XYyGUShpcbneBWVPDOahTRzR4SnPDU5jM0mivCeqbtLMB7IdusLhYIZje-YxBWpsOep47qhazpsJblcUercpKJzI"/>
</div>
</div>
<div className="flex items-center gap-1.5 text-label-sm font-label-sm text-on-surface-variant">
<span className="material-symbols-outlined text-outline" style={{ fontSize: '16px' }}>account_balance_wallet</span>
<span className="font-bold text-primary">3 200 000</span> / 4 500 000 FCFA engagés
                </div>
</div>
</div>
{/*  Project Card 3: Audit Cybersécurité & PRA  */}
<div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/60 shadow-sm hover:border-secondary/30 transition-all space-y-4">
<div className="flex items-start justify-between gap-4">
<div className="space-y-1">
<div className="flex items-center gap-2 flex-wrap">
<span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      Planifié (Démarrage J+10)
                    </span>
<span className="text-label-sm font-label-sm text-outline">Code : AUD-SEC-88</span>
</div>
<h3 className="text-headline-sm font-headline-sm text-primary font-bold hover:text-secondary cursor-pointer transition-colors">
                    Audit Cybersécurité &amp; Conformité Données Partenaires
                  </h3>
<p className="text-body-sm font-body-sm text-on-surface-variant">
                    Pentesting externe et revue du plan de reprise d'activité (PRA).
                  </p>
</div>
<span className="text-label-lg font-label-lg font-bold text-outline bg-surface-container px-2.5 py-1 rounded-lg">15%</span>
</div>
{/*  Progress bar  */}
<div className="space-y-1.5">
<div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
<div className="bg-primary-container h-full rounded-full transition-all duration-500" style={{ width: '15%' }}></div>
</div>
<div className="flex items-center justify-between text-[11px] text-outline font-label-sm">
<span>Jalon : Recueil du périmètre IP et validation RGPD/ANTIC</span>
<span className="font-semibold text-primary">Échéance : 10 Janvier 2026</span>
</div>
</div>
{/*  Card footer  */}
<div className="pt-3 border-t border-outline-variant/40 flex items-center justify-between flex-wrap gap-3">
<div className="flex items-center gap-2">
<span className="text-[11px] font-label-sm text-outline uppercase font-semibold">Lead Auditeur :</span>
<div className="flex -space-x-2 overflow-hidden">
<img className="inline-block h-7 w-7 rounded-full ring-2 ring-surface-container-lowest object-cover" data-alt="Portrait photo of a cybersecurity expert in a dark suit standing in a sleek server monitoring security center." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-oUrKkQQ-yVy7USEuHwI1w52bQI1hRuSxTDNfVyEySx5PXZLrlOQ0C8lW1wn7oJWRWBmv-fXFG54TXxpdDfJAKT5OJYobneb0cbpULYbZqfxLzBGnHEh_vEmNcazQpcJFtPtUdEBP2F0cxJHxQMSKKg3OsigqUn0pOUgAc9J2R71YVbZKd95O2oOl01icPWuF-0mO3WyrC0jce7JLHiViqSCHIJvlJYmb-YBvx8gVXIDsv03_2gOwyLx7cPwKxv2B3oDBi5Vwq64"/>
</div>
</div>
<div className="flex items-center gap-1.5 text-label-sm font-label-sm text-on-surface-variant">
<span className="material-symbols-outlined text-outline" style={{ fontSize: '16px' }}>account_balance_wallet</span>
<span className="font-bold text-primary">2 100 000 FCFA</span> (Devis validé)
                </div>
</div>
</div>
</div>
{/*  RIGHT COLUMN (5 cols): Facturation & Support Dédié  */}
<div className="lg:col-span-5 space-y-6">
{/*  SUB-SECTION 1: Facturation & Paiements  */}
<div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/60 shadow-sm space-y-4">
<div className="flex items-center justify-between pb-3 border-b border-outline-variant/40">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary" style={{ fontSize: '20px' }}>receipt_long</span>
<h3 className="text-headline-sm font-headline-sm text-primary font-bold">Facturation Récente</h3>
</div>
<a className="text-[12px] font-label-md font-semibold text-secondary hover:underline" href="#">
                  Historique complet
                </a>
</div>
{/*  Invoices List  */}
<div className="space-y-3">
{/*  Invoice 1 (Pending Payment - Amber Highlight)  */}
<div className="p-3.5 rounded-lg border border-tertiary-fixed-dim/40 bg-amber-50/40 space-y-2.5">
<div className="flex items-start justify-between gap-2">
<div>
<div className="flex items-center gap-1.5">
<span className="font-mono text-label-md font-bold text-primary">#FAC-2025-089</span>
<span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          En attente
                        </span>
</div>
<span className="text-body-sm font-body-sm text-outline">Acompte SD-WAN Phase 3</span>
</div>
<span className="text-headline-sm font-headline-sm font-extrabold text-on-tertiary-container">1 450 000 FCFA</span>
</div>
<div className="flex items-center justify-between pt-1 border-t border-amber-200/50">
<span className="text-[11px] text-amber-900 font-medium">Échéance : 25 Nov 2025</span>
<button className="px-3 py-1.5 rounded-lg bg-tertiary-fixed-dim hover:bg-amber-400 text-primary font-label-sm font-bold shadow-sm transition-transform active:scale-95 flex items-center gap-1">
<span className="material-symbols-outlined" style={{ fontSize: '15px' }}>credit_card</span>
<span>Payer maintenant</span>
</button>
</div>
</div>
{/*  Invoice 2 (Paid)  */}
<div className="p-3.5 rounded-lg border border-outline-variant/50 hover:bg-surface-container-low transition-colors flex items-center justify-between gap-3">
<div>
<div className="flex items-center gap-1.5">
<span className="font-mono text-label-md font-bold text-primary">#FAC-2025-072</span>
<span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        Payée
                      </span>
</div>
<span className="text-body-sm font-body-sm text-outline">Session Formation MINEFOP • 15 Oct 2025</span>
</div>
<div className="text-right">
<div className="text-label-lg font-label-lg font-bold text-primary">4 200 000 FCFA</div>
<button className="text-[11px] text-secondary hover:underline flex items-center gap-0.5 justify-end mt-0.5">
<span className="material-symbols-outlined" style={{ fontSize: '13px' }}>download</span>
<span>Télécharger reçu</span>
</button>
</div>
</div>
{/*  Invoice 3 (Paid)  */}
<div className="p-3.5 rounded-lg border border-outline-variant/50 hover:bg-surface-container-low transition-colors flex items-center justify-between gap-3">
<div>
<div className="flex items-center gap-1.5">
<span className="font-mono text-label-md font-bold text-primary">#FAC-2025-064</span>
<span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        Payée
                      </span>
</div>
<span className="text-body-sm font-body-sm text-outline">Audit initial &amp; cadrage • 30 Sept 2025</span>
</div>
<div className="text-right">
<div className="text-label-lg font-label-lg font-bold text-primary">2 850 000 FCFA</div>
<button className="text-[11px] text-secondary hover:underline flex items-center gap-0.5 justify-end mt-0.5">
<span className="material-symbols-outlined" style={{ fontSize: '13px' }}>download</span>
<span>Télécharger reçu</span>
</button>
</div>
</div>
</div>
</div>
{/*  SUB-SECTION 2: Tickets & Support Dédié  */}
<div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/60 shadow-sm space-y-4">
<div className="flex items-center justify-between pb-3 border-b border-outline-variant/40">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary" style={{ fontSize: '20px' }}>headset_mic</span>
<h3 className="text-headline-sm font-headline-sm text-primary font-bold">Support &amp; SLA Dédié</h3>
</div>
<span className="text-[11px] font-label-sm text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                  SLA &lt; 2h Actif
                </span>
</div>
{/*  Ticket Items  */}
<div className="space-y-3">
{/*  Ticket 1  */}
<div className="p-3 rounded-lg border border-secondary/20 bg-secondary/5 space-y-2">
<div className="flex items-center justify-between">
<span className="font-mono text-[12px] font-bold text-secondary">#TKT-492</span>
<span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-surface-container text-primary">
                      Priorité : Moyenne
                    </span>
</div>
<h4 className="text-label-md font-label-md font-bold text-primary">
                    Optimisation de routage VPN Yaoundé-Douala
                  </h4>
<p className="text-body-sm font-body-sm text-on-surface-variant text-[12px]">
                    Statut : <span className="font-semibold text-secondary">En cours de traitement par l'équipe N2</span>
</p>
<div className="text-[11px] text-outline flex items-center justify-between pt-1">
<span>Assigné à : Ing. Thierry M.</span>
<span>Mis à jour il y a 42 min</span>
</div>
</div>
{/*  Ticket 2  */}
<div className="p-3 rounded-lg border border-outline-variant/50 hover:bg-surface-container-low transition-colors space-y-2">
<div className="flex items-center justify-between">
<span className="font-mono text-[12px] font-bold text-outline">#TKT-481</span>
<span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                      Résolu
                    </span>
</div>
<h4 className="text-label-md font-label-md font-bold text-primary">
                    Attestation de réussite MINEFOP session Octobre
                  </h4>
<p className="text-body-sm font-body-sm text-outline text-[12px]">
                    Statut : Résolu • Documents officiels joints
                  </p>
<div className="text-[11px] text-outline flex items-center justify-between pt-1">
<span>Fermé par : Mlle Nadine K.</span>
<span>Fermé hier</span>
</div>
</div>
</div>
</div>
</div>
</div>
{/*  SECTION 4: BOTTOM ROW - TIMELINE & ACTIVITÉ RÉCENTE  */}
<div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/60 shadow-sm space-y-5">
<div className="flex items-center justify-between pb-3 border-b border-outline-variant/40">
<div className="flex items-center gap-2.5">
<div className="w-1.5 h-5 rounded-full bg-secondary"></div>
<h2 className="text-headline-md font-headline-md text-primary font-bold">Activité Récente &amp; Documents Légaux</h2>
</div>
<button className="text-label-md font-label-md font-semibold text-secondary hover:underline flex items-center gap-1">
<span>Journal complet d'audit</span>
<span className="material-symbols-outlined" style={{ fontSize: '16px' }}>receipt</span>
</button>
</div>
{/*  Chronological Activity Feed  */}
<div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-outline-variant/60">
{/*  Entry 1  */}
<div className="relative group">
<span className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-secondary border-2 border-surface-container-lowest ring-2 ring-secondary/20"></span>
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary" style={{ fontSize: '18px' }}>cloud_upload</span>
<p className="text-label-md font-label-md text-primary font-bold">
                    Nouveau livrable déposé : <span className="text-secondary font-semibold hover:underline cursor-pointer">Rapport d'architecture réseau v2.1.pdf</span>
</p>
</div>
<span className="text-body-sm font-body-sm text-outline">par Ing. Marc (AZ Pulse) • Aujourd'hui à 11:30</span>
</div>
</div>
{/*  Entry 2  */}
<div className="relative group">
<span className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-surface-container-lowest ring-2 ring-emerald-200"></span>
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-emerald-600" style={{ fontSize: '18px' }}>verified</span>
<p className="text-label-md font-label-md text-primary font-bold">
                    Validation d'émargement : 12 collaborateurs présents à la session Kubernetes
                  </p>
</div>
<span className="text-body-sm font-body-sm text-outline">Supervisé par MINEFOP • Hier à 16:45</span>
</div>
</div>
{/*  Entry 3  */}
<div className="relative group">
<span className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-tertiary-fixed-dim border-2 border-surface-container-lowest ring-2 ring-tertiary-fixed-dim/30"></span>
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-tertiary-fixed-dim" style={{ fontSize: '18px' }}>receipt</span>
<p className="text-label-md font-label-md text-primary font-bold">
                    Facture d'acompte émise : <span className="font-mono text-tertiary-container font-semibold">#FAC-2025-089</span> (1 450 000 FCFA)
                  </p>
</div>
<span className="text-body-sm font-body-sm text-outline">Direction Financière AZ Corp • Le 12 Nov 2025</span>
</div>
</div>
{/*  Entry 4  */}
<div className="relative group">
<span className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-secondary border-2 border-surface-container-lowest"></span>
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary" style={{ fontSize: '18px' }}>flag</span>
<p className="text-label-md font-label-md text-primary font-bold">
                    Mise à jour du jalon projet : Phase 2 SD-WAN recette validée sans réserve
                  </p>
</div>
<span className="text-body-sm font-body-sm text-outline">Validation conjointe DSI • Le 08 Nov 2025</span>
</div>
</div>
{/*  Entry 5  */}
<div className="relative group">
<span className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-primary-container border-2 border-surface-container-lowest"></span>
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary-container" style={{ fontSize: '18px' }}>draw</span>
<p className="text-label-md font-label-md text-primary font-bold">
                    Avenant contractuel signé : Extension de garantie serveurs Biyem-Assi
                  </p>
</div>
<span className="text-body-sm font-body-sm text-outline">Signature électronique sécurisée • Le 02 Nov 2025</span>
</div>
</div>
</div>
</div>
{/*  Corporate Portal Footer Note  */}
<footer className="pt-4 pb-8 flex flex-col sm:flex-row items-center justify-between text-outline text-body-sm font-body-sm gap-4 border-t border-outline-variant/40">
<div>
            © 2025 AZ Corporation SARL. Tous droits réservés. Plateforme B2B Sécurisée AZ PULSE.
          </div>
<div className="flex items-center gap-4 text-[12px] font-semibold">
<a className="hover:text-primary transition-colors" href="#">Politique de Confidentialité</a>
<span>•</span>
<a className="hover:text-primary transition-colors" href="#">Conditions Générales B2B</a>
<span>•</span>
<a className="hover:text-primary transition-colors" href="#">Support 24/7 N3</a>
</div>
</footer>
</main>