import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CrmProvider } from './contexts/CrmContext';
import LandingPage from './components/Landing/LandingPage';
import LoginForm from './components/Auth/LoginForm';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import ManagerDashboard from './components/Dashboard/ManagerDashboard';
import ClientDashboard from './components/Dashboard/ClientDashboard';
import UserManagement from './components/Management/UserManagement';
import ClientPortfolio from './components/Management/ClientPortfolio';
import SystemConfiguration from './components/Management/SystemConfiguration';
import ReportsAnalytics from './components/Management/ReportsAnalytics';
import SystemMonitoring from './components/Management/SystemMonitoring';
import BackupRestore from './components/Management/BackupRestore';
import DossierDetails from './components/Client/DossierDetails';
import InvoicesPage from './components/Client/InvoicesPage';
import PaymentsPage from './components/Client/PaymentsPage';
import HistoryPage from './components/Client/HistoryPage';
import CalendarRelances from './components/Management/CalendarRelances';
import CommunicationsManager from './components/Management/CommunicationsManager';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLogin, setShowLogin] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté et n'a pas demandé la page de login
  if (!user && !showLogin) {
    return <LandingPage onLogin={() => setShowLogin(true)} />;
  }

  // Si l'utilisateur n'est pas connecté mais a demandé la page de login
  if (!user && showLogin) {
    return <LoginForm onBack={() => setShowLogin(false)} />;
  }

  const renderContent = () => {
    // Contenu pour Administrateur
    if (user.role === 'admin') {
      switch (activeTab) {
        case 'dashboard': return <AdminDashboard />;
        case 'users': return <UserManagement />;
        case 'clients': return <ClientPortfolio />;
        case 'config': return <SystemConfiguration />;
        case 'reports': return <ReportsAnalytics />;
        case 'monitoring': return <SystemMonitoring />;
        case 'backup': return <BackupRestore />;
        default: return <AdminDashboard />;
      }
    }
    
    // Contenu pour Gestionnaire
    if (user.role === 'manager') {
      switch (activeTab) {
        case 'dashboard': return <ManagerDashboard />;
        case 'portfolio': return <ClientPortfolio />;
        case 'communications': return <CommunicationsManager />;
        case 'calendar': return <CalendarRelances userId={user.id} userRole={user.role} />;
        case 'calls': return <div className="p-6"><h1 className="text-2xl font-bold">Gestion des Appels</h1><p className="text-gray-600">Module d'appels en développement...</p></div>;
        default: return <ManagerDashboard />;
      }
    }
    
    // Contenu pour Client
    if (user.role === 'client') {
      switch (activeTab) {
        case 'dashboard': return <ClientDashboard />;
        case 'dossier': return <DossierDetails />;
        case 'invoices': return <InvoicesPage />;
        case 'payments': return <PaymentsPage />;
        case 'history': return <HistoryPage />;
        default: return <ClientDashboard />;
      }
    }

    return <div className="p-6"><h1 className="text-2xl font-bold">Accès non autorisé</h1></div>;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CrmProvider>
        <AppContent />
      </CrmProvider>
    </AuthProvider>
  );
}

export default App;