import React, { useState, useEffect } from 'react';
import { 
  ArrowUpDown, 
  Building, 
  ChevronDown, 
  ChevronRight, 
  Clock, 
  Download, 
  Eye, 
  Filter, 
  Plus, 
  RefreshCw, 
  Search, 
  Users,
  AlertCircle,
  CheckCircle,
  Target,
  CreditCard,
  TrendingUp,
  ArrowRight,
  Calendar,
  Edit3
} from 'lucide-react';
import { useCrm } from '../../contexts/CrmContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  formatCurrency, 
  getRecoveryStatusConfig, 
  getDebtorStatusConfig, 
  getPriorityConfig 
} from '../../utils/dataUtils';
import { Debtor, Client, Invoice } from '../../types';

const DebtorPortfolio: React.FC = () => {
  const { debtors, clients, invoices, refreshData } = useCrm();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [recoveryStatusFilter, setRecoveryStatusFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [sortField, setSortField] = useState('updatedAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [expandedDebtor, setExpandedDebtor] = useState<string | null>(null);
  const [managerDebtors, setManagerDebtors] = useState<Debtor[]>([]);

  // Get debtors assigned to this manager
  useEffect(() => {
    if (user && user.role === 'manager') {
      const assignedDebtors = debtors.filter(debtor => debtor.managerId === user.id);
      setManagerDebtors(assignedDebtors);
    }
  }, [user, debtors]);

  // Handle refresh
  const handleRefresh = async () => {
    setIsLoading(true);
    await refreshData();
    setIsLoading(false);
  };

  // Handle expanded debtor
  const toggleExpandedDebtor = (debtorId: string) => {
    setExpandedDebtor(expandedDebtor === debtorId ? null : debtorId);
  };

  // Filter and sort debtors
  const filteredDebtors = managerDebtors.filter(debtor => {
    const matchesSearch = 
      debtor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (debtor.company && debtor.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      debtor.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || debtor.status === statusFilter;
    const matchesRecoveryStatus = recoveryStatusFilter === 'all' || debtor.recoveryStatus === recoveryStatusFilter;
    const matchesClient = clientFilter === 'all' || debtor.clientId === clientFilter;
    
    return matchesSearch && matchesStatus && matchesRecoveryStatus && matchesClient;
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
      case 'priority':
        const priorityOrder = { low: 0, medium: 1, high: 2, urgent: 3 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      case 'recoveryStatus':
        const statusOrder = { blue: 0, yellow: 1, orange: 2, critical: 3 };
        comparison = statusOrder[a.recoveryStatus] - statusOrder[b.recoveryStatus];
        break;
      default:
        comparison = 0;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Calculate stats
  const totalAmount = managerDebtors.reduce((sum, debtor) => sum + debtor.totalAmount, 0);
  const totalCollected = managerDebtors.reduce((sum, debtor) => sum + debtor.paidAmount, 0);
  const totalOverdue = managerDebtors.filter(d => d.daysOverdue > 0).length;
  const totalRecovered = managerDebtors.filter(d => d.status === 'recovered').length;

  // Get client debtors for filter
  const managerClients = clients.filter(c => c.assignedManagerId === user?.id);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Portefeuille Débiteurs</h1>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Actualisation...' : 'Actualiser'}
          </button>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Débiteur
          </button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Débiteurs</p>
              <p className="text-xl font-bold text-gray-900">{managerDebtors.length}</p>
            </div>
            <Users className="h-6 w-6 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Montant Total</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
            </div>
            <CreditCard className="h-6 w-6 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Montant Recouvré</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(totalCollected)}</p>
            </div>
            <TrendingUp className="h-6 w-6 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Taux Global</p>
              <p className="text-xl font-bold text-blue-600">
                {totalAmount > 0 ? ((totalCollected / totalAmount) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <Target className="h-6 w-6 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un débiteur..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[150px]">
              <label className="sr-only">Status</label>
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
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
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
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <div className="flex-1 min-w-[180px]">
              <label className="sr-only">Client</label>
              <div className="relative">
                <select
                  className="appearance-none w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={clientFilter}
                  onChange={(e) => setClientFilter(e.target.value)}
                >
                  <option value="all">Tous les clients</option>
                  {managerClients.map(client => (
                    <option key={client.id} value={client.id}>{client.company}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
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
                  <option value="priority-desc">Priorité (Décroissant)</option>
                  <option value="recoveryStatus-desc">Niveau critique d'abord</option>
                </select>
                <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
          <RefreshCw className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
          <p className="text-gray-500">Chargement des débiteurs...</p>
        </div>
      ) : sortedDebtors.length === 0 ? (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun débiteur trouvé</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || statusFilter !== 'all' || recoveryStatusFilter !== 'all' || clientFilter !== 'all'
              ? "Aucun débiteur ne correspond à vos critères de recherche."
              : "Vous n'avez aucun débiteur assigné."}
          </p>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un débiteur
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <p className="text-sm text-gray-500">
              {sortedDebtors.length} débiteur{sortedDebtors.length !== 1 ? 's' : ''} trouvé{sortedDebtors.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {sortedDebtors.map(debtor => {
            const client = clients.find(c => c.id === debtor.clientId);
            const recoveryStatusConfig = getRecoveryStatusConfig(debtor.recoveryStatus);
            const statusConfig = getDebtorStatusConfig(debtor.status);
            const priorityConfig = getPriorityConfig(debtor.priority);
            const isExpanded = expandedDebtor === debtor.id;
            
            const debtorInvoices = invoices.filter(inv => inv.debtorId === debtor.id);
            
            const recoveryRate = debtor.originalAmount > 0 
              ? (debtor.paidAmount / debtor.originalAmount) * 100 
              : 0;
            
            return (
              <div key={debtor.id} className="bg-white rounded-lg shadow border border-gray-200">
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleExpandedDebtor(debtor.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex">
                      <div className={`p-2.5 rounded-lg mr-4 flex-shrink-0 ${
                        debtor.recoveryStatus === 'critical' ? 'bg-red-100' :
                        debtor.recoveryStatus === 'orange' ? 'bg-orange-100' :
                        debtor.recoveryStatus === 'yellow' ? 'bg-yellow-100' : 'bg-blue-100'
                      }`}>
                        {debtor.type === 'company' ? (
                          <Building className={`h-6 w-6 ${
                            debtor.recoveryStatus === 'critical' ? 'text-red-600' :
                            debtor.recoveryStatus === 'orange' ? 'text-orange-600' :
                            debtor.recoveryStatus === 'yellow' ? 'text-yellow-600' : 'text-blue-600'
                          }`} />
                        ) : (
                          <User className={`h-6 w-6 ${
                            debtor.recoveryStatus === 'critical' ? 'text-red-600' :
                            debtor.recoveryStatus === 'orange' ? 'text-orange-600' :
                            debtor.recoveryStatus === 'yellow' ? 'text-yellow-600' : 'text-blue-600'
                          }`} />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-base font-medium text-gray-900">{debtor.name}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${recoveryStatusConfig.color}`}>
                            {recoveryStatusConfig.label}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig.color}`}>
                            {priorityConfig.label}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                          {debtor.company && (
                            <span className="flex items-center">
                              <Building className="h-4 w-4 mr-1 text-gray-400" />
                              {debtor.company}
                            </span>
                          )}
                          <span className="flex items-center">
                            <Mail className="h-4 w-4 mr-1 text-gray-400" />
                            {debtor.email}
                          </span>
                          <span className="flex items-center">
                            <Phone className="h-4 w-4 mr-1 text-gray-400" />
                            {debtor.phone}
                          </span>
                          {client && (
                            <span className="flex items-center">
                              <Users className="h-4 w-4 mr-1 text-gray-400" />
                              Client: {client.company}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-6">
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{formatCurrency(debtor.totalAmount)}</div>
                        <div className="text-sm text-gray-500">
                          {debtor.paidAmount > 0 ? (
                            <span>{formatCurrency(debtor.paidAmount)} payés</span>
                          ) : (
                            <span>0% payé</span>
                          )}
                        </div>
                        <div className="flex items-center justify-end mt-2">
                          {debtor.daysOverdue > 0 ? (
                            <span className={`flex items-center text-sm font-medium ${
                              debtor.daysOverdue > 30 ? 'text-red-600' : 
                              debtor.daysOverdue > 15 ? 'text-orange-600' : 
                              'text-yellow-600'
                            }`}>
                              <Clock className="h-4 w-4 mr-1" />
                              {debtor.daysOverdue} jours
                            </span>
                          ) : (
                            <span className="flex items-center text-sm font-medium text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              À jour
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-gray-400 mt-2" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-400 mt-2" />
                      )}
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progression du recouvrement</span>
                      <span>{recoveryRate.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-green-500 h-1.5 rounded-full" 
                        style={{ width: `${recoveryRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Quick actions */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Actions rapides</h4>
                        <div className="flex flex-wrap gap-2">
                          <button className="flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                            <Mail className="h-4 w-4 mr-1.5" />
                            Envoyer un email
                          </button>
                          <button className="flex items-center px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors">
                            <Phone className="h-4 w-4 mr-1.5" />
                            Appeler
                          </button>
                          <button className="flex items-center px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                            <CreditCard className="h-4 w-4 mr-1.5" />
                            Enregistrer paiement
                          </button>
                          <button className="flex items-center px-3 py-1.5 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors">
                            <Edit3 className="h-4 w-4 mr-1.5" />
                            Modifier
                          </button>
                          <button className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
                            <Eye className="h-4 w-4 mr-1.5" />
                            Détails
                          </button>
                        </div>
                      </div>
                      
                      {/* Invoice summary */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Factures</h4>
                        {debtorInvoices.length > 0 ? (
                          <div className="space-y-2">
                            {debtorInvoices.slice(0, 3).map(invoice => (
                              <div 
                                key={invoice.id}
                                className="flex items-center justify-between p-2 bg-white rounded border border-gray-200 text-sm"
                              >
                                <div className="flex items-center">
                                  <FileText className={`h-4 w-4 mr-2 ${
                                    invoice.status === 'paid' ? 'text-green-500' :
                                    invoice.status === 'partial' ? 'text-yellow-500' :
                                    invoice.status === 'overdue' ? 'text-red-500' :
                                    'text-blue-500'
                                  }`} />
                                  <span className="font-medium">{invoice.invoiceNumber}</span>
                                  <span className="mx-1 text-gray-400">•</span>
                                  <span className="text-gray-600">{new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</span>
                                </div>
                                <span className="font-medium">{formatCurrency(invoice.amount)}</span>
                              </div>
                            ))}
                            
                            {debtorInvoices.length > 3 && (
                              <div className="text-center pt-1">
                                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                  Voir toutes les factures ({debtorInvoices.length})
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center p-3 bg-white rounded border border-gray-200">
                            <p className="text-sm text-gray-500">Aucune facture trouvée</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Notes and next actions */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Notes</h4>
                        {debtor.notes && debtor.notes.length > 0 ? (
                          <div className="space-y-2">
                            {debtor.notes.map((note, index) => (
                              <div key={index} className="p-2 bg-white rounded border border-gray-200 text-sm text-gray-700">
                                {note}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-3 bg-white rounded border border-gray-200 text-center">
                            <p className="text-sm text-gray-500">Aucune note</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Next action */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Prochaine action</h4>
                        {debtor.nextAction ? (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-start">
                              <Calendar className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                              <div>
                                <p className="text-sm font-medium text-blue-900">{debtor.nextAction.type}</p>
                                <p className="text-sm text-blue-700">
                                  {new Date(debtor.nextAction.date).toLocaleDateString('fr-FR')} - {debtor.nextAction.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 bg-white rounded border border-gray-200 text-center">
                            <p className="text-sm text-gray-500">Aucune action planifiée</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                      <button className="flex items-center text-blue-600 hover:text-blue-800 font-medium">
                        Voir tous les détails
                        <ArrowRight className="h-4 w-4 ml-1.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DebtorPortfolio;