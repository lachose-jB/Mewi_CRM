import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Settings, 
  Phone, 
  Mail, 
  Calendar,
  CreditCard,
  UserCheck,
  Database,
  Activity,
  Shield,
  HardDrive,
  Eye,
  History,
  ChevronRight,
  ChevronLeft,
  User
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AccountSettings from '../Management/AccountSettings';
import UserAccountSettings from '../Management/UserAccountSettings';
import ManagerAccountSettings from '../Management/ManagerAccountSettings';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const getMenuItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Tableau de Bord', icon: BarChart3 },
          { id: 'users', label: 'Gestion Utilisateurs', icon: Users },
          { id: 'clients', label: 'Gestion débiteur', icon: FileText },
          { id: 'config', label: 'Configuration', icon: Settings },
          { id: 'reports', label: 'Rapports & Analyses', icon: Database },
          { id: 'monitoring', label: 'Monitoring Système', icon: Activity },
          { id: 'backup', label: 'Sauvegarde', icon: HardDrive }
        ];
      case 'manager':
        return [
          { id: 'dashboard', label: 'Tableau de Bord', icon: BarChart3 },
          { id: 'portfolio', label: 'Portefeuille', icon: FileText },
          { id: 'communications', label: 'Communications', icon: Mail },
          { id: 'calendar', label: 'Agenda', icon: Calendar },
          { id: 'calls', label: 'Appels', icon: Phone }
        ];
      case 'client':
        return [
          { id: 'dashboard', label: 'Vue d\'ensemble', icon: UserCheck },
          { id: 'dossier', label: 'Mon Dossier Détaillé', icon: Eye },
          { id: 'invoices', label: 'Mes Factures', icon: FileText },
          { id: 'payments', label: 'Paiements', icon: CreditCard },
          { id: 'history', label: 'Historique Complet', icon: History }
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const handleOpenSettings = () => {
    setShowSettings(true);
  };

  const renderSettingsModal = () => {
    if (!showSettings) return null;

    switch (user?.role) {
      case 'admin':
        return (
          <AccountSettings
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
          />
        );
      case 'manager':
        return (
          <ManagerAccountSettings
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
          />
        );
      case 'client':
        return (
          <UserAccountSettings
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-gray-50 border-r border-gray-200 h-screen transition-all duration-300`}>
        <div className="flex flex-col h-full">
          <div className="p-4 flex items-center justify-between border-b border-gray-200">
            {!collapsed && (
              <h2 className="text-lg font-semibold text-gray-900">MEWI Recouvrement</h2>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
          </div>
          
          <nav className="mt-6 flex-1 overflow-y-auto">
            <div className="px-4">
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => onTabChange(item.id)}
                        className={`w-full flex items-center ${collapsed ? 'justify-center' : 'px-4'} py-3 text-sm font-medium rounded-lg transition-colors ${
                          isActive
                            ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                        title={collapsed ? item.label : undefined}
                      >
                        <Icon className={`${collapsed ? 'mx-auto' : 'mr-3'} h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                        {!collapsed && item.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>
          
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleOpenSettings}
              className={`w-full flex items-center ${collapsed ? 'justify-center' : 'px-4'} py-3 text-sm font-medium rounded-lg transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900`}
              title={collapsed ? "Paramètres du compte" : undefined}
            >
              <User className={`${collapsed ? 'mx-auto' : 'mr-3'} h-5 w-5 text-gray-400`} />
              {!collapsed && "Mon compte"}
            </button>
          </div>
        </div>
      </aside>
      
      {renderSettingsModal()}
    </>
  );
};

export default Sidebar;