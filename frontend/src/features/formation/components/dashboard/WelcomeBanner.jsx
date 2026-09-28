import React from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { academyService } from '../../../../services/api';

export const WelcomeBanner = ({ bordereauxPublished }) => {
  const handleUploadClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.doc,.docx,.zip';
    fileInput.onchange = async (e) => {
      if (e.target.files.length > 0) {
        try {
          await academyService.uploadDocument(e.target.files[0], 'submission');
          alert(`TP "${e.target.files[0].name}" téléversé avec succès !`);
        } catch (err) {
          alert(`Erreur d'upload: ${err.message}`);
        }
      }
    };
    fileInput.click();
  };
  const { fullName } = useAuth();
  
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary via-primary-container to-secondary-container p-space-lg text-on-primary shadow-xl mt-space-md">
      <div className="absolute -right-16 -top-16 w-96 h-96 rounded-full bg-secondary/35 blur-3xl pointer-events-none"></div>
      <div className="absolute right-1/3 -bottom-24 w-80 h-80 rounded-full bg-tertiary-fixed-dim/25 blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-lg">
        <div className="flex flex-col gap-space-xs max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface/15 backdrop-blur-md text-tertiary-fixed-dim font-label-sm text-label-sm uppercase tracking-wider font-extrabold border border-tertiary-fixed-dim/30 clay-badge">
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed-dim animate-pulse shadow-[0_0_8px_#ffba20]"></span>
              Apprenant actif
            </span>
            <span className="text-on-primary-container font-label-md text-label-md flex items-center gap-1">
              • Certificat d'aptitude professionnelle en cours (MINEFOP)
            </span>
          </div>
          
          <h1 className="font-headline-xl text-headline-xl text-on-primary tracking-tight font-extrabold mt-1 drop-shadow-sm flex items-center gap-3">
            Bonjour, {fullName || 'Jean-Marc E.'} <span className="text-[32px] animate-bounce">✨</span>
          </h1>
          
          <p className="font-body-lg text-body-lg text-primary-fixed-dim font-medium">
            Promotion Développeur d'Applications &amp; IA (MINEFOP 2025)
          </p>
        </div>
        
        {/* Quick Action Cluster */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap lg:flex-nowrap gap-space-sm shrink-0">
          <button className="group flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl clay-btn-amber text-primary font-label-lg text-label-lg font-bold hover:brightness-105 active:scale-95 transition-all" type="button">
            <div className="w-6 h-6 rounded-lg bg-surface-container-lowest/30 flex items-center justify-center">
              <span className="material-symbols-outlined notranslate text-[18px] transition-transform group-hover:scale-110">videocam</span>
            </div>
            <span className="">Classe Virtuelle</span>
          </button>
          
          <button 
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface/15 hover:bg-surface/25 backdrop-blur-md text-on-primary font-label-lg text-label-lg transition-all active:scale-95 border border-surface/20 shadow-md" 
            type="button"
            onClick={() => {
              const fileInput = document.createElement('input');
              fileInput.type = 'file';
              fileInput.accept = '.pdf,.doc,.docx,.zip';
              fileInput.onchange = e => {
                if (e.target.files.length > 0) alert(`TP "${e.target.files[0].name}" téléversé avec succès !`);
              };
              fileInput.click();
            }}
          >
            <span className="material-symbols-outlined notranslate text-[18px] text-tertiary-fixed-dim">upload_file</span>
            <span className="">Déposer un TP</span>
          </button>
          
          <button 
            disabled={!bordereauxPublished}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl ${bordereauxPublished ? 'bg-surface/15 hover:bg-surface/25 active:scale-95' : 'bg-surface/5 opacity-50 cursor-not-allowed'} backdrop-blur-md text-on-primary font-label-lg text-label-lg transition-all border border-surface/20 shadow-md`} 
            type="button"
            title={bordereauxPublished ? "Télécharger le bordereau" : "Bordereau non publié par l'administration"}
            onClick={() => bordereauxPublished && alert('Téléchargement du bordereau...')}
          >
            <span className="material-symbols-outlined notranslate text-[18px] text-secondary-fixed">receipt_long</span>
            <span className="">Bordereau</span>
          </button>
          
          <button 
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface/15 hover:bg-surface/25 backdrop-blur-md text-on-primary font-label-lg text-label-lg transition-all active:scale-95 border border-surface/20 shadow-md" 
            type="button"
            onClick={() => alert('Téléchargement du relevé de notes...')}
          >
            <span className="material-symbols-outlined notranslate text-[18px] text-primary-fixed">history_edu</span>
            <span className="">Relevé</span>
          </button>
        </div>
      </div>
    </div>
  );
};
