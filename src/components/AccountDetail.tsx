import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeft, Mail, Phone, Shield, Calendar, User, MessageSquare, FolderOpen, Archive, Clock, Home, Filter, X, CalendarIcon, Edit, Trash2, Search } from 'lucide-react';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarComponent } from './ui/calendar';

type Account = {
  id: string;
  name: string;
  email: string;
  role: string;
  position: string;
  phone: string;
  whatsapp: string;
  status: 'active' | 'inactive';
  addedBy: string;
  addedDate: string;
  lastModified: string;
  modifiedBy: string;
  avatar: string;
};

type Project = {
  id: string;
  name: string;
  client: string;
  status: 'active' | 'completed';
  startDate: string;
  endDate?: string;
  documentsCount: number;
};

type ActivityLog = {
  id: string;
  action: string;
  target: string;
  timestamp: string;
};

type AccountDetailProps = {
  accountId: string;
  onBack: () => void;
  onNavigate: (page: 'dashboard' | 'clients' | 'accounts' | 'projects' | 'activity' | 'notifications') => void;
  onNavigateToProject: (projectId: string) => void;
};

export default function AccountDetail({ accountId, onBack, onNavigate, onNavigateToProject }: AccountDetailProps) {
  const [timePeriod, setTimePeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [filterMonth, setFilterMonth] = useState<string>('all');
  const [filterYear, setFilterYear] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  
  // Activity Log filters
  const [filterActivityType, setFilterActivityType] = useState<string>('all');
  const [filterActivityMonth, setFilterActivityMonth] = useState<string>('all');
  const [filterActivityYear, setFilterActivityYear] = useState<string>('all');
  const [activityDateRange, setActivityDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [activitySearchTerm, setActivitySearchTerm] = useState('');
  
  // Mock data - in real app, fetch based on accountId
  const allAccounts: Account[] = [
    {
      id: '1',
      name: 'Budi Santoso',
      email: 'budi.santoso@company.com',
      role: 'Administrator',
      position: 'IT Manager',
      phone: '+62 812-3456-7890',
      whatsapp: '+62 812-3456-7890',
      status: 'active',
      addedBy: 'System',
      addedDate: '2024-01-15',
      lastModified: '2024-10-20',
      modifiedBy: 'Admin User',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi'
    },
    {
      id: '2',
      name: 'Siti Nurhaliza',
      email: 'siti.n@company.com',
      role: 'Project Manager',
      position: 'Senior PM',
      phone: '+62 813-4567-8901',
      whatsapp: '+62 813-4567-8901',
      status: 'active',
      addedBy: 'Budi Santoso',
      addedDate: '2024-02-10',
      lastModified: '2024-11-01',
      modifiedBy: 'Budi Santoso',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti'
    },
    {
      id: '3',
      name: 'Ahmad Rizki',
      email: 'ahmad.r@company.com',
      role: 'Staff',
      position: 'Sales Executive',
      phone: '+62 814-5678-9012',
      whatsapp: '+62 814-5678-9012',
      status: 'active',
      addedBy: 'Budi Santoso',
      addedDate: '2024-03-05',
      lastModified: '2024-10-15',
      modifiedBy: 'Siti Nurhaliza',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad'
    },
  ];

  const account = allAccounts.find(acc => acc.id === accountId) || allAccounts[0];

  const [projects] = useState<Project[]>([
    {
      id: '1',
      name: 'Website Corporate',
      client: 'PT. Indonesia Maju',
      status: 'active',
      startDate: '2024-09-01',
      documentsCount: 15
    },
    {
      id: '2',
      name: 'Sistem Inventory',
      client: 'PT. Maju Bersama',
      status: 'active',
      startDate: '2024-10-01',
      documentsCount: 8
    },
    {
      id: '3',
      name: 'Mobile App Development',
      client: 'CV. Digital Solution',
      status: 'completed',
      startDate: '2024-07-15',
      endDate: '2024-09-30',
      documentsCount: 22
    },
  ]);

  const [activityLogs] = useState<ActivityLog[]>([
    { id: '1', action: 'Mengupload dokumen', target: 'data-keuangan-q3.csv', timestamp: '2024-11-03 14:30' },
    { id: '2', action: 'Menambahkan proyek', target: 'Website Corporate', timestamp: '2024-11-03 10:15' },
    { id: '3', action: 'Mengubah status proyek', target: 'Mobile App Development', timestamp: '2024-11-02 16:45' },
    { id: '4', action: 'Menghapus dokumen', target: 'old-report.csv', timestamp: '2024-11-02 09:20' },
    { id: '5', action: 'Mengupload dokumen', target: 'sales-data.csv', timestamp: '2024-11-01 15:10' },
    { id: '6', action: 'Menambahkan klien', target: 'PT. Indonesia Maju', timestamp: '2024-11-01 11:00' },
  ]);

  // Screentime data based on period
  const getScreentimeData = () => {
    if (timePeriod === 'daily') {
      return [
        { label: '00:00', hours: 0 },
        { label: '04:00', hours: 0 },
        { label: '08:00', hours: 2.5 },
        { label: '12:00', hours: 3.2 },
        { label: '16:00', hours: 4.1 },
        { label: '20:00', hours: 1.5 },
        { label: '23:59', hours: 0 },
      ];
    } else if (timePeriod === 'weekly') {
      return [
        { label: 'Sen', hours: 7.2 },
        { label: 'Sel', hours: 6.8 },
        { label: 'Rab', hours: 8.1 },
        { label: 'Kam', hours: 7.5 },
        { label: 'Jum', hours: 6.3 },
        { label: 'Sab', hours: 2.1 },
        { label: 'Min', hours: 0.5 },
      ];
    } else {
      return [
        { label: 'Minggu 1', hours: 32.5 },
        { label: 'Minggu 2', hours: 35.2 },
        { label: 'Minggu 3', hours: 30.8 },
        { label: 'Minggu 4', hours: 33.1 },
      ];
    }
  };

  const getPeriodLabel = () => {
    const today = new Date();
    if (timePeriod === 'daily') {
      return today.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } else if (timePeriod === 'weekly') {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + 1);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return `${startOfWeek.toLocaleDateString('id-ID')} - ${endOfWeek.toLocaleDateString('id-ID')}`;
    } else {
      return today.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Administrator': return 'bg-purple-100 text-purple-700';
      case 'Manager': return 'bg-blue-100 text-blue-700';
      case 'Project Manager': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const screentimeData = getScreentimeData();
  const totalHours = screentimeData.reduce((acc, curr) => acc + curr.hours, 0);

  // Filter projects based on selected filters
  const filteredProjects = projects.filter((project) => {
    const projectDate = new Date(project.startDate);
    
    // Filter by month
    if (filterMonth !== 'all' && projectDate.getMonth() + 1 !== parseInt(filterMonth)) {
      return false;
    }
    
    // Filter by year
    if (filterYear !== 'all' && projectDate.getFullYear() !== parseInt(filterYear)) {
      return false;
    }
    
    // Filter by date range
    if (dateRange.from && projectDate < dateRange.from) {
      return false;
    }
    if (dateRange.to && projectDate > dateRange.to) {
      return false;
    }
    
    return true;
  });

  const hasActiveFilters = filterMonth !== 'all' || filterYear !== 'all' || dateRange.from || dateRange.to;

  const resetFilters = () => {
    setFilterMonth('all');
    setFilterYear('all');
    setDateRange({ from: undefined, to: undefined });
  };

  const months = [
    { value: 'all', label: 'Semua Bulan' },
    { value: '1', label: 'Januari' },
    { value: '2', label: 'Februari' },
    { value: '3', label: 'Maret' },
    { value: '4', label: 'April' },
    { value: '5', label: 'Mei' },
    { value: '6', label: 'Juni' },
    { value: '7', label: 'Juli' },
    { value: '8', label: 'Agustus' },
    { value: '9', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
  ];

  const years = [
    { value: 'all', label: 'Semua Tahun' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
  ];

  // Activity log filtering
  const getActivityType = (action: string): string => {
    if (action.toLowerCase().includes('upload')) return 'upload';
    if (action.toLowerCase().includes('hapus')) return 'delete';
    if (action.toLowerCase().includes('ubah') || action.toLowerCase().includes('edit')) return 'edit';
    if (action.toLowerCase().includes('tambah')) return 'tambah';
    return 'other';
  };

  const filteredActivityLogs = activityLogs.filter((log) => {
    // Filter by search term
    if (activitySearchTerm) {
      const searchLower = activitySearchTerm.toLowerCase();
      const matchesSearch = 
        log.action.toLowerCase().includes(searchLower) || 
        log.target.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Filter by activity type
    if (filterActivityType !== 'all') {
      const activityType = getActivityType(log.action);
      if (activityType !== filterActivityType) return false;
    }

    // Parse timestamp
    const logDate = new Date(log.timestamp);

    // Filter by month
    if (filterActivityMonth !== 'all' && logDate.getMonth() + 1 !== parseInt(filterActivityMonth)) {
      return false;
    }

    // Filter by year
    if (filterActivityYear !== 'all' && logDate.getFullYear() !== parseInt(filterActivityYear)) {
      return false;
    }

    // Filter by date range
    if (activityDateRange.from && logDate < activityDateRange.from) {
      return false;
    }
    if (activityDateRange.to) {
      const endOfDay = new Date(activityDateRange.to);
      endOfDay.setHours(23, 59, 59, 999);
      if (logDate > endOfDay) {
        return false;
      }
    }

    return true;
  });

  const hasActiveActivityFilters = 
    filterActivityType !== 'all' || 
    filterActivityMonth !== 'all' || 
    filterActivityYear !== 'all' || 
    activityDateRange.from || 
    activityDateRange.to ||
    activitySearchTerm !== '';

  const resetActivityFilters = () => {
    setFilterActivityType('all');
    setFilterActivityMonth('all');
    setFilterActivityYear('all');
    setActivityDateRange({ from: undefined, to: undefined });
    setActivitySearchTerm('');
  };

  // Count activities by type
  const activityCounts = {
    upload: filteredActivityLogs.filter(log => getActivityType(log.action) === 'upload').length,
    delete: filteredActivityLogs.filter(log => getActivityType(log.action) === 'delete').length,
    edit: filteredActivityLogs.filter(log => getActivityType(log.action) === 'edit').length,
    tambah: filteredActivityLogs.filter(log => getActivityType(log.action) === 'tambah').length,
  };

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
            <BreadcrumbLink asChild>
              <button onClick={onBack}>Akun</button>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{account.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="px-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl text-gray-900">Detail Akun</h1>
            <p className="text-sm sm:text-base text-gray-600">Informasi lengkap pegawai</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Edit className="w-4 h-4" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Hapus</span>
          </Button>
        </div>
      </div>

      <div className="space-y-4 lg:space-y-6">
        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Pegawai</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex justify-center sm:block">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={account.avatar} alt={account.name} />
                  <AvatarFallback className="text-3xl">{account.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Nama Lengkap</p>
                    <p className="text-gray-900">{account.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Posisi/Jabatan</p>
                    <p className="text-gray-900">{account.position}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900 break-all">{account.email}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Nomor Telepon</p>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{account.phone}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Nomor WhatsApp</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start gap-2 text-sm h-auto py-2 px-3 hover:bg-green-50 hover:text-green-700 hover:border-green-500"
                      onClick={() => {
                        const cleanNumber = account.whatsapp.replace(/[^0-9]/g, '');
                        window.open(`https://wa.me/${cleanNumber}`, '_blank');
                      }}
                    >
                      <MessageSquare className="w-4 h-4 flex-shrink-0" />
                      <span>{account.whatsapp}</span>
                    </Button>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Tingkat Akses</p>
                    <Badge variant="outline" className={getRoleBadgeColor(account.role)}>
                      <Shield className="w-3 h-3 mr-1" />
                      {account.role}
                    </Badge>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Ditambahkan Oleh</p>
                      <p className="text-sm text-gray-900">{account.addedBy}</p>
                      <p className="text-xs text-gray-500">{new Date(account.addedDate).toLocaleDateString('id-ID')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Terakhir Dimodifikasi</p>
                      <p className="text-sm text-gray-900">{account.modifiedBy}</p>
                      <p className="text-xs text-gray-500">{new Date(account.lastModified).toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects List */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle>Proyek yang Ditangani ({filteredProjects.length})</CardTitle>
              
              <div className="flex flex-wrap items-center gap-2">
                <Select value={filterMonth} onValueChange={setFilterMonth}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Pilih Bulan" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map(month => (
                      <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterYear} onValueChange={setFilterYear}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Pilih Tahun" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year.value} value={year.value}>{year.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-auto justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {dateRange.from.toLocaleDateString('id-ID')} - {dateRange.to.toLocaleDateString('id-ID')}
                          </>
                        ) : (
                          dateRange.from.toLocaleDateString('id-ID')
                        )
                      ) : (
                        <span>Pilih range tanggal</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <CalendarComponent
                      mode="range"
                      selected={{ from: dateRange.from, to: dateRange.to }}
                      onSelect={(range: any) => {
                        setDateRange({ from: range?.from, to: range?.to });
                      }}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="h-10"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
                )}
              </div>
            </div>
            
            {hasActiveFilters && (
              <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                <Filter className="w-4 h-4" />
                <span>Filter aktif - Menampilkan {filteredProjects.length} dari {projects.length} proyek</span>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {filteredProjects.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Tidak ada proyek yang sesuai dengan filter</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProjects.map((project) => (
                  <div 
                    key={project.id} 
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => onNavigateToProject(project.id)}
                  >
                    <div className={`w-10 h-10 ${
                      project.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                    } rounded-lg flex items-center justify-center flex-shrink-0`}>
                      {project.status === 'active' ? (
                        <FolderOpen className="w-5 h-5 text-green-600" />
                      ) : (
                        <Archive className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-gray-900 truncate">{project.name}</h4>
                        <Badge variant={project.status === 'active' ? 'default' : 'secondary'} className={project.status === 'active' ? 'bg-green-500 flex-shrink-0' : 'flex-shrink-0'}>
                          {project.status === 'active' ? 'Aktif' : 'Selesai'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{project.client}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {project.status === 'completed' && project.endDate ? (
                            <span>{new Date(project.startDate).toLocaleDateString('id-ID')} - {new Date(project.endDate).toLocaleDateString('id-ID')}</span>
                          ) : (
                            <span>Mulai: {new Date(project.startDate).toLocaleDateString('id-ID')}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <span>{project.documentsCount} dokumen</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Screentime Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle>Waktu Aktif di Dashboard</CardTitle>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{getPeriodLabel()}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Select value={timePeriod} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setTimePeriod(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Harian</SelectItem>
                  <SelectItem value="weekly">Mingguan</SelectItem>
                  <SelectItem value="monthly">Bulanan</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl text-gray-900">{totalHours.toFixed(1)}h</p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={screentimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="label" 
                    tick={{ fontSize: 12 }}
                    stroke="#888"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="#888"
                    label={{ value: 'Jam', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                    formatter={(value: number) => [`${value.toFixed(1)} jam`, 'Durasi']}
                  />
                  <Bar dataKey="hours" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Activity Log */}
        <Card>
          <CardHeader>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle>Log Aktivitas Terbaru ({filteredActivityLogs.length})</CardTitle>
                
                {hasActiveActivityFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetActivityFilters}
                    className="h-9 self-start sm:self-auto"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Reset Filter
                  </Button>
                )}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari aktivitas atau target..."
                  value={activitySearchTerm}
                  onChange={(e) => setActivitySearchTerm(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <Select value={filterActivityType} onValueChange={setFilterActivityType}>
                  <SelectTrigger className="w-36 h-9">
                    <SelectValue placeholder="Tipe Aktivitas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tipe</SelectItem>
                    <SelectItem value="upload">Upload</SelectItem>
                    <SelectItem value="tambah">Tambah</SelectItem>
                    <SelectItem value="edit">Edit/Ubah</SelectItem>
                    <SelectItem value="delete">Hapus</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterActivityMonth} onValueChange={setFilterActivityMonth}>
                  <SelectTrigger className="w-36 h-9">
                    <SelectValue placeholder="Pilih Bulan" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map(month => (
                      <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterActivityYear} onValueChange={setFilterActivityYear}>
                  <SelectTrigger className="w-32 h-9">
                    <SelectValue placeholder="Pilih Tahun" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year.value} value={year.value}>{year.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-9 justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {activityDateRange.from ? (
                        activityDateRange.to ? (
                          <>
                            {activityDateRange.from.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - {activityDateRange.to.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                          </>
                        ) : (
                          activityDateRange.from.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                        )
                      ) : (
                        <span>Range tanggal</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <CalendarComponent
                      mode="range"
                      selected={{ from: activityDateRange.from, to: activityDateRange.to }}
                      onSelect={(range: any) => {
                        setActivityDateRange({ from: range?.from, to: range?.to });
                      }}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Activity Counts */}
              {hasActiveActivityFilters && (
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Filter className="w-3 h-3 mr-1" />
                    Filter aktif
                  </Badge>
                  {activityCounts.upload > 0 && (
                    <Badge variant="outline" className="bg-purple-50 text-purple-700">
                      Upload: {activityCounts.upload}
                    </Badge>
                  )}
                  {activityCounts.tambah > 0 && (
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Tambah: {activityCounts.tambah}
                    </Badge>
                  )}
                  {activityCounts.edit > 0 && (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                      Edit: {activityCounts.edit}
                    </Badge>
                  )}
                  {activityCounts.delete > 0 && (
                    <Badge variant="outline" className="bg-red-50 text-red-700">
                      Hapus: {activityCounts.delete}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {filteredActivityLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Tidak ada aktivitas yang sesuai dengan filter</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredActivityLogs.map((log) => (
                  <div key={log.id} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      getActivityType(log.action) === 'upload' ? 'bg-purple-500' :
                      getActivityType(log.action) === 'tambah' ? 'bg-green-500' :
                      getActivityType(log.action) === 'edit' ? 'bg-yellow-500' :
                      getActivityType(log.action) === 'delete' ? 'bg-red-500' :
                      'bg-blue-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{log.action}</p>
                      <p className="text-sm text-gray-600 truncate">{log.target}</p>
                      <p className="text-xs text-gray-500 mt-1">{log.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
