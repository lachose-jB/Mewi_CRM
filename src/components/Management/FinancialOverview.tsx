import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Calendar, 
  Download, 
  Filter, 
  Search, 
  RefreshCw, 
  CreditCard, 
  FileText, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  Printer, 
  Share2, 
  Clock, 
  CheckCircle, 
  AlertTriangle 
} from 'lucide-react';

const FinancialOverview: React.FC = () => {
  const [period, setPeriod] = useState('month');
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState<string | null>(null);

  // Mock financial data
  const financialData = {
    totalAmount: 23950.50,
    recoveredAmount: 12500.75,
    pendingAmount: 11449.75,
    recoveryRate: 52.2,
    monthlyTrend: 8.5,
    byClient: [
      { id: '1', name: 'Jean Martin', amount: 8750.50, recovered: 2500.00, rate: 28.6 },
      { id: '2', name: 'Sophie Leroy', amount: 4500.00, recovered: 4500.00, rate: 100 },
      { id: '3', name: 'Pierre Dubois', amount: 7200.00, recovered: 3500.75, rate: 48.6 },
      { id: '4', name: 'Martin SA', amount: 3500.00, recovered: 2000.00, rate: 57.1 }
    ],
    byMonth: [
      { month: 'Jan', amount: 15000, recovered: 12000 },
      { month: 'Fév', amount: 18000, recovered: 14500 },
      { month: 'Mar', amount: 22000, recovered: 16000 },
      { month: 'Avr', amount: 19000, recovered: 15000 },
      { month: 'Mai', amount: 21000, recovered: 17500 },
      { month: 'Juin', amount: 24000, recovered: 19000 }
    ],
    recentPayments: [
      { id: 'p1', date: '2024-12-15', client: 'Sophie Leroy', amount: 4500.00, method: 'Virement bancaire', status: 'completed' },
      { id: 'p2', date: '2024-12-12', client: 'Pierre Dubois', amount: 2000.75, method: 'Carte bancaire', status: 'completed' },
      { id: 'p3', date: '2024-12-10', client: 'Jean Martin', amount: 2500.00, method: 'Virement bancaire', status: 'completed' },
      { id: 'p4', date: '2024-12-05', client: 'Martin SA', amount: 2000.00, method: 'Chèque', status: 'completed' }
    ],
    upcomingPayments: [
      { id: 'up1', dueDate: '2024-12-20', client: 'Jean Martin', amount: 3000.00, status: 'scheduled' },
      { id: 'up2', dueDate: '2024-12-25', client: 'Pierre Dubois', amount: 1500.00, status: 'scheduled' },
      { id: 'up3', dueDate: '2024-12-31', client: 'Martin SA', amount: 1500.00, status: 'scheduled' }
    ]
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const toggleDetails = (clientId: string) => {
    if (showDetails === clientId) {
      setShowDetails(null);
    } else {
      setShowDetails(clientId);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Aperçu Financier</h1>
          <p className="text-gray-600">Suivi des montants et performances de recouvrement</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
            <option value="all">Tout</option>
          </select>
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Actualisation...' : 'Actualiser'}
          </button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Montant Total</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialData.totalAmount)}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <span>Portefeuille actif</span>
            <span className="ml-auto text-blue-600 font-medium">{financialData.byClient.length} clients</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Montant Recouvré</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialData.recoveredAmount)}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-gray-500">Taux de recouvrement</span>
            <span className="ml-auto text-green-600 font-medium">{financialData.recoveryRate.toFixed(1)}%</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Montant En Attente</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialData.pendingAmount)}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-gray-500">Paiements programmés</span>
            <span className="ml-auto text-orange-600 font-medium">{financialData.upcomingPayments.length}</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tendance Mensuelle</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold text-gray-900">+{financialData.monthlyTrend}%</p>
                  <TrendingUp className="h-5 w-5 text-green-500 ml-2" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-gray-500">vs mois précédent</span>
            <span className="ml-auto text-purple-600 font-medium">+{(financialData.monthlyTrend * 1000).toFixed(0)}€</span>
          </div>
        </div>
      </div>

      {/* Graphique d'évolution */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Évolution du Recouvrement</h3>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="h-64 bg-gray-50 rounded-lg p-4">
          {/* Graphique simplifié */}
          <div className="h-full flex items-end space-x-4">
            {financialData.byMonth.map((month, index) => {
              const totalHeight = 100;
              const recoveredHeight = (month.recovered / month.amount) * totalHeight;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gray-200 rounded-t-sm" style={{ height: `${totalHeight - recoveredHeight}%` }}></div>
                  <div className="w-full bg-green-500 rounded-b-sm" style={{ height: `${recoveredHeight}%` }}></div>
                  <div className="mt-2 text-xs text-gray-600">{month.month}</div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="flex items-center justify-center mt-4 space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-200 mr-2"></div>
            <span className="text-sm text-gray-600">Montant total</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 mr-2"></div>
            <span className="text-sm text-gray-600">Montant recouvré</span>
          </div>
        </div>
      </div>

      {/* Répartition par client */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Répartition par Client</h3>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {financialData.byClient.map(client => (
            <div key={client.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-medium text-gray-900">{client.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Montant: {formatCurrency(client.amount)}</span>
                    <span>Recouvré: {formatCurrency(client.recovered)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    client.rate >= 80 ? 'bg-green-100 text-green-800' :
                    client.rate >= 50 ? 'bg-blue-100 text-blue-800' :
                    client.rate >= 25 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {client.rate.toFixed(1)}%
                  </span>
                  <button 
                    onClick={() => toggleDetails(client.id)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    {showDetails === client.id ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    client.rate >= 80 ? 'bg-green-500' :
                    client.rate >= 50 ? 'bg-blue-500' :
                    client.rate >= 25 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${client.rate}%` }}
                ></div>
              </div>
              
              {showDetails === client.id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Factures</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">FAC-2024-001</span>
                          <span className="font-medium">{formatCurrency(client.amount / 2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">FAC-2024-002</span>
                          <span className="font-medium">{formatCurrency(client.amount / 2)}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Paiements</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">10/12/2024</span>
                          <span className="font-medium text-green-600">{formatCurrency(client.recovered)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Paiements récents et à venir */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Paiements Récents</h3>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Eye className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {financialData.recentPayments.map(payment => (
              <div key={payment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <CreditCard className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{payment.client}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(payment.date).toLocaleDateString('fr-FR')} • {payment.method}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(payment.amount)}</p>
                  <p className="text-xs text-green-600">Complété</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Paiements à Venir</h3>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Eye className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {financialData.upcomingPayments.map(payment => (
              <div key={payment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{payment.client}</p>
                    <p className="text-xs text-gray-500">
                      Échéance: {new Date(payment.dueDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(payment.amount)}</p>
                  <p className="text-xs text-blue-600">Programmé</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="h-6 w-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Exporter Rapport</span>
          </button>
          
          <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Printer className="h-6 w-6 text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Imprimer Relevé</span>
          </button>
          
          <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Share2 className="h-6 w-6 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Partager Résultats</span>
          </button>
          
          <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <BarChart3 className="h-6 w-6 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Analyse Détaillée</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinancialOverview;