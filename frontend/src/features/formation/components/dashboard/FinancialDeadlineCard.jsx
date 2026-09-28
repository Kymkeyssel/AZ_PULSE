import React from 'react';

export const FinancialDeadlineCard = ({ data }) => {
  if (!data) return null;
  const { nextDeadline, amountDue, overdueAmount } = data;
  
  if (!nextDeadline && !overdueAmount) {
    return (
      <div className="bg-surface-container rounded-2xl p-space-lg flex items-center justify-center h-full border border-surface-container-highest shadow-inner text-on-surface-variant font-label-md">
        Aucun paiement en attente.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-space-sm flex-1">
      {/* 1. Tranche en cours */}
      {nextDeadline && (
        <div className="bg-gradient-to-br from-[#4a2e00] via-[#332200] to-tertiary text-on-primary rounded-2xl p-space-md shadow-xl flex flex-col justify-between relative overflow-hidden border border-tertiary-fixed-dim/20 flex-1">
          <div className="absolute -right-6 -top-6 w-36 h-36 bg-tertiary-fixed-dim/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed-dim/20 text-tertiary-fixed font-label-sm text-label-sm font-extrabold uppercase tracking-wider">
                <span className="material-symbols-outlined notranslate text-[16px]">payments</span>Scolarité
              </span>
              <span className="font-label-sm text-label-sm text-tertiary-fixed-dim font-bold bg-surface/10 px-2 py-0.5 rounded-full">
                {new Date(nextDeadline).toLocaleDateString('fr-FR')}
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-primary font-bold mt-space-md leading-snug">
              Tranche en cours
            </h3>
            <p className="font-body-sm text-body-sm text-on-primary/70 mt-space-xs">
              Montant à régler : {amountDue?.toLocaleString()} XAF
            </p>
          </div>
          
          <div className="mt-space-md pt-space-sm bg-surface/10 rounded-xl p-space-sm flex items-center justify-between border border-surface/10 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined notranslate text-tertiary-fixed-dim text-[20px]">info</span>
              <span className="font-label-sm text-label-sm font-bold text-on-primary">
                Facture disponible
              </span>
            </div>
            <button 
              className="px-3.5 py-2 rounded-lg bg-tertiary-fixed text-tertiary font-label-sm text-label-sm font-bold shadow-md hover:brightness-110 transition-all active:scale-95" 
              type="button"
            >
              Régler
            </button>
          </div>
        </div>
      )}

      {/* 2. Autres paiements non effectués */}
      {overdueAmount > 0 && (
        <div className="bg-gradient-to-br from-[#4d0006] via-[#3b0004] to-error text-on-error rounded-2xl p-space-md shadow-xl flex flex-col justify-between relative overflow-hidden border border-error/50 flex-1">
          <div className="absolute -right-6 -top-6 w-36 h-36 bg-error-container/20 rounded-full blur-2xl pointer-events-none"></div>
          
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container/30 text-error-container font-label-sm text-label-sm font-extrabold uppercase tracking-wider">
                <span className="material-symbols-outlined notranslate text-[16px]">warning</span>Retard
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-error font-bold mt-space-md leading-snug">
              Paiements échus
            </h3>
            <p className="font-body-sm text-body-sm text-error-container mt-space-xs font-bold">
              Total : {overdueAmount?.toLocaleString()} XAF
            </p>
          </div>
          
          <div className="mt-space-md pt-space-sm bg-surface/10 rounded-xl p-space-sm flex items-center justify-between border border-surface/10 backdrop-blur-md">
             <button 
              className="w-full px-3.5 py-2 rounded-lg bg-error-container text-on-error-container font-label-sm text-label-sm font-bold shadow-md hover:brightness-110 transition-all active:scale-95" 
              type="button"
            >
              Régulariser maintenant
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
