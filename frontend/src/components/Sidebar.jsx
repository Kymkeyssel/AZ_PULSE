import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const [adminOpen, setAdminOpen] = useState(false);
  const { fullName, initials, primaryRole, sidebarStats } = useAuth();
  const navigate = useNavigate();

  // Chiffres réels depuis la BD
  const pendingReqs  = sidebarStats?.requests?.pending  ?? null;
  const totalUsers   = sidebarStats?.totalUsers         ?? null;
  const activeUsers  = sidebarStats?.activeUsers        ?? null;

  return (
    <aside className="fixed left-2 top-2 bottom-2 h-[calc(100vh-1rem)] w-64 bg-[#0b2545] text-white z-50 flex flex-col shadow-xl rounded-2xl border border-[#001026]/40 select-none overflow-hidden">

      {/* ── Brand Header ─────────────────────────────────────────────── */}
      <div className="h-16 px-4 flex items-center justify-between bg-[#001026]/70 border-b border-white/10">
        <NavLink className="flex items-center gap-2.5" to="/superadmin">
          <img alt="AZ PULSE" className="h-8 w-auto object-contain brightness-110 drop-shadow" src="/AZ PULSE_logo.png" />
          <div className="flex flex-col">
            <span className="font-extrabold text-sm tracking-tight text-white leading-tight">AZ PULSE</span>
            <span className="text-[9px] uppercase font-bold tracking-widest text-[#fbbf24]">Enterprise OS</span>
          </div>
        </NavLink>
        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-[#004ad1] text-white uppercase tracking-wider">
          {primaryRole?.includes('Super') ? 'Super Admin' : primaryRole ?? '…'}
        </span>
      </div>

      {/* ── Status Pill ──────────────────────────────────────────────── */}
      <div className="px-4 py-2 bg-[#001026]/40 border-b border-white/5 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[#b5c4ff] font-medium">Système actif</span>
        </div>
        <span className="text-[#ffdea8] font-mono font-semibold text-[10px]">v3.9-LIVE</span>
      </div>

      {/* ── Navigation ───────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-2.5 px-3 space-y-0.5 text-xs font-medium">

        {/* 1. Dashboard */}
        <NavLink to="/superadmin" end
          className={({ isActive }) =>
            `flex items-center justify-between px-3 py-2 rounded-lg transition-colors shadow-sm ${isActive ? 'bg-[#004ad1] text-white font-semibold' : 'text-[#b5c4ff] hover:bg-[#001026] hover:text-white'}`
          }>
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined notranslate text-[18px]">grid_view</span>
            <span>Dashboard</span>
          </div>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#004ad1] text-white uppercase">Actif</span>
        </NavLink>

        {/* 2. Administration (avec sous-menu) */}
        <div className="pt-1">
          <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-[#b5c4ff] hover:bg-[#001026] hover:text-white transition-colors"
                  onClick={() => setAdminOpen(!adminOpen)} type="button">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined notranslate text-[18px] text-[#fbbf24]">admin_panel_settings</span>
              <span className="font-medium text-white">Administration</span>
            </div>
            <div className="flex items-center gap-1">
              {/* Badge demandes en attente — réel */}
              {pendingReqs !== null && pendingReqs > 0 && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-slate-950">
                  {pendingReqs > 99 ? '99+' : pendingReqs} req
                </span>
              )}
              <span className="material-symbols-outlined notranslate text-[16px] text-[#778db2] transition-transform duration-200"
                    style={{ transform: adminOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                expand_more
              </span>
            </div>
          </button>

          <div className={`pl-6 pr-1 py-1 space-y-0.5 text-[11px] ${adminOpen ? 'block' : 'hidden'}`}>
            {/* Utilisateurs — chiffre réel */}
            <NavLink to="/superadmin/users"
              className="flex items-center justify-between py-1.5 px-2.5 rounded text-[#b5c4ff] hover:text-white hover:bg-white/5 transition-colors">
              <span>├ Utilisateurs</span>
              <span className="text-[10px] text-white/70">
                {totalUsers !== null ? totalUsers : '…'}
              </span>
            </NavLink>

            {/* Actifs — chiffre réel */}
            <NavLink to="/superadmin/admins"
              className="flex items-center justify-between py-1.5 px-2.5 rounded text-[#b5c4ff] hover:text-white hover:bg-white/5 transition-colors">
              <span>├ Comptes actifs</span>
              <span className="text-[10px] bg-white/10 px-1 rounded text-white">
                {activeUsers !== null ? activeUsers : '…'}
              </span>
            </NavLink>

            {/* Rôles — placeholder */}
            <button className="w-full flex items-center justify-between py-1.5 px-2.5 rounded text-[#b5c4ff] hover:text-white hover:bg-white/5 transition-colors" type="button">
              <span>├ Rôles &amp; permissions</span>
              <span className="text-[10px] bg-white/10 px-1 rounded text-[#b5c4ff] italic">—</span>
            </button>

            {/* Demandes — chiffre réel */}
            <NavLink to="/superadmin/requests"
              className={({ isActive }) =>
                `flex items-center justify-between py-1.5 px-2.5 rounded transition-colors ${isActive ? 'text-[#fbbf24] font-semibold bg-white/5' : 'text-[#b5c4ff] hover:text-[#fbbf24] hover:bg-white/5'}`
              }>
              <span>└ Demandes d'accès</span>
              {pendingReqs !== null && pendingReqs > 0 ? (
                <span className="text-[9px] bg-amber-500 text-slate-950 font-bold px-1.5 rounded-full">
                  {pendingReqs > 99 ? '99+' : pendingReqs}
                </span>
              ) : (
                <span className="text-[10px] text-white/40">0</span>
              )}
            </NavLink>
          </div>
        </div>

        {/* 3. CRM — placeholder */}
        <NavLink to="#crm" className="flex items-center justify-between px-3 py-2 rounded-lg text-[#b5c4ff] hover:bg-[#001026] hover:text-white transition-colors">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined notranslate text-[18px]">contacts</span>
            <span>CRM</span>
          </div>
          <span className="text-[10px] text-white/30 italic">bientôt</span>
        </NavLink>

        {/* 4. Formation — placeholder */}
        <NavLink to="#formation" className="flex items-center justify-between px-3 py-2 rounded-lg text-[#b5c4ff] hover:bg-[#001026] hover:text-white transition-colors">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined notranslate text-[18px]">school</span>
            <span>Formation</span>
          </div>
          <span className="text-[10px] text-white/30 italic">bientôt</span>
        </NavLink>

        {/* 5. Workspace — placeholder */}
        <NavLink to="#workspace" className="flex items-center justify-between px-3 py-2 rounded-lg text-[#b5c4ff] hover:bg-[#001026] hover:text-white transition-colors">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined notranslate text-[18px]">folder_special</span>
            <span>Workspace</span>
          </div>
          <span className="text-[10px] text-white/30 italic">bientôt</span>
        </NavLink>

        {/* 6. Knowledge Hub — placeholder */}
        <NavLink to="#knowledge-hub" className="flex items-center justify-between px-3 py-2 rounded-lg text-[#b5c4ff] hover:bg-[#001026] hover:text-white transition-colors">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined notranslate text-[18px]">menu_book</span>
            <span>Knowledge Hub</span>
          </div>
          <span className="text-[10px] text-white/30 italic">bientôt</span>
        </NavLink>

        {/* 7. Infrastructure & IT — placeholder */}
        <NavLink to="#infra-it" className="flex items-center justify-between px-3 py-2 rounded-lg text-[#b5c4ff] hover:bg-[#001026] hover:text-white transition-colors">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined notranslate text-[18px]">dns</span>
            <span>Infrastructure &amp; IT</span>
          </div>
          <span className="text-[10px] text-white/30 italic">bientôt</span>
        </NavLink>

        {/* 8. Analytics — placeholder */}
        <NavLink to="#analytics" className="flex items-center justify-between px-3 py-2 rounded-lg text-[#b5c4ff] hover:bg-[#001026] hover:text-white transition-colors">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined notranslate text-[18px]">insights</span>
            <span>Analytics</span>
          </div>
          <span className="text-[10px] text-white/30 italic">bientôt</span>
        </NavLink>

        {/* 9. AI Workspace — placeholder */}
        <NavLink to="#ai-workspace" className="flex items-center justify-between px-3 py-2 rounded-lg text-[#b5c4ff] hover:bg-[#001026] hover:text-white transition-colors">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined notranslate text-[18px] text-[#fbbf24]">psychology</span>
            <span>AI Workspace</span>
          </div>
          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-[#fbbf24]/20 text-[#fbbf24] italic">bientôt</span>
        </NavLink>

        {/* 10. Paramètres */}
        <NavLink to="#parametres" className="flex items-center justify-between px-3 py-2 rounded-lg text-[#b5c4ff] hover:bg-[#001026] hover:text-white transition-colors">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined notranslate text-[18px]">settings</span>
            <span>Paramètres</span>
          </div>
        </NavLink>
      </nav>

      {/* ── Sidebar Footer : Profil utilisateur réel ─────────────────── */}
      <div className="p-3 bg-[#001026]/80 border-t border-white/10">
        {/* Profil compact */}
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#004ad1] to-[#001026] text-white flex items-center justify-center font-extrabold text-xs ring-1 ring-[#fbbf24]/40 flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-bold text-white truncate">{fullName ?? 'Chargement…'}</div>
            <div className="text-[10px] text-[#fbbf24] truncate">{primaryRole}</div>
          </div>
          <button className="text-[#b5c4ff] hover:text-[#ba1a1a] transition-colors flex-shrink-0"
                  title="Déconnexion"
                  onClick={() => { localStorage.removeItem('az_pulse_token'); navigate('/'); }}>
            <span className="material-symbols-outlined notranslate text-[16px]">logout</span>
          </button>
        </div>

        {/* Status système */}
        <div className="flex items-center justify-between text-[10px] text-[#b5c4ff]">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined notranslate text-[13px] text-emerald-400">lock</span>
            <span>TLS 1.3 — Chiffré</span>
          </div>
          <span className="font-mono font-bold text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> 99.98%
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
