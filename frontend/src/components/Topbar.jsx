import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

const Topbar = () => {
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [notifOpen,      setNotifOpen]      = useState(false);
  const [profileOpen,    setProfileOpen]    = useState(false);
  const navigate = useNavigate();
  const { user, fullName, initials, primaryRole, primaryRoleLabel, sidebarStats } = useAuth();

  const searchRef  = useRef(null);
  const notifRef   = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current  && !searchRef.current.contains(e.target))  setSearchExpanded(false);
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('az_pulse_token');
    navigate('/');
  };

  // Nombre de demandes en attente (réel)
  const pendingCount = sidebarStats?.requests?.pending ?? null;

  return (
    <header className="fixed top-2 left-[17rem] right-4 h-16 bg-white/95 backdrop-blur-md z-40 px-6 flex items-center justify-between rounded-2xl border border-[#dfe3e7] shadow-sm">
      {/* Left: Titre */}
      <div className="flex flex-col justify-center">
        <h1 className="font-extrabold text-base text-[#001026] leading-none">Dashboard</h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 ml-auto">

        {/* Indicateur système — placeholder bientôt disponible */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#f0f4f8] border border-[#dfe3e7] text-xs">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#004ad1] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#004ad1]" />
          </span>
          <span className="text-[#44474e] font-medium">Système opérationnel</span>
          <span className="text-[#dfe3e7]">•</span>
          <span className="text-[#9aa3b5] italic text-[10px]">agents IA — bientôt</span>
        </div>

        {/* Barre de recherche */}
        <div ref={searchRef} className="relative flex items-center justify-end">
          <div className={`hidden md:flex items-center transition-all duration-300 ease-in-out overflow-hidden rounded-xl bg-[#f0f4f8] border border-[#dfe3e7] ${searchExpanded ? 'w-72 bg-white ring-2 ring-[#004ad1]/20 border-[#004ad1]' : 'w-9'}`}>
            <button type="button" className="w-9 h-9 flex-shrink-0 flex items-center justify-center text-[#74777f] hover:text-[#004ad1] transition-colors focus:outline-none" onClick={() => setSearchExpanded(true)}>
              <span className="material-symbols-outlined notranslate text-[19px]">search</span>
            </button>
            <input className="w-full pr-8 py-1.5 bg-transparent text-[#181c1f] text-xs placeholder-[#74777f] focus:outline-none" placeholder="Rechercher utilisateur, projet..." type="text" />
            {searchExpanded && (
              <button type="button" className="px-2 text-[#74777f] hover:text-[#ba1a1a] transition-colors absolute right-0" onClick={(e) => { e.stopPropagation(); setSearchExpanded(false); }}>
                <span className="material-symbols-outlined notranslate text-[15px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Cloche notifications */}
        <div ref={notifRef} className="relative">
          <button className="relative w-9 h-9 rounded-xl bg-[#f0f4f8] hover:bg-[#dfe3e7] text-[#001026] flex items-center justify-center transition-colors border border-[#dfe3e7] active:scale-95"
                  onClick={() => setNotifOpen(!notifOpen)} type="button" title="Notifications">
            <span className="material-symbols-outlined notranslate text-[20px] text-[#44474e]">notifications</span>
            {pendingCount !== null && pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#ba1a1a] text-white text-[9px] font-extrabold ring-2 ring-white">
                {pendingCount > 99 ? '99+' : pendingCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#dfe3e7] p-3 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#dfe3e7]">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined notranslate text-[18px] text-[#004ad1]">notifications_active</span>
                  <span className="font-extrabold text-xs text-[#001026]">Notifications</span>
                </div>
                {pendingCount !== null && pendingCount > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    {pendingCount} en attente
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {/* Demandes en attente (réel) */}
                {pendingCount !== null && pendingCount > 0 && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/70 hover:bg-amber-100 transition-colors cursor-pointer"
                       onClick={() => { navigate('/superadmin/requests'); setNotifOpen(false); }}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse" />
                        <span className="font-bold text-xs text-amber-900">{pendingCount} Demande{pendingCount > 1 ? 's' : ''} d'accès</span>
                      </div>
                      <span className="text-[9px] font-bold text-amber-800 bg-amber-200 px-1.5 py-0.5 rounded-full">En attente</span>
                    </div>
                    <p className="text-[11px] text-[#44474e]">Arbitrage requis — cliquez pour examiner.</p>
                  </div>
                )}

                {/* Alertes système — placeholder */}
                <div className="p-2.5 rounded-xl bg-[#f0f4f8] border border-[#dde3ef]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="material-symbols-outlined notranslate text-[14px] text-[#9aa3b5]">smart_toy</span>
                    <span className="font-bold text-xs text-[#44474e]">Alertes IA Copilot</span>
                  </div>
                  <p className="text-[11px] text-[#9aa3b5] italic">Bientôt disponible</p>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-[#dfe3e7] flex items-center justify-between text-[11px]">
                <span className="text-[#74777f]">Mis à jour en temps réel</span>
                <button className="text-[#004ad1] font-bold hover:underline" onClick={() => setNotifOpen(false)}>Fermer</button>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-[#dfe3e7]" />

        {/* Profil utilisateur (données réelles) */}
        <div ref={profileRef} className="relative">
          <button className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-[#f0f4f8] transition-colors text-left"
                  onClick={() => setProfileOpen(!profileOpen)} type="button">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#001026] to-[#0b2545] text-white flex items-center justify-center font-extrabold text-xs shadow-sm ring-2 ring-[#fbbf24]/50">
              {initials}
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="font-extrabold text-xs text-[#001026]">
                {fullName ?? 'Chargement...'}
              </div>
              <div className="text-[10px] text-[#004ad1] font-bold flex items-center gap-0.5">
                {primaryRoleLabel}
                <span className="material-symbols-outlined notranslate text-[14px] text-[#74777f]">expand_more</span>
              </div>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#dfe3e7] py-2 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="px-4 py-2 border-b border-[#dfe3e7]">
                <div className="font-extrabold text-xs text-[#001026]">{fullName ?? '—'}</div>
                <div className="text-[11px] text-[#44474e]">{user?.email ?? '—'}</div>
                <span className="mt-1 inline-block text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#004ad1] text-white">
                  {primaryRoleLabel}
                </span>
              </div>
              <div className="py-1 text-xs">
                <button className="w-full flex items-center gap-2.5 px-4 py-2 text-[#181c1f] hover:bg-[#f0f4f8] hover:text-[#004ad1]">
                  <span className="material-symbols-outlined notranslate text-[17px] text-[#74777f]">badge</span>
                  Mon Profil
                </button>
                <button className="w-full flex items-center gap-2.5 px-4 py-2 text-[#181c1f] hover:bg-[#f0f4f8] hover:text-[#004ad1]">
                  <span className="material-symbols-outlined notranslate text-[17px] text-[#74777f]">tune</span>
                  Paramètres
                </button>
              </div>
              <div className="border-t border-[#dfe3e7] pt-1">
                <button className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#ba1a1a] hover:bg-red-50 text-left font-semibold" onClick={handleLogout}>
                  <span className="material-symbols-outlined notranslate text-[17px]">logout</span>
                  Se déconnecter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
