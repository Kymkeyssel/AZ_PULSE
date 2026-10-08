import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Home, FolderKanban, GraduationCap, FileText, Receipt, HeadphonesIcon, LogOut, ChevronDown } from 'lucide-react';

const ClientSidebar = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Tableau de bord', to: '/client', icon: Home, end: true },
    { name: 'Mes Projets', to: '/client/projets', icon: FolderKanban, badge: '3' },
    { name: 'Suivi Formations', to: '/client/formations', icon: GraduationCap, badge: '2' },
    { name: 'Documents & Contrats', to: '/client/documents', icon: FileText },
    { name: 'Facturation & Paiements', to: '/client/facturation', icon: Receipt, badge: '1 ATT', warning: true },
    { name: 'Support & Tickets', to: '/client/support', icon: HeadphonesIcon, badge: '1' },
  ];

  return (
    <div className="w-64 bg-[#0b2545] text-white flex flex-col fixed inset-y-0 left-0 z-50 border-r border-[#1a365d] shadow-xl">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-[#1a365d] bg-[#07182e]">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1d63ff] rounded-lg flex items-center justify-center font-bold text-lg shadow-lg shadow-[#1d63ff]/20">
              AZ
            </div>
            <span className="text-xl font-bold tracking-tight text-white">AZ PULSE</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-[#b1c7f0] mt-1 tracking-wider">
            Portail Client & Services
          </span>
        </div>
      </div>

      {/* Client Entity Selector */}
      <div className="px-4 py-5 border-b border-[#1a365d]">
        <button className="w-full flex items-center justify-between bg-[#133058] hover:bg-[#1a3f70] transition-colors p-3 rounded-lg border border-[#1d4d8a] text-left">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white truncate">Global Tech SARL</span>
            <span className="text-xs text-[#b1c7f0] truncate mt-0.5">Compte #CLI-2025-08</span>
          </div>
          <ChevronDown className="w-4 h-4 text-[#b1c7f0]" />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <div className="text-[10px] font-bold text-[#778db2] uppercase tracking-widest mb-3 px-2">Espace Client</div>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 group ${
                isActive
                  ? 'bg-[#1d63ff]/10 text-[#1d63ff] border border-[#1d63ff]/20'
                  : 'text-[#b1c7f0] hover:bg-[#133058] hover:text-white'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span>{item.name}</span>
            </div>
            {item.badge && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                item.warning ? 'bg-[#ffb800]/20 text-[#ffb800] border border-[#ffb800]/30' : 'bg-[#1d63ff]/20 text-[#b1c7f0]'
              }`}>
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-[#1a365d] bg-[#07182e]">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#1d63ff] to-[#003cac] flex items-center justify-center font-bold text-sm shadow-md">
              ME
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-bold text-white truncate">M. Marc Essomba</span>
              <span className="text-[11px] text-[#778db2] truncate">DSI • Global Tech SARL</span>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-semibold text-[#b1c7f0] hover:bg-white/5 hover:text-white transition-colors group"
          >
            <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientSidebar;
