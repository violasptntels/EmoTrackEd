"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  FileText, 
  Clock, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Filter,
  SortDesc
} from "lucide-react"

export default function TasksPage() {
  const [user, setUser] = useState({ name: "Guest", role: "Siswa" })
  const [searchTerm, setSearchTerm] = useState("")
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    // Load user data
    const userData = localStorage.getItem("userData")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    }

    // Sample tasks data
    const sampleTasks = [
      {
        id: 1,
        title: "Tugas Matematika - Aljabar Linear",
        subject: "Matematika Dasar",
        dueDate: "20 Juni 2025",
        status: "pending", // pending, completed, overdue
        description: "Mengerjakan soal aljabar linear halaman 45-50.",
        priority: "high",
        dateCreated: "15 Juni 2025",
        submissionType: "file",
      },
      {
        id: 2,
        title: "Refleksi Kelas Bahasa Inggris",
        subject: "Bahasa Inggris",
        dueDate: "18 Juni 2025",
        status: "pending",
        description: "Menulis refleksi tentang materi grammar yang telah dipelajari.",
        priority: "medium",
        dateCreated: "13 Juni 2025",
        submissionType: "text",
      },
      {
        id: 3,
        title: "Tugas Sains - Eksperimen Fisika",
        subject: "Sains Dasar",
        dueDate: "12 Juni 2025",
        status: "completed",
        description: "Melakukan eksperimen fisika sederhana dan mendokumentasikannya.",
        priority: "low",
        dateCreated: "10 Juni 2025",
        submissionType: "file",
        dateSubmitted: "11 Juni 2025",
        grade: "A",
      },
    ]

    setTasks(sampleTasks)
  }, [])

  // Filter tasks based on search term
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.subject.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Get status badge variant
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-orange-500 text-white hover:bg-orange-600">
            Belum Dikerjakan
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800">
            Selesai
          </Badge>
        )
      case "overdue":
        return (
          <Badge className="bg-red-500 text-white hover:bg-red-600">
            Terlambat
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-500 text-white">
            Unknown
          </Badge>
        )
    }
  }

  // Get priority badge
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="outline" className="bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800">
            Mendesak
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800">
            Sedang
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800">
            Biasa
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tugas & Aktivitas</h1>
          <p className="text-muted-foreground">
            Kelola semua tugas dan aktivitas pembelajaran Anda
          </p>
        </div>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Cari tugas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <SortDesc className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs for task status */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="pending">Belum Dikerjakan</TabsTrigger>
          <TabsTrigger value="completed">Selesai</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow border">
                <CardContent className="p-0">
                  <div className="p-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`bg-primary/15 p-3 rounded-full ${
                        task.status === "completed" ? "bg-green-100 dark:bg-green-950/30" : ""
                      }`}>
                        <FileText className={`h-5 w-5 ${
                          task.status === "completed" ? "text-green-600 dark:text-green-400" : "text-primary"
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-medium text-base">{task.title}</h3>
                        <p className="text-sm text-muted-foreground">{task.subject}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>Dibuat: {task.dateCreated}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Tenggat: {task.dueDate}</span>
                          </div>
                        </div>
                        <p className="text-sm mt-2">{task.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end mt-2 md:mt-0">
                      <div className="flex gap-2">
                        {getStatusBadge(task.status)}
                        {getPriorityBadge(task.priority)}
                      </div>
                      {task.status !== "completed" && (
                        <Button size="sm" className="mt-2">
                          Kerjakan
                        </Button>
                      )}
                      {task.status === "completed" && (
                        <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                          <CheckCircle className="h-4 w-4" />
                          <span>Dikerjakan: {task.dateSubmitted}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <AlertCircle className="h-10 w-10 text-muted-foreground" />
                <p className="text-lg font-medium">Tidak ada tugas ditemukan</p>
                <p className="text-muted-foreground">
                  Tidak ada tugas yang sesuai dengan pencarian Anda
                </p>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pending" className="mt-4 space-y-4">
          {filteredTasks.filter(task => task.status === "pending").length > 0 ? (
            filteredTasks
              .filter(task => task.status === "pending")
              .map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow border">
                  <CardContent className="p-0">
                    <div className="p-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/15 p-3 rounded-full">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-base">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">{task.subject}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>Dibuat: {task.dateCreated}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" />
                              <span>Tenggat: {task.dueDate}</span>
                            </div>
                          </div>
                          <p className="text-sm mt-2">{task.description}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-end mt-2 md:mt-0">
                        <div className="flex gap-2">
                          {getStatusBadge(task.status)}
                          {getPriorityBadge(task.priority)}
                        </div>
                        <Button size="sm" className="mt-2">
                          Kerjakan
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          ) : (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                <p className="text-lg font-medium">Semua tugas selesai!</p>
                <p className="text-muted-foreground">
                  Anda tidak memiliki tugas yang belum dikerjakan
                </p>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-4 space-y-4">
          {filteredTasks.filter(task => task.status === "completed").length > 0 ? (
            filteredTasks
              .filter(task => task.status === "completed")
              .map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow border">
                  <CardContent className="p-0">
                    <div className="p-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="bg-green-100 dark:bg-green-950/30 p-3 rounded-full">
                          <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-base">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">{task.subject}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>Dibuat: {task.dateCreated}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" />
                              <span>Dikumpulkan: {task.dateSubmitted}</span>
                            </div>
                          </div>
                          <p className="text-sm mt-2">{task.description}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-end mt-2 md:mt-0">
                        <div className="flex gap-2">
                          {getStatusBadge(task.status)}
                          {task.grade && (
                            <Badge className="bg-blue-500 text-white">
                              Nilai: {task.grade}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          ) : (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <AlertCircle className="h-10 w-10 text-muted-foreground" />
                <p className="text-lg font-medium">Belum ada tugas yang diselesaikan</p>
                <p className="text-muted-foreground">
                  Anda belum menyelesaikan tugas apapun
                </p>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
