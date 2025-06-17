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

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })))
  }

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const getNotificationIcon = (type) => {
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

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case "high":
        return "border-l-4 border-orange-500"
      case "medium":
        return "border-l-4 border-blue-500"
      case "low":
        return "border-l-4 border-green-500"
      default:
        return ""
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="container p-6 mx-auto max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifikasi</h1>
          <p className="text-muted-foreground">
            {unreadCount} notifikasi belum dibaca
          </p>
        </div>
        <Button
          variant="outline"
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Tandai Semua Dibaca
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Semua Notifikasi</CardTitle>
          <CardDescription>
            Pemberitahuan tentang emosi, kelas, dan pencapaian Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 bg-card rounded-lg shadow-sm relative transition-all 
                    ${getPriorityStyles(notification.priority)} 
                    ${notification.isRead ? "opacity-75" : ""}
                  `}
                >
                  <div className="flex">
                    <div className="mr-4 mt-1">
                      {notification.type === "emotion_alert" ? (
                        <EmotionIndicator emotion={notification.emotion} size="md" />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium text-base mb-1 flex items-center">
                          {notification.title}
                          {!notification.isRead && (
                            <Badge className="ml-2" variant="default">
                              Baru
                            </Badge>
                          )}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {notification.timestamp}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteNotification(notification.id)}
                            className="h-6 w-6"
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Hapus</span>
                          </Button>
                        </div>
                      </div>

                      <p className="text-sm mb-2">{notification.message}</p>

                      {notification.className && (
                        <div className="flex items-center mt-2">
                          <Badge variant="outline" className="text-xs">
                            {notification.className}
                          </Badge>
                        </div>
                      )}

                      {!notification.isRead && (
                        <div className="mt-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsRead(notification.id)}
                            className="h-8 px-2 text-xs"
                          >
                            <CheckCircle className="mr-2 h-3 w-3" />
                            Tandai Dibaca
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                  <Bell className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-lg mb-2">Tidak Ada Notifikasi</h3>
                <p className="text-muted-foreground">
                  Anda telah membersihkan semua notifikasi Anda.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
