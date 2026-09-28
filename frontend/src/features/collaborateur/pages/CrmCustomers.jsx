import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { crmService } from '../../../services/api';
import ReminderForm from '../components/crm/ReminderForm';
import { formatDate } from '../lib/format';

const STATUS_STYLES = {
  PROSPECT: { label: 'Prospect', chip: 'bg-[#eff6ff] text-[#004ad1] border-[#bfdbfe]' },
  CLIENT:  { label: 'Client',  chip: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
};

/**
 * Carnet clients.
 *
 * Une relance se planifie depuis la fiche d'un client : c'est là que le
 * commercial a l'information utile (l'historique, l'affaire en cours) au
 * moment où il décide de rappeler.
 */
const CrmCustomers = () => {
  const { hasPermission } = useAuth();
  const canCreate = hasPermission('crm.create');
  const canUpdate = hasPermission('crm.update');

  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [reminderFor, setReminderFor] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const filters = {};
      if (status) filters.status = status;
      const res = await crmService.listCustomers(filters);

      // Recherche côté interface : sur un carnet de quelques centaines de
      // fiches, éviter un aller-retour à chaque frappe est plus rapide
      // et sans arrière-pensée de performance.
      const needle = query.trim().toLowerCase();
      setCustomers(
        needle
          ? (res.data ?? []).filter(
              c =>
                c.name?.toLowerCase().includes(needle) ||
                c.email?.toLowerCase().includes(needle) ||
                c.industry?.toLowerCase().includes(needle)
            )
          : (res.data ?? [])
      );
    } catch (err) {
      toast.error(err.message || 'Chargement du carnet impossible.');
    } finally {
      setLoading(false);
    }
  }, [query, status]);

  useEffect(() => {
    const timer = setTimeout(load, query ? 250 : 0);
    return () => clearTimeout(timer);
  }, [load, query]);

  const save = async e => {
    e.preventDefault();
    const form = e.target;

    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim() || null,
      phone: form.phone.value.trim() || null,
      industry: form.industry.value.trim() || null,
    };

    if (!payload.name) {
      toast.error("Le nom est obligatoire.");
      return;
    }

    try {
      if (editing) {
        await crmService.updateCustomer(editing.id, payload);
        toast.success('Client mis à jour.');
      } else {
        await crmService.createCustomer(payload);
        toast.success('Client créé.');
      }
      setFormOpen(false);
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err.message || 'Enregistrement impossible.');
    }
  };

  const field = 'w-full px-3.5 py-2.5 rounded-lg border border-[#dde3ef] bg-white text-sm text-[#001026] focus:outline-none focus:ring-2 focus:ring-[#004ad1]/20';

  return (
    <div className="max-w-6xl mx-auto space-y-5">

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#001026]">Clients</h1>
          <p className="text-sm text-[#6b7a99] mt-1">
            {customers.length} fiche{customers.length > 1 ? 's' : ''} au carnet.
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => { setEditing(null); setFormOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0b2545] text-white text-sm font-bold hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined notranslate text-[18px]">person_add</span>
            Nouveau client
          </button>
        )}
      </header>

      {/* ── Filtres ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <span className="material-symbols-outlined notranslate text-[18px] text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2">
            search
          </span>
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher un nom, un email, un secteur…"
            className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-[#dde3ef] bg-white text-sm text-[#001026] focus:outline-none focus:ring-2 focus:ring-[#004ad1]/20"
          />
        </div>

        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="px-3.5 py-2.5 rounded-lg border border-[#dde3ef] bg-white text-sm text-[#0b2545] focus:outline-none focus:ring-2 focus:ring-[#004ad1]/20"
        >
          <option value="">Tous les statuts</option>
          <option value="PROSPECT">Prospects</option>
          <option value="CLIENT">Clients</option>
        </select>
      </div>

      {/* ── Liste ───────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin w-9 h-9 border-4 border-[#004ad1] border-t-transparent rounded-full" />
        </div>
      ) : customers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-[#cbd5e1] py-16 text-center">
          <span className="material-symbols-outlined notranslate text-[40px] text-[#cbd5e1]">contacts</span>
          <p className="text-sm font-bold text-[#0b2545] mt-3">
            {query ? 'Aucun résultat' : 'Carnet vide'}
          </p>
          <p className="text-xs text-[#6b7a99] mt-1">
            {query ? 'Essayez un autre terme.' : 'Créez votre premier client.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#dde3ef] overflow-hidden shadow-sm">
          <ul className="divide-y divide-[#eef2f7]">
            {customers.map(customer => {
              const style = STATUS_STYLES[customer.status] ?? STATUS_STYLES.PROSPECT;

              return (
                <li key={customer.id} className="p-4 hover:bg-[#fafcff] transition-colors">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#0b2545] text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
                      {customer.name?.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-[#001026]">{customer.name}</p>
                        <span className={['text-[10px] font-bold px-2 py-0.5 rounded border', style.chip].join(' ')}>
                          {style.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6b7a99] mt-0.5 truncate">
                        {[customer.industry, customer.email, customer.phone]
                          .filter(Boolean)
                          .join(' · ') || 'Aucune coordonnée'}
                      </p>
                    </div>

                    <p className="text-[11px] text-[#94a3b8] hidden md:block">
                      Depuis le {formatDate(customer.createdAt)}
                    </p>

                    <div className="flex items-center gap-1.5">
                      {canCreate && (
                        <button
                          onClick={() => setReminderFor(customer)}
                          title="Planifier une relance"
                          className="p-2 rounded-lg text-[#6b7a99] hover:bg-[#eff6ff] hover:text-[#004ad1] transition-colors"
                        >
                          <span className="material-symbols-outlined notranslate text-[18px]">add_task</span>
                        </button>
                      )}

                      {canUpdate && (
                        <button
                          onClick={() => { setEditing(customer); setFormOpen(true); }}
                          title="Modifier la fiche"
                          className="p-2 rounded-lg text-[#6b7a99] hover:bg-[#eff6ff] hover:text-[#004ad1] transition-colors"
                        >
                          <span className="material-symbols-outlined notranslate text-[18px]">edit</span>
                        </button>
                      )}

                      <Link
                        to="/collaborateur/crm"
                        title="Voir dans le pipeline"
                        className="p-2 rounded-lg text-[#6b7a99] hover:bg-[#eff6ff] hover:text-[#004ad1] transition-colors"
                      >
                        <span className="material-symbols-outlined notranslate text-[18px]">ads_click</span>
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* ── Modal fiche client ──────────────────────────────────────────── */}
      {formOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#001026]/50 backdrop-blur-sm" onClick={() => { setFormOpen(false); setEditing(null); }} />

          <form onSubmit={save} className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <header className="px-6 py-4 border-b border-[#dde3ef]">
              <h2 className="text-base font-extrabold text-[#001026]">
                {editing ? 'Modifier la fiche' : 'Nouveau client'}
              </h2>
            </header>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wide text-[#6b7a99] mb-1.5">Nom / raison sociale</label>
                <input name="name" type="text" defaultValue={editing?.name ?? ''} className={field} required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wide text-[#6b7a99] mb-1.5">Email</label>
                  <input name="email" type="email" defaultValue={editing?.email ?? ''} className={field} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wide text-[#6b7a99] mb-1.5">Téléphone</label>
                  <input name="phone" type="tel" defaultValue={editing?.phone ?? ''} className={field} />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wide text-[#6b7a99] mb-1.5">Secteur</label>
                <input name="industry" type="text" defaultValue={editing?.industry ?? ''} placeholder="BTP, Numérique, Santé…" className={field} />
              </div>

              {editing && canUpdate && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wide text-[#6b7a99] mb-1.5">Statut</label>
                  <select name="status" defaultValue={editing.status} className={field}>
                    <option value="PROSPECT">Prospect</option>
                    <option value="CLIENT">Client</option>
                  </select>
                  <p className="text-[10px] text-[#94a3b8] mt-1">
                    Le passage à « Client » se fait aussi automatiquement quand une affaire est gagnée.
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => { setFormOpen(false); setEditing(null); }}
                  className="px-4 py-2.5 rounded-lg text-sm font-bold text-[#6b7a99] border border-[#dde3ef] hover:bg-[#f4f7fb] transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-lg text-sm font-bold bg-[#0b2545] text-white hover:opacity-90 transition-opacity"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ── Modal relance rattachée au client ──────────────────────────── */}
      {reminderFor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#001026]/50 backdrop-blur-sm" onClick={() => setReminderFor(null)} />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <header className="px-6 py-4 border-b border-[#dde3ef]">
              <h2 className="text-base font-extrabold text-[#001026]">Relancer {reminderFor.name}</h2>
              <p className="text-[11px] text-[#6b7a99] mt-0.5">
                La relance sera rattachée à cette fiche.
              </p>
            </header>

            <div className="px-6 py-5">
              <ReminderForm
                key={reminderFor.id}
                customerId={reminderFor.id}
                onSaved={() => {
                  setReminderFor(null);
                  toast.success('Relance planifiée.');
                }}
                onCancel={() => setReminderFor(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrmCustomers;
