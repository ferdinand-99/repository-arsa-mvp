import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  FolderOpen,
  Calendar,
  User,
  Clock,
  AlertCircle,
  Eye,
  File,
  LayoutGrid,
  List
} from 'lucide-react';
import { toast } from 'sonner';

type ClientPortalProps = {
  token: string;
};

type Document = {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  uploadedBy: string;
  projectName: string;
  category: string;
};

export default function ClientPortal({ token }: ClientPortalProps) {
  const [isValid, setIsValid] = useState(true);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'long' | 'compact'>('long');
  const [companyName] = useState('PT. Maju Bersama');
  
  const [documents] = useState<Document[]>([
    {
      id: '1',
      name: 'Laporan_Keuangan_Q4_2024.pdf',
      type: 'PDF',
      size: '2.4 MB',
      uploadDate: '2024-11-01',
      uploadedBy: 'Ahmad Hidayat',
      projectName: 'Renovasi Kantor',
      category: 'Laporan Keuangan',
    },
    {
      id: '2',
      name: 'Kontrak_Proyek_2024.pdf',
      type: 'PDF',
      size: '1.8 MB',
      uploadDate: '2024-10-28',
      uploadedBy: 'Admin',
      projectName: 'Renovasi Kantor',
      category: 'Kontrak',
    },
    {
      id: '3',
      name: 'Data_Inventaris.csv',
      type: 'CSV',
      size: '256 KB',
      uploadDate: '2024-10-25',
      uploadedBy: 'Ahmad Hidayat',
      projectName: 'Renovasi Kantor',
      category: 'Laporan',
    },
    {
      id: '4',
      name: 'Progress_Report_Oktober.pdf',
      type: 'PDF',
      size: '3.1 MB',
      uploadDate: '2024-10-20',
      uploadedBy: 'Ahmad Hidayat',
      projectName: 'Pembangunan Gudang',
      category: 'Laporan',
    },
    {
      id: '5',
      name: 'Proposal_Proyek_2025.pdf',
      type: 'PDF',
      size: '4.2 MB',
      uploadDate: '2024-10-15',
      uploadedBy: 'Admin',
      projectName: 'Pembangunan Gudang',
      category: 'Proposal',
    },
  ]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsValid(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time remaining
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Filter documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesProject = selectedProject === 'all' || doc.projectName === selectedProject;
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesProject && matchesType;
  });

  // Get unique categories, projects, and types
  const categories = ['all', ...Array.from(new Set(documents.map(doc => doc.category)))];
  const projects = ['all', ...Array.from(new Set(documents.map(doc => doc.projectName)))];
  const documentTypes = ['all', ...Array.from(new Set(documents.map(doc => doc.type)))];

  const handleDownload = (doc: Document) => {
    toast.success(`Mengunduh ${doc.name}...`);
    // Implementasi download
  };

  const handlePreview = (doc: Document) => {
    toast.info(`Membuka preview ${doc.name}...`);
    // Implementasi preview
  };

  // Link expired
  if (!isValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-600">Link Tidak Valid</CardTitle>
            <CardDescription className="text-base">
              Link akses ini telah kedaluwarsa atau tidak valid.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 text-center mb-4">
              Silakan hubungi administrator untuk mendapatkan link akses baru.
            </p>
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-xs text-gray-500 text-center">
                Link akses berlaku selama 1 jam sejak di-generate
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Portal Dokumen Klien</h1>
                <p className="text-sm text-gray-500">{companyName}</p>
              </div>
            </div>
            
            {/* Timer */}
            <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-lg">
              <Clock className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-700">
                Waktu tersisa: {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filter */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari dokumen, proyek, atau kategori..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
              
              {/* Project Filter */}
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="px-3 py-2 border rounded-md bg-white text-sm min-w-[140px]"
              >
                {projects.map((project) => (
                  <option key={project} value={project}>
                    {project === 'all' ? 'Semua Proyek' : project}
                  </option>
                ))}
              </select>
              
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-md bg-white text-sm min-w-[140px]"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'Semua Kategori' : cat}
                  </option>
                ))}
              </select>
              
              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border rounded-md bg-white text-sm min-w-[140px]"
              >
                {documentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'Semua Jenis' : type}
                  </option>
                ))}
              </select>
              
              {/* Reset Filter Button - Only show when filters are active */}
              {(selectedProject !== 'all' || selectedCategory !== 'all' || selectedType !== 'all') && (
                <Button
                  onClick={() => {
                    setSelectedProject('all');
                    setSelectedCategory('all');
                    setSelectedType('all');
                  }}
                  variant="outline"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900 border-gray-300"
                >
                  Reset Filter
                </Button>
              )}
              
              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 border rounded-md p-1 bg-white ml-auto">
                <Button
                  onClick={() => setViewMode('long')}
                  variant={viewMode === 'long' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-8 px-3"
                >
                  <LayoutGrid className="w-4 h-4 mr-1" />
                  Panjang
                </Button>
                <Button
                  onClick={() => setViewMode('compact')}
                  variant={viewMode === 'compact' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-8 px-3"
                >
                  <List className="w-4 h-4 mr-1" />
                  Ringkas
                </Button>
              </div>
            </div>
          </div>

          {/* Stats and Download All */}
          <div className="flex items-center justify-between gap-4 mt-6">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{filteredDocuments.length} dokumen ditemukan</span>
              <span>•</span>
              <span>Total {documents.length} dokumen</span>
            </div>
            
            {/* Download All Button */}
            {filteredDocuments.length > 0 && (
              <Button
                onClick={() => {
                  const totalSize = filteredDocuments.reduce((sum, doc) => {
                    const sizeInKB = parseFloat(doc.size.replace(/[^\d.]/g, ''));
                    return sum + sizeInKB;
                  }, 0);
                  toast.success(`Mengunduh ${filteredDocuments.length} dokumen (${totalSize.toFixed(0)} KB) sebagai ZIP...`);
                }}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download ZIP ({filteredDocuments.length})
              </Button>
            )}
          </div>
        </div>

        {/* Documents Grid */}
        {filteredDocuments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Tidak ada dokumen ditemukan</p>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === 'long' ? 'grid grid-cols-1 gap-4' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'}>
            {filteredDocuments.map((doc) => (
              viewMode === 'long' ? (
                // Long Card View
                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* File Icon */}
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        doc.type === 'PDF' ? 'bg-red-100' : 'bg-green-100'
                      }`}>
                        {doc.type === 'PDF' ? (
                          <FileText className={`w-6 h-6 ${doc.type === 'PDF' ? 'text-red-600' : 'text-green-600'}`} />
                        ) : (
                          <File className="w-6 h-6 text-green-600" />
                        )}
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 mb-1 truncate">{doc.name}</h3>
                        
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <FolderOpen className="w-4 h-4" />
                            <span>{doc.projectName}</span>
                          </div>
                          <span>•</span>
                          <Badge variant="outline">{doc.category}</Badge>
                          <span>•</span>
                          <span>{doc.size}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(doc.uploadDate).toLocaleDateString('id-ID')}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <User className="w-3 h-3" />
                          <span>Diupload oleh {doc.uploadedBy}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          onClick={() => handlePreview(doc)}
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                        <Button
                          onClick={() => handleDownload(doc)}
                          size="sm"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                // Compact Card View
                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          doc.type === 'PDF' ? 'bg-red-100' : 'bg-green-100'
                        }`}>
                          {doc.type === 'PDF' ? (
                            <FileText className="w-5 h-5 text-red-600" />
                          ) : (
                            <File className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2">{doc.name}</h3>
                          <Badge variant="outline" className="text-xs">{doc.category}</Badge>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="space-y-1.5 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <FolderOpen className="w-3.5 h-3.5" />
                          <span className="truncate">{doc.projectName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(doc.uploadDate).toLocaleDateString('id-ID')}</span>
                          <span className="mx-1">•</span>
                          <span>{doc.size}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2 border-t">
                        <Button
                          onClick={() => handlePreview(doc)}
                          variant="outline"
                          size="sm"
                          className="flex-1 h-8 text-xs"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          Preview
                        </Button>
                        <Button
                          onClick={() => handleDownload(doc)}
                          size="sm"
                          className="flex-1 h-8 text-xs"
                        >
                          <Download className="w-3.5 h-3.5 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Informasi Penting:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Link akses ini berlaku selama 1 jam sejak di-generate</li>
                <li>Anda hanya dapat melihat dan mengunduh dokumen</li>
                <li>Dokumen yang ditampilkan hanya dari proyek yang terafiliasi dengan perusahaan Anda</li>
                <li>Jika link kedaluwarsa, silakan hubungi administrator untuk link baru</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
