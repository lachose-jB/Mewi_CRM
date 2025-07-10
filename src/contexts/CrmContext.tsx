import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
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

// Mock data functions - in a real app these would be API calls
import { 
  getClients, 
  getDebtors,
  getInvoices, 
  getPayments, 
  getCommunications,
  getTasks, 
  getClientMetrics,
  getSystemMetrics,
  getClientById,
  getDebtorsByClientId,
  getDebtorsByManagerId,
  getAllDebtors
} from '../utils/dataUtils';

interface CrmContextType {
  // Data
  clients: Client[];
  debtors: Debtor[];
  invoices: Invoice[];
  payments: Payment[];
  communications: Communication[];
  tasks: Task[];
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Metrics
  clientMetrics: Record<string, ClientMetrics>;
  systemMetrics?: DashboardMetrics;
  
  // Actions
  refreshData: () => Promise<void>;
  updateDebtorStatus: (debtorId: string, status: string) => Promise<void>;
  updateDebtorRecoveryStatus: (debtorId: string, recoveryStatus: string) => Promise<void>;
  createClient: (clientData: Partial<Client>) => Promise<Client>;
  updateClient: (clientId: string, clientData: Partial<Client>) => Promise<Client>;
  deleteClient: (clientId: string) => Promise<void>;
  createDebtor: (debtorData: Partial<Debtor>) => Promise<Debtor>;
  updateDebtor: (debtorId: string, debtorData: Partial<Debtor>) => Promise<Debtor>;
  deleteDebtor: (debtorId: string) => Promise<void>;
  createTask: (taskData: Partial<Task>) => Promise<Task>;
  updateTask: (taskId: string, taskData: Partial<Task>) => Promise<Task>;
  completeTask: (taskId: string, outcome?: string) => Promise<Task>;
  deleteTask: (taskId: string) => Promise<void>;
}

const CrmContext = createContext<CrmContextType | undefined>(undefined);

interface CrmProviderProps {
  children: ReactNode;
}

export const CrmProvider: React.FC<CrmProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clientMetrics, setClientMetrics] = useState<Record<string, ClientMetrics>>({});
  const [systemMetrics, setSystemMetrics] = useState<DashboardMetrics | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        setDebtors(getAllDebtors());
        setInvoices(getInvoices());
        setPayments(getPayments());
        setCommunications(getCommunications());
        setTasks(getTasks());
        
        // Load all client metrics
        const metrics = getClientMetrics();
        const metricsMap: Record<string, ClientMetrics> = {};
        metrics.forEach(metric => {
          metricsMap[metric.clientId] = metric;
        });
        setClientMetrics(metricsMap);
        
        // Load system metrics
        setSystemMetrics(getSystemMetrics());
      } 
      else if (user?.role === 'manager') {
        // Manager sees their assigned clients and related debtors
        const managerClients = getClients().filter(client => client.assignedManagerId === user.id);
        setClients(managerClients);
        
        // Get debtors assigned to this manager
        const managerDebtors = getDebtorsByManagerId(user.id);
        setDebtors(managerDebtors);
        
        // Filter related data
        const debtorIds = managerDebtors.map(debtor => debtor.id);
        setInvoices(getInvoices().filter(invoice => debtorIds.includes(invoice.debtorId)));
        setPayments(getPayments().filter(payment => debtorIds.includes(payment.debtorId)));
        setCommunications(getCommunications().filter(comm => debtorIds.includes(comm.debtorId)));
        setTasks(getTasks().filter(task => 
          debtorIds.includes(task.debtorId) || task.assignedTo === user.id
        ));
        
        // Load client metrics for manager's clients
        const clientIds = managerClients.map(client => client.id);
        const metrics = getClientMetrics().filter(metric => 
          clientIds.includes(metric.clientId)
        );
        
        const metricsMap: Record<string, ClientMetrics> = {};
        metrics.forEach(metric => {
          metricsMap[metric.clientId] = metric;
        });
        setClientMetrics(metricsMap);
      } 
      else if (user?.role === 'client') {
        // Client sees only their own data
        const clientData = getClients().filter(client => client.userId === user.id);
        
        if (clientData.length > 0) {
          setClients(clientData);
          const clientId = clientData[0].id;
          
          // Get debtors for this client
          const clientDebtors = getDebtorsByClientId(clientId);
          setDebtors(clientDebtors);
          
          // Filter related data
          const debtorIds = clientDebtors.map(debtor => debtor.id);
          setInvoices(getInvoices().filter(invoice => invoice.clientId === clientId));
          setPayments(getPayments().filter(payment => payment.clientId === clientId));
          setCommunications(getCommunications().filter(comm => comm.clientId === clientId));
          setTasks(getTasks().filter(task => task.clientId === clientId));
          
          // Get client metrics
          const metrics = getClientMetrics().find(metric => metric.clientId === clientId);
          if (metrics) {
            setClientMetrics({ [clientId]: metrics });
          }
        }
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  // Debtor methods
  const updateDebtorStatus = async (debtorId: string, status: string) => {
    try {
      setIsLoading(true);
      
      // Update local state
      setDebtors(prev => prev.map(debtor => 
        debtor.id === debtorId 
          ? { ...debtor, status: status as Debtor['status'], updatedAt: new Date().toISOString() }
          : debtor
      ));
      
      // In a real implementation, this would update the database
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateDebtorRecoveryStatus = async (debtorId: string, recoveryStatus: string) => {
    try {
      setIsLoading(true);
      
      // Update local state
      setDebtors(prev => prev.map(debtor => 
        debtor.id === debtorId 
          ? { 
              ...debtor, 
              recoveryStatus: recoveryStatus as Debtor['recoveryStatus'], 
              updatedAt: new Date().toISOString() 
            }
          : debtor
      ));
      
      // In a real implementation, this would update the database
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Client methods
  const createClient = async (clientData: Partial<Client>): Promise<Client> => {
    try {
      setIsLoading(true);
      
      const newClient: Client = {
        id: `client_${Date.now()}`,
        name: clientData.name || '',
        email: clientData.email || '',
        phone: clientData.phone || '',
        company: clientData.company || '',
        address: clientData.address || '',
        contactPerson: clientData.contactPerson || '',
        contactRole: clientData.contactRole || '',
        userId: clientData.userId,
        assignedManagerId: clientData.assignedManagerId || '',
        assignedManagerName: clientData.assignedManagerName || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: clientData.status || 'active',
        contractStart: clientData.contractStart || new Date().toISOString(),
        contractEnd: clientData.contractEnd,
        notes: clientData.notes || [],
        totalDebtAmount: clientData.totalDebtAmount || 0,
        totalCollectedAmount: clientData.totalCollectedAmount || 0,
        recoveryRate: clientData.recoveryRate || 0
      };
      
      setClients(prev => [...prev, newClient]);
      
      // In a real implementation, this would save to the database
      
      return newClient;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateClient = async (clientId: string, clientData: Partial<Client>): Promise<Client> => {
    try {
      setIsLoading(true);
      
      let updatedClient: Client | undefined;
      
      setClients(prev => {
        const updated = prev.map(client => {
          if (client.id === clientId) {
            updatedClient = { 
              ...client, 
              ...clientData, 
              updatedAt: new Date().toISOString() 
            };
            return updatedClient;
          }
          return client;
        });
        return updated;
      });
      
      // In a real implementation, this would update the database
      
      if (!updatedClient) {
        throw new Error('Client non trouvé');
      }
      
      return updatedClient;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteClient = async (clientId: string): Promise<void> => {
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

  // Debtor methods
  const createDebtor = async (debtorData: Partial<Debtor>): Promise<Debtor> => {
    try {
      setIsLoading(true);
      
      const newDebtor: Debtor = {
        id: `debtor_${Date.now()}`,
        clientId: debtorData.clientId || '',
        name: debtorData.name || '',
        email: debtorData.email || '',
        phone: debtorData.phone || '',
        address: debtorData.address || '',
        company: debtorData.company,
        type: debtorData.type || 'individual',
        managerId: debtorData.managerId || '',
        managerName: debtorData.managerName || '',
        status: debtorData.status || 'new',
        recoveryStatus: debtorData.recoveryStatus || 'blue',
        totalAmount: debtorData.totalAmount || 0,
        originalAmount: debtorData.originalAmount || 0,
        paidAmount: debtorData.paidAmount || 0,
        invoiceCount: debtorData.invoiceCount || 0,
        lastPayment: debtorData.lastPayment,
        lastContact: debtorData.lastContact,
        daysOverdue: debtorData.daysOverdue || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: debtorData.notes || [],
        tags: debtorData.tags || [],
        nextAction: debtorData.nextAction,
        priority: debtorData.priority || 'medium',
        riskLevel: debtorData.riskLevel || 'medium'
      };
      
      setDebtors(prev => [...prev, newDebtor]);
      
      // Update client's total debt amount
      if (newDebtor.clientId) {
        setClients(prev => prev.map(client => {
          if (client.id === newDebtor.clientId) {
            return {
              ...client,
              totalDebtAmount: client.totalDebtAmount + newDebtor.totalAmount,
              updatedAt: new Date().toISOString()
            };
          }
          return client;
        }));
      }
      
      // In a real implementation, this would save to the database
      
      return newDebtor;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateDebtor = async (debtorId: string, debtorData: Partial<Debtor>): Promise<Debtor> => {
    try {
      setIsLoading(true);
      
      let updatedDebtor: Debtor | undefined;
      const currentDebtor = debtors.find(d => d.id === debtorId);
      
      if (!currentDebtor) {
        throw new Error('Debtor not found');
      }
      
      setDebtors(prev => {
        const updated = prev.map(debtor => {
          if (debtor.id === debtorId) {
            updatedDebtor = { 
              ...debtor, 
              ...debtorData, 
              updatedAt: new Date().toISOString() 
            };
            return updatedDebtor;
          }
          return debtor;
        });
        return updated;
      });
      
      // Update client's total debt amount if the amount has changed
      if (updatedDebtor && 
          debtorData.totalAmount !== undefined && 
          debtorData.totalAmount !== currentDebtor.totalAmount) {
        
        const amountDifference = debtorData.totalAmount - currentDebtor.totalAmount;
        
        setClients(prev => prev.map(client => {
          if (client.id === currentDebtor.clientId) {
            return {
              ...client,
              totalDebtAmount: client.totalDebtAmount + amountDifference,
              updatedAt: new Date().toISOString()
            };
          }
          return client;
        }));
      }
      
      // In a real implementation, this would update the database
      
      if (!updatedDebtor) {
        throw new Error('Debtor not found');
      }
      
      return updatedDebtor;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDebtor = async (debtorId: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      const debtorToDelete = debtors.find(d => d.id === debtorId);
      
      if (!debtorToDelete) {
        throw new Error('Debtor not found');
      }
      
      setDebtors(prev => prev.filter(debtor => debtor.id !== debtorId));
      
      // Update client's total debt amount
      setClients(prev => prev.map(client => {
        if (client.id === debtorToDelete.clientId) {
          return {
            ...client,
            totalDebtAmount: client.totalDebtAmount - debtorToDelete.totalAmount,
            updatedAt: new Date().toISOString()
          };
        }
        return client;
      }));
      
      // In a real implementation, this would delete from the database
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Task methods
  const createTask = async (taskData: Partial<Task>): Promise<Task> => {
    try {
      setIsLoading(true);
      
      const newTask: Task = {
        id: `task_${Date.now()}`,
        title: taskData.title || '',
        description: taskData.description || '',
        dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
        dueTime: taskData.dueTime || '09:00',
        priority: taskData.priority || 'medium',
        status: taskData.status || 'pending',
        type: taskData.type || 'follow_up',
        debtorId: taskData.debtorId || '',
        debtorName: taskData.debtorName || '',
        clientId: taskData.clientId || '',
        clientName: taskData.clientName || '',
        assignedTo: taskData.assignedTo || '',
        createdAt: new Date().toISOString(),
        completedAt: taskData.completedAt,
        notes: taskData.notes,
        outcome: taskData.outcome
      };
      
      setTasks(prev => [...prev, newTask]);
      
      // In a real implementation, this would save to the database
      
      return newTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (taskId: string, taskData: Partial<Task>): Promise<Task> => {
    try {
      setIsLoading(true);
      
      let updatedTask: Task | undefined;
      
      setTasks(prev => {
        const updated = prev.map(task => {
          if (task.id === taskId) {
            updatedTask = { ...task, ...taskData };
            return updatedTask;
          }
          return task;
        });
        return updated;
      });
      
      // In a real implementation, this would update the database
      
      if (!updatedTask) {
        throw new Error('Task not found');
      }
      
      return updatedTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const completeTask = async (taskId: string, outcome?: string): Promise<Task> => {
    try {
      setIsLoading(true);
      
      let completedTask: Task | undefined;
      
      setTasks(prev => {
        const updated = prev.map(task => {
          if (task.id === taskId) {
            completedTask = { 
              ...task, 
              status: 'completed',
              completedAt: new Date().toISOString(),
              outcome: outcome || task.outcome
            };
            return completedTask;
          }
          return task;
        });
        return updated;
      });
      
      // In a real implementation, this would update the database
      
      if (!completedTask) {
        throw new Error('Task not found');
      }
      
      return completedTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (taskId: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      setTasks(prev => prev.filter(task => task.id !== taskId));
      
      // In a real implementation, this would delete from the database
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Export context value
  const value: CrmContextType = {
    // Data
    clients,
    debtors,
    invoices,
    payments,
    communications,
    tasks,
    
    // Loading states
    isLoading,
    error,
    
    // Metrics
    clientMetrics,
    systemMetrics,
    
    // Actions
    refreshData,
    updateDebtorStatus,
    updateDebtorRecoveryStatus,
    createClient,
    updateClient,
    deleteClient,
    createDebtor,
    updateDebtor,
    deleteDebtor,
    createTask,
    updateTask,
    completeTask,
    deleteTask
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