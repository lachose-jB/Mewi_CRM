import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Phone, 
  Mail, 
  Calendar,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  Plus,
  Search,
  Filter,
  User,
  MessageSquare,
  Target,
  Activity,
  BarChart3,
  Eye,
  Edit3,
  Download,
  Printer,
  Share2,
  Settings,
  X,
  Save,
  RefreshCw
} from 'lucide-react';
import { useCrm } from '../../contexts/CrmContext';
import { useAuth } from '../../contexts/AuthContext';
import CalendarRelances from '../Management/CalendarRelances';
import ClientDossiers from '../Management/ClientDossiers';
import TasksPage from '../Management/TasksPage';
import FinancialOverview from '../Management/FinancialOverview';
import CriticalDossiers from '../Management/CriticalDossiers';

const ManagerDashboard: React.FC = () => {
  const { clients, refreshData } = useCrm();
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'dashboard' | 'calendar' | 'clients' | 'tasks' | 'financial' | 'critical'>('dashboard');
  const [showCalendar, setShowCalendar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [managerStats, setManagerStats] = useState({
    totalClients: 0,
    totalAmount: 0,
    criticalClients: 0,
    todayTasks: 0,
    recoveryRate: 0,
    monthlyRecovered: 0
  });

  // Filtrer les clients assignés au gestionnaire connecté
  const myClients = clients.filter(client => client.manager_id === user?.id);
  
  // Load manager-specific data
  useEffect(() => {
    const loadManagerData = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        
        // Calculate manager stats from clients
        setManagerStats({
          totalClients: myClients.length,
          totalAmount: myClients.reduce((sum, client) => sum + client.total_amount, 0),
          criticalClients: myClients.filter(client => client.status === 'critical').length,
          todayTasks: 8, // Mock data
          recoveryRate: 75, // Mock data
          monthlyRecovered: 350000 // Mock data
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading manager data:', error);
        setIsLoading(false);
      }
    };
    
    loadManagerData();
  }, [user?.id, myClients]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'blue': return 'bg-blue-100 text-blue-800';
      case 'yellow': return 'bg-yellow-100 text-yellow-800';
      case 'orange': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const statCards = [
    {
      title: 'Mes Dossiers',
      value: managerStats.totalClients,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      onClick: () => setActiveView('clients')
    },
    {
      title: 'Montant Total',
      value: formatCurrency(managerStats.totalAmount),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      onClick: () => setActiveView('financial')
    },
    {
      title: 'Dossiers Critiques',
      value: managerStats.criticalClients,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      onClick: () => setActiveView('critical')
    },
    {
      title: 'Tâches du Jour',
      value: managerStats.todayTasks,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      onClick: () => setActiveView('tasks')
    }
  ];

  const handleRefreshData = async () => {
    setIsLoading(true);
    await refreshData();
    
    // Reload manager-specific data
    if (user?.id) {
      try {
        // Recalculate manager stats
        setManagerStats({
          totalClients: myClients.length,
          totalAmount: myClients.reduce((sum, client) => sum + client.total_amount, 0),
          criticalClients: myClients.filter(client => client.status === 'critical').length,
          todayTasks: 8, // Mock data
          recoveryRate: 75, // Mock data
          monthlyRecovered: 350000 // Mock data
        });
      } catch (error) {
        console.error('Error refreshing manager data:', error);
      }
    }
    
    setIsLoading(false);
  };

  // Si on affiche le calendrier, on retourne le composant CalendarRelances
  if (activeView === 'calendar') {
    return (
      <div>
        <div className="p-6 border-b border-gray-200">
          <button
            onClick={() => setActiveView('dashboard')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Retour au tableau de bord
          </button>
        </div>
        <CalendarRelances userId={user?.id} userRole={user?.role} />
      </div>
    );
  }

  // Si on affiche les dossiers clients
  if (activeView === 'clients') {
    return (
      <div>
        <div className="p-6 border-b border-gray-200">
          <button
            onClick={() => setActiveView('dashboard')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Retour au tableau de bord
          </button>
        </div>
        <ClientDossiers />
      </div>
    );
  }

  // Si on affiche les tâches du jour
  if (activeView === 'tasks') {
    return (
      <div>
        <div className="p-6 border-b border-gray-200">
          <button
            onClick={() => setActiveView('dashboard')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Retour au tableau de bord
          </button>
        </div>
        <TasksPage />
      </div>
    );
  }

  // Si on affiche l'aperçu financier
  if (activeView === 'financial') {
    return (
      <div>
        <div className="p-6 border-b border-gray-200">
          <button
            onClick={() => setActiveView('dashboard')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Retour au tableau de bord
          </button>
        </div>
        <FinancialOverview />
      </div>
    );
  }

  // Si on affiche les dossiers critiques
  if (activeView === 'critical') {
    return (
      <div>
        <div className="p-6 border-b border-gray-200">
          <button
            onClick={() => setActiveView('dashboard')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Retour au tableau de bord
          </button>
        </div>
        <CriticalDossiers />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mon Tableau de Bord</h1>
          <p className="text-gray-600">Bonjour {user?.name}, voici l'état de votre portefeuille</p>
        </div>
        <button 
          onClick={handleRefreshData}
          disabled={isLoading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Actualisation...' : 'Actualiser'}
        </button>
      </div>

      {/* Statistiques personnelles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow"
              onClick={stat.onClick}
            >
              <div className="flex items-center">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tâches prioritaires */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Tâches Prioritaires</h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-red-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-red-800">Appeler Jean Martin</p>
                  <p className="text-xs text-red-600">Promesse de règlement échue</p>
                </div>
              </div>
              <button className="text-xs bg-red-600 text-white px-2 py-1 rounded">
                Urgent
              </button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-yellow-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Relance Sophie Leroy</p>
                  <p className="text-xs text-yellow-600">Email de relance à 14h</p>
                </div>
              </div>
              <button className="text-xs bg-yellow-600 text-white px-2 py-1 rounded">
                Planifié
              </button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Suivi débiteur Dubois</p>
                  <p className="text-xs text-blue-600">Rappel négociation</p>
                </div>
              </div>
              <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                Nouveau
              </button>
            </div>
          </div>
          <div className="mt-4 text-center">
            <button 
              onClick={() => setActiveView('tasks')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Voir toutes les tâches →
            </button>
          </div>
        </div>

        {/* Mes clients récents */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Débiteur Récents</h3>
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {myClients.slice(0, 3).map((client) => (
              <div key={client.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {client.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{client.name}</p>
                    <p className="text-xs text-gray-500">{formatCurrency(client.total_amount)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                    {client.status === 'critical' ? 'Critique' : client.status}
                  </span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Phone className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <button 
              onClick={() => setActiveView('clients')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Voir tous les débiteurs →
            </button>
          </div>
        </div>
      </div>

      {/* Calendrier des relances */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Calendrier des Relances</h3>
          <button 
            onClick={() => setActiveView('calendar')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Voir le calendrier
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-700">Aujourd'hui</h4>
            <span className="text-sm text-gray-500">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          </div>
          
          <div className="space-y-3">
            {[
              { time: '09:00', title: 'Relance email facture #FAC-2024-001', client: 'Jean Martin', type: 'email' },
              { time: '14:30', title: 'Appel de suivi client', client: 'Jean Martin', type: 'call' }
            ].map((event, index) => {
              const getIcon = (type: string) => {
                switch (type) {
                  case 'email': return Mail;
                  case 'call': return Phone;
                  case 'sms': return MessageSquare;
                  default: return Calendar;
                }
              };
              
              const getColor = (type: string) => {
                switch (type) {
                  case 'email': return 'bg-blue-100 text-blue-600';
                  case 'call': return 'bg-purple-100 text-purple-600';
                  case 'sms': return 'bg-green-100 text-green-600';
                  default: return 'bg-gray-100 text-gray-600';
                }
              };
              
              const Icon = getIcon(event.type);
              
              return (
                <div key={index} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0 w-16 text-center">
                    <span className="text-sm font-medium text-gray-900">{event.time}</span>
                  </div>
                  <div className={`p-2 rounded-lg mx-3 ${getColor(event.type)}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <p className="text-xs text-gray-500">Client: {event.client}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <h4 className="font-medium text-gray-700">Demain</h4>
            <span className="text-sm text-gray-500">
              {new Date(Date.now() + 86400000).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
          </div>
          
          <div className="space-y-3">
            {[
              { time: '10:00', title: 'SMS de rappel', client: 'Sophie Leroy', type: 'sms' }
            ].map((event, index) => {
              const getIcon = (type: string) => {
                switch (type) {
                  case 'email': return Mail;
                  case 'call': return Phone;
                  case 'sms': return MessageSquare;
                  default: return Calendar;
                }
              };
              
              const getColor = (type: string) => {
                switch (type) {
                  case 'email': return 'bg-blue-100 text-blue-600';
                  case 'call': return 'bg-purple-100 text-purple-600';
                  case 'sms': return 'bg-green-100 text-green-600';
                  default: return 'bg-gray-100 text-gray-600';
                }
              };
              
              const Icon = getIcon(event.type);
              
              return (
                <div key={index} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0 w-16 text-center">
                    <span className="text-sm font-medium text-gray-900">{event.time}</span>
                  </div>
                  <div className={`p-2 rounded-lg mx-3 ${getColor(event.type)}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <p className="text-xs text-gray-500">Débiteur: {event.client}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Statistiques de performance */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Ma Performance</h3>
          <div className="flex items-center space-x-2">
            <select className="px-3 py-1 border border-gray-300 rounded text-sm">
              <option>Ce mois</option>
              <option>Mois dernier</option>
              <option>Trimestre</option>
            </select>
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-700">Taux de recouvrement</h4>
              <span className="text-green-600 font-medium">+5%</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{managerStats.recoveryRate.toFixed(1)}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: `${managerStats.recoveryRate}%` }}></div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-700">Montant recouvré</h4>
              <span className="text-green-600 font-medium">+12%</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{formatCurrency(managerStats.monthlyRecovered)}</div>
            <div className="flex items-center text-sm text-gray-500">
              <Target className="h-4 w-4 mr-1 text-blue-500" />
              <span>Objectif: {formatCurrency(500000)}</span>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-700">Actions complétées</h4>
              <span className="text-green-600 font-medium">+8%</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">156</div>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span className="flex items-center">
                <Mail className="h-3 w-3 mr-1 text-blue-500" />
                <span>98 emails</span>
              </span>
              <span className="flex items-center">
                <Phone className="h-3 w-3 mr-1 text-purple-500" />
                <span>58 appels</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
            <div className="text-center">
              <Phone className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-600">Nouvel Appel</p>
            </div>
          </button>
          
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors">
            <div className="text-center">
              <Mail className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-600">Envoyer Email</p>
            </div>
          </button>
          
          <button 
            onClick={() => setActiveView('calendar')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors"
          >
            <div className="text-center">
              <Calendar className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-purple-600">Planifier RDV</p>
            </div>
          </button>
          
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-orange-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-colors">
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-orange-600">Marquer Payé</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;