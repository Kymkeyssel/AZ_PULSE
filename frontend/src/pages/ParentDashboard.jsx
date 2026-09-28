import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// ── Design tokens ────────────────────────────────────────────────────────
const C = {
  primary:           '#001026',
  primaryContainer:  '#0b2545',
  secondary:         '#004ad1',
  secondaryContainer:'#1a62fe',
  surface:           '#f6fafe',
  surfaceContainerLow: '#f0f4f8',
  surfaceContainer:  '#eaeef2',
  surfaceContainerHigh:'#dfe3e7',
  surfaceContainerLowest:'#ffffff',
  surfaceVariant:    '#dfe3e7',
  onSurface:         '#181c1f',
  onSurfaceVariant:  '#44474e',
  outline:           '#74777f',
  error:             '#ba1a1a',
  errorContainer:    '#ffdad6',
  tertiaryFixed:     '#ffdea8',
  tertiaryFixedDim:  '#ffba20',
};

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
    <aside style={{ background: C.surfaceContainerLow }} className="fixed left-0 top-0 h-screen w-72 shadow-sm z-50 flex flex-col justify-between overflow-y-auto">
      <div className="flex flex-col">
        {/* Brand */}
        <div className="h-16 px-4 flex items-center gap-2">
          <img alt="AZ PULSE_logo.png" className="h-8 w-auto object-contain" src="/AZ PULSE_logo.png" />
          <div className="flex flex-col">
            <span style={{ color: C.primary }} className="text-base leading-tight font-bold tracking-tight">AZ PULSE</span>
            <span style={{ color: C.onSurfaceVariant }} className="text-[10px] uppercase tracking-wider">Formation &amp; Académie</span>
          </div>
        </div>

        {/* Portal info */}
        <div className="px-4 py-1">
          <div style={{ background: C.surfaceContainer }} className="rounded-xl p-2 flex items-center justify-between gap-1">
            <div className="flex items-center gap-1 min-w-0">
              <div style={{ background: C.tertiaryFixedDim }} className="w-2 h-2 rounded-full shrink-0" />
              <div className="flex flex-col truncate">
                <span style={{ color: C.onSurfaceVariant }} className="text-[10px] truncate">PORTAIL ACADÉMIQUE</span>
                <span style={{ color: C.primary }} className="text-xs font-bold truncate">AZ Corporation SARL</span>
              </div>
            </div>
            <button style={{ color: C.onSurfaceVariant }} className="p-1 rounded-lg hover:bg-black/5 transition-colors" type="button">
              <span className="material-symbols-outlined notranslate text-[18px]">unfold_more</span>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-4 pt-4">
          <div className="px-2 pb-1 flex items-center justify-between">
            <span style={{ color: C.onSurfaceVariant }} className="text-[10px] uppercase tracking-wider">Espace Famille</span>
            <span style={{ color: C.secondary }} className="text-[10px] font-semibold">Parent</span>
          </div>
          <nav className="flex flex-col gap-1">
            {menuItems.map(({ label, icon, path, exact }) => (
              <NavLink
                key={path}
                to={path}
                end={exact}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-all ${
                    isActive
                      ? 'font-bold shadow-sm'
                      : 'hover:bg-black/5'
                  }`
                }
                style={({ isActive }) => isActive
                  ? { background: C.primaryContainer, color: '#fff' }
                  : { color: C.onSurfaceVariant }
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
      <div className="p-4">
        <div style={{ background: C.surfaceContainer }} className="p-2 rounded-xl flex items-center justify-between gap-1">
          <div className="flex items-center gap-2 min-w-0">
            <div style={{ background: C.primary }} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs">
              {initials}
            </div>
            <div className="flex flex-col min-w-0">
              <span style={{ color: C.primary }} className="text-xs font-bold truncate">{fullName || 'Parent'}</span>
              <span style={{ color: C.onSurfaceVariant }} className="text-[10px] truncate">Compte Tuteur</span>
            </div>
          </div>
          <button style={{ color: C.onSurfaceVariant }} className="p-1 rounded-lg hover:bg-black/5 transition-colors shrink-0" title="Paramètres du compte">
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
  const { fullName } = useAuth();
  const navigate = useNavigate();
  const initials = fullName?.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() || 'P';

  return (
    <header
      style={{ background: 'rgba(246,250,254,0.85)', boxShadow: '0 1px 8px rgba(0,0,0,0.04)', backdropFilter: 'blur(16px)' }}
      className="fixed top-0 left-72 right-0 h-16 z-40 flex items-center justify-between px-6 gap-4">
      
      {/* Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <span style={{ color: C.outline }} className="material-symbols-outlined notranslate absolute left-3 top-1/2 -translate-y-1/2 text-[20px]">search</span>
          <input
            style={{ background: C.surfaceContainerLowest, color: C.onSurface }}
            className="w-full h-10 pl-10 pr-12 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none shadow-sm focus:ring-2 focus:ring-[#004ad1]/30"
            placeholder="Rechercher formations, cours, notes, apprenants..." type="text" />
          <div style={{ background: C.surfaceContainer, color: C.onSurfaceVariant }} className="absolute right-3 top-1/2 -translate-y-1/2 px-1 py-0.5 rounded text-[10px] tracking-widest font-mono">⌘K</div>
        </div>
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-4">
        <div style={{ background: C.primaryContainer, color: '#fff' }} className="hidden lg:flex items-center gap-1 px-3 py-1 rounded-full shadow-sm">
          <span style={{ background: C.tertiaryFixedDim }} className="w-2 h-2 rounded-full" />
          <span className="text-[12px] font-semibold tracking-wide">Pôle Académie &amp; Institut</span>
        </div>

        <button style={{ color: C.onSurfaceVariant }} className="relative p-1 rounded-lg hover:bg-black/5 transition-colors" title="Centre d'aide" type="button">
          <span className="material-symbols-outlined notranslate text-[22px]">help</span>
        </button>

        <button style={{ color: C.onSurfaceVariant }} className="relative p-1 rounded-lg hover:bg-black/5 transition-colors" title="Notifications" type="button">
          <span className="material-symbols-outlined notranslate text-[22px]">notifications</span>
          <span style={{ background: C.tertiaryFixedDim, border: `2px solid ${C.surface}` }} className="absolute top-1 right-1 w-2 h-2 rounded-full" />
        </button>

        <div style={{ background: C.surfaceVariant }} className="h-6 w-[1px]" />

        <div className="flex items-center gap-2">
          <div style={{ background: C.primary }} className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs">
            {initials}
          </div>
          <div className="hidden sm:flex flex-col">
            <span style={{ color: C.primary }} className="text-[12px] font-bold leading-tight">{fullName || 'Parent'}</span>
            <span style={{ color: C.onSurfaceVariant }} className="text-[10px] leading-tight">Famille / Tuteur</span>
          </div>
        </div>

        <button
          onClick={() => { localStorage.removeItem('az_pulse_token'); navigate('/'); }}
          style={{ color: C.error }}
          className="p-1 rounded-lg hover:bg-[#ffdad6] transition-colors" title="Déconnexion" type="button">
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
        const token = localStorage.getItem('az_pulse_token');
        const res = await fetch('http://localhost:8000/api/dashboard/parent', {
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
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: C.surface, color: C.onSurface }} className="antialiased min-h-screen">
      <ParentSidebar />
      <div className="pl-72">
        <ParentTopbar />
        
        <main className="relative pt-16 w-full px-6">
          <div className="pb-10">
            {/* ── Top Banner & Context Control Area ── */}
            <div className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-[14px] font-semibold" style={{ color: C.secondary }}>
                  <span className="material-symbols-outlined notranslate text-[16px]">verified_user</span>
                  <span className="uppercase tracking-wider">Portail Sécurisé Famille &amp; Tuteurs</span>
                </div>
                <h1 className="text-[32px] md:text-[36px] leading-tight font-bold tracking-tight mt-1" style={{ color: C.primary }}>
                  Espace Parents &amp; Tuteurs • Suivi Académique
                </h1>
                <p className="text-[14px] mt-1" style={{ color: C.onSurfaceVariant }}>
                  Supervision pédagogique, présences en temps réel et quittances d'inscriptions AZ Pulse
                </p>
              </div>

              {/* ── Active Child Switcher ── */}
              <div className="relative inline-block text-left self-start md:self-auto">
                <label className="block text-[10px] uppercase font-bold tracking-wider mb-1" style={{ color: C.onSurfaceVariant }}>
                  Apprenant supervisé
                </label>
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center justify-between gap-4 px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition-all group min-w-[280px] md:min-w-[320px]"
                    style={{ background: C.surfaceContainerLowest, color: C.primary }}
                  >
                    <div className="flex items-center gap-2 text-left">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
                          style={{ background: C.primaryContainer, color: '#fff' }}>
                        {activeChild.initials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[14px] font-bold truncate">{activeChild.fullName}</span>
                        <span className="text-[10px] truncate" style={{ color: C.onSurfaceVariant }}>
                          {activeChild.promoName}
                        </span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                        style={{ background: C.surfaceContainer, color: C.secondary }}>
                      <span className="material-symbols-outlined notranslate text-[20px]">expand_more</span>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-full min-w-[280px] md:min-w-[320px] rounded-xl shadow-xl z-30 p-1 transition-all"
                        style={{ background: C.surfaceContainerLowest }}>
                      <div className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider" style={{ color: C.onSurfaceVariant }}>
                        Sélectionner un autre enfant
                      </div>
                      {children.map((child, idx) => (
                        <button 
                          key={child.id}
                          onClick={() => { setActiveChildIndex(idx); setDropdownOpen(false); }}
                          className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left transition-colors mb-1"
                          style={{ background: idx === activeChildIndex ? C.surfaceContainerHigh : 'transparent' }}
                        >
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                              style={{ background: idx === activeChildIndex ? C.primaryContainer : C.secondary, color: '#fff' }}>
                            {child.initials}
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-[12px] font-bold" style={{ color: C.primary }}>{child.fullName}</span>
                            <span className="text-[10px] truncate" style={{ color: C.onSurfaceVariant }}>{child.promoName}</span>
                          </div>
                          {idx === activeChildIndex && (
                            <span className="material-symbols-outlined notranslate text-[18px]" style={{ color: C.secondary }}>check</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Hero Profile Bento Box ── */}
            <section className="mt-2 rounded-xl p-4 md:p-6 shadow-sm" style={{ background: C.surfaceContainerLowest }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b" style={{ borderColor: C.surfaceVariant }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.surfaceContainer, color: C.secondary }}>
                    <span className="material-symbols-outlined notranslate text-[20px]">supervisor_account</span>
                  </div>
                  <div>
                    <h2 className="text-[16px] font-bold leading-tight" style={{ color: C.primary }}>Mes Enfants Supervisés</h2>
                    <p className="text-[12px]" style={{ color: C.onSurfaceVariant }}>Sélectionnez un profil pour adapter l'affichage du suivi</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium" style={{ background: C.surfaceContainer, color: C.onSurfaceVariant }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: C.tertiaryFixedDim }}></span>
                    {children.length} Apprenants rattachés
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 pt-6">
                {children.map((child, idx) => (
                  <div key={child.id} 
                      onClick={() => setActiveChildIndex(idx)}
                      className={`flex flex-col md:flex-row md:items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors gap-3 ${idx === activeChildIndex ? 'shadow-sm' : 'hover:shadow-sm'}`}
                      style={{ 
                        background: idx === activeChildIndex ? C.surfaceContainerLow : `${C.surfaceContainerLow}99`, 
                        borderColor: idx === activeChildIndex ? `${C.secondary}66` : 'transparent' 
                      }}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ring-2"
                          style={{ background: idx === activeChildIndex ? C.primary : C.secondary, color: '#fff', '--tw-ring-color': `${C.secondary}4D` }}>
                        {child.initials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-bold truncate" style={{ color: C.primary }}>{child.fullName}</span>
                          {child.status === 'ACTIVE' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: '#dcfce7', color: '#166534' }}>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>Actif
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] truncate" style={{ color: C.onSurfaceVariant }}>{child.programName}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 w-full md:w-auto mt-2 md:mt-0">
                      <div className="flex items-center gap-6 text-right">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-medium" style={{ color: C.onSurfaceVariant }}>Moyenne</span>
                          <span className="text-[12px] font-bold" style={{ color: C.primary }}>{child.average} / 20</span>
                        </div>
                      </div>
                      {idx === activeChildIndex ? (
                        <span className="p-1.5 rounded-lg flex items-center justify-center" style={{ background: C.secondary, color: '#fff' }}>
                          <span className="material-symbols-outlined notranslate text-[18px]">check</span>
                        </span>
                      ) : (
                        <button className="px-2.5 py-1.5 rounded-lg font-semibold text-[10px] transition-colors flex items-center gap-1"
                                style={{ background: C.surfaceContainer, color: C.primary }}>
                          <span>Basculer</span>
                          <span className="material-symbols-outlined notranslate text-[14px]">sync_alt</span>
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
              <div className="rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow" style={{ background: C.surfaceContainerLowest }}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: C.onSurfaceVariant }}>Moyenne Générale</span>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.surfaceContainer, color: C.primary }}>
                    <span className="material-symbols-outlined notranslate text-[18px]">workspace_premium</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-[32px] md:text-[36px] font-extrabold tracking-tight" style={{ color: C.primary }}>{activeChild.average}</span>
                  <span className="text-[14px] font-semibold" style={{ color: C.onSurfaceVariant }}>/ 20</span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1" style={{ background: C.tertiaryFixed, color: '#271900' }}>
                    <span className="material-symbols-outlined notranslate text-[14px]">trending_up</span> Rang: - / -
                  </span>
                </div>
              </div>

              {/* KPI 2: Prochaines Évaluations */}
              <div className="rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow" style={{ background: C.surfaceContainerLowest }}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: C.onSurfaceVariant }}>Évaluations à venir</span>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#dce1ff', color: C.secondary }}>
                    <span className="material-symbols-outlined notranslate text-[18px]">event_upcoming</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-[32px] md:text-[36px] font-extrabold tracking-tight" style={{ color: C.primary }}>{activeChild.upcomingEvals.length}</span>
                  <span className="text-[14px] font-semibold" style={{ color: C.onSurfaceVariant }}>épreuves</span>
                </div>
                <div className="mt-3 text-[10px] flex flex-col gap-0.5" style={{ color: C.onSurfaceVariant }}>
                  {activeChild.upcomingEvals.length === 0 ? (
                    <span className="text-gray-400">Aucune épreuve planifiée</span>
                  ) : activeChild.upcomingEvals.map((e, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="truncate pr-2">{e.title}</span>
                      <span className="font-semibold shrink-0" style={{ color: C.primary }}>{e.dueDate}</span>
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
              <div className="rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow" style={{ background: C.surfaceContainerLowest }}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: C.onSurfaceVariant }}>Dossier Administratif</span>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.surfaceContainerHigh, color: C.primary }}>
                    <span className="material-symbols-outlined notranslate text-[18px]">task_alt</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: C.secondary }}></span>
                  <span className="text-[20px] font-bold" style={{ color: C.primary }}>À jour</span>
                </div>
                <p className="text-[12px] mt-2 leading-tight" style={{ color: C.onSurfaceVariant }}>
                  Justificatif bancaire validé par AZ Finance.
                </p>
                <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold" style={{ color: C.secondary }}>
                  <span className="material-symbols-outlined notranslate text-[14px]">lock</span> Authentifié SHA-256
                </div>
              </div>
            </div>

            {/* ── Section Split: Planning & Recent Grades ── */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Planning */}
              <div className="lg:col-span-5 rounded-xl p-6 md:p-8 shadow-sm flex flex-col justify-between" style={{ background: C.surfaceContainerLowest }}>
                <div>
                  <div className="flex items-center justify-between pb-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined notranslate text-[22px]" style={{ color: C.secondary }}>calendar_today</span>
                      <h2 className="text-[16px] font-bold" style={{ color: C.primary }}>Planning des cours</h2>
                    </div>
                    <span className="text-[10px] font-medium" style={{ color: C.onSurfaceVariant }}>En cours</span>
                  </div>
                  <div className="mt-4 flex flex-col gap-3">
                    {activeChild.schedule.length === 0 ? (
                      <div className="text-center py-6 text-sm text-gray-500">Aucun cours planifié</div>
                    ) : (
                      activeChild.schedule.slice(0, 3).map((session, i) => (
                        <div key={i} className="p-4 rounded-xl flex flex-col sm:flex-row sm:items-start gap-4 transition-colors" style={{ background: C.surfaceContainerLow }}>
                          <div className="flex items-start gap-3 w-full">
                            <div className="flex flex-col items-center justify-center w-12 py-1.5 rounded-lg font-bold shrink-0" style={{ background: C.surfaceContainer, color: C.primary }}>
                              <span className="text-[10px] uppercase">{session.day}</span>
                              <span className="text-[16px]">{session.dayNum}</span>
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-[14px] font-bold" style={{ color: C.primary }}>{session.course}</span>
                              <div className="flex flex-wrap items-center gap-1 text-[12px] mt-0.5" style={{ color: C.onSurfaceVariant }}>
                                <span className="material-symbols-outlined notranslate text-[16px]">schedule</span> {session.startTime.split(' ')[1]} - {session.endTime}
                                <span className="mx-1">•</span>
                                <span className="material-symbols-outlined notranslate text-[16px]">meeting_room</span> {session.room}
                              </div>
                              <span className="text-[10px] font-medium mt-1" style={{ color: C.secondary }}>Intervenant: {session.teacher}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="pt-6 mt-6 flex flex-col sm:flex-row sm:items-center justify-between border-t gap-2" style={{ borderColor: C.surfaceVariant, color: C.onSurfaceVariant }}>
                  <span className="text-[10px] flex items-center gap-1">
                    <span className="material-symbols-outlined notranslate text-[16px]" style={{ color: C.secondary }}>notifications_active</span> Alertes activées
                  </span>
                  <a href="#planning" className="text-[12px] font-bold hover:underline" style={{ color: C.secondary }}>Voir l'emploi du temps complet →</a>
                </div>
              </div>

              {/* Grades */}
              <div className="lg:col-span-7 rounded-xl p-6 md:p-8 shadow-sm flex flex-col justify-between" style={{ background: C.surfaceContainerLowest }}>
                <div>
                  <div className="flex items-center justify-between pb-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined notranslate text-[22px]" style={{ color: C.secondary }}>assignment_turned_in</span>
                      <h2 className="text-[16px] font-bold" style={{ color: C.primary }}>Dernières Notes &amp; Évaluations</h2>
                    </div>
                  </div>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left min-w-[500px]">
                      <thead>
                        <tr className="text-[10px] uppercase tracking-wider rounded-lg" style={{ color: C.onSurfaceVariant, background: C.surfaceContainerLow }}>
                          <th className="py-2.5 px-3 rounded-l-lg">Module</th>
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3">Note / 20</th>
                          <th className="py-2.5 px-3 rounded-r-lg">Appréciation</th>
                        </tr>
                      </thead>
                      <tbody className="text-[14px]">
                        {activeChild.recentGrades.length === 0 ? (
                          <tr><td colSpan="4" className="text-center py-6 text-sm text-gray-500">Aucune note pour le moment</td></tr>
                        ) : (
                          activeChild.recentGrades.map((grade, i) => (
                            <tr key={i} className="transition-colors hover:bg-black/5">
                              <td className="py-3 px-3">
                                <div className="text-[12px] font-bold" style={{ color: C.primary }}>{grade.course}</div>
                              </td>
                              <td className="py-3 px-3 text-[10px] whitespace-nowrap" style={{ color: C.onSurfaceVariant }}>{grade.date}</td>
                              <td className="py-3 px-3">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[12px] font-bold" style={{ background: C.surfaceContainerHigh, color: C.primary }}>
                                  {grade.score} / 20
                                </span>
                              </td>
                              <td className="py-3 px-3 text-[12px]" style={{ color: C.onSurfaceVariant }}>
                                {grade.comment || '-'}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="pt-6 mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t" style={{ borderColor: C.surfaceVariant }}>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: C.tertiaryFixedDim }}></span>
                    <span className="text-[10px]" style={{ color: C.onSurfaceVariant }}>Prochain bulletin disponible prochainement</span>
                  </div>
                  <button className="px-4 py-2 rounded-lg font-bold text-[12px] transition-colors flex items-center justify-center gap-1.5 w-full sm:w-auto" style={{ background: C.surfaceContainer, color: C.primary }}>
                    <span className="material-symbols-outlined notranslate text-[18px]">print</span> Relevé semestriel
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
