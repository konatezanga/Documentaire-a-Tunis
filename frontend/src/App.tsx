import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { LoginPage } from './components/LoginPage';
import { AdminDashboard } from './components/AdminDashboard';
import { InspectionDashboard } from './components/InspectionDashboard';
import { ProductionDashboard } from './components/ProductionDashboard';
import { JuryPresidentDashboard } from './components/JuryPresidentDashboard';
import { JuryMemberDashboard } from './components/JuryMemberDashboard';
import { SchedulePage } from './components/SchedulePage';
import { AboutPage } from './components/AboutPage';
import { Toaster } from './components/ui/sonner';

import { getHello } from './api';

export type Page = 'home' | 'login' | 'dashboard' | 'schedule' | 'about';

const AppContent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [message, setMessage] = useState('');

  // Fetch backend test message
  useEffect(() => {
    getHello()
      .then(data => setMessage(data.message))
      .catch(err => console.error(err));
  }, []);

  // Redirect to dashboard after login
  useEffect(() => {
    if (isAuthenticated && user) {
      setCurrentPage('dashboard');
    }
  }, [isAuthenticated, user]);

  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
  };

  const handleLoginSuccess = () => {
    setCurrentPage('dashboard');
  };

  const renderDashboard = () => {
    if (!isAuthenticated || !user) {
      return <HomePage onNavigate={handleNavigation} />;
    }

    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'inspection_manager':
        return <InspectionDashboard />;
      case 'production_manager':
        return <ProductionDashboard />;
      case 'jury_president':
        return <JuryPresidentDashboard />;
      case 'jury_member':
        return <JuryMemberDashboard />;
      default:
        return <HomePage onNavigate={handleNavigation} />;
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigation} />;
      case 'login':
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
      case 'dashboard':
        return renderDashboard();
      case 'schedule':
        return <SchedulePage />;
      case 'about':
        return <AboutPage />;
      default:
        return <HomePage onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E] cinema-gradient text-white">
      <Header onNavigate={handleNavigation} />
      <main>{renderPage()}</main>
      <div className="text-center mt-4 text-gray-400">{message}</div>
      <Toaster />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
