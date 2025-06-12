"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LineChart, BarChart, DonutChart } from "@/components/charts"
import { Download, TrendingUp, Users, Activity, AlertTriangle } from "lucide-react"

export default function SystemReportsPage() {
  const emotionTrendData = [
    { day: "Sen", senang: 65, sedih: 20, marah: 10, netral: 25 },
    { day: "Sel", senang: 70, sedih: 15, marah: 8, netral: 30 },
    { day: "Rab", senang: 55, sedih: 25, marah: 15, netral: 20 },
    { day: "Kam", senang: 80, sedih: 10, marah: 5, netral: 35 },
    { day: "Jum", senang: 75, sedih: 18, marah: 12, netral: 28 },
    { day: "Sab", senang: 85, sedih: 8, marah: 3, netral: 40 },
    { day: "Min", senang: 90, sedih: 5, marah: 2, netral: 45 },
  ]

  const userActivityData = [
    { name: "Login", value: 1250 },
    { name: "Refleksi", value: 890 },
    { name: "Deteksi", value: 1100 },
    { name: "Export", value: 340 },
  ]

  const emotionDistribution = [
    { name: "Senang", value: 45, color: "hsl(var(--joy))" },
    { name: "Netral", value: 25, color: "hsl(var(--neutral))" },
    { name: "Sedih", value: 15, color: "hsl(var(--sadness))" },
    { name: "Marah", value: 10, color: "hsl(var(--anger))" },
    { name: "Takut", value: 5, color: "hsl(var(--fear))" },
  ]

  return (
    <main className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Laporan Sistem</h1>
          <p className="text-muted-foreground">Analisis dan statistik penggunaan sistem</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Laporan
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Aktivitas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">3,580</div>
              <div className="flex items-center text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm">+12%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Minggu ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pengguna Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">156</div>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">89 online sekarang</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rata-rata Sesi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">24m</div>
              <Activity className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Per pengguna</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Masalah Terdeteksi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-orange-500">7</div>
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Perlu perhatian</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Emotion Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Tren Emosi Mingguan</CardTitle>
            <CardDescription>Distribusi emosi pengguna selama 7 hari terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart data={emotionTrendData} />
          </CardContent>
        </Card>

        {/* User Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Pengguna</CardTitle>
            <CardDescription>Jenis aktivitas yang paling sering dilakukan</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart data={userActivityData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Emotion Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Emosi</CardTitle>
            <CardDescription>Persentase emosi keseluruhan</CardDescription>
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

        {/* Recent Issues */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Masalah Terbaru</CardTitle>
            <CardDescription>Isu yang perlu perhatian administrator</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "Emosi Negatif Tinggi - Alice Johnson",
                  description: "Siswa menunjukkan pola emosi sedih berulang",
                  severity: "high",
                  time: "2 jam lalu",
                },
                {
                  title: "Server Response Lambat",
                  description: "Waktu respons API melebihi threshold normal",
                  severity: "medium",
                  time: "4 jam lalu",
                },
                {
                  title: "Login Gagal Berulang - Bob Wilson",
                  description: "Pengguna mengalami kesulitan akses sistem",
                  severity: "low",
                  time: "1 hari lalu",
                },
              ].map((issue, index) => (
                <div key={index} className="flex items-start gap-4 p-3 border rounded-lg">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      issue.severity === "high"
                        ? "bg-red-500"
                        : issue.severity === "medium"
                          ? "bg-orange-500"
                          : "bg-yellow-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{issue.title}</p>
                    <p className="text-sm text-muted-foreground">{issue.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant={
                          issue.severity === "high"
                            ? "destructive"
                            : issue.severity === "medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {issue.severity === "high" ? "Tinggi" : issue.severity === "medium" ? "Sedang" : "Rendah"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{issue.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
