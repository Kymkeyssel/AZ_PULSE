import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

// ── Design tokens AZ PULSE ────────────────────────────────────────────────────
const C = {
  navy:       '#001026',
  navyMid:    '#0b2545',
  blue:       '#004ad1',
  blueSoft:   '#eff6ff',
  gold:       '#FFB800',
  goldSoft:   '#fef9ec',
  white:      '#ffffff',
  surface:    '#f4f7fb',
  surfaceCard:'#ffffff',
  surfaceMid: '#edf1f7',
  border:     '#dde3ef',
  textMuted:  '#6b7a99',
  textBody:   '#1c2a45',
  green:      '#16a34a',
  greenBg:    '#dcfce7',
  amber:      '#d97706',
  amberBg:    '#fef3c7',
  red:        '#dc2626',
  redBg:      '#fee2e2',
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const Avatar = ({ name = '?', size = 36 }) => {
  const initials = name.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase();
  const palette  = ['#004ad1', '#7c3aed', '#0891b2', '#059669', '#d97706', '#dc2626'];
  const bg       = palette[(name.charCodeAt(0) || 0) % palette.length];
  return (
    <div style={{ width: size, height: size, background: bg, color: '#fff',
                  fontSize: size * 0.38, borderRadius: size * 0.28, flexShrink: 0 }}
         className="flex items-center justify-center font-bold select-none">
      {initials}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    PENDING:  { label: 'En attente', bg: C.amberBg, color: C.amber },
    APPROVED: { label: 'Approuvé',   bg: C.greenBg, color: C.green },
    REJECTED: { label: 'Rejeté',     bg: C.redBg,   color: C.red   },
  };
  const s = map[status] || map.PENDING;
  return (
    <span style={{ background: s.bg, color: s.color }}
          className="px-2 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap">
      {s.label}
    </span>
  );
};

const KpiCard = ({ label, value, icon, accent, sub, loading }) => (
  <div style={{ background: C.surfaceCard, border: `1px solid ${C.border}`,
                borderTop: `3px solid ${accent}` }}
       className="p-5 rounded-xl shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p style={{ color: C.textMuted }} className="text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
        {loading
          ? <div style={{ background: C.surfaceMid }} className="h-9 w-20 rounded animate-pulse mt-1" />
          : <p style={{ color: C.navy }} className="text-4xl font-black leading-none">{value ?? '—'}</p>
        }
      </div>
      <div style={{ background: accent + '18', color: accent }}
           className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
        <span className="material-symbols-outlined notranslate text-[22px]">{icon}</span>
      </div>
    </div>
    {sub && <p style={{ color: C.textMuted }} className="text-xs mt-3">{sub}</p>}
  </div>
);

// ── Component ─────────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const { fullName, primaryRole, sidebarStats } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token   = localStorage.getItem('az_pulse_token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res     = await fetch('http://localhost:8000/api/dashboard/admin', { headers });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setStats(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Rafraîchissement auto toutes les 30 secondes
    const interval = setInterval(fetchStats, 30_000);
    return () => clearInterval(interval);
  }, []);

  const req       = stats?.requests ?? {};
  const recentReq = stats?.recentRequests ?? [];

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── Hero Banner ──────────────────────────────────────────────── */}
      <section style={{ background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyMid} 60%, #001c3b 100%)` }}
               className="relative overflow-hidden rounded-2xl text-white p-6 shadow-xl border border-white/10 mb-6">
        <div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                <span className="material-symbols-outlined notranslate text-[13px]">verified</span>
                Espace Administrateur
              </span>
              {stats?.systemStatus === 'OK' && (
                <span style={{ background: C.greenBg, color: C.green }}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Système opérationnel
                </span>
              )}
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              Bonjour, {fullName ?? 'Administrateur'} 👋
            </h1>
            <p style={{ color: '#778db2' }} className="text-sm mt-1">
              Vue d'ensemble en temps réel des utilisateurs et des demandes d'accès AZ Pulse.
            </p>
          </div>

          {/* Stat rapide dans le hero */}
          {!loading && stats && (
            <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                 className="flex items-center gap-6 px-5 py-3 rounded-xl flex-shrink-0">
              <div className="text-center">
                <p className="text-2xl font-black">{stats.activeUsers ?? 0}</p>
                <p style={{ color: '#778db2' }} className="text-xs">Actifs</p>
              </div>
              <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.15)' }} />
              <div className="text-center">
                <p style={{ color: C.gold }} className="text-2xl font-black">{req.pending ?? 0}</p>
                <p style={{ color: '#778db2' }} className="text-xs">En attente</p>
              </div>
              <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.15)' }} />
              <div className="text-center">
                <p className="text-2xl font-black">{stats.totalUsers ?? 0}</p>
                <p style={{ color: '#778db2' }} className="text-xs">Inscrits total</p>
              </div>
            </div>
          )}
        </div>

        {/* Déco bg */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-40 h-40 rounded-full bg-yellow-400/5 blur-2xl pointer-events-none" />
      </section>

      {error && (
        <div style={{ background: C.redBg, border: `1px solid #fecaca`, color: C.red }}
             className="p-3 rounded-xl text-sm font-semibold mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined notranslate text-[18px]">error</span>
          Erreur lors du chargement des statistiques : {error}
        </div>
      )}

      {/* ── KPI Grid ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="Utilisateurs actifs"
          value={stats?.activeUsers}
          icon="group"
          accent={C.blue}
          sub="Comptes avec accès confirmé"
          loading={loading}
        />
        <KpiCard
          label="Demandes en attente"
          value={req?.pending}
          icon="pending_actions"
          accent={C.gold}
          sub="Nécessitent un arbitrage"
          loading={loading}
        />
        <KpiCard
          label="Demandes approuvées"
          value={req?.approved}
          icon="verified_user"
          accent={C.green}
          sub={req?.approvalRate != null ? `Taux d'approbation : ${req.approvalRate}%` : undefined}
          loading={loading}
        />
        <KpiCard
          label="Demandes rejetées"
          value={req?.rejected}
          icon="rule_folder"
          accent={C.red}
          sub="Dossiers refusés ou incomplets"
          loading={loading}
        />
      </div>

      {/* ── Main grid : Répartition + Activité récente ────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* ── Répartition des utilisateurs ────────────────────────── */}
        <div style={{ background: C.surfaceCard, border: `1px solid ${C.border}` }}
             className="rounded-xl shadow-sm p-5">
          <h2 style={{ color: C.navy }} className="font-extrabold text-base mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined notranslate text-[20px]" style={{ color: C.blue }}>manage_accounts</span>
            Répartition des comptes
          </h2>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ background: C.surfaceMid }} className="h-10 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { label: 'Actifs',            value: stats?.activeUsers,   color: C.green,  icon: 'check_circle' },
                { label: 'En attente approbation', value: stats?.pendingUsers, color: C.amber, icon: 'schedule' },
                { label: 'Rejetés',           value: stats?.rejectedUsers, color: C.red,    icon: 'cancel' },
                { label: 'Bloqués',           value: stats?.blockedUsers,  color: '#6b7a99', icon: 'block' },
              ].map(({ label, value, color, icon }) => {
                const total = stats?.totalUsers || 1;
                const pct   = Math.round(((value ?? 0) / total) * 100);
                return (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined notranslate text-[16px]" style={{ color }}>{icon}</span>
                        <span style={{ color: C.textBody }} className="text-sm font-semibold">{label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span style={{ color: C.textMuted }} className="text-xs">{pct}%</span>
                        <span style={{ color: C.navy }} className="text-sm font-black w-6 text-right">{value ?? 0}</span>
                      </div>
                    </div>
                    <div style={{ background: C.surfaceMid }} className="h-2 rounded-full overflow-hidden">
                      <div style={{ width: `${pct}%`, background: color, transition: 'width 0.6s ease' }}
                           className="h-full rounded-full" />
                    </div>
                  </div>
                );
              })}

              {/* Total */}
              <div style={{ borderTop: `1px solid ${C.border}` }} className="pt-3 mt-3 flex items-center justify-between">
                <span style={{ color: C.textMuted }} className="text-xs font-bold uppercase tracking-wide">Total inscrits</span>
                <span style={{ color: C.navy }} className="text-lg font-black">{stats?.totalUsers ?? 0}</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Demandes récentes ──────────────────────────────────────── */}
        <div style={{ background: C.surfaceCard, border: `1px solid ${C.border}` }}
             className="xl:col-span-2 rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ color: C.navy }} className="font-extrabold text-base flex items-center gap-2">
              <span className="material-symbols-outlined notranslate text-[20px]" style={{ color: C.blue }}>history</span>
              Dernières demandes d'accès
            </h2>
            <a href="/admin/requests"
               style={{ color: C.blue }}
               className="text-xs font-bold hover:opacity-70 transition-opacity flex items-center gap-1">
              Voir toutes
              <span className="material-symbols-outlined notranslate text-[14px]">arrow_forward</span>
            </a>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{ background: C.surfaceMid }} className="h-14 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : recentReq.length === 0 ? (
            <div className="py-12 flex flex-col items-center text-center gap-2">
              <span className="material-symbols-outlined notranslate text-[40px]" style={{ color: C.border }}>inbox</span>
              <p style={{ color: C.textMuted }} className="text-sm">Aucune demande enregistrée.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentReq.map((req, i) => (
                <div key={req.id || i}
                     style={{ background: i % 2 === 0 ? C.surface : C.surfaceCard,
                              border: `1px solid ${C.border}` }}
                     className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={req.user?.fullName || '?'} />
                    <div className="min-w-0">
                      <p style={{ color: C.navy }} className="text-sm font-bold truncate">
                        {req.user?.fullName ?? 'Inconnu'}
                      </p>
                      <p style={{ color: C.textMuted }} className="text-xs truncate">
                        {req.requestedDomain}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <StatusBadge status={req.status} />
                    <span style={{ color: C.textMuted }} className="text-[11px] whitespace-nowrap hidden sm:block">
                      {new Date(req.createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Mini-stat demandes ──────────────────────────────── */}
          {!loading && req.total > 0 && (
            <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 16, paddingTop: 16 }}
                 className="grid grid-cols-3 gap-3">
              {[
                { label: 'Total soumises',   value: req.total,    color: C.blue },
                { label: 'Taux acceptation', value: `${req.approvalRate}%`, color: C.green },
                { label: 'En file d\'attente', value: req.pending, color: C.amber },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ background: C.surfaceMid, border: `1px solid ${C.border}` }}
                     className="text-center py-3 px-2 rounded-xl">
                  <p style={{ color }} className="text-xl font-black">{value}</p>
                  <p style={{ color: C.textMuted }} className="text-[11px] font-semibold mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Accès rapide ─────────────────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${C.border}` }} className="mt-6 pt-6">
        <p style={{ color: C.textMuted }} className="text-xs font-bold uppercase tracking-wider mb-3">Accès rapides</p>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Gérer les demandes', icon: 'assignment_turned_in', href: '/admin/requests', accent: C.blue },
            { label: 'Liste des utilisateurs', icon: 'group', href: '/admin/users', accent: C.navyMid },
          ].map(({ label, icon, href, accent }) => (
            <a key={label} href={href}
               style={{ background: accent, color: C.white }}
               className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold hover:opacity-80 transition-opacity shadow-sm">
              <span className="material-symbols-outlined notranslate text-[18px]">{icon}</span>
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
