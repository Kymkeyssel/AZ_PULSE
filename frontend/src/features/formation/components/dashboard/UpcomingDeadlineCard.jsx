import React from 'react';
import { academyService } from '../../../../services/api';

export const UpcomingDeadlineCard = ({ data = [] }) => {
  const handleUploadClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.doc,.docx,.zip';
    fileInput.onchange = async (e) => {
      if (e.target.files.length > 0) {
        try {
          await academyService.uploadDocument(e.target.files[0], 'submission');
          alert(`Document "${e.target.files[0].name}" déposé avec succès !`);
        } catch (err) {
          alert(`Erreur d'upload: ${err.message}`);
        }
      }
    };
    fileInput.click();
  };
  const tasks = data || [];
  const task = tasks.length > 0 ? tasks[0] : null;
  
  if (!task) {
    return (
      <div className="bg-surface-container rounded-2xl p-space-lg flex items-center justify-center h-full border border-surface-container-highest shadow-inner text-on-surface-variant font-label-md">
        Aucune échéance immédiate.
      </div>
    );
  }
  
  return (
    <div className="bg-gradient-to-br from-primary via-primary-container to-[#00224d] text-on-primary rounded-2xl p-space-lg shadow-xl flex flex-col justify-between relative overflow-hidden border border-primary-container flex-1">
      <div className="absolute -right-6 -top-6 w-36 h-36 bg-tertiary-fixed-dim/20 rounded-full blur-2xl pointer-events-none"></div>
      
      <div>
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full clay-btn-amber text-primary font-label-sm text-label-sm font-extrabold uppercase tracking-wider">
            <span className="material-symbols-outlined notranslate text-[16px]">alarm</span>Échéance Proche
          </span>
          <span className="font-label-sm text-label-sm text-tertiary-fixed font-bold bg-surface/10 px-2 py-0.5 rounded-full">
            Bientôt
          </span>
        </div>
        <h3 className="font-headline-sm text-headline-sm text-on-primary font-bold mt-space-md leading-snug">
          {task.title}
        </h3>
        <p className="font-body-sm text-body-sm text-primary-fixed-dim mt-space-xs">
          {task.description}
        </p>
      </div>
      
      <div className="mt-space-md pt-space-sm bg-surface/10 rounded-xl p-space-sm flex items-center justify-between border border-surface/10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined notranslate text-tertiary-fixed-dim text-[20px]">event</span>
          <span className="font-label-md text-label-md font-bold text-on-primary">
            {task.dueDate || 'À préciser'}
          </span>
        </div>
        <button 
          className="px-3.5 py-2 rounded-lg bg-surface-container-lowest text-primary font-label-sm text-label-sm font-bold shadow-md hover:bg-surface-container transition-all active:scale-95" 
          type="button"
        >
          Déposer
        </button>
      </div>
    </div>
  );
};
