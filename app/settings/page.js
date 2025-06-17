"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ThemeToggle } from "@/components/theme-toggle"
import { Bell, Shield, Settings } from "lucide-react"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [detectionThreshold, setDetectionThreshold] = useState([75])

  const [settings, setSettings] = useState({
    emotionAlerts: true,
    classReminders: true,
    reflectionReminders: true,
    weeklyReports: true,
    extremeEmotions: true,
  })

  return (
    <main className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Pengaturan</h1>
          <p className="text-muted-foreground">Kelola preferensi dan pengaturan aplikasi Anda</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pengaturan Umum */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Pengaturan Umum
            </CardTitle>
            <CardDescription>Kustomisasi pengalaman aplikasi Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Gunakan tema gelap</p>
              </div>
              <ThemeToggle />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Notifikasi</Label>
                <p className="text-sm text-muted-foreground">Terima notifikasi aplikasi</p>
              </div>
              <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="detection-threshold">Ambang Deteksi Emosi ({detectionThreshold[0]}%)</Label>
              <Slider
                id="detection-threshold"
                min={50}
                max={95}
                step={5}
                value={detectionThreshold}
                onValueChange={setDetectionThreshold}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Tingkat kepercayaan minimum untuk deteksi emosi selama kelas virtual
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pengaturan Notifikasi */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Pengaturan Notifikasi
            </CardTitle>
            <CardDescription>Kelola preferensi notifikasi Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Reminder Kelas Virtual</Label>
                <p className="text-sm text-muted-foreground">Ingatkan sebelum kelas dimulai</p>
              </div>
              <Switch
                checked={settings.classReminders}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, classReminders: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Reminder Refleksi</Label>
                <p className="text-sm text-muted-foreground">Ingatkan untuk membuat refleksi setelah kelas</p>
              </div>
              <Switch
                checked={settings.reflectionReminders}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, reflectionReminders: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Laporan Mingguan</Label>
                <p className="text-sm text-muted-foreground">Terima ringkasan emosi mingguan</p>
              </div>
              <Switch
                checked={settings.weeklyReports}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, weeklyReports: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Deteksi Emosi Ekstrem</Label>
                <p className="text-sm text-muted-foreground">Notifikasi saat emosi negatif terdeteksi</p>
              </div>
              <Switch
                checked={settings.extremeEmotions}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, extremeEmotions: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Alert Emosi Real-time</Label>
                <p className="text-sm text-muted-foreground">Peringatan langsung saat deteksi emosi di kelas</p>
              </div>
              <Switch
                checked={settings.emotionAlerts}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, emotionAlerts: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Informasi Akun */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Informasi Akun
            </CardTitle>
            <CardDescription>Detail akun dan statistik penggunaan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-muted-foreground">Kelas Diikuti</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Refleksi Dibuat</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold">7</p>
                <p className="text-sm text-muted-foreground">Hari Aktif</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privasi & Keamanan */}
        <Card>
          <CardHeader>
            <CardTitle>Privasi & Keamanan</CardTitle>
            <CardDescription>Pengaturan privasi dan keamanan data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Simpan Data Emosi</Label>
                <p className="text-sm text-muted-foreground">Izinkan penyimpanan data emosi untuk analisis</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Bagikan Data dengan Fasilitator</Label>
                <p className="text-sm text-muted-foreground">Fasilitator dapat melihat data emosi Anda</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Data Anonim untuk Penelitian</Label>
                <p className="text-sm text-muted-foreground">Kontribusi data anonim untuk penelitian</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
