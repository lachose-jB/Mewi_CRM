import React, { useState } from 'react';
import { 
  X, 
  Save, 
  Zap, 
  Clock, 
  Mail, 
  MessageSquare, 
  Activity, 
  AlertTriangle,
  Plus,
  Trash2,
  Settings,
  Target,
  Calendar,
  Bell,
  CheckCircle,
  Info
} from 'lucide-react';

interface RelanceRule {
  id: string;
  name: string;
  description: string;
  triggerDays: number;
  triggerConditions: {
    status?: string[];
    amount?: { min?: number; max?: number };
    priority?: string[];
    tags?: string[];
  };
  actions: {
    type: 'email' | 'sms' | 'status_change' | 'escalate' | 'notification';
    templateId?: string;
    newStatus?: string;
    assignTo?: string;
    message?: string;
  }[];
  schedule: {
    enabled: boolean;
    time?: string;
    days?: string[];
    frequency?: 'once' | 'daily' | 'weekly';
  };
  isActive: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

interface RuleFormModalProps {
  rule: RelanceRule | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (rule: RelanceRule) => void;
}

const RuleFormModal: React.FC<RuleFormModalProps> = ({ rule, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<RelanceRule>({
    id: '',
    name: '',
    description: '',
    triggerDays: 7,
    triggerConditions: {},
    actions: [{ type: 'email' }],
    schedule: { enabled: false },
    isActive: true,
    priority: 'medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...rule
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (rule) {
      setFormData({ ...rule });
    } else {
      setFormData({
        id: '',
        name: '',
        description: '',
        triggerDays: 7,
        triggerConditions: {},
        actions: [{ type: 'email' }],
        schedule: { enabled: false },
        isActive: true,
        priority: 'medium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    setErrors({});
  }, [rule, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de la règle est requis';
    }
    
    if (formData.triggerDays < 1) {
      newErrors.triggerDays = 'Le délai doit être d\'au moins 1 jour';
    }
    
    if (formData.actions.length === 0) {
      newErrors.actions = 'Au moins une action est requise';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const ruleData = {
        ...formData,
        id: formData.id || Date.now().toString(),
        updatedAt: new Date().toISOString()
      };
      onSave(ruleData);
      onClose();
    }
  };

  const addAction = () => {
    setFormData({
      ...formData,
      actions: [...formData.actions, { type: 'email' }]
    });
  };

  const removeAction = (index: number) => {
    setFormData({
      ...formData,
      actions: formData.actions.filter((_, i) => i !== index)
    });
  };

  const updateAction = (index: number, updates: Partial<typeof formData.actions[0]>) => {
    const newActions = [...formData.actions];
    newActions[index] = { ...newActions[index], ...updates };
    setFormData({ ...formData, actions: newActions });
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'sms': return MessageSquare;
      case 'status_change': return Activity;
      case 'escalate': return AlertTriangle;
      case 'notification': return Bell;
      default: return Settings;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {rule ? 'Modifier la règle' : 'Nouvelle règle de relance'}
              </h3>
              <p className="text-sm text-gray-500 hidden sm:block">
                Configurez les conditions et actions automatiques
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          {/* Informations générales */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 flex items-center">
              <Settings className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0" />
              <span className="truncate">Informations Générales</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la règle *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Première relance automatique"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priorité
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Basse</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Haute</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Décrivez l'objectif de cette règle..."
              />
            </div>
          </div>

          {/* Conditions de déclenchement */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 flex items-center">
              <Target className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0" />
              <span className="truncate">Conditions de Déclenchement</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Délai (jours) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.triggerDays}
                  onChange={(e) => setFormData({ ...formData, triggerDays: parseInt(e.target.value) || 1 })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.triggerDays ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.triggerDays && (
                  <p className="mt-1 text-sm text-red-600">{errors.triggerDays}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut requis
                </label>
                <select
                  multiple
                  value={formData.triggerConditions.status || []}
                  onChange={(e) => setFormData({
                    ...formData,
                    triggerConditions: {
                      ...formData.triggerConditions,
                      status: Array.from(e.target.selectedOptions, option => option.value)
                    }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="green">REC 1</option>
                  <option value="yellow">REC 2</option>
                  <option value="critical">REC 3</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">Maintenez Ctrl pour sélectionner plusieurs</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant minimum (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.triggerConditions.amount?.min || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    triggerConditions: {
                      ...formData.triggerConditions,
                      amount: {
                        ...formData.triggerConditions.amount,
                        min: parseFloat(e.target.value) || undefined
                      }
                    }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Montant minimum"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <h4 className="text-lg font-medium text-gray-900 flex items-center mb-2 sm:mb-0">
                <Activity className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0" />
                <span className="truncate">Actions à Exécuter</span>
              </h4>
              <button
                onClick={addAction}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Ajouter une action</span>
              </button>
            </div>
            
            {errors.actions && (
              <p className="text-sm text-red-600">{errors.actions}</p>
            )}
            
            <div className="space-y-4">
              {formData.actions.map((action, index) => {
                const ActionIcon = getActionIcon(action.type);
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <ActionIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        <span className="font-medium text-gray-900 truncate">Action {index + 1}</span>
                      </div>
                      {formData.actions.length > 1 && (
                        <button
                          onClick={() => removeAction(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Type d'action
                        </label>
                        <select
                          value={action.type}
                          onChange={(e) => updateAction(index, { type: e.target.value as any })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="email">Envoyer un email</option>
                          <option value="sms">Envoyer un SMS</option>
                          <option value="status_change">Changer le statut</option>
                          <option value="escalate">Escalader le dossier</option>
                          <option value="notification">Notification interne</option>
                        </select>
                      </div>
                      
                      {action.type === 'email' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Modèle d'email
                          </label>
                          <select
                            value={action.templateId || ''}
                            onChange={(e) => updateAction(index, { templateId: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Sélectionner un modèle</option>
                            <option value="1">Relance amiable</option>
                            <option value="2">Relance ferme</option>
                            <option value="3">Mise en demeure</option>
                          </select>
                        </div>
                      )}
                      
                      {action.type === 'sms' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Modèle de SMS
                          </label>
                          <select
                            value={action.templateId || ''}
                            onChange={(e) => updateAction(index, { templateId: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Sélectionner un modèle</option>
                            <option value="sms1">SMS de rappel</option>
                            <option value="sms2">SMS urgent</option>
                          </select>
                        </div>
                      )}
                      
                      {action.type === 'status_change' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nouveau statut
                          </label>
                          <select
                            value={action.newStatus || ''}
                            onChange={(e) => updateAction(index, { newStatus: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Sélectionner un statut</option>
                            <option value="yellow">Jaune</option>
                            <option value="orange">Orange</option>
                            <option value="critical">Critique</option>
                          </select>
                        </div>
                      )}
                      
                      {action.type === 'escalate' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Assigner à
                          </label>
                          <select
                            value={action.assignTo || ''}
                            onChange={(e) => updateAction(index, { assignTo: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Sélectionner un gestionnaire</option>
                            <option value="2">Marie Dubois</option>
                            <option value="3">Pierre Martin</option>
                            <option value="admin">Administrateur</option>
                          </select>
                        </div>
                      )}
                      
                      {(action.type === 'notification' || action.type === 'escalate') && (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Message
                          </label>
                          <textarea
                            value={action.message || ''}
                            onChange={(e) => updateAction(index, { message: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Message personnalisé..."
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Planification */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0" />
              <span className="truncate">Planification</span>
            </h4>
            
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.schedule.enabled}
                  onChange={(e) => setFormData({
                    ...formData,
                    schedule: { ...formData.schedule, enabled: e.target.checked }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Activer la planification</span>
              </label>
            </div>
            
            {formData.schedule.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heure d'exécution
                  </label>
                  <input
                    type="time"
                    value={formData.schedule.time || '09:00'}
                    onChange={(e) => setFormData({
                      ...formData,
                      schedule: { ...formData.schedule, time: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fréquence
                  </label>
                  <select
                    value={formData.schedule.frequency || 'once'}
                    onChange={(e) => setFormData({
                      ...formData,
                      schedule: { ...formData.schedule, frequency: e.target.value as any }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="once">Une seule fois</option>
                    <option value="daily">Quotidienne</option>
                    <option value="weekly">Hebdomadaire</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jours de la semaine
                  </label>
                  <select
                    multiple
                    value={formData.schedule.days || []}
                    onChange={(e) => setFormData({
                      ...formData,
                      schedule: {
                        ...formData.schedule,
                        days: Array.from(e.target.selectedOptions, option => option.value)
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="1">Lundi</option>
                    <option value="2">Mardi</option>
                    <option value="3">Mercredi</option>
                    <option value="4">Jeudi</option>
                    <option value="5">Vendredi</option>
                    <option value="6">Samedi</option>
                    <option value="0">Dimanche</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Statut de la règle */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0" />
              <span className="truncate">Statut</span>
            </h4>
            
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Règle active</span>
              </label>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="font-medium text-blue-900">Aperçu de la règle</h5>
                  <p className="text-sm text-blue-700 mt-1">
                    Cette règle sera déclenchée après <strong>{formData.triggerDays} jour(s)</strong> 
                    {formData.triggerConditions.status?.length ? 
                      ` pour les dossiers en statut ${formData.triggerConditions.status.join(', ')}` : ''
                    }
                    {formData.triggerConditions.amount?.min ? 
                      ` avec un montant minimum de ${formData.triggerConditions.amount.min}€` : ''
                    }.
                    {formData.actions.length > 0 && (
                      <span className="block mt-1 sm:inline sm:mt-0"> Actions: {formData.actions.map(a => {
                        switch(a.type) {
                          case 'email': return 'envoi d\'email';
                          case 'sms': return 'envoi de SMS';
                          case 'status_change': return 'changement de statut';
                          case 'escalate': return 'escalade';
                          case 'notification': return 'notification';
                          default: return a.type;
                        }
                      }).join(', ')}.</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-end p-4 sm:p-6 border-t border-gray-200 bg-gray-50 space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="w-full sm:w-auto flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{rule ? 'Sauvegarder' : 'Créer la règle'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RuleFormModal;