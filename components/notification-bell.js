"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Clock, AlertTriangle, CheckCircle, Info, Shield, BookOpen, FileText, Activity } from "lucide-react"
import Link from "next/link"

export function NotificationBell() {
  const [user, setUser] = useState({ name: "", role: "Siswa" })
  const [notifications, setNotifications] = useState([])

  // Get user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("userData")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    }
  }, [])
  // Set different notifications based on user role
  useEffect(() => {
    if (user.role === "Fasilitator") {
      setNotifications([
        {
          id: 1,
          title: "Aktivitas Kelas Terbaru",
          message: "3 siswa telah mengumpulkan tugas refleksi",
          type: "info",
          time: "5 menit lalu",
          read: false,
        },
        {
          id: 2,
          title: "Backup Database Selesai",
          message: "Backup otomatis database berhasil dilakukan",
          type: "success",
          time: "30 menit lalu",
          read: false,
        },
        {
          id: 3,
          title: "Laporan Baru Tersedia",
          message: "Laporan emosi global bulanan telah siap ditinjau",
          type: "info",
          time: "2 jam lalu",
          read: true,
        },
        {
          id: 4,
          title: "Permintaan Fasilitator Baru",
          message: "2 permintaan pendaftaran fasilitator memerlukan persetujuan",
          type: "info",
          time: "1 hari lalu",
          read: true,
        },
      ])
    } else if (user.role === "Fasilitator") {
      setNotifications([
        {
          id: 1,
          title: "Emosi Negatif Terdeteksi",
          message: "3 siswa menunjukkan emosi negatif dalam kelas Matematika",
          type: "warning",
          time: "10 menit lalu",
          read: false,
        },
        {
          id: 2,
          title: "Jadwal Kelas Berubah",
          message: "Kelas Bahasa Inggris dipindahkan ke jam 14:00",
          type: "info",
          time: "1 jam lalu",
          read: false,
        },
        {
          id: 3,
          title: "Refleksi Siswa Terkumpul",
          message: "15 siswa telah mengumpulkan refleksi pembelajaran hari ini",
          type: "success",
          time: "3 jam lalu",
          read: true,
        },
        {
          id: 4,
          title: "Evaluasi Kelas",
          message: "Waktunya mengevaluasi kelas Matematika minggu ini",
          type: "info",
          time: "1 hari lalu",
          read: true,
        },
      ])
    } else {
      // Default untuk Siswa
      setNotifications([
        {
          id: 1,
          title: "Kelas Matematika Dimulai",
          message: "Kelas Matematika Dasar akan dimulai dalam 5 menit",
          type: "info",
          time: "2 menit lalu",
          read: false,
        },
        {
          id: 2,
          title: "Refleksi Tertunda",
          message: "Anda memiliki 2 refleksi yang belum diselesaikan",
          type: "warning",
          time: "1 jam lalu",
          read: false,
        },
        {
          id: 3,
          title: "Emosi Terdeteksi",
          message: "Sistem mendeteksi emosi sedih pada kelas terakhir Anda",
          type: "warning",
          time: "3 jam lalu",
          read: true,
        },
        {
          id: 4,
          title: "Tugas Berhasil Diserahkan",
          message: "Tugas Aljabar Linear berhasil diserahkan",
          type: "success",
          time: "1 hari lalu",
          read: true,
        },
      ])
    }
  }, [user.role])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  // Mendapatkan ikon yang lebih sesuai berdasarkan tipe notifikasi dan kontennya
  const getIcon = (notification) => {
    const { type, title } = notification
    
    // Ikon spesifik berdasarkan judul notifikasi untuk menambahkan konteks visual
    if (title.includes("Kelas")) {
      return <BookOpen className="h-4 w-4 text-blue-500" />
    } else if (title.includes("Refleksi")) {
      return <FileText className="h-4 w-4 text-purple-500" />
    } else if (title.includes("Backup") || title.includes("Database") || title.includes("Sistem")) {
      return <Shield className="h-4 w-4 text-green-500" />
    } else if (title.includes("Emosi")) {
      return <Activity className="h-4 w-4 text-orange-500" />
    }
    
    // Ikon default berdasarkan tipe notifikasi
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifikasi</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Notifikasi</span>
            <Badge 
              variant="outline" 
              className={`text-xs ${
                user.role === "Fasilitator" 
                  ? "bg-red-500/10 text-red-500 border-red-500/20" 
                  : user.role === "Fasilitator"
                  ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                  : "bg-primary/10 text-primary border-primary/20"
              }`}
            >
              {user.role}
            </Badge>
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-auto p-1">
              Tandai semua dibaca
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Tidak ada notifikasi</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start p-3 cursor-pointer ${
                  !notification.read ? "bg-blue-50 dark:bg-blue-950/20" : ""
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3 w-full">
                  {getIcon(notification)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium truncate">{notification.title}</p>
                      {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2" />}
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{notification.message}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{notification.time}</span>
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/notifications" className="w-full text-center">
            Lihat Semua Notifikasi
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
