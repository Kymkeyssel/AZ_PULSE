import { Outlet, Navigate } from 'react-router-dom';
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
  const { user, loadingUser, primaryRole } = useAuth();

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
    <div className="bg-[#f6fafe] text-[#181c1f] font-sans antialiased min-h-screen flex relative">
      <ResponsableSidebar />
      <div className="pl-64 flex-1 min-h-screen flex flex-col bg-[#f6fafe]">
        <main className="w-full px-6 py-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ResponsableLayout;
