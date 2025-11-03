import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeft, Archive, FileText, Upload, Download, Home, Users, Search, Filter, X, FolderArchive } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import CSVUploader from './CSVUploader';
import CSVTableViewer from './CSVTableViewer';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { toast } from 'sonner@2.0.3';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

type ProjectDetailProps = {
  projectId: string;
  onBack: () => void;
  onNavigate: (page: 'dashboard' | 'clients' | 'accounts' | 'projects' | 'activity' | 'notifications') => void;
};

type FileWithCategory = {
  file: File;
  category: string;
};

type Employee = {
  id: string;
  name: string;
  avatar: string;
};

type Document = {
  id: string;
  name: string;
  type: string;
  category: string;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
  status: 'active' | 'archived';
  csvData?: any[][];
  textContent?: string;
};

export default function ProjectDetail({ projectId, onBack, onNavigate }: ProjectDetailProps) {
  const [documents, setDocuments] = useState<Document[]>([
    { id: '1', name: 'data_klien.csv', type: 'CSV', category: 'Data Pelanggan', uploadedBy: 'Budi Santoso', uploadedAt: '2024-11-01 10:30', size: '245 KB', status: 'active' },
    { id: '2', name: 'laporan_bulanan.csv', type: 'CSV', category: 'Laporan', uploadedBy: 'Siti Nurhaliza', uploadedAt: '2024-11-02 14:15', size: '128 KB', status: 'active' },
    { id: '3', name: 'inventory.csv', type: 'CSV', category: 'Inventori', uploadedBy: 'Ahmad Rizki', uploadedAt: '2024-10-28 09:20', size: '512 KB', status: 'archived' },
    { id: '4', name: 'financial_report.xlsx', type: 'XLSX', category: 'Keuangan', uploadedBy: 'Dewi Lestari', uploadedAt: '2024-10-15 11:30', size: '356 KB', status: 'active' },
    { 
      id: '5', 
      name: 'project_timeline.pdf', 
      type: 'PDF', 
      category: 'Dokumentasi', 
      uploadedBy: 'Eko Prasetyo', 
      uploadedAt: '2024-10-20 09:00', 
      size: '1.2 MB', 
      status: 'archived',
      textContent: `PROJECT TIMELINE - PROYEK ALPHA

OVERVIEW:
Proyek Alpha merupakan inisiatif pengembangan sistem manajemen data klien dan inventori untuk meningkatkan efisiensi operasional PT. Indonesia Maju.

PHASE 1 - INITIATION (Januari 2024)
✓ Kick-off meeting dengan stakeholders
✓ Requirement gathering dan analisis
✓ Project charter approval

PHASE 2 - PLANNING (Februari 2024)
✓ Detail project planning
✓ Resource allocation
✓ Risk assessment
✓ Budget finalization

PHASE 3 - EXECUTION (Maret - Oktober 2024)
In Progress:
- Database design dan implementation (80%)
- Frontend development (75%)
- Backend API development (70%)
- Integration testing (60%)

PHASE 4 - MONITORING & CONTROL (Ongoing)
- Weekly progress meetings
- Issue tracking dan resolution
- Quality assurance testing

PHASE 5 - CLOSURE (November 2024)
Planned:
- User acceptance testing
- Documentation completion
- Knowledge transfer
- Go-live preparation

KEY MILESTONES:
✓ Project kickoff - 15 Januari 2024
✓ Design approval - 28 Februari 2024
✓ Development start - 1 Maret 2024
○ Testing phase - 1 November 2024
○ Production deployment - 30 November 2024

TEAM MEMBERS:
- Budi Santoso (Project Manager)
- Siti Nurhaliza (Lead Developer)
- Ahmad Rizki (Backend Developer)
- Dewi Lestari (Frontend Developer)
- Eko Prasetyo (QA Engineer)

BUDGET: Rp 500.000.000
CURRENT SPEND: Rp 375.000.000 (75%)

RISKS & MITIGATIONS:
1. Scope creep - Strict change control process
2. Resource constraints - Flexible staffing model
3. Technical challenges - Regular technical reviews

NEXT STEPS:
- Complete remaining development work
- Conduct comprehensive testing
- Prepare production environment
- Schedule UAT with end users`
    },
  ]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const [project, setProject] = useState({
    id: projectId,
    name: 'Proyek Alpha',
    client: 'PT. Indonesia Maju',
    category: 'Sistem Informasi',
    status: 'active' as 'active' | 'completed',
    startDate: '2024-01-15',
    endDate: undefined as string | undefined,
    description: 'Proyek pengembangan sistem manajemen data klien dan inventori untuk meningkatkan efisiensi operasional perusahaan.',
    progress: 75,
    documentCount: 24,
    lastModifiedBy: 'Budi Santoso',
    lastModifiedDate: '2024-03-15',
    pic: [
      { id: '1', name: 'Budi Santoso', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi' },
      { id: '2', name: 'Siti Nurhaliza', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti' }
    ] as Employee[]
  });

  const handleFileUpload = (files: FileWithCategory[]) => {
    files.forEach(({ file, category }) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text.split('\n').map(row => row.split(','));
        
        const newDoc: Document = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
          category: category,
          uploadedBy: 'Admin User',
          uploadedAt: new Date().toLocaleString('id-ID'),
          size: `${(file.size / 1024).toFixed(0)} KB`,
          status: 'active',
          csvData: rows,
        };

        setDocuments(prev => [newDoc, ...prev]);
      };
      reader.readAsText(file);
    });
    
    setShowUploader(false);
    toast.success(`${files.length} file berhasil diupload!`);
  };

  const handleArchiveDocument = (docId: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === docId ? { ...doc, status: 'archived' as const } : doc
    ));
    toast.success('Dokumen berhasil diarsipkan');
  };

  const handleSaveDocument = (updatedDocument: Document) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === updatedDocument.id ? updatedDocument : doc
    ));
    toast.success('Dokumen berhasil disimpan!');
  };

  const handleDownloadAllAsZip = () => {
    // Simulate downloading all documents as ZIP
    // In real implementation, you would use a library like JSZip
    const docCount = filteredDocuments.length;
    const totalSize = filteredDocuments.reduce((sum, doc) => {
      const sizeInKB = parseFloat(doc.size.replace(/[^\d.]/g, ''));
      return sum + sizeInKB;
    }, 0);

    toast.success(`Mengunduh ${docCount} dokumen (${totalSize.toFixed(0)} KB) sebagai ZIP...`);
    
    // In production, you would create actual ZIP file:
    // const zip = new JSZip();
    // filteredDocuments.forEach(doc => {
    //   zip.file(doc.name, doc.content);
    // });
    // const blob = await zip.generateAsync({type: 'blob'});
    // saveAs(blob, `${project.name}_documents.zip`);
  };

  const handleArchiveProject = () => {
    const today = new Date().toISOString().split('T')[0];
    setProject(prev => ({
      ...prev,
      status: 'completed',
      endDate: today
    }));
    toast.success('Proyek berhasil ditandai selesai');
    setTimeout(() => onBack(), 1000);
  };

  // Get unique categories and types
  const categories = ['all', ...Array.from(new Set(documents.map(d => d.category)))];
  const types = ['all', ...Array.from(new Set(documents.map(d => d.type)))];

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesStatus = doc.status === activeTab;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    
    return matchesStatus && matchesSearch && matchesCategory && matchesType;
  });

  const activeDocuments = documents.filter(d => d.status === 'active');
  const archivedDocuments = documents.filter(d => d.status === 'archived');

  const DocumentCard = ({ doc }: { doc: Document }) => (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-sm">{doc.name}</CardTitle>
              <div className="flex gap-2 mt-1">
                <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                  {doc.type}
                </Badge>
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  {doc.category}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mt-1">{doc.size}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xs text-gray-600">
          <p>Diupload oleh: {doc.uploadedBy}</p>
          <p>Tanggal: {doc.uploadedAt}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={() => setSelectedDocument(doc)}
          >
            Lihat Tabel
          </Button>
          {doc.status === 'active' && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Archive className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Arsipkan Dokumen?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Dokumen yang diarsipkan akan dipindahkan ke tab Dokumen Arsip. Anda masih dapat mengaksesnya nanti.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleArchiveDocument(doc.id)}>
                    Arsipkan
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (selectedDocument) {
    return <CSVTableViewer document={selectedDocument} onBack={() => setSelectedDocument(null)} onSave={handleSaveDocument} />;
  }

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
              <button onClick={onBack}>Proyek</button>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{project.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack} size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl text-gray-900">{project.name}</h1>
          <p className="text-sm sm:text-base text-gray-600">{project.client}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline"
            onClick={() => setShowUploader(!showUploader)}
            className="w-full sm:w-auto"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Dokumen
          </Button>
          <Button 
            variant="outline"
            onClick={handleDownloadAllAsZip}
            className="w-full sm:w-auto"
            disabled={filteredDocuments.length === 0}
          >
            <FolderArchive className="w-4 h-4 mr-2" />
            Download ZIP ({filteredDocuments.length})
          </Button>
          {project.status === 'active' && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-blue-600 border-blue-300 hover:bg-blue-50 w-full sm:w-auto">
                  <Archive className="w-4 h-4 mr-2" />
                  Tandai Selesai
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tandai Proyek Selesai?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Proyek yang selesai akan dipindahkan ke daftar Proyek Selesai. Semua dokumen tetap dapat diakses. Tanggal selesai akan diatur ke hari ini.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={handleArchiveProject}>
                    Tandai Selesai
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {showUploader && (
        <CSVUploader onFileUpload={handleFileUpload} onCancel={() => setShowUploader(false)} />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Informasi Proyek</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <Badge className="mt-1">{project.status === 'active' ? 'Aktif' : 'Selesai'}</Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">{project.status === 'completed' && project.endDate ? 'Periode Proyek' : 'Tanggal Mulai'}</p>
              <p className="text-gray-900 mt-1">
                {project.status === 'completed' && project.endDate 
                  ? `${new Date(project.startDate).toLocaleDateString('id-ID')} - ${new Date(project.endDate).toLocaleDateString('id-ID')}`
                  : new Date(project.startDate).toLocaleDateString('id-ID')
                }
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Kategori</p>
              <Badge variant="outline" className="mt-1 bg-blue-50 text-blue-700 border-blue-200">
                {project.category}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Jumlah Dokumen</p>
              <div className="space-y-1">
                <p className="text-gray-900 text-base font-medium">{project.documentCount} dokumen</p>
                <div className="flex gap-3 text-sm">
                  <span className="text-green-600 flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    <span className="font-medium">{activeDocuments.length}</span> Aktif
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600 flex items-center gap-1">
                    <Archive className="w-4 h-4" />
                    <span className="font-medium">{archivedDocuments.length}</span> Arsip
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Deskripsi</p>
            <p className="text-gray-900">{project.description}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">PIC (Person In Charge)</p>
            <div className="flex flex-wrap gap-3">
              {project.pic.map((employee) => (
                <div key={employee.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={employee.avatar} alt={employee.name} />
                    <AvatarFallback className="text-xs">{employee.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-900">{employee.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600">Modifikasi Terakhir</p>
            <p className="text-gray-900 mt-1">
              Oleh <span className="font-medium">{project.lastModifiedBy}</span> pada{' '}
              {new Date(project.lastModifiedDate).toLocaleDateString('id-ID', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dokumen Proyek</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari dokumen atau uploader..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filters and Status Tabs */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Filter:</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-1">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.filter(c => c !== 'all').map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Jenis File" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Jenis</SelectItem>
                  {types.filter(t => t !== 'all').map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(selectedCategory !== 'all' || selectedType !== 'all') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedType('all');
                  }}
                  className="text-gray-600"
                >
                  <X className="w-4 h-4 mr-1" />
                  Reset Filter
                </Button>
              )}

              {/* Status Tabs - Moved to right side */}
              <div className="flex gap-2 ml-auto">
                <Button 
                  variant={activeTab === 'active' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('active')}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Aktif ({activeDocuments.length})
                </Button>
                <Button 
                  variant={activeTab === 'archived' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('archived')}
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Arsip ({archivedDocuments.length})
                </Button>
              </div>
            </div>
          </div>

          {/* Documents Grid */}
          {filteredDocuments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map(doc => (
                <DocumentCard key={doc.id} doc={doc} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Tidak ada dokumen ditemukan</p>
              <p className="text-sm text-gray-400 mt-1">
                {searchQuery ? 'Coba kata kunci lain atau ubah filter' : 'Belum ada dokumen yang diupload'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
