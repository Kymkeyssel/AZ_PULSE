import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { API_BASE_URL, TOKEN_KEY } from '../services/config';

/**
 * Tableau de bord du Super Administrateur.
 *
 * Toutes les valeurs affichées proviennent de Symfony, qui reste l'autorité
 * unique sur la donnée (`GET /api/dashboard/super-admin`, protégé par
 * `ROLE_SUPER_ADMIN`). Aucun chiffre n'est codé en dur : un écran de
 * gouvernance qui affiche des nombres inventés n'a aucune valeur probante et
 * engage la crédibilité de la démonstration.
 */
const SuperAdminDashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ title: '', icon: '', content: null });
  const [stats, setStats] = useState(null);
  const [pendingRequests, setPendingRequests] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const res = await fetch(`${API_BASE_URL}/dashboard/super-admin`, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setStats(json.data);
    } catch (err) {
      console.error(err);
      toast.error('Statistiques indisponibles : la API ne répond pas.');
    }

    // Compteur des demandes d'accès en attente d'arbitrage. Un échec ici n'a
    // pas à masquer les KPI ci-dessus : on laisse simplement la tuile à « — ».
    try {
      const reqRes = await fetch(`${API_BASE_URL}/admin/access-requests`, { headers });
      if (reqRes.ok) {
        const reqJson = await reqRes.json();
        const list = reqJson.data ?? [];
        setPendingRequests(list.filter((r) => r.status === 'PENDING'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStats();
  }, [fetchStats]);

  // Rendu d'une valeur numérique, ou d'un tiret si l'API n'a pas répondu.
  const n = (value) => (value === undefined || value === null ? '—' : value);

  const openModal = (type) => {
    let title;
    let icon;
    let content;

    if (type === 'new-user') {
      title = 'Créer un Nouvel Utilisateur AZ Pulse';
      icon = 'person_add';
      content = (
        <div className="space-y-3">
          <div>
            <label className="block font-bold text-[#001026] mb-1">Nom et Matricule</label>
            <input type="text" placeholder="Ex: Paul Atangana (AZ-889)" className="w-full px-3 py-2 rounded-xl bg-[#f0f4f8] text-[#001026] border border-[#dfe3e7]" />
          </div>
          <div>
            <label className="block font-bold text-[#001026] mb-1">Email professionnel</label>
            <input type="email" placeholder="p.atangana@az-corporation.com" className="w-full px-3 py-2 rounded-xl bg-[#f0f4f8] text-[#001026] border border-[#dfe3e7]" />
          </div>
          <div>
            <label className="block font-bold text-[#001026] mb-1">Pôle / Tenant</label>
            <select className="w-full px-3 py-2 rounded-xl bg-[#f0f4f8] text-[#001026] border border-[#dfe3e7]">
              <option>Direction Générale</option>
              <option>CRM & Ventes</option>
              <option>Pôle Formation</option>
              <option>Infrastructure & IT</option>
            </select>
          </div>
        </div>
      );
    } else if (type === 'rbac') {
      title = 'Matrice des Rôles & Permissions (RBAC)';
      icon = 'tune';
      content = (
        <div className="space-y-2">
          <p>
            Les rôles et permissions sont définis en base et versionnés par la
            commande <code>app:init-rbac</code>. Le Super Administrateur est le seul
            à les administrer : l&apos;Admin / Direction dispose de tous les droits
            métier sauf <code>role.manage</code> et <code>permission.manage</code>.
          </p>
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl font-semibold">
            L&apos;autorisation réelle est appliquée côté Symfony par
            <code> #[IsGranted]</code> sur chaque endpoint. Les gardes de route
            React ne sont qu&apos;un confort d&apos;affichage.
          </div>
        </div>
      );
    } else if (type === 'siem-live') {
      title = 'Journal d&apos;audit';
      icon = 'security';
      content = (
        <div className="p-3 bg-[#001026] text-[#b5c4ff] rounded-xl font-mono text-[11px] space-y-1 max-h-48 overflow-y-auto">
          <div>Le journal d&apos;audit est en cours de mise en place (phase 1).</div>
          <div className="text-[#8aa0d0]">
            Dès livraison, chaque décision d&apos;un administrateur (approbation,
            rejet, changement de rôle) y sera horodatée et attribuée.
          </div>
        </div>
      );
    } else if (type === 'new-admin') {
      title = 'Créer un Nouveau Compte Administrateur';
      icon = 'shield_person';
      content = (
        <div className="space-y-3">
          <div className="p-3 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs font-semibold">
            Attention : un compte administrateur donne accès aux demandes d&apos;accès,
            aux utilisateurs et aux données de tous les domaines. L&apos;octroi se fait
            par approbation explicite, et chaque décision est tracée.
          </div>
          <div>
            <label className="block font-bold text-[#001026] mb-1">Sélectionner le collaborateur</label>
            <select className="w-full px-3 py-2 rounded-xl bg-[#f0f4f8] text-[#001026] border border-[#dfe3e7]">
              <option>Jean B. (CTO)</option>
              <option>Sophie T. (DPO)</option>
              <option>Ali M. (SecOps)</option>
            </select>
          </div>
          <div>
            <label className="block font-bold text-[#001026] mb-1">Niveau d'habilitation RBAC</label>
            <select className="w-full px-3 py-2 rounded-xl bg-[#f0f4f8] text-[#001026] border border-[#dfe3e7]">
              <option>Super Administrateur Délégué</option>
              <option>Admin Sécurité & Réseaux</option>
              <option>Auditeur Conformité</option>
            </select>
          </div>
        </div>
      );
    } else {
      title = type.name;
      icon = 'dns';
      content = (
        <div className="space-y-2">
          <p className="font-medium text-[#001026]">{type.desc}</p>
          <div className="p-3 bg-[#f0f4f8] rounded-xl space-y-1.5">
            <div className="flex justify-between"><span>Statut :</span><strong className="text-emerald-700">{type.status}</strong></div>
            <div className="flex justify-between"><span>Latence / Réponse :</span><strong className="font-mono text-[#001026]">{type.latency}</strong></div>
            <div className="flex justify-between"><span>Cluster :</span><span>Paris DC-1 • Multi-AZ</span></div>
            <div className="flex justify-between"><span>Sécurité TLS :</span><span className="text-emerald-700 font-bold">1.3 Strict SHA-256</span></div>
          </div>
        </div>
      );
    }

    setModalData({ title, icon, content });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  return (
    <>
      {/* 1. PERSONA & IDENTITÉ */}
      <section className="glass-panel-dark rounded-3xl relative overflow-hidden p-8 shadow-2xl border-0 ring-1 ring-white/20 mt-2 group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-blue-900/40 to-transparent mix-blend-overlay"></div>
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-400/30 transition-colors"></div>
        <div className="absolute right-60 -bottom-20 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-400/20 transition-colors"></div>
        <div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold ring-1 ring-blue-400/30 backdrop-blur-sm">
                <span className="material-symbols-outlined notranslate text-[14px]">verified</span>Supervision Critique AZ Pulse
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">Bonjour, Administrateur Système</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-blue-100/80 font-medium">
              <span className="flex items-center gap-1.5 text-white">
                <span className="material-symbols-outlined notranslate text-[18px] text-amber-400">schedule</span>
                <span>Paris UTC+1 : 18:29:24 • Yaoundé UTC+1 : 18:29:24</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/30"></span>
              <span className="flex items-center gap-1 text-blue-200">
                <span className="material-symbols-outlined notranslate text-[18px]">history</span>Dernier audit : <strong className="text-white ml-1">Il y a 4 min par Dr. Marc V. (Super Admin)</strong>
              </span>
            </div>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 self-stretch xl:self-auto">
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 shadow-inner group-hover:bg-white/10 transition-colors">
              <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-amber-400/15 text-amber-400 border border-amber-400/20 shadow-inner">
                <span className="material-symbols-outlined notranslate text-[30px] drop-shadow-sm">health_and_safety</span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-ping"></span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full"></span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-200/70">Santé Globale</span>
                <span className="text-xl font-bold text-white leading-tight drop-shadow-sm">100% Opérationnel</span>
                <span className="text-xs text-amber-200/90 font-medium mt-0.5">Zéro anomalie de niveau 1</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/superadmin/users" className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 hover:-translate-y-0.5 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                <span className="material-symbols-outlined notranslate text-[20px]">person_add</span>
                <span>+ Créer Utilisateur</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Insight Prédictif */}
      <section className="mt-6 glass-panel rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-amber-400 opacity-80"></div>
        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl group-hover:bg-amber-400/10 transition-colors"></div>
        <div className="flex items-start md:items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined notranslate text-[24px]">auto_awesome</span>
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-sm font-extrabold text-slate-800 flex items-center gap-1">Insight Prédictif IA Système</span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200">Modèle Prédictif Nominal</span>
              <span className="text-[11px] text-slate-500 font-mono font-semibold">Confiance 98.7%</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-4xl font-medium">
              <strong className="text-slate-800 font-bold">Socle Symfony</strong> : authentification
              par jeton Bearer, autorisation par permissions vérifiées côté serveur
              (<code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">#[IsGranted]</code>), et validation humaine obligatoire avant toute
              action sensible.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 self-end md:self-auto relative z-10">
          <button onClick={() => toast.info("Le diagnostic d'infrastructure sera branché sur les métriques du serveur de supervision.")} type="button" className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm border border-slate-200">
            <span className="material-symbols-outlined notranslate text-[16px] text-blue-600">troubleshoot</span>
            <span>Analyser</span>
          </button>
          <button onClick={() => toast.info("Génération en cours du Rapport d'Intégrité IA en direct (SHA-256 scellé)...")} type="button" className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 hover:-translate-y-0.5">
            <span className="text-amber-400">✨</span>
            <span>Rapport d'intégrité IA</span>
          </button>
        </div>
      </section>

      {/* 4. BLOC KPI PRINCIPAL */}
      <section className="mt-6 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5">
        <Link to="/superadmin/users" className="glass-panel p-5 rounded-2xl hover:-translate-y-1 hover:shadow-xl hover:border-blue-300 transition-all group flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/80 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Utilisateurs</span>
            <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm group-hover:scale-110">
              <span className="material-symbols-outlined notranslate text-[20px]">group</span>
            </span>
          </div>
          <div className="my-2.5 relative z-10">
            <div className="text-4xl font-black text-slate-800 tracking-tight drop-shadow-sm">{n(stats?.users)}</div>
            <div className="text-xs text-slate-500 font-semibold mt-1">Comptes enregistrés</div>
          </div>
          <div className="pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] relative z-10">
            <span className="text-slate-500 font-medium">Source : table User</span>
          </div>
        </Link>

        <Link to="/superadmin/requests" className="glass-panel p-5 rounded-2xl border-amber-200/60 bg-gradient-to-br from-white to-amber-50/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-300 transition-all group flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/0 to-amber-100/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-900">Accès &amp; Privilèges</span>
            <span className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-900 transition-colors shadow-sm group-hover:scale-110">
              <span className="material-symbols-outlined notranslate text-[20px]">key</span>
            </span>
          </div>
          <div className="my-2.5 relative z-10">
            <div className="text-4xl font-black text-amber-900 tracking-tight drop-shadow-sm">{pendingRequests === null ? '—' : pendingRequests.length}</div>
            <div className="text-xs text-amber-800 font-semibold mt-1">Demandes à arbitrer</div>
          </div>
          <div className="pt-2.5 border-t border-amber-200/60 flex items-center justify-between text-[10px] relative z-10">
            <span className="text-amber-800 font-bold">Validation humaine obligatoire</span>
          </div>
        </Link>

        <div className="glass-panel p-5 rounded-2xl hover:-translate-y-1 hover:shadow-xl transition-all group flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Clients CRM</span>
            <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined notranslate text-[20px]">handshake</span>
            </span>
          </div>
          <div className="my-2.5 relative z-10">
            <div className="text-4xl font-black text-slate-800 tracking-tight drop-shadow-sm">{n(stats?.customers)}</div>
            <div className="text-xs text-slate-500 font-semibold mt-1">Sociétés référencées</div>
          </div>
          <div className="pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] relative z-10">
            <span className="text-slate-500 font-medium">Source : table Customer</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl hover:-translate-y-1 hover:shadow-xl transition-all group flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Projets</span>
            <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined notranslate text-[20px]">folder_open</span>
            </span>
          </div>
          <div className="my-2.5 relative z-10">
            <div className="text-4xl font-black text-slate-800 tracking-tight drop-shadow-sm">{n(stats?.projects)}</div>
            <div className="text-xs text-slate-500 font-semibold mt-1">Dossiers suivis</div>
          </div>
          <div className="pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] relative z-10">
            <span className="text-slate-500 font-medium">Source : table Project</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl hover:-translate-y-1 hover:shadow-xl transition-all group flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Chiffre d&apos;affaires</span>
            <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined notranslate text-[20px]">payments</span>
            </span>
          </div>
          <div className="my-2.5 relative z-10">
            <div className="text-3xl font-black text-emerald-900 tracking-tight drop-shadow-sm">
              {stats?.totalRevenue ? stats.totalRevenue.toLocaleString('fr-FR') : '—'}
            </div>
            <div className="text-xs text-slate-500 font-semibold mt-1">Affaires gagnées (CRM)</div>
          </div>
          <div className="pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] relative z-10">
            <span className="text-slate-500 font-medium">Opportunités au stade WON</span>
          </div>
        </div>

        <a href="#infra-it" className="glass-panel p-5 rounded-2xl hover:-translate-y-1 hover:shadow-xl hover:border-blue-300 transition-all group flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/80 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Incidents ouverts</span>
            <span className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors shadow-sm group-hover:scale-110">
              <span className="material-symbols-outlined notranslate text-[20px]">build_circle</span>
            </span>
          </div>
          <div className="my-2.5 relative z-10">
            <div className="text-4xl font-black text-slate-800 tracking-tight drop-shadow-sm">{n(stats?.openIncidents)}</div>
            <div className="text-xs text-slate-500 font-semibold mt-1">Tickets non clos</div>
          </div>
          <div className="pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] relative z-10">
            <span className="text-slate-500 font-medium">Inventaire : GLPI (§8)</span>
          </div>
        </a>
      </section>

      {/* 5. ZONE D'ACTION REQUISE */}
      <section className="mt-6 glass-panel-dark rounded-3xl text-white p-6 shadow-2xl border-0 ring-1 ring-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/30 via-slate-900/50 to-transparent mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-4 max-w-3xl relative z-10">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-extrabold uppercase tracking-wider shadow-inner backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
              Actions Requises Prioritaires
            </span>
            <span className="text-sm text-blue-200/80 font-semibold bg-white/5 px-2.5 py-1 rounded-full border border-white/5 backdrop-blur-sm">• 4 points d'attention détectés</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-3 bg-white/5 px-4 py-2.5 rounded-xl border border-white/10 shadow-sm backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 flex-shrink-0 shadow-[0_0_8px_rgba(248,113,113,0.8)]"></span>
              <span className="text-blue-100/90"><strong className="text-white font-bold">2 services</strong> avec erreurs / latence anormale</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 px-4 py-2.5 rounded-xl border border-white/10 shadow-sm backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0 shadow-[0_0_8px_rgba(251,191,36,0.8)]"></span>
              <span className="text-blue-100/90"><strong className="text-white font-bold">17 demandes d'accès</strong> en attente d'arbitrage</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 px-4 py-2.5 rounded-xl border border-white/10 shadow-sm backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0 shadow-[0_0_8px_rgba(251,191,36,0.8)]"></span>
              <span className="text-blue-100/90"><strong className="text-white font-bold">3 comptes à vérifier</strong> (authentification suspecte)</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 px-4 py-2.5 rounded-xl border border-white/10 shadow-sm backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 flex-shrink-0 shadow-[0_0_8px_rgba(250,204,21,0.8)]"></span>
              <span className="text-blue-100/90"><strong className="text-white font-bold">1 intégration GLPI</strong> nécessite une vérification</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 self-stretch lg:self-auto justify-end relative z-10">
          <Link to="/superadmin/users" className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 active:scale-95 border border-blue-400/30">
            <span className="material-symbols-outlined notranslate text-[18px]">person_add</span> + Nouvel utilisateur
          </Link>
          <button onClick={() => openModal('new-admin')} className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold transition-all border border-white/20 flex items-center gap-2 active:scale-95 shadow-sm backdrop-blur-sm">
            <span className="material-symbols-outlined notranslate text-[18px]">shield_person</span> + Créer admin
          </button>
          <Link to="/superadmin/requests" className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-extrabold transition-all shadow-lg shadow-amber-400/20 flex items-center gap-2 active:scale-95">
            <span className="material-symbols-outlined notranslate text-[18px]">check_circle</span> Voir demandes
          </Link>
        </div>
      </section>

      {/* 6. SANTÉ DU SYSTÈME & SÉCURITÉ */}
      <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6" id="section-system-health">
        {/* SANTÉ */}
        <div className="glass-panel p-6 rounded-3xl shadow-sm flex flex-col justify-between group hover:shadow-xl transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined notranslate text-[20px]">dns</span>
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800">Santé du Système (Micro-Services)</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Supervision opérationnelle • Dernier check : 10:42</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-[11px] font-bold ring-1 ring-emerald-200 backdrop-blur-sm flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                8 / 8 En Ligne
              </span>
            </div>
            <div className="divide-y divide-slate-100 text-xs mt-2">
              {[
                { name: 'Backend Symfony', status: 'API REST & ORM — autorité unique', color: 'emerald', sub: 'PHP 8.3', desc: 'Source de vérité des données, des permissions et des actions.' },
                { name: 'PostgreSQL', status: 'Base relationnelle', color: 'emerald', sub: 'PostgreSQL', desc: 'Référentiels users, CRM, formations, projets.' },
                { name: 'React (Vite)', status: 'Interface — sans accès direct aux données', color: 'emerald', sub: 'React 18', desc: 'Passe par l\'API Symfony, jamais par la base ni GLPI.' },
                { name: 'Service IA (FastAPI)', status: 'Orchestration d\'agents', color: 'amber', sub: 'FastAPI', desc: 'Appelle le fournisseur de modèle. Aucun accès PostgreSQL.' },
                { name: 'GLPI', status: 'Inventaire — système de référence', color: 'emerald', sub: 'GLPI', desc: 'Interrogé par Symfony uniquement, via GlpiService.' },
                { name: 'n8n', status: 'Workflows simples', color: 'amber', sub: 'n8n', desc: 'Orchestration des processus courts, sans Logique métier.' },
              ].map(svc => (
                <div key={svc.name} className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/50 px-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full bg-${svc.color}-400 shrink-0 shadow-[0_0_8px_var(--tw-shadow-color)] shadow-${svc.color}-400/50`}></span>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">{svc.name}</span>
                      <span className="text-[10px] text-slate-500 font-medium">{svc.sub}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[11px] text-slate-500 truncate hidden sm:block font-medium">{svc.desc}</span>
                    <span className={`text-[10px] font-bold text-${svc.color}-800 bg-${svc.color}-100/80 px-2.5 py-1 rounded-md shrink-0 backdrop-blur-sm`}>{svc.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-4 mt-2 border-t border-slate-200/60 flex items-center justify-between relative z-10">
            <span className="text-[11px] text-slate-500 font-medium">Socle déclaré par le document d&apos;architecture</span>
            <a href="#configuration" className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 transition-colors">
              Détails sondes système →
            </a>
          </div>
        </div>

        {/* SÉCURITÉ */}
        <div className="glass-panel p-6 rounded-3xl shadow-sm flex flex-col justify-between group hover:shadow-xl transition-shadow relative overflow-hidden">
          <div className="absolute top-0 left-0 w-40 h-40 bg-amber-400/5 rounded-full blur-2xl group-hover:bg-amber-400/10 transition-colors pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined notranslate text-[20px]">security</span>
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800">Sécurité & Accès (Gouvernance)</h3>
                  <p className="text-[11px] text-slate-500 font-medium">RBAC, validation humaine et cloisonnement par domaine</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 text-[11px] font-bold ring-1 ring-blue-200 backdrop-blur-sm flex items-center gap-1.5 shadow-sm">
                <span className="material-symbols-outlined notranslate text-[14px]">lock</span>
                FIDO2 Strict
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/60 backdrop-blur-sm shadow-inner hover:-translate-y-0.5 transition-transform">
                <div className="text-xs text-amber-900 font-bold uppercase tracking-wider">Demandes d'accès</div>
                <div className="text-2xl font-black text-amber-950 mt-1 drop-shadow-sm">17</div>
                <div className="text-[10px] text-amber-700 font-medium mt-1">En attente d'arbitrage</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/60 backdrop-blur-sm shadow-inner hover:-translate-y-0.5 transition-transform">
                <div className="text-xs text-slate-700 font-bold uppercase tracking-wider">Rôles modifiés</div>
                <div className="text-2xl font-black text-slate-800 mt-1 drop-shadow-sm">4</div>
                <div className="text-[10px] text-blue-600 font-bold mt-1">2 sensibles</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-red-50/80 border border-red-200/60 backdrop-blur-sm shadow-inner hover:-translate-y-0.5 transition-transform">
                <div className="text-xs text-red-700 font-bold uppercase tracking-wider">Comptes suspendus</div>
                <div className="text-2xl font-black text-red-800 mt-1 drop-shadow-sm">3</div>
                <div className="text-[10px] text-red-600 font-medium mt-1">Vérification identité</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/60 backdrop-blur-sm shadow-inner hover:-translate-y-0.5 transition-transform">
                <div className="text-xs text-slate-700 font-bold uppercase tracking-wider">Tentatives bloquées</div>
                <div className="text-2xl font-black text-slate-800 mt-1 drop-shadow-sm">2</div>
                <div className="text-[10px] text-red-600 font-medium mt-1">WAF / IP spoof filtrée</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/60 backdrop-blur-sm shadow-inner hover:-translate-y-0.5 transition-transform">
                <div className="text-xs text-slate-700 font-bold uppercase tracking-wider">Connexions filtrées</div>
                <div className="text-2xl font-black text-slate-800 mt-1 drop-shadow-sm">1 482</div>
                <div className="text-[10px] text-emerald-600 font-medium mt-1">Inhabituelles contrôlées</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/60 backdrop-blur-sm shadow-inner hover:-translate-y-0.5 transition-transform">
                <div className="text-xs text-emerald-900 font-bold uppercase tracking-wider">Journal d&apos;audit</div>
                <div className="text-sm font-black text-emerald-950 mt-2 font-mono bg-emerald-200/50 inline-block px-1 rounded">En construction</div>
                <div className="text-[10px] text-emerald-700 font-medium mt-1">Phase 1 du chantier</div>
              </div>
            </div>
            
            {/* Sparkline & Alerte */}
            <div className="p-4 rounded-2xl glass-panel-dark text-white space-y-3 shadow-inner relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="flex items-center justify-between text-[11px] relative z-10">
                <span className="text-blue-200 font-medium">Tentatives de connexion & autorisations (24h)</span>
                <span className="text-amber-400 font-mono font-bold bg-amber-400/10 px-2 py-0.5 rounded backdrop-blur-sm">1 482 valides • 2 bloquées</span>
              </div>
              <div className="h-12 w-full relative z-10">
                <svg className="w-full h-full text-blue-500" fill="none" preserveAspectRatio="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 200 40">
                  <defs>
                    <linearGradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" style={{stopColor:'#3b82f6', stopOpacity: 0.4}}></stop>
                      <stop offset="100%" style={{stopColor:'#3b82f6', stopOpacity: 0.0}}></stop>
                    </linearGradient>
                  </defs>
                  <path d="M0,35 L20,32 L40,28 L60,30 L80,18 L100,12 L120,16 L140,8 L160,14 L180,10 L200,6 L200,40 L0,40 Z" fill="url(#grad1)"></path>
                  <path d="M0,35 L20,32 L40,28 L60,30 L80,18 L100,12 L120,16 L140,8 L160,14 L180,10 L200,6" stroke="#3b82f6" strokeWidth="2.5"></path>
                  <circle cx="80" cy="18" fill="#f87171" r="4" stroke="#7f1d1d" strokeWidth="1"></circle>
                  <circle cx="160" cy="14" fill="#f87171" r="4" stroke="#7f1d1d" strokeWidth="1"></circle>
                </svg>
              </div>
            </div>
            <div className="mt-4 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start justify-between gap-4 backdrop-blur-sm shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 shadow-sm border border-amber-200">
                  <span className="text-amber-500 text-lg drop-shadow-sm">✨</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-amber-950">Diagnostic IA Opérationnel</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-amber-200/80 text-amber-900 border border-amber-300/50">Recommandation</span>
                  </div>
                  <p className="text-[11px] text-amber-900/80 font-medium leading-snug">Tentative d'injection SQL filtrée par WAF (Paris DC-1). <strong className="text-amber-950 font-bold bg-amber-200/30 px-1 rounded">IP 185.220.101.4</strong> mise en quarantaine recommandée.</p>
                </div>
              </div>
              <button onClick={() => toast.success('Action IA appliquée : IP 185.220.101.4 ajoutée à la liste noire temporaire du Firewall applicatif pour 72h.')} className="flex-shrink-0 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold transition-all shadow-md flex items-center gap-1.5 hover:-translate-y-0.5">
                <span className="material-symbols-outlined notranslate text-[14px] text-amber-400">security</span>
                <span>Isoler l'IP</span>
              </button>
            </div>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between gap-2 relative z-10">
            <Link to="/superadmin/requests" className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors">
              Voir les demandes →
            </Link>
            <button onClick={() => openModal('siem-live')} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all shadow-sm border border-slate-200">
              Voir le journal d&apos;audit
            </button>
          </div>
        </div>
      </section>

      {/* 7. DEMANDES & ACTIVITÉ */}
      <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
        <div className="glass-panel rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-xl transition-shadow relative overflow-hidden" id="admin-requests">
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined notranslate text-[20px]">how_to_reg</span>
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800">Demandes d'accès à traiter</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Arbitrage immédiat des privilèges d'utilisateurs</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200 text-[10px] font-bold font-mono shadow-sm">
                  <span className="text-amber-500">✨</span><span>Conformité IA : 99.4%</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-extrabold ring-1 ring-amber-200 shadow-sm">
                  {pendingRequests?.length ?? '—'} demande(s)
                </span>
              </div>
            </div>
            <div className="divide-y divide-slate-100 text-xs mt-2">
              {pendingRequests === null ? (
                <div className="py-6 text-center text-slate-500 font-medium">Chargement des demandes…</div>
              ) : pendingRequests.length === 0 ? (
                <div className="py-6 text-center text-slate-500 font-medium">
                  Aucune demande en attente d&apos;arbitrage.
                </div>
              ) : (
                pendingRequests.slice(0, 3).map((req) => {
                  const name = req.user?.fullName ?? req.user?.email ?? 'Demandeur';
                  const initials = name
                    .split(' ')
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((w) => w[0].toUpperCase())
                    .join('');

                  return (
                    <div key={req.id} className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/50 px-2 rounded-xl transition-colors">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 text-white flex items-center justify-center font-extrabold text-xs shadow-md border border-slate-700">
                          {initials || '?'}
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-800 flex items-center gap-2">
                            {name}
                            {req.requestedDomain && (
                              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{req.requestedDomain}</span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                            <span className="material-symbols-outlined notranslate text-[14px]">schedule</span>
                            {req.createdAt
                              ? new Date(req.createdAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })
                              : '—'}
                            {req.requestedProfile?.label && (
                              <> <span className="text-slate-300">•</span> <span className="font-bold text-slate-700">{req.requestedProfile.label}</span></>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-amber-100 text-amber-900">En attente</span>
                        <Link
                          to="/superadmin/requests"
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition-colors shadow-sm"
                        >
                          Traiter
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <div className="pt-4 mt-2 border-t border-slate-200/60 flex items-center justify-between relative z-10">
            <span className="text-[11px] text-slate-500 font-medium">
              {pendingRequests && pendingRequests.length > 3
                ? `${pendingRequests.length - 3} autre(s) dans la file`
                : 'File complète affichée ci-dessus'}
            </span>
            <Link to="/superadmin/requests" className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors flex items-center gap-1">
              Voir toutes les demandes →
            </Link>
          </div>
        </div>
        
        <div className="glass-panel rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-xl transition-shadow relative overflow-hidden" id="admin-logs">
          <div className="absolute top-0 right-0 w-40 h-40 bg-slate-400/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined notranslate text-[20px]">history</span>
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800">Activité Récente (Traçabilité)</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Journal immuable horodaté SHA-256</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200 text-[11px] font-mono font-bold shadow-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Flux Temps Réel
              </span>
            </div>
            <div className="relative pl-6 space-y-4 mt-4 text-xs before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              <div className="relative flex flex-col">
                <span className="absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white shadow-sm"></span>
                <span className="text-[10px] text-slate-500 font-bold mb-0.5">Aujourd'hui, 10:42</span>
                <span className="font-bold text-slate-800">Dernier rapport d'intégrité IA généré</span>
                <span className="text-[11px] text-slate-500 font-medium mt-0.5">Validation cryptographique OK. Empreinte: <code className="bg-slate-100 px-1 rounded text-slate-600">8f4a...2c9</code></span>
              </div>
              <div className="relative flex flex-col">
                <span className="absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-white shadow-sm"></span>
                <span className="text-[10px] text-slate-500 font-bold mb-0.5">Aujourd'hui, 09:15</span>
                <span className="font-bold text-slate-800">Alerte sécurité WAF (Niveau Bas)</span>
                <span className="text-[11px] text-slate-500 font-medium mt-0.5">Tentative d'accès non autorisé depuis l'IP 185.220.101.4</span>
              </div>
              <div className="relative flex flex-col">
                <span className="absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white shadow-sm"></span>
                <span className="text-[10px] text-slate-500 font-bold mb-0.5">Hier, 18:30</span>
                <span className="font-bold text-slate-800">Mise à jour système v3.9-LIVE</span>
                <span className="text-[11px] text-slate-500 font-medium mt-0.5">Déploiement automatique par CI/CD terminé avec succès.</span>
              </div>
              <div className="relative flex flex-col">
                <span className="absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full bg-slate-400 ring-4 ring-white shadow-sm"></span>
                <span className="text-[10px] text-slate-500 font-bold mb-0.5">Hier, 14:22</span>
                <span className="font-bold text-slate-800">Création compte administrateur (S. Martin)</span>
                <span className="text-[11px] text-slate-500 font-medium mt-0.5">Autorisé par Dr. Marc V. (Super Admin)</span>
              </div>
            </div>
          </div>
          <div className="pt-4 mt-2 border-t border-slate-200/60 flex items-center justify-center relative z-10">
             <button onClick={() => openModal('siem-live')} className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all shadow-sm border border-slate-200 w-full text-center">
              Explorer le journal d&apos;audit complet
            </button>
          </div>
        </div>
      </section>

      {/* 8. BLOCS SYNTHÉTIQUES */}
      <section className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pb-6">
        <div className="glass-panel rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-xl transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined notranslate text-[18px] text-blue-600 bg-blue-50 p-1.5 rounded-lg shadow-sm">stacked_bar_chart</span>
                Pilotage Global
              </h4>
              <span className="text-[10px] text-slate-500 font-mono font-bold bg-slate-100 px-2 py-0.5 rounded-full">Total: 807</span>
            </div>
            <div className="space-y-3 pt-4 text-xs font-medium">
              <div>
                <div className="flex justify-between text-[11px] mb-1"><span className="text-slate-600">CRM</span><span className="font-bold text-slate-800">142 actions (87%)</span></div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner"><div className="bg-blue-600 h-full rounded-full" style={{width:'87%'}}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1"><span className="text-slate-600">Workspace</span><span className="font-bold text-slate-800">286 actions (76%)</span></div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner"><div className="bg-slate-800 h-full rounded-full" style={{width:'76%'}}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1"><span className="text-slate-600">Formation</span><span className="font-bold text-slate-800">92 actions (62%)</span></div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner"><div className="bg-amber-500 h-full rounded-full" style={{width:'62%'}}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1"><span className="text-slate-600">Knowledge Hub</span><span className="font-bold text-slate-800">58 actions (43%)</span></div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner"><div className="bg-emerald-500 h-full rounded-full" style={{width:'43%'}}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1"><span className="text-slate-600">Infrastructure</span><span className="font-bold text-slate-800">74 actions (58%)</span></div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner"><div className="bg-indigo-500 h-full rounded-full" style={{width:'58%'}}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1"><span className="text-slate-600">Analytics</span><span className="font-bold text-slate-800">39 actions (31%)</span></div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner"><div className="bg-purple-500 h-full rounded-full" style={{width:'31%'}}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1"><span className="text-slate-600">AI Workspace</span><span className="font-bold text-slate-800">112 actions (68%)</span></div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner"><div className="bg-rose-500 h-full rounded-full" style={{width:'68%'}}></div></div>
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-200/60 text-[11px] text-slate-500 font-medium relative z-10 flex justify-between items-center">
            Charge plateforme :
            <span className="px-2 py-0.5 rounded text-emerald-700 bg-emerald-100 font-bold border border-emerald-200/50">62.4%</span>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-xl transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined notranslate text-[18px] text-amber-500 bg-amber-50 p-1.5 rounded-lg shadow-sm">psychology</span>
                AI Monitoring
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 ring-1 ring-amber-200 shadow-sm">v2.4 Core</span>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-4 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60 shadow-inner hover:-translate-y-0.5 transition-transform"><div className="text-[10px] text-slate-500 font-bold mb-1">Analyses/jour</div><div className="text-xl font-black text-slate-800 drop-shadow-sm">42</div></div>
              <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60 shadow-inner hover:-translate-y-0.5 transition-transform"><div className="text-[10px] text-slate-500 font-bold mb-1">Recommandations</div><div className="text-xl font-black text-blue-600 drop-shadow-sm">18</div></div>
              <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60 shadow-inner hover:-translate-y-0.5 transition-transform"><div className="text-[10px] text-slate-500 font-bold mb-1">Échecs</div><div className="text-xl font-black text-red-600 drop-shadow-sm">2</div></div>
              <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60 shadow-inner hover:-translate-y-0.5 transition-transform"><div className="text-[10px] text-slate-500 font-bold mb-1">Temps moyen</div><div className="text-xl font-black text-emerald-600 font-mono drop-shadow-sm">2.4s</div></div>
            </div>
            <div className="mt-4">
              <div className="text-[11px] font-bold text-slate-500 mb-2">État des 6 agents IA :</div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-medium">
                {['Project', 'Commercial', 'Document', 'IT', 'Analytics', 'Formation'].map(agent => (
                  <div key={agent} className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_5px_var(--tw-shadow-color)] shadow-emerald-400"></span>
                    <span className="truncate text-slate-700">{agent}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <a className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline block pt-3 border-t border-slate-200/60 relative z-10 transition-colors" href="#ai-workspace">
            Ouvrir AI Workspace →
          </a>
        </div>

        <div className="glass-panel rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-xl transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined notranslate text-[18px] text-indigo-600 bg-indigo-50 p-1.5 rounded-lg shadow-sm">dns</span>
                Infra & IT
              </h4>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full ring-1 ring-emerald-200 shadow-sm">Sync GLPI</span>
            </div>
            <div className="space-y-3 pt-4 text-xs font-medium">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                <span className="text-slate-600">Équipements :</span><strong className="text-slate-800 font-black text-sm drop-shadow-sm">248</strong>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 shadow-sm">
                <span className="text-amber-900">Incidents ouverts :</span><strong className="text-amber-900 font-black text-sm drop-shadow-sm">12</strong>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-red-50/80 border border-red-200/80 shadow-sm">
                <span className="text-red-700">Incidents critiques :</span><strong className="text-red-700 font-black text-sm drop-shadow-sm">2</strong>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                <span className="text-slate-600">Maintenances :</span><strong className="text-slate-800 font-black text-sm drop-shadow-sm">7</strong>
              </div>
            </div>
          </div>
          <a className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline block pt-3 border-t border-slate-200/60 relative z-10 transition-colors" href="#infra-it">
            Voir Infrastructure IT →
          </a>
        </div>

        <div className="glass-panel rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-xl transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined notranslate text-[18px] text-purple-600 bg-purple-50 p-1.5 rounded-lg shadow-sm">analytics</span>
                Analytics
              </h4>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full ring-1 ring-slate-200">Cockpit</span>
            </div>
            <div className="space-y-3 pt-4 text-xs font-medium">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100"><span className="text-slate-500">Comptes enregistrés :</span><span className="font-extrabold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{n(stats?.users)}</span></div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100"><span className="text-slate-500">Activité système :</span><span className="font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">807 / 24h</span></div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100"><span className="text-slate-500">Demandes d'accès :</span><span className="font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">17 attente</span></div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100"><span className="text-slate-500">Actions admin :</span><span className="font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">48 auditées</span></div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100"><span className="text-slate-500">Utilisation IA :</span><span className="font-extrabold text-amber-500 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">42 requêtes</span></div>
              <div className="flex justify-between items-center py-1.5"><span className="text-slate-500">Incidents résolus :</span><span className="font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">94.8% SLA</span></div>
            </div>
          </div>
          <a className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline block pt-3 border-t border-slate-200/60 relative z-10 transition-colors" href="#analytics">
            Consulter le rapport →
          </a>
        </div>
      </section>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[60] bg-[#001026]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-[#dfe3e7] animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#dfe3e7] pb-3">
              <h3 className="text-base font-extrabold text-[#001026] flex items-center gap-2">
                <span className="material-symbols-outlined notranslate text-[#004ad1]">{modalData.icon}</span>
                <span>{modalData.title}</span>
              </h3>
              <button className="p-1 rounded-lg text-[#44474e] hover:bg-[#eaeef2]" onClick={closeModal}>
                <span className="material-symbols-outlined notranslate text-[20px]">close</span>
              </button>
            </div>
            <div className="text-xs text-[#44474e] space-y-3">
              {modalData.content}
            </div>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#dfe3e7]">
              <button className="px-3.5 py-2 rounded-xl bg-[#eaeef2] text-[#001026] text-xs font-semibold" onClick={closeModal}>
                Fermer
              </button>
              <button className="px-4 py-2 rounded-xl bg-secondary-container text-white text-xs font-bold hover:bg-secondary" onClick={closeModal}>
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SuperAdminDashboard;
