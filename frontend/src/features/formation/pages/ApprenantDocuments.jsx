import React from 'react';
import { useOutletContext } from 'react-router-dom';

export const ApprenantDocuments = () => {
  const { data } = useOutletContext();
  const program = data?.program || {};
  const resources = data?.resources || [];

  return (
    <div className="flex-1 pb-10">
      <div className="flex flex-col w-full">
<div className="px-8 py-8 flex flex-col gap-8 max-w-[1600px] mx-auto w-full">
{/*  Top Knowledge Banner & Semantic Context  */}
<section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary via-primary-container to-primary text-on-primary p-8 shadow-xl">
<div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none"></div>
<div className="absolute right-48 -bottom-24 w-80 h-80 rounded-full bg-tertiary-fixed-dim/15 blur-2xl pointer-events-none"></div>
<div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
<div className="space-y-3 max-w-3xl">
<div className="flex items-center gap-2.5">
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest/15 backdrop-blur-md text-tertiary-fixed font-label-sm text-label-sm tracking-wider uppercase">
<span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-pulse"></span>
              Référentiel Pédagogique MINEFOP &amp; Industrie
            </span>
<span className="font-label-sm text-label-sm text-primary-fixed-dim/80">Réf: AZ-DOC-2025-Q1</span>
</div>
<h1 className="font-headline-xl text-headline-xl text-on-primary tracking-tight">
            Documents de Cours, Ressources &amp; Bibliothèque Pédagogique
          </h1>
<p className="font-body-md text-body-md text-primary-fixed leading-relaxed">
            Supports officiels certifiés MINEFOP, dépôts de code sources, starters kits DevOps, replays des masterclasses et annales nationales d'examens validés par le comité pédagogique AZ Corporation SARL.
          </p>
</div>
{/*  Direct Actions CTA Strip  */}
<div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
<button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary-container hover:bg-secondary text-on-secondary font-label-lg text-label-lg shadow-md transition-all active:scale-95" id="btn-bulk-zip">
<span className="material-symbols-outlined notranslate text-[20px]">archive</span>
<span>Pack Semestre (.zip)</span>
</button>
<a className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container-lowest/10 hover:bg-surface-container-lowest/20 backdrop-blur-md text-on-primary font-label-lg text-label-lg transition-all" href="#shared-drive">
<span className="material-symbols-outlined notranslate text-[20px] text-tertiary-fixed">cloud_queue</span>
<span>Google Drive Campus</span>
</a>
</div>
</div>
{/*  Quick Knowledge Stats  */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 bg-surface-container-lowest/5 rounded-lg p-4 backdrop-blur-sm">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-surface-container-lowest/10 flex items-center justify-center text-primary-fixed">
<span className="material-symbols-outlined notranslate text-[22px]">library_books</span>
</div>
<div>
<div className="font-headline-md text-headline-md text-on-primary font-bold">42</div>
<div className="font-label-sm text-label-sm text-primary-fixed-dim">Documents indexés</div>
</div>
</div>
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-surface-container-lowest/10 flex items-center justify-center text-tertiary-fixed">
<span className="material-symbols-outlined notranslate text-[22px]">terminal</span>
</div>
<div>
<div className="font-headline-md text-headline-md text-on-primary font-bold">8</div>
<div className="font-label-sm text-label-sm text-primary-fixed-dim">Dépôts &amp; Starters</div>
</div>
</div>
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-surface-container-lowest/10 flex items-center justify-center text-secondary-fixed">
<span className="material-symbols-outlined notranslate text-[22px]">video_library</span>
</div>
<div>
<div className="font-headline-md text-headline-md text-on-primary font-bold">14h 30m</div>
<div className="font-label-sm text-label-sm text-primary-fixed-dim">Replays 1080p HD</div>
</div>
</div>
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-surface-container-lowest/10 flex items-center justify-center text-error-container">
<span className="material-symbols-outlined notranslate text-[22px]">verified</span>
</div>
<div>
<div className="font-headline-md text-headline-md text-on-primary font-bold">100%</div>
<div className="font-label-sm text-label-sm text-primary-fixed-dim">Homologués MINEFOP</div>
</div>
</div>
</div>
</section>
{/*  AZ Copilot Pedagogical Dispatch (Intelligent Recommendation)  */}
<section className="rounded-xl bg-surface-container-lowest p-6 shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
<div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-secondary-container via-tertiary-fixed-dim to-secondary"></div>
<div className="flex items-start gap-4">
<div className="w-12 h-12 rounded-xl bg-secondary-container/10 text-secondary-container flex items-center justify-center shrink-0 shadow-sm">
<span className="material-symbols-outlined notranslate text-[26px]">smart_toy</span>
</div>
<div className="space-y-1">
<div className="flex items-center gap-2">
<span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-primary-container text-on-primary font-bold">AZ COPILOT</span>
<span className="font-label-md text-label-md text-secondary font-semibold">Conseil Pédagogique Prédictif</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">• Évaluation imminente</span>
</div>
<p className="font-body-md text-body-md text-on-surface">
            Basé sur votre prochain examen blanc de ce Vendredi (<strong className="font-semibold text-primary">Architecture REST &amp; CQRS Symfony</strong>), le tuteur vous recommande vivement de réviser le <strong className="text-secondary font-semibold">Chapitre 3</strong> du support Microservices (Pages 24 à 45).
          </p>
</div>
</div>
<div className="shrink-0 flex items-center gap-3 w-full md:w-auto">
<button className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary-container text-on-primary hover:bg-primary font-label-lg text-label-lg transition-all shadow-sm" id="btn-open-chap3">
<span className="material-symbols-outlined notranslate text-[18px] text-tertiary-fixed">menu_book</span>
<span>Ouvrir Page 24</span>
</button>
</div>
</section>
{/*  Semantic Search, Filter Engine & Knowledge Taxonomy  */}
<section className="flex flex-col gap-4">
{/*  Search Bar with Vector Search Pill  */}
<div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
<div className="relative flex-1">
<span className="material-symbols-outlined notranslate absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-[22px]">manage_search</span>
<input className="w-full h-12 pl-12 pr-28 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-on-surface-variant focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary-container transition-all" id="search-input" placeholder="Recherche vectorielle IA (ex: 'diagramme de séquences CQRS', 'configuration Nginx reverse-proxy', 'annales 2023')..." type="text" />
<div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
<span className="material-symbols-outlined notranslate text-[14px] text-secondary">memory</span>
<span>Qdrant AI</span>
</div>
</div>
<div className="flex items-center gap-2 shrink-0 overflow-x-auto pb-1 lg:pb-0">
<div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg text-on-surface-variant font-label-md text-label-md">
<span className="material-symbols-outlined notranslate text-[18px]">filter_list</span>
<span>Trier:</span>
<select className="bg-transparent font-label-md text-label-md text-on-surface font-semibold focus:outline-none cursor-pointer" id="sort-select">
<option value="recent">Plus récents</option>
<option value="popular">Téléchargements</option>
<option value="size">Taille de fichier</option>
</select>
</div>
<button className="w-10 h-10 rounded-lg bg-secondary-container text-on-secondary flex items-center justify-center shadow-sm" id="view-toggle-grid" title="Vue Grille">
<span className="material-symbols-outlined notranslate text-[20px]">grid_view</span>
</button>
<button className="w-10 h-10 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center transition-colors" id="view-toggle-list" title="Vue Liste">
<span className="material-symbols-outlined notranslate text-[20px]">view_list</span>
</button>
</div>
</div>
{/*  Categories & Subject Navigation Pills  */}
<div className="flex flex-col gap-3">
{/*  Categories Filter  */}
<div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none" id="category-pills">
<button className="cat-pill flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md shrink-0 shadow-sm transition-all" data-cat="all">
<span className="material-symbols-outlined notranslate text-[18px]">dataset</span>
<span>Tous les documents</span>
<span className="px-1.5 py-0.2 rounded bg-surface-container-lowest/20 font-label-sm text-label-sm">42</span>
</button>
<button className="cat-pill flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant font-label-md text-label-md shrink-0 transition-all" data-cat="slides">
<span className="material-symbols-outlined notranslate text-[18px] text-tertiary-container">slideshow</span>
<span>Supports de cours / Slides</span>
<span className="px-1.5 py-0.2 rounded bg-surface-container font-label-sm text-label-sm">18</span>
</button>
<button className="cat-pill flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant font-label-md text-label-md shrink-0 transition-all" data-cat="code">
<span className="material-symbols-outlined notranslate text-[18px] text-secondary">terminal</span>
<span>Starters Kits &amp; Code</span>
<span className="px-1.5 py-0.2 rounded bg-surface-container font-label-sm text-label-sm">8</span>
</button>
<button className="cat-pill flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant font-label-md text-label-md shrink-0 transition-all" data-cat="exams">
<span className="material-symbols-outlined notranslate text-[18px] text-error">history_edu</span>
<span>Sujets d'examens &amp; Annales</span>
<span className="px-1.5 py-0.2 rounded bg-surface-container font-label-sm text-label-sm">10</span>
</button>
<button className="cat-pill flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant font-label-md text-label-md shrink-0 transition-all" data-cat="video">
<span className="material-symbols-outlined notranslate text-[18px] text-secondary-container">play_circle</span>
<span>Enregistrements vidéo</span>
<span className="px-1.5 py-0.2 rounded bg-surface-container font-label-sm text-label-sm">6</span>
</button>
</div>
{/*  Modules / Subjects Tags  */}
<div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none text-on-surface-variant font-label-sm text-label-sm">
<span className="text-on-surface font-semibold flex items-center gap-1 shrink-0">
<span className="material-symbols-outlined notranslate text-[16px] text-secondary">label</span>
            Matières :
          </span>
<button className="px-2.5 py-1 rounded-md bg-surface-container hover:bg-surface-container-high transition-colors shrink-0 font-medium">Architecture Microservices</button>
<button className="px-2.5 py-1 rounded-md bg-surface-container hover:bg-surface-container-high transition-colors shrink-0 font-medium">Conteneurisation Docker</button>
<button className="px-2.5 py-1 rounded-md bg-surface-container hover:bg-surface-container-high transition-colors shrink-0 font-medium">Python &amp; IA Générative</button>
<button className="px-2.5 py-1 rounded-md bg-surface-container hover:bg-surface-container-high transition-colors shrink-0 font-medium">Algorithmique Avancée</button>
<button className="px-2.5 py-1 rounded-md bg-surface-container hover:bg-surface-container-high transition-colors shrink-0 font-medium">Frontend React &amp; Vue</button>
<button className="px-2.5 py-1 rounded-md bg-surface-container hover:bg-surface-container-high transition-colors shrink-0 font-medium">Anglais Technique &amp; MINEFOP</button>
</div>
</div>
</section>
{/*  Main Workspace Split: Document Catalog (8 cols) + Sync & Storage Panel (4 cols)  */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
{/*  Left Column: Document Grid (8 cols)  */}
<main className="lg:col-span-8 flex flex-col gap-6">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<h2 className="font-headline-md text-headline-md text-on-surface font-bold">Ressources Récentes &amp; Certifiées</h2>
<span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">Semestre 2 • Promotion 2025</span>
</div>
<span className="font-label-md text-label-md text-on-surface-variant">Affichage de 6 documents majeurs</span>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="documents-container">
{/*  Card 1: Microservices Architecture (PDF)  */}
<article className="group rounded-xl bg-surface-container-lowest p-5 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between relative overflow-hidden">
<div className="absolute top-0 right-0 w-24 h-24 bg-error-container/20 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
<div className="space-y-4">
<div className="flex items-start justify-between">
<div className="w-12 h-12 rounded-xl bg-error-container text-on-error-container flex items-center justify-center font-bold font-headline-sm shadow-sm">
<span className="material-symbols-outlined notranslate text-[24px]">picture_as_pdf</span>
</div>
<div className="flex flex-col items-end">
<span className="px-2 py-0.5 rounded bg-error-container/40 text-on-error-container font-label-sm text-label-sm font-bold uppercase tracking-wider">PDF • 8.4 Mo</span>
<span className="font-body-sm text-body-sm text-on-surface-variant mt-1 flex items-center gap-1">
<span className="material-symbols-outlined notranslate text-[14px]">download</span> 142 dl
                  </span>
</div>
</div>
<div>
<span className="font-label-sm text-label-sm text-secondary font-semibold uppercase tracking-wider">Architecture Logicielle</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold group-hover:text-secondary transition-colors mt-0.5 line-clamp-2">
                  Architecture Micro-services &amp; Pattern CQRS avec Symfony et FastAPI
                </h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 line-clamp-2">
                  Patterns Event Sourcing, buses de messages RabbitMQ, séparation lectures/écritures et contrats d'API avec OpenAPI 3.
                </p>
</div>
<div className="flex items-center gap-2 pt-2 text-on-surface-variant font-label-sm text-label-sm bg-surface-container-low p-2 rounded-lg">
<span className="material-symbols-outlined notranslate text-[16px] text-secondary">person_check</span>
<span>Dr. Paulin T. • Responsable Pôle Backend</span>
</div>
</div>
<div className="flex items-center gap-2 pt-5 mt-4">
<button className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors" onClick={() => alert("previewDoc('Architecture Micro-services')")}>
<span className="material-symbols-outlined notranslate text-[18px]">visibility</span>
<span>Aperçu</span>
</button>
<button className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md transition-colors shadow-sm" onClick={() => alert("downloadDoc('Architecture_Microservices_CQRS.pdf')")}>
<span className="material-symbols-outlined notranslate text-[18px]">download</span>
<span>Télécharger</span>
</button>
</div>
</article>
{/*  Card 2: Starter Kit Docker Compose (ZIP)  */}
<article className="group rounded-xl bg-surface-container-lowest p-5 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between relative overflow-hidden">
<div className="absolute top-0 right-0 w-24 h-24 bg-primary-fixed/30 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
<div className="space-y-4">
<div className="flex items-start justify-between">
<div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-bold font-headline-sm shadow-sm">
<span className="material-symbols-outlined notranslate text-[24px]">folder_zip</span>
</div>
<div className="flex flex-col items-end">
<span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-bold uppercase tracking-wider">ZIP • 14.0 Mo</span>
<span className="font-body-sm text-body-sm text-on-surface-variant mt-1 flex items-center gap-1">
<span className="material-symbols-outlined notranslate text-[14px]">fork_right</span> 89 forks
                  </span>
</div>
</div>
<div>
<span className="font-label-sm text-label-sm text-secondary font-semibold uppercase tracking-wider">DevOps &amp; Environnement</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold group-hover:text-secondary transition-colors mt-0.5">
                  Starter-Kit-Docker-Compose-DevEnv.zip
                </h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 line-clamp-2">
                  Stack prête pour le campus : Nginx reverse proxy + PHP 8.3-FPM + PostgreSQL 16 + Redis Cache + Adminer préconfiguré.
                </p>
</div>
<div className="flex items-center gap-2 pt-2 text-on-surface-variant font-label-sm text-label-sm bg-surface-container-low p-2 rounded-lg">
<span className="material-symbols-outlined notranslate text-[16px] text-tertiary-fixed-dim">verified_user</span>
<span>Homologué Laboratoire AZ Pulse Lab</span>
</div>
</div>
<div className="flex items-center gap-2 pt-5 mt-4">
<a className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors" href="https://github.com" rel="noopener noreferrer" target="_blank">
<span className="material-symbols-outlined notranslate text-[18px]">code</span>
<span>GitHub</span>
</a>
<button className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-secondary-container hover:bg-secondary text-on-secondary font-label-md text-label-md transition-colors shadow-sm" onClick={() => alert("downloadDoc('Starter-Kit-Docker-Compose.zip')")}>
<span className="material-symbols-outlined notranslate text-[18px]">file_download</span>
<span>Télécharger</span>
</button>
</div>
</article>
{/*  Card 3: Presentation Generative AI LLM (PPTX)  */}
<article className="group rounded-xl bg-surface-container-lowest p-5 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between relative overflow-hidden">
<div className="absolute top-0 right-0 w-24 h-24 bg-tertiary-fixed/30 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
<div className="space-y-4">
<div className="flex items-start justify-between">
<div className="w-12 h-12 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-center font-bold font-headline-sm shadow-sm">
<span className="material-symbols-outlined notranslate text-[24px]">co_present</span>
</div>
<div className="flex flex-col items-end">
<span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm font-bold uppercase tracking-wider">PPTX • 22.0 Mo</span>
<span className="font-body-sm text-body-sm text-on-surface-variant mt-1 flex items-center gap-1">
<span className="material-symbols-outlined notranslate text-[14px]">slideshow</span> 68 slides
                  </span>
</div>
</div>
<div>
<span className="font-label-sm text-label-sm text-tertiary-container font-semibold uppercase tracking-wider">Intelligence Artificielle</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold group-hover:text-secondary transition-colors mt-0.5">
                  Support-Cours-04-Modeles-Generatifs-LLM.pptx
                </h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 line-clamp-2">
                  Slides du séminaire de mercredi : RAG (Retrieval Augmented Generation), Tokenization, Fine-Tuning LoRA et Embeddings vectoriels.
                </p>
</div>
<div className="flex items-center gap-2 pt-2 text-on-surface-variant font-label-sm text-label-sm bg-surface-container-low p-2 rounded-lg">
<span className="material-symbols-outlined notranslate text-[16px] text-secondary">update</span>
<span>Mis à jour le 19 Février 2025</span>
</div>
</div>
<div className="flex items-center gap-2 pt-5 mt-4">
<button className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors" onClick={() => alert("previewDoc('Modèles Génératifs LLM')")}>
<span className="material-symbols-outlined notranslate text-[18px]">preview</span>
<span>Aperçu Web</span>
</button>
<button className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md transition-colors shadow-sm" onClick={() => alert("downloadDoc('Support-Cours-04-LLM.pptx')")}>
<span className="material-symbols-outlined notranslate text-[18px]">download</span>
<span>Télécharger</span>
</button>
</div>
</article>
{/*  Card 4: Official MINEFOP Exams Bank (PDF Certified)  */}
<article className="group rounded-xl bg-surface-container-lowest p-5 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between relative overflow-hidden">
<div className="absolute top-0 right-0 w-24 h-24 bg-tertiary-fixed-dim/20 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
<div className="space-y-4">
<div className="flex items-start justify-between">
<div className="w-12 h-12 rounded-xl bg-error text-on-error flex items-center justify-center font-bold font-headline-sm shadow-sm">
<span className="material-symbols-outlined notranslate text-[24px]">verified_user</span>
</div>
<div className="flex flex-col items-end">
<span className="px-2 py-0.5 rounded bg-tertiary-fixed-dim text-on-tertiary-fixed font-label-sm text-label-sm font-bold uppercase tracking-wider">MINEFOP OFFICIEL</span>
<span className="font-body-sm text-body-sm text-on-surface-variant mt-1 flex items-center gap-1">
<span className="material-symbols-outlined notranslate text-[14px]">auto_stories</span> 12.8 Mo
                  </span>
</div>
</div>
<div>
<span className="font-label-sm text-label-sm text-on-tertiary-fixed-variant font-semibold uppercase tracking-wider">Certification Nationale DQP</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold group-hover:text-secondary transition-colors mt-0.5">
                  Banque de Sujets d'Examen MINEFOP (Sessions 2020-2024)
                </h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 line-clamp-2">
                  Recueil complet des épreuves pratiques nationales, barèmes officiels de correction et études de cas réels d'entreprises camerounaises.
                </p>
</div>
<div className="flex items-center gap-2 pt-2 text-on-surface-variant font-label-sm text-label-sm bg-surface-container-low p-2 rounded-lg">
<span className="material-symbols-outlined notranslate text-[16px] text-tertiary-fixed-dim">workspace_premium</span>
<span>Tampon Inspection Pédagogique MINEFOP</span>
</div>
</div>
<div className="flex items-center gap-2 pt-5 mt-4">
<button className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors" onClick={() => alert("previewDoc('Annales Nationales MINEFOP')")}>
<span className="material-symbols-outlined notranslate text-[18px]">visibility</span>
<span>Consulter</span>
</button>
<button className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md transition-colors shadow-sm" onClick={() => alert("downloadDoc('Annales_MINEFOP_2020_2024.pdf')")}>
<span className="material-symbols-outlined notranslate text-[18px]">download</span>
<span>Télécharger</span>
</button>
</div>
</article>
{/*  Card 5: Replay Video Masterclass (MP4)  */}
<article className="group rounded-xl bg-surface-container-lowest p-5 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between relative overflow-hidden">
<div className="absolute top-0 right-0 w-24 h-24 bg-secondary-fixed/30 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
<div className="space-y-4">
<div className="flex items-start justify-between">
<div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary flex items-center justify-center font-bold font-headline-sm shadow-sm">
<span className="material-symbols-outlined notranslate text-[24px]">smart_display</span>
</div>
<div className="flex flex-col items-end">
<span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-bold uppercase tracking-wider">MP4 1080P • 2h 15m</span>
<span className="font-body-sm text-body-sm text-on-surface-variant mt-1 flex items-center gap-1">
<span className="material-symbols-outlined notranslate text-[14px]">visibility</span> 98 vues
                  </span>
</div>
</div>
<div>
<span className="font-label-sm text-label-sm text-secondary font-semibold uppercase tracking-wider">Masterclass En Direct</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold group-hover:text-secondary transition-colors mt-0.5">
                  Replay Masterclass : Déploiement Kubernetes &amp; Pipeline CI/CD GitLab
                </h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 line-clamp-2">
                  Session en direct enregistrée au campus : Création de clusters K8s, ingress controller, runners GitLab et tests d'intégration automatisés.
                </p>
</div>
<div className="flex items-center gap-2 pt-2 text-on-surface-variant font-label-sm text-label-sm bg-surface-container-low p-2 rounded-lg">
<span className="material-symbols-outlined notranslate text-[16px] text-secondary">mic</span>
<span>Animé par Ing. Samuel B. (DevOps Lead)</span>
</div>
</div>
<div className="flex items-center gap-2 pt-5 mt-4">
<button className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-secondary-container hover:bg-secondary text-on-secondary font-label-md text-label-md transition-colors shadow-sm" onClick={() => alert("playVideoModal()")}>
<span className="material-symbols-outlined notranslate text-[18px]">play_arrow</span>
<span>Lancer le Replay</span>
</button>
<button className="w-10 h-10 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors" onClick={() => alert("downloadDoc('Masterclass_K8s_GitLab.mp4')")} title="Télécharger offline">
<span className="material-symbols-outlined notranslate text-[18px]">file_download</span>
</button>
</div>
</article>
{/*  Card 6: Markdown Cheat-Sheet (DOC / MD)  */}
<article className="group rounded-xl bg-surface-container-lowest p-5 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between relative overflow-hidden">
<div className="absolute top-0 right-0 w-24 h-24 bg-surface-container-high rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
<div className="space-y-4">
<div className="flex items-start justify-between">
<div className="w-12 h-12 rounded-xl bg-surface-container-highest text-on-surface flex items-center justify-center font-bold font-headline-sm shadow-sm">
<span className="material-symbols-outlined notranslate text-[24px]">terminal</span>
</div>
<div className="flex flex-col items-end">
<span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-bold uppercase tracking-wider">MARKDOWN • 120 Ko</span>
<span className="font-body-sm text-body-sm text-on-surface-variant mt-1 flex items-center gap-1">
<span className="material-symbols-outlined notranslate text-[14px]">star</span> 4.9/5
                  </span>
</div>
</div>
<div>
<span className="font-label-sm text-label-sm text-primary font-semibold uppercase tracking-wider">Guide Méthodologique</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold group-hover:text-secondary transition-colors mt-0.5">
                  Cheat-Sheet Git Flow, Bonnes Pratiques &amp; Conventions AZ Pulse
                </h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 line-clamp-2">
                  Standardisation des commits sémantiques (Conventional Commits), cycle de pull request, revue de code par les pairs et hooks Husky.
                </p>
</div>
<div className="flex items-center gap-2 pt-2 text-on-surface-variant font-label-sm text-label-sm bg-surface-container-low p-2 rounded-lg">
<span className="material-symbols-outlined notranslate text-[16px] text-primary">bookmark</span>
<span>Lecture rapide : 6 minutes</span>
</div>
</div>
<div className="flex items-center gap-2 pt-5 mt-4">
<button className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors" onClick={() => alert("previewDoc('Git Flow Cheat Sheet')")}>
<span className="material-symbols-outlined notranslate text-[18px]">article</span>
<span>Lire le guide</span>
</button>
<button className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md transition-colors shadow-sm" onClick={() => alert("downloadDoc('CheatSheet_Git_AZPulse.md')")}>
<span className="material-symbols-outlined notranslate text-[18px]">download</span>
<span>Copier / DL</span>
</button>
</div>
</article>
</div>
{/*  Pagination & Load More  */}
<div className="flex items-center justify-between pt-4 bg-surface-container-lowest p-4 rounded-xl shadow-sm">
<span className="font-body-sm text-body-sm text-on-surface-variant">Affichage de 1 à 6 sur 42 documents d'études</span>
<div className="flex items-center gap-2">
<button className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors" disabled>
<span className="material-symbols-outlined notranslate text-[18px]">chevron_left</span>
</button>
<button className="w-8 h-8 rounded-lg bg-secondary-container text-on-secondary font-label-sm text-label-sm font-bold">1</button>
<button className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm">2</button>
<button className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm">3</button>
<button className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors">
<span className="material-symbols-outlined notranslate text-[18px]">chevron_right</span>
</button>
</div>
</div>
</main>
{/*  Right Column: Cloud Sync, Local Campus Cache & Quota Status (4 cols)  */}
<aside className="lg:col-span-4 flex flex-col gap-6">
{/*  Storage & Quota Widget with SVG Progress Ring  */}
<div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm space-y-6">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2.5">
<div className="w-9 h-9 rounded-lg bg-secondary-container/10 text-secondary-container flex items-center justify-center">
<span className="material-symbols-outlined notranslate text-[20px]">cloud_sync</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Stockage Étudiant</h3>
</div>
<span className="px-2 py-0.5 rounded bg-surface-container font-label-sm text-label-sm text-on-surface-variant font-bold">AZ DRIVE</span>
</div>
{/*  Circular Metric & Details  */}
<div className="flex items-center gap-6">
<div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
<svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
<circle className="text-surface-container" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
<circle className="text-secondary-container" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="210.9" strokeLinecap="round" strokeWidth="8"></circle>
</svg>
<div className="absolute inset-0 flex flex-col items-center justify-center">
<span className="font-headline-md text-headline-md font-bold text-on-surface">16%</span>
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Utilisé</span>
</div>
</div>
<div className="space-y-1.5 flex-1">
<div className="flex justify-between font-label-md text-label-md">
<span className="text-on-surface-variant">Quota consommé :</span>
<span className="text-on-surface font-bold">2.4 Go</span>
</div>
<div className="flex justify-between font-label-md text-label-md">
<span className="text-on-surface-variant">Espace total alloué :</span>
<span className="text-primary font-bold">15.0 Go</span>
</div>
<div className="flex justify-between font-label-md text-label-md">
<span className="text-on-surface-variant">Reste disponible :</span>
<span className="text-secondary font-bold">12.6 Go</span>
</div>
</div>
</div>
{/*  Storage Details by Category Breakdown  */}
<div className="space-y-2 pt-2">
<div className="flex items-center justify-between text-body-sm font-body-sm">
<span className="flex items-center gap-1.5 text-on-surface">
<span className="w-2 h-2 rounded-full bg-error"></span> Supports PDF &amp; Examens
              </span>
<span className="text-on-surface-variant font-medium">1.2 Go</span>
</div>
<div className="flex items-center justify-between text-body-sm font-body-sm">
<span className="flex items-center gap-1.5 text-on-surface">
<span className="w-2 h-2 rounded-full bg-secondary-container"></span> Replays Vidéo Hors-Ligne
              </span>
<span className="text-on-surface-variant font-medium">950 Mo</span>
</div>
<div className="flex items-center justify-between text-body-sm font-body-sm">
<span className="flex items-center gap-1.5 text-on-surface">
<span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span> Starters Kits &amp; Projets
              </span>
<span className="text-on-surface-variant font-medium">250 Mo</span>
</div>
</div>
</div>
{/*  Campus Local Edge Server Sync  */}
<div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm space-y-5">
<div className="flex items-center justify-between">
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Passerelle Campus Local</h3>
<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed animate-ping"></span>
              Yaoundé (Biyem-Assi)
            </span>
</div>
<div className="p-3.5 rounded-lg bg-surface-container-low flex flex-col gap-2">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant">Statut d'infrastructure</span>
<span className="font-label-sm text-label-sm text-secondary font-bold flex items-center gap-1">
<span className="material-symbols-outlined notranslate text-[14px]">wifi</span> En ligne (LAN Campus)
              </span>
</div>
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant">Dernière synchronisation</span>
<span className="font-label-sm text-label-sm text-on-surface font-semibold">Il y a 12 min</span>
</div>
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant">Débit cache local</span>
<span className="font-label-sm text-label-sm text-primary font-bold">1 Gbps Fibre Dédiée</span>
</div>
</div>
<div className="space-y-3">
<button className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg transition-all shadow-md active:scale-98" id="btn-sync-offline">
<span className="material-symbols-outlined notranslate text-[20px] text-tertiary-fixed">offline_pin</span>
<span>Synchroniser pour consultation Hors-Ligne</span>
</button>
<p className="font-body-sm text-body-sm text-on-surface-variant text-center">
              Permet de réviser même sans connexion Internet sur vos ordinateurs et tablettes.
            </p>
</div>
</div>
{/*  Direct Faculty Contacts for Course Clarifications  */}
<div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm space-y-4">
<div className="flex items-center justify-between">
<h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Permanence Enseignants</h3>
<span className="material-symbols-outlined notranslate text-secondary text-[20px]">contact_support</span>
</div>
<div className="space-y-3">
<div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-label-sm">PK</div>
<div>
<div className="font-label-md text-label-md text-on-surface font-bold">Dr. Paulin Kamga</div>
<div className="font-label-sm text-label-sm text-on-surface-variant">Microservices &amp; Symfony</div>
</div>
</div>
<button className="p-1.5 rounded-md hover:bg-surface-container-high text-secondary" title="Envoyer un message pédagogique">
<span className="material-symbols-outlined notranslate text-[18px]">chat</span>
</button>
</div>
<div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-label-sm">SB</div>
<div>
<div className="font-label-md text-label-md text-on-surface font-bold">Ing. Samuel Bitche</div>
<div className="font-label-sm text-label-sm text-on-surface-variant">DevOps &amp; Cloud K8s</div>
</div>
</div>
<button className="p-1.5 rounded-md hover:bg-surface-container-high text-secondary" title="Envoyer un message pédagogique">
<span className="material-symbols-outlined notranslate text-[18px]">chat</span>
</button>
</div>
</div>
</div>
</aside>
</div>
</div>
{/*  Interactive Document Preview Modal  */}
<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/60 backdrop-blur-sm hidden" id="preview-modal">
<div className="bg-surface-container-lowest rounded-xl max-w-3xl w-full p-6 shadow-2xl space-y-4 max-h-[921px] flex flex-col">
<div className="flex items-center justify-between pb-3">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined notranslate text-secondary text-[24px]">description</span>
<h3 className="font-headline-md text-headline-md text-on-surface font-bold" id="modal-title">Aperçu du document</h3>
</div>
<button className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant" id="modal-close">
<span className="material-symbols-outlined notranslate text-[20px]">close</span>
</button>
</div>
<div className="flex-1 overflow-y-auto space-y-4 p-4 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface">
<div className="flex items-center gap-2 px-3 py-1.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
<span className="material-symbols-outlined notranslate text-[16px] text-tertiary-fixed-dim">verified</span>
<span>Support homologué - Direction des Examens et Concours (MINEFOP Cameroun)</span>
</div>
<p className="leading-relaxed">
          Le document sélectionné est rendu disponible en mode haute fidélité pour consultation directe. Vous pouvez parcourir les slides de cours, exécuter les extraits de code via l'interpréteur connecté du campus ou exporter les annotations vers votre espace personnel.
        </p>
<div className="p-4 rounded-lg bg-primary-container text-on-primary font-body-sm text-body-sm">
<strong>Extrait du Chapitre 3 (Pattern CQRS) :</strong><br />
          « La ségrégation des responsabilités de commande et de requête permet d'optimiser séparément les schémas de lecture (optimisés pour l'UI avec Redis / Elasticsearch) et les transactions ACID d'écriture avec Symfony Messenger. »
        </div>
</div>
<div className="flex items-center justify-end gap-3 pt-2">
<button className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md" id="modal-cancel-btn">
          Fermer
        </button>
<button className="px-5 py-2 rounded-lg bg-secondary-container hover:bg-secondary text-on-secondary font-label-md text-label-md shadow-sm flex items-center gap-1.5" id="modal-download-btn">
<span className="material-symbols-outlined notranslate text-[18px]">download</span>
<span>Télécharger la version intégrale</span>
</button>
</div>
</div>
</div>
{/*  Notification Toast Container  */}
<div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-on-primary shadow-xl translate-y-24 opacity-0 transition-all duration-300" id="toast">
<span className="material-symbols-outlined notranslate text-tertiary-fixed text-[20px]">check_circle</span>
<span className="font-label-md text-label-md" id="toast-message">Action effectuée avec succès</span>
</div>
</div>

    </div>
  );
};

export default ApprenantDocuments;
