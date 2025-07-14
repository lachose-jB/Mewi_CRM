import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Calendar, 
  Filter, 
  Search,
  Download,
  Eye,
  MessageSquare,
  Phone,
  Mail,
  FileText,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Building,
  TrendingUp,
  BarChart3,
  Archive,
  Printer,
  Share2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { useCrm } from '../../contexts/CrmContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency } from '../../utils/dataUtils';

interface HistoryEvent {
  id: string;
  type: 'communication' | 'payment' | 'status_change' | 'document' | 'meeting' | 'system';
  title: string;
  description: string;
  date: string;
  time: string;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  actor: string;
  actorRole: string;
  details?: any;
  attachments?: string[];
  impact?: 'low' | 'medium' | 'high';
}

const HistoryPage: React.FC = () => {
  const { communications, payments, clients, invoices } = useCrm();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('date');
  const [historyEvents, setHistoryEvents] = useState<HistoryEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      try {
        // Find client
        const client = clients.find(c => c.user_id === user?.id || c.email === user?.email);
        
        if (client) {
          // Get client communications
          const clientCommunications = communications.filter(comm => comm.client_id === client.id);
          
          // Get client payments
          const clientPayments = payments.filter(payment => payment.client_id === client.id);
          
          // Convert to history events
          const events: HistoryEvent[] = [];
          
          // Add communications to history
          clientCommunications.forEach(comm => {
            const commDate = new Date(comm.created_at);
            
            events.push({
              id: `comm_${comm.id}`,
              type: 'communication',
              title: comm.subject || `${comm.type.charAt(0).toUpperCase() + comm.type.slice(1)} envoyé`,
              description: comm.content.length > 100 ? comm.content.substring(0, 100) + '...' : comm.content,
              date: commDate.toISOString().split('T')[0],
              time: commDate.toTimeString().substring(0, 5),
              status: 'completed',
              actor: 'Gestionnaire',
              actorRole: 'manager',
              details: {
                communicationType: comm.type,
                subject: comm.subject,
                content: comm.content,
                status: comm.status,
                sentAt: comm.sent_at
              },
              impact: comm.type === 'letter' ? 'high' : 'medium'
            });
          });
          
          // Add payments to history
          clientPayments.forEach(payment => {
            const paymentDate = new Date(payment.payment_date);
            const invoice = invoices.find(inv => inv.id === payment.invoice_id);
            
            events.push({
              id: `payment_${payment.id}`,
              type: 'payment',
              title: `Paiement ${payment.status === 'completed' ? 'effectué' : 'programmé'}`,
              description: `${payment.method} - ${invoice ? invoice.invoice_number : 'Paiement général'}`,
              date: paymentDate.toISOString().split('T')[0],
              time: paymentDate.toTimeString().substring(0, 5),
              status: payment.status === 'completed' ? 'completed' : 'pending',
              actor: client.name,
              actorRole: 'client',
              details: {
                amount: payment.amount,
                method: payment.method,
                reference: payment.reference,
                invoiceId: payment.invoice_id,
                status: payment.status
              },
              impact: 'medium'
            });
          });
          
          // Add status changes (mock data)
          if (client.status === 'critical' || client.status === 'orange') {
            const statusDate = new Date(client.updated_at);
            events.push({
              id: `status_${client.id}`,
              type: 'status_change',
              title: `Dossier passé en statut ${client.status}`,
              description: 'Escalade automatique suite au dépassement de délai',
              date: statusDate.toISOString().split('T')[0],
              time: statusDate.toTimeString().substring(0, 5),
              status: 'completed',
              actor: 'Système automatique',
              actorRole: 'system',
              impact: 'high',
              details: {
                previousStatus: client.status === 'critical' ? 'orange' : 'yellow',
                newStatus: client.status,
                reason: 'Dépassement délai',
                automaticTrigger: true
              }
            });
          }
          
          // Sort events by date and time
          events.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateB.getTime() - dateA.getTime();
          });
          
          setHistoryEvents(events);
        }
      } catch (error) {
        console.error('Error loading history:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadHistory();
  }, [communications, payments, clients, invoices, user]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'communication': return MessageSquare;
      case 'payment': return CreditCard;
      case 'status_change': return Activity;
      case 'document': return FileText;
      case 'meeting': return User;
      case 'system': return Building;
      default: return Activity;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'communication': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'payment': return 'bg-green-100 text-green-800 border-green-200';
      case 'status_change': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'document': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'meeting': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'system': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'pending': return Clock;
      case 'failed': return AlertCircle;
      case 'cancelled': return AlertCircle;
      default: return Clock;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActorIcon = (role: string) => {
    switch (role) {
      case 'manager': return User;
      case 'client': return User;
      case 'system': return Building;
      case 'legal': return FileText;
      default: return User;
    }
  };

  const filteredHistory = historyEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.actor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || event.type === typeFilter;
    
    let matchesPeriod = true;
    const eventDate = new Date(event.date);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24));
    
    switch (periodFilter) {
      case 'week':
        matchesPeriod = diffDays <= 7;
        break;
      case 'month':
        matchesPeriod = diffDays <= 30;
        break;
      case 'quarter':
        matchesPeriod = diffDays <= 90;
        break;
    }
    
    return matchesSearch && matchesType && matchesPeriod;
  });

  const sortedHistory = [...filteredHistory].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(`${b.date} ${b.time}`).getTime() - new Date(`${a.date} ${a.time}`).getTime();
      case 'type':
        return a.type.localeCompare(b.type);
      case 'impact':
        const impactOrder = { high: 3, medium: 2, low: 1 };
        return (impactOrder[b.impact as keyof typeof impactOrder] || 0) - (impactOrder[a.impact as keyof typeof impactOrder] || 0);
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <RefreshCw className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Chargement de l'historique...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Historique Complet</h1>
          <p className="text-gray-600">Chronologie détaillée de toutes les actions sur votre dossier</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
          <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Événements</p>
              <p className="text-2xl font-bold text-gray-900">{historyEvents.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Communications</p>
              <p className="text-2xl font-bold text-gray-900">
                {historyEvents.filter(h => h.type === 'communication').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Paiements</p>
              <p className="text-2xl font-bold text-gray-900">
                {historyEvents.filter(h => h.type === 'payment').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Impact Élevé</p>
              <p className="text-2xl font-bold text-gray-900">
                {historyEvents.filter(h => h.impact === 'high').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher dans l'historique..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">Tous les types</option>
              <option value="communication">Communications</option>
              <option value="payment">Paiements</option>
              <option value="status_change">Changements statut</option>
              <option value="document">Documents</option>
              <option value="meeting">Rendez-vous</option>
              <option value="system">Système</option>
            </select>
            
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
            >
              <option value="all">Toute la période</option>
              <option value="week">7 derniers jours</option>
              <option value="month">30 derniers jours</option>
              <option value="quarter">3 derniers mois</option>
            </select>
            
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Trier par date</option>
              <option value="type">Trier par type</option>
              <option value="impact">Trier par impact</option>
            </select>
          </div>
        </div>
      </div>

      {/* Timeline des événements */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Chronologie ({sortedHistory.length} événements)
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Légende:</span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                <span>Impact élevé</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                <span>Impact moyen</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                <span>Impact faible</span>
              </div>
            </div>
          </div>
        </div>

        {sortedHistory.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">Aucun événement trouvé</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-6">
              {sortedHistory.map((event, index) => {
                const EventIcon = getEventIcon(event.type);
                const statusConfig = getStatusConfig(event.status);
                const StatusIcon = getStatusIcon(event.status);
                const ActorIcon = getActorIcon(event.actorRole);
                const isExpanded = expandedEvent === event.id;
                
                return (
                  <div key={event.id} className="relative flex items-start">
                    <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center ${getEventColor(event.type)} relative z-10 border-4 border-white shadow-sm`}>
                      <EventIcon className="h-6 w-6" />
                      {event.impact && (
                        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${
                          event.impact === 'high' ? 'bg-red-500' :
                          event.impact === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                      )}
                    </div>
                    
                    <div className="ml-6 flex-1">
                      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{event.title}</h4>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {event.date} {event.time}
                          </div>
                        </div>
                        <p className="text-gray-600 mb-3">{event.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <StatusIcon className={`h-4 w-4 mr-1 ${
                                event.status === 'completed' ? 'text-green-500' :
                                event.status === 'pending' ? 'text-yellow-500' :
                                event.status === 'failed' ? 'text-red-500' : 'text-gray-500'
                              }`} />
                              {event.status === 'completed' ? 'Terminé' :
                               event.status === 'pending' ? 'En attente' :
                               event.status === 'failed' ? 'Échec' : 'Annulé'}
                            </span>
                            <span className="flex items-center">
                              <ActorIcon className="h-4 w-4 mr-1" />
                              {event.actor}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <Share2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        {isExpanded && event.details && (
                          <div className="mt-6 pt-6 border-t border-gray-100">
                            <h5 className="font-medium text-gray-900 mb-4">Détails complets</h5>
                            
                            {event.type === 'communication' && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-medium text-gray-700">Type de communication:</span>
                                  <span className="ml-2 text-gray-600">
                                    {event.details.communicationType === 'email' ? 'Email' :
                                     event.details.communicationType === 'call' ? 'Appel téléphonique' : 
                                     event.details.communicationType === 'sms' ? 'SMS' :
                                     event.details.communicationType === 'letter' ? 'Courrier' : 'Autre'}
                                  </span>
                                </div>
                                
                                {event.details.subject && (
                                  <div>
                                    <span className="font-medium text-gray-700">Sujet:</span>
                                    <span className="ml-2 text-gray-600">{event.details.subject}</span>
                                  </div>
                                )}
                                
                                <div className="md:col-span-2">
                                  <span className="font-medium text-gray-700">Contenu:</span>
                                  <p className="mt-1 text-gray-600 whitespace-pre-line">{event.details.content}</p>
                                </div>
                                
                                <div>
                                  <span className="font-medium text-gray-700">Statut:</span>
                                  <span className="ml-2 text-gray-600">
                                    {event.details.status === 'sent' ? 'Envoyé' :
                                     event.details.status === 'delivered' ? 'Délivré' :
                                     event.details.status === 'read' ? 'Lu' :
                                     event.details.status === 'responded' ? 'Répondu' : 'Échec'}
                                  </span>
                                </div>
                                
                                {event.details.sentAt && (
                                  <div>
                                    <span className="font-medium text-gray-700">Envoyé le:</span>
                                    <span className="ml-2 text-gray-600">
                                      {new Date(event.details.sentAt).toLocaleString('fr-FR')}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {event.type === 'payment' && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-medium text-gray-700">Montant:</span>
                                  <span className="ml-2 text-green-600 font-medium">
                                    {formatCurrency(event.details.amount)}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Méthode:</span>
                                  <span className="ml-2 text-gray-600">{event.details.method}</span>
                                </div>
                                {event.details.reference && (
                                  <div>
                                    <span className="font-medium text-gray-700">Référence:</span>
                                    <span className="ml-2 text-blue-600">{event.details.reference}</span>
                                  </div>
                                )}
                                <div>
                                  <span className="font-medium text-gray-700">Statut:</span>
                                  <span className={`ml-2 ${
                                    event.details.status === 'completed' ? 'text-green-600' :
                                    event.details.status === 'pending' ? 'text-yellow-600' :
                                    event.details.status === 'scheduled' ? 'text-blue-600' : 'text-red-600'
                                  }`}>
                                    {event.details.status === 'completed' ? 'Complété' :
                                     event.details.status === 'pending' ? 'En attente' :
                                     event.details.status === 'scheduled' ? 'Programmé' : 'Échoué'}
                                  </span>
                                </div>
                              </div>
                            )}
                            
                            {event.type === 'status_change' && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-medium text-gray-700">Ancien statut:</span>
                                  <span className={`ml-2 ${
                                    event.details.previousStatus === 'blue' ? 'text-blue-600' :
                                    event.details.previousStatus === 'yellow' ? 'text-yellow-600' :
                                    event.details.previousStatus === 'orange' ? 'text-orange-600' : 'text-gray-600'
                                  }`}>
                                    {event.details.previousStatus === 'blue' ? 'Bleu' :
                                     event.details.previousStatus === 'yellow' ? 'Jaune' :
                                     event.details.previousStatus === 'orange' ? 'Orange' : event.details.previousStatus}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Nouveau statut:</span>
                                  <span className={`ml-2 ${
                                    event.details.newStatus === 'yellow' ? 'text-yellow-600' :
                                    event.details.newStatus === 'orange' ? 'text-orange-600' :
                                    event.details.newStatus === 'critical' ? 'text-red-600' : 'text-gray-600'
                                  }`}>
                                    {event.details.newStatus === 'yellow' ? 'Jaune' :
                                     event.details.newStatus === 'orange' ? 'Orange' :
                                     event.details.newStatus === 'critical' ? 'Critique' : event.details.newStatus}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Raison:</span>
                                  <span className="ml-2 text-gray-600">{event.details.reason}</span>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Déclenchement:</span>
                                  <span className="ml-2 text-gray-600">
                                    {event.details.automaticTrigger ? 'Automatique' : 'Manuel'}
                                  </span>
                                </div>
                              </div>
                            )}
                            
                            {event.attachments && event.attachments.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-gray-100">
                                <span className="font-medium text-gray-700 block mb-2">Pièces jointes:</span>
                                <div className="flex flex-wrap gap-2">
                                  {event.attachments.map((attachment, idx) => (
                                    <button
                                      key={idx}
                                      className="flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                                    >
                                      <FileText className="h-3 w-3 mr-1" />
                                      {attachment}
                                      <ExternalLink className="h-3 w-3 ml-1" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;