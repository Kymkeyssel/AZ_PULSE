import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const DashboardLayout = () => {
  return (
    <div className="bg-[#f6fafe] text-[#181c1f] font-sans antialiased min-h-screen flex relative">
      <Sidebar />
      <div className="pl-64 flex-1 min-h-screen flex flex-col bg-[#f6fafe]">
        <Topbar />
        <main className="w-full px-6 pb-12 space-y-5 flex-1 pt-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
