import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Initializing database...');

try {
  // Exécuter le script de configuration
  console.log('Setting up database schema...');
  execSync('node database/setup.js', { stdio: 'inherit' });
  
  // Exécuter le script de seeding
  console.log('Seeding database with initial data...');
  execSync('node database/seed.js', { stdio: 'inherit' });
  
  console.log('Database initialization completed successfully!');
} catch (error) {
  console.error('Error initializing database:', error);
  process.exit(1);
}