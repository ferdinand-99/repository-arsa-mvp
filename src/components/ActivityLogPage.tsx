import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Search, FileText, Archive, Upload, Edit, Trash2, UserCircle, Home, Filter, Calendar, X, ChevronRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { toast } from 'sonner';

type ActivityLog = {
  id: string;
  user: string;
  action: string;
  target: string;
  type: 'upload' | 'edit' | 'archive' | 'delete' | 'create';
  timestamp: string;
  details?: string;
  targetType?: 'project' | 'client' | 'account' | 'document';
  targetId?: string;
};

type ActivityLogPageProps = {
  onNavigate: (page: 'dashboard' | 'clients' | 'accounts' | 'projects' | 'activity' | 'notifications') => void;
};

export default function ActivityLogPage({ onNavigate }: ActivityLogPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<'all' | 'today' | 'week' | 'month' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  
  const activities: ActivityLog[] = [
    { 
      id: '1', 
      user: 'Budi Santoso', 
      action: 'mengupload dokumen CSV', 
      target: 'data_klien.csv',
      type: 'upload',
      timestamp: '2024-11-03 10:30:00',
      details: 'Proyek Alpha',
      targetType: 'project',
      targetId: '1'
    },
    { 
      id: '2', 
      user: 'Siti Nurhaliza', 
      action: 'mengarsipkan proyek', 
      target: 'Proyek Beta',
      type: 'archive',
      timestamp: '2024-11-03 09:15:00',
      targetType: 'project',
      targetId: '2'
    },
    { 
      id: '3', 
      user: 'Ahmad Rizki', 
      action: 'menambahkan klien baru', 
      target: 'PT. Maju Jaya',
      type: 'create',
      timestamp: '2024-11-03 08:45:00',
      targetType: 'client',
      targetId: '3'
    },
    { 
      id: '4', 
      user: 'Dewi Lestari', 
      action: 'mengkonversi CSV ke tabel', 
      target: 'laporan_bulanan.csv',
      type: 'edit',
      timestamp: '2024-11-02 16:20:00',
      details: 'Proyek Gamma',
      targetType: 'project',
      targetId: '3'
    },
    { 
      id: '5', 
      user: 'Eko Prasetyo', 
      action: 'menghapus dokumen', 
      target: 'old_data.csv',
      type: 'delete',
      timestamp: '2024-11-02 14:10:00',
      details: 'Proyek Delta',
      targetType: 'project',
      targetId: '4'
    },
    { 
      id: '6', 
      user: 'Rina Wijaya', 
      action: 'membuat proyek baru', 
      target: 'Proyek Zeta',
      type: 'create',
      timestamp: '2024-11-02 11:30:00',
      targetType: 'project',
      targetId: '6'
    },
    { 
      id: '7', 
      user: 'Budi Santoso', 
      action: 'mengedit informasi akun', 
      target: 'Dewi Lestari',
      type: 'edit',
      timestamp: '2024-11-02 10:00:00',
      targetType: 'account',
      targetId: '3'
    },
    { 
      id: '8', 
      user: 'Siti Nurhaliza', 
      action: 'mengupload dokumen CSV', 
      target: 'inventory.csv',
      type: 'upload',
      timestamp: '2024-11-01 15:45:00',
      details: 'Proyek Alpha',
      targetType: 'project',
      targetId: '1'
    },
  ];

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'upload': return <Upload className="w-4 h-4" />;
      case 'edit': return <Edit className="w-4 h-4" />;
      case 'archive': return <Archive className="w-4 h-4" />;
      case 'delete': return <Trash2 className="w-4 h-4" />;
      case 'create': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case 'upload': return 'bg-blue-100 text-blue-700';
      case 'edit': return 'bg-yellow-100 text-yellow-700';
      case 'archive': return 'bg-orange-100 text-orange-700';
      case 'delete': return 'bg-red-100 text-red-700';
      case 'create': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleActivityClick = (activity: ActivityLog) => {
    if (activity.targetType === 'project') {
      toast.info(`Membuka detail proyek: ${activity.details || activity.target}`);
      // Navigate to project detail (you may need to pass projectId in real implementation)
      onNavigate('projects');
    } else if (activity.targetType === 'client') {
      toast.info(`Membuka detail klien: ${activity.target}`);
      // Navigate to client detail
      onNavigate('clients');
    } else if (activity.targetType === 'account') {
      toast.info(`Membuka detail akun: ${activity.target}`);
      // Navigate to account detail
      onNavigate('accounts');
    }
  };

  // Date filter logic
  const isWithinDateRange = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dateRangeFilter === 'all') return true;
    if (dateRangeFilter === 'today') {
      return date.toDateString() === today.toDateString();
    }
    if (dateRangeFilter === 'week') {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    }
    if (dateRangeFilter === 'month') {
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return date >= monthAgo;
    }
    if (dateRangeFilter === 'custom' && customStartDate && customEndDate) {
      const start = new Date(customStartDate);
      const end = new Date(customEndDate);
      return date >= start && date <= end;
    }
    return true;
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.target.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || activity.type === filterType;
    const matchesDate = isWithinDateRange(activity.timestamp);
    
    return matchesSearch && matchesType && matchesDate;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 lg:space-y-6">
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
            <BreadcrumbPage>Log Aktivitas</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div>
        <h1 className="text-2xl sm:text-3xl text-gray-900 mb-2">Log Aktivitas</h1>
        <p className="text-sm sm:text-base text-gray-600">Tracking perubahan berkas dan aktivitas pegawai</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Cari aktivitas berdasarkan user, aksi, atau target..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipe Aktivitas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Aktivitas</SelectItem>
              <SelectItem value="upload">Upload</SelectItem>
              <SelectItem value="edit">Edit</SelectItem>
              <SelectItem value="archive">Arsip</SelectItem>
              <SelectItem value="delete">Hapus</SelectItem>
              <SelectItem value="create">Buat Baru</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Calendar className="w-4 h-4" />
                Tanggal
                {dateRangeFilter !== 'all' && (
                  <Badge variant="secondary" className="ml-1 rounded-full px-1 min-w-5 h-5 flex items-center justify-center">
                    1
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm">Filter Berdasarkan Tanggal</h4>
                  <Select value={dateRangeFilter} onValueChange={(value: any) => setDateRangeFilter(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Waktu</SelectItem>
                      <SelectItem value="today">Hari Ini</SelectItem>
                      <SelectItem value="week">7 Hari Terakhir</SelectItem>
                      <SelectItem value="month">30 Hari Terakhir</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {dateRangeFilter === 'custom' && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Tanggal Mulai</Label>
                      <Input 
                        type="date" 
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tanggal Akhir</Label>
                      <Input 
                        type="date" 
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                
                {dateRangeFilter !== 'all' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setDateRangeFilter('all');
                      setCustomStartDate('');
                      setCustomEndDate('');
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reset Filter
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {(filterType !== 'all' || dateRangeFilter !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilterType('all');
                setDateRangeFilter('all');
                setCustomStartDate('');
                setCustomEndDate('');
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Reset
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Aktivitas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <div 
                key={activity.id} 
                onClick={() => handleActivityClick(activity)}
                className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className={`w-10 h-10 ${getActionColor(activity.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
                  {getActionIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-gray-900">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Target: <span className="font-medium">{activity.target}</span>
                      </p>
                      {activity.details && (
                        <p className="text-sm text-gray-500 mt-1">{activity.details}</p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0 flex flex-col items-end gap-2">
                      <div>
                        <p className="text-sm text-gray-500">
                          {new Date(activity.timestamp).toLocaleDateString('id-ID')}
                        </p>
                        <p className="text-sm text-gray-400">
                          {new Date(activity.timestamp).toLocaleTimeString('id-ID', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
