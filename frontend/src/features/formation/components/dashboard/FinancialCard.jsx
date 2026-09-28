import React from 'react';

export const FinancialCard = ({ data }) => {
  if (!data) return null;
  const progressPercent = (data.paidTranches / data.totalTranches) * 100;

  return (
    <div className="lg:col-span-5 bg-gradient-to-br from-az-navy to-[#0b2545] rounded-xl shadow-lg overflow-hidden flex flex-col h-full text-white relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-az-blue/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
      
      <div className="p-space-md border-b border-white/10 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-space-sm">
          <span className="material-symbols-outlined notranslate text-az-blue">account_balance</span>
          <h3 className="font-title-md text-title-md font-bold">Situation Financière</h3>
        </div>
      </div>
      
      <div className="p-space-md flex-1 flex flex-col justify-between relative z-10">
        <div>
          <span className="font-label-sm text-label-sm text-white/60 uppercase tracking-wider">Reste à payer</span>
          <div className="flex items-end gap-2 mt-1">
            <span className="font-headline-xl text-headline-xl font-extrabold">{data.remainingBalance.toLocaleString()}</span>
            <span className="font-title-md text-title-md text-white/80 pb-1">XAF</span>
          </div>
          <span className="font-label-sm text-label-sm text-white/60">sur {data.totalAmount.toLocaleString()} XAF au total</span>
        </div>
        
        <div className="mt-space-lg">
          <div className="flex justify-between items-center font-label-sm text-label-sm mb-2">
            <span className="text-white/80">Tranches réglées : {data.paidTranches} / {data.totalTranches}</span>
            <span className="font-bold text-az-blue">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-az-blue relative overflow-hidden" style={{ width: `${progressPercent}%` }}>
              <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
        </div>
        
        <div className="mt-space-lg flex gap-space-sm">
          <button className="flex-1 py-2.5 bg-az-blue hover:bg-blue-600 text-white font-bold text-sm rounded-lg transition-colors shadow-md">
            Payer en ligne
          </button>
          <button className="py-2.5 px-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold rounded-lg transition-colors">
            <span className="material-symbols-outlined notranslate text-[20px]">receipt_long</span>
          </button>
        </div>
      </div>
    </div>
  );
};
