"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EmotionIndicator } from "@/components/emotion-indicator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Send, MessageSquare, Heart, AlertTriangle, Filter, Search, Star } from "lucide-react"

export default function FacilitatorFeedbackPage() {
  const [selectedStudent, setSelectedStudent] = useState("")
  const [feedbackType, setFeedbackType] = useState("emotional")
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  // Data siswa yang perlu feedback
  const studentsNeedingFeedback = [
    {
      id: 1,
      name: "Alice Johnson",
      currentEmotion: "joy",
      class: "Matematika Dasar",
      lastActivity: "5 menit lalu",
      emotionPattern: "Konsisten positif",
      needsSupport: false,
      priority: "low",
      recentReflection: "Saya senang bisa memahami materi hari ini dengan baik!",
    },
    {
      id: 2,
      name: "Bob Smith",
      currentEmotion: "sadness",
      class: "Matematika Dasar",
      lastActivity: "2 menit lalu",
      emotionPattern: "Sedih berkepanjangan",
      needsSupport: true,
      priority: "high",
      recentReflection: "Saya merasa kesulitan dengan materi aljabar ini...",
    },
    {
      id: 3,
      name: "Carol Davis",
      currentEmotion: "fear",
      class: "Bahasa Inggris",
      lastActivity: "10 menit lalu",
      emotionPattern: "Cemas saat presentasi",
      needsSupport: true,
      priority: "medium",
      recentReflection: "Saya takut salah saat berbicara bahasa Inggris di depan kelas.",
    },
    {
      id: 4,
      name: "David Wilson",
      currentEmotion: "anger",
      class: "Matematika Dasar",
      lastActivity: "1 jam lalu",
      emotionPattern: "Frustrasi dengan tugas",
      needsSupport: true,
      priority: "high",
      recentReflection: "Kenapa soal ini begitu sulit? Saya tidak mengerti sama sekali.",
    },
  ]

  // Data feedback yang sudah diberikan
  const sentFeedbacks = [
    {
      id: 1,
      studentName: "Alice Johnson",
      type: "encouragement",
      message: "Bagus sekali Alice! Semangat belajarmu sangat terlihat. Pertahankan!",
      timestamp: "1 jam lalu",
      status: "read",
    },
    {
      id: 2,
      studentName: "Bob Smith",
      type: "support",
      message: "Bob, saya melihat kamu kesulitan dengan aljabar. Bagaimana kalau kita diskusi setelah kelas?",
      timestamp: "30 menit lalu",
      status: "unread",
    },
  ]

  const feedbackTypes = [
    { value: "emotional", label: "Dukungan Emosional", icon: Heart },
    { value: "academic", label: "Bantuan Akademik", icon: MessageSquare },
    { value: "encouragement", label: "Motivasi", icon: Star },
    { value: "warning", label: "Peringatan", icon: AlertTriangle },
  ]

  const filteredStudents = studentsNeedingFeedback.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filterType === "all" ||
      (filterType === "needs_support" && student.needsSupport) ||
      (filterType === "high_priority" && student.priority === "high")
    return matchesSearch && matchesFilter
  })

  const handleSendFeedback = () => {
    if (!selectedStudent || !feedbackMessage.trim()) return

    const student = studentsNeedingFeedback.find((s) => s.id.toString() === selectedStudent)
    console.log("Sending feedback:", {
      student: student?.name,
      type: feedbackType,
      message: feedbackMessage,
      timestamp: new Date().toISOString(),
    })

    // Reset form
    setSelectedStudent("")
    setFeedbackMessage("")
    setFeedbackType("emotional")
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-500 bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
      case "medium":
        return "text-orange-500 bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800"
      case "low":
        return "text-green-500 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
      default:
        return "text-gray-500 bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800"
    }
  }

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case "high":
        return "Prioritas Tinggi"
      case "medium":
        return "Prioritas Sedang"
      case "low":
        return "Prioritas Rendah"
      default:
        return "Normal"
    }
  }

  return (
    <main className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Berikan Feedback Emosional</h1>
          <p className="text-muted-foreground">
            Berikan dukungan dan feedback yang tepat sasaran berdasarkan kondisi emosional siswa
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feedback Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Buat Feedback Baru</CardTitle>
              <CardDescription>
                Berikan dukungan emosional dan akademik yang personal untuk setiap siswa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="student">Pilih Siswa</Label>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih siswa..." />
                    </SelectTrigger>
                    <SelectContent>
                      {studentsNeedingFeedback.map((student) => (
                        <SelectItem key={student.id} value={student.id.toString()}>
                          <div className="flex items-center gap-2">
                            <span>{student.name}</span>
                            <EmotionIndicator emotion={student.currentEmotion} size="xs" />
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Jenis Feedback</Label>
                  <Select value={feedbackType} onValueChange={setFeedbackType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {feedbackTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="h-4 w-4" />
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedStudent && (
                <div className="p-3 bg-muted/30 rounded-lg">
                  {(() => {
                    const student = studentsNeedingFeedback.find((s) => s.id.toString() === selectedStudent)
                    return student ? (
                      <div>
                        <p className="text-sm font-medium mb-1">Kondisi Emosional Saat Ini:</p>
                        <div className="flex items-center gap-2 mb-2">
                          <EmotionIndicator emotion={student.currentEmotion} size="sm" showLabel />
                          <span className="text-sm text-muted-foreground">- {student.emotionPattern}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          <strong>Refleksi terakhir:</strong> "{student.recentReflection}"
                        </p>
                      </div>
                    ) : null
                  })()}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="message">Pesan Feedback</Label>
                <Textarea
                  id="message"
                  placeholder="Tulis feedback yang personal dan mendukung..."
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Tips: Berikan feedback yang spesifik, konstruktif, dan mendukung kondisi emosional siswa
                </p>
              </div>

              <Button
                onClick={handleSendFeedback}
                disabled={!selectedStudent || !feedbackMessage.trim()}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                Kirim Feedback
              </Button>
            </CardContent>
          </Card>

          {/* Feedback History */}
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Feedback</CardTitle>
              <CardDescription>Feedback yang telah diberikan kepada siswa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sentFeedbacks.map((feedback) => (
                  <div key={feedback.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{feedback.studentName}</span>
                        <Badge variant="outline" className="text-xs">
                          {feedbackTypes.find((t) => t.value === feedback.type)?.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={feedback.status === "read" ? "default" : "secondary"}>
                          {feedback.status === "read" ? "Dibaca" : "Belum dibaca"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{feedback.timestamp}</span>
                      </div>
                    </div>
                    <p className="text-sm">{feedback.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Students Sidebar */}
        <div className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Siswa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari siswa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Siswa</SelectItem>
                  <SelectItem value="needs_support">Perlu Dukungan</SelectItem>
                  <SelectItem value="high_priority">Prioritas Tinggi</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Students List */}
          <Card>
            <CardHeader>
              <CardTitle>Siswa Perlu Perhatian</CardTitle>
              <CardDescription>Daftar siswa berdasarkan kondisi emosional</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      selectedStudent === student.id.toString() ? "border-primary bg-primary/5" : ""
                    } ${getPriorityColor(student.priority)}`}
                    onClick={() => setSelectedStudent(student.id.toString())}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="text-xs">{student.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">{student.name}</p>
                          <EmotionIndicator emotion={student.currentEmotion} size="xs" />
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{student.class}</p>
                        <p className="text-xs">{student.emotionPattern}</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline" className="text-xs">
                            {getPriorityLabel(student.priority)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{student.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Statistik Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Perlu Dukungan</span>
                  <Badge variant="destructive">{studentsNeedingFeedback.filter((s) => s.needsSupport).length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Prioritas Tinggi</span>
                  <Badge variant="outline">{studentsNeedingFeedback.filter((s) => s.priority === "high").length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Feedback Dikirim</span>
                  <Badge variant="outline">{sentFeedbacks.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Belum Dibaca</span>
                  <Badge variant="secondary">{sentFeedbacks.filter((f) => f.status === "unread").length}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
