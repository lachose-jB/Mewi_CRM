import crmData from '../data/crm-data.json';

// Utility functions to access and manipulate data
export const getUsers = () => {
  return crmData.users;
};

export const getClients = () => {
  return crmData.clients;
};

export const getInvoices = () => {
  return crmData.invoices;
};

export const getPayments = () => {
  return crmData.payments;
};

export const getCommunications = () => {
  return crmData.communications;
};

export const getTasks = () => {
  return crmData.tasks;
};

export const getRelanceTemplates = () => {
  return crmData.relanceTemplates;
};

export const getRelanceRules = () => {
  return crmData.relanceRules;
};

export const getDocuments = () => {
  return crmData.documents;
};

export const getSystemLogs = () => {
  return crmData.systemLogs;
};

export const getMetrics = () => {
  return crmData.metrics;
};

export const getFinancialData = () => {
  return crmData.financialData;
};

export const getCriticalDossiers = () => {
  return crmData.criticalDossiers;
};

export const getDebtorFormData = () => {
  return crmData.debtorFormData;
};

// Filter functions
export const getClientsByManager = (managerId: string) => {
  return crmData.clients.filter(client => client.manager_id === managerId);
};

export const getInvoicesByClient = (clientId: string) => {
  return crmData.invoices.filter(invoice => invoice.client_id === clientId);
};

export const getPaymentsByClient = (clientId: string) => {
  return crmData.payments.filter(payment => payment.client_id === clientId);
};

export const getCommunicationsByClient = (clientId: string) => {
  return crmData.communications.filter(communication => communication.client_id === clientId);
};

export const getTasksByAssignee = (assigneeId: string) => {
  return crmData.tasks.filter(task => task.assignedTo === assigneeId);
};

export const getClientById = (clientId: string) => {
  return crmData.clients.find(client => client.id === clientId);
};

export const getUserById = (userId: string) => {
  return crmData.users.find(user => user.id === userId);
};

export const getInvoiceById = (invoiceId: string) => {
  return crmData.invoices.find(invoice => invoice.id === invoiceId);
};

// Format functions
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR');
};

export const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('fr-FR');
};

// Status and configuration helpers
export const getStatusConfig = (status: string) => {
  switch (status) {
    case 'blue': return { label: 'Dossier Initial', color: 'bg-blue-100 text-blue-800' };
    case 'yellow': return { label: 'Règle 1 dépassé', color: 'bg-yellow-100 text-yellow-800' };
    case 'orange': return { label: 'Règle 2 dépassé', color: 'bg-orange-100 text-orange-800' };
    case 'critical': return { label: 'Règle 3 dépassé Critique', color: 'bg-red-100 text-red-800' };
    case 'paid': return { label: 'Payée', color: 'bg-green-100 text-green-800' };
    case 'partial': return { label: 'Partielle', color: 'bg-yellow-100 text-yellow-800' };
    case 'pending': return { label: 'En attente', color: 'bg-blue-100 text-blue-800' };
    case 'overdue': return { label: 'En retard', color: 'bg-red-100 text-red-800' };
    default: return { label: status, color: 'bg-gray-100 text-gray-800' };
  }
};

export const getPriorityConfig = (priority: string) => {
  switch (priority) {
    case 'low': return { label: 'Basse', color: 'bg-green-100 text-green-800' };
    case 'medium': return { label: 'Moyenne', color: 'bg-blue-100 text-blue-800' };
    case 'high': return { label: 'Haute', color: 'bg-orange-100 text-orange-800' };
    case 'urgent': return { label: 'Urgente', color: 'bg-red-100 text-red-800' };
    default: return { label: priority, color: 'bg-gray-100 text-gray-800' };
  }
};

export const getRiskConfig = (risk: string) => {
  switch (risk) {
    case 'low': return { label: 'Faible', color: 'bg-green-100 text-green-800' };
    case 'medium': return { label: 'Moyen', color: 'bg-yellow-100 text-yellow-800' };
    case 'high': return { label: 'Élevé', color: 'bg-orange-100 text-orange-800' };
    case 'extreme': return { label: 'Extrême', color: 'bg-red-100 text-red-800' };
    default: return { label: risk, color: 'bg-gray-100 text-gray-800' };
  }
};

export const getRoleConfig = (role: string) => {
  switch (role) {
    case 'admin': return { label: 'Administrateur', color: 'bg-purple-100 text-purple-800' };
    case 'manager': return { label: 'Gestionnaire', color: 'bg-blue-100 text-blue-800' };
    case 'client': return { label: 'Client', color: 'bg-green-100 text-green-800' };
    default: return { label: role, color: 'bg-gray-100 text-gray-800' };
  }
};

// Data transformation helpers
export const calculateRecoveryRate = (originalAmount: number, paidAmount: number) => {
  if (originalAmount === 0) return 0;
  return (paidAmount / originalAmount) * 100;
};

export const calculateDaysOverdue = (dueDate: string) => {
  const due = new Date(dueDate);
  const today = new Date();
  const diffTime = today.getTime() - due.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};