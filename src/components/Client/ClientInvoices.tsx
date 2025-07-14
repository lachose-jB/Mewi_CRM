import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  Download,
  Eye,
  FileText,
  Filter,
  RefreshCw,
  Search,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowUpDown
} from 'lucide-react';
import { useCrm } from '../../contexts/CrmContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency, formatDate } from '../../utils/dataUtils';
import { Client, Invoice } from '../../types';

const ClientInvoices: React.FC = () => {
  const { clients, invoices, debtors, refreshData } = useCrm();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [client, setClient] = useState<Client | null>(null);
  const [clientInvoices, setClientInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [debtorFilter, setDebtorFilter] = useState('all');
  const [sortField, setSortField] = useState('dueDate');
  const [sortDirection, setSortDirection] = useState('desc');

  // Get client data
  useEffect(() => {
    if (user && user.role === 'client') {
      const foundClient = clients.find(c => c.userId === user.id);
      if (foundClient) {
        setClient(foundClient);
        
        // Get client invoices
        const clientInvs = invoices.filter(inv => inv.clientId === foundClient.id);
        setClientInvoices(clientInvs);
      }
    }
  }, [user, clients, invoices]);

  // Handle refresh
  const handleRefresh = async () => {
    setIsLoading(true);
    await refreshData();
    setIsLoading(false);
  };

  // Filter and sort invoices
  const filteredInvoices = clientInvoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (invoice.description && invoice.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    const matchesDebtor = debtorFilter === 'all' || invoice.debtorId === debtorFilter;
    
    return matchesSearch && matchesStatus && matchesDebtor;
  });

  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'invoiceNumber':
        comparison = a.invoiceNumber.localeCompare(b.invoiceNumber);
        break;
      case 'dueDate':
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        break;
      case 'amount':
        comparison = a.amount - b.amount;
        break;
      case 'status':
        const statusOrder = { paid: 0, partial: 1, pending: 2, overdue: 3 };
        comparison = (statusOrder[a.status as keyof typeof statusOrder] || 0) - 
                    (statusOrder[b.status as keyof typeof statusOrder] || 0);
        break;
      default:
        comparison = 0;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Calculate totals
  const totalAmount = clientInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidAmount = clientInvoices.reduce((sum, invoice) => sum + invoice.paidAmount, 0);
  const originalAmount = clientInvoices.reduce((sum, invoice) => sum + invoice.originalAmount, 0);
  
  const overdueCount = clientInvoices.filter(invoice => invoice.status === 'overdue').length;
  const paidCount = clientInvoices.filter(invoice => invoice.status === 'paid').length;
  const partialCount = clientInvoices.filter(invoice => invoice.status === 'partial').length;
  const pendingCount = clientInvoices.filter(invoice => invoice.status === 'pending').length;

  // Get client debtors for filter
  const clientDebtors = debtors.filter(d => client && d.clientId === client.id);

  if (!client) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Aucune information client trouvée</p>
          <p className="text-gray-400 mt-2">Veuillez contacter votre gestionnaire de compte</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Vos factures</h1>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
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
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total à payer</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Montant payé</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(paidAmount)}</p>
            </div>
            <CreditCard className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Factures en retard</p>
              <p className="text-xl font-bold text-red-600">{overdueCount}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Statut des factures</p>
              <p className="text-sm mt-1">
                <span className="text-green-600 font-medium">{paidCount} payées</span> •&nbsp;
                <span className="text-yellow-600 font-medium">{partialCount} partielles</span> •&nbsp;
                <span className="text-blue-600 font-medium">{pendingCount} en attente</span>
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-indigo-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par numéro ou description..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <select
                className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                <option value="paid">Payées</option>
                <option value="partial">Partielles</option>
                <option value="pending">En attente</option>
                <option value="overdue">En retard</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
            
            <div className="relative">
              <select
                className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={debtorFilter}
                onChange={(e) => setDebtorFilter(e.target.value)}
              >
                <option value="all">Tous les débiteurs</option>
                {clientDebtors.map(debtor => (
                  <option key={debtor.id} value={debtor.id}>{debtor.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
            
            <div className="relative">
              <select
                className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={`${sortField}-${sortDirection}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split('-');
                  setSortField(field);
                  setSortDirection(direction);
                }}
              >
                <option value="dueDate-desc">Échéance (récentes d'abord)</option>
                <option value="dueDate-asc">Échéance (anciennes d'abord)</option>
                <option value="amount-desc">Montant (décroissant)</option>
                <option value="amount-asc">Montant (croissant)</option>
                <option value="status-asc">Statut (critiques d'abord)</option>
                <option value="invoiceNumber-asc">Numéro (croissant)</option>
                <option value="invoiceNumber-desc">Numéro (décroissant)</option>
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Invoices list */}
      {isLoading ? (
        <div className="text-center py-12">
          <RefreshCw className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
          <p className="text-gray-500">Chargement des factures...</p>
        </div>
      ) : sortedInvoices.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune facture trouvée</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'all' || debtorFilter !== 'all'
              ? "Aucune facture ne correspond à vos critères de recherche."
              : "Vous n'avez actuellement aucune facture enregistrée."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Facture</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Débiteur</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedInvoices.map(invoice => {
                const debtor = debtors.find(d => d.id === invoice.debtorId);
                
                return (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg mr-3 ${
                          invoice.status === 'paid' ? 'bg-green-100' :
                          invoice.status === 'partial' ? 'bg-yellow-100' :
                          invoice.status === 'overdue' ? 'bg-red-100' : 
                          'bg-blue-100'
                        }`}>
                          <FileText className={`h-5 w-5 ${
                            invoice.status === 'paid' ? 'text-green-600' :
                            invoice.status === 'partial' ? 'text-yellow-600' :
                            invoice.status === 'overdue' ? 'text-red-600' : 
                            'text-blue-600'
                          }`} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{invoice.invoiceNumber}</div>
                          <div className="text-xs text-gray-500">
                            {invoice.category || 'Facture'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">{debtor?.name || 'N/A'}</div>
                      {debtor?.company && (
                        <div className="text-xs text-gray-500">{debtor.company}</div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">Échéance: {formatDate(invoice.dueDate)}</div>
                      <div className="text-xs text-gray-500">Émise: {formatDate(invoice.issueDate)}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(invoice.amount)}</div>
                      {invoice.paidAmount > 0 && (
                        <div className="text-xs text-green-600">Payé: {formatCurrency(invoice.paidAmount)}</div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                        invoice.status === 'overdue' ? 'bg-red-100 text-red-800' : 
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {invoice.status === 'paid' ? (
                          <><CheckCircle className="h-3.5 w-3.5 mr-1" /> Payée</>
                        ) : invoice.status === 'partial' ? (
                          <><Clock className="h-3.5 w-3.5 mr-1" /> Partielle</>
                        ) : invoice.status === 'overdue' ? (
                          <><AlertCircle className="h-3.5 w-3.5 mr-1" /> En retard</>
                        ) : (
                          <><Clock className="h-3.5 w-3.5 mr-1" /> En attente</>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button className="text-blue-600 hover:text-blue-900 mx-1">
                        <Eye className="h-5 w-5" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 mx-1">
                        <Download className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Summary card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-sm text-gray-500 mb-1">Montant total facturé</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(originalAmount)}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-1">Montant total payé</p>
            <p className="text-xl font-bold text-green-600">{formatCurrency(paidAmount)}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-1">Reste à payer</p>
            <p className="text-xl font-bold text-blue-600">{formatCurrency(totalAmount)}</p>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-gray-500">Progrès du paiement</span>
            <span className="font-medium text-gray-700">
              {originalAmount > 0 ? (paidAmount / originalAmount * 100).toFixed(1) : 0}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="bg-green-500 h-full"
              style={{ width: `${originalAmount > 0 ? (paidAmount / originalAmount * 100) : 0}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientInvoices;