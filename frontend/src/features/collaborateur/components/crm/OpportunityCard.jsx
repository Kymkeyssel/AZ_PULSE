import { formatAmount, STAGE_STYLES } from '../../lib/format';

/**
 * Carte d'opportunité — design system AZ PULSE / Stitch.
 * Surface : surface-container-lowest (blanc), bordure surface-variant.
 * Accent de couleur via la bande d'étape et le chip de probabilité.
 */
const OpportunityCard = ({ opportunity, onSelect, draggable, isDragging }) => {
  const style = STAGE_STYLES[opportunity.stage] ?? STAGE_STYLES.PROSPECTING;

  return (
    <article
      draggable={draggable}
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
    </article>
  );
};

export default OpportunityCard;
