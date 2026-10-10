import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BriefcaseBusiness, Building2, FolderKanban, Mail, Phone, ArrowRight, CircleCheck, Clock3 } from 'lucide-react';
import { fetchApi } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

const ClientDashboard = () => {
  const { fullName, user } = useAuth();
  const [portal, setPortal] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApi('/client/portal').then((result) => setPortal(result.data)).catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="mx-auto max-w-5xl rounded-3xl border border-rose-200 bg-white p-8 text-rose-700"><h1 className="text-xl font-bold">Espace client indisponible</h1><p className="mt-2 text-sm">{error}</p><p className="mt-2 text-sm">Vérifiez que votre compte utilise l’adresse de la fiche client.</p></div>;
  if (!portal) return <div className="mx-auto max-w-6xl animate-pulse space-y-5"><div className="h-44 rounded-3xl bg-slate-200"/><div className="grid gap-4 md:grid-cols-3"><div className="h-28 rounded-2xl bg-slate-200"/><div className="h-28 rounded-2xl bg-slate-200"/><div className="h-28 rounded-2xl bg-slate-200"/></div></div>;

  const customer = portal.customer;
  const projects = portal.projects || [];
  const activeProjects = projects.filter((project) => !['COMPLETED', 'CANCELLED'].includes(project.status));
  const tasks = projects.flatMap((project) => (project.tasks || []).map((task) => ({ ...task, projectName: project.name })));

  return <div className="mx-auto max-w-6xl space-y-6">
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#09264a] via-[#104d83] to-[#1477a5] p-7 text-white shadow-xl shadow-sky-950/10 md:p-9">
      <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl"/>
      <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div><p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider"><Building2 size={14}/>{customer.status === 'CLIENT' ? 'Espace client' : customer.status}</p>
          <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">Bonjour, {customer.name || fullName || 'Client'}</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-blue-100">Suivez ici les projets et tâches qui sont rattachés à votre fiche client AZ Pulse.</p>
        </div>
        <Link to="/client/projets" className="inline-flex items-center gap-2 self-start rounded-xl bg-white px-4 py-3 text-sm font-bold text-blue-900 shadow-lg transition hover:-translate-y-0.5 md:self-auto">Voir mes projets <ArrowRight size={16}/></Link>
      </div>
    </section>

    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-slate-500">Projets actifs</p><FolderKanban className="text-blue-600" size={20}/></div><p className="mt-3 text-3xl font-black text-slate-900">{activeProjects.length}</p><p className="mt-1 text-xs text-slate-500">Sur {projects.length} projet{projects.length === 1 ? '' : 's'} lié{projects.length === 1 ? '' : 's'} à votre compte</p></div>
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-slate-500">Tâches en cours</p><Clock3 className="text-amber-500" size={20}/></div><p className="mt-3 text-3xl font-black text-slate-900">{tasks.filter((task) => !['DONE', 'COMPLETED'].includes(task.status)).length}</p><p className="mt-1 text-xs text-slate-500">Tâches de vos projets</p></div>
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-slate-500">Tâches terminées</p><CircleCheck className="text-emerald-600" size={20}/></div><p className="mt-3 text-3xl font-black text-slate-900">{tasks.filter((task) => ['DONE', 'COMPLETED'].includes(task.status)).length}</p><p className="mt-1 text-xs text-slate-500">Avancement enregistré dans Workspace</p></div>
    </section>

    <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm md:p-6"><div className="flex items-center justify-between gap-3"><div><h2 className="text-lg font-extrabold text-slate-900">Projets récents</h2><p className="mt-1 text-sm text-slate-500">Données synchronisées avec votre espace Workspace.</p></div><Link to="/client/projets" className="text-sm font-bold text-blue-700 hover:underline">Tout voir</Link></div>
        {projects.length ? <div className="mt-5 space-y-3">{projects.slice(0, 4).map((project) => <Link key={project.id} to="/client/projets" className="block rounded-xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-blue-200 hover:bg-blue-50/50"><div className="flex items-start justify-between gap-4"><div><p className="font-bold text-slate-900">{project.name}</p><p className="mt-1 text-xs text-slate-500">{project.status}{project.manager_name ? ` · Responsable : ${project.manager_name}` : ''}</p></div><span className="text-sm font-extrabold text-blue-700">{project.progress || 0}%</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500" style={{ width: `${Math.max(0, Math.min(100, project.progress || 0))}%` }}/></div></Link>)}</div> : <div className="mt-5 rounded-xl border border-dashed border-slate-300 p-6 text-center"><BriefcaseBusiness className="mx-auto text-slate-400"/><p className="mt-2 font-bold text-slate-700">Aucun projet rattaché pour le moment</p><p className="mt-1 text-sm text-slate-500">Les projets apparaîtront ici une fois liés à votre fiche client.</p></div>}
      </section>
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm md:p-6"><h2 className="text-lg font-extrabold text-slate-900">Coordonnées du compte</h2><p className="mt-1 text-sm text-slate-500">Informations enregistrées sur votre fiche client.</p><div className="mt-5 space-y-4"><div className="flex items-start gap-3"><Mail className="mt-0.5 text-blue-600" size={18}/><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Email</p><p className="mt-0.5 break-all text-sm font-semibold text-slate-800">{customer.email || user?.email}</p></div></div>{customer.phone && <div className="flex items-start gap-3"><Phone className="mt-0.5 text-blue-600" size={18}/><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Téléphone</p><p className="mt-0.5 text-sm font-semibold text-slate-800">{customer.phone}</p></div></div>}{customer.industry && <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Secteur</p><p className="mt-0.5 text-sm font-semibold text-slate-800">{customer.industry}</p></div>}</div><Link to="/profil" className="mt-6 inline-flex text-sm font-bold text-blue-700 hover:underline">Gérer mon profil <ArrowRight className="ml-1" size={15}/></Link></section>
    </div>
  </div>;
};

export default ClientDashboard;
