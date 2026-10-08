import React, { useState, useEffect, useRef, useCallback } from 'react';

import { API_BASE_URL, TOKEN_KEY } from '../services/config';
import { notificationService } from '../services/api';
import { useNavigate } from 'react-router-dom';

import { toast } from 'sonner';

import { useAuth } from '../contexts/AuthContext';

/**
 * Formate un horodatage relatif (« il y a 3 min ») pour la cloche.
 *
 * `dayjs` est déjà une dépendance du projet ; on s'en sert ici plutôt que
 * d'écrire un calcul de durée à la main, et on garde le repli sur la date
 * absolue si la valeur servie par l'API n'est pas exploitable.
 */
function relativeTime(iso) {
  if (!iso) return '';
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return '';

  const seconds = Math.round((Date.now() - then.getTime()) / 1000);
  if (seconds < 0)     return 'à l\'instant';
  if (seconds < 60)    return 'à l\'instant';
  if (seconds < 3600)  return `il y a ${Math.floor(seconds / 60)} min`;
  if (seconds < 86400) return `il y a ${Math.floor(seconds / 3600)} h`;

  return then.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
}

/** Teinte de pastille selon la gravité de la notification. */
const SEVERITY_TONE = {
  SUCCESS: 'bg-emerald-500',
  WARNING: 'bg-amber-500',
  DANGER:  'bg-rose-500',
  INFO:    'bg-[#004ad1]',
};

const Topbar = () => {
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [notifOpen,      setNotifOpen]      = useState(false);
  const [profileOpen,    setProfileOpen]    = useState(false);
  const navigate = useNavigate();
  const { user, fullName, initials, primaryRole, primaryRoleLabel, sidebarStats, logout } = useAuth();

  const searchRef  = useRef(null);
  const notifRef   = useRef(null);
  const profileRef = useRef(null);

  // File de notifications réelle, servie par /api/notifications.
  const [notifications, setNotifications] = useState([]);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const [notifLoading,  setNotifLoading]  = useState(false);
  // `null` = pas encore chargé, `false` = échec. L'interface distingue les deux
  // pour ne pas afficher « aucune notification » alors qu'on n'a rien su.
  const [notifError,    setNotifError]    = useState(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current  && !searchRef.current.contains(e.target))  setSearchExpanded(false);
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadNotifications = useCallback(async () => {
    setNotifLoading(true);
    setNotifError(null);
    try {
      const res = await notificationService.list({ limit: 10 });
      if (res?.success) {
        setNotifications(res.data ?? []);
        setUnreadCount(res.meta?.unreadCount ?? 0);
      }
    } catch {
      // Pas de repli sur une liste fictive : on affiche l'échec.
      setNotifications([]);
      setUnreadCount(0);
      setNotifError(true);
    } finally {
      setNotifLoading(false);
    }
  }, []);

  // Rafraîchissement périodique : une notification d'approbation d'accès ou de
  // paiement reçu doit apparaître sans rechargement de page.
  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    const poll = async () => {
      try {
        const res = await notificationService.getUnreadCount();
        if (!cancelled && res?.success) setUnreadCount(res.data?.count ?? 0);
      } catch {
        // Silencieux : le compteur est un confort, son absence ne doit pas
        // interrompre la navigation.
      }
    };

    poll();
    const interval = setInterval(poll, 30_000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [user]);

  // La liste complète n'est chargée qu'à l'ouverture du panneau : la charger en
  // permanence sur toutes les pages serait inutile.
  useEffect(() => {
    if (notifOpen) loadNotifications();
  }, [notifOpen, loadNotifications]);

  const handleLogout = () => {
    logout();
  };

  // Demandes d'accès en attente — compteur d'arbitrage, distinct de la cloche
  // (qui compte les notifications personnelles). reserved to admins.
  const pendingCount = sidebarStats?.requests?.pending ?? null;

  const openNotification = async (n) => {
    try {
      await notificationService.markAsRead(n.id);
    } catch {
      // Le marquage est un confort ; on ouvre quand même la cible.
    }
    setNotifications(list => list.map(x => (x.id === n.id ? { ...x, isRead: true } : x)));
    setUnreadCount(c => Math.max(0, c - 1));
    setNotifOpen(false);
    if (n.link) navigate(n.link);
  };

  const markAllRead = async () => {
    try {
      const res = await notificationService.markAllAsRead();
      if (res?.success) {
        const updated = res.data?.updated ?? 0;
        setNotifications(list => list.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
        if (updated === 0) toast.info('Toutes les notifications étaient déjà lues.');
        else toast.success(`${updated} notification${updated > 1 ? 's' : ''} marquée${updated > 1 ? 's' : ''} comme lue${updated > 1 ? 's' : ''}.`);
      }
    } catch {
      toast.error('Impossible de marquer les notifications comme lues.');
    }
  };

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
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#ba1a1a] text-white text-[9px] font-extrabold ring-2 ring-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-xl border border-[#dfe3e7] p-3 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#dfe3e7]">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined notranslate text-[18px] text-[#004ad1]">notifications_active</span>
                  <span className="font-extrabold text-xs text-[#001026]">Notifications</span>
                </div>
                {unreadCount > 0 && (
                  <button
                    className="text-[10px] font-bold text-[#004ad1] hover:underline"
                    onClick={markAllRead}
                  >
                    Tout marquer comme lu
                  </button>
                )}
              </div>

              <div className="space-y-1.5 max-h-96 overflow-y-auto">
                {notifLoading && notifications.length === 0 && (
                  <p className="text-[11px] text-[#74777f] py-4 text-center">Chargement...</p>
                )}

                {/* Échec de l'API : on le dit, on n'invente pas une file vide qui
                    laisserait croire qu'il n'y a rien à signaler. */}
                {notifError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="material-symbols-outlined notranslate text-[14px] text-rose-600">error</span>
                      <span className="font-bold text-[11px] text-rose-800">Notifications indisponibles</span>
                    </div>
                    <p className="text-[11px] text-rose-700">Le service n'a pas répondu. Réessayez dans un instant.</p>
                  </div>
                )}

                {!notifLoading && !notifError && notifications.length === 0 && (
                  <p className="text-[11px] text-[#74777f] py-6 text-center">Aucune notification.</p>
                )}

                {notifications.map(n => (
                  <button
                    key={n.id}
                    onClick={() => openNotification(n)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-colors ${
                      n.isRead
                        ? 'bg-white border-[#e8ecf1] hover:bg-[#f7f9fc]'
                        : 'bg-[#f0f5ff] border-[#c7d9f7] hover:bg-[#e4edfd]'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${SEVERITY_TONE[n.severity] ?? 'bg-[#004ad1]'}`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="font-bold text-xs text-[#001026] truncate">{n.title}</span>
                          <span className="text-[9px] text-[#9aa3b5] flex-shrink-0">{relativeTime(n.createdAt)}</span>
                        </div>
                        <p className="text-[11px] text-[#44474e] mt-0.5 break-words">{n.body}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Compteur d'arbitrage réservé aux administrateurs : ce n'est pas
                  une notification, c'est une file d'attente à traiter. */}
              {pendingCount !== null && pendingCount > 0 && (
                <button
                  onClick={() => { navigate('/superadmin/requests'); setNotifOpen(false); }}
                  className="w-full mt-2 pt-2 border-t border-[#dfe3e7] flex items-center gap-1.5 text-left"
                >
                  <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse" />
                  <span className="text-[11px] font-bold text-amber-900">
                    {pendingCount} demande{pendingCount > 1 ? 's' : ''} d'accès à arbitrer
                  </span>
                </button>
              )}
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
