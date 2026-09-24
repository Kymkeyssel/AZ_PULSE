import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import PendingAccess from './pages/PendingAccess';
import RejectedAccess from './pages/RejectedAccess';
import ActivateAccount from './pages/ActivateAccount';
import DashboardLayout from './layouts/DashboardLayout';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import AdminDashboard from './pages/AdminDashboard';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/pending" element={<PendingAccess />} />
      <Route path="/rejected" element={<RejectedAccess />} />
      <Route path="/activate" element={<ActivateAccount />} />
      
      {/* Dashboard Routes with Layout */}
      <Route element={<DashboardLayout />}>
        <Route path="/superadmin" element={<SuperAdminDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
