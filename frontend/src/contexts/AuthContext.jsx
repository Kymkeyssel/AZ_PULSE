import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

// Rôles admin pouvant accéder à /api/dashboard/admin
const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN'];

export const AuthProvider = ({ children }) => {
  const [user,         setUser]         = useState(null);
  const [sidebarStats, setSidebarStats] = useState(null);
  const [loadingUser,  setLoadingUser]  = useState(true);

  // ── 1. Charger l'utilisateur connecté ──────────────────────────────────
  const fetchMe = useCallback(async () => {
    const token = localStorage.getItem('az_pulse_token');
    if (!token) { setLoadingUser(false); return; }

    try {
      const res = await fetch('http://localhost:8000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setUser(json.user ?? null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  }, []);

  // ── 2. Charger les stats sidebar — UNIQUEMENT pour les admins ──────────
  const fetchSidebarStats = useCallback(async (currentUser) => {
    const token = localStorage.getItem('az_pulse_token');
    if (!token || !currentUser) return;

    // Extraire le rôle primaire depuis l'objet user
    const roleCode = currentUser?.primaryRole ?? currentUser?.roles?.[0] ?? '';
    if (!ADMIN_ROLES.includes(roleCode)) return; // Pas admin → on ne fait pas l'appel

    try {
      const res = await fetch('http://localhost:8000/api/dashboard/admin', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setSidebarStats(json.data ?? null);
      }
    } catch {
      // silently fail
    }
  }, []);

  // ── 3. Initialisation : fetch user d'abord, puis stats si admin ────────
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('az_pulse_token');
      if (!token) { setLoadingUser(false); return; }

      try {
        const res = await fetch('http://localhost:8000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json   = await res.json();
          const loaded = json.user ?? null;
          setUser(loaded);

          // Stats admin seulement si le rôle le permet
          await fetchSidebarStats(loaded);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    init();
  }, [fetchSidebarStats]);

  // Rafraîchissement périodique des stats (30s) — seulement si admin
  useEffect(() => {
    if (!user) return;
    const roleCode = user?.primaryRole ?? user?.roles?.[0] ?? '';
    if (!ADMIN_ROLES.includes(roleCode)) return;

    const interval = setInterval(() => fetchSidebarStats(user), 30_000);
    return () => clearInterval(interval);
  }, [user, fetchSidebarStats]);

  // ── Helpers ──────────────────────────────────────────────────────────
  const fullName = user
    ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
    : null;

  const initials = fullName
    ? fullName.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase()
    : '??';

  // Le backend renvoie `roles` comme un tableau de codes (ex: ['SUPER_ADMIN'])
  // et `roleLabels` dans le même ordre. On lit donc par index, pas par .code.
  const roleCodes   = user?.roles ?? [];
  const roleLabels  = user?.roleLabels ?? [];

  // `primaryRole` est calculé côté serveur (voir AuthService::formatUserPayload).
  // C'est lui qui pilote l'aiguillage vers la bonne interface.
  const primaryRole      = user?.primaryRole ?? roleCodes[0] ?? 'USER';
  const primaryRoleLabel = roleLabels[0] ?? primaryRole;

  // Spécialisation du collaborateur : détermine l'interface, jamais les droits.
  const collaboratorProfile      = user?.collaboratorProfile ?? null;
  const collaboratorProfileLabel = user?.collaboratorProfileLabel ?? null;

  // Liste des permissions réellement détenues, telle que calculée par Symfony.
  const permissions = user?.permissions ?? [];

  const hasPermission = (code) => permissions.includes(code);

  return (
    <AuthContext.Provider value={{
      user,
      fullName,
      initials,
      primaryRole,       // code ex: 'SUPER_ADMIN', 'COLLABORATEUR', 'APPRENANT'
      primaryRoleLabel,  // label ex: 'Apprenant / Étudiant'
      roleCodes,
      roleLabels,
      permissions,
      hasPermission,
      collaboratorProfile,
      collaboratorProfileLabel,
      sidebarStats,
      loadingUser,
      refetchMe:           fetchMe,
      refetchSidebarStats: (u) => fetchSidebarStats(u ?? user),
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
