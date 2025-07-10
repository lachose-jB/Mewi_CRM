import React, { useState, useEffect } from 'react';
import { 
  User, 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  FileText, 
  DollarSign, 
  Calendar, 
  Clock, 
  CheckCircle, 
  X, 
  Save, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  Info, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

interface DebtorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (debtorData: any) => void;
  initialData?: any;
}

const DebtorForm: React.FC<DebtorFormProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [activeSection, setActiveSection] = useState<string>('administrative');
  const [formData, setFormData] = useState({
    // Section 1: Informations administratives
    administrativeInfo: {
      dossierNumber: '',
      status: 'new',
      debtorType: 'company',
      civility: 'M.',
      name: '',
      firstName: '',
      birthDate: '',
      nationality: 'Française',
      identificationNumber: ''
    },
    // Section 2: Localisation et structure juridique
    locationAndLegalStructure: {
      mainAddress: '',
      secondaryAddress: '',
      city: '',
      postalCode: '',
      country: 'France',
      legalForm: 'SARL',
      socialCapital: '',
      rcs: '',
      naf: '',
      mainActivity: ''
    },
    // Section 3: Contacts et représentants légaux
    contactsAndLegalRepresentatives: {
      legalRepresentative: '',
      function: '',
      professionalPhone: '',
      mobilePhone: '',
      directEmail: '',
      accountantName: '',
      accountingFirm: '',
      accountantEmail: ''
    },
    // Section 4: Détails de la créance
    debtDetails: {
      totalAmount: '',
      htAmount: '',
      tva: '',
      initialInstallments: '',
      originalSchedule: false,
      invoiceDates: '',
      invoiceNumbers: '',
      lastPaymentDate: '',
      lastPaymentAmount: '',
      paymentMethod: 'virement'
    },
    // Section 5: Origine juridique de la dette
    legalOriginOfDebt: {
      contractSigned: false,
      serviceType: '',
      generalConditionsAccepted: false,
      penaltyClause: false,
      ongoingDispute: false,
      disputeNature: ''
    },
    // Section 6: Relances effectuées
    reminders: [
      {
        type: 'reminder1',
        date: '',
        mode: 'email',
        response: ''
      },
      {
        type: 'reminder2',
        date: '',
        mode: 'email',
        response: ''
      },
      {
        type: 'formalNotice',
        date: '',
        mode: 'letter',
        response: ''
      },
      {
        type: 'lastContact',
        date: '',
        mode: '',
        response: ''
      }
    ],
    // Section 7: Analyse de situation du débiteur
    debtorSituationAnalysis: {
      paymentCapacity: 'unknown',
      paymentIntention: 'unknown',
      financialDifficultySigns: false,
      difficultCompanyRegistry: false,
      bankruptcyProcedure: false,
      bankruptcyDate: ''
    },
    // Section 8: Plan d'action envisagé
    actionPlan: [
      {
        action: 'friendlyCall',
        responsible: '',
        deadline: '',
        status: 'pending'
      },
      {
        action: 'paymentPlanProposal',
        responsible: '',
        deadline: '',
        status: 'pending'
      },
      {
        action: 'formalNotice',
        responsible: '',
        deadline: '',
        status: 'pending'
      },
      {
        action: 'legalAction',
        responsible: '',
        deadline: '',
        status: 'pending'
      },
      {
        action: 'bailiff',
        responsible: '',
        deadline: '',
        status: 'pending'
      }
    ],
    // Section 9: Documents joints à la fiche
    attachedDocuments: {
      contract: false,
      invoices: false,
      paymentHistory: false,
      emailExchanges: false,
      formalNotice: false,
      debtorBankDetails: false,
      solvencyReport: false,
      certificate: false
    },
    // Section 10: Commentaires généraux
    generalComments: '',
    // Section 11: Signature / Validation
    validation: {
      caseManager: '',
      creationDate: '',
      department: 'recovery'
    }
  });

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    administrative: true,
    location: true,
    contacts: true,
    debt: true,
    legal: true,
    reminders: true,
    analysis: true,
    actionPlan: true,
    documents: true,
    comments: true,
    validation: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with initial data if provided
  useEffect(() => {
    if (initialData) {
      // Map initialData to formData structure
      const mappedData = {
        ...formData,
        administrativeInfo: {
          ...formData.administrativeInfo,
          name: initialData.name || '',
          debtorType: initialData.debtorType || 'company',
          status: initialData.status || 'new'
        },
        locationAndLegalStructure: {
          ...formData.locationAndLegalStructure,
          mainAddress: initialData.mainAddress || ''
        },
        contactsAndLegalRepresentatives: {
          ...formData.contactsAndLegalRepresentatives,
          directEmail: initialData.email || '',
          mobilePhone: initialData.mobilePhone || '',
          professionalPhone: initialData.phone || ''
        },
        debtDetails: {
          ...formData.debtDetails,
          totalAmount: initialData.totalAmount || ''
        }
      };
      
      setFormData(mappedData);
    }
  }, [initialData, isOpen]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleReminderChange = (index: number, field: string, value: any) => {
    const newReminders = [...formData.reminders];
    newReminders[index] = {
      ...newReminders[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      reminders: newReminders
    }));
  };

  const handleActionPlanChange = (index: number, field: string, value: any) => {
    const newActionPlan = [...formData.actionPlan];
    newActionPlan[index] = {
      ...newActionPlan[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      actionPlan: newActionPlan
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate required fields
    if (!formData.administrativeInfo.name) {
      newErrors.name = 'Le nom est requis';
    }
    
    if (formData.administrativeInfo.debtorType === 'company' && !formData.contactsAndLegalRepresentatives.directEmail) {
      newErrors.directEmail = 'L\'email est requis';
    }
    
    if (!formData.debtDetails.totalAmount) {
      newErrors.totalAmount = 'Le montant total est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Convert form data to the format expected by the API
      const debtorData = {
        name: formData.administrativeInfo.name,
        firstName: formData.administrativeInfo.firstName,
        email: formData.contactsAndLegalRepresentatives.directEmail,
        phone: formData.contactsAndLegalRepresentatives.professionalPhone,
        mobilePhone: formData.contactsAndLegalRepresentatives.mobilePhone,
        mainAddress: formData.locationAndLegalStructure.mainAddress,
        company: formData.administrativeInfo.debtorType === 'company' ? formData.administrativeInfo.name : '',
        totalAmount: formData.debtDetails.totalAmount,
        debtorType: formData.administrativeInfo.debtorType,
        status: formData.administrativeInfo.status,
        // Add other fields as needed
      };
      
      onSave(debtorData);
    }
  };

  if (!isOpen) return null;

  const sections = [
    { id: 'administrative', label: 'Informations Administratives', icon: FileText },
    { id: 'location', label: 'Localisation et Structure', icon: MapPin },
    { id: 'contacts', label: 'Contacts', icon: Phone },
    { id: 'debt', label: 'Détails Créance', icon: DollarSign },
    { id: 'legal', label: 'Origine Juridique', icon: FileText },
    { id: 'reminders', label: 'Relances Effectuées', icon: Clock },
    { id: 'analysis', label: 'Analyse Situation', icon: AlertTriangle },
    { id: 'actionPlan', label: 'Plan d\'Action', icon: CheckCircle },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'comments', label: 'Commentaires', icon: Mail },
    { id: 'validation', label: 'Validation', icon: User }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {initialData ? 'Modifier le débiteur' : 'Nouveau débiteur'}
              </h3>
              <p className="text-sm text-gray-500">
                Formulaire complet de création/modification d'un débiteur
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex border-b border-gray-200">
          <div className="w-64 border-r border-gray-200 p-4 overflow-y-auto max-h-[calc(90vh-64px-64px)]">
            <div className="space-y-1">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <section.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                  <span className="truncate">{section.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto max-h-[calc(90vh-64px-64px)] p-6 space-y-6">
            {/* Section 1: Informations administratives */}
            {activeSection === 'administrative' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-900 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-gray-400" />
                    Informations Administratives
                  </h4>
                  <button 
                    onClick={() => toggleSection('administrative')}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    {expandedSections.administrative ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                </div>
                
                {expandedSections.administrative && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Numéro de dossier
                        </label>
                        <input
                          type="text"
                          value={formData.administrativeInfo.dossierNumber}
                          onChange={(e) => handleInputChange('administrativeInfo', 'dossierNumber', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Généré automatiquement"
                          disabled
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Statut
                        </label>
                        <select
                          value={formData.administrativeInfo.status}
                          onChange={(e) => handleInputChange('administrativeInfo', 'status', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                          value={formData.administrativeInfo.debtorType}
                          onChange={(e) => handleInputChange('administrativeInfo', 'debtorType', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="individual">Particulier</option>
                          <option value="company">Société</option>
                          <option value="association">Association</option>
                          <option value="administration">Administration</option>
                          <option value="other">Autre</option>
                        </select>
                      </div>
                    </div>
                    
                    {formData.administrativeInfo.debtorType === 'individual' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Civilité
                          </label>
                          <select
                            value={formData.administrativeInfo.civility}
                            onChange={(e) => handleInputChange('administrativeInfo', 'civility', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="M.">M.</option>
                            <option value="Mme">Mme</option>
                            <option value="Mx">Mx</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom *
                          </label>
                          <input
                            type="text"
                            value={formData.administrativeInfo.name}
                            onChange={(e) => handleInputChange('administrativeInfo', 'name', e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="Nom de famille"
                          />
                          {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Prénom
                          </label>
                          <input
                            type="text"
                            value={formData.administrativeInfo.firstName}
                            onChange={(e) => handleInputChange('administrativeInfo', 'firstName', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Prénom"
                          />
                        </div>
                      </div>
                    )}
                    
                    {formData.administrativeInfo.debtorType === 'company' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Raison sociale *
                        </label>
                        <input
                          type="text"
                          value={formData.administrativeInfo.name}
                          onChange={(e) => handleInputChange('administrativeInfo', 'name', e.target.value)}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="Nom de l'entreprise"
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date de naissance / création
                        </label>
                        <input
                          type="date"
                          value={formData.administrativeInfo.birthDate}
                          onChange={(e) => handleInputChange('administrativeInfo', 'birthDate', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nationalité
                        </label>
                        <input
                          type="text"
                          value={formData.administrativeInfo.nationality}
                          onChange={(e) => handleInputChange('administrativeInfo', 'nationality', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nationalité"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          N° d'identification (CIN / SIRET / TVA)
                        </label>
                        <input
                          type="text"
                          value={formData.administrativeInfo.identificationNumber}
                          onChange={(e) => handleInputChange('administrativeInfo', 'identificationNumber', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Numéro d'identification"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Section 2: Localisation et structure juridique */}
            {activeSection === 'location' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-900 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                    Localisation et Structure Juridique
                  </h4>
                  <button 
                    onClick={() => toggleSection('location')}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    {expandedSections.location ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                </div>
                
                {expandedSections.location && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse principale
                      </label>
                      <textarea
                        value={formData.locationAndLegalStructure.mainAddress}
                        onChange={(e) => handleInputChange('locationAndLegalStructure', 'mainAddress', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Adresse complète"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse secondaire
                      </label>
                      <textarea
                        value={formData.locationAndLegalStructure.secondaryAddress}
                        onChange={(e) => handleInputChange('locationAndLegalStructure', 'secondaryAddress', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Adresse secondaire (optionnel)"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ville
                        </label>
                        <input
                          type="text"
                          value={formData.locationAndLegalStructure.city}
                          onChange={(e) => handleInputChange('locationAndLegalStructure', 'city', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Ville"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Code postal
                        </label>
                        <input
                          type="text"
                          value={formData.locationAndLegalStructure.postalCode}
                          onChange={(e) => handleInputChange('locationAndLegalStructure', 'postalCode', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Code postal"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pays
                        </label>
                        <input
                          type="text"
                          value={formData.locationAndLegalStructure.country}
                          onChange={(e) => handleInputChange('locationAndLegalStructure', 'country', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Pays"
                        />
                      </div>
                    </div>
                    
                    {formData.administrativeInfo.debtorType === 'company' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Forme juridique
                          </label>
                          <select
                            value={formData.locationAndLegalStructure.legalForm}
                            onChange={(e) => handleInputChange('locationAndLegalStructure', 'legalForm', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="SARL">SARL</option>
                            <option value="SAS">SAS</option>
                            <option value="SA">SA</option>
                            <option value="Auto-entrepreneur">Auto-entrepreneur</option>
                            <option value="Autre">Autre</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Capital social
                          </label>
                          <input
                            type="text"
                            value={formData.locationAndLegalStructure.socialCapital}
                            onChange={(e) => handleInputChange('locationAndLegalStructure', 'socialCapital', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Montant en €"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Greffe / RCS
                          </label>
                          <input
                            type="text"
                            value={formData.locationAndLegalStructure.rcs}
                            onChange={(e) => handleInputChange('locationAndLegalStructure', 'rcs', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Greffe / RCS"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Code NAF / APE
                          </label>
                          <input
                            type="text"
                            value={formData.locationAndLegalStructure.naf}
                            onChange={(e) => handleInputChange('locationAndLegalStructure', 'naf', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Code NAF / APE"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Activité principale
                      </label>
                      <input
                        type="text"
                        value={formData.locationAndLegalStructure.mainActivity}
                        onChange={(e) => handleInputChange('locationAndLegalStructure', 'mainActivity', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Description de l'activité"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Section 3: Contacts et représentants légaux */}
            {activeSection === 'contacts' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-900 flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-gray-400" />
                    Contacts et Représentants Légaux
                  </h4>
                  <button 
                    onClick={() => toggleSection('contacts')}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    {expandedSections.contacts ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                </div>
                
                {expandedSections.contacts && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Représentant légal
                        </label>
                        <input
                          type="text"
                          value={formData.contactsAndLegalRepresentatives.legalRepresentative}
                          onChange={(e) => handleInputChange('contactsAndLegalRepresentatives', 'legalRepresentative', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nom complet"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fonction
                        </label>
                        <input
                          type="text"
                          value={formData.contactsAndLegalRepresentatives.function}
                          onChange={(e) => handleInputChange('contactsAndLegalRepresentatives', 'function', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Fonction / Poste"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tél. professionnel
                        </label>
                        <input
                          type="tel"
                          value={formData.contactsAndLegalRepresentatives.professionalPhone}
                          onChange={(e) => handleInputChange('contactsAndLegalRepresentatives', 'professionalPhone', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="+33 1 23 45 67 89"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tél. mobile
                        </label>
                        <input
                          type="tel"
                          value={formData.contactsAndLegalRepresentatives.mobilePhone}
                          onChange={(e) => handleInputChange('contactsAndLegalRepresentatives', 'mobilePhone', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="+33 6 12 34 56 78"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email direct *
                        </label>
                        <input
                          type="email"
                          value={formData.contactsAndLegalRepresentatives.directEmail}
                          onChange={(e) => handleInputChange('contactsAndLegalRepresentatives', 'directEmail', e.target.value)}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.directEmail ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="email@example.com"
                        />
                        {errors.directEmail && (
                          <p className="mt-1 text-sm text-red-600">{errors.directEmail}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom du comptable (si connu)
                        </label>
                        <input
                          type="text"
                          value={formData.contactsAndLegalRepresentatives.accountantName}
                          onChange={(e) => handleInputChange('contactsAndLegalRepresentatives', 'accountantName', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nom du comptable"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cabinet comptable
                        </label>
                        <input
                          type="text"
                          value={formData.contactsAndLegalRepresentatives.accountingFirm}
                          onChange={(e) => handleInputChange('contactsAndLegalRepresentatives', 'accountingFirm', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nom du cabinet"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email comptable
                        </label>
                        <input
                          type="email"
                          value={formData.contactsAndLegalRepresentatives.accountantEmail}
                          onChange={(e) => handleInputChange('contactsAndLegalRepresentatives', 'accountantEmail', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="comptable@example.com"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Section 4: Détails de la créance */}
            {activeSection === 'debt' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-900 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-gray-400" />
                    Détails de la Créance
                  </h4>
                  <button 
                    onClick={() => toggleSection('debt')}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    {expandedSections.debt ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                </div>
                
                {expandedSections.debt && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Montant total dû (€) *
                        </label>
                        <input
                          type="text"
                          value={formData.debtDetails.totalAmount}
                          onChange={(e) => handleInputChange('debtDetails', 'totalAmount', e.target.value)}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.totalAmount ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="Montant total"
                        />
                        {errors.totalAmount && (
                          <p className="mt-1 text-sm text-red-600">{errors.totalAmount}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Montant HT
                        </label>
                        <input
                          type="text"
                          value={formData.debtDetails.htAmount}
                          onChange={(e) => handleInputChange('debtDetails', 'htAmount', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Montant HT"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          TVA
                        </label>
                        <input
                          type="text"
                          value={formData.debtDetails.tva}
                          onChange={(e) => handleInputChange('debtDetails', 'tva', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Montant TVA"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre d'échéances initiales
                        </label>
                        <input
                          type="number"
                          value={formData.debtDetails.initialInstallments}
                          onChange={(e) => handleInputChange('debtDetails', 'initialInstallments', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nombre d'échéances"
                        />
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="originalSchedule"
                          checked={formData.debtDetails.originalSchedule}
                          onChange={(e) => handleInputChange('debtDetails', 'originalSchedule', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="originalSchedule" className="ml-2 text-sm text-gray-700">
                          Échéancier original (si oui, en PJ)
                        </label>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dates des factures concernées
                        </label>
                        <input
                          type="text"
                          value={formData.debtDetails.invoiceDates}
                          onChange={(e) => handleInputChange('debtDetails', 'invoiceDates', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Ex: 15/10/2024, 30/10/2024"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Numéros des factures
                        </label>
                        <input
                          type="text"
                          value={formData.debtDetails.invoiceNumbers}
                          onChange={(e) => handleInputChange('debtDetails', 'invoiceNumbers', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Ex: FAC-2024-001, FAC-2024-002"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dernier paiement effectué le
                        </label>
                        <input
                          type="date"
                          value={formData.debtDetails.lastPaymentDate}
                          onChange={(e) => handleInputChange('debtDetails', 'lastPaymentDate', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Montant du dernier paiement
                        </label>
                        <input
                          type="text"
                          value={formData.debtDetails.lastPaymentAmount}
                          onChange={(e) => handleInputChange('debtDetails', 'lastPaymentAmount', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Montant en €"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Moyen de paiement
                        </label>
                        <select
                          value={formData.debtDetails.paymentMethod}
                          onChange={(e) => handleInputChange('debtDetails', 'paymentMethod', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="virement">Virement</option>
                          <option value="cheque">Chèque</option>
                          <option value="especes">Espèces</option>
                          <option value="prelevement">Prélèvement</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Section 5: Origine juridique de la dette */}
            {activeSection === 'legal' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-900 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-gray-400" />
                    Origine Juridique de la Dette
                  </h4>
                  <button 
                    onClick={() => toggleSection('legal')}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    {expandedSections.legal ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                </div>
                
                {expandedSections.legal && (
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="contractSigned"
                        checked={formData.legalOriginOfDebt.contractSigned}
                        onChange={(e) => handleInputChange('legalOriginOfDebt', 'contractSigned', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="contractSigned" className="ml-2 text-sm text-gray-700">
                        Contrat signé ? (PJ)
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type de prestation / produit livré
                      </label>
                      <input
                        type="text"
                        value={formData.legalOriginOfDebt.serviceType}
                        onChange={(e) => handleInputChange('legalOriginOfDebt', 'serviceType', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Description de la prestation"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="generalConditionsAccepted"
                          checked={formData.legalOriginOfDebt.generalConditionsAccepted}
                          onChange={(e) => handleInputChange('legalOriginOfDebt', 'generalConditionsAccepted', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="generalConditionsAccepted" className="ml-2 text-sm text-gray-700">
                          Conditions générales acceptées ?
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="penaltyClause"
                          checked={formData.legalOriginOfDebt.penaltyClause}
                          onChange={(e) => handleInputChange('legalOriginOfDebt', 'penaltyClause', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="penaltyClause" className="ml-2 text-sm text-gray-700">
                          Clause pénale / intérêts de retard ?
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="ongoingDispute"
                          checked={formData.legalOriginOfDebt.ongoingDispute}
                          onChange={(e) => handleInputChange('legalOriginOfDebt', 'ongoingDispute', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="ongoingDispute" className="ml-2 text-sm text-gray-700">
                          Litige en cours ?
                        </label>
                      </div>
                    </div>
                    
                    {formData.legalOriginOfDebt.ongoingDispute && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nature du litige
                        </label>
                        <textarea
                          value={formData.legalOriginOfDebt.disputeNature}
                          onChange={(e) => handleInputChange('legalOriginOfDebt', 'disputeNature', e.target.value)}
                          rows={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Description du litige"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Section 6: Relances effectuées */}
            {activeSection === 'reminders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-900 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-gray-400" />
                    Relances Effectuées
                  </h4>
                  <button 
                    onClick={() => toggleSection('reminders')}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    {expandedSections.reminders ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                </div>
                
                {expandedSections.reminders && (
                  <div className="space-y-4">
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
                        {formData.reminders.map((reminder, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {reminder.type === 'reminder1' ? 'Relance 1' : 
                               reminder.type === 'reminder2' ? 'Relance 2' : 
                               reminder.type === 'formalNotice' ? 'Mise en demeure' : 'Dernier contact'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="date"
                                value={reminder.date}
                                onChange={(e) => handleReminderChange(index, 'date', e.target.value)}
                                className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={reminder.mode}
                                onChange={(e) => handleReminderChange(index, 'mode', e.target.value)}
                                className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="email">Email</option>
                                <option value="tel">Téléphone</option>
                                <option value="letter">Courrier</option>
                                {reminder.type === 'formalNotice' && <option value="huissier">Huissier</option>}
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="text"
                                value={reminder.response}
                                onChange={(e) => handleReminderChange(index, 'response', e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Réponse obtenue"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Section 7: Analyse de situation du débiteur */}
            {activeSection === 'analysis' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-900 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-gray-400" />
                    Analyse de Situation du Débiteur
                  </h4>
                  <button 
                    onClick={() => toggleSection('analysis')}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    {expandedSections.analysis ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                </div>
                
                {expandedSections.analysis && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Capacité de paiement
                        </label>
                        <select
                          value={formData.debtorSituationAnalysis.paymentCapacity}
                          onChange={(e) => handleInputChange('debtorSituationAnalysis', 'paymentCapacity', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="unknown">Inconnue</option>
                          <option value="strong">Forte</option>
                          <option value="medium">Moyenne</option>
                          <option value="weak">Faible</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Intention de payer
                        </label>
                        <select
                          value={formData.debtorSituationAnalysis.paymentIntention}
                          onChange={(e) => handleInputChange('debtorSituationAnalysis', 'paymentIntention', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="unknown">Inconnue</option>
                          <option value="goodFaith">Bonne foi</option>
                          <option value="badFaith">Mauvaise foi</option>
                          <option value="ignorance">Ignorance</option>
                          <option value="dispute">Contestation</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="financialDifficultySigns"
                          checked={formData.debtorSituationAnalysis.financialDifficultySigns}
                          onChange={(e) => handleInputChange('debtorSituationAnalysis', 'financialDifficultySigns', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="financialDifficultySigns" className="ml-2 text-sm text-gray-700">
                          Signes de difficultés financières
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="difficultCompanyRegistry"
                          checked={formData.debtorSituationAnalysis.difficultCompanyRegistry}
                          onChange={(e) => handleInputChange('debtorSituationAnalysis', 'difficultCompanyRegistry', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="difficultCompanyRegistry" className="ml-2 text-sm text-gray-700">
                          Inscription au fichier des entreprises en difficulté
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="bankruptcyProcedure"
                          checked={formData.debtorSituationAnalysis.bankruptcyProcedure}
                          onChange={(e) => handleInputChange('debtorSituationAnalysis', 'bankruptcyProcedure', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="bankruptcyProcedure" className="ml-2 text-sm text-gray-700">
                          Dépôt de bilan ou procédure collective
                        </label>
                      </div>
                    </div>
                    
                    {formData.debtorSituationAnalysis.bankruptcyProcedure && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date du dépôt de bilan
                        </label>
                        <input
                          type="date"
                          value={formData.debtorSituationAnalysis.bankruptcyDate}
                          onChange={(e) => handleInputChange('debtorSituationAnalysis', 'bankruptcyDate', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Section 8: Plan d'action envisagé */}
            {activeSection === 'actionPlan' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-900 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-gray-400" />
                    Plan d'Action Envisagé
                  </h4>
                  <button 
                    onClick={() => toggleSection('actionPlan')}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    {expandedSections.actionPlan ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                </div>
                
                {expandedSections.actionPlan && (
                  <div className="space-y-4">
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
                        {formData.actionPlan.map((action, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {action.action === 'friendlyCall' ? 'Appel amiable' : 
                               action.action === 'paymentPlanProposal' ? 'Proposition d\'échéancier' : 
                               action.action === 'formalNotice' ? 'Mise en demeure' : 
                               action.action === 'legalAction' ? 'Saisine contentieuse' : 
                               'Huissier / Procédure judiciaire'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="text"
                                value={action.responsible}
                                onChange={(e) => handleActionPlanChange(index, 'responsible', e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Responsable"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="date"
                                value={action.deadline}
                                onChange={(e) => handleActionPlanChange(index, 'deadline', e.target.value)}
                                className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={action.status}
                                onChange={(e) => handleActionPlanChange(index, 'status', e.target.value)}
                                className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="pending">En attente</option>
                                <option value="done">Fait</option>
                                {action.action === 'paymentPlanProposal' && (
                                  <>
                                    <option value="accepted">Accepté</option>
                                    <option value="rejected">Refusé</option>
                                  </>
                                )}
                                {action.action === 'legalAction' && (
                                  <option value="prepared">Préparée</option>
                                )}
                                {action.action === 'bailiff' && (
                                  <option value="assigned">Assigné</option>
                                )}
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Section 9: Documents joints à la fiche */}
            {activeSection === 'documents' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-900 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-gray-400" />
                    Documents Joints à la Fiche
                  </h4>
                  <button 
                    onClick={() => toggleSection('documents')}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    {expandedSections.documents ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                </div>
                
                {expandedSections.documents && (
                  <div className="space-y-4">
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
                        <div key={key} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`document-${key}`}
                            checked={formData.attachedDocuments[key as keyof typeof formData.attachedDocuments]}
                            onChange={(e) => handleInputChange('attachedDocuments', key, e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`document-${key}`} className="ml-2 text-sm text-gray-700">
                            {label}
                          </label>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4">
                      <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter un document
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Section 10: Commentaires généraux */}
            {activeSection === 'comments' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-900 flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-gray-400" />
                    Commentaires Généraux
                  </h4>
                  <button 
                    onClick={() => toggleSection('comments')}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    {expandedSections.comments ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                </div>
                
                {expandedSections.comments && (
                  <div className="space-y-4">
                    <textarea
                      value={formData.generalComments}
                      onChange={(e) => handleInputChange('generalComments', '', e.target.value)}
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Commentaires généraux sur le dossier..."
                    />
                  </div>
                )}
              </div>
            )}

            {/* Section 11: Signature / Validation */}
            {activeSection === 'validation' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-900 flex items-center">
                    <User className="h-5 w-5 mr-2 text-gray-400" />
                    Signature / Validation (Interne)
                  </h4>
                  <button 
                    onClick={() => toggleSection('validation')}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    {expandedSections.validation ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                </div>
                
                {expandedSections.validation && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Responsable du dossier
                        </label>
                        <input
                          type="text"
                          value={formData.validation.caseManager}
                          onChange={(e) => handleInputChange('validation', 'caseManager', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nom du responsable"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date de création de la fiche
                        </label>
                        <input
                          type="date"
                          value={formData.validation.creationDate}
                          onChange={(e) => handleInputChange('validation', 'creationDate', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Service concerné
                        </label>
                        <select
                          value={formData.validation.department}
                          onChange={(e) => handleInputChange('validation', 'department', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="recovery">Recouvrement</option>
                          <option value="legal">Juridique</option>
                          <option value="management">Direction</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {initialData ? 'Mettre à jour' : 'Créer le débiteur'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebtorForm;