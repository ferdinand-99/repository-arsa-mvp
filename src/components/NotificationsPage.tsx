import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Bell, CheckCircle2, AlertCircle, Info, Trash2, Home, Calendar, X, Filter } from 'lucide-react';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Input } from './ui/input';

type Notification = {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  timestamp: string;
  read: boolean;
  details?: string;
};

type NotificationsPageProps = {
  onNavigate: (page: 'dashboard' | 'clients' | 'accounts' | 'projects' | 'activity' | 'notifications') => void;
};

export default function NotificationsPage({ onNavigate }: NotificationsPageProps) {
  const [dateRangeFilter, setDateRangeFilter] = useState<'all' | 'today' | 'week' | 'month' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      message: 'Dokumen baru diupload ke Proyek Alpha',
      type: 'info',
      timestamp: '2024-11-03 10:30:00',
      read: false,
      details: 'Budi Santoso mengupload data_klien.csv'
    },
    {
      id: '2',
      message: 'Proyek Beta berhasil diarsipkan',
      type: 'success',
      timestamp: '2024-11-03 09:15:00',
      read: false,
      details: 'Proyek dipindahkan ke arsip oleh Siti Nurhaliza'
    },
    {
      id: '3',
      message: 'Klien baru ditambahkan',
      type: 'success',
      timestamp: '2024-11-03 08:45:00',
      read: true,
      details: 'PT. Maju Jaya telah ditambahkan ke sistem'
    },
    {
      id: '4',
      message: 'Reminder: Review proyek Gamma',
      type: 'warning',
      timestamp: '2024-11-02 16:00:00',
      read: false,
      details: 'Proyek mencapai 90% - segera review'
    },
    {
      id: '5',
      message: 'CSV berhasil dikonversi ke tabel',
      type: 'success',
      timestamp: '2024-11-02 14:20:00',
      read: true,
      details: 'laporan_bulanan.csv siap untuk ditinjau'
    },
    {
      id: '6',
      message: 'Proyek Zeta telah dibuat',
      type: 'info',
      timestamp: '2024-11-02 11:30:00',
      read: true,
      details: 'Proyek baru untuk PT. Karya Mandiri'
    },
  ]);

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

  const filteredNotifications = notifications.filter(n => isWithinDateRange(n.timestamp));
  const unreadNotifications = filteredNotifications.filter(n => !n.read);
  const readNotifications = filteredNotifications.filter(n => n.read);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-5 h-5" />;
      case 'warning': return <AlertCircle className="w-5 h-5" />;
      case 'info': return <Info className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-700';
      case 'warning': return 'bg-yellow-100 text-yellow-700';
      case 'info': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    toast.success('Notifikasi ditandai telah dibaca');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('Semua notifikasi ditandai telah dibaca');
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notifikasi dihapus');
  };

  const NotificationCard = ({ notification }: { notification: Notification }) => (
    <Card className={!notification.read ? 'border-l-4 border-l-blue-500' : ''}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className={`w-10 h-10 ${getNotificationColor(notification.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
            {getNotificationIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-gray-900">{notification.message}</p>
                {notification.details && (
                  <p className="text-sm text-gray-600 mt-1">{notification.details}</p>
                )}
                <p className="text-sm text-gray-400 mt-2">
                  {new Date(notification.timestamp).toLocaleDateString('id-ID')} • {new Date(notification.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {!notification.read && (
                  <Badge variant="default" className="bg-blue-500">Baru</Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              {!notification.read && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  Tandai Dibaca
                </Button>
              )}
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleDelete(notification.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
            <BreadcrumbPage>Notifikasi</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl text-gray-900 mb-2">Notifikasi</h1>
          <p className="text-sm sm:text-base text-gray-600">Pemberitahuan aktivitas dan pembaruan sistem</p>
        </div>
        {unreadNotifications.length > 0 && (
          <Button onClick={handleMarkAllAsRead} variant="outline" className="w-full sm:w-auto">
            Tandai Semua Dibaca
          </Button>
        )}
      </div>

      <div className="flex justify-end">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              Filter Tanggal
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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Total Notifikasi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl text-gray-900">{filteredNotifications.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Belum Dibaca</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl text-blue-600">{unreadNotifications.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Sudah Dibaca</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl text-gray-500">{readNotifications.length}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="unread" className="space-y-6">
        <TabsList className="bg-muted text-muted-foreground h-9 items-center justify-center rounded-xl p-[3px] flex flex-row w-fit gap-1">
          <TabsTrigger value="unread" className="data-[state=active]:bg-card dark:data-[state=active]:text-foreground text-foreground dark:text-muted-foreground rounded-xl px-4">
            Belum Dibaca ({unreadNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="read" className="data-[state=active]:bg-card dark:data-[state=active]:text-foreground text-foreground dark:text-muted-foreground rounded-xl px-4">
            Sudah Dibaca ({readNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="data-[state=active]:bg-card dark:data-[state=active]:text-foreground text-foreground dark:text-muted-foreground rounded-xl px-4">
            Semua ({notifications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="unread" className="space-y-4">
          {unreadNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                Tidak ada notifikasi baru
              </CardContent>
            </Card>
          ) : (
            unreadNotifications.map(notification => (
              <NotificationCard key={notification.id} notification={notification} />
            ))
          )}
        </TabsContent>

        <TabsContent value="read" className="space-y-4">
          {readNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                Tidak ada notifikasi yang sudah dibaca
              </CardContent>
            </Card>
          ) : (
            readNotifications.map(notification => (
              <NotificationCard key={notification.id} notification={notification} />
            ))
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {notifications.map(notification => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
