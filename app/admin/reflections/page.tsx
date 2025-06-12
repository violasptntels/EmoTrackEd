"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EmotionIndicator } from "@/components/emotion-indicator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Calendar, Clock, Filter, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminReflectionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [emotionFilter, setEmotionFilter] = useState("all")
  const [subjectFilter, setSubjectFilter] = useState("all")

  const reflections = [
    {
      id: 1,
      studentName: "Alice Johnson",
      studentEmail: "alice@student.com",
      date: "12 Jun 2025",
      time: "09:30",
      content:
        "Hari ini saya merasa sangat senang karena berhasil menyelesaikan tugas matematika dengan baik. Saya belajar dengan tekun dan hasilnya memuaskan.",
      emotion: "joy",
      subject: "Matematika",
      facilitator: "Dr. Sarah Johnson",
      summary: "Perasaan senang dan percaya diri setelah berhasil menyelesaikan tugas matematika dengan baik.",
    },
    {
      id: 2,
      studentName: "Bob Smith",
      studentEmail: "bob@student.com",
      date: "12 Jun 2025",
      time: "14:15",
      content:
        "Saya sedikit kecewa dengan nilai ujian bahasa inggris, tapi saya akan belajar lebih giat. Saya perlu meningkatkan kemampuan grammar dan vocabulary saya.",
      emotion: "sadness",
      subject: "Bahasa Inggris",
      facilitator: "Prof. Michael Chen",
      summary: "Kekecewaan dengan nilai ujian bahasa inggris, namun ada tekad untuk belajar lebih giat.",
    },
    {
      id: 3,
      studentName: "Carol Davis",
      studentEmail: "carol@student.com",
      date: "11 Jun 2025",
      time: "16:45",
      content:
        "Diskusi kelompok berjalan lancar, semua anggota berkontribusi dengan baik. Kami berhasil menyelesaikan presentasi tepat waktu.",
      emotion: "neutral",
      subject: "Ilmu Sosial",
      facilitator: "Dr. Lisa Anderson",
      summary: "Kepuasan dengan kerja sama tim dalam diskusi kelompok yang berjalan lancar.",
    },
    {
      id: 4,
      studentName: "David Wilson",
      studentEmail: "david@student.com",
      date: "11 Jun 2025",
      time: "10:20",
      content:
        "Saya merasa kesal karena tidak bisa memahami konsep fisika hari ini. Materinya terlalu sulit dan penjelasannya kurang jelas.",
      emotion: "anger",
      subject: "Ilmu Alam",
      facilitator: "Dr. Sarah Johnson",
      summary: "Frustrasi dengan kesulitan memahami konsep fisika yang dianggap terlalu sulit.",
    },
    {
      id: 5,
      studentName: "Emma Brown",
      studentEmail: "emma@student.com",
      date: "10 Jun 2025",
      time: "13:15",
      content:
        "Saya takut dengan presentasi besok. Saya belum siap dan khawatir akan membuat kesalahan di depan teman-teman.",
      emotion: "fear",
      subject: "Bahasa Inggris",
      facilitator: "Prof. Michael Chen",
      summary: "Kecemasan dan ketakutan menghadapi presentasi yang akan datang.",
    },
  ]

  const filteredReflections = reflections.filter((reflection) => {
    const matchesSearch =
      reflection.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reflection.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reflection.subject.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesEmotion = emotionFilter === "all" || reflection.emotion === emotionFilter
    const matchesSubject = subjectFilter === "all" || reflection.subject.toLowerCase() === subjectFilter

    return matchesSearch && matchesEmotion && matchesSubject
  })

  const emotionStats = {
    joy: reflections.filter((r) => r.emotion === "joy").length,
    sadness: reflections.filter((r) => r.emotion === "sadness").length,
    anger: reflections.filter((r) => r.emotion === "anger").length,
    fear: reflections.filter((r) => r.emotion === "fear").length,
    neutral: reflections.filter((r) => r.emotion === "neutral").length,
  }

  return (
    <main className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Data Refleksi Siswa</h1>
          <p className="text-muted-foreground">Monitor dan analisis refleksi emosi dari semua siswa</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Senang</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{emotionStats.joy}</div>
              <EmotionIndicator emotion="joy" size="sm" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sedih</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{emotionStats.sadness}</div>
              <EmotionIndicator emotion="sadness" size="sm" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Marah</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{emotionStats.anger}</div>
              <EmotionIndicator emotion="anger" size="sm" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Takut</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{emotionStats.fear}</div>
              <EmotionIndicator emotion="fear" size="sm" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Netral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{emotionStats.neutral}</div>
              <EmotionIndicator emotion="neutral" size="sm" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Data Refleksi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari siswa, konten, atau mata pelajaran..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={emotionFilter} onValueChange={setEmotionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter Emosi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Emosi</SelectItem>
                <SelectItem value="joy">Senang</SelectItem>
                <SelectItem value="sadness">Sedih</SelectItem>
                <SelectItem value="anger">Marah</SelectItem>
                <SelectItem value="fear">Takut</SelectItem>
                <SelectItem value="neutral">Netral</SelectItem>
              </SelectContent>
            </Select>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter Mata Pelajaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Mata Pelajaran</SelectItem>
                <SelectItem value="matematika">Matematika</SelectItem>
                <SelectItem value="bahasa inggris">Bahasa Inggris</SelectItem>
                <SelectItem value="ilmu sosial">Ilmu Sosial</SelectItem>
                <SelectItem value="ilmu alam">Ilmu Alam</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reflections List */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Refleksi ({filteredReflections.length})</CardTitle>
          <CardDescription>Data refleksi emosi dari semua siswa</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReflections.map((reflection) => (
              <div
                key={reflection.id}
                className="flex gap-4 p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>{reflection.studentName.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <EmotionIndicator emotion={reflection.emotion} size="md" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{reflection.studentName}</p>
                      <Badge variant="outline" className="text-xs">
                        {reflection.subject}
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
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm mb-2">{reflection.content}</p>
                  <div className="p-2 bg-muted/30 rounded text-xs text-muted-foreground mb-2">
                    <strong>Ringkasan:</strong> {reflection.summary}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Fasilitator: {reflection.facilitator} • Email: {reflection.studentEmail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
