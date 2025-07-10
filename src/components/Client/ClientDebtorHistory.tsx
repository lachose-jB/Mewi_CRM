import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  FileText, 
  Mail, 
  Phone, 
  MessageSquare, 
  Filter, 
  Search,
  RefreshCw,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronDown
} from 'lucide-react';
import { useCrm } from '../../contexts/CrmContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate } from '../../utils/dataUtils';
import { Client, Communication, Debtor, Payment, Invoice } from '../../types';

interface HistoryEvent {
  id: string;
  date: string;
  type: 'communication' | 'payment' | 'status_change' | 'invoice';
  title: string;
  description: string;
  debtorId: string;
  debtorName: string;
  status: string;
  amount?: number;
  metadata?: any;
}

const ClientDebtorHistory: React.FC = () => {
  const { clients, debtors, invoices, payments, communications, refreshData } = useCrm();
  const { user } = useAuth();
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [historyEvents, setHistoryEvents] = useState<HistoryEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [debtorFilter, setDebtorFilter] = useState<string>('all');

  // Find client based on user
  useEffect(() => {
    if (user && user.role === 'client') {
      const foundClient = clients.find(c => c.userId === user.id);
      if (foundClient) {
        setClient(foundClient);
      }
    }
  }, [user, clients]);

  // Generate history events
  useEffect(() => {
    if (!client) return;
    
    const generateHistory = () => {
      setIsLoading(true);
      
      try {
        const events: HistoryEvent[] = [];
        const clientDebtors = debtors.filter(d => d.clientId === client.id);
        
        // Add communications
        communications
          .filter(comm => comm.clientId === client.id)
          .forEach(comm => {
            const debtor = debtors.find(d => d.id === comm.debtorId);
            if (!debtor) return;
            
            events.push({
              id: `comm_${comm.id}`,
              date: comm.createdAt,
              type: 'communication',
              title: comm.subject || `${comm.type.charAt(0).toUpperCase() + comm.type.slice(1)} - ${debtor.name}`,
              description: comm.content.length > 100 ? `${comm.content.substring(0, 100)}...` : comm.content,
              debtorId: comm.debtorId,
              debtorName: debtor.name,
              status: comm.status,
              metadata: {
                type: comm.type,
                subject: comm.subject,
                content: comm.content,
                sentAt: comm.sentAt
              }
            });
          });
        
        // Add payments
        payments
          .filter(payment => payment.clientId === client.id)
          .forEach(payment => {
            const debtor = debtors.find(d => d.id === payment.debtorId);
            if (!debtor) return;
            
            const relatedInvoice = payment.invoiceId 
              ? invoices.find(inv => inv.id === payment.invoiceId) 
              : null;
            
            events.push({
              id: `payment_${payment.id}`,
              date: payment.paymentDate,
              type: 'payment',
              title: `Paiement - ${debtor.name}`,
              description: `${payment.method}${relatedInvoice ? ` - ${relatedInvoice.invoiceNumber}` : ''}`,
              debtorId: payment.debtorId,
              debtorName: debtor.name,
              status: payment.status,
              amount: payment.amount,
              metadata: {
                method: payment.method,
                reference: payment.reference,
                invoiceId: payment.invoiceId
              }
            });
          });
        
        // Add status changes (simplified, in a real app this would come from an audit log)
        clientDebtors.forEach(debtor => {
          // Simulate a status change event based on recovery status
          if (debtor.recoveryStatus !== 'blue') {
            events.push({
              id: `status_${debtor.id}_${debtor.recoveryStatus}`,
              date: debtor.updatedAt, // Using updatedAt as a proxy for when the status changed
              type: 'status_change',
              title: `Statut changé - ${debtor.name}`,
              description: `Passage en statut ${
                debtor.recoveryStatus === 'yellow' ? 'Relance 1' :
                debtor.recoveryStatus === 'orange' ? 'Relance 2' :
                debtor.recoveryStatus === 'critical' ? 'Relance 3 Critique' : debtor.recoveryStatus
              }`,
              debtorId: debtor.id,
              debtorName: debtor.name,
              status: debtor.recoveryStatus,
              metadata: {
                oldStatus: 'blue', // Simplified, we don't have the actual previous status
                newStatus: debtor.recoveryStatus
              }
            });
          }
        });
        
        // Add invoice events
        invoices
          .filter(invoice => invoice.clientId === client.id)
          .forEach(invoice => {
            const debtor = debtors.find(d => d.id === invoice.debtorId);
            if (!debtor) return;
            
            events.push({
              id: `invoice_${invoice.id}`,
              date: invoice.createdAt,
              type: 'invoice',
              title: `Facture ${invoice.invoiceNumber} - ${debtor.name}`,
              description: invoice.description || `Montant: ${invoice.originalAmount}€, Échéance: ${formatDate(invoice.dueDate)}`,
              debtorId: invoice.debtorId,
              debtorName: debtor.name,
              status: invoice.status,
              amount: invoice.originalAmount,
              metadata: {
                invoiceNumber: invoice.invoiceNumber,
                dueDate: invoice.dueDate,
                issueDate: invoice.issueDate,
                category: invoice.category
              }
            });
          });
        
        // Sort by date, newest first
        events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        setHistoryEvents(events);
      } catch (error) {
        console.error('Error generating history:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    generateHistory();
  }, [client, debtors, communications, payments, invoices]);

  // Filter history events
  const filteredEvents = historyEvents.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.debtorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || event.type === typeFilter;
    
    const matchesDebtor = debtorFilter === 'all' || event.debtorId === debtorFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const eventDate = new Date(event.date);
      const now = new Date();
      
      if (dateFilter === 'today') {
        const today = new Date(now);
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        matchesDate = eventDate >= today && eventDate < tomorrow;
      } else if (dateFilter === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        matchesDate = eventDate >= weekAgo;
      } else if (dateFilter === 'month') {
        const monthAgo = new Date(now);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        
        matchesDate = eventDate >= monthAgo;
      }
    }
    
    return matchesSearch && matchesType && matchesDebtor && matchesDate;
  });

  // Get client debtors for filter
  const clientDebtors = debtors.filter(d => client && d.clientId === client.id);

  // Handle refresh
  const handleRefresh = async () => {
    setIsLoading(true);
    await refreshData();
    setIsLoading(false);
  };

  if (!client) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Aucune information client trouvée</p>
          <p className="text-gray-400 mt-2">Veuillez contacter votre gestionnaire de compte</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Historique complet</h1>
        <button 
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Actualisation...' : 'Actualiser'}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <select
                className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">Tous les types</option>
                <option value="communication">Communications</option>
                <option value="payment">Paiements</option>
                <option value="status_change">Changements de statut</option>
                <option value="invoice">Factures</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
            
            <div className="relative">
              <select
                className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">Toutes les dates</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">7 derniers jours</option>
                <option value="month">30 derniers jours</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
            
            <div className="relative">
              <select
                className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={debtorFilter}
                onChange={(e) => setDebtorFilter(e.target.value)}
              >
                <option value="all">Tous les débiteurs</option>
                {clientDebtors.map(debtor => (
                  <option key={debtor.id} value={debtor.id}>{debtor.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* History timeline */}
      {isLoading ? (
        <div className="text-center py-12">
          <RefreshCw className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
          <p className="text-gray-500">Chargement de l'historique...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun événement trouvé</h3>
          <p className="text-gray-500">
            Aucun événement ne correspond à vos critères de recherche.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Chronologie ({filteredEvents.length} événements)</h3>
          
          <div className="relative">
            <div className="absolute left-9 top-3 bottom-3 w-px bg-gray-200"></div>
            
            <div className="space-y-8">
              {filteredEvents.map(event => (
                <div key={event.id} className="relative flex items-start">
                  <div className={`absolute left-9 top-3 -ml-px h-full w-0.5 ${event.id === filteredEvents[filteredEvents.length - 1].id ? 'bg-white' : 'bg-gray-200'}`}></div>
                  <div className={`flex-shrink-0 w-18 text-center mr-4`}>
                    <span className="text-xs font-medium text-gray-500">
                      {formatDate(event.date)}
                    </span>
                    <span className="block text-xs text-gray-400">
                      {new Date(event.date).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}
                    </span>
                  </div>
                  
                  <div className={`relative flex items-center justify-center h-8 w-8 rounded-full border-2 border-white ${
                    event.type === 'communication' ? 'bg-blue-100' :
                    event.type === 'payment' ? 'bg-green-100' :
                    event.type === 'status_change' ? 'bg-orange-100' :
                    'bg-purple-100'
                  }`}>
                    {event.type === 'communication' && <MessageSquare className="h-4 w-4 text-blue-600" />}
                    {event.type === 'payment' && <CreditCard className="h-4 w-4 text-green-600" />}
                    {event.type === 'status_change' && (
                      event.status === 'critical' ? 
                        <AlertCircle className="h-4 w-4 text-orange-600" /> : 
                        <Clock className="h-4 w-4 text-orange-600" />
                    )}
                    {event.type === 'invoice' && <FileText className="h-4 w-4 text-purple-600" />}
                  </div>
                  
                  <div className="ml-4 min-w-0 flex-1 bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        event.type === 'communication' ? (
                          event.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                          event.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          event.status === 'read' ? 'bg-purple-100 text-purple-800' :
                          event.status === 'responded' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-red-100 text-red-800'
                        ) :
                        event.type === 'payment' ? (
                          event.status === 'completed' ? 'bg-green-100 text-green-800' :
                          event.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        ) :
                        event.type === 'status_change' ? (
                          event.status === 'critical' ? 'bg-red-100 text-red-800' :
                          event.status === 'orange' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        ) :
                        event.type === 'invoice' ? (
                          event.status === 'paid' ? 'bg-green-100 text-green-800' :
                          event.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                          event.status === 'overdue' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        ) :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.type === 'communication' ? (
                          event.status === 'sent' ? 'Envoyé' :
                          event.status === 'delivered' ? 'Délivré' :
                          event.status === 'read' ? 'Lu' :
                          event.status === 'responded' ? 'Répondu' : 'Échec'
                        ) :
                        event.type === 'payment' ? (
                          event.status === 'completed' ? 'Complété' :
                          event.status === 'scheduled' ? 'Programmé' :
                          event.status === 'pending' ? 'En attente' : 'Échoué'
                        ) :
                        event.type === 'status_change' ? (
                          event.status === 'critical' ? 'Critique' :
                          event.status === 'orange' ? 'Orange' :
                          'Jaune'
                        ) :
                        event.type === 'invoice' ? (
                          event.status === 'paid' ? 'Payée' :
                          event.status === 'partial' ? 'Partielle' :
                          event.status === 'overdue' ? 'En retard' :
                          'En attente'
                        ) :
                        event.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600">{event.description}</p>
                    
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <span>Débiteur: {event.debtorName}</span>
                      {event.amount !== undefined && (
                        <>
                          <span className="mx-1">•</span>
                          <span className={event.type === 'payment' ? 'text-green-600 font-medium' : ''}>
                            {new Intl.NumberFormat('fr-FR', { 
                              style: 'currency', 
                              currency: 'EUR' 
                            }).format(event.amount)}
                          </span>
                        </>
                      )}
                      
                      {event.type === 'communication' && event.metadata?.type && (
                        <>
                          <span className="mx-1">•</span>
                          <span className="capitalize">{event.metadata.type}</span>
                        </>
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

export default ClientDebtorHistory;