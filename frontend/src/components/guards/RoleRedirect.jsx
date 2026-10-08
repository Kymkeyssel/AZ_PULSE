import React from 'react';

import { Navigate } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';

/**
 * Aiguillage central : chaque utilisateur est envoyé vers l'espace correspondant
 * à son rôle principal (§4 — « AZ PULSE ne donne pas la même interface à tous »).
 *
 * Sert aussi de destination de repli quand une garde de route refuse l'accès
 * (`/redirect`) : impossible d'atterrir sur un écran interdit.
 */
const RoleRedirect = () => {
  const { user, loadingUser, primaryRole } = useAuth();

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6fafe]">
        <div className="animate-spin w-10 h-10 border-4 border-[#004ad1] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  const SPACE_BY_ROLE = {
    SUPER_ADMIN:   '/superadmin',
    ADMIN:         '/admin',
    APPRENANT:     '/apprenant',
    PARENT:        '/parent',
    COLLABORATEUR: '/collaborateur',
  };

  // Si l'utilisateur possède une route d'interface assignée par le backend,
  // ou si c'est un responsable, on utilise user.interfaceRoute
  if (primaryRole === 'COLLABORATEUR' || primaryRole?.startsWith('RESPONSABLE_')) {
    return <Navigate to={user.interfaceRoute || '/collaborateur'} replace />;
  }

  return <Navigate to={SPACE_BY_ROLE[primaryRole] ?? '/collaborateur'} replace />;
};

export default RoleRedirect;
