import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, Plus, Building2, Mail, Phone, Home, LayoutGrid, Table as TableIcon, Edit, Trash2, Clock, UserCircle, MapPin, Upload, X, Filter, MoreVertical, Calendar, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { toast } from 'sonner@2.0.3';
import { Textarea } from './ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

type Client = {
  id: string;
  name: string;
  photo: string;
  email: string;
  phone: string;
  address: string;
  projects: number;
  addedBy: string;
  addedDate: string;
  lastModified: string;
  modifiedBy: string;
  status: 'active' | 'inactive';
};

type ClientsPageProps = {
  onNavigate: (page: 'dashboard' | 'clients' | 'accounts' | 'projects' | 'activity' | 'notifications') => void;
  onNavigateToClientDetail?: (clientId: string) => void;
  userRole?: 'admin' | 'employee';
};

export default function ClientsPage({ onNavigate, onNavigateToClientDetail, userRole = 'admin' }: ClientsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date'>('name');
  const [clientToDelete, setClientToDelete] = useState<{id: string, name: string} | null>(null);
  const [dateRangeFilter, setDateRangeFilter] = useState<'all' | 'today' | 'week' | 'month' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [clients, setClients] = useState<Client[]>([
    { 
      id: '1', 
      name: 'PT. Indonesia Maju', 
      photo: 'https://api.dicebear.com/7.x/initials/svg?seed=PT Indonesia Maju',
      email: 'info@indonesiamaju.co.id', 
      phone: '+62 21 1234567',
      address: 'Jl. Sudirman No. 123, Jakarta Pusat 10220',
      projects: 5, 
      addedBy: 'Budi Santoso',
      addedDate: '2024-01-15',
      lastModified: '2024-11-01 14:30',
      modifiedBy: 'Siti Nurhaliza',
      status: 'active' 
    },
    { 
      id: '2', 
      name: 'CV. Sejahtera', 
      photo: 'https://api.dicebear.com/7.x/initials/svg?seed=CV Sejahtera',
      email: 'contact@sejahtera.com', 
      phone: '+62 21 7654321',
      address: 'Jl. Gatot Subroto Kav. 45, Jakarta Selatan 12950',
      projects: 3, 
      addedBy: 'Siti Nurhaliza',
      addedDate: '2024-03-20',
      lastModified: '2024-10-28 09:15',
      modifiedBy: 'Ahmad Rizki',
      status: 'active' 
    },
    { 
      id: '3', 
      name: 'PT. Teknologi Nusantara', 
      photo: 'https://api.dicebear.com/7.x/initials/svg?seed=PT Teknologi Nusantara',
      email: 'hello@teknusantara.id', 
      phone: '+62 21 9876543',
      address: 'Jl. HR Rasuna Said Blok X-5, Jakarta Selatan 12940',
      projects: 7, 
      addedBy: 'Ahmad Rizki',
      addedDate: '2024-02-10',
      lastModified: '2024-11-02 16:45',
      modifiedBy: 'Budi Santoso',
      status: 'active' 
    },
    { 
      id: '4', 
      name: 'PT. Maju Jaya', 
      photo: 'https://api.dicebear.com/7.x/initials/svg?seed=PT Maju Jaya',
      email: 'info@majujaya.co.id', 
      phone: '+62 21 5551234',
      address: 'Jl. Thamrin Plaza Lt. 5, Jakarta Pusat 10230',
      projects: 2, 
      addedBy: 'Dewi Lestari',
      addedDate: '2024-05-08',
      lastModified: '2024-10-15 11:20',
      modifiedBy: 'Dewi Lestari',
      status: 'active' 
    },
    { 
      id: '5', 
      name: 'CV. Digital Prima', 
      photo: 'https://api.dicebear.com/7.x/initials/svg?seed=CV Digital Prima',
      email: 'contact@digitalprima.com', 
      phone: '+62 21 4445678',
      address: 'Jl. Kuningan Barat No. 26, Jakarta Selatan 12710',
      projects: 4, 
      addedBy: 'Eko Prasetyo',
      addedDate: '2024-04-12',
      lastModified: '2024-09-20 13:30',
      modifiedBy: 'Rina Wijaya',
      status: 'inactive' 
    },
    { 
      id: '6', 
      name: 'PT. Karya Mandiri', 
      photo: 'https://api.dicebear.com/7.x/initials/svg?seed=PT Karya Mandiri',
      email: 'info@karyamandiri.id', 
      phone: '+62 21 3332222',
      address: 'Jl. MT Haryono Kav. 8, Jakarta Timur 13330',
      projects: 1, 
      addedBy: 'Rina Wijaya',
      addedDate: '2024-06-25',
      lastModified: '2024-10-30 10:00',
      modifiedBy: 'Eko Prasetyo',
      status: 'active' 
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

  const filteredClients = clients
    .filter(client => {
      // Filter by search term
      const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by status
      const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
      
      // Filter by date
      const matchesDate = isWithinDateRange(client.addedDate);
      
      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      // Sort by selected criteria
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
      }
    });

  const handleDelete = (clientId: string, clientName: string) => {
    setClients(prev => prev.filter(c => c.id !== clientId));
    toast.success(`Klien "${clientName}" berhasil dihapus`);
  };

  const handleEdit = (clientId: string) => {
    toast.info('Fitur edit akan segera tersedia');
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearPhotoPreview = () => {
    setPhotoPreview('');
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
            <BreadcrumbPage>Klien</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl text-gray-900 mb-2">Manajemen Klien</h1>
          <p className="text-sm sm:text-base text-gray-600">Kelola informasi klien dan kontak</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-green-500 hover:bg-green-600 w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Klien
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Klien Baru</DialogTitle>
              <DialogDescription>
                Masukkan informasi klien baru
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Foto Perusahaan</Label>
                <div className="flex flex-col gap-3">
                  {photoPreview ? (
                    <div className="relative w-32 h-32 mx-auto">
                      <Avatar className="w-32 h-32">
                        <AvatarImage src={photoPreview} alt="Preview" />
                      </Avatar>
                      <button
                        onClick={clearPhotoPreview}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Klik untuk upload</span> atau drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, atau JPEG (MAX. 5MB)</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientName">Nama Perusahaan</Label>
                <Input id="clientName" placeholder="PT. Contoh Perusahaan" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientEmail">Email</Label>
                <Input id="clientEmail" type="email" placeholder="info@perusahaan.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientPhone">Telepon</Label>
                <Input id="clientPhone" placeholder="+62 21 1234567" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientAddress">Alamat</Label>
                <Textarea 
                  id="clientAddress" 
                  placeholder="Jl. Contoh No. 123, Jakarta Selatan 12345"
                  rows={3}
                />
              </div>
              
              <Button className="w-full bg-green-500 hover:bg-green-600">Simpan Klien</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Cari klien berdasarkan nama atau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'card' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('card')}
            >
              <LayoutGrid className="w-4 h-4 mr-2" />
              Card
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              <TableIcon className="w-4 h-4 mr-2" />
              Tabel
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Filter:</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Select value={statusFilter} onValueChange={(value: 'all' | 'active' | 'inactive') => setStatusFilter(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: 'name' | 'date') => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Urutkan: Nama (A-Z)</SelectItem>
                <SelectItem value="date">Urutkan: Terbaru</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
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
                      Reset Filter Tanggal
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            {(statusFilter !== 'all' || sortBy !== 'name' || dateRangeFilter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStatusFilter('all');
                  setSortBy('name');
                  setDateRangeFilter('all');
                  setCustomStartDate('');
                  setCustomEndDate('');
                }}
                className="text-gray-600"
              >
                <X className="w-4 h-4 mr-1" />
                Reset Semua
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Menampilkan <span className="font-semibold">{filteredClients.length}</span> dari <span className="font-semibold">{clients.length}</span> klien
        </p>
      </div>

      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {filteredClients.map((client) => (
            <Card 
              key={client.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onNavigateToClientDetail?.(client.id)}
            >
              <CardHeader className="pb-3 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={client.status === 'active' ? 'default' : 'secondary'} className={client.status === 'active' ? 'bg-green-500' : ''}>
                    {client.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onNavigateToClientDetail) {
                            onNavigateToClientDetail(client.id);
                          }
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Lihat Detail
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(client.id);
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      {userRole === 'admin' && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              setClientToDelete({id: client.id, name: client.name});
                            }}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Hapus
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-start gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={client.photo} alt={client.name} />
                    <AvatarFallback>{client.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-base">{client.name}</CardTitle>
                    <p className="text-sm text-gray-500">{client.projects} Proyek</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{client.address}</span>
                </div>
                <div className="pt-2 border-t space-y-1 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <UserCircle className="w-3 h-3 flex-shrink-0" />
                    <span>Ditambahkan: {new Date(client.addedDate).toLocaleDateString('id-ID')} oleh {client.addedBy}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 flex-shrink-0" />
                    <span>Modifikasi terakhir: {client.lastModified} oleh {client.modifiedBy}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Klien</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telepon</TableHead>
                    <TableHead>Alamat</TableHead>
                    <TableHead>Proyek</TableHead>
                    <TableHead>Tanggal Ditambahkan</TableHead>
                    <TableHead>Modifikasi Terakhir</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow 
                      key={client.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => onNavigateToClientDetail?.(client.id)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={client.photo} alt={client.name} />
                            <AvatarFallback>{client.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span className="text-gray-900">{client.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">{client.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">{client.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start gap-2 text-gray-600 max-w-xs">
                          <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span className="text-sm line-clamp-2">{client.address}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-900">{client.projects}</span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          <div>{new Date(client.addedDate).toLocaleDateString('id-ID')}</div>
                          <div className="text-xs text-gray-500">oleh {client.addedBy}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          <div>{client.lastModified}</div>
                          <div className="text-xs text-gray-500">oleh {client.modifiedBy}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                          {client.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onNavigateToClientDetail) {
                                  onNavigateToClientDetail(client.id);
                                }
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Lihat Detail
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(client.id);
                              }}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            {userRole === 'admin' && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setClientToDelete({id: client.id, name: client.name});
                                  }}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Hapus
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!clientToDelete} onOpenChange={(open) => !open && setClientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Klien?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus klien "{clientToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setClientToDelete(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (clientToDelete) {
                  handleDelete(clientToDelete.id, clientToDelete.name);
                  setClientToDelete(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
