import { useState } from 'react';
import OpportunityCard from './OpportunityCard';
import { formatAmountCompact, STAGE_STYLES } from '../../lib/format';

/**
 * Tableau Kanban — design AZ PULSE / Stitch.
 * Colonnes : surface-container-low (#f0f4f8), zone de dépôt : secondaire.
 */
const PipelineBoard = ({ columns, canUpdate, onSelect, onMove }) => {
  const [dragging, setDragging] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);

  const handleDrop = (opportunityId, stage) => {
    setDropTarget(null);
    setDragging(null);
    if (!opportunityId || !canUpdate) return;
    const source = columns.find(c =>
      c.opportunities.some(o => String(o.id) === opportunityId)
    );
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
            onDragLeave={() =>
              setDropTarget(prev => (prev === column.code ? null : prev))
            }
            onDrop={e => {
              e.preventDefault();
              handleDrop(e.dataTransfer.getData('text/plain'), column.code);
            }}
            className={[
              'flex-shrink-0 w-72 flex flex-col rounded-2xl border transition-all duration-200',
              isTarget
                ? 'border-[#004ad1] bg-[#dce1ff]/30 shadow-md shadow-[#004ad1]/10'
                : 'border-[#c4c6cf] bg-[#f0f4f8]',
            ].join(' ')}
          >
            {/* ── En-tête de colonne ───────────────── */}
            <header className="p-4 border-b border-[#dfe3e7]/80">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: style.accent }}
                  />
                  <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-[#001026] truncate">
                    {column.label}
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-[#44474e] bg-white px-2.5 py-0.5 rounded-full border border-[#c4c6cf] flex-shrink-0">
                  {column.count}
                </span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-[12px] font-bold text-[#001026]">
                  {formatAmountCompact(column.totalAmount)}
                </span>
                {column.weightedAmount > 0 && (
                  <span className="text-[10px] text-[#74777f]">
                    · {formatAmountCompact(column.weightedAmount)} pond.
                  </span>
                )}
              </div>
            </header>

            {/* ── Cartes ───────────────────────────── */}
            <div className="flex-1 p-2.5 space-y-2 overflow-y-auto max-h-[62vh]">
              {column.opportunities.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <span className="material-symbols-outlined notranslate text-[32px] text-[#c4c6cf]">
                    inbox
                  </span>
                  <p className="text-[11px] text-[#74777f] text-center">
                    Aucune affaire
                  </p>
                </div>
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
