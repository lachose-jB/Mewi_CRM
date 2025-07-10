import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  FileText, 
  User, 
  MessageSquare, 
  Target, 
  Activity, 
  Eye, 
  Edit3, 
  Download, 
  Printer, 
  Share2, 
  Settings, 
  RefreshCw, 
  CheckCircle, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Plus, 
  Zap, 
  TrendingUp, 
  TrendingDown 
} from 'lucide-react';
import { useCrm } from '../../contexts/CrmContext';
import { useAuth } from '../../contexts/AuthContext';

interface CriticalDossier {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  amount: number;
  daysOverdue: number;
  status: 'orange' | 'critical';
  priority: 'high' | 'urgent';
  lastContact: string;
  nextAction?: {
    type: string;
    date: string;
    description: string;
  };
  riskLevel: 'medium' | 'high' | 'extreme';
  managerId: string;
  managerName: string;
  notes: string[];
  invoices: {
    id: string;
    number: string;
    amount: number;
    dueDate: string;
    daysOverdue: number;
  }[];
}

const CriticalDossiers: React.FC = () => {
  const { clients, invoices, refreshData } = useCrm();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('daysOverdue');
  const [isLoading, setIsLoading] = useState(false);
  const [criticalDossiers, setCriticalDossiers] = useState<CriticalDossier[]>([]);
  const [selectedDossier, setSelectedDossier] = useState<string | null>(null);

  // Load critical dossiers
  useEffect(() => {
    const loadCriticalDossiers = async () => {
      try {
        setIsLoading(true);
        
        // Filter clients by manager and critical/orange status
        const managerClients = clients.filter(client => 
          client.manager_id === user?.id && 
          (client.status === 'critical' || client.status === 'orange')
        );
        
        // Convert to critical dossiers format with additional data
        const dossiers: CriticalDossier[] = managerClients.map(client => {
          // Get client invoices
          const clientInvoices = invoices.filter(inv => inv.client_id === client.id);
          
          // Calculate days overdue (max from invoices)
          const maxDaysOverdue = clientInvoices.reduce((max, inv) => {
            const dueDate = new Date(inv.due_date);
            const today = new Date();
            const diffTime = today.getTime() - dueDate.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays > max ? diffDays : max;
          }, 0);
          
          // Determine risk level based on days overdue and amount
          let riskLevel: 'medium' | 'high' | 'extreme' = 'medium';
          if (maxDaysOverdue > 60 || client.total_amount > 10000) {
            riskLevel = 'extreme';
          } else if (maxDaysOverdue > 30 || client.total_amount > 5000) {
            riskLevel = 'high';
          }
          
          return {
            id: client.id,
            clientName: client.name,
            email: client.email,
            phone: client.phone || '',
            amount: client.total_amount,
            daysOverdue: maxDaysOverdue,
            status: client.status as 'orange' | 'critical',
            priority: client.status === 'critical' ? 'urgent' : 'high',
            lastContact: client.last_contact || new Date().toISOString(),
            riskLevel,
            managerId: client.manager_id || '',
            managerName: 'Marie Dubois', // Mock data
            notes: client.notes || [],
            nextAction: {
              type: 'Appel',
              date: new Date().toISOString(),
              description: 'Relance urgente pour règlement'
            },
            invoices: clientInvoices.map(inv => ({
              id: inv.id,
              number: inv.invoice_number,
              amount: inv.amount,
              dueDate: inv.due_date,
              daysOverdue: Math.max(0, Math.ceil((new Date().getTime() - new Date(inv.due_date).getTime()) / (1000 * 60 * 60 * 24)))
            }))
          };
        });
        
        setCriticalDossiers(dossiers);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading critical dossiers:', error);
        setIsLoading(false);
      }
    };
    
    loadCriticalDossiers();
  }, [clients, invoices, user?.id]);

  const handleRefresh = async () => {
    setIsLoading(true);
    await refreshData();
    setIsLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'orange': return { label: 'Règle 2 dépassé', color: 'bg-orange-100 text-orange-800', icon: AlertTriangle };
      case 'critical': return { label: 'Règle 3 Critique', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
      default: return { label: status, color: 'bg-gray-100 text-gray-800', icon: AlertTriangle };
    }
  };

  const getRiskConfig = (risk: string) => {
    switch (risk) {
      case 'medium': return { label: 'Moyen', color: 'bg-yellow-100 text-yellow-800' };
      case 'high': return { label: 'Élevé', color: 'bg-orange-100 text-orange-800' };
      case 'extreme': return { label: 'Extrême', color: 'bg-red-100 text-red-800' };
      default: return { label: risk, color: 'bg-gray-100 text-gray-800' };
    }
  };

  // Filter and sort dossiers
  const filteredDossiers = criticalDossiers.filter(dossier => {
    const matchesSearch = dossier.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dossier.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || dossier.status === statusFilter;
    const matchesRisk = riskFilter === 'all' || dossier.riskLevel === riskFilter;
    return matchesSearch && matchesStatus && matchesRisk;
  });

  const sortedDossiers = [...filteredDossiers].sort((a, b) => {
    switch (sortBy) {
      case 'daysOverdue':
        return b.daysOverdue - a.daysOverdue;
      case 'amount':
        return b.amount - a.amount;
      case 'clientName':
        return a.clientName.localeCompare(b.clientName);
      case 'riskLevel':
        const riskOrder = { extreme: 3, high: 2, medium: 1 };
        return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
      default:
        return 0;
    }
  });

  // Calculate totals
  const totalAmount = criticalDossiers.reduce((sum, dossier) => sum + dossier.amount, 0);
  const totalInvoices = criticalDossiers.reduce((sum, dossier) => sum + dossier.invoices.length, 0);
  const avgDaysOverdue = criticalDossiers.length > 0 
    ? criticalDossiers.reduce((sum, dossier) => sum + dossier.daysOverdue, 0) / criticalDossiers.length 
    : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dossiers Critiques</h1>
          <p className="text-gray-600">Gestion prioritaire des dossiers à risque élevé</p>
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
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Dossiers Critiques</p>
              <p className="text-2xl font-bold text-gray-900">{criticalDossiers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Montant Total</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Factures Concernées</p>
              <p className="text-2xl font-bold text-gray-900">{totalInvoices}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Retard Moyen</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(avgDaysOverdue)} jours</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un dossier..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="critical">Règle 3 dépassé Critique</option>
              <option value="orange">Règle 2 dépassé</option>
            </select>
            
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
            >
              <option value="all">Tous les risques</option>
              <option value="extreme">Risque extrême</option>
              <option value="high">Risque élevé</option>
              <option value="medium">Risque moyen</option>
            </select>
            
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="daysOverdue">Trier par retard</option>
              <option value="amount">Trier par montant</option>
              <option value="clientName">Trier par nom</option>
              <option value="riskLevel">Trier par risque</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des dossiers critiques */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <RefreshCw className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-2" />
            <p className="text-gray-600">Chargement des dossiers critiques...</p>
          </div>
        ) : sortedDossiers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">Aucun dossier critique trouvé</p>
          </div>
        ) : (
          sortedDossiers.map(dossier => {
            const statusConfig = getStatusConfig(dossier.status);
            const riskConfig = getRiskConfig(dossier.riskLevel);
            const StatusIcon = statusConfig.icon;
            
            return (
              <div key={dossier.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${
                        dossier.status === 'critical' ? 'bg-red-100' : 'bg-orange-100'
                      }`}>
                        <StatusIcon className={`h-6 w-6 ${
                          dossier.status === 'critical' ? 'text-red-600' : 'text-orange-600'
                        }`} />
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-3">
                          <h4 className="text-lg font-medium text-gray-900">{dossier.clientName}</h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${riskConfig.color}`}>
                            Risque {riskConfig.label}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {dossier.email}
                          </span>
                          <span className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {dossier.phone}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {dossier.daysOverdue} jours de retard
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{formatCurrency(dossier.amount)}</div>
                      <div className="text-sm text-gray-500">
                        {dossier.invoices.length} facture(s) en retard
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Target className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Prochaine action: {dossier.nextAction?.type}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(dossier.nextAction?.date || '').toLocaleDateString('fr-FR')} - {dossier.nextAction?.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Phone className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Mail className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => setSelectedDossier(selectedDossier === dossier.id ? null : dossier.id)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        {selectedDossier === dossier.id ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                
                {selectedDossier === dossier.id && (
                  <div className="bg-gray-50 p-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-3">Factures en retard</h5>
                        <div className="space-y-2">
                          {dossier.invoices.map(invoice => (
                            <div key={invoice.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{invoice.number}</p>
                                <p className="text-xs text-gray-500">
                                  Échéance: {new Date(invoice.dueDate).toLocaleDateString('fr-FR')}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{formatCurrency(invoice.amount)}</p>
                                <p className="text-xs text-red-600">{invoice.daysOverdue} jours de retard</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-3">Notes et historique</h5>
                        <div className="space-y-2">
                          {dossier.notes.length > 0 ? (
                            dossier.notes.map((note, index) => (
                              <div key={index} className="p-3 bg-white border border-gray-200 rounded-lg">
                                <p className="text-sm text-gray-600">{note}</p>
                              </div>
                            ))
                          ) : (
                            <div className="p-3 bg-white border border-gray-200 rounded-lg">
                              <p className="text-sm text-gray-500">Aucune note disponible</p>
                            </div>
                          )}
                          
                          <div className="p-3 bg-white border border-gray-200 rounded-lg">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Dernier contact:</span> {new Date(dossier.lastContact).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex space-x-2">
                          <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                            <Plus className="h-4 w-4 mr-1" />
                            Ajouter une note
                          </button>
                          <button className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                            <Zap className="h-4 w-4 mr-1" />
                            Plan d'action
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Plan d'action */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan d'Action Recommandé</h3>
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900">Actions Urgentes</h4>
                <ul className="mt-2 space-y-2 text-sm text-red-700">
                  <li className="flex items-center">
                    <ArrowRight className="h-3 w-3 mr-2 flex-shrink-0" />
                    Appeler les 3 clients avec plus de 45 jours de retard
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="h-3 w-3 mr-2 flex-shrink-0" />
                    Envoyer une mise en demeure pour les factures de plus de 60 jours
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="h-3 w-3 mr-2 flex-shrink-0" />
                    Escalader les dossiers à risque extrême au service juridique
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-orange-600 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-orange-900">Actions Prioritaires</h4>
                <ul className="mt-2 space-y-2 text-sm text-orange-700">
                  <li className="flex items-center">
                    <ArrowRight className="h-3 w-3 mr-2 flex-shrink-0" />
                    Proposer des échéanciers de paiement aux clients à risque élevé
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="h-3 w-3 mr-2 flex-shrink-0" />
                    Envoyer des relances par email pour les factures de 30-45 jours
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="h-3 w-3 mr-2 flex-shrink-0" />
                    Vérifier les coordonnées bancaires des clients pour faciliter les paiements
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <Target className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Objectifs</h4>
                <ul className="mt-2 space-y-2 text-sm text-blue-700">
                  <li className="flex items-center">
                    <ArrowRight className="h-3 w-3 mr-2 flex-shrink-0" />
                    Réduire le montant total des dossiers critiques de 30% d'ici 30 jours
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="h-3 w-3 mr-2 flex-shrink-0" />
                    Obtenir au moins 5 promesses de paiement cette semaine
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="h-3 w-3 mr-2 flex-shrink-0" />
                    Résoudre complètement 3 dossiers critiques d'ici la fin du mois
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CriticalDossiers;