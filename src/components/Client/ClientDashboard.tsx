import React, { useState, useEffect } from 'react';
import { 
  Building,
  CheckCircle, 
  Clock, 
  CreditCard, 
  Download, 
  Eye, 
  FileText, 
  Mail, 
  Phone, 
  BarChart3,
  AlertCircle,
  ArrowRight,
  Users,
  Calendar,
  TrendingUp,
  RefreshCw,
  Target
} from 'lucide-react';
import { useCrm } from '../../contexts/CrmContext';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { formatCurrency, getDebtorStatusConfig, getRecoveryStatusConfig } from '../../utils/dataUtils';
import DebtorOverviewCard from './DebtorOverviewCard';
import { Client, ClientMetrics } from '../../types';

const ClientDashboard: React.FC = () => {
  const { clients, debtors, invoices, communications, refreshData, clientMetrics } = useCrm();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [clientData, setClientData] = useState<Client | null>(null);
  const [clientStats, setClientStats] = useState<ClientMetrics | null>(null);

  // Get client data and stats
  useEffect(() => {
    if (user && user.role === 'client') {
      const client = clients.find(c => c.userId === user.id);
      if (client) {
        setClientData(client);
        
        // Get client metrics
        const metrics = clientMetrics[client.id];
        if (metrics) {
          setClientStats(metrics);
        }
      }
    }
  }, [user, clients, clientMetrics]);

  // Handle refresh
  const handleRefresh = async () => {
    setIsLoading(true);
    await refreshData();
    setIsLoading(false);
  };

  if (!clientData) {
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

  // Filter debtors for this client
  const clientDebtors = debtors.filter(d => d.clientId === clientData.id);
  
  // Calculate quick stats
  const activeDebtorCount = clientDebtors.filter(d => 
    d.status !== 'recovered' && d.status !== 'uncollectible'
  ).length;
  
  const criticalCases = clientDebtors.filter(d => d.recoveryStatus === 'critical').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bienvenue, {user?.name}
          </h1>
          <p className="text-gray-600">Voici l'état de vos dossiers de recouvrement</p>
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

      {/* Client card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 text-white p-3 rounded-full">
              <Building className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{clientData.company}</h2>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-500 mt-1">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-1.5 text-gray-400" />
                  <span>{clientData.email}</span>
                </div>
                <div className="flex items-center mt-1 sm:mt-0">
                  <Phone className="h-4 w-4 mr-1.5 text-gray-400" />
                  <span>{clientData.phone}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Gestionnaire assigné</p>
                <p className="font-medium text-gray-800">{clientData.assignedManagerName}</p>
              </div>
              <button className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                <Mail className="h-3.5 w-3.5 mr-1.5" />
                Contacter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total des créances</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(clientStats?.totalDebtAmount || 0)}
              </p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg h-min">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          {clientStats?.monthlyTrend && (
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
              <span className="text-green-600">+{clientStats.monthlyTrend.toFixed(1)}% ce mois</span>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Montant recouvré</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(clientStats?.totalCollectedAmount || 0)}
              </p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg h-min">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Taux de recouvrement</span>
              <span className="font-medium text-gray-700">{clientStats?.recoveryRate.toFixed(1) || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${clientStats?.recoveryRate || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Dossiers actifs</p>
              <p className="text-2xl font-bold text-gray-900">{activeDebtorCount}</p>
            </div>
            <div className="bg-indigo-100 p-2 rounded-lg h-min">
              <FileText className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <div className="flex items-center mt-2 text-sm">
            <Target className="h-4 w-4 mr-1 text-indigo-500" />
            <span className="text-gray-600">
              {clientStats?.completedDebtors || 0} dossier{clientStats?.completedDebtors !== 1 ? 's' : ''} terminé{clientStats?.completedDebtors !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Cas critiques</p>
              <p className="text-2xl font-bold text-gray-900">{criticalCases}</p>
            </div>
            <div className="bg-red-100 p-2 rounded-lg h-min">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="flex items-center mt-2 text-sm">
            <Clock className="h-4 w-4 mr-1 text-red-500" />
            <span className="text-gray-600">
              Durée moyenne: {clientStats?.averageRecoveryTime || 0} jours
            </span>
          </div>
        </div>
      </div>

      {/* Recent debtors */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Dossiers récents</h3>
          <Link 
            to="/debtors" 
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            <Eye className="h-4 w-4 mr-1" />
            Voir tous les dossiers
          </Link>
        </div>

        {clientDebtors.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucun dossier débiteur trouvé</p>
          </div>
        ) : (
          <div className="space-y-4">
            {clientDebtors.slice(0, 3).map(debtor => (
              <DebtorOverviewCard key={debtor.id} debtor={debtor} />
            ))}
            
            {clientDebtors.length > 3 && (
              <div className="text-center pt-4">
                <Link 
                  to="/debtors" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  Voir tous les dossiers ({clientDebtors.length})
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick stats and actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">État des dossiers</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
                <h4 className="font-medium text-blue-800">Par statut</h4>
              </div>
              <div className="space-y-2 mt-3">
                {Object.entries({
                  new: 'Nouveaux',
                  inProgress: 'En cours',
                  paymentPlan: 'Échéancier',
                  disputed: 'Contestés',
                  litigation: 'Contentieux',
                  recovered: 'Recouvrés',
                  uncollectible: 'Irrécouvrables'
                }).map(([key, label]) => {
                  const count = clientDebtors.filter(d => d.status === key).length;
                  if (count === 0) return null;
                  
                  return (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{label}</span>
                      <span className="font-medium text-gray-800">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Target className="h-5 w-5 text-green-600 mr-2" />
                <h4 className="font-medium text-green-800">Par niveau de relance</h4>
              </div>
              <div className="space-y-2 mt-3">
                {Object.entries({
                  blue: 'Dossier Initial',
                  yellow: 'Relance 1',
                  orange: 'Relance 2',
                  critical: 'Relance 3'
                }).map(([key, label]) => {
                  const count = clientDebtors.filter(d => d.recoveryStatus === key).length;
                  if (count === 0) return null;
                  
                  return (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{label}</span>
                      <span className="font-medium text-gray-800">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Actions rapides</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 transition-colors rounded-lg flex flex-col items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600 mb-3" />
              <span className="text-sm font-medium text-blue-800">Télécharger rapport</span>
            </button>
            
            <button className="p-4 bg-green-50 hover:bg-green-100 transition-colors rounded-lg flex flex-col items-center justify-center">
              <Mail className="h-6 w-6 text-green-600 mb-3" />
              <span className="text-sm font-medium text-green-800">Contacter gestionnaire</span>
            </button>
            
            <button className="p-4 bg-purple-50 hover:bg-purple-100 transition-colors rounded-lg flex flex-col items-center justify-center">
              <Eye className="h-6 w-6 text-purple-600 mb-3" />
              <span className="text-sm font-medium text-purple-800">Voir les paiements</span>
            </button>
            
            <button className="p-4 bg-orange-50 hover:bg-orange-100 transition-colors rounded-lg flex flex-col items-center justify-center">
              <Calendar className="h-6 w-6 text-orange-600 mb-3" />
              <span className="text-sm font-medium text-orange-800">Planning de relance</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Activité récente</h3>
          <Link 
            to="/history" 
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            <Eye className="h-4 w-4 mr-1" />
            Voir tout l'historique
          </Link>
        </div>
        
        {communications.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucune activité récente à afficher</p>
          </div>
        ) : (
          <div className="space-y-4">
            {communications
              .filter(c => c.clientId === clientData.id)
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 5)
              .map(comm => {
                const debtor = debtors.find(d => d.id === comm.debtorId);
                
                return (
                  <div key={comm.id} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`p-2 rounded-lg mr-3 ${
                      comm.type === 'email' ? 'bg-blue-100' :
                      comm.type === 'call' ? 'bg-purple-100' :
                      comm.type === 'sms' ? 'bg-green-100' :
                      comm.type === 'letter' ? 'bg-orange-100' : 'bg-gray-100'
                    }`}>
                      {comm.type === 'email' && <Mail className={`h-5 w-5 text-blue-600`} />}
                      {comm.type === 'call' && <Phone className={`h-5 w-5 text-purple-600`} />}
                      {comm.type === 'sms' && <Mail className={`h-5 w-5 text-green-600`} />}
                      {comm.type === 'letter' && <FileText className={`h-5 w-5 text-orange-600`} />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium text-gray-900">
                          {comm.subject || `${comm.type.charAt(0).toUpperCase() + comm.type.slice(1)} - ${debtor?.name || 'Débiteur'}`}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {new Date(comm.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                        {comm.content}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
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
                        {debtor && (
                          <span className="text-xs text-gray-500 ml-2">
                            Débiteur: {debtor.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;