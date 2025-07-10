import React, { useState, useEffect } from 'react';
import { 
  ArrowRight,
  BarChart3, 
  Calendar, 
  CheckCircle, 
  Clock, 
  CreditCard, 
  Download, 
  Eye, 
  FileText, 
  Mail, 
  MessageSquare, 
  Phone, 
  Plus, 
  RefreshCw, 
  Search, 
  Target, 
  TrendingUp, 
  Users
} from 'lucide-react';
import { useCrm } from '../../contexts/CrmContext';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { formatCurrency, getRecoveryStatusConfig, getDebtorStatusConfig } from '../../utils/dataUtils';
import { Debtor, Task } from '../../types';

const ManagerDashboard: React.FC = () => {
  const { debtors, clients, tasks, refreshData } = useCrm();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [managerDebtors, setManagerDebtors] = useState<Debtor[]>([]);
  const [managerTasks, setManagerTasks] = useState<Task[]>([]);

  // Get debtors and tasks assigned to this manager
  useEffect(() => {
    if (user && user.role === 'manager') {
      const assignedDebtors = debtors.filter(debtor => debtor.managerId === user.id);
      setManagerDebtors(assignedDebtors);
      
      const assignedTasks = tasks.filter(task => task.assignedTo === user.id);
      setManagerTasks(assignedTasks);
    }
  }, [user, debtors, tasks]);

  // Handle refresh
  const handleRefresh = async () => {
    setIsLoading(true);
    await refreshData();
    setIsLoading(false);
  };

  // Calculate stats
  const totalAmount = managerDebtors.reduce((sum, debtor) => sum + debtor.totalAmount, 0);
  const totalCollected = managerDebtors.reduce((sum, debtor) => sum + debtor.paidAmount, 0);
  const recoveryRate = totalAmount > 0 ? (totalCollected / totalAmount) * 100 : 0;
  
  const criticalDebtors = managerDebtors.filter(d => d.recoveryStatus === 'critical');
  const overdueDebtors = managerDebtors.filter(d => d.daysOverdue > 0);
  const todayTasks = managerTasks.filter(t => {
    const today = new Date().toISOString().split('T')[0];
    return t.dueDate === today && t.status === 'pending';
  });

  // Group tasks by date
  const groupedTasks = managerTasks
    .filter(task => task.status === 'pending')
    .reduce((acc: Record<string, Task[]>, task) => {
      if (!acc[task.dueDate]) {
        acc[task.dueDate] = [];
      }
      acc[task.dueDate].push(task);
      return acc;
    }, {});

  // Sort dates
  const sortedDates = Object.keys(groupedTasks).sort();

  // Format date for display
  const formatDateLabel = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (dateString === today.toISOString().split('T')[0]) {
      return "Aujourd'hui";
    } else if (dateString === tomorrow.toISOString().split('T')[0]) {
      return "Demain";
    } else {
      return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tableau de bord
          </h1>
          <p className="text-gray-600">Bienvenue, {user?.name}</p>
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

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Débiteurs assignés</p>
              <p className="text-2xl font-bold text-gray-900">{managerDebtors.length}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg h-min">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-2 text-sm">
            <Target className="h-4 w-4 mr-1 text-blue-500" />
            <span className="text-gray-600">
              {managerDebtors.filter(d => d.status === 'recovered').length} dossiers terminés
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Montant total</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg h-min">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-2 text-sm">
            <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
            <span className="text-gray-600">
              {formatCurrency(totalCollected)} recouvrés
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Taux de recouvrement</p>
              <p className="text-2xl font-bold text-gray-900">{recoveryRate.toFixed(1)}%</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-lg h-min">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full" 
                style={{ width: `${recoveryRate}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Dossiers critiques</p>
              <p className="text-2xl font-bold text-red-600">{criticalDebtors.length}</p>
            </div>
            <div className="bg-red-100 p-2 rounded-lg h-min">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="flex items-center mt-2 text-sm">
            <Clock className="h-4 w-4 mr-1 text-red-500" />
            <span className="text-gray-600">
              {overdueDebtors.length} dossiers en retard
            </span>
          </div>
        </div>
      </div>

      {/* Tasks for today */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Tâches du jour ({todayTasks.length})</h2>
          <Link 
            to="/manager/calendar"
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Voir le calendrier
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        {todayTasks.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune tâche aujourd'hui</h3>
            <p className="text-gray-500">Vous n'avez aucune tâche planifiée pour aujourd'hui</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg mr-3 ${
                    task.type === 'call' ? 'bg-purple-100' :
                    task.type === 'email' ? 'bg-blue-100' :
                    task.type === 'sms' ? 'bg-green-100' :
                    task.type === 'meeting' ? 'bg-indigo-100' :
                    'bg-gray-100'
                  }`}>
                    {task.type === 'call' && <Phone className="h-5 w-5 text-purple-600" />}
                    {task.type === 'email' && <Mail className="h-5 w-5 text-blue-600" />}
                    {task.type === 'sms' && <MessageSquare className="h-5 w-5 text-green-600" />}
                    {task.type === 'meeting' && <Users className="h-5 w-5 text-indigo-600" />}
                    {!['call', 'email', 'sms', 'meeting'].includes(task.type) && 
                     <FileText className="h-5 w-5 text-gray-600" />}
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{task.dueTime}</span>
                      <span className="mx-1">•</span>
                      <span>{task.debtorName}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                    task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    task.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority === 'urgent' ? 'Urgent' :
                     task.priority === 'high' ? 'Haute' :
                     task.priority === 'medium' ? 'Moyenne' : 'Basse'}
                  </span>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <Eye className="h-5 w-5" />
                  </button>
                  <button className="p-1 text-green-600 hover:text-green-800">
                    <CheckCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Critical debtors */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Dossiers critiques ({criticalDebtors.length})</h2>
          <Link 
            to="/manager/debtors"
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Voir tous les débiteurs
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        {criticalDebtors.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun dossier critique</h3>
            <p className="text-gray-500">Tous vos dossiers sont sous contrôle</p>
          </div>
        ) : (
          <div className="space-y-4">
            {criticalDebtors
              .sort((a, b) => b.daysOverdue - a.daysOverdue)
              .slice(0, 5)
              .map(debtor => {
                const client = clients.find(c => c.id === debtor.clientId);
                const recoveryStatusConfig = getRecoveryStatusConfig(debtor.recoveryStatus);
                
                return (
                  <div key={debtor.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <div className="bg-red-100 p-2 rounded-lg mr-3">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      </div>
                      
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium text-gray-900">{debtor.name}</h4>
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${recoveryStatusConfig.color}`}>
                            {recoveryStatusConfig.label}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500">
                          <span>Client: {client?.company || 'N/A'}</span>
                          <span className="mx-1">•</span>
                          <span className="text-red-600 font-medium">{debtor.daysOverdue} jours de retard</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{formatCurrency(debtor.totalAmount)}</p>
                        {debtor.paidAmount > 0 && (
                          <p className="text-xs text-green-600">{formatCurrency(debtor.paidAmount)} payés</p>
                        )}
                      </div>
                      
                      <div className="flex space-x-1">
                        <button className="p-1 text-blue-600 hover:text-blue-800">
                          <Phone className="h-5 w-5" />
                        </button>
                        <button className="p-1 text-green-600 hover:text-green-800">
                          <Mail className="h-5 w-5" />
                        </button>
                        <button className="p-1 text-gray-600 hover:text-gray-800">
                          <Eye className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Upcoming tasks */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Tâches à venir</h2>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle tâche
          </button>
        </div>
        
        {Object.keys(groupedTasks).length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune tâche planifiée</h3>
            <p className="text-gray-500">Vous n'avez aucune tâche à venir</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedDates.slice(0, 3).map(date => (
              <div key={date}>
                <h3 className="text-sm font-medium text-gray-700 mb-3">{formatDateLabel(date)}</h3>
                <div className="space-y-2">
                  {groupedTasks[date].map(task => (
                    <div key={task.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg mr-3 ${
                          task.type === 'call' ? 'bg-purple-100' :
                          task.type === 'email' ? 'bg-blue-100' :
                          task.type === 'sms' ? 'bg-green-100' :
                          task.type === 'meeting' ? 'bg-indigo-100' :
                          'bg-gray-100'
                        }`}>
                          {task.type === 'call' && <Phone className="h-4 w-4 text-purple-600" />}
                          {task.type === 'email' && <Mail className="h-4 w-4 text-blue-600" />}
                          {task.type === 'sms' && <MessageSquare className="h-4 w-4 text-green-600" />}
                          {task.type === 'meeting' && <Users className="h-4 w-4 text-indigo-600" />}
                          {!['call', 'email', 'sms', 'meeting'].includes(task.type) && 
                           <FileText className="h-4 w-4 text-gray-600" />}
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                          <div className="flex items-center text-xs text-gray-500">
                            <span>{task.dueTime}</span>
                            <span className="mx-1">•</span>
                            <span>{task.debtorName}</span>
                          </div>
                        </div>
                      </div>
                      
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        task.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority === 'urgent' ? 'Urgent' :
                         task.priority === 'high' ? 'Haute' :
                         task.priority === 'medium' ? 'Moyenne' : 'Basse'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button 
          onClick={() => navigate('/manager/debtors')}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Débiteurs</h3>
              <p className="text-sm text-gray-500">Gérer tous les débiteurs</p>
            </div>
          </div>
        </button>
        
        <button 
          onClick={() => navigate('/manager/communications')}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Communications</h3>
              <p className="text-sm text-gray-500">Gérer les communications</p>
            </div>
          </div>
        </button>
        
        <button 
          onClick={() => navigate('/manager/calendar')}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg mr-4">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Calendrier</h3>
              <p className="text-sm text-gray-500">Planifier vos actions</p>
            </div>
          </div>
        </button>
        
        <button className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-lg mr-4">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Rapports</h3>
              <p className="text-sm text-gray-500">Analyser les performances</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ManagerDashboard;