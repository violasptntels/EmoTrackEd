"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EmotionIndicator } from "@/components/emotion-indicator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Users, Video, FileText, MessageSquare, Clock, Calendar, BarChart3, UserPlus, Mail, Send, Plus, BookOpen } from "lucide-react"

export default function ManageClassPage() {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState({ name: "Guest", role: "Fasilitator" })
  const [activeStudents, setActiveStudents] = useState([])
  const [message, setMessage] = useState("")
  const [classData, setClassData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  // Dialog untuk penambahan materi dan tugas
  const [materialDialogOpen, setMaterialDialogOpen] = useState(false)
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false)
  const [newMaterial, setNewMaterial] = useState({
    title: "",
    description: "",
    fileType: "pdf", // jenis file: pdf, ppt, doc, dll
    fileName: "" // nama file yang diupload
  })
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    dueDate: "",
    points: "10",
    fileType: "pdf", // jenis file: pdf, doc, dll
    fileName: "" // nama file yang diupload
  })
  
  // State untuk file uploads
  const [materialFile, setMaterialFile] = useState<File | null>(null)
  const [assignmentFile, setAssignmentFile] = useState<File | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem("userData")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    }
    
    // Ambil data kelas dari localStorage
    const fetchClassData = () => {
      const savedClasses = localStorage.getItem("virtualClasses")
      if (savedClasses) {
        try {
          const parsedClasses = JSON.parse(savedClasses)
          const classFound = parsedClasses.find(
            (cls: any) => cls.id?.toString() === (params.id?.toString() ?? "")
          )
          if (classFound) {
            setClassData(classFound)
          } else {
            // Jika kelas tidak ditemukan, redirect ke halaman kelas
            alert("Kelas tidak ditemukan")
            router.push("/classes")
          }
        } catch (error) {
          console.error("Error parsing class data:", error)
          // Gunakan dummy data jika terjadi error
          setClassData(defaultClassData)
        }
      } else {
        // Gunakan dummy data jika tidak ada data di localStorage
        setClassData(defaultClassData)
      }
      setLoading(false)
    }
    
    fetchClassData()
  }, [params.id, router])

  // Data kelas default (simulasi)
  const defaultClassData = {
    id: params?.id || "1",
    title: "Matematika Dasar - Aljabar Linear",
    instructor: "Dr. Sarah Johnson",
    description: "Pembelajaran konsep dasar aljabar linear dengan pendekatan emosional",
    schedule: "Senin, Rabu, Jumat 09:00-10:30",
    participants: 28,
    maxParticipants: 30,
    status: "live",
    startTime: "09:00",
    endTime: "10:30",
    materials: [],
    assignments: []
  }

  // Data siswa yang sedang aktif di kelas
  const students = [
    {
      id: 1,
      name: "Alice Johnson",
      emotion: "joy",
      isOnline: true,
      avatar: "/placeholder.svg",
      joinTime: "08:55",
      emotionHistory: [
        { time: "09:00", emotion: "neutral" },
        { time: "09:15", emotion: "joy" },
        { time: "09:30", emotion: "joy" },
      ],
    },
    {
      id: 2,
      name: "Bob Smith",
      emotion: "neutral",
      isOnline: true,
      avatar: "/placeholder.svg",
      joinTime: "08:58",
      emotionHistory: [
        { time: "09:00", emotion: "neutral" },
        { time: "09:15", emotion: "sadness" },
        { time: "09:30", emotion: "neutral" },
      ],
    },
    {
      id: 3,
      name: "Carol Davis",
      emotion: "sadness",
      isOnline: true,
      avatar: "/placeholder.svg",
      joinTime: "09:02",
      emotionHistory: [
        { time: "09:05", emotion: "fear" },
        { time: "09:15", emotion: "sadness" },
        { time: "09:30", emotion: "sadness" },
      ],
    },
    {
      id: 4,
      name: "David Wilson",
      emotion: "fear",
      isOnline: false,
      avatar: "/placeholder.svg",
      joinTime: "09:10",
      emotionHistory: [
        { time: "09:10", emotion: "neutral" },
        { time: "09:15", emotion: "fear" },
        { time: "09:30", emotion: "fear" },
      ],
    },
  ]

  const handleSendMessage = () => {
    if (message.trim()) {
      alert(`Pesan "${message}" telah dikirim ke semua siswa`)
      setMessage("")
    }
  }
  
  // Fungsi untuk menambahkan materi baru
  const handleAddMaterial = () => {
    if (!newMaterial.title.trim()) {
      alert("Judul materi harus diisi")
      return
    }
    
    if (!materialFile) {
      alert("File materi harus diunggah")
      return
    }
    
    try {
      // Ambil data kelas dari localStorage
      const savedClasses = localStorage.getItem("virtualClasses")
      if (savedClasses) {
        const parsedClasses = JSON.parse(savedClasses)
        const updatedClasses = parsedClasses.map((cls: any) => {
          if (cls.id.toString() === params?.id?.toString()) {
            // Pastikan ada array materials
            const materials = cls.materials || []
            
            // Tambahkan materi baru
            const newMaterialItem = {
              id: Date.now(),
              title: newMaterial.title,
              description: newMaterial.description,
              fileName: newMaterial.fileName,
              fileType: newMaterial.fileType,
              fileSize: materialFile.size,
              dateAdded: new Date().toISOString(),
              // Dalam aplikasi nyata, di sini akan ada URL dari cloud storage setelah file diupload
              fileUrl: `#/demo-file/${newMaterial.fileName}`
            }
            
            return {
              ...cls,
              materials: [newMaterialItem, ...materials],
              // Update jumlah materi untuk ditampilkan di card kelas
              materialsCount: (cls.materialsCount || 0) + 1
            }
          }
          return cls
        })
        
        // Simpan kembali ke localStorage
        localStorage.setItem("virtualClasses", JSON.stringify(updatedClasses))
        
        // Update state classData
        const updatedClass = updatedClasses.find((cls: any) => cls.id.toString() === params?.id?.toString())
        if (updatedClass) {
          setClassData(updatedClass)
        }
        
        // Reset form dan tutup dialog
        setNewMaterial({
          title: "",
          description: "",
          fileType: "pdf",
          fileName: ""
        })
        setMaterialFile(null)
        setMaterialDialogOpen(false)
        
        alert("Materi berhasil ditambahkan")
      }
    } catch (error) {
      console.error("Error adding material:", error)
      alert("Gagal menambahkan materi. Silakan coba lagi.")
    }
  }
  
  // Fungsi untuk menambahkan tugas baru
  const handleAddAssignment = () => {
    if (!newAssignment.title.trim()) {
      alert("Judul tugas harus diisi")
      return
    }
    
    if (!assignmentFile) {
      alert("File tugas harus diunggah")
      return
    }
    
    try {
      // Ambil data kelas dari localStorage
      const savedClasses = localStorage.getItem("virtualClasses")
      if (savedClasses) {
        const parsedClasses = JSON.parse(savedClasses)
        const updatedClasses = parsedClasses.map((cls: any) => {
          if (cls.id.toString() === params?.id?.toString()) {
            // Pastikan ada array assignments
            const assignments = cls.assignments || []
            
            // Tambahkan tugas baru
            const newAssignmentItem = {
              id: Date.now(),
              title: newAssignment.title,
              description: newAssignment.description,
              dueDate: newAssignment.dueDate,
              points: newAssignment.points,
              fileName: newAssignment.fileName,
              fileType: newAssignment.fileType,
              fileSize: assignmentFile.size,
              dateAdded: new Date().toISOString(),
              status: "active",
              // Dalam aplikasi nyata, di sini akan ada URL dari cloud storage setelah file diupload
              fileUrl: `#/demo-file/${newAssignment.fileName}`
            }
            
            return {
              ...cls,
              assignments: [newAssignmentItem, ...assignments],
              // Update jumlah assignments untuk ditampilkan di card kelas
              assignmentsCount: (cls.assignmentsCount || 0) + 1
            }
          }
          return cls
        })
        
        // Simpan kembali ke localStorage
        localStorage.setItem("virtualClasses", JSON.stringify(updatedClasses))
        
        // Update state classData
        const updatedClass = updatedClasses.find((cls: any) => cls.id.toString() === params?.id?.toString())
        if (updatedClass) {
          setClassData(updatedClass)
        }
        
        // Reset form dan tutup dialog
        setNewAssignment({
          title: "",
          description: "",
          dueDate: "",
          points: "10",
          fileType: "pdf",
          fileName: ""
        })
        setAssignmentFile(null)
        setAssignmentDialogOpen(false)
        
        alert("Tugas berhasil ditambahkan")
      }
    } catch (error) {
      console.error("Error adding assignment:", error)
      alert("Gagal menambahkan tugas. Silakan coba lagi.")
    }
  }

  // Fungsi untuk menangani upload file materi
  const handleMaterialFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMaterialFile(file);
      
      // Ekstrak ekstensi file untuk fileType
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'unknown';
      
      // Update newMaterial dengan informasi file
      setNewMaterial({
        ...newMaterial,
        fileName: file.name,
        fileType: fileExt
      });
    }
  };
  
  // Fungsi untuk menangani upload file tugas
  const handleAssignmentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAssignmentFile(file);
      
      // Ekstrak ekstensi file untuk fileType
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'unknown';
      
      // Update newAssignment dengan informasi file
      setNewAssignment({
        ...newAssignment,
        fileName: file.name,
        fileType: fileExt
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <main className="p-4 md:p-6">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p>Memuat data kelas...</p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">{classData?.title || "Kelas"}</h1>
                <p className="text-muted-foreground">Kelola kelas virtual</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={classData?.status === "live" ? "default" : "secondary"}>
                  {classData?.status === "live" ? "🔴 LIVE" : "Offline"}
                </Badge>
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  {classData?.startTime} - {classData?.endTime}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="students" className="space-y-4">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="students">Siswa</TabsTrigger>
                  <TabsTrigger value="emotions">Emosi</TabsTrigger>
                  <TabsTrigger value="materials">Materi</TabsTrigger>
                  <TabsTrigger value="assignments">Tugas</TabsTrigger>
                  <TabsTrigger value="broadcast">Pesan</TabsTrigger>
                </TabsList>

                <TabsContent value="students" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Siswa yang Hadir ({students.filter((s) => s.isOnline).length}/{students.length})
                      </CardTitle>
                      <CardDescription>Daftar siswa yang sedang mengikuti kelas virtual</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {students.map((student) => (
                          <div
                            key={student.id}
                            className={`flex items-center justify-between p-4 rounded-lg border ${
                              student.isOnline
                                ? "border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-900/30"
                                : "border-gray-200 bg-gray-50 dark:bg-gray-800/10 dark:border-gray-800/30"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={student.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{student.name}</p>
                                  <div
                                    className={`w-2 h-2 rounded-full ${student.isOnline ? "bg-green-500" : "bg-gray-400"}`}
                                  />
                                  <span className="text-xs text-muted-foreground">
                                    {student.isOnline ? "Online" : "Offline"}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground">Bergabung: {student.joinTime}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <EmotionIndicator emotion={student.emotion} size="md" showLabel />
                              <Button size="sm" variant="outline">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Chat
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="emotions" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Grafik Emosi Real-time</CardTitle>
                      <CardDescription>Pantau perubahan emosi siswa selama pembelajaran berlangsung</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {students.map((student) => (
                          <div key={student.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={student.avatar || "/placeholder.svg"} />
                                  <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{student.name}</p>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={`w-2 h-2 rounded-full ${student.isOnline ? "bg-green-500" : "bg-gray-400"}`}
                                    />
                                    <span className="text-xs text-muted-foreground">
                                      {student.isOnline ? "Online" : "Offline"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <EmotionIndicator emotion={student.emotion} size="md" showLabel />
                            </div>

                            <div className="flex items-center justify-between mt-4 border-t pt-4">
                              <div className="text-sm text-muted-foreground">Riwayat Emosi:</div>
                              <div className="flex items-center gap-2">
                                {student.emotionHistory.map((item, index) => (
                                  <div key={index} className="flex flex-col items-center">
                                    <EmotionIndicator emotion={item.emotion} size="sm" />
                                    <span className="text-xs text-muted-foreground mt-1">{item.time}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab Materi */}
                <TabsContent value="materials" className="space-y-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          Materi Pembelajaran
                        </CardTitle>
                        <CardDescription>Kelola materi untuk kelas ini</CardDescription>
                      </div>
                      <Button onClick={() => setMaterialDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Materi
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {classData?.materials && classData.materials.length > 0 ? (
                        <div className="space-y-4">
                          {classData.materials.map((material: any) => (
                            <div key={material.id} className="p-4 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium">{material.title}</h3>
                                <Badge variant="outline">
                                  {new Date(material.dateAdded).toLocaleDateString()}
                                </Badge>
                              </div>
                              {material.description && (
                                <p className="text-sm text-muted-foreground mb-3">{material.description}</p>
                              )}
                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-2 text-sm">
                                  <Badge variant="secondary">{material.fileType?.toUpperCase() || 'FILE'}</Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {material.fileName || "File Materi"}
                                    {material.fileSize && ` (${(material.fileSize / (1024 * 1024)).toFixed(2)} MB)`}
                                  </span>
                                </div>
                                <Button size="sm" variant="outline" asChild>
                                  <a href={material.fileUrl || "#"} target="_blank" rel="noopener noreferrer">
                                    Unduh Materi
                                  </a>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <h3 className="text-lg font-medium mb-2">Belum ada materi</h3>
                          <p className="text-muted-foreground mb-4">
                            Tambahkan materi pembelajaran untuk kelas ini
                          </p>
                          <Button onClick={() => setMaterialDialogOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Tambah Materi Pertama
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab Tugas */}
                <TabsContent value="assignments" className="space-y-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Tugas Kelas
                        </CardTitle>
                        <CardDescription>Kelola tugas untuk kelas ini</CardDescription>
                      </div>
                      <Button onClick={() => setAssignmentDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Tugas
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {classData?.assignments && classData.assignments.length > 0 ? (
                        <div className="space-y-4">
                          {classData.assignments.map((assignment: any) => (
                            <div key={assignment.id} className="p-4 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium">{assignment.title}</h3>
                                <Badge variant={assignment.dueDate ? "outline" : "secondary"}>
                                  {assignment.dueDate ? `Due: ${assignment.dueDate}` : "No Due Date"}
                                </Badge>
                              </div>
                              {assignment.description && (
                                <p className="text-sm text-muted-foreground mb-3">{assignment.description}</p>
                              )}
                              <div className="flex items-center gap-2 text-sm mb-3">
                                <Badge variant="secondary">{assignment.fileType?.toUpperCase() || 'FILE'}</Badge>
                                <span className="text-xs text-muted-foreground">
                                  {assignment.fileName || "File Tugas"}
                                  {assignment.fileSize && ` (${(assignment.fileSize / (1024 * 1024)).toFixed(2)} MB)`}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <Badge variant="outline">{assignment.points} points</Badge>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" asChild>
                                    <a href={assignment.fileUrl || "#"} target="_blank" rel="noopener noreferrer">
                                      Unduh Tugas
                                    </a>
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    Lihat Pengumpulan
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <h3 className="text-lg font-medium mb-2">Belum ada tugas</h3>
                          <p className="text-muted-foreground mb-4">
                            Tambahkan tugas untuk kelas ini
                          </p>
                          <Button onClick={() => setAssignmentDialogOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Tambah Tugas Pertama
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="broadcast" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Kirim Pesan ke Semua Siswa
                      </CardTitle>
                      <CardDescription>Kirim pengumuman atau instruksi ke semua siswa yang sedang aktif</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="broadcast-message">Pesan</Label>
                          <Textarea
                            id="broadcast-message"
                            placeholder="Ketik pesan untuk semua siswa..."
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                          />
                        </div>
                        <Button onClick={handleSendMessage} disabled={!message.trim()}>
                          <Send className="h-4 w-4 mr-2" />
                          Kirim ke Semua Siswa
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Class Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Info Kelas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {students.filter((s) => s.isOnline).length}/{students.length} siswa aktif
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{classData.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Kelas sedang berlangsung</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Aksi Cepat</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full justify-start" variant="outline">
                    <Video className="mr-2 h-4 w-4" />
                    Mulai Presentasi
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Bagikan Materi
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Lihat Statistik
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Undang Siswa
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Dialog untuk menambahkan materi baru */}
          <Dialog open={materialDialogOpen} onOpenChange={setMaterialDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Tambah Materi Pembelajaran</DialogTitle>
                <DialogDescription>
                  Unggah materi pembelajaran baru untuk kelas ini. Materi akan tersedia bagi semua siswa.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="material-title">Judul Materi <span className="text-red-500">*</span></Label>
                  <Input
                    id="material-title"
                    placeholder="Contoh: Pengenalan Aljabar Linear"
                    value={newMaterial.title}
                    onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="material-description">Deskripsi (opsional)</Label>
                  <Textarea
                    id="material-description"
                    placeholder="Deskripsi singkat tentang materi ini"
                    rows={3}
                    value={newMaterial.description}
                    onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="material-file">Unggah File <span className="text-red-500">*</span></Label>
                  <Input
                    id="material-file"
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                    onChange={handleMaterialFileChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Unggah file materi pembelajaran (PDF, Word, PowerPoint, Excel)
                  </p>
                  {materialFile && (
                    <div className="mt-2 px-3 py-2 bg-secondary/30 rounded-md text-sm flex items-center justify-between">
                      <span>{materialFile.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {(materialFile.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setMaterialDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleAddMaterial} disabled={!materialFile}>
                  Unggah Materi
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Dialog untuk menambahkan tugas baru */}
          <Dialog open={assignmentDialogOpen} onOpenChange={setAssignmentDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Tambah Tugas Baru</DialogTitle>
                <DialogDescription>
                  Unggah soal tugas baru untuk kelas ini. Tugas akan tersedia bagi semua siswa.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="assignment-title">Judul Tugas <span className="text-red-500">*</span></Label>
                  <Input
                    id="assignment-title"
                    placeholder="Contoh: Latihan Soal Aljabar Linear"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignment-description">Deskripsi (opsional)</Label>
                  <Textarea
                    id="assignment-description"
                    placeholder="Deskripsi singkat tentang tugas ini"
                    rows={3}
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignment-duedate">Tanggal Deadline (opsional)</Label>
                  <Input
                    id="assignment-duedate"
                    type="datetime-local"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignment-points">Poin Nilai</Label>
                  <Input
                    id="assignment-points"
                    type="number"
                    min="1"
                    max="100"
                    value={newAssignment.points}
                    onChange={(e) => setNewAssignment({ ...newAssignment, points: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignment-file">Unggah File Tugas <span className="text-red-500">*</span></Label>
                  <Input
                    id="assignment-file"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleAssignmentFileChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Unggah file soal tugas (PDF, Word, Text)
                  </p>
                  {assignmentFile && (
                    <div className="mt-2 px-3 py-2 bg-secondary/30 rounded-md text-sm flex items-center justify-between">
                      <span>{assignmentFile.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {(assignmentFile.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAssignmentDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleAddAssignment} disabled={!assignmentFile}>
                  Unggah Tugas
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </main>
  )
}
