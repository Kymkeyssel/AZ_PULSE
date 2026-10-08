<main className="w-full pt-16 bg-surface-container-lowest min-h-screen px-gutter py-gutter"><div className="flex flex-col w-full space-y-gutter">
{/*  Dynamic Ambient Glow Backdrop  */}
<div className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary via-primary-container to-primary p-space-lg text-on-primary shadow-xl">
<div className="absolute -right-16 -top-16 w-80 h-80 bg-secondary/20 rounded-full blur-3xl pointer-events-none"></div>
<div className="absolute right-1/3 -bottom-20 w-64 h-64 bg-tertiary-fixed-dim/10 rounded-full blur-2xl pointer-events-none"></div>
<div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-space-lg">
<div className="space-y-space-xs max-w-3xl">
<div className="flex items-center gap-space-sm">
<span className="px-space-xs py-0.5 rounded text-label-sm font-label-sm uppercase tracking-wider bg-tertiary-fixed-dim text-on-tertiary-fixed">
            Gouvernance &amp; Intégrité
          </span>
<span className="flex items-center gap-1 text-label-sm font-label-sm text-secondary-fixed-dim">
<span className="material-symbols-outlined text-[14px]">lock</span>
            Chiffrement AES-256 Cloud Souverain
          </span>
</div>
<h1 className="text-headline-xl font-headline-xl tracking-tight text-on-primary">
          Knowledge Hub &amp; Base Documentaire Souveraine
        </h1>
<p className="text-body-md font-body-md text-on-primary-container max-w-2xl">
          Gouvernance documentaire de précision, traçabilité cryptographique SHA-256 et vectorisation continue couplée au moteur sémantique AZ Pulse Neural.
        </p>
</div>
<div className="flex flex-wrap items-center gap-space-sm">
<button className="flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-surface-container-lowest/10 hover:bg-surface-container-lowest/20 text-on-primary font-label-md transition-all shadow-sm" type="button">
<span className="material-symbols-outlined text-[18px]">create_new_folder</span>
<span className="">+ Créer un dossier</span>
</button>
<button className="flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-secondary-container hover:bg-secondary text-on-secondary font-label-md transition-all shadow-md" type="button">
<span className="material-symbols-outlined text-[18px]">upload_file</span>
<span className="">+ Déposer un document</span>
</button>
<button className="flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-tertiary-fixed-dim hover:brightness-105 text-on-tertiary-fixed font-label-md font-bold transition-all shadow-[0_0_16px_rgba(255,184,0,0.35)]" type="button">
<span className="material-symbols-outlined text-[18px]">auto_awesome</span>
<span className="">Interroger le Hub IA</span>
</button>
</div>
</div>
{/*  Perimeter Scope Tabs  */}
<div className="relative z-10 mt-space-lg pt-space-md border-t border-surface-container-lowest/10 flex flex-wrap items-center gap-space-xs">
<button className="px-space-md py-1.5 rounded-full bg-secondary-container text-on-secondary text-label-md font-label-md shadow-sm">
        Tous les documents (1 248)
      </button>
<button className="px-space-md py-1.5 rounded-full bg-surface-container-lowest/10 hover:bg-surface-container-lowest/20 text-on-primary-container hover:text-on-primary text-label-md font-label-md transition-colors">
        Pôle Formation (342)
      </button>
<button className="px-space-md py-1.5 rounded-full bg-surface-container-lowest/10 hover:bg-surface-container-lowest/20 text-on-primary-container hover:text-on-primary text-label-md font-label-md transition-colors">
        Pôle R&amp;D / Tech (418)
      </button>
<button className="px-space-md py-1.5 rounded-full bg-surface-container-lowest/10 hover:bg-surface-container-lowest/20 text-on-primary-container hover:text-on-primary text-label-md font-label-md transition-colors">
        Direction &amp; Juridique (288)
      </button>
<button className="px-space-md py-1.5 rounded-full bg-surface-container-lowest/10 hover:bg-surface-container-lowest/20 text-on-primary-container hover:text-on-primary text-label-md font-label-md transition-colors">
        Certifications MINEFOP (200)
      </button>
</div>
</div>
{/*  Key KPI Cards (4 metrics)  */}
<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
{/*  KPI 1  */}
<div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
<div className="flex items-start justify-between">
<div>
<span className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">Patrimoine Numérique</span>
<div className="text-headline-xl font-headline-xl text-primary mt-1">1 248</div>
</div>
<div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
<span className="material-symbols-outlined text-[22px]">folder_copy</span>
</div>
</div>
<div className="mt-3 flex items-center gap-1.5">
<span className="px-1.5 py-0.5 rounded bg-surface-container-low text-secondary font-label-sm font-bold text-[11px]">+14 ce mois</span>
<span className="text-body-sm font-body-sm text-on-surface-variant">Intégration continue</span>
</div>
<div className="w-full bg-surface-container-low h-1 rounded-full mt-3 overflow-hidden">
<div className="bg-secondary h-full rounded-full w-3/4"></div>
</div>
</div>
{/*  KPI 2  */}
<div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
<div className="flex items-start justify-between">
<div>
<span className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">Visa &amp; Conformité</span>
<div className="text-headline-xl font-headline-xl text-primary mt-1">05</div>
</div>
<div className="w-10 h-10 rounded-lg bg-error-container/60 flex items-center justify-center text-error">
<span className="material-symbols-outlined text-[22px]">pending_actions</span>
</div>
</div>
<div className="mt-3 flex items-center gap-1.5">
<span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
<span className="text-body-sm font-body-sm text-error font-medium">5 documents en attente</span>
</div>
<div className="w-full bg-surface-container-low h-1 rounded-full mt-3 overflow-hidden">
<div className="bg-error h-full rounded-full w-2/5"></div>
</div>
</div>
{/*  KPI 3  */}
<div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
<div className="flex items-start justify-between">
<div>
<span className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">Embeddings &amp; IA</span>
<div className="text-headline-xl font-headline-xl text-primary mt-1">99.4%</div>
</div>
<div className="w-10 h-10 rounded-lg bg-tertiary-fixed/40 flex items-center justify-center text-on-tertiary-fixed-variant">
<span className="material-symbols-outlined text-[22px]">psychology</span>
</div>
</div>
<div className="mt-3 flex items-center gap-1.5">
<span className="material-symbols-outlined text-[14px] text-tertiary-fixed-dim">bolt</span>
<span className="text-body-sm font-body-sm text-on-surface-variant">FastAPI Semantic Search actif</span>
</div>
<div className="w-full bg-surface-container-low h-1 rounded-full mt-3 overflow-hidden">
<div className="bg-tertiary-fixed-dim h-full rounded-full w-[99.4%]"></div>
</div>
</div>
{/*  KPI 4  */}
<div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
<div className="flex items-start justify-between">
<div>
<span className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">Stockage Coffre-Fort</span>
<div className="text-headline-xl font-headline-xl text-primary mt-1">142.6 <span className="text-headline-md font-headline-md font-normal text-on-surface-variant">/ 500 Go</span></div>
</div>
<div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[22px]">database</span>
</div>
</div>
<div className="mt-3 flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant">
<span className="">Allocation DC-1 Paris</span>
<span className="font-bold text-primary">28.5% utilisé</span>
</div>
<div className="w-full bg-surface-container-low h-1 rounded-full mt-3 overflow-hidden">
<div className="bg-primary h-full rounded-full w-[28.5%]"></div>
</div>
</div>
</div>
{/*  Semantic Search & Query Hub Strip  */}
<div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm space-y-space-sm">
<div className="relative flex items-center w-full">
<span className="material-symbols-outlined absolute left-space-md text-secondary text-[24px]">smart_toy</span>
<input className="w-full pl-12 pr-32 py-3 bg-surface-container-low text-on-surface rounded-lg text-body-md font-body-md focus:outline-none focus:ring-2 focus:ring-secondary/40 placeholder-on-surface-variant/70 shadow-inner" placeholder="Posez une question à la base documentaire ou cherchez par mots-clés, tags, hashes SHA-256..." type="text" />
<button className="absolute right-space-sm px-space-md py-1.5 bg-secondary text-on-secondary rounded-lg font-label-sm font-bold shadow-sm hover:bg-secondary/90 transition-all flex items-center gap-1" type="button">
<span className="">Recherche IA</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</button>
</div>
{/*  Quick Tags Chips  */}
<div className="flex flex-wrap items-center gap-space-xs text-body-sm font-body-sm">
<span className="text-on-surface-variant flex items-center gap-1 text-label-sm font-label-sm uppercase">
<span className="material-symbols-outlined text-[14px]">local_offer</span>
        Filtres Rapides :
      </span>
<button className="px-space-xs py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-primary font-label-sm transition-colors">
        #Architecture
      </button>
<button className="px-space-xs py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-primary font-label-sm transition-colors">
        #Contrats2025
      </button>
<button className="px-space-xs py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm font-bold transition-colors">
        #SyllabusMINEFOP
      </button>
<button className="px-space-xs py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-primary font-label-sm transition-colors">
        #ProcéduresISO27001
      </button>
<button className="px-space-xs py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-primary font-label-sm transition-colors">
        #SécuritéRéseau
      </button>
<button className="px-space-xs py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm font-semibold">
        #AuditsExternes
      </button>
</div>
</div>
{/*  Featured Hub Folders (4 Cards Grid)  */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
{/*  Folder 1  */}
<div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm hover:shadow-md transition-all group cursor-pointer border-t-2 border-secondary">
<div className="flex items-start justify-between">
<div className="w-12 h-12 rounded-xl bg-primary-container text-secondary-fixed flex items-center justify-center shadow-sm">
<span className="material-symbols-outlined text-[26px]">verified_user</span>
</div>
<span className="px-2 py-0.5 rounded-full bg-surface-container text-label-sm font-label-sm text-on-surface-variant">48 fichiers</span>
</div>
<div className="mt-4">
<h2 className="font-headline-sm text-headline-sm text-primary group-hover:text-secondary transition-colors">
          Gouvernance &amp; ISO 27001
        </h2>
<p className="text-body-sm font-body-sm text-on-surface-variant mt-1 line-clamp-2">
          Politiques PSSI, matrices des risques, audits de conformité, registres de traitement RGPD.
        </p>
</div>
<div className="mt-4 pt-space-xs flex items-center justify-between text-label-sm font-label-sm text-on-surface-variant">
<span className="flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">share</span> Direction / IT
        </span>
<span className="text-secondary font-bold">SHA-256 Validé</span>
</div>
</div>
{/*  Folder 2  */}
<div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm hover:shadow-md transition-all group cursor-pointer border-t-2 border-tertiary-fixed-dim">
<div className="flex items-start justify-between">
<div className="w-12 h-12 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shadow-sm">
<span className="material-symbols-outlined text-[26px]">school</span>
</div>
<span className="px-2 py-0.5 rounded-full bg-surface-container text-label-sm font-label-sm text-on-surface-variant">124 fichiers</span>
</div>
<div className="mt-4">
<h2 className="font-headline-sm text-headline-sm text-primary group-hover:text-secondary transition-colors">
          Syllabus &amp; MINEFOP
        </h2>
<p className="text-body-sm font-body-sm text-on-surface-variant mt-1 line-clamp-2">
          Programmes officiels, supports de cours pédagogiques, maquettes d'évaluation académique.
        </p>
</div>
<div className="mt-4 pt-space-xs flex items-center justify-between text-label-sm font-label-sm text-on-surface-variant">
<span className="flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">school</span> Pôle Formation
        </span>
<span className="text-on-tertiary-container font-bold">Homologué</span>
</div>
</div>
{/*  Folder 3  */}
<div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm hover:shadow-md transition-all group cursor-pointer border-t-2 border-primary">
<div className="flex items-start justify-between">
<div className="w-12 h-12 rounded-xl bg-surface-container-high text-primary flex items-center justify-center shadow-sm">
<span className="material-symbols-outlined text-[26px]">dns</span>
</div>
<span className="px-2 py-0.5 rounded-full bg-surface-container text-label-sm font-label-sm text-on-surface-variant">86 fichiers</span>
</div>
<div className="mt-4">
<h2 className="font-headline-sm text-headline-sm text-primary group-hover:text-secondary transition-colors">
          Architectures &amp; Datacenter
        </h2>
<p className="text-body-sm font-body-sm text-on-surface-variant mt-1 line-clamp-2">
          Schémas réseaux hybrides, déploiements Kubernetes, plans de reprise d'activité (PRA).
        </p>
</div>
<div className="mt-4 pt-space-xs flex items-center justify-between text-label-sm font-label-sm text-on-surface-variant">
<span className="flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">lan</span> Pôle IT &amp; Infra
        </span>
<span className="text-primary font-bold">Confidentialité C3</span>
</div>
</div>
{/*  Folder 4  */}
<div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm hover:shadow-md transition-all group cursor-pointer border-t-2 border-secondary-container">
<div className="flex items-start justify-between">
<div className="w-12 h-12 rounded-xl bg-secondary-fixed text-primary flex items-center justify-center shadow-sm">
<span className="material-symbols-outlined text-[26px]">contract</span>
</div>
<span className="px-2 py-0.5 rounded-full bg-surface-container text-label-sm font-label-sm text-on-surface-variant">62 fichiers</span>
</div>
<div className="mt-4">
<h2 className="font-headline-sm text-headline-sm text-primary group-hover:text-secondary transition-colors">
          Modèles Contrats &amp; BAP
        </h2>
<p className="text-body-sm font-body-sm text-on-surface-variant mt-1 line-clamp-2">
          Conventions d'infogérance cloud, accords SLA 99.98%, bons de commande BAP entreprises.
        </p>
</div>
<div className="mt-4 pt-space-xs flex items-center justify-between text-label-sm font-label-sm text-on-surface-variant">
<span className="flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">gavel</span> Juridique &amp; CRM
        </span>
<span className="text-secondary font-bold">Versions 2025</span>
</div>
</div>
</div>
{/*  Two-Column Main Layout: Document Repository Table (Left 8 cols) + AI Copilot Widget (Right 4 cols)  */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
{/*  Left Panel: Document Table & Versioning (8 cols)  */}
<div className="lg:col-span-8 space-y-space-md">
<div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
<div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-sm gap-space-xs">
<div>
<h3 className="font-headline-md text-headline-md text-primary">Référentiel Documentaire Actif</h3>
<p className="text-body-sm font-body-sm text-on-surface-variant">Versioning audité, empreintes cryptographiques et signatures électroniques</p>
</div>
<div className="flex items-center gap-space-xs">
<button className="p-2 rounded bg-surface-container hover:bg-surface-container-high text-primary transition-colors" title="Vue Tableau">
<span className="material-symbols-outlined text-[20px]">table_rows</span>
</button>
<button className="p-2 rounded bg-surface-container-low hover:bg-surface-container text-on-surface-variant transition-colors" title="Vue Grille">
<span className="material-symbols-outlined text-[20px]">grid_view</span>
</button>
<button className="px-space-sm py-1.5 rounded bg-surface-container text-label-sm font-label-sm text-primary flex items-center gap-1">
<span className="material-symbols-outlined text-[16px]">filter_list</span>
              Filtrer
            </button>
</div>
</div>
{/*  Document Table  */}
<div className="overflow-x-auto mt-space-sm">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
<th className="py-3 px-space-sm rounded-l-lg">Document / Nom</th>
<th className="py-3 px-space-sm">Catégorie</th>
<th className="py-3 px-space-sm">Version</th>
<th className="py-3 px-space-sm">Statut</th>
<th className="py-3 px-space-sm">Auteur</th>
<th className="py-3 px-space-sm">Date</th>
<th className="py-3 px-space-sm text-right rounded-r-lg">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-surface-container">
{/*  Item 1  */}
<tr className="hover:bg-surface-container-low/60 transition-colors group">
<td className="py-3 px-space-sm">
<div className="flex items-center gap-space-sm">
<div className="w-8 h-8 rounded bg-error/10 text-error flex items-center justify-center shrink-0 font-label-sm font-bold">
                      PDF
                    </div>
<div className="min-w-0">
<div className="text-body-md font-body-md font-bold text-primary group-hover:text-secondary truncate">
                        PSSI-AZCorp-Politique-Securite-SI-v3.1.pdf
                      </div>
<div className="text-body-sm font-body-sm text-on-surface-variant flex items-center gap-2">
<span className="">4.2 Mo</span>
<span className="">•</span>
<span className="font-mono text-[11px] text-outline">hash:e8f2...9b1a</span>
</div>
</div>
</div>
</td>
<td className="py-3 px-space-sm">
<span className="text-body-sm font-body-sm text-on-surface">ISO 27001 / SSI</span>
</td>
<td className="py-3 px-space-sm">
<span className="px-2 py-0.5 rounded bg-surface-container text-primary font-mono text-label-sm font-bold">v3.1</span>
</td>
<td className="py-3 px-space-sm">
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm">
<span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container"></span>
                    Certifié SHA
                  </span>
</td>
<td className="py-3 px-space-sm">
<span className="text-body-sm font-body-sm font-medium text-on-surface">M. Alain M.</span>
</td>
<td className="py-3 px-space-sm">
<span className="text-body-sm font-body-sm text-on-surface-variant">Hier, 17:40</span>
</td>
<td className="py-3 px-space-sm text-right">
<div className="flex items-center justify-end gap-1">
<button className="p-1 rounded text-on-surface-variant hover:text-secondary hover:bg-surface-container transition-colors" title="Résumer par IA">
<span className="material-symbols-outlined text-[18px]">auto_awesome</span>
</button>
<button className="p-1 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors" title="Comparer versions">
<span className="material-symbols-outlined text-[18px]">difference</span>
</button>
<button className="p-1 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors" title="Télécharger">
<span className="material-symbols-outlined text-[18px]">download</span>
</button>
</div>
</td>
</tr>
{/*  Item 2  */}
<tr className="hover:bg-surface-container-low/60 transition-colors group">
<td className="py-3 px-space-sm">
<div className="flex items-center gap-space-sm">
<div className="w-8 h-8 rounded bg-secondary/10 text-secondary flex items-center justify-center shrink-0 font-label-sm font-bold">
                      PDF
                    </div>
<div className="min-w-0">
<div className="text-body-md font-body-md font-bold text-primary group-hover:text-secondary truncate">
                        Referentiel-Competences-Dev-Fullstack-MINEFOP-2025.pdf
                      </div>
<div className="text-body-sm font-body-sm text-on-surface-variant flex items-center gap-2">
<span className="">18.6 Mo</span>
<span className="">•</span>
<span className="font-mono text-[11px] text-outline">hash:c14e...770d</span>
</div>
</div>
</div>
</td>
<td className="py-3 px-space-sm">
<span className="text-body-sm font-body-sm text-on-surface">Pôle Formation</span>
</td>
<td className="py-3 px-space-sm">
<span className="px-2 py-0.5 rounded bg-surface-container text-primary font-mono text-label-sm font-bold">v2.0</span>
</td>
<td className="py-3 px-space-sm">
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container/20 text-secondary font-label-sm text-label-sm">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    Publié
                  </span>
</td>
<td className="py-3 px-space-sm">
<span className="text-body-sm font-body-sm font-medium text-on-surface">Dr. Paulin T.</span>
</td>
<td className="py-3 px-space-sm">
<span className="text-body-sm font-body-sm text-on-surface-variant">02 Mars 2025</span>
</td>
<td className="py-3 px-space-sm text-right">
<div className="flex items-center justify-end gap-1">
<button className="p-1 rounded text-on-surface-variant hover:text-secondary hover:bg-surface-container transition-colors" title="Résumer par IA">
<span className="material-symbols-outlined text-[18px]">auto_awesome</span>
</button>
<button className="p-1 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors" title="Comparer versions">
<span className="material-symbols-outlined text-[18px]">difference</span>
</button>
<button className="p-1 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors" title="Télécharger">
<span className="material-symbols-outlined text-[18px]">download</span>
</button>
</div>
</td>
</tr>
{/*  Item 3  */}
<tr className="hover:bg-surface-container-low/60 transition-colors group">
<td className="py-3 px-space-sm">
<div className="flex items-center gap-space-sm">
<div className="w-8 h-8 rounded bg-primary-container text-secondary-fixed flex items-center justify-center shrink-0 font-label-sm font-bold">
                      DOC
                    </div>
<div className="min-w-0">
<div className="text-body-md font-body-md font-bold text-primary group-hover:text-secondary truncate">
                        Convention-Cadre-Infogerance-Cloud-Type.docx
                      </div>
<div className="text-body-sm font-body-sm text-on-surface-variant flex items-center gap-2">
<span className="">840 Ko</span>
<span className="">•</span>
<span className="font-mono text-[11px] text-outline">hash:3d81...001c</span>
</div>
</div>
</div>
</td>
<td className="py-3 px-space-sm">
<span className="text-body-sm font-body-sm text-on-surface">Juridique &amp; BAP</span>
</td>
<td className="py-3 px-space-sm">
<span className="px-2 py-0.5 rounded bg-surface-container text-primary font-mono text-label-sm font-bold">v1.4</span>
</td>
<td className="py-3 px-space-sm">
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container/40 text-error font-label-sm text-label-sm">
<span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                    En révision
                  </span>
</td>
<td className="py-3 px-space-sm">
<span className="text-body-sm font-body-sm font-medium text-on-surface">Direction Gen.</span>
</td>
<td className="py-3 px-space-sm">
<span className="text-body-sm font-body-sm text-on-surface-variant">28 Fév 2025</span>
</td>
<td className="py-3 px-space-sm text-right">
<div className="flex items-center justify-end gap-1">
<button className="p-1 rounded text-on-surface-variant hover:text-secondary hover:bg-surface-container transition-colors" title="Résumer par IA">
<span className="material-symbols-outlined text-[18px]">auto_awesome</span>
</button>
<button className="p-1 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors" title="Comparer versions">
<span className="material-symbols-outlined text-[18px]">difference</span>
</button>
<button className="p-1 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors" title="Télécharger">
<span className="material-symbols-outlined text-[18px]">download</span>
</button>
</div>
</td>
</tr>
{/*  Item 4  */}
<tr className="hover:bg-surface-container-low/60 transition-colors group">
<td className="py-3 px-space-sm">
<div className="flex items-center gap-space-sm">
<div className="w-8 h-8 rounded bg-secondary/10 text-secondary flex items-center justify-center shrink-0 font-label-sm font-bold">
                      PDF
                    </div>
<div className="min-w-0">
<div className="text-body-md font-body-md font-bold text-primary group-hover:text-secondary truncate">
                        Matrice-Architecture-Haute-Dispo-PostgreSQL.pdf
                      </div>
<div className="text-body-sm font-body-sm text-on-surface-variant flex items-center gap-2">
<span className="">7.1 Mo</span>
<span className="">•</span>
<span className="font-mono text-[11px] text-outline">hash:98ff...bb45</span>
</div>
</div>
</div>
</td>
<td className="py-3 px-space-sm">
<span className="text-body-sm font-body-sm text-on-surface">IT Infra / R&amp;D</span>
</td>
<td className="py-3 px-space-sm">
<span className="px-2 py-0.5 rounded bg-surface-container text-primary font-mono text-label-sm font-bold">v4.2</span>
</td>
<td className="py-3 px-space-sm">
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container/20 text-secondary font-label-sm text-label-sm">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    Publié
                  </span>
</td>
<td className="py-3 px-space-sm">
<span className="text-body-sm font-body-sm font-medium text-on-surface">Clarisse D.</span>
</td>
<td className="py-3 px-space-sm">
<span className="text-body-sm font-body-sm text-on-surface-variant">25 Fév 2025</span>
</td>
<td className="py-3 px-space-sm text-right">
<div className="flex items-center justify-end gap-1">
<button className="p-1 rounded text-on-surface-variant hover:text-secondary hover:bg-surface-container transition-colors" title="Résumer par IA">
<span className="material-symbols-outlined text-[18px]">auto_awesome</span>
</button>
<button className="p-1 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors" title="Comparer versions">
<span className="material-symbols-outlined text-[18px]">difference</span>
</button>
<button className="p-1 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors" title="Télécharger">
<span className="material-symbols-outlined text-[18px]">download</span>
</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
{/*  Table Footer Pagination  */}
<div className="mt-space-md pt-space-sm border-t border-surface-container flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant">
<span className="">Affichage de 1 à 4 sur 1 248 documents certifiés</span>
<div className="flex items-center gap-1">
<button className="px-3 py-1 rounded bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors">Précédent</button>
<button className="px-3 py-1 rounded bg-secondary text-on-secondary font-bold">1</button>
<button className="px-3 py-1 rounded bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors">2</button>
<button className="px-3 py-1 rounded bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors">3</button>
<span className="px-2">...</span>
<button className="px-3 py-1 rounded bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors">Suivant</button>
</div>
</div>
</div>
{/*  Historical Audit Log Strip  */}
<div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
<div className="flex items-center justify-between mb-space-sm">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
<h4 className="font-headline-sm text-headline-sm text-primary">Journal d'Audit Immuable &amp; Traçabilité</h4>
</div>
<span className="text-label-sm font-label-sm uppercase text-on-surface-variant">SHA-256 Ledger Live</span>
</div>
<div className="space-y-2">
<div className="p-space-xs px-space-sm rounded-lg bg-surface-container-low flex items-center justify-between text-body-sm font-body-sm">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim">history</span>
<span className="text-primary font-medium">Validation visa conformité ISO 27001 v3.1</span>
<span className="text-on-surface-variant">par M. Alain M.</span>
</div>
<span className="font-mono text-outline text-[11px]">10:44:12 • Node DC-1</span>
</div>
<div className="p-space-xs px-space-sm rounded-lg bg-surface-container-low flex items-center justify-between text-body-sm font-body-sm">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-[16px] text-secondary">download</span>
<span className="text-primary font-medium">Export chiffré Syllabus Fullstack MINEFOP</span>
<span className="text-on-surface-variant">par Dr. Paulin T.</span>
</div>
<span className="font-mono text-outline text-[11px]">09:12:05 • Node DC-1</span>
</div>
</div>
</div>
</div>
{/*  Right Panel: AZ Pulse Copilot Doc AI Widget (4 cols)  */}
<div className="lg:col-span-4 space-y-space-md">
<div className="rounded-xl bg-surface-container-lowest p-space-md shadow-md border-t-4 border-secondary-container">
{/*  Copilot Header  */}
<div className="flex items-center justify-between pb-space-sm border-b border-surface-container">
<div className="flex items-center gap-space-xs">
<div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-on-secondary shadow-sm">
<span className="material-symbols-outlined text-[18px]">psychology</span>
</div>
<div>
<div className="text-headline-sm font-headline-sm text-primary leading-tight">AZ Pulse Copilot Doc</div>
<div className="text-label-sm font-label-sm text-tertiary-fixed-dim flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
                Modèle Llama 3 70B • Context 32k
              </div>
</div>
</div>
<span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed text-label-sm font-label-sm font-bold">RAG v2.4</span>
</div>
{/*  Target Context Document Active  */}
<div className="mt-space-sm p-space-sm rounded-lg bg-surface-container-low">
<span className="text-label-sm font-label-sm text-on-surface-variant uppercase">Document ciblé en mémoire :</span>
<div className="text-body-sm font-body-sm font-bold text-primary truncate mt-0.5">
            PSSI-AZCorp-Politique-Securite-SI-v3.1.pdf
          </div>
<div className="flex items-center justify-between mt-2 text-label-sm font-label-sm">
<span className="text-secondary font-semibold">142 pages indexées</span>
<button className="text-on-surface-variant hover:text-primary transition-colors underline">Changer de cible</button>
</div>
</div>
{/*  Interactive AI Query Simulation  */}
<div className="mt-space-md space-y-space-sm">
<label className="text-label-sm font-label-sm uppercase text-on-surface-variant font-bold">Poser une question précise au document</label>
<div className="relative">
<textarea className="w-full p-space-sm bg-surface-container text-on-surface rounded-lg text-body-sm font-body-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 placeholder-outline" placeholder="Ex: Quelle est la durée exacte de rétention des logs de sécurité selon la section 4.3 ?" rows="3">Résumer la politique de rétention des logs et les sanctions en cas de non-respect.</textarea>
<button className="absolute bottom-2 right-2 px-3 py-1 bg-secondary text-on-secondary text-label-sm font-label-sm font-bold rounded shadow hover:bg-secondary/90 flex items-center gap-1">
<span className="">Générer</span>
<span className="material-symbols-outlined text-[14px]">send</span>
</button>
</div>
</div>
{/*  AI Live Synthesis Result Card  */}
<div className="mt-space-md p-space-md rounded-xl bg-gradient-to-br from-surface-container-low to-surface-container text-on-surface shadow-inner space-y-space-xs">
<div className="flex items-center justify-between">
<span className="flex items-center gap-1 text-label-sm font-label-sm font-bold text-secondary">
<span className="material-symbols-outlined text-[16px]">arrow_back_ios_new</span>
              Synthèse Instantanée AZ Pulse
            </span>
<span className="text-label-sm font-label-sm text-on-surface-variant">Confiance: 98.7%</span>
</div>
<p className="text-body-sm font-body-sm leading-relaxed text-on-surface">
            Conformément à la <strong className="text-primary">Section 4.3 (page 24)</strong>, tous les journaux d'accès aux infrastructures de production doivent être conservés durant <strong className="text-secondary">365 jours consécutifs</strong> dans un coffre WORM inaltérable.
          </p>
<p className="text-body-sm font-body-sm leading-relaxed text-on-surface mt-2">
            La <strong className="text-primary">Section 8.1 (page 89)</strong> stipule qu'une purge non autorisée entraîne l'engagement de la responsabilité contractuelle et une révocation immédiate des accès PAM.
          </p>
<div className="pt-space-xs flex flex-wrap items-center gap-space-xs">
<span className="px-2 py-0.5 rounded bg-surface-container-lowest text-primary text-label-sm font-label-sm shadow-sm flex items-center gap-1">
<span className="material-symbols-outlined text-[12px]">bookmark</span> Page 24, §3
            </span>
<span className="px-2 py-0.5 rounded bg-surface-container-lowest text-primary text-label-sm font-label-sm shadow-sm flex items-center gap-1">
<span className="material-symbols-outlined text-[12px]">bookmark</span> Page 89, §1
            </span>
</div>
</div>
{/*  Quick Copilot Actions  */}
<div className="mt-space-md grid grid-cols-2 gap-space-xs">
<button className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-sm flex items-center justify-center gap-1.5 transition-colors" type="button">
<span className="material-symbols-outlined text-[18px] text-secondary">difference</span>
<span className="">Comparer v3.0 vs v3.1</span>
</button>
<button className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-sm flex items-center justify-center gap-1.5 transition-colors" type="button">
<span className="material-symbols-outlined text-[18px] text-tertiary-fixed-dim">translate</span>
<span className="">Traduire en Anglais</span>
</button>
</div>
{/*  Fast Compliance Checklist  */}
<div className="mt-space-md pt-space-sm border-t border-surface-container space-y-2">
<div className="text-label-sm font-label-sm uppercase text-on-surface-variant font-bold">Contrôle de Conformité IA</div>
<div className="flex items-center justify-between text-body-sm font-body-sm">
<span className="flex items-center gap-1.5 text-on-surface">
<span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
              Signature Cryptographique
            </span>
<span className="text-label-sm font-label-sm text-secondary font-bold">SHA-256 Valide</span>
</div>
<div className="flex items-center justify-between text-body-sm font-body-sm">
<span className="flex items-center gap-1.5 text-on-surface">
<span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
              Conformité ISO 27001
            </span>
<span className="text-label-sm font-label-sm text-secondary font-bold">100% Alignée</span>
</div>
<div className="flex items-center justify-between text-body-sm font-body-sm">
<span className="flex items-center gap-1.5 text-on-surface">
<span className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim">timelapse</span>
              Revue Annuelle
            </span>
<span className="text-label-sm font-label-sm text-on-tertiary-container font-bold">Échéance: 120j</span>
</div>
</div>
</div>
{/*  Sovereign Node Telemetry Card  */}
<div className="rounded-xl bg-primary-container p-space-md text-on-primary shadow-sm space-y-space-xs">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span>
<span className="text-label-sm font-label-sm uppercase tracking-wider text-secondary-fixed-dim">Indexation Vectorielle</span>
</div>
<span className="text-label-sm font-label-sm font-mono text-tertiary-fixed-dim">Qdrant v1.9</span>
</div>
<div className="text-headline-sm font-headline-sm text-on-primary">1 240 / 1 248 docs prêts</div>
<p className="text-body-sm font-body-sm text-on-primary-container">
          Latence médiane de réponse sémantique : <strong className="text-on-primary font-mono">14ms</strong> via les accélérateurs IA dédiés du Cluster Paris DC-1.
        </p>
</div>
</div>
</div>
</div></main>