-- Schema pour la base de données MEWI Recouvrement

-- Utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Profils
CREATE TABLE IF NOT EXISTS profiles (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  role ENUM('admin', 'manager', 'client', 'debiteur') NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  must_change_password BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

-- Clients (entreprises qui confient leurs débiteurs)
CREATE TABLE IF NOT EXISTS clients (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  address TEXT,
  company VARCHAR(255),
  manager_id VARCHAR(36),
  status ENUM('blue', 'yellow', 'orange', 'critical') NOT NULL,
  total_amount DECIMAL(12,2) DEFAULT 0,
  notes JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_contact TIMESTAMP NULL,
  siret VARCHAR(14),
  tva VARCHAR(20),
  legal_form VARCHAR(50),
  contact_name VARCHAR(255),
  contact_role VARCHAR(100),
  contact_mobile VARCHAR(20),
  accounting_contact VARCHAR(255),
  accounting_email VARCHAR(255),
  accounting_phone VARCHAR(20),
  payment_terms VARCHAR(50),
  credit_limit DECIMAL(12,2),
  risk_level ENUM('low', 'medium', 'high', 'extreme'),
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL,
  FOREIGN KEY (manager_id) REFERENCES profiles(id) ON DELETE SET NULL
);

-- Débiteurs (personnes ou entreprises qui doivent de l'argent)
CREATE TABLE IF NOT EXISTS debiteurs (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NULL,
  client_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  company VARCHAR(255),
  manager_id VARCHAR(36),
  status ENUM('new', 'inProgress', 'paymentPlan', 'disputed', 'litigation', 'recovered', 'uncollectible') NOT NULL,
  recovery_status ENUM('blue', 'yellow', 'orange', 'critical') NOT NULL,
  total_amount DECIMAL(12,2) DEFAULT 0,
  original_amount DECIMAL(12,2) DEFAULT 0,
  paid_amount DECIMAL(12,2) DEFAULT 0,
  notes JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_contact TIMESTAMP NULL,
  last_payment TIMESTAMP NULL,
  priority ENUM('low', 'medium', 'high', 'urgent') NOT NULL DEFAULT 'medium',
  risk_level ENUM('low', 'medium', 'high', 'extreme') NOT NULL DEFAULT 'medium',
  type ENUM('individual', 'company') NOT NULL DEFAULT 'individual',
  tags JSON,
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (manager_id) REFERENCES profiles(id) ON DELETE SET NULL
);

-- Factures
CREATE TABLE IF NOT EXISTS invoices (
  id VARCHAR(36) PRIMARY KEY,
  client_id VARCHAR(36) NOT NULL,
  debiteur_id VARCHAR(36) NOT NULL,
  invoice_number VARCHAR(50) NOT NULL UNIQUE,
  amount DECIMAL(12,2) NOT NULL,
  original_amount DECIMAL(12,2) NOT NULL,
  paid_amount DECIMAL(12,2) DEFAULT 0,
  due_date DATE NOT NULL,
  issue_date DATE NOT NULL,
  status ENUM('pending', 'partial', 'paid', 'overdue') NOT NULL,
  description TEXT,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (debiteur_id) REFERENCES debiteurs(id) ON DELETE CASCADE
);

-- Paiements
CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(36) PRIMARY KEY,
  client_id VARCHAR(36) NOT NULL,
  debiteur_id VARCHAR(36) NOT NULL,
  invoice_id VARCHAR(36),
  amount DECIMAL(12,2) NOT NULL,
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  due_date DATE,
  method VARCHAR(50) NOT NULL,
  reference VARCHAR(100),
  status ENUM('pending', 'completed', 'failed', 'scheduled') NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (debiteur_id) REFERENCES debiteurs(id) ON DELETE CASCADE,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL
);

-- Communications
CREATE TABLE IF NOT EXISTS communications (
  id VARCHAR(36) PRIMARY KEY,
  client_id VARCHAR(36) NOT NULL,
  debiteur_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36),
  type ENUM('email', 'sms', 'call', 'letter', 'meeting') NOT NULL,
  subject VARCHAR(255),
  content TEXT NOT NULL,
  status ENUM('sent', 'delivered', 'read', 'responded', 'failed') NOT NULL,
  scheduled_at TIMESTAMP,
  sent_at TIMESTAMP,
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (debiteur_id) REFERENCES debiteurs(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL
);

-- Documents
CREATE TABLE IF NOT EXISTS documents (
  id VARCHAR(36) PRIMARY KEY,
  client_id VARCHAR(36),
  debiteur_id VARCHAR(36),
  communication_id VARCHAR(36),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  size_bytes BIGINT,
  file_path TEXT,
  mime_type VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(36),
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (debiteur_id) REFERENCES debiteurs(id) ON DELETE CASCADE,
  FOREIGN KEY (communication_id) REFERENCES communications(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE SET NULL
);

-- Modèles de relance
CREATE TABLE IF NOT EXISTS relance_templates (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type ENUM('email', 'sms', 'letter') NOT NULL,
  subject VARCHAR(255),
  content TEXT NOT NULL,
  variables JSON,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by VARCHAR(36),
  FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE SET NULL
);

-- Règles de relance
CREATE TABLE IF NOT EXISTS relance_rules (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  trigger_days INT NOT NULL,
  action ENUM('email', 'sms', 'status_change', 'escalate') NOT NULL,
  template_id VARCHAR(36),
  new_status ENUM('blue', 'yellow', 'orange', 'critical'),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (template_id) REFERENCES relance_templates(id) ON DELETE SET NULL
);

-- Tâches
CREATE TABLE IF NOT EXISTS tasks (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  due_time TIME,
  priority ENUM('low', 'medium', 'high', 'urgent') NOT NULL DEFAULT 'medium',
  status ENUM('pending', 'completed', 'overdue', 'cancelled') NOT NULL DEFAULT 'pending',
  type ENUM('call', 'email', 'sms', 'meeting', 'follow_up', 'other') NOT NULL,
  client_id VARCHAR(36),
  debiteur_id VARCHAR(36),
  assigned_to VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  outcome TEXT,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
  FOREIGN KEY (debiteur_id) REFERENCES debiteurs(id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_to) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Logs du système
CREATE TABLE IF NOT EXISTS system_logs (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id VARCHAR(36),
  details JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL
);

-- Créer des index pour améliorer les performances
CREATE INDEX idx_clients_manager_id ON clients(manager_id);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_debiteurs_client_id ON debiteurs(client_id);
CREATE INDEX idx_debiteurs_manager_id ON debiteurs(manager_id);
CREATE INDEX idx_debiteurs_status ON debiteurs(status);
CREATE INDEX idx_debiteurs_recovery_status ON debiteurs(recovery_status);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_debiteur_id ON invoices(debiteur_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_payments_client_id ON payments(client_id);
CREATE INDEX idx_payments_debiteur_id ON payments(debiteur_id);
CREATE INDEX idx_communications_client_id ON communications(client_id);
CREATE INDEX idx_communications_debiteur_id ON communications(debiteur_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_system_logs_created_at ON system_logs(created_at);