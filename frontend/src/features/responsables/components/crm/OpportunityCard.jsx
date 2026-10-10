import { formatAmountCompact, STAGE_STYLES } from '../../lib/format';
import { Link, useLocation } from 'react-router-dom';

const OpportunityCard = ({ opportunity, onSelect, draggable, isDragging, isWon, onAdvance, isBusy, disabled }) => {
  const location = useLocation();
  const workspacePath = location.pathname.startsWith('/superadmin')
    ? '/superadmin/workspace'
    : location.pathname.startsWith('/admin')
      ? '/admin/workspace'
      : location.pathname.startsWith('/collaborateur')
        ? '/collaborateur/projets'
        : '/responsable/projets';
  const style = STAGE_STYLES[opportunity.stage] ?? STAGE_STYLES.PROSPECTING;

  // Find the next stage logic to implement the "Phase ->" button
  const getNextStage = (currentStage) => {
    switch (currentStage) {
      case 'PROSPECTING': return 'QUALIFICATION';
      case 'QUALIFICATION': return 'PROPOSAL';
      case 'PROPOSAL': return 'NEGOTIATION';
      case 'NEGOTIATION': return 'WON';
      default: return null;
    }
  };

  const nextStage = getNextStage(opportunity.stage);

  return (
    <div
      draggable={draggable && !disabled}
      onDragStart={e => {
        e.dataTransfer.setData('text/plain', String(opportunity.id));
        e.dataTransfer.effectAllowed = 'move';
      }}
      className={[
        'p-space-sm rounded-lg shadow-sm transition-all border flex flex-col space-y-2',
        onSelect ? 'cursor-pointer hover:shadow-md' : 'cursor-grab',
        isDragging ? 'opacity-40' : '',
        isBusy ? 'ring-2 ring-blue-400 shadow-blue-500/20' : '',
        isWon ? 'bg-surface-container-lowest border-emerald-300' : 'bg-surface-container-lowest border-outline-variant/20',
      ].join(' ')}
    >
      <div className="flex items-start justify-between">
        <span 
          className="text-[11px] px-1.5 py-0.5 rounded font-bold uppercase"
          style={{ background: isWon ? '#059669' : style.bg, color: isWon ? '#ffffff' : style.accent }}
        >
          {isWon ? <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">verified</span> 100% SIGNÉ</span> : `${opportunity.stage} (${opportunity.probability || 0}%)`}
        </span>
        {!isWon && (
          <button 
            className="text-outline hover:text-primary"
            onClick={(e) => { e.stopPropagation(); onSelect?.(opportunity); }}
          >
            <span className="material-symbols-outlined text-[16px]">more_vert</span>
          </button>
        )}
      </div>

      <div onClick={() => onSelect?.(opportunity)}>
        <h4 className="font-headline-sm text-sm text-primary font-bold hover:text-secondary line-clamp-2">
          {opportunity.title}
        </h4>
        {opportunity.customer?.name && (
          <p className="text-xs text-on-surface-variant truncate">
            {opportunity.customer.name}
          </p>
        )}
      </div>

      <div className={`font-headline-sm text-sm font-extrabold ${isWon ? 'text-emerald-800' : 'text-primary'}`}>
        {formatAmountCompact(opportunity.amount)}
      </div>

      {!isWon && (
        <div className="pt-1 border-t border-outline-variant/10 flex items-center justify-between text-[11px] text-on-surface-variant">
          <span className="flex items-center gap-1">
            {opportunity.expectedCloseDate ? (
              <><span className="material-symbols-outlined text-[14px]">event</span> {opportunity.expectedCloseDate}</>
            ) : (
              <><span className="material-symbols-outlined text-[14px]">person</span> En cours</>
            )}
          </span>
          {nextStage && opportunity.stage !== 'NEGOTIATION' && (
            <button 
              disabled={disabled}
              className="px-2 py-0.5 rounded bg-surface-container hover:bg-secondary hover:text-on-secondary text-primary font-bold transition-colors disabled:opacity-50"
              onClick={(e) => { e.stopPropagation(); onAdvance?.(nextStage); }}
            >
              Phase →
            </button>
          )}
        </div>
      )}

      {opportunity.stage === 'NEGOTIATION' && !isWon && (
        <div className="pt-2 border-t border-outline-variant/10 flex items-center justify-between gap-1 mt-1">
          <button 
            disabled={disabled}
            className="flex-1 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors flex items-center justify-center gap-1 shadow-sm disabled:opacity-50"
            onClick={(e) => { e.stopPropagation(); onAdvance?.('WON'); }}
          >
            <span className="material-symbols-outlined text-[14px]">check</span> GAGNÉ
          </button>
          <button 
            disabled={disabled}
            className="px-2 py-1 rounded bg-surface-container hover:bg-error-container text-on-surface-variant hover:text-error text-[11px] disabled:opacity-50"
            onClick={(e) => { e.stopPropagation(); onAdvance?.('LOST'); }}
            title="Marquer Perdu"
          >
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        </div>
      )}

      {isBusy && <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-2.5 py-2 text-[11px] font-bold text-blue-700"><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600"/>Enregistrement de l’étape…</div>}

      {isWon && (
        <div className="p-2 rounded bg-surface-container-low border border-secondary/20 flex flex-col gap-1 mt-1">
          <div className="flex items-center gap-1 text-[11px] text-secondary font-bold">
            <span className="material-symbols-outlined text-[14px]">auto_awesome</span> Projet Déployé
          </div>
          <span className="text-[11px] text-on-surface-variant">Initié auto</span>
          <Link 
            to={workspacePath}
            className="mt-1 w-full py-1 text-center rounded bg-secondary text-on-secondary text-[11px] font-bold hover:bg-secondary-container transition-colors block"
          >
            Ouvrir dans Workspace →
          </Link>
        </div>
      )}
    </div>
  );
};

export default OpportunityCard;
