import React from 'react';

import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';

/**
 * Garde de route d'interface.
 *
 * Rappel important (règle structurante n°3) : ce composant n'est PAS une
 * barrière de sécurité. Il évite d'afficher un écran hors du périmètre de
 * l'utilisateur, et rend un refus explicite plutôt qu'un silence. La vraie
 * barrière reste `#[IsGranted]` côté Symfony sur chaque endpoint.
 *
 * @param {object}   props
 * @param {string[]} [props.roles]       Rôles autorisés (ex: ['SUPER_ADMIN','ADMIN'])
 * @param {string[]} [props.permissions] Permissions exigées (toutes exigées)
 * @param {boolean}  [props.authenticated] false = réservé aux visiteurs non connectés
 */
const ProtectedRoute = ({
  children,
  roles = null,
  permissions = null,
  authenticated = true,
}) => {
  const { user, loadingUser, roleCodes, primaryRole, hasPermission } = useAuth();
  const location = useLocation();

  // Tant que l'utilisateur n'est pas résolu, on ne redirige pas : sinon un
  // rafraîchissement de page ejecterait vers /auth avant la réponse de /auth/me.
  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6fafe]">
        <div className="animate-spin w-10 h-10 border-4 border-[#004ad1] border-t-transparent rounded-full" />
      </div>
    );
  }

  // Écrans publics (/, /auth, /pending...) : si l'utilisateur est déjà
  // connecté, on le renvoie vers son espace plutôt que de l'y laisser.
  if (!authenticated) {
    return user ? <Navigate to="/redirect" replace /> : children;
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  if (roles && !roles.includes(primaryRole) && !roles.some((r) => roleCodes.includes(r))) {
    return <Navigate to="/403" replace />;
  }

  if (permissions && !permissions.every((p) => hasPermission(p))) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default ProtectedRoute;
