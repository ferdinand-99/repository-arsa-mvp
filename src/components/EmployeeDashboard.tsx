import { useState } from 'react';
import EmployeeSidebar from './EmployeeSidebar';
import Dashboard from './Dashboard';
import ClientsPage from './ClientsPage';
import ProjectsPage from './ProjectsPage';
import ActivityLogPage from './ActivityLogPage';
import NotificationsPage from './NotificationsPage';
import ClientDetail from './ClientDetail';
import ProjectDetail from './ProjectDetail';

type EmployeeDashboardProps = {
  onLogout: () => void;
};

export default function EmployeeDashboard({ onLogout }: EmployeeDashboardProps) {
  const [currentPage, setCurrentPage] = useState<
    'dashboard' | 'clients' | 'projects' | 'activity' | 'notifications' | 'client-detail' | 'project-detail'
  >('dashboard');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const handleNavigate = (
    page: 'dashboard' | 'clients' | 'projects' | 'activity' | 'notifications' | 'client-detail' | 'project-detail',
    id?: string
  ) => {
    setCurrentPage(page);
    if (page === 'client-detail' && id) {
      setSelectedClientId(id);
    } else {
      setSelectedClientId(null);
    }
    if (page === 'project-detail' && id) {
      setSelectedProjectId(id);
    } else {
      setSelectedProjectId(null);
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // User pegawai dengan data contoh
  const employeeUser = {
    name: 'Ahmad Hidayat',
    email: 'ahmad.hidayat@company.com',
    role: 'Pegawai' as const,
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <EmployeeSidebar
        onNavigate={handleNavigate}
        currentPage={currentPage}
        user={employeeUser}
        onLogout={onLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
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
        {currentPage === 'dashboard' && <Dashboard onNavigate={handleNavigate} userRole="employee" />}
        {currentPage === 'clients' && <ClientsPage onNavigate={handleNavigate} onNavigateToClientDetail={(id) => handleNavigate('client-detail', id)} userRole="employee" />}
        {currentPage === 'projects' && <ProjectsPage onSelectProject={(id) => handleNavigate('project-detail', id)} onNavigate={handleNavigate} userRole="employee" />}
        {currentPage === 'activity' && <ActivityLogPage onNavigate={handleNavigate} />}
        {currentPage === 'notifications' && <NotificationsPage onNavigate={handleNavigate} />}
        {currentPage === 'client-detail' && selectedClientId && (
          <ClientDetail clientId={selectedClientId} onBack={() => handleNavigate('clients')} onNavigate={handleNavigate} userRole="employee" />
        )}
        {currentPage === 'project-detail' && selectedProjectId && (
          <ProjectDetail projectId={selectedProjectId} onBack={() => handleNavigate('projects')} onNavigate={handleNavigate} userRole="employee" />
        )}
      </main>
    </div>
  );
}
