import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { 
  getClients, 
  getInvoices, 
  getPayments, 
  getCommunications, 
  getMetrics,
  getClientsByManager
} from '../utils/dataUtils';

// Types
interface Client {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
  manager_id?: string;
  status: 'blue' | 'yellow' | 'orange' | 'critical';
  total_amount: number;
  notes?: string[];
  created_at: string;
  updated_at: string;
  last_contact?: string;
}

interface Invoice {
  id: string;
  client_id: string;
  invoice_number: string;
  amount: number;
  original_amount: number;
  paid_amount: number;
  due_date: string;
  issue_date: string;
  status: 'pending' | 'partial' | 'paid' | 'overdue';
  description?: string;
  category?: string;
  created_at: string;
  updated_at: string;
}

interface Payment {
  id: string;
  client_id: string;
  invoice_id?: string;
  amount: number;
  payment_date: string;
  due_date?: string;
  method: string;
  reference?: string;
  status: 'pending' | 'completed' | 'failed' | 'scheduled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface Communication {
  id: string;
  client_id: string;
  user_id?: string;
  type: 'email' | 'sms' | 'call' | 'letter' | 'meeting';
  subject?: string;
  content: string;
  status: 'sent' | 'delivered' | 'read' | 'responded' | 'failed';
  scheduled_at?: string;
  sent_at?: string;
  metadata?: any;
  created_at: string;
}

interface CrmContextType {
  clients: Client[];
  invoices: Invoice[];
  payments: Payment[];
  communications: Communication[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  updateClientStatus: (clientId: string, status: string) => Promise<void>;
  createClient: (clientData: Partial<Client>) => Promise<void>;
  updateClient: (clientId: string, clientData: Partial<Client>) => Promise<void>;
  deleteClient: (clientId: string) => Promise<void>;
  metrics?: {
    totalDebt: number;
    activeFiles: number;
    recoveryRate: number;
    averageDso: number;
    monthlyRecovered: number;
    criticalFiles: number;
  };
}

const CrmContext = createContext<CrmContextType | undefined>(undefined);

interface CrmProviderProps {
  children: ReactNode;
}

export const CrmProvider: React.FC<CrmProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState(getMetrics());

  // Load data on mount and when user changes
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Load data based on user role
      if (user?.role === 'admin') {
        // Admin sees all data
        setClients(getClients());
        setInvoices(getInvoices());
        setPayments(getPayments());
        setCommunications(getCommunications());
      } else if (user?.role === 'manager') {
        // Manager sees only their assigned clients
        const managerClients = getClientsByManager(user.id);
        setClients(managerClients);
        
        // Filter related data
        const clientIds = managerClients.map(client => client.id);
        setInvoices(getInvoices().filter(invoice => clientIds.includes(invoice.client_id)));
        setPayments(getPayments().filter(payment => clientIds.includes(payment.client_id)));
        setCommunications(getCommunications().filter(comm => clientIds.includes(comm.client_id)));
      } else if (user?.role === 'client') {
        // Client sees only their own data
        const clientData = getClients().filter(client => client.user_id === user.id);
        setClients(clientData);
        
        // Filter related data
        const clientIds = clientData.map(client => client.id);
        setInvoices(getInvoices().filter(invoice => clientIds.includes(invoice.client_id)));
        setPayments(getPayments().filter(payment => clientIds.includes(payment.client_id)));
        setCommunications(getCommunications().filter(comm => clientIds.includes(comm.client_id)));
      }
      
      // Set metrics
      setMetrics(getMetrics());
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  const updateClientStatus = async (clientId: string, status: string) => {
    try {
      setIsLoading(true);
      
      // Update local state
      setClients(prev => prev.map(client => 
        client.id === clientId 
          ? { ...client, status: status as Client['status'], updated_at: new Date().toISOString() }
          : client
      ));
      
      // In a real implementation, this would update the database
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createClient = async (clientData: Partial<Client>) => {
    try {
      setIsLoading(true);
      
      const newClient: Client = {
        id: `client_${Date.now()}`,
        name: clientData.name || '',
        email: clientData.email || '',
        phone: clientData.phone,
        address: clientData.address,
        company: clientData.company,
        manager_id: clientData.manager_id,
        status: clientData.status || 'blue',
        total_amount: clientData.total_amount || 0,
        notes: clientData.notes || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setClients(prev => [...prev, newClient]);
      
      // In a real implementation, this would save to the database
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateClient = async (clientId: string, clientData: Partial<Client>) => {
    try {
      setIsLoading(true);
      
      setClients(prev => prev.map(client => 
        client.id === clientId 
          ? { ...client, ...clientData, updated_at: new Date().toISOString() }
          : client
      ));
      
      // In a real implementation, this would update the database
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteClient = async (clientId: string) => {
    try {
      setIsLoading(true);
      
      setClients(prev => prev.filter(client => client.id !== clientId));
      
      // In a real implementation, this would delete from the database
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value: CrmContextType = {
    clients,
    invoices,
    payments,
    communications,
    isLoading,
    error,
    refreshData,
    updateClientStatus,
    createClient,
    updateClient,
    deleteClient,
    metrics
  };

  return (
    <CrmContext.Provider value={value}>
      {children}
    </CrmContext.Provider>
  );
};

export const useCrm = (): CrmContextType => {
  const context = useContext(CrmContext);
  if (context === undefined) {
    throw new Error('useCrm must be used within a CrmProvider');
  }
  return context;
};