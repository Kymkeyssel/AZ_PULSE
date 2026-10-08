import React, { useState, useEffect, useMemo } from 'react';



import { API_BASE_URL, TOKEN_KEY } from '../services/config';

import { toast } from 'sonner';

// ─────────────────────────────────────────────
// Design tokens (= couleurs du projet AZ PULSE)
// ─────────────────────────────────────────────
const C = {
  navy:     '#001026',
  blue:     '#004ad1',
  gold:     '#FFB800',
  white:    '#ffffff',
  surface:  '#f4f7fb',
  surfaceCard: '#ffffff',
  surfaceMid:  '#edf1f7',
  border:   '#dde3ef',
  textMuted:'#6b7a99',
  textBody: '#1c2a45',
  green:    '#16a34a',
  greenBg:  '#dcfce7',
  amber:    '#d97706',
  amberBg:  '#fef3c7',
  red:      '#dc2626',
  redBg:    '#fee2e2',
};

/**
 * Pastille d'état d'une demande.
 *
 * Déclarée au niveau du module et non dans le composant : une fonction
 * déclarée dans le corps d'un composant est recréée à chaque rendu, ce qui
 * fait perdre l'identité du composant à React (et son état, s'il en avait).
 */
const StatusBadge = ({ status }) => {
  const map = {
    PENDING:  { label: 'En attente', bg: C.amberBg, color: C.amber, dot: C.gold },
    APPROVED: { label: 'Approuvé',   bg: C.greenBg, color: C.green, dot: C.green },
    REJECTED: { label: 'Rejeté',     bg: C.redBg,   color: C.red,   dot: C.red  },
  };
  const s = map[status] || map.PENDING;
  return (
    <span style={{ background: s.bg, color: s.color }}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold">
      <span style={{ background: s.dot }} className="w-1.5 h-1.5 rounded-full" />
      {s.label}
    </span>
  );
};

/** Initiales sur aplat coloré, déterministe pour un même nom. */
const Avatar = ({ name, size = 40 }) => {
  const initials = name.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase();
  const colors   = ['#004ad1', '#7c3aed', '#0891b2', '#059669', '#d97706'];
  const bg       = colors[(name.charCodeAt(0) || 0) % colors.length];
  return (
    <div style={{ width: size, height: size, background: bg, color: '#fff', fontSize: size * 0.35, borderRadius: size * 0.25 }}
         className="flex items-center justify-center font-bold flex-shrink-0 select-none">
      {initials}
    </div>
  );
};

const AdminRequests = () => {
  const [requests,         setRequests]         = useState([]);
  // Le contenu fait foi : tant qu'il est absent, on affiche le chargement.
  // Éviter un `setLoading(true)` dans l'effet supprime un rendu en cascade.
  const [loaded, setLoaded] = useState(false);
  const loading = !loaded;
  const [selectedRequest,  setSelectedRequest]  = useState(null);
  const [actionModal,      setActionModal]      = useState({ open: false, type: null, reqId: null });
  const [roles,            setRoles]            = useState([]);
  const [permissions,      setPermissions]      = useState([]);
  const [profiles,         setProfiles]         = useState([]);
  const [collaboratorRoleCode, setCollaboratorRoleCode] = useState('COLLABORATEUR');
  const [selectedRole,     setSelectedRole]     = useState('');
  const [selectedProfile,  setSelectedProfile]  = useState('');
  const [grantedPerms,     setGrantedPerms]     = useState(new Set());
  const [revokedPerms,     setRevokedPerms]     = useState(new Set());
  const [rejectReason,     setRejectReason]     = useState('');
  const [searchQuery,      setSearchQuery]      = useState('');
  const [statusFilter,     setStatusFilter]     = useState('ALL');

  // Le rôle « Collaborateur » est-il celui choisi dans le formulaire ?
  const isCollaboratorRole = selectedRole === collaboratorRoleCode;

  // Permissions effectivement retenues : suggérées par la spécialisation,
  // moins les retraits explicites.
  const effectiveGrants = useMemo(
    () => [...grantedPerms].filter(p => !revokedPerms.has(p)),
    [grantedPerms, revokedPerms],
  );

  // Permissions accordées par le rôle choisi, hors surcharges individuelles.
  const roleBasePerms = useMemo(
    () => new Set(roles.find(r => r.code === selectedRole)?.permissions ?? []),
    [roles, selectedRole],
  );

  // Une permission Relevant du rôle n'a pas besoin d'être surchargée.
  const overridablePerms = useMemo(
    () => permissions.filter(p => !roleBasePerms.has(p.code)),
    [permissions, roleBasePerms],
  );

  // ── Data fetching ──────────────────────────
  const fetchRequests = async () => {
    try {
      const token   = localStorage.getItem(TOKEN_KEY);
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch(`${API_BASE_URL}/admin/access-requests`, { headers });
      if (res.ok) {
        const data = await res.json();
        setRequests(data.data || []);
      } else {
        // Un administrateur ne doit jamais arbitrer des demandes fictives : on
        // affiche l'échec et une file vide, jamais de données d'exemple.
        setRequests([]);
        toast.error(
          res.status === 403
            ? 'Vos droits ne permettent pas de consulter les demandes d\'accès.'
            : 'Impossible de charger les demandes d\'accès.'
        );
      }

      const roleRes = await fetch(`${API_BASE_URL}/admin/roles-permissions`, { headers });
      if (roleRes.ok) {
        const rData = await roleRes.json();
        setRoles(rData.roles || []);
        setPermissions(rData.permissions || []);
        setProfiles(rData.collaboratorProfiles || []);
        if (rData.collaboratorRoleCode) setCollaboratorRoleCode(rData.collaboratorRoleCode);
      } else {
        setRoles([]);
        setPermissions([]);
        setProfiles([]);
      }
    } catch (err) {
      console.error(err);
      setRequests([]);
      toast.error('API injoignable : vérifiez que le backend Symfony est démarré.');
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => {
    // Les mises à jour d'état de `fetchRequests` ont toutes lieu après un
    // `await`, donc hors du rendu courant : aucun rendu en cascade. Le
    // linter ne descend pas dans la fonction asynchrone pour le vérifier.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRequests();
  }, []);

  // ── Sélection du rôle : réinitialise la spécialisation et les surcharges ──
  const handleRoleChange = (roleCode) => {
    setSelectedRole(roleCode);
    setSelectedProfile('');
    setGrantedPerms(new Set());
    setRevokedPerms(new Set());
  };

  // ── Sélection de la spécialisation : on pré-coche les droits suggérés ─────
  const handleProfileChange = (profileCode) => {
    setSelectedProfile(profileCode);

    const profile = profiles.find(p => p.code === profileCode);
    if (!profile) {
      setGrantedPerms(new Set());
      setRevokedPerms(new Set());
      return;
    }

    setGrantedPerms(new Set(profile.grantedPermissions ?? []));
    setRevokedPerms(new Set(profile.revokedPermissions ?? []));
  };

  const toggleGrant = (code) => {
    setGrantedPerms(prev => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code); else next.add(code);
      return next;
    });
    // Cocher une permission annule tout retrait explicite sur cette même permission.
    setRevokedPerms(prev => {
      if (!prev.has(code)) return prev;
      const next = new Set(prev);
      next.delete(code);
      return next;
    });
  };

  const toggleRevoke = (code) => {
    setRevokedPerms(prev => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code); else next.add(code);
    });
    setGrantedPerms(prev => {
      if (!prev.has(code)) return prev;
      const next = new Set(prev);
      next.delete(code);
      return next;
    });
  };

  // ── Actions ────────────────────────────────
  const handleApprove = async (e) => {
    if (e) e.preventDefault();

    if (!selectedRole) {
      toast.error('Veuillez choisir un rôle à attribuer.');
      return;
    }
    if (isCollaboratorRole && !selectedProfile) {
      toast.error('Veuillez choisir une spécialisation pour ce collaborateur.');
      return;
    }

    try {
      const token   = localStorage.getItem(TOKEN_KEY);
      const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
      const reqId   = actionModal.reqId || selectedRequest?.id;

      const res = await fetch(`${API_BASE_URL}/admin/access-requests/${reqId}/approve`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          roleCode: selectedRole,
          profileCode: isCollaboratorRole ? selectedProfile : null,
          customGrants: effectiveGrants,
          customRevokes: [...revokedPerms],
        }),
      });

      const payload = await res.json().catch(() => ({}));

      if (res.ok) {
        fetchRequests();
        setActionModal({ open: false, type: null, reqId: null });
        setSelectedRequest(null);
        setSelectedRole('');
        setSelectedProfile('');
        setGrantedPerms(new Set());
        setRevokedPerms(new Set());
        toast.success(payload.message ?? 'Demande approuvée avec succès.');
      } else {
        toast.error(payload.message ?? "Erreur lors de l'approbation.");
      }
    } catch { toast.error('Erreur de connexion.'); }
  };

  const handleReject = async (e) => {
    if (e) e.preventDefault();
    try {
      const token   = localStorage.getItem(TOKEN_KEY);
      const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
      const reqId   = actionModal.reqId || selectedRequest?.id;

      const res = await fetch(`${API_BASE_URL}/admin/access-requests/${reqId}/reject`, {
        method: 'POST', headers, body: JSON.stringify({ reason: rejectReason }),
      });
      if (res.ok) {
        fetchRequests();
        setActionModal({ open: false, type: null, reqId: null });
        setSelectedRequest(null);
        toast.success('Demande rejetée.');
      } else {
        toast.error('Erreur lors du rejet.');
      }
    } catch { toast.error('Erreur de connexion.'); }
  };

  // ── Computed ───────────────────────────────
  const pendingCount  = requests.filter(r => r.status === 'PENDING').length;
  const approvedCount = requests.filter(r => r.status === 'APPROVED').length;
  const rejectedCount = requests.filter(r => r.status === 'REJECTED').length;

  const filteredRequests = requests.filter(r => {
    const matchSearch = !searchQuery ||
      r.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.requestedDomain || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: C.surface, minHeight: '100vh' }}>
      <div className="max-w-screen-2xl mx-auto px-6 py-6">

        {/* ── Page Header ─────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined notranslate text-[16px] text-slate-500">admin_panel_settings</span>
              <span className="text-xs font-medium text-slate-500">Administration</span>
              <span className="text-xs text-slate-300">/</span>
              <span className="text-xs font-bold text-blue-600">Demandes d'accès</span>
              <span className="ml-1 px-2 py-0.5 rounded-full text-[11px] font-black bg-amber-100 text-amber-600 border border-amber-200">
                {pendingCount} en attente
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
              Gestion des Demandes d'Accès
            </h1>
            <p className="text-sm mt-1 text-slate-500">
              Supervision et validation des nouveaux comptes AZ Pulse.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={fetchRequests}
                    style={{ background: C.surfaceCard, border: `1px solid ${C.border}`, color: C.textMuted }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold hover:opacity-80 transition-opacity">
              <span className={`material-symbols-outlined notranslate text-[18px] ${loading ? 'animate-spin' : ''}`}>refresh</span>
              Actualiser
            </button>
            <button style={{ background: C.surfaceCard, border: `1px solid ${C.border}`, color: C.textMuted }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined notranslate text-[18px]">ios_share</span>
              Exporter
            </button>
          </div>
        </div>

        {/* ── KPI Cards ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {/* KPI 1 — En attente */}
          <div className="glass-panel p-5 rounded-2xl shadow-sm border-t-4 border-t-amber-500 hover:shadow-lg transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors pointer-events-none"></div>
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">En attente</p>
                <p className="text-4xl font-black text-slate-800 leading-none drop-shadow-sm">{pendingCount}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shadow-sm border border-amber-100">
                <span className="material-symbols-outlined notranslate text-[22px]">pending_actions</span>
              </div>
            </div>
            <p className="text-xs mt-3 text-slate-500 font-medium relative z-10">Demandes en attente d'arbitrage</p>
          </div>

          {/* KPI 2 — Approuvées */}
          <div className="glass-panel p-5 rounded-2xl shadow-sm border-t-4 border-t-emerald-500 hover:shadow-lg transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors pointer-events-none"></div>
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Approuvées</p>
                <p className="text-4xl font-black text-slate-800 leading-none drop-shadow-sm">{approvedCount}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm border border-emerald-100">
                <span className="material-symbols-outlined notranslate text-[22px]">verified_user</span>
              </div>
            </div>
            <p className="text-xs mt-3 text-slate-500 font-medium relative z-10">Comptes activés avec succès</p>
          </div>

          {/* KPI 3 — Rejetées */}
          <div className="glass-panel p-5 rounded-2xl shadow-sm border-t-4 border-t-red-500 hover:shadow-lg transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/10 transition-colors pointer-events-none"></div>
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Rejetées</p>
                <p className="text-4xl font-black text-slate-800 leading-none drop-shadow-sm">{rejectedCount}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shadow-sm border border-red-100">
                <span className="material-symbols-outlined notranslate text-[22px]">rule_folder</span>
              </div>
            </div>
            <p className="text-xs mt-3 text-slate-500 font-medium relative z-10">Dossiers refusés ou incomplets</p>
          </div>

          {/* KPI 4 — IA Copilot placeholder */}
          <div className="glass-panel-dark p-5 rounded-2xl shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl group-hover:bg-amber-500/30 transition-colors pointer-events-none"></div>
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="material-symbols-outlined notranslate text-[14px] text-amber-400">auto_awesome</span>
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-400">IA Copilot</p>
                </div>
                <p className="text-lg font-extrabold leading-snug text-white">Analyse prédictive</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/10 text-amber-400 flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-inner">
                <span className="material-symbols-outlined notranslate text-[22px]">smart_toy</span>
              </div>
            </div>
            <div className="mt-4 px-3 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-400 relative z-10">
              <span className="material-symbols-outlined notranslate text-[14px]">schedule</span>
              Bientôt disponible
            </div>
          </div>
        </div>

        {/* ── IA Recommendation Banner — placeholder ────────────── */}
        <div className="glass-panel-dark rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl group-hover:bg-amber-500/30 transition-colors pointer-events-none"></div>
          <div className="flex items-center gap-4 z-10">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/10 text-amber-400 backdrop-blur-sm border border-white/10 shadow-inner">
              <span className="material-symbols-outlined notranslate text-[24px]">smart_toy</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-sm text-white">AZ Copilot — Recommandations IA</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  Bientôt disponible
                </span>
              </div>
              <p className="text-xs max-w-xl text-slate-400">
                L'analyse prédictive et la validation automatique des dossiers à haut score de conformité seront disponibles dans une prochaine mise à jour.
              </p>
            </div>
          </div>
          <button disabled
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold flex-shrink-0 z-10 bg-white/5 text-slate-500 cursor-not-allowed border border-white/5">
            <span className="material-symbols-outlined notranslate text-[18px]">lock</span>
            Indisponible
          </button>
        </div>

        {/* ── Filters & Search ────────────────────────────────────── */}
        <div className="glass-panel flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-2xl mb-4 shadow-sm">
          {/* Search */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined notranslate absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">search</span>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom, email, rôle..."
              className="w-full h-10 pl-10 pr-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50/50 border border-slate-200/60 text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="appearance-none h-10 pl-3 pr-8 rounded-xl text-sm focus:outline-none cursor-pointer bg-slate-50/50 border border-slate-200/60 text-slate-800">
              <option value="ALL">Tous ({requests.length})</option>
              <option value="PENDING">En attente ({pendingCount})</option>
              <option value="APPROVED">Approuvées ({approvedCount})</option>
              <option value="REJECTED">Rejetées ({rejectedCount})</option>
            </select>
            <span className="material-symbols-outlined notranslate absolute right-2 top-1/2 -translate-y-1/2 text-[16px] pointer-events-none text-slate-400">expand_more</span>
          </div>
        </div>

        {/* ── Main Grid : Table + Drawer ───────────────────────────── */}
        <div className={`grid gap-4 ${selectedRequest ? 'grid-cols-1 xl:grid-cols-3' : 'grid-cols-1'}`}>

          {/* ── TABLE ─────────────────────────────────────────────── */}
          <div className={selectedRequest ? 'xl:col-span-2' : ''}>
            <div className="glass-panel rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-200/60">
                      <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">Demandeur</th>
                      <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">Rôle demandé</th>
                      <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500 hidden md:table-cell">Motif</th>
                      <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">Statut</th>
                      <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="py-16 text-center">
                          <div style={{ borderColor: C.blue }} className="animate-spin w-8 h-8 border-4 border-t-transparent rounded-full mx-auto mb-3" />
                          <p style={{ color: C.textMuted }} className="text-sm">Chargement des demandes...</p>
                        </td>
                      </tr>
                    ) : filteredRequests.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-16 text-center">
                          <span className="material-symbols-outlined notranslate text-[40px] text-slate-300">inbox</span>
                          <p className="text-sm mt-2 text-slate-500 font-medium">Aucune demande trouvée.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredRequests.map((req, i) => (
                        <tr
                          key={req.id}
                          onClick={() => setSelectedRequest(req)}
                          className={`
                            group cursor-pointer transition-all duration-200
                            ${i < filteredRequests.length - 1 ? 'border-b border-slate-200/60' : ''}
                            ${selectedRequest?.id === req.id ? 'bg-blue-50/60' : 'hover:bg-slate-50'}
                          `}
                        >
                          {/* Demandeur */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <Avatar name={req.user.fullName} />
                              <div className="min-w-0">
                                <p className="text-sm font-bold truncate text-slate-800">{req.user.fullName}</p>
                                <p className="text-xs truncate text-slate-500">{req.user.email}</p>
                                <p className="text-[11px] flex items-center gap-1 mt-0.5 text-slate-400 font-medium">
                                  <span className="material-symbols-outlined notranslate text-[12px]">schedule</span>
                                  {new Date(req.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Rôle */}
                          <td className="py-3.5 px-4">
                            <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md text-xs font-semibold border border-blue-100">
                              {req.requestedDomain || 'Général'}
                            </span>
                          </td>

                          {/* Motif */}
                          <td className="py-3.5 px-4 hidden md:table-cell">
                            <p className="text-xs line-clamp-2 max-w-xs italic text-slate-600">
                              « {req.motivation} »
                            </p>
                          </td>

                          {/* Statut */}
                          <td className="py-3.5 px-4">
                            <StatusBadge status={req.status} />
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => setSelectedRequest(req)}
                                      className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all border border-slate-200/60" title="Examiner">
                                <span className="material-symbols-outlined notranslate text-[16px]">visibility</span>
                              </button>
                              {req.status === 'PENDING' && (
                                <>
                                  <button onClick={() => setActionModal({ open: true, type: 'APPROVE', reqId: req.id })}
                                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 hover:shadow-sm hover:-translate-y-0.5 transition-all">
                                    Valider
                                  </button>
                                  <button onClick={() => setActionModal({ open: true, type: 'REJECT', reqId: req.id })}
                                          className="p-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-100" title="Rejeter">
                                    <span className="material-symbols-outlined notranslate text-[16px]">close</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ── DETAIL DRAWER ──────────────────────────────────────── */}
          {selectedRequest && (
            <div className="xl:col-span-1">
              <div className="glass-panel rounded-2xl shadow-sm overflow-hidden sticky top-4 border-t-4 border-t-blue-500">
                {/* Drawer header */}
                <div className="bg-slate-900/95 p-5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="relative z-10 flex items-start justify-between mb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Dossier</span>
                      <p className="font-bold text-base mt-0.5 text-white">{selectedRequest.id || 'REQ-NEW'}</p>
                    </div>
                    <button onClick={() => setSelectedRequest(null)}
                            className="p-1.5 rounded-xl bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white transition-all backdrop-blur-sm border border-white/10 shadow-sm">
                      <span className="material-symbols-outlined notranslate text-[18px]">close</span>
                    </button>
                  </div>

                  <div className="relative z-10 flex items-center gap-3">
                    <Avatar name={selectedRequest.user.fullName} size={48} />
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate text-white">{selectedRequest.user.fullName}</p>
                      <p className="text-xs truncate text-slate-300">{selectedRequest.user.email}</p>
                      <p className="text-xs font-semibold mt-0.5 text-amber-400">{selectedRequest.user.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Drawer body */}
                <div className="p-5 space-y-4">
                  {/* Statut */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-500">Statut actuel</p>
                    <StatusBadge status={selectedRequest.status} />
                  </div>

                  {/* Rôle sollicité */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-500">Rôle sollicité</p>
                    <div className="bg-slate-50/80 border border-slate-200/60 p-3 rounded-xl shadow-inner">
                      <span className="font-bold text-sm text-slate-800">{selectedRequest.requestedDomain || 'Général'}</span>
                    </div>
                  </div>

                  {/* Motivation */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-500">Motivation</p>
                    <div className="bg-slate-50/50 border border-slate-200/60 p-3 rounded-xl">
                      <p className="text-xs italic leading-relaxed text-slate-700">
                        « {selectedRequest.motivation} »
                      </p>
                    </div>
                  </div>

                  {/* IA Analyse — placeholder */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-500">Analyse IA</p>
                    <div className="bg-slate-900 border border-amber-500/30 p-3 rounded-xl flex items-center gap-2 shadow-inner">
                      <span className="material-symbols-outlined notranslate text-[16px] text-amber-400">smart_toy</span>
                      <p className="text-xs text-slate-400">
                        Analyse prédictive — <span className="font-semibold text-amber-400">Bientôt disponible</span>
                      </p>
                    </div>
                  </div>

                  {/* Date */}
                  <p className="text-xs flex items-center gap-1 text-slate-500 font-medium pt-2">
                    <span className="material-symbols-outlined notranslate text-[14px]">event</span>
                    Soumis le {new Date(selectedRequest.createdAt).toLocaleString('fr-FR')}
                  </p>
                </div>

                {/* Actions */}
                {selectedRequest.status === 'PENDING' && (
                  <div className="border-t border-slate-200/60 p-4 flex gap-2 bg-slate-50/50">
                    <button onClick={() => setActionModal({ open: true, type: 'APPROVE', reqId: selectedRequest.id })}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 transition-all">
                      <span className="material-symbols-outlined notranslate text-[18px]">check_circle</span>
                      Approuver
                    </button>
                    <button onClick={() => setActionModal({ open: true, type: 'REJECT', reqId: selectedRequest.id })}
                            className="flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl text-sm font-bold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors">
                      <span className="material-symbols-outlined notranslate text-[18px]">block</span>
                      Rejeter
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── MODALS ──────────────────────────────────────────────────── */}
      {/* ── MODALS ──────────────────────────────────────────────────── */}
      {actionModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
             onClick={() => setActionModal({ open: false, type: null, reqId: null })}>
          <div onClick={e => e.stopPropagation()}
               className="w-full max-w-md rounded-3xl shadow-2xl overflow-hidden glass-panel">

            {actionModal.type === 'APPROVE' ? (
              <form onSubmit={handleApprove}>
                {/* Modal header */}
                <div className="bg-slate-900/95 px-6 py-5 flex items-center gap-4 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center bg-white/10 text-amber-400 backdrop-blur-sm border border-white/10 shadow-inner flex-shrink-0">
                    <span className="material-symbols-outlined notranslate">security</span>
                  </div>
                  <div className="relative z-10">
                    <p className="font-extrabold text-base text-white">Valider l'accès</p>
                    <p className="text-xs text-slate-400 leading-tight mt-1">
                      Attribuer un rôle, éventuellement une spécialisation, et activer le compte
                    </p>
                  </div>
                </div>

                <div className="px-6 py-5 space-y-5 max-h-[65vh] overflow-y-auto">
                  {/* ── Étape 1 : Rôle ─────────────────────────────────── */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide mb-2 text-slate-500">
                      1. Rôle à assigner
                    </label>
                    <select
                      required value={selectedRole} onChange={e => handleRoleChange(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 bg-slate-50/80 border border-slate-200/60 text-slate-800 shadow-inner">
                      <option value="">Sélectionner un rôle...</option>
                      {roles.map(r => <option key={r.code} value={r.code}>{r.label} ({r.code})</option>)}
                    </select>
                    <p className="text-[11px] mt-2 text-slate-500 font-medium">
                      Le casier de clés du demandeur. C'est ce qui autorise ses actions principales.
                    </p>
                  </div>

                  {/* ── Étape 2 : Spécialisation (collaborateur) ────────── */}
                  {isCollaboratorRole && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide mb-2 text-slate-500">
                        2. Spécialisation
                      </label>
                      <select
                        required value={selectedProfile} onChange={e => handleProfileChange(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 bg-slate-50/80 border border-slate-200/60 text-slate-800 shadow-inner">
                        <option value="">Sélectionner une spécialisation...</option>
                        {profiles.map(p => <option key={p.code} value={p.code}>{p.label}</option>)}
                      </select>

                      {/* Description de la spécialisation choisie */}
                      {(() => {
                        const profile = profiles.find(p => p.code === selectedProfile);
                        if (!profile) return null;
                        return (
                          <div className="mt-3 p-4 rounded-xl flex items-start gap-3 bg-blue-50/50 border border-blue-100 shadow-inner">
                            <span className="material-symbols-outlined notranslate text-[20px] text-blue-600 flex-shrink-0 bg-blue-100/50 p-1.5 rounded-lg">
                              {profile.icon}
                            </span>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-slate-800">{profile.label}</p>
                              <p className="text-[11px] leading-relaxed mt-1 text-slate-600 font-medium">
                                {profile.description}
                              </p>
                              <p className="text-[10px] font-mono mt-2 bg-blue-100/50 text-blue-700 inline-block px-2 py-0.5 rounded border border-blue-200">
                                Route : {profile.interfaceRoute}
                              </p>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* ── Récapitulatif de l'espace personnel ───────────── */}
                  {selectedRole && (
                    <div className="glass-panel-dark p-4 rounded-2xl relative overflow-hidden group mt-4 shadow-md">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
                      <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-amber-400">
                          Récapitulatif
                        </p>
                        <p className="text-sm font-extrabold text-white">
                          {roles.find(r => r.code === selectedRole)?.label ?? selectedRole}
                        </p>
                        {isCollaboratorRole && selectedProfile && (
                          <p className="text-[11px] mt-1 text-blue-300 font-medium">
                            Spécialisation : {profiles.find(p => p.code === selectedProfile)?.label}
                          </p>
                        )}
                        <p className="text-[10px] mt-3 leading-relaxed text-slate-400 font-medium">
                          Le compte héritera des droits standards définis pour ce rôle/profil.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="px-6 py-4 flex justify-end gap-3 bg-slate-50/50 border-t border-slate-200/60 rounded-b-3xl">
                  <button type="button" onClick={() => setActionModal({ open: false })}
                          className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 transition-all">
                    Annuler
                  </button>
                  <button type="submit"
                          className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 transition-all">
                    Confirmer l'accès
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleReject}>
                {/* Modal header */}
                <div className="bg-red-50/90 border-b border-red-200 px-6 py-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-red-100 text-red-600 shadow-inner flex-shrink-0">
                    <span className="material-symbols-outlined notranslate">cancel</span>
                  </div>
                  <div>
                    <p className="font-extrabold text-base text-red-700">Refuser la demande</p>
                    <p className="text-xs text-red-500/80 mt-0.5 font-medium">Cette action est irréversible</p>
                  </div>
                </div>

                <div className="px-6 py-5">
                  <label style={{ color: C.textMuted }} className="block text-xs font-bold uppercase tracking-wide mb-2">
                    Motif du refus (obligatoire)
                  </label>
                  <textarea
                    required rows={3} value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                    placeholder="Ex: Domaine non pertinent, doublon détecté..."
                    style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.textBody }}
                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-100 resize-none" />
                </div>

                <div style={{ borderTop: `1px solid ${C.border}` }} className="px-6 py-4 flex justify-end gap-2">
                  <button type="button" onClick={() => setActionModal({ open: false })}
                          style={{ color: C.textMuted }}
                          className="px-4 py-2 rounded-xl text-sm font-bold hover:opacity-70 transition-opacity">
                    Annuler
                  </button>
                  <button type="submit"
                          style={{ background: C.red, color: C.white }}
                          className="px-5 py-2 rounded-xl text-sm font-bold hover:opacity-80 transition-opacity shadow-md">
                    Rejeter la demande
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRequests;
