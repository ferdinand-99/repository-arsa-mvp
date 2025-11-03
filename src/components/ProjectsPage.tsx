import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, Plus, FolderOpen, Calendar, FileText, Archive, Home, CheckCircle, Users, Filter, X, Tag, LayoutGrid, List, Edit, Trash2, Eye, MoreHorizontal, MoreVertical } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { HoverCard, HoverCardTrigger, HoverCardContent } from './ui/hover-card';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { Textarea } from './ui/textarea';

type ProjectsPageProps = {
  onSelectProject: (projectId: string) => void;
  onNavigate: (page: 'dashboard' | 'clients' | 'accounts' | 'projects' | 'activity' | 'notifications') => void;
  userRole?: 'admin' | 'employee';
};

type Employee = {
  id: string;
  name: string;
  avatar: string;
};

type Project = {
  id: string;
  name: string;
  client: string;
  category: string;
  status: 'active' | 'completed';
  startDate: string;
  endDate?: string;
  documentCount: number;
  progress: number;
  description: string;
  pic: Employee[];
  lastModifiedBy: string;
  lastModifiedDate: string;
};

export default function ProjectsPage({ onSelectProject, onNavigate, userRole = 'admin' }: ProjectsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<'all' | 'today' | 'week' | 'month' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  
  // Form states for new project dialog
  const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newProjectClient, setNewProjectClient] = useState('');
  const [newProjectCategory, setNewProjectCategory] = useState('');
  const [newProjectStartDate, setNewProjectStartDate] = useState('');
  const [selectedPICs, setSelectedPICs] = useState<Employee[]>([]);

  // Available employees for PIC selection
  const availableEmployees: Employee[] = [
    { id: '1', name: 'Budi Santoso', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi' },
    { id: '2', name: 'Siti Nurhaliza', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti' },
    { id: '3', name: 'Ahmad Rizki', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad' },
    { id: '4', name: 'Dewi Lestari', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dewi' },
    { id: '5', name: 'Eko Prasetyo', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eko' },
  ];

  const handleAddPIC = (employee: Employee) => {
    if (!selectedPICs.find(pic => pic.id === employee.id)) {
      setSelectedPICs([...selectedPICs, employee]);
    }
  };

  const handleRemovePIC = (employeeId: string) => {
    setSelectedPICs(selectedPICs.filter(pic => pic.id !== employeeId));
  };

  const handleCreateProject = () => {
    // In real app, this would make an API call
    console.log('Creating project:', {
      name: newProjectName,
      description: newProjectDescription,
      client: newProjectClient,
      category: newProjectCategory,
      startDate: newProjectStartDate,
      pic: selectedPICs
    });
    
    // Reset form
    setNewProjectName('');
    setNewProjectDescription('');
    setNewProjectClient('');
    setNewProjectCategory('');
    setNewProjectStartDate('');
    setSelectedPICs([]);
    setIsAddProjectDialogOpen(false);
  };
  
  const [projects] = useState<Project[]>([
    { 
      id: '1', 
      name: 'Proyek Alpha', 
      client: 'PT. Indonesia Maju',
      category: 'Sistem Informasi',
      status: 'active', 
      startDate: '2024-01-15', 
      documentCount: 24, 
      progress: 75,
      description: 'Pengembangan sistem manajemen data klien dan inventori',
      pic: [
        { id: '1', name: 'Budi Santoso', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi' },
        { id: '2', name: 'Siti Nurhaliza', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti' }
      ],
      lastModifiedBy: 'Budi Santoso',
      lastModifiedDate: '2024-03-15'
    },
    { 
      id: '2', 
      name: 'Proyek Beta', 
      client: 'CV. Sejahtera',
      category: 'E-Commerce',
      status: 'active', 
      startDate: '2024-02-01', 
      documentCount: 18, 
      progress: 45,
      description: 'Implementasi platform e-commerce dan sistem pembayaran',
      pic: [
        { id: '3', name: 'Ahmad Rizki', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad' }
      ],
      lastModifiedBy: 'Ahmad Rizki',
      lastModifiedDate: '2024-03-10'
    },
    { 
      id: '3', 
      name: 'Proyek Gamma', 
      client: 'PT. Teknologi Nusantara',
      category: 'Infrastruktur IT',
      status: 'active', 
      startDate: '2024-01-20', 
      documentCount: 32, 
      progress: 90,
      description: 'Modernisasi infrastruktur IT dan migrasi cloud',
      pic: [
        { id: '4', name: 'Dewi Lestari', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dewi' },
        { id: '5', name: 'Eko Prasetyo', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eko' },
        { id: '6', name: 'Fitri Handayani', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fitri' }
      ],
      lastModifiedBy: 'Dewi Lestari',
      lastModifiedDate: '2024-03-18'
    },
    { 
      id: '4', 
      name: 'Proyek Delta', 
      client: 'PT. Maju Jaya',
      category: 'Keamanan',
      status: 'completed', 
      startDate: '2023-11-10',
      endDate: '2024-01-20', 
      documentCount: 45, 
      progress: 100,
      description: 'Audit dan optimasi sistem keamanan informasi',
      pic: [
        { id: '7', name: 'Guntur Wicaksono', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guntur' }
      ],
      lastModifiedBy: 'Guntur Wicaksono',
      lastModifiedDate: '2024-01-20'
    },
    { 
      id: '5', 
      name: 'Proyek Epsilon', 
      client: 'CV. Digital Prima',
      category: 'Mobile App',
      status: 'completed', 
      startDate: '2023-10-05',
      endDate: '2023-12-15', 
      documentCount: 28, 
      progress: 100,
      description: 'Pengembangan aplikasi mobile untuk customer service',
      pic: [
        { id: '8', name: 'Hendra Kusuma', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hendra' },
        { id: '9', name: 'Indah Permata', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Indah' }
      ],
      lastModifiedBy: 'Indah Permata',
      lastModifiedDate: '2023-12-15'
    },
    { 
      id: '6', 
      name: 'Proyek Zeta', 
      client: 'PT. Karya Mandiri',
      category: 'Website',
      status: 'active', 
      startDate: '2024-03-01', 
      documentCount: 12, 
      progress: 30,
      description: 'Pembuatan website corporate dan branding digital',
      pic: [
        { id: '10', name: 'Joko Widodo', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joko' },
        { id: '11', name: 'Kartika Sari', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kartika' },
        { id: '12', name: 'Lintang Permana', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lintang' },
        { id: '13', name: 'Maya Sinta', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya' }
      ],
      lastModifiedBy: 'Kartika Sari',
      lastModifiedDate: '2024-03-12'
    },
  ]);

  // Get unique categories
  const uniqueCategories = Array.from(new Set(projects.map(p => p.category)));

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

  const activeProjects = projects.filter(p => p.status === 'active');
  const completedProjects = projects.filter(p => p.status === 'completed');

  const filterProjects = (projectList: Project[]) => {
    return projectList.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
      const matchesDate = isWithinDateRange(project.startDate);

      return matchesSearch && matchesCategory && matchesDate;
    });
  };

  const ProjectTable = ({ projectList }: { projectList: Project[] }) => (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Proyek</TableHead>
            <TableHead>Klien</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>PIC</TableHead>
            <TableHead>Dokumen</TableHead>
            <TableHead>Modifikasi Terakhir</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projectList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                Tidak ada proyek ditemukan
              </TableCell>
            </TableRow>
          ) : (
            projectList.map((project) => (
              <TableRow 
                key={project.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onSelectProject(project.id)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${project.status === 'active' ? 'bg-green-100' : 'bg-gray-100'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      {project.status === 'active' ? (
                        <FolderOpen className="w-5 h-5 text-green-600" />
                      ) : (
                        <Archive className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{project.name}</div>
                      <div className="text-sm text-gray-500">{project.description}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{project.client}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {project.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                    {project.status === 'active' ? 'Aktif' : 'Selesai'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <div className="flex -space-x-2">
                      {project.pic.slice(0, 3).map((employee, index) => (
                        <HoverCard key={employee.id} openDelay={200}>
                          <HoverCardTrigger asChild>
                            <Avatar className="w-6 h-6 border-2 border-white cursor-pointer hover:scale-110 transition-transform" style={{ zIndex: 10 - index }}>
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
                        <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                          <span className="text-xs text-gray-600">+{project.pic.length - 3}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span>{project.documentCount}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="text-sm text-gray-900">{project.lastModifiedBy}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(project.lastModifiedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          onSelectProject(project.id);
                        }}>
                          <Eye className="w-4 h-4 mr-2" />
                          Lihat Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          // Handle edit
                        }}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        {userRole === 'admin' && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600 focus:text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle delete
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Hapus
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  const ProjectCard = ({ project }: { project: Project }) => (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onSelectProject(project.id)}
    >
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant={project.status === 'active' ? 'default' : 'secondary'} className={project.status === 'active' ? 'bg-green-500' : ''}>
            {project.status === 'active' ? 'Aktif' : 'Selesai'}
          </Badge>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                onSelectProject(project.id);
              }}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                // Handle edit action - could show toast or open edit dialog
              }}
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 ${project.status === 'active' ? 'bg-green-100' : 'bg-gray-100'} rounded-lg flex items-center justify-center`}>
            {project.status === 'active' ? (
              <FolderOpen className="w-6 h-6 text-green-600" />
            ) : (
              <Archive className="w-6 h-6 text-gray-600" />
            )}
          </div>
          <div>
            <CardTitle className="text-base">{project.name}</CardTitle>
            <p className="text-sm text-gray-500">{project.client}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600 line-clamp-2">
          {project.description}
        </p>
        <div className="flex items-center gap-2 text-sm">
          <Tag className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {project.category}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4 flex-shrink-0" />
          <div className="flex items-center gap-1">
            <div className="flex -space-x-2">
              {project.pic.slice(0, 3).map((employee, index) => (
                <HoverCard key={employee.id} openDelay={200}>
                  <HoverCardTrigger asChild>
                    <Avatar className="w-6 h-6 border-2 border-white cursor-pointer hover:scale-110 transition-transform" style={{ zIndex: 10 - index }}>
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
                    <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
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
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          {project.status === 'completed' && project.endDate ? (
            <span>Periode: {new Date(project.startDate).toLocaleDateString('id-ID')} - {new Date(project.endDate).toLocaleDateString('id-ID')}</span>
          ) : (
            <span>Mulai: {new Date(project.startDate).toLocaleDateString('id-ID')}</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FileText className="w-4 h-4" />
          <span>{project.documentCount} dokumen</span>
        </div>
        <div className="pt-3 mt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Terakhir diubah oleh <span className="font-medium text-gray-700">{project.lastModifiedBy}</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(project.lastModifiedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
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
            <BreadcrumbPage>Proyek</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl text-gray-900 mb-2">Manajemen Proyek</h1>
          <p className="text-sm sm:text-base text-gray-600">Kelola proyek dan dokumen terkait</p>
        </div>
        <Dialog open={isAddProjectDialogOpen} onOpenChange={setIsAddProjectDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-500 hover:bg-green-600 w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Proyek Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Buat Proyek Baru</DialogTitle>
              <DialogDescription>
                Tambahkan proyek baru ke dalam sistem
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
                <Label htmlFor="project-client">Klien *</Label>
                <Select value={newProjectClient} onValueChange={setNewProjectClient}>
                  <SelectTrigger id="project-client">
                    <SelectValue placeholder="Pilih klien" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client1">PT. Indonesia Maju</SelectItem>
                    <SelectItem value="client2">CV. Sejahtera</SelectItem>
                    <SelectItem value="client3">PT. Teknologi Nusantara</SelectItem>
                    <SelectItem value="client4">PT. Digital Solusi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-category">Kategori Proyek *</Label>
                <Select value={newProjectCategory} onValueChange={setNewProjectCategory}>
                  <SelectTrigger id="project-category">
                    <SelectValue placeholder="Pilih kategori proyek" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sistem-informasi">Sistem Informasi</SelectItem>
                    <SelectItem value="e-commerce">E-Commerce</SelectItem>
                    <SelectItem value="mobile-app">Mobile App</SelectItem>
                    <SelectItem value="web-development">Web Development</SelectItem>
                    <SelectItem value="infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="data-analytics">Data & Analytics</SelectItem>
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
              <Button 
                onClick={handleCreateProject}
                className="bg-green-500 hover:bg-green-600"
              >
                Buat Proyek
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Cari proyek berdasarkan nama, klien, atau kategori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <div className="flex border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === 'card' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('card')}
              className="rounded-none"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="rounded-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {uniqueCategories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
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
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="bg-muted text-muted-foreground h-9 items-center justify-center rounded-xl p-[3px] flex flex-row w-fit gap-1">
          <TabsTrigger value="active" className="data-[state=active]:bg-card dark:data-[state=active]:text-foreground text-foreground dark:text-muted-foreground rounded-xl px-4">
            Proyek Aktif ({activeProjects.length})
          </TabsTrigger>
          <TabsTrigger value="archived" className="data-[state=active]:bg-card dark:data-[state=active]:text-foreground text-foreground dark:text-muted-foreground rounded-xl px-4">
            Proyek Selesai ({completedProjects.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 lg:space-y-6">
          {viewMode === 'card' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {filterProjects(activeProjects).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <ProjectTable projectList={filterProjects(activeProjects)} />
          )}
        </TabsContent>

        <TabsContent value="archived" className="space-y-4 lg:space-y-6">
          {viewMode === 'card' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {filterProjects(completedProjects).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <ProjectTable projectList={filterProjects(completedProjects)} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
