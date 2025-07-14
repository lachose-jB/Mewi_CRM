import React, { useState } from 'react';
import {
  Users,
  FileText,
  TrendingUp,
  AlertCircle,
  DollarSign,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Clock,
  Phone,
  Mail,
  MessageSquare,
  Eye,
  Settings,
  Plus,
  RefreshCw
} from 'lucide-react';
import { useCrm } from '../../contexts/CrmContext';
import ClientDossiers from '../Management/ClientDossiers';
import ClientDossierDetails from '../Management/ClientDossierDetails';
import RuleFormModal from '../Management/RuleFormModal';
import SystemSettings from '../Management/SystemSettings';

// Composant graphique en barres simple
const BarChart: React.FC<{ data: Array<{ label: string; value: number; color: string }> }> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center space-x-3">
          <div className="w-20 text-sm text-gray-400 text-right">{item.label}</div>
          <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
            <div 
              className={`h-6 rounded-full ${item.color} transition-all duration-1000 ease-out flex items-center justify-end pr-2`}
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            >
              <span className="text-white text-xs font-medium">{item.value}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Composant graphique en secteurs (donut)
const DonutChart: React.FC<{ data: Array<{ label: string; value: number; color: string }> }> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;

  const createPath = (percentage: number, cumulativePercentage: number) => {
    const startAngle = cumulativePercentage * 3.6;
    const endAngle = (cumulativePercentage + percentage) * 3.6;
    
    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);
    
    const largeArcFlag = percentage > 50 ? 1 : 0;
    
    const x1 = 50 + 40 * Math.cos(startAngleRad);
    const y1 = 50 + 40 * Math.sin(startAngleRad);
    const x2 = 50 + 40 * Math.cos(endAngleRad);
    const y2 = 50 + 40 * Math.sin(endAngleRad);
    
    return `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="flex items-center space-x-6">
      <div className="relative">
        <svg width="200" height="200" viewBox="0 0 100 100" className="transform -rotate-90">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const path = createPath(percentage, cumulativePercentage);
            cumulativePercentage += percentage;
            
            return (
              <path
                key={index}
                d={path}
                fill={item.color.replace('bg-', '').replace('-500', '') === 'blue' ? '#3B82F6' : 
                     item.color.replace('bg-', '').replace('-500', '') === 'yellow' ? '#EAB308' :
                     item.color.replace('bg-', '').replace('-500', '') === 'orange' ? '#F97316' :
                     item.color.replace('bg-', '').replace('-500', '') === 'red' ? '#EF4444' : '#6B7280'}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            );
          })}
          <circle cx="50" cy="50" r="25" fill="white" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{total}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        {data.map((item, index) => {
          const percentage = ((item.value / total) * 100).toFixed(1);
          return (
            <div key={index} className="flex items-center space-x-3">
              <div 
                className={`w-4 h-4 rounded-full`}
                style={{ 
                  backgroundColor: item.color.replace('bg-', '').replace('-500', '') === 'blue' ? '#3B82F6' : 
                                  item.color.replace('bg-', '').replace('-500', '') === 'yellow' ? '#EAB308' :
                                  item.color.replace('bg-', '').replace('-500', '') === 'orange' ? '#F97316' :
                                  item.color.replace('bg-', '').replace('-500', '') === 'red' ? '#EF4444' : '#6B7280'
                }}
              ></div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  <span className="text-sm text-gray-500">{percentage}%</span>
                </div>
                <div className="text-xs text-gray-500">{item.value} dossiers</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Composant graphique linéaire simple
const LineChart: React.FC<{ data: Array<{ label: string; value: number }> }> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;
  
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 300;
    const y = 100 - ((item.value - minValue) / range) * 80;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="space-y-4">
      <svg width="300" height="120" viewBox="0 0 300 120" className="border border-gray-200 rounded">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1"/>
          </linearGradient>
        </defs>
        
        {/* Grille */}
        {[0, 1, 2, 3, 4].map(i => (
          <line key={i} x1="0" y1={20 + i * 20} x2="300" y2={20 + i * 20} stroke="#E5E7EB" strokeWidth="1"/>
        ))}
        
        {/* Ligne de données */}
        <polyline
          points={points}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Zone sous la courbe */}
        <polygon
          points={`0,100 ${points} 300,100`}
          fill="url(#gradient)"
        />
        
        {/* Points de données */}
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 300;
          const y = 100 - ((item.value - minValue) / range) * 80;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="4"
              fill="#3B82F6"
              className="hover:r-6 transition-all cursor-pointer"
            />
          );
        })}
      </svg>
      
      <div className="flex justify-between text-xs text-gray-500">
        {data.map((item, index) => (
          <span key={index}>{item.label}</span>
        ))}
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const { metrics, clients } = useCrm();
  const [showDossiers, setShowDossiers] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState<any | null>(null);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showScheduling, setShowScheduling] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const statusCounts = clients.reduce((acc, client) => {
    acc[client.status] = (acc[client.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Données pour les graphiques
  const statusChartData = [
    { label: 'REC 1', value: statusCounts.yellow || 0, color: 'bg-blue-500' },
    { label: 'REC 2', value: statusCounts.orange || 0, color: 'bg-yellow-500' },
    { label: 'REC 3', value: statusCounts.critical || 0, color: 'bg-red-500' }
  ];

  const monthlyRecoveryData = [
    { label: 'Jan', value: 145000 },
    { label: 'Fév', value: 162000 },
    { label: 'Mar', value: 178000 },
    { label: 'Avr', value: 155000 },
    { label: 'Mai', value: 189000 },
    { label: 'Jun', value: 201000 }
  ];

  const performanceByManagerData = [
    { label: 'Marie D.', value: 87, color: 'bg-green-500' },
    { label: 'Pierre M.', value: 76, color: 'bg-blue-500' },
    { label: 'Sophie L.', value: 92, color: 'bg-purple-500' },
    { label: 'Jean R.', value: 68, color: 'bg-orange-500' }
  ];

  const statCards = [
    {
      title: 'Créances Totales',
      value: formatCurrency(metrics?.totalDebt ?? 0),
      icon: DollarSign,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: '+12.5%',
      trendUp: true
    },
    {
      title: 'Dossiers Actifs',
      value: (metrics?.activeFiles ?? 0).toLocaleString(),
      icon: FileText,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: '+8.2%',
      trendUp: true
    },
    {
      title: 'Taux de Recouvrement',
      value: `${metrics?.recoveryRate ?? 0}%`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: '+3.1%',
      trendUp: true
    },
    {
      title: 'DSO Moyen',
      value: `${metrics?.averageDso ?? 0} jours`,
      icon: Calendar,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      trend: '-2.4%',
      trendUp: false
    }
  ];

  // Gestion des actions des boutons
  // Affiche la liste des dossiers
  const handleViewDossiers = () => {
    setShowDossiers(true);
    setSelectedDossier(null);
  };

  // Quand on clique sur un dossier dans la liste
  const handleSelectDossier = (dossier: any) => {
    setSelectedDossier(dossier);
  };

  // Retour à la liste des dossiers
  const handleBackToDossiers = () => {
    setSelectedDossier(null);
  };

  const handleScheduling = () => {
    setShowScheduling(true);
  };

  const handleAnalyze = () => {
    setShowAnalytics(true);
  };

  const handleAddRule = () => {
    setShowRuleModal(true);
  };

  const handleSaveRule = (rule: any) => {
    console.log('Nouvelle règle sauvegardée:', rule);
    // Ici vous pourriez ajouter la logique pour sauvegarder la règle
  };

  // Si un dossier est sélectionné, afficher ses détails
  if (selectedDossier) {
    return (
      <div>
        <div className="p-6 border-b border-gray-200">
          <button
            onClick={handleBackToDossiers}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Retour à la liste des dossiers
          </button>
        </div>
        <ClientDossierDetails dossier={selectedDossier} onBack={handleBackToDossiers} />
      </div>
    );
  }

  // Si on affiche les dossiers, on retourne le composant ClientDossiers
  if (showDossiers) {
    return (
      <div>
        <div className="p-6 border-b border-gray-200">
          <button
            onClick={() => setShowDossiers(false)}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Retour au tableau de bord
          </button>
        </div>
        <ClientDossiers onSelectDossier={handleSelectDossier} />
      </div>
    );
  }

  // Modal de planification
  if (showScheduling) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowScheduling(false)}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            ← Retour au tableau de bord
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Planification des Relances</h1>
          <div></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Relances programmées */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Relances Programmées</h3>
              <button
                onClick={handleAddRule}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle règle
              </button>
            </div>
            
            <div className="space-y-4">
              {[
                { time: '09:00', count: 45, type: 'Emails de relance', status: 'Programmé' },
                { time: '14:00', count: 23, type: 'SMS urgents', status: 'En cours' },
                { time: '16:00', count: 12, type: 'Appels de suivi', status: 'Programmé' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.time} - {item.type}</p>
                      <p className="text-sm text-gray-500">{item.count} actions prévues</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    item.status === 'En cours' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Calendrier des actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Calendrier des Actions</h3>
            <div className="bg-gray-50 rounded-lg p-4 h-64 flex items-center justify-center">
              <div className="text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Calendrier interactif des relances</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques de planification */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <RefreshCw className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Relances Aujourd'hui</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Taux de Réussite</p>
                <p className="text-2xl font-bold text-gray-900">78%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Temps Moyen</p>
                <p className="text-2xl font-bold text-gray-900">2.3h</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Actions Automatiques</p>
                <p className="text-2xl font-bold text-gray-900">89%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Modal d'analyse
  if (showAnalytics) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowAnalytics(false)}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            ← Retour au tableau de bord
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Analyses Avancées</h1>
          <div></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Analyse des tendances */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendances de Recouvrement</h3>
            <LineChart data={monthlyRecoveryData} />
          </div>

          {/* Performance par gestionnaire */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance par Gestionnaire</h3>
            <BarChart data={performanceByManagerData} />
          </div>

          {/* Prédictions IA */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Prédictions IA</h3>
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-green-900">Prédiction positive</p>
                    <p className="text-sm text-green-700">+15% de recouvrement prévu ce mois</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
                  <div>
                    <p className="font-medium text-yellow-900">Attention requise</p>
                    <p className="text-sm text-yellow-700">23 dossiers à risque d'impayé</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommandations */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommandations</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-blue-100 p-1 rounded mr-3 mt-1">
                  <Target className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Optimiser les relances SMS</p>
                  <p className="text-xs text-gray-600">Taux de réponse 34% supérieur aux emails</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-purple-100 p-1 rounded mr-3 mt-1">
                  <Clock className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Ajuster les horaires d'appel</p>
                  <p className="text-xs text-gray-600">Meilleur taux de contact entre 14h-16h</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-100 p-1 rounded mr-3 mt-1">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Former l'équipe</p>
                  <p className="text-xs text-gray-600">Nouvelles techniques de négociation disponibles</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Administrateur</h1>
        <p className="text-gray-600">Vue d'ensemble de l'activité de recouvrement</p>
      </div>

      {/* Statistiques principales avec tendances */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${stat.textColor}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                    <p className="text-1xl font-bold text-gray-700">{stat.value}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`flex items-center text-sm font-medium ${
                    stat.trendUp ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className={`h-4 w-4 mr-1 ${stat.trendUp ? '' : 'rotate-180'}`} />
                    {stat.trend}
                  </div>
                  <p className="text-xs text-gray-500">vs mois dernier</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition par statut - Graphique en secteurs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Répartition des Dossiers</h3>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          <DonutChart data={statusChartData} />
        </div>

        {/* Performance par gestionnaire - Graphique en barres */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Performance Gestionnaires</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-1 mb-4">
            <p className="text-sm text-gray-600">Taux de recouvrement par gestionnaire (%)</p>
          </div>
          <BarChart data={performanceByManagerData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution mensuelle - Graphique linéaire */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Évolution du Recouvrement</h3>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-1 mb-4">
            <p className="text-sm text-gray-600">Montants recouvrés par mois (€)</p>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(189750)}</p>
            <p className="text-xs text-gray-500">Moyenne mensuelle</p>
          </div>
          <LineChart data={monthlyRecoveryData} />
        </div>

        {/* Statistiques de communication */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Communications ce Mois</h3>
            <MessageSquare className="h-5 w-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Mail className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">1,247</div>
              <div className="text-sm text-gray-600">Emails</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <MessageSquare className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">892</div>
              <div className="text-sm text-gray-600">SMS</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Phone className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">456</div>
              <div className="text-sm text-gray-600">Appels</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <FileText className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">123</div>
              <div className="text-sm text-gray-600">Courriers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Activité récente et alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activité récente */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Activité Récente</h3>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Recouvrement mensuel</p>
                  <p className="text-xs text-gray-500">Décembre 2024</p>
                </div>
              </div>
              <span className="text-sm font-medium text-green-600">
                {formatCurrency(metrics?.monthlyRecovered ?? 0)}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Nouveaux Débiteur</p>
                  <p className="text-xs text-gray-500">Cette semaine</p>
                </div>
              </div>
              <span className="text-sm font-medium text-blue-600">12</span>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Target className="h-4 w-4 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Objectif mensuel</p>
                  <p className="text-xs text-gray-500">Progression</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-purple-600">78%</span>
                <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alertes système */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertes Système</h3>
          <div className="space-y-3">
            <div className="flex items-start p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">23 dossiers en statut critique</p>
                <p className="text-xs text-red-600 mt-1">Intervention urgente requise</p>
                <div className="mt-2">
                  <button 
                    onClick={handleViewDossiers}
                    className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                  >
                    Voir les dossiers
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">156 relances automatiques programmées</p>
                <p className="text-xs text-yellow-600 mt-1">Pour les prochaines 24h</p>
                <div className="mt-2">
                  <button 
                    onClick={handleScheduling}
                    className="text-xs bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition-colors"
                  >
                    Planification
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Activity className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">Pic d'activité détecté</p>
                <p className="text-xs text-blue-600 mt-1">+45% de relances aujourd'hui</p>
                <div className="mt-2">
                  <button 
                    onClick={handleAnalyze}
                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                  >
                    Analyser
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button 
            onClick={handleAddRule}
            className="flex items-center justify-center p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <div className="text-center">
              <Plus className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-600">Nouvelle Règle</p>
            </div>
          </button>
          
          <button 
            onClick={() => setShowSettings(true)}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
          >
            <div className="text-center">
              <Settings className="h-8 w-8 text-gray-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">Paramètres</p>
            </div>
          </button>
          
          <button 
            onClick={handleViewDossiers}
            className="flex items-center justify-center p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors"
          >
            <div className="text-center">
              <Eye className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-600">Voir Dossiers</p>
            </div>
          </button>
          
          <button 
            onClick={handleScheduling}
            className="flex items-center justify-center p-4 border-2 border-dashed border-orange-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-colors"
          >
            <div className="text-center">
              <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-orange-600">Planifier Relances</p>
            </div>
          </button>
        </div>
      </div>

      {/* Modals */}
      {showRuleModal && (
        <RuleFormModal 
          rule={null}
          isOpen={showRuleModal}
          onClose={() => setShowRuleModal(false)} 
          onSave={handleSaveRule}
        />
      )}
      
      {showSettings && (
        <SystemSettings onClose={() => setShowSettings(false)} isOpen={false} />
      )}
    </div>
  );
};

export default AdminDashboard;