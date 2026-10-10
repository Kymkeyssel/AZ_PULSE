import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { useAuth } from '../../../contexts/AuthContext';

/**
 * Navigation de l'espace collaborateur.
 *
 * La liste de liens est calculée à partir des permissions réellement
 * détenues, exposées par Symfony via /api/auth/me. Le menu s'adapte donc au
 * profil (Commercial, Formateur, Support IT...) sans que le rôle n'ait
 * besoin d'être codé en dur ici.
 */
const ResponsableSidebar = () => {
  const { fullName, initials, primaryRole, primaryRoleLabel, hasPermission, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const toggle = () => setMenuOpen(open => !open);
    window.addEventListener('azpulse:toggle-sidebar', toggle);
    return () => window.removeEventListener('azpulse:toggle-sidebar', toggle);
  }, []);

  /**
   * Règle de navigation : `perm` est la permission Symfony requise.
   * Si aucune permission n'est exigée, le lien est toujours visible.
   */
  const LINKS = [
    { to: '/responsable',              end: true, icon: 'dashboard',       label: 'Tableau de bord', perm: null },
    { to: '/responsable/relances',     icon: 'task_alt',      label: 'Relances',        perm: 'crm.read' },
    { to: '/responsable/crm',          icon: 'ads_click',     label: 'Pipeline',        perm: 'crm.read' },
    { to: '/responsable/clients',      icon: 'contacts',      label: 'Clients',         perm: 'crm.read' },
    { to: '/responsable/projets',      icon: 'folder_special',  label: 'Projets',         perm: 'workspace.read' },
    { to: '/responsable/formations',   icon: 'school',          label: 'Formations',      perm: 'formation.read' },
    { to: '/responsable/infrastructure', icon: 'dns',            label: 'Infrastructure',  perm: 'it.read' },
    { to: '/responsable/documents',    icon: 'menu_book',       label: 'Documents',       perm: 'knowledge.read' },
    { to: '/responsable/analytics',    icon: 'insights',        label: 'Analytics',       perm: 'analytics.read' },
    { to: '/responsable/ia',           icon: 'psychology',      label: 'AI Workspace',    perm: 'ai.read' },
    { to: '/profil',                    icon: 'manage_accounts', label: 'Mon profil',      perm: null },
  ];

  const ROLE_MODULES = {
    RESPONSABLE_CRM: ['crm', 'crm.read'],
    RESPONSABLE_FORMATION: ['formations', 'formation.read'],
    FORMATEUR: ['formations', 'formation.read'],
    RESPONSABLE_IT: ['infrastructure', 'it.read'],
    RESPONSABLE_KNOWLEDGE: ['documents', 'knowledge.read'],
    RESPONSABLE_WORKSPACE: ['projets', 'workspace.read'],
    RESPONSABLE_ANALYTICS: ['analytics', 'analytics.read'],
  };
  const [homePath] = ROLE_MODULES[primaryRole] || [];
  const roleAllowlist = {
    RESPONSABLE_CRM: ['/responsable', '/responsable/crm', '/responsable/clients', '/responsable/relances', '/responsable/ia', '/profil'],
    RESPONSABLE_FORMATION: ['/responsable', '/responsable/formations', '/responsable/formations/paiements', '/responsable/ia', '/profil'],
    FORMATEUR: ['/responsable', '/responsable/formations', '/responsable/ia', '/profil'],
    RESPONSABLE_IT: ['/responsable', '/responsable/infrastructure', '/responsable/tickets', '/responsable/ia', '/profil'],
    RESPONSABLE_KNOWLEDGE: ['/responsable', '/responsable/documents', '/responsable/ia', '/profil'],
    RESPONSABLE_WORKSPACE: ['/responsable', '/responsable/projets', '/responsable/ia', '/profil'],
    RESPONSABLE_ANALYTICS: ['/responsable', '/responsable/analytics', '/responsable/ia', '/profil'],
  };
  const allowed = roleAllowlist[primaryRole];
  const visibleLinks = LINKS
    .filter(l => !allowed || allowed.includes(l.to))
    .filter(l => !(homePath && l.to === '/responsable'))
    .filter(l => !l.perm || hasPermission(l.perm));

  return (
    <aside className={`responsable-sidebar fixed left-2 top-2 bottom-2 w-64 text-white z-50 flex flex-col shadow-xl rounded-2xl border border-white/15 select-none overflow-hidden transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-[110%]'} lg:translate-x-0`}>

      {/* ── Brand ─────────────────────────────────────────────────────── */}
      <div className="h-16 px-4 flex items-center justify-between bg-[#001026]/70 border-b border-white/10">
        <div className="flex flex-col">
          <span className="font-extrabold text-sm tracking-tight text-white leading-tight">AZ PULSE</span>
          <span className="text-[9px] uppercase font-bold tracking-widest text-cyan-200">{primaryRoleLabel || 'Espace Responsable'}</span>
        </div>
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="hidden text-[#b5c4ff] hover:text-white transition-colors"
          type="button"
          aria-label="Basculer le menu"
        >
          <span className="material-symbols-outlined notranslate text-[20px]">menu</span>
        </button>
      </div>

      {/* ── Spécialisation attribuée ───────────────────────────────────── */}
      <div className="px-4 py-3 bg-[#001026]/40 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#004ad1] to-[#001026] flex items-center justify-center font-extrabold text-xs ring-1 ring-[#fbbf24]/40 flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-white truncate">{fullName ?? '…'}</p>
          <p className="text-[10px] text-cyan-200 truncate">{primaryRoleLabel || primaryRole?.replace('RESPONSABLE_', 'Resp. ') || 'Responsable'}</p>
          </div>
        </div>
      </div>

      {/* ── Liens ──────────────────────────────────────────────────────── */}
      <nav className={`${menuOpen ? 'block' : 'hidden'} lg:flex flex-1 overflow-y-auto py-2.5 px-3 space-y-0.5 text-xs font-medium flex-col`}>
        {visibleLinks.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-white/15 text-white font-semibold shadow-lg ring-1 ring-white/15 translate-x-0.5'
                  : 'text-white/70 hover:bg-white/10 hover:text-white hover:translate-x-0.5'
              }`
            }
          >
            <span className="material-symbols-outlined notranslate text-[18px]">{l.icon}</span>
            <span>{l.label}</span>
          </NavLink>
        ))}

        {visibleLinks.length === 0 && (
          <p className="text-[11px] text-white/40 px-3 py-4 leading-relaxed">
            Aucun module ne vous est encore accessible.
          </p>
        )}
      </nav>

      {/* ── Pied : déconnexion ─────────────────────────────────────────── */}
      <div className="p-3 bg-[#001026]/80 border-t border-white/10">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-2 py-2 rounded-xl text-[#b5c4ff] hover:text-[#ff6b6b] transition-colors"
        >
          <span className="material-symbols-outlined notranslate text-[18px]">logout</span>
          <span className="text-[11px] font-bold">Se déconnecter</span>
        </button>
      </div>
    </aside>
  );
};

export default ResponsableSidebar;
