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
  const classEmotionData = [
    { class: "Matematika", senang: 80, sedih: 10, marah: 5, netral: 25, takut: 5, date: "12 Jun" },
    { class: "B. Inggris", senang: 60, sedih: 25, marah: 8, netral: 30, takut: 15, date: "11 Jun" },
    { class: "IPA", senang: 85, sedih: 8, marah: 3, netral: 35, takut: 2, date: "10 Jun" },
    { class: "IPS", senang: 70, sedih: 15, marah: 10, netral: 28, takut: 8, date: "09 Jun" },
    { class: "Seni", senang: 90, sedih: 5, marah: 2, netral: 40, takut: 1, date: "08 Jun" },
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
    <main className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Grafik Emosi Pribadi</h1>
          <p className="text-muted-foreground">Visualisasi emosi Anda selama mengikuti kelas virtual</p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 Hari Terakhir</SelectItem>
              <SelectItem value="30days">30 Hari Terakhir</SelectItem>
              <SelectItem value="3months">3 Bulan Terakhir</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportDetections}>
            <Download className="mr-2 h-4 w-4" />
            Export Deteksi
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Emosi Dominan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">Senang</div>
              <EmotionIndicator emotion="joy" size="sm" />
            </div>
            <p className="text-xs text-muted-foreground">45% dari kelas virtual</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Kelas Diikuti</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">5</div>
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Dari 8 kelas terjadwal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tren Positif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-green-500">+12%</div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground">Peningkatan emosi positif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Kelas Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">5</div>
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground">Dari 7 hari terakhir</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Tren Emosi per Kelas */}
        <Card>
          <CardHeader>
            <CardTitle>Emosi per Kelas Virtual</CardTitle>
            <CardDescription>Perkembangan emosi selama mengikuti berbagai kelas</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart data={classEmotionData} />
          </CardContent>
        </Card>

        {/* Distribusi Emosi Keseluruhan */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Emosi Keseluruhan</CardTitle>
            <CardDescription>Persentase emosi dari semua kelas virtual</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart data={emotionDistribution} />
            <div className="mt-4 space-y-2">
              {emotionDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Deteksi Emosi per Kelas */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Deteksi Emosi per Kelas</CardTitle>
          <CardDescription>Riwayat deteksi emosi selama mengikuti kelas virtual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {detectionData.map((detection) => (
              <div
                key={detection.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <EmotionIndicator emotion={detection.emotion} size="md" />
                  <div>
                    <p className="font-medium">{detection.className}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{detection.date}</span>
                      <span>•</span>
                      <span>{detection.time}</span>
                      <span>•</span>
                      <span>{detection.duration}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">Confidence: {detection.confidence}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Rata-rata:</span>
                    <EmotionIndicator emotion={detection.avgEmotion} size="xs" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insight & Rekomendasi */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Insight & Rekomendasi</CardTitle>
          <CardDescription>Analisis dan saran berdasarkan pola emosi Anda selama kelas virtual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">✅ Pola Positif</h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Emosi senang Anda meningkat 12% minggu ini, terutama saat kelas Matematika dan Seni. Pertahankan
                momentum ini!
              </p>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">⚠️ Perhatian</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Terdeteksi emosi sedih pada kelas Bahasa Inggris. Mungkin ada materi yang perlu didiskusikan lebih
                lanjut dengan fasilitator.
              </p>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">💡 Rekomendasi</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Cobalah teknik relaksasi sebelum kelas yang menantang. Refleksi setelah kelas juga membantu memproses
                emosi dengan lebih baik.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
