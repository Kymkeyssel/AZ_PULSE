import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import ClientSidebar from '../components/ClientSidebar';
import Topbar from '../../../components/Topbar';

const ClientLayout = () => {
  const { user, loadingUser, primaryRole } = useAuth();

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7fb]">
        <div className="animate-spin w-10 h-10 border-4 border-[#1d63ff] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (primaryRole !== 'CLIENT') {
    return <Navigate to="/redirect" replace />;
  }

  return (
    <div className="bg-[#f4f7fb] text-[#181c1f] font-sans antialiased min-h-screen flex relative">
      <ClientSidebar />
      <div className="pl-64 flex-1 min-h-screen flex flex-col bg-[#f4f7fb]">
        {/* We reuse the generic Topbar but we can customize if needed */}
        <Topbar />
        <main className="w-full px-6 py-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;
