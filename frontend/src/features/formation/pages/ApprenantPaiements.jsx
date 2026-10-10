import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'sonner';
import { academyService } from '../../../services/api';

const money = (value) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(Number(value || 0));
const statusLabel = { PENDING: 'En attente', VALIDATED: 'Validé', REJECTED: 'Refusé' };

export default function ApprenantPaiements() {
  const { data } = useOutletContext();
  const financial = data?.financial || {};
  const [payments, setPayments] = useState([]);
  const [file, setFile] = useState(null);
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    try { const result = await academyService.listPayments(); setPayments(result.data || []); }
    catch (error) { toast.error(error.message || 'Impossible de charger les paiements'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const submit = async (event) => {
    event.preventDefault();
    if (!file) return toast.error('Sélectionnez le justificatif à déposer.');
    setBusy(true);
    try {
      await academyService.depositPayment(file, { amount: Number(amount), reference: reference || undefined });
      setFile(null); setAmount(''); setReference(''); event.target.reset();
      toast.success('Justificatif transmis pour validation.'); await load();
    } catch (error) { toast.error(error.message || 'Dépôt impossible'); }
    finally { setBusy(false); }
  };

  const download = async (payment) => {
    try {
      const blob = await academyService.downloadPayment(payment.id);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = payment.documentUrl || 'justificatif';
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) { toast.error(error.message || 'Téléchargement impossible'); }
  };

  const total = Number(financial.totalAmount || 0);
  const remaining = Number(financial.remainingBalance || 0);
  const paid = Math.max(0, total - remaining);
  const validated = useMemo(() => payments.filter((payment) => payment.status === 'VALIDATED').reduce((sum, payment) => sum + Number(payment.amount || 0), 0), [payments]);
  return <div className="max-w-6xl mx-auto py-8 space-y-6">
    <header><p className="text-xs uppercase tracking-widest text-blue-700 font-bold">Formation · Finances</p><h1 className="text-3xl font-black text-slate-900 mt-2">Mes paiements</h1><p className="text-sm text-slate-500 mt-2">Consultez votre échéancier et transmettez vos justificatifs à l’équipe comptable.</p></header>
    <section className="grid sm:grid-cols-3 gap-4">{[['Montant total', total], ['Déjà réglé', paid], ['Solde restant', remaining]].map(([label, value]) => <div key={label} className="bg-white border border-slate-200 rounded-2xl p-5"><p className="text-xs uppercase tracking-wide text-slate-400 font-bold">{label}</p><p className="text-2xl font-black mt-2 text-slate-900">{money(value)} <span className="text-sm font-semibold">FCFA</span></p></div>)}</section>
    <form onSubmit={submit} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4"><div><h2 className="font-bold text-slate-900">Déposer un justificatif</h2><p className="text-sm text-slate-500 mt-1">Un reçu sera créé et restera en attente jusqu’à sa validation.</p></div><div className="grid md:grid-cols-3 gap-4"><label className="text-sm font-semibold">Montant (FCFA)<input required min="1" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="block mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"/></label><label className="text-sm font-semibold">Référence de transaction<input value={reference} onChange={(e) => setReference(e.target.value)} className="block mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"/></label><label className="text-sm font-semibold">Reçu / bordereau<input required type="file" accept="image/*,.pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="block mt-1 w-full text-sm"/></label></div><button disabled={busy} className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{busy ? 'Envoi…' : 'Envoyer pour validation'}</button></form>
    <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden"><div className="p-5 border-b flex items-center justify-between"><div><h2 className="font-bold text-slate-900">Historique des justificatifs</h2><p className="text-xs text-slate-500 mt-1">Total des reçus validés : {money(validated)} FCFA</p></div><button onClick={load} className="text-sm font-semibold text-blue-700">Actualiser</button></div><div className="divide-y">{loading ? <p className="p-6 text-sm text-slate-500">Chargement…</p> : payments.length ? payments.map((item) => <article key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><p className="font-bold text-slate-800">{item.reference || 'Justificatif sans référence'}</p><p className="text-xs text-slate-500 mt-1">{item.createdAt ? new Date(item.createdAt).toLocaleString('fr-FR') : 'Date inconnue'} · Document : {item.documentUrl ? 'transmis' : 'indisponible'}</p></div><div className="flex items-center gap-3"><span className="font-bold">{money(item.amount)} FCFA</span><span className={`text-xs rounded-full px-3 py-1 font-bold ${item.status === 'VALIDATED' ? 'bg-emerald-50 text-emerald-700' : item.status === 'REJECTED' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{statusLabel[item.status] || item.status}</span>{item.documentUrl && <button onClick={() => download(item)} className="text-xs font-semibold text-blue-700">Télécharger</button>}</div></article>) : <p className="p-6 text-sm text-slate-500">Aucun justificatif enregistré.</p>}</div></section>
  </div>;
}
