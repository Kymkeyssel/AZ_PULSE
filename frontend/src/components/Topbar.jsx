import React from 'react';

const Topbar = () => {
  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-white/80 backdrop-blur-md border-b border-[#dfe3e7] z-10 px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f] text-[20px] group-focus-within:text-[#004ad1] transition-colors">search</span>
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="pl-10 pr-4 py-2 bg-[#f0f4f8] border border-transparent rounded-xl text-sm focus:outline-none focus:bg-white focus:border-[#004ad1]/30 focus:ring-4 focus:ring-[#004ad1]/10 w-64 transition-all"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="w-10 h-10 flex items-center justify-center rounded-xl text-[#44474e] hover:bg-[#f0f4f8] hover:text-[#001026] transition-colors relative">
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#ef4444] rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
