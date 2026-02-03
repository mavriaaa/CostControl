
import React from 'react';
import { 
  LayoutDashboard, 
  HardHat, 
  Wallet, 
  Package, 
  Users, 
  BarChart3,
  Settings,
  Construction
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projeler', icon: HardHat },
    { id: 'expenses', label: 'Harcamalar', icon: Wallet },
    { id: 'inventory', label: 'Depo / Stok', icon: Package },
    { id: 'labor', label: 'Puantaj', icon: Users },
    { id: 'reports', label: 'Raporlar & AI', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <Construction className="text-amber-400" size={32} />
        <h1 className="text-xl font-bold tracking-tight">CostControl<span className="text-amber-400">Pro</span></h1>
      </div>
      
      <nav className="flex-1 mt-6 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id 
                    ? 'bg-amber-500 text-white shadow-lg' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-6 border-t border-slate-800">
        <button className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors">
          <Settings size={20} />
          <span>Ayarlar</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
