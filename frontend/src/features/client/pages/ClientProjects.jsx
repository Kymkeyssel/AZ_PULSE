import { useState, useEffect } from 'react';
import { fetchApi } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

const STATUS = {
  PLANNED: 'Planifié',
  PENDING: 'En attente',
  IN_PROGRESS: 'En cours',
  REVIEW: 'Revue',
  COMPLETED: 'Terminé',
};

const ClientProjects = () => {
  const { fullName } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApi('/client/portal')
      .then((res) => setProjects(res.data?.projects || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto space-y-6 p-2">
      <header>
        <h1 className="text-2xl font-extrabold text-[#001026]">Mes projets</h1>
        <p className="text-sm text-[#6b7a99] mt-1">
          {fullName ? `${fullName} — ` : ''}projets et tâches rattachés à votre fiche client.
        </p>
      </header>
      {loading ? (
        <div className="animate-pulse space-y-4"><div className="h-24 rounded-2xl bg-slate-200"/><div className="h-36 rounded-2xl bg-slate-200"/></div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-white p-6 text-sm text-rose-700">Impossible de charger vos projets : {error}</div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-2xl border p-8 text-sm text-[#6b7a99]">
          Aucun projet n’est encore lié à votre compte. Une opportunité gagnée crée automatiquement un projet Workspace.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-[#dde3ef] p-5">
              <p className="text-xs font-bold uppercase text-[#004ad1]">{STATUS[p.status] || p.status}</p>
              <h2 className="text-lg font-bold mt-1">{p.name}</h2>
              <p className="text-sm text-[#6b7a99] mt-2">Avancement {p.progress || 0}%{p.manager_name ? ` · Responsable : ${p.manager_name}` : ''}</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500" style={{ width: `${Math.max(0, Math.min(100, p.progress || 0))}%` }}/></div>
              {p.description && <p className="mt-3 text-sm text-slate-600">{p.description}</p>}
              {!!p.tasks?.length && <div className="mt-4 border-t pt-3"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Tâches du projet</p><div className="mt-2 space-y-2">{p.tasks.map((task) => <div key={task.id} className="flex items-center justify-between gap-3 text-sm"><span className="text-slate-700">{task.title}</span><span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">{task.status}{task.dueDate ? ` · ${new Date(task.dueDate).toLocaleDateString('fr-FR')}` : ''}</span></div>)}</div></div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientProjects;
