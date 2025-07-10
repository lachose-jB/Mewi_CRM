import { relanceTemplateModel, relanceRuleModel, communicationModel, clientModel, invoiceModel } from '../models/index.js';

export const relanceService = {
  // Get all templates
  getAllTemplates: async () => {
    return relanceTemplateModel.getAll();
  },
  
  // Get all rules
  getAllRules: async () => {
    return relanceRuleModel.getAll();
  },
  
  // Create a new template
  createTemplate: async (templateData) => {
    return relanceTemplateModel.create(templateData);
  },
  
  // Create a new rule
  createRule: async (ruleData) => {
    return relanceRuleModel.create(ruleData);
  },
  
  // Update a template
  updateTemplate: async (templateId, templateData) => {
    return relanceTemplateModel.update(templateId, templateData);
  },
  
  // Update a rule
  updateRule: async (ruleId, ruleData) => {
    return relanceRuleModel.update(ruleId, ruleData);
  },
  
  // Process relance rules for overdue invoices
  processRelances: async () => {
    // Get all active rules
    const rules = relanceRuleModel.getActive();
    
    // Get all overdue invoices
    const overdueInvoices = invoiceModel.getOverdue();
    
    const results = {
      processed: 0,
      emailsSent: 0,
      smsSent: 0,
      statusChanges: 0,
      errors: []
    };
    
    // Process each invoice
    for (const invoice of overdueInvoices) {
      try {
        // Calculate days overdue
        const dueDate = new Date(invoice.due_date);
        const today = new Date();
        const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
        
        // Find matching rules
        const matchingRules = rules.filter(rule => rule.trigger_days === daysOverdue);
        
        for (const rule of matchingRules) {
          results.processed++;
          
          // Process rule based on action type
          switch (rule.action) {
            case 'email':
              if (rule.template_id) {
                const template = relanceTemplateModel.getById(rule.template_id);
                if (template && template.is_active) {
                  // Get client
                  const client = clientModel.getById(invoice.client_id);
                  
                  // Replace variables in template
                  let content = template.content;
                  let subject = template.subject;
                  
                  const variables = {
                    client_name: client.name,
                    invoice_number: invoice.invoice_number,
                    amount: invoice.amount.toFixed(2),
                    days_overdue: daysOverdue,
                    due_date: new Date(invoice.due_date).toLocaleDateString()
                  };
                  
                  // Replace variables in content
                  for (const [key, value] of Object.entries(variables)) {
                    content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
                    if (subject) {
                      subject = subject.replace(new RegExp(`{{${key}}}`, 'g'), value);
                    }
                  }
                  
                  // Create communication record
                  communicationModel.create({
                    client_id: client.id,
                    type: 'email',
                    subject,
                    content,
                    status: 'sent',
                    sent_at: new Date().toISOString(),
                    metadata: JSON.stringify({
                      rule_id: rule.id,
                      invoice_id: invoice.id,
                      template_id: template.id
                    })
                  });
                  
                  results.emailsSent++;
                }
              }
              break;
              
            case 'sms':
              if (rule.template_id) {
                const template = relanceTemplateModel.getById(rule.template_id);
                if (template && template.is_active) {
                  // Get client
                  const client = clientModel.getById(invoice.client_id);
                  
                  // Replace variables in template
                  let content = template.content;
                  
                  const variables = {
                    client_name: client.name,
                    invoice_number: invoice.invoice_number,
                    amount: invoice.amount.toFixed(2),
                    days_overdue: daysOverdue
                  };
                  
                  // Replace variables in content
                  for (const [key, value] of Object.entries(variables)) {
                    content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
                  }
                  
                  // Create communication record
                  communicationModel.create({
                    client_id: client.id,
                    type: 'sms',
                    content,
                    status: 'sent',
                    sent_at: new Date().toISOString(),
                    metadata: JSON.stringify({
                      rule_id: rule.id,
                      invoice_id: invoice.id,
                      template_id: template.id
                    })
                  });
                  
                  results.smsSent++;
                }
              }
              break;
              
            case 'status_change':
              if (rule.new_status) {
                // Get client
                const client = clientModel.getById(invoice.client_id);
                
                // Update client status
                clientModel.updateStatus(client.id, rule.new_status);
                
                results.statusChanges++;
              }
              break;
          }
        }
      } catch (error) {
        results.errors.push({
          invoiceId: invoice.id,
          error: error.message
        });
      }
    }
    
    return results;
  }
};