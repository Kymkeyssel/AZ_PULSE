import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { incidentService } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

const statusNames = { OPEN: 'Ouvert', IN_PROGRESS: 'En cours', RESOLVED: 'Résolu', CLOSED: 'Fermé' };
const priorityNames = { CRITICAL: 'Critique', HIGH: 'Haute', MEDIUM: 'Normale', LOW: 'Basse' };

export default function ItTicketing() {
  const { hasPermission } = useAuth();
  const canManage = hasPermission('it.manage');
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('ALL');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'OTHER', priority: 'MEDIUM' });
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { const result = await incidentService.list(); setIncidents(result.data || []); }
    catch (error) { toast.error(error.message || 'Impossible de charger les incidents'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const rows = useMemo(() => incidents.filter((item) => (status === 'ALL' || item.status === status) && `${item.id} ${item.title} ${item.reporter || ''}`.toLowerCase().includes(query.toLowerCase())), [incidents, query, status]);
  const changeStatus = async (item, next) => {
    try { await incidentService.update(item.id, { status: next }); toast.success('Incident mis à jour'); await load(); }
    catch (error) { toast.error(error.message || 'Mise à jour impossible'); }
  };
  const create = async (event) => {
    event.preventDefault(); setBusy(true);
    try { await incidentService.create(form); setShowForm(false); setForm({ title: '', description: '', category: 'OTHER', priority: 'MEDIUM' }); toast.success('Incident créé'); await load(); }
    catch (error) { toast.error(error.message || 'Création impossible'); }
    finally { setBusy(false); }
  };

  const openCount = incidents.filter((item) => item.status === 'OPEN').length;
  const activeCount = incidents.filter((item) => item.status === 'IN_PROGRESS').length;
  const criticalCount = incidents.filter((item) => item.priority === 'CRITICAL' && !['RESOLVED', 'CLOSED'].includes(item.status)).length;
  return <div className="max-w-screen-xl mx-auto space-y-6 pb-12">
    <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-widest font-bold text-blue-700">Infrastructure · Support</p><h1 className="text-3xl font-black text-slate-900 mt-2">Incidents IT</h1><p className="text-sm text-slate-500 mt-2">Suivez les incidents issus du système AZ Pulse.</p></div>{canManage && <button onClick={() => setShowForm((value) => !value)} className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white">{showForm ? 'Fermer' : 'Nouvel incident'}</button>}</header>
    {showForm && <form onSubmit={create} className="bg-white border border-slate-200 rounded-2xl p-5 grid sm:grid-cols-2 gap-4"><label className="text-sm font-semibold">Titre<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="block w-full mt-1 rounded-lg border px-3 py-2"/></label><label className="text-sm font-semibold">Catégorie<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="block w-full mt-1 rounded-lg border px-3 py-2"><option value="HARDWARE">Matériel</option><option value="SOFTWARE">Logiciel</option><option value="NETWORK">Réseau</option><option value="OTHER">Autre</option></select></label><label className="text-sm font-semibold">Priorité<select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="block w-full mt-1 rounded-lg border px-3 py-2"><option value="LOW">Basse</option><option value="MEDIUM">Normale</option><option value="HIGH">Haute</option><option value="CRITICAL">Critique</option></select></label><label className="text-sm font-semibold">Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="block w-full mt-1 rounded-lg border px-3 py-2" rows="2"/></label><div className="sm:col-span-2 flex justify-end"><button disabled={busy} className="rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">{busy ? 'Création…' : 'Créer l’incident'}</button></div></form>}
    <div className="grid sm:grid-cols-3 gap-4">{[['Incidents ouverts', openCount], ['En cours', activeCount], ['Critiques à traiter', criticalCount]].map(([label, value]) => <div key={label} className="bg-white rounded-2xl border border-slate-200 p-5"><p className="text-xs uppercase font-bold text-slate-400">{label}</p><p className="text-3xl font-black mt-2 text-slate-900">{value}</p></div>)}</div>
    <section className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-3"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un incident…" className="flex-1 rounded-xl border px-4 py-2.5 text-sm"/><select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border px-4 py-2.5 text-sm"><option value="ALL">Tous les statuts</option>{Object.entries(statusNames).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select><button onClick={load} className="rounded-xl border px-4 py-2.5 text-sm font-semibold">Actualiser</button></section>
    <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-4">Incident</th><th className="px-5 py-4">Catégorie</th><th className="px-5 py-4">Priorité</th><th className="px-5 py-4">Demandeur</th><th className="px-5 py-4">Créé le</th><th className="px-5 py-4">Statut</th></tr></thead><tbody className="divide-y">{loading ? <tr><td colSpan="6" className="p-8 text-center text-slate-500">Chargement des incidents…</td></tr> : rows.length ? rows.map((item) => <tr key={item.id} className="hover:bg-slate-50"><td className="px-5 py-4"><p className="font-bold text-slate-900">{item.title}</p><p className="text-xs text-slate-500 mt-1">#{item.id} · {item.description}</p></td><td className="px-5 py-4 text-slate-600">{item.category}</td><td className="px-5 py-4 font-semibold">{priorityNames[item.priority] || item.priority}</td><td className="px-5 py-4 text-slate-600">{item.reporter || '—'}</td><td className="px-5 py-4 text-slate-500">{item.createdAt ? new Date(item.createdAt).toLocaleDateString('fr-FR') : '—'}</td><td className="px-5 py-4">{canManage ? <select aria-label={`Statut incident ${item.id}`} value={item.status} onChange={(e) => changeStatus(item, e.target.value)} className="rounded-lg border px-2 py-1.5 text-xs font-semibold">{Object.entries(statusNames).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select> : <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{statusNames[item.status] || item.status}</span>}</td></tr>) : <tr><td colSpan="6" className="p-10 text-center text-sm text-slate-500">Aucun incident correspondant.</td></tr>}</tbody></table></div></section>
  </div>;
}
