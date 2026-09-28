import { useState } from 'react';
import OpportunityCard from './OpportunityCard';
import { formatAmount, STAGE_STYLES } from '../../lib/format';

/**
 * Tableau Kanban du pipeline.
 *
 * Le glisser-déposer n'est disponible que si l'utilisateur a le droit de
 * modifier une affaire (`crm.update`). Ce n'est qu'un confort d'interface :
 * même masqué, Symfony refuserait la requête.
 */
const PipelineBoard = ({ columns, canUpdate, onSelect, onMove }) => {
  const [dragging, setDragging] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);

  const handleDrop = (opportunityId, stage) => {
    setDropTarget(null);
    setDragging(null);

    if (!opportunityId || !canUpdate) return;

    // Inutile de faire un aller-retour serveur si l'étape est inchangée.
    const source = columns.find(c => c.opportunities.some(o => String(o.id) === opportunityId));
    if (!source || source.code === stage) return;

    onMove?.(opportunityId, stage);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1">
      {columns.map(column => {
        const style = STAGE_STYLES[column.code] ?? STAGE_STYLES.PROSPECTING;
        const isTarget = dropTarget === column.code;

        return (
          <section
            key={column.code}
            onDragOver={e => {
              if (!canUpdate) return;
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
              setDropTarget(column.code);
            }}
            onDragLeave={() => setDropTarget(prev => (prev === column.code ? null : prev))}
            onDrop={e => {
              e.preventDefault();
              handleDrop(e.dataTransfer.getData('text/plain'), column.code);
            }}
            className={[
              'flex-shrink-0 w-72 flex flex-col rounded-2xl border transition-colors',
              isTarget ? 'border-[#004ad1] bg-[#eff6ff]' : 'border-[#dde3ef] bg-[#f4f7fb]',
            ].join(' ')}
          >
            {/* ── En-tête de colonne ──────────────────────────────────── */}
            <header className="p-3.5 border-b border-[#dde3ef]/80">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: style.accent }}
                  />
                  <h3 className="text-xs font-black uppercase tracking-wide text-[#0b2545] truncate">
                    {column.label}
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-[#6b7a99] bg-white px-2 py-0.5 rounded-full border border-[#dde3ef] flex-shrink-0">
                  {column.count}
                </span>
              </div>

              <p className="text-[11px] text-[#6b7a99]">
                {formatAmount(column.totalAmount)}
                {column.weightedAmount > 0 && (
                  <span className="text-[#94a3b8]">
                    {' '}· {formatAmount(column.weightedAmount)} pondéré
                  </span>
                )}
              </p>
            </header>

            {/* ── Cartes ──────────────────────────────────────────────── */}
            <div className="flex-1 p-2.5 space-y-2.5 overflow-y-auto max-h-[62vh]">
              {column.opportunities.length === 0 && (
                <p className="text-[11px] text-[#94a3b8] text-center py-8">
                  Aucune affaire
                </p>
              )}

              {column.opportunities.map(opportunity => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  onSelect={onSelect}
                  draggable={canUpdate}
                  isDragging={dragging === String(opportunity.id)}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default PipelineBoard;
