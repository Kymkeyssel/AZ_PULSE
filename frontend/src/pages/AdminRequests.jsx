import React, { useState, useEffect, useMemo } from 'react';
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
      const token   = localStorage.getItem('az_pulse_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch('http://localhost:8000/api/admin/access-requests', { headers });
      if (res.ok) {
        const data = await res.json();
        setRequests(data.data || []);
      } else {
        // Fallback mock
        setRequests([
          {
            id: 'REQ-2026-0849',
            user: { fullName: 'Marie Nguimfack', email: 'marie.n@azpulse-enterprise.cm', phone: '+237 6 98 42 11 05' },
            requestedDomain: 'Responsable Pipeline CRM',
            motivation: 'Prise de poste en tant que Responsable Pipeline CRM au pôle Ventes B2B.',
            status: 'PENDING',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'REQ-2026-0848',
            user: { fullName: 'Jean Dupont', email: 'jean.dupont@formation-az.cm', phone: '+237 6 77 12 34 56' },
            requestedDomain: 'Instructeur Systèmes',
            motivation: 'Prise en charge des cohortes Dev Web MINEFOP.',
            status: 'PENDING',
            createdAt: new Date(Date.now() - 3_600_000).toISOString(),
          },
          {
            id: 'REQ-2026-0847',
            user: { fullName: 'Alice Fouda', email: 'alice.f@azpulse.cm', phone: '+237 6 55 11 22 33' },
            requestedDomain: 'Support IT',
            motivation: 'Rejoindre la cellule support interne.',
            status: 'APPROVED',
            createdAt: new Date(Date.now() - 86_400_000).toISOString(),
          },
        ]);
      }

      const roleRes = await fetch('http://localhost:8000/api/admin/roles-permissions', { headers });
      if (roleRes.ok) {
        const rData = await roleRes.json();
        setRoles(rData.roles || []);
        setPermissions(rData.permissions || []);
        setProfiles(rData.collaboratorProfiles || []);
        if (rData.collaboratorRoleCode) setCollaboratorRoleCode(rData.collaboratorRoleCode);
      } else {
        setRoles([
          { code: 'ADMIN',       label: 'Administrateur' },
          { code: 'COLLABORATEUR', label: 'Collaborateur' },
        ]);
      }
    } catch (err) {
      console.error(err);
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
      const token   = localStorage.getItem('az_pulse_token');
      const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
      const reqId   = actionModal.reqId || selectedRequest?.id;

      const res = await fetch(`http://localhost:8000/api/admin/access-requests/${reqId}/approve`, {
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
      const token   = localStorage.getItem('az_pulse_token');
      const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
      const reqId   = actionModal.reqId || selectedRequest?.id;

      const res = await fetch(`http://localhost:8000/api/admin/access-requests/${reqId}/reject`, {
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
              <span className="material-symbols-outlined notranslate text-[16px]" style={{ color: C.textMuted }}>admin_panel_settings</span>
              <span style={{ color: C.textMuted }} className="text-xs font-medium">Administration</span>
              <span style={{ color: C.border }} className="text-xs">/</span>
              <span style={{ color: C.blue }} className="text-xs font-bold">Demandes d'accès</span>
              <span style={{ background: C.amberBg, color: C.amber }}
                    className="ml-1 px-2 py-0.5 rounded-full text-[11px] font-black">
                {pendingCount} en attente
              </span>
            </div>
            <h1 style={{ color: C.navy }} className="text-2xl font-extrabold tracking-tight">
              Gestion des Demandes d'Accès
            </h1>
            <p style={{ color: C.textMuted }} className="text-sm mt-0.5">
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
          <div style={{ background: C.surfaceCard, border: `1px solid ${C.border}`, borderTop: `3px solid ${C.gold}` }}
               className="p-5 rounded-xl shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p style={{ color: C.textMuted }} className="text-xs font-bold uppercase tracking-wider mb-1">En attente</p>
                <p style={{ color: C.navy }} className="text-4xl font-black leading-none">{pendingCount}</p>
              </div>
              <div style={{ background: '#fef9ec', color: C.gold }} className="w-10 h-10 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined notranslate text-[22px]">pending_actions</span>
              </div>
            </div>
            <p style={{ color: C.textMuted }} className="text-xs mt-3">Demandes en attente d'arbitrage</p>
          </div>

          {/* KPI 2 — Approuvées */}
          <div style={{ background: C.surfaceCard, border: `1px solid ${C.border}`, borderTop: `3px solid ${C.blue}` }}
               className="p-5 rounded-xl shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p style={{ color: C.textMuted }} className="text-xs font-bold uppercase tracking-wider mb-1">Approuvées</p>
                <p style={{ color: C.navy }} className="text-4xl font-black leading-none">{approvedCount}</p>
              </div>
              <div style={{ background: '#eff6ff', color: C.blue }} className="w-10 h-10 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined notranslate text-[22px]">verified_user</span>
              </div>
            </div>
            <p style={{ color: C.textMuted }} className="text-xs mt-3">Comptes activés avec succès</p>
          </div>

          {/* KPI 3 — Rejetées */}
          <div style={{ background: C.surfaceCard, border: `1px solid ${C.border}`, borderTop: `3px solid ${C.red}` }}
               className="p-5 rounded-xl shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p style={{ color: C.textMuted }} className="text-xs font-bold uppercase tracking-wider mb-1">Rejetées</p>
                <p style={{ color: C.navy }} className="text-4xl font-black leading-none">{rejectedCount}</p>
              </div>
              <div style={{ background: '#fff1f2', color: C.red }} className="w-10 h-10 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined notranslate text-[22px]">rule_folder</span>
              </div>
            </div>
            <p style={{ color: C.textMuted }} className="text-xs mt-3">Dossiers refusés ou incomplets</p>
          </div>

          {/* KPI 4 — IA Copilot placeholder */}
          <div style={{ background: C.navy, border: `1px solid ${C.navy}` }}
               className="p-5 rounded-xl shadow-sm relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="material-symbols-outlined notranslate text-[14px]" style={{ color: C.gold }}>auto_awesome</span>
                  <p style={{ color: C.gold }} className="text-xs font-bold uppercase tracking-wider">IA Copilot</p>
                </div>
                <p style={{ color: '#ffffff' }} className="text-lg font-extrabold leading-snug">Analyse prédictive</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.08)', color: C.gold }}
                   className="w-10 h-10 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined notranslate text-[22px]">smart_toy</span>
              </div>
            </div>
            <div style={{ background: 'rgba(255,184,0,0.12)', border: '1px dashed rgba(255,184,0,0.4)', color: '#fbbf24' }}
                 className="mt-4 px-3 py-2 rounded-lg flex items-center gap-2 text-xs font-semibold">
              <span className="material-symbols-outlined notranslate text-[14px]">schedule</span>
              Bientôt disponible
            </div>
            <div className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-white/5 blur-xl pointer-events-none" />
          </div>
        </div>

        {/* ── IA Recommendation Banner — placeholder ────────────── */}
        <div style={{ background: C.navy, border: `1px solid rgba(255,184,0,0.2)` }}
             className="rounded-xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
          <div className="flex items-center gap-4 z-10">
            <div style={{ background: 'rgba(255,184,0,0.12)', color: C.gold }}
                 className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined notranslate text-[24px]">smart_toy</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span style={{ color: '#ffffff' }} className="font-bold text-sm">AZ Copilot — Recommandations IA</span>
                <span style={{ background: 'rgba(255,184,0,0.15)', color: C.gold, border: '1px dashed rgba(255,184,0,0.5)' }}
                      className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide">
                  Bientôt disponible
                </span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.55)' }} className="text-xs max-w-xl">
                L'analyse prédictive et la validation automatique des dossiers à haut score de conformité seront disponibles dans une prochaine mise à jour.
              </p>
            </div>
          </div>
          <button disabled
                  style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.35)', cursor: 'not-allowed' }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold flex-shrink-0 z-10">
            <span className="material-symbols-outlined notranslate text-[18px]">lock</span>
            Indisponible
          </button>
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/[0.02] blur-2xl pointer-events-none" />
        </div>

        {/* ── Filters & Search ────────────────────────────────────── */}
        <div style={{ background: C.surfaceCard, border: `1px solid ${C.border}` }}
             className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-xl mb-4">
          {/* Search */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined notranslate absolute left-3 top-1/2 -translate-y-1/2 text-[18px]"
                  style={{ color: C.textMuted }}>search</span>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom, email, rôle..."
              style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.textBody }}
              className="w-full h-10 pl-10 pr-4 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-slate-400"
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.textBody }}
              className="appearance-none h-10 pl-3 pr-8 rounded-lg text-sm focus:outline-none cursor-pointer">
              <option value="ALL">Tous ({requests.length})</option>
              <option value="PENDING">En attente ({pendingCount})</option>
              <option value="APPROVED">Approuvées ({approvedCount})</option>
              <option value="REJECTED">Rejetées ({rejectedCount})</option>
            </select>
            <span className="material-symbols-outlined notranslate absolute right-2 top-1/2 -translate-y-1/2 text-[16px] pointer-events-none"
                  style={{ color: C.textMuted }}>expand_more</span>
          </div>
        </div>

        {/* ── Main Grid : Table + Drawer ───────────────────────────── */}
        <div className={`grid gap-4 ${selectedRequest ? 'grid-cols-1 xl:grid-cols-3' : 'grid-cols-1'}`}>

          {/* ── TABLE ─────────────────────────────────────────────── */}
          <div className={selectedRequest ? 'xl:col-span-2' : ''}>
            <div style={{ background: C.surfaceCard, border: `1px solid ${C.border}` }} className="rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr style={{ background: C.surfaceMid, borderBottom: `1px solid ${C.border}` }}>
                      <th style={{ color: C.textMuted }} className="py-3 px-4 text-xs font-bold uppercase tracking-wider">Demandeur</th>
                      <th style={{ color: C.textMuted }} className="py-3 px-4 text-xs font-bold uppercase tracking-wider">Rôle demandé</th>
                      <th style={{ color: C.textMuted }} className="py-3 px-4 text-xs font-bold uppercase tracking-wider hidden md:table-cell">Motif</th>
                      <th style={{ color: C.textMuted }} className="py-3 px-4 text-xs font-bold uppercase tracking-wider">Statut</th>
                      <th style={{ color: C.textMuted }} className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-right">Actions</th>
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
                          <span className="material-symbols-outlined notranslate text-[40px]" style={{ color: C.border }}>inbox</span>
                          <p style={{ color: C.textMuted }} className="text-sm mt-2">Aucune demande trouvée.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredRequests.map((req, i) => (
                        <tr
                          key={req.id}
                          onClick={() => setSelectedRequest(req)}
                          style={{
                            borderBottom: i < filteredRequests.length - 1 ? `1px solid ${C.border}` : 'none',
                            background: selectedRequest?.id === req.id ? '#f0f5ff' : 'transparent',
                            cursor: 'pointer',
                          }}
                          className="hover:bg-blue-50 transition-colors"
                        >
                          {/* Demandeur */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <Avatar name={req.user.fullName} />
                              <div className="min-w-0">
                                <p style={{ color: C.navy }} className="text-sm font-bold truncate">{req.user.fullName}</p>
                                <p style={{ color: C.textMuted }} className="text-xs truncate">{req.user.email}</p>
                                <p style={{ color: C.textMuted }} className="text-[11px] flex items-center gap-1 mt-0.5">
                                  <span className="material-symbols-outlined notranslate text-[12px]">schedule</span>
                                  {new Date(req.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Rôle */}
                          <td className="py-3.5 px-4">
                            <span style={{ background: '#eff6ff', color: C.blue }}
                                  className="px-2.5 py-1 rounded-md text-xs font-semibold">
                              {req.requestedDomain || 'Général'}
                            </span>
                          </td>

                          {/* Motif */}
                          <td className="py-3.5 px-4 hidden md:table-cell">
                            <p style={{ color: C.textBody }} className="text-xs line-clamp-2 max-w-xs italic">
                              « {req.motivation} »
                            </p>
                          </td>

                          {/* Statut */}
                          <td className="py-3.5 px-4">
                            <StatusBadge status={req.status} />
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => setSelectedRequest(req)}
                                      style={{ background: C.surfaceMid, color: C.textMuted, border: `1px solid ${C.border}` }}
                                      className="p-1.5 rounded-lg hover:opacity-70 transition-opacity" title="Examiner">
                                <span className="material-symbols-outlined notranslate text-[16px]">visibility</span>
                              </button>
                              {req.status === 'PENDING' && (
                                <>
                                  <button onClick={() => setActionModal({ open: true, type: 'APPROVE', reqId: req.id })}
                                          style={{ background: C.blue, color: C.white }}
                                          className="px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-80 transition-opacity shadow-sm">
                                    Valider
                                  </button>
                                  <button onClick={() => setActionModal({ open: true, type: 'REJECT', reqId: req.id })}
                                          style={{ background: C.redBg, color: C.red, border: `1px solid #fecaca` }}
                                          className="p-1.5 rounded-lg hover:opacity-70 transition-opacity" title="Rejeter">
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
              <div style={{ background: C.surfaceCard, border: `1px solid ${C.border}` }}
                   className="rounded-xl shadow-sm overflow-hidden sticky top-4">

                {/* Drawer header */}
                <div style={{ background: C.navy }} className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span style={{ color: C.gold }} className="text-[10px] font-black uppercase tracking-widest">Dossier</span>
                      <p style={{ color: '#ffffff' }} className="font-bold text-base mt-0.5">{selectedRequest.id || 'REQ-NEW'}</p>
                    </div>
                    <button onClick={() => setSelectedRequest(null)}
                            style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}
                            className="p-1.5 rounded-lg hover:opacity-70 transition-opacity">
                      <span className="material-symbols-outlined notranslate text-[18px]">close</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <Avatar name={selectedRequest.user.fullName} size={48} />
                    <div className="min-w-0">
                      <p style={{ color: '#ffffff' }} className="font-bold text-sm truncate">{selectedRequest.user.fullName}</p>
                      <p style={{ color: 'rgba(255,255,255,0.6)' }} className="text-xs truncate">{selectedRequest.user.email}</p>
                      <p style={{ color: C.gold }} className="text-xs font-semibold mt-0.5">{selectedRequest.user.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Drawer body */}
                <div className="p-5 space-y-4">
                  {/* Statut */}
                  <div>
                    <p style={{ color: C.textMuted }} className="text-[10px] font-bold uppercase tracking-wider mb-1.5">Statut actuel</p>
                    <StatusBadge status={selectedRequest.status} />
                  </div>

                  {/* Rôle sollicité */}
                  <div>
                    <p style={{ color: C.textMuted }} className="text-[10px] font-bold uppercase tracking-wider mb-1.5">Rôle sollicité</p>
                    <div style={{ background: C.surfaceMid, border: `1px solid ${C.border}` }} className="p-3 rounded-lg">
                      <span style={{ color: C.navy }} className="font-bold text-sm">{selectedRequest.requestedDomain || 'Général'}</span>
                    </div>
                  </div>

                  {/* Motivation */}
                  <div>
                    <p style={{ color: C.textMuted }} className="text-[10px] font-bold uppercase tracking-wider mb-1.5">Motivation</p>
                    <div style={{ background: C.surface, border: `1px solid ${C.border}` }} className="p-3 rounded-lg">
                      <p style={{ color: C.textBody }} className="text-xs italic leading-relaxed">
                        « {selectedRequest.motivation} »
                      </p>
                    </div>
                  </div>

                  {/* IA Analyse — placeholder */}
                  <div>
                    <p style={{ color: C.textMuted }} className="text-[10px] font-bold uppercase tracking-wider mb-1.5">Analyse IA</p>
                    <div style={{ background: C.navy, border: '1px dashed rgba(255,184,0,0.3)' }}
                         className="p-3 rounded-lg flex items-center gap-2">
                      <span className="material-symbols-outlined notranslate text-[16px]" style={{ color: C.gold }}>smart_toy</span>
                      <p style={{ color: 'rgba(255,255,255,0.5)' }} className="text-xs">
                        Analyse prédictive — <span style={{ color: C.gold }} className="font-semibold">Bientôt disponible</span>
                      </p>
                    </div>
                  </div>

                  {/* Date */}
                  <p style={{ color: C.textMuted }} className="text-xs flex items-center gap-1">
                    <span className="material-symbols-outlined notranslate text-[14px]">event</span>
                    Soumis le {new Date(selectedRequest.createdAt).toLocaleString('fr-FR')}
                  </p>
                </div>

                {/* Actions */}
                {selectedRequest.status === 'PENDING' && (
                  <div style={{ borderTop: `1px solid ${C.border}` }} className="p-4 flex gap-2">
                    <button onClick={() => setActionModal({ open: true, type: 'APPROVE', reqId: selectedRequest.id })}
                            style={{ background: C.blue, color: C.white }}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold hover:opacity-80 transition-opacity shadow-sm">
                      <span className="material-symbols-outlined notranslate text-[18px]">check_circle</span>
                      Approuver
                    </button>
                    <button onClick={() => setActionModal({ open: true, type: 'REJECT', reqId: selectedRequest.id })}
                            style={{ background: C.redBg, color: C.red, border: `1px solid #fecaca` }}
                            className="flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-lg text-sm font-bold hover:opacity-80 transition-opacity">
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
      {actionModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
             style={{ background: 'rgba(0,16,38,0.65)', backdropFilter: 'blur(4px)' }}
             onClick={() => setActionModal({ open: false, type: null, reqId: null })}>
          <div onClick={e => e.stopPropagation()}
               style={{ background: C.surfaceCard, border: `1px solid ${C.border}` }}
               className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">

            {actionModal.type === 'APPROVE' ? (
              <form onSubmit={handleApprove}>
                {/* Modal header */}
                <div style={{ background: C.navy }} className="px-6 py-5 flex items-center gap-3">
                  <div style={{ background: 'rgba(255,255,255,0.1)', color: C.gold }}
                       className="w-10 h-10 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined notranslate">security</span>
                  </div>
                  <div>
                    <p style={{ color: '#ffffff' }} className="font-extrabold text-base">Valider l'accès</p>
                    <p style={{ color: 'rgba(255,255,255,0.5)' }} className="text-xs">
                      Attribuer un rôle, éventuellement une spécialisation, et activer le compte
                    </p>
                  </div>
                </div>

                <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
                  {/* ── Étape 1 : Rôle ─────────────────────────────────── */}
                  <div>
                    <label style={{ color: C.textMuted }} className="block text-xs font-bold uppercase tracking-wide mb-2">
                      1. Rôle à assigner
                    </label>
                    <select
                      required value={selectedRole} onChange={e => handleRoleChange(e.target.value)}
                      style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.textBody }}
                      className="w-full px-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-200">
                      <option value="">Sélectionner un rôle...</option>
                      {roles.map(r => <option key={r.code} value={r.code}>{r.label} ({r.code})</option>)}
                    </select>
                    <p style={{ color: C.textMuted }} className="text-[11px] mt-1.5">
                      Le casier de clés du demandeur. C'est ce qui autorise ses actions.
                    </p>
                  </div>

                  {/* ── Étape 2 : Spécialisation (collaborateur) ────────── */}
                  {isCollaboratorRole && (
                    <div>
                      <label style={{ color: C.textMuted }} className="block text-xs font-bold uppercase tracking-wide mb-2">
                        2. Spécialisation
                      </label>
                      <select
                        required value={selectedProfile} onChange={e => handleProfileChange(e.target.value)}
                        style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.textBody }}
                        className="w-full px-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-200">
                        <option value="">Sélectionner une spécialisation...</option>
                        {profiles.map(p => <option key={p.code} value={p.code}>{p.label}</option>)}
                      </select>

                      {/* Description de la spécialisation choisie */}
                      {(() => {
                        const profile = profiles.find(p => p.code === selectedProfile);
                        if (!profile) return null;
                        return (
                          <div style={{ background: C.surfaceMid, border: `1px solid ${C.border}` }}
                               className="mt-2 p-3 rounded-lg flex items-start gap-2.5">
                            <span className="material-symbols-outlined notranslate text-[18px] flex-shrink-0" style={{ color: C.blue }}>
                              {profile.icon}
                            </span>
                            <div className="min-w-0">
                              <p style={{ color: C.navy }} className="text-xs font-bold">{profile.label}</p>
                              <p style={{ color: C.textMuted }} className="text-[11px] leading-relaxed mt-0.5">
                                {profile.description}
                              </p>
                              <p style={{ color: C.blue }} className="text-[10px] font-mono mt-1.5">
                                Interface : {profile.interfaceRoute}
                              </p>
                            </div>
                          </div>
                        );
                      })()}

                      <p style={{ color: C.textMuted }} className="text-[11px] mt-1.5">
                        Détermine l'interface affichée après connexion. Les droits ci-dessous sont pré-cochés, vous pouvez les ajuster.
                      </p>
                    </div>
                  )}



                  {/* ── Récapitulatif de l'espace personnel ───────────── */}
                  {selectedRole && (
                    <div style={{ background: C.navy, border: `1px solid ${C.navy}` }} className="p-3.5 rounded-xl">
                      <p style={{ color: '#fbbf24' }} className="text-[10px] font-black uppercase tracking-widest mb-1.5">
                        Récapitulatif
                      </p>
                      <p style={{ color: '#fff' }} className="text-xs font-bold">
                        {roles.find(r => r.code === selectedRole)?.label ?? selectedRole}
                      </p>
                      {isCollaboratorRole && selectedProfile && (
                        <p style={{ color: '#b5c4ff' }} className="text-[11px] mt-0.5">
                          Spécialisation : {profiles.find(p => p.code === selectedProfile)?.label}
                        </p>
                      )}
                      <p style={{ color: 'rgba(255,255,255,0.45)' }} className="text-[10px] mt-2 leading-relaxed">
                        Le compte héritera des droits standards définis pour ce rôle/profil.
                      </p>
                    </div>
                  )}
                </div>

                <div style={{ borderTop: `1px solid ${C.border}` }} className="px-6 py-4 flex justify-end gap-2">
                  <button type="button" onClick={() => setActionModal({ open: false })}
                          style={{ color: C.textMuted }}
                          className="px-4 py-2 rounded-xl text-sm font-bold hover:opacity-70 transition-opacity">
                    Annuler
                  </button>
                  <button type="submit"
                          style={{ background: C.blue, color: C.white }}
                          className="px-5 py-2 rounded-xl text-sm font-bold hover:opacity-80 transition-opacity shadow-md">
                    Confirmer l'accès
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleReject}>
                {/* Modal header */}
                <div style={{ background: C.redBg, borderBottom: `1px solid #fecaca` }} className="px-6 py-5 flex items-center gap-3">
                  <div style={{ background: '#fee2e2', color: C.red }}
                       className="w-10 h-10 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined notranslate">cancel</span>
                  </div>
                  <div>
                    <p style={{ color: C.red }} className="font-extrabold text-base">Refuser la demande</p>
                    <p style={{ color: '#b91c1c' }} className="text-xs">Cette action est irréversible</p>
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
