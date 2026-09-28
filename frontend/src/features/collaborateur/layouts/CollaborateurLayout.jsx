import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import CollaborateurSidebar from '../components/CollaborateurSidebar';

/**
 * Layout de l'espace collaborateur.
 *
 * Sert de garde-fou d'interface : si un utilisateur sans rôle COLLABORATEUR
 * tente d'atteindre cette URL, il est renvoyé vers l'écran d'activation.
 *
 * Rappel important (règle structurante n°3) : ceci n'est PAS une barrière de
 * sécurité. Une éventuelle erreur ici se traduit par l'affichage d'un écran
 * vide, jamais par un accès indû. La vraie barrière reste `#[IsGranted]`
 * côté Symfony sur chaque endpoint.
 */
const CollaborateurLayout = () => {
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

  if (primaryRole !== 'COLLABORATEUR') {
    return <Navigate to="/activate" replace />;
  }

  return (
    <div className="bg-[#f6fafe] text-[#181c1f] font-sans antialiased min-h-screen flex relative">
      <CollaborateurSidebar />
      <div className="pl-64 flex-1 min-h-screen flex flex-col bg-[#f6fafe]">
        <main className="w-full px-6 py-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CollaborateurLayout;
