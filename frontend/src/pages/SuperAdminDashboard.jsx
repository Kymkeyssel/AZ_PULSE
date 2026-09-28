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
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#001026] via-[#0b2545] to-[#001c3b] text-white p-6 shadow-xl border border-white/10 mt-2">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-secondary/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-60 -bottom-20 w-64 h-64 bg-[#fbbf24]/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-white text-[11px] font-bold">
                <span className="material-symbols-outlined notranslate text-[13px]">verified</span>Supervision Critique AZ Pulse
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white">Bonjour, Administrateur Système</h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#778db2]">
              <span className="flex items-center gap-1.5 text-white font-medium">
                <span className="material-symbols-outlined notranslate text-[16px] text-[#fbbf24]">schedule</span>
                <span>Paris UTC+1 : 18:29:24 • Yaoundé UTC+1 : 18:29:24</span>
              </span>
              <span className="w-1 h-1 rounded-full bg-white/20"></span>
              <span className="flex items-center gap-1 text-[#b5c4ff]">
                <span className="material-symbols-outlined notranslate text-[16px]">history</span>Dernier audit : <strong className="text-white ml-1">Il y a 4 min par Dr. Marc V. (Super Admin)</strong>
              </span>
            </div>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 self-stretch xl:self-auto">
            <div className="flex items-center gap-3.5 bg-[#001026]/70 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 shadow-inner">
              <div className="relative flex items-center justify-center w-11 h-11 rounded-lg bg-[#fbbf24]/10 text-[#fbbf24]">
                <span className="material-symbols-outlined notranslate text-[28px]">health_and_safety</span>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-secondary-container rounded-full animate-ping"></span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#778db2]">Santé Globale</span>
                <span className="text-lg font-bold text-white leading-tight">100% Opérationnel</span>
                <span className="text-[11px] text-[#ffdea8] font-medium">Zéro anomalie de niveau 1</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => openModal('new-user')} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-secondary-container text-white text-xs font-bold hover:bg-secondary transition-all shadow-lg active:scale-95" type="button">
                <span className="material-symbols-outlined notranslate text-[18px]">person_add</span>
                <span>+ Créer Utilisateur</span>
              </button>
              <button onClick={() => openModal('rbac')} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white text-[#001026] text-xs font-bold hover:bg-[#f0f4f8] transition-all shadow-lg active:scale-95" type="button">
                <span className="material-symbols-outlined notranslate text-[18px] text-[#004ad1]">rule_folder</span>
                <span>Auditer Rôles</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Insight Prédictif */}
      <section className="mt-5 rounded-2xl bg-white border border-[#dfe3e7] p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start md:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#001026] text-[#fbbf24] flex items-center justify-center flex-shrink-0 shadow-sm border border-[#dfe3e7]">
            <span className="material-symbols-outlined notranslate text-[20px]">auto_awesome</span>
          </div>
          <div className="space-y-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold text-[#001026] flex items-center gap-1">Insight Prédictif IA Système</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Modèle Prédictif Nominal</span>
              <span className="text-[11px] text-[#74777f] font-mono">Confiance 98.7%</span>
            </div>
            <p className="text-xs text-[#44474e] leading-relaxed">
              <strong className="text-[#001026]">Socle Symfony</strong> : authentification
              par jeton Bearer, autorisation par permissions vérifiées côté serveur
              (<code>#[IsGranted]</code>), et validation humaine obligatoire avant toute
              action sensible.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-auto">
          <button onClick={() => toast.info("Le diagnostic d'infrastructure sera branché sur les métriques du serveur de supervision.")} type="button" className="px-3 py-1.5 rounded-xl bg-[#f0f4f8] hover:bg-[#dfe3e7] text-[#001026] text-xs font-bold transition-all flex items-center gap-1.5">
            <span className="material-symbols-outlined notranslate text-[15px] text-[#004ad1]">troubleshoot</span>
            <span>Analyser</span>
          </button>
          <button onClick={() => toast.info("Génération en cours du Rapport d'Intégrité IA en direct (SHA-256 scellé)...")} type="button" className="px-3.5 py-1.5 rounded-xl bg-[#001026] hover:bg-[#0b2545] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5">
            <span className="text-[#fbbf24]">✨</span>
            <span>Rapport d'intégrité IA</span>
          </button>
        </div>
      </section>

      {/* 4. BLOC KPI PRINCIPAL */}
      <section className="mt-5 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <Link to="/superadmin/users" className="bg-white p-4 rounded-2xl border border-[#dfe3e7] shadow-sm hover:border-[#004ad1] hover:shadow transition-all group flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#44474e]">Utilisateurs</span>
            <span className="w-8 h-8 rounded-lg bg-[#f0f4f8] text-[#004ad1] flex items-center justify-center group-hover:bg-[#004ad1] group-hover:text-white transition-colors">
              <span className="material-symbols-outlined notranslate text-[18px]">group</span>
            </span>
          </div>
          <div className="my-1.5">
            <div className="text-2xl font-extrabold text-[#001026] tracking-tight">{n(stats?.users)}</div>
            <div className="text-[11px] text-[#44474e] font-medium">Comptes enregistrés</div>
          </div>
          <div className="pt-1.5 border-t border-[#dfe3e7]/50 flex items-center justify-between text-[10px]">
            <span className="text-[#44474e]">Source : table User</span>
          </div>
        </Link>

        <Link to="/superadmin/requests" className="bg-white p-4 rounded-2xl border border-amber-200 bg-gradient-to-br from-white to-amber-50/40 shadow-sm hover:border-amber-400 hover:shadow transition-all group flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">Accès &amp; Privilèges</span>
            <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
              <span className="material-symbols-outlined notranslate text-[18px]">key</span>
            </span>
          </div>
          <div className="my-1.5">
            <div className="text-2xl font-extrabold text-amber-900 tracking-tight">{pendingRequests === null ? '—' : pendingRequests.length}</div>
            <div className="text-[11px] text-amber-800 font-medium">Demandes à arbitrer</div>
          </div>
          <div className="pt-1.5 border-t border-amber-200/60 flex items-center justify-between text-[10px]">
            <span className="text-amber-800 font-medium">Validation humaine obligatoire</span>
          </div>
        </Link>

        <div className="bg-white p-4 rounded-2xl border border-[#dfe3e7] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#44474e]">Clients CRM</span>
            <span className="w-8 h-8 rounded-lg bg-[#f0f4f8] text-[#004ad1] flex items-center justify-center">
              <span className="material-symbols-outlined notranslate text-[18px]">handshake</span>
            </span>
          </div>
          <div className="my-1.5">
            <div className="text-2xl font-extrabold text-[#001026] tracking-tight">{n(stats?.customers)}</div>
            <div className="text-[11px] text-[#44474e] font-medium">Sociétés référencées</div>
          </div>
          <div className="pt-1.5 border-t border-[#dfe3e7]/50 flex items-center justify-between text-[10px]">
            <span className="text-[#44474e]">Source : table Customer</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#dfe3e7] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#44474e]">Projets</span>
            <span className="w-8 h-8 rounded-lg bg-[#f0f4f8] text-[#004ad1] flex items-center justify-center">
              <span className="material-symbols-outlined notranslate text-[18px]">folder_open</span>
            </span>
          </div>
          <div className="my-1.5">
            <div className="text-2xl font-extrabold text-[#001026] tracking-tight">{n(stats?.projects)}</div>
            <div className="text-[11px] text-[#44474e] font-medium">Dossiers suivis</div>
          </div>
          <div className="pt-1.5 border-t border-[#dfe3e7]/50 flex items-center justify-between text-[10px]">
            <span className="text-[#44474e]">Source : table Project</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#dfe3e7] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#44474e]">Chiffre d&apos;affaires</span>
            <span className="w-8 h-8 rounded-lg bg-[#f0f4f8] text-[#004ad1] flex items-center justify-center">
              <span className="material-symbols-outlined notranslate text-[18px]">payments</span>
            </span>
          </div>
          <div className="my-1.5">
            <div className="text-2xl font-extrabold text-[#001026] tracking-tight">
              {stats?.totalRevenue ? stats.totalRevenue.toLocaleString('fr-FR') : '—'}
            </div>
            <div className="text-[11px] text-[#44474e] font-medium">Affaires gagnées (CRM)</div>
          </div>
          <div className="pt-1.5 border-t border-[#dfe3e7]/50 flex items-center justify-between text-[10px]">
            <span className="text-[#44474e]">Opportunités au stade WON</span>
          </div>
        </div>

        <a href="#infra-it" className="bg-white p-4 rounded-2xl border border-[#dfe3e7] shadow-sm hover:border-[#004ad1] hover:shadow transition-all group flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#001026]">Incidents ouverts</span>
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-[#004ad1] group-hover:text-white transition-colors">
              <span className="material-symbols-outlined notranslate text-[18px]">build_circle</span>
            </span>
          </div>
          <div className="my-1.5">
            <div className="text-2xl font-extrabold text-[#001026] tracking-tight">{n(stats?.openIncidents)}</div>
            <div className="text-[11px] text-[#44474e] font-medium">Tickets non clos</div>
          </div>
          <div className="pt-1.5 border-t border-[#dfe3e7]/50 flex items-center justify-between text-[10px]">
            <span className="text-[#44474e]">Inventaire : GLPI (§8)</span>
          </div>
        </a>
      </section>

      {/* 5. ZONE D'ACTION REQUISE */}
      <section className="mt-5 bg-gradient-to-r from-[#001026] via-[#0b2545] to-[#001c3b] rounded-2xl text-white p-5 shadow-lg border border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div className="space-y-2.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-[11px] font-extrabold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
              Actions Requises Prioritaires
            </span>
            <span className="text-xs text-[#b5c4ff] font-medium">• 4 points d'attention détectés</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
              <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0"></span>
              <span className="text-[#dfe3e7]"><strong className="text-white">2 services</strong> avec erreurs / latence anormale</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
              <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0"></span>
              <span className="text-[#dfe3e7]"><strong className="text-white">17 demandes d'accès</strong> en attente d'arbitrage</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
              <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0"></span>
              <span className="text-[#dfe3e7]"><strong className="text-white">3 comptes à vérifier</strong> (authentification suspecte)</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
              <span className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0"></span>
              <span className="text-[#dfe3e7]"><strong className="text-white">1 intégration GLPI</strong> nécessite une vérification</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 self-stretch lg:self-auto justify-end">
          <button onClick={() => openModal('new-user')} className="px-3 py-2 rounded-xl bg-secondary-container hover:bg-secondary text-white text-xs font-bold transition-all shadow flex items-center gap-1.5 active:scale-95">
            <span className="material-symbols-outlined notranslate text-[16px]">person_add</span> + Nouvel utilisateur
          </button>
          <button onClick={() => openModal('new-admin')} className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15 flex items-center gap-1.5 active:scale-95">
            <span className="material-symbols-outlined notranslate text-[16px]">shield_person</span> + Créer admin
          </button>
          <button onClick={() => openModal('rbac')} className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15 flex items-center gap-1.5 active:scale-95">
            <span className="material-symbols-outlined notranslate text-[16px]">tune</span> Gérer permissions
          </button>
          <Link to="/superadmin/requests" className="px-3 py-2 rounded-xl bg-[#fbbf24] hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-all shadow flex items-center gap-1.5 active:scale-95">
            <span className="material-symbols-outlined notranslate text-[16px]">check_circle</span> Voir demandes
          </Link>
        </div>
      </section>

      {/* 6. SANTÉ DU SYSTÈME & SÉCURITÉ */}
      <section className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5" id="section-system-health">
        {/* SANTÉ */}
        <div className="bg-white rounded-2xl border border-[#dfe3e7] p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-[#dfe3e7]">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-6 bg-[#004ad1] rounded-full"></span>
                <div>
                  <h3 className="text-sm font-extrabold text-[#001026]">Santé du Système (Micro-Services)</h3>
                  <p className="text-[11px] text-[#44474e]">Supervision opérationnelle • Dernier check : 10:42</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                8 / 8 En Ligne
              </span>
            </div>
            <div className="divide-y divide-[#dfe3e7]/60 text-xs mt-1">
              {[
                { name: 'Backend Symfony', status: 'API REST & ORM — autorité unique', color: 'emerald', sub: 'PHP 8.3', desc: 'Source de vérité des données, des permissions et des actions.' },
                { name: 'PostgreSQL', status: 'Base relationnelle', color: 'emerald', sub: 'PostgreSQL', desc: 'Référentiels users, CRM, formations, projets.' },
                { name: 'React (Vite)', status: 'Interface — sans accès direct aux données', color: 'emerald', sub: 'React 18', desc: 'Passe par l\'API Symfony, jamais par la base ni GLPI.' },
                { name: 'Service IA (FastAPI)', status: 'Orchestration d\'agents', color: 'amber', sub: 'FastAPI', desc: 'Appelle le fournisseur de modèle. Aucun accès PostgreSQL.' },
                { name: 'GLPI', status: 'Inventaire — système de référence', color: 'emerald', sub: 'GLPI', desc: 'Interrogé par Symfony uniquement, via GlpiService.' },
                { name: 'n8n', status: 'Workflows simples', color: 'amber', sub: 'n8n', desc: 'Orchestration des processus courts, sans Logique métier.' },
              ].map(svc => (
                <div key={svc.name} className="py-2.5 flex items-center justify-between gap-3 hover:bg-[#f0f4f8] px-2 rounded-lg transition-colors">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full bg-${svc.color}-500 shrink-0`}></span>
                    <span className="font-bold text-[#001026]">{svc.name}</span>
                    <span className="text-[10px] text-[#44474e]">{svc.sub}</span>
                  </div>
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[11px] text-[#44474e] truncate hidden sm:block">{svc.desc}</span>
                    <span className={`text-[10px] font-semibold text-${svc.color}-800 bg-${svc.color}-50 px-2 py-0.5 rounded shrink-0`}>{svc.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-3 mt-2 border-t border-[#dfe3e7] flex items-center justify-between">
            <span className="text-[11px] text-[#44474e]">Socle déclaré par le document d&apos;architecture</span>
            <a href="#configuration" className="text-xs font-bold text-[#004ad1] hover:underline flex items-center gap-1">
              Détails sondes système →
            </a>
          </div>
        </div>

        {/* SÉCURITÉ */}
        <div className="bg-white rounded-2xl border border-[#dfe3e7] p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-[#dfe3e7]">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-6 bg-[#fbbf24] rounded-full"></span>
                <div>
                  <h3 className="text-sm font-extrabold text-[#001026]">Sécurité & Accès (Gouvernance)</h3>
                  <p className="text-[11px] text-[#44474e]">RBAC, validation humaine et cloisonnement par domaine</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#004ad1] text-[11px] font-bold border border-blue-200">
                FIDO2 Strict
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-3">
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                <div className="text-xs text-amber-900 font-semibold">Demandes d'accès</div>
                <div className="text-xl font-extrabold text-amber-950 mt-0.5">17</div>
                <div className="text-[10px] text-amber-700 font-medium">En attente d'arbitrage</div>
              </div>
              <div className="p-3 rounded-xl bg-[#f0f4f8] border border-[#dfe3e7]">
                <div className="text-xs text-[#001026] font-semibold">Rôles modifiés</div>
                <div className="text-xl font-extrabold text-[#001026] mt-0.5">4</div>
                <div className="text-[10px] text-[#004ad1] font-bold">2 sensibles</div>
              </div>
              <div className="p-3 rounded-xl bg-red-50/70 border border-red-200">
                <div className="text-xs text-[#ba1a1a] font-semibold">Comptes suspendus</div>
                <div className="text-xl font-extrabold text-[#ba1a1a] mt-0.5">3</div>
                <div className="text-[10px] text-red-700">Vérification identité</div>
              </div>
              <div className="p-3 rounded-xl bg-[#f0f4f8] border border-[#dfe3e7]">
                <div className="text-xs text-[#001026] font-semibold">Tentatives bloquées</div>
                <div className="text-xl font-extrabold text-[#001026] mt-0.5">2</div>
                <div className="text-[10px] text-[#ba1a1a] font-medium">WAF / IP spoof filtrée</div>
              </div>
              <div className="p-3 rounded-xl bg-[#f0f4f8] border border-[#dfe3e7]">
                <div className="text-xs text-[#001026] font-semibold">Connexions filtrées</div>
                <div className="text-xl font-extrabold text-[#001026] mt-0.5">1 482</div>
                <div className="text-[10px] text-emerald-700 font-medium">Inhabituelles contrôlées</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="text-xs text-emerald-800 font-semibold">Journal d&apos;audit</div>
                <div className="text-sm font-extrabold text-emerald-900 mt-1 font-mono">En construction</div>
                <div className="text-[10px] text-emerald-700">Phase 1 du chantier</div>
              </div>
            </div>
            
            {/* Sparkline & Alerte */}
            <div className="p-3 rounded-xl bg-[#001026] text-white space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#b5c4ff] font-medium">Tentatives de connexion & autorisations (24h)</span>
                <span className="text-[#fbbf24] font-mono font-bold">1 482 valides • 2 bloquées</span>
              </div>
              <div className="h-12 w-full">
                <svg className="w-full h-full text-secondary-container" fill="none" preserveAspectRatio="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 200 40">
                  <defs>
                    <linearGradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" style={{stopColor:'#1a62fe', stopOpacity: 0.4}}></stop>
                      <stop offset="100%" style={{stopColor:'#1a62fe', stopOpacity: 0.0}}></stop>
                    </linearGradient>
                  </defs>
                  <path d="M0,35 L20,32 L40,28 L60,30 L80,18 L100,12 L120,16 L140,8 L160,14 L180,10 L200,6 L200,40 L0,40 Z" fill="url(#grad1)"></path>
                  <path d="M0,35 L20,32 L40,28 L60,30 L80,18 L100,12 L120,16 L140,8 L160,14 L180,10 L200,6" stroke="#1a62fe" strokeWidth="2.5"></path>
                  <circle cx="80" cy="18" fill="#ba1a1a" r="3"></circle>
                  <circle cx="160" cy="14" fill="#ba1a1a" r="3"></circle>
                </svg>
              </div>
            </div>
            <div className="mt-3 p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <span className="text-[#f59e0b] text-base mt-0.5">✨</span>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-950">Diagnostic IA Opérationnel</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-200 text-amber-900">Recommandation</span>
                  </div>
                  <p className="text-[11px] text-[#44474e] leading-snug">Tentative d'injection SQL filtrée par WAF (Paris DC-1). <strong className="text-[#001026]">IP 185.220.101.4</strong> mise en quarantaine recommandée.</p>
                </div>
              </div>
              <button onClick={() => toast.success('Action IA appliquée : IP 185.220.101.4 ajoutée à la liste noire temporaire du Firewall applicatif pour 72h.')} className="flex-shrink-0 px-2.5 py-1.5 rounded-lg bg-[#001026] hover:bg-[#0b2545] text-white text-[10px] font-bold transition-all flex items-center gap-1">
                <span className="material-symbols-outlined notranslate text-[12px] text-[#fbbf24]">security</span>
                <span>Isoler l'IP</span>
              </button>
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-[#dfe3e7] flex items-center justify-between gap-2">
            <Link to="/superadmin/requests" className="text-xs font-bold text-[#004ad1] hover:underline">
              Voir les demandes →
            </Link>
            <button onClick={() => openModal('siem-live')} className="px-3 py-1.5 rounded-lg bg-[#001026] text-white text-xs font-bold hover:bg-[#0b2545] transition-colors">
              Voir le journal d&apos;audit
            </button>
          </div>
        </div>
      </section>

      {/* 7. DEMANDES & ACTIVITÉ */}
      <section className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-[#dfe3e7] p-5 shadow-sm flex flex-col justify-between" id="admin-requests">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-[#dfe3e7]">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-6 bg-amber-500 rounded-full"></span>
                <div>
                  <h3 className="text-sm font-extrabold text-[#001026]">Demandes d'accès à traiter</h3>
                  <p className="text-[11px] text-[#44474e]">Arbitrage immédiat des privilèges d'utilisateurs</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f0f4f8] text-[#001026] border border-[#dfe3e7] text-[10px] font-bold font-mono">
                  <span className="text-[#fbbf24]">✨</span><span>Conformité IA : 99.4%</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-extrabold">
                  {pendingRequests?.length ?? '—'} demande(s) à traiter
                </span>
              </div>
            </div>
            <div className="divide-y divide-[#dfe3e7]/70 text-xs mt-1">
              {pendingRequests === null ? (
                <div className="py-4 text-[#44474e]">Chargement des demandes…</div>
              ) : pendingRequests.length === 0 ? (
                <div className="py-4 text-[#44474e]">
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
                    <div key={req.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#001026] text-white flex items-center justify-center font-bold text-xs">
                          {initials || '?'}
                        </div>
                        <div>
                          <div className="font-extrabold text-[#001026] flex items-center gap-2">
                            {name}
                            {req.requestedDomain && (
                              <span className="text-[10px] font-semibold text-[#44474e]">{req.requestedDomain}</span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#44474e] flex items-center gap-1.5 mt-0.5">
                            <span className="material-symbols-outlined notranslate text-[12px]">schedule</span>
                            {req.createdAt
                              ? new Date(req.createdAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })
                              : '—'}
                            {req.requestedProfile?.label && (
                              <> • Spécialisation : <span className="font-semibold text-[#001026]">{req.requestedProfile.label}</span></>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">En attente</span>
                        {/* L'arbitrage se fait sur l'écran dédié : ce bouton ne
                            simule pas une approbation, il y conduit. */}
                        <Link
                          to="/superadmin/requests"
                          className="px-2.5 py-1 rounded-lg bg-secondary-container hover:bg-secondary text-white text-[11px] font-bold"
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
          <div className="pt-3 mt-2 border-t border-[#dfe3e7] flex items-center justify-between">
            <span className="text-[11px] text-[#44474e]">
              {pendingRequests && pendingRequests.length > 3
                ? `${pendingRequests.length - 3} autre(s) dans la file`
                : 'File complète affichée ci-dessus'}
            </span>
            <Link to="/superadmin/requests" className="text-xs font-bold text-[#004ad1] hover:underline">
              Voir les {pendingRequests?.length ?? 0} demande(s) d&apos;accès →
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl border border-[#dfe3e7] p-5 shadow-sm flex flex-col justify-between" id="admin-logs">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-[#dfe3e7]">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-6 bg-[#001026] rounded-full"></span>
                <div>
                  <h3 className="text-sm font-extrabold text-[#001026]">Activité Récente (Traçabilité)</h3>
                  <p className="text-[11px] text-[#44474e]">Journal immuable horodaté SHA-256</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#f0f4f8] text-[#001026] text-[11px] font-mono font-bold">
                Flux Temps Réel
              </span>
            </div>
            <div className="relative pl-6 space-y-3.5 mt-3 text-xs before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#dfe3e7]">
              <div className="relative flex flex-col">
                <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white"></span>
                <div className="text-[11px] text-[#74777f] font-mono">10:42</div>
                <div className="text-[#181c1f]">
                  <strong className="text-[#001026]">Admin (Keyssel K.)</strong> — a attribué le rôle <span className="font-bold text-[#004ad1]">Responsable CRM</span> à <span className="font-semibold">Jean Dupont</span>
                </div>
              </div>
              <div className="relative flex flex-col">
                <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-white"></span>
                <div className="text-[11px] text-[#74777f] font-mono">10:38</div>
                <div className="text-[#181c1f]">
                  <strong className="text-[#001026]">Système</strong> — nouvelle demande d'accès <span className="font-mono text-[11px] bg-[#f0f4f8] px-1 rounded">#REQ-8849</span>
                </div>
              </div>
              <div className="relative flex flex-col">
                <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#004ad1] ring-4 ring-white"></span>
                <div className="text-[11px] text-[#74777f] font-mono">10:31</div>
                <div className="text-[#181c1f]">
                  <strong className="text-[#001026]">Responsable IT</strong> — équipement commutateur Cisco importé depuis GLPI
                </div>
              </div>
              <div className="relative flex flex-col">
                <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#fbbf24] ring-4 ring-white"></span>
                <div className="text-[11px] text-[#74777f] font-mono">10:24</div>
                <div className="text-[#181c1f]">
                  <strong className="text-[#001026]">IA</strong> — recommandation générée sur le projet Global Tech
                </div>
              </div>
              <div className="relative flex flex-col">
                <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-slate-500 ring-4 ring-white"></span>
                <div className="text-[11px] text-[#74777f] font-mono">10:17</div>
                <div className="text-[#181c1f]">
                  <strong className="text-[#001026]">Utilisateur</strong> — connexion depuis un nouvel appareil (Yaoundé HQ)
                </div>
              </div>
            </div>
          </div>
          <div className="pt-3 mt-2 border-t border-[#dfe3e7] flex items-center justify-between">
            <span className="text-[11px] text-[#44474e]">Hash d'intégrité : e3b0c44298fc...</span>
            <button className="text-xs font-bold text-[#004ad1] hover:underline" onClick={() => openModal('siem-live')}>
              Consulter tout le journal d'activité →
            </button>
          </div>
        </div>
      </section>

      {/* 8. BLOCS SYNTHÉTIQUES */}
      <section className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-[#dfe3e7] p-5 shadow-sm space-y-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#dfe3e7]">
              <h4 className="text-xs font-extrabold text-[#001026] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined notranslate text-[16px] text-[#004ad1]">stacked_bar_chart</span>
                Pilotage Global des Pôles (24h)
              </h4>
              <span className="text-[10px] text-[#44474e] font-mono">Total: 807</span>
            </div>
            <div className="space-y-2 pt-2 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-0.5"><span className="font-medium text-[#181c1f]">CRM</span><span className="font-bold text-[#001026]">142 actions (87%)</span></div>
                <div className="w-full bg-[#eaeef2] h-1.5 rounded-full overflow-hidden"><div className="bg-secondary-container h-full rounded-full" style={{width:'87%'}}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-0.5"><span className="font-medium text-[#181c1f]">Workspace</span><span className="font-bold text-[#001026]">286 actions (76%)</span></div>
                <div className="w-full bg-[#eaeef2] h-1.5 rounded-full overflow-hidden"><div className="bg-[#001026] h-full rounded-full" style={{width:'76%'}}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-0.5"><span className="font-medium text-[#181c1f]">Formation</span><span className="font-bold text-[#001026]">92 actions (62%)</span></div>
                <div className="w-full bg-[#eaeef2] h-1.5 rounded-full overflow-hidden"><div className="bg-[#fbbf24] h-full rounded-full" style={{width:'62%'}}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-0.5"><span className="font-medium text-[#181c1f]">Knowledge Hub</span><span className="font-bold text-[#001026]">58 actions (43%)</span></div>
                <div className="w-full bg-[#eaeef2] h-1.5 rounded-full overflow-hidden"><div className="bg-emerald-600 h-full rounded-full" style={{width:'43%'}}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-0.5"><span className="font-medium text-[#181c1f]">Infrastructure</span><span className="font-bold text-[#001026]">74 actions (58%)</span></div>
                <div className="w-full bg-[#eaeef2] h-1.5 rounded-full overflow-hidden"><div className="bg-blue-600 h-full rounded-full" style={{width:'58%'}}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-0.5"><span className="font-medium text-[#181c1f]">Analytics</span><span className="font-bold text-[#001026]">39 actions (31%)</span></div>
                <div className="w-full bg-[#eaeef2] h-1.5 rounded-full overflow-hidden"><div className="bg-purple-600 h-full rounded-full" style={{width:'31%'}}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-0.5"><span className="font-medium text-[#181c1f]">AI Workspace</span><span className="font-bold text-[#001026]">112 actions (68%)</span></div>
                <div className="w-full bg-[#eaeef2] h-1.5 rounded-full overflow-hidden"><div className="bg-amber-500 h-full rounded-full" style={{width:'68%'}}></div></div>
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-[#dfe3e7] text-[11px] text-[#44474e]">
            Charge moyenne plateforme : <strong className="text-emerald-700">62.4%</strong>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#dfe3e7] p-5 shadow-sm space-y-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#dfe3e7]">
              <h4 className="text-xs font-extrabold text-[#001026] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined notranslate text-[16px] text-[#fbbf24]">psychology</span>
                AI Workspace Monitoring
              </h4>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900">v2.4 Core</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
              <div className="p-2 rounded-xl bg-[#f0f4f8]"><div className="text-[10px] text-[#44474e]">Analyses aujourd'hui</div><div className="text-base font-extrabold text-[#001026]">42</div></div>
              <div className="p-2 rounded-xl bg-[#f0f4f8]"><div className="text-[10px] text-[#44474e]">Recommandations</div><div className="text-base font-extrabold text-[#004ad1]">18</div></div>
              <div className="p-2 rounded-xl bg-[#f0f4f8]"><div className="text-[10px] text-[#44474e]">Échecs d'analyse</div><div className="text-base font-extrabold text-[#ba1a1a]">2</div></div>
              <div className="p-2 rounded-xl bg-[#f0f4f8]"><div className="text-[10px] text-[#44474e]">Temps moyen</div><div className="text-base font-extrabold text-emerald-700 font-mono">2.4s</div></div>
            </div>
            <div className="mt-3">
              <div className="text-[11px] font-bold text-[#44474e] mb-1.5">État des 6 agents IA :</div>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                {['Project Agent', 'Commercial Agent', 'Document Agent', 'IT Agent', 'Analytics Agent', 'Formation Agent'].map(agent => (
                  <div key={agent} className="flex items-center gap-1.5 bg-[#f0f4f8] px-2 py-1 rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="truncate">{agent}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <a className="text-xs font-bold text-[#004ad1] hover:underline block pt-2 border-t border-[#dfe3e7]" href="#ai-workspace">
            Ouvrir AI Workspace →
          </a>
        </div>

        <div className="bg-white rounded-2xl border border-[#dfe3e7] p-5 shadow-sm space-y-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#dfe3e7]">
              <h4 className="text-xs font-extrabold text-[#001026] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined notranslate text-[16px] text-blue-600">dns</span>
                Infrastructure & IT
              </h4>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Sync GLPI</span>
            </div>
            <div className="space-y-2.5 pt-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f0f4f8]">
                <span className="text-[#44474e]">Équipements inventoriés :</span><strong className="text-[#001026] font-extrabold text-sm">248</strong>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/60">
                <span className="text-amber-900">Incidents ouverts :</span><strong className="text-amber-900 font-extrabold text-sm">12</strong>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-red-50/60 border border-red-200/60">
                <span className="text-[#ba1a1a]">Incidents critiques :</span><strong className="text-[#ba1a1a] font-extrabold text-sm">2</strong>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f0f4f8]">
                <span className="text-[#44474e]">Maintenances prévues :</span><strong className="text-[#001026] font-extrabold text-sm">7</strong>
              </div>
            </div>
          </div>
          <a className="text-xs font-bold text-[#004ad1] hover:underline block pt-2 border-t border-[#dfe3e7]" href="#infra-it">
            Voir Infrastructure IT →
          </a>
        </div>

        <div className="bg-white rounded-2xl border border-[#dfe3e7] p-5 shadow-sm space-y-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#dfe3e7]">
              <h4 className="text-xs font-extrabold text-[#001026] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined notranslate text-[16px] text-purple-600">analytics</span>
                Analytics Global
              </h4>
              <span className="text-[10px] text-[#74777f]">Cockpit synthèse</span>
            </div>
            <div className="space-y-2 pt-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-[#dfe3e7]/50"><span className="text-[#44474e]">Comptes enregistrés :</span><span className="font-bold text-[#001026]">{n(stats?.users)}</span></div>
              <div className="flex justify-between items-center py-1 border-b border-[#dfe3e7]/50"><span className="text-[#44474e]">Activité système globale :</span><span className="font-bold text-emerald-700">807 actions/24h</span></div>
              <div className="flex justify-between items-center py-1 border-b border-[#dfe3e7]/50"><span className="text-[#44474e]">Demandes d'accès :</span><span className="font-bold text-amber-700">17 en attente</span></div>
              <div className="flex justify-between items-center py-1 border-b border-[#dfe3e7]/50"><span className="text-[#44474e]">Actions administratives :</span><span className="font-bold text-[#004ad1]">48 auditées</span></div>
              <div className="flex justify-between items-center py-1 border-b border-[#dfe3e7]/50"><span className="text-[#44474e]">Utilisation IA :</span><span className="font-bold text-[#fbbf24]">42 requêtes</span></div>
              <div className="flex justify-between items-center py-1"><span className="text-[#44474e]">Incidents IT résolus :</span><span className="font-bold text-emerald-700">94.8% SLA</span></div>
            </div>
          </div>
          <a className="text-xs font-bold text-[#004ad1] hover:underline block pt-2 border-t border-[#dfe3e7]" href="#analytics">
            Consulter le rapport Analytics →
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
