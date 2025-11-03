import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Users, UserCircle, FolderOpen, Archive, TrendingUp, ChevronRight, Home } from 'lucide-react';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';

type DashboardProps = {
  onNavigate: (page: 'dashboard' | 'clients' | 'accounts' | 'projects' | 'activity' | 'notifications') => void;
  onSelectProject?: (projectId: string) => void;
  userRole?: 'admin' | 'employee';
};

export default function Dashboard({ onNavigate, onSelectProject, userRole = 'admin' }: DashboardProps) {
  const stats = [
    { 
      title: 'Total Klien', 
      value: '24', 
      icon: Users, 
      color: 'bg-blue-100 text-blue-600',
      trend: '+3 bulan ini'
    },
    { 
      title: 'Proyek Aktif', 
      value: '12', 
      icon: FolderOpen, 
      color: 'bg-purple-100 text-purple-600',
      trend: '3 dalam progress'
    },
    { 
      title: 'Dokumen Terarsip', 
      value: '156', 
      icon: Archive, 
      color: 'bg-yellow-100 text-yellow-600',
      trend: '+12 minggu ini'
    },
  ];

  const recentActivity = [
    { user: 'Budi Santoso', action: 'mengupload dokumen CSV', project: 'Proyek Alpha', time: '5 menit lalu' },
    { user: 'Siti Nurhaliza', action: 'mengarsipkan proyek', project: 'Proyek Beta', time: '1 jam lalu' },
    { user: 'Ahmad Rizki', action: 'menambahkan klien baru', project: 'PT. Maju Jaya', time: '2 jam lalu' },
    { user: 'Dewi Lestari', action: 'mengkonversi CSV ke tabel', project: 'Proyek Gamma', time: '3 jam lalu' },
  ];

  const activeProjects = [
    { id: '1', name: 'Proyek Alpha', client: 'PT. Indonesia Maju', progress: 75, documents: 24 },
    { id: '2', name: 'Proyek Beta', client: 'CV. Sejahtera', progress: 45, documents: 18 },
    { id: '3', name: 'Proyek Gamma', client: 'PT. Teknologi Nusantara', progress: 90, documents: 32 },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
      <div className="space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-1">
                  <Home className="w-4 h-4" />
                  Home
                </button>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div>
          <h1 className="text-2xl sm:text-3xl text-gray-900 mb-2">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">Selamat datang kembali! Berikut ringkasan sistem Anda.</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-gray-600">{stat.title}</CardTitle>
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl text-gray-900 mb-1">{stat.value}</div>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {stat.trend}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Active Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Proyek Aktif</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => onNavigate('projects')}
            >
              Lihat Semua
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeProjects.map((project, index) => (
              <button
                key={index}
                className="w-full p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 rounded-lg transition-all text-left"
                onClick={() => {
                  onNavigate('projects');
                  onSelectProject(project.id);
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-900">{project.name}</p>
                    <p className="text-sm text-gray-500">{project.client}</p>
                  </div>
                  <span className="text-sm text-gray-600">{project.documents} dokumen</span>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => onNavigate('activity')}
            >
              Lihat Semua
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity, index) => (
              <button
                key={index}
                className="w-full p-3 flex gap-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 rounded-lg transition-all text-left"
                onClick={() => console.log('View activity:', activity.user)}
              >
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserCircle className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{activity.project}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
