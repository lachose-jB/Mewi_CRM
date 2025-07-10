import React, { useState } from 'react';
import { 
  Mail, 
  MessageSquare, 
  Phone, 
  FileText, 
  Send, 
  Plus, 
  Search, 
  Filter, 
  User, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Eye, 
  Edit3, 
  Trash2, 
  Download, 
  Printer, 
  Share2, 
  Settings, 
  Save,
  Copy,
  ExternalLink,
  Upload,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Communication {
  id: string;
  type: 'email' | 'sms' | 'call' | 'letter';
  subject?: string;
  content: string;
  status: 'draft' | 'sent' | 'delivered' | 'read' | 'responded' | 'failed';
  clientId: string;
  clientName: string;
  date: string;
  time: string;
  managerId: string;
  managerName: string;
  attachments?: string[];
  templateId?: string;
  result?: string;
  notes?: string;
  isAutomatic: boolean;
}

interface Template {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'letter';
  subject?: string;
  content: string;
  variables: string[];
  category: string;
  isActive: boolean;
}

const CommunicationsManager: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'history' | 'templates' | 'compose'>('history');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCommunication, setSelectedCommunication] = useState<Communication | null>(null);
  const [showCommunicationModal, setShowCommunicationModal] = useState(false);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  // Données simulées pour les communications
  const [communications, setCommunications] = useState<Communication[]>([
    {
      id: '1',
      type: 'email',
      subject: 'Relance facture #FAC-2024-001',
      content: 'Bonjour, nous vous rappelons que votre facture #FAC-2024-001 d\'un montant de 8750,50€ est échue depuis 15 jours...',
      status: 'sent',
      clientId: '1',
      clientName: 'Jean Martin',
      date: '2024-12-15',
      time: '09:30',
      managerId: '2',
      managerName: 'Marie Dubois',
      templateId: '1',
      isAutomatic: true
    },
    {
      id: '2',
      type: 'call',
      content: 'Appel de suivi concernant la promesse de paiement',
      status: 'responded',
      clientId: '1',
      clientName: 'Jean Martin',
      date: '2024-12-14',
      time: '14:45',
      managerId: '2',
      managerName: 'Marie Dubois',
      notes: 'Client confirme le paiement pour le 20/12. Difficultés de trésorerie temporaires.',
      isAutomatic: false
    },
    {
      id: '3',
      type: 'sms',
      content: 'Rappel: Votre facture #FAC-2024-002 de 7000€ est échue. Merci de contacter notre service au 01.23.45.67.89',
      status: 'delivered',
      clientId: '2',
      clientName: 'Sophie Leroy',
      date: '2024-12-13',
      time: '10:00',
      managerId: '2',
      managerName: 'Marie Dubois',
      templateId: '2',
      isAutomatic: true
    },
    {
      id: '4',
      type: 'letter',
      subject: 'Mise en demeure - Facture impayée',
      content: 'Lettre recommandée avec accusé de réception...',
      status: 'sent',
      clientId: '3',
      clientName: 'Pierre Dubois',
      date: '2024-12-10',
      time: '08:00',
      managerId: '3',
      managerName: 'Pierre Martin',
      attachments: ['mise-en-demeure.pdf'],
      isAutomatic: false
    }
  ]);

  // Données simulées pour les modèles
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: '1',
      name: 'Relance amiable',
      type: 'email',
      subject: 'Rappel de paiement - Facture {{invoice_number}}',
      content: 'Bonjour {{client_name}},\n\nNous vous rappelons que votre facture {{invoice_number}} d\'un montant de {{amount}} est échue depuis {{days_overdue}} jours.\n\nMerci de procéder au règlement dans les plus brefs délais.\n\nCordialement,\nL\'équipe de recouvrement',
      variables: ['client_name', 'invoice_number', 'amount', 'days_overdue'],
      category: 'Relance niveau 1',
      isActive: true
    },
    {
      id: '2',
      name: 'Relance SMS',
      type: 'sms',
      content: 'Rappel: Votre facture {{invoice_number}} de {{amount}}€ est échue. Contactez-nous au 01.23.45.67.89',
      variables: ['invoice_number', 'amount'],
      category: 'Relance niveau 1',
      isActive: true
    },
    {
      id: '3',
      name: 'Relance ferme',
      type: 'email',
      subject: 'IMPORTANT: Facture {{invoice_number}} en retard',
      content: 'Bonjour {{client_name}},\n\nMalgré notre précédente relance, nous constatons que votre facture {{invoice_number}} d\'un montant de {{amount}} reste impayée depuis {{days_overdue}} jours.\n\nNous vous demandons de régulariser cette situation sous 48h.\n\nCordialement,\nL\'équipe de recouvrement',
      variables: ['client_name', 'invoice_number', 'amount', 'days_overdue'],
      category: 'Relance niveau 2',
      isActive: true
    },
    {
      id: '4',
      name: 'Mise en demeure',
      type: 'letter',
      subject: 'MISE EN DEMEURE - Facture impayée',
      content: 'MISE EN DEMEURE\n\nMadame, Monsieur,\n\nMalgré nos relances, votre facture {{invoice_number}} d\'un montant de {{amount}}€ datée du {{invoice_date}} demeure impayée.\n\nNous vous mettons en demeure de régler cette somme sous 8 jours...',
      variables: ['client_name', 'invoice_number', 'amount', 'invoice_date', 'company_name'],
      category: 'Relance niveau 3',
      isActive: true
    }
  ]);

  // Filtrer les communications
  const filteredCommunications = communications.filter(comm => {
    const matchesType = typeFilter === 'all' || comm.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || comm.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
                         comm.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (comm.subject && comm.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         comm.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrer par gestionnaire si l'utilisateur est un gestionnaire
    const matchesManager = !user?.id || user?.role === 'admin' || comm.managerId === user?.id;
    
    return matchesType && matchesStatus && matchesSearch && matchesManager;
  });

  // Filtrer les modèles
  const filteredTemplates = templates.filter(template => {
    const matchesType = typeFilter === 'all' || template.type === typeFilter;
    const matchesSearch = searchTerm === '' || 
                         template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (template.subject && template.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         template.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesSearch;
  });

  // Obtenir la couleur en fonction du type de communication
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email': return 'bg-blue-100 text-blue-800';
      case 'sms': return 'bg-green-100 text-green-800';
      case 'call': return 'bg-purple-100 text-purple-800';
      case 'letter': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtenir l'icône en fonction du type de communication
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'sms': return MessageSquare;
      case 'call': return Phone;
      case 'letter': return FileText;
      default: return Mail;
    }
  };

  // Obtenir la couleur en fonction du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'read': return 'bg-purple-100 text-purple-800';
      case 'responded': return 'bg-indigo-100 text-indigo-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtenir l'icône en fonction du statut
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return Edit3;
      case 'sent': return Send;
      case 'delivered': return CheckCircle;
      case 'read': return Eye;
      case 'responded': return MessageSquare;
      case 'failed': return AlertCircle;
      default: return Clock;
    }
  };

  // Gestion des communications
  const handleViewCommunication = (communication: Communication) => {
    setSelectedCommunication(communication);
    setShowCommunicationModal(true);
  };

  const handleCompose = () => {
    setShowComposeModal(true);
  };

  const handleViewTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setShowTemplateModal(true);
  };

  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setShowTemplateModal(true);
  };

  // Composant pour le modal de communication
  const CommunicationModal: React.FC<{
    communication: Communication | null;
    isOpen: boolean;
    onClose: () => void;
  }> = ({ communication, isOpen, onClose }) => {
    if (!isOpen || !communication) return null;
    
    const TypeIcon = getTypeIcon(communication.type);
    const StatusIcon = getStatusIcon(communication.status);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${getTypeColor(communication.type).split(' ')[0]}`}>
                <TypeIcon className={`h-5 w-5 ${getTypeColor(communication.type).split(' ')[1]}`} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {communication.subject || (
                    communication.type === 'call' ? 'Appel téléphonique' :
                    communication.type === 'sms' ? 'SMS' :
                    communication.type === 'letter' ? 'Courrier' : 'Communication'
                  )}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(communication.date).toLocaleDateString('fr-FR')} à {communication.time}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Client</h4>
                <p className="text-gray-900 flex items-center">
                  <User className="h-4 w-4 mr-1 text-gray-400" />
                  {communication.clientName}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Gestionnaire</h4>
                <p className="text-gray-900 flex items-center">
                  <User className="h-4 w-4 mr-1 text-gray-400" />
                  {communication.managerName}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Type</h4>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(communication.type)}`}>
                  <TypeIcon className="h-3 w-3 mr-1" />
                  {communication.type === 'email' ? 'Email' :
                   communication.type === 'sms' ? 'SMS' :
                   communication.type === 'call' ? 'Appel' : 'Courrier'}
                </span>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Statut</h4>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(communication.status)}`}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {communication.status === 'draft' ? 'Brouillon' :
                   communication.status === 'sent' ? 'Envoyé' :
                   communication.status === 'delivered' ? 'Délivré' :
                   communication.status === 'read' ? 'Lu' :
                   communication.status === 'responded' ? 'Répondu' : 'Échec'}
                </span>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Contenu</h4>
              <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap">
                {communication.content}
              </div>
            </div>
            
            {communication.notes && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Notes</h4>
                <div className="bg-yellow-50 rounded-lg p-4 text-yellow-800">
                  {communication.notes}
                </div>
              </div>
            )}
            
            {communication.attachments && communication.attachments.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Pièces jointes</h4>
                <div className="flex flex-wrap gap-2">
                  {communication.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center px-3 py-2 bg-gray-100 rounded-lg">
                      <FileText className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700">{attachment}</span>
                      <button className="ml-2 text-gray-400 hover:text-gray-600">
                        <Download className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {communication.result && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Résultat</h4>
                <div className="bg-green-50 rounded-lg p-4 text-green-800">
                  {communication.result}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <button className="flex items-center px-3 py-1 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Printer className="h-4 w-4 mr-1" />
                Imprimer
              </button>
              <button className="flex items-center px-3 py-1 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Download className="h-4 w-4 mr-1" />
                Exporter
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Fermer
              </button>
              {communication.type !== 'call' && communication.status === 'draft' && (
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Composant pour le modal de modèle
  const TemplateModal: React.FC<{
    template: Template | null;
    isOpen: boolean;
    onClose: () => void;
  }> = ({ template, isOpen, onClose }) => {
    if (!isOpen) return null;
    
    const [formData, setFormData] = useState<Template>({
      id: '',
      name: '',
      type: 'email',
      subject: '',
      content: '',
      variables: [],
      category: 'Relance niveau 1',
      isActive: true,
      ...template
    });
    
    const [newVariable, setNewVariable] = useState('');
    
    const handleSave = () => {
      if (template) {
        // Mise à jour d'un modèle existant
        setTemplates(templates.map(t => t.id === template.id ? formData : t));
      } else {
        // Ajout d'un nouveau modèle
        const newTemplate = {
          ...formData,
          id: Date.now().toString()
        };
        setTemplates([...templates, newTemplate]);
      }
      onClose();
    };
    
    const addVariable = () => {
      if (newVariable.trim() && !formData.variables.includes(newVariable.trim())) {
        setFormData({
          ...formData,
          variables: [...formData.variables, newVariable.trim()]
        });
        setNewVariable('');
      }
    };
    
    const removeVariable = (variable: string) => {
      setFormData({
        ...formData,
        variables: formData.variables.filter(v => v !== variable)
      });
    };
    
    const TypeIcon = getTypeIcon(formData.type);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${getTypeColor(formData.type).split(' ')[0]}`}>
                <TypeIcon className={`h-5 w-5 ${getTypeColor(formData.type).split(' ')[1]}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {template ? 'Modifier le modèle' : 'Nouveau modèle'}
              </h3>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du modèle *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nom du modèle"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="letter">Courrier</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Relance niveau 1">Relance niveau 1</option>
                  <option value="Relance niveau 2">Relance niveau 2</option>
                  <option value="Relance niveau 3">Relance niveau 3</option>
                  <option value="Confirmation">Confirmation</option>
                  <option value="Remerciement">Remerciement</option>
                </select>
              </div>
            </div>
            
            {(formData.type === 'email' || formData.type === 'letter') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sujet *
                </label>
                <input
                  type="text"
                  value={formData.subject || ''}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Sujet du message"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenu *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Contenu du message"
              />
              <p className="mt-1 text-xs text-gray-500">
                Utilisez les variables entre doubles accolades, par exemple: {'{{client_name}}'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Variables
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.variables.map((variable, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {`{{${variable}}}`}
                    <button
                      onClick={() => removeVariable(variable)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={newVariable}
                  onChange={(e) => setNewVariable(e.target.value)}
                  placeholder="Ajouter une variable..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && addVariable()}
                />
                <button
                  onClick={addVariable}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
                >
                  Ajouter
                </button>
              </div>
            </div>
            
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                Modèle actif
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {template ? 'Sauvegarder' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Composant pour le modal de composition
  const ComposeModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
  }> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<Partial<Communication>>({
      type: 'email',
      subject: '',
      content: '',
      status: 'draft',
      clientId: '',
      clientName: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      managerId: user?.id || '',
      managerName: user?.name || '',
      isAutomatic: false
    });
    
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
    
    const handleTemplateChange = (templateId: string) => {
      setSelectedTemplateId(templateId);
      
      if (templateId) {
        const template = templates.find(t => t.id === templateId);
        if (template) {
          setFormData({
            ...formData,
            type: template.type,
            subject: template.subject,
            content: template.content,
            templateId
          });
        }
      }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      // Ajouter la nouvelle communication
      const newCommunication: Communication = {
        id: Date.now().toString(),
        type: formData.type as 'email' | 'sms' | 'call' | 'letter',
        subject: formData.subject,
        content: formData.content || '',
        status: formData.status as any,
        clientId: formData.clientId || '',
        clientName: formData.clientName || '',
        date: formData.date || new Date().toISOString().split('T')[0],
        time: formData.time || new Date().toTimeString().split(' ')[0].substring(0, 5),
        managerId: formData.managerId || user?.id || '',
        managerName: formData.managerName || user?.name || '',
        templateId: formData.templateId,
        isAutomatic: formData.isAutomatic || false
      };
      
      setCommunications([newCommunication, ...communications]);
      onClose();
    };
    
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Nouvelle communication</h3>
              <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="call">Appel</option>
                    <option value="letter">Courrier</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client *
                  </label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => {
                      const selectedOption = e.target.options[e.target.selectedIndex];
                      setFormData({
                        ...formData, 
                        clientId: e.target.value,
                        clientName: selectedOption.text
                      });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Sélectionner un client</option>
                    <option value="1">Jean Martin</option>
                    <option value="2">Sophie Leroy</option>
                    <option value="3">Pierre Dubois</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modèle
                  </label>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => handleTemplateChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Aucun modèle</option>
                    {templates
                      .filter(t => t.type === formData.type && t.isActive)
                      .map(template => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))
                    }
                  </select>
                </div>
              </div>
              
              {(formData.type === 'email' || formData.type === 'letter') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet *
                  </label>
                  <input
                    type="text"
                    value={formData.subject || ''}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Sujet du message"
                    required={formData.type === 'email' || formData.type === 'letter'}
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenu *
                </label>
                <textarea
                  value={formData.content || ''}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Contenu du message"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heure
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              {formData.type === 'call' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Notes de l'appel"
                  />
                </div>
              )}
              
              {formData.type === 'email' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pièces jointes
                  </label>
                  <div className="flex items-center px-4 py-2 border border-gray-300 border-dashed rounded-lg">
                    <Upload className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">Glissez des fichiers ici ou</span>
                    <button
                      type="button"
                      className="ml-1 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      parcourir
                    </button>
                  </div>
                </div>
              )}
              
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="sendNow"
                  checked={formData.status === 'sent'}
                  onChange={(e) => setFormData({...formData, status: e.target.checked ? 'sent' : 'draft'})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="sendNow" className="ml-2 text-sm text-gray-700">
                  Envoyer immédiatement
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {formData.status === 'sent' ? 'Envoyer' : 'Enregistrer'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Communications</h1>
          <p className="text-gray-600">Gérez toutes vos communications avec les clients</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleCompose}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Send className="h-4 w-4 mr-2" />
            Nouvelle communication
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Emails</p>
              <p className="text-2xl font-bold text-gray-900">
                {communications.filter(c => c.type === 'email').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">SMS</p>
              <p className="text-2xl font-bold text-gray-900">
                {communications.filter(c => c.type === 'sms').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Phone className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Appels</p>
              <p className="text-2xl font-bold text-gray-900">
                {communications.filter(c => c.type === 'call').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Courriers</p>
              <p className="text-2xl font-bold text-gray-900">
                {communications.filter(c => c.type === 'letter').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'history', label: 'Historique', icon: Clock },
              { id: 'templates', label: 'Modèles', icon: FileText },
              { id: 'compose', label: 'Composer', icon: Edit3 }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Filtres et recherche */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-3">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">Tous les types</option>
                <option value="email">Emails</option>
                <option value="sms">SMS</option>
                <option value="call">Appels</option>
                <option value="letter">Courriers</option>
              </select>
              
              {activeTab === 'history' && (
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="draft">Brouillons</option>
                  <option value="sent">Envoyés</option>
                  <option value="delivered">Délivrés</option>
                  <option value="read">Lus</option>
                  <option value="responded">Répondus</option>
                  <option value="failed">Échoués</option>
                </select>
              )}
            </div>
          </div>

          {/* Onglet Historique */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {filteredCommunications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Mail className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p>Aucune communication trouvée</p>
                </div>
              ) : (
                filteredCommunications.map((communication) => {
                  const TypeIcon = getTypeIcon(communication.type);
                  const StatusIcon = getStatusIcon(communication.status);
                  
                  return (
                    <div
                      key={communication.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleViewCommunication(communication)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${getTypeColor(communication.type).split(' ')[0]}`}>
                          <TypeIcon className={`h-5 w-5 ${getTypeColor(communication.type).split(' ')[1]}`} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {communication.subject || (
                              communication.type === 'call' ? 'Appel téléphonique' :
                              communication.type === 'sms' ? 'SMS' :
                              communication.type === 'letter' ? 'Courrier' : 'Communication'
                            )}
                          </h3>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                            <span className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {communication.clientName}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(communication.date).toLocaleDateString('fr-FR')}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {communication.time}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(communication.status)}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {communication.status === 'draft' ? 'Brouillon' :
                           communication.status === 'sent' ? 'Envoyé' :
                           communication.status === 'delivered' ? 'Délivré' :
                           communication.status === 'read' ? 'Lu' :
                           communication.status === 'responded' ? 'Répondu' : 'Échec'}
                        </span>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Onglet Modèles */}
          {activeTab === 'templates' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  onClick={handleCreateTemplate}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau modèle
                </button>
              </div>
              
              {filteredTemplates.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p>Aucun modèle trouvé</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTemplates.map((template) => {
                    const TypeIcon = getTypeIcon(template.type);
                    
                    return (
                      <div
                        key={template.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleViewTemplate(template)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${getTypeColor(template.type).split(' ')[0]}`}>
                              <TypeIcon className={`h-4 w-4 ${getTypeColor(template.type).split(' ')[1]}`} />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{template.name}</h3>
                              <span className="text-xs text-gray-500">{template.category}</span>
                            </div>
                          </div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {template.isActive ? 'Actif' : 'Inactif'}
                          </span>
                        </div>
                        
                        {template.subject && (
                          <div className="mb-2">
                            <p className="text-xs font-medium text-gray-500">Sujet:</p>
                            <p className="text-sm text-gray-700 truncate">{template.subject}</p>
                          </div>
                        )}
                        
                        <div className="mb-3">
                          <p className="text-xs font-medium text-gray-500">Contenu:</p>
                          <p className="text-sm text-gray-700 line-clamp-2">{template.content}</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {template.variables.slice(0, 3).map((variable, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                              {`{{${variable}}}`}
                            </span>
                          ))}
                          {template.variables.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              +{template.variables.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Onglet Composer */}
          {activeTab === 'compose' && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Composer un message</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de communication
                    </label>
                    <div className="flex space-x-2">
                      {[
                        { id: 'email', label: 'Email', icon: Mail, color: 'bg-blue-100 text-blue-600' },
                        { id: 'sms', label: 'SMS', icon: MessageSquare, color: 'bg-green-100 text-green-600' },
                        { id: 'call', label: 'Appel', icon: Phone, color: 'bg-purple-100 text-purple-600' },
                        { id: 'letter', label: 'Courrier', icon: FileText, color: 'bg-orange-100 text-orange-600' }
                      ].map(type => {
                        const Icon = type.icon;
                        return (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => handleCompose()}
                            className={`flex flex-col items-center p-3 rounded-lg border ${
                              type.color.split(' ')[0]
                            } ${type.color.split(' ')[1]} hover:opacity-80 transition-opacity`}
                          >
                            <Icon className="h-6 w-6 mb-1" />
                            <span className="text-xs font-medium">{type.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Modèles rapides
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {templates.slice(0, 4).map(template => (
                        <button
                          key={template.id}
                          type="button"
                          onClick={() => {
                            setShowComposeModal(true);
                          }}
                          className="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className={`p-2 rounded-lg ${getTypeColor(template.type).split(' ')[0]} mr-3`}>
                            {getTypeIcon(template.type)({ className: `h-4 w-4 ${getTypeColor(template.type).split(' ')[1]}` })}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{template.name}</p>
                            <p className="text-xs text-gray-500 truncate">{template.category}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleCompose}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Composer un message personnalisé
                  </button>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Communications récentes</h3>
                
                <div className="space-y-3">
                  {communications.slice(0, 3).map((communication) => {
                    const TypeIcon = getTypeIcon(communication.type);
                    const StatusIcon = getStatusIcon(communication.status);
                    
                    return (
                      <div
                        key={communication.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleViewCommunication(communication)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${getTypeColor(communication.type).split(' ')[0]}`}>
                            <TypeIcon className={`h-4 w-4 ${getTypeColor(communication.type).split(' ')[1]}`} />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              {communication.subject || (
                                communication.type === 'call' ? 'Appel téléphonique' :
                                communication.type === 'sms' ? 'SMS' :
                                communication.type === 'letter' ? 'Courrier' : 'Communication'
                              )}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {communication.clientName} - {new Date(communication.date).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(communication.status)}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {communication.status === 'draft' ? 'Brouillon' :
                           communication.status === 'sent' ? 'Envoyé' :
                           communication.status === 'delivered' ? 'Délivré' :
                           communication.status === 'read' ? 'Lu' :
                           communication.status === 'responded' ? 'Répondu' : 'Échec'}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setActiveTab('history')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Voir tout l'historique →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CommunicationModal
        communication={selectedCommunication}
        isOpen={showCommunicationModal}
        onClose={() => setShowCommunicationModal(false)}
      />
      
      <ComposeModal
        isOpen={showComposeModal}
        onClose={() => setShowComposeModal(false)}
      />
      
      <TemplateModal
        template={selectedTemplate}
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
      />
    </div>
  );
};

export default CommunicationsManager;