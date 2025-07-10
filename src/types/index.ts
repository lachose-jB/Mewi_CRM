export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'client';
  isActive: boolean;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  managerId: string;
  status: 'blue' | 'yellow' | 'orange' | 'critical';
  totalAmount: number;
  unpaidInvoices: Invoice[];
  relanceHistory: RelanceAction[];
  notes: string[];
  createdAt: string;
  lastContact: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  number: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  createdAt: string;
}

export interface RelanceAction {
  id: string;
  clientId: string;
  type: 'sms' | 'email' | 'call' | 'visit' | 'letter';
  content: string;
  status: 'sent' | 'delivered' | 'read' | 'responded';
  createdAt: string;
  userId: string;
  automatic: boolean;
}

export interface RelanceTemplate {
  id: string;
  name: string;
  type: 'sms' | 'email';
  subject?: string;
  content: string;
  variables: string[];
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

export interface RelanceRule {
  id: string;
  name: string;
  triggerDays: number;
  action: 'sms' | 'email' | 'status_change';
  templateId?: string;
  newStatus?: Client['status'];
  isActive: boolean;
}

export interface DashboardMetrics {
  totalDebt: number;
  activeFiles: number;
  recoveryRate: number;
  averageDso: number;
  monthlyRecovered: number;
  criticalFiles: number;
}