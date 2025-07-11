import React, { useState, useEffect } from 'react';
import {
  AlertCircle, RefreshCw, Building, User, Mail, Phone
} from 'lucide-react';
import { useCrm } from '../../contexts/CrmContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency } from '../../utils/dataUtils';
import DebtorOverviewCard from '../Client/DebtorOverviewCard';

const ClientInterface: React.FC = () => {
  const { clients, debtors, invoices, payments, communications, refreshData } = useCrm();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedDebtor, setSelectedDebtor] = useState<any>(null);
  const [clientData, setClientData] = useState<any>(null);
  const [clientDebtors, setClientDebtors] = useState<any[]>([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactType, setContactType] = useState<'email' | 'phone' | null>(null);
  const [contactMessage, setContactMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('daysOverdue');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Charger les données
  useEffect(() => {
    const loadClientData = async () => {
      setIsLoading(true);
      try {
        const client = clients.find(c => c.user_id === user?.id || c.email === user?.email);
        if (client) {
          setClientData(client);
          const clientDebtorsList = debtors.filter(d => d.clientId === client.id);

          const enrichedDebtors = clientDebtorsList.map(debtor => {
            const debtorInvoices = invoices.filter(inv => inv.debtorId === debtor.id);
            const debtorPayments = payments.filter(p => p.debtorId === debtor.id);
            const debtorCommunications = communications.filter(c => c.debtorId === debtor.id);
            const totalAmount = debtorInvoices.reduce((sum, inv) => sum + inv.amount, 0);
            const paidAmount = debtorPayments.reduce((sum, p) => sum + p.amount, 0);
            const recoveryRate = debtor.originalAmount > 0
              ? (paidAmount / debtor.originalAmount) * 100
              : 0;

            return {
              ...debtor,
              invoices: debtorInvoices,
              payments: debtorPayments,
              communications: debtorCommunications,
              totalAmount,
              paidAmount,
              recoveryRate,
              lastCommunication: debtorCommunications.length > 0
                ? debtorCommunications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
                : null
            };
          });

          setClientDebtors(enrichedDebtors);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données client:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadClientData();
  }, [user, clients, debtors, invoices, payments, communications]);

  // Handlers
  const handleRefresh = async () => {
    setIsLoading(true);
    await refreshData();
    setIsLoading(false);
  };

  const handleSelectDebtor = (debtor: any) => {
    setSelectedDebtor(debtor);
    setActiveTab('overview');
  };

  const handleBackToList = () => {
    setSelectedDebtor(null);
  };

  const handleSendMessage = () => {
    console.log('Message envoyé:', contactType, contactMessage);
    setShowContactModal(false);
    setContactMessage('');
    setContactType(null);
  };

  // Affichage conditionnel
  if (!clientData && !isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Aucune information client trouvée</p>
          <p className="text-gray-400 mt-2">Veuillez contacter le support technique</p>
        </div>
      </div>
    );
  }

  if (isLoading && !clientData) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-500">Chargement des données client…</p>
        </div>
      </div>
    );
  }

  // Filtres et tris
  const filteredDebtors = clientDebtors.filter(debtor => {
    const matchesSearch =
      debtor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      debtor.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      debtor.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || debtor.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedDebtors = [...filteredDebtors].sort((a, b) => {
    switch (sortBy) {
      case 'daysOverdue': return b.daysOverdue - a.daysOverdue;
      case 'amount': return b.totalAmount - a.totalAmount;
      case 'name': return a.name.localeCompare(b.name);
      case 'recoveryStatus': {
        const order = { critical: 3, orange: 2, yellow: 1, blue: 0 };
        return order[b.recoveryStatus] - order[a.recoveryStatus];
      }
      default: return 0;
    }
  });

  // Statistiques
  const totalAmount = clientDebtors.reduce((sum, d) => sum + d.totalAmount, 0);
  const totalPaid = clientDebtors.reduce((sum, d) => sum + d.paidAmount, 0);
  const totalOriginal = clientDebtors.reduce((sum, d) => sum + d.originalAmount, 0);
  const criticalCount = clientDebtors.filter(d => d.recoveryStatus === 'critical').length;
  const recoveryRate = totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0;

  // Rendu principal
  return (
    <div className="p-6">
      {/* Extrait de barre de progression si un débiteur est sélectionné */}
      {selectedDebtor && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progression du recouvrement</span>
            <span>{selectedDebtor.recoveryRate.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-green-500 h-1.5 rounded-full"
              style={{ width: `${selectedDebtor.recoveryRate}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Ici tu peux continuer avec les composants d’affichage de débiteurs, navigation onglets, etc. */}
    </div>
        {/* Navigation par onglets */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-6 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Vue d'ensemble
              </button>
              <button
                onClick={() => setActiveTab('invoices')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'invoices'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Factures
              </button>
              <button
                onClick={() => setActiveTab('communications')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'communications'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Communications
              </button>
              <button
                onClick={() => setActiveTab('actions')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'actions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Actions
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Onglet Vue d'ensemble */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Informations de contact */}
                  <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <h4 className="font-medium text-gray-900 mb-4">Informations de contact</h4>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">{selectedDebtor.name}</p>
                          <p className="text-sm text-gray-600">{selectedDebtor.type === 'company' ? 'Entreprise' : 'Particulier'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">{selectedDebtor.email}</p>
                          <p className="text-sm text-gray-600">Email</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">{selectedDebtor.phone}</p>
                          <p className="text-sm text-gray-600">Téléphone</p>
                        </div>
                      </div>
                      
                      {selectedDebtor.company && (
                        <div className="flex items-start">
                          <Building className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">{selectedDebtor.company}</p>
                            <p className="text-sm text-gray-600">Entreprise</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">{selectedDebtor.address}</p>
                          <p className="text-sm text-gray-600">Adresse</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Détails financiers */}
                  <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <h4 className="font-medium text-gray-900 mb-4">Détails financiers</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-600">Montant original</span>
                        <span className="font-medium text-gray-900">{formatCurrency(selectedDebtor.originalAmount)}</span>
                      </div>
                      
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-600">Montant recouvré</span>
                        <span className="font-medium text-green-600">{formatCurrency(selectedDebtor.paidAmount)}</span>
                      </div>
                      
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-600">Reste à recouvrer</span>
                        <span className="font-medium text-gray-900">{formatCurrency(selectedDebtor.totalAmount)}</span>
                      </div>
                      
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-600">Nombre de factures</span>
                        <span className="font-medium text-gray-900">{selectedDebtor.invoices.length}</span>
                      </div>
                      
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-600">Jours de retard</span>
                        <span className={`font-medium ${
                          selectedDebtor.daysOverdue > 30 ? 'text-red-600' : 
                          selectedDebtor.daysOverdue > 15 ? 'text-orange-600' : 
                          selectedDebtor.daysOverdue > 0 ? 'text-yellow-600' : 'text-gray-900'
                        }`}>
                          {selectedDebtor.daysOverdue}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dernier paiement</span>
                        <span className="font-medium text-gray-900">
                          {selectedDebtor.lastPayment ? new Date(selectedDebtor.lastPayment).toLocaleDateString('fr-FR') : 'Aucun'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Factures récentes */}
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Factures récentes</h4>
                    <button 
                      onClick={() => setActiveTab('invoices')}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Voir toutes
                    </button>
                  </div>
                  
                  {selectedDebtor.invoices.length === 0 ? (
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
                          {selectedDebtor.invoices.slice(0, 3).map((invoice: any) => (
                            <tr key={invoice.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">{invoice.invoiceNumber}</td>
                              <td className="px-4 py-3 text-sm text-gray-500">{new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</td>
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
                
                {/* Communications récentes */}
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Communications récentes</h4>
                    <button 
                      onClick={() => setActiveTab('communications')}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Voir toutes
                    </button>
                  </div>
                  
                  {selectedDebtor.communications.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 rounded-lg">
                      <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Aucune communication trouvée</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedDebtor.communications.slice(0, 3).map((comm: any) => {
                        const getTypeIcon = (type: string) => {
                          switch (type) {
                            case 'email': return Mail;
                            case 'sms': return MessageSquare;
                            case 'call': return Phone;
                            case 'letter': return FileText;
                            default: return MessageSquare;
                          }
                        };
                        
                        const getTypeColor = (type: string) => {
                          switch (type) {
                            case 'email': return 'bg-blue-100 text-blue-600';
                            case 'sms': return 'bg-green-100 text-green-600';
                            case 'call': return 'bg-purple-100 text-purple-600';
                            case 'letter': return 'bg-orange-100 text-orange-600';
                            default: return 'bg-gray-100 text-gray-600';
                          }
                        };
                        
                        const Icon = getTypeIcon(comm.type);
                        
                        return (
                          <div key={comm.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <div className={`p-2 rounded-lg ${getTypeColor(comm.type).split(' ')[0]}`}>
                              <Icon className={`h-4 w-4 ${getTypeColor(comm.type).split(' ')[1]}`} />
                            </div>
                            <div className="ml-3 flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {comm.subject || (comm.content.length > 30 ? comm.content.substring(0, 30) + '...' : comm.content)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(comm.createdAt).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              comm.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                              comm.status === 'read' ? 'bg-blue-100 text-blue-800' : 
                              comm.status === 'responded' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {comm.status === 'delivered' ? 'Délivré' : 
                               comm.status === 'read' ? 'Lu' : 
                               comm.status === 'responded' ? 'Répondu' : 'Envoyé'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Onglet Factures */}
            {activeTab === 'invoices' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Factures</h3>
                
                {selectedDebtor.invoices.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h4 className="text-lg font-medium text-gray-900 mb-1">Aucune facture</h4>
                    <p className="text-gray-500">Ce débiteur n'a aucune facture enregistrée</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numéro</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'émission</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Échéance</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedDebtor.invoices.map((invoice: any) => (
                          <tr key={invoice.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {invoice.invoiceNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(invoice.issueDate).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(invoice.dueDate).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatCurrency(invoice.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
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
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-900 mr-3">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-blue-600 hover:text-blue-900">
                                <Download className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            
            {/* Onglet Communications */}
            {activeTab === 'communications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Historique des communications</h3>
                
                {selectedDebtor.communications.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h4 className="text-lg font-medium text-gray-900 mb-1">Aucune communication</h4>
                    <p className="text-gray-500">Aucun historique de communication avec ce débiteur</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedDebtor.communications.map((comm: any) => {
                      const getTypeIcon = (type: string) => {
                        switch (type) {
                          case 'email': return Mail;
                          case 'sms': return MessageSquare;
                          case 'call': return Phone;
                          case 'letter': return FileText;
                          default: return MessageSquare;
                        }
                      };
                      
                      const getTypeColor = (type: string) => {
                        switch (type) {
                          case 'email': return 'bg-blue-100 text-blue-600';
                          case 'sms': return 'bg-green-100 text-green-600';
                          case 'call': return 'bg-purple-100 text-purple-600';
                          case 'letter': return 'bg-orange-100 text-orange-600';
                          default: return 'bg-gray-100 text-gray-600';
                        }
                      };
                      
                      const Icon = getTypeIcon(comm.type);
                      
                      return (
                        <div key={comm.id} className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${getTypeColor(comm.type).split(' ')[0]}`}>
                              <Icon className={`h-5 w-5 ${getTypeColor(comm.type).split(' ')[1]}`} />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900">
                                  {comm.subject || `${comm.type.charAt(0).toUpperCase() + comm.type.slice(1)}`}
                                </h4>
                                <span className="text-sm text-gray-500">
                                  {new Date(comm.createdAt).toLocaleDateString('fr-FR')}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{comm.content}</p>
                              
                              <div className="flex justify-between items-center mt-3">
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
                                <div className="text-xs text-gray-500">
                                  Par: {comm.senderName || 'Système automatique'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            
            {/* Onglet Actions */}
            {activeTab === 'actions' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Actions disponibles</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-blue-100 p-4 rounded-full mb-4">
                        <Phone className="h-8 w-8 text-blue-600" />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">Contacter le gestionnaire</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Discutez avec le gestionnaire en charge de ce dossier pour obtenir des informations ou négocier.
                      </p>
                      <button 
                        onClick={() => {
                          setContactType('phone');
                          setShowContactModal(true);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Appeler maintenant
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-green-100 p-4 rounded-full mb-4">
                        <Mail className="h-8 w-8 text-green-600" />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">Envoyer un message</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Envoyez un email au gestionnaire pour discuter du dossier ou demander des précisions.
                      </p>
                      <button 
                        onClick={() => {
                          setContactType('email');
                          setShowContactModal(true);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Rédiger un message
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-purple-100 p-4 rounded-full mb-4">
                        <Download className="h-8 w-8 text-purple-600" />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">Télécharger le dossier</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Téléchargez un rapport complet du dossier incluant factures, communications et statut.
                      </p>
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                        Télécharger le PDF
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
                  <div className="flex items-start">
                    <Info className="h-6 w-6 text-blue-600 mr-4 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-2">Informations sur le processus de recouvrement</h4>
                      <p className="text-sm text-blue-700 mb-4">
                        Ce débiteur est actuellement en phase de recouvrement. Notre équipe travaille activement pour récupérer les montants dus selon le processus suivant :
                      </p>
                      <ol className="list-decimal pl-5 space-y-2 text-sm text-blue-700">
                        <li>Relances amiables (emails, appels)</li>
                        <li>Relances formelles (courriers recommandés)</li>
                        <li>Proposition d'échéancier de paiement</li>
                        <li>Procédure de recouvrement juridique si nécessaire</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Vue par défaut - Liste des débiteurs
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Débiteurs</h1>
          <p className="text-gray-600">Suivi des dossiers de recouvrement</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Actualisation...' : 'Actualiser'}
          </button>
          <button 
            onClick={() => {
              setContactType('email');
              setShowContactModal(true);
            }}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Mail className="h-4 w-4 mr-2" />
            Contacter gestionnaire
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Débiteurs</p>
              <p className="text-2xl font-bold text-gray-900">{clientDebtors.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Taux de Recouvrement</p>
              <p className="text-2xl font-bold text-gray-900">{recoveryRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Dossiers Critiques</p>
              <p className="text-2xl font-bold text-gray-900">{criticalDebtors}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Retard</p>
              <p className="text-2xl font-bold text-gray-900">{overdueDebtors}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
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
          
          <div className="flex flex-wrap gap-3">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="critical">Critique</option>
              <option value="orange">Relance 2</option>
              <option value="yellow">Relance 1</option>
              <option value="blue">Normal</option>
              <option value="recovered">Recouvré</option>
            </select>
            
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="daysOverdue">Trier par retard</option>
              <option value="amount">Trier par montant</option>
              <option value="name">Trier par nom</option>
              <option value="recoveryStatus">Trier par statut</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des débiteurs */}
      {isLoading ? (
        <div className="text-center py-12">
          <RefreshCw className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
          <p className="text-gray-500">Chargement des débiteurs...</p>
        </div>
      ) : sortedDebtors.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun débiteur trouvé</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'all'
              ? "Aucun débiteur ne correspond à vos critères de recherche."
              : "Vous n'avez actuellement aucun débiteur."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedDebtors.map(debtor => (
            <div 
              key={debtor.id}
              onClick={() => handleSelectDebtor(debtor)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${
                    debtor.recoveryStatus === 'critical' ? 'bg-red-100' :
                    debtor.recoveryStatus === 'orange' ? 'bg-orange-100' :
                    debtor.recoveryStatus === 'yellow' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    {debtor.type === 'company' ? (
                      <Building className={`h-6 w-6 ${
            <p className="text-sm text-gray-500">
              {sortedDebiteurs.length} débiteur{sortedDebiteurs.length > 1 ? 's' : ''} trouvé{sortedDebiteurs.length > 1 ? 's' : ''}
                        debtor.recoveryStatus === 'yellow' ? 'text-yellow-600' : 'text-blue-600'
                      }`} />
            {sortedDebiteurs.map(debiteur => (
              <div key={debiteur.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleSelectDebiteur(debiteur)}>
                        debtor.recoveryStatus === 'critical' ? 'text-red-600' :
                        debtor.recoveryStatus === 'orange' ? 'text-orange-600' :
                        debtor.recoveryStatus === 'yellow' ? 'text-yellow-600' : 'text-blue-600'
                      debiteur.recoveryStatus === 'critical' ? 'bg-red-100' :
                      debiteur.recoveryStatus === 'orange' ? 'bg-orange-100' :
                      debiteur.recoveryStatus === 'yellow' ? 'bg-yellow-100' : 'bg-blue-100'
                  
                      {debiteur.type === 'company' ? (
                    <div className="flex items-center space-x-2">
                          debiteur.recoveryStatus === 'critical' ? 'text-red-600' :
                          debiteur.recoveryStatus === 'orange' ? 'text-orange-600' :
                          debiteur.recoveryStatus === 'yellow' ? 'text-yellow-600' : 'text-blue-600'
                        debtor.recoveryStatus === 'orange' ? 'bg-orange-100 text-orange-800' :
                        debtor.recoveryStatus === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                      <h3 className="font-medium text-gray-900">{debiteur.name}</h3>
                          debiteur.recoveryStatus === 'critical' ? 'text-red-600' :
                        {debiteur.company && (
                          <span className="text-sm text-gray-500">{debiteur.company}</span>
                         debtor.recoveryStatus === 'yellow' ? 'Relance 1' : 'Normal'}
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          debiteur.recoveryStatus === 'critical' ? 'bg-red-100 text-red-800' :
                          debiteur.recoveryStatus === 'orange' ? 'bg-orange-100 text-orange-800' :
                          debiteur.recoveryStatus === 'yellow' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                      {debtor.company && (
                          {debiteur.recoveryStatus === 'critical' ? 'Critique' :
                           debiteur.recoveryStatus === 'orange' ? 'Urgent' :
                           debiteur.recoveryStatus === 'yellow' ? 'Attention' : 'Normal'}
                        </span>
                      )}
                      <span className="flex items-center">
                        <Mail className="h-4 w-4 mr-1 text-gray-400" />
                        {debtor.email}
                    <div className="text-lg font-bold text-gray-900">{formatCurrency(debiteur.totalAmount)}</div>
                    <div className="text-sm text-gray-500">Dû depuis {debiteur.daysOverdue} jours</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{formatCurrency(debtor.totalAmount)}</div>
                  <div className="text-sm text-gray-500">
                    {debtor.paidAmount > 0 ? (
                      <span>{formatCurrency(debtor.paidAmount)} recouvrés</span>
                    ) : (
                      <span>0% recouvré</span>
                    )}
                  </div>
                  <div className="flex items-center justify-end mt-2">
                    {debtor.daysOverdue > 0 ? (
                      <span className={`flex items-center text-sm font-medium ${
                        debtor.daysOverdue > 30 ? 'text-red-600' : 
                        debtor.daysOverdue > 15 ? 'text-orange-600' : 
                        'text-yellow-600'
                      }`}>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                        {debtor.daysOverdue} jours
                    <span>{Math.round((debiteur.paidAmount / debiteur.originalAmount) * 100)}%</span>
                    ) : (
                      <span className="flex items-center text-sm font-medium text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        À jour
                      style={{ width: `${(debiteur.paidAmount / debiteur.originalAmount) * 100}%` }}
                    )}
                  </div>
                </div>
              </div>
              
              {/* Barre de progression */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progression du recouvrement</span>
                  <span>{debtor.recoveryRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-green-500 h-1.5 rounded-full" 
                    style={{ width: `${debtor.recoveryRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de contact */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {contactType === 'email' ? 'Envoyer un message' : 'Demande d\'appel'}
                </h3>
                <button 
                  onClick={() => setShowContactModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {contactType === 'email' ? 'Sujet' : 'Motif de l\'appel'}
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="info">Demande d'information</option>
                    <option value="payment">Question sur un paiement</option>
                    <option value="dispute">Contestation de facture</option>
                    <option value="schedule">Demande d'échéancier</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {contactType === 'email' ? 'Message' : 'Précisions'}
                  </label>
                  <textarea
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder={contactType === 'email' 
                      ? "Décrivez votre demande en détail..." 
                      : "Précisez l'objet de votre demande d'appel..."}
                  ></textarea>
                </div>
                
                {contactType === 'phone' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro de téléphone pour vous rappeler
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                )}
                
                <div className="flex space-x-3 pt-4">
                  <button 
                    onClick={() => setShowContactModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={handleSendMessage}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {contactType === 'email' ? 'Envoyer' : 'Demander un appel'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientInterface;