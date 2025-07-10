import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CrmProvider } from './contexts/CrmContext';
import LandingPage from './components/Landing/LandingPage';
import LoginForm from './components/Auth/LoginForm';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';

// Admin components
import AdminDashboard from './components/Dashboard/AdminDashboard';
import UserManagement from './components/Management/UserManagement';
import ClientManagement from './components/Management/ClientManagement';
import SystemConfiguration from './components/Management/SystemConfiguration';
import ReportsAnalytics from './components/Management/ReportsAnalytics';
import SystemMonitoring from './components/Management/SystemMonitoring';
import BackupRestore from './components/Management/BackupRestore';

// Manager components
import ManagerDashboard from './components/Dashboard/ManagerDashboard';
import DebtorPortfolio from './components/Management/DebtorPortfolio';
import CommunicationsManager from './components/Management/CommunicationsManager';
import CalendarRelances from './components/Management/CalendarRelances';

// Client components
import ClientDashboard from './components/Client/ClientDashboard';
import DebtorsList from './components/Client/DebtorsList';
import DebtorDetails from './components/Client/DebtorDetails';
import ClientInvoices from './components/Client/ClientInvoices';
import ClientDebtorHistory from './components/Client/ClientDebtorHistory';

// Protected route component
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    // Redirect to the appropriate dashboard based on user role
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" />;
    } else if (user.role === 'manager') {
      return <Navigate to="/manager/dashboard" />;
    } else if (user.role === 'client') {
      return <Navigate to="/client/dashboard" />;
    }
    
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in and not on login page
  if (!user && !showLogin) {
    return <LandingPage onLogin={() => setShowLogin(true)} />;
  }

  // If user is not logged in but wants to see login page
  if (!user && showLogin) {
    return <LoginForm onBack={() => setShowLogin(false)} />;
  }

  // User is logged in - determine default redirect
  let defaultRedirect = '/';
  if (user) {
    if (user.role === 'admin') {
      defaultRedirect = '/admin/dashboard';
    } else if (user.role === 'manager') {
      defaultRedirect = '/manager/dashboard';
    } else if (user.role === 'client') {
      defaultRedirect = '/client/dashboard';
    }
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <Routes>
              {/* Default redirect */}
              <Route path="/" element={<Navigate to={defaultRedirect} />} />
              
              {/* Admin routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UserManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/clients" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ClientManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/config" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SystemConfiguration />
                </ProtectedRoute>
              } />
              <Route path="/admin/reports" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ReportsAnalytics />
                </ProtectedRoute>
              } />
              <Route path="/admin/monitoring" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SystemMonitoring />
                </ProtectedRoute>
              } />
              <Route path="/admin/backup" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <BackupRestore />
                </ProtectedRoute>
              } />
              
              {/* Manager routes */}
              <Route path="/manager/dashboard" element={
                <ProtectedRoute allowedRoles={['manager']}>
                  <ManagerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/manager/debtors" element={
                <ProtectedRoute allowedRoles={['manager']}>
                  <DebtorPortfolio />
                </ProtectedRoute>
              } />
              <Route path="/manager/communications" element={
                <ProtectedRoute allowedRoles={['manager']}>
                  <CommunicationsManager />
                </ProtectedRoute>
              } />
              <Route path="/manager/calendar" element={
                <ProtectedRoute allowedRoles={['manager']}>
                  <CalendarRelances userId={user?.id} userRole={user?.role} />
                </ProtectedRoute>
              } />
              
              {/* Client routes */}
              <Route path="/client/dashboard" element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientDashboard />
                </ProtectedRoute>
              } />
              <Route path="/debtors" element={
                <ProtectedRoute allowedRoles={['client']}>
                  <DebtorsList />
                </ProtectedRoute>
              } />
              <Route path="/debtors/:id" element={
                <ProtectedRoute allowedRoles={['client']}>
                  <DebtorDetails />
                </ProtectedRoute>
              } />
              <Route path="/invoices" element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientInvoices />
                </ProtectedRoute>
              } />
              <Route path="/history" element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientDebtorHistory />
                </ProtectedRoute>
              } />
              
              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to={defaultRedirect} />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
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