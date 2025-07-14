import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  MessageSquare,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  Target,
  TrendingUp,
  DollarSign,
  ExternalLink
} from 'lucide-react';
import { useCrm } from '../../contexts/CrmContext';
import { 
  formatCurrency, 
  formatDate, 
  getRecoveryStatusConfig, 
  getDebtorStatusConfig, 
  getPriorityConfig,
  getRiskConfig
} from '../../utils/dataUtils';
import { Debtor, Invoice, Payment, Communication } from '../../types';

const DebtorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { debtors, invoices, payments, communications, refreshData } = useCrm();
  const [debtor, setDebtor] = useState<Debtor | null>(null);
  const [debtorInvoices, setDebtorInvoices] = useState<Invoice[]>([]);
  const [debtorPayments, setDebtorPayments] = useState<Payment[]>([]);
  const [debtorCommunications, setDebtorCommunications] = useState<Communication[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedInvoice, setExpandedInvoice] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Find debtor
        const debtorData = debtors.find(d => d.id === id);
        if (debtorData) {
          setDebtor(debtorData);
          
          // Get related data
          const debtorInvs = invoices.filter(inv => inv.debtorId === id);
          const debtorPays = payments.filter(pay => pay.debtorId === id);
          const debtorComms = communications.filter(comm => comm.debtorId === id);
          
          setDebtorInvoices(debtorInvs);
          setDebtorPayments(debtorPays);
          setDebtorCommunications(debtorComms);
        }
      } catch (error) {
        console.error('Error loading debtor data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [id, debtors, invoices, payments, communications]);

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
        <p className="mt-4 text-gray-600">Chargement des données...</p>
      </div>
    );
  }

  if (!debtor) {
    return (
      <div className="p-6">
        <Link to="/debtors" className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> 
          Retour à la liste
        </Link>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Débiteur non trouvé</h3>
          <p className="text-gray-500 mb-6">
            Le débiteur demandé n'existe pas ou vous n'avez pas les permissions nécessaires pour y accéder.
          </p>
          <Link 
            to="/debtors"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retour à la liste des débiteurs
          </Link>
        </div>
      </div>
    );
  }

  const recoveryStatusConfig = getRecoveryStatusConfig(debtor.recoveryStatus);
  const statusConfig = getDebtorStatusConfig(debtor.status);
  const priorityConfig = getPriorityConfig(debtor.priority);
  const riskConfig = getRiskConfig(debtor.riskLevel);
  
  const recoveryRate = debtor.originalAmount > 0 
    ? (debtor.paidAmount / debtor.originalAmount) * 100 
    : 0;

  // Group communications by date
  const groupedCommunications = debtorCommunications.reduce((acc: Record<string, Communication[]>, comm) => {
    const date = new Date(comm.createdAt).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(comm);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedCommunications).sort().reverse();

  return (
    <div className="p-6 space-y-6">
      <Link to="/debtors" className="flex items-center text-blue-600 hover:text-blue-800">
        <ArrowLeft className="h-4 w-4 mr-2" /> 
        Retour à la liste
      </Link>

      {/* Debtor header card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${
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
            
            <div className="ml-4">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">{debtor.name}</h1>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${recoveryStatusConfig.color}`}>
                  {recoveryStatusConfig.label}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
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
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(debtor.totalAmount)}</div>
            <div className="text-sm text-gray-500">
              {debtor.paidAmount > 0 ? (
                <span>{formatCurrency(debtor.paidAmount)} payés sur {formatCurrency(debtor.originalAmount)}</span>
              ) : (
                <span>Montant original: {formatCurrency(debtor.originalAmount)}</span>
              )}
            </div>
            
            <div className="flex space-x-2 mt-3">
              <button className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                <Download className="h-4 w-4 mr-1" />
                Rapport
              </button>
              <button className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                <Eye className="h-4 w-4 mr-1" />
                Fichiers
              </button>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-5">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progression du recouvrement</span>
            <span>{recoveryRate.toFixed(1)}% complété</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-500 h-2.5 rounded-full transition-all duration-1000"
              style={{ width: `${recoveryRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Vue d'ensemble
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 ${
                activeTab === 'invoices'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Factures {debtorInvoices.length > 0 ? `(${debtorInvoices.length})` : ''}
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 ${
                activeTab === 'payments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Paiements {debtorPayments.length > 0 ? `(${debtorPayments.length})` : ''}
            </button>
            <button
              onClick={() => setActiveTab('communications')}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 ${
                activeTab === 'communications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Communications {debtorCommunications.length > 0 ? `(${debtorCommunications.length})` : ''}
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Détails
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Montant dû</p>
                      <p className="text-lg font-bold text-gray-900">{formatCurrency(debtor.totalAmount)}</p>
                    </div>
                    <DollarSign className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Jours de retard</p>
                      <p className="text-lg font-bold text-gray-900">{debtor.daysOverdue}</p>
                    </div>
                    <Clock className="h-5 w-5 text-orange-500" />
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Factures</p>
                      <p className="text-lg font-bold text-gray-900">{debtor.invoiceCount}</p>
                    </div>
                    <FileText className="h-5 w-5 text-indigo-500" />
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Dernier contact</p>
                      <p className="text-lg font-bold text-gray-900">
                        {debtor.lastContact ? formatDate(debtor.lastContact) : 'N/A'}
                      </p>
                    </div>
                    <Calendar className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </div>
              
              {/* Status information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Informations Dossier</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Statut</span>
                      <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Niveau de relance</span>
                      <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${recoveryStatusConfig.color}`}>
                        {recoveryStatusConfig.label}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Priorité</span>
                      <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${priorityConfig.color}`}>
                        {priorityConfig.label}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Niveau de risque</span>
                      <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${riskConfig.color}`}>
                        {riskConfig.label}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Créé le</span>
                      <span className="text-sm font-medium text-gray-700">
                        {formatDate(debtor.createdAt)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Gestionnaire</span>
                      <span className="text-sm font-medium text-gray-700">{debtor.managerName}</span>
                    </div>
                  </div>
                </div>
                
                {/* Next actions and notes */}
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Suivi</h3>
                  
                  {debtor.nextAction ? (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start">
                        <Target className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">Prochaine action: {debtor.nextAction.type}</p>
                          <p className="text-sm text-blue-700">
                            {formatDate(debtor.nextAction.date)} - {debtor.nextAction.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-500 text-center">Aucune action planifiée</p>
                    </div>
                  )}
                  
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
                  {debtor.notes && debtor.notes.length > 0 ? (
                    <ul className="space-y-2">
                      {debtor.notes.map((note, index) => (
                        <li key={index} className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                          {note}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">Aucune note disponible</p>
                  )}
                </div>
              </div>
              
              {/* Recent invoices */}
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-gray-900">Factures récentes</h3>
                  <button 
                    onClick={() => setActiveTab('invoices')}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Voir toutes
                  </button>
                </div>
                
                {debtorInvoices.length === 0 ? (
                  <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Aucune facture trouvée</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Facture</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {debtorInvoices.slice(0, 3).map((invoice) => (
                          <tr key={invoice.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{invoice.invoiceNumber}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">{formatDate(invoice.dueDate)}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(invoice.amount)}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                                invoice.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                                invoice.status === 'overdue' ? 'bg-red-100 text-red-800' : 
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {invoice.status === 'paid' ? 'Payée' :
                                 invoice.status === 'partial' ? 'Partielle' :
                                 invoice.status === 'overdue' ? 'En retard' : 'En attente'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'invoices' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Factures</h3>
              
              {debtorInvoices.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h4 className="text-lg font-medium text-gray-900 mb-1">Aucune facture</h4>
                  <p className="text-gray-500">Ce débiteur n'a aucune facture enregistrée</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {debtorInvoices.map((invoice) => (
                    <div 
                      key={invoice.id} 
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                    >
                      <div 
                        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => setExpandedInvoice(expandedInvoice === invoice.id ? null : invoice.id)}
                      >
                        <div className="flex items-center justify-between">
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
                              <h4 className="text-base font-medium text-gray-900">{invoice.invoiceNumber}</h4>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                                <span className="text-sm text-gray-500">
                                  Émise: {formatDate(invoice.issueDate)}
                                </span>
                                <span className="text-sm text-gray-500">
                                  Échéance: {formatDate(invoice.dueDate)}
                                </span>
                                {invoice.category && (
                                  <span className="text-sm text-gray-500">
                                    Catégorie: {invoice.category}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-base font-bold text-gray-900">{formatCurrency(invoice.amount)}</p>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                                invoice.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                                invoice.status === 'overdue' ? 'bg-red-100 text-red-800' : 
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {invoice.status === 'paid' ? 'Payée' :
                                 invoice.status === 'partial' ? 'Partielle' :
                                 invoice.status === 'overdue' ? 'En retard' : 'En attente'}
                              </span>
                            </div>
                            {expandedInvoice === invoice.id ? (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {expandedInvoice === invoice.id && (
                        <div className="p-4 bg-gray-50 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Informations de facturation</h5>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Montant original:</span>
                                  <span className="font-medium text-gray-900">{formatCurrency(invoice.originalAmount)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Montant payé:</span>
                                  <span className={`font-medium ${invoice.paidAmount > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                                    {formatCurrency(invoice.paidAmount)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Reste à payer:</span>
                                  <span className="font-medium text-gray-900">{formatCurrency(invoice.amount)}</span>
                                </div>
                                {invoice.description && (
                                  <div className="pt-2">
                                    <span className="text-gray-500">Description:</span>
                                    <p className="mt-1 text-gray-700">{invoice.description}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Paiements associés</h5>
                              {debtorPayments.filter(p => p.invoiceId === invoice.id).length > 0 ? (
                                <div className="space-y-2">
                                  {debtorPayments
                                    .filter(p => p.invoiceId === invoice.id)
                                    .map(payment => (
                                      <div 
                                        key={payment.id}
                                        className="flex justify-between items-center p-2 bg-white rounded border border-gray-200"
                                      >
                                        <div className="flex items-center">
                                          <CreditCard className="h-4 w-4 text-green-500 mr-2" />
                                          <span>{formatDate(payment.paymentDate)}</span>
                                          <span className="mx-2 text-gray-400">•</span>
                                          <span className="text-gray-600">{payment.method}</span>
                                        </div>
                                        <span className="font-medium text-green-600">
                                          {formatCurrency(payment.amount)}
                                        </span>
                                      </div>
                                    ))}
                                </div>
                              ) : (
                                <div className="p-3 bg-white rounded border border-gray-200 text-center text-sm text-gray-500">
                                  Aucun paiement enregistré pour cette facture
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex justify-end mt-4">
                            <button className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                              <Download className="h-4 w-4 mr-1.5" />
                              Télécharger la facture
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Paiements</h3>
              
              {debtorPayments.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h4 className="text-lg font-medium text-gray-900 mb-1">Aucun paiement</h4>
                  <p className="text-gray-500">Ce débiteur n'a effectué aucun paiement</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Facture</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Méthode</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Référence</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {debtorPayments.map((payment) => {
                        const relatedInvoice = debtorInvoices.find(i => i.id === payment.invoiceId);
                        
                        return (
                          <tr key={payment.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {formatDate(payment.paymentDate)}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {formatCurrency(payment.amount)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {relatedInvoice ? relatedInvoice.invoiceNumber : 'N/A'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {payment.method}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                payment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {payment.status === 'completed' ? 'Complété' :
                                 payment.status === 'scheduled' ? 'Programmé' :
                                 payment.status === 'pending' ? 'En attente' : 'Échoué'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-blue-600">
                              {payment.reference || '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'communications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Communications</h3>
              
              {debtorCommunications.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h4 className="text-lg font-medium text-gray-900 mb-1">Aucune communication</h4>
                  <p className="text-gray-500">Aucun historique de communication avec ce débiteur</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {sortedDates.map(date => (
                    <div key={date} className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-500">
                        {new Date(date).toLocaleDateString('fr-FR', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric'
                        })}
                      </h4>
                      
                      <div className="space-y-3">
                        {groupedCommunications[date]
                          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                          .map(comm => (
                            <div key={comm.id} className="bg-white rounded-lg border border-gray-200 p-4">
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${
                                  comm.type === 'email' ? 'bg-blue-100' :
                                  comm.type === 'sms' ? 'bg-green-100' :
                                  comm.type === 'call' ? 'bg-purple-100' :
                                  comm.type === 'letter' ? 'bg-orange-100' : 'bg-gray-100'
                                }`}>
                                  {comm.type === 'email' && <Mail className="h-5 w-5 text-blue-600" />}
                                  {comm.type === 'sms' && <MessageSquare className="h-5 w-5 text-green-600" />}
                                  {comm.type === 'call' && <Phone className="h-5 w-5 text-purple-600" />}
                                  {comm.type === 'letter' && <FileText className="h-5 w-5 text-orange-600" />}
                                  {!['email', 'sms', 'call', 'letter'].includes(comm.type) && 
                                   <MessageSquare className="h-5 w-5 text-gray-600" />}
                                </div>
                                
                                <div className="flex-1">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h4 className="font-medium text-gray-900">
                                        {comm.subject || `${comm.type.charAt(0).toUpperCase() + comm.type.slice(1)}`}
                                      </h4>
                                      <span className="text-xs text-gray-500">
                                        {new Date(comm.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                    </div>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      comm.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                                      comm.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                      comm.status === 'read' ? 'bg-purple-100 text-purple-800' :
                                      comm.status === 'responded' ? 'bg-indigo-100 text-indigo-800' :
                                      'bg-red-100 text-red-800'
                                    }`}>
                                      {comm.status === 'sent' ? 'Envoyé' :
                                       comm.status === 'delivered' ? 'Délivré' :
                                       comm.status === 'read' ? 'Lu' :
                                       comm.status === 'responded' ? 'Répondu' : 'Échec'}
                                    </span>
                                  </div>
                                  
                                  <div className="mt-2 text-sm text-gray-600 whitespace-pre-line">
                                    {comm.content}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'details' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Détails</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <h4 className="font-medium text-gray-900 mb-4">Informations de contact</h4>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{debtor.name}</p>
                        <p className="text-sm text-gray-600">{debtor.type === 'company' ? 'Entreprise' : 'Particulier'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{debtor.email}</p>
                        <p className="text-sm text-gray-600">Email</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{debtor.phone}</p>
                        <p className="text-sm text-gray-600">Téléphone</p>
                      </div>
                    </div>
                    
                    {debtor.company && (
                      <div className="flex items-start">
                        <Building className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">{debtor.company}</p>
                          <p className="text-sm text-gray-600">Entreprise</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{debtor.address}</p>
                        <p className="text-sm text-gray-600">Adresse</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <h4 className="font-medium text-gray-900 mb-4">Détails financiers</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">Montant original</span>
                      <span className="font-medium text-gray-900">{formatCurrency(debtor.originalAmount)}</span>
                    </div>
                    
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">Montant payé</span>
                      <span className="font-medium text-green-600">{formatCurrency(debtor.paidAmount)}</span>
                    </div>
                    
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">Reste à payer</span>
                      <span className="font-medium text-gray-900">{formatCurrency(debtor.totalAmount)}</span>
                    </div>
                    
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">Nombre de factures</span>
                      <span className="font-medium text-gray-900">{debtor.invoiceCount}</span>
                    </div>
                    
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">Jours de retard</span>
                      <span className={`font-medium ${
                        debtor.daysOverdue > 30 ? 'text-red-600' : 
                        debtor.daysOverdue > 15 ? 'text-orange-600' : 
                        debtor.daysOverdue > 0 ? 'text-yellow-600' : 'text-gray-900'
                      }`}>
                        {debtor.daysOverdue}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dernier paiement</span>
                      <span className="font-medium text-gray-900">
                        {debtor.lastPayment ? formatDate(debtor.lastPayment) : 'Aucun'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tags section */}
              {debtor.tags && debtor.tags.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <h4 className="font-medium text-gray-900 mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {debtor.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebtorDetails;