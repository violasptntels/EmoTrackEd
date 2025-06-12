"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EmotionIndicator } from "@/components/emotion-indicator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Calendar, Clock, Filter, Download, Eye, Camera, Mic, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminDetectionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [emotionFilter, setEmotionFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const detections = [
    {
      id: 1,
      studentName: "Alice Johnson",
      studentEmail: "alice@student.com",
      date: "12 Jun 2025",
      time: "09:45",
      emotion: "joy",
      confidence: 92,
      type: "webcam",
      session: "Matematika",
      facilitator: "Dr. Sarah Johnson",
      duration: "00:02:30",
    },
    {
      id: 2,
      studentName: "Bob Smith",
      studentEmail: "bob@student.com",
      date: "12 Jun 2025",
      time: "14:20",
      emotion: "sadness",
      confidence: 87,
      type: "audio",
      session: "Bahasa Inggris",
      facilitator: "Prof. Michael Chen",
      duration: "00:01:45",
    },
    {
      id: 3,
      studentName: "Carol Davis",
      studentEmail: "carol@student.com",
      date: "12 Jun 2025",
      time: "16:50",
      emotion: "neutral",
      confidence: 78,
      type: "text",
      session: "Ilmu Sosial",
      facilitator: "Dr. Lisa Anderson",
      duration: "-",
    },
    {
      id: 4,
      studentName: "David Wilson",
      studentEmail: "david@student.com",
      date: "11 Jun 2025",
      time: "10:25",
      emotion: "anger",
      confidence: 94,
      type: "webcam",
      session: "Ilmu Alam",
      facilitator: "Dr. Sarah Johnson",
      duration: "00:03:15",
    },
    {
      id: 5,
      studentName: "Emma Brown",
      studentEmail: "emma@student.com",
      date: "11 Jun 2025",
      time: "13:20",
      emotion: "fear",
      confidence: 89,
      type: "audio",
      session: "Bahasa Inggris",
      facilitator: "Prof. Michael Chen",
      duration: "00:02:10",
    },
    {
      id: 6,
      studentName: "Frank Miller",
      studentEmail: "frank@student.com",
      date: "10 Jun 2025",
      time: "15:30",
      emotion: "surprise",
      confidence: 85,
      type: "text",
      session: "Seni",
      facilitator: "Dr. Lisa Anderson",
      duration: "-",
    },
  ]

  const filteredDetections = detections.filter((detection) => {
    const matchesSearch =
      detection.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      detection.session.toLowerCase().includes(searchTerm.toLowerCase()) ||
      detection.facilitator.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesEmotion = emotionFilter === "all" || detection.emotion === emotionFilter
    const matchesType = typeFilter === "all" || detection.type === typeFilter

    return matchesSearch && matchesEmotion && matchesType
  })

  const emotionStats = {
    joy: detections.filter((d) => d.emotion === "joy").length,
    sadness: detections.filter((d) => d.emotion === "sadness").length,
    anger: detections.filter((d) => d.emotion === "anger").length,
    fear: detections.filter((d) => d.emotion === "fear").length,
    surprise: detections.filter((d) => d.emotion === "surprise").length,
    neutral: detections.filter((d) => d.emotion === "neutral").length,
  }

  const typeStats = {
    webcam: detections.filter((d) => d.type === "webcam").length,
    audio: detections.filter((d) => d.type === "audio").length,
    text: detections.filter((d) => d.type === "text").length,
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "webcam":
        return <Camera className="h-4 w-4" />
      case "audio":
        return <Mic className="h-4 w-4" />
      case "text":
        return <MessageSquare className="h-4 w-4" />
      default:
        return <Camera className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "webcam":
        return "Webcam"
      case "audio":
        return "Audio"
      case "text":
        return "Teks"
      default:
        return "Unknown"
    }
  }

  return (
    <main className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Data Deteksi Emosi</h1>
          <p className="text-muted-foreground">Monitor hasil deteksi emosi dari semua siswa</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Terkejut</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{emotionStats.surprise}</div>
              <EmotionIndicator emotion="surprise" size="sm" />
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

      {/* Type Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Deteksi Webcam</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{typeStats.webcam}</div>
              <Camera className="h-5 w-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Deteksi Audio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{typeStats.audio}</div>
              <Mic className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Deteksi Teks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{typeStats.text}</div>
              <MessageSquare className="h-5 w-5 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Data Deteksi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari siswa, sesi, atau fasilitator..."
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
                <SelectItem value="surprise">Terkejut</SelectItem>
                <SelectItem value="neutral">Netral</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter Tipe Deteksi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tipe</SelectItem>
                <SelectItem value="webcam">Webcam</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="text">Teks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Detections List */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Deteksi ({filteredDetections.length})</CardTitle>
          <CardDescription>Data deteksi emosi dari semua siswa</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDetections.map((detection) => (
              <div
                key={detection.id}
                className="flex gap-4 p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>{detection.studentName.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <EmotionIndicator emotion={detection.emotion} size="md" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{detection.studentName}</p>
                      <Badge variant="outline" className="text-xs">
                        {getTypeIcon(detection.type)}
                        <span className="ml-1">{getTypeLabel(detection.type)}</span>
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {detection.session}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {detection.date}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {detection.time}
                      </Badge>
                    </div>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Confidence</p>
                      <p className="font-medium">{detection.confidence}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Durasi</p>
                      <p className="font-medium">{detection.duration}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Fasilitator</p>
                      <p className="font-medium">{detection.facilitator}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium">{detection.studentEmail}</p>
                    </div>
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
