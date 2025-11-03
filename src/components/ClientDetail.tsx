import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeft, Mail, Phone, MapPin, Building2, Calendar, UserCircle, Edit, Trash2, ToggleLeft, ToggleRight, FolderOpen, Archive, FileText, Users, X, Search, Filter, Tag, Link2, Copy, Clock, Eye } from 'lucide-react';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { toast } from 'sonner@2.0.3';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';
import { Home, Plus } from 'lucide-react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from './ui/hover-card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

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

type Employee = {
  id: string;
  name: string;
  avatar: string;
};

type Project = {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed';
  startDate: string;
  endDate?: string;
  documentsCount: number;
  pic: Employee[];
  category?: string;
};

type ClientDetailProps = {
  clientId: string;
  onBack: () => void;
  onNavigate: (page: 'dashboard' | 'clients' | 'accounts' | 'projects' | 'activity' | 'notifications') => void;
  onNavigateToProject?: (projectId: string) => void;
};

export default function ClientDetail({ clientId, onBack, onNavigate, onNavigateToProject }: ClientDetailProps) {
  // Mock data - in real app, fetch based on clientId
  const [client, setClient] = useState<Client>({
    id: clientId,
    name: 'PT. Indonesia Maju',
    photo: 'https://api.dicebear.com/7.x/initials/svg?seed=PT Indonesia Maju',
    email: 'info@indonesiamaju.co.id',
    phone: '+62 21 1234567',
    address: 'Jl. Sudirman No. 123, Jakarta Pusat 10220',
    projects: 5,
    addedBy: 'Budi Santoso',
    addedDate: '2024-08-15 10:30',
    lastModified: '2024-11-01 14:30',
    modifiedBy: 'Siti Nurhaliza',
    status: 'active'
  });

  const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newProjectStartDate, setNewProjectStartDate] = useState('');
  const [newProjectStatus, setNewProjectStatus] = useState<'active' | 'completed'>('active');
  const [newProjectCategory, setNewProjectCategory] = useState('');
  const [selectedPICs, setSelectedPICs] = useState<Employee[]>([]);
  
  // Generate Link states
  const [isGenerateLinkDialogOpen, setIsGenerateLinkDialogOpen] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [linkExpiryTime, setLinkExpiryTime] = useState('');
  
  // Filter and search states for projects
  const [projectSearchTerm, setProjectSearchTerm] = useState('');
  const [projectStatusFilter, setProjectStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [projectCategoryFilter, setProjectCategoryFilter] = useState('all');

  // Daftar pegawai yang tersedia untuk dipilih sebagai PIC
  const availableEmployees: Employee[] = [
    { id: '1', name: 'Budi Santoso', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi' },
    { id: '2', name: 'Siti Nurhaliza', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti' },
    { id: '3', name: 'Ahmad Rizki', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad' },
    { id: '4', name: 'Dewi Lestari', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dewi' },
    { id: '5', name: 'Eko Prasetyo', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eko' },
    { id: '6', name: 'Fitri Handayani', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fitri' },
    { id: '7', name: 'Guntur Wicaksono', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guntur' },
    { id: '8', name: 'Hendra Kusuma', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hendra' },
    { id: '9', name: 'Indah Permata', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Indah' },
  ];

  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Website Corporate',
      description: 'Pembuatan website corporate untuk meningkatkan branding perusahaan',
      category: 'Website',
      status: 'active',
      startDate: '2024-09-01',
      documentsCount: 45,
      pic: [
        { id: '1', name: 'Budi Santoso', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi' },
        { id: '2', name: 'Siti Nurhaliza', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti' }
      ]
    },
    {
      id: '2',
      name: 'Mobile App Development',
      description: 'Pengembangan aplikasi mobile untuk layanan pelanggan',
      category: 'Mobile App',
      status: 'active',
      startDate: '2024-10-15',
      documentsCount: 23,
      pic: [
        { id: '3', name: 'Ahmad Rizki', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad' }
      ]
    },
    {
      id: '3',
      name: 'Data Migration',
      description: 'Migrasi data dari sistem lama ke sistem baru',
      category: 'Infrastruktur IT',
      status: 'completed',
      startDate: '2024-07-01',
      endDate: '2024-08-30',
      documentsCount: 67,
      pic: [
        { id: '4', name: 'Dewi Lestari', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dewi' },
        { id: '5', name: 'Eko Prasetyo', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eko' },
        { id: '6', name: 'Fitri Handayani', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fitri' }
      ]
    },
    {
      id: '4',
      name: 'Security Audit',
      description: 'Audit keamanan sistem dan infrastruktur IT',
      category: 'Keamanan',
      status: 'active',
      startDate: '2024-10-01',
      documentsCount: 12,
      pic: [
        { id: '7', name: 'Guntur Wicaksono', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guntur' }
      ]
    },
    {
      id: '5',
      name: 'Cloud Infrastructure Setup',
      description: 'Setup infrastruktur cloud untuk skalabilitas lebih baik',
      category: 'Infrastruktur IT',
      status: 'completed',
      startDate: '2024-06-01',
      endDate: '2024-07-15',
      documentsCount: 34,
      pic: [
        { id: '8', name: 'Hendra Kusuma', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hendra' },
        { id: '9', name: 'Indah Permata', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Indah' }
      ]
    }
  ]);

  const handleToggleStatus = () => {
    const newStatus = client.status === 'active' ? 'inactive' : 'active';
    setClient({ ...client, status: newStatus });
    toast.success(`Status klien diubah menjadi ${newStatus === 'active' ? 'Aktif' : 'Tidak Aktif'}`);
  };

  const handleEdit = () => {
    toast.info('Fitur edit akan segera tersedia');
  };

  const handleDelete = () => {
    toast.success(`Klien "${client.name}" berhasil dihapus`);
    setTimeout(() => onBack(), 1000);
  };

  const handleGenerateLink = () => {
    // Generate unique token
    const token = `CLT-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const baseUrl = window.location.origin;
    const link = `${baseUrl}?mode=client&token=${token}&client=${client.id}`;
    
    // Set expiry time (1 hour from now)
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);
    const expiryString = expiryDate.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    setGeneratedLink(link);
    setLinkExpiryTime(expiryString);
    setIsGenerateLinkDialogOpen(true);
    
    toast.success('Link akses klien berhasil di-generate!');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    toast.success('Link berhasil disalin ke clipboard!');
  };

  const handleAddProject = () => {
    if (!newProjectName.trim() || !newProjectDescription.trim() || !newProjectStartDate || !newProjectCategory) {
      toast.error('Harap isi semua field yang diperlukan');
      return;
    }

    if (selectedPICs.length === 0) {
      toast.error('Harap pilih minimal satu PIC');
      return;
    }

    const newProject: Project = {
      id: (projects.length + 1).toString(),
      name: newProjectName,
      description: newProjectDescription,
      status: newProjectStatus,
      startDate: newProjectStartDate,
      documentsCount: 0,
      pic: selectedPICs,
      category: newProjectCategory
    };

    setProjects([...projects, newProject]);
    toast.success(`Proyek "${newProjectName}" berhasil ditambahkan`);
    
    // Reset form
    setNewProjectName('');
    setNewProjectDescription('');
    setNewProjectStartDate('');
    setNewProjectStatus('active');
    setNewProjectCategory('');
    setSelectedPICs([]);
    setIsAddProjectDialogOpen(false);
  };

  const handleAddPIC = (employee: Employee) => {
    if (!selectedPICs.find(pic => pic.id === employee.id)) {
      setSelectedPICs([...selectedPICs, employee]);
    }
  };

  const handleRemovePIC = (employeeId: string) => {
    setSelectedPICs(selectedPICs.filter(pic => pic.id !== employeeId));
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return { 
        label: 'Aktif', 
        className: 'bg-green-500 text-white border-transparent' 
      };
    }
    return { 
      label: 'Selesai', 
      className: 'bg-blue-500 text-white border-transparent' 
    };
  };

  const isInactive = client.status === 'inactive';

  // Get unique categories from projects
  const uniqueCategories = Array.from(new Set(projects.map(p => p.category).filter(Boolean)));

  // Filter projects based on search and filters
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(projectSearchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(projectSearchTerm.toLowerCase()) ||
      (project.category && project.category.toLowerCase().includes(projectSearchTerm.toLowerCase()));
    
    const matchesStatus = projectStatusFilter === 'all' || project.status === projectStatusFilter;
    const matchesCategory = projectCategoryFilter === 'all' || project.category === projectCategoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
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
            <BreadcrumbLink asChild>
              <button onClick={onBack}>Klien</button>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{client.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Button
        variant="outline"
        onClick={onBack}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali ke Daftar Klien
      </Button>

      {/* Client Information Section */}
      <Card className={isInactive ? 'bg-gray-100' : ''}>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <CardTitle className={isInactive ? 'text-gray-500' : ''}>Informasi Klien</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateLink}
                className="bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100"
              >
                <Link2 className="w-4 h-4 mr-2" />
                Generate Link
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className={isInactive ? 'text-gray-500 border-gray-300' : ''}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Data
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleStatus}
                className={isInactive ? 'text-gray-500 border-gray-300' : ''}
              >
                {client.status === 'active' ? (
                  <>
                    <ToggleRight className="w-4 h-4 mr-2" />
                    Nonaktifkan
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4 mr-2" />
                    Aktifkan
                  </>
                )}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Hapus
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Klien?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Apakah Anda yakin ingin menghapus klien "{client.name}"? Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data terkait.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Hapus
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Photo and Name */}
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className={`w-32 h-32 ${isInactive ? 'opacity-50' : ''}`}>
                <AvatarImage src={client.photo} alt={client.name} />
                <AvatarFallback>{client.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className={`text-xl ${isInactive ? 'text-gray-500' : 'text-gray-900'}`}>{client.name}</h2>
                <Badge 
                  variant="outline" 
                  className={client.status === 'active' 
                    ? 'bg-green-500 text-white border-transparent mt-2' 
                    : 'bg-gray-400 text-white border-transparent mt-2'
                  }
                >
                  {client.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                </Badge>
              </div>
            </div>

            {/* Middle & Right: Contact Information */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isInactive ? 'text-gray-400' : 'text-gray-600'}`} />
                  <div>
                    <p className={`text-xs ${isInactive ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
                    <p className={`text-sm ${isInactive ? 'text-gray-500' : 'text-gray-900'}`}>{client.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isInactive ? 'text-gray-400' : 'text-gray-600'}`} />
                  <div>
                    <p className={`text-xs ${isInactive ? 'text-gray-400' : 'text-gray-500'}`}>Telepon</p>
                    <p className={`text-sm ${isInactive ? 'text-gray-500' : 'text-gray-900'}`}>{client.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isInactive ? 'text-gray-400' : 'text-gray-600'}`} />
                  <div>
                    <p className={`text-xs ${isInactive ? 'text-gray-400' : 'text-gray-500'}`}>Alamat</p>
                    <p className={`text-sm ${isInactive ? 'text-gray-500' : 'text-gray-900'}`}>{client.address}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <UserCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isInactive ? 'text-gray-400' : 'text-gray-600'}`} />
                  <div>
                    <p className={`text-xs ${isInactive ? 'text-gray-400' : 'text-gray-500'}`}>Ditambahkan Oleh</p>
                    <p className={`text-sm ${isInactive ? 'text-gray-500' : 'text-gray-900'}`}>{client.addedBy}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isInactive ? 'text-gray-400' : 'text-gray-600'}`} />
                  <div>
                    <p className={`text-xs ${isInactive ? 'text-gray-400' : 'text-gray-500'}`}>Tanggal Ditambahkan</p>
                    <p className={`text-sm ${isInactive ? 'text-gray-500' : 'text-gray-900'}`}>{client.addedDate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isInactive ? 'text-gray-400' : 'text-gray-600'}`} />
                  <div>
                    <p className={`text-xs ${isInactive ? 'text-gray-400' : 'text-gray-500'}`}>Total Proyek</p>
                    <p className={`text-sm ${isInactive ? 'text-gray-500' : 'text-gray-900'}`}>{client.projects} Proyek</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Section */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className={`text-xl ${isInactive ? 'text-gray-500' : 'text-gray-900'}`}>Daftar Proyek</h2>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className={isInactive ? 'text-gray-500 border-gray-300' : ''}>
                {filteredProjects.length} dari {projects.length} Proyek
              </Badge>
              <Dialog open={isAddProjectDialogOpen} onOpenChange={setIsAddProjectDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    className="gap-2"
                    disabled={isInactive}
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Proyek
                  </Button>
                </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Tambah Proyek Baru</DialogTitle>
                  <DialogDescription>
                    Tambahkan proyek baru untuk klien {client.name}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-name">Nama Proyek *</Label>
                    <Input
                      id="project-name"
                      placeholder="Masukkan nama proyek"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-description">Deskripsi *</Label>
                    <Textarea
                      id="project-description"
                      placeholder="Deskripsi singkat proyek"
                      value={newProjectDescription}
                      onChange={(e) => setNewProjectDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-category">Kategori Proyek *</Label>
                    <Select value={newProjectCategory} onValueChange={setNewProjectCategory}>
                      <SelectTrigger id="project-category">
                        <SelectValue placeholder="Pilih kategori proyek" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="consulting">Consulting</SelectItem>
                        <SelectItem value="infrastructure">Infrastructure</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                        <SelectItem value="data">Data & Analytics</SelectItem>
                        <SelectItem value="other">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-start-date">Tanggal Mulai *</Label>
                    <Input
                      id="project-start-date"
                      type="date"
                      value={newProjectStartDate}
                      onChange={(e) => setNewProjectStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>PIC (Person In Charge) *</Label>
                    <div className="space-y-2">
                      <Select onValueChange={(value) => {
                        const employee = availableEmployees.find(e => e.id === value);
                        if (employee) handleAddPIC(employee);
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih PIC" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableEmployees
                            .filter(emp => !selectedPICs.find(pic => pic.id === emp.id))
                            .map((employee) => (
                              <SelectItem key={employee.id} value={employee.id}>
                                {employee.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      {selectedPICs.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedPICs.map((pic) => (
                            <Badge key={pic.id} variant="secondary" className="gap-2 pr-1">
                              <Avatar className="w-5 h-5">
                                <AvatarImage src={pic.avatar} alt={pic.name} />
                                <AvatarFallback className="text-xs">{pic.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <span>{pic.name}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0.5 hover:bg-transparent"
                                onClick={() => handleRemovePIC(pic.id)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddProjectDialogOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button onClick={handleAddProject}>
                    Tambah Proyek
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            </div>
          </div>

          {/* Search and Filter UI */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isInactive ? 'text-gray-300' : 'text-gray-400'}`} />
              <Input
                placeholder="Cari proyek berdasarkan nama, deskripsi, atau kategori..."
                value={projectSearchTerm}
                onChange={(e) => setProjectSearchTerm(e.target.value)}
                className="pl-10"
                disabled={isInactive}
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={projectStatusFilter} onValueChange={(value: any) => setProjectStatusFilter(value)} disabled={isInactive}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                </SelectContent>
              </Select>

              <Select value={projectCategoryFilter} onValueChange={setProjectCategoryFilter} disabled={isInactive}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {uniqueCategories.map(category => (
                    <SelectItem key={category} value={category as string}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(projectSearchTerm || projectStatusFilter !== 'all' || projectCategoryFilter !== 'all') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setProjectSearchTerm('');
                    setProjectStatusFilter('all');
                    setProjectCategoryFilter('all');
                  }}
                  disabled={isInactive}
                >
                  <X className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className={`hover:shadow-lg transition-shadow cursor-pointer ${
                isInactive ? 'bg-gray-100 border-gray-300' : ''
              }`}
              onClick={() => !isInactive && onNavigateToProject?.(project.id)}
            >
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge 
                    variant={project.status === 'active' ? 'default' : 'secondary'} 
                    className={`${project.status === 'active' ? isInactive ? 'bg-gray-400' : 'bg-green-500' : ''} ${isInactive ? 'opacity-60' : ''}`}
                  >
                    {getStatusBadge(project.status).label}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isInactive) {
                          onNavigateToProject?.(project.id);
                        }
                      }}
                      disabled={isInactive}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isInactive) {
                          toast.info('Fitur edit proyek akan segera tersedia');
                        }
                      }}
                      disabled={isInactive}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${
                    project.status === 'active'
                      ? isInactive ? 'bg-gray-200' : 'bg-green-100'
                      : isInactive ? 'bg-gray-200' : 'bg-gray-100'
                  } rounded-lg flex items-center justify-center`}>
                    {project.status === 'active' ? (
                      <FolderOpen className={`w-6 h-6 ${isInactive ? 'text-gray-400' : 'text-green-600'}`} />
                    ) : (
                      <Archive className={`w-6 h-6 ${isInactive ? 'text-gray-400' : 'text-gray-600'}`} />
                    )}
                  </div>
                  <div>
                    <CardTitle className={`text-base ${isInactive ? 'text-gray-500' : ''}`}>
                      {project.name}
                    </CardTitle>
                    <p className={`text-sm ${isInactive ? 'text-gray-400' : 'text-gray-500'}`}>
                      {client.name}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className={`text-sm line-clamp-2 ${isInactive ? 'text-gray-400' : 'text-gray-600'}`}>
                  {project.description}
                </p>
                {project.category && (
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className={`w-4 h-4 flex-shrink-0 ${isInactive ? 'text-gray-400' : 'text-gray-400'}`} />
                    <Badge variant="outline" className={`${isInactive ? 'bg-gray-100 text-gray-500 border-gray-300' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                      {project.category}
                    </Badge>
                  </div>
                )}
                <div className={`flex items-center gap-2 text-sm ${isInactive ? 'text-gray-400' : 'text-gray-600'}`} onClick={(e) => e.stopPropagation()}>
                  <Users className="w-4 h-4 flex-shrink-0" />
                  <div className="flex items-center gap-1">
                    <div className="flex -space-x-2">
                      {project.pic.slice(0, 3).map((employee, index) => (
                        <HoverCard key={employee.id} openDelay={200}>
                          <HoverCardTrigger asChild>
                            <Avatar className={`w-6 h-6 border-2 border-white cursor-pointer hover:scale-110 transition-transform ${isInactive ? 'opacity-60' : ''}`} style={{ zIndex: 10 - index }}>
                              <AvatarImage src={employee.avatar} alt={employee.name} />
                              <AvatarFallback className="text-xs">{employee.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-auto p-3" side="top">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={employee.avatar} alt={employee.name} />
                                <AvatarFallback>{employee.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm text-gray-900">{employee.name}</p>
                                <p className="text-xs text-gray-500">PIC Proyek</p>
                              </div>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      ))}
                      {project.pic.length > 3 && (
                        <HoverCard openDelay={200}>
                          <HoverCardTrigger asChild>
                            <div className={`w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center cursor-pointer hover:scale-110 transition-transform ${isInactive ? 'opacity-60' : ''}`}>
                              <span className="text-xs text-gray-600">+{project.pic.length - 3}</span>
                            </div>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-auto p-3" side="top">
                            <div className="space-y-2">
                              <p className="text-xs text-gray-500 mb-2">PIC Lainnya:</p>
                              {project.pic.slice(3).map((employee) => (
                                <div key={employee.id} className="flex items-center gap-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarImage src={employee.avatar} alt={employee.name} />
                                    <AvatarFallback className="text-xs">{employee.name.substring(0, 2)}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm text-gray-900">{employee.name}</span>
                                </div>
                              ))}
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      )}
                    </div>
                    <span className="ml-1">{project.pic.length} PIC</span>
                  </div>
                </div>
                <div className={`flex items-center gap-2 text-sm ${isInactive ? 'text-gray-400' : 'text-gray-600'}`}>
                  <Calendar className="w-4 h-4" />
                  {project.status === 'completed' && project.endDate ? (
                    <span>Periode: {new Date(project.startDate).toLocaleDateString('id-ID')} - {new Date(project.endDate).toLocaleDateString('id-ID')}</span>
                  ) : (
                    <span>Mulai: {new Date(project.startDate).toLocaleDateString('id-ID')}</span>
                  )}
                </div>
                <div className={`flex items-center gap-2 text-sm ${isInactive ? 'text-gray-400' : 'text-gray-600'}`}>
                  <FileText className="w-4 h-4" />
                  <span>{project.documentsCount} dokumen</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <Card className={isInactive ? 'bg-gray-100' : ''}>
            <CardContent className="py-12 text-center">
              <Building2 className={`w-12 h-12 mx-auto mb-3 ${isInactive ? 'text-gray-400' : 'text-gray-300'}`} />
              <p className={isInactive ? 'text-gray-500' : 'text-gray-600'}>
                {projects.length === 0 ? 'Belum ada proyek untuk klien ini' : 'Tidak ada proyek yang sesuai dengan filter'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog Generate Link */}
      <Dialog open={isGenerateLinkDialogOpen} onOpenChange={setIsGenerateLinkDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link2 className="w-5 h-5 text-purple-600" />
              Link Akses Klien Berhasil Di-generate
            </DialogTitle>
            <DialogDescription>
              Link akses untuk klien <strong>{client.name}</strong> telah berhasil dibuat dan berlaku selama 1 jam.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Info Alert */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-orange-800">
                  <p className="font-medium mb-1">Link akan kedaluwarsa pada:</p>
                  <p className="text-base font-semibold">{linkExpiryTime}</p>
                </div>
              </div>
            </div>

            {/* Link Display */}
            <div className="space-y-2">
              <Label>Link Akses:</Label>
              <div className="flex gap-2">
                <Input
                  value={generatedLink}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button onClick={handleCopyLink} size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Salin
                </Button>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2 text-sm">Instruksi:</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span>1.</span>
                  <span>Salin link di atas dan kirimkan kepada klien</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>2.</span>
                  <span>Klien dapat mengakses portal dokumen dengan membuka link tersebut</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>3.</span>
                  <span>Link akan kedaluwarsa otomatis setelah 1 jam</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>4.</span>
                  <span>Generate link baru jika klien membutuhkan akses lagi</span>
                </li>
              </ul>
            </div>

            {/* Warning */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-800">
                <strong>Perhatian:</strong> Jangan bagikan link ini kepada pihak yang tidak berwenang. 
                Klien hanya dapat melihat dokumen dari proyek yang terafiliasi dengan perusahaannya.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsGenerateLinkDialogOpen(false)}>
              Tutup
            </Button>
            <Button onClick={handleCopyLink} className="bg-purple-600 hover:bg-purple-700">
              <Copy className="w-4 h-4 mr-2" />
              Salin Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
