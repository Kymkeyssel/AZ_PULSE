import { useState } from 'react';

const STAGE_DETAILS = {
  QUALIFICATION: {
    title: 'Qualifier le besoin', description: 'Confirmez le besoin, l’action suivante et la date de relance.', icon: 'manage_search',
    fields: [
      { name: 'needSummary', label: 'Besoin confirmé', placeholder: 'Quel problème le prospect souhaite-t-il résoudre ?', type: 'textarea', required: true },
      { name: 'nextAction', label: 'Prochaine action', placeholder: 'Ex. planifier un échange technique', required: true },
      { name: 'followUpAt', label: 'Date de relance', type: 'date', required: true },
    ],
  },
  PROPOSAL: {
    title: 'Préparer une proposition', description: 'Enregistrez le contenu, le montant et le calendrier de l’offre.', icon: 'request_quote',
    fields: [
      { name: 'proposalSummary', label: 'Contenu de la proposition', placeholder: 'Périmètre et livrables proposés…', type: 'textarea', required: true },
      { name: 'amount', label: 'Montant proposé', type: 'number', placeholder: '0', required: true },
      { name: 'expectedCloseDate', label: 'Date de décision visée', type: 'date', required: true },
      { name: 'nextAction', label: 'Prochaine action', placeholder: 'Ex. transmettre puis présenter l’offre', required: true },
      { name: 'followUpAt', label: 'Date de relance', type: 'date', required: true },
    ],
  },
  NEGOTIATION: {
    title: 'Documenter la négociation', description: 'Identifiez le décideur et formalisez le suivi de la proposition.', icon: 'handshake',
    fields: [
      { name: 'decisionMaker', label: 'Décideur / interlocuteur', placeholder: 'Nom et fonction', required: true },
      { name: 'proposalSummary', label: 'État des échanges', placeholder: 'Points acceptés, réserves ou ajustements…', type: 'textarea', required: true },
      { name: 'nextAction', label: 'Prochaine action', placeholder: 'Ex. envoyer la version finale du devis', required: true },
      { name: 'followUpAt', label: 'Date de relance', type: 'date', required: true },
    ],
  },
  WON: {
    title: 'Confirmer l’affaire gagnée', description: 'La signature déclenche la création du projet Workspace et le passage de relais.', icon: 'verified',
    fields: [
      { name: 'contractReference', label: 'Justificatif de l’accord client', placeholder: 'Ex. devis signé n° DV-2026-014, bon de commande, ou confirmation écrite du client (date et canal)', required: true },
      { name: 'finalAmount', label: 'Montant signé', type: 'number', placeholder: '0', required: true },
      { name: 'handoffSummary', label: 'Consignes de démarrage projet', placeholder: 'Périmètre vendu, engagements et points de vigilance…', type: 'textarea', required: true },
    ],
  },
  LOST: {
    title: 'Clôturer l’affaire', description: 'Le motif est conservé dans l’historique pour alimenter le retour d’expérience.', icon: 'cancel',
    fields: [{ name: 'lossReason', label: 'Motif de perte', placeholder: 'Prix, calendrier, concurrence, abandon…', type: 'textarea', required: true }],
  },
};
const STAGE_LABELS = { PROSPECTING: 'Prospection', QUALIFICATION: 'Qualification', PROPOSAL: 'Proposition', NEGOTIATION: 'Négociation', WON: 'Gagnée', LOST: 'Perdue' };

const StageTransitionDialog = ({ opportunity, fromStage, toStage, busy, onCancel, onConfirm }) => {
  const config = STAGE_DETAILS[toStage];
  const [values, setValues] = useState({
    amount: opportunity.amount ?? '',
    expectedCloseDate: opportunity.expectedCloseDate ?? '',
    finalAmount: opportunity.amount ?? '',
  });
  if (!config) return null;
  const inputClass = 'w-full rounded-xl border border-slate-200 bg-white/80 px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100';

  const submit = event => {
    event.preventDefault();
    onConfirm(values);
  };

  return <div className="fixed inset-0 z-[140] grid place-items-center bg-slate-950/55 p-4 backdrop-blur-md" role="presentation">
    <form onSubmit={submit} className="w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-[28px] border border-white/80 bg-white/90 shadow-2xl shadow-slate-950/25 backdrop-blur-2xl">
      <header className="sticky top-0 z-10 flex items-start gap-4 border-b border-white/70 bg-gradient-to-r from-blue-50/95 via-white/95 to-cyan-50/90 px-6 py-5 backdrop-blur-xl">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25"><span className="material-symbols-outlined">{config.icon}</span></div>
        <div className="min-w-0 flex-1"><p className="text-[10px] font-black uppercase tracking-[.18em] text-blue-600">{STAGE_LABELS[fromStage] || fromStage} → {STAGE_LABELS[toStage] || toStage}</p><h2 className="mt-1 text-xl font-extrabold text-slate-950">{config.title}</h2><p className="mt-1 text-xs leading-relaxed text-slate-600">{config.description}</p></div>
        <button type="button" onClick={onCancel} disabled={busy} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-500 transition hover:bg-white hover:text-slate-900 disabled:opacity-40" aria-label="Fermer"><span className="material-symbols-outlined">close</span></button>
      </header>
      <div className="space-y-4 px-6 py-5">
        <div className="rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3"><p className="text-sm font-bold text-slate-900">{opportunity.title}</p><p className="mt-0.5 text-xs text-slate-500">{opportunity.customer?.name || opportunity.customer_name || 'Client'} · étape actuelle : {STAGE_LABELS[fromStage] || fromStage}</p></div>
        {config.fields.map(field => <label key={field.name} className="block"><span className="mb-1.5 block text-xs font-bold text-slate-700">{field.label}{field.required && <span className="ml-1 text-rose-500">*</span>}</span>{field.type === 'textarea' ? <textarea className={`${inputClass} min-h-24 resize-y`} placeholder={field.placeholder} value={values[field.name] || ''} onChange={event => setValues(current => ({ ...current, [field.name]: event.target.value }))} required={field.required} minLength={field.name === 'lossReason' ? 5 : 3} /> : <input className={inputClass} type={field.type || 'text'} placeholder={field.placeholder} value={values[field.name] || ''} onChange={event => setValues(current => ({ ...current, [field.name]: event.target.value }))} required={field.required} min={field.type === 'number' ? '1' : undefined} step={field.type === 'number' ? '0.01' : undefined} />}</label>)}
        {toStage !== 'LOST' && toStage !== 'WON' && <p className="flex items-start gap-2 rounded-xl bg-amber-50 px-3.5 py-3 text-[11px] leading-relaxed text-amber-900"><span className="material-symbols-outlined text-[17px]">event_upcoming</span>Une relance CRM sera créée automatiquement à la date indiquée.</p>}
        {toStage === 'WON' && <p className="flex items-start gap-2 rounded-xl bg-emerald-50 px-3.5 py-3 text-[11px] leading-relaxed text-emerald-900"><span className="material-symbols-outlined text-[17px]">rocket_launch</span>Indiquez une preuve vérifiable de l’accord : numéro de devis/contrat signé, bon de commande, ou date et canal d’une confirmation écrite. Le projet sera créé et le client notifié après validation.</p>}
      </div>
      <footer className="flex flex-col-reverse gap-2 border-t border-slate-100 px-6 py-4 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} disabled={busy} className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50">Annuler</button>
        <button type="submit" disabled={busy} className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-80 ${toStage === 'WON' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/25' : toStage === 'LOST' ? 'bg-gradient-to-r from-rose-500 to-red-600 shadow-rose-500/20' : 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/25'}`}>
          {busy && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
          {busy ? 'Enregistrement en cours…' : toStage === 'WON' ? 'Confirmer et créer le projet' : toStage === 'LOST' ? 'Clôturer l’affaire' : `Valider l’étape ${toStage.replaceAll('_', ' ').toLowerCase()}`}
        </button>
      </footer>
    </form>
  </div>;
};

export default StageTransitionDialog;
