import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { API_BASE_URL, TOKEN_KEY } from '../services/config';
import { useAuth } from '../contexts/AuthContext';
import { ParentSidebar } from '../features/formation/components/ParentSidebar';
import { ParentTopbar } from '../features/formation/components/ParentTopbar';

const pages = {
  '/parent': { title: 'Espace parents', subtitle: 'Suivi des parcours académiques de vos enfants.', icon: 'family_restroom' },
  '/parent/mes-enfants': { title: 'Mes enfants', subtitle: 'Identité et parcours associés à votre compte parent.', icon: 'supervisor_account' },
  '/parent/formations-suivi': { title: 'Formations et progression', subtitle: 'Consultez les parcours et les moyennes disponibles.', icon: 'timeline' },
  '/parent/planning': { title: 'Planning', subtitle: 'Prochaines sessions remontées par l’espace académique.', icon: 'event_available' },
  '/parent/bulletins-notes': { title: 'Bulletins et notes', subtitle: 'Dernières évaluations publiées dans le dossier de chaque enfant.', icon: 'grade' },
  '/parent/inscriptions': { title: 'Inscriptions', subtitle: 'État des inscriptions actuellement enregistrées.', icon: 'how_to_reg' },
  '/parent/paiements-recus': { title: 'Paiements et reçus', subtitle: 'Situation financière issue de l’échéancier en base.', icon: 'receipt_long' },
};
const currency = (value) => `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(Number(value || 0))} FCFA`;

export default function ParentDashboard() {
  const { fullName } = useAuth();
  const { pathname } = useLocation();
  const page = pages[pathname] || pages['/parent'];
  const [children, setChildren] = useState([]);
  const [activeId, setActiveId] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    const token = localStorage.getItem(TOKEN_KEY);
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/parent`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || result.error || `Erreur ${response.status}`);
      setChildren(result.children || []);
    } catch (e) { setError(e.message || 'Impossible de charger les données du portail parent.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const selected = useMemo(() => activeId === 'ALL' ? children : children.filter((child) => String(child.id) === String(activeId)), [activeId, children]);
  const content = (child) => {
    if (pathname === '/parent/mes-enfants') return <div className="grid sm:grid-cols-2 gap-4"><p><span className="text-slate-400">Nom</span><br/><strong>{child.fullName}</strong></p><p><span className="text-slate-400">Programme</span><br/><strong>{child.programName || 'Non assigné'}</strong></p><p><span className="text-slate-400">Promotion</span><br/><strong>{child.promoName || 'Non renseignée'}</strong></p><p><span className="text-slate-400">Statut</span><br/><strong>{child.status || '—'}</strong></p></div>;
    if (pathname === '/parent/formations-suivi') return <div className="grid sm:grid-cols-3 gap-4"><Metric label="Parcours" value={child.programName || 'Non assigné'}/><Metric label="Promotion" value={child.promoName || '—'}/><Metric label="Moyenne disponible" value={`${child.average ?? 0}/20`}/></div>;
    if (pathname === '/parent/planning') return <Rows items={child.schedule || []} empty="Aucune session de cours disponible." render={(session) => <><strong>{session.course}</strong><span className="text-slate-500">{session.startTime ? new Date(session.startTime).toLocaleString('fr-FR') : 'Date non précisée'} · {session.room || 'Salle à confirmer'} · {session.teacher || 'Formateur à confirmer'}</span></>} />;
    if (pathname === '/parent/bulletins-notes') return <Rows items={child.recentGrades || []} empty="Aucune note publiée pour le moment." render={(grade) => <><strong>{grade.course}</strong><span className="text-slate-500">{grade.date ? new Date(grade.date).toLocaleDateString('fr-FR') : 'Date inconnue'} · Note : {grade.score ?? '—'}/20{grade.comment ? ` · ${grade.comment}` : ''}</span></>} />;
    if (pathname === '/parent/inscriptions') return <div className="grid sm:grid-cols-3 gap-4"><Metric label="Apprenant" value={child.fullName}/><Metric label="Programme" value={child.programName || 'Affectation en attente'}/><Metric label="Statut en base" value={child.status || '—'}/></div>;
    if (pathname === '/parent/paiements-recus') return child.financial ? <div className="grid sm:grid-cols-3 gap-4"><Metric label="Frais totaux" value={currency(child.financial.totalAmount)}/><Metric label="Réglé" value={currency(child.financial.paidAmount)}/><Metric label="Solde restant" value={currency(child.financial.remainingBalance)}/><p className="sm:col-span-3 text-sm text-slate-500">Échéances réglées : {child.financial.paidTranches ?? 0}/{child.financial.totalTranches ?? 0}. Le portail backend ne fournit pas encore l’historique individuel des justificatifs pour les parents.</p></div> : <p className="text-sm text-slate-500">Aucun échéancier financier n’est associé à cet apprenant.</p>;
    return <div className="grid sm:grid-cols-3 gap-4"><Metric label="Formation" value={child.programName || 'Non assignée'}/><Metric label="Moyenne" value={`${child.average ?? 0}/20`}/><Metric label="Solde restant" value={child.financial ? currency(child.financial.remainingBalance) : 'Non renseigné'}/><div className="sm:col-span-3"><h3 className="font-bold text-slate-800 mb-2">Évaluations à venir</h3><Rows items={child.upcomingEvals || []} empty="Aucune évaluation en attente." render={(item) => <><strong>{item.title}</strong><span className="text-slate-500">{item.dueDate ? new Date(item.dueDate).toLocaleDateString('fr-FR') : 'Échéance non précisée'}</span></>} /></div></div>;
  };

  return <div className="min-h-screen bg-slate-50 text-slate-800"><ParentSidebar/><div className="md:pl-72"><ParentTopbar/><main className="pt-20 px-4 md:px-8 pb-12 max-w-7xl mx-auto space-y-6"><header className="rounded-3xl bg-gradient-to-br from-[#0b2545] to-[#0754bd] text-white p-7 md:p-9"><div className="flex flex-col md:flex-row md:items-end justify-between gap-5"><div><p className="text-xs uppercase tracking-[.2em] text-blue-200 font-bold">Portail Famille · AZ Pulse</p><h1 className="text-3xl font-black mt-3">{page.title}</h1><p className="text-sm text-blue-100 mt-2">{page.subtitle}</p><p className="text-xs text-blue-200 mt-4">Connecté{fullName ? ` · ${fullName}` : ''}</p></div><button onClick={load} className="rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-bold">Actualiser</button></div></header>
    {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}
    <section className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between"><p className="text-sm text-slate-500">{children.length} enfant(s) associé(s) à votre compte</p><label className="text-sm font-semibold text-slate-600">Afficher <select value={activeId} onChange={(e) => setActiveId(e.target.value)} className="ml-2 rounded-lg border border-slate-200 bg-white px-3 py-2"><option value="ALL">Tous les enfants</option>{children.map((child) => <option key={child.id} value={child.id}>{child.fullName}</option>)}</select></label></section>
    {loading ? <div className="rounded-2xl bg-white border border-slate-200 p-8 text-sm text-slate-500">Chargement des données académiques…</div> : selected.length ? <div className="grid xl:grid-cols-2 gap-5">{selected.map((child) => <article key={child.id} className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden"><header className="p-5 border-b border-slate-100 flex items-center justify-between gap-3"><div className="flex items-center gap-3"><div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-800 grid place-items-center font-black">{child.initials || child.fullName?.slice(0, 2)}</div><div><h2 className="font-bold text-slate-900">{child.fullName}</h2><p className="text-xs text-slate-500">{child.programName || 'Parcours non assigné'}</p></div></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{child.status || '—'}</span></header><div className="p-5">{content(child)}</div></article>)}</div> : <div className="rounded-2xl bg-white border border-slate-200 p-10 text-center"><h2 className="font-bold text-slate-800">Aucun enfant rattaché</h2><p className="text-sm text-slate-500 mt-2">L’administration n’a pas encore associé d’apprenant à votre compte.</p><Link to="/auth" className="inline-block mt-4 text-sm font-bold text-blue-700">Contacter l’administration</Link></div>}</main></div></div>;
}

function Metric({ label, value }) { return <div className="rounded-xl bg-slate-50 border border-slate-100 p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="text-base font-bold text-slate-900 mt-2">{value}</p></div>; }
function Rows({ items, empty, render }) { return items.length ? <div className="divide-y">{items.map((item, index) => <div key={item.id || `${item.title || item.course}-${index}`} className="py-3 flex flex-col gap-1">{render(item)}</div>)}</div> : <p className="text-sm text-slate-500">{empty}</p>; }
