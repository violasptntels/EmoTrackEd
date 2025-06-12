"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EmotionIndicator } from "@/components/emotion-indicator"
import { Bell, AlertTriangle, Heart, Clock, CheckCircle, X } from "lucide-react"

export default function NotificationsPage() {
  const [user, setUser] = useState({ name: "Guest", role: "Siswa" })
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "emotion_alert",
      title: "Emosi Stress Terdeteksi",
      message: "Kami mendeteksi Anda mengalami stress tinggi selama kelas Matematika Dasar. Mau istirahat sebentar?",
      emotion: "fear",
      timestamp: "5 menit lalu",
      isRead: false,
      priority: "high",
      className: "Matematika Dasar",
    },
    {
      id: 2,
      type: "achievement",
      title: "Streak 7 Hari!",
      message: "Selamat! Anda telah konsisten menjaga keseimbangan emosi selama 7 hari berturut-turut.",
      emotion: "joy",
      timestamp: "2 jam lalu",
      isRead: false,
      priority: "medium",
      className: null,
    },
    {
      id: 3,
      type: "reminder",
      title: "Reminder Refleksi",
      message: "Jangan lupa untuk mengisi refleksi pembelajaran setelah kelas Bahasa Inggris hari ini.",
      emotion: "neutral",
      timestamp: "4 jam lalu",
      isRead: true,
      priority: "low",
      className: "Bahasa Inggris",
    },
    {
      id: 4,
      type: "emotion_alert",
      title: "Emosi Sedih Berkepanjangan",
      message: "Kami perhatikan Anda merasa sedih cukup lama selama kelas Ilmu Alam. Apakah ada yang bisa kami bantu?",
      emotion: "sadness",
      timestamp: "1 hari lalu",
      isRead: true,
      priority: "high",
      className: "Ilmu Alam",
    },
    {
      id: 5,
      type: "class_reminder",
      title: "Kelas Virtual Dimulai",
      message: "Kelas Matematika Dasar akan dimulai dalam 15 menit. Bersiaplah untuk bergabung!",
      emotion: "neutral",
      timestamp: "15 menit lalu",
      isRead: false,
      priority: "medium",
      className: "Matematika Dasar",
    },
  ])

  useEffect(() => {
    const userData = localStorage.getItem("userData")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    }
  }, [])

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })))
  }

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "emotion_alert":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case "achievement":
        return <Heart className="h-5 w-5 text-green-500" />
      case "reminder":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "class_reminder":
        return <Bell className="h-5 w-5 text-purple-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
      case "medium":
        return "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950"
      case "low":
        return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950"
      default:
        return "border-border bg-background"
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <main className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Bell className="h-8 w-8" />
            Notifikasi
          </h1>
          <p className="text-muted-foreground">Pemberitahuan terkait kelas virtual dan kondisi emosi Anda</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          {unreadCount > 0 && (
            <Badge variant="destructive" className="mr-2">
              {unreadCount} belum dibaca
            </Badge>
          )}
          <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Tandai Semua Dibaca
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notifikasi Terbaru</CardTitle>
          <CardDescription>Peringatan dan pemberitahuan terkait pembelajaran dan kondisi emosi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Belum ada notifikasi</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-all ${
                    !notification.isRead ? getPriorityColor(notification.priority) : "border-border bg-muted/30"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-medium ${!notification.isRead ? "font-semibold" : ""}`}>
                            {notification.title}
                          </h4>
                          {!notification.isRead && <div className="w-2 h-2 bg-primary rounded-full" />}
                          <EmotionIndicator emotion={notification.emotion} size="xs" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {notification.priority === "high"
                              ? "Prioritas Tinggi"
                              : notification.priority === "medium"
                                ? "Prioritas Sedang"
                                : "Prioritas Rendah"}
                          </Badge>
                          {notification.className && (
                            <Badge variant="secondary" className="text-xs">
                              {notification.className}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {!notification.isRead && (
                        <Button size="sm" variant="ghost" onClick={() => markAsRead(notification.id)}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => deleteNotification(notification.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
