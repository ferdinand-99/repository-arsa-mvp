import { useState } from 'react';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import ClientsPage from './components/ClientsPage';
import ClientDetail from './components/ClientDetail';
import AccountsPage from './components/AccountsPage';
import AccountDetail from './components/AccountDetail';
import ProjectsPage from './components/ProjectsPage';
import ProjectDetail from './components/ProjectDetail';
import ActivityLogPage from './components/ActivityLogPage';
import NotificationsPage from './components/NotificationsPage';
import MasterDataPage from './components/MasterDataPage';
import HomePage from './components/HomePage';
import EmployeeDashboard from './components/EmployeeDashboard';
import ClientPortal from './components/ClientPortal';
import { Toaster } from './components/ui/sonner';

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type Project = {
  id: string;
  name: string;
  client: string;
  status: 'active' | 'archived';
  startDate: string;
  documents: Document[];
};

export type Document = {
  id: string;
  name: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
  status: 'active' | 'archived';
  csvData?: any[][];
};

export type ActivityLog = {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
};

export type Notification = {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  timestamp: string;
  read: boolean;
};

function App() {
  const [appMode, setAppMode] = useState<'home' | 'admin' | 'employee' | 'client'>('home');
  const [clientToken, setClientToken] = useState<string>('');
  
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'clients' | 'accounts' | 'projects' | 'activity' | 'notifications' | 'master-data'>('dashboard');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user] = useState<User>({
    id: '1',
    name: 'Admin User',
    email: 'admin@company.com',
    role: 'Administrator'
  });

  const handleSelectRole = (role: 'admin' | 'employee' | 'client') => {
    if (role === 'client') {
      // Simulate token from URL parameter
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token') || 'sample-token-123';
      setClientToken(token);
    }
    setAppMode(role);
  };

  const handleLogout = () => {
    setAppMode('home');
    setCurrentPage('dashboard');
    setClientToken('');
  };

  // Home Page - Role Selection
  if (appMode === 'home') {
    return (
      <>
        <HomePage onSelectRole={handleSelectRole} />
        <Toaster />
      </>
    );
  }

  // Client Portal
  if (appMode === 'client') {
    return (
      <>
        <ClientPortal token={clientToken} />
        <Toaster />
      </>
    );
  }

  // Employee Dashboard
  if (appMode === 'employee') {
    return (
      <>
        <EmployeeDashboard onLogout={handleLogout} />
        <Toaster />
      </>
    );
  }

  // Admin Dashboard (existing)
  const handleNavigate = (page: 'dashboard' | 'clients' | 'accounts' | 'projects' | 'activity' | 'notifications' | 'master-data') => {
    setCurrentPage(page);
    setSelectedProject(null);
    setSelectedClient(null);
    setSelectedAccount(null);
    setIsSidebarOpen(false);
  };

  const handleNavigateToProject = (projectId: string) => {
    setSelectedProject(projectId);
    setCurrentPage('projects');
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={handleNavigate}
        user={user}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-auto w-full">
        <div className="lg:hidden sticky top-0 z-40 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-slate-800 rounded-lg text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h2 className="text-lg text-white">Repositori CSV</h2>
        </div>
        {currentPage === 'dashboard' && <Dashboard onNavigate={handleNavigate} onSelectProject={handleNavigateToProject} />}
        {currentPage === 'clients' && !selectedClient && (
          <ClientsPage 
            onNavigate={handleNavigate} 
            onNavigateToClientDetail={setSelectedClient}
          />
        )}
        {currentPage === 'clients' && selectedClient && (
          <ClientDetail 
            clientId={selectedClient}
            onBack={() => setSelectedClient(null)}
            onNavigate={handleNavigate}
            onNavigateToProject={handleNavigateToProject}
          />
        )}
        {currentPage === 'accounts' && !selectedAccount && (
          <AccountsPage 
            onNavigate={handleNavigate} 
            onNavigateToAccountDetail={setSelectedAccount}
          />
        )}
        {currentPage === 'accounts' && selectedAccount && (
          <AccountDetail 
            accountId={selectedAccount}
            onBack={() => setSelectedAccount(null)}
            onNavigate={handleNavigate}
            onNavigateToProject={handleNavigateToProject}
          />
        )}
        {currentPage === 'projects' && !selectedProject && (
          <ProjectsPage onSelectProject={handleNavigateToProject} onNavigate={handleNavigate} />
        )}
        {currentPage === 'projects' && selectedProject && (
          <ProjectDetail 
            projectId={selectedProject} 
            onBack={() => setSelectedProject(null)}
            onNavigate={handleNavigate}
          />
        )}
        {currentPage === 'activity' && <ActivityLogPage onNavigate={handleNavigate} />}
        {currentPage === 'notifications' && <NotificationsPage onNavigate={handleNavigate} />}
        {currentPage === 'master-data' && <MasterDataPage onNavigate={handleNavigate} />}
      </main>
      <Toaster />
    </div>
  );
}

export default App;
