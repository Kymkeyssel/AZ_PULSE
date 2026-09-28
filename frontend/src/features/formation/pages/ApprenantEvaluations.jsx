import React from 'react';
import { useOutletContext } from 'react-router-dom';

import { academyService } from '../../../services/api';

export const ApprenantEvaluations = () => {
  const { data } = useOutletContext();
  const program = data?.program || {};
  const grades = data?.grades || [];
  const fileInputRef = React.useRef(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const response = await academyService.uploadDocument(file, 'submission');
        alert(`Succès: ${response.message}`);
      } catch (error) {
        alert(`Erreur d'upload: ${error.message}`);
      }
    }
  };

  return (
    <div className="flex-1 pb-10">
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
      <div className="flex flex-col w-full">
<div className="px-6 lg:px-10 py-8 max-w-[1600px] mx-auto w-full space-y-8">
{/*  Top Bar / Breadcrumb Context & Actions  */}
<div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
<div className="space-y-2">
<div className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md tracking-wider uppercase">
<span className="inline-flex items-center gap-1 font-semibold text-secondary">
<span className="material-symbols-outlined notranslate text-[16px]">school</span>
            AZ PULSE ACADÉMIE
          </span>
<span>•</span>
<span>{program.programName || "CURRICULUS FULLSTACK & IA"}</span>
<span>•</span>
<span className="bg-surface-container-high px-2 py-0.5 rounded text-on-surface font-semibold">{program.promotionName || "SESSION 2024-2025"}</span>
</div>
<h1 className="font-headline-xl text-headline-xl text-primary font-extrabold tracking-tight">
          Mes Évaluations, Livrables &amp; Relevé de Notes
        </h1>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
          Suivi de la performance académique en temps réel, devoirs continus, soutenances de projets et validation certifiante accréditée par le Ministère de l’Emploi et de la Formation Professionnelle (MINEFOP).
        </p>
</div>
{/*  Action Group  */}
<div className="flex flex-wrap items-center gap-3">
<button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container-lowest text-primary shadow-[0_1px_8px_rgba(0,0,0,0.06)] hover:bg-surface-container transition-all font-label-lg text-label-lg font-semibold" type="button">
<span className="material-symbols-outlined notranslate text-[20px] text-secondary">assignment_return</span>
<span>Demander un recours</span>
</button>
<button 
  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary-container text-on-secondary shadow-md hover:bg-secondary transition-all font-label-lg text-label-lg font-semibold" 
  type="button"
  onClick={handleUploadClick}
>
<span className="material-symbols-outlined notranslate text-[20px]">upload_file</span>
<span>Déposer un devoir</span>
</button>
<button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary-container text-on-primary shadow-md hover:bg-primary transition-all font-label-lg text-label-lg font-semibold" type="button">
<span className="material-symbols-outlined notranslate text-[20px] text-tertiary-fixed-dim">verified</span>
<span>Relevé officiel (PDF eIDAS)</span>
</button>
</div>
</div>
{/*  4 High-Precision Analytical Metric Tiles  */}
<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
{/*  Metric 1: Moyenne Générale  */}
<div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-6 shadow-[0_4px_20px_-2px_rgba(11,37,69,0.06)] flex flex-col justify-between">
<div className="flex items-start justify-between">
<span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-bold">Moyenne Générale</span>
<span className="inline-flex items-center gap-1 font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-bold">
<span className="material-symbols-outlined notranslate text-[13px]">military_tech</span>
            Mention Très Bien
          </span>
</div>
<div className="my-4 flex items-baseline gap-3">
<span className="font-display-hero text-display-hero text-primary tracking-tight font-extrabold">16.2</span>
<span className="font-headline-md text-headline-md text-on-surface-variant">/ 20</span>
</div>
<div className="flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm pt-2 bg-surface-container-low -mx-6 -mb-6 px-6 py-2.5">
<span className="flex items-center gap-1.5 font-semibold text-primary">
<span className="material-symbols-outlined notranslate text-[16px] text-secondary">leaderboard</span>
            Rang : 7<sup className="text-[10px]">ème</sup> / 35 élèves
          </span>
<span className="text-on-surface-variant text-[11px]">Top 20% promotion</span>
</div>
</div>
{/*  Metric 2: Devoirs Soumis  */}
<div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-6 shadow-[0_4px_20px_-2px_rgba(11,37,69,0.06)] flex flex-col justify-between">
<div className="flex items-start justify-between">
<span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-bold">Devoirs Soumis &amp; Validés</span>
<span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-bold">
            91.6% Succès
          </span>
</div>
<div className="my-4 flex items-baseline gap-3">
<span className="font-display-hero text-display-hero text-primary tracking-tight font-extrabold">11</span>
<span className="font-headline-md text-headline-md text-on-surface-variant">/ 12 livrables</span>
</div>
<div className="space-y-1.5 pt-2 bg-surface-container-low -mx-6 -mb-6 px-6 py-2.5">
<div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden">
<div className="bg-secondary-container h-full rounded-full" style={{"width":"91.6%"}}></div>
</div>
<div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
<span>1 devoir en attente de notation</span>
<span className="font-semibold text-secondary">À jour</span>
</div>
</div>
</div>
{/*  Metric 3: Projets Intégrateurs  */}
<div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-6 shadow-[0_4px_20px_-2px_rgba(11,37,69,0.06)] flex flex-col justify-between">
<div className="flex items-start justify-between">
<span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-bold">Projets Intégrateurs</span>
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm font-bold">
<span className="material-symbols-outlined notranslate text-[14px]">award_star</span>
            Félicitations Jury
          </span>
</div>
<div className="my-4 flex items-baseline gap-3">
<span className="font-display-hero text-display-hero text-primary tracking-tight font-extrabold">3</span>
<span className="font-headline-md text-headline-md text-on-surface-variant">/ 4 jalons</span>
</div>
<div className="flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm pt-2 bg-surface-container-low -mx-6 -mb-6 px-6 py-2.5">
<span className="flex items-center gap-1.5 font-semibold text-primary">
<span className="material-symbols-outlined notranslate text-[16px] text-tertiary-fixed-dim">verified_user</span>
            Dernière soutenance : 18.5/20
          </span>
<span className="text-on-surface-variant text-[11px]">Projet MINEFOP S2</span>
</div>
</div>
{/*  Metric 4: Assiduité & Participation  */}
<div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-6 shadow-[0_4px_20px_-2px_rgba(11,37,69,0.06)] flex flex-col justify-between">
<div className="flex items-start justify-between">
<span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-bold">Assiduité &amp; Présence</span>
<span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-bold">
            Émargements OK
          </span>
</div>
<div className="my-4 flex items-baseline gap-3">
<span className="font-display-hero text-display-hero text-primary tracking-tight font-extrabold">94.6%</span>
<span className="font-headline-md text-headline-md text-on-surface-variant">TD / Visio</span>
</div>
<div className="flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm pt-2 bg-surface-container-low -mx-6 -mb-6 px-6 py-2.5">
<span className="flex items-center gap-1 text-on-surface-variant text-[12px]">
<span className="w-2 h-2 rounded-full bg-secondary-container"></span>
            1 absence justifiée (certificat)
          </span>
<span className="font-semibold text-primary text-[11px]">Seuil min. 80%</span>
</div>
</div>
</div>
{/*  Section: Devoirs & Projets en attente de dépôt (Urgent Alert Panel)  */}
<div className="space-y-4">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2.5">
<div className="w-3 h-3 rounded-full bg-error animate-ping"></div>
<h2 className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight">
            Devoirs &amp; Projets en attente de dépôt
          </h2>
<span className="bg-error-container text-on-error-container font-label-sm text-label-sm font-bold px-2 py-0.5 rounded-full uppercase">
            2 Échéances Actives
          </span>
</div>
<span className="hidden md:inline-block font-label-md text-label-md text-on-surface-variant">
          Pénalité de 1 pt/heure de retard après expiration du timer MINEFOP
        </span>
</div>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
{/*  Urgent Assignment 1  */}
<div className="rounded-xl bg-surface-container-lowest p-6 shadow-[0_4px_24px_rgba(11,37,69,0.08)] flex flex-col justify-between relative overflow-hidden">
<div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-error-container/20 pointer-events-none blur-2xl"></div>
<div className="space-y-4">
<div className="flex items-center justify-between gap-4">
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">
<span className="material-symbols-outlined notranslate text-[14px]">timer</span>
                URGENT • J-2 RESTANTS (12 Nov à 23h59)
              </span>
<span className="font-label-md text-label-md font-bold px-2.5 py-1 rounded bg-surface-container text-on-surface">
                Coeff. 3.0
              </span>
</div>
<div>
<span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">Module Backend Avancé &amp; Microservices</span>
<h3 className="font-headline-md text-headline-md text-primary font-bold mt-1">
                TP Noté : Architecture API REST Symfony 7 &amp; FastAPI
              </h3>
<p className="font-body-md text-body-md text-on-surface-variant mt-1.5">
                Mise en place de l'authentification JWT asynchrone, intégration du rate-limiting Redis et tests de charge avec Locust.
              </p>
</div>
<div className="p-3.5 rounded-lg bg-surface-container-low space-y-2">
<div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
<span className="font-semibold text-on-surface">Format exigé :</span>
<span className="font-mono text-primary font-medium">Dépôt GitHub public tagué v1.0.0 ou ZIP chiffré</span>
</div>
<div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
<span className="font-semibold text-on-surface">Évaluateur :</span>
<span>M. Paul Atangana (Architecte Cloud &amp; Lead Formateur)</span>
</div>
</div>
</div>
<div className="pt-5 mt-4 flex flex-col sm:flex-row items-center gap-3">
<button 
  className="w-full sm:flex-1 py-3 px-4 rounded-lg bg-secondary-container text-on-secondary hover:bg-secondary font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-sm transition-all" 
  type="button"
  onClick={handleUploadClick}
>
<span className="material-symbols-outlined notranslate text-[20px]">code</span>
<span>Déposer mon code source</span>
</button>
<button className="w-full sm:w-auto py-3 px-4 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 transition-colors" type="button">
<span className="material-symbols-outlined notranslate text-[18px]">download</span>
<span>Sujet &amp; Consignes (PDF)</span>
</button>
</div>
</div>
{/*  Urgent Assignment 2  */}
<div className="rounded-xl bg-surface-container-lowest p-6 shadow-[0_4px_24px_rgba(11,37,69,0.08)] flex flex-col justify-between relative overflow-hidden">
<div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-secondary-container/10 pointer-events-none blur-2xl"></div>
<div className="space-y-4">
<div className="flex items-center justify-between gap-4">
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-bold">
<span className="material-symbols-outlined notranslate text-[14px]">calendar_clock</span>
                DANS 8 JOURS (18 Nov à 18h00)
              </span>
<span className="font-label-md text-label-md font-bold px-2.5 py-1 rounded bg-surface-container text-on-surface">
                Coeff. 2.0
              </span>
</div>
<div>
<span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">Génie Logiciel &amp; Bases de Données</span>
<h3 className="font-headline-md text-headline-md text-primary font-bold mt-1">
                Modélisation UML &amp; Schéma Entité-Relation Postgres CRM
              </h3>
<p className="font-body-md text-body-md text-on-surface-variant mt-1.5">
                Conception du diagramme de classes complet, scénarios d'utilisation BPMN et dictionnaire de données normalisé en 3NF.
              </p>
</div>
<div className="p-3.5 rounded-lg bg-surface-container-low space-y-2">
<div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
<span className="font-semibold text-on-surface">Format exigé :</span>
<span className="font-mono text-primary font-medium">Fichier PDF d’architecture + fichier script SQL .ddl</span>
</div>
<div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
<span className="font-semibold text-on-surface">Évaluateur :</span>
<span>Dr. Madeleine Kamga (Directrice Pédagogique)</span>
</div>
</div>
</div>
<div className="pt-5 mt-4 flex flex-col sm:flex-row items-center gap-3">
<button 
  className="w-full sm:flex-1 py-3 px-4 rounded-lg bg-primary-container text-on-primary hover:bg-primary font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-sm transition-all" 
  type="button"
  onClick={handleUploadClick}
>
<span className="material-symbols-outlined notranslate text-[20px]">upload_file</span>
<span>Déposer le livrable PDF</span>
</button>
<button className="w-full sm:w-auto py-3 px-4 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 transition-colors" type="button">
<span className="material-symbols-outlined notranslate text-[18px]">rule</span>
<span>Grille critériée</span>
</button>
</div>
</div>
</div>
</div>
{/*  Section: Tableau complet et détaillé des Notes & Évaluations Récentes  */}
<div className="space-y-4">
<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
<div>
<h2 className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight">
            Registre Exhaustif des Notes &amp; Évaluations
          </h2>
<p className="font-body-md text-body-md text-on-surface-variant">
            Relevé continu conforme aux normes de certification professionnelle MINEFOP
          </p>
</div>
{/*  Interactive Filters Bar  */}
<div className="flex flex-wrap items-center gap-2">
{/*  Filter Semestre  */}
<div className="inline-flex rounded-lg bg-surface-container p-1 shadow-inner">
<button className="px-3 py-1.5 rounded-md bg-surface-container-lowest text-primary font-label-md text-label-md font-bold shadow-sm" type="button">
              Tous (S1 + S2)
            </button>
<button className="px-3 py-1.5 rounded-md text-on-surface-variant hover:text-on-surface font-label-md text-label-md font-medium" type="button">
              Semestre 1
            </button>
<button className="px-3 py-1.5 rounded-md text-on-surface-variant hover:text-on-surface font-label-md text-label-md font-medium" type="button">
              Semestre 2 (En cours)
            </button>
</div>
{/*  Type Selector  */}
<div className="relative">
<select className="appearance-none bg-surface-container-lowest text-on-surface font-label-md text-label-md pl-3 pr-8 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary">
<option value="all">Tous les types d'épreuves</option>
<option value="cc">Contrôles Continus (CC)</option>
<option value="exam">Examens sur table</option>
<option value="proj">Projets intégrateurs en équipe</option>
<option value="oral">Soutenances orales devant jury</option>
</select>
<span className="material-symbols-outlined notranslate absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">expand_more</span>
</div>
{/*  Search filter in table  */}
<button className="p-2 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-on-surface shadow-sm" title="Filtrer par matière" type="button">
<span className="material-symbols-outlined notranslate text-[20px]">filter_list</span>
</button>
</div>
</div>
{/*  Data Table Card  */}
<div className="rounded-xl bg-surface-container-lowest shadow-[0_4px_24px_rgba(11,37,69,0.06)] overflow-hidden">
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low text-on-surface font-label-md text-label-md uppercase tracking-wider">
<th className="py-4 px-5 font-bold">Épreuve / Devoir</th>
<th className="py-4 px-4 font-bold">Matière &amp; Formateur</th>
<th className="py-4 px-4 font-bold">Date</th>
<th className="py-4 px-3 font-bold text-center">Coeff</th>
<th className="py-4 px-5 font-bold text-center">Note / 20</th>
<th className="py-4 px-4 font-bold text-center">Promo &amp; Médiane</th>
<th className="py-4 px-6 font-bold">Commentaire Pédagogique</th>
<th className="py-4 px-5 font-bold text-right">Livrable Corrigé</th>
</tr>
</thead>
<tbody className="divide-y divide-surface-container font-body-sm text-body-sm text-on-surface">
{/*  Row 1: Note > 16 (Vert / Excellent)  */}
<tr className="hover:bg-surface-container-low/60 transition-colors">
<td className="py-4 px-5">
<div className="flex flex-col">
<span className="font-headline-sm text-headline-sm font-bold text-primary">Soutenance : Projet IA Prédictive &amp; LLM</span>
<span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
<span className="material-symbols-outlined notranslate text-[14px] text-tertiary-fixed-dim">groups</span>
                      Projet d'équipe • Soutenance Orale
                    </span>
</div>
</td>
<td className="py-4 px-4">
<div className="flex flex-col">
<span className="font-semibold text-on-surface">Ingénierie IA &amp; Data Science</span>
<span className="text-on-surface-variant font-label-sm text-label-sm">Dr. Madeleine Kamga</span>
</div>
</td>
<td className="py-4 px-4 whitespace-nowrap text-on-surface-variant">04 Nov 2024</td>
<td className="py-4 px-3 text-center">
<span className="px-2 py-0.5 rounded bg-surface-container font-bold text-primary">4.0</span>
</td>
<td className="py-4 px-5 text-center whitespace-nowrap">
<div className="inline-flex flex-col items-center">
<span className="px-3 py-1 rounded-lg bg-surface-container font-headline-sm text-headline-sm font-bold text-primary shadow-sm flex items-center gap-1.5">
<span className="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
                      18.5
                    </span>
<span className="font-label-sm text-label-sm text-secondary font-bold mt-1">Excellent</span>
</div>
</td>
<td className="py-4 px-4 text-center whitespace-nowrap">
<div className="flex flex-col items-center">
<span className="font-label-md text-label-md text-on-surface font-semibold">Moy. 14.1</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">Médiane 14.5</span>
</div>
</td>
<td className="py-4 px-6 min-w-[280px]">
<p className="font-body-sm text-body-sm text-on-surface italic bg-surface-container-low/70 p-2.5 rounded-lg">
                    « Remarquable maîtrise du fine-tuning et interface Streamlit impeccable. Démonstration live fluide face au jury d’experts. Félicitations. »
                  </p>
</td>
<td className="py-4 px-5 text-right whitespace-nowrap">
<button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-secondary hover:bg-secondary-fixed font-label-md text-label-md font-semibold transition-colors" type="button">
<span className="material-symbols-outlined notranslate text-[16px]">picture_as_pdf</span>
<span>Grille PDF</span>
</button>
</td>
</tr>
{/*  Row 2: Note 14-16 (Bleu / Très Bien)  */}
<tr className="hover:bg-surface-container-low/60 transition-colors">
<td className="py-4 px-5">
<div className="flex flex-col">
<span className="font-headline-sm text-headline-sm font-bold text-primary">Contrôle Continu : Algorithmique Avancée</span>
<span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
<span className="material-symbols-outlined notranslate text-[14px] text-secondary">assignment</span>
                      Examen Écrit Individuel
                    </span>
</div>
</td>
<td className="py-4 px-4">
<div className="flex flex-col">
<span className="font-semibold text-on-surface">Structures de Données &amp; Graphes</span>
<span className="text-on-surface-variant font-label-sm text-label-sm">M. Paul Atangana</span>
</div>
</td>
<td className="py-4 px-4 whitespace-nowrap text-on-surface-variant">28 Oct 2024</td>
<td className="py-4 px-3 text-center">
<span className="px-2 py-0.5 rounded bg-surface-container font-bold text-primary">2.5</span>
</td>
<td className="py-4 px-5 text-center whitespace-nowrap">
<div className="inline-flex flex-col items-center">
<span className="px-3 py-1 rounded-lg bg-surface-container font-headline-sm text-headline-sm font-bold text-primary shadow-sm flex items-center gap-1.5">
<span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed-dim"></span>
                      15.5
                    </span>
<span className="font-label-sm text-label-sm text-on-surface-variant font-bold mt-1">Très Bien</span>
</div>
</td>
<td className="py-4 px-4 text-center whitespace-nowrap">
<div className="flex flex-col items-center">
<span className="font-label-md text-label-md text-on-surface font-semibold">Moy. 12.8</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">Médiane 13.0</span>
</div>
</td>
<td className="py-4 px-6 min-w-[280px]">
<p className="font-body-sm text-body-sm text-on-surface italic bg-surface-container-low/70 p-2.5 rounded-lg">
                    « Excellente maîtrise de la récursivité et des graphes orientés. Attention cependant à la complexité temporelle sur l’exercice 4 (Dijkstra). »
                  </p>
</td>
<td className="py-4 px-5 text-right whitespace-nowrap">
<button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-secondary hover:bg-secondary-fixed font-label-md text-label-md font-semibold transition-colors" type="button">
<span className="material-symbols-outlined notranslate text-[16px]">file_download</span>
<span>Copie annotée</span>
</button>
</td>
</tr>
{/*  Row 3: Note 14-16 (Bleu / Bien)  */}
<tr className="hover:bg-surface-container-low/60 transition-colors">
<td className="py-4 px-5">
<div className="flex flex-col">
<span className="font-headline-sm text-headline-sm font-bold text-primary">TP Noté : Containerisation Docker &amp; CI/CD</span>
<span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
<span className="material-symbols-outlined notranslate text-[14px] text-on-surface-variant">terminal</span>
                      TP Machine en Ligne
                    </span>
</div>
</td>
<td className="py-4 px-4">
<div className="flex flex-col">
<span className="font-semibold text-on-surface">DevOps &amp; Déploiement Continu</span>
<span className="text-on-surface-variant font-label-sm text-label-sm">Ing. Alain Fokou</span>
</div>
</td>
<td className="py-4 px-4 whitespace-nowrap text-on-surface-variant">15 Oct 2024</td>
<td className="py-4 px-3 text-center">
<span className="px-2 py-0.5 rounded bg-surface-container font-bold text-primary">2.0</span>
</td>
<td className="py-4 px-5 text-center whitespace-nowrap">
<div className="inline-flex flex-col items-center">
<span className="px-3 py-1 rounded-lg bg-surface-container font-headline-sm text-headline-sm font-bold text-primary shadow-sm flex items-center gap-1.5">
<span className="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
                      16.0
                    </span>
<span className="font-label-sm text-label-sm text-secondary font-bold mt-1">Très Bien</span>
</div>
</td>
<td className="py-4 px-4 text-center whitespace-nowrap">
<div className="flex flex-col items-center">
<span className="font-label-md text-label-md text-on-surface font-semibold">Moy. 13.4</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">Médiane 14.0</span>
</div>
</td>
<td className="py-4 px-6 min-w-[280px]">
<p className="font-body-sm text-body-sm text-on-surface italic bg-surface-container-low/70 p-2.5 rounded-lg">
                    « Pipeline GitLab CI impeccable avec scans Trivy. Bon multi-stage build qui réduit drastiquement la taille de l’image alpine. »
                  </p>
</td>
<td className="py-4 px-5 text-right whitespace-nowrap">
<button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-secondary hover:bg-secondary-fixed font-label-md text-label-md font-semibold transition-colors" type="button">
<span className="material-symbols-outlined notranslate text-[16px]">terminal</span>
<span>Logs &amp; Rapport</span>
</button>
</td>
</tr>
{/*  Row 4: Note 10-13 (Jaune / Assez Bien)  */}
<tr className="hover:bg-surface-container-low/60 transition-colors">
<td className="py-4 px-5">
<div className="flex flex-col">
<span className="font-headline-sm text-headline-sm font-bold text-primary">Devoir Sur Table : Administration Système Linux &amp; Bash</span>
<span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
<span className="material-symbols-outlined notranslate text-[14px] text-tertiary-fixed-dim">draw</span>
                      Contrôle Continu
                    </span>
</div>
</td>
<td className="py-4 px-4">
<div className="flex flex-col">
<span className="font-semibold text-on-surface">Systèmes &amp; Réseaux Unix</span>
<span className="text-on-surface-variant font-label-sm text-label-sm">M. Paul Atangana</span>
</div>
</td>
<td className="py-4 px-4 whitespace-nowrap text-on-surface-variant">02 Oct 2024</td>
<td className="py-4 px-3 text-center">
<span className="px-2 py-0.5 rounded bg-surface-container font-bold text-primary">1.5</span>
</td>
<td className="py-4 px-5 text-center whitespace-nowrap">
<div className="inline-flex flex-col items-center">
<span className="px-3 py-1 rounded-lg bg-surface-container font-headline-sm text-headline-sm font-bold text-primary shadow-sm flex items-center gap-1.5">
<span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed-dim"></span>
                      13.0
                    </span>
<span className="font-label-sm text-label-sm text-on-tertiary-fixed-variant font-bold mt-1">Assez Bien</span>
</div>
</td>
<td className="py-4 px-4 text-center whitespace-nowrap">
<div className="flex flex-col items-center">
<span className="font-label-md text-label-md text-on-surface font-semibold">Moy. 11.2</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">Médiane 11.5</span>
</div>
</td>
<td className="py-4 px-6 min-w-[280px]">
<p className="font-body-sm text-body-sm text-on-surface italic bg-surface-container-low/70 p-2.5 rounded-lg">
                    « Scripting fonctionnel mais gestion des permissions sudo et regex sed/awk perfectibles. Revoir la documentation systemd. »
                  </p>
</td>
<td className="py-4 px-5 text-right whitespace-nowrap">
<button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-secondary hover:bg-secondary-fixed font-label-md text-label-md font-semibold transition-colors" type="button">
<span className="material-symbols-outlined notranslate text-[16px]">file_download</span>
<span>Copie PDF</span>
</button>
</td>
</tr>
{/*  Row 5: Note > 16 (Vert)  */}
<tr className="hover:bg-surface-container-low/60 transition-colors">
<td className="py-4 px-5">
<div className="flex flex-col">
<span className="font-headline-sm text-headline-sm font-bold text-primary">Projet Intégrateur : Application Web Vue.js &amp; Tailwind</span>
<span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
<span className="material-symbols-outlined notranslate text-[14px] text-tertiary-fixed-dim">code_blocks</span>
                      Livrable de Fin de Semestre 1
                    </span>
</div>
</td>
<td className="py-4 px-4">
<div className="flex flex-col">
<span className="font-semibold text-on-surface">Développement Frontend Moderne</span>
<span className="text-on-surface-variant font-label-sm text-label-sm">Mme Sylvie Mballa</span>
</div>
</td>
<td className="py-4 px-4 whitespace-nowrap text-on-surface-variant">20 Sept 2024</td>
<td className="py-4 px-3 text-center">
<span className="px-2 py-0.5 rounded bg-surface-container font-bold text-primary">3.0</span>
</td>
<td className="py-4 px-5 text-center whitespace-nowrap">
<div className="inline-flex flex-col items-center">
<span className="px-3 py-1 rounded-lg bg-surface-container font-headline-sm text-headline-sm font-bold text-primary shadow-sm flex items-center gap-1.5">
<span className="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
                      17.5
                    </span>
<span className="font-label-sm text-label-sm text-secondary font-bold mt-1">Excellent</span>
</div>
</td>
<td className="py-4 px-4 text-center whitespace-nowrap">
<div className="flex flex-col items-center">
<span className="font-label-md text-label-md text-on-surface font-semibold">Moy. 13.9</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">Médiane 14.2</span>
</div>
</td>
<td className="py-4 px-6 min-w-[280px]">
<p className="font-body-sm text-body-sm text-on-surface italic bg-surface-container-low/70 p-2.5 rounded-lg">
                    « UX d’une grande finesse esthétique. Store Pinia structuré et composants modulaires propres. Documentation Storybook appréciée. »
                  </p>
</td>
<td className="py-4 px-5 text-right whitespace-nowrap">
<button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-secondary hover:bg-secondary-fixed font-label-md text-label-md font-semibold transition-colors" type="button">
<span className="material-symbols-outlined notranslate text-[16px]">picture_as_pdf</span>
<span>Évaluation PDF</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
{/*  Table Footer / Legend  */}
<div className="p-4 bg-surface-container-low flex flex-col md:flex-row items-center justify-between gap-4 font-label-sm text-label-sm text-on-surface-variant">
<div className="flex flex-wrap items-center gap-4">
<span className="font-bold text-on-surface uppercase">Barème de conformité :</span>
<span className="inline-flex items-center gap-1.5">
<span className="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
              Note ≥ 16.0 (Très Bien / Excellent)
            </span>
<span className="inline-flex items-center gap-1.5">
<span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed-dim"></span>
              14.0 à 15.9 (Bien)
            </span>
<span className="inline-flex items-center gap-1.5">
<span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed-dim"></span>
              10.0 à 13.9 (Passable / Assez Bien)
            </span>
<span className="inline-flex items-center gap-1.5">
<span className="w-2.5 h-2.5 rounded-full bg-error"></span>
              &lt; 10.0 (Échec / Rattrapage requis)
            </span>
</div>
<div className="flex items-center gap-2">
<span>Affichage de 5 évaluations sur 12</span>
<button className="px-2 py-1 rounded bg-surface-container font-semibold text-primary hover:bg-surface-container-high transition-colors" type="button">
              Voir l'historique complet
            </button>
</div>
</div>
</div>
</div>
{/*  Section 5: Volet 'Simulateur de validation du diplôme MINEFOP'  */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
{/*  Interactive Simulator Calculator (7 Cols)  */}
<div className="lg:col-span-7 rounded-xl bg-surface-container-lowest p-6 lg:p-8 shadow-[0_4px_24px_rgba(11,37,69,0.06)] flex flex-col justify-between">
<div>
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="p-2 rounded-lg bg-secondary-fixed text-on-secondary-fixed-variant">
<span className="material-symbols-outlined notranslate text-[22px]">calculate</span>
</span>
<div>
<h3 className="font-headline-md text-headline-md text-primary font-bold">
                  Simulateur Prédictif • Diplôme Qualifiant MINEFOP
                </h3>
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Algorithme d'attribution des mentions</span>
</div>
</div>
<span className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm font-bold">
              Minefop DQP v4
            </span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant mt-4">
            Ajustez le curseur prévisionnel pour votre grand oral de soutenance finale (Projet Capstone Coeff 6.0) et calculez instantanément votre mention finale certifiée.
          </p>
{/*  Interactive Range Slider  */}
<div className="mt-6 p-5 rounded-xl bg-surface-container-low space-y-4">
<div className="flex items-center justify-between">
<label className="font-label-md text-label-md font-bold text-on-surface" htmlFor="simulation-slider">
                Note simulée au Grand Projet Capstone :
              </label>
<div className="flex items-baseline gap-1 bg-surface-container-lowest px-3 py-1 rounded-lg shadow-sm">
<span className="font-headline-md text-headline-md font-bold text-secondary" id="slider-val">16.5</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">/ 20</span>
</div>
</div>
<input className="w-full accent-secondary cursor-pointer h-2 bg-surface-variant rounded-lg" id="simulation-slider" max="20" min="10" onChange={() => {document.getElementById('slider-val').innerText = this.value; updatePrediction(this.value);}} step="0.5" type="range" value="16.5" />
<div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
<span>Seuil de validation : 10.0</span>
<span>Cible 'Bien' : 14.0</span>
<span>Cible 'Très Bien' : 16.0</span>
<span className="text-tertiary font-bold">Cible 'Excellence' : 18.0</span>
</div>
</div>
{/*  Dynamic Output Card  */}
<div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
<div className="p-3.5 rounded-lg bg-surface-container flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant">Moyenne Finale Projetée</span>
<span className="font-headline-lg text-headline-lg font-extrabold text-primary mt-1" id="pred-moyenne">16.3 / 20</span>
<span className="font-label-sm text-label-sm text-secondary font-semibold mt-0.5">+0.1 pt de marge</span>
</div>
<div className="p-3.5 rounded-lg bg-surface-container flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant">Mention Probable</span>
<span className="font-headline-lg text-headline-lg font-extrabold text-secondary mt-1" id="pred-mention">Très Bien</span>
<span className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">Certificat sécurisé</span>
</div>
<div className="p-3.5 rounded-lg bg-surface-container flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant">Statut Délibération</span>
<span className="font-headline-lg text-headline-lg font-extrabold text-primary mt-1">Admis d'Office</span>
<span className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">Sans oral de rattrapage</span>
</div>
</div>
</div>
<div className="pt-6 mt-6 flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
<span className="flex items-center gap-1">
<span className="material-symbols-outlined notranslate text-[16px] text-on-surface-variant">info</span>
            Barème de pondération officiel : CC (40%), Partiels (30%), Projet Capstone (30%).
          </span>
<button className="text-secondary font-bold hover:underline" type="button">
            Règlement des examens
          </button>
</div>
</div>
{/*  PV du Conseil de Classe & Signature MINEFOP (5 Cols)  */}
<div className="lg:col-span-5 rounded-xl bg-surface-container-lowest p-6 lg:p-8 shadow-[0_4px_24px_rgba(11,37,69,0.06)] flex flex-col justify-between">
<div>
<div className="flex items-center justify-between">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container text-on-surface font-label-sm text-label-sm font-bold uppercase">
<span className="material-symbols-outlined notranslate text-[16px] text-secondary">verified</span>
              Document Officiel Scellé
            </span>
<span className="font-mono text-[11px] text-on-surface-variant">REF: AZ-PV-2024-S1-042</span>
</div>
<h3 className="font-headline-md text-headline-md text-primary font-bold mt-3">
            Procès-Verbal de Délibération du Semestre 1
          </h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Validé par le jury académique mixte MINEFOP &amp; AZ Corporation SARL le 18 Octobre 2024.
          </p>
{/*  Visual Certificate Teaser Box  */}
<div className="mt-4 p-4 rounded-xl bg-surface-container-low space-y-3">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined notranslate text-secondary text-[24px]">description</span>
<div className="flex flex-col">
<span className="font-label-md text-label-md font-bold text-on-surface">PV_Deliberation_S1_JeanMarc.pdf</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Signature électronique eIDAS • 1.4 Mo</span>
</div>
</div>
<span className="material-symbols-outlined notranslate text-secondary text-[20px]">lock</span>
</div>
{/*  Signature block simulation  */}
<div className="p-3 rounded-lg bg-surface-container-lowest flex items-center justify-between">
<div className="flex items-center gap-2.5">
<div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-[11px]">
                  MK
                </div>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm font-bold text-on-surface">Dr. Madeleine Kamga</span>
<span className="text-[10px] text-on-surface-variant">Directrice des Études • Clé RSA 4096 bits</span>
</div>
</div>
<span className="inline-flex items-center gap-1 font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container font-semibold text-primary">
<span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>
                Horodaté
              </span>
</div>
</div>
</div>
<div className="pt-6 space-y-2">
<button className="w-full py-3 px-4 rounded-lg bg-primary-container text-on-primary hover:bg-primary font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-sm transition-all" type="button">
<span className="material-symbols-outlined notranslate text-[20px] text-tertiary-fixed-dim">download_for_offline</span>
<span>Télécharger le PV officiel signé (PDF)</span>
</button>
<div className="text-center">
<span className="text-[11px] text-on-surface-variant">Document infalsifiable certifié par cachet serveur d'AZ Corporation SARL</span>
</div>
</div>
</div>
</div>
</div>
</div>

    </div>
  );
};

export default ApprenantEvaluations;
