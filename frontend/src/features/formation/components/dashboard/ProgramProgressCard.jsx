import React from 'react';

export const ProgramProgressCard = ({ data }) => {
  if (!data) return null;
  return (
    <div className="clay-card rounded-2xl p-space-lg flex flex-col relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-md">
        <div className="flex gap-space-md">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/20 flex items-center justify-center text-secondary shrink-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_6px_16px_rgba(0,74,209,0.15)]">
            <span className="material-symbols-outlined notranslate text-[36px]">terminal</span>
          </div>
          
          <div className="flex flex-col flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary font-label-sm text-label-sm font-bold uppercase tracking-wider">
                Programme Officiel MINEFOP
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface-variant font-mono font-bold shadow-inner">
                SEM-02
              </span>
            </div>
            
            <h2 className="font-headline-md text-headline-md text-primary font-extrabold mt-1.5">
              {data.programName}
            </h2>

            {/* Linear visual progress bar */}
            <div className="mt-4 flex flex-col gap-space-xs w-full max-w-xl">
              <div className="flex flex-wrap justify-between items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
                <span className="font-bold text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined notranslate text-secondary text-[16px]">verified</span>
                  {data.validatedModules} / {data.totalModules} Modules validés
                </span>
                <span className="font-medium bg-surface-container px-2.5 py-0.5 rounded-md text-on-surface-variant">
                  Prochain palier: {data.nextMilestone}
                </span>
              </div>
              <div className="w-full h-3.5 rounded-full bg-surface-container overflow-hidden p-0.5 shadow-inner border border-surface-container-highest">
                <div className="h-full rounded-full bg-gradient-to-r from-secondary via-secondary-container to-secondary-fixed shadow-[0_2px_6px_rgba(26,98,254,0.4)]" style={{ width: `${data.progress}%` }}></div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-space-xs mt-4 text-on-surface-variant">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary to-secondary text-on-primary flex items-center justify-center font-label-sm text-label-sm font-bold shadow-sm">
                PT
              </div>
              <span className="font-body-md text-body-md font-semibold text-primary">Dr. Paulin T.</span>
              <span className="inline-flex items-center gap-1.5 font-label-sm text-label-sm text-secondary ml-2 px-2 py-0.5 rounded-full bg-secondary/10 font-bold">
                <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>En ligne • Bureau 104
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end sm:items-end justify-start shrink-0 bg-surface-container-low/70 px-4 py-3 rounded-xl border border-surface-container mt-4 sm:mt-0">
          <span className="font-headline-xl text-headline-xl text-secondary font-extrabold tracking-tight drop-shadow-sm">{data.progress}%</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-bold">
            {data.status === 'EN_COURS' ? 'Parcours en cours' : 'Parcours complété'}
          </span>
        </div>
      </div>
    </div>
  );
};
