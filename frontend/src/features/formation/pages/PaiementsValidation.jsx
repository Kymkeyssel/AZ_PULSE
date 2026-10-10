import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { academyService } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

const money = (value) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(Number(value || 0));

export default function PaiementsValidation() {
  const { hasPermission } = useAuth();
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState('PENDING');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const canManage = hasPermission('formation.manage');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await academyService.listPayments();
      const records = result.data || [];
      setPayments(records);
      setSelected((current) => records.find((item) => item.id === current?.id) || records.find((item) => item.status === filter) || null);
    } catch (error) { toast.error(error.message || 'Impossible de charger les justificatifs'); }
    finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const visible = useMemo(() => payments.filter((item) => item.status === filter), [payments, filter]);
  const act = async (action) => {
    if (!selected) return;
    setBusy(true);
    try {
      if (action === 'validate') await academyService.validatePayment(selected.id);
      else await academyService.rejectPayment(selected.id);
      toast.success(action === 'validate' ? 'Paiement validé' : 'Justificatif refusé');
      await load();
    } catch (error) { toast.error(error.message || 'Action impossible'); }
    finally { setBusy(false); }
  };

  const download = async () => {
    if (!selected?.documentUrl) return toast.error('Aucun justificatif associé.');
    try {
      const blob = await academyService.downloadPayment(selected.id);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = selected.documentUrl;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) { toast.error(error.message || 'Téléchargement impossible'); }
  };

  if (!canManage) return <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-slate-200 p-8"><h1 className="font-bold text-slate-900">Accès réservé à l’équipe Formation</h1><p className="text-sm text-slate-500 mt-2">La permission formation.manage est nécessaire pour valider les paiements.</p></div>;

  const pending = payments.filter((item) => item.status === 'PENDING');
  const validated = payments.filter((item) => item.status === 'VALIDATED');
  return <div className="max-w-7xl mx-auto space-y-6 pb-12">
    <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-widest text-blue-700 font-bold">Formation · Gestion financière</p><h1 className="text-3xl font-black text-slate-900 mt-2">Justificatifs de paiement</h1><p className="text-sm text-slate-500 mt-2">Vérifiez les reçus déposés et mettez à jour les échéanciers depuis les données académiques.</p></div><button onClick={load} className="px-4 py-2.5 rounded-xl border bg-white text-sm font-semibold text-slate-700">Actualiser</button></header>
    <div className="grid sm:grid-cols-3 gap-4">{[['À vérifier', pending.length], ['Validés', validated.length], ['Montant validé', money(validated.reduce((sum, item) => sum + Number(item.amount || 0), 0))]].map(([label, value]) => <div key={label} className="rounded-2xl bg-white border border-slate-200 p-5"><p className="text-xs uppercase tracking-wide font-bold text-slate-400">{label}</p><p className="text-2xl font-black text-slate-900 mt-2">{value}</p></div>)}</div>
    <div className="grid lg:grid-cols-5 gap-5 items-start"><section className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl overflow-hidden"><div className="flex border-b">{[['PENDING', 'À vérifier'], ['VALIDATED', 'Validés'], ['REJECTED', 'Refusés']].map(([key, label]) => <button key={key} onClick={() => setFilter(key)} className={`flex-1 px-2 py-3 text-sm font-semibold ${filter === key ? 'text-blue-700 border-b-2 border-blue-700' : 'text-slate-500'}`}>{label}</button>)}</div><div className="max-h-[650px] overflow-auto p-2">{loading ? <p className="p-6 text-sm text-slate-500">Chargement des paiements…</p> : visible.length ? visible.map((payment) => <button key={payment.id} onClick={() => setSelected(payment)} className={`w-full text-left rounded-xl p-4 mb-1 border ${selected?.id === payment.id ? 'border-blue-300 bg-blue-50' : 'border-transparent hover:bg-slate-50'}`}><div className="flex justify-between gap-3"><span className="font-bold text-slate-900">{payment.student || payment.studentEmail || 'Apprenant'}</span><span className="font-bold text-slate-900">{money(payment.amount)}</span></div><p className="text-xs text-slate-500 mt-2">{payment.reference || 'Sans référence'} · {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString('fr-FR') : 'Date inconnue'}</p></button>) : <p className="p-6 text-sm text-slate-500">Aucun justificatif dans cette catégorie.</p>}</div></section>
    <section className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 min-h-72">{selected ? <><div className="flex flex-wrap justify-between gap-4 border-b pb-5"><div><p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Référence · {selected.reference || 'non renseignée'}</p><h2 className="text-xl font-black text-slate-900 mt-2">{selected.student || selected.studentEmail || 'Apprenant'}</h2><p className="text-sm text-slate-500">{selected.createdAt ? new Date(selected.createdAt).toLocaleString('fr-FR') : 'Date inconnue'}</p></div><p className="text-2xl font-black text-slate-900">{money(selected.amount)}</p></div><div className="py-6"><p className="text-sm font-bold text-slate-800">Justificatif associé</p><p className="text-sm text-slate-500 mt-2">{selected.documentUrl ? 'Fichier déposé et conservé dans le dossier de paiement.' : 'Aucun fichier renseigné.'}</p>{selected.documentUrl && <button onClick={download} className="mt-3 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-blue-700">Télécharger le justificatif</button>}<p className="text-xs text-slate-400 mt-3">Les informations d’analyse automatique ne sont pas fournies par le service backend.</p></div>{selected.status === 'PENDING' && <div className="flex flex-col sm:flex-row gap-3 border-t pt-5"><button disabled={busy} onClick={() => act('reject')} className="flex-1 rounded-xl border border-rose-200 px-4 py-3 font-bold text-rose-700 disabled:opacity-50">Refuser le justificatif</button><button disabled={busy} onClick={() => act('validate')} className="flex-1 rounded-xl bg-blue-700 px-4 py-3 font-bold text-white disabled:opacity-50">{busy ? 'Mise à jour…' : 'Valider et mettre à jour l’échéancier'}</button></div>}</> : <div className="h-full min-h-60 grid place-items-center text-sm text-slate-500">Sélectionnez un justificatif pour consulter son dossier.</div>}</section></div>
  </div>;
}
