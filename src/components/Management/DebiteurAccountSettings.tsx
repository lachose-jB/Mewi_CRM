import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Key, 
  Shield, 
  Bell, 
  Eye, 
  EyeOff, 
  Save,
  X,
  Clock,
  Calendar,
  Globe,
  Settings,
  CheckCircle,
  AlertCircle,
  Lock,
  Smartphone,
  FileText,
  Upload,
  Camera,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface DebiteurAccountSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const DebiteurAccountSettings: React.FC<DebiteurAccountSettingsProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [hasChanges, setHasChanges] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // États pour les différentes sections de paramètres
  const [profileSettings, setProfileSettings] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+33 6 12 34 56 78',
    address: '123 Rue de la Paix, 75001 Paris',
    company: 'Martin SARL',
    language: 'fr',
    timezone: 'Europe/Paris',
    avatar: null as File | null,
    bio: 'Débiteur'
  });

  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorAuth: false,
    loginNotifications: true,
    sessionTimeout: 30,
    lastPasswordChange: '2024-11-15',
    lastLogin: '2024-12-15 14:30:00'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    paymentReminders: true,
    dueReminders: true,
    statusUpdates: true,
    marketingEmails: false
  });

  const handleSave = () => {
    // Simulation de sauvegarde
    console.log('Saving settings:', {
      profile: profileSettings,
      security: securitySettings,
      notifications: notificationSettings
    });
    
    setSuccessMessage('Paramètres sauvegardés avec succès');
    setTimeout(() => setSuccessMessage(null), 3000);
    
    setHasChanges(false);
  };

  const handlePasswordChange = () => {
    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
    
    if (securitySettings.newPassword.length < 8) {
      setErrorMessage('Le mot de passe doit contenir au moins 8 caractères');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
    
    // Simulation de changement de mot de passe
    console.log('Changing password');
    setSuccessMessage('Mot de passe modifié avec succès');
    setTimeout(() => setSuccessMessage(null), 3000);
    
    setSecuritySettings({
      ...securitySettings,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      lastPasswordChange: new Date().toISOString().split('T')[0]
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileSettings({
        ...profileSettings,
        avatar: e.target.files[0]
      });
      setHasChanges(true);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 p-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Paramètres du compte</h3>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 md:hidden">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex flex-col items-center mb-6 pb-6 border-b border-gray-200">
            <div className="relative mb-3">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                {profileSettings.avatar ? (
                  <img 
                    src={URL.createObjectURL(profileSettings.avatar)} 
                    alt="Avatar" 
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-semibold text-blue-700">
                    {profileSettings.name.split(' ').map(n => n[0]).join('')}
                  </span>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer">
                <Camera className="h-4 w-4" />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <h4 className="font-medium text-gray-900 text-center">{profileSettings.name}</h4>
            <p className="text-sm text-gray-500 text-center">Débiteur</p>
          </div>
          
          <nav className="space-y-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </nav>
          
          <div className="mt-auto pt-6">
            <button 
              onClick={logout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4 mr-3 flex-shrink-0" />
              <span className="truncate">Déconnexion</span>
            </button>
          </div>
          
          {hasChanges && (
            <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-yellow-600 mr-2 flex-shrink-0" />
                <span className="text-sm text-yellow-700">Modifications non sauvegardées</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {/* Notifications de succès/erreur */}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-sm text-green-700">{successMessage}</span>
                </div>
              </div>
            )}
            
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-600 mr-2 flex-shrink-0" />
                  <span className="text-sm text-red-700">{errorMessage}</span>
                </div>
              </div>
            )}

            {/* Onglet Profil */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Informations personnelles</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        value={profileSettings.name}
                        onChange={(e) => {
                          setProfileSettings({...profileSettings, name: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileSettings.email}
                        onChange={(e) => {
                          setProfileSettings({...profileSettings, email: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        value={profileSettings.phone}
                        onChange={(e) => {
                          setProfileSettings({...profileSettings, phone: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Entreprise
                      </label>
                      <input
                        type="text"
                        value={profileSettings.company}
                        onChange={(e) => {
                          setProfileSettings({...profileSettings, company: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse
                    </label>
                    <textarea
                      value={profileSettings.address}
                      onChange={(e) => {
                        setProfileSettings({...profileSettings, address: e.target.value});
                        setHasChanges(true);
                      }}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Paramètres régionaux</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Langue
                      </label>
                      <select
                        value={profileSettings.language}
                        onChange={(e) => {
                          setProfileSettings({...profileSettings, language: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fuseau horaire
                      </label>
                      <select
                        value={profileSettings.timezone}
                        onChange={(e) => {
                          setProfileSettings({...profileSettings, timezone: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
                        <option value="Europe/London">Europe/London (GMT+0)</option>
                        <option value="America/New_York">America/New_York (GMT-5)</option>
                        <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Sécurité */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Changer le mot de passe</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mot de passe actuel
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={securitySettings.currentPassword}
                          onChange={(e) => setSecuritySettings({...securitySettings, currentPassword: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nouveau mot de passe
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={securitySettings.newPassword}
                          onChange={(e) => setSecuritySettings({...securitySettings, newPassword: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Le mot de passe doit contenir au moins 8 caractères, incluant une majuscule, un chiffre et un caractère spécial.
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmer le nouveau mot de passe
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={securitySettings.confirmPassword}
                          onChange={(e) => setSecuritySettings({...securitySettings, confirmPassword: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <button
                      onClick={handlePasswordChange}
                      disabled={!securitySettings.currentPassword || !securitySettings.newPassword || !securitySettings.confirmPassword}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Changer le mot de passe
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Authentification à deux facteurs</h4>
                  <div className="flex items-center justify-between py-2">
                    <div className="pr-4">
                      <p className="text-sm font-medium text-gray-700">Activer l'authentification à deux facteurs</p>
                      <p className="text-xs text-gray-500">Renforce la sécurité de votre compte avec une vérification supplémentaire</p>
                    </div>
                    <button
                      onClick={() => {
                        setSecuritySettings({...securitySettings, twoFactorAuth: !securitySettings.twoFactorAuth});
                        setHasChanges(true);
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        securitySettings.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        securitySettings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Historique de connexion</h4>
                  <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                    <div className="space-y-4 min-w-[300px]">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-200">
                        <div className="flex items-start">
                          <Clock className="h-4 w-4 text-gray-400 mt-1 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">2024-12-15 14:30:00</p>
                            <p className="text-xs text-gray-500">Chrome / Windows</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 mt-1 sm:mt-0">IP: 192.168.1.1</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-200">
                        <div className="flex items-start">
                          <Clock className="h-4 w-4 text-gray-400 mt-1 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">2024-12-14 09:15:00</p>
                            <p className="text-xs text-gray-500">Chrome / Windows</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 mt-1 sm:mt-0">IP: 192.168.1.1</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Préférences de notification</h4>
                  <div className="space-y-4">
                    {Object.entries({
                      emailNotifications: 'Notifications par email',
                      smsNotifications: 'Notifications par SMS',
                      pushNotifications: 'Notifications push',
                      paymentReminders: 'Rappels de paiement',
                      dueReminders: 'Rappels d\'échéance',
                      statusUpdates: 'Mises à jour de statut',
                      marketingEmails: 'Emails marketing'
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <span className="text-sm text-gray-700 pr-4">{label}</span>
                        <button
                          onClick={() => {
                            setNotificationSettings({
                              ...notificationSettings,
                              [key]: !notificationSettings[key as keyof typeof notificationSettings]
                            });
                            setHasChanges(true);
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notificationSettings[key as keyof typeof notificationSettings] ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notificationSettings[key as keyof typeof notificationSettings] ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="font-medium text-blue-900">À propos des notifications</h5>
                      <p className="text-sm text-blue-700 mt-1">
                        Les notifications vous permettent de rester informé des événements importants liés à votre compte et à vos dossiers.
                        Vous pouvez les recevoir par email, SMS ou directement dans l'application.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 md:p-6 bg-gray-50">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="mb-3 sm:mb-0 text-center sm:text-left">
                <p className="text-sm text-gray-500">
                  Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 sm:px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={!hasChanges}
                  className="flex items-center px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>Sauvegarder</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebiteurAccountSettings;