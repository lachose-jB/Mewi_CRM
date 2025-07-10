import React, { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Phone,
  Mail,
  MessageSquare,
  Download,
  Eye,
  CreditCard,
  Euro,
  User,
  MapPin,
  Building,
  Hash,
  TrendingUp,
  Activity,
  Bell,
  Archive,
  Printer,
  Share2,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Shield,
  Info,
  Target,
  Zap,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCrm } from '../../contexts/CrmContext';

interface TimelineEvent {
  id: string;
  type: 'communication' | 'payment' | 'status_change' | 'document' | 'meeting';
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  details?: any;
}

interface PaymentPlan {
  id: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  paymentMethod?: string;
}

const DossierDetails: React.FC = () => {
  const { user } = useAuth();
  const { clients } = useCrm();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Trouver le client correspondant
  const clientData = clients.find(client => client.email === user?.email);

  // Données simulées pour la démonstration
  const [timeline] = useState<TimelineEvent[]>([
    {
      id: '1',
      type: 'status_change',
      title: 'Dossier passé en statut critique',
      description: 'Le dossier a été escaladé en raison du dépassement de 30 jours',
      date: '2024-12-15 09:30:00',
      status: 'completed',
      details: { previousStatus: 'orange', newStatus: 'critical', reason: 'Dépassement délai' }
    },
    {
      id: '2',
      type: 'communication',
      title: 'Email de relance envoyé',
      description: 'Relance automatique pour facture FAC-2024-001',
      date: '2024-12-14 14:00:00',
      status: 'completed',
      details: { 
        type: 'email', 
        subject: 'Rappel de paiement urgent',
        opened: true,
        openedAt: '2024-12-14 14:15:00'
      }
    },
    {
      id: '3',
      type: 'communication',
      title: 'Appel téléphonique',
      description: 'Tentative de contact par Marie Dubois',
      date: '2024-12-13 10:30:00',
      status: 'completed',
      details: { 
        type: 'call', 
        duration: '5 minutes',
        outcome: 'Promesse de règlement avant le 20/12',
        notes: 'Client en difficulté temporaire, demande un échéancier'
      }
    },
    {
      id: '4',
      type: 'document',
      title: 'Mise en demeure envoyée',
      description: 'Courrier recommandé avec accusé de réception',
      date: '2024-12-12 16:45:00',
      status: 'completed',
      details: { 
        type: 'registered_letter',
        trackingNumber: 'RR123456789FR',
        delivered: true,
        deliveredAt: '2024-12-13 08:30:00'
      }
    },
    {
      id: '5',
      type: 'payment',
      title: 'Paiement partiel reçu',
      description: 'Règlement de 2 500€ sur facture FAC-2024-002',
      date: '2024-12-10 11:20:00',
      status: 'completed',
      details: { 
        amount: 2500,
        method: 'Virement bancaire',
        reference: 'VIR-20241210-001',
        remainingAmount: 4500
      }
    }
  ]);

  const [paymentPlan] = useState<PaymentPlan[]>([
    {
      id: '1',
      amount: 5000,
      dueDate: '2024-12-20',
      status: 'pending',
      paymentMethod: 'Virement bancaire'
    },
    {
      id: '2',
      amount: 5000,
      dueDate: '2025-01-20',
      status: 'pending'
    },
    {
      id: '3',
      amount: 5750.50,
      dueDate: '2025-02-20',
      status: 'pending'
    }
  ]);

  const [invoices] = useState([
    {
      id: 'FAC-2024-001',
      amount: 8750.50,
      originalAmount: 8750.50,
      dueDate: '2024-11-15',
      status: 'overdue',
      daysOverdue: 30,
      description: 'Prestations de conseil - Novembre 2024'
    },
    {
      id: 'FAC-2024-002',
      amount: 4500.00,
      originalAmount: 7000.00,
      dueDate: '2024-12-01',
      status: 'partial',
      daysOverdue: 14,
      description: 'Services de maintenance - Décembre 2024',
      paidAmount: 2500.00
    }
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return { color: 'text-green-600 bg-green-100', icon: CheckCircle };
      case 'pending':
        return { color: 'text-yellow-600 bg-yellow-100', icon: Clock };
      case 'failed':
        return { color: 'text-red-600 bg-red-100', icon: AlertCircle };
      default:
        return { color: 'text-gray-600 bg-gray-100', icon: Clock };
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'communication': return MessageSquare;
      case 'payment': return CreditCard;
      case 'status_change': return Activity;
      case 'document': return FileText;
      case 'meeting': return Calendar;
      default: return Bell;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'communication': return 'bg-blue-100 text-blue-600';
      case 'payment': return 'bg-green-100 text-green-600';
      case 'status_change': return 'bg-purple-100 text-purple-600';
      case 'document': return 'bg-orange-100 text-orange-600';
      case 'meeting': return 'bg-indigo-100 text-indigo-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalOriginal = invoices.reduce((sum, inv) => sum + inv.originalAmount, 0);
  const paidAmount = totalOriginal - totalAmount;

  if (!clientData) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-500">Aucune information client trouvée</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête du dossier */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dossier #{clientData.id}</h1>
              <p className="text-gray-600">{clientData.name}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm text-gray-500 flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  {clientData.email}
                </span>
                <span className="text-sm text-gray-500 flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  {clientData.phone}
                </span>
              </div>
              {/* Bloc d'informations détaillées */}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                {clientData.company && (
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-1 text-blue-400" />
                    <span className="font-medium mr-1">Société :</span>
                    {clientData.company}
                  </div>
                )}
                {clientData.address && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-green-400" />
                    <span className="font-medium mr-1">Adresse :</span>
                    {clientData.address}
                  </div>
                )}
                {clientData.city && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-green-400" />
                    <span className="font-medium mr-1">Ville :</span>
                    {clientData.city}
                  </div>
                )}
                {clientData.postalCode && (
                  <div className="flex items-center">
                    <Hash className="h-4 w-4 mr-1 text-gray-400" />
                    <span className="font-medium mr-1">Code postal :</span>
                    {clientData.postalCode}
                  </div>
                )}
                {clientData.country && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-green-400" />
                    <span className="font-medium mr-1">Pays :</span>
                    {clientData.country}
                  </div>
                )}
                {clientData.siret && (
                  <div className="flex items-center">
                    <Hash className="h-4 w-4 mr-1 text-gray-400" />
                    <span className="font-medium mr-1">SIRET :</span>
                    {clientData.siret}
                  </div>
                )}
                {clientData.tva && (
                  <div className="flex items-center">
                    <Hash className="h-4 w-4 mr-1 text-gray-400" />
                    <span className="font-medium mr-1">TVA :</span>
                    {clientData.tva}
                  </div>
                )}
                {clientData.naf && (
                  <div className="flex items-center">
                    <Hash className="h-4 w-4 mr-1 text-gray-400" />
                    <span className="font-medium mr-1">Code NAF :</span>
                    {clientData.naf}
                  </div>
                )}
                {clientData.legalForm && (
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-1 text-purple-400" />
                    <span className="font-medium mr-1">Forme juridique :</span>
                    {clientData.legalForm}
                  </div>
                )}
                {clientData.rcs && (
                  <div className="flex items-center">
                    <Hash className="h-4 w-4 mr-1 text-gray-400" />
                    <span className="font-medium mr-1">RCS :</span>
                    {clientData.rcs}
                  </div>
                )}
                {clientData.riskLevel && (
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1 text-red-400" />
                    <span className="font-medium mr-1">Risque :</span>
                    {clientData.riskLevel}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(totalAmount)}</div>
            <div className="text-sm text-gray-500">Montant dû</div>
            <div className="flex items-center space-x-2 mt-2">
              <button
                onClick={() => setShowPaymentModal(true)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Payer
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </button>
            </div>
          </div>
        </div>

        {/* Indicateurs de progression */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Montant Original</p>
                <p className="text-xl font-bold text-blue-900">{formatCurrency(totalOriginal)}</p>
              </div>
              <Euro className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Déjà Payé</p>
                <p className="text-xl font-bold text-green-900">{formatCurrency(paidAmount)}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Reste à Payer</p>
                <p className="text-xl font-bold text-red-900">{formatCurrency(totalAmount)}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Progression</p>
                <p className="text-xl font-bold text-purple-900">
                  {Math.round((paidAmount / totalOriginal) * 100)}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progression du recouvrement</span>
            <span>{Math.round((paidAmount / totalOriginal) * 100)}% complété</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${(paidAmount / totalOriginal) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: Eye },
              { id: 'timeline', label: 'Chronologie', icon: Activity },
              { id: 'invoices', label: 'Factures', icon: FileText },
              { id: 'payments', label: 'Échéancier', icon: Calendar },
              { id: 'communications', label: 'Communications', icon: MessageSquare },
              { id: 'documents', label: 'Documents', icon: Archive }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Onglet Vue d'ensemble */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Statut actuel */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Statut Actuel</h3>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
                      <div>
                        <h4 className="font-medium text-red-900">Dossier Critique</h4>
                        <p className="text-sm text-red-700">Intervention urgente requise</p>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-red-700">
                      <p>• Factures en retard depuis plus de 30 jours</p>
                      <p>• Relances multiples sans réponse</p>
                      <p>• Risque de passage en contentieux</p>
                    </div>
                  </div>
                </div>

                {/* Prochaines actions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Prochaines Actions</h3>
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <Clock className="h-5 w-5 text-yellow-600 mr-3" />
                      <div>
                        <p className="font-medium text-yellow-900">Échéance de paiement</p>
                        <p className="text-sm text-yellow-700">20 décembre 2024 - 5 000€</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <Phone className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <p className="font-medium text-blue-900">Appel de suivi prévu</p>
                        <p className="text-sm text-blue-700">18 décembre 2024 - Marie Dubois</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Résumé des factures */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé des Factures</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Facture</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Échéance</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Retard</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {invoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{invoice.id}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(invoice.amount)}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {new Date(invoice.dueDate).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-4 py-3 text-sm text-red-600">{invoice.daysOverdue} jours</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                              invoice.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {invoice.status === 'overdue' ? 'En retard' :
                               invoice.status === 'partial' ? 'Partiel' : 'Payé'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Chronologie */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Historique Complet</h3>
                <div className="flex items-center space-x-3">
                  <select 
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="all">Toute la période</option>
                    <option value="week">7 derniers jours</option>
                    <option value="month">30 derniers jours</option>
                    <option value="quarter">3 derniers mois</option>
                  </select>
                  <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </button>
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                <div className="space-y-6">
                  {timeline.map((event, index) => {
                    const EventIcon = getEventIcon(event.type);
                    const statusConfig = getStatusConfig(event.status);
                    const StatusIcon = statusConfig.icon;
                    const isExpanded = expandedEvent === event.id;
                    
                    return (
                      <div key={event.id} className="relative flex items-start">
                        <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center ${getEventColor(event.type)} relative z-10`}>
                          <EventIcon className="h-6 w-6" />
                        </div>
                        
                        <div className="ml-6 flex-1">
                          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {event.status === 'completed' ? 'Terminé' :
                                     event.status === 'pending' ? 'En attente' : 'Échec'}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                                <p className="text-xs text-gray-500 mt-2">
                                  {new Date(event.date).toLocaleString('fr-FR')}
                                </p>
                              </div>
                              
                              <button
                                onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                              >
                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </button>
                            </div>
                            
                            {isExpanded && event.details && (
                              <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="space-y-2 text-sm">
                                  {event.type === 'communication' && (
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <span className="font-medium text-gray-700">Type:</span>
                                        <span className="ml-2 text-gray-600">
                                          {event.details.type === 'email' ? 'Email' :
                                           event.details.type === 'call' ? 'Appel téléphonique' : 'SMS'}
                                        </span>
                                      </div>
                                      {event.details.subject && (
                                        <div>
                                          <span className="font-medium text-gray-700">Sujet:</span>
                                          <span className="ml-2 text-gray-600">{event.details.subject}</span>
                                        </div>
                                      )}
                                      {event.details.duration && (
                                        <div>
                                          <span className="font-medium text-gray-700">Durée:</span>
                                          <span className="ml-2 text-gray-600">{event.details.duration}</span>
                                        </div>
                                      )}
                                      {event.details.outcome && (
                                        <div className="col-span-2">
                                          <span className="font-medium text-gray-700">Résultat:</span>
                                          <span className="ml-2 text-gray-600">{event.details.outcome}</span>
                                        </div>
                                      )}
                                      {event.details.notes && (
                                        <div className="col-span-2">
                                          <span className="font-medium text-gray-700">Notes:</span>
                                          <span className="ml-2 text-gray-600">{event.details.notes}</span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  
                                  {event.type === 'payment' && (
                                    <div className="grid grid-cols-2 gap-4">
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
                                      <div>
                                        <span className="font-medium text-gray-700">Référence:</span>
                                        <span className="ml-2 text-gray-600">{event.details.reference}</span>
                                      </div>
                                      <div>
                                        <span className="font-medium text-gray-700">Reste à payer:</span>
                                        <span className="ml-2 text-red-600 font-medium">
                                          {formatCurrency(event.details.remainingAmount)}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {event.type === 'document' && (
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <span className="font-medium text-gray-700">Type:</span>
                                        <span className="ml-2 text-gray-600">
                                          {event.details.type === 'registered_letter' ? 'Courrier recommandé' : 'Document'}
                                        </span>
                                      </div>
                                      {event.details.trackingNumber && (
                                        <div>
                                          <span className="font-medium text-gray-700">Suivi:</span>
                                          <span className="ml-2 text-blue-600">{event.details.trackingNumber}</span>
                                        </div>
                                      )}
                                      {event.details.delivered && (
                                        <div className="col-span-2">
                                          <span className="font-medium text-gray-700">Livré le:</span>
                                          <span className="ml-2 text-green-600">
                                            {new Date(event.details.deliveredAt).toLocaleString('fr-FR')}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Onglet Factures */}
          {activeTab === 'invoices' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Mes Factures</h3>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger tout
                </button>
              </div>

              <div className="grid gap-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{invoice.id}</h4>
                          <p className="text-sm text-gray-600">{invoice.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>Échéance: {new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</span>
                            <span className="text-red-600">Retard: {invoice.daysOverdue} jours</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{formatCurrency(invoice.amount)}</div>
                        {invoice.status === 'partial' && (
                          <div className="text-sm text-gray-500">
                            sur {formatCurrency(invoice.originalAmount)}
                          </div>
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                          <button className="flex items-center px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                            <CreditCard className="h-3 w-3 mr-1" />
                            Payer
                          </button>
                          <button className="flex items-center px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700">
                            <Download className="h-3 w-3 mr-1" />
                            PDF
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {invoice.status === 'partial' && invoice.paidAmount && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Déjà payé:</span>
                          <span className="text-green-600 font-medium">{formatCurrency(invoice.paidAmount)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(invoice.paidAmount / invoice.originalAmount) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Onglet Échéancier */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Plan de Paiement</h3>
                <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payer maintenant
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Info className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <h4 className="font-medium text-blue-900">Échéancier Négocié</h4>
                    <p className="text-sm text-blue-700">
                      Plan de paiement en 3 fois accepté suite à votre demande du 13 décembre 2024
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {paymentPlan.map((payment, index) => (
                  <div key={payment.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          payment.status === 'paid' ? 'bg-green-100 text-green-600' :
                          payment.status === 'overdue' ? 'bg-red-100 text-red-600' :
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Échéance #{index + 1}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {new Date(payment.dueDate).toLocaleDateString('fr-FR', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          {payment.paymentMethod && (
                            <p className="text-xs text-gray-500 mt-1">
                              Méthode suggérée: {payment.paymentMethod}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">
                          {formatCurrency(payment.amount)}
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                          payment.status === 'overdue' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {payment.status === 'paid' ? 'Payé' :
                           payment.status === 'overdue' ? 'En retard' : 'À venir'}
                        </span>
                        
                        {payment.status === 'pending' && (
                          <div className="mt-2">
                            <button className="flex items-center px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                              <CreditCard className="h-3 w-3 mr-1" />
                              Payer
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Total du plan:</span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatCurrency(paymentPlan.reduce((sum, p) => sum + p.amount, 0))}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Communications */}
          {activeTab === 'communications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Historique des Communications</h3>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Nouveau message
                </button>
              </div>

              <div className="space-y-4">
                {timeline.filter(event => event.type === 'communication').map((comm) => (
                  <div key={comm.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-lg ${getEventColor(comm.type)}`}>
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">{comm.title}</h4>
                          <span className="text-sm text-gray-500">
                            {new Date(comm.date).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{comm.description}</p>
                        
                        {comm.details && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            {comm.details.type === 'email' && (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-700">Sujet:</span>
                                  <span className="text-sm text-gray-600">{comm.details.subject}</span>
                                </div>
                                {comm.details.opened && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">Lu le:</span>
                                    <span className="text-sm text-green-600">
                                      {new Date(comm.details.openedAt).toLocaleString('fr-FR')}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {comm.details.type === 'call' && (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-700">Durée:</span>
                                  <span className="text-sm text-gray-600">{comm.details.duration}</span>
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-gray-700">Résultat:</span>
                                  <p className="text-sm text-gray-600 mt-1">{comm.details.outcome}</p>
                                </div>
                                {comm.details.notes && (
                                  <div>
                                    <span className="text-sm font-medium text-gray-700">Notes:</span>
                                    <p className="text-sm text-gray-600 mt-1">{comm.details.notes}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Onglet Documents */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Documents du Dossier</h3>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger tout
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Facture FAC-2024-001.pdf', type: 'invoice', size: '245 KB', date: '2024-11-15' },
                  { name: 'Facture FAC-2024-002.pdf', type: 'invoice', size: '198 KB', date: '2024-12-01' },
                  { name: 'Mise en demeure.pdf', type: 'letter', size: '156 KB', date: '2024-12-12' },
                  { name: 'Accusé réception.pdf', type: 'receipt', size: '89 KB', date: '2024-12-13' },
                  { name: 'Plan de paiement.pdf', type: 'agreement', size: '134 KB', date: '2024-12-13' },
                  { name: 'Conditions générales.pdf', type: 'contract', size: '567 KB', date: '2024-01-15' }
                ].map((doc, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3">
                      <div className="bg-red-100 p-2 rounded-lg">
                        <FileText className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{doc.name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>{new Date(doc.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-3">
                      <button className="flex items-center px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
                        <Eye className="h-3 w-3 mr-1" />
                        Voir
                      </button>
                      <button className="flex items-center px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700">
                        <Download className="h-3 w-3 mr-1" />
                        Télécharger
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de paiement */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Effectuer un Paiement</h3>
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant à payer
                  </label>
                  <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Méthode de paiement
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option>Carte bancaire</option>
                    <option>Virement bancaire</option>
                    <option>Prélèvement SEPA</option>
                  </select>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button 
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Payer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DossierDetails;