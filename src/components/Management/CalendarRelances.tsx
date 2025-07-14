import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Mail, 
  MessageSquare, 
  Phone, 
  AlertCircle, 
  CheckCircle,
  Clock,
  Filter,
  Search,
  Plus,
  User,
  FileText,
  Download,
  Printer,
  Share2,
  Settings,
  X,
  Edit3,
  Trash2,
  Eye
} from 'lucide-react';

interface RelanceEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: 'email' | 'sms' | 'call' | 'letter' | 'status_change';
  status: 'scheduled' | 'completed' | 'failed' | 'cancelled';
  clientId: string;
  clientName: string;
  managerId: string;
  managerName: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isAutomatic: boolean;
  templateId?: string;
  result?: string;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: RelanceEvent[];
}

interface CalendarRelancesProps {
  userId?: string;
  userRole?: string;
}

const CalendarRelances: React.FC<CalendarRelancesProps> = ({ userId, userRole }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<RelanceEvent | null>(null);
  const [showNewEventModal, setShowNewEventModal] = useState(false);

  // Données simulées pour les événements de relance
  const [relanceEvents, setRelanceEvents] = useState<RelanceEvent[]>([
    {
      id: '1',
      title: 'Relance email facture #FAC-2024-001',
      description: 'Relance automatique pour facture en retard de 15 jours',
      date: '2024-12-16',
      time: '09:00',
      type: 'email',
      status: 'scheduled',
      clientId: '1',
      clientName: 'Jean Martin',
      managerId: '2',
      managerName: 'Marie Dubois',
      priority: 'high',
      isAutomatic: true,
      templateId: '1'
    },
    {
      id: '2',
      title: 'Appel de suivi client',
      description: 'Vérifier la promesse de paiement',
      date: '2024-12-16',
      time: '14:30',
      type: 'call',
      status: 'scheduled',
      clientId: '1',
      clientName: 'Jean Martin',
      managerId: '2',
      managerName: 'Marie Dubois',
      priority: 'urgent',
      isAutomatic: false
    },
    {
      id: '3',
      title: 'SMS de rappel',
      description: 'Rappel de l\'échéance de demain',
      date: '2024-12-17',
      time: '10:00',
      type: 'sms',
      status: 'scheduled',
      clientId: '2',
      clientName: 'Sophie Leroy',
      managerId: '2',
      managerName: 'Marie Dubois',
      priority: 'medium',
      isAutomatic: true,
      templateId: '2'
    },
    {
      id: '4',
      title: 'Envoi mise en demeure',
      description: 'Courrier recommandé pour facture en retard de 30 jours',
      date: '2024-12-18',
      time: '09:00',
      type: 'letter',
      status: 'scheduled',
      clientId: '3',
      clientName: 'Pierre Dubois',
      managerId: '3',
      managerName: 'Pierre Martin',
      priority: 'high',
      isAutomatic: false
    },
    {
      id: '5',
      title: 'Changement statut client',
      description: 'Passage en statut critique',
      date: '2024-12-19',
      time: '08:00',
      type: 'status_change',
      status: 'scheduled',
      clientId: '3',
      clientName: 'Pierre Dubois',
      managerId: '3',
      managerName: 'Pierre Martin',
      priority: 'high',
      isAutomatic: true
    },
    {
      id: '6',
      title: 'Email de relance niveau 2',
      description: 'Seconde relance pour facture #FAC-2024-002',
      date: '2024-12-15',
      time: '09:00',
      type: 'email',
      status: 'completed',
      clientId: '2',
      clientName: 'Sophie Leroy',
      managerId: '2',
      managerName: 'Marie Dubois',
      priority: 'medium',
      isAutomatic: true,
      templateId: '3',
      result: 'Email ouvert à 10:15'
    }
  ]);

  // Générer les jours du calendrier
  useEffect(() => {
    const days: CalendarDay[] = [];
    const today = new Date();
    
    // Premier jour du mois actuel
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    // Dernier jour du mois actuel
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // Jour de la semaine du premier jour (0 = dimanche, 1 = lundi, etc.)
    let firstDayOfWeek = firstDayOfMonth.getDay();
    // Ajuster pour commencer la semaine le lundi (0 = lundi, 6 = dimanche)
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    // Ajouter les jours du mois précédent pour compléter la première semaine
    const daysFromPrevMonth = firstDayOfWeek;
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      const date = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), prevMonth.getDate() - i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: date.toDateString() === today.toDateString(),
        events: getEventsForDate(date)
      });
    }
    
    // Ajouter les jours du mois actuel
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
        events: getEventsForDate(date)
      });
    }
    
    // Ajouter les jours du mois suivant pour compléter la dernière semaine
    const totalDaysAdded = days.length;
    const daysNeeded = (Math.ceil(totalDaysAdded / 7) * 7) - totalDaysAdded;
    for (let i = 1; i <= daysNeeded; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: date.toDateString() === today.toDateString(),
        events: getEventsForDate(date)
      });
    }
    
    setCalendarDays(days);
  }, [currentDate, relanceEvents, typeFilter, statusFilter, searchTerm]);

  // Obtenir les événements pour une date spécifique
  const getEventsForDate = (date: Date): RelanceEvent[] => {
    const dateString = date.toISOString().split('T')[0];
    
    return relanceEvents.filter(event => {
      const matchesDate = event.date === dateString;
      const matchesType = typeFilter === 'all' || event.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
      const matchesSearch = searchTerm === '' || 
                           event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.clientName.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtrer par gestionnaire si l'utilisateur est un gestionnaire
      const matchesManager = !userId || !userRole || userRole === 'admin' || event.managerId === userId;
      
      return matchesDate && matchesType && matchesStatus && matchesSearch && matchesManager;
    });
  };

  // Navigation dans le calendrier
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Gestion des événements
  const handleDateClick = (day: CalendarDay) => {
    setSelectedDate(day.date);
  };

  const handleEventClick = (event: RelanceEvent) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setShowNewEventModal(true);
  };

  const handleSaveEvent = (event: RelanceEvent) => {
    if (event.id) {
      // Mise à jour d'un événement existant
      setRelanceEvents(relanceEvents.map(e => e.id === event.id ? event : e));
    } else {
      // Ajout d'un nouvel événement
      const newEvent = {
        ...event,
        id: Date.now().toString()
      };
      setRelanceEvents([...relanceEvents, newEvent]);
    }
    setShowNewEventModal(false);
    setShowEventModal(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    setRelanceEvents(relanceEvents.filter(e => e.id !== eventId));
    setShowEventModal(false);
  };

  // Formatage des dates
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  // Obtenir la couleur en fonction du type d'événement
  const getEventColor = (type: string) => {
    switch (type) {
      case 'email': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'sms': return 'bg-green-100 text-green-800 border-green-200';
      case 'call': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'letter': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'status_change': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Obtenir l'icône en fonction du type d'événement
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'sms': return MessageSquare;
      case 'call': return Phone;
      case 'letter': return FileText;
      case 'status_change': return AlertCircle;
      default: return CalendarIcon;
    }
  };

  // Obtenir la couleur en fonction du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtenir l'icône en fonction du statut
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return Clock;
      case 'completed': return CheckCircle;
      case 'failed': return AlertCircle;
      case 'cancelled': return X;
      default: return Clock;
    }
  };

  // Obtenir la couleur en fonction de la priorité
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Composant pour le modal d'événement
  const EventModal: React.FC<{
    event: RelanceEvent | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (event: RelanceEvent) => void;
    onDelete: (eventId: string) => void;
  }> = ({ event, isOpen, onClose, onSave, onDelete }) => {
    if (!isOpen || !event) return null;
    
    const EventIcon = getEventIcon(event.type);
    const StatusIcon = getStatusIcon(event.status);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${getEventColor(event.type).split(' ')[0]}`}>
                <EventIcon className={`h-5 w-5 ${getEventColor(event.type).split(' ')[1]}`} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(event.date).toLocaleDateString('fr-FR')} à {event.time}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
              <p className="text-gray-900">{event.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Client</h4>
                <p className="text-gray-900 flex items-center">
                  <User className="h-4 w-4 mr-1 text-gray-400" />
                  {event.clientName}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Gestionnaire</h4>
                <p className="text-gray-900 flex items-center">
                  <User className="h-4 w-4 mr-1 text-gray-400" />
                  {event.managerName}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Type</h4>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventColor(event.type)}`}>
                  <EventIcon className="h-3 w-3 mr-1" />
                  {event.type === 'email' ? 'Email' :
                   event.type === 'sms' ? 'SMS' :
                   event.type === 'call' ? 'Appel' :
                   event.type === 'letter' ? 'Courrier' : 'Changement statut'}
                </span>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Statut</h4>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {event.status === 'scheduled' ? 'Planifié' :
                   event.status === 'completed' ? 'Terminé' :
                   event.status === 'failed' ? 'Échec' : 'Annulé'}
                </span>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Priorité</h4>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(event.priority)}`}>
                  {event.priority === 'low' ? 'Basse' :
                   event.priority === 'medium' ? 'Moyenne' :
                   event.priority === 'high' ? 'Haute' : 'Urgente'}
                </span>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Type d'exécution</h4>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  event.isAutomatic ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {event.isAutomatic ? 'Automatique' : 'Manuel'}
                </span>
              </div>
            </div>
            
            {event.templateId && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Modèle utilisé</h4>
                <p className="text-gray-900">Modèle #{event.templateId}</p>
              </div>
            )}
            
            {event.result && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Résultat</h4>
                <p className="text-gray-900">{event.result}</p>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => onDelete(event.id)}
              className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  // Simuler une mise à jour du statut
                  if (event.status === 'scheduled') {
                    onSave({
                      ...event,
                      status: 'completed',
                      result: 'Marqué comme terminé manuellement'
                    });
                  }
                }}
                disabled={event.status !== 'scheduled'}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Marquer comme terminé
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Composant pour le modal de nouvel événement
  const NewEventModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (event: RelanceEvent) => void;
    initialDate?: Date;
  }> = ({ isOpen, onClose, onSave, initialDate }) => {
    const [formData, setFormData] = useState<Omit<RelanceEvent, 'id'>>({
      title: '',
      description: '',
      date: initialDate ? initialDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      time: '09:00',
      type: 'email',
      status: 'scheduled',
      clientId: '',
      clientName: '',
      managerId: userId || '',
      managerName: '',
      priority: 'medium',
      isAutomatic: false
    });

    useEffect(() => {
      if (initialDate) {
        setFormData(prev => ({
          ...prev,
          date: initialDate.toISOString().split('T')[0]
        }));
      }
    }, [initialDate]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData as RelanceEvent);
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Nouvelle action de relance</h3>
              <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Titre de l'action"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Description détaillée"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heure *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type d'action *
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="call">Appel</option>
                    <option value="letter">Courrier</option>
                    <option value="status_change">Changement de statut</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priorité *
                  </label>
                  <select
                    required
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    Client *
                  </label>
                  <select
                    required
                    value={formData.clientId}
                    onChange={(e) => {
                      const selectedOption = e.target.options[e.target.selectedIndex];
                      setFormData({
                        ...formData, 
                        clientId: e.target.value,
                        clientName: selectedOption.text
                      });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionner un client</option>
                    <option value="1">Jean Martin</option>
                    <option value="2">Sophie Leroy</option>
                    <option value="3">Pierre Dubois</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gestionnaire *
                  </label>
                  <select
                    required
                    value={formData.managerId}
                    onChange={(e) => {
                      const selectedOption = e.target.options[e.target.selectedIndex];
                      setFormData({
                        ...formData, 
                        managerId: e.target.value,
                        managerName: selectedOption.text
                      });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionner un gestionnaire</option>
                    <option value="2">Marie Dubois</option>
                    <option value="3">Pierre Martin</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="isAutomatic"
                  checked={formData.isAutomatic}
                  onChange={(e) => setFormData({...formData, isAutomatic: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isAutomatic" className="ml-2 text-sm text-gray-700">
                  Exécution automatique
                </label>
              </div>
              
              {(formData.type === 'email' || formData.type === 'sms') && formData.isAutomatic && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modèle
                  </label>
                  <select
                    value={formData.templateId || ''}
                    onChange={(e) => setFormData({...formData, templateId: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionner un modèle</option>
                    <option value="1">Relance amiable</option>
                    <option value="2">Relance ferme</option>
                    <option value="3">Mise en demeure</option>
                  </select>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Créer
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendrier des Relances</h1>
          <p className="text-gray-600">Planification et suivi des actions de recouvrement</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPreviousMonth}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goToToday}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Aujourd'hui
            </button>
            <button
              onClick={goToNextMonth}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="hidden md:block text-lg font-semibold text-gray-900">
            {formatMonthYear(currentDate)}
          </div>
          <button
            onClick={handleAddEvent}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle relance
          </button>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">Tous les types</option>
              <option value="email">Emails</option>
              <option value="sms">SMS</option>
              <option value="call">Appels</option>
              <option value="letter">Courriers</option>
              <option value="status_change">Changements de statut</option>
            </select>
            
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="scheduled">Planifiés</option>
              <option value="completed">Terminés</option>
              <option value="failed">Échoués</option>
              <option value="cancelled">Annulés</option>
            </select>
            
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as any)}
            >
              <option value="month">Vue mensuelle</option>
              <option value="week">Vue hebdomadaire</option>
              <option value="day">Vue journalière</option>
            </select>
          </div>
        </div>
      </div>

      {/* Calendrier */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* En-tête des jours de la semaine */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => (
            <div key={index} className="bg-gray-50 py-2 text-center text-sm font-medium text-gray-700">
              {day}
            </div>
          ))}
        </div>
        
        {/* Grille du calendrier */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              onClick={() => handleDateClick(day)}
              className={`min-h-[120px] bg-white p-2 ${
                day.isToday ? 'bg-blue-50' : 
                day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'
              } ${
                selectedDate && day.date.toDateString() === selectedDate.toDateString() 
                  ? 'ring-2 ring-blue-500' 
                  : ''
              } hover:bg-gray-50 cursor-pointer transition-colors`}
            >
              <div className="flex justify-between items-start">
                <span className={`text-sm font-medium ${
                  day.isToday ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center' : ''
                }`}>
                  {day.date.getDate()}
                </span>
                {day.events.length > 0 && (
                  <span className="text-xs font-medium text-gray-500">
                    {day.events.length} {day.events.length === 1 ? 'action' : 'actions'}
                  </span>
                )}
              </div>
              
              <div className="mt-2 space-y-1 max-h-[80px] overflow-y-auto">
                {day.events.slice(0, 3).map((event) => {
                  const EventIcon = getEventIcon(event.type);
                  return (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event);
                      }}
                      className={`px-2 py-1 rounded text-xs font-medium truncate border ${getEventColor(event.type)}`}
                    >
                      <div className="flex items-center">
                        <EventIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{event.time} - {event.title}</span>
                      </div>
                    </div>
                  );
                })}
                {day.events.length > 3 && (
                  <div className="text-xs text-center text-gray-500">
                    +{day.events.length - 3} autres
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Liste des événements pour le jour sélectionné */}
      {selectedDate && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Relances du {formatDate(selectedDate)}
            </h2>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Download className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Printer className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {calendarDays.find(day => 
            day.date.toDateString() === selectedDate.toDateString()
          )?.events.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CalendarIcon className="h-12 w-12 mx-auto text-gray-300 mb-2" />
              <p>Aucune relance planifiée pour cette date</p>
              <button
                onClick={() => {
                  setShowNewEventModal(true);
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Ajouter une relance
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {calendarDays.find(day => 
                day.date.toDateString() === selectedDate.toDateString()
              )?.events.map((event) => {
                const EventIcon = getEventIcon(event.type);
                const StatusIcon = getStatusIcon(event.status);
                
                return (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${getEventColor(event.type).split(' ')[0]}`}>
                        <EventIcon className={`h-5 w-5 ${getEventColor(event.type).split(' ')[1]}`} />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium text-gray-900">{event.title}</h3>
                          <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(event.priority)}`}>
                            {event.priority === 'low' ? 'Basse' :
                             event.priority === 'medium' ? 'Moyenne' :
                             event.priority === 'high' ? 'Haute' : 'Urgente'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <span>{event.time}</span>
                          <span className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {event.clientName}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {event.status === 'scheduled' ? 'Planifié' :
                         event.status === 'completed' ? 'Terminé' :
                         event.status === 'failed' ? 'Échec' : 'Annulé'}
                      </span>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <EventModal
        event={selectedEvent}
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />
      
      <NewEventModal
        isOpen={showNewEventModal}
        onClose={() => setShowNewEventModal(false)}
        onSave={handleSaveEvent}
        initialDate={selectedDate}
      />
    </div>
  );
};

export default CalendarRelances;