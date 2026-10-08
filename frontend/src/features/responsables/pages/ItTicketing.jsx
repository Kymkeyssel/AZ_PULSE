import { useState } from 'react';
import { motion } from 'motion/react';

const MOCK_TICKETS = [
  {
    id: 'INC-2026-001',
    title: 'Panne serveur de base de données (Prod)',
    status: 'OPEN',
    priority: 'CRITICAL',
    author: 'Serge N.',
    date: '2026-09-29T08:30:00Z',
    category: 'Serveurs',
    assignedTo: 'Equipe SysOps'
  },
  {
    id: 'INC-2026-002',
    title: 'Problème de connexion VPN',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    author: 'Marie L.',
    date: '2026-09-29T09:15:00Z',
    category: 'Réseau',
    assignedTo: 'Support N1'
  },
  {
    id: 'INC-2026-003',
    title: 'Renouvellement licence Office 365',
    status: 'CLOSED',
    priority: 'LOW',
    author: 'Jean P.',
    date: '2026-09-28T14:20:00Z',
    category: 'Logiciel',
    assignedTo: 'Support N1'
  }
];

const STATUS_CONFIG = {
  OPEN: { label: 'Ouvert', bg: 'bg-error-container', text: 'text-on-error-container' },
  IN_PROGRESS: { label: 'En cours', bg: 'bg-amber-100', text: 'text-amber-800' },
  CLOSED: { label: 'Fermé', bg: 'bg-emerald-100', text: 'text-emerald-800' }
};

const PRIORITY_CONFIG = {
  CRITICAL: { icon: 'warning', color: 'text-error' },
  HIGH: { icon: 'keyboard_double_arrow_up', color: 'text-orange-500' },
  MEDIUM: { icon: 'keyboard_arrow_up', color: 'text-amber-500' },
  LOW: { icon: 'keyboard_arrow_down', color: 'text-blue-500' }
};

const ItTicketing = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="max-w-screen-xl mx-auto space-y-6 pb-20">
      {/* ── En-tête ───────────────────────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#001026] tracking-tight">Support & Ticketing IT</h1>
          <p className="text-sm text-[#6b7a99] mt-1">
            Gérez les incidents, les demandes de service et assurez le suivi des interventions.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white shadow-md shadow-blue-500/20 hover:-translate-y-0.5 transition-all bg-[#004ad1]">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Nouveau Ticket
        </button>
      </header>

      {/* ── KPIs ──────────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#dde3ef] p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600">
            <span className="material-symbols-outlined text-[24px]">confirmation_number</span>
          </div>
          <div>
            <p className="text-2xl font-black text-[#001026]">124</p>
            <p className="text-xs font-semibold text-[#6b7a99] uppercase tracking-wider mt-0.5">Total (Mois)</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#dde3ef] p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-50 text-red-600">
            <span className="material-symbols-outlined text-[24px]">warning</span>
          </div>
          <div>
            <p className="text-2xl font-black text-[#001026]">3</p>
            <p className="text-xs font-semibold text-[#6b7a99] uppercase tracking-wider mt-0.5">Critiques</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#dde3ef] p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-50 text-amber-600">
            <span className="material-symbols-outlined text-[24px]">pending_actions</span>
          </div>
          <div>
            <p className="text-2xl font-black text-[#001026]">12</p>
            <p className="text-xs font-semibold text-[#6b7a99] uppercase tracking-wider mt-0.5">En cours</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#dde3ef] p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600">
            <span className="material-symbols-outlined text-[24px]">task_alt</span>
          </div>
          <div>
            <p className="text-2xl font-black text-[#001026]">94%</p>
            <p className="text-xs font-semibold text-[#6b7a99] uppercase tracking-wider mt-0.5">Résolus &lt; 24h</p>
          </div>
        </div>
      </section>

      {/* ── Recherche et Filtres ────────────────────────────────────────── */}
      <section className="flex flex-col md:flex-row items-center gap-4 bg-white p-3 rounded-xl border border-[#dde3ef] shadow-sm">
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7a99]">search</span>
          <input 
            type="text" 
            placeholder="Rechercher par ID, titre, demandeur..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 pl-10 pr-4 py-2 text-sm font-medium text-[#001026] placeholder-[#6b7a99] focus:outline-none focus:ring-2 focus:ring-[#004ad1]/20 rounded-lg"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select className="bg-slate-50 text-sm font-medium text-[#001026] py-2 px-3 rounded-lg focus:outline-none border border-transparent focus:border-[#004ad1]/20">
            <option>Tous les statuts</option>
            <option>Ouverts</option>
            <option>En cours</option>
            <option>Fermés</option>
          </select>
          <select className="bg-slate-50 text-sm font-medium text-[#001026] py-2 px-3 rounded-lg focus:outline-none border border-transparent focus:border-[#004ad1]/20">
            <option>Toutes les catégories</option>
            <option>Matériel</option>
            <option>Logiciel</option>
            <option>Réseau</option>
            <option>Accès</option>
          </select>
        </div>
      </section>

      {/* ── Liste des Tickets ───────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#dde3ef] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-[#6b7a99] font-medium border-b border-[#dde3ef]">
              <tr>
                <th className="px-6 py-4">ID Ticket</th>
                <th className="px-6 py-4 min-w-[300px]">Sujet / Description</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Priorité</th>
                <th className="px-6 py-4">Demandeur</th>
                <th className="px-6 py-4">Assigné à</th>
                <th className="px-6 py-4 text-right">Création</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dde3ef]">
              {MOCK_TICKETS.map((ticket, idx) => (
                <motion.tr 
                  key={ticket.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4 font-mono font-bold text-[#004ad1]">
                    {ticket.id}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-[#001026]">{ticket.title}</p>
                    <p className="text-xs text-[#6b7a99] mt-0.5">{ticket.category}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${STATUS_CONFIG[ticket.status].bg} ${STATUS_CONFIG[ticket.status].text}`}>
                      {STATUS_CONFIG[ticket.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 font-bold text-[#001026]">
                      <span className={`material-symbols-outlined text-[18px] ${PRIORITY_CONFIG[ticket.priority].color}`}>
                        {PRIORITY_CONFIG[ticket.priority].icon}
                      </span>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-[#6b7a99]">
                        {ticket.author.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-[#001026] font-medium">{ticket.author}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#6b7a99]">
                    {ticket.assignedTo}
                  </td>
                  <td className="px-6 py-4 text-right text-[#6b7a99]">
                    {new Date(ticket.date).toLocaleDateString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ItTicketing;
