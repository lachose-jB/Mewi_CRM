import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  Globe, 
  Bell, 
  Shield, 
  Database, 
  Mail, 
  MessageSquare, 
  Phone, 
  Palette, 
  Code, 
  Users, 
  Calendar, 
  DollarSign,
  Clock,
  Key,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Plus,
  Edit3,
  CheckCircle,
  AlertTriangle,
  Info,
  X
} from 'lucide-react';

interface SystemSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const SystemSettings: React.FC<SystemSettingsProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);

  // États pour les différentes sections de paramètres
  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'CRM Recouvrement Pro',
    companyAddress: '123 Rue de la Finance, 75001 Paris',
    companyPhone: '+33 1 23 45 67 89',
    companyEmail: 'contact@crm-recouvrement.fr',
    website: 'https://www.crm-recouvrement.fr',
    currency: 'EUR',
    timezone: 'Europe/Paris',
    dateFormat: 'DD/MM/YYYY',
    language: 'fr',
    fiscalYear: 'calendar',
    businessHours: {
      start: '09:00',
      end: '18:00',
      days: ['1', '2', '3', '4', '5']
    }
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    dailyReports: true,
    weeklyReports: true,
    monthlyReports: true,
    criticalAlerts: true,
    paymentAlerts: true,
    systemMaintenance: true,
    newClientAlerts: true,
    overdueAlerts: true,
    escalationAlerts: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: 8,
    passwordRequireSpecial: true,
    passwordRequireNumbers: true,
    passwordRequireUppercase: true,
    passwordExpiry: 90,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    twoFactorAuth: false,
    ipWhitelist: '',
    auditLog: true,
    dataRetention: 365,
    backupFrequency: 'daily',
    encryptionEnabled: true
  });

  const [integrationSettings, setIntegrationSettings] = useState({
    emailProvider: 'smtp',
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    smtpEncryption: 'tls',
    smsProvider: 'twilio',
    smsApiKey: '',
    smsApiSecret: '',
    calendarSync: false,
    crmIntegration: '',
    accountingIntegration: '',
    paymentGateway: '',
    webhookUrl: '',
    apiRateLimit: 1000
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    accentColor: '#F59E0B',
    logoUrl: '',
    faviconUrl: '',
    customCss: '',
    compactMode: false,
    showAnimations: true,
    fontSize: 'medium',
    sidebarCollapsed: false
  });

  const handleSave = () => {
    // Simulation de sauvegarde
    console.log('Saving settings:', {
      general: generalSettings,
      notifications: notificationSettings,
      security: securitySettings,
      integrations: integrationSettings,
      appearance: appearanceSettings
    });
    setHasChanges(false);
    // Afficher un message de succès
  };

  const handleReset = () => {
    // Réinitialiser aux valeurs par défaut
    setHasChanges(false);
  };

  const handleExportSettings = () => {
    const settings = {
      general: generalSettings,
      notifications: notificationSettings,
      security: securitySettings,
      integrations: integrationSettings,
      appearance: appearanceSettings
    };
    
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'crm-settings.json';
    link.click();
  };

  const tabs = [
    { id: 'general', label: 'Général', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'integrations', label: 'Intégrations', icon: Database },
    { id: 'appearance', label: 'Apparence', icon: Palette }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 p-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Paramètres</h3>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 md:hidden">
              <X className="h-5 w-5" />
            </button>
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
          
          {hasChanges && (
            <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2 flex-shrink-0" />
                <span className="text-sm text-yellow-700">Modifications non sauvegardées</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {/* Onglet Général */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Informations de l'entreprise</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom de l'entreprise
                      </label>
                      <input
                        type="text"
                        value={generalSettings.companyName}
                        onChange={(e) => {
                          setGeneralSettings({...generalSettings, companyName: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email de contact
                      </label>
                      <input
                        type="email"
                        value={generalSettings.companyEmail}
                        onChange={(e) => {
                          setGeneralSettings({...generalSettings, companyEmail: e.target.value});
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
                        value={generalSettings.companyPhone}
                        onChange={(e) => {
                          setGeneralSettings({...generalSettings, companyPhone: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site web
                      </label>
                      <input
                        type="url"
                        value={generalSettings.website}
                        onChange={(e) => {
                          setGeneralSettings({...generalSettings, website: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse complète
                    </label>
                    <textarea
                      value={generalSettings.companyAddress}
                      onChange={(e) => {
                        setGeneralSettings({...generalSettings, companyAddress: e.target.value});
                        setHasChanges(true);
                      }}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Paramètres régionaux</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Devise
                      </label>
                      <select
                        value={generalSettings.currency}
                        onChange={(e) => {
                          setGeneralSettings({...generalSettings, currency: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="EUR">Euro (€)</option>
                        <option value="USD">Dollar US ($)</option>
                        <option value="GBP">Livre Sterling (£)</option>
                        <option value="CHF">Franc Suisse (CHF)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fuseau horaire
                      </label>
                      <select
                        value={generalSettings.timezone}
                        onChange={(e) => {
                          setGeneralSettings({...generalSettings, timezone: e.target.value});
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
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Format de date
                      </label>
                      <select
                        value={generalSettings.dateFormat}
                        onChange={(e) => {
                          setGeneralSettings({...generalSettings, dateFormat: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Heures d'ouverture</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Heure d'ouverture
                      </label>
                      <input
                        type="time"
                        value={generalSettings.businessHours.start}
                        onChange={(e) => {
                          setGeneralSettings({
                            ...generalSettings,
                            businessHours: { ...generalSettings.businessHours, start: e.target.value }
                          });
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Heure de fermeture
                      </label>
                      <input
                        type="time"
                        value={generalSettings.businessHours.end}
                        onChange={(e) => {
                          setGeneralSettings({
                            ...generalSettings,
                            businessHours: { ...generalSettings.businessHours, end: e.target.value }
                          });
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Types de notifications</h4>
                  <div className="space-y-4">
                    {Object.entries({
                      emailNotifications: 'Notifications par email',
                      smsNotifications: 'Notifications par SMS',
                      pushNotifications: 'Notifications push',
                      criticalAlerts: 'Alertes critiques',
                      paymentAlerts: 'Alertes de paiement',
                      systemMaintenance: 'Maintenance système',
                      newClientAlerts: 'Nouveaux clients',
                      overdueAlerts: 'Factures en retard',
                      escalationAlerts: 'Escalades de dossiers'
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between py-2">
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

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Rapports automatiques</h4>
                  <div className="space-y-4">
                    {Object.entries({
                      dailyReports: 'Rapports quotidiens',
                      weeklyReports: 'Rapports hebdomadaires',
                      monthlyReports: 'Rapports mensuels'
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between py-2">
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
              </div>
            )}

            {/* Onglet Sécurité */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Politique des mots de passe</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Longueur minimale
                      </label>
                      <input
                        type="number"
                        min="6"
                        max="20"
                        value={securitySettings.passwordMinLength}
                        onChange={(e) => {
                          setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiration (jours)
                      </label>
                      <input
                        type="number"
                        min="30"
                        max="365"
                        value={securitySettings.passwordExpiry}
                        onChange={(e) => {
                          setSecuritySettings({...securitySettings, passwordExpiry: parseInt(e.target.value)});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-4">
                    {Object.entries({
                      passwordRequireSpecial: 'Caractères spéciaux requis',
                      passwordRequireNumbers: 'Chiffres requis',
                      passwordRequireUppercase: 'Majuscules requises',
                      twoFactorAuth: 'Authentification à deux facteurs',
                      auditLog: 'Journal d\'audit activé',
                      encryptionEnabled: 'Chiffrement des données'
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-700 pr-4">{label}</span>
                        <button
                          onClick={() => {
                            setSecuritySettings({
                              ...securitySettings,
                              [key]: !securitySettings[key as keyof typeof securitySettings]
                            });
                            setHasChanges(true);
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            securitySettings[key as keyof typeof securitySettings] ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            securitySettings[key as keyof typeof securitySettings] ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Sessions et accès</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timeout de session (minutes)
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="480"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => {
                          setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tentatives de connexion max
                      </label>
                      <input
                        type="number"
                        min="3"
                        max="10"
                        value={securitySettings.maxLoginAttempts}
                        onChange={(e) => {
                          setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Durée de verrouillage (minutes)
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="60"
                        value={securitySettings.lockoutDuration}
                        onChange={(e) => {
                          setSecuritySettings({...securitySettings, lockoutDuration: parseInt(e.target.value)});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Intégrations */}
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Configuration Email (SMTP)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Serveur SMTP
                      </label>
                      <input
                        type="text"
                        value={integrationSettings.smtpHost}
                        onChange={(e) => {
                          setIntegrationSettings({...integrationSettings, smtpHost: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Port
                      </label>
                      <input
                        type="number"
                        value={integrationSettings.smtpPort}
                        onChange={(e) => {
                          setIntegrationSettings({...integrationSettings, smtpPort: parseInt(e.target.value)});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom d'utilisateur
                      </label>
                      <input
                        type="text"
                        value={integrationSettings.smtpUsername}
                        onChange={(e) => {
                          setIntegrationSettings({...integrationSettings, smtpUsername: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mot de passe
                      </label>
                      <input
                        type="password"
                        value={integrationSettings.smtpPassword}
                        onChange={(e) => {
                          setIntegrationSettings({...integrationSettings, smtpPassword: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Configuration SMS</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fournisseur SMS
                      </label>
                      <select
                        value={integrationSettings.smsProvider}
                        onChange={(e) => {
                          setIntegrationSettings({...integrationSettings, smsProvider: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="twilio">Twilio</option>
                        <option value="nexmo">Nexmo</option>
                        <option value="clickatell">Clickatell</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Clé API
                      </label>
                      <input
                        type="password"
                        value={integrationSettings.smsApiKey}
                        onChange={(e) => {
                          setIntegrationSettings({...integrationSettings, smsApiKey: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Intégrations tierces</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CRM externe
                      </label>
                      <select
                        value={integrationSettings.crmIntegration}
                        onChange={(e) => {
                          setIntegrationSettings({...integrationSettings, crmIntegration: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Aucun</option>
                        <option value="salesforce">Salesforce</option>
                        <option value="hubspot">HubSpot</option>
                        <option value="pipedrive">Pipedrive</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logiciel comptable
                      </label>
                      <select
                        value={integrationSettings.accountingIntegration}
                        onChange={(e) => {
                          setIntegrationSettings({...integrationSettings, accountingIntegration: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Aucun</option>
                        <option value="sage">Sage</option>
                        <option value="cegid">Cegid</option>
                        <option value="ebp">EBP</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Apparence */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Thème et couleurs</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thème
                      </label>
                      <select
                        value={appearanceSettings.theme}
                        onChange={(e) => {
                          setAppearanceSettings({...appearanceSettings, theme: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="light">Clair</option>
                        <option value="dark">Sombre</option>
                        <option value="auto">Automatique</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Taille de police
                      </label>
                      <select
                        value={appearanceSettings.fontSize}
                        onChange={(e) => {
                          setAppearanceSettings({...appearanceSettings, fontSize: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="small">Petite</option>
                        <option value="medium">Moyenne</option>
                        <option value="large">Grande</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Couleur principale
                      </label>
                      <input
                        type="color"
                        value={appearanceSettings.primaryColor}
                        onChange={(e) => {
                          setAppearanceSettings({...appearanceSettings, primaryColor: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full h-12 border border-gray-300 rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Couleur secondaire
                      </label>
                      <input
                        type="color"
                        value={appearanceSettings.secondaryColor}
                        onChange={(e) => {
                          setAppearanceSettings({...appearanceSettings, secondaryColor: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full h-12 border border-gray-300 rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Couleur d'accent
                      </label>
                      <input
                        type="color"
                        value={appearanceSettings.accentColor}
                        onChange={(e) => {
                          setAppearanceSettings({...appearanceSettings, accentColor: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full h-12 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Options d'affichage</h4>
                  <div className="space-y-4">
                    {Object.entries({
                      compactMode: 'Mode compact',
                      showAnimations: 'Afficher les animations',
                      sidebarCollapsed: 'Barre latérale réduite par défaut'
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-700 pr-4">{label}</span>
                        <button
                          onClick={() => {
                            setAppearanceSettings({
                              ...appearanceSettings,
                              [key]: !appearanceSettings[key as keyof typeof appearanceSettings]
                            });
                            setHasChanges(true);
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            appearanceSettings[key as keyof typeof appearanceSettings] ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            appearanceSettings[key as keyof typeof appearanceSettings] ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 md:p-6 bg-gray-50">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                <button
                  onClick={handleExportSettings}
                  className="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>Exporter</span>
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <RefreshCw className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>Réinitialiser</span>
                </button>
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

export default SystemSettings;