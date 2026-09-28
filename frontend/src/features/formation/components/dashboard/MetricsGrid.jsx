import React from 'react';

export const MetricsGrid = ({ data }) => {
  if (!data) return null;
  const program = data.program || {};
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm">
      {/* Metric 1 */}
      <div className="clay-metric rounded-2xl p-space-md flex flex-col justify-between transition-all hover:-translate-y-1">
        <div className="flex items-center justify-between text-on-surface-variant">
          <span className="font-label-sm text-label-sm uppercase font-bold tracking-wider">Assiduité</span>
          <div className="w-8 h-8 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shadow-sm">
            <span className="material-symbols-outlined notranslate text-[18px]">how_to_reg</span>
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-headline-lg text-headline-lg text-primary font-extrabold tracking-tight">94%</span>
          <span className="font-label-sm text-label-sm text-secondary font-bold bg-secondary/10 px-1.5 py-0.5 rounded">+2% ce mois</span>
        </div>
        <div className="mt-2 w-full h-2 bg-surface-container rounded-full overflow-hidden p-0.5 shadow-inner">
          <div className="h-full bg-gradient-to-r from-secondary to-secondary-container rounded-full shadow-[0_1px_4px_rgba(0,74,209,0.3)]" style={{ width: '94%' }}></div>
        </div>
      </div>
      
      {/* Metric 2 */}
      <div className="clay-metric rounded-2xl p-space-md flex flex-col justify-between transition-all hover:-translate-y-1">
        <div className="flex items-center justify-between text-on-surface-variant">
          <span className="font-label-sm text-label-sm uppercase font-bold tracking-wider">Moyenne</span>
          <div className="w-8 h-8 rounded-xl bg-tertiary-fixed-dim/20 flex items-center justify-center text-tertiary-fixed-dim shadow-sm">
            <span className="material-symbols-outlined notranslate text-[20px] text-amber-500">military_tech</span>
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-headline-lg text-headline-lg text-primary font-extrabold tracking-tight">14.5</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">/ 20</span>
        </div>
        <span className="mt-2 inline-flex items-center gap-1 font-label-sm text-label-sm text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full w-fit">★ Trimestre 1</span>
      </div>
      
      {/* Metric 3 */}
      <div className="clay-metric rounded-2xl p-space-md flex flex-col justify-between transition-all hover:-translate-y-1">
        <div className="flex items-center justify-between text-on-surface-variant">
          <span className="font-label-sm text-label-sm uppercase font-bold tracking-wider">Crédits ECTS</span>
          <div className="w-8 h-8 rounded-xl bg-secondary-container/10 flex items-center justify-center text-secondary-container shadow-sm">
            <span className="material-symbols-outlined notranslate text-[18px]">stars</span>
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-headline-lg text-headline-lg text-primary font-extrabold tracking-tight">42</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">/ 60</span>
        </div>
        <span className="mt-2 font-label-sm text-label-sm text-secondary font-bold bg-secondary/10 px-2 py-0.5 rounded-full w-fit">Validés (L3)</span>
      </div>
      
      {/* Metric 4 */}
      <div className="clay-metric rounded-2xl p-space-md flex flex-col justify-between transition-all hover:-translate-y-1">
        <div className="flex items-center justify-between text-on-surface-variant">
          <span className="font-label-sm text-label-sm uppercase font-bold tracking-wider">Heures Pratiques</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined notranslate text-[18px]">laptop_mac</span>
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-headline-lg text-headline-lg text-primary font-extrabold tracking-tight">120</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">heures</span>
        </div>
        <span className="mt-2 inline-flex items-center gap-1 font-label-sm text-label-sm text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
          <span className="material-symbols-outlined notranslate text-[14px]">verified</span>Lab &amp; Projets
        </span>
      </div>
    </div>
  );
};
