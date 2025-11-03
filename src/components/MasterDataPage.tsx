import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Home, Plus, Edit, Archive, Trash2, Search, FolderOpen, FileText, Briefcase, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

type MasterDataPageProps = {
  onNavigate: (page: 'dashboard' | 'clients' | 'accounts' | 'projects' | 'activity' | 'notifications' | 'master-data') => void;
};

type ProjectCategory = {
  id: string;
  category: string;
  description: string;
  icon: string;
  lastModified: string;
  addedBy: string;
  isArchived: boolean;
};

type DocumentCategory = {
  id: string;
  category: string;
  description: string;
  icon: string;
  lastModified: string;
  addedBy: string;
  isArchived: boolean;
};

type Position = {
  id: string;
  position: string;
  description: string;
  icon: string;
  lastModified: string;
  addedBy: string;
  isArchived: boolean;
};

export default function MasterDataPage({ onNavigate }: MasterDataPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');

  // Modal states
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = useState(false);
  const [isEditDocumentModalOpen, setIsEditDocumentModalOpen] = useState(false);
  const [isAddPositionModalOpen, setIsAddPositionModalOpen] = useState(false);
  const [isEditPositionModalOpen, setIsEditPositionModalOpen] = useState(false);

  // Form states for Project Category
  const [projectFormData, setProjectFormData] = useState({
    id: '',
    category: '',
    description: '',
    icon: '',
  });

  // Form states for Document Category
  const [documentFormData, setDocumentFormData] = useState({
    id: '',
    category: '',
    description: '',
    icon: '',
  });

  // Form states for Position
  const [positionFormData, setPositionFormData] = useState({
    id: '',
    position: '',
    description: '',
    icon: '',
  });

  // Sample data - Kategori Proyek
  const [projectCategories, setProjectCategories] = useState<ProjectCategory[]>([
    {
      id: '1',
      category: 'Infrastruktur',
      description: 'Proyek pembangunan infrastruktur',
      icon: '🏗️',
      lastModified: '2024-11-03',
      addedBy: 'Admin',
      isArchived: false,
    },
    {
      id: '2',
      category: 'Teknologi',
      description: 'Proyek pengembangan teknologi',
      icon: '💻',
      lastModified: '2024-11-02',
      addedBy: 'Admin',
      isArchived: false,
    },
    {
      id: '3',
      category: 'Kesehatan',
      description: 'Proyek kesehatan masyarakat',
      icon: '🏥',
      lastModified: '2024-10-28',
      addedBy: 'Budi Santoso',
      isArchived: true,
    },
  ]);

  // Sample data - Kategori Dokumen
  const [documentCategories, setDocumentCategories] = useState<DocumentCategory[]>([
    {
      id: '1',
      category: 'Laporan Keuangan',
      description: 'Dokumen laporan keuangan proyek',
      icon: '💰',
      lastModified: '2024-11-03',
      addedBy: 'Admin',
      isArchived: false,
    },
    {
      id: '2',
      category: 'Kontrak',
      description: 'Dokumen kontrak dan perjanjian',
      icon: '📝',
      lastModified: '2024-11-01',
      addedBy: 'Siti Nurhaliza',
      isArchived: false,
    },
    {
      id: '3',
      category: 'Proposal',
      description: 'Dokumen proposal proyek',
      icon: '📄',
      lastModified: '2024-10-25',
      addedBy: 'Admin',
      isArchived: true,
    },
  ]);

  // Sample data - Jabatan
  const [positions, setPositions] = useState<Position[]>([
    {
      id: '1',
      position: 'Project Manager',
      description: 'Mengelola dan mengawasi proyek',
      icon: '👔',
      lastModified: '2024-11-03',
      addedBy: 'Admin',
      isArchived: false,
    },
    {
      id: '2',
      position: 'Analyst',
      description: 'Menganalisis data dan laporan',
      icon: '📊',
      lastModified: '2024-11-02',
      addedBy: 'Admin',
      isArchived: false,
    },
    {
      id: '3',
      position: 'Developer',
      description: 'Pengembangan sistem dan aplikasi',
      icon: '💻',
      lastModified: '2024-10-30',
      addedBy: 'Budi Santoso',
      isArchived: true,
    },
  ]);

  // Add handlers
  const handleAddProject = () => {
    if (!projectFormData.category || !projectFormData.description) {
      toast.error('Mohon lengkapi semua field');
      return;
    }

    const newCategory: ProjectCategory = {
      id: Date.now().toString(),
      category: projectFormData.category,
      description: projectFormData.description,
      icon: projectFormData.icon || '📁',
      lastModified: new Date().toISOString().split('T')[0],
      addedBy: 'Admin',
      isArchived: false,
    };

    setProjectCategories([...projectCategories, newCategory]);
    setProjectFormData({ id: '', category: '', description: '', icon: '' });
    setIsAddProjectModalOpen(false);
    toast.success('Kategori proyek berhasil ditambahkan');
  };

  const handleEditProject = () => {
    if (!projectFormData.category || !projectFormData.description) {
      toast.error('Mohon lengkapi semua field');
      return;
    }

    setProjectCategories(projectCategories.map(cat =>
      cat.id === projectFormData.id
        ? {
            ...cat,
            category: projectFormData.category,
            description: projectFormData.description,
            icon: projectFormData.icon || cat.icon,
            lastModified: new Date().toISOString().split('T')[0],
          }
        : cat
    ));
    setProjectFormData({ id: '', category: '', description: '', icon: '' });
    setIsEditProjectModalOpen(false);
    toast.success('Kategori proyek berhasil diperbarui');
  };

  const handleAddDocument = () => {
    if (!documentFormData.category || !documentFormData.description) {
      toast.error('Mohon lengkapi semua field');
      return;
    }

    const newCategory: DocumentCategory = {
      id: Date.now().toString(),
      category: documentFormData.category,
      description: documentFormData.description,
      icon: documentFormData.icon || '📄',
      lastModified: new Date().toISOString().split('T')[0],
      addedBy: 'Admin',
      isArchived: false,
    };

    setDocumentCategories([...documentCategories, newCategory]);
    setDocumentFormData({ id: '', category: '', description: '', icon: '' });
    setIsAddDocumentModalOpen(false);
    toast.success('Kategori dokumen berhasil ditambahkan');
  };

  const handleEditDocument = () => {
    if (!documentFormData.category || !documentFormData.description) {
      toast.error('Mohon lengkapi semua field');
      return;
    }

    setDocumentCategories(documentCategories.map(cat =>
      cat.id === documentFormData.id
        ? {
            ...cat,
            category: documentFormData.category,
            description: documentFormData.description,
            icon: documentFormData.icon || cat.icon,
            lastModified: new Date().toISOString().split('T')[0],
          }
        : cat
    ));
    setDocumentFormData({ id: '', category: '', description: '', icon: '' });
    setIsEditDocumentModalOpen(false);
    toast.success('Kategori dokumen berhasil diperbarui');
  };

  const handleAddPosition = () => {
    if (!positionFormData.position || !positionFormData.description) {
      toast.error('Mohon lengkapi semua field');
      return;
    }

    const newPosition: Position = {
      id: Date.now().toString(),
      position: positionFormData.position,
      description: positionFormData.description,
      icon: positionFormData.icon || '👤',
      lastModified: new Date().toISOString().split('T')[0],
      addedBy: 'Admin',
      isArchived: false,
    };

    setPositions([...positions, newPosition]);
    setPositionFormData({ id: '', position: '', description: '', icon: '' });
    setIsAddPositionModalOpen(false);
    toast.success('Jabatan berhasil ditambahkan');
  };

  const handleEditPosition = () => {
    if (!positionFormData.position || !positionFormData.description) {
      toast.error('Mohon lengkapi semua field');
      return;
    }

    setPositions(positions.map(pos =>
      pos.id === positionFormData.id
        ? {
            ...pos,
            position: positionFormData.position,
            description: positionFormData.description,
            icon: positionFormData.icon || pos.icon,
            lastModified: new Date().toISOString().split('T')[0],
          }
        : pos
    ));
    setPositionFormData({ id: '', position: '', description: '', icon: '' });
    setIsEditPositionModalOpen(false);
    toast.success('Jabatan berhasil diperbarui');
  };

  const openEditProjectModal = (cat: ProjectCategory) => {
    setProjectFormData({
      id: cat.id,
      category: cat.category,
      description: cat.description,
      icon: cat.icon,
    });
    setIsEditProjectModalOpen(true);
  };

  const openEditDocumentModal = (cat: DocumentCategory) => {
    setDocumentFormData({
      id: cat.id,
      category: cat.category,
      description: cat.description,
      icon: cat.icon,
    });
    setIsEditDocumentModalOpen(true);
  };

  const openEditPositionModal = (pos: Position) => {
    setPositionFormData({
      id: pos.id,
      position: pos.position,
      description: pos.description,
      icon: pos.icon,
    });
    setIsEditPositionModalOpen(true);
  };

  const handleArchive = (type: 'project' | 'document' | 'position', id: string) => {
    if (type === 'project') {
      setProjectCategories(projectCategories.map(cat => 
        cat.id === id ? { ...cat, isArchived: true } : cat
      ));
      toast.success('Kategori proyek berhasil diarsipkan');
    } else if (type === 'document') {
      setDocumentCategories(documentCategories.map(cat => 
        cat.id === id ? { ...cat, isArchived: true } : cat
      ));
      toast.success('Kategori dokumen berhasil diarsipkan');
    } else {
      setPositions(positions.map(pos => 
        pos.id === id ? { ...pos, isArchived: true } : pos
      ));
      toast.success('Jabatan berhasil diarsipkan');
    }
  };

  const handleRestore = (type: 'project' | 'document' | 'position', id: string) => {
    if (type === 'project') {
      setProjectCategories(projectCategories.map(cat => 
        cat.id === id ? { ...cat, isArchived: false } : cat
      ));
      toast.success('Kategori proyek berhasil dipulihkan');
    } else if (type === 'document') {
      setDocumentCategories(documentCategories.map(cat => 
        cat.id === id ? { ...cat, isArchived: false } : cat
      ));
      toast.success('Kategori dokumen berhasil dipulihkan');
    } else {
      setPositions(positions.map(pos => 
        pos.id === id ? { ...pos, isArchived: false } : pos
      ));
      toast.success('Jabatan berhasil dipulihkan');
    }
  };

  const handleDelete = (type: 'project' | 'document' | 'position', id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini secara permanen?')) {
      if (type === 'project') {
        setProjectCategories(projectCategories.filter(cat => cat.id !== id));
        toast.success('Kategori proyek berhasil dihapus permanen');
      } else if (type === 'document') {
        setDocumentCategories(documentCategories.filter(cat => cat.id !== id));
        toast.success('Kategori dokumen berhasil dihapus permanen');
      } else {
        setPositions(positions.filter(pos => pos.id !== id));
        toast.success('Jabatan berhasil dihapus permanen');
      }
    }
  };

  const filteredProjectCategories = projectCategories.filter(cat => 
    cat.isArchived === (activeTab === 'archived') &&
    (cat.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
     cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredDocumentCategories = documentCategories.filter(cat => 
    cat.isArchived === (activeTab === 'archived') &&
    (cat.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
     cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredPositions = positions.filter(pos => 
    pos.isArchived === (activeTab === 'archived') &&
    (pos.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
     pos.description.toLowerCase().includes(searchTerm.toLowerCase()))
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
            <BreadcrumbPage>Data Master</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl sm:text-3xl text-gray-900 mb-2">Data Master</h1>
        <p className="text-sm sm:text-base text-gray-600">Kelola kategori proyek, dokumen, dan jabatan</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder="Cari data..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs for Active/Archived */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'active' | 'archived')}>
        <TabsList className="bg-muted text-muted-foreground h-9 items-center justify-center rounded-xl p-[3px] flex flex-row w-fit gap-1">
          <TabsTrigger value="active" className="data-[state=active]:bg-card dark:data-[state=active]:text-foreground text-foreground dark:text-muted-foreground rounded-xl px-4">
            Data Aktif
          </TabsTrigger>
          <TabsTrigger value="archived" className="data-[state=active]:bg-card dark:data-[state=active]:text-foreground text-foreground dark:text-muted-foreground rounded-xl px-4">
            Data Arsip
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6 mt-6">
          {/* Kategori Proyek */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5" />
                  Kategori Proyek
                </CardTitle>
              </div>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Tambah
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Icon</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Deskripsi</TableHead>
                      <TableHead>Modifikasi Terakhir</TableHead>
                      <TableHead>Ditambahkan Oleh</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjectCategories.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-500">
                          Tidak ada data
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProjectCategories.map((cat) => (
                        <TableRow key={cat.id}>
                          <TableCell className="text-2xl">{cat.icon}</TableCell>
                          <TableCell className="font-medium">{cat.category}</TableCell>
                          <TableCell className="text-gray-600">{cat.description}</TableCell>
                          <TableCell className="text-sm text-gray-500">{cat.lastModified}</TableCell>
                          <TableCell className="text-sm">{cat.addedBy}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {activeTab === 'active' ? (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => openEditProjectModal(cat)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleArchive('project', cat.id)}
                                  >
                                    <Archive className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleDelete('project', cat.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleRestore('project', cat.id)}
                                  >
                                    <RotateCcw className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleDelete('project', cat.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Kategori Dokumen */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Kategori Dokumen
                </CardTitle>
              </div>
              <Button size="sm" className="gap-2" onClick={() => setIsAddDocumentModalOpen(true)}>
                <Plus className="w-4 h-4" />
                Tambah
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Icon</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Deskripsi</TableHead>
                      <TableHead>Modifikasi Terakhir</TableHead>
                      <TableHead>Ditambahkan Oleh</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocumentCategories.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-500">
                          Tidak ada data
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDocumentCategories.map((cat) => (
                        <TableRow key={cat.id}>
                          <TableCell className="text-2xl">{cat.icon}</TableCell>
                          <TableCell className="font-medium">{cat.category}</TableCell>
                          <TableCell className="text-gray-600">{cat.description}</TableCell>
                          <TableCell className="text-sm text-gray-500">{cat.lastModified}</TableCell>
                          <TableCell className="text-sm">{cat.addedBy}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {activeTab === 'active' ? (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => openEditDocumentModal(cat)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleArchive('document', cat.id)}
                                  >
                                    <Archive className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleDelete('document', cat.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleRestore('document', cat.id)}
                                  >
                                    <RotateCcw className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleDelete('document', cat.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Jabatan */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Jabatan
                </CardTitle>
              </div>
              <Button size="sm" className="gap-2" onClick={() => setIsAddPositionModalOpen(true)}>
                <Plus className="w-4 h-4" />
                Tambah
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Icon</TableHead>
                      <TableHead>Jabatan</TableHead>
                      <TableHead>Deskripsi</TableHead>
                      <TableHead>Modifikasi Terakhir</TableHead>
                      <TableHead>Ditambahkan Oleh</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPositions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-500">
                          Tidak ada data
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPositions.map((pos) => (
                        <TableRow key={pos.id}>
                          <TableCell className="text-2xl">{pos.icon}</TableCell>
                          <TableCell className="font-medium">{pos.position}</TableCell>
                          <TableCell className="text-gray-600">{pos.description}</TableCell>
                          <TableCell className="text-sm text-gray-500">{pos.lastModified}</TableCell>
                          <TableCell className="text-sm">{pos.addedBy}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {activeTab === 'active' ? (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => openEditPositionModal(pos)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleArchive('position', pos.id)}
                                  >
                                    <Archive className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleDelete('position', pos.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleRestore('position', pos.id)}
                                  >
                                    <RotateCcw className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleDelete('position', pos.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Project Modal */}
      <Dialog open={isAddProjectModalOpen} onOpenChange={setIsAddProjectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Kategori Proyek</DialogTitle>
            <DialogDescription>
              Tambahkan kategori proyek baru ke dalam sistem
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="project-category">Kategori *</Label>
              <Input
                id="project-category"
                placeholder="Masukkan nama kategori"
                value={projectFormData.category}
                onChange={(e) => setProjectFormData({ ...projectFormData, category: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-description">Deskripsi *</Label>
              <Textarea
                id="project-description"
                placeholder="Masukkan deskripsi kategori"
                value={projectFormData.description}
                onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-icon">Icon (Emoji)</Label>
              <Input
                id="project-icon"
                placeholder="🏗️"
                value={projectFormData.icon}
                onChange={(e) => setProjectFormData({ ...projectFormData, icon: e.target.value })}
                maxLength={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddProjectModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleAddProject}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Project Modal */}
      <Dialog open={isEditProjectModalOpen} onOpenChange={setIsEditProjectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Kategori Proyek</DialogTitle>
            <DialogDescription>
              Perbarui informasi kategori proyek
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-project-category">Kategori *</Label>
              <Input
                id="edit-project-category"
                placeholder="Masukkan nama kategori"
                value={projectFormData.category}
                onChange={(e) => setProjectFormData({ ...projectFormData, category: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-project-description">Deskripsi *</Label>
              <Textarea
                id="edit-project-description"
                placeholder="Masukkan deskripsi kategori"
                value={projectFormData.description}
                onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-project-icon">Icon (Emoji)</Label>
              <Input
                id="edit-project-icon"
                placeholder="🏗️"
                value={projectFormData.icon}
                onChange={(e) => setProjectFormData({ ...projectFormData, icon: e.target.value })}
                maxLength={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditProjectModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleEditProject}>
              Perbarui
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Document Modal */}
      <Dialog open={isAddDocumentModalOpen} onOpenChange={setIsAddDocumentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Kategori Dokumen</DialogTitle>
            <DialogDescription>
              Tambahkan kategori dokumen baru ke dalam sistem
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="document-category">Kategori *</Label>
              <Input
                id="document-category"
                placeholder="Masukkan nama kategori"
                value={documentFormData.category}
                onChange={(e) => setDocumentFormData({ ...documentFormData, category: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="document-description">Deskripsi *</Label>
              <Textarea
                id="document-description"
                placeholder="Masukkan deskripsi kategori"
                value={documentFormData.description}
                onChange={(e) => setDocumentFormData({ ...documentFormData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="document-icon">Icon (Emoji)</Label>
              <Input
                id="document-icon"
                placeholder="📄"
                value={documentFormData.icon}
                onChange={(e) => setDocumentFormData({ ...documentFormData, icon: e.target.value })}
                maxLength={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDocumentModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleAddDocument}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Document Modal */}
      <Dialog open={isEditDocumentModalOpen} onOpenChange={setIsEditDocumentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Kategori Dokumen</DialogTitle>
            <DialogDescription>
              Perbarui informasi kategori dokumen
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-document-category">Kategori *</Label>
              <Input
                id="edit-document-category"
                placeholder="Masukkan nama kategori"
                value={documentFormData.category}
                onChange={(e) => setDocumentFormData({ ...documentFormData, category: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-document-description">Deskripsi *</Label>
              <Textarea
                id="edit-document-description"
                placeholder="Masukkan deskripsi kategori"
                value={documentFormData.description}
                onChange={(e) => setDocumentFormData({ ...documentFormData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-document-icon">Icon (Emoji)</Label>
              <Input
                id="edit-document-icon"
                placeholder="📄"
                value={documentFormData.icon}
                onChange={(e) => setDocumentFormData({ ...documentFormData, icon: e.target.value })}
                maxLength={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDocumentModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleEditDocument}>
              Perbarui
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Position Modal */}
      <Dialog open={isAddPositionModalOpen} onOpenChange={setIsAddPositionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Jabatan</DialogTitle>
            <DialogDescription>
              Tambahkan jabatan baru ke dalam sistem
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="position-name">Jabatan *</Label>
              <Input
                id="position-name"
                placeholder="Masukkan nama jabatan"
                value={positionFormData.position}
                onChange={(e) => setPositionFormData({ ...positionFormData, position: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position-description">Deskripsi *</Label>
              <Textarea
                id="position-description"
                placeholder="Masukkan deskripsi jabatan"
                value={positionFormData.description}
                onChange={(e) => setPositionFormData({ ...positionFormData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position-icon">Icon (Emoji)</Label>
              <Input
                id="position-icon"
                placeholder="👤"
                value={positionFormData.icon}
                onChange={(e) => setPositionFormData({ ...positionFormData, icon: e.target.value })}
                maxLength={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPositionModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleAddPosition}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Position Modal */}
      <Dialog open={isEditPositionModalOpen} onOpenChange={setIsEditPositionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Jabatan</DialogTitle>
            <DialogDescription>
              Perbarui informasi jabatan
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-position-name">Jabatan *</Label>
              <Input
                id="edit-position-name"
                placeholder="Masukkan nama jabatan"
                value={positionFormData.position}
                onChange={(e) => setPositionFormData({ ...positionFormData, position: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-position-description">Deskripsi *</Label>
              <Textarea
                id="edit-position-description"
                placeholder="Masukkan deskripsi jabatan"
                value={positionFormData.description}
                onChange={(e) => setPositionFormData({ ...positionFormData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-position-icon">Icon (Emoji)</Label>
              <Input
                id="edit-position-icon"
                placeholder="👤"
                value={positionFormData.icon}
                onChange={(e) => setPositionFormData({ ...positionFormData, icon: e.target.value })}
                maxLength={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditPositionModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleEditPosition}>
              Perbarui
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
