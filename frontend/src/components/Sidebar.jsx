import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-[#dfe3e7] flex flex-col z-20 shadow-sm">
      <div className="h-16 flex items-center px-6 border-b border-[#dfe3e7]">
        <span className="text-xl font-extrabold text-[#001026] tracking-tight">AZ_PULSE</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <NavLink to="/superadmin" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${isActive ? 'bg-[#004ad1] text-white shadow-md' : 'text-[#44474e] hover:bg-[#f0f4f8] hover:text-[#001026]'}`}>
          <span className="material-symbols-outlined text-[20px]">dashboard</span>
          Super Admin
        </NavLink>
        <NavLink to="/admin" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${isActive ? 'bg-[#004ad1] text-white shadow-md' : 'text-[#44474e] hover:bg-[#f0f4f8] hover:text-[#001026]'}`}>
          <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
          Administrateur
        </NavLink>
      </nav>
      <div className="p-4 border-t border-[#dfe3e7] bg-[#f9fbfd]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-[#dfe3e7] flex items-center justify-center text-[#004ad1] font-extrabold shadow-sm">
            US
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-[#001026] truncate">Utilisateur</p>
            <p className="text-[11px] font-semibold text-[#16a34a] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]"></span>
              En ligne
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
