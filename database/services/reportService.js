import { clientModel, invoiceModel, paymentModel, communicationModel } from '../models/index.js';

export const reportService = {
  // Get dashboard metrics
  getDashboardMetrics: async () => {
    const clients = clientModel.getAll();
    const invoices = invoiceModel.getAll();
    const payments = paymentModel.getAll();
    
    // Calculate metrics
    const totalDebt = clients.reduce((sum, client) => sum + client.total_amount, 0);
    const activeFiles = clients.length;
    const criticalFiles = clients.filter(client => client.status === 'critical').length;
    
    // Calculate recovery rate
    const totalInvoiced = invoices.reduce((sum, invoice) => sum + invoice.original_amount, 0);
    const totalPaid = invoices.reduce((sum, invoice) => sum + (invoice.paid_amount || 0), 0);
    const recoveryRate = totalInvoiced > 0 ? (totalPaid / totalInvoiced) * 100 : 0;
    
    // Calculate average DSO (Days Sales Outstanding)
    const paidInvoices = invoices.filter(invoice => invoice.status === 'paid' || invoice.status === 'partial');
    let totalDso = 0;
    let invoiceCount = 0;
    
    for (const invoice of paidInvoices) {
      const issueDate = new Date(invoice.issue_date);
      const paymentDate = new Date(invoice.payment_date || new Date());
      const dso = Math.floor((paymentDate - issueDate) / (1000 * 60 * 60 * 24));
      totalDso += dso;
      invoiceCount++;
    }
    
    const averageDso = invoiceCount > 0 ? Math.round(totalDso / invoiceCount) : 0;
    
    // Calculate monthly recovered amount
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyPayments = payments.filter(payment => 
      new Date(payment.payment_date) >= firstDayOfMonth && 
      payment.status === 'completed'
    );
    const monthlyRecovered = monthlyPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    return {
      totalDebt,
      activeFiles,
      recoveryRate: parseFloat(recoveryRate.toFixed(1)),
      averageDso,
      monthlyRecovered,
      criticalFiles
    };
  },
  
  // Get manager performance report
  getManagerPerformance: async () => {
    const clients = clientModel.getAll();
    const payments = paymentModel.getAll();
    
    // Group clients by manager
    const managerClients = {};
    for (const client of clients) {
      if (client.manager_id) {
        if (!managerClients[client.manager_id]) {
          managerClients[client.manager_id] = [];
        }
        managerClients[client.manager_id].push(client);
      }
    }
    
    // Calculate performance for each manager
    const performance = [];
    for (const [managerId, clients] of Object.entries(managerClients)) {
      const totalAssigned = clients.reduce((sum, client) => sum + client.total_amount, 0);
      const totalOriginal = clients.reduce((sum, client) => {
        const clientInvoices = invoiceModel.getByClient(client.id);
        return sum + clientInvoices.reduce((s, inv) => s + inv.original_amount, 0);
      }, 0);
      
      // Get client IDs for this manager
      const clientIds = clients.map(client => client.id);
      
      // Get payments for these clients
      const managerPayments = payments.filter(payment => 
        clientIds.includes(payment.client_id) && 
        payment.status === 'completed'
      );
      
      const recovered = managerPayments.reduce((sum, payment) => sum + payment.amount, 0);
      const rate = totalOriginal > 0 ? (recovered / totalOriginal) * 100 : 0;
      
      performance.push({
        managerId,
        managerName: clients[0].manager_name || 'Unknown',
        clientCount: clients.length,
        totalAssigned,
        recovered,
        rate: parseFloat(rate.toFixed(1))
      });
    }
    
    return performance.sort((a, b) => b.rate - a.rate);
  },
  
  // Get communication statistics
  getCommunicationStats: async () => {
    const communications = communicationModel.getAll();
    
    // Group by type
    const stats = {
      email: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0
      },
      sms: {
        sent: 0,
        delivered: 0,
        read: 0
      },
      call: {
        attempted: 0,
        connected: 0,
        successful: 0
      },
      letter: {
        sent: 0,
        delivered: 0
      }
    };
    
    // Count communications by type and status
    for (const comm of communications) {
      switch (comm.type) {
        case 'email':
          stats.email.sent++;
          if (comm.status === 'delivered' || comm.status === 'read' || comm.status === 'responded') {
            stats.email.delivered++;
          }
          if (comm.status === 'read' || comm.status === 'responded') {
            stats.email.opened++;
          }
          if (comm.status === 'responded') {
            stats.email.clicked++;
          }
          break;
          
        case 'sms':
          stats.sms.sent++;
          if (comm.status === 'delivered' || comm.status === 'read' || comm.status === 'responded') {
            stats.sms.delivered++;
          }
          if (comm.status === 'read' || comm.status === 'responded') {
            stats.sms.read++;
          }
          break;
          
        case 'call':
          stats.call.attempted++;
          if (comm.status === 'delivered' || comm.status === 'responded') {
            stats.call.connected++;
          }
          if (comm.status === 'responded') {
            stats.call.successful++;
          }
          break;
          
        case 'letter':
          stats.letter.sent++;
          if (comm.status === 'delivered' || comm.status === 'read' || comm.status === 'responded') {
            stats.letter.delivered++;
          }
          break;
      }
    }
    
    return stats;
  }
};