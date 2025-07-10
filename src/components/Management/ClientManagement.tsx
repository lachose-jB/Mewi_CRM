import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Plus, 
  Search, 
  Edit3, 
  Trash2,
  FileText,
  Phone,
  Mail,
  User,
  CheckCircle,
  X,
  Save,
  RefreshCw,
  Users,
  BarChart3,
  Calendar,
  ArrowUpDown,
  ChevronDown,
  ArrowRight,
  Download,
  Eye
} from 'lucide-react';
import { useCrm } from '../../contexts/CrmContext';
import { formatCurrency, getClientStatusConfig } from '../../utils/dataUtils';
import { Client } from '../../types';

interface ClientModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Client) => void;
  onDelete: (clientId: string) => void;
}

const ClientModal: React.FC<ClientModalProps> = ({ 
  client, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete 
}) => {
  const [formData, setFormData] = useState<Client>({
    id: '',
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    contactPerson: '',
    contactRole: '',
    assignedManagerId: '',
    assignedManagerName: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active',
    contractStart: new Date().toISOString(),
    notes: [],
    totalDebtAmount: 0,
    totalCollectedAmount: 0,
    recoveryRate: 0
  });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [managers] = useState([
    { id: 'manager1', name: 'Marie Dubois' },
    { id: 'manager2', name: 'Pierre Martin' },
    { id: 'manager3', name: 'Sophie Leroy' }
  ]);

  useEffect(() => {
    if (client) {
      setFormData(client);
    } else {
      // Reset form for new client
      setFormData({
        id: '',
        name: '',
        email: '',
        phone: '',
        company: '',
        address: '',
        contactPerson: '',
        contactRole: '',
        assignedManagerId: '',
        assignedManagerName: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
        contractStart: new Date().toISOString(),
        notes: [],
        totalDebtAmount: 0,
        totalCollectedAmount: 0,
        recoveryRate: 0
      });
    }
    setConfirmDelete(false);
  }, [client, isOpen]);

  const handleSave = () => {
    // Validate form
    if (!formData.name || !formData.email || !formData.assignedManagerId) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    // Update assignedManagerName based on selection
    const manager = managers.find(m => m.id === formData.assignedManagerId);
    const updatedData = {
      ...formData,
      assignedManagerName: manager ? manager.name : formData.assignedManagerName,
      updatedAt: new Date().toISOString()
    };
    
    onSave(updatedData);
    onClose();
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      setFormData({
        ...formData,
        notes: [...formData.notes, newNote.trim()]
      });
      setNewNote('');
    }
  };

  const handleRemoveNote = (index: number) => {
    setFormData({
      ...formData,
      notes: formData.notes.filter((_, i) => i !== index)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-4">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {client ? 'Modifier le client' : 'Nouveau client'}
              </h3>
              {client && (
                <p className="text-sm text-gray-500">ID: {client.id}</p>
              )}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Informations générales</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la société <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email de contact <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'inactive' | 'suspended'})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="suspended">Suspendu</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Contact Person */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Personne de contact</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du contact <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({...formData, contactPerson: e.target.value, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fonction
                </label>
                <input
                  type="text"
                  value={formData.contactRole}
                  onChange={(e) => setFormData({...formData, contactRole: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Assignment */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Assignation</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gestionnaire assigné <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.assignedManagerId}
                onChange={(e) => {
                  const selectedManager = managers.find(m => m.id === e.target.value);
                  setFormData({
                    ...formData, 
                    assignedManagerId: e.target.value,
                    assignedManagerName: selectedManager ? selectedManager.name : ''
                  });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Sélectionner un gestionnaire</option>
                {managers.map(manager => (
                  <option key={manager.id} value={manager.id}>{manager.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Contract */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Contrat</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de début
                </label>
                <input
                  type="date"
                  value={formData.contractStart.split('T')[0]}
                  onChange={(e) => setFormData({...formData, contractStart: `${e.target.value}T00:00:00Z`})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de fin (optionnel)
                </label>
                <input
                  type="date"
                  value={formData.contractEnd?.split('T')[0] || ''}
                  onChange={(e) => setFormData({...formData, contractEnd: e.target.value ? `${e.target.value}T23:59:59Z` : undefined})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Notes</h4>
            <div className="space-y-2 mb-4">
              {formData.notes.map((note, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{note}</p>
                  <button
                    onClick={() => handleRemoveNote(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ajouter une note..."
                onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
              />
              <button
                onClick={handleAddNote}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div>
            {client && (
              <div>
                {confirmDelete ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-red-600">Confirmer la suppression ?</span>
                    <button
                      onClick={() => onDelete(client.id)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                    >
                      Confirmer
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="flex items-center text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5 mr-1" />
                    Supprimer
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save className="h-5 w-5 mr-2" />
              {client ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ClientManagement: React.FC = () => {
  const { clients, debtors, createClient, updateClient, deleteClient, refreshData } = useCrm();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Handlers
  const handleCreateClient = () => {
    setSelectedClient(null);
    setShowModal(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setShowModal(true);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    await refreshData();
    setIsLoading(false);
  };

  const handleSaveClient = async (clientData: Client) => {
    try {
      setIsLoading(true);
      
      if (clientData.id) {
        // Update existing client
        await updateClient(clientData.id, clientData);
      } else {
        // Create new client
        await createClient(clientData);
      }
      
      await refreshData();
    } catch (error) {
      console.error('Error saving client:', error);
      alert('Une erreur est survenue lors de l\'enregistrement du client.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      setIsLoading(true);
      await deleteClient(clientId);
      await refreshData();
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('Une erreur est survenue lors de la suppression du client.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort clients
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedClients = [...filteredClients].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'company':
        comparison = a.company.localeCompare(b.company);
        break;
      case 'totalDebtAmount':
        comparison = a.totalDebtAmount - b.totalDebtAmount;
        break;
      case 'recoveryRate':
        comparison = a.recoveryRate - b.recoveryRate;
        break;
      default:
        comparison = 0;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Count clients by status
  const activeClients = clients.filter(c => c.status === 'active').length;
  const inactiveClients = clients.filter(c => c.status === 'inactive').length;
  const suspendedClients = clients.filter(c => c.status === 'suspended').length;

  // Calculate totals
  const totalDebtAmount = clients.reduce((sum, client) => sum + client.totalDebtAmount, 0);
  const totalCollectedAmount = clients.reduce((sum, client) => sum + client.totalCollectedAmount, 0);
  const avgRecoveryRate = clients.length > 0
    ? clients.reduce((sum, client) => sum + client.recoveryRate, 0) / clients.length
    : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Clients</h1>
          <p className="text-gray-600">Gérer les clients qui vous confient leurs débiteurs</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Actualisation...' : 'Actualiser'}
          </button>
          <button 
            onClick={handleCreateClient}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Client
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Clients</p>
              <p className="text-xl font-bold text-gray-900">{clients.length}</p>
            </div>
            <Building className="h-6 w-6 text-blue-500" />
          </div>
          <div className="mt-2 text-xs flex items-center justify-between">
            <span className="text-gray-500">
              {activeClients} actifs • {inactiveClients} inactifs • {suspendedClients} suspendus
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Montant Total</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(totalDebtAmount)}</p>
            </div>
            <FileText className="h-6 w-6 text-green-500" />
          </div>
          <div className="mt-2 text-xs flex items-center">
            <span className="text-gray-500">
              {formatCurrency(totalCollectedAmount)} recouvrés
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Taux de Recouvrement</p>
              <p className="text-xl font-bold text-gray-900">{avgRecoveryRate.toFixed(1)}%</p>
            </div>
            <BarChart3 className="h-6 w-6 text-purple-500" />
          </div>
          <div className="mt-2 text-xs">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-purple-600 h-1.5 rounded-full" 
                style={{ width: `${avgRecoveryRate}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Débiteurs</p>
              <p className="text-xl font-bold text-gray-900">{debtors.length}</p>
            </div>
            <Users className="h-6 w-6 text-orange-500" />
          </div>
          <div className="mt-2 text-xs">
            <span className="text-gray-500">
              {debtors.filter(d => d.status === 'recovered').length} recouvrés
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un client..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="relative min-w-[150px]">
              <select
                className="appearance-none w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actifs</option>
                <option value="inactive">Inactifs</option>
                <option value="suspended">Suspendus</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
            
            <div className="relative min-w-[200px]">
              <select
                className="appearance-none w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={`${sortField}-${sortDirection}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split('-');
                  setSortField(field);
                  setSortDirection(direction);
                }}
              >
                <option value="name-asc">Nom (A-Z)</option>
                <option value="name-desc">Nom (Z-A)</option>
                <option value="company-asc">Entreprise (A-Z)</option>
                <option value="company-desc">Entreprise (Z-A)</option>
                <option value="totalDebtAmount-desc">Montant (décroissant)</option>
                <option value="totalDebtAmount-asc">Montant (croissant)</option>
                <option value="recoveryRate-desc">Taux (décroissant)</option>
                <option value="recoveryRate-asc">Taux (croissant)</option>
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Clients list */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">
            {filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''} trouvé{filteredClients.length !== 1 ? 's' : ''}
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {isLoading ? (
            <div className="p-6 text-center">
              <RefreshCw className="h-8 w-8 text-blue-500 mx-auto mb-4 animate-spin" />
              <p className="text-gray-500">Chargement des clients...</p>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="p-6 text-center">
              <Building className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun client trouvé</h3>
              <p className="text-gray-500 mb-4">Aucun client ne correspond à vos critères de recherche.</p>
              <button 
                onClick={handleCreateClient}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un client
              </button>
            </div>
          ) : (
            sortedClients.map(client => {
              const statusConfig = getClientStatusConfig(client.status);
              const clientDebtors = debtors.filter(d => d.clientId === client.id);
              
              return (
                <div key={client.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex">
                      <div className={`p-3 rounded-lg mr-4 ${
                        client.status === 'active' ? 'bg-green-100' :
                        client.status === 'inactive' ? 'bg-gray-100' : 'bg-red-100'
                      }`}>
                        <Building className={`h-6 w-6 ${
                          client.status === 'active' ? 'text-green-600' :
                          client.status === 'inactive' ? 'text-gray-600' : 'text-red-600'
                        }`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900">{client.company}</h3>
                          <span className={`ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                        </div>
                        
                        <div className="mt-1 flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 gap-2 sm:gap-4">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1.5" />
                            {client.contactPerson}
                            {client.contactRole && (
                              <span className="text-xs ml-1.5 text-gray-400">({client.contactRole})</span>
                            )}
                          </div>
                          
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1.5" />
                            {client.email}
                          </div>
                          
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-1.5" />
                            {client.phone || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{formatCurrency(client.totalDebtAmount)}</div>
                        <div className="text-sm text-gray-500">
                          {clientDebtors.length} débiteur{clientDebtors.length !== 1 ? 's' : ''}
                        </div>
                        {client.totalCollectedAmount > 0 && (
                          <div className="text-sm text-green-600 mt-1">
                            {formatCurrency(client.totalCollectedAmount)} recouvrés
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col space-y-1">
                        <button 
                          onClick={() => handleEditClient(client)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit3 className="h-5 w-5" />
                        </button>
                        <button 
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Voir détails"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  {client.recoveryRate > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="text-gray-500">Taux de recouvrement</span>
                        <span className="font-medium text-gray-700">{client.recoveryRate.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-green-500 h-1.5 rounded-full" 
                          style={{ width: `${client.recoveryRate}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Additional info (assignation, dates) */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="h-4 w-4 mr-1.5" />
                      <span>Gestionnaire: {client.assignedManagerName}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1.5" />
                      <span>
                        Client depuis: {new Date(client.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                      {client.contractEnd && (
                        <span className="ml-1">
                          • Contrat jusqu'au: {new Date(client.contractEnd).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Client Modal */}
      <ClientModal 
        client={selectedClient}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveClient}
        onDelete={handleDeleteClient}
      />
    </div>
  );
};

export default ClientManagement;