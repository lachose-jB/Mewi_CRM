// Core entity types for the CRM system
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'client';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

// Client entity (companies/individuals who entrust us with debt collection)
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  contactPerson: string;
  contactRole: string;
  userId?: string; // Link to user account if client has login access
  assignedManagerId: string;
  assignedManagerName: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive' | 'suspended';
  contractStart: string;
  contractEnd?: string;
  notes: string[];
  totalDebtAmount: number; // Total amount of all debts being collected
  totalCollectedAmount: number; // Total amount collected so far
  recoveryRate: number; // Percentage collected
}

// Debtor entity (individuals/companies that owe money to clients)
export interface Debtor {
  id: string;
  clientId: string; // The client who is owed money
  name: string;
  email: string;
  phone: string;
  address: string;
  company?: string;
  type: 'individual' | 'company';
  managerId: string; // Assigned recovery manager
  managerName: string;
  status: 'new' | 'inProgress' | 'paymentPlan' | 'disputed' | 'litigation' | 'recovered' | 'uncollectible';
  recoveryStatus: 'blue' | 'yellow' | 'orange' | 'critical'; // Visual status for recovery urgency
  totalAmount: number; // Total amount owed
  originalAmount: number; // Original debt amount
  paidAmount: number; // Amount already paid
  invoiceCount: number; // Number of invoices in this debt
  lastPayment?: string; // Date of last payment
  lastContact?: string; // Date of last contact
  daysOverdue: number; // Days since oldest overdue invoice
  createdAt: string;
  updatedAt: string;
  notes: string[];
  tags: string[];
  nextAction?: {
    type: string;
    date: string;
    description: string;
  };
  priority: 'low' | 'medium' | 'high' | 'urgent';
  riskLevel: 'low' | 'medium' | 'high' | 'extreme';
}

export interface Invoice {
  id: string;
  debtorId: string;
  clientId: string; // The client who is owed money
  invoiceNumber: string;
  amount: number;
  originalAmount: number;
  paidAmount: number;
  dueDate: string;
  issueDate: string;
  status: 'pending' | 'partial' | 'paid' | 'overdue';
  description?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  debtorId: string;
  clientId: string; // The client who receives the payment
  invoiceId?: string;
  amount: number;
  paymentDate: string;
  dueDate?: string;
  method: string;
  reference?: string;
  status: 'pending' | 'completed' | 'failed' | 'scheduled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Communication {
  id: string;
  debtorId: string;
  clientId: string; // The client related to this communication
  userId?: string;
  type: 'email' | 'sms' | 'call' | 'letter' | 'meeting';
  subject?: string;
  content: string;
  status: 'sent' | 'delivered' | 'read' | 'responded' | 'failed';
  scheduledAt?: string;
  sentAt?: string;
  metadata?: any;
  createdAt: string;
}

export interface RelanceTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'letter';
  subject?: string;
  content: string;
  variables: string[];
  isActive?: boolean;
  createdBy?: string;
}

export interface RelanceRule {
  id: string;
  name: string;
  triggerDays: number;
  action: 'email' | 'sms' | 'status_change' | 'escalate';
  templateId?: string;
  newStatus?: string;
  isActive: boolean;
  priority?: 'low' | 'medium' | 'high';
  description?: string;
  triggerConditions?: {
    status?: string[];
    amount?: { min?: number; max?: number };
    priority?: string[];
    tags?: string[];
  };
  actions?: {
    type: 'email' | 'sms' | 'status_change' | 'escalate' | 'notification';
    templateId?: string;
    newStatus?: string;
    assignTo?: string;
    message?: string;
  }[];
  schedule?: {
    enabled: boolean;
    time?: string;
    days?: string[];
    frequency?: 'once' | 'daily' | 'weekly';
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface SystemConfig {
  relanceRules: RelanceRule[];
  templates: RelanceTemplate[];
  generalSettings: {
    currency: string;
    timezone: string;
    companyName: string;
  };
}

export interface DashboardMetrics {
  totalDebt: number;
  activeFiles: number;
  recoveryRate: number;
  averageDso: number;
  monthlyRecovered: number;
  criticalFiles: number;
}

export interface ClientMetrics {
  id: string;
  clientId: string;
  totalDebtAmount: number;
  totalCollectedAmount: number;
  recoveryRate: number;
  activeDebtors: number;
  completedDebtors: number;
  averageRecoveryTime: number; // In days
  criticalCases: number;
  monthlyTrend: number; // Percentage increase/decrease
  period: 'month' | 'quarter' | 'year';
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'completed' | 'overdue' | 'cancelled';
  type: 'call' | 'email' | 'sms' | 'meeting' | 'follow_up' | 'other';
  debtorId: string;
  debtorName: string;
  clientId: string;
  clientName: string;
  assignedTo: string;
  createdAt: string;
  completedAt?: string;
  notes?: string;
  outcome?: string;
}