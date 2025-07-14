import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  CreditCard, 
  Calendar,
  Euro,
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
  Clock,
  Printer,
  Mail,
  Share2,
  Archive,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { useCrm } from '../../contexts/CrmContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency, getStatusConfig } from '../../utils/dataUtils';

const InvoicesPage: React.FC = () => {
  const { invoices, clients } = useCrm();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [clientInvoices, setClientInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInvoices = async () => {
      setIsLoading(true);
      try {
        // Find client
        const client = clients.find(c => c.user_id === user?.id || c.email === user?.email);
        
        if (client) {
          // Get client invoices
          const userInvoices = invoices.filter(invoice => invoice.client_id === client.id);
          
          // Convert to display format
          const formattedInvoices = userInvoices.map(invoice => {
            const dueDate = new Date(invoice.due_date);
            const today = new Date();
            const diffTime = today.getTime() - dueDate.getTime();
            const daysOverdue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            return {
              id: invoice.id,
              number: invoice.invoice_number,
              amount: invoice.amount,
              originalAmount: invoice.original_amount,
              paidAmount: invoice.paid_amount,
              dueDate: invoice.due_date,
              issueDate: invoice.issue_date,
              status: invoice.status,
              description: invoice.description || '',
              daysOverdue: daysOverdue > 0 ? daysOverdue : 0,
              category: invoice.category || ''
            };
          });
          
          setClientInvoices(formattedInvoices);
        }
      } catch (error) {
        console.error('Error loading invoices:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInvoices();
  }, [invoices, clients, user]);

  const filteredInvoices = clientInvoices.filter(invoice => {
    const matchesSearch = invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      case 'amount':
        return b.amount - a.amount;
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  const totalAmount = clientInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = clientInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const overdueCount = clientInvoices.filter(inv => inv.status === 'overdue').length;
  const paidCount = clientInvoices.filter(inv => inv.status === 'paid').length;

  const handleSelectInvoice = (invoiceId: string) => {
    setSelectedInvoices(prev => 
      prev.includes(invoiceId) 
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  const handleSelectAll = () => {
    if (selectedInvoices.length === sortedInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(sortedInvoices.map(inv => inv.id));
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <Clock className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Chargement des factures...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Factures</h1>
          <p className="text-gray-600">Consultez et gérez toutes vos factures</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Télécharger tout
          </button>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <CreditCard className="h-4 w-4 mr-2" />
            Payer les impayées
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Factures</p>
              <p className="text-2xl font-bold text-gray-900">{clientInvoices.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-lg">
              <Euro className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Montant Dû</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
              <div className="flex items-center mt-1">
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-sm text-red-600">-15% ce mois</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Déjà Payé</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPaid)}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+8% ce mois</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-lg">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Retard</p>
              <p className="text-2xl font-bold text-gray-900">{overdueCount}</p>
              <p className="text-sm text-orange-600">Nécessite attention</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par numéro ou description..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="overdue">En retard</option>
              <option value="partial">Partielles</option>
              <option value="pending">En attente</option>
              <option value="paid">Payées</option>
            </select>
            
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="dueDate">Trier par échéance</option>
              <option value="amount">Trier par montant</option>
              <option value="status">Trier par statut</option>
            </select>
          </div>
        </div>

        {/* Actions groupées */}
        {selectedInvoices.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {selectedInvoices.length} facture(s) sélectionnée(s)
              </span>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                  Payer sélectionnées
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                  Télécharger
                </button>
                <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
                  Imprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Liste des factures */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedInvoices.length === sortedInvoices.length && sortedInvoices.length > 0}
                onChange={handleSelectAll}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
              />
              <h3 className="text-lg font-medium text-gray-900">
                Factures ({sortedInvoices.length})
              </h3>
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {sortedInvoices.length === 0 ? (
            <div className="p-6 text-center">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Aucune facture trouvée</p>
            </div>
          ) : (
            sortedInvoices.map((invoice) => {
              const statusConfig = getStatusConfig(invoice.status);
              const StatusIcon = statusConfig.icon || CheckCircle;
              const isSelected = selectedInvoices.includes(invoice.id);
              
              return (
                <div 
                  key={invoice.id} 
                  className={`p-6 hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectInvoice(invoice.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-3">
                          <h4 className="text-lg font-medium text-gray-900">{invoice.number}</h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig.label}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {invoice.category}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mt-1">{invoice.description}</p>
                        
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Émise le {new Date(invoice.issueDate).toLocaleDateString('fr-FR')}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Échéance: {new Date(invoice.dueDate).toLocaleDateString('fr-FR')}
                          </span>
                          {invoice.daysOverdue > 0 && (
                            <span className="text-red-600 font-medium">
                              Retard: {invoice.daysOverdue} jours
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-gray-900">
                          {formatCurrency(invoice.amount)}
                        </div>
                        
                        {invoice.status === 'partial' && (
                          <div className="text-sm text-gray-500">
                            sur {formatCurrency(invoice.originalAmount)}
                          </div>
                        )}
                        
                        {invoice.paidAmount > 0 && (
                          <div className="text-sm text-green-600">
                            Payé: {formatCurrency(invoice.paidAmount)}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-3">
                        {invoice.amount > 0 && (
                          <button className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                            <CreditCard className="h-3 w-3 mr-1" />
                            Payer
                          </button>
                        )}
                        
                        <button className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                          <Eye className="h-3 w-3 mr-1" />
                          Voir
                        </button>
                        
                        <button className="flex items-center px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                          <Download className="h-3 w-3 mr-1" />
                          PDF
                        </button>
                        
                        <div className="relative">
                          <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                            <Share2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Barre de progression pour les paiements partiels */}
                  {invoice.status === 'partial' && invoice.paidAmount > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progression du paiement</span>
                        <span>{Math.round((invoice.paidAmount / invoice.originalAmount) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(invoice.paidAmount / invoice.originalAmount) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Résumé en bas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</div>
            <div className="text-sm text-gray-600">Total à payer</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</div>
            <div className="text-sm text-gray-600">Déjà payé</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{paidCount}/{clientInvoices.length}</div>
            <div className="text-sm text-gray-600">Factures réglées</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicesPage;