import React, { useState } from 'react';
import { 
  BarChart3,
  Menu,
  X
} from 'lucide-react';
import HomePage from './HomePage';
import CrmPage from './CrmPage';
import TargetPage from './TargetPage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [activePage, setActivePage] = useState('accueil');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'accueil', label: 'Accueil' },
    { id: 'crm', label: 'CRM Recouvrement' },
    { id: 'pour-qui', label: 'Pour qui ?' },
    { id: 'a-propos', label: 'À propos de nous' },
    { id: 'contact', label: 'Contact' }
  ];

  const navigateToPage = (pageId: string) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentPage = () => {
    switch (activePage) {
      case 'accueil':
        return <HomePage onLogin={onLogin} onNavigate={navigateToPage} />;
      case 'crm':
        return <CrmPage />;
      case 'pour-qui':
        return <TargetPage />;
      case 'a-propos':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage onLogin={onLogin} onNavigate={navigateToPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button 
              onClick={() => navigateToPage('accueil')}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MEWI Recouvrement</h1>
                <p className="text-xs text-gray-500">Solution Professionnelle</p>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigateToPage(item.id)}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    activePage === item.id ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={onLogin}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Se connecter
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigateToPage(item.id)}
                  className={`block w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activePage === item.id 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={onLogin}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors mt-4"
              >
                Se connecter
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Page Content */}
      <div className="pt-16">
        {renderCurrentPage()}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">MEWI Recouvrement</h3>
                  <p className="text-sm text-gray-400">Solution Professionnelle</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                La solution de recouvrement nouvelle génération pour optimiser vos processus.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => navigateToPage('crm')} className="hover:text-white transition-colors">Fonctionnalités</button></li>
                <li><a href="#" className="hover:text-white transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Intégrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Formation</a></li>
                <li><button onClick={() => navigateToPage('contact')} className="hover:text-white transition-colors">Support technique</button></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => navigateToPage('a-propos')} className="hover:text-white transition-colors">À propos</button></li>
                <li><a href="#" className="hover:text-white transition-colors">Carrières</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Presse</a></li>
                <li><button onClick={() => navigateToPage('contact')} className="hover:text-white transition-colors">Contact</button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2024 MEWI Recouvrement. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Mentions légales
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Politique de confidentialité
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                CGU
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;