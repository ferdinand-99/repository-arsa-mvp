import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ArrowLeft, Search, ArrowUpDown, Download, Edit, Save, X, Plus, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import { Badge } from './ui/badge';

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

type CSVTableViewerProps = {
  document: Document;
  onBack: () => void;
  onSave?: (updatedDocument: Document) => void;
};

export default function CSVTableViewer({ document, onBack, onSave }: CSVTableViewerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterColumn, setFilterColumn] = useState<string>('all');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedData, setEditedData] = useState<any[][]>([]);
  const [textContent, setTextContent] = useState(document.textContent || '');

  // Mock CSV data if not provided
  const csvData = document.csvData || [
    ['ID', 'Nama', 'Email', 'Telepon', 'Kota', 'Status'],
    ['1', 'Budi Santoso', 'budi@email.com', '081234567890', 'Jakarta', 'Aktif'],
    ['2', 'Siti Nurhaliza', 'siti@email.com', '081234567891', 'Bandung', 'Aktif'],
    ['3', 'Ahmad Rizki', 'ahmad@email.com', '081234567892', 'Surabaya', 'Aktif'],
    ['4', 'Dewi Lestari', 'dewi@email.com', '081234567893', 'Yogyakarta', 'Nonaktif'],
    ['5', 'Eko Prasetyo', 'eko@email.com', '081234567894', 'Semarang', 'Aktif'],
    ['6', 'Rina Wijaya', 'rina@email.com', '081234567895', 'Malang', 'Aktif'],
    ['7', 'Agus Setiawan', 'agus@email.com', '081234567896', 'Jakarta', 'Aktif'],
    ['8', 'Maya Sari', 'maya@email.com', '081234567897', 'Medan', 'Nonaktif'],
    ['9', 'Rudi Hartono', 'rudi@email.com', '081234567898', 'Denpasar', 'Aktif'],
    ['10', 'Linda Susanti', 'linda@email.com', '081234567899', 'Makassar', 'Aktif'],
  ];

  const headers = csvData[0] || [];
  const rows = csvData.slice(1) || [];

  // Check if document is table-based (CSV/Excel) or text-based (PDF/DOC/DOCX)
  const isTableBased = ['CSV', 'XLSX', 'XLS'].includes(document.type);
  const isTextBased = ['PDF', 'DOC', 'DOCX', 'TXT'].includes(document.type);

  // Initialize edit mode
  const handleStartEdit = () => {
    if (isTableBased) {
      setEditedData(JSON.parse(JSON.stringify(csvData)));
    }
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedData([]);
    setTextContent(document.textContent || '');
  };

  const handleSaveEdit = () => {
    const updatedDocument = {
      ...document,
      csvData: isTableBased ? editedData : document.csvData,
      textContent: isTextBased ? textContent : document.textContent,
    };

    if (onSave) {
      onSave(updatedDocument);
    }

    setIsEditMode(false);
    toast.success('Dokumen berhasil disimpan!');
  };

  // Cell editing for table
  const handleCellEdit = (rowIndex: number, cellIndex: number, value: string) => {
    const newData = [...editedData];
    newData[rowIndex][cellIndex] = value;
    setEditedData(newData);
  };

  // Add row
  const handleAddRow = () => {
    const newRow = new Array(headers.length).fill('');
    setEditedData([...editedData, newRow]);
  };

  // Delete row
  const handleDeleteRow = (rowIndex: number) => {
    const newData = editedData.filter((_, index) => index !== rowIndex);
    setEditedData(newData);
  };

  // Add column
  const handleAddColumn = () => {
    const newData = editedData.map((row, index) => {
      if (index === 0) {
        return [...row, 'Kolom Baru'];
      }
      return [...row, ''];
    });
    setEditedData(newData);
  };

  // Delete column
  const handleDeleteColumn = (columnIndex: number) => {
    const newData = editedData.map(row => row.filter((_, index) => index !== columnIndex));
    setEditedData(newData);
  };

  const filteredAndSortedData = useMemo(() => {
    let data = [...rows];

    // Filter by search term
    if (searchTerm) {
      data = data.filter(row =>
        row.some(cell =>
          cell.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by column
    if (filterColumn !== 'all') {
      const columnIndex = parseInt(filterColumn);
      data = data.filter(row => row[columnIndex]);
    }

    // Sort
    if (sortColumn !== null) {
      data.sort((a, b) => {
        const aVal = a[sortColumn]?.toString() || '';
        const bVal = b[sortColumn]?.toString() || '';
        
        if (sortDirection === 'asc') {
          return aVal.localeCompare(bVal, 'id');
        } else {
          return bVal.localeCompare(aVal, 'id');
        }
      });
    }

    return data;
  }, [rows, searchTerm, sortColumn, sortDirection, filterColumn]);

  const handleSort = (columnIndex: number) => {
    if (sortColumn === columnIndex) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnIndex);
      setSortDirection('asc');
    }
  };

  const handleExport = () => {
    const csvContent = [headers, ...filteredAndSortedData]
      .map(row => row.join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `filtered_${document.name}`;
    a.click();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 lg:space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack} size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl text-gray-900 break-all">{document.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{document.type}</Badge>
              <Badge>{document.category}</Badge>
              <p className="text-sm text-gray-600">• {document.size}</p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {!isEditMode ? (
              <>
                <Button variant="outline" onClick={handleStartEdit} className="flex-1 sm:flex-none">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" onClick={handleExport} className="flex-1 sm:flex-none">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleCancelEdit} className="flex-1 sm:flex-none">
                  <X className="w-4 h-4 mr-2" />
                  Batal
                </Button>
                <Button onClick={handleSaveEdit} className="flex-1 sm:flex-none">
                  <Save className="w-4 h-4 mr-2" />
                  Simpan
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Text Editor for PDF/DOC/DOCX */}
      {isTextBased && (
        <Card>
          <CardHeader>
            <CardTitle>Konten Dokumen</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditMode ? (
              <Textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                className="min-h-[500px] font-mono text-sm"
                placeholder="Masukkan konten dokumen..."
              />
            ) : (
              <div className="min-h-[500px] p-4 bg-gray-50 rounded-lg whitespace-pre-wrap font-mono text-sm">
                {textContent || 'Belum ada konten dokumen. Klik Edit untuk menambahkan konten.'}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Table Editor for CSV/Excel */}
      {isTableBased && (
        <>
          {!isEditMode && (
            <Card>
              <CardHeader>
                <CardTitle>Filter & Pencarian</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Cari data..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterColumn} onValueChange={setFilterColumn}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter berdasarkan kolom" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kolom</SelectItem>
                      {headers.map((header, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          {header}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <p>Menampilkan {filteredAndSortedData.length} dari {rows.length} baris</p>
                  {sortColumn !== null && (
                    <p>Diurutkan berdasarkan: {headers[sortColumn]} ({sortDirection === 'asc' ? 'A-Z' : 'Z-A'})</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {isEditMode && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Edit Tabel</CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={handleAddColumn}>
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Kolom
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleAddRow}>
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Baris
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Klik pada sel untuk mengedit. Total: {editedData.length - 1} baris, {editedData[0]?.length || 0} kolom
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {isEditMode && <TableHead className="w-12">Aksi</TableHead>}
                      {(isEditMode ? editedData[0] : headers).map((header, index) => (
                        <TableHead key={index}>
                          {isEditMode ? (
                            <div className="flex items-center gap-2">
                              <Input
                                value={header}
                                onChange={(e) => handleCellEdit(0, index, e.target.value)}
                                className="h-8 min-w-[120px]"
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteColumn(index)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleSort(index)}
                              className="flex items-center gap-2 hover:text-gray-900 transition-colors"
                            >
                              {header}
                              <ArrowUpDown className="w-4 h-4" />
                            </button>
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(isEditMode ? editedData.slice(1) : filteredAndSortedData).map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {isEditMode && (
                          <TableCell>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteRow(rowIndex + 1)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        )}
                        {row.map((cell, cellIndex) => (
                          <TableCell key={cellIndex}>
                            {isEditMode ? (
                              <Input
                                value={cell}
                                onChange={(e) => handleCellEdit(rowIndex + 1, cellIndex, e.target.value)}
                                className="h-8 min-w-[120px]"
                              />
                            ) : (
                              cell
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
