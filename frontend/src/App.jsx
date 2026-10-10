
import React from 'react';

import { Routes, Route } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';

import Landing from './pages/Landing';

import Auth from './pages/Auth';

import PendingAccess from './pages/PendingAccess';

import RejectedAccess from './pages/RejectedAccess';

import ActivateAccount from './pages/ActivateAccount';

import ForgotPassword from './pages/ForgotPassword';

import ResetPassword from './pages/ResetPassword';

import DashboardLayout from './layouts/DashboardLayout';

import SuperAdminDashboard from './pages/SuperAdminDashboard';

import AdminDashboard from './pages/AdminDashboard';

import UsersManagement from './pages/UsersManagement';

import RolesPermissions from './pages/RolesPermissions';

import AdminRequests from './pages/AdminRequests';

import AuditLog from './pages/AuditLog';

import { ApprenantLayout } from './features/formation/layouts/ApprenantLayout';

import ApprenantDashboard from './features/formation/pages/ApprenantDashboard';

import ApprenantPlanning from './features/formation/pages/ApprenantPlanning';

import ApprenantEvaluations from './features/formation/pages/ApprenantEvaluations';

import ApprenantPaiements from './features/formation/pages/ApprenantPaiements';

import ApprenantFormations from './features/formation/pages/ApprenantFormations';

import ApprenantDocuments from './features/formation/pages/ApprenantDocuments';

import ParentDashboard from './pages/ParentDashboard';

import CollaborateurLayout from './features/collaborateur/layouts/CollaborateurLayout';

import CollaborateurHome from './features/collaborateur/pages/CollaborateurHome';

import CrmPipeline from './features/collaborateur/pages/CrmPipeline';

import CrmReminders from './features/collaborateur/pages/CrmReminders';

import CrmCustomers from './features/collaborateur/pages/CrmCustomers';

import ModulePlaceholder from './features/collaborateur/pages/ModulePlaceholder';

import KnowledgeHub from './features/collaborateur/pages/KnowledgeHub';
import WorkspaceProjects from './features/responsables/pages/WorkspaceProjects';
import Analytics from './features/responsables/pages/Analytics';
import AiWorkspace from './features/responsables/pages/AiWorkspace';
import ResponsableLayout from './features/responsables/layouts/ResponsableLayout';
import ResponsableHome from './features/responsables/pages/ResponsableHome';
import CrmClientDetail from './features/responsables/pages/CrmClientDetail';
import FormationOverview from './features/responsables/pages/FormationOverview';
import InfrastructureManager from './features/responsables/pages/InfrastructureManager';
import ItTicketing from './features/responsables/pages/ItTicketing';
import ResponsableKnowledgeHub from './features/responsables/pages/KnowledgeHub';

import ProtectedRoute from './components/guards/ProtectedRoute';

import RoleRedirect from './components/guards/RoleRedirect';

import ErrorBoundary from './components/guards/ErrorBoundary';

import Error403 from './pages/Error403';

import Error404 from './pages/Error404';

import Error500 from './pages/Error500';

import { Toaster } from 'sonner';

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Toaster position="top-right" richColors />
        <Routes>
          {/* ── Espace public ─────────────────────────────────────────── */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/pending" element={<PendingAccess />} />
          <Route path="/rejected" element={<RejectedAccess />} />
          <Route path="/activate" element={<ActivateAccount />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* ── Aiguillage par rôle (§4 : une interface par profil) ───── */}
          <Route path="/redirect" element={<RoleRedirect />} />

          {/* ── Espace gouvernance : Super Administrateur ─────────────── */}
          <Route
            element={
              <ProtectedRoute roles={['SUPER_ADMIN']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/superadmin" element={<SuperAdminDashboard />} />
            <Route path="/superadmin/requests" element={<AdminRequests />} />
            <Route path="/superadmin/admins" element={<SuperAdminDashboard />} />
            <Route path="/superadmin/users" element={<UsersManagement />} />
            <Route path="/superadmin/roles" element={<RolesPermissions />} />
            <Route path="/superadmin/audit" element={<AuditLog />} />
          </Route>

          {/* ── Espace gouvernance : Admin / Direction ────────────────── */}
          <Route
            element={
              <ProtectedRoute roles={['ADMIN', 'SUPER_ADMIN']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin" element={<AdminDashboard />} />
            {/* Le journal d'audit est nominatif : l'API le réserve à la
                permission `audit.read`, accordée à la Direction et au Super
                Administrateur. La route reste ouverte aux deux rôles, l'API
                tranche réellement. */}
            <Route path="/admin/audit" element={<AuditLog />} />
          </Route>

          {/* ── Espace académique : Apprenant ─────────────────────────── */}
          <Route
            element={
              <ProtectedRoute roles={['APPRENANT']}>
                <ApprenantLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/apprenant" element={<ApprenantDashboard />} />
            <Route path="/apprenant/planning" element={<ApprenantPlanning />} />
            <Route path="/apprenant/evaluations" element={<ApprenantEvaluations />} />
            <Route path="/apprenant/paiements" element={<ApprenantPaiements />} />
            <Route path="/apprenant/formations" element={<ApprenantFormations />} />
            <Route path="/apprenant/documents" element={<ApprenantDocuments />} />
          </Route>

          {/* ── Espace académique : Parent / Tuteur ───────────────────── */}
          <Route
            path="/parent/*"
            element={
              <ProtectedRoute roles={['PARENT']}>
                <ParentDashboard />
              </ProtectedRoute>
            }
          />

        {/* Collaborateur — un seul layout, le contenu est piloté par la spécialisation */}
        <Route element={<CollaborateurLayout />}>
          <Route path="/collaborateur" element={<CollaborateurHome />} />
          <Route path="/collaborateur/commercial" element={<CollaborateurHome />} />
          <Route path="/collaborateur/formateur" element={<CollaborateurHome />} />
          <Route path="/collaborateur/support-it" element={<CollaborateurHome />} />
          <Route path="/collaborateur/communication" element={<CollaborateurHome />} />

          {/* CRM — livré */}
          <Route path="/collaborateur/relances" element={<CrmReminders />} />
          <Route path="/collaborateur/crm" element={<CrmPipeline />} />
          <Route path="/collaborateur/clients" element={<CrmCustomers />} />

          {/* Modules opérationnels livrés */}
          <Route path="/collaborateur/projets" element={<WorkspaceProjects />} />
          <Route path="/collaborateur/analytics" element={<Analytics />} />
          <Route path="/collaborateur/ia" element={<AiWorkspace />} />

          <Route path="/collaborateur/clients/:id" element={<CrmClientDetail />} />
          <Route path="/collaborateur/formations" element={<FormationOverview />} />
          <Route path="/collaborateur/infrastructure" element={<InfrastructureManager />} />
          <Route path="/collaborateur/tickets" element={<ItTicketing />} />
          <Route path="/collaborateur/documents" element={<KnowledgeHub />} />
        </Route>

        {/* Espace responsable : mêmes services, navigation et contrôles RBAC. */}
        <Route element={<ResponsableLayout />}>
          <Route path="/responsable" element={<ResponsableHome />} />
          <Route path="/responsable/relances" element={<CrmReminders />} />
          <Route path="/responsable/crm" element={<CrmPipeline />} />
          <Route path="/responsable/clients" element={<CrmCustomers />} />
          <Route path="/responsable/clients/:id" element={<CrmClientDetail />} />
          <Route path="/responsable/projets" element={<WorkspaceProjects />} />
          <Route path="/responsable/formations" element={<FormationOverview />} />
          <Route path="/responsable/infrastructure" element={<InfrastructureManager />} />
          <Route path="/responsable/tickets" element={<ItTicketing />} />
          <Route path="/responsable/documents" element={<ResponsableKnowledgeHub />} />
          <Route path="/responsable/analytics" element={<Analytics />} />
          <Route path="/responsable/ia" element={<AiWorkspace />} />
        </Route>

          {/* ── Erreurs explicites ───────────────────────────────────── */}
          <Route path="/403" element={<Error403 />} />
          <Route path="/500" element={<Error500 />} />

          {/* ── Repli : aucune URL ne doit rendre d'écran vide ────────── */}
          <Route path="*" element={<Error404 />} />
        </Routes>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
