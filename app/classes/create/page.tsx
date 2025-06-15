"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Plus, ArrowLeft, BookOpen, FileText, Trash } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CreateClassPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    date: "",
    startTime: "",
    endTime: "",
    maxParticipants: "30",
  })
  
  // State untuk materi dan tugas
  const [materials, setMaterials] = useState<any[]>([])
  const [assignments, setAssignments] = useState<any[]>([])

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

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("details")

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
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
    
    // Simulasi upload file (dalam aplikasi nyata, Anda akan mengupload file ke server/cloud storage)
    // Di sini kita hanya menyimpan metadata, karena localStorage tidak dapat menyimpan file secara langsung
    
    // Tambahkan materi baru ke state
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
    
    setMaterials(prev => [newMaterialItem, ...prev])
    
    // Reset form dan tutup dialog
    setNewMaterial({ 
      title: "", 
      description: "", 
      fileType: "pdf", 
      fileName: "" 
    })
    setMaterialFile(null)
    setMaterialDialogOpen(false)
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
    
    // Simulasi upload file (dalam aplikasi nyata, Anda akan mengupload file ke server/cloud storage)
    
    // Tambahkan tugas baru ke state
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
    
    setAssignments(prev => [newAssignmentItem, ...prev])
    
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
  }
  
  // Fungsi untuk menghapus materi
  const handleDeleteMaterial = (id: number) => {
    setMaterials(prev => prev.filter(item => item.id !== id))
  }
  
  // Fungsi untuk menghapus tugas
  const handleDeleteAssignment = (id: number) => {
    setAssignments(prev => prev.filter(item => item.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulasi pembuatan kelas
    try {
      console.log("Creating class:", formData)

      // Create a proper class object with needed properties
      const newClass = {
        id: Date.now(), // Generate a unique ID based on timestamp
        title: formData.title,
        instructor: "Anda (Fasilitator)", // Default to current user
        description: formData.description || "Tidak ada deskripsi",
        participants: 0,
        maxParticipants: parseInt(formData.maxParticipants),
        schedule: `${formatDate(formData.date)} ${formData.startTime}-${formData.endTime}`,
        status: "upcoming",
        nextSession: `${formData.date} ${formData.startTime}`,
        materials: materials, // Gunakan materials yang sudah ditambahkan
        assignments: assignments, // Gunakan assignments yang sudah ditambahkan
        materialsCount: materials.length, // Jumlah materi untuk ditampilkan di card kelas
        assignmentsCount: assignments.length, // Jumlah tugas untuk ditampilkan di card kelas
        emotionScore: 0,
      }

      // Get existing classes from localStorage or initialize with empty array
      const existingClassesStr = localStorage.getItem("virtualClasses")
      const existingClasses = existingClassesStr ? JSON.parse(existingClassesStr) : []
      
      // Add new class to the beginning of the array
      const updatedClasses = [newClass, ...existingClasses]
      
      // Save updated classes to localStorage
      localStorage.setItem("virtualClasses", JSON.stringify(updatedClasses))

      // Simulasi delay API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Redirect ke halaman kelas setelah berhasil
      router.push("/classes")
    } catch (error) {
      console.error("Error creating class:", error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Helper function to format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
    return days[date.getDay()]
  }

  const isFormValid = formData.title && formData.subject && formData.date && formData.startTime && formData.endTime

  return (
    <main className="p-4 md:p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/classes">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Buat Kelas Virtual Baru</h1>
          <p className="text-muted-foreground">Buat kelas virtual dengan fitur deteksi emosi real-time</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="details">Detail Kelas</TabsTrigger>
                <TabsTrigger value="materials">Materi Pembelajaran</TabsTrigger>
                <TabsTrigger value="assignments">Tugas</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className={activeTab === "details" ? "block" : "hidden"}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Judul Kelas *</Label>
                    <Input
                      id="title"
                      placeholder="Contoh: Matematika Dasar - Aljabar Linear"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Mata Pelajaran *</Label>
                    <Select value={formData.subject} onValueChange={(value) => handleInputChange("subject", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih mata pelajaran" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="matematika">Matematika</SelectItem>
                        <SelectItem value="bahasa-inggris">Bahasa Inggris</SelectItem>
                        <SelectItem value="ilmu-sosial">Ilmu Sosial</SelectItem>
                        <SelectItem value="ilmu-alam">Ilmu Alam</SelectItem>
                        <SelectItem value="seni">Seni</SelectItem>
                        <SelectItem value="olahraga">Olahraga</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="description">Deskripsi Kelas</Label>
                  <Textarea
                    id="description"
                    placeholder="Deskripsi singkat tentang materi yang akan dipelajari..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Tanggal *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Waktu Mulai *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => handleInputChange("startTime", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">Waktu Selesai *</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => handleInputChange("endTime", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="maxParticipants">Maksimal Peserta</Label>
                  <Select
                    value={formData.maxParticipants}
                    onValueChange={(value) => handleInputChange("maxParticipants", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 Peserta</SelectItem>
                      <SelectItem value="20">20 Peserta</SelectItem>
                      <SelectItem value="30">30 Peserta</SelectItem>
                      <SelectItem value="50">50 Peserta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Tab Materi Pembelajaran */}
              <div className={activeTab === "materials" ? "block" : "hidden"}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Materi Pembelajaran</h3>
                  <Button onClick={() => setMaterialDialogOpen(true)} type="button">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Materi
                  </Button>
                </div>
                
                {materials.length > 0 ? (
                  <div className="space-y-4">
                    {materials.map((material) => (
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
                        <div className="flex justify-between items-center">
                          {material.url && (
                            <Button size="sm" variant="outline" asChild className="mr-auto">
                              <a href={material.url} target="_blank" rel="noopener noreferrer">
                                Lihat Link
                              </a>
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleDeleteMaterial(material.id)}
                            type="button"
                          >
                            <Trash className="h-4 w-4" />
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
                    <Button onClick={() => setMaterialDialogOpen(true)} type="button">
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Materi Pertama
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Tab Tugas */}
              <div className={activeTab === "assignments" ? "block" : "hidden"}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Tugas Kelas</h3>
                  <Button onClick={() => setAssignmentDialogOpen(true)} type="button">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Tugas
                  </Button>
                </div>
                
                {assignments.length > 0 ? (
                  <div className="space-y-4">
                    {assignments.map((assignment) => (
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
                        <div className="flex justify-between items-center">
                          <Badge variant="outline">{assignment.points} points</Badge>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleDeleteAssignment(assignment.id)}
                            type="button"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
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
                    <Button onClick={() => setAssignmentDialogOpen(true)} type="button">
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Tugas Pertama
                    </Button>
                  </div>
                )}
              </div>

              {/* Footer dengan tombol navigasi dan submit */}
              <div className="flex gap-4 pt-4 border-t mt-6">
                <div className="flex-1">
                  {activeTab !== "details" && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setActiveTab(activeTab === "materials" ? "details" : "materials")}
                    >
                      ← Sebelumnya
                    </Button>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button type="button" variant="outline" asChild>
                    <Link href="/classes">Batal</Link>
                  </Button>
                  
                  {activeTab !== "assignments" ? (
                    <Button 
                      type="button" 
                      onClick={() => setActiveTab(activeTab === "details" ? "materials" : "assignments")}
                    >
                      Lanjutkan →
                    </Button>
                  ) : (
                    <Button type="submit" disabled={!isFormValid || isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Membuat Kelas...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Buat Kelas
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </form>
        </Card>

        {/* Preview & Info */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preview Kelas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">{formData.title || "Judul Kelas"}</p>
                <p className="text-xs text-muted-foreground">{formData.subject || "Mata Pelajaran"}</p>
              </div>

              {formData.description && (
                <div>
                  <p className="text-xs text-muted-foreground">{formData.description}</p>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formData.date || "Tanggal"}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {formData.startTime && formData.endTime ? `${formData.startTime} - ${formData.endTime}` : "Waktu"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Maks. {formData.maxParticipants} peserta</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Fitur Kelas Virtual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  ✅ Video Conference
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  ✅ Deteksi Emosi Real-time
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  ✅ Chat Emotion-Aware
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  ✅ Upload Materi
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  ✅ Monitor Emosi Siswa
                </Badge>
              </div>
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
    </main>
  )
}
