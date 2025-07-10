import crmData from '../data/crm-data.json';
import { 
  Client, 
  Debtor, 
  Invoice, 
  Payment, 
  Communication, 
  Task, 
  ClientMetrics, 
  DashboardMetrics 
} from '../types';

// Basic data retrieval functions
export const getClients = (): Client[] => {
  return crmData.clients as unknown as Client[];
};

export const getAllDebtors = (): Debtor[] => {
  return crmData.debtors as unknown as Debtor[];
};

export const getDebtorsByClientId = (clientId: string): Debtor[] => {
  return (crmData.debtors as unknown as Debtor[]).filter(debtor => debtor.clientId === clientId);
};

export const getDebtorsByManagerId = (managerId: string): Debtor[] => {
  return (crmData.debtors as unknown as Debtor[]).filter(debtor => debtor.managerId === managerId);
};

export const getInvoices = (): Invoice[] => {
  return crmData.invoices as unknown as Invoice[];
};

export const getPayments = (): Payment[] => {
  return crmData.payments as unknown as Payment[];
};

export const getCommunications = (): Communication[] => {
  return crmData.communications as unknown as Communication[];
};

export const getTasks = (): Task[] => {
  return crmData.tasks as unknown as Task[];
};

// Specific retrieval functions
export const getClientById = (clientId: string): Client | undefined => {
  return (crmData.clients as unknown as Client[]).find(client => client.id === clientId);
};

export const getDebtorById = (debtorId: string): Debtor | undefined => {
  return (crmData.debtors as unknown as Debtor[]).find(debtor => debtor.id === debtorId);
};

export const getInvoicesByDebtor = (debtorId: string): Invoice[] => {
  return (crmData.invoices as unknown as Invoice[]).filter(invoice => invoice.debtorId === debtorId);
};

export const getInvoicesByClient = (clientId: string): Invoice[] => {
  return (crmData.invoices as unknown as Invoice[]).filter(invoice => invoice.clientId === clientId);
};

export const getPaymentsByDebtor = (debtorId: string): Payment[] => {
  return (crmData.payments as unknown as Payment[]).filter(payment => payment.debtorId === debtorId);
};

export const getPaymentsByClient = (clientId: string): Payment[] => {
  return (crmData.payments as unknown as Payment[]).filter(payment => payment.clientId === clientId);
};

export const getCommunicationsByDebtor = (debtorId: string): Communication[] => {
  return (crmData.communications as unknown as Communication[]).filter(comm => comm.debtorId === debtorId);
};

export const getCommunicationsByClient = (clientId: string): Communication[] => {
  return (crmData.communications as unknown as Communication[]).filter(comm => comm.clientId === clientId);
};

export const getTasksByDebtor = (debtorId: string): Task[] => {
  return (crmData.tasks as unknown as Task[]).filter(task => task.debtorId === debtorId);
};

export const getTasksByClient = (clientId: string): Task[] => {
  return (crmData.tasks as unknown as Task[]).filter(task => task.clientId === clientId);
};

export const getTasksByAssignee = (assigneeId: string): Task[] => {
  return (crmData.tasks as unknown as Task[]).filter(task => task.assignedTo === assigneeId);
};

// Metrics functions
export const getClientMetrics = (): ClientMetrics[] => {
  return crmData.clientMetrics as unknown as ClientMetrics[];
};

export const getClientMetricsById = (clientId: string): ClientMetrics | undefined => {
  return (crmData.clientMetrics as unknown as ClientMetrics[]).find(metric => metric.clientId === clientId);
};

export const getSystemMetrics = (): DashboardMetrics => {
  return crmData.systemMetrics as unknown as DashboardMetrics;
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
export const getRecoveryStatusConfig = (status: string) => {
  switch (status) {
    case 'blue': return { 
      label: 'Dossier Initial', 
      color: 'bg-blue-100 text-blue-800',
      icon: 'FileText'
    };
    case 'yellow': return { 
      label: 'Relance 1', 
      color: 'bg-yellow-100 text-yellow-800',
      icon: 'Clock' 
    };
    case 'orange': return { 
      label: 'Relance 2', 
      color: 'bg-orange-100 text-orange-800',
      icon: 'AlertTriangle' 
    };
    case 'critical': return { 
      label: 'Relance 3 Critique', 
      color: 'bg-red-100 text-red-800',
      icon: 'AlertCircle' 
    };
    default: return { 
      label: status, 
      color: 'bg-gray-100 text-gray-800',
      icon: 'FileText' 
    };
  }
};

export const getDebtorStatusConfig = (status: string) => {
  switch (status) {
    case 'new': return { 
      label: 'Nouveau', 
      color: 'bg-blue-100 text-blue-800',
      icon: 'FileText' 
    };
    case 'inProgress': return { 
      label: 'En cours', 
      color: 'bg-purple-100 text-purple-800',
      icon: 'Activity' 
    };
    case 'paymentPlan': return { 
      label: 'Plan de paiement', 
      color: 'bg-indigo-100 text-indigo-800',
      icon: 'Calendar' 
    };
    case 'disputed': return { 
      label: 'Contesté', 
      color: 'bg-orange-100 text-orange-800',
      icon: 'AlertTriangle' 
    };
    case 'litigation': return { 
      label: 'Contentieux', 
      color: 'bg-red-100 text-red-800',
      icon: 'AlertCircle' 
    };
    case 'recovered': return { 
      label: 'Recouvré', 
      color: 'bg-green-100 text-green-800',
      icon: 'CheckCircle' 
    };
    case 'uncollectible': return { 
      label: 'Irrécouvrable', 
      color: 'bg-gray-100 text-gray-800',
      icon: 'XCircle' 
    };
    default: return { 
      label: status, 
      color: 'bg-gray-100 text-gray-800',
      icon: 'FileText' 
    };
  }
};

export const getPriorityConfig = (priority: string) => {
  switch (priority) {
    case 'low': return { 
      label: 'Basse', 
      color: 'bg-green-100 text-green-800' 
    };
    case 'medium': return { 
      label: 'Moyenne', 
      color: 'bg-blue-100 text-blue-800' 
    };
    case 'high': return { 
      label: 'Haute', 
      color: 'bg-orange-100 text-orange-800' 
    };
    case 'urgent': return { 
      label: 'Urgente', 
      color: 'bg-red-100 text-red-800' 
    };
    default: return { 
      label: priority, 
      color: 'bg-gray-100 text-gray-800' 
    };
  }
};

export const getRiskConfig = (risk: string) => {
  switch (risk) {
    case 'low': return { 
      label: 'Faible', 
      color: 'bg-green-100 text-green-800' 
    };
    case 'medium': return { 
      label: 'Moyen', 
      color: 'bg-yellow-100 text-yellow-800' 
    };
    case 'high': return { 
      label: 'Élevé', 
      color: 'bg-orange-100 text-orange-800' 
    };
    case 'extreme': return { 
      label: 'Extrême', 
      color: 'bg-red-100 text-red-800' 
    };
    default: return { 
      label: risk, 
      color: 'bg-gray-100 text-gray-800' 
    };
  }
};

export const getClientStatusConfig = (status: string) => {
  switch (status) {
    case 'active': return { 
      label: 'Actif', 
      color: 'bg-green-100 text-green-800',
      icon: 'CheckCircle' 
    };
    case 'inactive': return { 
      label: 'Inactif', 
      color: 'bg-gray-100 text-gray-800',
      icon: 'XCircle' 
    };
    case 'suspended': return { 
      label: 'Suspendu', 
      color: 'bg-red-100 text-red-800',
      icon: 'AlertCircle' 
    };
    default: return { 
      label: status, 
      color: 'bg-gray-100 text-gray-800',
      icon: 'Circle' 
    };
  }
};

export const getRoleConfig = (role: string) => {
  switch (role) {
    case 'admin': return { 
      label: 'Administrateur', 
      color: 'bg-purple-100 text-purple-800' 
    };
    case 'manager': return { 
      label: 'Gestionnaire', 
      color: 'bg-blue-100 text-blue-800' 
    };
    case 'client': return { 
      label: 'Client', 
      color: 'bg-green-100 text-green-800' 
    };
    default: return { 
      label: role, 
      color: 'bg-gray-100 text-gray-800' 
    };
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

export const calculateAverageDaysToRecover = (payments: Payment[], invoices: Invoice[]) => {
  if (payments.length === 0) return 0;
  
  let totalDays = 0;
  let count = 0;
  
  payments.forEach(payment => {
    if (payment.invoiceId && payment.status === 'completed') {
      const invoice = invoices.find(inv => inv.id === payment.invoiceId);
      if (invoice) {
        const issueDate = new Date(invoice.issueDate);
        const paymentDate = new Date(payment.paymentDate);
        const days = Math.ceil((paymentDate.getTime() - issueDate.getTime()) / (1000 * 60 * 60 * 24));
        totalDays += days;
        count++;
      }
    }
  });
  
  return count === 0 ? 0 : Math.round(totalDays / count);
};

// Status count helpers
export const getDebtorStatusCounts = (debtors: Debtor[]) => {
  return {
    new: debtors.filter(d => d.status === 'new').length,
    inProgress: debtors.filter(d => d.status === 'inProgress').length,
    paymentPlan: debtors.filter(d => d.status === 'paymentPlan').length,
    disputed: debtors.filter(d => d.status === 'disputed').length,
    litigation: debtors.filter(d => d.status === 'litigation').length,
    recovered: debtors.filter(d => d.status === 'recovered').length,
    uncollectible: debtors.filter(d => d.status === 'uncollectible').length
  };
};

export const getRecoveryStatusCounts = (debtors: Debtor[]) => {
  return {
    blue: debtors.filter(d => d.recoveryStatus === 'blue').length,
    yellow: debtors.filter(d => d.recoveryStatus === 'yellow').length,
    orange: debtors.filter(d => d.recoveryStatus === 'orange').length,
    critical: debtors.filter(d => d.recoveryStatus === 'critical').length
  };
};

export const getRiskLevelCounts = (debtors: Debtor[]) => {
  return {
    low: debtors.filter(d => d.riskLevel === 'low').length,
    medium: debtors.filter(d => d.riskLevel === 'medium').length,
    high: debtors.filter(d => d.riskLevel === 'high').length,
    extreme: debtors.filter(d => d.riskLevel === 'extreme').length
  };
};

// Aggregate calculations
export const calculateClientPerformanceMetrics = (
  client: Client, 
  debtors: Debtor[], 
  payments: Payment[], 
  invoices: Invoice[]
): ClientMetrics => {
  const clientDebtors = debtors.filter(d => d.clientId === client.id);
  const clientPayments = payments.filter(p => p.clientId === client.id);
  const clientInvoices = invoices.filter(i => i.clientId === client.id);
  
  const totalDebtAmount = clientDebtors.reduce((sum, d) => sum + d.totalAmount, 0);
  const totalCollectedAmount = clientDebtors.reduce((sum, d) => sum + d.paidAmount, 0);
  const recoveryRate = totalDebtAmount > 0 ? (totalCollectedAmount / totalDebtAmount) * 100 : 0;
  
  const activeDebtors = clientDebtors.filter(d => 
    d.status !== 'recovered' && d.status !== 'uncollectible'
  ).length;
  
  const completedDebtors = clientDebtors.filter(d => 
    d.status === 'recovered'
  ).length;
  
  const averageRecoveryTime = calculateAverageDaysToRecover(clientPayments, clientInvoices);
  
  const criticalCases = clientDebtors.filter(d => d.recoveryStatus === 'critical').length;
  
  return {
    id: `metric_${client.id}`,
    clientId: client.id,
    totalDebtAmount,
    totalCollectedAmount,
    recoveryRate,
    activeDebtors,
    completedDebtors,
    averageRecoveryTime,
    criticalCases,
    monthlyTrend: 5.2, // Example value
    period: 'month',
    updatedAt: new Date().toISOString()
  };
};

// Date formatting helpers
export const getRelativeDateLabel = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);
  
  if (dateOnly.getTime() === today.getTime()) {
    return "Aujourd'hui";
  } else if (dateOnly.getTime() === tomorrow.getTime()) {
    return "Demain";
  } else if (dateOnly.getTime() === yesterday.getTime()) {
    return "Hier";
  } else {
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  }
};

export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);
  
  if (diffSec < 60) {
    return 'À l\'instant';
  } else if (diffMin < 60) {
    return `Il y a ${diffMin} minute${diffMin > 1 ? 's' : ''}`;
  } else if (diffHour < 24) {
    return `Il y a ${diffHour} heure${diffHour > 1 ? 's' : ''}`;
  } else if (diffDay < 30) {
    return `Il y a ${diffDay} jour${diffDay > 1 ? 's' : ''}`;
  } else {
    return formatDate(dateString);
  }
};