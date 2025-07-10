import React, { useState } from 'react';
import { LogOut, User, Settings, Bell, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AccountSettings from '../Management/AccountSettings';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'manager': return 'Gestionnaire';
      case 'client': return 'Client'; // <-- Utilisateur qui confie ses débiteurs
      case 'debiteur': return 'Débiteur'; // <-- Nouveau rôle pour débiteur
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'client': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const notifications = [
    {
      id: '1',
      title: 'Nouvelle facture en retard',
      message: 'La facture #FAC-2024-005 est en retard de 15 jours',
      time: '10 minutes',
      read: false,
      type: 'alert'
    },
    {
      id: '2',
      title: 'Paiement reçu',
      message: 'Un paiement de 2500€ a été reçu pour la facture #FAC-2024-002',
      time: '2 heures',
      read: true,
      type: 'success'
    },
    {
      id: '3',
      title: 'Rappel de rendez-vous',
      message: 'Appel débiteur prévu demain à 14h00',
      time: '5 heures',
      read: false,
      type: 'info'
    }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Bouton menu mobile */}
            <button 
              className="md:hidden p-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            
            <h1 className="text-2xl font-bold text-gray-900">MEWI Recouvrement</h1>
            
            {/* Barre de recherche */}
            <div className="hidden md:flex relative">
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button 
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-5 w-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="p-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">Notifications</h3>
                      <span className="text-xs text-blue-600 cursor-pointer">Marquer tout comme lu</span>
                    </div>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        Aucune notification
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {notifications.map(notification => (
                          <div 
                            key={notification.id} 
                            className={`p-3 hover:bg-gray-50 cursor-pointer ${notification.read ? '' : 'bg-blue-50'}`}
                          >
                            <div className="flex items-start">
                              <div className={`p-1 rounded-full mt-0.5 mr-3 ${
                                notification.type === 'alert' ? 'bg-red-100' : 
                                notification.type === 'success' ? 'bg-green-100' : 'bg-blue-100'
                              }`}>
                                <div className={`h-2 w-2 rounded-full ${
                                  notification.type === 'alert' ? 'bg-red-600' : 
                                  notification.type === 'success' ? 'bg-green-600' : 'bg-blue-600'
                                }`}></div>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                                <p className="text-xs text-gray-400 mt-1">Il y a {notification.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 border-t border-gray-200 text-center">
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-800">Voir toutes les notifications</a>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user?.role || '')}`}>
                {getRoleLabel(user?.role || '')}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setShowSettings(true)}
              >
                <Settings className="h-5 w-5" />
              </button>
              <button 
                onClick={logout}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Menu mobile */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t border-gray-200 p-4">
          <div className="flex flex-col space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            
            <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg">
              <User className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Mon profil</span>
            </button>
            
            <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Notifications</span>
            </button>
            
            <button 
              className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Paramètres</span>
            </button>
            
            <button 
              onClick={logout}
              className="flex items-center space-x-2 p-2 hover:bg-red-50 text-red-600 rounded-lg"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Modal de paramètres */}
      <AccountSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </header>
  );
};

export default Header;