"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EmotionIndicator } from "@/components/emotion-indicator"
import Link from "next/link"
import {
  Users,
  BookOpen,
  BarChart3,
  Settings,
  UserCheck,
  AlertTriangle,
  Calendar,
  Clock,
  FileText,
  ArrowRight,
  Shield,
  UserPlus,
  Activity,
  Video,
} from "lucide-react"

interface RoleDashboardProps {
  role: "admin" | "fasilitator" | "siswa"
  user: {
    name: string
    role: string
  }
}

export function RoleDashboard({ role, user }: RoleDashboardProps) {
  if (role === "admin") {
    return <AdminDashboard user={user} />
  } else if (role === "fasilitator") {
    return <FasilitatorDashboard user={user} />
  } else {
    return <SiswaDashboard user={user} />
  }
}

function AdminDashboard({ user }: { user: { name: string; role: string } }) {
  return (
    <main className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard Admin</h1>
          <p className="text-muted-foreground">Selamat datang, {user.name}</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <Badge variant="outline" className="text-xs bg-red-500/10 text-red-500 border-red-500/20">
            <Shield className="h-3 w-3 mr-1" />
            {user.role}
          </Badge>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Link href="/admin/users" className="block">
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Pengguna</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">156</div>
                <div className="p-2 bg-blue-500/10 rounded-full">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">+12 pengguna baru minggu ini</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/facilitators" className="block">
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Fasilitator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">24</div>
                <div className="p-2 bg-green-500/10 rounded-full">
                  <UserCheck className="h-5 w-5 text-green-500" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">8 aktif hari ini</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/students" className="block">
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Siswa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">132</div>
                <div className="p-2 bg-purple-500/10 rounded-full">
                  <BookOpen className="h-5 w-5 text-purple-500" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">89 aktif hari ini</p>
            </CardContent>
          </Card>
        </Link>

        <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sistem Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-green-500">99.9%</div>
              <div className="p-2 bg-green-500/10 rounded-full">
                <Activity className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Uptime sistem</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Aktivitas Sistem Terbaru</CardTitle>
            <CardDescription>Log aktivitas pengguna dan sistem</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { user: "John Doe", action: "Login ke sistem", time: "2 menit lalu", type: "login" },
                { user: "Jane Smith", action: "Membuat refleksi baru", time: "5 menit lalu", type: "reflection" },
                { user: "Admin", action: "Backup database berhasil", time: "1 jam lalu", type: "system" },
                { user: "Mike Johnson", action: "Mengikuti kelas virtual", time: "2 jam lalu", type: "class" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg border border-border/50">
                  <div
                    className={`p-2 rounded-full ${
                      activity.type === "login"
                        ? "bg-blue-500/10"
                        : activity.type === "reflection"
                          ? "bg-green-500/10"
                          : activity.type === "system"
                            ? "bg-orange-500/10"
                            : "bg-purple-500/10"
                    }`}
                  >
                    {activity.type === "login" && <Users className="h-4 w-4 text-blue-500" />}
                    {activity.type === "reflection" && <FileText className="h-4 w-4 text-green-500" />}
                    {activity.type === "system" && <Settings className="h-4 w-4 text-orange-500" />}
                    {activity.type === "class" && <Video className="h-4 w-4 text-purple-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.user}</p>
                    <p className="text-xs text-muted-foreground">{activity.action}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aksi Admin</CardTitle>
            <CardDescription>Kelola sistem dan pengguna</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/admin/users">
                <UserPlus className="mr-2 h-4 w-4" />
                Tambah Pengguna
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/admin/reports">
                <BarChart3 className="mr-2 h-4 w-4" />
                Laporan Sistem
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/admin/system">
                <Settings className="mr-2 h-4 w-4" />
                Pengaturan Sistem
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/admin/system">
                <Shield className="mr-2 h-4 w-4" />
                Keamanan
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

function FasilitatorDashboard({ user }: { user: { name: string; role: string } }) {
  return (
    <main className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard Fasilitator</h1>
          <p className="text-muted-foreground">Selamat datang, {user.name}</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-500 border-blue-500/20">
            <UserCheck className="h-3 w-3 mr-1" />
            {user.role}
          </Badge>
        </div>
      </div>

      {/* Fasilitator Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Siswa Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">28</div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Dari 32 total siswa</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Kelas Hari Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">6</div>
              <div className="p-2 bg-primary/10 rounded-full">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">4 selesai, 2 berlangsung</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Perlu Perhatian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-orange-500">3</div>
              <div className="p-2 bg-orange-500/10 rounded-full">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Siswa dengan emosi negatif</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monitoring Siswa</CardTitle>
            <CardDescription>Status emosi siswa dalam kelas Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "Alice Johnson",
                  emotion: "joy",
                  activity: "Mengikuti kelas Matematika",
                  time: "5 menit lalu",
                },
                { name: "Bob Smith", emotion: "sadness", activity: "Refleksi setelah kelas", time: "10 menit lalu" },
                { name: "Carol Davis", emotion: "neutral", activity: "Membaca materi", time: "15 menit lalu" },
                { name: "David Wilson", emotion: "anger", activity: "Diskusi di kelas", time: "20 menit lalu" },
              ].map((student, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <EmotionIndicator emotion={student.emotion} size="md" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.activity}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{student.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aksi Fasilitator</CardTitle>
            <CardDescription>Kelola kelas dan siswa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" asChild>
              <Link href="/classes/create">
                <BookOpen className="mr-2 h-4 w-4" />
                Buat Kelas Baru
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/facilitator/emotions">
                <BarChart3 className="mr-2 h-4 w-4" />
                Monitor Emosi
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/facilitator/students">
                <Users className="mr-2 h-4 w-4" />
                Kelola Siswa
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/facilitator/feedback">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Beri Feedback
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

function SiswaDashboard({ user }: { user: { name: string; role: string } }) {
  // Data berdasarkan kelas virtual yang sudah dan akan diikuti
  const virtualClasses = {
    completed: 5, // Kelas yang sudah selesai diikuti
    upcoming: 3, // Kelas yang akan datang
    total: 8, // Total kelas yang terjadwal
  }

  const reflections = {
    completed: 3, // Refleksi yang sudah dibuat (dari 5 kelas yang selesai)
    pending: 2, // Refleksi yang belum dibuat
  }

  const recentReflections = [
    {
      id: 1,
      date: "12 Jun 2025",
      time: "10:45",
      content: "Hari ini saya merasa sangat senang karena berhasil memahami konsep aljabar linear dengan baik.",
      emotion: "joy",
      className: "Matematika Dasar",
    },
    {
      id: 2,
      date: "11 Jun 2025",
      time: "15:45",
      content: "Saya sedikit kesulitan dengan materi grammar tenses, namun akan belajar lebih giat.",
      emotion: "sadness",
      className: "Bahasa Inggris",
    },
    {
      id: 3,
      date: "10 Jun 2025",
      time: "17:45",
      content: "Materi fotosintesis sangat menarik! Saya bisa memahami dengan bantuan animasi.",
      emotion: "joy",
      className: "Ilmu Alam",
    },
  ]

  return (
    <main className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Selamat datang kembali, {user.name}</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {user.role}
          </Badge>
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30 text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Link href="/classes">
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary/50 hover:scale-105">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Kelas Virtual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {virtualClasses.completed}/{virtualClasses.total}
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <Video className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{virtualClasses.upcoming} kelas mendatang</p>
              <div className="flex items-center mt-2 text-xs text-primary">
                <span>Lihat jadwal</span>
                <ArrowRight className="h-3 w-3 ml-1" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/reflection">
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary/50 hover:scale-105">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Refleksi Pembelajaran</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{reflections.completed}</div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{reflections.pending} refleksi tertunda</p>
              <div className="flex items-center mt-2 text-xs text-primary">
                <span>Buat refleksi</span>
                <ArrowRight className="h-3 w-3 ml-1" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/analytics">
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary/50 hover:scale-105">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Grafik Emosi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{virtualClasses.completed}</div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Data dari kelas virtual</p>
              <div className="flex items-center mt-2 text-xs text-primary">
                <span>Lihat analisis</span>
                <ArrowRight className="h-3 w-3 ml-1" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Refleksi Terbaru</CardTitle>
              <CardDescription>Catatan refleksi pembelajaran terbaru Anda</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/reflection">
                Lihat Semua
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReflections.map((reflection) => (
                <div
                  key={reflection.id}
                  className="flex gap-4 p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <EmotionIndicator emotion={reflection.emotion} size="md" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {reflection.className}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="h-3 w-3 mr-1" />
                          {reflection.date}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {reflection.time}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm">{reflection.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Akses Cepat</CardTitle>
            <CardDescription>Akses fitur utama dengan cepat</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" asChild>
              <Link href="/classes">
                <Video className="mr-2 h-4 w-4" />
                Kelas Virtual
              </Link>
            </Button>
            <Button className="w-full justify-start" asChild>
              <Link href="/reflection">
                <FileText className="mr-2 h-4 w-4" />
                Buat Refleksi
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/analytics">
                <BarChart3 className="mr-2 h-4 w-4" />
                Lihat Grafik Emosi
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
