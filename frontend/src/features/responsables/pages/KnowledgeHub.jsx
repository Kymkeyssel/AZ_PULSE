import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../../contexts/AuthContext';
import { knowledgeService, workspaceService } from '../../../services/api';

const KnowledgeHub = () => {
  const { hasPermission } = useAuth();
  const canRead = hasPermission('knowledge.read');
  const canWrite = hasPermission('knowledge.write');
  const canPublish = hasPermission('knowledge.publish');

  const [documents, setDocuments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState('');
  const [file, setFile] = useState(null);

  const load = async (q = search) => {
    setLoading(true);
    try {
      const res = await knowledgeService.listDocuments({ q: q || undefined });
      setDocuments(res.data || []);
    } catch {
      toast.error('Impossible de charger les documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!canRead) return;
    load('');
    workspaceService.listProjects().then((res) => setProjects(res.data || [])).catch(() => {});
  }, [canRead]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Choisissez un fichier');
    setUploading(true);
    try {
      await knowledgeService.uploadDocument(file, { title: title || file.name.replace(/\.[^.]+$/, ''), project_id: projectId || undefined });
      toast.success('Document déposé en brouillon');
      setFile(null);
      setTitle('');
      await load();
    } catch {
      toast.error('Échec du dépôt');
    } finally {
      setUploading(false);
    }
  };

  const handlePublish = async (id) => {
    try {
      await knowledgeService.publishDocument(id);
      toast.success('Document publié');
      await load();
    } catch {
      toast.error('Publication impossible');
    }
  };

  if (!canRead) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-red-100">
        <h2 className="text-red-600 font-bold mb-2">Accès refusé</h2>
        <p className="text-sm text-slate-500">Permission knowledge.read requise.</p>
      </div>
    );
  }

  const published = documents.filter((d) => d.status === 'PUBLISHED').length;
  const drafts = documents.filter((d) => d.status !== 'PUBLISHED').length;

  return (
    <div className="max-w-screen-xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold text-[#001026]">Knowledge Hub</h1>
        <p className="text-sm text-[#6b7a99] mt-1">Documents, publication et recherche depuis la source Symfony.</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#dde3ef] p-5">
          <p className="text-2xl font-black">{documents.length}</p>
          <p className="text-xs uppercase text-[#6b7a99] font-semibold">Documents visibles</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#dde3ef] p-5">
          <p className="text-2xl font-black">{published}</p>
          <p className="text-xs uppercase text-[#6b7a99] font-semibold">Publiés</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#dde3ef] p-5">
          <p className="text-2xl font-black">{drafts}</p>
          <p className="text-xs uppercase text-[#6b7a99] font-semibold">Brouillons</p>
        </div>
      </section>

      <div className="bg-white rounded-2xl border border-[#dde3ef] p-4 flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load(search)}
          placeholder="Rechercher un titre ou un nom de fichier…"
          className="flex-1 border border-[#dde3ef] rounded-lg px-3 py-2 text-sm"
        />
        <button type="button" onClick={() => load(search)} className="px-4 py-2 rounded-lg bg-[#0b2545] text-white text-sm font-bold">
          Rechercher
        </button>
      </div>

      {canWrite && (
        <form onSubmit={handleUpload} className="bg-white rounded-2xl border border-[#dde3ef] p-5 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <label className="text-sm font-semibold md:col-span-1">
            Titre
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2 font-normal" />
          </label>
          <label className="text-sm font-semibold">
            Projet lié
            <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2 font-normal">
              <option value="">Aucun</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold">
            Fichier
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mt-1 w-full text-sm font-normal" />
          </label>
          <button disabled={uploading} className="px-4 py-2 rounded-lg bg-[#004ad1] text-white text-sm font-bold">
            {uploading ? 'Dépôt…' : 'Déposer'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-[#dde3ef] overflow-hidden">
        {loading ? (
          <p className="p-6 text-sm text-[#6b7a99]">Chargement…</p>
        ) : documents.length === 0 ? (
          <p className="p-6 text-sm text-[#6b7a99]">Aucun document. Déposez un fichier pour commencer.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#f4f7fb] text-left text-xs uppercase text-[#6b7a99]">
              <tr>
                <th className="p-3">Titre</th>
                <th className="p-3">Statut</th>
                <th className="p-3">Projet</th>
                <th className="p-3">Auteur</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {documents.map((d) => (
                <tr key={d.id} className="border-t border-[#dde3ef]">
                  <td className="p-3 font-semibold text-[#001026]">{d.title}</td>
                  <td className="p-3">{d.status}</td>
                  <td className="p-3 text-[#6b7a99]">{d.project?.name || '—'}</td>
                  <td className="p-3 text-[#6b7a99]">{d.owner_name}</td>
                  <td className="p-3 text-right space-x-2">
                    {d.status !== 'PUBLISHED' && canPublish && (
                      <button type="button" onClick={() => handlePublish(d.id)} className="text-[#004ad1] font-bold">Publier</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default KnowledgeHub;
