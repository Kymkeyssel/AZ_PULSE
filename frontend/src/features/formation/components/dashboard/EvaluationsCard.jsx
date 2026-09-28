import React from 'react';

export const EvaluationsCard = ({ data = [] }) => {
  const { tasks = [], grades = [] } = data || {};

  return (
    <div className="lg:col-span-5 flex flex-col gap-space-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <div className="w-2.5 h-6 bg-tertiary-fixed-dim rounded-full shadow-[0_2px_6px_rgba(255,186,32,0.5)]"></div>
          <h2 className="font-headline-md text-headline-md text-primary font-bold">Évaluations &amp; Livrables</h2>
        </div>
        <a className="font-label-md text-label-md text-secondary hover:underline font-bold" href="#">Voir tout</a>
      </div>
      
      {tasks.length > 0 && (
        <div className="clay-card rounded-2xl p-space-md flex flex-col gap-space-sm">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold tracking-wider">Devoirs en attente de dépôt</span>
          
          {tasks.map((task, idx) => (
            <div key={idx} className="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-space-xs border border-surface-container/60 shadow-sm">
              <div className="flex items-start justify-between gap-space-xs">
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md font-bold text-primary">{task.title}</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{task.description}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-label-sm font-extrabold shadow-sm shrink-0">
                  {task.dueDate}
                </span>
              </div>
              <div className="mt-space-xs flex items-center justify-between gap-2 pt-2 border-t border-surface-container">
                <span className="font-label-sm text-label-sm text-outline font-mono font-medium">Format: {task.formatRequired}</span>
                <button 
                  className="px-3.5 py-1.5 rounded-lg bg-surface-container-highest text-primary hover:bg-surface-container font-label-sm text-label-sm font-bold flex items-center gap-1.5 transition-all shadow-sm" 
                  type="button"
                >
                  <span className="material-symbols-outlined notranslate text-[16px]">upload_file</span>
                  Déposer le fichier
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="clay-card rounded-2xl p-space-md flex flex-col gap-space-sm">
        <div className="flex items-center justify-between pb-1 border-b border-surface-container">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold tracking-wider">Dernières Notes Reçues</span>
          <span className="font-label-sm text-label-sm text-secondary font-bold bg-secondary/10 px-2 py-0.5 rounded-full">Consultation certifiée</span>
        </div>
        
        <div className="flex flex-col gap-space-xs">
          {grades.length > 0 ? grades.map((grade, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-surface-container/60">
              <div className="flex flex-col">
                <span className="font-label-md text-label-md font-bold text-primary">{grade.course}</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">{grade.date}</span>
                <span className="font-label-sm text-label-sm text-secondary italic mt-0.5 font-medium">« {grade.comment} »</span>
              </div>
              <div className="text-right shrink-0 pl-3">
                <span className={`font-headline-sm text-headline-sm font-extrabold drop-shadow-sm ${grade.score >= 12 ? 'text-secondary' : (grade.score >= 10 ? 'text-amber-500' : 'text-error')}`}>
                  {grade.score}
                </span>
                <span className="block font-label-sm text-label-sm text-on-surface-variant font-bold">/ 20</span>
              </div>
            </div>
          )) : (
            <div className="text-center p-4 text-slate-500 italic">Aucune note récente.</div>
          )}
        </div>
      </div>
    </div>
  );
};
