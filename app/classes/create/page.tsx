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
import { Calendar, Clock, Users, Plus, ArrowLeft, BookOpen } from "lucide-react"
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

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulasi pembuatan kelas
    try {
      console.log("Creating class:", formData)

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
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Detail Kelas
            </CardTitle>
            <CardDescription>Isi informasi lengkap untuk kelas virtual Anda</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
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

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi Kelas</Label>
                <Textarea
                  id="description"
                  placeholder="Deskripsi singkat tentang materi yang akan dipelajari..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <div className="space-y-2">
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

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={!isFormValid || isSubmitting} className="flex-1">
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
                <Button type="button" variant="outline" asChild>
                  <Link href="/classes">Batal</Link>
                </Button>
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
    </main>
  )
}
