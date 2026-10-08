import { useState } from 'react';
import OpportunityCard from './OpportunityCard';
import { formatAmountCompact, STAGE_STYLES } from '../../lib/format';

const PipelineBoard = ({ columns, canUpdate, onSelect, onMove }) => {
  const [dragging, setDragging] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);

  const handleDrop = (opportunityId, stage) => {
    setDropTarget(null);
    setDragging(null);

    if (!opportunityId || !canUpdate) return;

    const source = columns.find(c => c.opportunities.some(o => String(o.id) === opportunityId));
    if (!source || source.code === stage) return;

    onMove?.(opportunityId, stage);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-space-md">
      {columns.map((column, index) => {
        const style = STAGE_STYLES[column.code] ?? STAGE_STYLES.PROSPECTING;
        const isTarget = dropTarget === column.code;
        const isWon = column.code === 'WON';

        return (
          <div
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
              'flex flex-col space-y-space-sm p-space-sm rounded-xl min-h-[480px] transition-colors',
              isWon ? 'bg-emerald-50/50 border border-emerald-200' : 'bg-surface-container-low border border-transparent',
              isTarget && !isWon ? 'border-secondary bg-blue-50/50' : '',
              isTarget && isWon ? 'border-emerald-500 bg-emerald-100/50' : ''
            ].join(' ')}
          >
            {/* ── En-tête de colonne ──────────────────────────────────── */}
            <div className={`flex items-center justify-between px-space-xs py-1 border-b pb-2 ${isWon ? 'border-emerald-200' : 'border-outline-variant/20'}`}>
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: isWon ? '#059669' : style.accent }}
                />
                <span className={`font-label-md text-label-md font-bold ${isWon ? 'text-emerald-900' : 'text-primary'}`}>
                  {index + 1}. {column.label}
                </span>
                <span className={`px-1.5 py-0.2 rounded-full font-label-sm text-[11px] font-bold ${isWon ? 'bg-emerald-200 text-emerald-900' : 'bg-surface-container text-on-surface-variant'}`}>
                  {column.count}
                </span>
              </div>
              <div className="text-right">
                <div className={`font-label-sm text-[11px] font-bold ${isWon ? 'text-emerald-900' : 'text-primary'}`}>
                  {formatAmountCompact(column.totalAmount)}
                </div>
                {column.weightedAmount > 0 && !isWon && (
                  <div className="text-[10px] text-on-surface-variant">
                    Pondéré: {formatAmountCompact(column.weightedAmount)}
                  </div>
                )}
                {isWon && (
                  <div className="text-[10px] text-emerald-700">100% Signé</div>
                )}
              </div>
            </div>

            {/* ── Cartes ──────────────────────────────────────────────── */}
            <div className="space-y-space-sm flex-1 overflow-y-auto max-h-[62vh]">
              {column.opportunities.length === 0 && (
                <p className="text-[11px] text-on-surface-variant text-center py-8">
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
                  isWon={isWon}
                  onAdvance={(stage) => onMove?.(opportunity.id, stage)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PipelineBoard;
