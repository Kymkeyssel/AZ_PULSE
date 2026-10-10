import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { API_BASE_URL, TOKEN_KEY } from '../services/config';

const cards = [
  { key: 'users', label: 'Comptes utilisateurs', icon: 'group', color: 'blue' },
  { key: 'customers', label: 'Clients CRM', icon: 'domain', color: 'violet' },
  { key: 'projects', label: 'Projets', icon: 'folder', color: 'cyan' },
  { key: 'openIncidents', label: 'Incidents ouverts', icon: 'warning', color: 'amber' },
  { key: 'roles', label: 'Rôles', icon: 'admin_panel_settings', color: 'emerald' },
  { key: 'permissions', label: 'Permissions', icon: 'key', color: 'slate' },
];
const cardColors = { blue: 'bg-blue-50 text-blue-700', violet: 'bg-violet-50 text-violet-700', cyan: 'bg-cyan-50 text-cyan-700', amber: 'bg-amber-50 text-amber-700', emerald: 'bg-emerald-50 text-emerald-700', slate: 'bg-slate-100 text-slate-700' };

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    setLoading(true); setError('');
    const token = localStorage.getItem(TOKEN_KEY);
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    try {
      const [statsResponse, requestsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/dashboard/super-admin`, { headers }),
        fetch(`${API_BASE_URL}/admin/access-requests?status=PENDING`, { headers }),
      ]);
      const statsBody = await statsResponse.json();
      const requestsBody = await requestsResponse.json();
      if (!statsResponse.ok) throw new Error(statsBody.message || statsBody.error || `Erreur ${statsResponse.status}`);
      if (!requestsResponse.ok) throw new Error(requestsBody.message || requestsBody.error || `Erreur ${requestsResponse.status}`);
      setStats(statsBody.data || {});
      const requests = requestsBody.data || [];
      setPending(Array.isArray(requests) ? requests.length : Number(requestsBody.total || 0));
    } catch (e) { setError(e.message || 'Les données de supervision ne sont pas disponibles.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const maxRoleCount = Math.max(1, ...(stats?.usersByRole || []).map((role) => Number(role.total || 0)));
  return <div className="max-w-7xl mx-auto space-y-7 pb-12">
    <header className="rounded-3xl bg-gradient-to-br from-[#0b2545] via-[#123b68] to-[#0754bd] p-7 md:p-9 text-white shadow-xl"><div className="flex flex-col md:flex-row md:items-end justify-between gap-6"><div><p className="text-xs uppercase tracking-[.22em] text-blue-200 font-bold">AZ Pulse · Gouvernance</p><h1 className="text-3xl md:text-4xl font-black mt-3">Supervision générale</h1><p className="text-sm text-blue-100 mt-2">Vue consolidée des données opérationnelles et de sécurité disponibles.</p></div><div className="flex gap-3"><button onClick={load} className="rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-bold hover:bg-white/20">Actualiser</button><Link to="/superadmin/requests" className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-blue-900">Demandes d’accès · {loading ? '…' : pending}</Link></div></div></header>
    {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
    <section className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">{cards.map(({ key, label, icon, color }) => <article key={key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span><span className={`grid h-10 w-10 place-items-center rounded-xl ${cardColors[color]}`}><span className="material-symbols-outlined">{icon}</span></span></div><p className="mt-4 text-3xl font-black text-slate-900">{loading ? '—' : (stats?.[key] ?? 0).toLocaleString('fr-FR')}</p></article>)}</section>
    <section className="grid xl:grid-cols-5 gap-5"><article className="xl:col-span-3 rounded-2xl border border-slate-200 bg-white p-6"><div className="flex items-center justify-between gap-4"><div><h2 className="font-bold text-slate-900">Répartition des utilisateurs</h2><p className="text-xs text-slate-500 mt-1">Comptes associés aux rôles en base</p></div><Link to="/superadmin/roles" className="text-sm font-semibold text-blue-700">Gérer les rôles</Link></div>{loading ? <p className="py-8 text-sm text-slate-500">Chargement…</p> : stats?.usersByRole?.length ? <div className="mt-6 space-y-4">{stats.usersByRole.map((role) => <div key={role.code}><div className="flex justify-between text-sm mb-1.5"><span className="font-semibold text-slate-700">{role.label || role.code}</span><span className="text-slate-500">{role.total}</span></div><div className="h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.max(2, Number(role.total || 0) / maxRoleCount * 100)}%` }}/></div></div>)}</div> : <p className="py-8 text-sm text-slate-500">Aucune attribution de rôle disponible.</p>}</article>
    <article className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-6"><h2 className="font-bold text-slate-900">Sessions et activité</h2><p className="text-xs text-slate-500 mt-1">Données calculées par le serveur</p><div className="mt-5 space-y-3">{[['Sessions actives', stats?.activeSessions], ['Revenus des opportunités gagnées', stats?.totalRevenue == null ? null : `${Number(stats.totalRevenue).toLocaleString('fr-FR')} FCFA`]].map(([label, value]) => <div key={label} className="flex justify-between gap-3 border-b border-slate-100 pb-3 text-sm"><span className="text-slate-500">{label}</span><span className="font-bold text-slate-900">{loading ? '—' : value ?? 'Non disponible'}</span></div>)}</div><div className="mt-5 flex flex-wrap gap-2"><Link to="/superadmin/users" className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700">Utilisateurs</Link><Link to="/superadmin/roles" className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700">Rôles & permissions</Link><Link to="/superadmin/audit" className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700">Journal d’audit</Link></div></article></section>
    <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden"><div className="p-5 border-b flex items-center justify-between"><div><h2 className="font-bold text-slate-900">Journal de supervision récent</h2><p className="text-xs text-slate-500 mt-1">Dernières entrées remontées par l’audit backend</p></div><Link to="/superadmin/audit" className="text-sm font-semibold text-blue-700">Ouvrir le journal</Link></div>{loading ? <p className="p-6 text-sm text-slate-500">Chargement…</p> : stats?.recentAudit?.length ? <div className="divide-y">{stats.recentAudit.map((entry, index) => <div key={`${entry.createdAt}-${index}`} className="px-5 py-4 flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-semibold text-slate-800">{entry.action}</p><p className="text-xs text-slate-500 mt-1">{entry.actor || 'Acteur non renseigné'}</p></div><div className="flex items-center gap-3"><span className="text-[10px] uppercase tracking-wide font-bold text-slate-500">{entry.severity}</span><time className="text-xs text-slate-400">{entry.createdAt ? new Date(entry.createdAt).toLocaleString('fr-FR') : '—'}</time></div></div>)}</div> : <p className="p-6 text-sm text-slate-500">Aucune entrée d’audit disponible.</p>}</section>
  </div>;
}
