import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../../contexts/AuthContext';
import { crmService } from '../../../services/api';
import PipelineBoard from '../components/crm/PipelineBoard';
import OpportunityForm from '../components/crm/OpportunityForm';
import AIInsightsWidget from '../components/AIInsightsWidget';
import AIChatDrawer from '../components/AIChatDrawer';
import { formatAmountCompact, STAGE_STYLES, STAGE_ORDER } from '../lib/format';

/** Pipeline vide : état neutre quand l'API ne répond pas. */
const EMPTY = {
  scope: 'mine',
  columns: [],
  totals: { count: 0, totalAmount: 0, weightedAmount: 0 },
};

const CrmPipeline = () => {
  const { hasPermission, user } = useAuth();

  const canUpdate = hasPermission('crm.update');
  const canCreate = hasPermission('crm.create');
  const canManage = hasPermission('crm.manage');

  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [scope, setScope] = useState('mine');
  const [includeClosed, setIncludeClosed] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  const loading = !loaded;

  const load = useCallback(async () => {
    try {
      const res = await crmService.getPipeline({ scope, includeClosed });
      setData(res.data);
    } catch (err) {
      setData(EMPTY);
      toast.error(err.message || 'Chargement du pipeline impossible.');
    } finally {
      setLoaded(true);
    }
  }, [scope, includeClosed]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  /**
   * Déplacement d'une affaire. Le serveur applique les règles métier
   * (gagné → conversion client, probabilité à 100).
   */
  const handleMove = async (opportunityId, stage) => {
    try {
      await crmService.changeStage(opportunityId, stage);
      toast.success(
        stage === 'WON'
          ? 'Affaire gagnée : le client est converti et le projet créé.'
          : 'Affaire déplacée.'
      );
      load();
    } catch (err) {
      toast.error(err.message || 'Déplacement impossible.');
      load();
    }
  };

  const handleSaved = () => {
    setFormOpen(false);
    setEditing(null);
    toast.success(editing ? 'Affaire mise à jour.' : 'Affaire créée.');
    load();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin w-10 h-10 border-[3px] border-[#004ad1] border-t-transparent rounded-full" />
          <p className="text-[12px] text-[#74777f] font-medium">Chargement du pipeline…</p>
        </div>
      </div>
    );
  }

  const totals = data?.totals ?? { count: 0, totalAmount: 0, weightedAmount: 0 };
  const convRate =
    totals.totalAmount > 0
      ? Math.round((totals.weightedAmount / totals.totalAmount) * 100)
      : 0;

  return (
    <div className="flex flex-col gap-6">

      {/* ── 1. BANNIÈRE HERO ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#001026] via-[#0b2545] to-[#001026] text-white shadow-xl p-6 lg:p-8">
        {/* Orbes de fond */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#1a62fe]/10 blur-3xl pointer-events-none" />
        <div className="absolute right-48 -bottom-24 w-64 h-64 rounded-full bg-[#ffba20]/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffba20] animate-pulse" />
              CRM & Pipeline Commercial
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              Pipeline commercial
            </h1>
            <p className="text-[14px] text-[#778db2]">
              {data?.scope === 'all'
                ? 'Portefeuille complet de l\'équipe'
                : 'Vos affaires en cours · Suivi et prédictions IA'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center gap-3">
            {/* Badge AI Copilot */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-md text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[12px] font-semibold">IA Opérationnelle</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAiChatOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a62fe] hover:bg-[#004ad1] text-white text-[13px] font-bold shadow-md hover:shadow-[#004ad1]/30 transition-all duration-200"
              >
                <span className="material-symbols-outlined notranslate text-[18px] animate-pulse">auto_awesome</span>
                Assistant IA
              </button>

              {canCreate && (
                <button
                  onClick={() => { setEditing(null); setFormOpen(true); }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ffba20] hover:bg-[#f59e0b] text-[#001026] text-[13px] font-bold shadow-md transition-all duration-200"
                >
                  <span className="material-symbols-outlined notranslate text-[18px]">add</span>
                  Nouvelle affaire
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Bandeau AZ Copilot IA dans le hero ── */}
        <div className="relative z-10 mt-5 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#ffba20]/20 flex items-center justify-center text-[#ffba20] flex-shrink-0">
              <span className="material-symbols-outlined notranslate text-[20px]">auto_awesome</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-bold text-white">Synthèse Prédictive AZ Copilot</span>
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-wide">
                  En ligne
                </span>
              </div>
              <p className="text-[12px] text-[#778db2] mt-0.5">
                {totals.count > 0
                  ? `${totals.count} affaires actives • ${formatAmountCompact(totals.weightedAmount)} pondéré prévisible • Taux réussite ${convRate}%`
                  : 'Aucune affaire active en cours. Créez votre première opportunité.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAiChatOpen(true)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[12px] font-semibold transition-colors flex-shrink-0"
          >
            <span className="material-symbols-outlined notranslate text-[16px]">insights</span>
            Détails prédictifs
          </button>
        </div>
      </section>

      {/* ── 2. KPIs ──────────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Affaires ouvertes',
            value: totals.count,
            icon: 'hub',
            sub: 'Actives dans le pipeline',
            color: 'text-[#004ad1]',
            bg: 'bg-[#dce1ff]',
          },
          {
            label: 'Montant brut',
            value: formatAmountCompact(totals.totalAmount),
            icon: 'payments',
            sub: 'Total pipeline',
            color: 'text-[#001026]',
            bg: 'bg-[#eaeef2]',
          },
          {
            label: 'Pondéré IA',
            value: formatAmountCompact(totals.weightedAmount),
            icon: 'auto_awesome',
            sub: 'Montant × probabilité',
            color: 'text-[#004ad1]',
            bg: 'bg-[#dce1ff]',
          },
          {
            label: 'Taux de réussite',
            value: totals.totalAmount > 0 ? `${convRate}%` : '—',
            icon: 'show_chart',
            sub: 'Taux pondéré moyen',
            color: convRate >= 60 ? 'text-emerald-600' : 'text-[#001026]',
            bg: convRate >= 60 ? 'bg-emerald-50' : 'bg-[#eaeef2]',
          },
        ].map((kpi, i) => (
          <div
            key={i}
            className="group rounded-2xl bg-white border border-[#dfe3e7] p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#44474e]">
                {kpi.label}
              </span>
              <div className={`w-8 h-8 rounded-xl ${kpi.bg} flex items-center justify-center ${kpi.color} group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined notranslate text-[18px]">{kpi.icon}</span>
              </div>
            </div>
            <div className="flex flex-col gap-0.5 mt-3">
              <span className={`text-2xl font-extrabold tracking-tight ${kpi.color}`}>
                {kpi.value}
              </span>
              <span className="text-[11px] text-[#74777f]">{kpi.sub}</span>
            </div>
          </div>
        ))}
      </section>

      {/* ── 3. WIDGET IA INSIGHTS ────────────────────────────────────── */}
      <AIInsightsWidget
        metrics={{
          count: totals.count,
          totalAmount: totals.totalAmount,
          weightedAmount: totals.weightedAmount,
          conversionRate: convRate,
          scope,
        }}
        scope="CRM & Pipeline commercial"
        title="Diagnostic & Prédictions Pipeline IA"
      />

      {/* ── 4. FILTRES ──────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white border border-[#dfe3e7] shadow-sm p-4">
        {canManage && (
          <div className="flex rounded-lg border border-[#c4c6cf] overflow-hidden">
            {[
              { value: 'mine', label: 'Mes affaires' },
              { value: 'all', label: 'Tout le portefeuille' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => { setScope(opt.value); setLoaded(false); }}
                className={[
                  'px-4 py-2 text-[12px] font-bold transition-colors',
                  scope === opt.value
                    ? 'bg-[#001026] text-white'
                    : 'text-[#44474e] hover:bg-[#f0f4f8]',
                ].join(' ')}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        <label className="flex items-center gap-2 text-[12px] text-[#44474e] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={includeClosed}
            onChange={e => { setIncludeClosed(e.target.checked); setLoaded(false); }}
            className="accent-[#004ad1] w-3.5 h-3.5"
          />
          Afficher les affaires gagnées et perdues
        </label>

        {canUpdate && (
          <p className="text-[11px] text-[#74777f] flex items-center gap-1.5 ml-auto">
            <span className="material-symbols-outlined notranslate text-[15px]">drag_indicator</span>
            Glissez une carte pour changer d&apos;étape
          </p>
        )}
      </div>

      {/* ── 5. KANBAN ──────────────────────────────────────────────── */}
      <section className="rounded-2xl bg-white border border-[#dfe3e7] shadow-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#dce1ff] flex items-center justify-center text-[#004ad1]">
              <span className="material-symbols-outlined notranslate text-[20px]">view_kanban</span>
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-[#001026]">Tableau Kanban</h2>
              <p className="text-[11px] text-[#74777f]">
                {totals.count} affaire{totals.count !== 1 ? 's' : ''} en cours
              </p>
            </div>
          </div>
          {totals.count > 0 && !includeClosed && (
            <p className="text-[11px] text-[#74777f] hidden md:block">
              Cycle&nbsp;:{' '}
              {STAGE_ORDER.slice(0, 4)
                .map(s => STAGE_STYLES[s].label)
                .join(' → ')}{' '}
              → Gagné
            </p>
          )}
        </div>

        {totals.count === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#c4c6cf] py-20 flex flex-col items-center gap-3 text-center">
            <span className="material-symbols-outlined notranslate text-[48px] text-[#c4c6cf]">
              ads_click
            </span>
            <p className="text-[14px] font-bold text-[#001026]">Aucune affaire en cours</p>
            <p className="text-[12px] text-[#74777f] max-w-xs">
              {canCreate
                ? 'Créez votre première affaire pour la suivre jusqu\'au gain.'
                : 'Les affaires apparaîtront ici dès qu\'elles seront saisies.'}
            </p>
            {canCreate && (
              <button
                onClick={() => { setEditing(null); setFormOpen(true); }}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#004ad1] text-white text-[13px] font-bold hover:bg-[#003cac] transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined notranslate text-[18px]">add</span>
                Nouvelle affaire
              </button>
            )}
          </div>
        ) : (
          <PipelineBoard
            columns={data?.columns ?? []}
            canUpdate={canUpdate}
            onSelect={opp => { setEditing(opp); setFormOpen(true); }}
            onMove={handleMove}
          />
        )}
      </section>

      {/* ── 6. MODAL D'ÉDITION ─────────────────────────────────────── */}
      {formOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#001026]/60 backdrop-blur-sm"
            onClick={() => { setFormOpen(false); setEditing(null); }}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <header className="px-6 py-5 border-b border-[#eaeef2]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#dce1ff] flex items-center justify-center text-[#004ad1]">
                  <span className="material-symbols-outlined notranslate text-[20px]">
                    {editing ? 'edit' : 'add_circle'}
                  </span>
                </div>
                <div>
                  <h2 className="text-[15px] font-extrabold text-[#001026]">
                    {editing ? 'Modifier l\'affaire' : 'Nouvelle affaire'}
                  </h2>
                  <p className="text-[11px] text-[#74777f] mt-0.5">
                    {editing
                      ? `Étape actuelle : ${STAGE_STYLES[editing.stage]?.label ?? editing.stage}`
                      : 'Elle démarre en prospection.'}
                  </p>
                </div>
              </div>
            </header>

            <div className="px-6 py-5">
              <OpportunityForm
                key={editing?.id ?? 'nouvelle'}
                opportunity={editing}
                onSaved={handleSaved}
                onCancel={() => { setFormOpen(false); setEditing(null); }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── 7. CHAT ASSISTANT IA ───────────────────────────────────── */}
      <AIChatDrawer
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        currentContext={{
          module: 'CRM_PIPELINE',
          totals,
          scope,
        }}
      />
    </div>
  );
};

export default CrmPipeline;
