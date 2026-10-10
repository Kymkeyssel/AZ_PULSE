import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const NAV_ITEMS = [
  { path: '/parent', label: 'Suivi Académique', icon: 'monitoring', end: true },
];

NAV_ITEMS.push(
  { path: '/parent/mes-enfants', label: 'Mes enfants', icon: 'supervisor_account' },
  { path: '/parent/formations-suivi', label: 'Formations et suivi', icon: 'timeline' },
  { path: '/parent/planning', label: 'Planning', icon: 'event_available' },
  { path: '/parent/bulletins-notes', label: 'Bulletins et notes', icon: 'grade' },
  { path: '/parent/inscriptions', label: 'Inscriptions', icon: 'how_to_reg' },
  { path: '/parent/paiements-recus', label: 'Paiements et recus', icon: 'receipt_long' },
);

export const ParentSidebar = () => {
  const { fullName } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-surface-container-low shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between overflow-y-auto">
      <div className="flex flex-col">
        {/* Brand */}
        <div className="h-16 px-space-md flex items-center gap-space-sm">
          <img alt="Logo AZ Corporation" className="h-8 w-auto object-contain" src="/logo%20%20AZ.png" />
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-primary leading-tight font-bold tracking-tight">AZ PULSE</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Formation &amp; Académie</span>
          </div>
        </div>
        
        {/* Company context */}
        <div className="px-space-md py-space-xs">
          <div className="bg-surface-container rounded-xl p-space-sm flex items-center justify-between gap-space-xs">
            <div className="flex items-center gap-space-xs min-w-0">
              <div className="w-2 h-2 rounded-full bg-tertiary-fixed-dim shrink-0"></div>
              <div className="flex flex-col truncate">
                <span className="font-label-sm text-label-sm text-on-surface-variant truncate">PORTAIL FAMILLE</span>
                <span className="font-label-md text-label-md text-primary font-bold truncate">AZ Corporation SARL</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-space-md pt-space-md"></div>
        <div className="px-space-md pt-space-md pb-space-lg">
          <div className="px-space-sm pb-space-xs flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Espace Parent</span>
            <span className="font-label-sm text-label-sm text-secondary font-semibold">Tuteur</span>
          </div>
          
          <nav className="flex flex-col gap-space-xs">
            {NAV_ITEMS.map(({ path, label, icon, end }) => (
              <NavLink
                key={path}
                to={path}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-space-sm px-space-sm py-space-xs rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                      : 'font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`
                }
              >
                <span className="material-symbols-outlined notranslate text-[20px]">{icon}</span>
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Footer Profile */}
      <div className="p-space-md bg-surface-container-low">
        <div className="p-space-sm rounded-xl bg-surface-container flex items-center justify-between gap-space-xs">
          <div className="flex items-center gap-space-xs min-w-0">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined notranslate text-on-primary text-[18px]">person</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-label-md text-primary font-bold truncate">{fullName || 'Parent'}</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant truncate">Parent · AZ Académie</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
