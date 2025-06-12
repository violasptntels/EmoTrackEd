"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Settings, Database, Shield, Bell, Server, Save } from "lucide-react"

export default function SystemSettingsPage() {
  const [autoBackup, setAutoBackup] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [debugMode, setDebugMode] = useState(false)

  return (
    <main className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Pengaturan Sistem</h1>
          <p className="text-muted-foreground">Konfigurasi dan pengaturan sistem EmoTrackEd</p>
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Simpan Pengaturan
        </Button>
      </div>

      {/* System Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Status Sistem
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="text-2xl font-bold text-green-600">99.9%</div>
              <p className="text-sm text-green-700 dark:text-green-400">Uptime</p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">45ms</div>
              <p className="text-sm text-blue-700 dark:text-blue-400">Response Time</p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">2.1GB</div>
              <p className="text-sm text-purple-700 dark:text-purple-400">Database Size</p>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">156</div>
              <p className="text-sm text-orange-700 dark:text-orange-400">Active Users</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Pengaturan Umum
            </CardTitle>
            <CardDescription>Konfigurasi dasar sistem</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mode Maintenance</Label>
                <p className="text-sm text-muted-foreground">Aktifkan untuk pemeliharaan sistem</p>
              </div>
              <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mode Debug</Label>
                <p className="text-sm text-muted-foreground">Tampilkan log detail untuk debugging</p>
              </div>
              <Switch checked={debugMode} onCheckedChange={setDebugMode} />
            </div>

            <div className="space-y-2">
              <Label>Batas Maksimal Pengguna</Label>
              <Input type="number" defaultValue="500" />
              <p className="text-sm text-muted-foreground">Jumlah maksimal pengguna yang dapat terdaftar</p>
            </div>

            <div className="space-y-2">
              <Label>Timeout Sesi (menit)</Label>
              <Select defaultValue="30">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 menit</SelectItem>
                  <SelectItem value="30">30 menit</SelectItem>
                  <SelectItem value="60">1 jam</SelectItem>
                  <SelectItem value="120">2 jam</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Database Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Pengaturan Database
            </CardTitle>
            <CardDescription>Konfigurasi backup dan database</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto Backup</Label>
                <p className="text-sm text-muted-foreground">Backup otomatis database</p>
              </div>
              <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
            </div>

            <div className="space-y-2">
              <Label>Interval Backup</Label>
              <Select defaultValue="daily">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Setiap Jam</SelectItem>
                  <SelectItem value="daily">Harian</SelectItem>
                  <SelectItem value="weekly">Mingguan</SelectItem>
                  <SelectItem value="monthly">Bulanan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Retensi Backup (hari)</Label>
              <Input type="number" defaultValue="30" />
              <p className="text-sm text-muted-foreground">Berapa lama backup disimpan</p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                Backup Sekarang
              </Button>
              <Button variant="outline" className="flex-1">
                Restore Database
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Pengaturan Keamanan
            </CardTitle>
            <CardDescription>Konfigurasi keamanan sistem</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Minimum Panjang Password</Label>
              <Input type="number" defaultValue="8" />
            </div>

            <div className="space-y-2">
              <Label>Maksimal Percobaan Login</Label>
              <Input type="number" defaultValue="5" />
              <p className="text-sm text-muted-foreground">Sebelum akun dikunci sementara</p>
            </div>

            <div className="space-y-2">
              <Label>Durasi Lockout (menit)</Label>
              <Input type="number" defaultValue="15" />
            </div>

            <div className="space-y-2">
              <Label>Enkripsi Data</Label>
              <div className="flex items-center gap-2">
                <Badge variant="default">AES-256</Badge>
                <span className="text-sm text-muted-foreground">Aktif</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Pengaturan Notifikasi
            </CardTitle>
            <CardDescription>Konfigurasi notifikasi sistem</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Kirim notifikasi via email</p>
              </div>
              <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            </div>

            <div className="space-y-2">
              <Label>SMTP Server</Label>
              <Input defaultValue="smtp.gmail.com" />
            </div>

            <div className="space-y-2">
              <Label>SMTP Port</Label>
              <Input type="number" defaultValue="587" />
            </div>

            <div className="space-y-2">
              <Label>Email Admin</Label>
              <Input type="email" defaultValue="admin@emotracked.com" />
            </div>

            <Button variant="outline" className="w-full">
              Test Email Connection
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
