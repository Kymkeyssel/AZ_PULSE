import { useEffect, useState } from 'react';
import { crmService } from '../../../../services/api';
import { REMINDER_PRIORITIES, REMINDER_TYPES } from '../../lib/format';

/** Date du jour au format attendu par `<input type="date">`. */
function todayIso() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

/**
 * Formulaire de relance : ce qu'il reste à faire, pour qui, et quand.
 *
 * Le client et l'affaire sont facultatifs : une relance interne (« rappeler
 * le service Compta ») n'est rattachée à rien. En revanche, si l'affaire est
 * `customerId` permet d'ouvrir le formulaire depuis une fiche client : la
 * relance y est rattachée d'office, sans avoir à le ressélectionner.
 *
 * L'état initial vient de `reminder` ; le parent remonte le composant avec une
 * `key` liée à la relance éditée, ce qui évite un effet de recopie.
 */
const ReminderForm = ({ reminder, opportunityId, customerId, onSaved, onCancel }) => {
  const isEdit = Boolean(reminder?.id);

  const [form, setForm] = useState(() => ({
    title: reminder?.title ?? '',
    description: reminder?.description ?? '',
    type: reminder?.type ?? 'CALL',
    priority: reminder?.priority ?? 'NORMAL',
    dueAt: reminder?.dueAt ? reminder.dueAt.slice(0, 10) : todayIso(),
    customer_id: reminder?.customer?.id ?? customerId ?? '',
    opportunity_id: reminder?.opportunity?.id ?? opportunityId ?? '',
  }));
  const [customerQuery, setCustomerQuery] = useState(reminder?.customer?.name ?? '');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(reminder?.customer ?? null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const needle = customerQuery.trim();
    if (needle.length < 2) return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const res = await crmService.searchCustomers(needle);
        if (!cancelled) setSuggestions(res.data ?? []);
      } catch {
        if (!cancelled) setSuggestions([]);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [customerQuery]);

  const update = field => e => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const pickCustomer = (customer) => {
    setSelectedCustomer(customer);
    setCustomerQuery(customer.name);
    setSuggestions([]);
    setForm(prev => ({ ...prev, customer_id: customer.id }));
  };

  const handleQueryChange = e => {
    setCustomerQuery(e.target.value);
    setSuggestions([]);
    setSelectedCustomer(null);
    setForm(prev => ({ ...prev, customer_id: '' }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("L'intitulé est obligatoire.");
      return;
    }
    if (!form.dueAt) {
      setError("L'échéance est obligatoire.");
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      type: form.type,
      priority: form.priority,
      dueAt: form.dueAt,
      customer_id: form.customer_id || selectedCustomer?.id || null,
      opportunity_id: form.opportunity_id || null,
    };

    try {
      const res = isEdit
        ? await crmService.updateReminder(reminder.id, payload)
        : await crmService.createReminder(payload);

      onSaved?.(res.data);
    } catch (err) {
      setError(err.message || "L'enregistrement a échoué.");
    } finally {
      setSaving(false);
    }
  };

  const field = 'w-full px-3.5 py-2.5 rounded-lg border border-[#dde3ef] bg-white text-sm text-[#001026] focus:outline-none focus:ring-2 focus:ring-[#004ad1]/20';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wide text-[#6b7a99] mb-1.5">
          Que faut-il faire ?
        </label>
        <input
          type="text"
          value={form.title}
          onChange={update('title')}
          placeholder="Rappeler pour la proposition tarifaire"
          className={field}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wide text-[#6b7a99] mb-1.5">
            Type
          </label>
          <select value={form.type} onChange={update('type')} className={field}>
            {REMINDER_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wide text-[#6b7a99] mb-1.5">
            Priorité
          </label>
          <select value={form.priority} onChange={update('priority')} className={field}>
            {REMINDER_PRIORITIES.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wide text-[#6b7a99] mb-1.5">
          Échéance
        </label>
        <input type="date" value={form.dueAt} onChange={update('dueAt')} className={field} required />
      </div>

      {/* ── Client (facultatif) ──────────────────────────────────────── */}
      <div className="relative">
        <label className="block text-[11px] font-bold uppercase tracking-wide text-[#6b7a99] mb-1.5">
          Client <span className="font-normal normal-case">(facultatif)</span>
        </label>
        <input
          type="text"
          value={customerQuery}
          onChange={handleQueryChange}
          placeholder="Rechercher un client…"
          className={field}
        />

        {suggestions.length > 0 && (
          <ul className="absolute z-10 left-0 right-0 mt-1 bg-white border border-[#dde3ef] rounded-lg shadow-lg overflow-hidden max-h-44 overflow-y-auto">
            {suggestions.map(customer => (
              <li key={customer.id}>
                <button
                  type="button"
                  onClick={() => pickCustomer(customer)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-[#eff6ff] transition-colors"
                >
                  {customer.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wide text-[#6b7a99] mb-1.5">
          Note
        </label>
        <textarea
          value={form.description}
          onChange={update('description')}
          rows={3}
          placeholder="Précisions à retenir avant l'appel…"
          className={field}
        />
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-lg text-sm font-bold text-[#6b7a99] border border-[#dde3ef] hover:bg-[#f4f7fb] transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2.5 rounded-lg text-sm font-bold bg-[#0b2545] text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {saving ? 'Enregistrement…' : isEdit ? 'Modifier' : 'Planifier'}
        </button>
      </div>
    </form>
  );
};

export default ReminderForm;
