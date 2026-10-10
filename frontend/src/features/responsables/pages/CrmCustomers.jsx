import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { crmService } from '../../../services/api';
import ReminderForm from '../components/crm/ReminderForm';
import { formatDate } from '../lib/format';

const STATUS_STYLES = {
  PROSPECT: { label: 'Prospect', chip: 'bg-blue-50/80 text-blue-700 border-blue-200/60', dot: 'bg-blue-500' },
  CLIENT:  { label: 'Client',  chip: 'bg-emerald-50/80 text-emerald-700 border-emerald-200/60', dot: 'bg-emerald-500' },
};

/**
 * Carnet clients — design glassmorphism, données réelles (API `/customers`).
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
  const [allCustomers, setAllCustomers] = useState([]);
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
      const data = res.data ?? [];
      setAllCustomers(data);
      setCustomers(data);
    } catch (err) {
      toast.error(err.message || 'Chargement du carnet impossible.');
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => { load(); }, [load]);

  // Recherche côté interface : sur un carnet de quelques centaines de
  // fiches, éviter un aller-retour à chaque frappe est plus rapide
  // et sans arrière-pensée de performance.
  useEffect(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) { setCustomers(allCustomers); return; }
    const timer = setTimeout(() => {
      setCustomers(
        allCustomers.filter(
          c =>
            c.name?.toLowerCase().includes(needle) ||
            c.email?.toLowerCase().includes(needle) ||
            c.industry?.toLowerCase().includes(needle)
        )
      );
    }, 200);
    return () => clearTimeout(timer);
  }, [query, allCustomers]);

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
      toast.error('Le nom est obligatoire.');
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

  const prospectCount = allCustomers.filter(c => c.status === 'PROSPECT').length;
  const clientCount = allCustomers.filter(c => c.status === 'CLIENT').length;

  const field = 'glass-input';

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* ── En-tête ───────────────────────────────────────────────── */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#001026] font-syne">Clients</h1>
          <p className="text-sm text-[#6b7a99] mt-1">
            {allCustomers.length} fiche{allCustomers.length > 1 ? 's' : ''} au carnet — {prospectCount} prospects, {clientCount} clients.
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => { setEditing(null); setFormOpen(true); }}
            className="glass-btn glass-btn-primary"
          >
            <span className="material-symbols-outlined notranslate text-[18px]">person_add</span>
            Nouveau client
          </button>
        )}
      </header>

      {/* ── KPI glass ─────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card glass-glow p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-600 border border-blue-200/40">
            <span className="material-symbols-outlined text-[24px]">contacts</span>
          </div>
          <div>
            <p className="text-2xl font-black text-[#001026]">{allCustomers.length}</p>
            <p className="text-[11px] font-bold text-[#6b7a99] uppercase tracking-wider">Total carnet</p>
          </div>
        </div>
        <div className="glass-card glass-glow p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-sky-500/10 text-sky-600 border border-sky-200/40">
            <span className="material-symbols-outlined text-[24px]">explore</span>
          </div>
          <div>
            <p className="text-2xl font-black text-[#001026]">{prospectCount}</p>
            <p className="text-[11px] font-bold text-[#6b7a99] uppercase tracking-wider">Prospects</p>
          </div>
        </div>
        <div className="glass-card glass-glow p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-600 border border-emerald-200/40">
            <span className="material-symbols-outlined text-[24px]">verified_user</span>
          </div>
          <div>
            <p className="text-2xl font-black text-[#001026]">{clientCount}</p>
            <p className="text-[11px] font-bold text-[#6b7a99] uppercase tracking-wider">Clients</p>
          </div>
        </div>
      </section>

      {/* ── Filtres ───────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <span className="material-symbols-outlined notranslate text-[18px] text-[#94a3b8] absolute left-3.5 top-1/2 -translate-y-1/2">
            search
          </span>
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher un nom, un email, un secteur…"
            className="glass-input pl-10"
          />
        </div>

        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="glass-input w-auto"
        >
          <option value="">Tous les statuts</option>
          <option value="PROSPECT">Prospects</option>
          <option value="CLIENT">Clients</option>
        </select>
      </div>

      {/* ── Liste ─────────────────────────────────────────────────── */}
      {loading ? (
        <div className="glass-card p-16 flex items-center justify-center">
          <div className="animate-spin w-9 h-9 border-4 border-[#1D63FF] border-t-transparent rounded-full" />
        </div>
      ) : customers.length === 0 ? (
        <div className="glass-card p-16 text-center border-dashed">
          <span className="material-symbols-outlined notranslate text-[40px] text-[#cbd5e1]">contacts</span>
          <p className="text-sm font-bold text-[#0b2545] mt-3">
            {query ? 'Aucun résultat' : 'Carnet vide'}
          </p>
          <p className="text-xs text-[#6b7a99] mt-1">
            {query ? 'Essayez un autre terme.' : 'Créez votre premier client.'}
          </p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <ul className="divide-y divide-[#eef2f7]/60">
            {customers.map((customer, idx) => {
              const style = STATUS_STYLES[customer.status] ?? STATUS_STYLES.PROSPECT;

              return (
                <motion.li
                  key={customer.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03, duration: 0.3 }}
                  className="p-4 hover:bg-white/40 transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0b2545] to-[#1D63FF] text-white flex items-center justify-center flex-shrink-0 font-bold text-sm shadow-lg shadow-blue-500/20">
                      {customer.name?.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-[#001026]">{customer.name}</p>
                        <span className={`glass-chip ${style.chip}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                          {style.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6b7a99] mt-0.5 truncate">
                        {[customer.industry, customer.email, customer.phone]
                          .filter(Boolean)
                          .join(' · ') || 'Aucune coordonnée'}
                      </p>
                    </div>

                    <p className="text-[11px] text-[#94a3b8] hidden md:flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      Depuis le {formatDate(customer.createdAt)}
                    </p>

                    <div className="flex items-center gap-1.5">
                      {canCreate && (
                        <button
                          onClick={() => setReminderFor(customer)}
                          title="Planifier une relance"
                          className="p-2 rounded-lg text-[#6b7a99] hover:bg-blue-50 hover:text-[#004ad1] transition-colors"
                        >
                          <span className="material-symbols-outlined notranslate text-[18px]">add_task</span>
                        </button>
                      )}

                      {canUpdate && (
                        <button
                          onClick={() => { setEditing(customer); setFormOpen(true); }}
                          title="Modifier la fiche"
                          className="p-2 rounded-lg text-[#6b7a99] hover:bg-blue-50 hover:text-[#004ad1] transition-colors"
                        >
                          <span className="material-symbols-outlined notranslate text-[18px]">edit</span>
                        </button>
                      )}

                      <Link
                        to="/responsable/crm"
                        title="Voir dans le pipeline"
                        className="p-2 rounded-lg text-[#6b7a99] hover:bg-blue-50 hover:text-[#004ad1] transition-colors"
                      >
                        <span className="material-symbols-outlined notranslate text-[18px]">ads_click</span>
                      </Link>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>
      )}

      {/* ── Modal fiche client ────────────────────────────────────── */}
      <AnimatePresence>
        {formOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#001026]/40 backdrop-blur-sm"
              onClick={() => { setFormOpen(false); setEditing(null); }}
            />

            <motion.form
              onSubmit={save}
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative glass-card w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <header className="px-6 py-4 border-b border-[#dde3ef]/60 bg-white/30 backdrop-blur">
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
                    <label className="block text-[11px] font-bold uppercase tracking-wide text-[#6b7a99] mb-1.5">Email · nécessaire au suivi</label>
                    <input name="email" type="email" defaultValue={editing?.email ?? ''} className={field} required />
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
                    className="glass-btn"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="glass-btn glass-btn-primary"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* ── Modal relance rattachée au client ─────────────────────── */}
      <AnimatePresence>
        {reminderFor && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#001026]/40 backdrop-blur-sm"
              onClick={() => setReminderFor(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative glass-card w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <header className="px-6 py-4 border-b border-[#dde3ef]/60 bg-white/30 backdrop-blur">
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CrmCustomers;
