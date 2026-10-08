import { useState, useEffect } from 'react';
import { workspaceService } from '../../../services/api';
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

  useEffect(() => {
    workspaceService.listProjects()
      .then((res) => setProjects(res.data || []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto space-y-6 p-2">
      <header>
        <h1 className="text-2xl font-extrabold text-[#001026]">Mes projets</h1>
        <p className="text-sm text-[#6b7a99] mt-1">
          {fullName ? `${fullName} — ` : ''}projets rattachés à votre fiche client (email du compte = email du client CRM).
        </p>
      </header>
      {loading ? (
        <p className="text-sm text-[#6b7a99]">Chargement…</p>
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
              <p className="text-sm text-[#6b7a99] mt-2">Avancement {p.progress || 0}% · {p.manager_name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientProjects;
