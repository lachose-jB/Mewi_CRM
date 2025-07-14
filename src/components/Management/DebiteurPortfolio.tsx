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
  UserPlus,
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { useCrm } from '../../contexts/CrmContext';
import { useAuth } from '../../contexts/AuthContext';
import DebtorForm from './DebtorForm';

const DebiteurPortfolio: React.FC = () => {
  const { clients, invoices, refreshData } = useCrm();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDebiteur, setSelectedDebiteur] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [debiteurDetails, setDebiteurDetails] = useState<Record<string, any>>({});
  const [showDebtorForm, setShowDebtorForm] = useState(false);
  const [editingDebtor, setEditingDebtor] = useState<any>(null);

  // Filtrer les débiteurs selon le rôle
  const myDebiteurs = user?.role === 'manager' 
    ? clients.filter(client => client.manager_id === user.id)
    : clients;

  // Load debiteur details when a debiteur is selected
  useEffect(() => {
    const loadDebiteurDetails = async () => {
      if (!selectedDebiteur) return;
      
      try {
        if (!debiteurDetails[selectedDebiteur]) {
          setIsLoading(true);
          
          // Get related data from context
          const debiteurInvoices = invoices.filter(inv => inv.client_id === selectedDebiteur);
          
          setDebiteurDetails(prev => ({
            ...prev,
            [selectedDebiteur]: {
              invoices: debiteurInvoices
            }
          }));
          
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error loading debiteur details:', error);
        setIsLoading(false);
      }
    };
    
    loadDebiteurDetails();
  }, [selectedDebiteur, invoices]);

  const filteredDebiteurs = myDebiteurs.filter(debiteur => {
    const matchesSearch = debiteur.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         debiteur.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || debiteur.status === statusFilter;
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

  const sortedDebiteurs = [...filteredDebiteurs].sort((a, b) => 
    getStatusPriority(b.status) - getStatusPriority(a.status)
  );

  const totalAmount = filteredDebiteurs.reduce((sum, debiteur) => sum + debiteur.total_amount, 0);
  const criticalCount = filteredDebiteurs.filter(debiteur => debiteur.status === 'critical').length;

  const handleRefreshData = async () => {
    setIsLoading(true);
    await refreshData();
    setIsLoading(false);
  };

  const handleCreateDebtor = () => {
    setEditingDebtor(null);
    setShowDebtorForm(true);
  };

  const handleEditDebtor = (debiteur: any) => {
    // Convert debiteur data to debtor form format
    const debtorData = {
      name: debiteur.name,
      email: debiteur.email,
      phone: debiteur.phone,
      mobilePhone: debiteur.phone,
      mainAddress: debiteur.address,
      company: debiteur.company,
      totalAmount: debiteur.total_amount.toString(),
      debtorType: debiteur.company ? 'company' : 'individual',
      status: debiteur.status === 'blue' ? 'new' : 
             debiteur.status === 'yellow' ? 'inProgress' : 
             debiteur.status === 'orange' ? 'inProgress' : 'litigation'
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
              <p className="text-2xl font-bold text-gray-900">{filteredDebiteurs.length}</p>
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

      {/* Liste des débiteurs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Débiteurs ({sortedDebiteurs.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {isLoading && sortedDebiteurs.length === 0 ? (
            <div className="p-6 text-center">
              <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Chargement des débiteurs...</p>
            </div>
          ) : sortedDebiteurs.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600">Aucun débiteur trouvé</p>
            </div>
          ) : (
            sortedDebiteurs.map((debiteur) => {
              const statusConfig = getStatusConfig(debiteur.status);
              const detail = debiteurDetails[debiteur.id];
              
              return (
                <div 
                  key={debiteur.id} 
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedDebiteur(selectedDebiteur === debiteur.id ? null : debiteur.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        {debiteur.company ? (
                          <Building className="h-6 w-6 text-gray-500" />
                        ) : (
                          <User className="h-6 w-6 text-gray-500" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center space-x-3">
                          <h4 className="text-lg font-medium text-gray-900">{debiteur.name}</h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 mt-1">
                          <p className="text-sm text-gray-500">{debiteur.email}</p>
                          <p className="text-sm text-gray-500">{debiteur.phone}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(debiteur.total_amount)}</p>
                        <p className="text-sm text-gray-500">
                          Dernier contact: {new Date(debiteur.last_contact || Date.now()).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditDebtor(debiteur);
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
                  {selectedDebiteur === debiteur.id && (
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
                              <p><span className="font-medium">Adresse:</span> {debiteur.address}</p>
                              <p><span className="font-medium">Créé le:</span> {new Date(debiteur.created_at).toLocaleDateString('fr-FR')}</p>
                              <p><span className="font-medium">Notes:</span> {debiteur.notes?.join(', ') || 'Aucune note'}</p>
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

export default DebiteurPortfolio;