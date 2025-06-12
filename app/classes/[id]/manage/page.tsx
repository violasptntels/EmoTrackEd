"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EmotionIndicator } from "@/components/emotion-indicator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Users, Video, FileText, MessageSquare, Clock, Calendar, BarChart3, UserPlus, Mail, Send } from "lucide-react"

export default function ManageClassPage() {
  const params = useParams()
  const [user, setUser] = useState({ name: "Guest", role: "Fasilitator" })
  const [activeStudents, setActiveStudents] = useState([])
  const [message, setMessage] = useState("")

  useEffect(() => {
    const userData = localStorage.getItem("userData")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    }
  }, [])

  // Data kelas (simulasi)
  const classData = {
    id: params.id,
    title: "Matematika Dasar - Aljabar Linear",
    instructor: "Dr. Sarah Johnson",
    description: "Pembelajaran konsep dasar aljabar linear dengan pendekatan emosional",
    schedule: "Senin, Rabu, Jumat 09:00-10:30",
    participants: 28,
    maxParticipants: 30,
    status: "live",
    startTime: "09:00",
    endTime: "10:30",
  }

  // Data siswa yang sedang aktif di kelas
  const students = [
    {
      id: 1,
      name: "Alice Johnson",
      emotion: "joy",
      isOnline: true,
      avatar: "/placeholder.svg",
      joinTime: "08:55",
      emotionHistory: [
        { time: "09:00", emotion: "neutral" },
        { time: "09:15", emotion: "joy" },
        { time: "09:30", emotion: "joy" },
      ],
    },
    {
      id: 2,
      name: "Bob Smith",
      emotion: "neutral",
      isOnline: true,
      avatar: "/placeholder.svg",
      joinTime: "08:58",
      emotionHistory: [
        { time: "09:00", emotion: "neutral" },
        { time: "09:15", emotion: "sadness" },
        { time: "09:30", emotion: "neutral" },
      ],
    },
    {
      id: 3,
      name: "Carol Davis",
      emotion: "sadness",
      isOnline: true,
      avatar: "/placeholder.svg",
      joinTime: "09:02",
      emotionHistory: [
        { time: "09:05", emotion: "fear" },
        { time: "09:15", emotion: "sadness" },
        { time: "09:30", emotion: "sadness" },
      ],
    },
    {
      id: 4,
      name: "David Wilson",
      emotion: "fear",
      isOnline: false,
      avatar: "/placeholder.svg",
      joinTime: "09:10",
      emotionHistory: [
        { time: "09:10", emotion: "neutral" },
        { time: "09:15", emotion: "fear" },
        { time: "09:30", emotion: "fear" },
      ],
    },
  ]

  const handleSendMessage = () => {
    if (message.trim()) {
      alert(`Pesan "${message}" telah dikirim ke semua siswa`)
      setMessage("")
    }
  }

  return (
    <main className="p-4 md:p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{classData.title}</h1>
            <p className="text-muted-foreground">Kelola kelas virtual</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={classData.status === "live" ? "default" : "secondary"}>
              {classData.status === "live" ? "🔴 LIVE" : "Offline"}
            </Badge>
            <Badge variant="outline">
              <Clock className="h-3 w-3 mr-1" />
              {classData.startTime} - {classData.endTime}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="students" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="students">Siswa Aktif</TabsTrigger>
              <TabsTrigger value="emotions">Monitor Emosi</TabsTrigger>
              <TabsTrigger value="broadcast">Pesan Broadcast</TabsTrigger>
            </TabsList>

            <TabsContent value="students" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Siswa yang Hadir ({students.filter((s) => s.isOnline).length}/{students.length})
                  </CardTitle>
                  <CardDescription>Daftar siswa yang sedang mengikuti kelas virtual</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {students.map((student) => (
                      <div
                        key={student.id}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          student.isOnline
                            ? "border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-900/30"
                            : "border-gray-200 bg-gray-50 dark:bg-gray-800/10 dark:border-gray-800/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={student.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{student.name}</p>
                              <div
                                className={`w-2 h-2 rounded-full ${student.isOnline ? "bg-green-500" : "bg-gray-400"}`}
                              />
                              <span className="text-xs text-muted-foreground">
                                {student.isOnline ? "Online" : "Offline"}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">Bergabung: {student.joinTime}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <EmotionIndicator emotion={student.emotion} size="md" showLabel />
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Chat
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="emotions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Grafik Emosi Real-time</CardTitle>
                  <CardDescription>Pantau perubahan emosi siswa selama pembelajaran berlangsung</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {students.map((student) => (
                      <div key={student.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={student.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-2 h-2 rounded-full ${student.isOnline ? "bg-green-500" : "bg-gray-400"}`}
                                />
                                <span className="text-xs text-muted-foreground">
                                  {student.isOnline ? "Online" : "Offline"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <EmotionIndicator emotion={student.emotion} size="md" showLabel />
                        </div>

                        <div className="flex items-center justify-between mt-4 border-t pt-4">
                          <div className="text-sm text-muted-foreground">Riwayat Emosi:</div>
                          <div className="flex items-center gap-2">
                            {student.emotionHistory.map((item, index) => (
                              <div key={index} className="flex flex-col items-center">
                                <EmotionIndicator emotion={item.emotion} size="sm" />
                                <span className="text-xs text-muted-foreground mt-1">{item.time}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="broadcast" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Kirim Pesan ke Semua Siswa
                  </CardTitle>
                  <CardDescription>Kirim pengumuman atau instruksi ke semua siswa yang sedang aktif</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="broadcast-message">Pesan</Label>
                      <Textarea
                        id="broadcast-message"
                        placeholder="Ketik pesan untuk semua siswa..."
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleSendMessage} disabled={!message.trim()}>
                      <Send className="h-4 w-4 mr-2" />
                      Kirim ke Semua Siswa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Class Info */}
          <Card>
            <CardHeader>
              <CardTitle>Info Kelas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {students.filter((s) => s.isOnline).length}/{students.length} siswa aktif
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{classData.schedule}</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Kelas sedang berlangsung</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <Video className="mr-2 h-4 w-4" />
                Mulai Presentasi
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Bagikan Materi
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="mr-2 h-4 w-4" />
                Lihat Statistik
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <UserPlus className="mr-2 h-4 w-4" />
                Undang Siswa
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
