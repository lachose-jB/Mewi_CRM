import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  Download, 
  ChevronDown, 
  ArrowUpDown,
  AlertCircle,
  Clock,
  CheckCircle,
  CreditCard,
  Users,
  Calendar
} from 'lucide-react';
import { useCrm } from '../../contexts/CrmContext';
import { useAuth } from '../../contexts/AuthContext';
import DebtorOverviewCard from './DebtorOverviewCard';
import { Debtor } from '../../types';
import { getRecoveryStatusConfig, getDebtorStatusConfig } from '../../utils/dataUtils';

const DebtorsList: React.FC = () => {
  const { debtors, clients, refreshData } = useCrm();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [recoveryStatusFilter, setRecoveryStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('updatedAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [clientDebtors, setClientDebtors] = useState<Debtor[]>([]);

  // Get client debtors
  useEffect(() => {
    if (user && user.role === 'client') {
      const client = clients.find(c => c.userId === user.id);
      if (client) {
        const clientDocs = debtors.filter(d => d.clientId === client.id);
        setClientDebtors(clientDocs);
      }
    }
  }, [user, clients, debtors]);

  const handleRefresh = async () => {
    setIsLoading(true);
    await refreshData();
    setIsLoading(false);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort debtors
  const filteredDebtors = clientDebtors.filter(debtor => {
    const matchesSearch = 
      debtor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (debtor.company && debtor.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      debtor.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || debtor.status === statusFilter;
    const matchesRecoveryStatus = recoveryStatusFilter === 'all' || debtor.recoveryStatus === recoveryStatusFilter;
    
    return matchesSearch && matchesStatus && matchesRecoveryStatus;
  });

  const sortedDebtors = [...filteredDebtors].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'amount':
        comparison = a.totalAmount - b.totalAmount;
        break;
      case 'daysOverdue':
        comparison = a.daysOverdue - b.daysOverdue;
        break;
      case 'updatedAt':
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
      default:
        comparison = 0;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  if (clientDebtors.length === 0 && !isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">Aucun dossier débiteur</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Vous n'avez actuellement aucun dossier de recouvrement en cours. 
            Contactez votre gestionnaire pour plus d'informations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Vos débiteurs</h1>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Actualisation...' : 'Actualiser'}
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total dossiers</p>
            <p className="text-xl font-bold text-gray-900">{clientDebtors.length}</p>
          </div>
          <Users className="h-8 w-8 text-blue-500" />
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">En retard</p>
            <p className="text-xl font-bold text-red-600">
              {clientDebtors.filter(d => d.daysOverdue > 0).length}
            </p>
          </div>
          <Clock className="h-8 w-8 text-red-500" />
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Terminés</p>
            <p className="text-xl font-bold text-green-600">
              {clientDebtors.filter(d => d.status === 'recovered').length}
            </p>
          </div>
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">En échéancier</p>
            <p className="text-xl font-bold text-indigo-600">
              {clientDebtors.filter(d => d.status === 'paymentPlan').length}
            </p>
          </div>
          <Calendar className="h-8 w-8 text-indigo-500" />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un débiteur..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="flex-1 min-w-[150px]">
              <label className="sr-only">Statut</label>
              <div className="relative">
                <select
                  className="appearance-none w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="new">Nouveaux</option>
                  <option value="inProgress">En cours</option>
                  <option value="paymentPlan">Plan de paiement</option>
                  <option value="disputed">Contestés</option>
                  <option value="litigation">Contentieux</option>
                  <option value="recovered">Recouvrés</option>
                  <option value="uncollectible">Irrécouvrables</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <div className="flex-1 min-w-[150px]">
              <label className="sr-only">Niveau de relance</label>
              <div className="relative">
                <select
                  className="appearance-none w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={recoveryStatusFilter}
                  onChange={(e) => setRecoveryStatusFilter(e.target.value)}
                >
                  <option value="all">Tous les niveaux</option>
                  <option value="blue">Dossier Initial</option>
                  <option value="yellow">Relance 1</option>
                  <option value="orange">Relance 2</option>
                  <option value="critical">Relance 3 Critique</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <div className="flex-1 min-w-[180px]">
              <label className="sr-only">Trier par</label>
              <div className="relative">
                <select
                  className="appearance-none w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={`${sortField}-${sortDirection}`}
                  onChange={(e) => {
                    const [field, direction] = e.target.value.split('-');
                    setSortField(field);
                    setSortDirection(direction);
                  }}
                >
                  <option value="updatedAt-desc">Récemment mis à jour</option>
                  <option value="name-asc">Nom (A-Z)</option>
                  <option value="name-desc">Nom (Z-A)</option>
                  <option value="amount-desc">Montant (Décroissant)</option>
                  <option value="amount-asc">Montant (Croissant)</option>
                  <option value="daysOverdue-desc">Jours de retard (Décroissant)</option>
                </select>
                <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="text-center py-12">
          <RefreshCw className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
          <p className="text-gray-500">Chargement des débiteurs...</p>
        </div>
      ) : sortedDebtors.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun débiteur trouvé</h3>
          <p className="text-gray-500">
            Aucun débiteur ne correspond à vos critères de recherche.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            {sortedDebtors.length} débiteur{sortedDebtors.length > 1 ? 's' : ''} trouvé{sortedDebtors.length > 1 ? 's' : ''}
          </p>
          
          {sortedDebtors.map(debtor => (
            <DebtorOverviewCard 
              key={debtor.id} 
              debtor={debtor}
              showDetails
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DebtorsList;