import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  Filter,
  TrendingUp,
  Users,
  DollarSign,
  FileText,
  Clock,
  Target,
  Activity,
  PieChart,
  LineChart,
  Mail,
  Phone,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Eye,
  RefreshCw,
  Settings,
  Share2
} from 'lucide-react';

interface ReportData {
  id: string;
  name: string;
  type: 'performance' | 'financial' | 'activity' | 'communication';
  period: string;
  generatedAt: string;
  status: 'ready' | 'generating' | 'error';
}

const ReportsAnalytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [reports] = useState<ReportData[]>([
    {
      id: '1',
      name: 'Rapport Mensuel Décembre 2024',
      type: 'performance',
      period: 'Décembre 2024',
      generatedAt: '2024-12-15 14:30',
      status: 'ready'
    },
    {
      id: '2',
      name: 'Analyse Financière Q4',
      type: 'financial',
      period: 'Q4 2024',
      generatedAt: '2024-12-14 09:15',
      status: 'ready'
    },
    {
      id: '3',
      name: 'Activité Hebdomadaire',
      type: 'activity',
      period: 'Semaine 50',
      generatedAt: '2024-12-13 16:45',
      status: 'generating'
    }
  ]);

  const performanceMetrics = {
    totalRecovered: 2547893.45,
    recoveryRate: 78.5,
    averageDso: 45,
    activeFiles: 1247,
    newFiles: 156,
    closedFiles: 89,
    criticalFiles: 23,
    monthlyGrowth: 12.5
  };

  const managerPerformance = [
    { name: 'Marie Dubois', recovered: 456789, rate: 87, files: 234 },
    { name: 'Pierre Martin', recovered: 398765, rate: 76, files: 198 },
    { name: 'Sophie Leroy', recovered: 512345, rate: 92, files: 267 },
    { name: 'Jean Robert', recovered: 334567, rate: 68, files: 189 }
  ];

  const communicationStats = {
    emails: { sent: 1247, delivered: 1198, opened: 856, clicked: 234 },
    sms: { sent: 892, delivered: 876, read: 654 },
    calls: { attempted: 456, connected: 389, successful: 267 },
    letters: { sent: 123, delivered: 118 }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const generateReport = async (reportType: string) => {
    setIsGenerating(true);
    // Simulation de génération de rapport
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsGenerating(false);
  };

  const exportReport = (format: 'pdf' | 'excel') => {
    // Simulation d'export
    console.log(`Exporting report as ${format}`);
  };

  const TabButton: React.FC<{ id: string; label: string; icon: React.ComponentType<any> }> = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
        activeTab === id 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </button>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rapports et Analyses</h1>
          <p className="text-gray-600">Tableaux de bord et rapports détaillés</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => generateReport('custom')}
            disabled={isGenerating}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <BarChart3 className="h-4 w-4 mr-2" />
            )}
            {isGenerating ? 'Génération...' : 'Nouveau Rapport'}
          </button>
        </div>
      </div>

      {/* Onglets de navigation */}
      <div className="flex space-x-2 bg-gray-50 p-2 rounded-lg">
        <TabButton id="dashboard" label="Tableau de Bord" icon={BarChart3} />
        <TabButton id="performance" label="Performance" icon={TrendingUp} />
        <TabButton id="financial" label="Financier" icon={DollarSign} />
        <TabButton id="communication" label="Communication" icon={MessageSquare} />
        <TabButton id="reports" label="Rapports" icon={FileText} />
      </div>

      {/* Contenu selon l'onglet actif */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Métriques principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Recouvré</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(performanceMetrics.totalRecovered)}</p>
                  <p className="text-sm text-green-600">+{performanceMetrics.monthlyGrowth}% ce mois</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Taux de Recouvrement</p>
                  <p className="text-2xl font-bold text-gray-900">{performanceMetrics.recoveryRate}%</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${performanceMetrics.recoveryRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Dossiers Actifs</p>
                  <p className="text-2xl font-bold text-gray-900">{performanceMetrics.activeFiles}</p>
                  <p className="text-sm text-blue-600">+{performanceMetrics.newFiles} nouveaux</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">DSO Moyen</p>
                  <p className="text-2xl font-bold text-gray-900">{performanceMetrics.averageDso} jours</p>
                  <p className="text-sm text-orange-600">-2.4% vs mois dernier</p>
                </div>
              </div>
            </div>
          </div>

          {/* Graphiques de synthèse */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution Mensuelle</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <LineChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Graphique d'évolution</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Statut</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Graphique en secteurs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Performance par Gestionnaire</h3>
              <div className="flex space-x-2">
                <select className="px-3 py-2 border border-gray-300 rounded-lg">
                  <option>Ce mois</option>
                  <option>Mois dernier</option>
                  <option>Trimestre</option>
                </select>
                <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Gestionnaire</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Montant Recouvré</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Taux de Réussite</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Dossiers</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {managerPerformance.map((manager, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {manager.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-gray-900">{manager.name}</p>
                            <p className="text-sm text-gray-500">Gestionnaire</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-medium text-gray-900">
                        {formatCurrency(manager.recovered)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end">
                          <span className={`font-medium ${
                            manager.rate >= 80 ? 'text-green-600' : 
                            manager.rate >= 70 ? 'text-orange-600' : 'text-red-600'
                          }`}>
                            {manager.rate}%
                          </span>
                          <div className="w-16 bg-gray-200 rounded-full h-2 ml-2">
                            <div 
                              className={`h-2 rounded-full ${
                                manager.rate >= 80 ? 'bg-green-600' : 
                                manager.rate >= 70 ? 'bg-orange-600' : 'bg-red-600'
                              }`}
                              style={{ width: `${manager.rate}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right text-gray-900">{manager.files}</td>
                      <td className="py-4 px-4 text-right">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'communication' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Mail className="h-8 w-8 text-blue-600" />
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">Emails</h3>
                    <p className="text-sm text-gray-500">Ce mois</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Envoyés</span>
                  <span className="font-medium">{communicationStats.emails.sent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Délivrés</span>
                  <span className="font-medium text-green-600">{communicationStats.emails.delivered}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Ouverts</span>
                  <span className="font-medium text-blue-600">{communicationStats.emails.opened}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cliqués</span>
                  <span className="font-medium text-purple-600">{communicationStats.emails.clicked}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <MessageSquare className="h-8 w-8 text-green-600" />
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">SMS</h3>
                    <p className="text-sm text-gray-500">Ce mois</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Envoyés</span>
                  <span className="font-medium">{communicationStats.sms.sent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Délivrés</span>
                  <span className="font-medium text-green-600">{communicationStats.sms.delivered}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Lus</span>
                  <span className="font-medium text-blue-600">{communicationStats.sms.read}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Phone className="h-8 w-8 text-purple-600" />
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">Appels</h3>
                    <p className="text-sm text-gray-500">Ce mois</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tentatives</span>
                  <span className="font-medium">{communicationStats.calls.attempted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Connectés</span>
                  <span className="font-medium text-green-600">{communicationStats.calls.connected}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Réussis</span>
                  <span className="font-medium text-blue-600">{communicationStats.calls.successful}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-orange-600" />
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">Courriers</h3>
                    <p className="text-sm text-gray-500">Ce mois</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Envoyés</span>
                  <span className="font-medium">{communicationStats.letters.sent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Délivrés</span>
                  <span className="font-medium text-green-600">{communicationStats.letters.delivered}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Rapports Générés</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => generateReport('monthly')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Rapport Mensuel
                </button>
                <button
                  onClick={() => generateReport('custom')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Rapport Personnalisé
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${
                        report.type === 'performance' ? 'bg-blue-100' :
                        report.type === 'financial' ? 'bg-green-100' :
                        report.type === 'activity' ? 'bg-purple-100' : 'bg-orange-100'
                      }`}>
                        <FileText className={`h-5 w-5 ${
                          report.type === 'performance' ? 'text-blue-600' :
                          report.type === 'financial' ? 'text-green-600' :
                          report.type === 'activity' ? 'text-purple-600' : 'text-orange-600'
                        }`} />
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium text-gray-900">{report.name}</h4>
                        <p className="text-sm text-gray-500">
                          Période: {report.period} • Généré le {report.generatedAt}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        report.status === 'ready' ? 'bg-green-100 text-green-800' :
                        report.status === 'generating' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {report.status === 'ready' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {report.status === 'generating' && <RefreshCw className="h-3 w-3 mr-1 animate-spin" />}
                        {report.status === 'error' && <AlertCircle className="h-3 w-3 mr-1" />}
                        {report.status === 'ready' ? 'Prêt' : 
                         report.status === 'generating' ? 'En cours' : 'Erreur'}
                      </span>
                      
                      {report.status === 'ready' && (
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => exportReport('pdf')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Télécharger PDF"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => exportReport('excel')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Télécharger Excel"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Share2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsAnalytics;