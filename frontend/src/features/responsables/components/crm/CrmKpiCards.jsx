import { formatAmountCompact } from '../../lib/format';

const CrmKpiCards = ({ totals, scope, onScopeChange }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-space-md animate-fade-in">
      {/* KPI 1 : Prospects Qualifiés (Affaires ouvertes) */}
      <div 
        className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex flex-col justify-between group hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => onScopeChange('all')}
      >
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md text-on-surface-variant">Affaires ouvertes</span>
          <span className="p-1.5 rounded-lg bg-surface-container text-secondary">
            <span className="material-symbols-outlined text-[18px]">filter_alt</span>
          </span>
        </div>
        <div className="mt-space-sm flex items-baseline gap-2">
          <span className="font-headline-xl text-headline-xl text-primary font-bold">{totals.count}</span>
        </div>
        <div className="w-full bg-surface-container h-1 rounded-full mt-space-sm overflow-hidden">
          <div className="bg-secondary h-full rounded-full" style={{ width: '72%' }}></div>
        </div>
      </div>

      {/* KPI 2 : Nouvelles Opportunités (Scope actuel) */}
      <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex flex-col justify-between group hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md text-on-surface-variant">Portefeuille</span>
          <span className="p-1.5 rounded-lg bg-surface-container text-tertiary-fixed-dim">
            <span className="material-symbols-outlined text-[18px]">visibility</span>
          </span>
        </div>
        <div className="mt-space-sm flex items-baseline gap-2">
          <span className="font-headline-sm text-sm text-primary font-bold truncate">
            {scope === 'all' ? 'Global Équipe' : 'Mes affaires'}
          </span>
        </div>
        <div className="w-full bg-surface-container h-1 rounded-full mt-space-sm overflow-hidden">
          <div className="bg-tertiary-fixed-dim h-full rounded-full" style={{ width: '100%' }}></div>
        </div>
      </div>

      {/* KPI 3 : Valeur Totale Pipeline */}
      <div className="p-space-md rounded-xl bg-primary text-on-primary shadow-md flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md text-on-primary-container">Valeur Pipeline</span>
          <span className="p-1.5 rounded-lg bg-primary-container text-tertiary-fixed">
            <span className="material-symbols-outlined text-[18px]">payments</span>
          </span>
        </div>
        <div className="mt-space-sm">
          <div className="font-headline-lg text-headline-lg text-on-primary font-extrabold tracking-tight">
            {formatAmountCompact(totals.totalAmount)}
          </div>
          <span className="font-label-sm text-label-sm text-secondary-fixed-dim uppercase tracking-wider">XAF en cours</span>
        </div>
        <div className="w-full bg-primary-container h-1 rounded-full mt-space-sm overflow-hidden">
          <div className="bg-secondary-container h-full rounded-full" style={{ width: '100%' }}></div>
        </div>
      </div>

      {/* KPI 4 : Valeur Pondérée */}
      <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex flex-col justify-between group hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md text-on-surface-variant">Valeur Pondérée</span>
          <span className="p-1.5 rounded-lg bg-blue-50 text-secondary">
            <span className="material-symbols-outlined text-[18px]">calculate</span>
          </span>
        </div>
        <div className="mt-space-sm flex items-baseline gap-2">
          <span className="font-headline-xl text-headline-xl text-primary font-bold">
            {formatAmountCompact(totals.weightedAmount)}
          </span>
        </div>
        <div className="w-full bg-surface-container h-1 rounded-full mt-space-sm overflow-hidden">
          <div className="bg-secondary h-full rounded-full" style={{ width: '100%' }}></div>
        </div>
      </div>

      {/* KPI 5 : Taux de Conversion */}
      <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex flex-col justify-between group hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md text-on-surface-variant">Taux Réussite</span>
          <span className="p-1.5 rounded-lg bg-surface-container text-secondary">
            <span className="material-symbols-outlined text-[18px]">pie_chart</span>
          </span>
        </div>
        <div className="mt-space-sm flex items-baseline gap-2">
          <span className="font-headline-xl text-headline-xl text-primary font-bold">
            {totals.totalAmount > 0 ? `${Math.round((totals.weightedAmount / totals.totalAmount) * 100)}%` : '—'}
          </span>
        </div>
        <div className="w-full bg-surface-container h-1 rounded-full mt-space-sm overflow-hidden">
          <div className="bg-secondary h-full rounded-full" style={{ width: totals.totalAmount > 0 ? `${Math.round((totals.weightedAmount / totals.totalAmount) * 100)}%` : '0%' }}></div>
        </div>
      </div>

      {/* KPI 6 : Relances Critiques */}
      <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex flex-col justify-between group hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.scrollTo(0, document.body.scrollHeight)}>
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md text-on-surface-variant">Relances Clients</span>
          <span className="p-1.5 rounded-lg bg-error-container text-error">
            <span className="material-symbols-outlined text-[18px]">notifications_active</span>
          </span>
        </div>
        <div className="mt-space-sm flex items-baseline gap-2">
          <span className="font-headline-xl text-headline-xl text-primary font-bold">-</span>
          <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-error text-on-error font-bold">Voir bas de page</span>
        </div>
        <div className="w-full bg-surface-container h-1 rounded-full mt-space-sm overflow-hidden flex">
          <div className="bg-error h-full" style={{ width: '14%' }}></div>
          <div className="bg-amber-500 h-full" style={{ width: '35%' }}></div>
          <div className="bg-secondary h-full" style={{ width: '51%' }}></div>
        </div>
      </div>
    </div>
  );
};

export default CrmKpiCards;
