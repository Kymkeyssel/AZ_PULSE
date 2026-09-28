import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { academyService } from '../../../services/api';

export const ApprenantFormations = () => {
  const handleUploadClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.doc,.docx,.zip';
    fileInput.onchange = async (e) => {
      if (e.target.files.length > 0) {
        try {
          await academyService.uploadDocument(e.target.files[0], 'submission');
          alert(`TP déposé avec succès !`);
        } catch (err) {
          alert(`Erreur d'upload: ${err.message}`);
        }
      }
    };
    fileInput.click();
  };
  const { data } = useOutletContext();
  const program = data?.program || {};
  const currentCourses = data?.currentCourses || [];

  return (
    <div className="flex-1 pb-10">
      <div className="flex flex-col w-full">
{/*  Interactive Style Scoped Hooks  */}

<div className="px-8 py-8 space-y-8 max-w-[1720px] mx-auto w-full">
{/*  1. En-tête de section académique  */}
<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
<div className="space-y-1.5">
<div className="flex items-center gap-3">
<div className="w-2.5 h-8 bg-secondary rounded-full"></div>
<h1 className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">
            Mes Formations &amp; Parcours Certifiants
          </h1>
</div>
<p className="font-body-lg text-body-lg text-on-surface-variant pl-5">
          Suivi pédagogique, compétences visées et avancement modulaire agréé <span className="font-semibold text-primary">MINEFOP</span> • AZ Corporation SARL
        </p>
</div>
{/*  Action buttons  */}
<div className="flex flex-wrap items-center gap-3">
<a className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-lg text-label-lg shadow-sm transition-all duration-200" href="#syllabus">
<span className="material-symbols-outlined notranslate text-[19px] text-on-surface-variant">description</span>
<span>Syllabus Officiel MINEFOP</span>
</a>
<a className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-lg text-label-lg shadow-sm transition-all duration-200" href="mailto:tuteur.kamga@azpulse.cm">
<span className="material-symbols-outlined notranslate text-[19px] text-secondary">contact_support</span>
<span>Contacter mon tuteur</span>
</a>
<a className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-secondary hover:bg-on-secondary-fixed-variant text-on-primary font-label-lg text-label-lg shadow-md transition-all duration-200" href="#cours-actif">
<span className="material-symbols-outlined notranslate text-[20px]">play_circle</span>
<span>Continuer le cours actuel</span>
</a>
</div>
</div>
{/*  2. Bannière du Programme Principal Actif  */}
<div className="relative overflow-hidden rounded-2xl bg-primary-container text-on-primary shadow-xl">
{/*  Ambient light effect  */}
<div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-secondary-container opacity-20 blur-3xl pointer-events-none"></div>
<div className="absolute right-1/3 -bottom-24 w-80 h-80 rounded-full bg-tertiary-fixed-dim opacity-10 blur-3xl pointer-events-none"></div>
<div className="relative p-8 md:p-10 flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
<div className="space-y-4 max-w-3xl flex-1">
<div className="flex flex-wrap items-center gap-3">
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm font-bold uppercase tracking-wider">
<span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-fixed-variant animate-ping"></span>
              Programme Actif Certifié
            </span>
<span className="font-label-sm text-label-sm text-primary-fixed-dim bg-on-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
              N° Accréditation : MINEFOP/DFOP/SDGS/024-2024
            </span>
<span className="font-label-sm text-label-sm text-tertiary-fixed-dim font-medium">
              Promotion 2025 / 2026
            </span>
</div>
<div>
<h2 className="font-headline-xl text-headline-xl text-on-primary font-extrabold tracking-tight">
              Parcours Grande École Développeur Fullstack &amp; Data / IA
            </h2>
<p className="font-body-md text-body-md text-primary-fixed-dim mt-1">
              Formation d'élite en génie logiciel, architectures réparties, ingénierie de données temps réel et intégration d'intelligences artificielles génératives.
            </p>
</div>
{/*  Metadata grid inside banner  */}
<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
<div className="bg-primary/40 rounded-xl p-3 backdrop-blur-sm">
<span className="font-label-sm text-label-sm text-primary-fixed-dim block uppercase">Statut Cursus</span>
<span className="font-headline-sm text-headline-sm text-on-primary font-bold flex items-center gap-1 mt-0.5">
<span className="w-2 h-2 rounded-full bg-secondary-container"></span>
                Semestre 02
              </span>
</div>
<div className="bg-primary/40 rounded-xl p-3 backdrop-blur-sm">
<span className="font-label-sm text-label-sm text-primary-fixed-dim block uppercase">Directeur Pédagogique</span>
<span className="font-headline-sm text-headline-sm text-on-primary font-bold mt-0.5 truncate block" title="Dr. Paulin T. (PhD)">
                Dr. Paulin T.
              </span>
</div>
<div className="bg-primary/40 rounded-xl p-3 backdrop-blur-sm">
<span className="font-label-sm text-label-sm text-primary-fixed-dim block uppercase">Charge Globale</span>
<span className="font-headline-sm text-headline-sm text-on-primary font-bold mt-0.5">
                960h <span className="font-body-sm text-body-sm font-normal text-primary-fixed-dim">(450h TP/Hack)</span>
</span>
</div>
<div className="bg-primary/40 rounded-xl p-3 backdrop-blur-sm">
<span className="font-label-sm text-label-sm text-primary-fixed-dim block uppercase">Prochain Grand Jalon</span>
<span className="font-headline-sm text-headline-sm text-tertiary-fixed-dim font-bold mt-0.5">
                Soutenance Juin 2026
              </span>
</div>
</div>
</div>
{/*  Banner Right Gauge / Progression Metric  */}
<div className="bg-surface-container-lowest/10 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center justify-center min-w-[280px] w-full lg:w-auto shadow-inner">
<div className="relative w-36 h-36 flex items-center justify-center">
{/*  Inline SVG Circular Progress  */}
<svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
<circle className="stroke-primary/40" cx="60" cy="60" fill="none" r="50" strokeWidth="10"></circle>
<circle className="stroke-tertiary-fixed-dim" cx="60" cy="60" fill="none" r="50" strokeDasharray="314.15" strokeDashoffset="87.96" strokeLinecap="round" strokeWidth="10"></circle>
</svg>
<div className="absolute flex flex-col items-center justify-center text-center">
<span className="font-headline-xl text-headline-xl font-extrabold text-on-primary">72%</span>
<span className="font-label-sm text-label-sm text-primary-fixed-dim uppercase tracking-wider">Avancement</span>
</div>
</div>
<div className="mt-4 text-center">
<span className="font-label-lg text-label-lg font-bold text-on-primary">18 / 25 Modules Validés</span>
<span className="block font-body-sm text-body-sm text-primary-fixed-dim mt-0.5">7 modules restants pour diplomation</span>
</div>
</div>
</div>
</div>
{/*  Main Workspace Layout : 8 cols content + 4 cols sidebar reference  */}
<div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
{/*  LEFT / MAIN COLUMN: Modules list and controllers (8 cols)  */}
<div className="xl:col-span-8 space-y-6">
{/*  3. Filtres et sélecteur de modules  */}
<div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm space-y-4">
<div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
{/*  Category Tabs  */}
<div className="flex flex-wrap items-center gap-1.5">
<button className="tab-btn px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md transition-all shadow-sm" data-tab="all" onClick={() => alert("filterModules('all')")}>
                Tous les modules <span className="ml-1 opacity-75 font-normal">(25)</span>
</button>
<button className="tab-btn px-4 py-2 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-all" data-tab="encours" onClick={() => alert("filterModules('encours')")}>
                En cours <span className="ml-1 text-secondary-container font-bold">(3)</span>
</button>
<button className="tab-btn px-4 py-2 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-all" data-tab="valide" onClick={() => alert("filterModules('valide')")}>
                Validés <span className="ml-1 text-on-tertiary-container font-bold">(18)</span>
</button>
<button className="tab-btn px-4 py-2 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-all" data-tab="avenir" onClick={() => alert("filterModules('avenir')")}>
                À venir <span className="ml-1 opacity-75">(4)</span>
</button>
</div>
{/*  Module Search input  */}
<div className="relative w-full md:w-72">
<span className="material-symbols-outlined notranslate absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
<input className="w-full h-10 pl-9 pr-3 rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest transition-colors shadow-inner" onChange={(e) => {alert('Search: ' + e.target.value)}} placeholder="Filtrer un module..." type="text" />
</div>
</div>
{/*  Technologies quick filters tags  */}
<div className="flex items-center gap-2 overflow-x-auto pb-1 text-on-surface-variant font-label-sm text-label-sm">
<span className="font-bold text-on-surface flex items-center gap-1">
<span className="material-symbols-outlined notranslate text-[16px] text-secondary">tune</span> Pôles :
            </span>
<button className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-variant text-on-surface transition-colors" onClick={() => alert("searchModules('Python')")}>Python</button>
<button className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-variant text-on-surface transition-colors" onClick={() => alert("searchModules('FastAPI')")}>FastAPI &amp; Symfony</button>
<button className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-variant text-on-surface transition-colors" onClick={() => alert("searchModules('Docker')")}>Docker &amp; Cloud</button>
<button className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-variant text-on-surface transition-colors" onClick={() => alert("searchModules('Qdrant')")}>Qdrant &amp; RAG</button>
<button className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-variant text-on-surface transition-colors" onClick={() => alert("searchModules('Tailwind')")}>React &amp; Tailwind</button>
<button className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-variant text-on-surface transition-colors" onClick={() => alert("searchModules('Sécurité')")}>Cybersécurité</button>
</div>
</div>
{/*  4. Grille des Modules de Formation  */}
<div className="space-y-4" id="modules-container">
{/*  MODULE 1 : En cours (85%)  */}
<div className="module-card flex flex-col md:flex-row bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200" data-status="encours" id="cours-actif">
{/*  Left accent strip  */}
<div className="w-full md:w-3 bg-secondary-container"></div>
<div className="p-6 flex-1 flex flex-col justify-between space-y-4">
<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
<div className="space-y-1">
<div className="flex items-center gap-2">
<span className="font-label-sm text-label-sm px-2.5 py-0.5 rounded bg-secondary-container/10 text-secondary font-bold uppercase tracking-wider">
                      Module 14 • En cours
                    </span>
<span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-error-container text-on-error-container font-semibold flex items-center gap-1">
<span className="material-symbols-outlined notranslate text-[14px]">warning</span> TP à rendre dans 48h
                    </span>
</div>
<h3 className="font-headline-md text-headline-md text-primary font-bold">
                    Architecture Micro-services &amp; API REST FastAPI / Symfony
                  </h3>
<div className="flex flex-wrap items-center gap-4 text-on-surface-variant font-label-md text-label-md pt-1">
<span className="flex items-center gap-1">
<span className="material-symbols-outlined notranslate text-[17px] text-secondary">person_pin</span> Dr. Paulin T.
                    </span>
<span className="flex items-center gap-1">
<span className="material-symbols-outlined notranslate text-[17px] text-secondary">schedule</span> Volume : 45h
                    </span>
<span className="flex items-center gap-1">
<span className="material-symbols-outlined notranslate text-[17px] text-secondary">database</span> 12 Chapitres • 4 Labs
                    </span>
</div>
</div>
{/*  Progression Badge  */}
<div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1">
<span className="font-headline-md text-headline-md font-extrabold text-secondary">85%</span>
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Avancement</span>
</div>
</div>
{/*  Progress bar  */}
<div className="space-y-1.5">
<div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
<div className="h-full bg-secondary-container rounded-full" style={{"width":"85%"}}></div>
</div>
<div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
<span>Dernière leçon : <em>Patterns d'authentification OAuth2 &amp; FastAPI Middlewares</em></span>
<span>10 / 12 unités achevées</span>
</div>
</div>
{/*  Footer interactive buttons  */}
<div className="flex flex-wrap items-center justify-between gap-3 pt-2">
<div className="flex items-center gap-2">
<span className="font-label-sm text-label-sm px-2 py-1 rounded bg-surface-container font-mono text-on-surface-variant">FastAPI</span>
<span className="font-label-sm text-label-sm px-2 py-1 rounded bg-surface-container font-mono text-on-surface-variant">Symfony 7</span>
<span className="font-label-sm text-label-sm px-2 py-1 rounded bg-surface-container font-mono text-on-surface-variant">JWT</span>
</div>
<div className="flex items-center gap-3">
<button className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center gap-1.5 transition-colors" type="button">
<span className="material-symbols-outlined notranslate text-[18px]">upload_file</span>
<span>Déposer TP final</span>
</button>
<button className="px-4 py-2 rounded-lg bg-secondary hover:bg-on-secondary-fixed-variant text-on-primary font-label-md text-label-md flex items-center gap-1.5 shadow-sm transition-colors" type="button">
<span className="material-symbols-outlined notranslate text-[18px]">menu_book</span>
<span>Accéder aux cours</span>
</button>
</div>
</div>
</div>
</div>
{/*  MODULE 2 : En cours (40%)  */}
<div className="module-card flex flex-col md:flex-row bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200" data-status="encours">
<div className="w-full md:w-3 bg-secondary"></div>
<div className="p-6 flex-1 flex flex-col justify-between space-y-4">
<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
<div className="space-y-1">
<div className="flex items-center gap-2">
<span className="font-label-sm text-label-sm px-2.5 py-0.5 rounded bg-secondary/10 text-secondary font-bold uppercase tracking-wider">
                      Module 15 • En cours
                    </span>
<span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant font-semibold flex items-center gap-1">
<span className="material-symbols-outlined notranslate text-[14px]">videocam</span> Live Mercredi 14h00
                    </span>
</div>
<h3 className="font-headline-md text-headline-md text-primary font-bold">
                    Conteneurisation Docker, CI/CD &amp; Orchestration Cloud
                  </h3>
<div className="flex flex-wrap items-center gap-4 text-on-surface-variant font-label-md text-label-md pt-1">
<span className="flex items-center gap-1">
<span className="material-symbols-outlined notranslate text-[17px] text-secondary">person_pin</span> M. Alain Nguekam
                    </span>
<span className="flex items-center gap-1">
<span className="material-symbols-outlined notranslate text-[17px] text-secondary">schedule</span> Volume : 35h
                    </span>
<span className="flex items-center gap-1">
<span className="material-symbols-outlined notranslate text-[17px] text-secondary">deployed_code</span> GitHub Actions • Kubernetes
                    </span>
</div>
</div>
<div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1">
<span className="font-headline-md text-headline-md font-extrabold text-secondary">40%</span>
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Avancement</span>
</div>
</div>
<div className="space-y-1.5">
<div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
<div className="h-full bg-secondary rounded-full" style={{"width":"40%"}}></div>
</div>
<div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
<span>Prochaine session : <em>Docker Compose multi-conteneurs &amp; Volumes partagés</em></span>
<span>4 / 10 unités achevées</span>
</div>
</div>
<div className="flex flex-wrap items-center justify-between gap-3 pt-2">
<div className="flex items-center gap-2">
<span className="font-label-sm text-label-sm px-2 py-1 rounded bg-surface-container font-mono text-on-surface-variant">Docker</span>
<span className="font-label-sm text-label-sm px-2 py-1 rounded bg-surface-container font-mono text-on-surface-variant">CI/CD Pipeline</span>
<span className="font-label-sm text-label-sm px-2 py-1 rounded bg-surface-container font-mono text-on-surface-variant">Linux Alpine</span>
</div>
<div className="flex items-center gap-3">
<button className="px-4 py-2 rounded-lg bg-primary hover:bg-on-primary-fixed text-on-primary font-label-md text-label-md flex items-center gap-1.5 shadow-sm transition-colors" type="button">
<span className="material-symbols-outlined notranslate text-[18px]">terminal</span>
<span>Rejoindre le Lab Virtuel</span>
</button>
</div>
</div>
</div>
</div>
{/*  MODULE 3 : En cours (15%)  */}
<div className="module-card flex flex-col md:flex-row bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200" data-status="encours">
<div className="w-full md:w-3 bg-tertiary-fixed-dim"></div>
<div className="p-6 flex-1 flex flex-col justify-between space-y-4">
<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
<div className="space-y-1">
<div className="flex items-center gap-2">
<span className="font-label-sm text-label-sm px-2.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed-variant font-bold uppercase tracking-wider">
                      Module 16 • Démarré
                    </span>
<span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container text-on-surface font-semibold flex items-center gap-1">
<span className="material-symbols-outlined notranslate text-[14px] text-tertiary-container">hub</span> TP d'expérimentation ouvert
                    </span>
</div>
<h3 className="font-headline-md text-headline-md text-primary font-bold">
                    Bases Vectorielles Qdrant &amp; Intégration RAG / LLM
                  </h3>
<div className="flex flex-wrap items-center gap-4 text-on-surface-variant font-label-md text-label-md pt-1">
<span className="flex items-center gap-1">
<span className="material-symbols-outlined notranslate text-[17px] text-secondary">person_pin</span> Dr. M. Kamga
                    </span>
<span className="flex items-center gap-1">
<span className="material-symbols-outlined notranslate text-[17px] text-secondary">schedule</span> Volume : 40h
                    </span>
<span className="flex items-center gap-1">
<span className="material-symbols-outlined notranslate text-[17px] text-secondary">psychology</span> Embeddings • LangChain
                    </span>
</div>
</div>
<div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1">
<span className="font-headline-md text-headline-md font-extrabold text-on-tertiary-container">15%</span>
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Avancement</span>
</div>
</div>
<div className="space-y-1.5">
<div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
<div className="h-full bg-tertiary-fixed-dim rounded-full" style={{"width":"15%"}}></div>
</div>
<div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
<span>En cours : <em>Indexation HNSW &amp; Vector Embeddings avec sentence-transformers</em></span>
<span>2 / 9 chapitres explorés</span>
</div>
</div>
<div className="flex flex-wrap items-center justify-between gap-3 pt-2">
<div className="flex items-center gap-2">
<span className="font-label-sm text-label-sm px-2 py-1 rounded bg-surface-container font-mono text-on-surface-variant">Qdrant DB</span>
<span className="font-label-sm text-label-sm px-2 py-1 rounded bg-surface-container font-mono text-on-surface-variant">Python Embeddings</span>
<span className="font-label-sm text-label-sm px-2 py-1 rounded bg-surface-container font-mono text-on-surface-variant">RAG Pipeline</span>
</div>
<div className="flex items-center gap-3">
<button className="px-4 py-2 rounded-lg bg-secondary hover:bg-on-secondary-fixed-variant text-on-primary font-label-md text-label-md flex items-center gap-1.5 shadow-sm transition-colors" type="button">
<span className="material-symbols-outlined notranslate text-[18px]">science</span>
<span>Ouvrir le Notebook Jupyter</span>
</button>
</div>
</div>
</div>
</div>
{/*  MODULE 4 : Validé (100%)  */}
<div className="module-card flex flex-col md:flex-row bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200" data-status="valide">
<div className="w-full md:w-3 bg-surface-tint"></div>
<div className="p-6 flex-1 flex flex-col justify-between space-y-4">
<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
<div className="space-y-1">
<div className="flex items-center gap-2">
<span className="font-label-sm text-label-sm px-2.5 py-0.5 rounded bg-surface-container-high text-on-surface font-bold uppercase tracking-wider flex items-center gap-1">
<span className="material-symbols-outlined notranslate text-[15px] text-secondary">check_circle</span> Module 08 • Validé
                    </span>
<span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed-variant font-bold">
                      Mention : Excellent
                    </span>
</div>
<h3 className="font-headline-md text-headline-md text-primary font-bold">
                    Algorithmique Avancée &amp; Structures de Données Complexes
                  </h3>
<div className="flex flex-wrap items-center gap-4 text-on-surface-variant font-label-md text-label-md pt-1">
<span className="flex items-center gap-1">
<span className="material-symbols-outlined notranslate text-[17px] text-secondary">military_tech</span> Note : <strong className="text-primary font-bold">18.5 / 20</strong> (Coeff. 4)
                    </span>
<span className="flex items-center gap-1">
<span className="material-symbols-outlined notranslate text-[17px] text-secondary">calendar_today</span> Validé le 12 Janv. 2026
                    </span>
<span className="flex items-center gap-1">
<span className="material-symbols-outlined notranslate text-[17px] text-secondary">verified_user</span> Contrôle Continu + Épreuve MINEFOP
                    </span>
</div>
</div>
<div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1">
<span className="font-headline-md text-headline-md font-extrabold text-primary">100%</span>
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Validé</span>
</div>
</div>
{/*  Footer interactive buttons  */}
<div className="flex flex-wrap items-center justify-between gap-3 pt-2">
<div className="flex items-center gap-2">
<span className="font-label-sm text-label-sm px-2 py-1 rounded bg-surface-container font-mono text-on-surface-variant">Arbres AVL</span>
<span className="font-label-sm text-label-sm px-2 py-1 rounded bg-surface-container font-mono text-on-surface-variant">Graphes Dijkstra</span>
<span className="font-label-sm text-label-sm px-2 py-1 rounded bg-surface-container font-mono text-on-surface-variant">Complexité Big-O</span>
</div>
<div className="flex items-center gap-3">
<button className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center gap-1.5 transition-colors" type="button">
<span className="material-symbols-outlined notranslate text-[18px] text-secondary">download</span>
<span>Attestation Modulaire (PDF)</span>
</button>
<button className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center gap-1.5 transition-colors" type="button">
<span className="material-symbols-outlined notranslate text-[18px]">history_edu</span>
<span>Revoir les corrections</span>
</button>
</div>
</div>
</div>
</div>
{/*  MODULE 5 : Validé (100%)  */}
<div className="module-card flex flex-col md:flex-row bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200" data-status="valide">
<div className="w-full md:w-3 bg-surface-tint"></div>
<div className="p-6 flex-1 flex flex-col justify-between space-y-4">
<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
<div className="space-y-1">
<div className="flex items-center gap-2">
<span className="font-label-sm text-label-sm px-2.5 py-0.5 rounded bg-surface-container-high text-on-surface font-bold uppercase tracking-wider flex items-center gap-1">
<span className="material-symbols-outlined notranslate text-[15px] text-secondary">check_circle</span> Module 09 • Validé
                    </span>
<span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed-variant font-bold">
                      Mention : Très Bien
                    </span>
</div>
<h3 className="font-headline-md text-headline-md text-primary font-bold">
                    Front-end TailwindCSS &amp; Architecture Composants UI
                  </h3>
<div className="flex flex-wrap items-center gap-4 text-on-surface-variant font-label-md text-label-md pt-1">
<span className="flex items-center gap-1">
<span className="material-symbols-outlined notranslate text-[17px] text-secondary">military_tech</span> Note : <strong className="text-primary font-bold">16.0 / 20</strong> (Coeff. 3)
                    </span>
<span className="flex items-center gap-1">
<span className="material-symbols-outlined notranslate text-[17px] text-secondary">calendar_today</span> Validé le 28 Janv. 2026
                    </span>
<span className="flex items-center gap-1">
<span className="material-symbols-outlined notranslate text-[17px] text-secondary">palette</span> Design Systems &amp; Tokens
                    </span>
</div>
</div>
<div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1">
<span className="font-headline-md text-headline-md font-extrabold text-primary">100%</span>
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Validé</span>
</div>
</div>
<div className="flex flex-wrap items-center justify-between gap-3 pt-2">
<div className="flex items-center gap-2">
<span className="font-label-sm text-label-sm px-2 py-1 rounded bg-surface-container font-mono text-on-surface-variant">Tailwind v3.4</span>
<span className="font-label-sm text-label-sm px-2 py-1 rounded bg-surface-container font-mono text-on-surface-variant">Accessibility A11y</span>
<span className="font-label-sm text-label-sm px-2 py-1 rounded bg-surface-container font-mono text-on-surface-variant">Responsive UX</span>
</div>
<div className="flex items-center gap-3">
<button className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center gap-1.5 transition-colors" type="button">
<span className="material-symbols-outlined notranslate text-[18px] text-secondary">download</span>
<span>Attestation Modulaire</span>
</button>
<button className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center gap-1.5 transition-colors" type="button">
<span className="material-symbols-outlined notranslate text-[18px]">visibility</span>
<span>Voir le Projet Evalué</span>
</button>
</div>
</div>
</div>
</div>
{/*  MODULE 6 : À venir (0%)  */}
<div className="module-card flex flex-col md:flex-row bg-surface-container-lowest/80 rounded-2xl overflow-hidden shadow-sm transition-all duration-200 opacity-90" data-status="avenir">
<div className="w-full md:w-3 bg-outline-variant"></div>
<div className="p-6 flex-1 flex flex-col justify-between space-y-4">
<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
<div className="space-y-1">
<div className="flex items-center gap-2">
<span className="font-label-sm text-label-sm px-2.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-bold uppercase tracking-wider">
                      Module 17 • Prochainement
                    </span>
<span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-medium flex items-center gap-1">
<span className="material-symbols-outlined notranslate text-[14px]">event</span> Début : 02 Mars 2026
                    </span>
</div>
<h3 className="font-headline-md text-headline-md text-primary font-bold">
                    Cybersécurité Appliquée &amp; Sécurisation des API JWT / OAuth2
                  </h3>
<div className="flex flex-wrap items-center gap-4 text-on-surface-variant font-label-md text-label-md pt-1">
<span className="flex items-center gap-1">
<span className="material-symbols-outlined notranslate text-[17px] text-outline">shield</span> OWASP Top 10 • Pentesting API
                    </span>
<span className="flex items-center gap-1">
<span className="material-symbols-outlined notranslate text-[17px] text-outline">schedule</span> Durée : 30h
                    </span>
</div>
</div>
<div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1">
<span className="font-headline-md text-headline-md font-bold text-on-surface-variant">0%</span>
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Programmé</span>
</div>
</div>
<div className="flex flex-wrap items-center justify-between gap-3 pt-2">
<div className="flex items-center gap-2">
<span className="font-label-sm text-label-sm px-2 py-1 rounded bg-surface-container font-mono text-on-surface-variant">OWASP</span>
<span className="font-label-sm text-label-sm px-2 py-1 rounded bg-surface-container font-mono text-on-surface-variant">Keycloak</span>
<span className="font-label-sm text-label-sm px-2 py-1 rounded bg-surface-container font-mono text-on-surface-variant">PenTest</span>
</div>
<div className="flex items-center gap-3">
<button className="px-4 py-2 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-md text-label-md flex items-center gap-1.5 transition-colors" type="button">
<span className="material-symbols-outlined notranslate text-[18px]">bookmark_add</span>
<span>Consulter les pré-requis</span>
</button>
</div>
</div>
</div>
</div>
</div>
{/*  Practical project highlight card  */}
<div className="bg-gradient-to-r from-primary-container to-secondary p-6 rounded-2xl text-on-primary shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
<div className="space-y-2 max-w-xl">
<span className="font-label-sm text-label-sm bg-tertiary-fixed text-on-tertiary-fixed-variant px-2.5 py-0.5 rounded font-bold uppercase">
              Hackathon Pédagogique MINEFOP • 72H
            </span>
<h4 className="font-headline-md text-headline-md font-bold">
              Challenge Grand Jury AZ Corporation : Système RAG pour la Santé
            </h4>
<p className="font-body-md text-body-md text-primary-fixed-dim">
              Votre groupe (Escouade Alpha-4) est classé 1er provisoire. Dépôt final du code source GitHub &amp; démonstration vidéo avant le 20 Février.
            </p>
</div>
<button className="px-5 py-3 rounded-lg bg-surface-container-lowest text-primary hover:bg-surface-bright font-label-lg text-label-lg font-bold whitespace-nowrap shadow transition-all" type="button">
            Espace Hackathon →
          </button>
</div>
</div>
{/*  RIGHT / SIDEBAR COLUMN: MINEFOP Compliance, Competencies & Calendar (4 cols)  */}
<div className="xl:col-span-4 space-y-6">
{/*  5. Bloc Compétences & Référentiel MINEFOP  */}
<div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm space-y-6">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined notranslate text-secondary text-[24px]">workspace_premium</span>
<h3 className="font-headline-md text-headline-md text-primary font-bold">
                Compétences Référentiel
              </h3>
</div>
<span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed-variant font-bold">
              MINEFOP v2
            </span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
            Indice d'acquisition des blocs de compétences requis pour la validation du titre professionnel national.
          </p>
{/*  Competencies progress gauges  */}
<div className="space-y-4">
{/*  Backend  */}
<div className="space-y-1.5">
<div className="flex justify-between font-label-md text-label-md">
<span className="text-on-surface font-semibold">Backend, Micro-services &amp; Données</span>
<span className="text-primary font-bold">88%</span>
</div>
<div className="w-full h-2.5 rounded-full bg-surface-container overflow-hidden">
<div className="h-full bg-primary-container rounded-full" style={{"width":"88%"}}></div>
</div>
<span className="font-label-sm text-label-sm text-on-surface-variant">Seuil requis MINEFOP : 70% (Atteint)</span>
</div>
{/*  UI/UX  */}
<div className="space-y-1.5">
<div className="flex justify-between font-label-md text-label-md">
<span className="text-on-surface font-semibold">Front-end, UI/UX &amp; Composants Web</span>
<span className="text-primary font-bold">75%</span>
</div>
<div className="w-full h-2.5 rounded-full bg-surface-container overflow-hidden">
<div className="h-full bg-secondary-container rounded-full" style={{"width":"75%"}}></div>
</div>
<span className="font-label-sm text-label-sm text-on-surface-variant">Seuil requis MINEFOP : 65% (Atteint)</span>
</div>
{/*  Cloud & DevOps  */}
<div className="space-y-1.5">
<div className="flex justify-between font-label-md text-label-md">
<span className="text-on-surface font-semibold">Architecture Cloud, Docker &amp; CI/CD</span>
<span className="text-primary font-bold">70%</span>
</div>
<div className="w-full h-2.5 rounded-full bg-surface-container overflow-hidden">
<div className="h-full bg-secondary rounded-full" style={{"width":"70%"}}></div>
</div>
<span className="font-label-sm text-label-sm text-on-surface-variant">Seuil requis MINEFOP : 60% (Atteint)</span>
</div>
{/*  IA & Vector  */}
<div className="space-y-1.5">
<div className="flex justify-between font-label-md text-label-md">
<span className="text-on-surface font-semibold">Intelligence Artificielle &amp; Vector Search</span>
<span className="text-primary font-bold">65%</span>
</div>
<div className="w-full h-2.5 rounded-full bg-surface-container overflow-hidden">
<div className="h-full bg-tertiary-fixed-dim rounded-full" style={{"width":"65%"}}></div>
</div>
<span className="font-label-sm text-label-sm text-on-surface-variant">Seuil requis MINEFOP : 60% (Atteint)</span>
</div>
</div>
<div className="pt-4 border-t border-surface-container">
<button className="w-full py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold transition-colors flex items-center justify-center gap-2" type="button">
<span className="material-symbols-outlined notranslate text-[18px]">analytics</span>
<span>Générer le Bilan de Compétences Officiel</span>
</button>
</div>
</div>
{/*  Certifications intermédiaires eIDAS & Badges  */}
<div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm space-y-4">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined notranslate text-secondary text-[24px]">verified</span>
<h3 className="font-headline-md text-headline-md text-primary font-bold">
                Certificats Débloqués
              </h3>
</div>
<span className="font-label-sm text-label-sm bg-surface-container px-2 py-0.5 rounded text-on-surface font-mono">
              2 Délivrés
            </span>
</div>
<div className="space-y-3">
{/*  Cert 1  */}
<div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between gap-3">
<div className="flex items-center gap-3 min-w-0">
<div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center flex-shrink-0">
<span className="material-symbols-outlined notranslate text-[20px] text-tertiary-fixed-dim">code</span>
</div>
<div className="min-w-0 flex-1">
<h5 className="font-label-lg text-label-lg font-bold text-on-surface truncate">Certificat Développeur Backend</h5>
<span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 font-mono">
<span className="material-symbols-outlined notranslate text-[13px] text-secondary">qr_code_2</span> Hash: 9e4f..bc18
                  </span>
</div>
</div>
<button className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors flex-shrink-0" title="Télécharger le certificat" type="button">
<span className="material-symbols-outlined notranslate text-[18px]">file_download</span>
</button>
</div>
{/*  Cert 2  */}
<div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between gap-3">
<div className="flex items-center gap-3 min-w-0">
<div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center flex-shrink-0">
<span className="material-symbols-outlined notranslate text-[20px] text-secondary-container">database</span>
</div>
<div className="min-w-0 flex-1">
<h5 className="font-label-lg text-label-lg font-bold text-on-surface truncate">Certificat Base de Données SQL/NoSQL</h5>
<span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 font-mono">
<span className="material-symbols-outlined notranslate text-[13px] text-secondary">qr_code_2</span> Hash: 4a12..ee90
                  </span>
</div>
</div>
<button className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors flex-shrink-0" title="Télécharger le certificat" type="button">
<span className="material-symbols-outlined notranslate text-[18px]">file_download</span>
</button>
</div>
</div>
<div className="p-3 rounded-lg bg-surface-container text-on-surface-variant font-label-sm text-label-sm flex items-start gap-2">
<span className="material-symbols-outlined notranslate text-[18px] text-secondary flex-shrink-0">info</span>
<span>Les certificats AZ Pulse sont numériquement scellés et directement vérifiables par les recruteurs via l'annuaire public MINEFOP.</span>
</div>
</div>
{/*  Calendrier officiel des épreuves  */}
<div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm space-y-5">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined notranslate text-secondary text-[24px]">event_upcoming</span>
<h3 className="font-headline-md text-headline-md text-primary font-bold">
                Calendrier Examens
              </h3>
</div>
<span className="font-label-sm text-label-sm text-secondary font-bold">Session 2026</span>
</div>
<div className="space-y-4">
{/*  Event 1  */}
<div className="flex items-start gap-3">
<div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-surface-container text-primary flex-shrink-0 text-center">
<span className="font-label-sm text-label-sm uppercase font-bold text-secondary">Fév</span>
<span className="font-headline-sm text-headline-sm font-bold -mt-1">18</span>
</div>
<div className="min-w-0 flex-1">
<h5 className="font-label-lg text-label-lg font-bold text-on-surface">Évaluation Pratique Micro-services</h5>
<p className="font-body-sm text-body-sm text-on-surface-variant">FastAPI, TDD &amp; Déploiement automatisé</p>
<span className="font-label-sm text-label-sm text-error font-medium">Épreuve en salle machine 03 (08h - 12h)</span>
</div>
</div>
{/*  Event 2  */}
<div className="flex items-start gap-3">
<div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-surface-container text-primary flex-shrink-0 text-center">
<span className="font-label-sm text-label-sm uppercase font-bold text-secondary">Avr</span>
<span className="font-headline-sm text-headline-sm font-bold -mt-1">10</span>
</div>
<div className="min-w-0 flex-1">
<h5 className="font-label-lg text-label-lg font-bold text-on-surface">Examen Blanc National MINEFOP</h5>
<p className="font-body-sm text-body-sm text-on-surface-variant">Épreuve théorique commune nationale</p>
<span className="font-label-sm text-label-sm text-on-surface-variant">Amphithéâtre Cheikh Anta Diop</span>
</div>
</div>
{/*  Event 3  */}
<div className="flex items-start gap-3">
<div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-primary-container text-on-primary flex-shrink-0 text-center">
<span className="font-label-sm text-label-sm uppercase font-bold text-tertiary-fixed-dim">Juin</span>
<span className="font-headline-sm text-headline-sm font-bold -mt-1">15</span>
</div>
<div className="min-w-0 flex-1">
<h5 className="font-label-lg text-label-lg font-bold text-primary">Grand Jury de Soutenance Finale</h5>
<p className="font-body-sm text-body-sm text-on-surface-variant">Présentation du Projet d'Intégration d'Entreprise</p>
<span className="font-label-sm text-label-sm font-bold text-secondary">Devant Inspecteurs d'État MINEFOP</span>
</div>
</div>
</div>
{/*  Academic support contacts widget  */}
<div className="p-4 rounded-xl bg-surface-container-low space-y-2 mt-4">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold tracking-wider block">Assistance Académique</span>
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-label-sm">
                AZ
              </div>
<div className="text-left flex-1 min-w-0">
<p className="font-label-md text-label-md text-on-surface font-semibold truncate">Secrétariat Pédagogique AZ Corp</p>
<p className="font-body-sm text-body-sm text-on-surface-variant truncate">pole.academique@azpulse.cm</p>
</div>
</div>
</div>
</div>
</div>
</div>
{/*  Bottom Footer Academic Notice  */}
<div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-surface-container text-on-surface-variant font-label-md text-label-md">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined notranslate text-[20px] text-secondary">verified_user</span>
<span>Établissement Agréé N° 000214/MINEFOP/DFOP/SDGS du Cameroun • Système Pédagogique AZ Pulse v4.2</span>
</div>
<div className="flex items-center gap-4">
<a className="hover:text-primary transition-colors" href="#">Règlement Intérieur</a>
<a className="hover:text-primary transition-colors" href="#">Charte Éthique &amp; IA</a>
<a className="hover:text-primary transition-colors" href="#">Support Étudiant</a>
</div>
</div>
</div>
</div>
    </div>
  );
};

export default ApprenantFormations;
