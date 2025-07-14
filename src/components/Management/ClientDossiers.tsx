import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Phone, 
  Mail,
  Calendar,
  Euro,
  User,
  MoreVertical,
  Eye,
  Edit3,
  Plus,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  MessageSquare,
  CreditCard,
  Building,
  MapPin,
  Hash,
  Target,
  Zap,
  BarChart3,
  Settings,
  Archive,
  Printer,
  Share2,
  RefreshCw,
  X,
  Save
} from 'lucide-react';
import { useCrm } from '../../contexts/CrmContext';
import { useAuth } from '../../contexts/AuthContext';

interface ClientDossier {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  company?: string;
  address: string;
  managerId: string;
  managerName: string;
  status: 'blue' | 'yellow' | 'orange' | 'critical';
  totalAmount: number;
  originalAmount: number;
  paidAmount: number;
  invoiceCount: number;
  lastPayment?: string;
  lastContact: string;
  daysOverdue: number;
  createdAt: string;
  notes: string[];
  tags: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  nextAction?: {
    type: string;
    date: string;
    description: string;
  };
}

interface DossierModalProps {
  dossier: ClientDossier | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (dossier: ClientDossier) => void;
}

const DossierModal: React.FC<DossierModalProps> = ({ dossier, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<ClientDossier>({
    id: '',
    clientName: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    managerId: '',
    managerName: '',
    status: 'blue',
    totalAmount: 0,
    originalAmount: 0,
    paidAmount: 0,
    invoiceCount: 0,
    lastContact: new Date().toISOString(),
    daysOverdue: 0,
    createdAt: new Date().toISOString(),
    notes: [],
    tags: [],
    priority: 'medium',
    ...dossier
  });

  const [newNote, setNewNote] = useState('');
  const [newTag, setNewTag] = useState('');

  React.useEffect(() => {
    if (dossier) {
      setFormData({ ...dossier });
    } else {
      setFormData({
        id: '',
        clientName: '',
        email: '',
        phone: '',
        company: '',
        address: '',
        managerId: '',
        managerName: '',
        status: 'blue',
        totalAmount: 0,
        originalAmount: 0,
        paidAmount: 0,
        invoiceCount: 0,
        lastContact: new Date().toISOString(),
        daysOverdue: 0,
        createdAt: new Date().toISOString(),
        notes: [],
        tags: [],
        priority: 'medium'
      });
    }
  }, [dossier, isOpen]);

  const handleSave = () => {
    const dossierData = {
      ...formData,
      id: formData.id || Date.now().toString(),
      createdAt: formData.createdAt || new Date().toISOString()
    };
    onSave(dossierData);
    onClose();
  };

  const addNote = () => {
    if (newNote.trim()) {
      setFormData({
        ...formData,
        notes: [...formData.notes, newNote.trim()]
      });
      setNewNote('');
    }
  };

  const removeNote = (index: number) => {
    setFormData({
      ...formData,
      notes: formData.notes.filter((_, i) => i !== index)
    });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {dossier ? 'Modifier le dossier' : 'Nouveau dossier client'}
              </h3>
              <p className="text-sm text-gray-500">
                {dossier ? `ID: ${dossier.id}` : 'Créer un nouveau dossier de recouvrement'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Informations client */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900">Informations Client</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du client *
                </label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nom complet du client"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="email@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entreprise
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nom de l'entreprise"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Adresse complète"
              />
            </div>
          </div>

          {/* Statut et montants */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900">Statut du Dossier</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="blue">Bleu - Normal</option>
                  <option value="yellow">Jaune - Attention</option>
                  <option value="orange">Orange - Urgent</option>
                  <option value="critical">Critique - Intervention immédiate</option>
                </select>
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
                  <option value="urgent">Urgente</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gestionnaire
                </label>
                <select
                  value={formData.managerId}
                  onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner un gestionnaire</option>
                  <option value="2">Marie Dubois</option>
                  <option value="3">Pierre Martin</option>
                  <option value="4">Sophie Leroy</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant total dû (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({ ...formData, totalAmount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant original (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.originalAmount}
                  onChange={(e) => setFormData({ ...formData, originalAmount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant payé (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.paidAmount}
                  onChange={(e) => setFormData({ ...formData, paidAmount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900">Notes</h4>
            <div className="space-y-2">
              {formData.notes.map((note, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">{note}</span>
                  <button
                    onClick={() => removeNote(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Ajouter une note..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && addNote()}
                />
                <button
                  onClick={addNote}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900">Tags</h4>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Ajouter un tag..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <button
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50 space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {dossier ? 'Sauvegarder' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  );
};

interface ClientDossiersProps {
  onSelectDossier?: (dossier: ClientDossier) => void;
}

const ClientDossiers: React.FC<ClientDossiersProps> = ({ onSelectDossier }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [managerFilter, setManagerFilter] = useState<string>('all');
  const [selectedDossier, setSelectedDossier] = useState<ClientDossier | null>(null);
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [selectedDossiers, setSelectedDossiers] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Mock data pour les dossiers clients
  const [dossiers, setDossiers] = useState<ClientDossier[]>([
    {
      id: '1',
      clientName: 'Jean Martin',
      email: 'jean.martin@example.com',
      phone: '+33 1 23 45 67 89',
      company: 'Martin SARL',
      address: '123 Rue de la Paix, 75001 Paris',
      managerId: '2',
      managerName: 'Marie Dubois',
      status: 'critical',
      totalAmount: 15750.50,
      originalAmount: 18250.50,
      paidAmount: 2500.00,
      invoiceCount: 3,
      lastPayment: '2024-11-15',
      lastContact: '2024-12-10',
      daysOverdue: 45,
      createdAt: '2024-01-15',
      notes: ['Client difficile à joindre', 'Promesse de règlement au 15/12'],
      tags: ['VIP', 'Récurrent'],
      priority: 'urgent',
      nextAction: {
        type: 'Appel de suivi',
        date: '2024-12-16',
        description: 'Vérifier le respect de la promesse de paiement'
      }
    },
    {
      id: '2',
      clientName: 'Sophie Leroy',
      email: 'sophie.leroy@company.com',
      phone: '+33 1 98 76 54 32',
      company: 'Leroy & Associés',
      address: '456 Avenue des Champs, 69000 Lyon',
      managerId: '2',
      managerName: 'Marie Dubois',
      status: 'orange',
      totalAmount: 8200.00,
      originalAmount: 8200.00,
      paidAmount: 0,
      invoiceCount: 2,
      lastContact: '2024-12-08',
      daysOverdue: 25,
      createdAt: '2024-02-01',
      notes: ['Bon payeur habituellement'],
      tags: ['Entreprise'],
      priority: 'high'
    },
    {
      id: '3',
      clientName: 'Pierre Dubois',
      email: 'pierre.dubois@tech.fr',
      phone: '+33 1 45 67 89 01',
      company: 'TechSolutions',
      address: '789 Boulevard Tech, 31000 Toulouse',
      managerId: '3',
      managerName: 'Pierre Martin',
      status: 'yellow',
      totalAmount: 5400.00,
      originalAmount: 7200.00,
      paidAmount: 1800.00,
      invoiceCount: 1,
      lastPayment: '2024-11-30',
      lastContact: '2024-12-05',
      daysOverdue: 15,
      createdAt: '2024-03-10',
      notes: ['Paiement partiel reçu'],
      tags: ['Tech', 'Nouveau'],
      priority: 'medium'
    }
  ]);

  const filteredDossiers = dossiers.filter(dossier => {
    const matchesSearch = dossier.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dossier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dossier.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || dossier.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || dossier.priority === priorityFilter;
    const matchesManager = managerFilter === 'all' || dossier.managerId === managerFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesManager;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'blue': return { label: 'Bleu', color: 'bg-blue-100 text-blue-800', icon: CheckCircle };
      case 'yellow': return { label: 'Jaune', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
      case 'orange': return { label: 'Orange', color: 'bg-orange-100 text-orange-800', icon: AlertCircle };
      case 'critical': return { label: 'Critique', color: 'bg-red-100 text-red-800', icon: AlertCircle };
      default: return { label: status, color: 'bg-gray-100 text-gray-800', icon: CheckCircle };
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'low': return { label: 'Basse', color: 'bg-green-100 text-green-800' };
      case 'medium': return { label: 'Moyenne', color: 'bg-yellow-100 text-yellow-800' };
      case 'high': return { label: 'Haute', color: 'bg-orange-100 text-orange-800' };
      case 'urgent': return { label: 'Urgente', color: 'bg-red-100 text-red-800' };
      default: return { label: priority, color: 'bg-gray-100 text-gray-800' };
    }
  };

  const handleCreateDossier = () => {
    setSelectedDossier(null);
    setShowDossierModal(true);
  };

  const handleEditDossier = (dossier: ClientDossier) => {
    setSelectedDossier(dossier);
    setShowDossierModal(true);
  };

  // Ajout : gestion du clic sur la ligne pour afficher le détail
  const handleRowClick = (dossier: ClientDossier) => {
    if (onSelectDossier) {
      onSelectDossier(dossier);
    } else {
      handleEditDossier(dossier);
    }
  };

  const handleSaveDossier = (dossierData: ClientDossier) => {
    if (dossierData.id && dossiers.find(d => d.id === dossierData.id)) {
      setDossiers(dossiers.map(dossier => 
        dossier.id === dossierData.id ? dossierData : dossier
      ));
    } else {
      const newDossier = {
        ...dossierData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      setDossiers([...dossiers, newDossier]);
    }
  };

  const handleSelectDossier = (dossierId: string) => {
    setSelectedDossiers(prev => 
      prev.includes(dossierId) 
        ? prev.filter(id => id !== dossierId)
        : [...prev, dossierId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDossiers.length === filteredDossiers.length) {
      setSelectedDossiers([]);
    } else {
      setSelectedDossiers(filteredDossiers.map(dossier => dossier.id));
    }
  };

  const totalAmount = filteredDossiers.reduce((sum, dossier) => sum + dossier.totalAmount, 0);
  const criticalCount = filteredDossiers.filter(dossier => dossier.status === 'critical').length;
  const urgentCount = filteredDossiers.filter(dossier => dossier.priority === 'urgent').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dossiers Clients</h1>
          <p className="text-gray-600">Gestion complète des dossiers de recouvrement</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </button>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
          <button 
            onClick={handleCreateDossier}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Dossier
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Dossiers</p>
              <p className="text-2xl font-bold text-gray-900">{filteredDossiers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <Euro className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Montant Total</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Dossiers Critiques</p>
              <p className="text-2xl font-bold text-gray-900">{criticalCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Zap className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Priorité Urgente</p>
              <p className="text-2xl font-bold text-gray-900">{urgentCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, email ou entreprise..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="critical">Règle 3 Critique</option>
              <option value="orange">Règle 2 dépassé</option>
              <option value="yellow">Règle 1 dépassé</option>
              <option value="blue">Dossier Initial</option>
            </select>
            
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">Toutes priorités</option>
              <option value="urgent">Urgente</option>
              <option value="high">Haute</option>
              <option value="medium">Moyenne</option>
              <option value="low">Basse</option>
            </select>
            
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={managerFilter}
              onChange={(e) => setManagerFilter(e.target.value)}
            >
              <option value="all">Tous gestionnaires</option>
              <option value="2">Marie Dubois</option>
              <option value="3">Pierre Martin</option>
              <option value="4">Sophie Leroy</option>
            </select>
          </div>
        </div>

        {/* Actions groupées */}
        {selectedDossiers.length > 0 && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {selectedDossiers.length} dossier(s) sélectionné(s)
              </span>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                  Relance groupée
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                  Exporter sélection
                </button>
                <button className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700">
                  Changer statut
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Liste des dossiers */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedDossiers.length === filteredDossiers.length && filteredDossiers.length > 0}
                onChange={handleSelectAll}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
              />
              <h3 className="text-lg font-medium text-gray-900">
                Dossiers ({filteredDossiers.length})
              </h3>
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredDossiers.map((dossier) => {
            const statusConfig = getStatusConfig(dossier.status);
            const priorityConfig = getPriorityConfig(dossier.priority);
            const StatusIcon = statusConfig.icon;
            const isSelected = selectedDossiers.includes(dossier.id);
            const progressPercentage = dossier.originalAmount > 0 ? (dossier.paidAmount / dossier.originalAmount) * 100 : 0;
            
            return (
              <div
                key={dossier.id}
                className={`p-6 hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50' : ''} cursor-pointer`}
                onClick={() => handleRowClick(dossier)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectDossier(dossier.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-700">
                        {dossier.clientName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900">{dossier.clientName}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig.label}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig.color}`}>
                          {priorityConfig.label}
                        </span>
                        {dossier.company && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <Building className="h-3 w-3 mr-1" />
                            {dossier.company}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {dossier.email}
                        </span>
                        <span className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {dossier.phone}
                        </span>
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {dossier.managerName}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {dossier.daysOverdue} jours de retard
                        </span>
                      </div>
                      
                      {/* Barre de progression */}
                      <div className="mt-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progression du recouvrement</span>
                          <span>{progressPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Tags */}
                      {dossier.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {dossier.tags.map((tag) => (
                            <span key={tag} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="space-y-1 mb-4">
                      <div className="text-2xl font-bold text-gray-900">
                        {formatCurrency(dossier.totalAmount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        sur {formatCurrency(dossier.originalAmount)}
                      </div>
                      {dossier.paidAmount > 0 && (
                        <div className="text-sm text-green-600">
                          Payé: {formatCurrency(dossier.paidAmount)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Phone className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                        <Mail className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg">
                        <MessageSquare className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleEditDossier(dossier); }}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Prochaine action */}
                {dossier.nextAction && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="bg-orange-100 p-2 rounded-lg">
                        <Target className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Prochaine action: {dossier.nextAction.type}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(dossier.nextAction.date).toLocaleDateString('fr-FR')} - {dossier.nextAction.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de dossier */}
      <DossierModal
        dossier={selectedDossier}
        isOpen={showDossierModal}
        onClose={() => setShowDossierModal(false)}
        onSave={handleSaveDossier}
      />
    </div>
  );
};

export default ClientDossiers;