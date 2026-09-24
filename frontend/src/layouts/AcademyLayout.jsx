import React from 'react';
import { Outlet } from 'react-router-dom';

const AcademyLayout = () => {
  return (
    <div className="min-h-screen bg-[#f6fafe] text-[#181c1f] font-sans antialiased">
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default AcademyLayout;
