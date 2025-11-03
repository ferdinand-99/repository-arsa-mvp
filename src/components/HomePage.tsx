import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Shield, UserCircle, Building2, ArrowRight } from 'lucide-react';

type HomePageProps = {
  onSelectRole: (role: 'admin' | 'employee' | 'client') => void;
};

export default function HomePage({ onSelectRole }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-6xl space-y-10 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in-down mb-12">
          <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-2">
            🚀 MVP Demo Version 1.0
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Repositori Proyek & Dokumen
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            Pilih role untuk mengakses sistem
          </p>
        </div>

        {/* Role Cards - 3 Horizontal Rows */}
        <div className="space-y-4 animate-fade-in-up max-w-5xl mx-auto">
          {/* Admin Card */}
          <Card className="border-2 border-blue-200 bg-white/95 backdrop-blur-sm cursor-pointer transition-shadow duration-200 hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="mb-3">
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">Administrator</h3>
                    <p className="text-sm text-gray-600">Akses penuh ke seluruh sistem</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>Kelola semua klien & proyek</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>Kelola akun pegawai</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>Kelola data master</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>Generate link akses klien</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>Lihat log aktivitas lengkap</span>
                    </div>
                  </div>
                </div>
                
                {/* Button */}
                <Button 
                  onClick={() => onSelectRole('admin')}
                  className="h-11 px-6 flex-shrink-0"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Masuk sebagai Admin
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Employee Card */}
          <Card className="border-2 border-green-200 bg-white/95 backdrop-blur-sm cursor-pointer transition-shadow duration-200 hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <UserCircle className="w-8 h-8 text-white" />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="mb-3">
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">Pegawai</h3>
                    <p className="text-sm text-gray-600">Kelola proyek yang ditugaskan</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>Kelola klien (tambah/edit)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>Kelola proyek yang tertaut</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>Upload & arsipkan dokumen</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>Lihat log aktivitas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-500 font-bold">✗</span>
                      <span>Tidak bisa delete proyek/klien</span>
                    </div>
                  </div>
                </div>
                
                {/* Button */}
                <Button 
                  onClick={() => onSelectRole('employee')}
                  className="h-11 px-6 flex-shrink-0"
                >
                  <UserCircle className="w-4 h-4 mr-2" />
                  Masuk sebagai Pegawai
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Client Card */}
          <Card className="border-2 border-purple-200 bg-white/95 backdrop-blur-sm cursor-pointer transition-shadow duration-200 hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="mb-3">
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">Klien</h3>
                    <p className="text-sm text-gray-600">Akses dokumen proyek Anda</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>Lihat dokumen proyek</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>Download dokumen</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>Preview file (PDF, CSV, dll)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-500 font-bold">ⓘ</span>
                      <span className="font-medium text-blue-600">Akses via link khusus</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-orange-500 font-bold">⏰</span>
                      <span className="text-orange-600">Link berlaku 1 jam</span>
                    </div>
                  </div>
                </div>
                
                {/* Button */}
                <Button 
                  onClick={() => onSelectRole('client')}
                  className="h-11 px-6 flex-shrink-0"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Akses Portal Klien
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Info */}
        <div className="text-center text-gray-600 text-sm animate-fade-in space-y-1">
          <p className="font-medium">Sistem Manajemen Proyek & Dokumen</p>
          <p className="text-gray-500">© 2025 - All rights reserved | MVP Demo Version</p>
        </div>
      </div>
    </div>
  );
}
