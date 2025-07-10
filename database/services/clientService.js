import { clientModel, invoiceModel, paymentModel, communicationModel } from '../models/index.js';

export const clientService = {
  // Get all clients
  getAllClients: async () => {
    return clientModel.getAll();
  },
  
  // Get clients by manager
  getClientsByManager: async (managerId) => {
    return clientModel.getByManager(managerId);
  },
  
  // Get client by ID with related data
  getClientWithDetails: async (clientId) => {
    const client = clientModel.getById(clientId);
    if (!client) {
      throw new Error('Client not found');
    }
    
    // Get related data
    const invoices = invoiceModel.getByClient(clientId);
    const payments = paymentModel.getByClient(clientId);
    const communications = communicationModel.getByClient(clientId);
    
    return {
      ...client,
      invoices,
      payments,
      communications
    };
  },
  
  // Create a new client
  createClient: async (clientData) => {
    return clientModel.create(clientData);
  },
  
  // Update a client
  updateClient: async (clientId, clientData) => {
    return clientModel.update(clientId, clientData);
  },
  
  // Update client status
  updateClientStatus: async (clientId, status) => {
    return clientModel.updateStatus(clientId, status);
  },
  
  // Delete a client
  deleteClient: async (clientId) => {
    return clientModel.delete(clientId);
  },
  
  // Get client dashboard data
  getClientDashboard: async (clientId) => {
    const client = clientModel.getById(clientId);
    if (!client) {
      throw new Error('Client not found');
    }
    
    const invoices = invoiceModel.getByClient(clientId);
    const payments = paymentModel.getByClient(clientId);
    const communications = communicationModel.getByClient(clientId);
    
    // Calculate statistics
    const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.original_amount, 0);
    const totalPaid = invoices.reduce((sum, inv) => sum + (inv.paid_amount || 0), 0);
    const totalDue = client.total_amount;
    const overdueInvoices = invoices.filter(inv => inv.status === 'overdue').length;
    
    return {
      client,
      stats: {
        totalInvoiced,
        totalPaid,
        totalDue,
        overdueInvoices,
        invoiceCount: invoices.length,
        paymentCount: payments.length,
        communicationCount: communications.length
      },
      recentInvoices: invoices.slice(0, 5),
      recentPayments: payments.slice(0, 5),
      recentCommunications: communications.slice(0, 5)
    };
  }
};