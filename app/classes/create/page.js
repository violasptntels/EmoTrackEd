"use client"

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
  
  const [formMaterials, setFormMaterials] = useState([
    { title: "", description: "", type: "document", link: "" },
  ])
  
  const [formQuestions, setFormQuestions] = useState([
    { question: "", type: "essay" },
  ])
  
  const [activeTab, setActiveTab] = useState("details")
  const [showPreview, setShowPreview] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubjectChange = (value) => {
    setFormData({
      ...formData,
      subject: value,
    })
  }

  // Material handlers
  const handleMaterialChange = (index, field, value) => {
    const updatedMaterials = [...formMaterials]
    updatedMaterials[index] = { ...updatedMaterials[index], [field]: value }
    setFormMaterials(updatedMaterials)
  }

  const addMaterial = () => {
    setFormMaterials([...formMaterials, { title: "", description: "", type: "document", link: "" }])
  }

  const removeMaterial = (index) => {
    const updatedMaterials = [...formMaterials]
    updatedMaterials.splice(index, 1)
    setFormMaterials(updatedMaterials)
  }

  // Question handlers
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...formQuestions]
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value }
    setFormQuestions(updatedQuestions)
  }

  const addQuestion = () => {
    setFormQuestions([...formQuestions, { question: "", type: "essay" }])
  }

  const removeQuestion = (index) => {
    const updatedQuestions = [...formQuestions]
    updatedQuestions.splice(index, 1)
    setFormQuestions(updatedQuestions)
  }

  // Form submission
  const handleSubmit = () => {
    // This would typically send data to an API
    console.log("Form submitted:", { ...formData, materials: formMaterials, questions: formQuestions })
    // Simulate successful creation and redirect
    setTimeout(() => {
      router.push('/classes')
    }, 1000)
  }

  // Tab controls
  const nextTab = () => {
    if (activeTab === "details") setActiveTab("materials")
    else if (activeTab === "materials") setActiveTab("questions")
    else if (activeTab === "questions") setShowPreview(true)
  }

  const prevTab = () => {
    if (activeTab === "materials") setActiveTab("details")
    else if (activeTab === "questions") setActiveTab("materials")
  }

  const getFormProgress = () => {
    if (activeTab === "details") return 33
    if (activeTab === "materials") return 66
    return 100
  }

  return (
    <div className="container max-w-5xl py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/classes">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Buat Kelas Virtual Baru</h1>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 h-2 mb-6 rounded-full overflow-hidden">
        <div 
          className="bg-primary h-full transition-all duration-300"
          style={{ width: `${getFormProgress()}%` }}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="details">Detail Kelas</TabsTrigger>
          <TabsTrigger value="materials">Materi</TabsTrigger>
          <TabsTrigger value="questions">Pertanyaan Refleksi</TabsTrigger>
        </TabsList>
        
        {/* Class Details */}
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Kelas Virtual</CardTitle>
              <CardDescription>Masukkan detail kelas virtual yang akan dibuat</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Judul Kelas</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    placeholder="Masukkan judul kelas" 
                    value={formData.title} 
                    onChange={handleChange}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="subject">Mata Pelajaran</Label>
                  <Select 
                    value={formData.subject} 
                    onValueChange={handleSubjectChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih mata pelajaran" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="matematika">Matematika</SelectItem>
                      <SelectItem value="bahasa-indonesia">Bahasa Indonesia</SelectItem>
                      <SelectItem value="bahasa-inggris">Bahasa Inggris</SelectItem>
                      <SelectItem value="ipa">Ilmu Pengetahuan Alam</SelectItem>
                      <SelectItem value="ips">Ilmu Pengetahuan Sosial</SelectItem>
                      <SelectItem value="pendidikan-kewarganegaraan">Pendidikan Kewarganegaraan</SelectItem>
                      <SelectItem value="seni-budaya">Seni dan Budaya</SelectItem>
                      <SelectItem value="lainnya">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Deskripsi Kelas</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    placeholder="Deskripsi tentang kelas ini" 
                    rows={4} 
                    value={formData.description} 
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Tanggal</Label>
                  <div className="relative">
                    <Input 
                      id="date" 
                      name="date" 
                      type="date" 
                      value={formData.date} 
                      onChange={handleChange}
                    />
                    <Calendar className="absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="startTime">Waktu Mulai</Label>
                  <div className="relative">
                    <Input 
                      id="startTime" 
                      name="startTime" 
                      type="time" 
                      value={formData.startTime} 
                      onChange={handleChange}
                    />
                    <Clock className="absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="endTime">Waktu Selesai</Label>
                  <div className="relative">
                    <Input 
                      id="endTime" 
                      name="endTime" 
                      type="time" 
                      value={formData.endTime} 
                      onChange={handleChange}
                    />
                    <Clock className="absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="maxParticipants">Maksimum Peserta</Label>
                <div className="relative">
                  <Input 
                    id="maxParticipants" 
                    name="maxParticipants" 
                    type="number" 
                    min="1" 
                    value={formData.maxParticipants} 
                    onChange={handleChange}
                  />
                  <Users className="absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Materials */}
        <TabsContent value="materials">
          <Card>
            <CardHeader>
              <CardTitle>Materi Pembelajaran</CardTitle>
              <CardDescription>Tambahkan materi yang akan digunakan dalam kelas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {formMaterials.map((material, index) => (
                <div key={index} className="border rounded-lg p-4 relative">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-2 top-2 text-destructive hover:text-destructive"
                    onClick={() => removeMaterial(index)}
                    disabled={formMaterials.length === 1}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                  
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor={`material-title-${index}`}>Judul Materi</Label>
                      <Input 
                        id={`material-title-${index}`}
                        placeholder="Masukkan judul materi"
                        value={material.title}
                        onChange={(e) => handleMaterialChange(index, 'title', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor={`material-desc-${index}`}>Deskripsi Materi</Label>
                      <Textarea
                        id={`material-desc-${index}`}
                        placeholder="Deskripsi singkat tentang materi ini"
                        value={material.description}
                        onChange={(e) => handleMaterialChange(index, 'description', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor={`material-type-${index}`}>Jenis Materi</Label>
                        <Select 
                          value={material.type} 
                          onValueChange={(value) => handleMaterialChange(index, 'type', value)}
                        >
                          <SelectTrigger id={`material-type-${index}`}>
                            <SelectValue placeholder="Pilih jenis materi" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="document">
                              <div className="flex items-center">
                                <FileText className="mr-2 h-4 w-4" />
                                <span>Dokumen</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="video">
                              <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mr-2 h-4 w-4">
                                  <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                                </svg>
                                <span>Video</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="presentation">
                              <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mr-2 h-4 w-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                                </svg>
                                <span>Presentasi</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="website">
                              <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mr-2 h-4 w-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                                </svg>
                                <span>Website</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor={`material-link-${index}`}>Link Materi</Label>
                        <Input 
                          id={`material-link-${index}`}
                          placeholder="URL atau link ke materi"
                          value={material.link}
                          onChange={(e) => handleMaterialChange(index, 'link', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Badge variant="outline" className="flex items-center gap-1">
                      {material.type === 'document' && <FileText className="h-3 w-3" />}
                      {material.type === 'video' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-3 w-3"><path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></svg>}
                      {material.type === 'presentation' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-3 w-3"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" /></svg>}
                      {material.type === 'website' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-3 w-3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>}
                      {material.type.charAt(0).toUpperCase() + material.type.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
              
              <Button 
                type="button" 
                className="w-full" 
                variant="outline" 
                onClick={addMaterial}
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Materi
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Reflection Questions */}
        <TabsContent value="questions">
          <Card>
            <CardHeader>
              <CardTitle>Pertanyaan Refleksi</CardTitle>
              <CardDescription>Siapkan pertanyaan refleksi untuk siswa yang akan berpartisipasi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {formQuestions.map((question, index) => (
                <div key={index} className="border rounded-lg p-4 relative">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-2 top-2 text-destructive hover:text-destructive"
                    onClick={() => removeQuestion(index)}
                    disabled={formQuestions.length === 1}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                  
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor={`question-text-${index}`}>Pertanyaan</Label>
                      <Textarea 
                        id={`question-text-${index}`}
                        placeholder="Tuliskan pertanyaan refleksi"
                        value={question.question}
                        onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor={`question-type-${index}`}>Jenis Pertanyaan</Label>
                      <Select 
                        value={question.type} 
                        onValueChange={(value) => handleQuestionChange(index, 'type', value)}
                      >
                        <SelectTrigger id={`question-type-${index}`}>
                          <SelectValue placeholder="Pilih jenis pertanyaan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="essay">Esai</SelectItem>
                          <SelectItem value="multiple-choice">Pilihan Ganda</SelectItem>
                          <SelectItem value="scale">Skala (1-5)</SelectItem>
                          <SelectItem value="emotion">Refleksi Emosi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button 
                type="button" 
                className="w-full" 
                variant="outline" 
                onClick={addQuestion}
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Pertanyaan
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-6">
        {activeTab !== "details" ? (
          <Button type="button" variant="outline" onClick={prevTab}>
            Kembali
          </Button>
        ) : (
          <div></div>
        )}
        <Button 
          type="button" 
          onClick={activeTab === "questions" ? () => setShowConfirm(true) : nextTab}
        >
          {activeTab === "questions" ? "Selesai" : "Lanjut"}
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent aria-describedby="confirm-class-creation-description">
          <DialogHeader>
            <DialogTitle>Konfirmasi Pembuatan Kelas</DialogTitle>            <DialogDescription id="confirm-class-creation-description">
              Apakah Anda yakin ingin membuat kelas virtual dengan informasi yang telah diisi?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3">
            <div className="border rounded-md p-3">
              <h3 className="font-medium">{formData.title || "Judul Kelas"}</h3>
              <p className="text-sm text-muted-foreground">{formData.description || "Deskripsi kelas tidak tersedia"}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {formData.subject.charAt(0).toUpperCase() + formData.subject.slice(1).replace("-", " ") || "Mata Pelajaran"}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formData.date || "Tanggal belum ditentukan"}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formData.startTime ? `${formData.startTime} - ${formData.endTime || "selesai"}` : "Waktu belum ditentukan"}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Maks. {formData.maxParticipants} peserta
                </Badge>
              </div>
            </div>
            
            <div className="text-sm">
              <div className="font-medium">Materi: {formMaterials.length} item</div>
              <div className="font-medium mt-1">Pertanyaan Refleksi: {formQuestions.length} item</div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>Batal</Button>
            <Button onClick={handleSubmit}>Buat Kelas</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
