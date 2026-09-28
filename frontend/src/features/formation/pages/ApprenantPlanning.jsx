import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { academyService } from '../../../services/api';

export const ApprenantPlanning = () => {
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
  const studentName = "Cher apprenant"; // Note: User identity is not passed in the payload currently, assuming generic or fetched from auth Context. Wait, I can pass it if we add it, but for now generic.

  return (
    <div className="flex-1 pb-10">
      <div className="flex flex-col w-full pb-space-xl">
{/*  Dynamic Top Banner / Greeting Card  */}
<div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary-container to-secondary-container p-space-lg text-on-primary shadow-lg">
<div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-secondary/30 blur-3xl pointer-events-none"></div>
<div className="absolute right-1/4 -bottom-20 w-64 h-64 rounded-full bg-tertiary-fixed-dim/20 blur-2xl pointer-events-none"></div>
<div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-lg">
<div className="flex flex-col gap-space-xs max-w-3xl">
<div className="flex flex-wrap items-center gap-space-xs">
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface/10 backdrop-blur-md text-tertiary-fixed-dim font-label-sm text-label-sm uppercase tracking-wider font-bold">
<span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
            Apprenant actif
          </span>
<span className="text-on-primary-container font-label-md text-label-md">• {program.programName || "Certificat d'aptitude professionnelle"}</span>
</div>
<h1 className="font-headline-xl text-headline-xl text-on-primary tracking-tight font-extrabold mt-1">
          Mon Planning Hebdomadaire
        </h1>
<p className="font-body-lg text-body-lg text-primary-fixed-dim font-medium">
          {program.promotionName || "Promotion Développeur d'Applications & IA"}
        </p>
</div>
{/*  Quick Action Cluster  */}
<div className="grid grid-cols-2 sm:flex sm:flex-wrap lg:flex-nowrap gap-space-xs shrink-0">
<button onClick={() => alert("Rejoindre la classe virtuelle...")} className="group flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-tertiary-fixed-dim text-primary font-label-lg text-label-lg font-bold shadow-md hover:brightness-105 active:scale-95 transition-all" type="button">
<span className="material-symbols-outlined notranslate text-[20px] transition-transform group-hover:scale-110">videocam</span>
<span className="">Classe Virtuelle</span>
</button>
<button onClick={() => {
  const input = document.createElement('input');
  input.type = 'file';
  input.onchange = () => alert("TP téléversé avec succès.");
  input.click();
}} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface/15 hover:bg-surface/25 backdrop-blur-md text-on-primary font-label-lg text-label-lg transition-all active:scale-95" type="button">
<span className="material-symbols-outlined notranslate text-[20px]">upload_file</span>
<span className="">Déposer un TP</span>
</button>
<button 
  disabled={!program.bordereauxPublished}
  onClick={() => alert("Téléchargement du bordereau...")}
  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur-md font-label-lg text-label-lg transition-all ${
    program.bordereauxPublished 
      ? 'bg-surface/15 hover:bg-surface/25 text-on-primary active:scale-95' 
      : 'bg-surface/5 text-on-primary/50 cursor-not-allowed border border-on-primary/10'
  }`} type="button">
<span className="material-symbols-outlined notranslate text-[20px]">receipt_long</span>
<span className="">Bordereau</span>
</button>
<button onClick={() => alert("Téléchargement du relevé de notes...")} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface/15 hover:bg-surface/25 backdrop-blur-md text-on-primary font-label-lg text-label-lg transition-all active:scale-95" type="button">
<span className="material-symbols-outlined notranslate text-[20px]">history_edu</span>
<span className="">Relevé</span>
</button>
</div>
</div>
</div>
{/*  =========================================================================  */}
{/*  COMPOSANT PRINCIPAL PLANNING INSPIRÉ DE L'IMAGE DE RÉFÉRENCE (IMAGE_2)    */}
{/*  =========================================================================  */}
<div className="mt-space-lg flex flex-col gap-space-lg">
{/*  1. En-tête des 4 cartes d'indicateurs (KPIs horizontaux fidèles à l'image)  */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
{/*  Card 1: Your rating  */}
<div className="relative overflow-hidden rounded-2xl bg-[#E8EBFC] p-4 flex flex-col justify-between shadow-sm border border-[#D5DCFA]/60 min-h-[110px]">
<div className="flex items-center justify-between">
<span className="text-[13px] font-semibold text-[#5B638A] tracking-tight">Your rating / Votre rang</span>
</div>
<div className="flex items-end justify-between mt-2">
<div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/70 shadow-sm text-[#FFB800]">
<span className="material-symbols-outlined notranslate text-[32px] drop-shadow-sm" style={{"fontVariationSettings":"'FILL' 1"}}>emoji_events</span>
</div>
<div className="flex items-baseline">
<span className="text-3xl font-extrabold text-[#343D68] tracking-tight">7</span>
<span className="text-lg font-semibold text-[#6E78A8]">/35</span>
</div>
</div>
</div>
{/*  Card 2: Your performance  */}
<div className="relative overflow-hidden rounded-2xl bg-[#E1F7E8] p-4 flex flex-col justify-between shadow-sm border border-[#C5F0D2]/60 min-h-[110px]">
<div className="flex items-center justify-between">
<span className="text-[13px] font-semibold text-[#3D7D54] tracking-tight">Your perfomance / Performance</span>
</div>
<div className="flex items-end justify-between mt-2">
<div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/70 shadow-sm text-[#27AE60]">
<span className="material-symbols-outlined notranslate text-[32px] drop-shadow-sm" style={{"fontVariationSettings":"'FILL' 1"}}>military_tech</span>
</div>
<div className="flex items-baseline">
<span className="text-3xl font-extrabold text-[#1F5C34] tracking-tight">11</span>
<span className="text-lg font-semibold text-[#4F9E6C]">/12</span>
</div>
</div>
</div>
{/*  Card 3: Your projects  */}
<div className="relative overflow-hidden rounded-2xl bg-[#E2F5FC] p-4 flex flex-col justify-between shadow-sm border border-[#C6ECFA]/60 min-h-[110px]">
<div className="flex items-center justify-between">
<span className="text-[13px] font-semibold text-[#30708C] tracking-tight">Your projects / Projets validés</span>
</div>
<div className="flex items-end justify-between mt-2">
<div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/70 shadow-sm text-[#007EA7]">
<span className="material-symbols-outlined notranslate text-[32px] drop-shadow-sm" style={{"fontVariationSettings":"'FILL' 1"}}>smart_toy</span>
</div>
<div className="flex items-baseline">
<span className="text-3xl font-extrabold text-[#134D69] tracking-tight">3</span>
<span className="text-lg font-semibold text-[#488B9E]">/6</span>
</div>
</div>
</div>
{/*  Card 4: Your attendance  */}
<div className="relative overflow-hidden rounded-2xl bg-[#FDEFE3] p-4 flex flex-col justify-between shadow-sm border border-[#F9DEC8]/60 min-h-[110px]">
<div className="flex items-center justify-between">
<span className="text-[13px] font-semibold text-[#8C5D3B] tracking-tight">Your attendance / Assiduité</span>
</div>
<div className="flex items-center justify-between mt-2">
<div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/70 shadow-sm text-[#E07A5F]">
<span className="material-symbols-outlined notranslate text-[32px] drop-shadow-sm" style={{"fontVariationSettings":"'FILL' 1"}}>timer</span>
</div>
<div className="flex flex-col gap-1 text-right">
<div className="inline-flex items-center gap-1.5 justify-end">
<span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
<span className="text-[11px] font-bold text-[#10B981]">94.6%</span>
<span className="text-[10px] text-[#7A6A60]">attended</span>
</div>
<div className="inline-flex items-center gap-1.5 justify-end">
<span className="w-2 h-2 rounded-full bg-[#F43F5E]"></span>
<span className="text-[11px] font-bold text-[#F43F5E]">5.4%</span>
<span className="text-[10px] text-[#7A6A60]">not attended</span>
</div>
</div>
</div>
</div>
</div>
{/*  2. Disposition principale en 2 colonnes (68% / 32% fidèle à IMAGE_2)  */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
{/*  COLONNE GAUCHE (Schedule + Homework & Events)  */}
<div className="lg:col-span-8 flex flex-col gap-6">
{/*  Emploi du temps (Schedule Card)  */}
<div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-surface-variant/40 flex flex-col">
{/*  Schedule Top Bar  */}
<div className="flex items-center justify-between pb-3">
<div className="flex items-center gap-2">
<h2 className="text-xl font-bold text-primary tracking-tight">Schedule</h2>
<span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">Semaine en cours</span>
</div>
<div className="relative">
<button className="px-3.5 py-1.5 rounded-xl border border-outline-variant/60 text-xs font-semibold text-on-surface-variant hover:text-primary hover:border-secondary flex items-center gap-1.5 bg-surface-container-low transition-colors" type="button">
              Weekly
              <span className="material-symbols-outlined notranslate text-[16px]">expand_more</span>
</button>
</div>
</div>
{/*  Timetable Container  */}
<div className="overflow-x-auto">
<div className="min-w-[650px]">
{/*  Day Columns Header  */}
<div className="grid grid-cols-8 items-center bg-[#D8EEFB]/80 rounded-xl py-2 px-2 text-center text-xs font-semibold text-primary mb-2">
<div className="flex items-center justify-center">
<span className="text-base">⏰</span>
</div>
<div className="text-[#2B4C6F]">Mon 6</div>
<div className="text-[#2B4C6F]">Tue 7</div>
<div className="text-[#2B4C6F]">Wed 8</div>
<div className="text-[#2B4C6F]">Thu 9</div>
<div className="text-[#2B4C6F]">Fri 10</div>
<div className="text-[#005F94] font-bold">Sat 11</div>
<div className="text-[#005F94] font-bold">Sun 12</div>
</div>
{/*  Timetable Grid Body  */}
<div className="grid grid-cols-8 relative border-t border-dashed border-outline-variant/30 text-xs">
{/*  Column 1: Time Labels  */}
<div className="flex flex-col justify-between py-2 pr-2 text-right font-medium text-outline select-none gap-6">
<div className="h-8 flex items-center justify-end">8:00</div>
<div className="h-8 flex items-center justify-end">10:00</div>
<div className="h-8 flex items-center justify-end">12:00</div>
<div className="h-8 flex items-center justify-end">14:00</div>
<div className="h-8 flex items-center justify-end">16:00</div>
<div className="h-8 flex items-center justify-end">18:00</div>
</div>
{/*  Columns 2 to 8: Days grid with vertical dashed separators  */}
{/*  Mon 6  */}
<div className="border-l border-dashed border-outline-variant/30 flex flex-col justify-between p-1 relative gap-6">
<div className="h-8"></div>
<div className="h-8"></div>
<div className="h-8"></div>
<div className="h-8"></div>
<div className="h-8 flex items-center">
<div className="w-full bg-[#E5D7FA] text-[#55308D] hover:shadow-sm px-2 py-1.5 rounded-xl font-bold text-[11px] truncate cursor-pointer transition-all border border-[#D5BFF5]" title="3D-Modeling (16:00 - 17:30)">
                    3D-Modeling
                  </div>
</div>
<div className="h-8"></div>
</div>
{/*  Tue 7  */}
<div className="border-l border-dashed border-outline-variant/30 flex flex-col justify-between p-1 relative gap-6">
<div className="h-8"></div>
<div className="h-8"></div>
<div className="h-8"></div>
<div className="h-8"></div>
<div className="h-8"></div>
<div className="h-8 flex items-center">
<div className="w-full bg-[#D5E0FA] text-[#1E3A8A] hover:shadow-sm px-2 py-1.5 rounded-xl font-bold text-[11px] truncate cursor-pointer transition-all border border-[#BFD0F7]" title="Physics (18:00 - 19:30)">
                    Physics
                  </div>
</div>
</div>
{/*  Wed 8  */}
<div className="border-l border-dashed border-outline-variant/30 flex flex-col justify-between p-1 relative gap-6">
<div className="h-8"></div>
<div className="h-8"></div>
<div className="h-8"></div>
<div className="h-8 flex items-center">
<div className="w-full bg-[#D4F5DE] text-[#1E6B39] hover:shadow-sm px-2 py-1.5 rounded-xl font-bold text-[11px] truncate cursor-pointer transition-all border border-[#BAECC8]" title="Maths (14:00 - 15:30)">
                    Maths
                  </div>
</div>
<div className="h-8 flex items-center">
<div className="w-full bg-[#D5E0FA] text-[#1E3A8A] hover:shadow-sm px-2 py-1.5 rounded-xl font-bold text-[11px] truncate cursor-pointer transition-all border border-[#BFD0F7]" title="Programming (16:00 - 17:30)">
                    Programming
                  </div>
</div>
<div className="h-8"></div>
</div>
{/*  Thu 9  */}
<div className="border-l border-dashed border-outline-variant/30 flex flex-col justify-between p-1 relative gap-6">
<div className="h-8"></div>
<div className="h-8"></div>
<div className="h-8"></div>
<div className="h-8"></div>
<div className="h-8 flex items-center">
<div className="w-full bg-[#FCE8D5] text-[#8C4610] hover:shadow-sm px-2 py-1.5 rounded-xl font-bold text-[11px] truncate cursor-pointer transition-all border border-[#F8D5B8]" title="Electronics (16:00 - 17:30)">
                    Electronics
                  </div>
</div>
<div className="h-8 flex items-center">
<div className="w-full bg-[#CFEFFB] text-[#0A577A] hover:shadow-sm px-2 py-1.5 rounded-xl font-bold text-[11px] truncate cursor-pointer transition-all border border-[#B1E4F8]" title="Projects (18:00 - 19:30)">
                    Projects
                  </div>
</div>
</div>
{/*  Fri 10  */}
<div className="border-l border-dashed border-outline-variant/30 flex flex-col justify-between p-1 relative gap-6">
<div className="h-8"></div>
<div className="h-8"></div>
<div className="h-8"></div>
<div className="h-8"></div>
<div className="h-8"></div>
<div className="h-8 flex items-center">
<div className="w-full bg-[#E5D7FA] text-[#55308D] hover:shadow-sm px-2 py-1.5 rounded-xl font-bold text-[11px] truncate cursor-pointer transition-all border border-[#D5BFF5]" title="3D-Modeling (18:00 - 19:30)">
                    3D-Modeling
                  </div>
</div>
</div>
{/*  Sat 11  */}
<div className="border-l border-dashed border-outline-variant/30 flex flex-col justify-between p-1 relative gap-6">
<div className="h-8"></div>
<div className="h-8"></div>
<div className="h-8 flex items-center">
<div className="w-full bg-[#FCE8D5] text-[#8C4610] hover:shadow-sm px-2 py-1.5 rounded-xl font-bold text-[11px] truncate cursor-pointer transition-all border border-[#F8D5B8]" title="Electronics (12:00 - 13:30)">
                    Electronics
                  </div>
</div>
<div className="h-8 flex items-center">
<div className="w-full bg-[#D4F5DE] text-[#1E6B39] hover:shadow-sm px-2 py-1.5 rounded-xl font-bold text-[11px] truncate cursor-pointer transition-all border border-[#BAECC8]" title="Maths (14:00 - 15:30)">
                    Maths
                  </div>
</div>
<div className="h-8"></div>
<div className="h-8"></div>
</div>
{/*  Sun 12  */}
<div className="border-l border-dashed border-outline-variant/30 flex flex-col justify-between p-1 relative gap-6">
<div className="h-8 flex items-center">
<div className="w-full bg-[#E5D7FA] text-[#55308D] hover:shadow-sm px-2 py-1.5 rounded-xl font-bold text-[11px] truncate cursor-pointer transition-all border border-[#D5BFF5]" title="Physics (8:00 - 9:30)">
                    Physics
                  </div>
</div>
<div className="h-8 flex items-center">
<div className="w-full bg-[#CFEFFB] text-[#0A577A] hover:shadow-sm px-2 py-1.5 rounded-xl font-bold text-[11px] truncate cursor-pointer transition-all border border-[#B1E4F8]" title="Projects (10:00 - 11:30)">
                    Projects
                  </div>
</div>
<div className="h-8"></div>
<div className="h-8"></div>
<div className="h-8"></div>
<div className="h-8"></div>
</div>
</div>
</div>
</div>
</div>
{/*  Section inférieure : Homework & Upcoming Events côte à côte  */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
{/*  Bloc Homework (Devoirs)  */}
<div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-surface-variant/40 flex flex-col justify-between">
<div className="flex items-center justify-between pb-3">
<h3 className="text-base font-bold text-[#144265]">Homework</h3>
<a className="text-xs font-semibold text-[#007EA7] hover:underline flex items-center gap-1" href="#">
              View all <span className="material-symbols-outlined notranslate text-[14px]">arrow_forward</span>
</a>
</div>
<div className="flex flex-col gap-3">
{/*  Homework 16  */}
<div className="flex items-center justify-between py-1.5">
<div className="flex flex-col">
<span className="text-[13px] font-bold text-[#1565C0] leading-snug">Homework 16</span>
<span className="text-[11px] text-outline">Deadline: 12.08.2025</span>
</div>
<button className="px-5 py-1.5 rounded-full bg-[#0084C9] hover:bg-[#006EA8] text-white text-xs font-bold shadow-sm transition-all active:scale-95" type="button">
                Submit
              </button>
</div>
{/*  Homework 17  */}
<div className="flex items-center justify-between py-1.5">
<div className="flex flex-col">
<span className="text-[13px] font-bold text-[#1565C0] leading-snug">Homework 17</span>
<span className="text-[11px] text-outline">Deadline: 17.08.2025</span>
</div>
<button className="px-5 py-1.5 rounded-full bg-[#0084C9] hover:bg-[#006EA8] text-white text-xs font-bold shadow-sm transition-all active:scale-95" type="button">
                Submit
              </button>
</div>
{/*  Homework 18  */}
<div className="flex items-center justify-between py-1.5">
<div className="flex flex-col">
<span className="text-[13px] font-bold text-[#1565C0] leading-snug">Homework 18</span>
<span className="text-[11px] text-outline">Deadline: 21.08.2025</span>
</div>
<button className="px-5 py-1.5 rounded-full bg-[#0084C9] hover:bg-[#006EA8] text-white text-xs font-bold shadow-sm transition-all active:scale-95" type="button">
                Submit
              </button>
</div>
{/*  Homework 19  */}
<div className="flex items-center justify-between py-1.5">
<div className="flex flex-col">
<span className="text-[13px] font-bold text-[#1565C0] leading-snug">Homework 19</span>
<span className="text-[11px] text-outline">Deadline: 25.08.2025</span>
</div>
<button className="px-5 py-1.5 rounded-full bg-[#0084C9] hover:bg-[#006EA8] text-white text-xs font-bold shadow-sm transition-all active:scale-95" type="button">
                Submit
              </button>
</div>
</div>
</div>
{/*  Bloc Upcoming Events (Événements à venir avec Toggle Switch)  */}
<div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-surface-variant/40 flex flex-col justify-between">
<div className="flex items-center justify-between pb-3">
<h3 className="text-base font-bold text-[#144265]">Upcoming events</h3>
<a className="text-xs font-semibold text-[#007EA7] hover:underline flex items-center gap-1" href="#">
              View all <span className="material-symbols-outlined notranslate text-[14px]">arrow_forward</span>
</a>
</div>
<div className="flex flex-col gap-3">
{/*  Event 1: Robot-dance  */}
<div className="flex items-center justify-between py-1">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-xl bg-[#D6E6F9] overflow-hidden flex items-center justify-center shrink-0">
<span className="text-xl">🤖</span>
</div>
<div className="flex flex-col">
<span className="text-[13px] font-bold text-[#0D47A1] leading-tight">Robot-dance</span>
<span className="text-[10px] text-outline">Workshop</span>
<span className="text-[10px] text-on-surface-variant font-medium">12.08.2025 Start at 15:00</span>
</div>
</div>
<div className="flex items-center gap-1.5">
<span className="text-[10px] font-semibold text-outline">On it</span>
<div className="w-10 h-5 bg-[#34D399] rounded-full p-0.5 flex items-center justify-end cursor-pointer shadow-inner">
<div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
</div>
</div>
</div>
{/*  Event 2: IT fair  */}
<div className="flex items-center justify-between py-1">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-xl bg-surface-container overflow-hidden flex items-center justify-center shrink-0 p-1">
<div className="grid grid-cols-2 gap-0.5 w-6 h-6">
<span className="bg-[#F25022] rounded-sm"></span>
<span className="bg-[#7FBA00] rounded-sm"></span>
<span className="bg-[#00A4EF] rounded-sm"></span>
<span className="bg-[#FFB900] rounded-sm"></span>
</div>
</div>
<div className="flex flex-col">
<span className="text-[13px] font-bold text-[#0D47A1] leading-tight">IT fair</span>
<span className="text-[10px] text-outline">Workshop</span>
<span className="text-[10px] text-on-surface-variant font-medium">13.08.2025 Start at 14:00</span>
</div>
</div>
<div className="flex items-center gap-1.5">
<span className="text-[10px] font-semibold text-outline">On it</span>
<div className="w-10 h-5 bg-outline-variant/60 rounded-full p-0.5 flex items-center justify-start cursor-pointer shadow-inner">
<div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
</div>
</div>
</div>
{/*  Event 3: Future of robotics  */}
<div className="flex items-center justify-between py-1">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#312E81] via-[#8B5CF6] to-[#EC4899] overflow-hidden flex items-center justify-center text-white shrink-0">
<span className="material-symbols-outlined notranslate text-[18px]">neurology</span>
</div>
<div className="flex flex-col">
<span className="text-[13px] font-bold text-[#0D47A1] leading-tight">Future of robotics</span>
<span className="text-[10px] text-outline">Webinar</span>
<span className="text-[10px] text-on-surface-variant font-medium">16.08.2025 Start at 11:00</span>
</div>
</div>
<div className="flex items-center gap-1.5">
<span className="text-[10px] font-semibold text-outline">On it</span>
<div className="w-10 h-5 bg-[#34D399] rounded-full p-0.5 flex items-center justify-end cursor-pointer shadow-inner">
<div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
{/*  COLONNE DROITE (Mini Calendar + Attendance Legend + Teachers List)  */}
<div className="lg:col-span-4 flex flex-col gap-6">
{/*  Mini Calendrier + Statuts assiduité  */}
<div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-surface-variant/40 flex flex-col">
{/*  Header Calendar  */}
<div className="flex items-center justify-between pb-3">
<div className="flex items-center gap-1 cursor-pointer">
<h3 className="text-base font-bold text-primary">August 2025</h3>
<span className="material-symbols-outlined notranslate text-[18px] text-outline">chevron_right</span>
</div>
<div className="flex items-center gap-2">
<button className="w-7 h-7 rounded-lg hover:bg-surface-container flex items-center justify-center text-outline hover:text-primary transition-colors" type="button">
<span className="material-symbols-outlined notranslate text-[18px]">chevron_left</span>
</button>
<button className="w-7 h-7 rounded-lg hover:bg-surface-container flex items-center justify-center text-outline hover:text-primary transition-colors" type="button">
<span className="material-symbols-outlined notranslate text-[18px]">chevron_right</span>
</button>
</div>
</div>
{/*  Days of Week Row  */}
<div className="grid grid-cols-7 text-center text-[10px] font-bold text-outline uppercase tracking-wider mb-2">
<div className="">Sun</div>
<div className="">Mon</div>
<div className="">Tue</div>
<div className="">Wed</div>
<div className="">Thu</div>
<div className="">Fri</div>
<div className="">Sat</div>
</div>
{/*  Days Grid  */}
<div className="grid grid-cols-7 gap-y-1 text-center text-xs font-semibold text-on-surface">
{/*  Row 1: empty sun, mon, tue, then 1, 2, 3, 4  */}
<div></div>
<div></div>
<div></div>
<div className="flex items-center justify-center py-1">
<span className="w-7 h-7 rounded-full bg-[#82E1F8] text-[#004A63] flex items-center justify-center font-bold">1</span>
</div>
<div className="flex items-center justify-center py-1">
<span className="w-7 h-7 rounded-full bg-[#82E1F8] text-[#004A63] flex items-center justify-center font-bold">2</span>
</div>
<div className="flex items-center justify-center py-1">
<span className="w-7 h-7 rounded-full bg-[#F472B6] text-white flex items-center justify-center font-bold">3</span>
</div>
<div className="flex items-center justify-center py-1"><span className="w-7 h-7 flex items-center justify-center">4</span></div>
{/*  Row 2: 5, 6, 7, 8, 9, 10, 11  */}
<div className="flex items-center justify-center py-1">
<span className="w-7 h-7 rounded-full bg-[#82E1F8] text-[#004A63] flex items-center justify-center font-bold">5</span>
</div>
<div className="flex items-center justify-center py-1">
<span className="w-7 h-7 rounded-full bg-[#DDD6FE] text-[#5B21B6] flex items-center justify-center font-bold">6</span>
</div>
<div className="flex items-center justify-center py-1"><span className="w-7 h-7 flex items-center justify-center">7</span></div>
<div className="flex items-center justify-center py-1"><span className="w-7 h-7 flex items-center justify-center">8</span></div>
<div className="flex items-center justify-center py-1"><span className="w-7 h-7 flex items-center justify-center">9</span></div>
<div className="flex items-center justify-center py-1"><span className="w-7 h-7 flex items-center justify-center">10</span></div>
<div className="flex items-center justify-center py-1"><span className="w-7 h-7 flex items-center justify-center">11</span></div>
{/*  Row 3: 12 to 18  */}
<div className="flex items-center justify-center py-1"><span className="w-7 h-7 flex items-center justify-center">12</span></div>
<div className="flex items-center justify-center py-1"><span className="w-7 h-7 flex items-center justify-center">13</span></div>
<div className="flex items-center justify-center py-1"><span className="w-7 h-7 flex items-center justify-center">14</span></div>
<div className="flex items-center justify-center py-1"><span className="w-7 h-7 flex items-center justify-center">15</span></div>
<div className="flex items-center justify-center py-1"><span className="w-7 h-7 flex items-center justify-center">16</span></div>
<div className="flex items-center justify-center py-1"><span className="w-7 h-7 flex items-center justify-center">17</span></div>
<div className="flex items-center justify-center py-1"><span className="w-7 h-7 flex items-center justify-center">18</span></div>
{/*  Row 4: 19 to 25  */}
<div className="flex items-center justify-center py-1"><span className="w-7 h-7 flex items-center justify-center">19</span></div>
<div className="flex items-center justify-center py-1"><span className="w-7 h-7 flex items-center justify-center">20</span></div>
<div className="flex items-center justify-center py-1"><span className="w-7 h-7 flex items-center justify-center">21</span></div>
<div className="flex items-center justify-center py-1"><span className="w-7 h-7 flex items-center justify-center">22</span></div>
<div className="flex items-center justify-center py-1"><span className="w-7 h-7 flex items-center justify-center">23</span></div>
<div className="flex items-center justify-center py-1"><span className="w-7 h-7 flex items-center justify-center">24</span></div>
<div className="flex items-center justify-center py-1"><span className="w-7 h-7 flex items-center justify-center">25</span></div>
{/*  Row 5: 26 to 31  */}
<div className="flex items-center justify-center py-1"><span className="w-7 h-7 flex items-center justify-center">26</span></div>
<div className="flex items-center justify-center py-1"><span className="w-7 h-7 flex items-center justify-center">27</span></div>
<div className="flex items-center justify-center py-1"><span className="w-7 h-7 flex items-center justify-center">28</span></div>
<div className="flex items-center justify-center py-1"><span className="w-7 h-7 flex items-center justify-center">29</span></div>
<div className="flex items-center justify-center py-1"><span className="w-7 h-7 flex items-center justify-center">30</span></div>
<div className="flex items-center justify-center py-1"><span className="w-7 h-7 flex items-center justify-center">31</span></div>
<div></div>
</div>
{/*  Heure locale badge (Time: 9:41 AM)  */}
<div className="flex items-center justify-between mt-4 pt-3 border-t border-surface-container">
<span className="text-sm font-bold text-primary">Time</span>
<span className="px-3 py-1 rounded-xl bg-surface-container font-mono text-xs font-bold text-primary shadow-inner">09:41 AM</span>
</div>
{/*  Légende des couleurs fidèles à l'image  */}
<div className="flex flex-col gap-2 mt-4 pt-3 border-t border-surface-container text-xs">
<div className="flex items-center gap-2.5">
<span className="w-4 h-4 rounded-full bg-[#DDD6FE]"></span>
<span className="font-medium text-on-surface-variant">Current day</span>
</div>
<div className="flex items-center gap-2.5">
<span className="w-4 h-4 rounded-full bg-[#82E1F8]"></span>
<span className="font-medium text-on-surface-variant">Attended</span>
</div>
<div className="flex items-center gap-2.5">
<span className="w-4 h-4 rounded-full bg-[#F472B6]"></span>
<span className="font-medium text-on-surface-variant">Missed day</span>
</div>
</div>
</div>
{/*  Bloc Your teachers / Vos formateurs  */}
<div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-surface-variant/40 flex flex-col justify-between">
<div className="flex items-center justify-between pb-3">
<h3 className="text-base font-bold text-[#144265]">Your teachers</h3>
<a className="text-xs font-semibold text-[#007EA7] hover:underline flex items-center gap-1" href="#">
            View all <span className="material-symbols-outlined notranslate text-[14px]">arrow_forward</span>
</a>
</div>
<div className="flex flex-col gap-3.5">
{/*  Teacher 1: Esther Howard  */}
<div className="flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="relative">
<img alt="Esther Howard" className="w-9 h-9 rounded-full object-cover border border-outline-variant/40" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3zTSwJDj9JXMe3BIUrxnk0Yz1GrKlFHiBBnQFjeHHWKQdF-DAXhgAzlC5i84G81hY3wxiEcY9rZPu7c4Q3DjsJwRJqfAxyeNBAYRwyWw5e3ZUhOMQV2-0AFKEVnIIhUdftfMEshy6EKSP8zmqD3XZEDgcu5nTlLg-MNwDbGEKuGIkpj33ULRkDLYPCEE7nToJ5jvyJQIbaxQtsqrH87OCeIgpAD4M377tWvFs5Jbl3uuoylLsOMo4" />
<span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10B981] ring-2 ring-white"></span>
</div>
<div className="flex flex-col">
<span className="text-[13px] font-bold text-primary leading-tight">Esther Howard</span>
<span className="text-[11px] text-outline">Physics</span>
</div>
</div>
<button className="w-8 h-8 rounded-lg bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0284C7] flex items-center justify-center transition-colors shadow-sm" title="Envoyer un message" type="button">
<span className="material-symbols-outlined notranslate text-[18px]">chat_bubble</span>
</button>
</div>
{/*  Teacher 2: Jenny Wilson  */}
<div className="flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="relative">
<img alt="Jenny Wilson" className="w-9 h-9 rounded-full object-cover border border-outline-variant/40" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBw2kFNPcBjJtjRN4Okj9t6NNMa_Rx5wGoYODH3rYyTDtEt09ttUFATYvF-CwplW_RRhXLuRVYsgJfLsXME2tJMlwrWjIc4ESbAniVwbtWjmsGTe8tosD1ySok-hoZTXed3q-8igebQdwGPGHlZ38NoahV-jHN9JzqGfT_kPEy6utUIcFKkzdKj-2oKrZjzv0NLrNIl1Fx4tp6qXof9GaegIxpYFgQgklm8JLCRiVCdXfC4y3vuzAD6" />
<span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10B981] ring-2 ring-white"></span>
</div>
<div className="flex flex-col">
<span className="text-[13px] font-bold text-primary leading-tight">Jenny Wilson</span>
<span className="text-[11px] text-outline">3D-Modeling</span>
</div>
</div>
<button className="w-8 h-8 rounded-lg bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0284C7] flex items-center justify-center transition-colors shadow-sm" title="Envoyer un message" type="button">
<span className="material-symbols-outlined notranslate text-[18px]">chat_bubble</span>
</button>
</div>
{/*  Teacher 3: Leslie Alexander  */}
<div className="flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="relative">
<img alt="Leslie Alexander" className="w-9 h-9 rounded-full object-cover border border-outline-variant/40" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCL4MbDTP1WGeBHiLiFACwnp3X1NI5zASZDcptGNi8LJYBh_IQzF8_IHN4yBExHhOlbG8w3-Ht1QFQ-c5pDANb5AL_sXWjlqlxQWCeZd0dzZDEg2UAcoPtVvUwmttvQFpJy9tzfwtRF_0zRN-ox5KNTRryuZYO_hEt1qeDNAkedfrpPi1c1A1MioEo0zLbWRTisbIli06Ug5n80T1V9qgLwBrEtb-KpsdSdNOckBSv9eYcrQJm5T5v8" />
<span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10B981] ring-2 ring-white"></span>
</div>
<div className="flex flex-col">
<span className="text-[13px] font-bold text-primary leading-tight">Leslie Alexander</span>
<span className="text-[11px] text-outline">Electronics</span>
</div>
</div>
<button className="w-8 h-8 rounded-lg bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0284C7] flex items-center justify-center transition-colors shadow-sm" title="Envoyer un message" type="button">
<span className="material-symbols-outlined notranslate text-[18px]">chat_bubble</span>
</button>
</div>
{/*  Teacher 4: Kristin Watson  */}
<div className="flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="relative">
<img alt="Kristin Watson" className="w-9 h-9 rounded-full object-cover border border-outline-variant/40" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkx1iYsqiE3qUyhz_-yjkPxAd_Xm0Cq4_3h-zS2kKVRtTLBhig2r-qKtq8_GDSUhSLlw3fl5t-ysBEQLO7pQI9hrNrSxnAqzJ98qWwnTNZmje87M7vVRRjxkvJOZttJlvvSObBJW4nqtJn2O5hjiPukZ6LGEsxmj2Tv0tU5Z5-LjYcT5lq6yXUpYgq7133Wgzbnz8sFVcUkH9iAlC128G05TLUs6uZqOLwnNVa2b1WM54RXbE4FUwP" />
<span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10B981] ring-2 ring-white"></span>
</div>
<div className="flex flex-col">
<span className="text-[13px] font-bold text-primary leading-tight">Kristin Watson</span>
<span className="text-[11px] text-outline">Maths</span>
</div>
</div>
<button className="w-8 h-8 rounded-lg bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0284C7] flex items-center justify-center transition-colors shadow-sm" title="Envoyer un message" type="button">
<span className="material-symbols-outlined notranslate text-[18px]">chat_bubble</span>
</button>
</div>
</div>
</div>
</div>
</div>
</div>
{/*  Bento Section 2: Financial Transparency & Course Documents  */}

{/*  Micro-interaction JS for File Input feedback  */}

</div>
    </div>
  );
};

export default ApprenantPlanning;
