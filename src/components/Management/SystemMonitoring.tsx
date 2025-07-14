import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Server, 
  Database, 
  Wifi, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  HardDrive,
  Cpu,
  MemoryStick,
  Globe,
  Shield,
  RefreshCw,
  Settings,
  Bell,
  Download,
  Eye,
  Zap,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'maintenance';
  uptime: string;
  lastCheck: string;
  responseTime: number;
}

const SystemMonitoring: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [activeTab, setActiveTab] = useState('overview');

  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([
    { name: 'CPU', value: 45, unit: '%', status: 'good', trend: 'stable' },
    { name: 'Mémoire', value: 68, unit: '%', status: 'warning', trend: 'up' },
    { name: 'Disque', value: 23, unit: '%', status: 'good', trend: 'stable' },
    { name: 'Réseau', value: 156, unit: 'Mbps', status: 'good', trend: 'up' }
  ]);

  const [services, setServices] = useState<ServiceStatus[]>([
    { name: 'API Principal', status: 'online', uptime: '99.9%', lastCheck: '30s', responseTime: 120 },
    { name: 'Base de Données', status: 'online', uptime: '99.8%', lastCheck: '45s', responseTime: 85 },
    { name: 'Service Email', status: 'online', uptime: '98.5%', lastCheck: '1m', responseTime: 340 },
    { name: 'Service SMS', status: 'maintenance', uptime: '97.2%', lastCheck: '5m', responseTime: 0 },
    { name: 'Stockage Cloud', status: 'online', uptime: '99.9%', lastCheck: '2m', responseTime: 200 }
  ]);

  const [alerts] = useState([
    {
      id: '1',
      type: 'warning',
      message: 'Utilisation mémoire élevée (68%)',
      timestamp: '2024-12-15 14:30:00',
      service: 'Serveur Principal'
    },
    {
      id: '2',
      type: 'info',
      message: 'Maintenance programmée du service SMS',
      timestamp: '2024-12-15 14:00:00',
      service: 'Service SMS'
    },
    {
      id: '3',
      type: 'success',
      message: 'Sauvegarde automatique terminée',
      timestamp: '2024-12-15 13:45:00',
      service: 'Base de Données'
    }
  ]);

  const refreshData = async () => {
    setIsRefreshing(true);
    // Simulation de rafraîchissement des données
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mise à jour simulée des métriques
    setSystemMetrics(prev => prev.map(metric => ({
      ...metric,
      value: Math.max(0, Math.min(100, metric.value + (Math.random() - 0.5) * 10))
    })));
    
    setIsRefreshing(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Mise à jour automatique toutes les 30 secondes
      setSystemMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.max(0, Math.min(100, metric.value + (Math.random() - 0.5) * 5))
      })));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'good':
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
      case 'offline':
        return 'text-red-600 bg-red-100';
      case 'maintenance':
      case 'info':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
      case 'good':
      case 'success':
        return CheckCircle;
      case 'warning':
        return AlertTriangle;
      case 'critical':
      case 'offline':
        return AlertTriangle;
      case 'maintenance':
      case 'info':
        return Settings;
      default:
        return Clock;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return TrendingUp;
      case 'down':
        return TrendingDown;
      default:
        return Activity;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monitoring Système</h1>
          <p className="text-gray-600">Surveillance en temps réel de l'infrastructure</p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="1h">Dernière heure</option>
            <option value="24h">Dernières 24h</option>
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
          </select>
          <button
            onClick={refreshData}
            disabled={isRefreshing}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Actualisation...' : 'Actualiser'}
          </button>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex space-x-2 bg-gray-50 p-2 rounded-lg">
        {[
          { id: 'overview', label: 'Vue d\'ensemble', icon: Activity },
          { id: 'services', label: 'Services', icon: Server },
          { id: 'performance', label: 'Performance', icon: TrendingUp },
          { id: 'alerts', label: 'Alertes', icon: Bell },
          { id: 'logs', label: 'Logs', icon: Eye }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Vue d'ensemble */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Métriques système */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {systemMetrics.map((metric, index) => {
              const TrendIcon = getTrendIcon(metric.trend);
              return (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${
                        metric.name === 'CPU' ? 'bg-blue-100' :
                        metric.name === 'Mémoire' ? 'bg-green-100' :
                        metric.name === 'Disque' ? 'bg-purple-100' : 'bg-orange-100'
                      }`}>
                        {metric.name === 'CPU' && <Cpu className="h-5 w-5 text-blue-600" />}
                        {metric.name === 'Mémoire' && <MemoryStick className="h-5 w-5 text-green-600" />}
                        {metric.name === 'Disque' && <HardDrive className="h-5 w-5 text-purple-600" />}
                        {metric.name === 'Réseau' && <Wifi className="h-5 w-5 text-orange-600" />}
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium text-gray-900">{metric.name}</h3>
                        <p className="text-sm text-gray-500">Utilisation</p>
                      </div>
                    </div>
                    <TrendIcon className={`h-4 w-4 ${
                      metric.trend === 'up' ? 'text-red-500' :
                      metric.trend === 'down' ? 'text-green-500' : 'text-gray-500'
                    }`} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-gray-900">
                        {metric.value.toFixed(1)}{metric.unit}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                        {metric.status === 'good' ? 'Normal' :
                         metric.status === 'warning' ? 'Attention' : 'Critique'}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          metric.status === 'good' ? 'bg-green-500' :
                          metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(100, metric.value)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* État des services */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">État des Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.slice(0, 6).map((service, index) => {
                const StatusIcon = getStatusIcon(service.status);
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <StatusIcon className={`h-5 w-5 mr-2 ${
                          service.status === 'online' ? 'text-green-500' :
                          service.status === 'maintenance' ? 'text-blue-500' : 'text-red-500'
                        }`} />
                        <span className="font-medium text-gray-900">{service.name}</span>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                        {service.status === 'online' ? 'En ligne' :
                         service.status === 'maintenance' ? 'Maintenance' : 'Hors ligne'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Uptime:</span>
                        <span className="font-medium">{service.uptime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dernière vérif:</span>
                        <span className="font-medium">{service.lastCheck}</span>
                      </div>
                      {service.responseTime > 0 && (
                        <div className="flex justify-between">
                          <span>Temps de réponse:</span>
                          <span className="font-medium">{service.responseTime}ms</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Services détaillés */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Services Système</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uptime</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Temps de réponse</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dernière vérification</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {services.map((service, index) => {
                    const StatusIcon = getStatusIcon(service.status);
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <StatusIcon className={`h-5 w-5 mr-3 ${
                              service.status === 'online' ? 'text-green-500' :
                              service.status === 'maintenance' ? 'text-blue-500' : 'text-red-500'
                            }`} />
                            <span className="font-medium text-gray-900">{service.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                            {service.status === 'online' ? 'En ligne' :
                             service.status === 'maintenance' ? 'Maintenance' : 'Hors ligne'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {service.uptime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {service.responseTime > 0 ? `${service.responseTime}ms` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {service.lastCheck}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <RefreshCw className="h-4 w-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <Settings className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Alertes */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Alertes Récentes</h3>
              <div className="flex space-x-2">
                <button className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Marquer tout comme lu
                </button>
                <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Configurer alertes
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {alerts.map((alert) => {
                const AlertIcon = getStatusIcon(alert.type);
                return (
                  <div key={alert.id} className={`border-l-4 p-4 rounded-lg ${
                    alert.type === 'warning' ? 'border-yellow-400 bg-yellow-50' :
                    alert.type === 'success' ? 'border-green-400 bg-green-50' :
                    alert.type === 'info' ? 'border-blue-400 bg-blue-50' : 'border-red-400 bg-red-50'
                  }`}>
                    <div className="flex items-start">
                      <AlertIcon className={`h-5 w-5 mt-0.5 mr-3 ${
                        alert.type === 'warning' ? 'text-yellow-600' :
                        alert.type === 'success' ? 'text-green-600' :
                        alert.type === 'info' ? 'text-blue-600' : 'text-red-600'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className={`font-medium ${
                            alert.type === 'warning' ? 'text-yellow-800' :
                            alert.type === 'success' ? 'text-green-800' :
                            alert.type === 'info' ? 'text-blue-800' : 'text-red-800'
                          }`}>
                            {alert.message}
                          </p>
                          <span className="text-sm text-gray-500">{alert.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Service: {alert.service}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Logs */}
      {activeTab === 'logs' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Logs Système</h3>
              <div className="flex space-x-2">
                <select className="px-3 py-2 border border-gray-300 rounded-lg">
                  <option>Tous les niveaux</option>
                  <option>Erreurs</option>
                  <option>Avertissements</option>
                  <option>Informations</option>
                </select>
                <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400 h-96 overflow-y-auto">
              <div className="space-y-1">
                <div>[2024-12-15 14:35:22] INFO: Système démarré avec succès</div>
                <div>[2024-12-15 14:35:23] INFO: Connexion à la base de données établie</div>
                <div>[2024-12-15 14:35:24] INFO: Services de communication initialisés</div>
                <div>[2024-12-15 14:30:15] WARN: Utilisation mémoire élevée détectée (68%)</div>
                <div>[2024-12-15 14:25:10] INFO: Sauvegarde automatique terminée</div>
                <div>[2024-12-15 14:20:05] INFO: 156 relances automatiques programmées</div>
                <div>[2024-12-15 14:15:00] INFO: Maintenance du service SMS démarrée</div>
                <div>[2024-12-15 14:10:30] INFO: Connexion utilisateur: admin@crm.com</div>
                <div>[2024-12-15 14:05:45] INFO: Rapport mensuel généré avec succès</div>
                <div>[2024-12-15 14:00:00] INFO: Tâche de nettoyage des logs exécutée</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemMonitoring;