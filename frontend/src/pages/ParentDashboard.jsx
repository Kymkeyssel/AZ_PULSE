import React, { useState, useEffect } from 'react';



import { API_BASE_URL, TOKEN_KEY } from '../services/config';

import { NavLink, useNavigate } from 'react-router-dom';


import { useAuth } from '../contexts/AuthContext';

// ── Design tokens ────────────────────────────────────────────────────────
// Replaced by Tailwind glassmorphism utility classes defined in index.css

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR PARENT
// ─────────────────────────────────────────────────────────────────────────────
const ParentSidebar = () => {
  const { fullName } = useAuth();
  const initials = fullName?.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() || 'P';

  const menuItems = [
    { label: 'Dashboard Parent', icon: 'family_restroom', path: '/parent', exact: true },
    { label: 'Mes enfants', icon: 'supervisor_account', path: '/parent/mes-enfants' },
    { label: 'Formations & Suivi', icon: 'timeline', path: '/parent/formations-suivi' },
    { label: 'Planning', icon: 'event_available', path: '/parent/planning' },
    { label: 'Bulletins & Notes', icon: 'grade', path: '/parent/bulletins-notes' },
    { label: 'Inscriptions', icon: 'how_to_reg', path: '/parent/inscriptions' },
    { label: 'Paiements & Reçus', icon: 'receipt_long', path: '/parent/paiements-recus' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 z-50 flex flex-col justify-between overflow-y-auto glass-panel-dark rounded-none border-y-0 border-l-0 border-r border-slate-700/50">
      <div className="flex flex-col">
        {/* Brand */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-white/5 bg-slate-900/30">
          <img alt="AZ PULSE_logo.png" className="h-8 w-auto object-contain brightness-110" src="/AZ PULSE_logo.png" />
          <div className="flex flex-col">
            <span className="text-sm leading-tight font-extrabold tracking-tight text-white">AZ PULSE</span>
            <span className="text-[9px] uppercase tracking-widest font-bold text-amber-400">Famille</span>
          </div>
        </div>

        {/* Portal info */}
        <div className="px-4 py-3 border-b border-white/5">
          <div className="bg-white/5 rounded-xl p-2 flex items-center justify-between gap-1 border border-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2 h-2 rounded-full shrink-0 bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)] animate-pulse" />
              <div className="flex flex-col truncate">
                <span className="text-[9px] truncate text-slate-400 font-bold tracking-wider">PORTAIL ACADÉMIQUE</span>
                <span className="text-xs font-bold truncate text-white">AZ Corporation</span>
              </div>
            </div>
            <button className="p-1 rounded-lg hover:bg-white/10 transition-colors text-slate-400" type="button">
              <span className="material-symbols-outlined notranslate text-[18px]">unfold_more</span>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-4 pt-4">
          <div className="px-2 pb-2 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Navigation</span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">Tuteur</span>
          </div>
          <nav className="flex flex-col gap-1">
            {menuItems.map(({ label, icon, path, exact }) => (
              <NavLink
                key={path}
                to={path}
                end={exact}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-900/50'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <span className="material-symbols-outlined notranslate text-[20px]">{icon}</span>
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Footer Profile */}
      <div className="p-4 bg-slate-900/50 border-t border-white/5 mt-auto">
        <div className="p-2 rounded-xl flex items-center justify-between gap-2 hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-inner border border-blue-400/30">
              {initials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold truncate text-white">{fullName || 'Parent'}</span>
              <span className="text-[10px] truncate text-slate-400">Compte Tuteur</span>
            </div>
          </div>
          <button className="p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0 text-slate-400 hover:text-white" title="Paramètres du compte">
            <span className="material-symbols-outlined notranslate text-[20px]">settings</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TOPBAR PARENT
// ─────────────────────────────────────────────────────────────────────────────
const ParentTopbar = () => {
  const { fullName, logout } = useAuth();
  const navigate = useNavigate();
  const initials = fullName?.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() || 'P';

  return (
    <header className="fixed top-0 left-72 right-0 h-16 z-40 flex items-center justify-between px-6 gap-4 glass-panel border-x-0 border-t-0 border-b border-slate-200/60 rounded-none bg-slate-50/80">
      
      {/* Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <span className="material-symbols-outlined notranslate absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">search</span>
          <input
            className="w-full h-10 pl-10 pr-12 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 bg-white/70 border border-slate-200/60 text-slate-800 transition-all"
            placeholder="Rechercher formations, cours, notes, apprenants..." type="text" />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[10px] tracking-widest font-mono bg-slate-100 border border-slate-200 text-slate-500">⌘K</div>
        </div>
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full shadow-sm bg-blue-50 border border-blue-100 text-blue-700">
          <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] animate-pulse" />
          <span className="text-[12px] font-bold tracking-wide">Pôle Académie</span>
        </div>

        <button className="relative p-2 rounded-xl hover:bg-slate-200/50 transition-colors text-slate-500 hover:text-slate-700" title="Centre d'aide" type="button">
          <span className="material-symbols-outlined notranslate text-[22px]">help</span>
        </button>

        <button className="relative p-2 rounded-xl hover:bg-slate-200/50 transition-colors text-slate-500 hover:text-slate-700" title="Notifications" type="button">
          <span className="material-symbols-outlined notranslate text-[22px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-slate-50" />
        </button>

        <div className="h-6 w-[1px] bg-slate-200/60" />

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[13px] font-bold leading-tight text-slate-800">{fullName || 'Parent'}</span>
            <span className="text-[10px] font-medium leading-tight text-slate-500">Famille / Tuteur</span>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md border border-blue-400/30">
            {initials}
          </div>
        </div>

        <button
          onClick={logout}
          className="p-2 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors text-slate-500 ml-1" title="Déconnexion" type="button">
          <span className="material-symbols-outlined notranslate text-[22px]">logout</span>
        </button>
      </div>
    </header>
  );
};


// ─────────────────────────────────────────────────────────────────────────────
// PAGE DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
const ParentDashboard = () => {
  const [children, setChildren] = useState([]);
  const [activeChildIndex, setActiveChildIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY);
        const res = await fetch(`${API_BASE_URL}/dashboard/parent`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Erreur de récupération des données parents");
        const json = await res.json();
        setChildren(json.children || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: C.surface, color: C.primary }}>
        <div className="animate-spin w-8 h-8 border-4 border-[#004ad1] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center" style={{ color: C.error }}>
        <h2>Erreur: {error}</h2>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: C.surface, color: C.onSurface }} className="antialiased flex min-h-screen">
        <ParentSidebar />
        <div className="pl-72 w-full">
          <ParentTopbar />
          <main className="relative pt-16 w-full px-6 flex items-center justify-center min-h-[calc(100vh-64px)]">
            <div className="text-center p-8 bg-white rounded-xl shadow-sm">
              <h1 className="text-xl font-bold mb-2">Espace Parents</h1>
              <p className="text-sm" style={{ color: C.onSurfaceVariant }}>Aucun enfant ne vous est rattaché pour le moment. Veuillez contacter l'administration.</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const activeChild = children[activeChildIndex];

  return (
    <div className="antialiased min-h-screen bg-slate-50 text-slate-800 font-sans">
      <ParentSidebar />
      <div className="pl-72">
        <ParentTopbar />
        
        <main className="relative pt-16 w-full px-6">
          <div className="pb-10">
            {/* ── Top Banner & Context Control Area ── */}
            <div className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-[14px] font-semibold text-blue-600 mb-1">
                  <span className="material-symbols-outlined notranslate text-[18px] bg-blue-100 p-1 rounded-lg">verified_user</span>
                  <span className="uppercase tracking-wider">Portail Sécurisé Famille &amp; Tuteurs</span>
                </div>
                <h1 className="text-[32px] md:text-[36px] leading-tight font-black tracking-tight text-slate-900">
                  Espace Parents &amp; Tuteurs • Suivi Académique
                </h1>
                <p className="text-sm mt-2 text-slate-500 font-medium max-w-2xl">
                  Supervision pédagogique, présences en temps réel et quittances d'inscriptions AZ Pulse
                </p>
              </div>

              {/* ── Active Child Switcher ── */}
              <div className="relative inline-block text-left self-start md:self-auto">
                <label className="block text-[10px] uppercase font-bold tracking-wider mb-2 text-slate-500">
                  Apprenant supervisé
                </label>
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center justify-between gap-4 px-4 py-3 rounded-2xl shadow-sm hover:shadow-md transition-all group min-w-[280px] md:min-w-[320px] bg-white border border-slate-200/60"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm bg-blue-100 text-blue-700 border border-blue-200">
                        {activeChild.initials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[14px] font-bold truncate text-slate-800">{activeChild.fullName}</span>
                        <span className="text-[11px] truncate text-slate-500 font-medium mt-0.5">
                          {activeChild.promoName}
                        </span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600">
                      <span className="material-symbols-outlined notranslate text-[20px]">expand_more</span>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-full min-w-[280px] md:min-w-[320px] rounded-2xl shadow-xl z-30 p-2 transition-all bg-white border border-slate-200/60">
                      <div className="px-3 py-2 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        Sélectionner un autre enfant
                      </div>
                      {children.map((child, idx) => (
                        <button 
                          key={child.id}
                          onClick={() => { setActiveChildIndex(idx); setDropdownOpen(false); }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors mb-1 ${idx === activeChildIndex ? 'bg-blue-50/80 border border-blue-100/50' : 'hover:bg-slate-50 border border-transparent'}`}
                        >
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold ${idx === activeChildIndex ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'}`}>
                            {child.initials}
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-[13px] font-bold text-slate-800">{child.fullName}</span>
                            <span className="text-[11px] truncate text-slate-500 font-medium">{child.promoName}</span>
                          </div>
                          {idx === activeChildIndex && (
                            <span className="material-symbols-outlined notranslate text-[18px] text-blue-600">check</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Hero Profile Bento Box ── */}
            <section className="mt-4 glass-panel rounded-2xl p-5 md:p-7 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200/60">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-100 text-blue-600 border border-blue-200 shadow-inner">
                    <span className="material-symbols-outlined notranslate text-[22px]">supervisor_account</span>
                  </div>
                  <div>
                    <h2 className="text-[18px] font-extrabold leading-tight text-slate-800">Mes Enfants Supervisés</h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Sélectionnez un profil pour adapter l'affichage du suivi</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200/60 shadow-inner">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    {children.length} Apprenants rattachés
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 pt-6">
                {children.map((child, idx) => (
                  <div key={child.id} 
                      onClick={() => setActiveChildIndex(idx)}
                      className={`flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 gap-4 ${idx === activeChildIndex ? 'bg-blue-50/50 border-blue-400 shadow-md transform -translate-y-0.5' : 'bg-slate-50/50 border-transparent hover:border-slate-300 hover:shadow-sm'}`}>
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 shadow-inner ${idx === activeChildIndex ? 'bg-gradient-to-br from-blue-600 to-blue-800 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        {child.initials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-extrabold truncate text-slate-800">{child.fullName}</span>
                          {child.status === 'ACTIVE' && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>Actif
                            </span>
                          )}
                        </div>
                        <span className="text-xs truncate text-slate-500 font-medium mt-1">{child.programName}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 w-full md:w-auto mt-2 md:mt-0">
                      <div className="flex items-center gap-6 text-right">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Moyenne</span>
                          <span className="text-sm font-black text-slate-800">{child.average} / 20</span>
                        </div>
                      </div>
                      {idx === activeChildIndex ? (
                        <span className="p-2 rounded-xl flex items-center justify-center bg-blue-600 text-white shadow-sm">
                          <span className="material-symbols-outlined notranslate text-[20px]">check</span>
                        </span>
                      ) : (
                        <button className="px-3 py-2 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600">
                          <span>Basculer</span>
                          <span className="material-symbols-outlined notranslate text-[16px]">sync_alt</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Dashboard KPIs Grid ── */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {/* KPI 1: Moyenne Générale */}
              <div className="glass-panel rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors pointer-events-none"></div>
                <div className="flex items-center justify-between relative z-10">
                  <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-500">Moyenne Générale</span>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-100/50 text-blue-600 border border-blue-100 shadow-inner">
                    <span className="material-symbols-outlined notranslate text-[20px]">workspace_premium</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mt-4 relative z-10">
                  <span className="text-[36px] md:text-[40px] font-black tracking-tighter text-slate-800">{activeChild.average}</span>
                  <span className="text-sm font-bold text-slate-400">/ 20</span>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/60 relative z-10">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 bg-amber-100 text-amber-700 border border-amber-200">
                    <span className="material-symbols-outlined notranslate text-[14px]">trending_up</span> Rang: - / -
                  </span>
                </div>
              </div>

              {/* KPI 2: Prochaines Évaluations */}
              <div className="glass-panel rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors pointer-events-none"></div>
                <div className="flex items-center justify-between relative z-10">
                  <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-500">Évaluations à venir</span>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-100/50 text-indigo-600 border border-indigo-100 shadow-inner">
                    <span className="material-symbols-outlined notranslate text-[20px]">event_upcoming</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mt-4 relative z-10">
                  <span className="text-[36px] md:text-[40px] font-black tracking-tighter text-slate-800">{activeChild.upcomingEvals.length}</span>
                  <span className="text-sm font-bold text-slate-400">épreuves</span>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] flex flex-col gap-1.5 text-slate-600 font-medium relative z-10">
                  {activeChild.upcomingEvals.length === 0 ? (
                    <span className="text-slate-400">Aucune épreuve planifiée</span>
                  ) : activeChild.upcomingEvals.map((e, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                      <span className="truncate pr-2">{e.title}</span>
                      <span className="font-bold text-slate-800 shrink-0">{e.dueDate}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* KPI 3: Frais & Tranches */}
              <div className="rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow" style={{ background: C.surfaceContainerLowest }}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: C.onSurfaceVariant }}>Scolarité &amp; Solde</span>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.surfaceContainer, color: C.primary }}>
                    <span className="material-symbols-outlined notranslate text-[18px]">account_balance_wallet</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-[32px] md:text-[36px] font-extrabold tracking-tight" style={{ color: C.primary }}>{activeChild.financial?.totalAmount?.toLocaleString('fr-FR') ?? 0}</span>
                  <span className="text-[10px] uppercase" style={{ color: C.onSurfaceVariant }}>XAF</span>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span style={{ color: C.onSurfaceVariant }}>Solde: {activeChild.financial?.remainingBalance?.toLocaleString('fr-FR') ?? 0} XAF</span>
                    <span className="font-semibold" style={{ color: C.error }}>Tranches: {activeChild.financial?.paidTranches ?? 0}/{activeChild.financial?.totalTranches ?? 0}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: C.surfaceVariant }}>
                    <div className="h-full rounded-full" style={{ background: C.primary, width: `${activeChild.financial && activeChild.financial.totalAmount > 0 ? (activeChild.financial.paidAmount / activeChild.financial.totalAmount * 100) : 0}%` }}></div>
                  </div>
                </div>
              </div>

              {/* KPI 4: Statut Dossier Administratif */}
              <div className="glass-panel rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors pointer-events-none"></div>
                <div className="flex items-center justify-between relative z-10">
                  <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-500">Dossier Administratif</span>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-100/50 text-emerald-600 border border-emerald-100 shadow-inner">
                    <span className="material-symbols-outlined notranslate text-[20px]">task_alt</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4 relative z-10">
                  <span className="w-3 h-3 rounded-full shrink-0 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"></span>
                  <span className="text-[24px] font-black text-slate-800">À jour</span>
                </div>
                <p className="text-[12px] mt-2 leading-tight text-slate-500 font-medium relative z-10">
                  Justificatif bancaire validé par AZ Finance.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 relative z-10">
                  <span className="material-symbols-outlined notranslate text-[16px]">lock</span> Authentifié SHA-256
                </div>
              </div>
            </div>

            {/* ── Section Split: Planning & Recent Grades ── */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Planning */}
              <div className="lg:col-span-5 glass-panel rounded-2xl p-6 md:p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-5 border-b border-slate-200/60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200 shadow-inner">
                        <span className="material-symbols-outlined notranslate text-[22px]">calendar_today</span>
                      </div>
                      <h2 className="text-[18px] font-extrabold text-slate-800">Planning des cours</h2>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500 border border-slate-200/60">En cours</span>
                  </div>
                  <div className="mt-5 flex flex-col gap-3">
                    {activeChild.schedule.length === 0 ? (
                      <div className="text-center py-8 text-sm text-slate-400 font-medium">Aucun cours planifié</div>
                    ) : (
                      activeChild.schedule.slice(0, 3).map((session, i) => (
                        <div key={i} className="p-4 rounded-2xl flex flex-col sm:flex-row sm:items-start gap-4 transition-all hover:bg-slate-50 border border-slate-200/60 bg-white">
                          <div className="flex items-start gap-4 w-full">
                            <div className="flex flex-col items-center justify-center w-14 py-2 rounded-xl font-bold shrink-0 bg-blue-50 text-blue-700 border border-blue-100/50">
                              <span className="text-[10px] uppercase tracking-wider">{session.day}</span>
                              <span className="text-[20px] font-black">{session.dayNum}</span>
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-[15px] font-extrabold text-slate-800">{session.course}</span>
                              <div className="flex flex-wrap items-center gap-1.5 text-xs mt-1 font-medium text-slate-500">
                                <span className="material-symbols-outlined notranslate text-[16px] text-slate-400">schedule</span> {session.startTime.split(' ')[1]} - {session.endTime}
                                <span className="mx-1 text-slate-300">•</span>
                                <span className="material-symbols-outlined notranslate text-[16px] text-slate-400">meeting_room</span> {session.room}
                              </div>
                              <span className="text-[11px] font-bold mt-1.5 text-blue-600">Intervenant: {session.teacher}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="pt-6 mt-6 flex flex-col sm:flex-row sm:items-center justify-between border-t border-slate-200/60 gap-3">
                  <span className="text-[11px] font-bold flex items-center gap-1.5 text-slate-500">
                    <span className="material-symbols-outlined notranslate text-[18px] text-blue-500">notifications_active</span> Alertes activées
                  </span>
                  <a href="#planning" className="text-xs font-bold hover:underline text-blue-600">Voir l'emploi du temps complet →</a>
                </div>
              </div>

              {/* Grades */}
              <div className="lg:col-span-7 glass-panel rounded-2xl p-6 md:p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-5 border-b border-slate-200/60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200 shadow-inner">
                        <span className="material-symbols-outlined notranslate text-[22px]">assignment_turned_in</span>
                      </div>
                      <h2 className="text-[18px] font-extrabold text-slate-800">Dernières Notes &amp; Évaluations</h2>
                    </div>
                  </div>
                  <div className="mt-5 overflow-x-auto pb-2">
                    <table className="w-full text-left min-w-[500px]">
                      <thead>
                        <tr className="text-[10px] uppercase tracking-widest font-bold text-slate-400 bg-slate-50/80 rounded-xl border-y border-slate-200/60">
                          <th className="py-3 px-4 rounded-l-xl">Module</th>
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4">Note / 20</th>
                          <th className="py-3 px-4 rounded-r-xl">Appréciation</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm font-medium">
                        {activeChild.recentGrades.length === 0 ? (
                          <tr><td colSpan="4" className="text-center py-8 text-sm text-slate-400">Aucune note pour le moment</td></tr>
                        ) : (
                          activeChild.recentGrades.map((grade, i) => (
                            <tr key={i} className="transition-colors hover:bg-slate-50 border-b border-slate-100 last:border-0">
                              <td className="py-4 px-4">
                                <div className="text-[13px] font-extrabold text-slate-800">{grade.course}</div>
                              </td>
                              <td className="py-4 px-4 text-xs whitespace-nowrap text-slate-500">{grade.date}</td>
                              <td className="py-4 px-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-lg text-[13px] font-black bg-blue-50 text-blue-700 border border-blue-100/50">
                                  {grade.score} / 20
                                </span>
                              </td>
                              <td className="py-4 px-4 text-[13px] text-slate-600 font-medium">
                                {grade.comment || '-'}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="pt-6 mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-200/60">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)] animate-pulse"></span>
                    <span className="text-xs font-bold text-slate-500">Prochain bulletin disponible prochainement</span>
                  </div>
                  <button className="px-5 py-2.5 rounded-xl font-bold text-[13px] transition-all flex items-center justify-center gap-2 w-full sm:w-auto bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-600 shadow-sm">
                    <span className="material-symbols-outlined notranslate text-[20px]">print</span> Relevé semestriel
                  </button>
                </div>
              </div>


            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ParentDashboard;
