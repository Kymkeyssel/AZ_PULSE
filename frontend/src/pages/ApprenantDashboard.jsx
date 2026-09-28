import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// ── Design tokens (identiques au HTML de référence) ──────────────────────────
const C = {
  primary:           '#001026',
  primaryContainer:  '#0b2545',
  secondary:         '#004ad1',
  secondaryContainer:'#1a62fe',
  onPrimary:         '#ffffff',
  onPrimaryContainer:'#778db2',
  primaryFixed:      '#d5e3ff',
  primaryFixedDim:   '#b1c7f0',
  surface:           '#f6fafe',
  surfaceContainer:  '#eaeef2',
  surfaceContainerLow:   '#f0f4f8',
  surfaceContainerLowest:'#ffffff',
  surfaceContainerHigh:  '#e5e9ed',
  surfaceContainerHighest:'#dfe3e7',
  onSurface:         '#181c1f',
  onSurfaceVariant:  '#44474e',
  outline:           '#74777f',
  outlineVariant:    '#c4c6cf',
  tertFixed:         '#ffdea8',
  tertFixedDim:      '#ffba20',
  onTertFixed:       '#271900',
  tertContainer:     '#332200',
  onTertContainer:   '#b78300',
  error:             '#ba1a1a',
  errorContainer:    '#ffdad6',
  onErrorContainer:  '#93000a',
};

// ── Nav items apprenant ────────────────────────────────────────────────────
const NAV_ITEMS = [
  { path: '/apprenant', label: 'Dashboard Apprenant', icon: 'school', end: true },
  { path: '/apprenant/formations', label: 'Mes formations', icon: 'auto_stories' },
  { path: '/apprenant/planning', label: 'Mon planning', icon: 'today' },
  { path: '/apprenant/evaluations', label: 'Mes évaluations & Notes', icon: 'assignment_turned_in' },
  { path: '/apprenant/paiements', label: 'Mes paiements', icon: 'payments' },
  { path: '/apprenant/documents', label: 'Documents de cours', icon: 'folder_shared' },
];

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────
const ApprenantSidebar = () => {
  const { fullName } = useAuth();
  const navigate = useNavigate();

  return (
    <aside
      style={{ background: C.surfaceContainerLow, boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}
      className="fixed left-0 top-0 h-screen w-72 z-50 flex flex-col justify-between overflow-y-auto">

      <div className="flex flex-col">
        {/* Brand */}
        <div className="h-16 px-4 flex items-center gap-3">
          <img alt="AZ PULSE" className="h-8 w-auto object-contain" src="/AZ PULSE_logo.png" />
          <div className="flex flex-col">
            <span style={{ color: C.primary }} className="text-base font-bold leading-tight tracking-tight">AZ PULSE</span>
            <span style={{ color: C.onSurfaceVariant }} className="text-[10px] uppercase tracking-wider">Formation &amp; Académie</span>
          </div>
        </div>

        {/* Company switcher */}
        <div className="px-4 py-1">
          <div style={{ background: C.surfaceContainer }} className="rounded-xl p-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div style={{ background: C.tertFixedDim }} className="w-2 h-2 rounded-full shrink-0" />
              <div className="flex flex-col truncate">
                <span style={{ color: C.onSurfaceVariant }} className="text-[10px] uppercase tracking-wider truncate">PORTAIL ACADÉMIQUE</span>
                <span style={{ color: C.primary }} className="text-xs font-bold truncate">AZ Corporation SARL</span>
              </div>
            </div>
            <button style={{ color: C.onSurfaceVariant }} className="p-1 rounded-lg hover:opacity-70 transition-opacity" type="button">
              <span className="material-symbols-outlined notranslate text-[18px]">unfold_more</span>
            </button>
          </div>
        </div>

        {/* Section label */}
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <span style={{ color: C.onSurfaceVariant }} className="text-[10px] uppercase tracking-wider font-bold">Espace Étudiant</span>
          <span style={{ color: C.secondary }} className="text-xs font-semibold">Apprenant</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 px-4 pb-6">
          {NAV_ITEMS.map(({ path, label, icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'font-bold shadow-sm'
                    : 'hover:opacity-80 transition-opacity'
                }`
              }
              style={({ isActive }) => isActive
                ? { background: C.primaryContainer, color: C.onPrimary }
                : { color: C.onSurfaceVariant }
              }
            >
              <span className="material-symbols-outlined notranslate text-[20px]">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer profil */}
      <div className="p-4" style={{ background: C.surfaceContainerLow }}>
        <div style={{ background: C.surfaceContainer }} className="p-2 rounded-xl flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div style={{ background: C.primary }} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
              <span style={{ color: C.onPrimary }} className="material-symbols-outlined notranslate text-[18px]">person</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span style={{ color: C.primary }} className="text-xs font-bold truncate">{fullName ?? 'Apprenant'}</span>
              <span style={{ color: C.onSurfaceVariant }} className="text-[10px] truncate">Apprenant · AZ Académie</span>
            </div>
          </div>
          <button style={{ color: C.onSurfaceVariant }} className="p-1 rounded-lg hover:opacity-70 transition-opacity shrink-0" title="Paramètres">
            <span className="material-symbols-outlined notranslate text-[20px]">settings</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TOPBAR
// ─────────────────────────────────────────────────────────────────────────────
const ApprenantTopbar = () => {
  const { fullName } = useAuth();
  const navigate = useNavigate();

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
            className="w-full h-10 pl-10 pr-12 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 shadow-sm"
            placeholder="Rechercher formations, cours, notes, apprenants..."
            type="text"
          />
          <div style={{ background: C.surfaceContainer, color: C.onSurfaceVariant }}
               className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[10px] font-mono tracking-widest">⌘K</div>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-4">
        {/* Pôle badge */}
        <div style={{ background: C.primaryContainer, color: C.onPrimary }}
             className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full shadow-sm">
          <span style={{ background: C.tertFixedDim }} className="w-2 h-2 rounded-full" />
          <span className="text-xs font-semibold tracking-wide">Pôle Académie &amp; Institut</span>
        </div>

        {/* Help */}
        <button style={{ color: C.onSurfaceVariant }} className="p-2 rounded-lg hover:opacity-70 transition-opacity" title="Centre d'aide" type="button">
          <span className="material-symbols-outlined notranslate text-[22px]">help</span>
        </button>

        {/* Notifications */}
        <button style={{ color: C.onSurfaceVariant }} className="relative p-2 rounded-lg hover:opacity-70 transition-opacity" title="Notifications" type="button">
          <span className="material-symbols-outlined notranslate text-[22px]">notifications</span>
          <span style={{ background: C.tertFixedDim, border: `2px solid ${C.surface}` }}
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" />
        </button>

        <div style={{ background: C.outlineVariant }} className="h-6 w-px" />

        {/* User */}
        <div className="flex items-center gap-2">
          <div style={{ background: C.primary }} className="w-8 h-8 rounded-full flex items-center justify-center">
            <span style={{ color: C.onPrimary }} className="material-symbols-outlined notranslate text-[18px]">person</span>
          </div>
          <div className="hidden sm:flex flex-col">
            <span style={{ color: C.primary }} className="text-xs font-bold leading-tight">{fullName ?? 'Apprenant'}</span>
            <span style={{ color: C.onSurfaceVariant }} className="text-[10px] leading-tight">Apprenant / Étudiant</span>
          </div>
        </div>

        {/* Logout */}
        <button
          style={{ color: C.error }}
          className="p-2 rounded-lg hover:opacity-70 transition-opacity" title="Déconnexion" type="button"
          onClick={() => { localStorage.removeItem('az_pulse_token'); navigate('/'); }}>
          <span className="material-symbols-outlined notranslate text-[22px]">logout</span>
        </button>
      </div>
    </header>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE PRINCIPALE
// ─────────────────────────────────────────────────────────────────────────────
const ApprenantDashboard = () => {
  const [fileName, setFileName] = useState(null);
  const fileRef = useRef(null);
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { fullName } = useAuth();

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem('az_pulse_token');
      if (!token) { setLoading(false); return; }
      try {
        const res = await fetch('http://localhost:8000/api/dashboard/apprenant', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Erreur chargement dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ background: C.surface, fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="min-h-screen flex items-center justify-center">
        <div style={{ color: C.primary }} className="text-xl font-bold animate-pulse">Chargement de votre espace...</div>
      </div>
    );
  }

  return (
    <div style={{ background: C.surface, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <ApprenantSidebar />
      <ApprenantTopbar />

      {/* Content area */}
      <div className="pl-72">
        <main style={{ background: C.surface }} className="relative pt-16 min-h-screen w-full px-6">
          <div className="flex flex-col w-full pb-10">

            {/* ── Hero Banner ─────────────────────────────────────────────── */}
            <div style={{ background: `linear-gradient(to right, ${C.primary}, ${C.primaryContainer}, #1a3a5c)` }}
                 className="relative overflow-hidden rounded-xl p-6 text-white shadow-xl mt-6">
              {/* Blur blobs */}
              <div style={{ background: `${C.secondary}4d` }} className="absolute -right-16 -top-16 w-80 h-80 rounded-full blur-3xl pointer-events-none" />
              <div style={{ background: `${C.tertFixedDim}33` }} className="absolute right-1/4 -bottom-20 w-64 h-64 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Left text */}
                <div className="flex flex-col gap-2 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold"
                          style={{ background: 'rgba(255,255,255,0.1)', color: C.tertFixedDim }}>
                      <span style={{ background: C.tertFixedDim }} className="w-2 h-2 rounded-full animate-pulse" />
                      Apprenant actif
                    </span>
                    <span style={{ color: C.onPrimaryContainer }} className="text-sm">• Certificat d'aptitude professionnelle en cours (MINEFOP)</span>
                  </div>
                  <h1 style={{ color: C.onPrimary }} className="text-3xl font-extrabold tracking-tight mt-1">
                    Bonjour, {fullName ? fullName.split(' ')[0] : 'Apprenant'}
                  </h1>
                  <p style={{ color: C.primaryFixedDim }} className="text-base font-medium">
                    {data?.program?.promotionName || "Promotion MINEFOP 2025"}
                  </p>
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap lg:flex-nowrap gap-2 shrink-0">
                  {[
                    { label: 'Classe Virtuelle', icon: 'videocam', gold: true },
                    { label: 'Déposer un TP', icon: 'upload_file' },
                    { label: 'Bordereau', icon: 'receipt_long' },
                    { label: 'Relevé', icon: 'history_edu' },
                  ].map(({ label, icon, gold }) => (
                    <button
                      key={label}
                      style={gold
                        ? { background: C.tertFixedDim, color: C.primary }
                        : { background: 'rgba(255,255,255,0.15)', color: C.onPrimary }
                      }
                      className={`group flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold shadow-md hover:brightness-105 active:scale-95 transition-all ${gold ? 'backdrop-blur-md' : 'backdrop-blur-md hover:bg-white/25'}`}
                      type="button">
                      <span className="material-symbols-outlined notranslate text-[20px] transition-transform group-hover:scale-110">{icon}</span>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Featured Training + Deadline ───────────────────────────── */}
            <div className="mt-4 grid grid-cols-1 xl:grid-cols-12 gap-4">

              {/* Main Training Card */}
              <div style={{ background: C.surfaceContainerLowest }}
                   className="xl:col-span-8 rounded-xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div style={{ background: `${C.secondary}1a`, color: C.secondary }}
                         className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined notranslate text-[32px]">terminal</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span style={{ color: C.secondary }} className="text-[10px] font-bold uppercase tracking-wider">Programme Officiel MINEFOP</span>
                        <span style={{ background: C.surfaceContainer, color: C.onSurfaceVariant }}
                              className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold">SEM-02</span>
                      </div>
                      <h2 style={{ color: C.primary }} className="text-xl font-bold mt-1">
                        {data?.program?.programName || "Parcours Grande École Développeur Fullstack & Data / IA"}
                      </h2>
                      <div className="flex items-center gap-2 mt-2" style={{ color: C.onSurfaceVariant }}>
                        <div style={{ background: C.primaryContainer, color: C.onPrimary }}
                             className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold">PT</div>
                        <span style={{ color: C.primary }} className="text-sm font-medium">Dr. Paulin T.</span>
                        <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: C.secondary }}>
                          <span style={{ background: C.secondary }} className="w-2 h-2 rounded-full animate-ping inline-flex" />
                          En ligne • Bureau 104
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <span style={{ color: C.primary }} className="text-4xl font-extrabold tracking-tight">{data?.program?.progress || 0}%</span>
                    <span style={{ color: C.onSurfaceVariant }} className="text-[10px] uppercase tracking-wider font-semibold">Parcours complété</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-6 flex flex-col gap-1">
                  <div className="flex justify-between items-center text-[11px]" style={{ color: C.onSurfaceVariant }}>
                    <span style={{ color: C.primary }} className="font-semibold">{data?.program?.validatedModules || 0} / {data?.program?.totalModules || 0} Modules validés</span>
                    <span>Prochain palier: {data?.program?.nextMilestone || "—"}</span>
                  </div>
                  <div style={{ background: C.surfaceContainer }} className="w-full h-3 rounded-full overflow-hidden relative">
                    <div style={{ width: `${data?.program?.progress || 0}%`, background: `linear-gradient(to right, ${C.secondary}, ${C.secondaryContainer})` }}
                         className="h-full rounded-full" />
                  </div>
                </div>
              </div>

              {/* Deadline Card */}
              <div style={{ background: C.primaryContainer, color: C.onPrimary }}
                   className="xl:col-span-4 rounded-xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div style={{ background: `${C.tertFixedDim}26` }}
                     className="absolute right-0 top-0 w-36 h-36 rounded-full blur-2xl pointer-events-none" />
                <div>
                  <div className="flex items-center justify-between">
                    <span style={{ background: C.tertFixedDim, color: C.primary }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      <span className="material-symbols-outlined notranslate text-[14px]">alarm</span>
                      Échéance Proche
                    </span>
                    <span style={{ color: C.primaryFixedDim }} className="text-[11px]">J-2 Restant</span>
                  </div>
                  <h3 style={{ color: C.onPrimary }} className="text-base font-bold mt-4 leading-snug">
                    TP Noté: « Architecture API REST Symfony &amp; FastAPI »
                  </h3>
                  <p style={{ color: C.primaryFixedDim }} className="text-xs mt-1">
                    Dépôt du dépôt GitHub &amp; bundle d'architecture conteneurisée.
                  </p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)' }}
                     className="mt-4 pt-2 rounded-lg p-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span style={{ color: C.tertFixedDim }} className="material-symbols-outlined notranslate text-[20px]">event</span>
                    <span style={{ color: C.onPrimary }} className="text-sm font-bold">12 Nov • 23h59</span>
                  </div>
                  <button style={{ background: C.surfaceContainerLowest, color: C.primary }}
                          className="px-3 py-1.5 rounded-lg text-[11px] font-bold shadow hover:opacity-80 transition-opacity" type="button">
                    Déposer livrable
                  </button>
                </div>
              </div>
            </div>

            {/* ── KPI Metrics Row ─────────────────────────────────────────── */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                {
                  label: 'Progression', value: `${data?.program?.progress || 0}%`, sub: '+4% ce mois', subColor: C.secondary,
                  icon: 'query_stats', iconColor: C.secondary, bar: data?.program?.progress || 0, barColor: C.secondary,
                },
                {
                  label: 'Moyenne', value: '16.2', sub: '/ 20', subColor: C.onSurfaceVariant,
                  extra: 'Mention: Très Bien', icon: 'star', iconColor: C.tertFixedDim,
                },
                {
                  label: 'Évaluations', value: data?.tasks?.length || 0, sub: 'en attente', subColor: C.onSurfaceVariant,
                  extra2: 'Session mi-parcours', extra2Color: C.secondary, icon: 'fact_check', iconColor: C.secondaryContainer,
                },
                {
                  label: 'Scolarité', value: data?.financial?.status || '0/0 Payées', sub: 'tranches', subColor: C.onSurfaceVariant,
                  verified: data?.financial?.paidTranches >= data?.financial?.totalTranches, icon: 'payments', iconColor: C.secondary,
                },
                {
                  label: 'Ressources', value: data?.documents?.length || 0, sub: 'fichiers récents', subColor: C.onSurfaceVariant,
                  extra: '5 ajouts cette semaine', icon: 'folder', iconColor: C.outline,
                  colSpan: true,
                },
              ].map((m, i) => (
                <div key={i}
                     style={{ background: C.surfaceContainerLowest }}
                     className={`rounded-xl p-4 shadow-sm flex flex-col justify-between ${m.colSpan ? 'col-span-2 md:col-span-1' : ''}`}>
                  <div className="flex items-center justify-between" style={{ color: C.onSurfaceVariant }}>
                    <span className="text-[10px] uppercase font-semibold">{m.label}</span>
                    <span style={{ color: m.iconColor }} className="material-symbols-outlined notranslate text-[20px]">{m.icon}</span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span style={{ color: C.primary }} className="text-2xl font-extrabold">{m.value}</span>
                    <span style={{ color: m.subColor }} className="text-[11px] font-bold">{m.sub}</span>
                  </div>
                  {m.bar !== undefined && (
                    <div style={{ background: C.surfaceContainer }} className="mt-2 w-full h-1.5 rounded-full overflow-hidden">
                      <div style={{ width: `${m.bar}%`, background: m.barColor }} className="h-full rounded-full" />
                    </div>
                  )}
                  {m.extra && <span style={{ color: C.onSurfaceVariant }} className="mt-2 text-[11px]">{m.extra}</span>}
                  {m.extra2 && <span style={{ color: m.extra2Color }} className="mt-2 text-[11px] font-medium">{m.extra2}</span>}
                  {m.verified && (
                    <span style={{ color: C.secondary }} className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold">
                      <span className="material-symbols-outlined notranslate text-[14px]">verified</span> Dossier Conforme
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* ── Bento 1 : Emploi du temps + Évaluations ────────────────── */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Left: Schedule */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div style={{ background: C.secondary }} className="w-2.5 h-6 rounded-full" />
                    <h2 style={{ color: C.primary }} className="text-xl font-bold">Mon Emploi du Temps Personnel &amp; Salles</h2>
                  </div>
                  <span style={{ color: C.onSurfaceVariant }} className="text-xs font-mono">Semaine 46 • Nov 2025</span>
                </div>

                {/* Live class alert */}
                <div style={{ background: `linear-gradient(to right, ${C.primary}, ${C.primaryContainer})`, color: C.onPrimary }}
                     className="relative rounded-xl p-4 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div style={{ background: 'rgba(255,255,255,0.15)', color: C.tertFixedDim }}
                           className="w-12 h-12 rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined notranslate text-[28px]">sensors</span>
                      </div>
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span style={{ background: C.tertFixedDim }}
                              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" />
                        <span style={{ background: C.tertFixedDim }} className="relative inline-flex rounded-full h-3 w-3" />
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span style={{ background: C.tertFixedDim, color: C.primary }}
                              className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                          Aujourd'hui • 09:00 - 13:00
                        </span>
                        <span style={{ color: C.primaryFixedDim }} className="text-[11px]">Salle Lab 3</span>
                      </div>
                      <h3 style={{ color: C.onPrimary }} className="text-base font-bold mt-1">TP Datacenter, Micro-services &amp; Docker</h3>
                      <p style={{ color: C.onPrimaryContainer }} className="text-xs">Intervenant: M. Alain Nguekam • Hybride (Lab 3 + Google Meet AZ)</p>
                    </div>
                  </div>
                  <button style={{ background: C.secondaryContainer, color: C.onPrimary }}
                          className="w-full sm:w-auto px-4 py-2 rounded-lg hover:opacity-80 text-sm font-bold flex items-center justify-center gap-2 shadow transition-all active:scale-95 shrink-0"
                          type="button">
                    <span className="material-symbols-outlined notranslate text-[18px]">launch</span>
                    Rejoindre le salon virtuel
                  </button>
                </div>

                {/* Sessions list */}
                <div style={{ background: C.surfaceContainerLowest }} className="rounded-xl p-4 shadow-sm flex flex-col gap-3">
                  <div className="flex items-center justify-between pb-2">
                    <span style={{ color: C.primary }} className="text-sm font-bold">Prochaines Séances</span>
                    <span style={{ color: C.secondary }} className="text-[11px] font-semibold">Planning synchronisé Google Agenda</span>
                  </div>

                  {data?.schedule?.map((s, i) => {
                    const date = new Date(s.startTime);
                    const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' });
                    const dayNum = date.getDate();
                    const startTimeStr = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                    
                    return (
                    <div key={i} style={{ background: C.surfaceContainerLow }}
                         className="flex items-center justify-between p-3 rounded-lg hover:opacity-80 transition-opacity">
                      <div className="flex items-center gap-3 min-w-0">
                        <div style={{ background: C.surfaceContainer }}
                             className="px-2.5 py-1.5 rounded-lg font-mono text-center shrink-0">
                          <span style={{ color: C.onSurfaceVariant }} className="block text-[10px] uppercase">{dayName}</span>
                          <span style={{ color: C.primary }} className="block text-base font-bold">{dayNum}</span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span style={{ color: C.primary }} className="text-sm font-bold truncate">{s.course}</span>
                          <span style={{ color: C.onSurfaceVariant }} className="text-xs flex items-center gap-2">
                            <span>{startTimeStr} - {s.endTime}</span> • <span>{s.room}</span> • <span>{s.teacher}</span>
                          </span>
                        </div>
                      </div>
                      <span style={{ background: C.surfaceContainer, color: C.onSurfaceVariant }}
                            className="px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0">Planifié</span>
                    </div>
                  )})}
                </div>
              </div>

              {/* Right: Evaluations */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div style={{ background: C.tertFixedDim }} className="w-2.5 h-6 rounded-full" />
                    <h2 style={{ color: C.primary }} className="text-xl font-bold">Évaluations &amp; Livrables</h2>
                  </div>
                  <a style={{ color: C.secondary }} className="text-sm font-semibold hover:underline" href="#">Voir tout</a>
                </div>

                {/* Devoirs */}
                <div style={{ background: C.surfaceContainerLowest }} className="rounded-xl p-4 shadow-sm flex flex-col gap-3">
                  <span style={{ color: C.onSurfaceVariant }} className="text-[10px] uppercase font-bold tracking-wider">Devoirs en attente de dépôt</span>

                  {data?.tasks?.map((task, i) => (
                  <div key={i} style={{ background: C.surfaceContainerLow }} className="p-3 rounded-xl flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col">
                        <span style={{ color: C.primary }} className="text-sm font-bold">{task.title}</span>
                        <span style={{ color: C.onSurfaceVariant }} className="text-xs">Format requis: {task.formatRequired}</span>
                      </div>
                      <span style={{ background: C.errorContainer, color: C.onErrorContainer }}
                            className="px-2 py-0.5 rounded text-[11px] font-bold shrink-0">{task.dueDate ? new Date(task.dueDate).toLocaleDateString('fr-FR') : 'À venir'}</span>
                    </div>
                    <div style={{ borderTop: `1px solid ${C.surfaceContainer}` }} className="pt-2 flex items-center justify-between gap-2">
                      <span style={{ color: C.outline }} className="text-[11px] font-mono">Poids Coeff: {task.coefficient}</span>
                      <button style={{ background: C.primary, color: C.onPrimary }}
                              className="px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 shadow-sm hover:opacity-80 transition-opacity"
                              type="button">
                        <span className="material-symbols-outlined notranslate text-[16px]">upload_file</span>
                        Déposer
                      </button>
                    </div>
                  </div>
                  ))}
                </div>

                {/* Notes reçues */}
                <div style={{ background: C.surfaceContainerLowest }} className="rounded-xl p-4 shadow-sm flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span style={{ color: C.onSurfaceVariant }} className="text-[10px] uppercase font-bold tracking-wider">Dernières Notes Reçues</span>
                    <span style={{ color: C.outline }} className="text-[11px]">Consultation certifiée</span>
                  </div>
                  {data?.grades?.map((n, i) => (
                    <div key={i} style={{ background: C.surfaceContainerLow }}
                         className="flex items-center justify-between p-2 rounded-lg">
                      <div className="flex flex-col">
                        <span style={{ color: C.primary }} className="text-sm font-bold">{n.course}</span>
                        <span style={{ color: C.onSurfaceVariant }} className="text-xs">Formateur: {n.teacher} • {n.date}</span>
                        <span style={{ color: C.secondary }} className="text-[11px] italic mt-0.5">« {n.comment} »</span>
                      </div>
                      <div className="text-right shrink-0 pl-2">
                        <span style={{ color: C.secondary }} className="text-base font-bold">{n.score}</span>
                        <span style={{ color: C.onSurfaceVariant }} className="block text-[11px]">/ 20</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Bento 2 : Financier + Documents ────────────────────────── */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Financial */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div style={{ background: C.secondaryContainer }} className="w-2.5 h-6 rounded-full" />
                    <h2 style={{ color: C.primary }} className="text-xl font-bold">Gestion Financière &amp; Justificatifs</h2>
                  </div>
                  <span style={{ background: C.surfaceContainer, color: C.onSurfaceVariant }}
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold">Espace Dépositaire</span>
                </div>

                <div style={{ background: C.surfaceContainerLowest }} className="rounded-xl p-6 shadow-sm flex flex-col gap-4">
                  {/* Status banner */}
                  <div style={{ background: C.surfaceContainerLow }}
                       className="p-3 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div style={{ background: `${C.secondary}26`, color: C.secondary }}
                           className="w-10 h-10 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined notranslate text-[24px]">verified_user</span>
                      </div>
                      <div className="flex flex-col">
                        <span style={{ color: C.primary }} className="text-sm font-bold">Scolarité Annuelle: {data?.financial?.status || '0/0 Payées'}</span>
                        <span style={{ color: C.onSurfaceVariant }} className="text-xs">Dernière échéance: 15 Janvier 2026</span>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <span style={{ color: C.primary }} className="text-base font-extrabold">{data?.financial?.remainingBalance?.toLocaleString('fr-FR') || 0} FCFA</span>
                      <span style={{ color: C.onSurfaceVariant }} className="block text-[11px]">solde restant</span>
                    </div>
                  </div>

                  {/* Upload zone */}
                  <div className="flex flex-col gap-2">
                    <span style={{ color: C.primary }} className="text-sm font-bold">Téléverser un nouveau bordereau de paiement</span>
                    <p style={{ color: C.onSurfaceVariant }} className="text-xs">
                      Déposez le reçu bancaire ou virement. L'intelligence AZ Pulse vérifie automatiquement la référence et transmet à la comptabilité pour validation finale.
                    </p>
                    <div
                      style={{ background: fileName ? `${C.secondary}1a` : C.surfaceContainerLow }}
                      className="mt-2 flex flex-col items-center justify-center p-6 rounded-xl hover:opacity-80 transition-opacity cursor-pointer text-center"
                      onClick={() => fileRef.current?.click()}>
                      <div style={{ background: C.surfaceContainerLowest, color: C.secondary }}
                           className="w-12 h-12 rounded-full shadow-sm flex items-center justify-center mb-2">
                        <span className="material-symbols-outlined notranslate text-[28px]">cloud_upload</span>
                      </div>
                      <span style={{ color: C.primary }} className="text-sm font-bold">
                        {fileName ? `Fichier sélectionné : ${fileName}` : 'Glissez votre reçu ici ou cliquez pour parcourir'}
                      </span>
                      <span style={{ color: C.outline }} className="text-xs mt-0.5">Formats acceptés: PNG, JPG, PDF (Max 10 Mo)</span>
                      <input
                        ref={fileRef}
                        accept=".png,.jpg,.jpeg,.pdf"
                        className="hidden"
                        type="file"
                        onChange={(e) => e.target.files[0] && setFileName(e.target.files[0].name)}
                      />
                    </div>
                  </div>

                  {/* Receipt history */}
                  <div className="flex flex-col gap-2">
                    <span style={{ color: C.onSurfaceVariant }} className="text-[10px] uppercase font-bold tracking-wider">Historique de mes reçus émis</span>
                    {[
                      { label: 'Reçu Tranche #3 • 250 000 FCFA', ref: 'AZP-2025-0988' },
                      { label: 'Reçu Tranche #2 • 250 000 FCFA', ref: 'AZP-2025-0451' },
                    ].map((r, i) => (
                      <div key={i} style={{ background: C.surfaceContainerLow }}
                           className="p-3 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <span style={{ color: C.secondary }} className="material-symbols-outlined notranslate text-[20px] shrink-0">receipt</span>
                          <div className="flex flex-col min-w-0">
                            <span style={{ color: C.primary }} className="text-sm font-bold truncate">{r.label}</span>
                            <span style={{ color: C.onSurfaceVariant }} className="text-xs font-mono">Réf: {r.ref} • Validé par Direction</span>
                          </div>
                        </div>
                        <button style={{ color: C.secondary }} className="p-2 rounded-lg hover:opacity-70 transition-opacity shrink-0" type="button">
                          <span className="material-symbols-outlined notranslate text-[20px]">download</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Course Documents */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div style={{ background: C.primary }} className="w-2.5 h-6 rounded-full" />
                    <h2 style={{ color: C.primary }} className="text-xl font-bold">Documents de Cours &amp; Supports</h2>
                  </div>
                  <div className="relative w-40">
                    <input style={{ background: C.surfaceContainerLowest, color: C.onSurface }}
                           className="w-full h-8 pl-7 pr-2 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none"
                           placeholder="Filtrer..." type="text" />
                    <span style={{ color: C.outline }} className="material-symbols-outlined notranslate absolute left-1.5 top-1/2 -translate-y-1/2 text-[16px]">search</span>
                  </div>
                </div>

                <div style={{ background: C.surfaceContainerLowest }} className="rounded-xl p-6 shadow-sm flex flex-col gap-3 flex-1 justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between pb-1">
                      <span style={{ color: C.onSurfaceVariant }} className="text-[10px] uppercase font-bold tracking-wider">Supports déposés récemment par l'équipe</span>
                      <span style={{ color: C.secondary }} className="text-[11px] font-medium">42 Fichiers actifs</span>
                    </div>

                    {data?.documents?.map((doc, i) => (
                      <div key={i} style={{ background: C.surfaceContainerLow }}
                           className="p-3 rounded-lg hover:opacity-80 transition-opacity flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <div style={{ background: doc.type === 'pdf' ? C.errorContainer : C.primaryContainer, color: doc.type === 'pdf' ? C.onErrorContainer : C.onPrimary }}
                               className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined notranslate text-[22px]">
                              {doc.type === 'pdf' ? 'picture_as_pdf' : doc.type === 'zip' ? 'folder_zip' : 'description'}
                            </span>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span style={{ color: C.primary }} className="text-sm font-bold truncate">{doc.title}</span>
                            <span style={{ color: C.onSurfaceVariant }} className="text-xs">Ajouté par {doc.uploadedBy} • {doc.size}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button style={{ color: C.secondary }} className="p-2 rounded-lg hover:opacity-70 transition-opacity" type="button" title="Télécharger">
                            <span className="material-symbols-outlined notranslate text-[18px]">download</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: `1px solid ${C.surfaceContainer}` }}
                       className="pt-3 flex items-center justify-between">
                    <span style={{ color: C.onSurfaceVariant }} className="text-[11px]">Synchronisé avec le serveur local Campus AZ</span>
                    <button style={{ background: C.surfaceContainer, color: C.primary }}
                            className="px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 hover:opacity-80 transition-opacity"
                            type="button">
                      <span className="material-symbols-outlined notranslate text-[16px]">folder_zip</span>
                      Tout télécharger (.zip)
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default ApprenantDashboard;
