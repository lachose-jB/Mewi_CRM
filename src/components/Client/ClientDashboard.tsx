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
import { formatCurrency, getDebtorStatusConfig, getRecoveryStatusConfig, formatDate } from '../../utils/dataUtils';
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
    const loadClientData = async () => {
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
    }
    
    loadClientData();
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
  const activeDebtorCount = clientStats?.activeDebtors || clientDebtors.filter(d => 
    d.status !== 'recovered' && d.status !== 'uncollectible').length;
  
  const criticalCases = clientStats?.criticalCases || clientDebtors.filter(d => d.recoveryStatus === 'critical').length;

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
          {clientStats?.monthlyTrend !== undefined && (
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
              <span className="font-medium text-gray-700">{(clientStats?.recoveryRate || 0).toFixed(1)}%</span>
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
              {clientStats?.completedDebtors || 0} dossier{(clientStats?.completedDebtors