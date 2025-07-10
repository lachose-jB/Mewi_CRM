import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  CreditCard, 
  Phone, 
  Mail,
  AlertCircle,
  CheckCircle,
  Download,
  Calendar,
  RefreshCw,
  Eye,
  Building,
  Clock,
  TrendingUp,
  User
} from 'lucide-react';
import { useCrm } from '../../contexts/CrmContext';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { formatCurrency, getStatusConfig } from '../../utils/dataUtils';

const ClientDashboard: React.FC = () => {
  const { clients, invoices, communications, refreshData } = useCrm();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [clientDetails, setClientDetails] = useState<any>(null);

  // Trouver le client correspondant à l'utilisateur connecté
  const clientData = clients.find(client => client.user_id === user?.id || client.email === user?.email);

  // Load client details
  useEffect(() => {
    const loadClientDetails = async () => {
      if (!clientData) return;
      
      try {
        setIsLoading(true);
        
        // Get related data from context
        const clientInvoices = invoices.filter(inv => inv.client_id === clientData.id);
        const clientCommunications = communications.filter(comm => comm.client_id === clientData.id);
        
        setClientDetails({
          ...clientData,
          invoices: clientInvoices,
          communications: clientCommunications
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading client details:', error);
        setIsLoading(false);
      }
    };
    
    loadClientDetails();
  }, [clientData, invoices, communications]);

  // Handle refresh
  const handleRefresh = async () => {
    setIsLoading(true);
    await refreshData();
    
    if (clientData) {
      try {
        // Get related data from context
        const clientInvoices = invoices.filter(inv => inv.client_id === clientData.id);
        const clientCommunications = communications.filter(comm => comm.client_id === clientData.id);
        
        setClientDetails({
          ...clientData,
          invoices: clientInvoices,
          communications: clientCommunications
        });
      } catch (error) {
        console.error('Error refreshing  Débiteur details:', error);
      }
    }
    
    setIsLoading(false);
  };

  if (!clientData) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-500">Aucune information Débiteur trouvée</p>
        </div>
      </div>
    );
  }

  if (isLoading && !clientDetails) {
    return (
      <div className="p-6">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-blue-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(clientData.status);
  const StatusIcon = statusConfig.icon || CheckCircle;

  // Use client details if available
  const clientInvoices = clientDetails?.invoices || [];
  const clientCommunications = clientDetails?.communications || [];

  // Calculate totals
  const totalAmount = clientData.total_amount;
  const totalOriginal = clientInvoices.reduce((sum: number, inv: any) => sum + inv.original_amount, 0);
  const totalPaid = clientInvoices.reduce((sum: number, inv: any) => sum + (inv.paid_amount || 0), 0);
  const overdueInvoices = clientInvoices.filter((inv: any) => inv.status === 'overdue').length;
  const recoveryRate = totalOriginal > 0 ? Math.round((totalPaid / totalOriginal) * 100) : 0;

  // Get manager info
  const managerName = clientData.manager_id === "manager1" ? "Marie Dubois" : 
                      clientData.manager_id === "manager2" ? "Pierre Martin" :
                      clientData.manager_id === "manager3" ? "Sophie Leroy" : "Jean Robert";

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vue d'ensemble</h1>
          <p className="text-gray-600">Bonjour {clientData.name}, voici l'état de votre dossier</p>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Actualisation...' : 'Actualiser'}
        </button>
      </div>

      {/* Statut du dossier */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${statusConfig.color.includes('blue') ? 'bg-blue-50' : 
              statusConfig.color.includes('yellow') ? 'bg-yellow-50' : 
              statusConfig.color.includes('orange') ? 'bg-orange-50' : 'bg-red-50'}`}>
              <StatusIcon className={`h-6 w-6 ${statusConfig.color.split(' ')[1]}`} />
            </div>
            <div className="ml-4">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-bold text-gray-900">Dossier #{clientData.id.substring(0, 8)}</h2>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
              </div>
              <p className="text-gray-600">{statusConfig.description || (
                clientData.status === 'blue' ? 'Votre dossier est à jour' :
                clientData.status === 'yellow' ? 'Une relance a été envoyée' :
                clientData.status === 'orange' ? 'Règlement requis rapidement' :
                'Intervention immédiate nécessaire'
              )}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
            <p className="text-sm text-gray-500">Montant total dû</p>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Factures</p>
              <p className="text-2xl font-bold text-gray-900">{clientInvoices.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Déjà Payé</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPaid)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Retard</p>
              <p className="text-2xl font-bold text-gray-900">{overdueInvoices}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Progression</p>
              <p className="text-2xl font-bold text-gray-900">{recoveryRate}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mes factures */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Mes Factures Impayées</h3>
            <Link to="/dossier" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              Voir tout
            </Link>
          </div>
          <div className="space-y-3">
            {clientInvoices.filter((invoice: any) => invoice.status !== 'paid').slice(0, 3).map((invoice: any) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <FileText className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{invoice.invoice_number}</p>
                    <p className="text-xs text-gray-500">Échéance: {new Date(invoice.due_date).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(invoice.amount)}
                  </span>
                  <button className="text-blue-600 hover:text-blue-800">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            
            {clientInvoices.filter((invoice: any) => invoice.status !== 'paid').length === 0 && (
              <div className="text-center py-4">
                <p className="text-gray-500">Aucune facture impayée</p>
              </div>
            )}
          </div>
        </div>

        {/* Historique des communications */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Historique des Communications</h3>
            <Link to="/dossier" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              Voir tout
            </Link>
          </div>
          <div className="space-y-3">
            {clientCommunications.slice(0, 3).map((comm: any) => {
              const getTypeIcon = (type: string) => {
                switch (type) {
                  case 'email': return Mail;
                  case 'sms': return MessageSquare;
                  case 'call': return Phone;
                  case 'letter': return FileText;
                  default: return Mail;
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
                <div key={comm.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${getTypeColor(comm.type).split(' ')[0]}`}>
                      <Icon className={`h-4 w-4 ${getTypeColor(comm.type).split(' ')[1]}`} />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{comm.subject || (comm.content.length > 30 ? comm.content.substring(0, 30) + '...' : comm.content)}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(comm.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
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
                </div>
              );
            })}
            
            {clientCommunications.length === 0 && (
              <div className="text-center py-4">
                <p className="text-gray-500">Aucune communication récente</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Prochaines échéances */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Prochaines Échéances</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {clientInvoices
            .filter((invoice: any) => invoice.status === 'pending' || invoice.status === 'partial')
            .slice(0, 3)
            .map((invoice: any) => (
              <div key={invoice.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{invoice.invoice_number}</p>
                    <p className="text-xs text-gray-500">Échéance: {new Date(invoice.due_date).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-600">Montant dû:</span>
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(invoice.amount)}</span>
                </div>
                {invoice.status === 'partial' && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Progression</span>
                      <span>{Math.round((invoice.paid_amount / invoice.original_amount) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-green-500 h-1.5 rounded-full" 
                        style={{ width: `${(invoice.paid_amount / invoice.original_amount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
          {clientInvoices.filter((invoice: any) => invoice.status === 'pending' || invoice.status === 'partial').length === 0 && (
            <div className="col-span-3 text-center py-4">
              <p className="text-gray-500">Aucune échéance à venir</p>
            </div>
          )}
        </div>
      </div>

      {/* Informations de contact */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Votre Gestionnaire</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-lg font-medium text-blue-600">{managerName.split(' ').map(n => n[0]).join('')}</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">{managerName}</p>
              <p className="text-xs text-gray-500">Gestionnaire de recouvrement</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Phone className="h-4 w-4 mr-2" />
              Appeler
            </button>
            <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </button>
          </div>
        </div>
      </div>

      {/* Informations entreprise */}
      {clientData.company && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informations Entreprise</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start">
                <Building className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Entreprise</p>
                  <p className="text-gray-900">{clientData.company}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-gray-900">{clientData.email}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Téléphone</p>
                  <p className="text-gray-900">{clientData.phone || 'Non renseigné'}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <User className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Contact principal</p>
                  <p className="text-gray-900">{clientData.contactName || clientData.name}</p>
                  {clientData.contactRole && (
                    <p className="text-sm text-gray-500">{clientData.contactRole}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Client depuis</p>
                  <p className="text-gray-900">{new Date(clientData.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
              
              {clientData.siret && (
                <div className="flex items-start">
                  <FileText className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">SIRET</p>
                    <p className="text-gray-900">{clientData.siret}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Actions rapides */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Actions Disponibles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors">
            <div className="text-center">
              <CreditCard className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-600">Effectuer un Paiement</p>
            </div>
          </button>
          
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
            <div className="text-center">
              <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-600">Demander un Échéancier</p>
            </div>
          </button>
          
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors">
            <div className="text-center">
              <Mail className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-purple-600">Contacter Support</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;