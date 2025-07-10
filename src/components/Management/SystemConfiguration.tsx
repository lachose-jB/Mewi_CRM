import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  Plus, 
  Edit3, 
  Trash2,
  Mail,
  MessageSquare,
  Clock,
  AlertTriangle,
  CheckCircle,
  X,
  Copy,
  Eye,
  EyeOff,
  Globe,
  Database,
  Shield,
  Bell,
  Palette,
  Code,
  FileText,
  Zap,
  Users,
  Calendar,
  DollarSign
} from 'lucide-react';
import { RelanceTemplate, RelanceRule, SystemConfig } from '../../types';

interface ConfigSectionProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  children: React.ReactNode;
  isExpanded?: boolean;
  onToggle?: () => void;
}

const ConfigSection: React.FC<ConfigSectionProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  children, 
  isExpanded = true, 
  onToggle 
}) => {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div 
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isExpanded ? (
            <Eye className="h-5 w-5 text-gray-400" />
          ) : (
            <EyeOff className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>
      
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-100">
          {children}
        </div>
      )}
    </div>
  );
};

// Ajoute ce composant simple pour l'édition (à placer avant SystemConfiguration)
const RuleEditModal: React.FC<{
  rule: RelanceRule | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (rule: RelanceRule) => void;
}> = ({ rule, isOpen, onClose, onSave }) => {
  const [form, setForm] = useState<RelanceRule>(rule || {
    id: '',
    name: '',
    triggerDays: 0,
    action: 'email',
    templateId: '',
    isActive: true
  });

  useEffect(() => {
    if (rule) setForm(rule);
  }, [rule]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">{rule ? 'Modifier la règle' : 'Nouvelle règle'}</h3>
        <div className="space-y-4">
          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Nom"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="number"
            className="w-full border px-3 py-2 rounded"
            placeholder="Déclenchement (jours)"
            value={form.triggerDays}
            onChange={e => setForm({ ...form, triggerDays: parseInt(e.target.value) })}
          />
          <select
            className="w-full border px-3 py-2 rounded"
            value={form.action}
            onChange={e => setForm({ ...form, action: e.target.value as any })}
          >
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="status_change">Changement de statut</option>
          </select>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={e => setForm({ ...form, isActive: e.target.checked })}
            />
            <span>Active</span>
          </label>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200">Annuler</button>
          <button
            onClick={() => { onSave(form); onClose(); }}
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
};

const SystemConfiguration: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    general: true,
    relance: true,
    templates: true,
    notifications: true,
    security: false,
    integrations: false,
    appearance: false
  });

  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<RelanceTemplate | null>(null);
  const [editingRule, setEditingRule] = useState<RelanceRule | null>(null);

  // Configuration state
  const [config, setConfig] = useState<SystemConfig>({
    relanceRules: [
      {
        id: '1',
        name: 'Première relance automatique',
        triggerDays: 7,
        action: 'email',
        templateId: '1',
        isActive: true
      },
      {
        id: '2',
        name: 'Relance SMS urgente',
        triggerDays: 15,
        action: 'sms',
        templateId: '2',
        isActive: true
      },
      {
        id: '3',
        name: 'Passage en statut critique',
        triggerDays: 30,
        action: 'status_change',
        newStatus: 'critical',
        isActive: true
      }
    ],
    templates: [
      {
        id: '1',
        name: 'Email de relance standard',
        type: 'email',
        subject: 'Rappel de paiement - Facture {{facture_number}}',
        content: 'Bonjour {{client_name}},\n\nNous vous rappelons que votre facture {{invoice_number}} d\'un montant de {{amount}} est échue depuis {{days_overdue}} jours.\n\nMerci de procéder au règlement dans les plus brefs délais.\n\nCordialement,\nL\'équipe de recouvrement',
        variables: ['client_name', 'invoice_number', 'amount', 'days_overdue']
      },
      {
        id: '2',
        name: 'SMS de relance Rec 1',
        type: 'sms',
        content: "Bonjour {{civilité_debiteur}} sauf erreur ou omission de notre part, votre impayé n° {{facture_number_number}} n'est pas encore régularisé. Nous vous prions de régulariser dès réception du sms. Service Recouvrement et contentieux Mewi Recouremat",
        variables: ['dosier_number', 'amount']
      },
      {
        id: '3',
        name: 'SMS de relance Rec 2',
        type: 'sms',
        content: "Bonjour {{civilité_debiteur}} Votre dochier est en Rec 2 : 8 à 30 jours d'impayés Malgré notre sms du {{date_sms_rec1_client}} Votre situation n'est pas régularisée. Nous serions obligés de vous envoyer une lettre de relance 2 pour régulariser rapidement votre impayé",
        variables: ['dosier_number', 'amount']
      },
      {
        id: '4',
        name: 'SMS de relance Rec 3',
        type: 'sms',
        content: "Bonjour {{civilité_debiteur}} Votre dossier est Rec 3: plus de 30 jours Nous vous sommons de régler votre impayé,  à défaut nous serions contraints de vous envoyer une lettre de mise en demeure et de transférer votre dossier en contentieux",
        variables: ['dosier_number', 'amount']
      }
    ],
    generalSettings: {
      currency: 'EUR',
      timezone: 'Europe/Paris',
      companyName: 'CRM Recouvrement Pro'
    }
  });

  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'CRM Recouvrement Pro',
    companyAddress: '123 Rue de la Finance, 75001 Paris',
    companyPhone: '+33 1 23 45 67 89',
    companyEmail: 'contact@crm-recouvrement.fr',
    currency: 'EUR',
    timezone: 'Europe/Paris',
    dateFormat: 'DD/MM/YYYY',
    language: 'fr',
    fiscalYear: 'calendar'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    dailyReports: true,
    weeklyReports: true,
    criticalAlerts: true,
    paymentAlerts: true,
    systemMaintenance: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: 8,
    passwordRequireSpecial: true,
    passwordRequireNumbers: true,
    passwordRequireUppercase: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    twoFactorAuth: false,
    ipWhitelist: '',
    auditLog: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSaveConfig = () => {
    // Simulate saving configuration
    console.log('Configuration saved:', config);
    // Show success message
  };

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setShowTemplateModal(true);
  };

  const handleEditTemplate = (template: RelanceTemplate) => {
    setEditingTemplate(template);
    setShowTemplateModal(true);
  };

  const handleCreateRule = () => {
    setEditingRule(null);
    setShowRuleModal(true);
  };

  const handleEditRule = (rule: RelanceRule) => {
    setEditingRule(rule);
    setShowRuleModal(true);
  };

  // Handler pour sauvegarder une règle modifiée ou nouvelle
  const handleSaveRule = (rule: RelanceRule) => {
    setConfig(prev => ({
      ...prev,
      relanceRules: prev.relanceRules.some(r => r.id === rule.id)
        ? prev.relanceRules.map(r => r.id === rule.id ? rule : r)
        : [...prev.relanceRules, { ...rule, id: Date.now().toString() }]
    }));
  };

  // Handler pour supprimer une règle
  const handleDeleteRule = (id: string) => {
    if (window.confirm('Supprimer cette règle ?')) {
      setConfig(prev => ({
        ...prev,
        relanceRules: prev.relanceRules.filter(r => r.id !== id)
      }));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuration Système</h1>
          <p className="text-gray-600">Paramétrez votre système CRM de recouvrement</p>
        </div>
        <button 
          onClick={handleSaveConfig}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Save className="h-4 w-4 mr-2" />
          Sauvegarder la Configuration
        </button>
      </div>

      <div className="space-y-6">
        {/* Paramètres Généraux */}
        <ConfigSection
          title="Paramètres Généraux"
          description="Configuration de base de votre organisation"
          icon={Globe}
          isExpanded={expandedSections.general}
          onToggle={() => toggleSection('general')}
        >
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l'entreprise
                </label>
                <input
                  type="text"
                  value={generalSettings.companyName}
                  onChange={(e) => setGeneralSettings({...generalSettings, companyName: e.target.value})}
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
                  onChange={(e) => setGeneralSettings({...generalSettings, companyEmail: e.target.value})}
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
                  onChange={(e) => setGeneralSettings({...generalSettings, companyPhone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Devise
                </label>
                <select
                  value={generalSettings.currency}
                  onChange={(e) => setGeneralSettings({...generalSettings, currency: e.target.value})}
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
                  onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
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
                  onChange={(e) => setGeneralSettings({...generalSettings, dateFormat: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse complète
              </label>
              <textarea
                value={generalSettings.companyAddress}
                onChange={(e) => setGeneralSettings({...generalSettings, companyAddress: e.target.value})}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </ConfigSection>

        {/* Règles de Relance */}
        <ConfigSection
          title="Règles de Relance Automatique"
          description="Configurez les règles d'automatisation des relances"
          icon={Zap}
          isExpanded={expandedSections.relance}
          onToggle={() => toggleSection('relance')}
        >
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">Règles Configurées</h4>
              <button
                onClick={handleCreateRule}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Règle
              </button>
            </div>
            
            <div className="space-y-4">
              {config.relanceRules.map((rule) => (
                <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${rule.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <div>
                        <h5 className="font-medium text-gray-900">{rule.name}</h5>
                        <p className="text-sm text-gray-600">
                          Déclenché après {rule.triggerDays} jours - Action: {
                            rule.action === 'email' ? 'Email' :
                            rule.action === 'sms' ? 'SMS' :
                            rule.action === 'status_change' ? `Changement de statut (${rule.newStatus})` :
                            rule.action
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => { setEditingRule(rule); setShowRuleModal(true); }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRule(rule.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ConfigSection>

        {/* Modèles de Communication */}
        <ConfigSection
          title="Modèles de Communication"
          description="Gérez vos modèles d'emails et SMS"
          icon={FileText}
          isExpanded={expandedSections.templates}
          onToggle={() => toggleSection('templates')}
        >
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">Modèles Disponibles</h4>
              <button
                onClick={handleCreateTemplate}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Modèle
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.templates.map((template) => (
                <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        template.type === 'email' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        {template.type === 'email' ? (
                          <Mail className={`h-4 w-4 ${template.type === 'email' ? 'text-blue-600' : 'text-green-600'}`} />
                        ) : (
                          <MessageSquare className={`h-4 w-4 ${template.type === 'email' ? 'text-blue-600' : 'text-green-600'}`} />
                        )}
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">{template.name}</h5>
                        <p className="text-xs text-gray-500 uppercase">{template.type}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditTemplate(template)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit3 className="h-3 w-3" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  
                  {template.subject && (
                    <div className="mb-2">
                      <p className="text-xs font-medium text-gray-700">Sujet:</p>
                      <p className="text-sm text-gray-600 truncate">{template.subject}</p>
                    </div>
                  )}
                  
                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-700">Contenu:</p>
                    <p className="text-sm text-gray-600 line-clamp-3">{template.content}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {template.variables.map((variable) => (
                      <span key={variable} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {`{{${variable}}}`}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ConfigSection>

        {/* Notifications */}
        <ConfigSection
          title="Notifications"
          description="Configurez les alertes et notifications système"
          icon={Bell}
          isExpanded={expandedSections.notifications}
          onToggle={() => toggleSection('notifications')}
        >
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h5 className="font-medium text-gray-900">Types de Notifications</h5>
                
                {Object.entries({
                  emailNotifications: 'Notifications par email',
                  smsNotifications: 'Notifications par SMS',
                  pushNotifications: 'Notifications push',
                  criticalAlerts: 'Alertes critiques',
                  paymentAlerts: 'Alertes de paiement',
                  systemMaintenance: 'Maintenance système'
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{label}</span>
                    <button
                      onClick={() => setNotificationSettings({
                        ...notificationSettings,
                        [key]: !notificationSettings[key as keyof typeof notificationSettings]
                      })}
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
              
              <div className="space-y-4">
                <h5 className="font-medium text-gray-900">Rapports Automatiques</h5>
                
                {Object.entries({
                  dailyReports: 'Rapports quotidiens',
                  weeklyReports: 'Rapports hebdomadaires'
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{label}</span>
                    <button
                      onClick={() => setNotificationSettings({
                        ...notificationSettings,
                        [key]: !notificationSettings[key as keyof typeof notificationSettings]
                      })}
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
        </ConfigSection>

        {/* Sécurité */}
        <ConfigSection
          title="Sécurité"
          description="Paramètres de sécurité et authentification"
          icon={Shield}
          isExpanded={expandedSections.security}
          onToggle={() => toggleSection('security')}
        >
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longueur minimale du mot de passe
                </label>
                <input
                  type="number"
                  min="6"
                  max="20"
                  value={securitySettings.passwordMinLength}
                  onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeout de session (minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="480"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
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
                  onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h5 className="font-medium text-gray-900">Exigences de mot de passe</h5>
              
              {Object.entries({
                passwordRequireSpecial: 'Caractères spéciaux requis',
                passwordRequireNumbers: 'Chiffres requis',
                passwordRequireUppercase: 'Majuscules requises',
                twoFactorAuth: 'Authentification à deux facteurs',
                auditLog: 'Journal d\'audit activé'
              }).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{label}</span>
                  <button
                    onClick={() => setSecuritySettings({
                      ...securitySettings,
                      [key]: !securitySettings[key as keyof typeof securitySettings]
                    })}
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
        </ConfigSection>

        {/* Intégrations */}
        <ConfigSection
          title="Intégrations"
          description="Connectez votre CRM avec d'autres systèmes"
          icon={Database}
          isExpanded={expandedSections.integrations}
          onToggle={() => toggleSection('integrations')}
        >
          <div className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Système Comptable', status: 'connected', icon: DollarSign, color: 'green' },
                { name: 'Plateforme SMS', status: 'connected', icon: MessageSquare, color: 'green' },
                { name: 'Service Email', status: 'connected', icon: Mail, color: 'green' },
                { name: 'Téléphonie', status: 'disconnected', icon: Users, color: 'gray' },
                { name: 'Calendrier', status: 'disconnected', icon: Calendar, color: 'gray' },
                { name: 'Stockage Cloud', status: 'error', icon: Database, color: 'red' }
              ].map((integration) => (
                <div key={integration.name} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-${integration.color}-100`}>
                        <integration.icon className={`h-5 w-5 text-${integration.color}-600`} />
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">{integration.name}</h5>
                        <p className={`text-xs ${
                          integration.status === 'connected' ? 'text-green-600' :
                          integration.status === 'error' ? 'text-red-600' : 'text-gray-500'
                        }`}>
                          {integration.status === 'connected' ? 'Connecté' :
                           integration.status === 'error' ? 'Erreur' : 'Non connecté'}
                        </p>
                      </div>
                    </div>
                    
                    <button className={`px-3 py-1 text-xs rounded-lg ${
                      integration.status === 'connected' ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                      'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    } transition-colors`}>
                      {integration.status === 'connected' ? 'Déconnecter' : 'Connecter'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ConfigSection>

        {/* Apparence */}
        <ConfigSection
          title="Apparence"
          description="Personnalisez l'interface utilisateur"
          icon={Palette}
          isExpanded={expandedSections.appearance}
          onToggle={() => toggleSection('appearance')}
        >
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thème de couleur
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { name: 'Bleu', color: 'bg-blue-500' },
                    { name: 'Vert', color: 'bg-green-500' },
                    { name: 'Violet', color: 'bg-purple-500' },
                    { name: 'Rouge', color: 'bg-red-500' }
                  ].map((theme) => (
                    <button
                      key={theme.name}
                      className={`p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors ${theme.color}`}
                      title={theme.name}
                    >
                      <div className="w-full h-8 rounded bg-white bg-opacity-20"></div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo de l'entreprise
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="space-y-2">
                    <div className="mx-auto h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Code className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">Glissez votre logo ici</p>
                    <button className="text-blue-600 hover:text-blue-700 text-sm">
                      ou cliquez pour parcourir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ConfigSection>
      </div>

      <RuleEditModal
        rule={editingRule}
        isOpen={showRuleModal}
        onClose={() => setShowRuleModal(false)}
        onSave={handleSaveRule}
      />
    </div>
  );
};

export default SystemConfiguration;