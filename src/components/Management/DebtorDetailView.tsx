import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  FileText, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Building,
  User,
  MapPin,
  Hash,
  CreditCard,
  Download,
  Printer,
  Share2,
  MessageSquare,
  Target,
  TrendingUp,
  Eye,
  Edit3,
  X
} from 'lucide-react';
import { formatCurrency, getStatusConfig, getPriorityConfig, getRiskConfig } from '../../utils/dataUtils';

interface DebtorDetailViewProps {
  debtorId: string;
  onBack: () => void;
}

const DebtorDetailView: React.FC<DebtorDetailViewProps> = ({ debtorId, onBack }) => {
  const [debtor, setDebtor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Simuler le chargement des données du débiteur
  useEffect(() => {
    const fetchDebtorDetails = async () => {
      setIsLoading(true);
      try {
        // Dans une implémentation réelle, vous feriez un appel API ici
        // Simulation de données pour la démonstration
        const mockDebtor = {
          id: debtorId,
          name: "Jean Martin",
          email: "jean.martin@example.com",
          phone: "+33 1 23 45 67 89",
          company: "Martin SARL",
          address: "123 Rue de la Paix, 75001 Paris",
          status: "critical",
          recoveryStatus: "critical",
          totalAmount: 15750.50,
          originalAmount: 18250.50,
          paidAmount: 2500.00,
          daysOverdue: 45,
          priority: "urgent",
          riskLevel: "high",
          type: "company",
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-12-15T10:00:00Z",
          lastContact: "2024-12-10T14:30:00Z",
          notes: ["Client difficile à joindre", "Promesse de règlement au 15/12"],
          siret: "12345678901234",
          tva: "FR12345678901",
          legalForm: "SARL",
          contactName: "Jean Martin",
          contactRole: "Gérant",
          contactMobile: "+33 6 12 34 56 78",
          accountingContact: "Sophie Dupont",
          accountingEmail: "comptabilite@martin-sarl.fr",
          accountingPhone: "+33 1 23 45 67 90",
          paymentTerms: "30 jours",
          creditLimit: 20000,
          invoices: [
            {
              id: "inv1",
              number: "FAC-2024-001",
              amount: 8750.50,
              originalAmount: 8750.50,
              paidAmount: 0,
              dueDate: "2024-11-15",
              issueDate: "2024-10-15",
              status: "overdue",
              description: "Prestations de conseil - Novembre 2024"
            },
            {
              id: "inv2",
              number: "FAC-2024-002",
              amount: 4500.00,
              originalAmount: 7000.00,
              paidAmount: 2500.00,
              dueDate: "2024-12-01",
              status: "partial",
              description: "Services de maintenance - Décembre 2024"
            },
            {
              id: "inv3",
              number: "FAC-2024-003",
              amount: 2500.00,
              originalAmount: 2500.00,
              paidAmount: 0,
              dueDate: "2024-12-31",
              status: "pending",
              description: "Formation équipe - Décembre 2024"
            }
          ],
          payments: [
            {
              id: "pay1",
              amount: 2500.00,
              date: "2024-12-10",
              method: "Virement bancaire",
              reference: "VIR-20241210-001",
              status: "completed",
              invoiceId: "inv2"
            }
          ],
          communications: [
            {
              id: "comm1",
              type: "email",
              subject: "Relance facture FAC-2024-001",
              content: "Bonjour Monsieur Martin,\n\nNous vous rappelons que votre facture FAC-2024-001 d'un montant de 8750,50€ est échue depuis 30 jours.\n\nMerci de procéder au règlement dans les plus brefs délais.\n\nCordialement,\nMarie Dubois\nService Recouvrement",
              status: "delivered",
              sentAt: "2024-12-14T14:00:00Z"
            },
            {
              id: "comm2",
              type: "call",
              subject: "Suivi relance",
              content: "Client contacté par téléphone. Promesse de paiement pour le 20/12 (3000€) et mise en place d'un échéancier pour le solde.",
              status: "responded",
              sentAt: "2024-12-15T10:30:00Z"
            }
          ],
          documents: [
            {
              id: "doc1",
              name: "Contrat de service",
              type: "contract",
              size: "1.2 MB",
              date: "2024-01-15"
            },
            {
              id: "doc2",
              name: "Relance email 1",
              type: "communication",
              size: "45 KB",
              date: "2024-12-14"
            }
          ],
          nextAction: {
            type: "Appel de suivi",
            date: "2024-12-16T09:00:00Z",
            description: "Vérifier le respect de la promesse de paiement"
          }
        };
        
        // Simuler un délai réseau
        setTimeout(() => {
          setDebtor(mockDebtor);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching debtor details:', error);
        setIsLoading(false);
      }
    };
    
    fetchDebtorDetails();
  }, [debtorId]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!debtor) {
    return (
      <div className="p-6">
        <button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </button>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Débiteur non trouvé</h3>
          <p className="text-gray-500 mt-2">Le débiteur demandé n'existe pas ou a été supprimé.</p>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(debtor.status);
  const recoveryStatusConfig = getStatusConfig(debtor.recoveryStatus);
  const priorityConfig = getPriorityConfig(debtor.priority);
  const riskConfig = getRiskConfig(debtor.riskLevel);
  
  const recoveryRate = debtor.originalAmount > 0 
    ? (debtor.paidAmount / debtor.originalAmount) * 100 
    : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </button>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Edit3 className="h-4 w-4 mr-2" />
            Modifier
          </button>
          <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </button>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* En-tête du dossier */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${
              debtor.recoveryStatus === 'critical' ? 'bg-red-100' :
              debtor.recoveryStatus === 'orange' ? 'bg-orange-100' :
              debtor.recoveryStatus === 'yellow' ? 'bg-yellow-100' : 'bg-blue-100'
            }`}>
              {debtor.type === 'company' ? (
                <Building className={`h-6 w-6 ${
                  debtor.recoveryStatus === 'critical' ? 'text-red-600' :
                  debtor.recoveryStatus === 'orange' ? 'text-orange-600' :
                  debtor.recoveryStatus === 'yellow' ? 'text-yellow-600' : 'text-blue-600'
                }`} />
              ) : (
                <User className={`h-6 w-6 ${
                  debtor.recoveryStatus === 'critical' ? 'text-red-600' :
                  debtor.recoveryStatus === 'orange' ? 'text-orange-600' :
                  debtor.recoveryStatus === 'yellow' ? 'text-yellow-600' : 'text-blue-600'
                }`} />
              )}
            </div>
            
            <div className="ml-4">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">{debtor.name}</h1>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${recoveryStatusConfig.color}`}>
                  {recoveryStatusConfig.label}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig.color}`}>
                  {priorityConfig.label}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
                {debtor.company && (
                  <span className="flex items-center">
                    <Building className="h-4 w-4 mr-1 text-gray-400" />
                    {debtor.company}
                  </span>
                )}
                <span className="flex items-center">
                  <Mail className="h-4 w-4 mr-1 text-gray-400" />
                  {debtor.email}
                </span>
                <span className="flex items-center">
                  <Phone className="h-4 w-4 mr-1 text-gray-400" />
                  {debtor.phone}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(debtor.totalAmount)}</div>
            <div className="text-sm text-gray-500">
              {debtor.paidAmount > 0 ? (
                <span>{formatCurrency(debtor.paidAmount)} payés sur {formatCurrency(debtor.originalAmount)}</span>
              ) : (
                <span>Montant original: {formatCurrency(debtor.originalAmount)}</span>
              )}
            </div>
            
            <div className="flex space-x-2 mt-3">
              <button className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                <Phone className="h-4 w-4 mr-1" />
                Appeler
              </button>
              <button className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors">
                <Mail className="h-4 w-4 mr-1" />
                Email
              </button>
              <button className="flex items-center px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors">
                <MessageSquare className="h-4 w-4 mr-1" />
                SMS
              </button>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-5">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progression du recouvrement</span>
            <span>{recoveryRate.toFixed(1)}% complété</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-500 h-2.5 rounded-full transition-all duration-1000"
              style={{ width: `${recoveryRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Vue d'ensemble
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Informations détaillées
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 ${
                activeTab === 'invoices'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Factures
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 ${
                activeTab === 'payments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Paiements
            </button>
            <button
              onClick={() => setActiveTab('communications')}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 ${
                activeTab === 'communications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Communications
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 ${
                activeTab === 'documents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Documents
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Onglet Vue d'ensemble */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <p>• Factures en retard depuis plus de {debtor.daysOverdue} jours</p>
                      <p>• Relances multiples sans réponse</p>
                      <p>• Risque de passage en contentieux</p>
                    </div>
                  </div>
                </div>

                {/* Prochaines actions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Prochaines Actions</h3>
                  {debtor.nextAction ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <Target className="h-6 w-6 text-blue-600 mr-3" />
                        <div>
                          <h4 className="font-medium text-blue-900">{debtor.nextAction.type}</h4>
                          <p className="text-sm text-blue-700">
                            {new Date(debtor.nextAction.date).toLocaleDateString('fr-FR')} - {debtor.nextAction.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                      <p className="text-gray-500">Aucune action planifiée</p>
                    </div>
                  )}
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <Clock className="h-6 w-6 text-yellow-600 mr-3" />
                      <div>
                        <h4 className="font-medium text-yellow-900">Échéance de paiement</h4>
                        <p className="text-sm text-yellow-700">20 décembre 2024 - 3000€</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes et commentaires */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
                {debtor.notes && debtor.notes.length > 0 ? (
                  <div className="space-y-2">
                    {debtor.notes.map((note: string, index: number) => (
                      <div key={index} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <p className="text-gray-700">{note}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                    <p className="text-gray-500">Aucune note disponible</p>
                  </div>
                )}
              </div>

              {/* Résumé des factures */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Factures</h3>
                  <button 
                    onClick={() => setActiveTab('invoices')}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Voir toutes les factures
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Facture</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {debtor.invoices.map((invoice: any) => (
                        <tr key={invoice.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 text-gray-400 mr-3" />
                              <div className="text-sm font-medium text-gray-900">{invoice.number}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">Émise: {new Date(invoice.issueDate).toLocaleDateString('fr-FR')}</div>
                            <div className="text-sm text-gray-500">Échéance: {new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{formatCurrency(invoice.amount)}</div>
                            {invoice.paidAmount > 0 && (
                              <div className="text-xs text-green-600">Payé: {formatCurrency(invoice.paidAmount)}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                              invoice.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                              invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {invoice.status === 'paid' ? 'Payée' :
                               invoice.status === 'partial' ? 'Partielle' :
                               invoice.status === 'overdue' ? 'En retard' :
                               'En attente'}
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

          {/* Onglet Informations détaillées */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informations générales */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Informations générales</h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-start">
                      <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Nom complet</p>
                        <p className="text-gray-900">{debtor.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Email</p>
                        <p className="text-gray-900">{debtor.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Téléphone</p>
                        <p className="text-gray-900">{debtor.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Mobile</p>
                        <p className="text-gray-900">{debtor.contactMobile}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Adresse</p>
                        <p className="text-gray-900">{debtor.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Informations entreprise */}
                {debtor.type === 'company' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Informations entreprise</h3>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                      <div className="flex items-start">
                        <Building className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Raison sociale</p>
                          <p className="text-gray-900">{debtor.company}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Hash className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">SIRET</p>
                          <p className="text-gray-900">{debtor.siret}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Hash className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">TVA</p>
                          <p className="text-gray-900">{debtor.tva}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Building className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Forme juridique</p>
                          <p className="text-gray-900">{debtor.legalForm}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Contact comptabilité */}
                {debtor.type === 'company' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Contact comptabilité</h3>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                      <div className="flex items-start">
                        <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Nom</p>
                          <p className="text-gray-900">{debtor.accountingContact}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Email</p>
                          <p className="text-gray-900">{debtor.accountingEmail}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Téléphone</p>
                          <p className="text-gray-900">{debtor.accountingPhone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Informations financières */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Informations financières</h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-start">
                      <CreditCard className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Conditions de paiement</p>
                        <p className="text-gray-900">{debtor.paymentTerms}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <TrendingUp className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Limite de crédit</p>
                        <p className="text-gray-900">{formatCurrency(debtor.creditLimit)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Niveau de risque</p>
                        <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${riskConfig.color}`}>
                          {riskConfig.label}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Dates importantes */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Dates importantes</h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Création du dossier</p>
                        <p className="text-gray-900">{new Date(debtor.createdAt).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Dernière mise à jour</p>
                        <p className="text-gray-900">{new Date(debtor.updatedAt).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Dernier contact</p>
                        <p className="text-gray-900">{new Date(debtor.lastContact).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Factures */}
          {activeTab === 'invoices' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Factures</h3>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </button>
              </div>
              
              <div className="space-y-4">
                {debtor.invoices.map((invoice: any) => (
                  <div key={invoice.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${
                          invoice.status === 'paid' ? 'bg-green-100' :
                          invoice.status === 'partial' ? 'bg-yellow-100' :
                          invoice.status === 'overdue' ? 'bg-red-100' : 'bg-blue-100'
                        }`}>
                          <FileText className={`h-6 w-6 ${
                            invoice.status === 'paid' ? 'text-green-600' :
                            invoice.status === 'partial' ? 'text-yellow-600' :
                            invoice.status === 'overdue' ? 'text-red-600' : 'text-blue-600'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{invoice.number}</h4>
                          <p className="text-sm text-gray-600">{invoice.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>Émise: {new Date(invoice.issueDate).toLocaleDateString('fr-FR')}</span>
                            <span>Échéance: {new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</span>
                            {new Date(invoice.dueDate) < new Date() && invoice.status !== 'paid' && (
                              <span className="text-red-600">
                                En retard de {Math.floor((new Date().getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24))} jours
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">{formatCurrency(invoice.amount)}</div>
                        {invoice.status === 'partial' && (
                          <div className="text-sm text-gray-500">
                            sur {formatCurrency(invoice.originalAmount)}
                          </div>
                        )}
                        {invoice.paidAmount > 0 && (
                          <div className="text-sm text-green-600">
                            Payé: {formatCurrency(invoice.paidAmount)}
                          </div>
                        )}
                        <div className="mt-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                            invoice.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                            invoice.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {invoice.status === 'paid' ? 'Payée' :
                             invoice.status === 'partial' ? 'Partielle' :
                             invoice.status === 'overdue' ? 'En retard' : 'En attente'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Barre de progression pour les paiements partiels */}
                    {invoice.status === 'partial' && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Progression du paiement</span>
                          <span>{Math.round((invoice.paidAmount / invoice.originalAmount) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(invoice.paidAmount / invoice.originalAmount) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-2">
                      <button className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                        <Eye className="h-4 w-4 mr-1.5" />
                        Voir
                      </button>
                      <button className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors">
                        <CreditCard className="h-4 w-4 mr-1.5" />
                        Enregistrer paiement
                      </button>
                      <button className="flex items-center px-3 py-1.5 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors">
                        <Download className="h-4 w-4 mr-1.5" />
                        Télécharger
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Onglet Paiements */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Paiements</h3>
                <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Nouveau paiement
                </button>
              </div>
              
              {debtor.payments && debtor.payments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Méthode</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Référence</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Facture</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {debtor.payments.map((payment: any) => {
                        const invoice = debtor.invoices.find((inv: any) => inv.id === payment.invoiceId);
                        return (
                          <tr key={payment.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(payment.date).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatCurrency(payment.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {payment.method}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {payment.reference || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {invoice ? invoice.number : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {payment.status === 'completed' ? 'Complété' :
                                 payment.status === 'pending' ? 'En attente' :
                                 payment.status === 'failed' ? 'Échoué' :
                                 'Programmé'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-900 mr-3">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-gray-600 hover:text-gray-900">
                                <Download className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                  <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h4 className="text-lg font-medium text-gray-900 mb-1">Aucun paiement</h4>
                  <p className="text-gray-500 mb-4">Ce débiteur n'a effectué aucun paiement.</p>
                  <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Enregistrer un paiement
                  </button>
                </div>
              )}
              
              {/* Plan de paiement */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan de paiement</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                    <h4 className="font-medium text-gray-900">Échéancier négocié</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div>
                        <p className="font-medium text-blue-900">Échéance #1</p>
                        <p className="text-sm text-blue-700">20 décembre 2024</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-blue-900">{formatCurrency(3000)}</p>
                        <p className="text-xs text-blue-700">Virement bancaire</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div>
                        <p className="font-medium text-blue-900">Échéance #2</p>
                        <p className="text-sm text-blue-700">20 janvier 2025</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-blue-900">{formatCurrency(5000)}</p>
                        <p className="text-xs text-blue-700">Virement bancaire</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div>
                        <p className="font-medium text-blue-900">Échéance #3</p>
                        <p className="text-sm text-blue-700">20 février 2025</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-blue-900">{formatCurrency(7750.50)}</p>
                        <p className="text-xs text-blue-700">Virement bancaire</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Communications */}
          {activeTab === 'communications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Communications</h3>
                <div className="flex space-x-2">
                  <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </button>
                  <button className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    SMS
                  </button>
                  <button className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    <Phone className="h-4 w-4 mr-2" />
                    Appel
                  </button>
                </div>
              </div>
              
              {debtor.communications && debtor.communications.length > 0 ? (
                <div className="space-y-4">
                  {debtor.communications.map((comm: any) => (
                    <div key={comm.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className={`p-2 rounded-lg ${
                          comm.type === 'email' ? 'bg-blue-100' :
                          comm.type === 'sms' ? 'bg-green-100' :
                          comm.type === 'call' ? 'bg-purple-100' :
                          'bg-orange-100'
                        }`}>
                          {comm.type === 'email' && <Mail className="h-5 w-5 text-blue-600" />}
                          {comm.type === 'sms' && <MessageSquare className="h-5 w-5 text-green-600" />}
                          {comm.type === 'call' && <Phone className="h-5 w-5 text-purple-600" />}
                          {comm.type === 'letter' && <FileText className="h-5 w-5 text-orange-600" />}
                        </div>
                        
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{comm.subject || `${comm.type.charAt(0).toUpperCase() + comm.type.slice(1)}`}</h4>
                              <p className="text-sm text-gray-500">{new Date(comm.sentAt).toLocaleString('fr-FR')}</p>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              comm.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                              comm.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              comm.status === 'read' ? 'bg-purple-100 text-purple-800' :
                              comm.status === 'responded' ? 'bg-indigo-100 text-indigo-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {comm.status === 'sent' ? 'Envoyé' :
                               comm.status === 'delivered' ? 'Délivré' :
                               comm.status === 'read' ? 'Lu' :
                               comm.status === 'responded' ? 'Répondu' : 'Échec'}
                            </span>
                          </div>
                          
                          <div className="mt-2 text-sm text-gray-600 whitespace-pre-line">
                            {comm.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h4 className="text-lg font-medium text-gray-900 mb-1">Aucune communication</h4>
                  <p className="text-gray-500">Aucune communication n'a été enregistrée pour ce débiteur.</p>
                </div>
              )}
            </div>
          )}

          {/* Onglet Documents */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger tout
                </button>
              </div>
              
              {debtor.documents && debtor.documents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {debtor.documents.map((doc: any) => (
                    <div key={doc.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
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
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h4 className="text-lg font-medium text-gray-900 mb-1">Aucun document</h4>
                  <p className="text-gray-500">Aucun document n'a été enregistré pour ce débiteur.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebtorDetailView;