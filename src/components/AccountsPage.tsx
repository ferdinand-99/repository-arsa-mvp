import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, Plus, UserCircle, Mail, Shield, Home, Phone, LayoutGrid, Table as TableIcon, MessageSquare, X, Filter, Edit, Trash2, MoreVertical } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';

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

type AccountsPageProps = {
  onNavigate: (page: 'dashboard' | 'clients' | 'accounts' | 'projects' | 'activity' | 'notifications') => void;
  onNavigateToAccountDetail?: (accountId: string) => void;
};

export default function AccountsPage({ onNavigate, onNavigateToAccountDetail }: AccountsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterPosition, setFilterPosition] = useState<string>('all');
  const [accountToDelete, setAccountToDelete] = useState<{id: string, name: string} | null>(null);
  
  const [accounts] = useState<Account[]>([
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
    { 
      id: '4', 
      name: 'Dewi Lestari', 
      email: 'dewi.l@company.com', 
      role: 'Staff', 
      position: 'Marketing Specialist',
      phone: '+62 815-6789-0123',
      whatsapp: '+62 815-6789-0123',
      status: 'active',
      addedBy: 'Siti Nurhaliza',
      addedDate: '2024-03-20',
      lastModified: '2024-10-25',
      modifiedBy: 'Budi Santoso',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dewi'
    },
    { 
      id: '5', 
      name: 'Eko Prasetyo', 
      email: 'eko.p@company.com', 
      role: 'Manager', 
      position: 'Finance Manager',
      phone: '+62 816-7890-1234',
      whatsapp: '+62 816-7890-1234',
      status: 'active',
      addedBy: 'Budi Santoso',
      addedDate: '2024-04-10',
      lastModified: '2024-10-30',
      modifiedBy: 'Admin User',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eko'
    },
    { 
      id: '6', 
      name: 'Rina Wijaya', 
      email: 'rina.w@company.com', 
      role: 'Staff', 
      position: 'HR Staff',
      phone: '+62 817-8901-2345',
      whatsapp: '+62 817-8901-2345',
      status: 'inactive',
      addedBy: 'Budi Santoso',
      addedDate: '2024-05-15',
      lastModified: '2024-09-01',
      modifiedBy: 'Budi Santoso',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rina'
    },
    { 
      id: '7', 
      name: 'Guntur Wicaksono', 
      email: 'guntur.w@company.com', 
      role: 'Project Manager', 
      position: 'Junior PM',
      phone: '+62 818-9012-3456',
      whatsapp: '+62 818-9012-3456',
      status: 'active',
      addedBy: 'Siti Nurhaliza',
      addedDate: '2024-06-01',
      lastModified: '2024-10-28',
      modifiedBy: 'Siti Nurhaliza',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guntur'
    },
    { 
      id: '8', 
      name: 'Hendra Kusuma', 
      email: 'hendra.k@company.com', 
      role: 'Manager', 
      position: 'Operations Manager',
      phone: '+62 819-0123-4567',
      whatsapp: '+62 819-0123-4567',
      status: 'active',
      addedBy: 'Budi Santoso',
      addedDate: '2024-07-10',
      lastModified: '2024-10-22',
      modifiedBy: 'Admin User',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hendra'
    },
  ]);

  // Get unique positions for filter
  const uniquePositions = Array.from(new Set(accounts.map(acc => acc.position)));

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = 
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.phone.includes(searchTerm) ||
      account.whatsapp.includes(searchTerm);
    
    const matchesRole = filterRole === 'all' || account.role === filterRole;
    const matchesPosition = filterPosition === 'all' || account.position === filterPosition;
    
    return matchesSearch && matchesRole && matchesPosition;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Administrator': return 'bg-purple-100 text-purple-700';
      case 'Manager': return 'bg-blue-100 text-blue-700';
      case 'Project Manager': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleDelete = (id: string, name: string) => {
    console.log(`Deleting account ${id}: ${name}`);
    // Implement delete logic here
  };

  const handleEdit = (id: string) => {
    console.log(`Editing account ${id}`);
    // Implement edit logic here
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
            <BreadcrumbPage>Akun</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl text-gray-900 mb-2">Manajemen Akun</h1>
          <p className="text-sm sm:text-base text-gray-600">Kelola akun pegawai dan hak akses</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-purple-500 hover:bg-purple-600 w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Akun
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Akun Baru</DialogTitle>
              <DialogDescription>
                Buat akun pegawai baru dengan hak akses
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accountName">Nama Lengkap</Label>
                <Input id="accountName" placeholder="Nama Pegawai" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountEmail">Email</Label>
                <Input id="accountEmail" type="email" placeholder="email@company.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountPosition">Posisi/Jabatan</Label>
                <Input id="accountPosition" placeholder="Contoh: IT Manager" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountPhone">Nomor Telepon</Label>
                <Input id="accountPhone" placeholder="+62 812-3456-7890" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountWhatsapp">Nomor WhatsApp</Label>
                <Input id="accountWhatsapp" placeholder="+62 812-3456-7890" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountRole">Tingkat Akses</Label>
                <Select>
                  <SelectTrigger id="accountRole">
                    <SelectValue placeholder="Pilih tingkat akses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="pm">Project Manager</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-purple-500 hover:bg-purple-600">Buat Akun</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Cari berdasarkan nama, email, posisi, atau nomor telepon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Filter:</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-1">
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Tingkat Akses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tingkat Akses</SelectItem>
                <SelectItem value="Administrator">Administrator</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Project Manager">Project Manager</SelectItem>
                <SelectItem value="Staff">Staff</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPosition} onValueChange={setFilterPosition}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Jabatan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jabatan</SelectItem>
                {uniquePositions.map(position => (
                  <SelectItem key={position} value={position}>{position}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(filterRole !== 'all' || filterPosition !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilterRole('all');
                  setFilterPosition('all');
                }}
                className="text-gray-600"
              >
                <X className="w-4 h-4 mr-1" />
                Reset Filter
              </Button>
            )}

            <div className="flex gap-2 ml-auto">
              <Button
                variant={viewMode === 'card' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('card')}
                className={viewMode === 'card' ? 'bg-purple-500 hover:bg-purple-600' : ''}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('table')}
                className={viewMode === 'table' ? 'bg-purple-500 hover:bg-purple-600' : ''}
              >
                <TableIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Menampilkan <span className="font-semibold">{filteredAccounts.length}</span> dari <span className="font-semibold">{accounts.length}</span> akun
        </p>
      </div>

      {/* Card View */}
      {viewMode === 'card' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {filteredAccounts.map((account) => (
            <Card 
              key={account.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onNavigateToAccountDetail?.(account.id)}
            >
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={account.status === 'active' ? 'default' : 'secondary'} className={account.status === 'active' ? 'bg-green-500' : ''}>
                    {account.status === 'active' ? 'Aktif' : 'Nonaktif'}
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
                          handleEdit(account.id);
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          setAccountToDelete({id: account.id, name: account.name});
                        }}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-start gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={account.avatar} alt={account.name} />
                    <AvatarFallback>{account.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-base">{account.name}</CardTitle>
                    <p className="text-sm text-gray-500">{account.position}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{account.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>{account.phone}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start gap-2 text-sm h-auto py-2 px-3 hover:bg-green-50 hover:text-green-700 hover:border-green-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    const cleanNumber = account.whatsapp.replace(/[^0-9]/g, '');
                    window.open(`https://wa.me/${cleanNumber}`, '_blank');
                  }}
                >
                  <MessageSquare className="w-4 h-4 flex-shrink-0" />
                  <span>{account.whatsapp}</span>
                </Button>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <Badge variant="outline" className={getRoleBadgeColor(account.role)}>
                    {account.role}
                  </Badge>
                </div>
                <div className="pt-2 border-t border-gray-100 space-y-1">
                  <p className="text-xs text-gray-500">
                    Ditambahkan: {new Date(account.addedDate).toLocaleDateString('id-ID')} oleh {account.addedBy}
                  </p>
                  <p className="text-xs text-gray-500">
                    Dimodifikasi: {new Date(account.lastModified).toLocaleDateString('id-ID')} oleh {account.modifiedBy}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="border rounded-lg overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Posisi</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>No. Telepon</TableHead>
                  <TableHead>No. WhatsApp</TableHead>
                  <TableHead>Tingkat Akses</TableHead>
                  <TableHead>Ditambahkan Oleh</TableHead>
                  <TableHead>Terakhir Modifikasi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.map((account) => (
                  <TableRow 
                    key={account.id} 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => onNavigateToAccountDetail?.(account.id)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={account.avatar} alt={account.name} />
                          <AvatarFallback>{account.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span>{account.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{account.position}</TableCell>
                    <TableCell>{account.email}</TableCell>
                    <TableCell>{account.phone}</TableCell>
                    <TableCell>{account.whatsapp}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getRoleBadgeColor(account.role)}>
                        {account.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{account.addedBy}</p>
                        <p className="text-gray-500 text-xs">{new Date(account.addedDate).toLocaleDateString('id-ID')}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{account.modifiedBy}</p>
                        <p className="text-gray-500 text-xs">{new Date(account.lastModified).toLocaleDateString('id-ID')}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={account.status === 'active' ? 'default' : 'secondary'} className={account.status === 'active' ? 'bg-green-500' : ''}>
                        {account.status === 'active' ? 'Aktif' : 'Nonaktif'}
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
                              handleEdit(account.id);
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              setAccountToDelete({id: account.id, name: account.name});
                            }}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {filteredAccounts.length === 0 && (
        <div className="text-center py-12">
          <UserCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-500 mb-2">Tidak ada akun ditemukan</h3>
          <p className="text-sm text-gray-400">Coba ubah filter atau kata kunci pencarian</p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!accountToDelete} onOpenChange={(open) => !open && setAccountToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Akun?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus akun "{accountToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAccountToDelete(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (accountToDelete) {
                  handleDelete(accountToDelete.id, accountToDelete.name);
                  setAccountToDelete(null);
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
