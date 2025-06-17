"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Video, Users, Clock, Calendar, Plus, Search, BookOpen, MessageSquare, FileText, UserPlus } from "lucide-react"
import Link from "next/link"

export default function ClassesPage() {
  const [user, setUser] = useState({ name: "Guest", role: "Siswa" })
  const [searchTerm, setSearchTerm] = useState("")
  const [classes, setClasses] = useState([])

  useEffect(() => {
    // Load user data
    const userData = localStorage.getItem("userData")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    }

    // Load class data from localStorage or use default data
    const savedClasses = localStorage.getItem("virtualClasses")
    if (savedClasses) {
      try {
        const parsedClasses = JSON.parse(savedClasses)
        setClasses(parsedClasses)
      } catch (error) {
        console.error("Error parsing saved classes:", error)
        setClasses(defaultClasses)
      }
    } else {
      // If no saved classes, use default data and save it to localStorage
      setClasses(defaultClasses)
      localStorage.setItem("virtualClasses", JSON.stringify(defaultClasses))
    }
  }, [])

  // Default data kelas virtual
  const defaultClasses = [
    {
      id: 1,
      title: "Matematika Dasar",
      instructor: "Dr. Sarah Johnson",
      description: "Pembelajaran konsep dasar matematika dengan pendekatan emosional",
      participants: 28,
      maxParticipants: 30,
      schedule: "Senin, Rabu, Jumat 09:00-10:30",
      status: "completed", // Updated to match student dashboard
      nextSession: null,
      materials: 12,
      assignments: 5,
      emotionScore: 85,
    },
    {
      id: 2,
      title: "Bahasa Inggris Komunikatif",
      instructor: "Prof. Michael Chen",
      description: "Belajar bahasa Inggris dengan fokus pada ekspresi emosi",
      participants: 25,
      maxParticipants: 25,
      schedule: "Selasa, Kamis 14:00-15:30",
      status: "active",
      nextSession: "2025-06-16 14:00",
      materials: 8,
      assignments: 3,
      emotionScore: 92,
    },
    {
      id: 3,
      title: "Ilmu Pengetahuan Alam",
      instructor: "Dr. Emily Rodriguez",
      description: "Memahami fenomena alam dengan pendekatan eksperimental",
      participants: 22,
      maxParticipants: 25,
      schedule: "Senin, Kamis 11:00-12:30",
      status: "upcoming",
      nextSession: "2025-06-17 11:00",
      materials: 10,
      assignments: 4,
      emotionScore: 79,
    },
    {
      id: 4,
      title: "Sejarah Indonesia",
      instructor: "Prof. Ahmad Sulaiman",
      description: "Mempelajari sejarah Indonesia dengan pendekatan naratif",
      participants: 20,
      maxParticipants: 25,
      schedule: "Selasa, Jumat 13:00-14:30",
      status: "upcoming",
      nextSession: "2025-06-18 13:00",
      materials: 15,
      assignments: 6,
      emotionScore: 81,
    },
    {
      id: 5,
      title: "Pendidikan Kewarganegaraan",
      instructor: "Dr. Lisa Anderson",
      description: "Mempelajari nilai-nilai kewarganegaraan",
      participants: 24,
      maxParticipants: 30,
      schedule: "Rabu, Jumat 09:00-10:30",
      status: "completed",
      nextSession: null,
      materials: 9,
      assignments: 4,
      emotionScore: 77,
    },
    {
      id: 6,
      title: "Ilmu Sosial Dasar",
      instructor: "Prof. David Wilson",
      description: "Memahami dinamika sosial masyarakat",
      participants: 26,
      maxParticipants: 30,
      schedule: "Selasa, Kamis 10:00-11:30",
      status: "completed",
      nextSession: null,
      materials: 11,
      assignments: 5,
      emotionScore: 83,
    },
    {
      id: 7,
      title: "Seni dan Budaya",
      instructor: "Dr. Maria Garcia",
      description: "Eksplorasi seni dan budaya Indonesia",
      participants: 23,
      maxParticipants: 25,
      schedule: "Jumat 15:00-16:30",
      status: "completed",
      nextSession: null,
      materials: 7,
      assignments: 3,
      emotionScore: 90,
    },
    {
      id: 8,
      title: "Teknologi Informasi",
      instructor: "Prof. James Smith",
      description: "Pengenalan teknologi informasi dan aplikasinya",
      participants: 18,
      maxParticipants: 20,
      schedule: "Senin, Rabu 13:00-14:30",
      status: "upcoming",
      nextSession: "2025-06-19 13:00",
      materials: 8,
      assignments: 4,
      emotionScore: 75,
    },
  ]

  const filteredClasses = classes.filter(
    (cls) =>
      cls.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.instructor.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "upcoming":
        return "bg-blue-500"
      case "ended":
      case "completed":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Aktif"
      case "upcoming":
        return "Akan Datang"
      case "ended":
      case "completed":
        return "Selesai"
      default:
        return "Unknown"
    }
  }

  const handleDeleteClass = (classId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kelas ini?")) {
      try {
        // Get existing classes from localStorage
        const existingClassesStr = localStorage.getItem("virtualClasses")
        if (existingClassesStr) {
          const existingClasses = JSON.parse(existingClassesStr)
          
          // Filter out the class to be deleted
          const updatedClasses = existingClasses.filter((cls) => cls.id !== classId)
          
          // Save the updated classes back to localStorage
          localStorage.setItem("virtualClasses", JSON.stringify(updatedClasses))
          
          // Update the state to reflect the change
          setClasses(updatedClasses)
        }
      } catch (error) {
        console.error("Error deleting class:", error)
        alert("Gagal menghapus kelas. Silakan coba lagi.")
      }
    }
  }

  return (
    <main className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Kelas Virtual</h1>
          <p className="text-muted-foreground">
            {user.role === "Siswa"
              ? "Bergabung dengan kelas dan ikuti pembelajaran interaktif"
              : "Kelola kelas virtual dan pantau partisipasi siswa"}
          </p>
        </div>
        {user.role !== "Siswa" && (
          <Button asChild>
            <Link href="/classes/create">
              <Plus className="mr-2 h-4 w-4" />
              Buat Kelas Baru
            </Link>
          </Button>
        )}
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari kelas atau instruktur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClasses.map((cls) => (
          <Card key={cls.id} className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{cls.title}</CardTitle>
                  <CardDescription className="text-sm">{cls.description}</CardDescription>
                </div>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(cls.status)}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Instructor */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>
                      {cls.instructor
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{cls.instructor}</p>
                    <p className="text-xs text-muted-foreground">Instruktur</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {cls.participants}/{cls.maxParticipants}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>{cls.materialsCount || cls.materials || 0} Materi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{cls.assignmentsCount || cls.assignments || 0} Tugas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-400 to-blue-500" />
                    <span>{cls.emotionScore}% Emosi</span>
                  </div>
                </div>

                {/* Schedule */}
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Jadwal</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{cls.schedule}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs">
                      Sesi berikutnya: {cls.nextSession ? new Date(cls.nextSession).toLocaleString("id-ID") : "Selesai"}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <Badge variant={cls.status === "active" ? "default" : "secondary"}>{getStatusText(cls.status)}</Badge>
                  {cls.participants < cls.maxParticipants && user.role === "Siswa" && (
                    <Badge variant="outline" className="text-green-600">
                      <UserPlus className="h-3 w-3 mr-1" />
                      Bisa Gabung
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {user.role === "Siswa" ? (
                    <>
                      <Button asChild className="flex-1">
                        <Link href={`/classes/${cls.id}`}>
                          <Video className="h-4 w-4 mr-2" />
                          Masuk Kelas
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href={`/classes/${cls.id}/materials`}>
                          <BookOpen className="h-4 w-4" />
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild className="flex-1">
                        <Link href={`/classes/${cls.id}/manage`}>Kelola Kelas</Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href={`/classes/${cls.id}/emotions`}>
                          <MessageSquare className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button 
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteClass(cls.id)}
                        className="h-9 w-9">
                        <span className="sr-only">Hapus kelas</span>
                        ×
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Tidak ada kelas ditemukan</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? "Coba ubah kata kunci pencarian" : "Belum ada kelas yang tersedia"}
          </p>
          {user.role !== "Siswa" && (
            <Button asChild>
              <Link href="/classes/create">
                <Plus className="mr-2 h-4 w-4" />
                Buat Kelas Pertama
              </Link>
            </Button>
          )}
        </div>
      )}
    </main>
  )
}
