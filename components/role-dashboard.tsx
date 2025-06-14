"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EmotionIndicator } from "@/components/emotion-indicator"
import { NotificationBell } from "@/components/notification-bell"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { LineChart, BarChart, DonutChart } from "@/components/charts"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  X as CloseIcon,
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
        <div className="mt-4 md:mt-0 flex items-center gap-4">
          <Badge variant="outline" className="text-xs bg-red-500/10 text-red-500">
            <Shield className="h-3 w-3 mr-1" />
            {user.role}
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </Badge>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <ThemeToggle />
          </div>
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
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg border-[0.5px] border-border/30">
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
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [emotionDistribution, setEmotionDistribution] = useState<any[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);
  
  // Data emosi dari kelas virtual yang sudah diikuti
  const classEmotionData = [
    { class: "Matematika", senang: 80, sedih: 10, marah: 5, netral: 25, takut: 5, date: "12 Jun" },
    { class: "B. Inggris", senang: 60, sedih: 25, marah: 8, netral: 30, takut: 15, date: "11 Jun" },
    { class: "IPA", senang: 85, sedih: 8, marah: 3, netral: 35, takut: 2, date: "10 Jun" },
    { class: "IPS", senang: 70, sedih: 15, marah: 10, netral: 28, takut: 8, date: "09 Jun" },
    { class: "Seni", senang: 90, sedih: 5, marah: 2, netral: 40, takut: 1, date: "08 Jun" },
  ];
  
  // Data distribusi emosi dari semua kelas virtual
  const defaultEmotionDistribution = [
    { name: "Senang", value: 45, color: "hsl(var(--joy))" },
    { name: "Netral", value: 25, color: "hsl(var(--neutral))" },
    { name: "Sedih", value: 15, color: "hsl(var(--sadness))" },
    { name: "Marah", value: 10, color: "hsl(var(--anger))" },
    { name: "Takut", value: 5, color: "hsl(var(--fear))" },
  ];
  
  // Calculate statistics based on class data
  const todayClasses = classEmotionData.filter(c => c.date === "12 Jun").length;
  const completedClasses = 4; // Updated to match admin dashboard and student data
  const ongoingClasses = 1;   // Updated to match student dashboard
  
  // Count students needing attention based on emotion data
  const studentsNeedingAttention = classEmotionData.filter(c => 
    c.sedih > 20 || c.marah > 8 || c.takut > 10
  ).length;
  
  // Data statistik kelas
  const [classStats, setClassStats] = useState({
    activeStudents: 89, // Match admin dashboard data - 89 active out of 132 total
    totalStudents: 132, // Match admin dashboard data
    todayClasses: todayClasses,
    completedClasses: completedClasses,
    ongoingClasses: ongoingClasses,
    needAttention: studentsNeedingAttention,
  });
  
  useEffect(() => {
    // Set default chart data
    setChartData(classEmotionData);
    setEmotionDistribution(defaultEmotionDistribution);
    
    // Jika ada kelas yang dipilih, filter data berdasarkan kelas tersebut
    if (selectedClass) {
      const selectedClassData = classEmotionData.filter(item => item.class === selectedClass);
      
      // Update emotion distribution berdasarkan kelas yang dipilih
      if (selectedClassData.length > 0) {
        const data = selectedClassData[0];
        setEmotionDistribution([
          { name: "Senang", value: data.senang, color: "hsl(var(--joy))" },
          { name: "Netral", value: data.netral, color: "hsl(var(--neutral))" },
          { name: "Sedih", value: data.sedih, color: "hsl(var(--sadness))" },
          { name: "Marah", value: data.marah, color: "hsl(var(--anger))" },
          { name: "Takut", value: data.takut, color: "hsl(var(--fear))" },
        ]);
      }
    }
  }, [selectedClass]);
  
  const handleClassClick = (className: string) => {
    if (selectedClass === className) {
      // Jika kelas yang sama diklik lagi, reset pilihan
      setSelectedClass(null);
    } else {
      // Pilih kelas baru
      setSelectedClass(className);
    }
  };
  
  // Sample detailed data for each card
  const detailedData = {
    activeStudents: [
      { id: 1, name: "Alice Johnson", lastActive: "5 menit lalu", class: "Matematika", status: "online" },
      { id: 2, name: "Bob Smith", lastActive: "10 menit lalu", class: "B. Inggris", status: "online" },
      { id: 3, name: "Carol Davis", lastActive: "15 menit lalu", class: "IPA", status: "online" },
      { id: 4, name: "David Wilson", lastActive: "20 menit lalu", class: "IPS", status: "online" },
      { id: 5, name: "Eva Martinez", lastActive: "25 menit lalu", class: "Seni", status: "offline" },
      // More student data would go here in a real application
    ],
    todayClasses: [
      { id: 1, name: "Matematika", time: "09:00-10:30", status: "completed", students: 28 },
      { id: 2, name: "B. Inggris", time: "14:00-15:30", status: "active", students: 25 },
      // More class data would go here in a real application
    ],
    needAttention: [
      { id: 1, name: "Bob Smith", emotion: "sadness", class: "B. Inggris", severity: "high" },
      { id: 2, name: "David Wilson", emotion: "anger", class: "IPS", severity: "medium" },
      // More student data would go here in a real application
    ]
  };
  
  const handleCardClick = (cardType: string) => {
    setSelectedCard(cardType);
    setDetailData(detailedData[cardType as keyof typeof detailedData]);
    setDetailModalOpen(true);
  };
  
  return (
    <main className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard Fasilitator</h1>
          <p className="text-muted-foreground">Selamat datang, {user.name}</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-4">
          <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-500">
            <UserCheck className="h-3 w-3 mr-1" />
            {user.role}
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </Badge>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Fasilitator Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card onClick={() => handleCardClick("activeStudents")} className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Siswa Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{classStats.activeStudents}</div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Dari {classStats.totalStudents} total siswa</p>
            <p className="text-xs text-primary mt-1">Klik untuk melihat detail →</p>
          </CardContent>
        </Card>

        <Card onClick={() => handleCardClick("todayClasses")} className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Kelas Hari Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{classStats.todayClasses}</div>
              <div className="p-2 bg-primary/10 rounded-full">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{classStats.completedClasses} selesai, {classStats.ongoingClasses} berlangsung</p>
            <p className="text-xs text-primary mt-1">Klik untuk melihat detail →</p>
          </CardContent>
        </Card>

        <Card onClick={() => handleCardClick("needAttention")} className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Perlu Perhatian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-orange-500">{classStats.needAttention}</div>
              <div className="p-2 bg-orange-500/10 rounded-full">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Siswa dengan emosi negatif</p>
            <p className="text-xs text-primary mt-1">Klik untuk melihat detail →</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <div className="mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Grafik Emosi Per Kelas</CardTitle>
              <CardDescription>
                {selectedClass 
                  ? `Menampilkan emosi siswa di kelas ${selectedClass}` 
                  : "Klik pada kelas untuk melihat detail"}
              </CardDescription>
            </div>
            {selectedClass && (
              <Button variant="outline" size="sm" onClick={() => setSelectedClass(null)}>
                Reset Filter
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {classEmotionData.map((item) => (
                  <Badge 
                    key={item.class}
                    variant={selectedClass === item.class ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleClassClick(item.class)}
                  >
                    {item.class}
                  </Badge>
                ))}
              </div>
              <div className="h-72">
                <LineChart data={classEmotionData} />
              </div>
            </div>
            {selectedClass && (
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Distribusi Emosi untuk {selectedClass}</h4>
                <div className="h-52">
                  <DonutChart data={emotionDistribution} />
                </div>
              </div>
            )}
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
                  class: "Matematika"
                },
                { 
                  name: "Bob Smith", 
                  emotion: "sadness", 
                  activity: "Refleksi setelah kelas", 
                  time: "10 menit lalu",
                  class: "B. Inggris" 
                },
                { 
                  name: "Carol Davis", 
                  emotion: "neutral", 
                  activity: "Membaca materi", 
                  time: "15 menit lalu",
                  class: "IPA" 
                },
                { 
                  name: "David Wilson", 
                  emotion: "anger", 
                  activity: "Diskusi di kelas", 
                  time: "20 menit lalu",
                  class: "IPS" 
                },
              ].map((student, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-lg border-[0.5px] border-border/30 hover:border-primary/30 transition-colors"
                >
                  <EmotionIndicator emotion={student.emotion} size="md" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{student.name}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">{student.activity}</p>
                      <Badge variant="outline" className="text-xs">{student.class}</Badge>
                    </div>
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

      {/* Detail Modal */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>
              {selectedCard === "activeStudents" && "Daftar Siswa Aktif"}
              {selectedCard === "todayClasses" && "Kelas Hari Ini"}
              {selectedCard === "needAttention" && "Siswa yang Perlu Perhatian"}
            </DialogTitle>
            <DialogDescription>
              {selectedCard === "activeStudents" && `${classStats.activeStudents} siswa aktif dari total ${classStats.totalStudents}`}
              {selectedCard === "todayClasses" && `${classStats.todayClasses} kelas dijadwalkan hari ini`}
              {selectedCard === "needAttention" && `${classStats.needAttention} siswa menunjukkan emosi negatif`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[60vh] overflow-auto">
            {selectedCard === "activeStudents" && detailData && (
              <div className="space-y-3">
                {detailData.map((student: any) => (
                  <Card key={student.id} className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{student.name}</p>
                          <Badge variant={student.status === "online" ? "default" : "outline"}>
                            {student.status === "online" ? "Online" : "Offline"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Kelas: {student.class}</p>
                        <p className="text-xs text-muted-foreground">Aktif: {student.lastActive}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            
            {selectedCard === "todayClasses" && detailData && (
              <div className="space-y-3">
                {detailData.map((cls: any) => (
                  <Card key={cls.id} className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{cls.name}</p>
                          <Badge variant={cls.status === "active" ? "default" : "secondary"}>
                            {cls.status === "active" ? "Berlangsung" : "Selesai"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Waktu: {cls.time}</p>
                        <p className="text-xs text-muted-foreground">Peserta: {cls.students} siswa</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            
            {selectedCard === "needAttention" && detailData && (
              <div className="space-y-3">
                {detailData.map((student: any) => (
                  <Card key={student.id} className="p-3">
                    <div className="flex items-center gap-3">
                      <EmotionIndicator emotion={student.emotion} size="md" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{student.name}</p>
                          <Badge 
                            variant="outline" 
                            className={
                              student.severity === "high" ? "text-red-500 border-red-500" : 
                              student.severity === "medium" ? "text-orange-500 border-orange-500" : 
                              "text-yellow-500 border-yellow-500"
                            }
                          >
                            {student.severity === "high" ? "Perhatian Tinggi" : 
                             student.severity === "medium" ? "Perhatian Sedang" : "Perhatian Ringan"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Kelas: {student.class}</p>
                        <p className="text-xs text-muted-foreground">Emosi terdeteksi: {student.emotion}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailModalOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}

function SiswaDashboard({ user }: { user: { name: string; role: string } }) {
  const [virtualClasses, setVirtualClasses] = useState({
    completed: 0,
    upcoming: 0,
    total: 0,
  });
  
  const [reflections, setReflections] = useState({
    completed: 0,
    pending: 0,
  });
  
  const [analyticsData, setAnalyticsData] = useState<{
    count: number,
    emotions: {name: string, value: number, color: string}[]
  }>({
    count: 0,
    emotions: []
  });
  
  // Function to fetch and update dashboard data from localStorage
  const fetchDashboardData = () => {
    try {
      // Try to get reflection stats from localStorage
      const savedReflectionStats = localStorage.getItem("reflectionStats");
      if (savedReflectionStats) {
        setReflections(JSON.parse(savedReflectionStats));
      }
      
      // Try to get user reflections to calculate emotion stats
      const savedReflections = localStorage.getItem("userReflections");
      if (savedReflections) {
        const reflectionsData = JSON.parse(savedReflections);
        setAnalyticsData(prev => ({
          ...prev,
          count: reflectionsData.length
        }));
      }
    } catch (error) {
      console.error("Error refreshing dashboard data:", error);
    }
  };
  
  // Check for updates when component gains focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchDashboardData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  // Fetch data dari localStorage atau API ketika komponen dimuat
  useEffect(() => {
    // Mendapatkan data kelas virtual
    const fetchClasses = () => {
      try {
        // Try to get virtual classes from localStorage
        const savedClasses = localStorage.getItem("virtualClasses")
        if (savedClasses) {
          const parsedClasses = JSON.parse(savedClasses)
          
          // Calculate completed, upcoming, and total
          const completed = parsedClasses.filter((c: any) => c.status === "completed").length
          const upcoming = parsedClasses.filter((c: any) => c.status === "upcoming" || c.status === "active").length
          const total = parsedClasses.length
          
          setVirtualClasses({
            completed,
            upcoming,
            total,
          })
          
          return // Exit early if we found classes in localStorage
        }
        
        // Fallback to default data if no localStorage data exists
        const classes = [
          {
            id: 1,
            title: "Matematika Dasar",
            status: "completed",
          },
          {
            id: 2,
            title: "Bahasa Inggris Komunikatif",
            status: "active",
          },
          {
            id: 3,
            title: "Ilmu Pengetahuan Alam",
            status: "upcoming",
          },
          {
            id: 4,
            title: "Sejarah Indonesia",
            status: "upcoming",
          },
          {
            id: 5,
            title: "Pendidikan Kewarganegaraan",
            status: "completed",
          },
          {
            id: 6,
            title: "Ilmu Sosial Dasar",
            status: "completed",
          },
          {
            id: 7,
            title: "Seni dan Budaya",
            status: "completed",
          },
          {
            id: 8,
            title: "Teknologi Informasi",
            status: "upcoming",
          },
        ];
        
        // Hitung completed, upcoming, dan total
        const completed = classes.filter(c => c.status === "completed").length;
        const upcoming = classes.filter(c => c.status === "upcoming" || c.status === "active").length;
        const total = classes.length;
        
        setVirtualClasses({
          completed,
          upcoming,
          total,
        });
        
        // Get user reflections data to accurately count reflections
        const savedReflections = localStorage.getItem("userReflections");
        const reflectionsData = savedReflections ? JSON.parse(savedReflections) : [];
        
        // Check for reflection stats in localStorage (this will be updated when reflection is submitted)
        const savedReflectionStats = localStorage.getItem("reflectionStats");
        if (savedReflectionStats) {
          // If reflection data exists in localStorage, use it
          setReflections(JSON.parse(savedReflectionStats));
        } else {
          // If no saved stats, calculate based on actual reflections count
          const completedReflections = reflectionsData.length || completed;
          const pendingReflections = classes.filter(c => c.status === "active").length; 
          
          const reflectionStats = {
            completed: completedReflections,
            pending: pendingReflections,
          };
          
          setReflections(reflectionStats);
          // Save the default stats to localStorage
          localStorage.setItem("reflectionStats", JSON.stringify(reflectionStats));
        }
        
        // Calculate emotion distribution from reflections data if available
        // For now we'll use the default emotion distribution since the actual calculation would be more complex
        
        // Update data analytics - use actual completed reflection count
        setAnalyticsData({
          count: reflectionsData.length || completed, // Use real reflection count
          emotions: [
            { name: "Senang", value: 45, color: "hsl(var(--joy))" },
            { name: "Netral", value: 25, color: "hsl(var(--neutral))" },
            { name: "Sedih", value: 15, color: "hsl(var(--sadness))" },
            { name: "Marah", value: 10, color: "hsl(var(--anger))" },
            { name: "Takut", value: 5, color: "hsl(var(--fear))" }
          ]
        });
        
      } catch (error) {
        console.error("Error fetching class data:", error);
        // Fallback ke data default jika terjadi error
        setVirtualClasses({
          completed: 4,
          upcoming: 4,
          total: 8,
        });
        
        setReflections({
          completed: 4,
          pending: 1,
        });
        
        setAnalyticsData({
          count: 4,
          emotions: []
        });
      }
    };
    
    fetchClasses();

    // Add event listener for custom events to update dashboard when reflection data changes in the same tab
    const handleReflectionUpdate = () => {
      fetchDashboardData();
    };

    // Add event listener for storage changes to update dashboard when reflection data changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "reflectionStats" || e.key === "userReflections") {
        fetchDashboardData();
      }
    };

    // Add custom event listener for same-tab updates
    window.addEventListener('reflectionUpdated', handleReflectionUpdate as EventListener);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('reflectionUpdated', handleReflectionUpdate as EventListener);
    };
  }, []);

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
        <div className="mt-4 md:mt-0 flex items-center gap-4">
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
          <div className="flex items-center gap-3">
            <NotificationBell />
            <ThemeToggle />
          </div>
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
                <div className="text-2xl font-bold">{analyticsData.count}</div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{analyticsData.count} kelas dengan data emosi</p>
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
                  className="flex gap-4 p-3 rounded-lg border-[0.5px] border-border/30 hover:border-primary/30 transition-colors"
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
