import { motion } from 'motion/react';
import { useParams, Link } from 'react-router-dom';

const CrmClientDetail = () => {
  const { id } = useParams();

  // Mock data for the client
  const client = {
    id: id || 'CLI-001',
    name: 'Tech Solutions Inc.',
    industry: 'Logiciel & Services',
    status: 'Actif',
    contact: {
      name: 'Jean Dupont',
      email: 'jean.dupont@techsolutions.com',
      phone: '+33 6 12 34 56 78'
    },
    opportunities: [
      { id: 'OPP-102', title: 'Déploiement ERP', amount: 45000, stage: 'Négociation', probability: 80 },
      { id: 'OPP-105', title: 'Formation Cloud', amount: 12000, stage: 'Gagné', probability: 100 }
    ],
    history: [
      { id: 1, type: 'Appel', date: '2025-10-12', description: 'Appel de qualification - Très intéressé par l\'ERP.' },
      { id: 2, type: 'Email', date: '2025-10-15', description: 'Envoi de la plaquette commerciale et grille tarifaire.' },
      { id: 3, type: 'Réunion', date: '2025-10-20', description: 'Démo produit avec le DSI.' }
    ]
  };

  return (
    <div className="max-w-screen-xl mx-auto space-y-6 pb-20">
      {/* ── En-tête & Navigation ────────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-sm text-[#6b7a99] mb-4">
        <Link to="/responsable/clients" className="hover:text-[#004ad1] transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Retour aux clients
        </Link>
        <span>/</span>
        <span className="text-[#001026] font-bold">{client.name}</span>
      </div>

      <header className="bg-white p-6 rounded-2xl border border-[#dde3ef] shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-2xl">
            {client.name.substring(0, 1)}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-extrabold text-[#001026] tracking-tight">{client.name}</h1>
              <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px] uppercase tracking-wider border border-emerald-100">
                {client.status}
              </span>
            </div>
            <p className="text-sm text-[#6b7a99] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">domain</span>
              {client.industry}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center justify-center w-10 h-10 rounded-xl border-2 border-[#dde3ef] text-[#6b7a99] hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-[20px]">edit</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white shadow-md shadow-blue-500/20 hover:-translate-y-0.5 transition-all bg-[#004ad1]">
            <span className="material-symbols-outlined text-[20px]">add</span>
            Nouvelle Opportunité
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne Gauche: Infos & Contacts */}
        <div className="space-y-6">
          <section className="bg-white p-5 rounded-2xl border border-[#dde3ef] shadow-sm">
            <h2 className="text-sm font-bold text-[#6b7a99] uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">contact_page</span>
              Contact Principal
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#001026] font-bold">
                  {client.contact.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-[#001026]">{client.contact.name}</p>
                  <p className="text-xs text-[#6b7a99]">Décideur</p>
                </div>
              </div>
              <div className="pt-2 space-y-2 text-sm">
                <a href={`mailto:${client.contact.email}`} className="flex items-center gap-2 text-[#004ad1] hover:underline">
                  <span className="material-symbols-outlined text-[18px] text-[#6b7a99]">mail</span>
                  {client.contact.email}
                </a>
                <a href={`tel:${client.contact.phone}`} className="flex items-center gap-2 text-[#001026] hover:text-[#004ad1] transition-colors">
                  <span className="material-symbols-outlined text-[18px] text-[#6b7a99]">call</span>
                  {client.contact.phone}
                </a>
              </div>
            </div>
          </section>

          <section className="bg-white p-5 rounded-2xl border border-[#dde3ef] shadow-sm">
            <h2 className="text-sm font-bold text-[#6b7a99] uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">query_stats</span>
              Statistiques
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-[#6b7a99] mb-1">Chiffre d'affaires potentiel</p>
                <p className="text-xl font-black text-[#001026]">57 000 €</p>
              </div>
              <div>
                <p className="text-xs text-[#6b7a99] mb-1">Opportunités en cours</p>
                <p className="text-xl font-black text-[#001026]">1</p>
              </div>
            </div>
          </section>
        </div>

        {/* Colonne Droite: Opportunités & Historique */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-2xl border border-[#dde3ef] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#dde3ef] flex items-center justify-between bg-slate-50/50">
              <h2 className="text-sm font-bold text-[#6b7a99] uppercase tracking-wider">Opportunités</h2>
              <button className="text-xs font-bold text-[#004ad1] hover:underline">Tout voir</button>
            </div>
            <div className="divide-y divide-[#dde3ef]">
              {client.opportunities.map((opp, idx) => (
                <motion.div 
                  key={opp.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <p className="font-bold text-[#001026] group-hover:text-[#004ad1] transition-colors">{opp.title}</p>
                    <p className="text-xs text-[#6b7a99] mt-0.5">{opp.id} • {opp.stage}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#001026]">{opp.amount.toLocaleString()} €</p>
                    <p className="text-xs text-[#6b7a99] mt-0.5">{opp.probability}% de probabilité</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-[#dde3ef] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#dde3ef] flex items-center justify-between bg-slate-50/50">
              <h2 className="text-sm font-bold text-[#6b7a99] uppercase tracking-wider">Historique des interactions</h2>
              <button className="text-xs font-bold text-[#004ad1] hover:underline">+ Ajouter une note</button>
            </div>
            <div className="p-5 relative">
              <div className="absolute left-[39px] top-5 bottom-5 w-px bg-[#dde3ef]"></div>
              <div className="space-y-6">
                {client.history.map((item, idx) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-4 relative z-10"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-100 border-4 border-white flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[16px] text-[#6b7a99]">
                        {item.type === 'Appel' ? 'call' : item.type === 'Email' ? 'mail' : 'groups'}
                      </span>
                    </div>
                    <div className="pt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-[#001026]">{item.type}</span>
                        <span className="text-xs text-[#6b7a99] font-mono">{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-[#001026] bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CrmClientDetail;
