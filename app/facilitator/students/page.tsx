"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EmotionIndicator } from "@/components/emotion-indicator"
import { Search, UserPlus, MessageSquare, BarChart3, AlertTriangle } from "lucide-react"

export default function StudentsManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const students = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@student.com",
      currentEmotion: "joy",
      lastActivity: "5 menit lalu",
      totalReflections: 24,
      totalSessions: 12,
      status: "Active",
      needsAttention: false,
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@student.com",
      currentEmotion: "sadness",
      lastActivity: "10 menit lalu",
      totalReflections: 18,
      totalSessions: 8,
      status: "Active",
      needsAttention: true,
    },
    {
      id: 3,
      name: "Carol Davis",
      email: "carol@student.com",
      currentEmotion: "neutral",
      lastActivity: "15 menit lalu",
      totalReflections: 31,
      totalSessions: 15,
      status: "Active",
      needsAttention: false,
    },
    {
      id: 4,
      name: "David Wilson",
      email: "david@student.com",
      currentEmotion: "anger",
      lastActivity: "20 menit lalu",
      totalReflections: 12,
      totalSessions: 6,
      status: "Inactive",
      needsAttention: true,
    },
  ]

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <main className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Kelola Siswa</h1>
          <p className="text-muted-foreground">Monitor dan kelola siswa dalam kelas Anda</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Tambah Siswa
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Siswa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">28 aktif hari ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Perlu Perhatian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">3</div>
            <p className="text-xs text-muted-foreground">Emosi negatif berulang</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rata-rata Refleksi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">21</div>
            <p className="text-xs text-muted-foreground">Per siswa bulan ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tingkat Partisipasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">87%</div>
            <p className="text-xs text-muted-foreground">Siswa aktif mingguan</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Cari Siswa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama atau email siswa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Siswa ({filteredStudents.length})</CardTitle>
          <CardDescription>Monitor aktivitas dan emosi siswa</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{student.name}</p>
                      {student.needsAttention && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                    <p className="text-xs text-muted-foreground">Aktivitas terakhir: {student.lastActivity}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <EmotionIndicator emotion={student.currentEmotion} size="md" />
                    <p className="text-xs text-muted-foreground mt-1">Emosi saat ini</p>
                  </div>

                  <div className="text-center">
                    <p className="text-lg font-bold">{student.totalReflections}</p>
                    <p className="text-xs text-muted-foreground">Refleksi</p>
                  </div>

                  <div className="text-center">
                    <p className="text-lg font-bold">{student.totalSessions}</p>
                    <p className="text-xs text-muted-foreground">Sesi</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={student.status === "Active" ? "default" : "secondary"}>{student.status}</Badge>
                    {student.needsAttention && <Badge variant="destructive">Perhatian</Badge>}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <BarChart3 className="h-4 w-4" />
                    </Button>
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
