<main className="w-full px-6 pb-12 space-y-5 flex-1 pt-20">
{/*  1. PERSONA & IDENTITÉ (Bannière Compacte & Opérationnelle)  */}
<section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#001026] via-[#0b2545] to-[#001c3b] text-white p-6 shadow-xl border border-white/10 mt-2"><div className="absolute -right-16 -top-16 w-80 h-80 bg-secondary/20 rounded-full blur-3xl pointer-events-none"></div><div className="absolute right-60 -bottom-20 w-64 h-64 bg-[#fbbf24]/10 rounded-full blur-2xl pointer-events-none"></div><div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6"><div className="flex flex-col gap-2"><div className="flex flex-wrap items-center gap-2"><span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-white text-[11px] font-bold"><span className="material-symbols-outlined text-[13px]">verified</span>Supervision Critique AZ Pulse</span></div><h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white">Bonjour, Administrateur Système</h1><div className="flex flex-wrap items-center gap-4 text-xs text-[#778db2]"><span className="flex items-center gap-1.5 text-white font-medium"><span className="material-symbols-outlined text-[16px] text-[#fbbf24]">schedule</span><span id="live-dual-clock" className="">Paris UTC+1 : 18:29:24 • Yaoundé UTC+1 : 18:29:24</span></span><span className="w-1 h-1 rounded-full bg-white/20"></span><span className="flex items-center gap-1 text-[#b5c4ff]"><span className="material-symbols-outlined text-[16px]">history</span>Dernier audit : <strong className="text-white ml-1">Il y a 4 min par Dr. Marc V. (Super Admin)</strong></span></div></div><div className="flex flex-wrap sm:flex-nowrap items-center gap-3 self-stretch xl:self-auto"><div className="flex items-center gap-3.5 bg-[#001026]/70 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 shadow-inner"><div className="relative flex items-center justify-center w-11 h-11 rounded-lg bg-[#fbbf24]/10 text-[#fbbf24]"><span className="material-symbols-outlined text-[28px]">health_and_safety</span><span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-secondary-container rounded-full animate-ping"></span></div><div className="flex flex-col"><span className="text-[10px] uppercase font-bold tracking-widest text-[#778db2]">Santé Globale</span><span className="text-lg font-bold text-white leading-tight">100% Opérationnel</span><span className="text-[11px] text-[#ffdea8] font-medium">Zéro anomalie de niveau 1</span></div></div><div className="flex items-center gap-2"><button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-secondary-container text-white text-xs font-bold hover:bg-secondary transition-all shadow-lg active:scale-95" onclick="triggerQuickAction('new-user')" type="button"><span className="material-symbols-outlined text-[18px]">person_add</span><span className="">+ Créer Utilisateur</span></button><button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white text-[#001026] text-xs font-bold hover:bg-[#f0f4f8] transition-all shadow-lg active:scale-95" onclick="triggerQuickAction('rbac')" type="button"><span className="material-symbols-outlined text-[18px] text-[#004ad1]">rule_folder</span><span className="">Auditer Rôles</span></button></div></div></div></section><section className="rounded-2xl bg-white border border-[#dfe3e7] p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"><div className="flex items-start md:items-center gap-3"><div className="w-10 h-10 rounded-xl bg-[#001026] text-[#fbbf24] flex items-center justify-center flex-shrink-0 shadow-sm border border-[#dfe3e7]"><span className="material-symbols-outlined text-[20px]">auto_awesome</span></div><div className="space-y-0.5"><div className="flex flex-wrap items-center gap-2"><span className="text-xs font-extrabold text-[#001026] flex items-center gap-1">Insight Prédictif IA Système</span><span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Modèle Prédictif Nominal</span><span className="text-[11px] text-[#74777f] font-mono">Confiance 98.7%</span></div><p className="text-xs text-[#44474e] leading-relaxed"><strong className="text-[#001026]">Charge base de données stable à 28%</strong>. Aucune dérive de latence détectée sur les répliques PostgreSQL. <span className="text-[#004ad1] font-semibold">Recommandation IA :</span> Archivage automatique des logs SIEM programmé à 02h00.</p></div></div><div className="flex items-center gap-2 flex-shrink-0 self-end md:self-auto"><button onclick="alert('Audit prédictif exécuté : PostgreSQL à 28% de charge, cache Redis optimal (hit ratio 94.2%), stockage S3 WORM préservé.')" type="button" className="px-3 py-1.5 rounded-xl bg-[#f0f4f8] hover:bg-[#dfe3e7] text-[#001026] text-xs font-bold transition-all flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px] text-[#004ad1]">troubleshoot</span><span className="">Analyser</span></button><button onclick="alert('Génération en cours du Rapport d\'Intégrité IA en direct (SHA-256 scellé)...')" type="button" className="px-3.5 py-1.5 rounded-xl bg-[#001026] hover:bg-[#0b2545] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"><span className="text-[#fbbf24]">✨</span><span className="">Rapport d'intégrité IA</span></button></div></section>
{/*  4. BLOC KPI PRINCIPAL (6 cartes KPI chirurgicales)  */}
<section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">{/*  1. Utilisateurs Globaux  */}
<a className="bg-white p-4 rounded-2xl border border-[#dfe3e7] shadow-sm hover:border-[#004ad1] hover:shadow transition-all group flex flex-col justify-between" href="#admin-users">
<div className="flex items-center justify-between">
<span className="text-[11px] font-bold uppercase tracking-wider text-[#44474e]">Utilisateurs</span>
<span className="w-8 h-8 rounded-lg bg-[#f0f4f8] text-[#004ad1] flex items-center justify-center group-hover:bg-[#004ad1] group-hover:text-white transition-colors">
<span className="material-symbols-outlined text-[18px]">group</span>
</span>
</div>
<div className="my-1.5">
<div className="text-2xl font-extrabold text-[#001026] tracking-tight">1 248</div>
<div className="text-[11px] text-[#44474e] font-medium">Utilisateurs actifs</div>
</div>
<div className="pt-1.5 border-t border-[#dfe3e7]/50 flex items-center justify-between text-[10px]">
<span className="text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded">17 en attente</span>
<span className="text-[#ba1a1a] font-bold bg-red-50 px-1.5 py-0.5 rounded">3 suspendus</span>
</div>
</a>

{/*  2. Sessions Actives (Zero-Trust)  */}
<div className="bg-white p-4 rounded-2xl border border-[#dfe3e7] shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between">
<span className="text-[11px] font-bold uppercase tracking-wider text-[#44474e]">Sessions PAM</span>
<span className="w-8 h-8 rounded-lg bg-[#f0f4f8] text-[#004ad1] flex items-center justify-center">
<span className="material-symbols-outlined text-[18px]">devices</span>
</span>
</div>
<div className="my-1.5">
<div className="text-2xl font-extrabold text-[#001026] tracking-tight">126</div>
<div className="text-[11px] text-[#44474e] font-medium">Sessions actives</div>
</div>
<div className="pt-1.5 border-t border-[#dfe3e7]/50 flex items-center justify-between text-[10px]">
<span className="text-emerald-700 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 5 Admins</span>
<span className="text-[#74777f] font-mono">FIDO2 Strict</span>
</div>
</div>

{/*  3. Demandes d'accès & Habilitations  */}
<a className="bg-white p-4 rounded-2xl border border-amber-200 bg-gradient-to-br from-white to-amber-50/40 shadow-sm hover:border-amber-400 hover:shadow transition-all group flex flex-col justify-between" href="#admin-requests">
<div className="flex items-center justify-between">
<span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">Accès &amp; Privilèges</span>
<span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
<span className="material-symbols-outlined text-[18px]">key</span>
</span>
</div>
<div className="my-1.5">
<div className="text-2xl font-extrabold text-amber-900 tracking-tight flex items-center gap-1.5">
17
<span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-950">Arbitrage</span>
</div>
<div className="text-[11px] text-amber-800 font-medium">4 rôles modifiés</div>
</div>
<div className="pt-1.5 border-t border-amber-200/60 flex items-center justify-between text-[10px]">
<span className="text-[#ba1a1a] font-bold">2 sensibles</span>
<span className="text-amber-800 font-medium">↑ 5 depuis hier</span>
</div>
</a>

{/*  4. Sécurité Périmétrique & Filtrage  */}
<div className="bg-white p-4 rounded-2xl border border-red-200 bg-gradient-to-br from-white to-red-50/40 shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between">
<span className="text-[11px] font-bold uppercase tracking-wider text-[#ba1a1a]">Sécurité &amp; WAF</span>
<span className="w-8 h-8 rounded-lg bg-red-50 text-[#ba1a1a] flex items-center justify-center">
<span className="material-symbols-outlined text-[18px]">shield</span>
</span>
</div>
<div className="my-1.5">
<div className="text-2xl font-extrabold text-[#ba1a1a] tracking-tight flex items-center gap-1.5">
4
<span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-red-100 text-[#ba1a1a]">Alertes</span>
</div>
<div className="text-[11px] text-[#44474e] font-medium">2 critiques WAF</div>
</div>
<div className="pt-1.5 border-t border-red-200/60 flex items-center justify-between text-[10px]">
<span className="text-[#ba1a1a] font-bold">2 IP bloquées</span>
<span className="text-[#74777f] font-mono">SHA-256 SIEM</span>
</div>
</div>

{/*  5. Santé Plateforme Micro-Services  */}
<a className="bg-white p-4 rounded-2xl border border-[#dfe3e7] shadow-sm hover:border-emerald-500 hover:shadow transition-all group flex flex-col justify-between" href="#section-system-health">
<div className="flex items-center justify-between">
<span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Santé Plateforme</span>
<span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
<span className="material-symbols-outlined text-[18px]">hub</span>
</span>
</div>
<div className="my-1.5">
<div className="text-2xl font-extrabold text-emerald-800 tracking-tight">8 / 8</div>
<div className="text-[11px] text-[#44474e] font-medium">Services en ligne</div>
</div>
<div className="pt-1.5 border-t border-[#dfe3e7]/50 flex items-center justify-between text-[10px]">
<span className="text-emerald-700 font-bold">100% Nominal</span>
<span className="text-[#74777f] font-mono">Max 182ms</span>
</div>
</a>

{/*  6. Parc GLPI & Infrastructure IT  */}
<a className="bg-white p-4 rounded-2xl border border-[#dfe3e7] shadow-sm hover:border-[#004ad1] hover:shadow transition-all group flex flex-col justify-between" href="#infra-it">
<div className="flex items-center justify-between">
<span className="text-[11px] font-bold uppercase tracking-wider text-[#001026]">Parc GLPI &amp; IT</span>
<span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-[#004ad1] group-hover:text-white transition-colors">
<span className="material-symbols-outlined text-[18px]">dns</span>
</span>
</div>
<div className="my-1.5">
<div className="text-2xl font-extrabold text-[#001026] tracking-tight">248</div>
<div className="text-[11px] text-[#44474e] font-medium">Machines inventoriées</div>
</div>
<div className="pt-1.5 border-t border-[#dfe3e7]/50 flex items-center justify-between text-[10px]">
<span className="text-amber-800 font-bold">12 incidents</span>
<span className="text-[#ba1a1a] font-bold">2 critiques</span>
</div>
</a></section>
{/*  5. ZONE D'ACTION REQUISE & ALERTES PRIORITAIRES  */}
<section className="bg-gradient-to-r from-[#001026] via-[#0b2545] to-[#001c3b] rounded-2xl text-white p-5 shadow-lg border border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
<div className="space-y-2.5 max-w-2xl">
<div className="flex items-center gap-2">
<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-[11px] font-extrabold uppercase tracking-wider">
<span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
            Actions Requises Prioritaires
          </span>
<span className="text-xs text-[#b5c4ff] font-medium">• 4 points d'attention détectés</span>
</div>
{/*  Liste à puces des alertes  */}
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
{/*  Boutons d'action rapide à côté  */}
<div className="flex flex-wrap lg:flex-nowrap items-center gap-2 self-stretch lg:self-auto justify-end">
<button className="px-3 py-2 rounded-xl bg-secondary-container hover:bg-secondary text-white text-xs font-bold transition-all shadow flex items-center gap-1.5 active:scale-95" onclick="triggerQuickAction('new-user')">
<span className="material-symbols-outlined text-[16px]">person_add</span> + Nouvel utilisateur
        </button>
<button className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15 flex items-center gap-1.5 active:scale-95" onclick="triggerQuickAction('new-admin')">
<span className="material-symbols-outlined text-[16px]">shield_person</span> + Créer admin
        </button>
<button className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15 flex items-center gap-1.5 active:scale-95" onclick="triggerQuickAction('rbac')">
<span className="material-symbols-outlined text-[16px]">tune</span> Gérer permissions
        </button>
<a className="px-3 py-2 rounded-xl bg-[#fbbf24] hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-all shadow flex items-center gap-1.5 active:scale-95" href="#admin-requests">
<span className="material-symbols-outlined text-[16px]">check_circle</span> Voir demandes
        </a>
</div>
</section>
{/*  6. DEUX GRANDS BLOCS JUMEAUX : A) SANTÉ DU SYSTÈME & B) SÉCURITÉ & ACCÈS  */}
<section className="grid grid-cols-1 lg:grid-cols-2 gap-5" id="section-system-health">
{/*  A) BLOC « SANTÉ DU SYSTÈME »  */}
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
{/*  Liste des 8 Micro-services  */}
<div className="divide-y divide-[#dfe3e7]/60 text-xs mt-1">
{/*  1. Backend Symfony  */}
<div className="py-2.5 flex items-center justify-between hover:bg-[#f0f4f8] px-2 rounded-lg transition-colors cursor-pointer" onclick="showServiceDetail('Backend Symfony', 'Opérationnel', '18ms', 'API REST &amp; ORM Core AZ Pulse v6.4 LTS')">
<div className="flex items-center gap-2.5">
<span className="w-2 h-2 rounded-full bg-emerald-500"></span>
<span className="font-bold text-[#001026]">Backend Symfony</span>
<span className="text-[10px] text-[#44474e]">PHP 8.3-FPM</span>
</div>
<div className="flex items-center gap-3">
<span className="font-mono text-[11px] font-bold text-[#004ad1]">18ms</span>
<span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Opérationnel</span>
</div>
</div>
{/*  2. PostgreSQL Cluster  */}
<div className="py-2.5 flex items-center justify-between hover:bg-[#f0f4f8] px-2 rounded-lg transition-colors cursor-pointer" onclick="showServiceDetail('PostgreSQL Cluster', 'Opérationnel', '4ms', 'Master + 2 répliques temps réel')">
<div className="flex items-center gap-2.5">
<span className="w-2 h-2 rounded-full bg-emerald-500"></span>
<span className="font-bold text-[#001026]">PostgreSQL Cluster</span>
<span className="text-[10px] text-[#44474e]">Master + 2 répliques</span>
</div>
<div className="flex items-center gap-3">
<span className="font-mono text-[11px] font-bold text-[#004ad1]">4ms</span>
<span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Opérationnel</span>
</div>
</div>
{/*  3. FastAPI AI Service  */}
<div className="py-2.5 flex items-center justify-between hover:bg-[#f0f4f8] px-2 rounded-lg transition-colors cursor-pointer" onclick="showServiceDetail('FastAPI AI Service', 'Opérationnel', '182ms', 'Infér. Qdrant / Embeddings NLP')">
<div className="flex items-center gap-2.5">
<span className="w-2 h-2 rounded-full bg-emerald-500"></span>
<span className="font-bold text-[#001026]">FastAPI AI Service</span>
<span className="text-[10px] text-[#44474e]">Infér. Qdrant</span>
</div>
<div className="flex items-center gap-3">
<span className="font-mono text-[11px] font-bold text-amber-600">182ms</span>
<span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Opérationnel</span>
</div>
</div>
{/*  4. n8n Automation  */}
<div className="py-2.5 flex items-center justify-between hover:bg-[#f0f4f8] px-2 rounded-lg transition-colors cursor-pointer" onclick="showServiceDetail('n8n Automation', 'Opérationnel', 'Nominal', '42 flux orchestrés par heure')">
<div className="flex items-center gap-2.5">
<span className="w-2 h-2 rounded-full bg-emerald-500"></span>
<span className="font-bold text-[#001026]">n8n Automation</span>
<span className="text-[10px] text-[#44474e]">42 flux/h</span>
</div>
<div className="flex items-center gap-3">
<span className="font-mono text-[11px] font-bold text-[#004ad1]">Queue: 0</span>
<span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Opérationnel</span>
</div>
</div>
{/*  5. Mail Service SMTP  */}
<div className="py-2.5 flex items-center justify-between hover:bg-[#f0f4f8] px-2 rounded-lg transition-colors cursor-pointer" onclick="showServiceDetail('Mail Service SMTP', 'Opérationnel', 'SPF/DKIM Validés', 'TLS 1.3 Strict')">
<div className="flex items-center gap-2.5">
<span className="w-2 h-2 rounded-full bg-emerald-500"></span>
<span className="font-bold text-[#001026]">Mail Service SMTP</span>
<span className="text-[10px] text-[#44474e]">SPF/DKIM OK</span>
</div>
<div className="flex items-center gap-3">
<span className="font-mono text-[11px] font-bold text-emerald-600">100% Débit</span>
<span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Opérationnel</span>
</div>
</div>
{/*  6. Mercure Hub  */}
<div className="py-2.5 flex items-center justify-between hover:bg-[#f0f4f8] px-2 rounded-lg transition-colors cursor-pointer" onclick="showServiceDetail('Mercure Hub', 'Opérationnel', 'SSE temps réel', '99.99% disponibilité')">
<div className="flex items-center gap-2.5">
<span className="w-2 h-2 rounded-full bg-emerald-500"></span>
<span className="font-bold text-[#001026]">Mercure Hub</span>
<span className="text-[10px] text-[#44474e]">SSE temps réel</span>
</div>
<div className="flex items-center gap-3">
<span className="font-mono text-[11px] font-bold text-[#004ad1]">12ms</span>
<span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Opérationnel</span>
</div>
</div>
{/*  7. GLPI Asset Connect  */}
<div className="py-2.5 flex items-center justify-between hover:bg-[#f0f4f8] px-2 rounded-lg transition-colors cursor-pointer" onclick="showServiceDetail('GLPI Asset Connect', 'Connecté', '3 240 items', 'Synchronisation périodique des inventaires')">
<div className="flex items-center gap-2.5">
<span className="w-2 h-2 rounded-full bg-amber-500"></span>
<span className="font-bold text-[#001026]">GLPI Asset Connect</span>
<span className="text-[10px] text-[#44474e]">3 240 items</span>
</div>
<div className="flex items-center gap-3">
<span className="font-mono text-[11px] font-bold text-amber-600">Sync -3 min</span>
<span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">Connecté</span>
</div>
</div>
{/*  8. Storage & S3 Vault  */}
<div className="py-2.5 flex items-center justify-between hover:bg-[#f0f4f8] px-2 rounded-lg transition-colors cursor-pointer" onclick="showServiceDetail('Storage &amp; S3 Vault', 'Opérationnel', 'WORM SHA-256', 'Scellement immuable des documents')">
<div className="flex items-center gap-2.5">
<span className="w-2 h-2 rounded-full bg-emerald-500"></span>
<span className="font-bold text-[#001026]">Storage &amp; S3 Vault</span>
<span className="text-[10px] text-[#44474e]">WORM SHA-256</span>
</div>
<div className="flex items-center gap-3">
<span className="font-mono text-[11px] font-bold text-emerald-600">Immuable</span>
<span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Opérationnel</span>
</div>
</div>
</div>
</div>
<div className="pt-3 mt-2 border-t border-[#dfe3e7] flex items-center justify-between">
<span className="text-[11px] text-[#44474e]">Sondes d'intégrité télémétrique</span>
<a className="text-xs font-bold text-[#004ad1] hover:underline flex items-center gap-1" href="#configuration">
            Détails sondes système →
          </a>
</div>
</div>
{/*  B) BLOC « SÉCURITÉ & ACCÈS »  */}
<div className="bg-white rounded-2xl border border-[#dfe3e7] p-5 shadow-sm flex flex-col justify-between">
<div>
<div className="flex items-center justify-between pb-3.5 border-b border-[#dfe3e7]">
<div className="flex items-center gap-2.5">
<span className="w-2.5 h-6 bg-[#fbbf24] rounded-full"></span>
<div>
<h3 className="text-sm font-extrabold text-[#001026]">Sécurité &amp; Accès (Gouvernance)</h3>
<p className="text-[11px] text-[#44474e]">Filtrage périmétrique, Zero-Trust et SIEM</p>
</div>
</div>
<span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#004ad1] text-[11px] font-bold border border-blue-200">
              FIDO2 Strict
            </span>
</div>
{/*  Métriques de gouvernance de sécurité  */}
<div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-3"><div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
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
<div className="text-xs text-emerald-800 font-semibold">Audit SIEM Scellé</div>
<div className="text-sm font-extrabold text-emerald-900 mt-1 font-mono">SHA-256</div>
<div className="text-[10px] text-emerald-700">Registre immuable OK</div>
</div></div>
{/*  Mini-graphique Sparkline SVG  */}
<div className="p-3 rounded-xl bg-[#001026] text-white space-y-2">
<div className="flex items-center justify-between text-[11px]">
<span className="text-[#b5c4ff] font-medium">Tentatives de connexion &amp; autorisations (24h)</span>
<span className="text-[#fbbf24] font-mono font-bold">1 482 valides • 2 bloquées</span>
</div>
<div className="h-12 w-full">
<svg className="w-full h-full text-secondary-container" fill="none" preserveAspectRatio="none" stroke="currentColor" stroke-width="2" viewBox="0 0 200 40">
<defs>
<linearGradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">
<stop offset="0%" style={{ stopColor: '#1a62fe', stopOpacity: '0.4' }}></stop>
<stop offset="100%" style={{ stopColor: '#1a62fe', stopOpacity: '0.0' }}></stop>
</linearGradient>
</defs>
<path d="M0,35 L20,32 L40,28 L60,30 L80,18 L100,12 L120,16 L140,8 L160,14 L180,10 L200,6 L200,40 L0,40 Z" fill="url(#grad1)"></path>
<path d="M0,35 L20,32 L40,28 L60,30 L80,18 L100,12 L120,16 L140,8 L160,14 L180,10 L200,6" stroke="#1a62fe" stroke-width="2.5"></path>
<circle cx="80" cy="18" fill="#ba1a1a" r="3"></circle>
<circle cx="160" cy="14" fill="#ba1a1a" r="3"></circle>
</svg>
</div>
</div><div className="mt-3 p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 flex items-start justify-between gap-3"><div className="flex items-start gap-2.5"><span className="text-[#f59e0b] text-base mt-0.5">✨</span><div className="space-y-0.5"><div className="flex items-center gap-2"><span className="text-xs font-bold text-amber-950">Diagnostic IA Opérationnel</span><span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-200 text-amber-900">Recommandation</span></div><p className="text-[11px] text-[#44474e] leading-snug">Tentative d'injection SQL filtrée par WAF (Paris DC-1). <strong className="text-[#001026]">IP 185.220.101.4</strong> mise en quarantaine recommandée.</p></div></div><button type="button" onclick="alert('Action IA appliquée : IP 185.220.101.4 ajoutée à la liste noire temporaire du Firewall applicatif pour 72h.')" className="flex-shrink-0 px-2.5 py-1.5 rounded-lg bg-[#001026] hover:bg-[#0b2545] text-white text-[10px] font-bold transition-all flex items-center gap-1"><span className="material-symbols-outlined text-[12px] text-[#fbbf24]">security</span><span className="">Isoler l'IP</span></button></div>
</div>
<div className="pt-3 mt-3 border-t border-[#dfe3e7] flex items-center justify-between gap-2">
<a className="text-xs font-bold text-[#004ad1] hover:underline" href="#admin-requests">
            Voir les demandes →
          </a>
<button className="px-3 py-1.5 rounded-lg bg-[#001026] text-white text-xs font-bold hover:bg-[#0b2545] transition-colors" onclick="triggerQuickAction('siem-live')">
            Voir le journal de sécurité / SIEM
          </button>
</div>
</div>
</section>
{/*  7. DEUXIÈME PAIRE DE BLOCS : A) DEMANDES D'ACCÈS À TRAITER & B) ACTIVITÉ RÉCENTE  */}
<section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
{/*  A) BLOC « DEMANDES D'ACCÈS À TRAITER »  */}
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
<div className="flex items-center gap-2"><span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f0f4f8] text-[#001026] border border-[#dfe3e7] text-[10px] font-bold font-mono"><span className="text-[#fbbf24]">✨</span><span className="">Conformité IA : 99.4%</span></span><span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-extrabold">17 demandes à traiter</span></div>
</div>
<div className="divide-y divide-[#dfe3e7]/70 text-xs mt-1">
{/*  Requête 1  */}
<div className="py-3 flex items-center justify-between gap-3">
<div className="flex items-center gap-3">
<div className="w-9 h-9 rounded-xl bg-[#001026] text-white flex items-center justify-center font-bold text-xs">
                  JD
                </div>
<div>
<div className="font-extrabold text-[#001026] flex items-center gap-2">
                    Jean Dupont
                    <span className="text-[10px] font-semibold text-[#44474e]">Collaborateur</span>
</div>
<div className="text-[11px] text-[#44474e] flex items-center gap-1.5 mt-0.5">
<span className="material-symbols-outlined text-[12px]">schedule</span> Il y a 8 min • Rôle : <span className="font-semibold text-[#001026]">Responsable CRM</span>
</div>
</div>
</div>
<div className="flex items-center gap-1.5">
<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">En attente</span>
<button className="px-2.5 py-1 rounded-lg bg-secondary-container hover:bg-secondary text-white text-[11px] font-bold" onclick="approveDirect('Jean Dupont', 'Responsable CRM')">
                  Valider
                </button>
</div>
</div>
{/*  Requête 2  */}
<div className="py-3 flex items-center justify-between gap-3">
<div className="flex items-center gap-3">
<div className="w-9 h-9 rounded-xl bg-purple-900 text-white flex items-center justify-center font-bold text-xs">
                  MX
                </div>
<div>
<div className="font-extrabold text-[#001026] flex items-center gap-2">
                    Marie X
                    <span className="text-[10px] font-semibold text-[#44474e]">Responsable Formation</span>
</div>
<div className="text-[11px] text-[#44474e] flex items-center gap-1.5 mt-0.5">
<span className="material-symbols-outlined text-[12px]">schedule</span> Il y a 21 min • Rôle : <span className="font-semibold text-[#001026]">Gestionnaire LMS Certifié</span>
</div>
</div>
</div>
<div className="flex items-center gap-1.5">
<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">En attente</span>
<button className="px-2.5 py-1 rounded-lg bg-secondary-container hover:bg-secondary text-white text-[11px] font-bold" onclick="approveDirect('Marie X', 'Gestionnaire LMS Certifié')">
                  Valider
                </button>
</div>
</div>
{/*  Requête 3  */}
<div className="py-3 flex items-center justify-between gap-3">
<div className="flex items-center gap-3">
<div className="w-9 h-9 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-xs">
                  DY
                </div>
<div>
<div className="font-extrabold text-[#001026] flex items-center gap-2">
                    David Y
                    <span className="text-[10px] font-semibold text-[#44474e]">Client Global Tech</span>
</div>
<div className="text-[11px] text-[#44474e] flex items-center gap-1.5 mt-0.5">
<span className="material-symbols-outlined text-[12px]">schedule</span> Il y a 34 min • Rôle : <span className="font-semibold text-[#001026]">Auditeur Portail Client</span>
</div>
</div>
</div>
<div className="flex items-center gap-1.5">
<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">En attente</span>
<button className="px-2.5 py-1 rounded-lg bg-secondary-container hover:bg-secondary text-white text-[11px] font-bold" onclick="approveDirect('David Y', 'Auditeur Portail Client')">
                  Valider
                </button>
</div>
</div>
</div>
</div>
<div className="pt-3 mt-2 border-t border-[#dfe3e7] flex items-center justify-between">
<span className="text-[11px] text-[#44474e]">14 requêtes supplémentaires dans la file</span>
<button className="text-xs font-bold text-[#004ad1] hover:underline" onclick="alert('Ouverture de l\'interface complète d\'arbitrage des 17 demandes d\'accès.')">
            Voir les 17 demandes d'accès →
          </button>
</div>
</div>
{/*  B) BLOC « ACTIVITÉ RÉCENTE »  */}
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
{/*  Timeline 5 Événements  */}
<div className="relative pl-6 space-y-3.5 mt-3 text-xs before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#dfe3e7]">
{/*  10:42  */}
<div className="relative flex flex-col">
<span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white"></span>
<div className="text-[11px] text-[#74777f] font-mono">10:42</div>
<div className="text-[#181c1f]">
<strong className="text-[#001026]">Admin (Keyssel K.)</strong> — a attribué le rôle <span className="font-bold text-[#004ad1]">Responsable CRM</span> à <span className="font-semibold">Jean Dupont</span>
</div>
</div>
{/*  10:38  */}
<div className="relative flex flex-col">
<span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-white"></span>
<div className="text-[11px] text-[#74777f] font-mono">10:38</div>
<div className="text-[#181c1f]">
<strong className="text-[#001026]">Système</strong> — nouvelle demande d'accès <span className="font-mono text-[11px] bg-[#f0f4f8] px-1 rounded">#REQ-8849</span>
</div>
</div>
{/*  10:31  */}
<div className="relative flex flex-col">
<span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#004ad1] ring-4 ring-white"></span>
<div className="text-[11px] text-[#74777f] font-mono">10:31</div>
<div className="text-[#181c1f]">
<strong className="text-[#001026]">Responsable IT</strong> — équipement commutateur Cisco importé depuis GLPI
              </div>
</div>
{/*  10:24  */}
<div className="relative flex flex-col">
<span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#fbbf24] ring-4 ring-white"></span>
<div className="text-[11px] text-[#74777f] font-mono">10:24</div>
<div className="text-[#181c1f]">
<strong className="text-[#001026]">IA</strong> — recommandation générée sur le projet Global Tech
              </div>
</div>
{/*  10:17  */}
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
<button className="text-xs font-bold text-[#004ad1] hover:underline" onclick="triggerQuickAction('siem-live')">
            Consulter tout le journal d'activité →
          </button>
</div>
</div>
</section>
{/*  8. BLOCS SYNTHÉTIQUES INFÉRIEURS  */}
<section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
{/*  A) ACTIVITÉ DES MODULES  */}
<div className="bg-white rounded-2xl border border-[#dfe3e7] p-5 shadow-sm space-y-3.5 flex flex-col justify-between">
<div>
<div className="flex items-center justify-between pb-2 border-b border-[#dfe3e7]">
<h4 className="text-xs font-extrabold text-[#001026] uppercase tracking-wider flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-[#004ad1]">stacked_bar_chart</span>
Pilotage Global des Pôles (24h)</h4>
<span className="text-[10px] text-[#44474e] font-mono">Total: 807</span>
</div>
<div className="space-y-2 pt-2 text-xs">
<div>
<div className="flex justify-between text-[11px] mb-0.5">
<span className="font-medium text-[#181c1f]">CRM</span>
<span className="font-bold text-[#001026]">142 actions (87%)</span>
</div>
<div className="w-full bg-[#eaeef2] h-1.5 rounded-full overflow-hidden">
<div className="bg-secondary-container h-full rounded-full" style={{ width: '87%' }}></div>
</div>
</div>
<div>
<div className="flex justify-between text-[11px] mb-0.5">
<span className="font-medium text-[#181c1f]">Workspace</span>
<span className="font-bold text-[#001026]">286 actions (76%)</span>
</div>
<div className="w-full bg-[#eaeef2] h-1.5 rounded-full overflow-hidden">
<div className="bg-[#001026] h-full rounded-full" style={{ width: '76%' }}></div>
</div>
</div>
<div>
<div className="flex justify-between text-[11px] mb-0.5">
<span className="font-medium text-[#181c1f]">Formation</span>
<span className="font-bold text-[#001026]">92 actions (62%)</span>
</div>
<div className="w-full bg-[#eaeef2] h-1.5 rounded-full overflow-hidden">
<div className="bg-[#fbbf24] h-full rounded-full" style={{ width: '62%' }}></div>
</div>
</div>
<div>
<div className="flex justify-between text-[11px] mb-0.5">
<span className="font-medium text-[#181c1f]">Knowledge Hub</span>
<span className="font-bold text-[#001026]">58 actions (43%)</span>
</div>
<div className="w-full bg-[#eaeef2] h-1.5 rounded-full overflow-hidden">
<div className="bg-emerald-600 h-full rounded-full" style={{ width: '43%' }}></div>
</div>
</div>
<div>
<div className="flex justify-between text-[11px] mb-0.5">
<span className="font-medium text-[#181c1f]">Infrastructure</span>
<span className="font-bold text-[#001026]">74 actions (58%)</span>
</div>
<div className="w-full bg-[#eaeef2] h-1.5 rounded-full overflow-hidden">
<div className="bg-blue-600 h-full rounded-full" style={{ width: '58%' }}></div>
</div>
</div>
<div>
<div className="flex justify-between text-[11px] mb-0.5">
<span className="font-medium text-[#181c1f]">Analytics</span>
<span className="font-bold text-[#001026]">39 actions (31%)</span>
</div>
<div className="w-full bg-[#eaeef2] h-1.5 rounded-full overflow-hidden">
<div className="bg-purple-600 h-full rounded-full" style={{ width: '31%' }}></div>
</div>
</div>
<div>
<div className="flex justify-between text-[11px] mb-0.5">
<span className="font-medium text-[#181c1f]">AI Workspace</span>
<span className="font-bold text-[#001026]">112 actions (68%)</span>
</div>
<div className="w-full bg-[#eaeef2] h-1.5 rounded-full overflow-hidden">
<div className="bg-amber-500 h-full rounded-full" style={{ width: '68%' }}></div>
</div>
</div>
</div>
</div>
<div className="pt-2 border-t border-[#dfe3e7] text-[11px] text-[#44474e]">
          Charge moyenne plateforme : <strong className="text-emerald-700">62.4%</strong>
</div>
</div>
{/*  B) AI WORKSPACE MONITORING  */}
<div className="bg-white rounded-2xl border border-[#dfe3e7] p-5 shadow-sm space-y-3.5 flex flex-col justify-between">
<div>
<div className="flex items-center justify-between pb-2 border-b border-[#dfe3e7]">
<h4 className="text-xs font-extrabold text-[#001026] uppercase tracking-wider flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-[#fbbf24]">psychology</span>
              AI Workspace Monitoring
            </h4>
<span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900">v2.4 Core</span>
</div>
<div className="grid grid-cols-2 gap-2 pt-2 text-xs">
<div className="p-2 rounded-xl bg-[#f0f4f8]">
<div className="text-[10px] text-[#44474e]">Analyses aujourd'hui</div>
<div className="text-base font-extrabold text-[#001026]">42</div>
</div>
<div className="p-2 rounded-xl bg-[#f0f4f8]">
<div className="text-[10px] text-[#44474e]">Recommandations</div>
<div className="text-base font-extrabold text-[#004ad1]">18</div>
</div>
<div className="p-2 rounded-xl bg-[#f0f4f8]">
<div className="text-[10px] text-[#44474e]">Échecs d'analyse</div>
<div className="text-base font-extrabold text-[#ba1a1a]">2</div>
</div>
<div className="p-2 rounded-xl bg-[#f0f4f8]">
<div className="text-[10px] text-[#44474e]">Temps moyen</div>
<div className="text-base font-extrabold text-emerald-700 font-mono">2.4s</div>
</div>
</div>
<div className="mt-3">
<div className="text-[11px] font-bold text-[#44474e] mb-1.5">État des 6 agents IA :</div>
<div className="grid grid-cols-2 gap-1.5 text-[11px]">
<div className="flex items-center gap-1.5 bg-[#f0f4f8] px-2 py-1 rounded-lg">
<span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
<span className="truncate">Project Agent</span>
</div>
<div className="flex items-center gap-1.5 bg-[#f0f4f8] px-2 py-1 rounded-lg">
<span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
<span className="truncate">Commercial Agent</span>
</div>
<div className="flex items-center gap-1.5 bg-[#f0f4f8] px-2 py-1 rounded-lg">
<span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
<span className="truncate">Document Agent</span>
</div>
<div className="flex items-center gap-1.5 bg-[#f0f4f8] px-2 py-1 rounded-lg">
<span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
<span className="truncate">IT Agent</span>
</div>
<div className="flex items-center gap-1.5 bg-[#f0f4f8] px-2 py-1 rounded-lg">
<span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
<span className="truncate">Analytics Agent</span>
</div>
<div className="flex items-center gap-1.5 bg-[#f0f4f8] px-2 py-1 rounded-lg">
<span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
<span className="truncate">Formation Agent</span>
</div>
</div>
</div>
</div>
<a className="text-xs font-bold text-[#004ad1] hover:underline block pt-2 border-t border-[#dfe3e7]" href="#ai-workspace">
          Ouvrir AI Workspace →
        </a>
</div>
{/*  C) INFRASTRUCTURE & IT RÉSUMÉ  */}
<div className="bg-white rounded-2xl border border-[#dfe3e7] p-5 shadow-sm space-y-3.5 flex flex-col justify-between">
<div>
<div className="flex items-center justify-between pb-2 border-b border-[#dfe3e7]">
<h4 className="text-xs font-extrabold text-[#001026] uppercase tracking-wider flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-blue-600">dns</span>
              Infrastructure &amp; IT
            </h4>
<span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Sync GLPI</span>
</div>
<div className="space-y-2.5 pt-2 text-xs">
<div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f0f4f8]">
<span className="text-[#44474e]">Équipements inventoriés :</span>
<strong className="text-[#001026] font-extrabold text-sm">248</strong>
</div>
<div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/60">
<span className="text-amber-900">Incidents ouverts :</span>
<strong className="text-amber-900 font-extrabold text-sm">12</strong>
</div>
<div className="flex items-center justify-between p-2.5 rounded-xl bg-red-50/60 border border-red-200/60">
<span className="text-[#ba1a1a]">Incidents critiques :</span>
<strong className="text-[#ba1a1a] font-extrabold text-sm">2</strong>
</div>
<div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f0f4f8]">
<span className="text-[#44474e]">Maintenances prévues :</span>
<strong className="text-[#001026] font-extrabold text-sm">7</strong>
</div>
</div>
</div>
<a className="text-xs font-bold text-[#004ad1] hover:underline block pt-2 border-t border-[#dfe3e7]" href="#infra-it">
          Voir Infrastructure IT →
        </a>
</div>
{/*  D) ANALYTICS GLOBAL  */}
<div className="bg-white rounded-2xl border border-[#dfe3e7] p-5 shadow-sm space-y-3.5 flex flex-col justify-between">
<div>
<div className="flex items-center justify-between pb-2 border-b border-[#dfe3e7]">
<h4 className="text-xs font-extrabold text-[#001026] uppercase tracking-wider flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-purple-600">analytics</span>
              Analytics Global
            </h4>
<span className="text-[10px] text-[#74777f]">Cockpit synthèse</span>
</div>
<div className="space-y-2 pt-2 text-xs">
<div className="flex justify-between items-center py-1 border-b border-[#dfe3e7]/50">
<span className="text-[#44474e]">Utilisateurs actifs :</span>
<span className="font-bold text-[#001026]">1 248</span>
</div>
<div className="flex justify-between items-center py-1 border-b border-[#dfe3e7]/50">
<span className="text-[#44474e]">Activité système globale :</span>
<span className="font-bold text-emerald-700">807 actions/24h</span>
</div>
<div className="flex justify-between items-center py-1 border-b border-[#dfe3e7]/50">
<span className="text-[#44474e]">Demandes d'accès :</span>
<span className="font-bold text-amber-700">17 en attente</span>
</div>
<div className="flex justify-between items-center py-1 border-b border-[#dfe3e7]/50">
<span className="text-[#44474e]">Actions administratives :</span>
<span className="font-bold text-[#004ad1]">48 auditées</span>
</div>
<div className="flex justify-between items-center py-1 border-b border-[#dfe3e7]/50">
<span className="text-[#44474e]">Utilisation IA :</span>
<span className="font-bold text-[#fbbf24]">42 requêtes</span>
</div>
<div className="flex justify-between items-center py-1">
<span className="text-[#44474e]">Incidents IT résolus :</span>
<span className="font-bold text-emerald-700">94.8% SLA</span>
</div>
</div>
</div>
<a className="text-xs font-bold text-[#004ad1] hover:underline block pt-2 border-t border-[#dfe3e7]" href="#analytics">
          Consulter le rapport Analytics →
        </a>
</div>
</section>
</main>