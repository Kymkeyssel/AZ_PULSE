import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../../contexts/AuthContext';
import { crmService } from '../../../services/api';
import PipelineBoard from '../components/crm/PipelineBoard';
import OpportunityForm from '../components/crm/OpportunityForm';
import { formatAmountCompact, STAGE_STYLES, STAGE_ORDER } from '../lib/format';

/**
 * Pipeline commercial.
 *
 * Un seul écran pour tous les postes : ce qui change d'un profil à l'autre
 * vient des permissions (`crm.update` active le glisser-déposer,
 * `crm.manage` débloque la vue portefeuille), pas d'un fichier dupliqué.
 */

/** Pipeline vide : état neutre quand l'API ne répond pas. */
const EMPTY = { scope: 'mine', columns: [], totals: { count: 0, totalAmount: 0, weightedAmount: 0 } };

const CrmPipeline = () => {
  const { hasPermission } = useAuth();

  const canUpdate = hasPermission('crm.update');
  const canCreate = hasPermission('crm.create');
  const canManage = hasPermission('crm.manage');

  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [scope, setScope] = useState('mine');
  const [includeClosed, setIncludeClosed] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // Le contenu fait foi : tant qu'il est absent, on affiche le chargement.
  // Éviter un `setLoading(true)` dans l'effet supprime un rendu en cascade.
  const loading = !loaded;

  const load = useCallback(async () => {
    try {
      const res = await crmService.getPipeline({ scope, includeClosed });
      setData(res.data);
    } catch (err) {
      // Un échec doit afficher un état vide, pas un chargement infini.
      setData(EMPTY);
      toast.error(err.message || 'Chargement du pipeline impossible.');
    } finally {
      setLoaded(true);
    }
  }, [scope, includeClosed]);

  useEffect(() => {
    // Les mises à jour d'état de `load` ont toutes lieu après un `await`,
    // donc hors du rendu courant : aucun rendu en cascade. Le linter ne
    // descend pas dans la fonction asynchrone pour le vérifier.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  /**
   * Déplacement d'une affaire. Le serveur applique les règles métier
   * (gagné → conversion client, probabilité à 100), on recharge pour voir
   * le nouvel état plutôt que de le deviner côté interface.
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
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin w-9 h-9 border-4 border-[#004ad1] border-t-transparent rounded-full" />
      </div>
    );
  }

  const totals = data?.totals ?? { count: 0, totalAmount: 0, weightedAmount: 0 };

  return (
    <div className="max-w-[1600px] mx-auto space-y-5">

      {/* ── En-tête ─────────────────────────────────────────────────────── */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#001026]">
            Pipeline commercial
          </h1>
          <p className="text-sm text-[#6b7a99] mt-1">
            {data?.scope === 'all'
              ? 'Portefeuille complet de l\u2019équipe'
              : 'Vos affaires en cours'}
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => { setEditing(null); setFormOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0b2545] text-white text-sm font-bold hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined notranslate text-[18px]">add</span>
            Nouvelle affaire
          </button>
        )}
      </header>

      {/* ── Indicateurs ─────────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-[#dde3ef] p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#6b7a99]">Affaires ouvertes</p>
          <p className="text-2xl font-black text-[#001026] mt-1.5">{totals.count}</p>
        </div>

        <div className="bg-white rounded-xl border border-[#dde3ef] p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#6b7a99]">Montant brut</p>
          <p className="text-2xl font-black text-[#001026] mt-1.5">
            {formatAmountCompact(totals.totalAmount)}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[#dde3ef] p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#6b7a99]">Pondéré</p>
          <p className="text-2xl font-black text-[#004ad1] mt-1.5">
            {formatAmountCompact(totals.weightedAmount)}
          </p>
          <p className="text-[10px] text-[#94a3b8] mt-0.5">montant × probabilité</p>
        </div>

        <div className="bg-white rounded-xl border border-[#dde3ef] p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#6b7a99]">Taux de réussite</p>
          <p className="text-2xl font-black text-[#001026] mt-1.5">
            {totals.totalAmount > 0
              ? `${Math.round((totals.weightedAmount / totals.totalAmount) * 100)}%`
              : '—'}
          </p>
        </div>
      </section>

      {/* ── Filtres ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-4">
        {canManage && (
          <div className="flex rounded-lg border border-[#dde3ef] overflow-hidden bg-white">
            {[
              { value: 'mine', label: 'Mes affaires' },
              { value: 'all', label: 'Tout le portefeuille' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => { setScope(opt.value); setLoaded(false); }}
                className={[
                  'px-3.5 py-2 text-xs font-bold transition-colors',
                  scope === opt.value
                    ? 'bg-[#0b2545] text-white'
                    : 'text-[#6b7a99] hover:bg-[#f4f7fb]',
                ].join(' ')}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        <label className="flex items-center gap-2 text-xs text-[#6b7a99] cursor-pointer">
          <input
            type="checkbox"
            checked={includeClosed}
            onChange={e => { setIncludeClosed(e.target.checked); setLoaded(false); }}
            className="accent-[#004ad1]"
          />
          Afficher les affaires gagnées et perdues
        </label>

        {canUpdate && (
          <p className="text-[11px] text-[#94a3b8] flex items-center gap-1.5 ml-auto">
            <span className="material-symbols-outlined notranslate text-[15px]">drag_indicator</span>
            Glissez une carte pour changer d&apos;étape
          </p>
        )}
      </div>

      {/* ── Kanban ──────────────────────────────────────────────────────── */}
      {totals.count === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-[#cbd5e1] py-16 text-center">
          <span className="material-symbols-outlined notranslate text-[40px] text-[#cbd5e1]">ads_click</span>
          <p className="text-sm font-bold text-[#0b2545] mt-3">Aucune affaire en cours</p>
          <p className="text-xs text-[#6b7a99] mt-1">
            {canCreate
              ? 'Créez votre première affaire pour la suivre jusqu\u2019au gain.'
              : 'Les affaires apparaîtront ici dès qu\u2019elles seront saisies.'}
          </p>
        </div>
      ) : (
        <PipelineBoard
          columns={data?.columns ?? []}
          canUpdate={canUpdate}
          onSelect={opp => { setEditing(opp); setFormOpen(true); }}
          onMove={handleMove}
        />
      )}

      {/* ── Modal d'édition ─────────────────────────────────────────────── */}
      {formOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#001026]/50 backdrop-blur-sm"
            onClick={() => { setFormOpen(false); setEditing(null); }}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <header className="px-6 py-4 border-b border-[#dde3ef]">
              <h2 className="text-base font-extrabold text-[#001026]">
                {editing ? 'Modifier l\u2019affaire' : 'Nouvelle affaire'}
              </h2>
              <p className="text-[11px] text-[#6b7a99] mt-0.5">
                {editing
                  ? `Étape actuelle : ${STAGE_STYLES[editing.stage]?.label ?? editing.stage}`
                  : 'Elle démarre en prospection, vous ferez évoluer l\u2019étape ensuite.'}
              </p>
            </header>

            <div className="px-6 py-5">
              <OpportunityForm
                // La key force le remontage : le formulaire prend ses valeurs
                // initiales dans l'affaire éditée, sans effet de recopie.
                key={editing?.id ?? 'nouvelle'}
                opportunity={editing}
                onSaved={handleSaved}
                onCancel={() => { setFormOpen(false); setEditing(null); }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Aide : ordre des étapes ─────────────────────────────────────── */}
      {totals.count > 0 && !includeClosed && (
        <p className="text-[11px] text-[#94a3b8] text-center">
          Cycle : {STAGE_ORDER.slice(0, 4).map(s => STAGE_STYLES[s].label).join(' → ')}
          {' → '}Gagné
        </p>
      )}
    </div>
  );
};

export default CrmPipeline;
