import { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  Activity, 
  Bell, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  X
} from 'lucide-react';
import { Separator } from './ui/separator';

type EmployeeSidebarProps = {
  onNavigate: (page: 'dashboard' | 'clients' | 'projects' | 'activity' | 'notifications') => void;
  currentPage: string;
  user: {
    name: string;
    email: string;
    role: string;
  };
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
};

export default function EmployeeSidebar({ onNavigate, currentPage, user, onLogout, isOpen, onClose }: EmployeeSidebarProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [notificationCount] = useState(8);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Klien', icon: Users },
    { id: 'projects', label: 'Proyek', icon: FolderOpen },
    { id: 'activity', label: 'Log Aktivitas', icon: Activity },
    { id: 'notifications', label: 'Notifikasi', icon: Bell, badge: notificationCount },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        ${isMinimized ? 'w-20' : 'w-64'} bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800 flex flex-col
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between">
          {!isMinimized && <h1 className="text-xl text-white">Repositori CSV</h1>}
          <button 
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-slate-800 rounded text-gray-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <Separator className="bg-slate-800" />
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id as any);
                  onClose();
                }}
                className={`w-full flex items-center ${isMinimized ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg transition-colors relative ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                }`}
                title={isMinimized ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isMinimized && <span className="flex-1 text-left">{item.label}</span>}
                {!isMinimized && item.badge && item.badge > 0 && (
                  <span className="min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-red-600 text-white text-xs font-semibold rounded-full">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
                {isMinimized && item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-600 text-white text-[10px] font-semibold rounded-full">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <Separator className="bg-slate-800" />

        {/* Minimize Toggle Button */}
        <div className="p-4 hidden lg:block">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            {isMinimized ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            {!isMinimized && <span className="text-sm">Minimize</span>}
          </button>
        </div>

        <Separator className="bg-slate-800" />

        <div className="p-4">
          {!isMinimized ? (
            <div className="space-y-3">
              <div className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700">
                <p className="text-sm text-gray-400">Masuk sebagai</p>
                <p className="truncate text-white">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Keluar</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <button
                onClick={onLogout}
                title="Keluar"
                className="w-full flex items-center justify-center px-2 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
