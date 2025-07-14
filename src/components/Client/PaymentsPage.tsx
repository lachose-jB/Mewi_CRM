import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Calendar, 
  Euro, 
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Download,
  Eye,
  Edit3,
  Trash2,
  Building,
  User,
  Phone,
  Mail,
  Shield,
  Zap,
  TrendingUp,
  BarChart3,
  Target,
  X,
  Save,
  RefreshCw
} from 'lucide-react';
import { useCrm } from '../../contexts/CrmContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency } from '../../utils/dataUtils';

interface Payment {
  id: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'scheduled';
  method: string;
  reference?: string;
  paidDate?: string;
  invoiceId: string;
  description: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_transfer' | 'sepa' | 'check';
  name: string;
  details: string;
  isDefault: boolean;
  isActive: boolean;
}

const PaymentsPage: React.FC = () => {
  const { payments, invoices, clients } = useCrm();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('schedule');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showMethodModal, setShowMethodModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [clientPayments, setClientPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'bank_transfer',
      name: 'Virement bancaire',
      details: 'Compte principal - IBAN: FR76 **** **** **** **12 34',
      isDefault: true,
      isActive: true
    },
    {
      id: '2',
      type: 'sepa',
      name: 'Prélèvement SEPA',
      details: 'Autorisation active - Compte principal',
      isDefault: false,
      isActive: true
    },
    {
      id: '3',
      type: 'card',
      name: 'Carte bancaire',
      details: 'Visa **** **** **** 1234 - Exp: 12/26',
      isDefault: false,
      isActive: true
    }
  ]);

  useEffect(() => {
    const loadPayments = async () => {
      setIsLoading(true);
      try {
        // Find client
        const client = clients.find(c => c.user_id === user?.id || c.email === user?.email);
        
        if (client) {
          // Get client payments
          const userPayments = payments.filter(payment => payment.client_id === client.id);
          
          // Convert to display format
          const formattedPayments = userPayments.map(payment => {
            // Find related invoice
            const invoice = invoices.find(inv => inv.id === payment.invoice_id);
            
            return {
              id: payment.id,
              amount: payment.amount,
              dueDate: payment.due_date || payment.payment_date,
              status: payment.status === 'completed' ? 'paid' : payment.status,
              method: payment.method,
              reference: payment.reference,
              paidDate: payment.status === 'completed' ? payment.payment_date : undefined,
              invoiceId: payment.invoice_id || '',
              description: invoice ? `Paiement pour ${invoice.invoice_number}` : 'Paiement'
            };
          });
          
          setClientPayments(formattedPayments);
        }
      } catch (error) {
        console.error('Error loading payments:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPayments();
  }, [payments, invoices, clients, user]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'paid':
        return { 
          label: 'Payé', 
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle
        };
      case 'pending':
        return { 
          label: 'En attente', 
          color: 'bg-yellow-100 text-yellow-800',
          icon: Clock
        };
      case 'overdue':
        return { 
          label: 'En retard', 
          color: 'bg-red-100 text-red-800',
          icon: AlertCircle
        };
      case 'scheduled':
        return { 
          label: 'Programmé', 
          color: 'bg-blue-100 text-blue-800',
          icon: Calendar
        };
      default:
        return { 
          label: status, 
          color: 'bg-gray-100 text-gray-800',
          icon: Clock
        };
    }
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'card': return CreditCard;
      case 'bank_transfer': return Building;
      case 'sepa': return Zap;
      case 'check': return Edit3;
      default: return CreditCard;
    }
  };

  const totalAmount = clientPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const paidAmount = clientPayments.filter(p => p.status === 'paid').reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = clientPayments.filter(p => p.status === 'pending').reduce((sum, payment) => sum + payment.amount, 0);
  const scheduledAmount = clientPayments.filter(p => p.status === 'scheduled').reduce((sum, payment) => sum + payment.amount, 0);

  const handlePayNow = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <RefreshCw className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Chargement des paiements...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Paiements</h1>
          <p className="text-gray-600">Planifiez et suivez vos paiements</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowMethodModal(true)}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter méthode
          </button>
          <button 
            onClick={() => setShowPaymentModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Nouveau paiement
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Euro className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Planifié</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
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
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(paidAmount)}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">
                  {totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Attente</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(pendingAmount)}</p>
              <p className="text-sm text-yellow-600">Action requise</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Programmé</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(scheduledAmount)}</p>
              <p className="text-sm text-purple-600">Automatique</p>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de progression globale */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Progression des Paiements</h3>
          <span className="text-sm text-gray-600">
            {totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0}% complété
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-1000"
            style={{ width: `${totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>{formatCurrency(paidAmount)} payé</span>
          <span>{formatCurrency(totalAmount - paidAmount)} restant</span>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'schedule', label: 'Échéancier', icon: Calendar },
              { id: 'methods', label: 'Méthodes de paiement', icon: CreditCard },
              { id: 'history', label: 'Historique', icon: BarChart3 }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Onglet Échéancier */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Plan de Paiement</h3>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </button>
              </div>

              <div className="space-y-4">
                {clientPayments
                  .filter(payment => payment.status === 'scheduled' || payment.status === 'pending')
                  .map((payment, index) => {
                    const statusConfig = getStatusConfig(payment.status);
                    const StatusIcon = statusConfig.icon;
                    
                    return (
                      <div key={payment.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                              payment.status === 'paid' ? 'bg-green-100 text-green-600' :
                              payment.status === 'overdue' ? 'bg-red-100 text-red-600' :
                              payment.status === 'scheduled' ? 'bg-blue-100 text-blue-600' :
                              'bg-yellow-100 text-yellow-600'
                            }`}>
                              {index + 1}
                            </div>
                            
                            <div>
                              <div className="flex items-center space-x-3">
                                <h4 className="font-semibold text-gray-900">
                                  Échéance #{index + 1}
                                </h4>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {statusConfig.label}
                                </span>
                              </div>
                              
                              <p className="text-gray-600 mt-1">{payment.description}</p>
                              
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {new Date(payment.dueDate).toLocaleDateString('fr-FR', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </span>
                                <span className="flex items-center">
                                  <CreditCard className="h-4 w-4 mr-1" />
                                  {payment.method}
                                </span>
                                {payment.reference && (
                                  <span className="text-blue-600">
                                    Réf: {payment.reference}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              {formatCurrency(payment.amount)}
                            </div>
                            
                            {payment.paidDate && (
                              <div className="text-sm text-green-600 mt-1">
                                Payé le {new Date(payment.paidDate).toLocaleDateString('fr-FR')}
                              </div>
                            )}
                            
                            <div className="flex items-center space-x-2 mt-3">
                              {payment.status === 'pending' && (
                                <button 
                                  onClick={() => handlePayNow(payment)}
                                  className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                                >
                                  <CreditCard className="h-3 w-3 mr-1" />
                                  Payer
                                </button>
                              )}
                              
                              {payment.status === 'scheduled' && (
                                <button className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                                  <Edit3 className="h-3 w-3 mr-1" />
                                  Modifier
                                </button>
                              )}
                              
                              <button className="flex items-center px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm">
                                <Eye className="h-3 w-3 mr-1" />
                                Détails
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                
                {clientPayments.filter(p => p.status === 'scheduled' || p.status === 'pending').length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">Aucun paiement programmé</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Onglet Méthodes de paiement */}
          {activeTab === 'methods' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Méthodes de Paiement</h3>
                <button 
                  onClick={() => setShowMethodModal(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une méthode
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paymentMethods.map((method) => {
                  const MethodIcon = getMethodIcon(method.type);
                  
                  return (
                    <div key={method.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 p-3 rounded-lg">
                            <MethodIcon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{method.name}</h4>
                            <p className="text-sm text-gray-600">{method.details}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {method.isDefault && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Par défaut
                            </span>
                          )}
                          
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            method.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {method.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                          <Edit3 className="h-3 w-3 mr-1" />
                          Modifier
                        </button>
                        
                        {!method.isDefault && (
                          <button className="flex items-center px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                            <Target className="h-3 w-3 mr-1" />
                            Définir par défaut
                          </button>
                        )}
                        
                        <button className="flex items-center px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                          <Trash2 className="h-3 w-3 mr-1" />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Onglet Historique */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Historique des Paiements</h3>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter l'historique
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Méthode</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Référence</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {clientPayments.filter(p => p.status === 'paid').map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.paidDate && new Date(payment.paidDate).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {payment.method}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                          {payment.reference || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Payé
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <Download className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    
                    {clientPayments.filter(p => p.status === 'paid').length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                          Aucun paiement effectué
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de paiement */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedPayment ? 'Effectuer le Paiement' : 'Nouveau Paiement'}
                </h3>
                <button 
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedPayment(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                {selectedPayment && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900">Échéance #{selectedPayment.id}</h4>
                    <p className="text-sm text-blue-700">{selectedPayment.description}</p>
                    <p className="text-sm text-blue-600 mt-1">
                      Échéance: {new Date(selectedPayment.dueDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant à payer
                  </label>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(selectedPayment?.amount || 0)}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Méthode de paiement
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    {paymentMethods.filter(m => m.isActive).map(method => (
                      <option key={method.id} value={method.id}>
                        {method.name} {method.isDefault ? '(Par défaut)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button 
                    onClick={() => {
                      setShowPaymentModal(false);
                      setSelectedPayment(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Confirmer le paiement
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'ajout de méthode */}
      {showMethodModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Ajouter une Méthode de Paiement</h3>
                <button 
                  onClick={() => setShowMethodModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de méthode
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="card">Carte bancaire</option>
                    <option value="bank_transfer">Virement bancaire</option>
                    <option value="sepa">Prélèvement SEPA</option>
                    <option value="check">Chèque</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de la méthode
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Ex: Carte principale"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Détails
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Ex: **** **** **** 1234"
                  />
                </div>
                
                <div className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                  <label className="ml-2 text-sm text-gray-700">
                    Définir comme méthode par défaut
                  </label>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button 
                    onClick={() => setShowMethodModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2 inline" />
                    Ajouter
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

export default PaymentsPage;