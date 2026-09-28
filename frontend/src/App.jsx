import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import PendingAccess from './pages/PendingAccess';
import RejectedAccess from './pages/RejectedAccess';
import ActivateAccount from './pages/ActivateAccount';
import DashboardLayout from './layouts/DashboardLayout';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminRequests from './pages/AdminRequests';
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
import { Toaster } from 'sonner';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/pending" element={<PendingAccess />} />
        <Route path="/rejected" element={<RejectedAccess />} />
        <Route path="/activate" element={<ActivateAccount />} />
        
        {/* Dashboard Routes with Layout */}
        <Route element={<DashboardLayout />}>
          <Route path="/superadmin" element={<SuperAdminDashboard />} />
          <Route path="/superadmin/requests" element={<AdminRequests />} />
          <Route path="/superadmin/admins" element={<SuperAdminDashboard />} />
          <Route path="/superadmin/users" element={<SuperAdminDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Apprenant — layout propre intégré */}
        <Route element={<ApprenantLayout />}>
          <Route path="/apprenant" element={<ApprenantDashboard />} />
          <Route path="/apprenant/planning" element={<ApprenantPlanning />} />
          <Route path="/apprenant/evaluations" element={<ApprenantEvaluations />} />
          <Route path="/apprenant/paiements" element={<ApprenantPaiements />} />
          <Route path="/apprenant/formations" element={<ApprenantFormations />} />
          <Route path="/apprenant/documents" element={<ApprenantDocuments />} />
        </Route>
        
        {/* Parent — layout propre intégré */}
        <Route path="/parent/*" element={<ParentDashboard />} />

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
      </Routes>
    </AuthProvider>
  );
}

export default App;
