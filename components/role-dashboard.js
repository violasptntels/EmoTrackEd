"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EmotionIndicator } from "@/components/emotion-indicator"
import { NotificationBell } from "@/components/notification-bell"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { LineChart, DonutChart } from "@/components/charts"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
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

export function RoleDashboard({ role, user }) {
  if (role === "fasilitator") {
    return <FasilitatorDashboard user={user} />
  } else {
    return <SiswaDashboard user={user} />
  }
}

// FasilitatorDashboard component
function FasilitatorDashboard({ user }) {
  const upcomingSessions = [
    {
      id: 1,
      title: "Matematika Dasar - Aljabar",
      time: "09:00 - 10:30",
      date: "Senin, 17 Juni 2025",
      participants: 25,
    },
    {
      id: 2,
      title: "Matematika Dasar - Geometri",
      time: "13:00 - 14:30",
      date: "Rabu, 19 Juni 2025",
      participants: 28,
    },
  ]

  const recentEmotions = [
    { student: "Alice Johnson", emotion: "joy", time: "10 menit yang lalu", duration: "25 menit" },
    { student: "Bob Smith", emotion: "sadness", time: "15 menit yang lalu", duration: "5 menit" },
    { student: "Carol Davis", emotion: "fear", time: "30 menit yang lalu", duration: "10 menit" },
  ]

  const classSummaries = [
    { name: "Matematika Dasar", positive: 75, neutral: 15, negative: 10 },
    { name: "Bahasa Inggris", positive: 60, neutral: 30, negative: 10 },
    { name: "Sains", positive: 50, neutral: 30, negative: 20 },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Fasilitator</h1>
          <p className="text-muted-foreground">Selamat datang kembali, {user.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <NotificationBell />
          <ThemeToggle />
        </div>
      </div>

      {/* Upcoming sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Sesi Belajar Mendatang</CardTitle>
          <CardDescription>Jadwal kelas dalam 7 hari ke depan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
              <div>
                <h3 className="font-medium">{session.title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {session.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {session.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {session.participants} siswa
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">
                  <Link href={`/classes/${session.id}`}>Persiapan</Link>
                </Button>
                <Button size="sm">
                  <Link href={`/classes/${session.id}`}>Mulai Kelas</Link>
                </Button>
              </div>
            </div>
          ))}

          {upcomingSessions.length === 0 && (
            <div className="text-center py-8">
              <p>Tidak ada sesi mendatang dalam 7 hari ke depan.</p>
              <Button className="mt-4" variant="outline">
                <Link href="/classes/create">Jadwalkan Kelas Baru</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Emotion trend chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tren Emosi Siswa</CardTitle>
            <CardDescription>7 hari terakhir</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <LineChart 
              categories={["Senang", "Netral", "Sedih", "Takut", "Marah"]}
              data={[
                {
                  name: "Senang",
                  data: [45, 52, 38, 24, 33, 26, 21],
                },
                {
                  name: "Netral", 
                  data: [35, 41, 62, 42, 13, 30, 37],
                },
                {
                  name: "Sedih",
                  data: [5, 2, 0, 19, 22, 4, 9],
                },
              ]}
              labels={["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]}
            />
          </CardContent>
        </Card>

        {/* Recent emotions */}
        <Card>
          <CardHeader>
            <CardTitle>Emosi Terdeteksi Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEmotions.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <EmotionIndicator emotion={item.emotion} size="sm" />
                    <div>
                      <p className="font-medium">{item.student}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">{item.duration}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class summary */}
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Emosi per Kelas</CardTitle>
          <CardDescription>
            Persentase emosi positif, netral, dan negatif per kelas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {classSummaries.map((cls, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium">{cls.name}</h4>
                  <span className="text-xs text-muted-foreground">
                    {cls.positive}% Positif
                  </span>
                </div>
                <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="bg-green-500"
                    style={{ width: `${cls.positive}%` }}
                  />
                  <div
                    className="bg-blue-500"
                    style={{ width: `${cls.neutral}%` }}
                  />
                  <div
                    className="bg-red-500"
                    style={{ width: `${cls.negative}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs">
                  <span>Positif</span>
                  <span>Netral</span>
                  <span>Negatif</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          className="flex flex-col h-auto py-4 items-center gap-2"
          variant="secondary"
        >
          <Video className="h-5 w-5" />
          <span>Mulai Kelas Baru</span>
        </Button>        <Link href="/facilitator/reflections">
          <Button 
            className="flex flex-col h-auto py-4 items-center gap-2"
            variant="secondary"
          >
            <FileText className="h-5 w-5" />
            <span>Lihat Refleksi</span>
          </Button>
        </Link>
        <Link href="/facilitator/emotions">
          <Button 
            className="flex flex-col h-auto py-4 items-center gap-2"
            variant="secondary"
          >
            <BarChart3 className="h-5 w-5" />
            <span>Laporan Emosi</span>
          </Button>
        </Link>
        <Button 
          className="flex flex-col h-auto py-4 items-center gap-2"
          variant="secondary"
        >
          <UserCheck className="h-5 w-5" />
          <span>Daftar Siswa</span>
        </Button>
      </div>
    </div>
  )
}

// SiswaDashboard component
function SiswaDashboard({ user }) {
  const [showEmotionPrompt, setShowEmotionPrompt] = useState(true)
  const [selectedEmotion, setSelectedEmotion] = useState("neutral")
  const [isSavingEmotion, setIsSavingEmotion] = useState(false)
  const [emotionSaved, setEmotionSaved] = useState(false)
  const [savedEmotionData, setSavedEmotionData] = useState(null)
  
  // Function to handle saving the emotion
  const handleSaveEmotion = () => {
    setIsSavingEmotion(true)
    
    // Simulate a delay for saving (in a real app, this would be an API call)
    setTimeout(() => {
      // Create an object with the emotion data
      const emotionData = {
        emotion: selectedEmotion,
        timestamp: new Date().toISOString(),
        userId: user.id || 'unknown',
        username: user.name
      }
      
      // Save to localStorage for persistence across sessions
      const storedEmotions = JSON.parse(localStorage.getItem('userEmotions') || '[]')
      storedEmotions.push(emotionData)
      localStorage.setItem('userEmotions', JSON.stringify(storedEmotions))
      
      // Update state
      setSavedEmotionData(emotionData)
      setIsSavingEmotion(false)
      setEmotionSaved(true)
      
      // Hide the emotion prompt after a delay
      setTimeout(() => {
        setShowEmotionPrompt(false)
      }, 2000)
    }, 1000)
  }
  
  // Reset emotion saved state when reopening the prompt
  useEffect(() => {
    if (showEmotionPrompt) {
      setEmotionSaved(false)
    }
  }, [showEmotionPrompt])
  
  const classSchedule = [
    {
      id: 1,
      title: "Matematika Dasar - Aljabar",
      time: "09:00 - 10:30",
      date: "Senin, 17 Juni 2025",
      instructor: "Dr. Sarah Johnson",
      status: "upcoming",
    },
    {
      id: 2,
      title: "Bahasa Inggris - Grammar",
      time: "11:00 - 12:30",
      date: "Senin, 17 Juni 2025",
      instructor: "Prof. John Smith",
      status: "upcoming",
    },
    {
      id: 3,
      title: "Sains Dasar - Fisika",
      time: "14:00 - 15:30",
      date: "Selasa, 18 Juni 2025",
      instructor: "Dr. Maya Wong",
      status: "upcoming",
    },
  ]

  const emotions = [
    { id: "joy", label: "Senang", icon: "😊", color: "bg-gradient-to-br from-amber-300 to-yellow-500" },
    { id: "neutral", label: "Biasa", icon: "😐", color: "bg-gradient-to-br from-slate-300 to-slate-500" },
    { id: "sadness", label: "Sedih", icon: "😢", color: "bg-gradient-to-br from-blue-300 to-blue-600" },
    { id: "fear", label: "Takut", icon: "😨", color: "bg-gradient-to-br from-violet-300 to-violet-600" },
    { id: "anger", label: "Marah", icon: "😡", color: "bg-gradient-to-br from-red-300 to-red-600" },
  ]

  const recentEmotions = [
    { day: "Senin", emotions: { joy: 60, neutral: 20, sadness: 10, fear: 5, anger: 5 } },
    { day: "Selasa", emotions: { joy: 40, neutral: 30, sadness: 15, fear: 10, anger: 5 } },
    { day: "Rabu", emotions: { joy: 55, neutral: 25, sadness: 5, fear: 5, anger: 10 } },
    { day: "Kamis", emotions: { joy: 35, neutral: 35, sadness: 20, fear: 5, anger: 5 } },
    { day: "Jumat", emotions: { joy: 50, neutral: 30, sadness: 10, fear: 5, anger: 5 } },
  ]

  const emotionDistribution = [
    { name: "Senang", value: 52 },
    { name: "Netral", value: 27 },
    { name: "Sedih", value: 12 },
    { name: "Takut", value: 5 },
    { name: "Marah", value: 4 },
  ]  // Load last saved emotion from localStorage on component mount
  useEffect(() => {
    const storedEmotions = JSON.parse(localStorage.getItem('userEmotions') || '[]')
    if (storedEmotions.length > 0) {
      // Get the most recent emotion
      const lastEmotion = storedEmotions[storedEmotions.length - 1]
      
      // Check if it was saved today
      const today = new Date().toDateString()
      const emotionDate = new Date(lastEmotion.timestamp).toDateString()
      
      if (today === emotionDate) {
        // If emotion was recorded today, hide the prompt and set the saved data
        setShowEmotionPrompt(false)
        setSavedEmotionData(lastEmotion)
      }
    }
  }, [])
  
  // Get the emotion details for display
  const getEmotionDetails = (emotionId) => {
    return emotions.find(e => e.id === emotionId) || emotions.find(e => e.id === "neutral")
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-8 animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Dashboard Siswa</h1>
          <p className="text-muted-foreground text-lg">
            Selamat datang kembali, <span className="font-medium text-foreground">{user.name}</span>
            {!showEmotionPrompt && savedEmotionData && (
              <span className="ml-2 inline-flex items-center">
                <span className="text-sm text-muted-foreground">Perasaan hari ini:</span>
                <span className="ml-1 text-xl" title={getEmotionDetails(savedEmotionData.emotion).label}>
                  {getEmotionDetails(savedEmotionData.emotion).icon}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-2 h-6 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => setShowEmotionPrompt(true)}
                >
                  Ubah
                </Button>
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <NotificationBell />
          <ThemeToggle />
        </div>
      </div>

      {/* Emotion check-in card */}      {showEmotionPrompt && (
        <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-r from-primary/5 to-purple-500/5 card-gradient-overlay animate-slide-up hover-lift">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <div>
              <CardTitle className="text-xl">Bagaimana Perasaanmu Hari Ini?</CardTitle>
              <CardDescription className="text-base">
                Pilih emoji yang paling menggambarkan perasaanmu saat ini
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-primary/10"
              onClick={() => setShowEmotionPrompt(false)}
            >
              <CloseIcon className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-6">            <div className="flex flex-wrap gap-4 justify-center">
              {emotions.map((emotion) => (
                <Button
                  key={emotion.id}
                  variant={selectedEmotion === emotion.id ? "default" : "outline"}
                  className={`py-6 px-8 flex flex-col gap-2 rounded-xl transition-all ${
                    selectedEmotion === emotion.id 
                      ? `${emotion.color} text-white shadow-lg scale-105` 
                      : "hover:scale-105 hover:shadow-md"
                  }`}
                  onClick={() => setSelectedEmotion(emotion.id)}
                  disabled={isSavingEmotion || emotionSaved}
                >
                  <span className="text-4xl">{emotion.icon}</span>
                  <span className="font-medium">{emotion.label}</span>
                </Button>
              ))}
            </div>
            
            {emotionSaved ? (
              <div className="w-full mt-8 py-6 text-center bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg shadow-md">
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-green-500 text-white rounded-full p-2 animate-bounce">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-green-700 dark:text-green-300">Perasaan berhasil disimpan!</h3>
                  <p className="text-green-600 dark:text-green-400">Terima kasih atas partisipasimu.</p>
                </div>
              </div>
            ) : (
              <Button 
                className="w-full mt-8 py-6 text-lg font-medium bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-md relative"
                onClick={handleSaveEmotion}
                disabled={isSavingEmotion}
              >
                {isSavingEmotion ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Perasaan'
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      )}      <div className="grid gap-6 md:grid-cols-2">
        {/* Class schedule */}
        <Card className="border shadow-md hover:shadow-lg transition-shadow hover-lift card-gradient-overlay">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary animate-pulse-slow" />
              <span>Jadwal Kelas Minggu Ini</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {classSchedule.map((cls) => (
                <div key={cls.id} className="p-4 hover:bg-muted/10 transition-colors">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-lg">{cls.title}</h3>
                    <Badge className={`${cls.status === "live" ? "bg-green-500 hover:bg-green-600" : "bg-primary/90 hover:bg-primary"} text-white`}>
                      {cls.status === "live" ? "Berlangsung" : "Mendatang"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 mt-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="bg-primary/10 p-1.5 rounded-full">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span>{cls.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="bg-primary/10 p-1.5 rounded-full">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span>{cls.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                      <div className="bg-primary/10 p-1.5 rounded-full">
                        <UserCheck className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span>{cls.instructor}</span>
                    </div>
                  </div>                  <div className="mt-4 flex justify-end">
                    <Link href={`/classes/${cls.id}`}>
                      <Button
                        className={`${
                          cls.status === "live" 
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white" 
                            : "bg-gradient-to-r from-primary/80 to-purple-500/80 hover:from-primary hover:to-purple-500 text-white"
                        }`}
                      >
                        {cls.status === "live" ? "Masuk Kelas" : "Lihat Detail"}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>        {/* Emotion analytics */}
        <Card className="border shadow-md hover:shadow-lg transition-shadow hover-lift card-gradient-overlay">
          <CardHeader className="border-b bg-muted/20">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary animate-pulse-slow" />
                <span>Analisis Emosi</span>
              </CardTitle>
              <Badge variant="outline" className="font-normal glow-on-hover">7 hari terakhir</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[230px] mb-6">
              <div className="text-xs font-medium text-center mb-2 text-muted-foreground">Persentase Emosi per Hari</div>
              <ResponsiveContainer width="100%" height={200}>
                <RechartsBarChart
                  data={recentEmotions}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 20,
                  }}
                  barSize={20}
                  barGap={2}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="day" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "var(--radius)",
                      fontSize: "12px",
                      color: "hsl(var(--card-foreground))",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                    }}
                    formatter={(value, name) => [`${value}%`, name]}
                  />
                  <Bar dataKey="emotions.joy" stackId="a" name="Senang" fill="hsl(var(--joy))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="emotions.neutral" stackId="a" name="Netral" fill="hsl(var(--neutral))" />
                  <Bar dataKey="emotions.sadness" stackId="a" name="Sedih" fill="hsl(var(--sadness))" />
                  <Bar dataKey="emotions.fear" stackId="a" name="Takut" fill="hsl(var(--fear))" />
                  <Bar dataKey="emotions.anger" stackId="a" name="Marah" fill="hsl(var(--anger))" />
                  <Legend 
                    verticalAlign="top"
                    height={36}
                    iconSize={8}
                    iconType="circle"
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>          <div className="mt-6 bg-muted/20 p-4 rounded-lg border">
              <h4 className="text-sm font-medium mb-4 flex items-center justify-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <span>Distribusi Emosi Keseluruhan</span>
              </h4>
              <div className="flex flex-wrap justify-center items-center gap-3">
                {emotionDistribution.map((item, index) => {
                  // Define color mapping for each emotion
                  const getColorClass = () => {
                    switch(item.name.toLowerCase()) {
                      case 'senang': return 'from-amber-300 to-yellow-500';
                      case 'netral': return 'from-slate-300 to-slate-500';
                      case 'sedih': return 'from-blue-300 to-blue-600';
                      case 'takut': return 'from-violet-300 to-violet-600';
                      case 'marah': return 'from-red-300 to-red-600';
                      default: return 'from-primary to-purple-600';
                    }
                  };
                  
                  return (
                    <div 
                      key={item.name} 
                      className={`flex flex-col items-center gap-2 bg-background py-2 px-3 rounded-lg shadow-sm border border-muted hover:shadow-md transition-all hover:-translate-y-0.5 ${index === 0 ? "ring-1 ring-primary/30" : ""}`}
                      style={{ width: '80px' }}
                    >
                      <div className={`font-bold text-lg bg-gradient-to-r ${getColorClass()} bg-clip-text text-transparent`}>{item.value}%</div>
                      <EmotionIndicator
                        emotion={item.name.toLowerCase()}
                        size="sm"
                        showLabel={true}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>      {/* Recent Reflections */}
      <Card className="border shadow-md hover:shadow-lg transition-shadow overflow-hidden hover-lift card-gradient-overlay">
        <CardHeader className="border-b bg-muted/20">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary animate-pulse-slow" />
            <span>Refleksi Terbaru</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">            
            <Link href="/reflection" className="block w-full">
              <div className="p-4 hover:bg-muted/10 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/15 p-3 rounded-full">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-base">Refleksi Kelas Bahasa Inggris</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Tenggat: 18 Juni 2025</p>
                    </div>
                  </div>
                </div>
                <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">Mendesak</Badge>
              </div>
            </Link>
            
            <Link href="/reflection" className="block w-full">
              <div className="p-4 hover:bg-muted/10 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/15 p-3 rounded-full">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-base">Refleksi Kelas Matematika</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Tenggat: 19 Juni 2025</p>
                    </div>
                  </div>
                </div>
                <Badge className="bg-orange-500 text-white hover:bg-orange-600">Belum Dikerjakan</Badge>
              </div>
            </Link>
            
            <Link href="/reflection" className="block w-full">
              <div className="p-4 hover:bg-muted/10 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 dark:bg-green-950/30 p-3 rounded-full">
                    <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-base">Refleksi Kelas Sains</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Selesai: 12 Juni 2025</p>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800">
                  Selesai
                </Badge>
              </div>
            </Link>
          </div>
            <div className="p-4 bg-muted/10">
            <Link href="/reflection" className="block w-full">
              <Button 
                className="w-full" 
                variant="outline" 
              >
                <span>Lihat Semua Refleksi</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>{/* Quick actions */}      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <Link href="/classes" className="block w-full">
          <Button
            className="w-full h-auto py-6 flex flex-col items-center gap-3 border shadow-md hover:shadow-lg transition-all hover:scale-105 bg-gradient-to-br from-primary/10 to-purple-500/10 hover:from-primary/20 hover:to-purple-500/20 glow-on-hover"
            variant="ghost"
          >
            <div className="bg-gradient-to-br from-primary to-purple-600 p-3 rounded-full text-white">
              <Video className="h-6 w-6" />
            </div>
            <span className="font-medium">Kelas Live</span>
          </Button>
        </Link>
        <Link href="/analytics" className="block w-full">
          <Button
            className="w-full h-auto py-6 flex flex-col items-center gap-3 border shadow-md hover:shadow-lg transition-all hover:scale-105 bg-gradient-to-br from-primary/10 to-purple-500/10 hover:from-primary/20 hover:to-purple-500/20"
            variant="ghost"
          >
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-full text-white">
              <BarChart3 className="h-6 w-6" />
            </div>
            <span className="font-medium">Analisis Emosi</span>
          </Button>
        </Link>
        <Link href="/reflection" className="block w-full">
          <Button
            className="w-full h-auto py-6 flex flex-col items-center gap-3 border shadow-md hover:shadow-lg transition-all hover:scale-105 bg-gradient-to-br from-primary/10 to-purple-500/10 hover:from-primary/20 hover:to-purple-500/20"
            variant="ghost"
          >
            <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-3 rounded-full text-white">
              <Shield className="h-6 w-6" />
            </div>
            <span className="font-medium">Refleksi</span>
          </Button>
        </Link>
      </div>

      {/* Quick Access Cards for Reports and Reflections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Emotion Reports Card */}
        <Card className="overflow-hidden border bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-500" />
              Laporan Emosi
            </CardTitle>
            <CardDescription>
              Lihat analisis emosi Anda dari kelas-kelas yang telah diikuti
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-3">
              Melacak pola emosi selama proses pembelajaran dan identifikasi tren untuk pengembangan diri.
            </p>
            <Link href="/emotion-report">
              <Button className="w-full mt-2 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white">
                Lihat Laporan Emosi
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Reflections Card */}
        <Card className="overflow-hidden border bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Refleksi Pembelajaran
            </CardTitle>
            <CardDescription>
              Lihat refleksi yang Anda buat setelah setiap sesi pembelajaran
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-3">
              Kumpulan jurnal reflektif pembelajaran yang membantu mengukur progres dan area pengembangan diri.
            </p>
            <Link href="/reflection">
              <Button className="w-full mt-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                Lihat Refleksi Saya
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
