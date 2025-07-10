import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Key, 
  Shield, 
  Bell, 
  Eye, 
  EyeOff, 
  Save,
  X,
  Clock,
  Calendar,
  Globe,
  Settings,
  CheckCircle,
  AlertCircle,
  Lock,
  Smartphone,
  FileText,
  Upload,
  Camera,
  LogOut,
  CreditCard,
  Download,
  Printer,
  Share2,
  Info,
  Building,
  Edit3,
  Trash2,
  Plus,
  Hash,
  MapPin,
  Briefcase,
  FileCheck,
  DollarSign,
  Paperclip,
  MessageSquare,
  BarChart3,
  Target,
  Flag,
  Users
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCrm } from '../../contexts/CrmContext';
import { formatCurrency } from '../../utils/dataUtils';

interface UserAccountSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserAccountSettings: React.FC<UserAccountSettingsProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { clients, invoices } = useCrm();
  const [activeTab, setActiveTab] = useState('profile');
  const [hasChanges, setHasChanges] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [clientData, setClientData] = useState<any>(null);

  // Trouver les données du client correspondant à l'utilisateur connecté
  useEffect(() => {
    if (user) {
      const client = clients.find(c => c.user_id === user.id || c.email === user.email);
      if (client) {
        setClientData(client);
      }
    }
  }, [user, clients]);

  // États pour les différentes sections de paramètres
  const [profileSettings, setProfileSettings] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    company: '',
    address: '',
    contactPreference: 'email',
    avatar: null as File | null,
    // Informations administratives
    dossierNumber: '',
    status: 'new',
    debtorType: 'company',
    civility: 'M.',
    firstName: '',
    birthDate: '',
    nationality: 'Française',
    identificationNumber: '',
    // Localisation et structure juridique
    secondaryAddress: '',
    city: '',
    postalCode: '',
    country: 'France',
    legalForm: 'SARL',
    socialCapital: '',
    rcs: '',
    naf: '',
    mainActivity: '',
    // Contacts et représentants légaux
    legalRepresentative: '',
    function: '',
    mobilePhone: '',
    accountantName: '',
    accountingFirm: '',
    accountantEmail: ''
  });

  // Mettre à jour les paramètres du profil avec les données du client
  useEffect(() => {
    if (clientData) {
      setProfileSettings({
        ...profileSettings,
        name: clientData.name || user?.name || '',
        email: clientData.email || user?.email || '',
        phone: clientData.phone || '',
        company: clientData.company || '',
        address: clientData.address || '',
        debtorType: clientData.debtorType || 'company',
        dossierNumber: clientData.id?.substring(0, 8) || '',
        status: clientData.status === 'blue' ? 'new' : 
                clientData.status === 'yellow' ? 'inProgress' : 
                clientData.status === 'orange' ? 'inProgress' : 'litigation',
        civility: clientData.civility || 'M.',
        firstName: clientData.firstName || '',
        birthDate: clientData.birthDate || '',
        nationality: clientData.nationality || 'Française',
        identificationNumber: clientData.siret || clientData.cin || clientData.tva || '',
        secondaryAddress: clientData.secondaryAddress || '',
        city: clientData.city || '',
        postalCode: clientData.postalCode || '',
        country: clientData.country || 'France',
        legalForm: clientData.legalForm || 'SARL',
        socialCapital: clientData.socialCapital || '',
        rcs: clientData.rcs || '',
        naf: clientData.naf || '',
        mainActivity: clientData.mainActivity || '',
        legalRepresentative: clientData.contactName || clientData.name || '',
        function: clientData.contactRole || '',
        mobilePhone: clientData.contactMobile || clientData.phone || '',
        accountantName: clientData.accountingContact || '',
        accountingFirm: clientData.accountingFirm || '',
        accountantEmail: clientData.accountingEmail || ''
      });
    }
  }, [clientData, user]);

  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    loginNotifications: true,
    lastPasswordChange: '2024-11-15',
    lastLogin: '2024-12-15 14:30:00'
  });

  const [paymentSettings, setPaymentSettings] = useState({
    defaultMethod: 'card',
    savedMethods: [
      { id: '1', type: 'card', name: 'Visa **** 1234', isDefault: true },
      { id: '2', type: 'bank', name: 'Virement IBAN **** 5678', isDefault: false }
    ],
    autoPayEnabled: false,
    paymentReminders: true,
    receiptsByEmail: true,
    // Détails de la créance
    totalAmount: 0,
    htAmount: 0,
    tvaAmount: 0,
    initialInstallments: 1,
    originalSchedule: false,
    invoiceDates: '',
    invoiceNumbers: '',
    lastPaymentDate: '',
    lastPaymentAmount: 0,
    paymentMethod: 'virement'
  });

  // Mettre à jour les paramètres de paiement avec les données du client
  useEffect(() => {
    if (clientData) {
      const clientInvoices = invoices.filter(inv => inv.client_id === clientData.id);
      const invoiceNumbers = clientInvoices.map(inv => inv.invoice_number).join(', ');
      const invoiceDates = clientInvoices.map(inv => new Date(inv.issue_date).toLocaleDateString('fr-FR')).join(', ');
      
      setPaymentSettings({
        ...paymentSettings,
        totalAmount: clientData.total_amount || 0,
        htAmount: Math.round(clientData.total_amount * 0.8) || 0,
        tvaAmount: Math.round(clientData.total_amount * 0.2) || 0,
        invoiceNumbers,
        invoiceDates
      });
    }
  }, [clientData, invoices]);

  const [communicationSettings, setCommunicationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    paymentReminders: true,
    invoiceNotifications: true,
    statusUpdates: true,
    marketingEmails: false
  });

  const [legalSettings, setLegalSettings] = useState({
    contractSigned: false,
    serviceType: '',
    generalConditionsAccepted: false,
    penaltyClause: false,
    ongoingDispute: false,
    disputeNature: ''
  });

  const [situationAnalysis, setSituationAnalysis] = useState({
    paymentCapacity: 'unknown',
    paymentIntention: 'unknown',
    financialDifficultySigns: false,
    difficultCompanyRegistry: false,
    bankruptcyProcedure: false,
    bankruptcyDate: ''
  });

  const [remindersHistory, setRemindersHistory] = useState([
    { type: 'reminder1', date: '', mode: 'email', response: '' },
    { type: 'reminder2', date: '', mode: 'email', response: '' },
    { type: 'formalNotice', date: '', mode: 'letter', response: '' },
    { type: 'lastContact', date: '', mode: '', response: '' }
  ]);

  const [actionPlan, setActionPlan] = useState([
    { action: 'friendlyCall', responsible: '', deadline: '', status: 'pending' },
    { action: 'paymentPlanProposal', responsible: '', deadline: '', status: 'pending' },
    { action: 'formalNotice', responsible: '', deadline: '', status: 'pending' },
    { action: 'legalAction', responsible: '', deadline: '', status: 'pending' },
    { action: 'bailiff', responsible: '', deadline: '', status: 'pending' }
  ]);

  const [attachedDocuments, setAttachedDocuments] = useState({
    contract: false,
    invoices: false,
    paymentHistory: false,
    emailExchanges: false,
    formalNotice: false,
    debtorBankDetails: false,
    solvencyReport: false,
    certificate: false
  });

  // Mettre à jour les paramètres avec les données du client
  useEffect(() => {
    if (clientData) {
      // Mettre à jour les reminders avec les communications
      if (clientData.last_contact) {
        const updatedReminders = [...remindersHistory];
        updatedReminders[3] = {
          ...updatedReminders[3],
          date: new Date(clientData.last_contact).toISOString().split('T')[0],
          mode: 'email',
          response: 'Accusé de réception'
        };
        setRemindersHistory(updatedReminders);
      }

      // Mettre à jour l'analyse de situation
      setSituationAnalysis({
        ...situationAnalysis,
        paymentCapacity: clientData.status === 'critical' ? 'low' : 
                         clientData.status === 'orange' ? 'medium' : 'high',
        paymentIntention: clientData.status === 'critical' ? 'dispute' : 'goodFaith',
        financialDifficultySigns: clientData.status === 'critical' || clientData.status === 'orange'
      });

      // Mettre à jour les documents attachés
      setAttachedDocuments({
        ...attachedDocuments,
        invoices: true,
        emailExchanges: true
      });

      // Mettre à jour les paramètres légaux
      setLegalSettings({
        ...legalSettings,
        contractSigned: true,
        serviceType: clientData.mainActivity || 'Services professionnels',
        generalConditionsAccepted: true,
        penaltyClause: true
      });
    }
  }, [clientData]);

  const handleSave = () => {
    // Simulation de sauvegarde
    console.log('Saving settings:', {
      profile: profileSettings,
      security: securitySettings,
      payment: paymentSettings,
      communication: communicationSettings,
      legal: legalSettings,
      situationAnalysis,
      remindersHistory,
      actionPlan,
      attachedDocuments
    });
    
    setSuccessMessage('Paramètres sauvegardés avec succès');
    setTimeout(() => setSuccessMessage(null), 3000);
    
    setHasChanges(false);
  };

  const handlePasswordChange = () => {
    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
    
    if (securitySettings.newPassword.length < 8) {
      setErrorMessage('Le mot de passe doit contenir au moins 8 caractères');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
    
    // Simulation de changement de mot de passe
    console.log('Changing password');
    setSuccessMessage('Mot de passe modifié avec succès');
    setTimeout(() => setSuccessMessage(null), 3000);
    
    setSecuritySettings({
      ...securitySettings,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      lastPasswordChange: new Date().toISOString().split('T')[0]
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileSettings({
        ...profileSettings,
        avatar: e.target.files[0]
      });
      setHasChanges(true);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Informations Administratives', icon: User },
    { id: 'location', label: 'Localisation & Structure', icon: MapPin },
    { id: 'contacts', label: 'Contacts & Représentants', icon: Users },
    { id: 'debt', label: 'Détails de la Créance', icon: DollarSign },
    { id: 'legal', label: 'Origine Juridique', icon: FileCheck },
    { id: 'reminders', label: 'Relances Effectuées', icon: MessageSquare },
    { id: 'analysis', label: 'Analyse de Situation', icon: BarChart3 },
    { id: 'action', label: 'Plan d\'Action', icon: Target },
    { id: 'documents', label: 'Documents Joints', icon: Paperclip },
    { id: 'security', label: 'Sécurité', icon: Shield }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 p-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Mon Compte</h3>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 md:hidden">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex flex-col items-center mb-6 pb-6 border-b border-gray-200">
            <div className="relative mb-3">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                {profileSettings.avatar ? (
                  <img 
                    src={URL.createObjectURL(profileSettings.avatar)} 
                    alt="Avatar" 
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-semibold text-blue-700">
                    {profileSettings.name.split(' ').map(n => n[0]).join('')}
                  </span>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer">
                <Camera className="h-4 w-4" />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <h4 className="font-medium text-gray-900 text-center">{profileSettings.name}</h4>
            <p className="text-sm text-gray-500 text-center">Client</p>
            {clientData && (
              <div className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                Dossier #{clientData.id?.substring(0, 8)}
              </div>
            )}
          </div>
          
          <nav className="space-y-2 overflow-y-auto max-h-[calc(100vh-300px)]">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </nav>
          
          <div className="mt-auto pt-6">
            <button 
              onClick={logout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4 mr-3 flex-shrink-0" />
              <span className="truncate">Déconnexion</span>
            </button>
          </div>
          
          {hasChanges && (
            <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-yellow-600 mr-2 flex-shrink-0" />
                <span className="text-sm text-yellow-700">Modifications non sauvegardées</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {/* Notifications de succès/erreur */}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-sm text-green-700">{successMessage}</span>
                </div>
              </div>
            )}
            
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-600 mr-2 flex-shrink-0" />
                  <span className="text-sm text-red-700">{errorMessage}</span>
                </div>
              </div>
            )}

            {/* Onglet Informations Administratives */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Informations Administratives</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Numéro de dossier
                      </label>
                      <input
                        type="text"
                        value={profileSettings.dossierNumber}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Statut
                      </label>
                      <select
                        value={profileSettings.status}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      >
                        <option value="new">Nouveau</option>
                        <option value="inProgress">En cours</option>
                        <option value="litigation">Contentieux</option>
                        <option value="closed">Clôturé</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type de débiteur
                      </label>
                      <select
                        value={profileSettings.debtorType}
                        onChange={(e) => {
                          setProfileSettings({...profileSettings, debtorType: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="individual">Particulier</option>
                        <option value="company">Société</option>
                        <option value="association">Association</option>
                        <option value="administration">Administration</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>
                    
                    {profileSettings.debtorType === 'individual' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Civilité
                        </label>
                        <select
                          value={profileSettings.civility}
                          onChange={(e) => {
                            setProfileSettings({...profileSettings, civility: e.target.value});
                            setHasChanges(true);
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="M.">M.</option>
                          <option value="Mme">Mme</option>
                          <option value="Mx">Mx</option>
                        </select>
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {profileSettings.debtorType === 'company' ? 'Raison sociale' : 'Nom'}
                      </label>
                      <input
                        type="text"
                        value={profileSettings.name}
                        onChange={(e) => {
                          setProfileSettings({...profileSettings, name: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    {profileSettings.debtorType === 'individual' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prénom
                        </label>
                        <input
                          type="text"
                          value={profileSettings.firstName}
                          onChange={(e) => {
                            setProfileSettings({...profileSettings, firstName: e.target.value});
                            setHasChanges(true);
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}
                    
                    {profileSettings.debtorType === 'individual' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date de naissance
                        </label>
                        <input
                          type="date"
                          value={profileSettings.birthDate}
                          onChange={(e) => {
                            setProfileSettings({...profileSettings, birthDate: e.target.value});
                            setHasChanges(true);
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}
                    
                    {profileSettings.debtorType === 'company' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date de création
                        </label>
                        <input
                          type="date"
                          value={profileSettings.birthDate}
                          onChange={(e) => {
                            setProfileSettings({...profileSettings, birthDate: e.target.value});
                            setHasChanges(true);
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}
                    
                    {profileSettings.debtorType === 'individual' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nationalité
                        </label>
                        <input
                          type="text"
                          value={profileSettings.nationality}
                          onChange={(e) => {
                            setProfileSettings({...profileSettings, nationality: e.target.value});
                            setHasChanges(true);
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {profileSettings.debtorType === 'company' ? 'N° SIRET / TVA' : 'N° d\'identification (CIN)'}
                      </label>
                      <input
                        type="text"
                        value={profileSettings.identificationNumber}
                        onChange={(e) => {
                          setProfileSettings({...profileSettings, identificationNumber: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Localisation et Structure Juridique */}
            {activeTab === 'location' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Localisation et Structure Juridique</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse principale
                      </label>
                      <textarea
                        value={profileSettings.address}
                        onChange={(e) => {
                          setProfileSettings({...profileSettings, address: e.target.value});
                          setHasChanges(true);
                        }}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse secondaire
                      </label>
                      <textarea
                        value={profileSettings.secondaryAddress}
                        onChange={(e) => {
                          setProfileSettings({...profileSettings, secondaryAddress: e.target.value});
                          setHasChanges(true);
                        }}
                        rows={2}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ville
                      </label>
                      <input
                        type="text"
                        value={profileSettings.city}
                        onChange={(e) => {
                          setProfileSettings({...profileSettings, city: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Code postal
                      </label>
                      <input
                        type="text"
                        value={profileSettings.postalCode}
                        onChange={(e) => {
                          setProfileSettings({...profileSettings, postalCode: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pays
                      </label>
                      <input
                        type="text"
                        value={profileSettings.country}
                        onChange={(e) => {
                          setProfileSettings({...profileSettings, country: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    {profileSettings.debtorType === 'company' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Forme juridique
                        </label>
                        <select
                          value={profileSettings.legalForm}
                          onChange={(e) => {
                            setProfileSettings({...profileSettings, legalForm: e.target.value});
                            setHasChanges(true);
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="SARL">SARL</option>
                          <option value="SAS">SAS</option>
                          <option value="SA">SA</option>
                          <option value="Auto-entrepreneur">Auto-entrepreneur</option>
                          <option value="Autre">Autre</option>
                        </select>
                      </div>
                    )}
                    
                    {profileSettings.debtorType === 'company' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Capital social (€)
                        </label>
                        <input
                          type="text"
                          value={profileSettings.socialCapital}
                          onChange={(e) => {
                            setProfileSettings({...profileSettings, socialCapital: e.target.value});
                            setHasChanges(true);
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}
                    
                    {profileSettings.debtorType === 'company' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Greffe / RCS
                        </label>
                        <input
                          type="text"
                          value={profileSettings.rcs}
                          onChange={(e) => {
                            setProfileSettings({...profileSettings, rcs: e.target.value});
                            setHasChanges(true);
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}
                    
                    {profileSettings.debtorType === 'company' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Code NAF / APE
                        </label>
                        <input
                          type="text"
                          value={profileSettings.naf}
                          onChange={(e) => {
                            setProfileSettings({...profileSettings, naf: e.target.value});
                            setHasChanges(true);
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}
                    
                    {profileSettings.debtorType === 'company' && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Activité principale
                        </label>
                        <input
                          type="text"
                          value={profileSettings.mainActivity}
                          onChange={(e) => {
                            setProfileSettings({...profileSettings, mainActivity: e.target.value});
                            setHasChanges(true);
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Contacts et Représentants Légaux */}
            {activeTab === 'contacts' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Contacts et Représentants Légaux</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Représentant légal
                      </label>
                      <input
                        type="text"
                        value={profileSettings.legalRepresentative}
                        onChange={(e) => {
                          setProfileSettings({...profileSettings, legalRepresentative: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fonction
                      </label>
                      <input
                        type="text"
                        value={profileSettings.function}
                        onChange={(e) => {
                          setProfileSettings({...profileSettings, function: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tél. professionnel
                      </label>
                      <input
                        type="tel"
                        value={profileSettings.phone}
                        onChange={(e) => {
                          setProfileSettings({...profileSettings, phone: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tél. mobile
                      </label>
                      <input
                        type="tel"
                        value={profileSettings.mobilePhone}
                        onChange={(e) => {
                          setProfileSettings({...profileSettings, mobilePhone: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email direct
                      </label>
                      <input
                        type="email"
                        value={profileSettings.email}
                        onChange={(e) => {
                          setProfileSettings({...profileSettings, email: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom du comptable (si connu)
                      </label>
                      <input
                        type="text"
                        value={profileSettings.accountantName}
                        onChange={(e) => {
                          setProfileSettings({...profileSettings, accountantName: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cabinet comptable
                      </label>
                      <input
                        type="text"
                        value={profileSettings.accountingFirm}
                        onChange={(e) => {
                          setProfileSettings({...profileSettings, accountingFirm: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email comptable
                      </label>
                      <input
                        type="email"
                        value={profileSettings.accountantEmail}
                        onChange={(e) => {
                          setProfileSettings({...profileSettings, accountantEmail: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Détails de la Créance */}
            {activeTab === 'debt' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Détails de la Créance</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Montant total dû (€)
                      </label>
                      <input
                        type="text"
                        value={paymentSettings.totalAmount}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Montant HT (€)
                        </label>
                        <input
                          type="text"
                          value={paymentSettings.htAmount}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          TVA (€)
                        </label>
                        <input
                          type="text"
                          value={paymentSettings.tvaAmount}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nbre d'échéances initiales
                      </label>
                      <input
                        type="number"
                        value={paymentSettings.initialInstallments}
                        onChange={(e) => {
                          setPaymentSettings({...paymentSettings, initialInstallments: parseInt(e.target.value)});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Échéancier original
                      </label>
                      <div className="flex items-center space-x-4 mt-2">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={paymentSettings.originalSchedule}
                            onChange={() => {
                              setPaymentSettings({...paymentSettings, originalSchedule: true});
                              setHasChanges(true);
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">Oui</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={!paymentSettings.originalSchedule}
                            onChange={() => {
                              setPaymentSettings({...paymentSettings, originalSchedule: false});
                              setHasChanges(true);
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">Non</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dates des factures concernées
                      </label>
                      <input
                        type="text"
                        value={paymentSettings.invoiceDates}
                        onChange={(e) => {
                          setPaymentSettings({...paymentSettings, invoiceDates: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Numéros des factures
                      </label>
                      <input
                        type="text"
                        value={paymentSettings.invoiceNumbers}
                        onChange={(e) => {
                          setPaymentSettings({...paymentSettings, invoiceNumbers: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dernier paiement effectué le
                      </label>
                      <input
                        type="date"
                        value={paymentSettings.lastPaymentDate}
                        onChange={(e) => {
                          setPaymentSettings({...paymentSettings, lastPaymentDate: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Montant du dernier paiement (€)
                      </label>
                      <input
                        type="number"
                        value={paymentSettings.lastPaymentAmount}
                        onChange={(e) => {
                          setPaymentSettings({...paymentSettings, lastPaymentAmount: parseFloat(e.target.value)});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Moyen de paiement
                      </label>
                      <select
                        value={paymentSettings.paymentMethod}
                        onChange={(e) => {
                          setPaymentSettings({...paymentSettings, paymentMethod: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="virement">Virement</option>
                        <option value="cheque">Chèque</option>
                        <option value="especes">Espèces</option>
                        <option value="prelevement">Prélèvement</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Origine Juridique de la Dette */}
            {activeTab === 'legal' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Origine Juridique de la Dette</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contrat signé ?
                      </label>
                      <div className="flex items-center space-x-4 mt-2">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={legalSettings.contractSigned}
                            onChange={() => {
                              setLegalSettings({...legalSettings, contractSigned: true});
                              setHasChanges(true);
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">Oui</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={!legalSettings.contractSigned}
                            onChange={() => {
                              setLegalSettings({...legalSettings, contractSigned: false});
                              setHasChanges(true);
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">Non</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type de prestation / produit livré
                      </label>
                      <input
                        type="text"
                        value={legalSettings.serviceType}
                        onChange={(e) => {
                          setLegalSettings({...legalSettings, serviceType: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Conditions générales acceptées ?
                      </label>
                      <div className="flex items-center space-x-4 mt-2">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={legalSettings.generalConditionsAccepted}
                            onChange={() => {
                              setLegalSettings({...legalSettings, generalConditionsAccepted: true});
                              setHasChanges(true);
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">Oui</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={!legalSettings.generalConditionsAccepted}
                            onChange={() => {
                              setLegalSettings({...legalSettings, generalConditionsAccepted: false});
                              setHasChanges(true);
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">Non</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Clause pénale / intérêts de retard ?
                      </label>
                      <div className="flex items-center space-x-4 mt-2">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={legalSettings.penaltyClause}
                            onChange={() => {
                              setLegalSettings({...legalSettings, penaltyClause: true});
                              setHasChanges(true);
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">Oui</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={!legalSettings.penaltyClause}
                            onChange={() => {
                              setLegalSettings({...legalSettings, penaltyClause: false});
                              setHasChanges(true);
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">Non</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Litige en cours ?
                      </label>
                      <div className="flex items-center space-x-4 mt-2">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={legalSettings.ongoingDispute}
                            onChange={() => {
                              setLegalSettings({...legalSettings, ongoingDispute: true});
                              setHasChanges(true);
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">Oui</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={!legalSettings.ongoingDispute}
                            onChange={() => {
                              setLegalSettings({...legalSettings, ongoingDispute: false});
                              setHasChanges(true);
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">Non</span>
                        </label>
                      </div>
                    </div>
                    
                    {legalSettings.ongoingDispute && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nature du litige
                        </label>
                        <input
                          type="text"
                          value={legalSettings.disputeNature}
                          onChange={(e) => {
                            setLegalSettings({...legalSettings, disputeNature: e.target.value});
                            setHasChanges(true);
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Relances Effectuées */}
            {activeTab === 'reminders' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Relances Effectuées</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type de relance
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mode
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Réponse
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {remindersHistory.map((reminder, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-900">
                                {reminder.type === 'reminder1' ? 'Relance 1' :
                                 reminder.type === 'reminder2' ? 'Relance 2' :
                                 reminder.type === 'formalNotice' ? 'Mise en demeure' : 'Dernier contact'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="date"
                                value={reminder.date}
                                onChange={(e) => {
                                  const newReminders = [...remindersHistory];
                                  newReminders[index] = { ...reminder, date: e.target.value };
                                  setRemindersHistory(newReminders);
                                  setHasChanges(true);
                                }}
                                className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={reminder.mode}
                                onChange={(e) => {
                                  const newReminders = [...remindersHistory];
                                  newReminders[index] = { ...reminder, mode: e.target.value };
                                  setRemindersHistory(newReminders);
                                  setHasChanges(true);
                                }}
                                className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                              >
                                <option value="">Sélectionner</option>
                                <option value="email">Email</option>
                                <option value="tel">Téléphone</option>
                                <option value="letter">Courrier</option>
                                <option value="rar">RAR</option>
                                <option value="bailiff">Huissier</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="text"
                                value={reminder.response}
                                onChange={(e) => {
                                  const newReminders = [...remindersHistory];
                                  newReminders[index] = { ...reminder, response: e.target.value };
                                  setRemindersHistory(newReminders);
                                  setHasChanges(true);
                                }}
                                className="px-2 py-1 border border-gray-300 rounded-md text-sm w-full"
                                placeholder="Réponse obtenue"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Analyse de Situation du Débiteur */}
            {activeTab === 'analysis' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Analyse de Situation du Débiteur</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Capacité de paiement
                      </label>
                      <select
                        value={situationAnalysis.paymentCapacity}
                        onChange={(e) => {
                          setSituationAnalysis({...situationAnalysis, paymentCapacity: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="unknown">Inconnue</option>
                        <option value="high">Forte</option>
                        <option value="medium">Moyenne</option>
                        <option value="low">Faible</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Intention de payer
                      </label>
                      <select
                        value={situationAnalysis.paymentIntention}
                        onChange={(e) => {
                          setSituationAnalysis({...situationAnalysis, paymentIntention: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="unknown">Inconnue</option>
                        <option value="goodFaith">Bonne foi</option>
                        <option value="badFaith">Mauvaise foi</option>
                        <option value="ignorance">Ignorance</option>
                        <option value="dispute">Contestation</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Signes de difficultés financières
                      </label>
                      <div className="flex items-center space-x-4 mt-2">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={situationAnalysis.financialDifficultySigns}
                            onChange={() => {
                              setSituationAnalysis({...situationAnalysis, financialDifficultySigns: true});
                              setHasChanges(true);
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">Oui</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={!situationAnalysis.financialDifficultySigns}
                            onChange={() => {
                              setSituationAnalysis({...situationAnalysis, financialDifficultySigns: false});
                              setHasChanges(true);
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">Non</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Inscription au fichier des entreprises en difficulté ?
                      </label>
                      <div className="flex items-center space-x-4 mt-2">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={situationAnalysis.difficultCompanyRegistry}
                            onChange={() => {
                              setSituationAnalysis({...situationAnalysis, difficultCompanyRegistry: true});
                              setHasChanges(true);
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">Oui</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={!situationAnalysis.difficultCompanyRegistry}
                            onChange={() => {
                              setSituationAnalysis({...situationAnalysis, difficultCompanyRegistry: false});
                              setHasChanges(true);
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">Non</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dépôt de bilan ou procédure collective ?
                      </label>
                      <div className="flex items-center space-x-4 mt-2">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={situationAnalysis.bankruptcyProcedure}
                            onChange={() => {
                              setSituationAnalysis({...situationAnalysis, bankruptcyProcedure: true});
                              setHasChanges(true);
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">Oui</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={!situationAnalysis.bankruptcyProcedure}
                            onChange={() => {
                              setSituationAnalysis({...situationAnalysis, bankruptcyProcedure: false});
                              setHasChanges(true);
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">Non</span>
                        </label>
                      </div>
                    </div>
                    
                    {situationAnalysis.bankruptcyProcedure && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date du dépôt de bilan
                        </label>
                        <input
                          type="date"
                          value={situationAnalysis.bankruptcyDate}
                          onChange={(e) => {
                            setSituationAnalysis({...situationAnalysis, bankruptcyDate: e.target.value});
                            setHasChanges(true);
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Plan d'Action Envisagé */}
            {activeTab === 'action' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Plan d'Action Envisagé</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Responsable
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Délai
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Statut
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {actionPlan.map((action, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-900">
                                {action.action === 'friendlyCall' ? 'Appel amiable' :
                                 action.action === 'paymentPlanProposal' ? 'Proposition d\'échéancier' :
                                 action.action === 'formalNotice' ? 'Mise en demeure' :
                                 action.action === 'legalAction' ? 'Saisine contentieuse' : 'Huissier / Procédure judiciaire'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="text"
                                value={action.responsible}
                                onChange={(e) => {
                                  const newActions = [...actionPlan];
                                  newActions[index] = { ...action, responsible: e.target.value };
                                  setActionPlan(newActions);
                                  setHasChanges(true);
                                }}
                                className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                                placeholder="Responsable"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="date"
                                value={action.deadline}
                                onChange={(e) => {
                                  const newActions = [...actionPlan];
                                  newActions[index] = { ...action, deadline: e.target.value };
                                  setActionPlan(newActions);
                                  setHasChanges(true);
                                }}
                                className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={action.status}
                                onChange={(e) => {
                                  const newActions = [...actionPlan];
                                  newActions[index] = { ...action, status: e.target.value };
                                  setActionPlan(newActions);
                                  setHasChanges(true);
                                }}
                                className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                              >
                                <option value="pending">En attente</option>
                                <option value="done">Fait</option>
                                <option value="accepted">Accepté</option>
                                <option value="rejected">Refusé</option>
                                <option value="prepared">Préparée</option>
                                <option value="inProgress">En cours</option>
                                <option value="assigned">Assigné</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Documents Joints à la Fiche */}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Documents Joints à la Fiche</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries({
                      contract: 'Contrat',
                      invoices: 'Factures',
                      paymentHistory: 'Historique des paiements',
                      emailExchanges: 'Échanges mails',
                      formalNotice: 'Mise en demeure',
                      debtorBankDetails: 'RIB du débiteur',
                      solvencyReport: 'Rapport de solvabilité',
                      certificate: 'Attestation ou PV'
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`doc-${key}`}
                            checked={attachedDocuments[key as keyof typeof attachedDocuments]}
                            onChange={() => {
                              setAttachedDocuments({
                                ...attachedDocuments,
                                [key]: !attachedDocuments[key as keyof typeof attachedDocuments]
                              });
                              setHasChanges(true);
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`doc-${key}`} className="ml-3 text-sm text-gray-700">
                            {label}
                          </label>
                        </div>
                        
                        {attachedDocuments[key as keyof typeof attachedDocuments] && (
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-blue-600 hover:text-blue-800">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-green-600 hover:text-green-800">
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Upload className="h-4 w-4 mr-2" />
                      Ajouter un document
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Sécurité */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Changer le mot de passe</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mot de passe actuel
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={securitySettings.currentPassword}
                          onChange={(e) => setSecuritySettings({...securitySettings, currentPassword: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nouveau mot de passe
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={securitySettings.newPassword}
                          onChange={(e) => setSecuritySettings({...securitySettings, newPassword: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Le mot de passe doit contenir au moins 8 caractères, incluant une majuscule, un chiffre et un caractère spécial.
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmer le nouveau mot de passe
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={securitySettings.confirmPassword}
                          onChange={(e) => setSecuritySettings({...securitySettings, confirmPassword: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <button
                      onClick={handlePasswordChange}
                      disabled={!securitySettings.currentPassword || !securitySettings.newPassword || !securitySettings.confirmPassword}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Changer le mot de passe
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Notifications de connexion</h4>
                  <div className="flex items-center justify-between py-2">
                    <div className="pr-4">
                      <p className="text-sm font-medium text-gray-700">Recevoir des alertes de connexion</p>
                      <p className="text-xs text-gray-500">Vous serez notifié par email lors de chaque connexion à votre compte</p>
                    </div>
                    <button
                      onClick={() => {
                        setSecuritySettings({...securitySettings, loginNotifications: !securitySettings.loginNotifications});
                        setHasChanges(true);
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        securitySettings.loginNotifications ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        securitySettings.loginNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Informations de sécurité</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-sm text-gray-600">Dernier changement de mot de passe:</span>
                        <span className="text-sm font-medium text-gray-900">{securitySettings.lastPasswordChange}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-sm text-gray-600">Dernière connexion:</span>
                        <span className="text-sm font-medium text-gray-900">{securitySettings.lastLogin}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 md:p-6 bg-gray-50">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="mb-3 sm:mb-0 text-center sm:text-left">
                <p className="text-sm text-gray-500">
                  Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 sm:px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={!hasChanges}
                  className="flex items-center px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>Sauvegarder</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccountSettings;