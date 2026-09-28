import { formatAmount, STAGE_STYLES } from '../../lib/format';

/**
 * Une carte du pipeline.
 *
 * Deux usages, un seul composant : lecture (cliquable, on ouvre la fiche) et
 * dépôt pendant un glisser-déposer. Le statut `isDragging` sert uniquement à
 * l'esthétique du glissement, jamais à l'autorisation.
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
        'bg-white rounded-xl border border-[#dde3ef] p-3.5 shadow-sm',
        'transition-all duration-150 select-none',
        onSelect ? 'cursor-pointer hover:border-[#004ad1] hover:shadow-md' : 'cursor-grab',
        isDragging ? 'opacity-40' : '',
      ].join(' ')}
    >
      {/* Bandeau de couleur de l'étape */}
      <div className="h-1 rounded-full mb-2.5" style={{ background: style.accent }} />

      <h4 className="text-[13px] font-bold text-[#001026] leading-snug line-clamp-2">
        {opportunity.title}
      </h4>

      {opportunity.customer?.name && (
        <p className="text-[11px] text-[#6b7a99] mt-1 truncate">
          {opportunity.customer.name}
        </p>
      )}

      <div className="flex items-center justify-between gap-2 mt-3">
        <span className="text-sm font-black text-[#0b2545]">
          {formatAmount(opportunity.amount)}
        </span>

        {opportunity.probability > 0 && (
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded"
            style={{ background: style.bg, color: style.accent }}
          >
            {opportunity.probability}%
          </span>
        )}
      </div>

      {opportunity.expectedCloseDate && (
        <p className="text-[10px] text-[#94a3b8] mt-2">
          Clôture visée : {opportunity.expectedCloseDate}
        </p>
      )}
    </article>
  );
};

export default OpportunityCard;
