import { useCallback, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Upload, FileText, X, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';

type FileWithCategory = {
  file: File;
  category: string;
};

type CSVUploaderProps = {
  onFileUpload: (files: FileWithCategory[]) => void;
  onCancel: () => void;
};

export default function CSVUploader({ onFileUpload, onCancel }: CSVUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileWithCategory[]>([]);

  const categories = [
    'Data Pelanggan',
    'Laporan Keuangan',
    'Inventori',
    'Laporan Penjualan',
    'Dokumentasi',
    'Lainnya'
  ];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const newFiles = files.map(file => ({
      file,
      category: ''
    }));
    setSelectedFiles(prev => [...prev, ...newFiles]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).map(file => ({
        file,
        category: ''
      }));
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleCategoryChange = (index: number, category: string) => {
    setSelectedFiles(prev => prev.map((item, i) => 
      i === index ? { ...item, category } : item
    ));
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    const filesWithCategory = selectedFiles.filter(item => item.category !== '');
    if (filesWithCategory.length > 0) {
      onFileUpload(filesWithCategory);
      setSelectedFiles([]);
    }
  };

  const allFilesHaveCategory = selectedFiles.length > 0 && selectedFiles.every(item => item.category !== '');

  return (
    <Card className="border-2 border-dashed border-green-300 bg-green-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Upload File Dokumen</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging 
              ? 'border-green-500 bg-green-100' 
              : 'border-gray-300 bg-white'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-700 mb-2">
            Drag & drop file di sini atau
          </p>
          <label className="inline-block">
            <input
              type="file"
              accept=".csv,.xlsx,.xls,.pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
              multiple
            />
            <span className="text-green-600 hover:text-green-700 cursor-pointer underline">
              pilih file
            </span>
          </label>
          <p className="text-xs text-gray-500 mt-2">
            Format yang didukung: CSV, Excel, PDF, Word
          </p>
        </div>

        {selectedFiles.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">
                {selectedFiles.length} file dipilih
              </p>
              {!allFilesHaveCategory && (
                <p className="text-xs text-red-600">
                  Pilih kategori untuk semua file
                </p>
              )}
            </div>
            
            {selectedFiles.map((item, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <FileText className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                    <div className="flex-1 space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(item.file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`category-${index}`} className="text-xs">
                          Kategori Laporan *
                        </Label>
                        <Select 
                          value={item.category} 
                          onValueChange={(value) => handleCategoryChange(index, value)}
                        >
                          <SelectTrigger id={`category-${index}`} className="h-9">
                            <SelectValue placeholder="Pilih kategori" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(cat => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveFile(index)}
                      className="flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button 
              onClick={handleUpload} 
              disabled={!allFilesHaveCategory}
              className="w-full bg-green-500 hover:bg-green-600"
            >
              Upload {selectedFiles.length} File
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
