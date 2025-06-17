"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, DonutChart } from "@/components/charts"
import { EmotionIndicator } from "@/components/emotion-indicator"
import { Calendar, TrendingUp, BarChart3, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AnalyticsPage() {
  const [user, setUser] = useState({ name: "Guest", role: "Siswa" })
  const [timeRange, setTimeRange] = useState("7days")

  useEffect(() => {
    const userData = localStorage.getItem("userData")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    }
  }, [])

  // Data emosi dari kelas virtual yang sudah diikuti
  // Match with student dashboard: 4 completed classes in total
  const classEmotionData = [
    { class: "Matematika Dasar", senang: 80, sedih: 10, marah: 5, netral: 25, takut: 5, date: "12 Jun" },
    { class: "Pendidikan Kewarganegaraan", senang: 60, sedih: 25, marah: 8, netral: 30, takut: 15, date: "11 Jun" },
    { class: "Ilmu Sosial Dasar", senang: 85, sedih: 8, marah: 3, netral: 35, takut: 2, date: "10 Jun" },
    { class: "Seni dan Budaya", senang: 90, sedih: 5, marah: 2, netral: 40, takut: 1, date: "09 Jun" },
  ]

  // Data distribusi emosi dari semua kelas virtual
  const emotionDistribution = [
    { name: "Senang", value: 45, color: "hsl(var(--joy))" },
    { name: "Netral", value: 25, color: "hsl(var(--neutral))" },
    { name: "Sedih", value: 15, color: "hsl(var(--sadness))" },
    { name: "Marah", value: 10, color: "hsl(var(--anger))" },
    { name: "Takut", value: 5, color: "hsl(var(--fear))" },
  ]

  // Data deteksi emosi per kelas virtual
  const detectionData = [
    {
      id: 1,
      date: "2025-06-12",
      time: "09:45",
      emotion: "joy",
      confidence: 92,
      className: "Matematika Dasar",
      duration: "90 menit",
      avgEmotion: "joy",
    },
    {
      id: 2,
      date: "2025-06-11",
      time: "14:20",
      emotion: "sadness",
      confidence: 87,
      className: "Bahasa Inggris",
      duration: "90 menit",
      avgEmotion: "neutral",
    },
    {
      id: 3,
      date: "2025-06-10",
      time: "16:50",
      emotion: "joy",
      confidence: 95,
      className: "Ilmu Alam",
      duration: "90 menit",
      avgEmotion: "joy",
    },
  ]

  const handleExportDetections = () => {
    // Export data deteksi emosi ke CSV
    const headers = ["Tanggal", "Waktu", "Kelas", "Emosi Dominan", "Confidence", "Durasi", "Rata-rata Emosi"]
    const csvData = detectionData.map((d) => [
      d.date,
      d.time,
      d.className,
      d.emotion,
      `${d.confidence}%`,
      d.duration,
      d.avgEmotion,
    ])

    const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `deteksi-emosi-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container p-6 mx-auto max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analisis Emosi</h1>
          <p className="text-muted-foreground">
            Tren dan pola emosi dari aktivitas pembelajaran Anda
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Pilih rentang waktu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 Hari Terakhir</SelectItem>
              <SelectItem value="30days">30 Hari Terakhir</SelectItem>
              <SelectItem value="90days">90 Hari Terakhir</SelectItem>
              <SelectItem value="all">Semua Waktu</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExportDetections}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Overview cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Distribusi Emosi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[150px]">
              <DonutChart 
                data={emotionDistribution.map(d => d.value)} 
                labels={emotionDistribution.map(d => d.name)}
                colors={emotionDistribution.map(d => d.color)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Emosi Dominan</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[150px]">
            <div className="text-center">
              <EmotionIndicator emotion="joy" size="xl" />
              <p className="mt-2 font-medium">Senang</p>
              <p className="text-xs text-muted-foreground">45% dari total waktu</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Keseimbangan Emosi</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center justify-center h-[120px]">
              <div className="text-center">
                <div className="text-5xl font-semibold mb-2">84%</div>
                <p className="text-sm text-muted-foreground">Indeks Keseimbangan</p>
                <div className="mt-2 bg-muted rounded-full h-2.5 w-full">
                  <div className="bg-primary h-2.5 rounded-full" style={{width: "84%"}}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and data section */}
      <div className="grid gap-6 md:grid-cols-7 mb-6">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Tren Emosi</CardTitle>
            <CardDescription>Perkembangan emosi dari waktu ke waktu</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <LineChart
              categories={["Senang", "Netral", "Sedih"]}
              data={[
                {
                  name: "Senang",
                  data: [40, 60, 32, 45, 75, 85, 65],
                },
                {
                  name: "Netral",
                  data: [35, 28, 45, 30, 15, 35, 25],
                },
                {
                  name: "Sedih",
                  data: [10, 12, 15, 18, 5, 5, 5],
                },
              ]}
              labels={["10 Jun", "11 Jun", "12 Jun", "13 Jun", "14 Jun", "15 Jun", "16 Jun"]}
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Deteksi Terbaru</CardTitle>
            <CardDescription>Emosi terdeteksi dari kelas terbaru</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {detectionData.map((detection) => (
                <div key={detection.id} className="border rounded-md p-3">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{detection.className}</h3>
                    <EmotionIndicator emotion={detection.emotion} size="sm" showLabel />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{detection.date}</span>
                    <span>•</span>
                    <span>{detection.time}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span>Confidence: {detection.confidence}%</span>
                    <span>Durasi: {detection.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emotion by class section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Emosi per Kelas</CardTitle>
          <CardDescription>
            Perbandingan distribusi emosi Anda di berbagai kelas
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Kelas</th>
                  <th className="text-center py-3 px-2">Senang</th>
                  <th className="text-center py-3 px-2">Netral</th>
                  <th className="text-center py-3 px-2">Sedih</th>
                  <th className="text-center py-3 px-2">Marah</th>
                  <th className="text-center py-3 px-2">Takut</th>
                  <th className="text-center py-3 px-2">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {classEmotionData.map((classData, idx) => (
                  <tr key={idx} className="border-b last:border-b-0">
                    <td className="py-3 px-2 font-medium">{classData.class}</td>
                    <td className="py-3 px-2 text-center">
                      <div className="flex items-center justify-center">
                        <BarChart3 className="h-3 w-3 mr-1 text-green-500" />
                        <span>{classData.senang}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <div className="flex items-center justify-center">
                        <BarChart3 className="h-3 w-3 mr-1 text-blue-500" />
                        <span>{classData.netral}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <div className="flex items-center justify-center">
                        <BarChart3 className="h-3 w-3 mr-1 text-indigo-500" />
                        <span>{classData.sedih}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <div className="flex items-center justify-center">
                        <BarChart3 className="h-3 w-3 mr-1 text-red-500" />
                        <span>{classData.marah}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <div className="flex items-center justify-center">
                        <BarChart3 className="h-3 w-3 mr-1 text-yellow-500" />
                        <span>{classData.takut}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center text-muted-foreground text-sm">
                      {classData.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Insights section */}
      <Card>
        <CardHeader>
          <CardTitle>Insight Emosi</CardTitle>
          <CardDescription>Analisis dan rekomendasi berdasarkan pola emosi Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                <h3 className="font-medium">Emosi Positif Meningkat</h3>
              </div>
              <p className="text-sm">
                Emosi positif Anda meningkat 15% dibanding minggu lalu. Teruslah menjaga pola belajar yang Anda terapkan.
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-medium">Pola Waktu Terdeteksi</h3>
              </div>
              <p className="text-sm">
                Kami melihat emosi positif Anda cenderung lebih tinggi di sesi pagi. Pertimbangkan untuk menjadwalkan kelas penting di pagi hari.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
