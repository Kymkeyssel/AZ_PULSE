import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { crmService } from '../../../services/api';
import ReminderForm from '../components/crm/ReminderForm';
import AIInsightsWidget from '../components/AIInsightsWidget';
import AIChatDrawer from '../components/AIChatDrawer';
import { formatDate } from '../lib/format';

const STATUS_STYLES = {
  PROSPECT: {
    label: 'Prospect',
    chip: 'bg-[#dce1ff] text-[#003cac] border-[#b5c4ff]',
    dot: 'bg-[#004ad1]',
  },
  CLIENT: {
    label: 'Client',
    chip: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
};

/**
 * Carnet clients — design AZ PULSE / Stitch.
 *
 * Une relance se planifie depuis la fiche d'un client : c'est là que le
 * commercial a l'information utile (l'historique, l'affaire en cours) au
 * moment où il décide de rappeler.
 */
const CrmCustomers = () => {
  const location = useLocation();
  const detailBase = location.pathname.startsWith('/responsable') ? '/responsable/clients' : '/collaborateur/clients';
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
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const filters = {};
      if (status) filters.status = status;
      const res = await crmService.listCustomers(filters);

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

  const field =
    'w-full px-3.5 py-2.5 rounded-xl border border-[#c4c6cf] bg-white text-[13px] text-[#001026] focus:outline-none focus:ring-2 focus:ring-[#004ad1]/30 transition-all';

  const nbClients = customers.filter(c => c.status === 'CLIENT').length;
  const nbProspects = customers.filter(c => c.status === 'PROSPECT').length;

  return (
    <div className="flex flex-col gap-6">

      {/* ── 1. BANNIÈRE HERO ──────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#001026] via-[#0b2545] to-[#001026] text-white shadow-xl p-6 lg:p-8">
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-[#1a62fe]/10 blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-20 w-64 h-64 rounded-full bg-[#ffba20]/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffba20] animate-pulse" />
              CRM & Carnet Clients
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              Clients & Prospects
            </h1>
            <p className="text-[14px] text-[#778db2]">
              {customers.length} fiche{customers.length !== 1 ? 's' : ''} dans le carnet •{' '}
              {nbClients} client{nbClients !== 1 ? 's' : ''} •{' '}
              {nbProspects} prospect{nbProspects !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAiChatOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a62fe] hover:bg-[#004ad1] text-white text-[13px] font-bold shadow-md transition-all duration-200"
            >
              <span className="material-symbols-outlined notranslate text-[18px] animate-pulse">auto_awesome</span>
              Assistant IA
            </button>

            {canCreate && (
              <button
                onClick={() => { setEditing(null); setFormOpen(true); }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ffba20] hover:bg-[#f59e0b] text-[#001026] text-[13px] font-bold shadow-md transition-all duration-200"
              >
                <span className="material-symbols-outlined notranslate text-[18px]">person_add</span>
                Nouveau client
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── 2. KPIs RAPIDES ──────────────────────────────────────── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total fiches', value: customers.length, icon: 'contacts', color: 'text-[#001026]', bg: 'bg-[#eaeef2]' },
          { label: 'Clients actifs', value: nbClients, icon: 'domain', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Prospects', value: nbProspects, icon: 'search', color: 'text-[#004ad1]', bg: 'bg-[#dce1ff]' },
          { label: 'À relancer', value: '—', icon: 'notifications_active', color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((kpi, i) => (
          <div
            key={i}
            className="group rounded-2xl bg-white border border-[#dfe3e7] p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#44474e]">
                {kpi.label}
              </span>
              <div className={`w-8 h-8 rounded-xl ${kpi.bg} flex items-center justify-center ${kpi.color} group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined notranslate text-[18px]">{kpi.icon}</span>
              </div>
            </div>
            <div className="mt-3">
              <span className={`text-2xl font-extrabold tracking-tight ${kpi.color}`}>{kpi.value}</span>
            </div>
          </div>
        ))}
      </section>

      {/* ── 3. WIDGET IA INSIGHTS ────────────────────────────────── */}
      <AIInsightsWidget
        metrics={{
          count: customers.length,
          clients: nbClients,
          prospects: nbProspects,
        }}
        scope="CRM & Carnet clients"
        title="Analyse IA du portefeuille clients"
      />

      {/* ── 4. BARRE RECHERCHE & FILTRES ─────────────────────────── */}
      <div className="flex flex-wrap gap-3 rounded-2xl bg-white border border-[#dfe3e7] shadow-sm p-4">
        <div className="relative flex-1 min-w-[240px]">
          <span className="material-symbols-outlined notranslate text-[18px] text-[#74777f] absolute left-3 top-1/2 -translate-y-1/2">
            search
          </span>
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher un nom, un email, un secteur…"
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#c4c6cf] bg-[#f0f4f8] text-[13px] text-[#001026] focus:outline-none focus:ring-2 focus:ring-[#004ad1]/30 focus:bg-white transition-all"
          />
        </div>

        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl border border-[#c4c6cf] bg-white text-[13px] text-[#001026] focus:outline-none focus:ring-2 focus:ring-[#004ad1]/30 transition-all"
        >
          <option value="">Tous les statuts</option>
          <option value="PROSPECT">Prospects</option>
          <option value="CLIENT">Clients</option>
        </select>
      </div>

      {/* ── 5. LISTE DES CLIENTS ─────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin w-10 h-10 border-[3px] border-[#004ad1] border-t-transparent rounded-full" />
            <p className="text-[12px] text-[#74777f] font-medium">Chargement du carnet…</p>
          </div>
        </div>
      ) : customers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#c4c6cf] py-20 flex flex-col items-center gap-3 text-center bg-white">
          <span className="material-symbols-outlined notranslate text-[48px] text-[#c4c6cf]">contacts</span>
          <p className="text-[14px] font-bold text-[#001026]">
            {query ? 'Aucun résultat' : 'Carnet vide'}
          </p>
          <p className="text-[12px] text-[#74777f]">
            {query ? 'Essayez un autre terme.' : 'Créez votre premier client.'}
          </p>
          {!query && canCreate && (
            <button
              onClick={() => { setEditing(null); setFormOpen(true); }}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#004ad1] text-white text-[13px] font-bold hover:bg-[#003cac] transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined notranslate text-[18px]">person_add</span>
              Nouveau client
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-[#dfe3e7] shadow-sm overflow-hidden">
          {/* En-tête du tableau */}
          <div className="px-5 py-3 border-b border-[#eaeef2] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#dce1ff] flex items-center justify-center text-[#004ad1]">
                <span className="material-symbols-outlined notranslate text-[16px]">contacts</span>
              </div>
              <span className="text-[13px] font-bold text-[#001026]">
                {customers.length} fiche{customers.length !== 1 ? 's' : ''}
              </span>
            </div>
            {query && (
              <span className="text-[11px] text-[#74777f]">
                Résultats pour "{query}"
              </span>
            )}
          </div>

          <ul className="divide-y divide-[#eaeef2]">
            {customers.map(customer => {
              const style = STATUS_STYLES[customer.status] ?? STATUS_STYLES.PROSPECT;
              const initials = customer.name?.slice(0, 2).toUpperCase() ?? '??';

              return (
                <li
                  key={customer.id}
                  className="p-4 hover:bg-[#f0f4f8] transition-colors group"
                >
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-[#0b2545] text-white flex items-center justify-center flex-shrink-0 font-bold text-[13px] ring-2 ring-[#dce1ff]/50">
                      {initials}
                    </div>

                    {/* Infos */}
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-[14px] font-bold text-[#001026]">{customer.name}</p>
                        <span className={['text-[10px] font-bold px-2 py-0.5 rounded-full border', style.chip].join(' ')}>
                          {style.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#44474e] mt-0.5 truncate">
                        {[customer.industry, customer.email, customer.phone]
                          .filter(Boolean)
                          .join(' · ') || 'Aucune coordonnée renseignée'}
                      </p>
                    </div>

                    {/* Date */}
                    <p className="text-[11px] text-[#74777f] hidden md:flex items-center gap-1">
                      <span className="material-symbols-outlined notranslate text-[13px]">schedule</span>
                      {formatDate(customer.createdAt)}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <Link
                        to={`${detailBase}/${customer.id}`}
                        title="Ouvrir le dossier client"
                        className="p-2 rounded-lg text-[#74777f] hover:bg-[#dce1ff] hover:text-[#004ad1] transition-colors"
                      >
                        <span className="material-symbols-outlined notranslate text-[18px]">open_in_new</span>
                      </Link>
                      {canCreate && (
                        <button
                          onClick={() => setReminderFor(customer)}
                          title="Planifier une relance"
                          className="p-2 rounded-lg text-[#74777f] hover:bg-[#dce1ff] hover:text-[#004ad1] transition-colors"
                        >
                          <span className="material-symbols-outlined notranslate text-[18px]">add_task</span>
                        </button>
                      )}

                      {canUpdate && (
                        <button
                          onClick={() => { setEditing(customer); setFormOpen(true); }}
                          title="Modifier la fiche"
                          className="p-2 rounded-lg text-[#74777f] hover:bg-[#dce1ff] hover:text-[#004ad1] transition-colors"
                        >
                          <span className="material-symbols-outlined notranslate text-[18px]">edit</span>
                        </button>
                      )}

                      <Link
                        to="/collaborateur/crm"
                        title="Voir dans le pipeline"
                        className="p-2 rounded-lg text-[#74777f] hover:bg-[#dce1ff] hover:text-[#004ad1] transition-colors"
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

      {/* ── 6. MODAL FICHE CLIENT ────────────────────────────────── */}
      {formOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#001026]/60 backdrop-blur-sm"
            onClick={() => { setFormOpen(false); setEditing(null); }}
          />

          <form
            onSubmit={save}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <header className="px-6 py-5 border-b border-[#eaeef2]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#dce1ff] flex items-center justify-center text-[#004ad1]">
                  <span className="material-symbols-outlined notranslate text-[20px]">
                    {editing ? 'edit' : 'person_add'}
                  </span>
                </div>
                <div>
                  <h2 className="text-[15px] font-extrabold text-[#001026]">
                    {editing ? 'Modifier la fiche' : 'Nouveau client'}
                  </h2>
                  <p className="text-[11px] text-[#74777f] mt-0.5">
                    {editing ? `Fiche : ${editing.name}` : 'Renseignez les coordonnées du contact.'}
                  </p>
                </div>
              </div>
            </header>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wide text-[#44474e] mb-1.5">
                  Nom / raison sociale *
                </label>
                <input name="name" type="text" defaultValue={editing?.name ?? ''} className={field} required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wide text-[#44474e] mb-1.5">
                    Email · nécessaire au suivi
                  </label>
                  <input name="email" type="email" defaultValue={editing?.email ?? ''} className={field} required />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wide text-[#44474e] mb-1.5">
                    Téléphone
                  </label>
                  <input name="phone" type="tel" defaultValue={editing?.phone ?? ''} className={field} />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wide text-[#44474e] mb-1.5">
                  Secteur d&apos;activité
                </label>
                <input
                  name="industry"
                  type="text"
                  defaultValue={editing?.industry ?? ''}
                  placeholder="BTP, Numérique, Santé…"
                  className={field}
                />
              </div>

              {editing && canUpdate && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wide text-[#44474e] mb-1.5">
                    Statut
                  </label>
                  <select name="status" defaultValue={editing.status} className={field}>
                    <option value="PROSPECT">Prospect</option>
                    <option value="CLIENT">Client</option>
                  </select>
                  <p className="text-[10px] text-[#74777f] mt-1">
                    Le passage à « Client » se fait aussi automatiquement quand une affaire est gagnée.
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-[#eaeef2]">
                <button
                  type="button"
                  onClick={() => { setFormOpen(false); setEditing(null); }}
                  className="px-4 py-2.5 rounded-xl text-[13px] font-bold text-[#44474e] border border-[#c4c6cf] hover:bg-[#f0f4f8] transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl text-[13px] font-bold bg-[#001026] text-white hover:bg-[#0b2545] transition-colors shadow-sm"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ── 7. MODAL RELANCE ─────────────────────────────────────── */}
      {reminderFor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#001026]/60 backdrop-blur-sm"
            onClick={() => setReminderFor(null)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <header className="px-6 py-5 border-b border-[#eaeef2]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#dce1ff] flex items-center justify-center text-[#004ad1]">
                  <span className="material-symbols-outlined notranslate text-[20px]">add_task</span>
                </div>
                <div>
                  <h2 className="text-[15px] font-extrabold text-[#001026]">
                    Relancer {reminderFor.name}
                  </h2>
                  <p className="text-[11px] text-[#74777f] mt-0.5">
                    La relance sera rattachée à cette fiche client.
                  </p>
                </div>
              </div>
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

      {/* ── 8. CHAT ASSISTANT IA ──────────────────────────────────── */}
      <AIChatDrawer
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        currentContext={{
          module: 'CRM_CUSTOMERS',
          count: customers.length,
          nbClients,
          nbProspects,
        }}
      />
    </div>
  );
};

export default CrmCustomers;
