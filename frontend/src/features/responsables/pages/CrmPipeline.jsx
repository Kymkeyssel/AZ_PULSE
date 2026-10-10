import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { crmService } from '../../../services/api';
import PipelineBoard from '../components/crm/PipelineBoard';
import OpportunityForm from '../components/crm/OpportunityForm';
import CrmKpiCards from '../components/crm/CrmKpiCards';
import CrmRemindersWidget from '../components/crm/CrmRemindersWidget';

const EMPTY = { scope: 'mine', columns: [], totals: { count: 0, totalAmount: 0, weightedAmount: 0 } };

const CrmPipeline = () => {
  const { hasPermission } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const workspacePath = location.pathname.startsWith('/superadmin') ? '/superadmin/workspace' : location.pathname.startsWith('/admin') ? '/admin/workspace' : location.pathname.startsWith('/collaborateur') ? '/collaborateur/projets' : '/responsable/projets';

  const canUpdate = hasPermission('crm.update');
  const canCreate = hasPermission('crm.create');
  const canManage = hasPermission('crm.manage');

  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [scope, setScope] = useState('mine');
  const [includeClosed, setIncludeClosed] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [pendingOpportunityId, setPendingOpportunityId] = useState(null);

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
    load();
  }, [load]);

  const handleMove = async (opportunityId, stage, transition) => {
    if (pendingOpportunityId) return false;
    setPendingOpportunityId(opportunityId);
    try {
      const result = await crmService.changeStage(opportunityId, stage, transition);
      if (stage === 'WON') {
        if (!result?.data?.project?.id) throw new Error('Le serveur n’a pas confirmé la création du projet Workspace.');
        setIncludeClosed(true);
        toast.success(`Affaire gagnée · projet « ${result.data.project.name} » créé.`, { action: { label: 'Ouvrir le projet', onClick: () => navigate(workspacePath) } });
      } else if (stage === 'LOST') toast.success('Affaire clôturée. Le motif est conservé dans son historique.');
      else toast.success('Étape validée. Une relance a été ajoutée à votre agenda CRM.');
      await load();
      return true;
    } catch (err) {
      toast.error(err.message || 'Déplacement impossible.');
      await load();
      return false;
    } finally {
      setPendingOpportunityId(null);
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
        <div className="animate-spin w-9 h-9 border-4 border-secondary border-t-transparent rounded-full" />
      </div>
    );
  }

  const totals = data?.totals ?? { count: 0, totalAmount: 0, weightedAmount: 0 };

  return (
    <main className="w-full bg-surface-container-lowest flex-1 px-gutter py-gutter max-w-[1600px] mx-auto">
      <div className="flex flex-col w-full space-y-gutter animate-fade-in" id="tab-crm-dashboard">
        
        {/* Top Title & Global Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-md">
          <div className="flex flex-col space-y-space-xs">
            <div className="flex items-center gap-space-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">Cockpit Responsable Commercial</span>
              <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Gestion des opportunités · synchronisée</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-primary font-extrabold tracking-tight">
              Espace Responsable Commercial & Workspace Projets
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
              Gestion 360° du cycle prospect-client, vélocité du funnel, conversion automatique vers Projets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-space-sm">
            {canCreate && (
              <button 
                className="flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-lg text-label-lg transition-all shadow-sm"
                onClick={() => { setEditing(null); setFormOpen(true); }}
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>+ Créer Opportunité</span>
              </button>
            )}
            <Link 
              to="/responsable/projets"
              className="p-2.5 rounded-lg bg-surface-container text-on-surface-variant hover:text-secondary hover:bg-surface-container-high transition-colors"
              title="Basculer vers Workspace Projets"
            >
              <span className="material-symbols-outlined text-[20px]">account_tree</span>
            </Link>
          </div>
        </div>

        <section className="rounded-2xl border border-blue-100/80 bg-gradient-to-r from-white/90 via-blue-50/80 to-cyan-50/80 backdrop-blur-xl p-4 sm:p-5 shadow-[0_12px_40px_rgba(29,99,255,.08)]">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div><p className="text-[10px] font-black uppercase tracking-[.18em] text-blue-600">Parcours commercial</p><h2 className="text-sm sm:text-base font-extrabold text-slate-900 mt-1">Du premier contact au projet livré</h2></div>
            <span className="hidden sm:inline-flex glass-chip text-emerald-700"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/> Flux connecté</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-3">
            {[
              ['01', 'Prospect', 'Créer le contact', 'person_add', 'from-sky-500 to-blue-600'],
              ['02', 'Qualification', 'Évaluer le besoin', 'manage_search', 'from-blue-500 to-indigo-600'],
              ['03', 'Proposition', 'Partager une offre', 'request_quote', 'from-violet-500 to-fuchsia-600'],
              ['04', 'Négociation', 'Suivre la décision', 'handshake', 'from-amber-400 to-orange-500'],
              ['05', 'Gagnée → projet', 'Workspace créé automatiquement', 'rocket_launch', 'from-emerald-400 to-teal-600'],
            ].map(([number, title, caption, icon, color], index) => <div key={number} className="relative min-h-[106px] rounded-xl border border-white/80 bg-white/70 p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} text-white grid place-items-center shadow-md`}><span className="material-symbols-outlined text-[17px]">{icon}</span></div>
              <p className="text-[11px] font-extrabold text-slate-900 mt-2">{number}. {title}</p><p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{caption}</p>
              {index < 4 && <span className="hidden md:block absolute -right-3 top-7 z-10 material-symbols-outlined text-blue-300 text-[18px]">arrow_forward</span>}
            </div>)}
          </div>
        </section>

        {/* KPI METIER CRM */}
        <CrmKpiCards totals={totals} scope={scope} onScopeChange={setScope} />

        {/* SECTION PIPELINE KANBAN INTERACTIF */}
        <div className="flex flex-col space-y-space-md">
          <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-md">
              <div className="p-2 rounded-lg bg-secondary text-on-secondary">
                <span className="material-symbols-outlined text-[22px]">view_kanban</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-headline-md text-headline-md text-primary font-bold">Pipeline Commercial Dealflow</h2>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold">Données en direct</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Chaque changement demande les informations propres à l’étape et crée une trace dans l’historique.</p>
              </div>
            </div>

            <div className="flex items-center gap-space-sm">
              {canManage && (
                <div className="flex p-0.5 rounded-lg bg-surface-container-low border border-outline-variant/30">
                  <button 
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all shadow-sm ${scope === 'mine' ? 'bg-surface-container-lowest text-primary' : 'text-on-surface-variant hover:text-primary'}`}
                    onClick={() => { setScope('mine'); setLoaded(false); }}
                  >
                    Mes affaires
                  </button>
                  <button 
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all shadow-sm ${scope === 'all' ? 'bg-surface-container-lowest text-primary' : 'text-on-surface-variant hover:text-primary'}`}
                    onClick={() => { setScope('all'); setLoaded(false); }}
                  >
                    Global Équipe
                  </button>
                </div>
              )}
              {canCreate && (
                <button 
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-secondary font-label-md text-label-md"
                  onClick={() => { setEditing(null); setFormOpen(true); }}
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>Opportunité</span>
                </button>
              )}
            </div>
          </div>

          <PipelineBoard
            columns={data?.columns ?? []}
            canUpdate={canUpdate}
            pendingOpportunityId={pendingOpportunityId}
            onSelect={opp => { setEditing(opp); setFormOpen(true); }}
            onMove={handleMove}
          />
        </div>

        {/* SECTION BASSE : WIDGET RELANCES & ACTIVITÉS 360° */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          <div className="lg:col-span-6">
            <CrmRemindersWidget />
          </div>
          <div className="lg:col-span-6">
            {/* Espace prévu pour le widget des activités */}
          </div>
        </div>

        {/* Modal d'édition */}
        {formOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-primary/50 backdrop-blur-sm"
              onClick={() => { setFormOpen(false); setEditing(null); }}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <header className="px-6 py-4 border-b border-outline-variant/20">
                <h2 className="text-base font-extrabold text-primary">
                  {editing ? 'Modifier l’affaire' : 'Nouvelle affaire'}
                </h2>
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

      </div>
    </main>
  );
};

export default CrmPipeline;
