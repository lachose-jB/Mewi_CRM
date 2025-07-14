import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  CheckCircle, 
  AlertTriangle, 
  Phone, 
  Mail, 
  MessageSquare, 
  FileText, 
  User, 
  Filter, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  X, 
  Save, 
  Target, 
  ArrowRight, 
  ArrowLeft,
  RefreshCw,
  Download,
  Printer,
  Share2
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'completed' | 'overdue' | 'cancelled';
  type: 'call' | 'email' | 'sms' | 'meeting' | 'follow_up' | 'other';
  clientId: string;
  clientName: string;
  assignedTo: string;
  createdAt: string;
  completedAt?: string;
  notes?: string;
  outcome?: string;
}

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Appeler Jean Martin',
      description: 'Relance pour la facture #FAC-2024-001 en retard de 15 jours',
      dueDate: '2024-12-16',
      dueTime: '09:00',
      priority: 'urgent',
      status: 'pending',
      type: 'call',
      clientId: '1',
      clientName: 'Jean Martin',
      assignedTo: 'current_user',
      createdAt: '2024-12-15T08:00:00Z'
    },
    {
      id: '2',
      title: 'Envoyer email de relance',
      description: 'Seconde relance pour la facture #FAC-2024-002',
      dueDate: '2024-12-16',
      dueTime: '10:30',
      priority: 'high',
      status: 'pending',
      type: 'email',
      clientId: '2',
      clientName: 'Sophie Leroy',
      assignedTo: 'current_user',
      createdAt: '2024-12-15T08:15:00Z'
    },
    {
      id: '3',
      title: 'Vérifier paiement reçu',
      description: 'Confirmer le paiement de 2500€ pour la facture #FAC-2024-003',
      dueDate: '2024-12-16',
      dueTime: '14:00',
      priority: 'medium',
      status: 'pending',
      type: 'follow_up',
      clientId: '3',
      clientName: 'Pierre Dubois',
      assignedTo: 'current_user',
      createdAt: '2024-12-15T09:00:00Z'
    },
    {
      id: '4',
      title: 'Rendez-vous client',
      description: 'Discussion sur l\'échéancier de paiement',
      dueDate: '2024-12-17',
      dueTime: '11:00',
      priority: 'high',
      status: 'pending',
      type: 'meeting',
      clientId: '1',
      clientName: 'Jean Martin',
      assignedTo: 'current_user',
      createdAt: '2024-12-15T10:30:00Z'
    },
    {
      id: '5',
      title: 'Envoyer SMS de rappel',
      description: 'Rappel de l\'échéance de demain',
      dueDate: '2024-12-17',
      dueTime: '09:00',
      priority: 'medium',
      status: 'pending',
      type: 'sms',
      clientId: '2',
      clientName: 'Sophie Leroy',
      assignedTo: 'current_user',
      createdAt: '2024-12-15T11:00:00Z'
    },
    {
      id: '6',
      title: 'Préparer dossier contentieux',
      description: 'Rassembler les documents pour le service juridique',
      dueDate: '2024-12-18',
      dueTime: '16:00',
      priority: 'high',
      status: 'pending',
      type: 'other',
      clientId: '4',
      clientName: 'Martin SA',
      assignedTo: 'current_user',
      createdAt: '2024-12-15T14:00:00Z'
    },
    {
      id: '7',
      title: 'Appel de suivi',
      description: 'Vérifier la satisfaction client après le dernier paiement',
      dueDate: '2024-12-15',
      dueTime: '11:00',
      priority: 'low',
      status: 'completed',
      type: 'call',
      clientId: '5',
      clientName: 'Entreprise ABC',
      assignedTo: 'current_user',
      createdAt: '2024-12-14T09:00:00Z',
      completedAt: '2024-12-15T11:15:00Z',
      outcome: 'Client satisfait, prochain paiement prévu le 30/12'
    },
    {
      id: '8',
      title: 'Relance email urgente',
      description: 'Facture #FAC-2024-004 échue depuis 30 jours',
      dueDate: '2024-12-14',
      dueTime: '14:00',
      priority: 'urgent',
      status: 'overdue',
      type: 'email',
      clientId: '6',
      clientName: 'Société XYZ',
      assignedTo: 'current_user',
      createdAt: '2024-12-13T10:00:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesType = typeFilter === 'all' || task.type === typeFilter;
    
    let matchesDate = true;
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    
    if (dateFilter === 'today') {
      matchesDate = task.dueDate === today;
    } else if (dateFilter === 'tomorrow') {
      matchesDate = task.dueDate === tomorrow;
    } else if (dateFilter === 'week') {
      const weekLater = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
      matchesDate = task.dueDate >= today && task.dueDate <= weekLater;
    }
    
    return matchesSearch && matchesStatus && matchesPriority && matchesType && matchesDate;
  });

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'low': return { label: 'Basse', color: 'bg-green-100 text-green-800' };
      case 'medium': return { label: 'Moyenne', color: 'bg-blue-100 text-blue-800' };
      case 'high': return { label: 'Haute', color: 'bg-orange-100 text-orange-800' };
      case 'urgent': return { label: 'Urgente', color: 'bg-red-100 text-red-800' };
      default: return { label: priority, color: 'bg-gray-100 text-gray-800' };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending': return { label: 'À faire', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
      case 'completed': return { label: 'Terminée', color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'overdue': return { label: 'En retard', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
      case 'cancelled': return { label: 'Annulée', color: 'bg-gray-100 text-gray-800', icon: X };
      default: return { label: status, color: 'bg-gray-100 text-gray-800', icon: Clock };
    }
  };

  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'call': return { label: 'Appel', color: 'bg-purple-100 text-purple-800', icon: Phone };
      case 'email': return { label: 'Email', color: 'bg-blue-100 text-blue-800', icon: Mail };
      case 'sms': return { label: 'SMS', color: 'bg-green-100 text-green-800', icon: MessageSquare };
      case 'meeting': return { label: 'Rendez-vous', color: 'bg-indigo-100 text-indigo-800', icon: User };
      case 'follow_up': return { label: 'Suivi', color: 'bg-orange-100 text-orange-800', icon: Target };
      case 'other': return { label: 'Autre', color: 'bg-gray-100 text-gray-800', icon: FileText };
      default: return { label: type, color: 'bg-gray-100 text-gray-800', icon: FileText };
    }
  };

  const handleCreateTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: '',
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '09:00',
      priority: 'medium',
      status: 'pending',
      type: 'call',
      clientId: '',
      clientName: '',
      assignedTo: 'current_user',
      createdAt: new Date().toISOString()
    };
    
    setSelectedTask(newTask);
    setShowTaskModal(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleSaveTask = (taskData: Task) => {
    if (taskData.id && tasks.find(t => t.id === taskData.id)) {
      // Update existing task
      setTasks(tasks.map(task => 
        task.id === taskData.id ? taskData : task
      ));
    } else {
      // Create new task
      const newTask = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      setTasks([...tasks, newTask]);
    }
    setShowTaskModal(false);
  };

  const handleCompleteTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status: 'completed', 
            completedAt: new Date().toISOString() 
          } 
        : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Group tasks by date
  const groupedTasks: Record<string, Task[]> = {};
  
  filteredTasks.forEach(task => {
    if (!groupedTasks[task.dueDate]) {
      groupedTasks[task.dueDate] = [];
    }
    groupedTasks[task.dueDate].push(task);
  });

  // Sort dates
  const sortedDates = Object.keys(groupedTasks).sort();

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
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
          <h1 className="text-2xl font-bold text-gray-900">Tâches</h1>
          <p className="text-gray-600">Gérez vos tâches et suivis de dossiers</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Actualisation...' : 'Actualiser'}
          </button>
          <button 
            onClick={handleCreateTask}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Tâche
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tâches</p>
              <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-gray-900">
                {tasks.filter(t => t.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En retard</p>
              <p className="text-2xl font-bold text-gray-900">
                {tasks.filter(t => t.status === 'overdue').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Terminées</p>
              <p className="text-2xl font-bold text-gray-900">
                {tasks.filter(t => t.status === 'completed').length}
              </p>
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
              placeholder="Rechercher une tâche..."
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
              <option value="pending">À faire</option>
              <option value="completed">Terminées</option>
              <option value="overdue">En retard</option>
              <option value="cancelled">Annulées</option>
            </select>
            
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">Toutes priorités</option>
              <option value="urgent">Urgente</option>
              <option value="high">Haute</option>
              <option value="medium">Moyenne</option>
              <option value="low">Basse</option>
            </select>
            
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">Tous les types</option>
              <option value="call">Appels</option>
              <option value="email">Emails</option>
              <option value="sms">SMS</option>
              <option value="meeting">Rendez-vous</option>
              <option value="follow_up">Suivis</option>
              <option value="other">Autres</option>
            </select>
            
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">Toutes dates</option>
              <option value="today">Aujourd'hui</option>
              <option value="tomorrow">Demain</option>
              <option value="week">Cette semaine</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des tâches */}
      <div className="space-y-6">
        {sortedDates.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">Aucune tâche trouvée</p>
          </div>
        ) : (
          sortedDates.map(date => (
            <div key={date} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">
                  {formatDate(date)} <span className="text-sm text-gray-500">({groupedTasks[date].length} tâches)</span>
                </h3>
              </div>
              
              <div className="divide-y divide-gray-200">
                {groupedTasks[date].map(task => {
                  const priorityConfig = getPriorityConfig(task.priority);
                  const statusConfig = getStatusConfig(task.status);
                  const typeConfig = getTypeConfig(task.type);
                  const StatusIcon = statusConfig.icon;
                  const TypeIcon = typeConfig.icon;
                  
                  return (
                    <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-lg ${typeConfig.color.split(' ')[0]}`}>
                            <TypeIcon className={`h-5 w-5 ${typeConfig.color.split(' ')[1]}`} />
                          </div>
                          
                          <div>
                            <div className="flex items-center space-x-3">
                              <h4 className="text-lg font-medium text-gray-900">{task.title}</h4>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig.color}`}>
                                {priorityConfig.label}
                              </span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusConfig.label}
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                            
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {task.dueTime}
                              </span>
                              <span className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                {task.clientName}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {task.status === 'pending' && (
                            <button 
                              onClick={() => handleCompleteTask(task.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Marquer comme terminée"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleEditTask(task)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit3 className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      
                      {task.outcome && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-start">
                            <div className="bg-green-100 p-2 rounded-lg mr-3">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Résultat</p>
                              <p className="text-sm text-gray-600">{task.outcome}</p>
                              {task.completedAt && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Terminé le {new Date(task.completedAt).toLocaleDateString('fr-FR')} à {new Date(task.completedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de tâche */}
      {showTaskModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedTask.id ? 'Modifier la tâche' : 'Nouvelle tâche'}
              </h3>
              <button 
                onClick={() => setShowTaskModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre
                </label>
                <input
                  type="text"
                  value={selectedTask.title}
                  onChange={(e) => setSelectedTask({...selectedTask, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Titre de la tâche"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={selectedTask.description}
                  onChange={(e) => setSelectedTask({...selectedTask, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Description détaillée"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date d'échéance
                  </label>
                  <input
                    type="date"
                    value={selectedTask.dueDate}
                    onChange={(e) => setSelectedTask({...selectedTask, dueDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heure
                  </label>
                  <input
                    type="time"
                    value={selectedTask.dueTime}
                    onChange={(e) => setSelectedTask({...selectedTask, dueTime: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de tâche
                  </label>
                  <select
                    value={selectedTask.type}
                    onChange={(e) => setSelectedTask({...selectedTask, type: e.target.value as Task['type']})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="call">Appel</option>
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="meeting">Rendez-vous</option>
                    <option value="follow_up">Suivi</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priorité
                  </label>
                  <select
                    value={selectedTask.priority}
                    onChange={(e) => setSelectedTask({...selectedTask, priority: e.target.value as Task['priority']})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">Basse</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Haute</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client
                  </label>
                  <select
                    value={selectedTask.clientId}
                    onChange={(e) => {
                      const selectedOption = e.target.options[e.target.selectedIndex];
                      setSelectedTask({
                        ...selectedTask, 
                        clientId: e.target.value,
                        clientName: selectedOption.text
                      });
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionner un client</option>
                    <option value="1">Jean Martin</option>
                    <option value="2">Sophie Leroy</option>
                    <option value="3">Pierre Dubois</option>
                    <option value="4">Martin SA</option>
                    <option value="5">Entreprise ABC</option>
                    <option value="6">Société XYZ</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <select
                    value={selectedTask.status}
                    onChange={(e) => setSelectedTask({...selectedTask, status: e.target.value as Task['status']})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pending">À faire</option>
                    <option value="completed">Terminée</option>
                    <option value="overdue">En retard</option>
                    <option value="cancelled">Annulée</option>
                  </select>
                </div>
              </div>
              
              {selectedTask.status === 'completed' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Résultat
                  </label>
                  <textarea
                    value={selectedTask.outcome || ''}
                    onChange={(e) => setSelectedTask({...selectedTask, outcome: e.target.value})}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Résultat de la tâche"
                  />
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleSaveTask(selectedTask)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;