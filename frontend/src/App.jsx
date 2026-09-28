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
            <Route path="/superadmin/users" element={<SuperAdminDashboard />} />
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

          {/* Modules non encore livrés : placeholders explicites */}
          <Route path="/collaborateur/projets" element={
            <ModulePlaceholder icon="folder_special" title="Workspace — En construction"
              permHint="workspace.read"
              description="Projets, tâches, échéances et livrables. L'interface arrivera après le CRM." />
          } />
          <Route path="/collaborateur/formations" element={
            <ModulePlaceholder icon="school" title="Formation — En construction"
              permHint="formation.read"
              description="Sessions, apprenants et évaluations pour les formateurs." />
          } />
          <Route path="/collaborateur/infrastructure" element={
            <ModulePlaceholder icon="dns" title="Infrastructure & IT — En construction"
              permHint="it.read"
              description="Parc informatique, incidents et maintenance, alimenté par l'intégration GLPI." />
          } />
          <Route path="/collaborateur/documents" element={
            <ModulePlaceholder icon="menu_book" title="Knowledge Hub — En construction"
              permHint="knowledge.read"
              description="Documents, versions, publication et recherche." />
          } />
          <Route path="/collaborateur/analytics" element={
            <ModulePlaceholder icon="insights" title="Analytics — En construction"
              permHint="analytics.read"
              description="KPI, tendances et rapports calculés à partir des référentiels opérationnels." />
          } />
          <Route path="/collaborateur/ia" element={
            <ModulePlaceholder icon="psychology" title="AI Workspace — En construction"
              permHint="ai.read"
              description="Assistants spécialisés, analyse contextuelle et recommandations." />
          } />
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
