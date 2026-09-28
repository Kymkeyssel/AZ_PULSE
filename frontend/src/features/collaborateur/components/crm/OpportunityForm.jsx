import { useEffect, useState } from 'react';
import { crmService } from '../../../../services/api';

/**
 * Formulaire d'affaire : création ou modification.
 *
 * L'état initial est calculé à partir de `opportunity`. Le parent remonte le
 * composant avec une `key` liée à l'affaire éditée : pas besoin d'un effet
 * pour « recopier » les props dans l'état, donc pas de clignotement à
 * l'ouverture.
 *
 * Le choix du client est une autocomplétion : dans un carnet réel, le
 * commercial connaît le client mais pas toujours son identifiant interne.
 */
const OpportunityForm = ({ opportunity, onSaved, onCancel }) => {
  const isEdit = Boolean(opportunity?.id);

  const [form, setForm] = useState(() => ({
    title: opportunity?.title ?? '',
    amount: opportunity?.amount ?? '',
    probability: opportunity?.probability ?? 10,
    expectedCloseDate: opportunity?.expectedCloseDate ?? '',
    customer_id: opportunity?.customer?.id ?? '',
  }));
  const [customerQuery, setCustomerQuery] = useState(opportunity?.customer?.name ?? '');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(opportunity?.customer ?? null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Autocomplétion du client, avec anti-rebond. La liste est vidée dans le
  // gestionnaire de saisie : le faire ici créerait un rendu en cascade.
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

  const update = (field) => e => setForm(prev => ({ ...prev, [field]: e.target.value }));

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

    const customerId = form.customer_id || selectedCustomer?.id;
    if (!customerId) {
      setError('Sélectionnez un client.');
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      title: form.title.trim(),
      amount: form.amount === '' ? null : Number(form.amount),
      probability: Number(form.probability) || 0,
      expectedCloseDate: form.expectedCloseDate || null,
      customer_id: customerId,
    };

    try {
      const res = isEdit
        ? await crmService.updateOpportunity(opportunity.id, payload)
        : await crmService.createOpportunity(payload);

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
          Intitulé de l&apos;affaire
        </label>
        <input
          type="text"
          value={form.title}
          onChange={update('title')}
          placeholder="Refonte du site vitrine"
          className={field}
          required
        />
      </div>

      {/* ── Client (autocomplétion) ─────────────────────────────────── */}
      <div className="relative">
        <label className="block text-[11px] font-bold uppercase tracking-wide text-[#6b7a99] mb-1.5">
          Client
        </label>
        <input
          type="text"
          value={customerQuery}
          onChange={handleQueryChange}
          placeholder="Rechercher un client…"
          className={field}
        />

        {suggestions.length > 0 && (
          <ul className="absolute z-10 left-0 right-0 mt-1 bg-white border border-[#dde3ef] rounded-lg shadow-lg overflow-hidden max-h-52 overflow-y-auto">
            {suggestions.map(customer => (
              <li key={customer.id}>
                <button
                  type="button"
                  onClick={() => pickCustomer(customer)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-[#eff6ff] transition-colors"
                >
                  <span className="font-medium text-[#001026]">{customer.name}</span>
                  {customer.email && (
                    <span className="block text-[11px] text-[#6b7a99]">{customer.email}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}

        {selectedCustomer && (
          <p className="text-[11px] text-[#16a34a] mt-1.5 flex items-center gap-1">
            <span className="material-symbols-outlined notranslate text-[14px]">check_circle</span>
            {selectedCustomer.name} sélectionné
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wide text-[#6b7a99] mb-1.5">
            Montant (€)
          </label>
          <input
            type="number"
            min="0"
            step="100"
            value={form.amount}
            onChange={update('amount')}
            placeholder="25000"
            className={field}
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wide text-[#6b7a99] mb-1.5">
            Clôture visée
          </label>
          <input
            type="date"
            value={form.expectedCloseDate ?? ''}
            onChange={update('expectedCloseDate')}
            className={field}
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wide text-[#6b7a99] mb-1.5">
          Probabilité : {form.probability}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={form.probability}
          onChange={update('probability')}
          className="w-full accent-[#004ad1]"
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
          {saving ? 'Enregistrement…' : isEdit ? 'Modifier' : 'Créer l\u2019affaire'}
        </button>
      </div>
    </form>
  );
};

export default OpportunityForm;
