import { Outlet, Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import ResponsableSidebar from '../components/ResponsableSidebar';

/**
 * Layout de l'espace collaborateur.
 *
 * Sert de garde-fou d'interface : si un utilisateur dont le rôle n'entre pas
 * dans le périmètre des espaces « responsable » tente d'atteindre cette URL,
 * il est renvoyé vers l'écran 403.
 *
 * Rappel important (règle structurante n°3) : ceci n'est PAS une barrière de
 * sécurité. Une éventuelle erreur ici se traduit par l'affichage d'un écran
 * vide, jamais par un accès indû. La vraie barrière reste `#[IsGranted]`
 * côté Symfony sur chaque endpoint.
 */
const ResponsableLayout = () => {
  const { user, loadingUser, primaryRole, primaryRoleLabel, fullName, initials } = useAuth();
  const location = useLocation();
  const pageNames = {
    '/responsable/crm': 'Pipeline commercial', '/responsable/clients': 'Portefeuille clients',
    '/responsable/relances': 'Relances commerciales', '/responsable/projets': 'Workspace projets',
    '/responsable/formations': 'Espace formation', '/responsable/infrastructure': 'Infrastructure & IT',
    '/responsable/tickets': 'Centre de support', '/responsable/documents': 'Knowledge Hub',
    '/responsable/analytics': 'Analytics', '/responsable/ia': 'AI Workspace',
  };
  const pageName = pageNames[location.pathname] || 'Mon espace';

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6fafe]">
        <div className="animate-spin w-10 h-10 border-4 border-[#004ad1] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Redirection vers /403 et non vers /activate : « vous n'avez pas le droit
  // d'être ici » et « vous devez définir votre mot de passe » sont deux
  // messages sans rapport, et le second exposait l'écran deActivation à
  // quiconque butait sur cette route.
  if (!primaryRole?.startsWith('RESPONSABLE_') && !['FORMATEUR', 'COLLABORATEUR'].includes(primaryRole)) {
    return <Navigate to="/403" replace />;
  }

  return (
    <div className="responsable-shell text-[#181c1f] font-sans antialiased min-h-screen flex relative">
      <ResponsableSidebar />
      <button type="button" onClick={() => window.dispatchEvent(new Event('azpulse:toggle-sidebar'))} className="lg:hidden fixed bottom-5 left-5 z-[60] w-12 h-12 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/30 grid place-items-center" aria-label="Ouvrir le menu"><span className="material-symbols-outlined">menu</span></button>
      <div className="lg:pl-64 flex-1 min-w-0 min-h-screen flex flex-col">
        <header className="responsable-topbar sticky top-0 z-30 mx-4 mt-3 lg:mx-6 px-4 sm:px-6 h-[68px] rounded-2xl flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-blue-600 truncate">{primaryRoleLabel || 'Espace Responsable'}</p>
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 truncate">{pageName}</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:block text-xs font-semibold text-slate-500">{fullName}</span>
            <Link to="/profil" title="Gérer mon profil" className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white grid place-items-center text-xs font-black shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 transition-transform">{initials}</Link>
          </div>
        </header>
        <main className="w-full px-4 sm:px-6 py-5 flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ResponsableLayout;
