import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const ParentTopbar = () => {
  const { fullName, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-space-lg gap-space-md">
      <div className="flex items-center gap-space-md flex-1 max-w-xl">
        <div className="relative w-full">
          <span className="material-symbols-outlined notranslate absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
          <input
            className="w-full h-10 pl-10 pr-12 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-30 shadow-sm"
            placeholder="Rechercher..."
            type="text"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-space-md">
        <div className="hidden lg:flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-primary-container text-on-primary shadow-sm">
          <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span>
          <span className="font-label-md text-label-md font-semibold tracking-wide">Pôle Académie &amp; Institut</span>
        </div>
        
        <div className="h-6 w-[1px] bg-surface-variant"></div>
        
        <div className="flex items-center gap-space-sm">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined notranslate text-on-primary text-[18px]">person</span>
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-label-md text-label-md text-primary font-bold leading-tight">{fullName || 'Parent'}</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant leading-tight">Parent / Tuteur</span>
          </div>
        </div>
        
        <button onClick={() => navigate('/profil')} className="p-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high" title="Mon profil" type="button"><span className="material-symbols-outlined">manage_accounts</span></button>
        <button 
          onClick={handleLogout}
          className="p-space-xs rounded-lg text-error hover:bg-error-container hover:text-on-error-container transition-colors" 
          title="Déconnexion" 
          type="button"
        >
          <span className="material-symbols-outlined notranslate text-[22px]">logout</span>
        </button>
      </div>
    </header>
  );
};
