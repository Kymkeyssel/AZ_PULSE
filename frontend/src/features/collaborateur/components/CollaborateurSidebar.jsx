import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

/**
 * Navigation de l'espace collaborateur.
 *
 * La liste de liens est calculée à partir des permissions réellement
 * détenues, exposées par Symfony via /api/auth/me. Le menu s'adapte donc au
 * profil (Commercial, Formateur, Support IT...) sans que le rôle n'ait
 * besoin d'être codé en dur ici.
 */
const CollaborateurSidebar = () => {
  const navigate = useNavigate();
  const { fullName, initials, collaboratorProfileLabel, hasPermission } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  /**
   * Règle de navigation : `perm` est la permission Symfony requise.
   * Si aucune permission n'est exigée, le lien est toujours visible.
   */
  const LINKS = [
    { to: '/collaborateur',              end: true, icon: 'dashboard',       label: 'Tableau de bord', perm: null },
    { to: '/collaborateur/relances',     icon: 'task_alt',      label: 'Relances',        perm: 'crm.read' },
    { to: '/collaborateur/crm',          icon: 'ads_click',     label: 'Pipeline',        perm: 'crm.read' },
    { to: '/collaborateur/clients',      icon: 'contacts',      label: 'Clients',         perm: 'crm.read' },
    { to: '/collaborateur/projets',      icon: 'folder_special',  label: 'Projets',         perm: 'workspace.read' },
    { to: '/collaborateur/formations',   icon: 'school',          label: 'Formations',      perm: 'formation.read' },
    { to: '/collaborateur/infrastructure', icon: 'dns',            label: 'Infrastructure',  perm: 'it.read' },
    { to: '/collaborateur/documents',    icon: 'menu_book',       label: 'Documents',       perm: 'knowledge.read' },
    { to: '/collaborateur/analytics',    icon: 'insights',        label: 'Analytics',       perm: 'analytics.read' },
    { to: '/collaborateur/ia',           icon: 'psychology',      label: 'AI Workspace',    perm: 'ai.read' },
  ];

  const visibleLinks = LINKS.filter(l => !l.perm || hasPermission(l.perm));

  return (
    <aside className="fixed left-2 top-2 bottom-2 w-64 bg-[#0b2545] text-white z-50 flex flex-col shadow-xl rounded-2xl border border-[#001026]/40 select-none overflow-hidden">

      {/* ── Brand ─────────────────────────────────────────────────────── */}
      <div className="h-16 px-4 flex items-center justify-between bg-[#001026]/70 border-b border-white/10">
        <div className="flex flex-col">
          <span className="font-extrabold text-sm tracking-tight text-white leading-tight">AZ PULSE</span>
          <span className="text-[9px] uppercase font-bold tracking-widest text-[#fbbf24]">Espace Collaborateur</span>
        </div>
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="lg:hidden text-[#b5c4ff] hover:text-white transition-colors"
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
            <p className="text-[10px] text-[#fbbf24] truncate">{collaboratorProfileLabel ?? 'Collaborateur'}</p>
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
              `flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#004ad1] text-white font-semibold shadow-sm'
                  : 'text-[#b5c4ff] hover:bg-[#001026] hover:text-white'
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
          onClick={() => { localStorage.removeItem('az_pulse_token'); navigate('/'); }}
          className="w-full flex items-center gap-2.5 px-2 py-2 rounded-xl text-[#b5c4ff] hover:text-[#ff6b6b] transition-colors"
        >
          <span className="material-symbols-outlined notranslate text-[18px]">logout</span>
          <span className="text-[11px] font-bold">Se déconnecter</span>
        </button>
      </div>
    </aside>
  );
};

export default CollaborateurSidebar;
