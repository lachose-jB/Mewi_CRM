import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create database directory if it doesn't exist
const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Database file path
const dbPath = path.join(dbDir, 'crm.sqlite');

// Create or connect to the database
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

console.log('Setting up database...');

// Create tables
db.exec(`
  -- Users table (auth)
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Profiles table
  CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'client')),
    is_active BOOLEAN DEFAULT TRUE,
    must_change_password BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
  );

  -- Clients table
  CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    address TEXT,
    company TEXT,
    manager_id TEXT,
    status TEXT NOT NULL CHECK (status IN ('blue', 'yellow', 'orange', 'critical')),
    total_amount NUMERIC(12,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_contact TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL,
    FOREIGN KEY (manager_id) REFERENCES profiles(id) ON DELETE SET NULL
  );

  -- Invoices table
  CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    invoice_number TEXT UNIQUE NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    original_amount NUMERIC(12,2) NOT NULL,
    paid_amount NUMERIC(12,2) DEFAULT 0,
    due_date DATE NOT NULL,
    issue_date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'partial', 'paid', 'overdue')),
    description TEXT,
    category TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
  );

  -- Payments table
  CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    invoice_id TEXT,
    amount NUMERIC(12,2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date DATE,
    method TEXT NOT NULL,
    reference TEXT,
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'scheduled')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
  );

  -- Communications table
  CREATE TABLE IF NOT EXISTS communications (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    user_id TEXT,
    type TEXT NOT NULL CHECK (type IN ('email', 'sms', 'call', 'letter', 'meeting')),
    subject TEXT,
    content TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('sent', 'delivered', 'read', 'responded', 'failed')),
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    metadata TEXT, -- JSON stored as text
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL
  );

  -- Documents table
  CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    client_id TEXT,
    communication_id TEXT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    size_bytes INTEGER,
    file_path TEXT,
    mime_type TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (communication_id) REFERENCES communications(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE SET NULL
  );

  -- Relance Templates table
  CREATE TABLE IF NOT EXISTS relance_templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('email', 'sms', 'letter')),
    subject TEXT,
    content TEXT NOT NULL,
    variables TEXT, -- JSON array stored as text
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT,
    FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE SET NULL
  );

  -- Relance Rules table
  CREATE TABLE IF NOT EXISTS relance_rules (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    trigger_days INTEGER NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('email', 'sms', 'status_change', 'escalate')),
    template_id TEXT,
    new_status TEXT CHECK (new_status IN ('blue', 'yellow', 'orange', 'critical')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES relance_templates(id) ON DELETE SET NULL
  );

  -- System Logs table
  CREATE TABLE IF NOT EXISTS system_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    details TEXT, -- JSON stored as text
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL
  );

  -- Create indexes
  CREATE INDEX IF NOT EXISTS idx_clients_manager_id ON clients(manager_id);
  CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
  CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
  CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
  CREATE INDEX IF NOT EXISTS idx_payments_client_id ON payments(client_id);
  CREATE INDEX IF NOT EXISTS idx_communications_client_id ON communications(client_id);
  CREATE INDEX IF NOT EXISTS idx_documents_client_id ON documents(client_id);
  CREATE INDEX IF NOT EXISTS idx_system_logs_user_id ON system_logs(user_id);
  CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at);
`);

console.log('Database setup completed successfully!');