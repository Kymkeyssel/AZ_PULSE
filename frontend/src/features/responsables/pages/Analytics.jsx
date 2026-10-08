import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { analyticsService } from '../../../services/api';
import { formatAmountCompact } from '../lib/format';

const KpiCard = ({ label, value, hint, icon, colorClass, bgClass }) => (
  <motion.div 
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl border border-[#dde3ef] p-5 shadow-sm hover:shadow-md transition-all flex items-start justify-between"
  >
    <div>
      <p className="text-2xl font-black text-[#001026] tracking-tight">{value}</p>
      <p className="text-xs font-bold uppercase tracking-wider text-[#6b7a99] mt-1">{label}</p>
      {hint && <p className="text-[11px] text-[#6b7a99] font-medium mt-2 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 inline-block">{hint}</p>}
    </div>
    {icon && (
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bgClass || 'bg-blue-50'} ${colorClass || 'text-blue-600'}`}>
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </div>
    )}
  </motion.div>
);

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchKpis = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await analyticsService.getKpis();
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setError("Impossible d'extraire les données d'analyse.");
      }
    } catch (err) {
      setError(err.message || 'Indicateurs indisponibles (permission analytics.read requise).');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKpis();
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto space-y-8">
      {/* En-tête */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#001026] tracking-tight">Analytics & Intelligence Opérationnelle</h1>
          <p className="text-sm text-[#6b7a99] mt-1">
            Indicateurs consolidés en temps réel issus des moteurs CRM, Workspace Projets, Knowledge Hub et IT.
          </p>
        </div>
        <button 
          onClick={fetchKpis}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-[#004ad1] bg-[#eff6ff] hover:bg-blue-100 transition-colors self-start sm:self-auto"
        >
          <span className={`material-symbols-outlined text-[18px] ${loading ? 'animate-spin' : ''}`}>sync</span>
          Actualiser Indicateurs
        </button>
      </header>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-lg mx-auto">
          <span className="material-symbols-outlined text-red-500 text-3xl mb-2">error_outline</span>
          <h3 className="text-red-700 font-bold text-sm mb-1">Erreur de chargement des Analytics</h3>
          <p className="text-xs text-red-600 mb-4">{error}</p>
          <button onClick={fetchKpis} className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-red-700">
            Réessayer
          </button>
        </div>
      ) : loading || !data ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-[#dde3ef]">
          <span className="material-symbols-outlined animate-spin text-3xl text-blue-600 mb-2">sync</span>
          <p className="text-sm font-medium text-[#6b7a99]">Calcul en temps réel des KPI multi-référentiels...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Section CRM */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">payments</span>
              <h2 className="text-base font-extrabold text-[#001026]">Performance Commerciale (CRM)</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <KpiCard label="Prospects Actifs" value={data.crm.prospects} icon="group" colorClass="text-blue-600" bgClass="bg-blue-50" />
              <KpiCard label="Clients Convertis" value={data.crm.clients} hint="PROSPECT → CLIENT sur opportunité gagnée" icon="verified" colorClass="text-emerald-600" bgClass="bg-emerald-50" />
              <KpiCard label="Valeur du Pipeline" value={formatAmountCompact(data.crm.pipelineValue)} icon="trending_up" colorClass="text-indigo-600" bgClass="bg-indigo-50" />
              <KpiCard label="Chiffre d'Affaires Signé" value={formatAmountCompact(data.crm.wonValue)} hint={`${data.crm.wonOpportunities} affaire(s) gagnée(s)`} icon="workspace_premium" colorClass="text-amber-600" bgClass="bg-amber-50" />
            </div>
          </section>

          {/* Section Workspace */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-600">folder_special</span>
              <h2 className="text-base font-extrabold text-[#001026]">Exécution Projets (Workspace)</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <KpiCard label="Total Projets" value={data.workspace.projects} icon="folder" colorClass="text-slate-700" bgClass="bg-slate-100" />
              <KpiCard label="Projets en cours" value={data.workspace.activeProjects} icon="play_circle" colorClass="text-blue-600" bgClass="bg-blue-50" />
              <KpiCard label="Tâches Ouvertes" value={data.workspace.openTasks} icon="checklist" colorClass="text-purple-600" bgClass="bg-purple-50" />
              <KpiCard label="Tâches en Retard" value={data.workspace.overdueTasks} hint="Nécessite attention managériale" icon="warning" colorClass="text-red-600" bgClass="bg-red-50" />
            </div>
          </section>

          {/* Section Knowledge & IT */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-600">menu_book</span>
              <h2 className="text-base font-extrabold text-[#001026]">Capitalisation Connaissances & Support IT</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <KpiCard label="Documents Publiés" value={data.knowledge.published} icon="article" colorClass="text-emerald-600" bgClass="bg-emerald-50" />
              <KpiCard label="Brouillons en Rédaction" value={data.knowledge.drafts} icon="edit_note" colorClass="text-amber-600" bgClass="bg-amber-50" />
              <KpiCard label="Incidents IT Ouverts" value={data.it.openIncidents} hint="Tickets GLPI / Support" icon="dns" colorClass="text-rose-600" bgClass="bg-rose-50" />
            </div>
          </section>

          <footer className="pt-4 border-t border-slate-200 text-right">
            <p className="text-[11px] text-[#6b7a99] font-medium">
              Données certifiées Symfony • Horodatage: {new Date(data.generatedAt).toLocaleString('fr-FR')}
            </p>
          </footer>
        </div>
      )}
    </div>
  );
};

export default Analytics;
