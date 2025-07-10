import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Settings, 
  Phone, 
  Mail, 
  Calendar,
  User,
  Database,
  Activity,
  Shield,
  HardDrive,
  Eye,
  History,
  ChevronRight,
  ChevronLeft,
  CreditCard,
  LogOut
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const getMenuItems = () => {
    if (!user) return [];

    switch (user.role) {
      case 'admin':
        return [
          { id: 'admin/dashboard', label: 'Tableau de Bord', icon: BarChart3 },
          { id: 'admin/users', label: 'Gestion Utilisateurs', icon: Users },
          { id: 'admin/clients', label: 'Gestion Clients', icon: FileText },
          { id: 'admin/config', label: 'Configuration', icon: Settings },
          { id: 'admin/reports', label: 'Rapports & Analyses', icon: Database },
          { id: 'admin/monitoring', label: 'Monitoring Système', icon: Activity },
          { id: 'admin/backup', label: 'Sauvegarde', icon: HardDrive }
        ];
      case 'manager':
        return [
          { id: 'manager/dashboard', label: 'Tableau de Bord', icon: BarChart3 },
          { id: 'manager/debtors', label: 'Débiteurs', icon: FileText },
          { id: 'manager/communications', label: 'Communications', icon: Mail },
          { id: 'manager/calendar', label: 'Agenda', icon: Calendar },
          { id: 'manager/calls', label: 'Appels', icon: Phone }
        ];
      case 'client':
        return [
          { id: 'client/dashboard', label: 'Tableau de Bord', icon: BarChart3 },
          { id: 'debtors', label: 'Mes Débiteurs', icon: Users },
          { id: 'invoices', label: 'Factures', icon: FileText },
          { id: 'history', label: 'Historique', icon: History }
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const handleNavigation = (path: string) => {
    navigate(`/${path}`);
  };

  const isActive = (path: string) => {
    return location.pathname === `/${path}`;
  };

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 h-screen transition-all duration-300 flex flex-col`}>
      <div className="flex items-center justify-between px-4 py-5 border-b border-gray-200">
        <div className={`flex items-center ${collapsed ? 'justify-center w-full' : ''}`}>
          <div className="bg-blue-600 text-white p-2 rounded">
            <BarChart3 className="h-6 w-6" />
          </div>
          {!collapsed && (
            <div className="ml-3">
              <h2 className="text-lg font-bold text-gray-900">MEWI</h2>
              <p className="text-xs text-gray-500">Recouvrement</p>
            </div>
          )}
        </div>
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg ${collapsed ? '' : ''}`}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>
      
      <nav className="mt-5 px-2 flex-1 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.id);
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center ${collapsed ? 'justify-center' : 'justify-start'} px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className={`${collapsed ? 'mx-auto' : 'mr-3'} h-5 w-5 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>
      </nav>
      
      <div className="px-2 pb-5 mt-auto">
        <div className="border-t border-gray-200 pt-5 mt-5">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'px-3'} mb-3`}>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            )}
            <button
              onClick={() => navigate('/profile')}
              className={`${collapsed ? '' : 'ml-1'} p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors`}
              title="Profil"
            >
              <User className="h-5 w-5" />
            </button>
          </div>
          
          <button
            onClick={logout}
            className={`w-full flex items-center ${collapsed ? 'justify-center' : ''} px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors`}
          >
            <LogOut className={`${collapsed ? 'mx-auto' : 'mr-3'} h-5 w-5`} />
            {!collapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;