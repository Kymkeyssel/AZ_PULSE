import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SuperAdminDashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ title: '', icon: '', content: null });

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
          <p>Supervision des 38 politiques granulaires actives sur les 1 248 comptes.</p>
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl font-semibold">
            ✓ Conformité ISO 27001 et isolation des tenants 100% validées.
          </div>
        </div>
      );
    } else if (type === 'siem-live') {
      title = 'Journal de Sécurité SIEM & Détections IP';
      icon = 'security';
      content = (
        <div className="p-3 bg-[#001026] text-[#b5c4ff] rounded-xl font-mono text-[11px] space-y-1 max-h-48 overflow-y-auto">
          <div>10:42:01 [AUTH-OK] Keyssel K. session validée (FIDO2 Token)</div>
          <div>10:38:12 [REQ-IN] Nouvelle demande access: Jean Dupont</div>
          <div>10:31:05 [GLPI-SYNC] 3 240 assets scellés SHA-256</div>
          <div>10:24:19 [AI-INFER] Embedding 2.4s sur projet Global Tech</div>
          <div>10:17:40 [GEO-IP] Connexion autorisée Hub Yaoundé HQ</div>
        </div>
      );
    } else if (type === 'new-admin') {
      title = 'Créer un Nouveau Compte Administrateur';
      icon = 'shield_person';
      content = (
        <div className="space-y-3">
          <div className="p-3 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs font-semibold">
            Attention : L'octroi d'un rôle Administrateur nécessite une clé matérielle FIDO2 / YubiKey.
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
              <option>Auditeur Conformité SIEM</option>
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
                <span className="material-symbols-outlined text-[13px]">verified</span>Supervision Critique AZ Pulse
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white">Bonjour, Administrateur Système</h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#778db2]">
              <span className="flex items-center gap-1.5 text-white font-medium">
                <span className="material-symbols-outlined text-[16px] text-[#fbbf24]">schedule</span>
                <span>Paris UTC+1 : 18:29:24 • Yaoundé UTC+1 : 18:29:24</span>
              </span>
              <span className="w-1 h-1 rounded-full bg-white/20"></span>
              <span className="flex items-center gap-1 text-[#b5c4ff]">
                <span className="material-symbols-outlined text-[16px]">history</span>Dernier audit : <strong className="text-white ml-1">Il y a 4 min par Dr. Marc V. (Super Admin)</strong>
              </span>
            </div>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 self-stretch xl:self-auto">
            <div className="flex items-center gap-3.5 bg-[#001026]/70 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 shadow-inner">
              <div className="relative flex items-center justify-center w-11 h-11 rounded-lg bg-[#fbbf24]/10 text-[#fbbf24]">
                <span className="material-symbols-outlined text-[28px]">health_and_safety</span>
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
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                <span>+ Créer Utilisateur</span>
              </button>
              <button onClick={() => openModal('rbac')} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white text-[#001026] text-xs font-bold hover:bg-[#f0f4f8] transition-all shadow-lg active:scale-95" type="button">
                <span className="material-symbols-outlined text-[18px] text-[#004ad1]">rule_folder</span>
                <span>Auditer Rôles</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Insight Prédictif */}
      <section className="rounded-2xl bg-white border border-[#dfe3e7] p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start md:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#001026] text-[#fbbf24] flex items-center justify-center flex-shrink-0 shadow-sm border border-[#dfe3e7]">
            <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
          </div>
          <div className="space-y-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold text-[#001026] flex items-center gap-1">Insight Prédictif IA Système</span>
              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Modèle Prédictif Nominal</span>
              <span className="text-[11px] text-[#74777f] font-mono">Confiance 98.7%</span>
            </div>
            <p className="text-xs text-[#44474e] leading-relaxed">
              <strong className="text-[#001026]">Charge base de données stable à 28%</strong>. Aucune dérive de latence détectée sur les répliques PostgreSQL. <span className="text-[#004ad1] font-semibold">Recommandation IA :</span> Archivage automatique des logs SIEM programmé à 02h00.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-auto">
          <button onClick={() => alert("Audit prédictif exécuté...")} type="button" className="px-3 py-1.5 rounded-xl bg-[#f0f4f8] hover:bg-[#dfe3e7] text-[#001026] text-xs font-bold transition-all flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-[#004ad1]">troubleshoot</span>
            <span>Analyser</span>
          </button>
          <button onClick={() => alert("Génération en cours...")} type="button" className="px-3.5 py-1.5 rounded-xl bg-[#001026] hover:bg-[#0b2545] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5">
            <span className="text-[#fbbf24]">✨</span>
            <span>Rapport d'intégrité IA</span>
          </button>
        </div>
      </section>

      {/* 4. BLOC KPI PRINCIPAL */}
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <Link to="/superadmin/users" className="bg-white p-4 rounded-2xl border border-[#dfe3e7] shadow-sm hover:border-[#004ad1] hover:shadow transition-all group flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#44474e]">Utilisateurs</span>
            <span className="w-8 h-8 rounded-lg bg-[#f0f4f8] text-[#004ad1] flex items-center justify-center group-hover:bg-[#004ad1] group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[18px]">group</span>
            </span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold text-[#001026] tracking-tight">1 248</div>
            <div className="text-[11px] text-[#44474e]">Utilisateurs actifs</div>
          </div>
          <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">arrow_upward</span> +12 cette semaine
          </div>
        </Link>
        <Link to="/superadmin/requests" className="bg-white p-4 rounded-2xl border border-amber-200 bg-gradient-to-br from-white to-amber-50/40 shadow-sm hover:border-amber-400 hover:shadow transition-all group flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">Demandes Accès</span>
            <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
              <span className="material-symbols-outlined text-[18px]">key</span>
            </span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold text-amber-900 tracking-tight flex items-center gap-1.5">
              17
              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-950">À traiter</span>
            </div>
            <div className="text-[11px] text-amber-800 font-medium">En attente d'arbitrage</div>
          </div>
          <div className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">trending_up</span> ↑ 5 depuis hier
          </div>
        </Link>
        <Link to="/superadmin/admins" className="bg-white p-4 rounded-2xl border border-[#dfe3e7] shadow-sm hover:border-[#004ad1] hover:shadow transition-all group flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#44474e]">Admins</span>
            <span className="w-8 h-8 rounded-lg bg-[#f0f4f8] text-[#001026] flex items-center justify-center group-hover:bg-[#001026] group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[18px]">shield_person</span>
            </span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold text-[#001026] tracking-tight">8</div>
            <div className="text-[11px] text-[#44474e]">Comptes administrateurs</div>
          </div>
          <div className="text-[11px] font-semibold text-[#004ad1] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#004ad1]"></span> 5 sessions actives
          </div>
        </Link>
        <div className="bg-white p-4 rounded-2xl border border-[#dfe3e7] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#44474e]">Sessions</span>
            <span className="w-8 h-8 rounded-lg bg-[#f0f4f8] text-[#004ad1] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">devices</span>
            </span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold text-[#001026] tracking-tight">126</div>
            <div className="text-[11px] text-[#44474e]">Sessions actuellement actives</div>
          </div>
          <div className="text-[11px] font-semibold text-[#74777f] flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px] text-emerald-600">verified_user</span> Zero-Trust PAM
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#dfe3e7] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#ba1a1a]">Alertes Système</span>
            <span className="w-8 h-8 rounded-lg bg-red-50 text-[#ba1a1a] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">warning</span>
            </span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold text-[#ba1a1a] tracking-tight flex items-center gap-1.5">
              4
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-red-100 text-[#ba1a1a]">Sécurité</span>
            </div>
            <div className="text-[11px] text-[#44474e]">Alertes système</div>
          </div>
          <div className="text-[11px] font-bold text-[#ba1a1a] flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-pulse"></span> 2 critiques
          </div>
        </div>
        <Link to="#section-system-health" className="bg-white p-4 rounded-2xl border border-[#dfe3e7] shadow-sm hover:border-emerald-500 hover:shadow transition-all group flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Services</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[18px]">hub</span>
            </span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold text-emerald-800 tracking-tight">8 / 8</div>
            <div className="text-[11px] text-[#44474e]">Services opérationnels</div>
          </div>
          <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">check_circle</span> 100% Nominal
          </div>
        </Link>
      </section>

      {/* 5. ZONE D'ACTION REQUISE */}
      <section className="bg-gradient-to-r from-[#001026] via-[#0b2545] to-[#001c3b] rounded-2xl text-white p-5 shadow-lg border border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
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
            <span className="material-symbols-outlined text-[16px]">person_add</span> + Nouvel utilisateur
          </button>
          <button onClick={() => openModal('new-admin')} className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15 flex items-center gap-1.5 active:scale-95">
            <span className="material-symbols-outlined text-[16px]">shield_person</span> + Créer admin
          </button>
          <button onClick={() => openModal('rbac')} className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15 flex items-center gap-1.5 active:scale-95">
            <span className="material-symbols-outlined text-[16px]">tune</span> Gérer permissions
          </button>
          <Link to="/superadmin/requests" className="px-3 py-2 rounded-xl bg-[#fbbf24] hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-all shadow flex items-center gap-1.5 active:scale-95">
            <span className="material-symbols-outlined text-[16px]">check_circle</span> Voir demandes
          </Link>
        </div>
      </section>

      {/* 6. SANTÉ DU SYSTÈME & SÉCURITÉ */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5" id="section-system-health">
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
                { name: 'Backend Symfony', status: 'Opérationnel', latency: '18ms', desc: 'API REST & ORM Core AZ Pulse v6.4 LTS', color: 'emerald' },
                { name: 'PostgreSQL Cluster', status: 'Opérationnel', latency: '4ms', desc: 'Master + 2 répliques temps réel', color: 'emerald' },
                { name: 'FastAPI AI Service', status: 'Opérationnel', latency: '182ms', desc: 'Infér. Qdrant / Embeddings NLP', color: 'emerald' },
                { name: 'n8n Automation', status: 'Opérationnel', latency: 'Queue: 0', desc: '42 flux orchestrés par heure', color: 'emerald' },
                { name: 'Mail Service SMTP', status: 'Opérationnel', latency: '100% Débit', desc: 'TLS 1.3 Strict', color: 'emerald' },
                { name: 'Mercure Hub', status: 'Opérationnel', latency: '12ms', desc: 'SSE temps réel', color: 'emerald' },
                { name: 'GLPI Asset Connect', status: 'Connecté', latency: 'Sync -3 min', desc: 'Synchronisation périodique des inventaires', color: 'amber' },
                { name: 'Storage & S3 Vault', status: 'Opérationnel', latency: 'Immuable', desc: 'WORM SHA-256', color: 'emerald' },
              ].map(svc => (
                <div key={svc.name} onClick={() => openModal(svc)} className="py-2.5 flex items-center justify-between hover:bg-[#f0f4f8] px-2 rounded-lg transition-colors cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full bg-${svc.color}-500`}></span>
                    <span className="font-bold text-[#001026]">{svc.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-[11px] font-bold text-${svc.color}-600`}>{svc.latency}</span>
                    <span className={`text-[10px] font-semibold text-${svc.color}-800 bg-${svc.color}-50 px-2 py-0.5 rounded`}>{svc.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-3 mt-2 border-t border-[#dfe3e7] flex items-center justify-between">
            <span className="text-[11px] text-[#44474e]">Sondes d'intégrité télémétrique</span>
            <Link to="/superadmin/config" className="text-xs font-bold text-[#004ad1] hover:underline flex items-center gap-1">
              Détails sondes système →
            </Link>
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
                  <p className="text-[11px] text-[#44474e]">Filtrage périmétrique, Zero-Trust et SIEM</p>
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
                <div className="text-[10px] text-amber-700">En attente d'arbitrage</div>
              </div>
              <div className="p-3 rounded-xl bg-red-50/70 border border-red-200">
                <div className="text-xs text-[#ba1a1a] font-semibold">Comptes suspendus</div>
                <div className="text-xl font-extrabold text-[#ba1a1a] mt-0.5">3</div>
                <div className="text-[10px] text-red-700">Vérification identité</div>
              </div>
              <div className="p-3 rounded-xl bg-[#f0f4f8] border border-[#dfe3e7]">
                <div className="text-xs text-[#001026] font-semibold">Tentatives bloquées</div>
                <div className="text-xl font-extrabold text-[#001026] mt-0.5">2</div>
                <div className="text-[10px] text-[#ba1a1a]">IP blacklistée / spoof</div>
              </div>
              <div className="p-3 rounded-xl bg-[#f0f4f8] border border-[#dfe3e7]">
                <div className="text-xs text-[#001026] font-semibold">Permission modifiée</div>
                <div className="text-xl font-extrabold text-[#001026] mt-0.5">1</div>
                <div className="text-[10px] text-[#44474e]">Dr. Marc V. (DG)</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 sm:col-span-2">
                <div className="text-xs text-emerald-800 font-semibold">Incident critique</div>
                <div className="text-xl font-extrabold text-emerald-800 mt-0.5">0</div>
                <div className="text-[10px] text-emerald-700">Aucune brèche d'isolation de tenant</div>
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
              <button onClick={() => alert('IP 185.220.101.4 isolée.')} className="flex-shrink-0 px-2.5 py-1.5 rounded-lg bg-[#001026] hover:bg-[#0b2545] text-white text-[10px] font-bold transition-all flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px] text-[#fbbf24]">security</span>
                <span>Isoler l'IP</span>
              </button>
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-[#dfe3e7] flex items-center justify-between gap-2">
            <Link to="/superadmin/requests" className="text-xs font-bold text-[#004ad1] hover:underline">
              Voir les demandes →
            </Link>
            <button onClick={() => openModal('siem-live')} className="px-3 py-1.5 rounded-lg bg-[#001026] text-white text-xs font-bold hover:bg-[#0b2545] transition-colors">
              Voir le journal de sécurité / SIEM
            </button>
          </div>
        </div>
      </section>

      {/* 7. DEMANDES & ACTIVITÉ */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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
                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-extrabold">17 à traiter</span>
              </div>
            </div>
            <div className="divide-y divide-[#dfe3e7]/70 text-xs mt-1">
              {[
                { name: 'Jean Dupont', initials: 'JD', role: 'Responsable CRM', type: 'Collaborateur', time: '8 min', bg: 'bg-[#001026]' },
                { name: 'Marie X', initials: 'MX', role: 'Gestionnaire LMS Certifié', type: 'Responsable Formation', time: '21 min', bg: 'bg-purple-900' },
                { name: 'David Y', initials: 'DY', role: 'Auditeur Portail Client', type: 'Client Global Tech', time: '34 min', bg: 'bg-blue-900' }
              ].map(req => (
                <div key={req.name} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${req.bg} text-white flex items-center justify-center font-bold text-xs`}>
                      {req.initials}
                    </div>
                    <div>
                      <div className="font-extrabold text-[#001026] flex items-center gap-2">
                        {req.name}
                        <span className="text-[10px] font-semibold text-[#44474e]">{req.type}</span>
                      </div>
                      <div className="text-[11px] text-[#44474e] flex items-center gap-1.5 mt-0.5">
                        <span className="material-symbols-outlined text-[12px]">schedule</span> Il y a {req.time} • Rôle : <span className="font-semibold text-[#001026]">{req.role}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">En attente</span>
                    <button onClick={() => alert(`Demande de ${req.name} validée`)} className="px-2.5 py-1 rounded-lg bg-secondary-container hover:bg-secondary text-white text-[11px] font-bold">
                      Valider
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-3 mt-2 border-t border-[#dfe3e7] flex items-center justify-between">
            <span className="text-[11px] text-[#44474e]">14 requêtes supplémentaires dans la file</span>
            <button className="text-xs font-bold text-[#004ad1] hover:underline" onClick={() => alert("Ouverture interface d'arbitrage")}>
              Voir les 17 demandes d'accès →
            </button>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#dfe3e7] p-5 shadow-sm flex flex-col justify-between">
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
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-[#dfe3e7] p-5 shadow-sm space-y-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#dfe3e7]">
              <h4 className="text-xs font-extrabold text-[#001026] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#004ad1]">stacked_bar_chart</span>
                Activité (24h)
              </h4>
            </div>
            <div className="space-y-2 pt-2 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-0.5"><span className="font-medium text-[#181c1f]">CRM</span><span className="font-bold text-[#001026]">87%</span></div>
                <div className="w-full bg-[#eaeef2] h-1.5 rounded-full overflow-hidden"><div className="bg-secondary-container h-full rounded-full" style={{width:'87%'}}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-0.5"><span className="font-medium text-[#181c1f]">Infrastructure</span><span className="font-bold text-[#001026]">58%</span></div>
                <div className="w-full bg-[#eaeef2] h-1.5 rounded-full overflow-hidden"><div className="bg-blue-600 h-full rounded-full" style={{width:'58%'}}></div></div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#dfe3e7] p-5 shadow-sm space-y-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#dfe3e7]">
              <h4 className="text-xs font-extrabold text-[#001026] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#fbbf24]">psychology</span>
                AI Workspace
              </h4>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
              <div className="p-2 rounded-xl bg-[#f0f4f8]"><div className="text-[10px] text-[#44474e]">Analyses</div><div className="text-base font-extrabold text-[#001026]">42</div></div>
              <div className="p-2 rounded-xl bg-[#f0f4f8]"><div className="text-[10px] text-[#44474e]">Recommandations</div><div className="text-base font-extrabold text-[#004ad1]">18</div></div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#dfe3e7] p-5 shadow-sm space-y-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#dfe3e7]">
              <h4 className="text-xs font-extrabold text-[#001026] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-blue-600">dns</span>
                Infrastructure IT
              </h4>
            </div>
            <div className="space-y-2.5 pt-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f0f4f8]">
                <span className="text-[#44474e]">Équipements :</span><strong className="text-[#001026] font-extrabold text-sm">248</strong>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/60">
                <span className="text-amber-900">Incidents ouverts :</span><strong className="text-amber-900 font-extrabold text-sm">12</strong>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#dfe3e7] p-5 shadow-sm space-y-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#dfe3e7]">
              <h4 className="text-xs font-extrabold text-[#001026] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-purple-600">analytics</span>
                Analytics
              </h4>
            </div>
            <div className="space-y-2 pt-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-[#dfe3e7]/50"><span className="text-[#44474e]">Utilisateurs actifs :</span><span className="font-bold text-[#001026]">1 248</span></div>
              <div className="flex justify-between items-center py-1 border-b border-[#dfe3e7]/50"><span className="text-[#44474e]">Activité système :</span><span className="font-bold text-emerald-700">807 / 24h</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[60] bg-[#001026]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-[#dfe3e7] animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#dfe3e7] pb-3">
              <h3 className="text-base font-extrabold text-[#001026] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#004ad1]">{modalData.icon}</span>
                <span>{modalData.title}</span>
              </h3>
              <button className="p-1 rounded-lg text-[#44474e] hover:bg-[#eaeef2]" onClick={closeModal}>
                <span className="material-symbols-outlined text-[20px]">close</span>
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
