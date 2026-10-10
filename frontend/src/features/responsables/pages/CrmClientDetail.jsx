import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { crmService } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

const money = (value) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(Number(value || 0));

export default function CrmClientDetail() {
  const { id } = useParams();
  const { hasPermission } = useAuth();
  const [client, setClient] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [activities, setActivities] = useState([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const canUpdate = hasPermission('crm.update');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [customerRes, opportunityRes, activityRes] = await Promise.all([
        crmService.getCustomer(id), crmService.listOpportunities({ customer: id }), crmService.listCustomerActivities(id),
      ]);
      setClient(customerRes.data);
      setOpportunities(opportunityRes.data || []);
      setActivities(activityRes.data || []);
    } catch (error) { toast.error(error.message || 'Impossible de charger le dossier client'); }
    finally { setLoading(false); }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const addNote = async (event) => {
    event.preventDefault();
    if (!note.trim()) return;
    setSaving(true);
    try {
      await crmService.createActivity({ customer_id: id, type: 'NOTE', description: note.trim() });
      setNote('');
      await load();
      toast.success('Note ajoutée au dossier');
    } catch (error) { toast.error(error.message || 'Enregistrement impossible'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="max-w-6xl mx-auto p-10 text-sm text-slate-500">Chargement du dossier client…</div>;
  if (!client) return <div className="max-w-6xl mx-auto rounded-2xl bg-white border p-8"><p className="font-bold text-slate-800">Client introuvable</p><Link to="../clients" className="text-blue-700 text-sm mt-3 inline-block">Retour aux clients</Link></div>;
  const total = opportunities.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return <div className="max-w-6xl mx-auto space-y-6 pb-12">
    <Link to="../clients" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-700"><span className="material-symbols-outlined text-lg">arrow_back</span>Retour aux clients</Link>
    <header className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-sm">
      <div className="flex items-center gap-4"><div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 grid place-items-center text-2xl font-black">{client.name?.slice(0, 1)}</div><div><p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Dossier client</p><h1 className="text-2xl font-black text-slate-900">{client.name}</h1><p className="text-sm text-slate-500">{client.industry || 'Secteur non renseigné'} · {client.status || 'Prospect'}</p></div></div>
      <div className="flex flex-wrap gap-3">{client.email && <a className="px-4 py-2.5 rounded-xl border text-sm font-semibold text-slate-700" href={`mailto:${client.email}`}>Contacter par email</a>}{canUpdate && <Link to="../crm" className="px-4 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-bold">Créer une opportunité</Link>}</div>
    </header>
    <section className="grid md:grid-cols-3 gap-4">
      <div className="bg-white rounded-2xl p-5 border border-slate-200"><p className="text-xs uppercase font-bold tracking-wider text-slate-400">Opportunités</p><p className="text-3xl font-black mt-2">{opportunities.length}</p></div>
      <div className="bg-white rounded-2xl p-5 border border-slate-200"><p className="text-xs uppercase font-bold tracking-wider text-slate-400">Valeur totale</p><p className="text-3xl font-black mt-2">{money(total)}</p></div>
      <div className="bg-white rounded-2xl p-5 border border-slate-200"><p className="text-xs uppercase font-bold tracking-wider text-slate-400">Interactions</p><p className="text-3xl font-black mt-2">{activities.length}</p></div>
    </section>
    <section className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 space-y-4"><h2 className="font-bold text-slate-900">Coordonnées</h2><p className="text-sm text-slate-600">{client.email || 'Adresse email non renseignée'}</p><p className="text-sm text-slate-600">{client.phone || 'Téléphone non renseigné'}</p><p className="text-sm text-slate-600">Responsable : {client.owner_name || '—'}</p></div>
      <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 overflow-hidden"><div className="p-5 border-b"><h2 className="font-bold text-slate-900">Opportunités associées</h2></div>{opportunities.length ? <div className="divide-y">{opportunities.map((item) => <div key={item.id} className="p-5 flex items-center justify-between gap-4"><div><p className="font-semibold text-slate-800">{item.title}</p><p className="text-xs text-slate-500 mt-1">{item.stage} · {item.probability ?? 0}%</p></div><p className="font-bold text-slate-900">{money(item.amount)}</p></div>)}</div> : <p className="p-6 text-sm text-slate-500">Aucune opportunité liée à ce client.</p>}</div>
    </section>
    <section className="bg-white rounded-2xl border border-slate-200 p-6"><div className="flex items-center justify-between gap-4 mb-5"><h2 className="font-bold text-slate-900">Historique des interactions</h2><span className="text-xs text-slate-500">{activities.length} entrée(s)</span></div>{canUpdate && <form onSubmit={addNote} className="flex flex-col sm:flex-row gap-3 mb-5"><input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ajouter une note de suivi…" className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm"/><button disabled={saving || !note.trim()} className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{saving ? 'Enregistrement…' : 'Ajouter une note'}</button></form>}{activities.length ? <div className="space-y-4">{activities.map((item) => <article key={item.id} className="border-l-2 border-blue-100 pl-4"><div className="flex justify-between gap-3"><p className="text-sm font-bold text-slate-800">{item.type}</p><time className="text-xs text-slate-400">{item.createdAt ? new Date(item.createdAt).toLocaleString('fr-FR') : ''}</time></div><p className="text-sm text-slate-600 mt-1">{item.description}</p></article>)}</div> : <p className="text-sm text-slate-500">Aucune interaction enregistrée.</p>}</section>
  </div>;
}
