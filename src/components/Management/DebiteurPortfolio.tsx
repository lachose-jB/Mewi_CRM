import React, { useState, useEffect } from 'react';
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
  RefreshCw,
  Building,
  UserPlus
} from 'lucide-react';
import { useCrm } from '../../contexts/CrmContext';
import { useAuth } from '../../contexts/AuthContext';
import DebtorForm from './DebtorForm';

const ClientPortfolio: React.FC = () => {
  const { clients, invoices, refreshData } = useCrm();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [clientDetails, setClientDetails] = useState<Record<string, any>>({});
  const [showDebtorForm, setShowDebtorForm] = useState(false);
  const [editingDebtor, setEditingDebtor] = useState<any>(null);

  // Filtrer les clients selon le rôle
  const myClients = user?.role === 'manager' 
    ? clients.filter(client => client.manager_id === user.id)
    : clients;

  // Load client details when a client is selected
  useEffect(() => {
    const loadClientDetails = async () => {
      if (!selectedClient) return;
      
      try {
        if (!clientDetails[selectedClient]) {
          setIsLoading(true);
          
          // Get related data from context
          const clientInvoices = invoices.filter(inv => inv.client_id === selectedClient);
          
          setClientDetails(prev => ({
            ...prev,
            [selectedClient]: {
              invoices: clientInvoices
            }
          }));
          
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error loading client details:', error);
        setIsLoading(false);
      }
    };
    
    loadClientDetails();
  }, [selectedClient, invoices]);

  const filteredClients = myClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'blue': return { label: 'Dossier Initial', color: 'bg-blue-100 text-blue-800' };
      case 'yellow': return { label: 'Règle 1 dépassé', color: 'bg-yellow-100 text-yellow-800' };
      case 'orange': return { label: 'Règle 2 dépassé', color: 'bg-orange-100 text-orange-800' };
      case 'critical': return { label: 'Règle 3 Critique', color: 'bg-red-100 text-red-800' };
      default: return { label: status, color: 'bg-gray-100 text-gray-800' };
    }
  };

  const getStatusPriority = (status: string) => {
    const priorities = { critical: 4, orange: 3, yellow: 2, blue: 1 };
    return priorities[status as keyof typeof priorities] || 0;
  };

  const sortedClients = [...filteredClients].sort((a, b) => 
    getStatusPriority(b.status) - getStatusPriority(a.status)
  );

  const totalAmount = filteredClients.reduce((sum, client) => sum + client.total_amount, 0);
  const criticalCount = filteredClients.filter(client => client.status === 'critical').length;

  const handleRefreshData = async () => {
    setIsLoading(true);
    await refreshData();
    setIsLoading(false);
  };

  const handleCreateDebtor = () => {
    setEditingDebtor(null);
    setShowDebtorForm(true);
  };

  const handleEditDebtor = (client: any) => {
    // Convert client data to debtor form format
    const debtorData = {
      name: client.name,
      email: client.email,
      phone: client.phone,
      mobilePhone: client.phone,
      mainAddress: client.address,
      company: client.company,
      totalAmount: client.total_amount.toString(),
      debtorType: client.company ? 'company' : 'individual',
      status: client.status === 'blue' ? 'new' : 
             client.status === 'yellow' ? 'inProgress' : 
             client.status === 'orange' ? 'inProgress' : 'litigation'
    };
    
    setEditingDebtor(debtorData);
    setShowDebtorForm(true);
  };

  const handleSaveDebtor = (debtorData: any) => {
    console.log('Saving debtor data:', debtorData);
    // Here you would typically save the data to your backend
    // For now, we'll just close the form
    setShowDebtorForm(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.role === 'manager' ? 'Mon Portefeuille' : 'Gestion des Débiteurs'}
          </h1>
          <p className="text-gray-600">
            {user?.role === 'manager' 
              ? 'Gérez vos dossiers débiteurs assignés' 
              : 'Vue d\'ensemble de tous les débiteurs'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleRefreshData}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Actualisation...' : 'Actualiser'}
          </button>
          <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </button>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
          <button 
            onClick={handleCreateDebtor}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Nouveau Débiteur
          </button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Dossiers</p>
              <p className="text-2xl font-bold text-gray-900">{filteredClients.length}</p>
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
              <FileText className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Dossiers Critiques</p>
              <p className="text-2xl font-bold text-gray-900">{criticalCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Actions Aujourd'hui</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un débiteur..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-3">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="critical">Règle 3 dépassé Critique</option>
              <option value="orange">Règle 2 dépassé</option>
              <option value="yellow">Règle 1 dépassé</option>
              <option value="blue">Dossier Initial</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des clients */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Débiteurs ({sortedClients.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {isLoading && sortedClients.length === 0 ? (
            <div className="p-6 text-center">
              <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Chargement des débiteurs...</p>
            </div>
          ) : sortedClients.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600">Aucun débiteur trouvé</p>
            </div>
          ) : (
            sortedClients.map((client) => {
              const statusConfig = getStatusConfig(client.status);
              const detail = clientDetails[client.id];
              
              return (
                <div 
                  key={client.id} 
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedClient(selectedClient === client.id ? null : client.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        {client.company ? (
                          <Building className="h-6 w-6 text-gray-500" />
                        ) : (
                          <User className="h-6 w-6 text-gray-500" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center space-x-3">
                          <h4 className="text-lg font-medium text-gray-900">{client.name}</h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 mt-1">
                          <p className="text-sm text-gray-500">{client.email}</p>
                          <p className="text-sm text-gray-500">{client.phone}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(client.total_amount)}</p>
                        <p className="text-sm text-gray-500">
                          Dernier contact: {new Date(client.last_contact || Date.now()).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditDebtor(client);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Phone className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <Mail className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <Calendar className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Détails étendus */}
                  {selectedClient === client.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      {isLoading && !detail ? (
                        <div className="flex justify-center">
                          <RefreshCw className="h-6 w-6 text-blue-600 animate-spin" />
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="text-sm font-medium text-gray-900 mb-3">Informations Débiteur</h5>
                            <div className="space-y-2 text-sm text-gray-600">
                              <p><span className="font-medium">Adresse:</span> {client.address}</p>
                              <p><span className="font-medium">Créé le:</span> {new Date(client.created_at).toLocaleDateString('fr-FR')}</p>
                              <p><span className="font-medium">Notes:</span> {client.notes?.join(', ') || 'Aucune note'}</p>
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="text-sm font-medium text-gray-900 mb-3">Actions Rapides</h5>
                            <div className="flex flex-wrap gap-2">
                              <button className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                                <Eye className="h-3 w-3 mr-1" />
                                Voir Dossier
                              </button>
                              <button className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                                <Phone className="h-3 w-3 mr-1" />
                                Appeler
                              </button>
                              <button className="flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                                <Mail className="h-3 w-3 mr-1" />
                                Email
                              </button>
                              <button className="flex items-center px-3 py-1 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors">
                                <Edit3 className="h-3 w-3 mr-1" />
                                Modifier
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Formulaire de débiteur */}
      <DebtorForm
        isOpen={showDebtorForm}
        onClose={() => setShowDebtorForm(false)}
        onSave={handleSaveDebtor}
        initialData={editingDebtor}
      />
    </div>
  );
};

export default ClientPortfolio;