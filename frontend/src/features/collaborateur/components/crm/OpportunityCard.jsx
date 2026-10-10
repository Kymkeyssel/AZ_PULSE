import { formatAmount, STAGE_STYLES } from '../../lib/format';

/**
 * Carte d'opportunité — design system AZ PULSE / Stitch.
 * Surface : surface-container-lowest (blanc), bordure surface-variant.
 * Accent de couleur via la bande d'étape et le chip de probabilité.
 */
const OpportunityCard = ({ opportunity, onSelect, onAdvance, canUpdate, draggable, isDragging, isBusy, disabled }) => {
  const style = STAGE_STYLES[opportunity.stage] ?? STAGE_STYLES.PROSPECTING;

  return (
    <article
      draggable={draggable && !disabled}
      onDragStart={e => {
        e.dataTransfer.setData('text/plain', String(opportunity.id));
        e.dataTransfer.effectAllowed = 'move';
      }}
      onClick={() => onSelect?.(opportunity)}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.(opportunity);
        }
      }}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      aria-label={onSelect ? `Ouvrir ${opportunity.title}` : undefined}
      className={[
        'bg-white rounded-xl border border-[#dfe3e7] p-3.5',
        'shadow-sm transition-all duration-200 select-none group',
        onSelect
          ? 'cursor-pointer hover:border-[#004ad1] hover:shadow-md hover:-translate-y-0.5'
          : 'cursor-grab',
        isDragging ? 'opacity-40 scale-95 rotate-1' : '',
        isBusy ? 'ring-2 ring-blue-400 shadow-blue-500/20' : '',
      ].join(' ')}
    >
      {/* ── Bande accent d'étape ───────────────────── */}
      <div
        className="h-0.5 rounded-full mb-3 transition-all group-hover:h-1"
        style={{ background: style.accent }}
      />

      {/* ── Titre ─────────────────────────────────── */}
      <h4 className="text-[13px] font-bold text-[#001026] leading-snug line-clamp-2 mb-1">
        {opportunity.title}
      </h4>

      {/* ── Client ────────────────────────────────── */}
      {opportunity.customer?.name && (
        <div className="flex items-center gap-1 mt-1">
          <span className="material-symbols-outlined notranslate text-[13px] text-[#74777f]">
            domain
          </span>
          <p className="text-[11px] text-[#44474e] truncate">
            {opportunity.customer.name}
          </p>
        </div>
      )}

      {/* ── Montant & probabilité ──────────────────── */}
      <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-[#eaeef2]">
        <span className="text-[13px] font-extrabold text-[#001026]">
          {formatAmount(opportunity.amount)}
        </span>

        {opportunity.probability > 0 && (
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: style.bg, color: style.accent }}
          >
            {opportunity.probability}%
          </span>
        )}
      </div>

      {/* ── Date de clôture visée ─────────────────── */}
      {opportunity.expectedCloseDate && (
        <p className="text-[10px] text-[#74777f] mt-2 flex items-center gap-1">
          <span className="material-symbols-outlined notranslate text-[12px]">event</span>
          {opportunity.expectedCloseDate}
        </p>
      )}
      {canUpdate && !['WON', 'LOST'].includes(opportunity.stage) && <div className="mt-3 flex gap-2">
        {opportunity.stage === 'NEGOTIATION' ? <button type="button" disabled={disabled} onClick={e => { e.stopPropagation(); onAdvance?.('WON'); }} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-2 text-[11px] font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"><span className="material-symbols-outlined text-[16px]">task_alt</span>Gagner l’affaire</button> : <button type="button" disabled={disabled} onClick={e => { e.stopPropagation(); onAdvance?.(({ PROSPECTING: 'QUALIFICATION', QUALIFICATION: 'PROPOSAL', PROPOSAL: 'NEGOTIATION' })[opportunity.stage]); }} className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-blue-50 px-2.5 py-2 text-[11px] font-bold text-blue-700 transition hover:bg-blue-100 disabled:opacity-50"><span className="material-symbols-outlined text-[16px]">arrow_forward</span>Étape suivante</button>}
        <button type="button" disabled={disabled} onClick={e => { e.stopPropagation(); onAdvance?.('LOST'); }} className="grid w-9 place-items-center rounded-lg bg-rose-50 text-rose-700 transition hover:bg-rose-100 disabled:opacity-50" title="Clôturer comme perdue"><span className="material-symbols-outlined text-[16px]">close</span></button>
      </div>}
      {isBusy && <div className="mt-2 flex items-center gap-2 text-[11px] font-bold text-blue-700"><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600"/>Enregistrement…</div>}
    </article>
  );
};

export default OpportunityCard;
