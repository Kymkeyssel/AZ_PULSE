import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const DashboardLayout = () => {
  return (
    <div className="bg-[#f8fafc] text-[#181c1f] font-sans antialiased min-h-screen flex relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="bg-blob-shape bg-blue-200/50 w-[500px] h-[500px] top-[-100px] left-[-100px]"></div>
      <div className="bg-blob-shape bg-purple-200/40 w-[600px] h-[600px] bottom-[-200px] right-[-100px]" style={{ animationDelay: '2s' }}></div>
      <div className="bg-blob-shape bg-teal-200/30 w-[400px] h-[400px] top-[40%] left-[30%]" style={{ animationDelay: '4s' }}></div>
      
      <Sidebar />
      <div className="pl-64 flex-1 min-h-screen flex flex-col relative z-10">
        <Topbar />
        <main className="w-full px-6 pb-12 space-y-5 flex-1 pt-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
