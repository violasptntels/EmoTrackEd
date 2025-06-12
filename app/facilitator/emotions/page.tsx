"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EmotionIndicator } from "@/components/emotion-indicator"
import { LineChart, DonutChart } from "@/components/charts"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, TrendingUp, Users, Clock, Eye, MessageSquare, BarChart3, RefreshCw } from "lucide-react"

export default function FacilitatorEmotionsPage() {
  const [selectedClass, setSelectedClass] = useState("all")
  const [refreshing, setRefreshing] = useState(false)

  // Data emosi siswa real-time
  const studentsEmotions = [
    {
      id: 1,
      name: "Alice Johnson",
      currentEmotion: "joy",
      confidence: 92,
      lastUpdate: "2 menit lalu",
      status: "active",
      class: "Matematika Dasar",
      needsAttention: false,
      emotionHistory: [
        { time: "09:00", emotion: "neutral" },
        { time: "09:15", emotion: "joy" },
        { time: "09:30", emotion: "joy" },
        { time: "09:45", emotion: "surprise" },
      ],
    },
    {
      id: 2,
      name: "Bob Smith",
      currentEmotion: "sadness",
      confidence: 87,
      lastUpdate: "1 menit lalu",
      status: "active",
      class: "Matematika Dasar",
      needsAttention: true,
      emotionHistory: [
        { time: "09:00", emotion: "neutral" },
        { time: "09:15", emotion: "sadness" },
        { time: "09:30", emotion: "sadness" },
        { time: "09:45", emotion: "fear" },
      ],
    },
    {
      id: 3,
      name: "Carol Davis",
      currentEmotion: "fear",
      confidence: 78,
      lastUpdate: "30 detik lalu",
      status: "active",
      class: "Bahasa Inggris",
      needsAttention: true,
      emotionHistory: [
        { time: "09:00", emotion: "neutral" },
        { time: "09:15", emotion: "neutral" },
        { time: "09:30", emotion: "fear" },
        { time: "09:45", emotion: "fear" },
      ],
    },
    {
      id: 4,
      name: "David Wilson",
      currentEmotion: "anger",
      confidence: 85,
      lastUpdate: "5 menit lalu",
      status: "inactive",
      class: "Matematika Dasar",
      needsAttention: true,
      emotionHistory: [
        { time: "09:00", emotion: "neutral" },
        { time: "09:15", emotion: "anger" },
        { time: "09:30", emotion: "anger" },
        { time: "09:45", emotion: "neutral" },
      ],
    },
  ]

  // Data agregat emosi kelas
  const classEmotionData = [
    { time: "09:00", senang: 40, sedih: 20, marah: 15, takut: 10, netral: 35 },
    { time: "09:15", senang: 45, sedih: 25, marah: 10, takut: 15, netral: 30 },
    { time: "09:30", senang: 35, sedih: 30, marah: 20, takut: 20, netral: 25 },
    { time: "09:45", senang: 50, sedih: 20, marah: 15, takut: 10, netral: 35 },
  ]

  // Distribusi emosi saat ini
  const currentEmotionDistribution = [
    { name: "Senang", value: 35, color: "hsl(var(--joy))" },
    { name: "Netral", value: 25, color: "hsl(var(--neutral))" },
    { name: "Sedih", value: 20, color: "hsl(var(--sadness))" },
    { name: "Takut", value: 15, color: "hsl(var(--fear))" },
    { name: "Marah", value: 5, color: "hsl(var(--anger))" },
  ]

  const classes = [
    { id: "all", name: "Semua Kelas" },
    { id: "math", name: "Matematika Dasar" },
    { id: "english", name: "Bahasa Inggris" },
    { id: "science", name: "Ilmu Alam" },
  ]

  const filteredStudents =
    selectedClass === "all"
      ? studentsEmotions
      : studentsEmotions.filter((student) =>
          student.class
            .toLowerCase()
            .includes(
              selectedClass === "math" ? "matematika" : selectedClass === "english" ? "inggris" : selectedClass,
            ),
        )

  const needsAttentionCount = filteredStudents.filter((s) => s.needsAttention).length
  const activeStudentsCount = filteredStudents.filter((s) => s.status === "active").length

  const handleRefresh = () => {
    setRefreshing(true)
    // Simulasi refresh data
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case "joy":
        return "text-green-500"
      case "sadness":
        return "text-blue-500"
      case "anger":
        return "text-red-500"
      case "fear":
        return "text-orange-500"
      case "surprise":
        return "text-purple-500"
      case "disgust":
        return "text-yellow-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <main className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Monitor Emosi Siswa Real-time</h1>
          <p className="text-muted-foreground">
            Pantau kondisi emosional siswa selama pembelajaran berlangsung untuk penyesuaian pendekatan
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Siswa Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{activeStudentsCount}</div>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground">Dari {filteredStudents.length} total siswa</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Perlu Perhatian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-orange-500">{needsAttentionCount}</div>
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-xs text-muted-foreground">Emosi negatif berkepanjangan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Emosi Dominan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-green-500">Senang</div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground">35% dari siswa aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Update Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">30s</div>
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground">Data real-time</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Real-time Emotion Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tren Emosi Real-time</CardTitle>
            <CardDescription>Perkembangan emosi kelas dalam 1 jam terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart data={classEmotionData} />
          </CardContent>
        </Card>

        {/* Current Emotion Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Emosi Saat Ini</CardTitle>
            <CardDescription>Persentase emosi siswa aktif</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart data={currentEmotionDistribution} />
            <div className="mt-4 space-y-2">
              {currentEmotionDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Siswa & Status Emosi</CardTitle>
          <CardDescription>Monitor individual siswa dan berikan dukungan yang tepat sasaran</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className={`p-4 rounded-lg border transition-all ${
                  student.needsAttention
                    ? "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{student.name}</p>
                        <Badge variant={student.status === "active" ? "default" : "secondary"}>
                          {student.status === "active" ? "Online" : "Offline"}
                        </Badge>
                        {student.needsAttention && <Badge variant="destructive">Perlu Perhatian</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{student.class}</p>
                      <p className="text-xs text-muted-foreground">Update terakhir: {student.lastUpdate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <EmotionIndicator emotion={student.currentEmotion} size="lg" />
                      <p className="text-xs text-muted-foreground mt-1">{student.confidence}% confidence</p>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Emotion History */}
                <div className="mt-3 pt-3 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-2">Riwayat emosi (1 jam terakhir):</p>
                  <div className="flex items-center gap-2">
                    {student.emotionHistory.map((history, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">{history.time}</span>
                        <EmotionIndicator emotion={history.emotion} size="xs" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
