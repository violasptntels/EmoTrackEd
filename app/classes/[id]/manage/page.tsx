"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EmotionIndicator } from "@/components/emotion-indicator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, Video, VideoOff, Mic, MicOff, FileText, MessageSquare, Clock, Calendar, BarChart3, UserPlus, Mail, Send, Plus, BookOpen, AlertCircle } from "lucide-react"

export default function ManageClassPage() {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState({ name: "Guest", role: "Fasilitator" })
  const [activeStudents, setActiveStudents] = useState([])
  const [message, setMessage] = useState("")
  const [classData, setClassData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showVideoCall, setShowVideoCall] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(false)
  const [isAudioOn, setIsAudioOn] = useState(false)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const userData = localStorage.getItem("userData")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    }
    
    // Ambil data kelas dari localStorage
    const fetchClassData = () => {
      const savedClasses = localStorage.getItem("virtualClasses")
      if (savedClasses) {
        try {
          const parsedClasses = JSON.parse(savedClasses)
          const classFound = parsedClasses.find(
            (cls: any) => cls.id?.toString() === (params.id?.toString() ?? "")
          )
          if (classFound) {
            setClassData(classFound)
          } else {
            // Jika kelas tidak ditemukan, redirect ke halaman kelas
            alert("Kelas tidak ditemukan")
            router.push("/classes")
          }
        } catch (error) {
          console.error("Error parsing class data:", error)
          // Gunakan dummy data jika terjadi error
          setClassData(defaultClassData)
        }
      } else {
        // Gunakan dummy data jika tidak ada data di localStorage
        setClassData(defaultClassData)
      }
      setLoading(false)
    }
    
    fetchClassData()
  }, [params.id, router])

  // Data kelas default (simulasi)
  const defaultClassData = {
    id: params?.id || "1",
    title: "Matematika Dasar - Aljabar Linear",
    instructor: "Dr. Sarah Johnson",
    description: "Pembelajaran konsep dasar aljabar linear dengan pendekatan emosional",
    schedule: "Senin, Rabu, Jumat 09:00-10:30",
    participants: 28,
    maxParticipants: 30,
    status: "live",
    startTime: "09:00",
    endTime: "10:30",
    materials: [],
    assignments: []
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

  const handleStartVideoCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsVideoOn(true);
      setIsAudioOn(true);
      setShowVideoCall(true);
    } catch (error) {
      console.error("Error accessing camera and microphone:", error);
      alert("Tidak dapat mengakses kamera dan mikrofon. Pastikan Anda memberikan izin.");
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      if (videoTracks.length > 0) {
        const track = videoTracks[0];
        track.enabled = !track.enabled;
        setIsVideoOn(track.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      if (audioTracks.length > 0) {
        const track = audioTracks[0];
        track.enabled = !track.enabled;
        setIsAudioOn(track.enabled);
      }
    }
  };

  const stopVideoCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    setShowVideoCall(false);
  };

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <main className="p-4 md:p-6">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p>Memuat data kelas...</p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">{classData?.title || "Kelas"}</h1>
                <p className="text-muted-foreground">Kelola kelas virtual</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={classData?.status === "live" ? "default" : "secondary"}>
                  {classData?.status === "live" ? "🔴 LIVE" : "Offline"}
                </Badge>
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  {classData?.startTime} - {classData?.endTime}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>
                  Materi pembelajaran dan tugas hanya dapat ditambahkan saat pembuatan kelas baru. Hal ini untuk memastikan semua peserta kelas memiliki akses ke materi dan tugas yang sama sejak awal.
                </AlertDescription>
              </Alert>

              <Tabs defaultValue="students" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="students">Siswa</TabsTrigger>
                  <TabsTrigger value="emotions">Emosi</TabsTrigger>
                  <TabsTrigger value="chat">Pesan Broadcast</TabsTrigger>
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
                              {/* No individual chat buttons */}
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

                <TabsContent value="chat" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Pesan Broadcast</CardTitle>
                      <CardDescription>Kirim pesan ke semua siswa yang hadir dalam kelas saat kelas virtual dimulai</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {showVideoCall ? (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-sm font-medium mb-2">Daftar Siswa ({students.filter(s => s.isOnline).length} online)</h3>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {students.map((student) => (
                                <Badge key={student.id} variant={student.isOnline ? "default" : "outline"} className="flex items-center gap-1">
                                  <div className={`w-2 h-2 rounded-full ${student.isOnline ? "bg-white" : "bg-gray-400"}`} />
                                  {student.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <Label htmlFor="broadcast-message">Pesan Broadcast</Label>
                            <Textarea 
                              id="broadcast-message"
                              placeholder="Ketik pesan untuk dikirim ke semua siswa..."
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              className="min-h-[120px]"
                            />
                            <Button onClick={handleSendMessage} disabled={!message.trim()} className="w-full sm:w-auto">
                              <Send className="h-4 w-4 mr-2" />
                              Kirim ke Semua Siswa
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <Video className="h-10 w-10 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium">Kelas Virtual Belum Dimulai</h3>
                          <p className="text-muted-foreground max-w-md mt-2">
                            Fitur pesan broadcast hanya tersedia ketika kelas virtual sedang berlangsung. Silakan mulai kelas virtual terlebih dahulu dengan menekan tombol "Mulai Kelas Virtual".
                          </p>
                          <Button onClick={handleStartVideoCall} className="mt-6">
                            <Video className="h-4 w-4 mr-2" />
                            Mulai Kelas Virtual
                          </Button>
                        </div>
                      )}
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
                  <Button 
                    className="w-full justify-start" 
                    onClick={handleStartVideoCall}
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Mulai Kelas Virtual
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => alert("Materi pembelajaran telah dibagikan kepada semua siswa")}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Bagikan Materi
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => alert("Statistik kelas sedang dimuat...")}
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Lihat Statistik
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => alert("Link undangan telah disalin ke clipboard")}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Undang Siswa
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}

      {/* Video Call Interface */}
      {showVideoCall && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col z-50 p-4">
          <div className="flex justify-between items-center mb-4 text-white">
            <h2 className="text-xl font-bold">Kelas Virtual: {classData?.title}</h2>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-600 text-white border-green-500">
                <div className="w-2 h-2 rounded-full bg-white mr-1 animate-pulse" />
                Sedang Berlangsung
              </Badge>
              <Button variant="ghost" size="sm" onClick={stopVideoCall} className="text-white hover:bg-red-700">
                Tutup
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4 h-full">
            {/* Video area - 3/4 width */}
            <div className="col-span-3 overflow-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Fasilitator's Video */}
                <div className="relative bg-gray-800 rounded-lg aspect-video">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover rounded-lg" />
                  <div className="absolute bottom-2 left-2 flex items-center bg-black bg-opacity-70 px-2 py-1 rounded-md">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                    <span className="text-white text-sm">Anda (Fasilitator)</span>
                  </div>
                  <div className="absolute bottom-2 right-2 flex gap-2">
                    <Button 
                      size="icon" 
                      variant={isAudioOn ? "ghost" : "destructive"} 
                      onClick={toggleAudio} 
                      className="h-8 w-8 rounded-full bg-black bg-opacity-70"
                    >
                      {isAudioOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                    </Button>
                    <Button 
                      size="icon" 
                      variant={isVideoOn ? "ghost" : "destructive"} 
                      onClick={toggleVideo} 
                      className="h-8 w-8 rounded-full bg-black bg-opacity-70"
                    >
                      {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Students' Videos (Simulated) */}
                {students.map((student) => (
                  <div key={student.id} className="relative bg-gray-800 rounded-lg aspect-video overflow-hidden">
                    {student.isOnline ? (
                      <>
                        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                          {/* Placeholder for student video - in a real app this would be a video stream */}
                          <Avatar className="h-20 w-20">
                            <AvatarImage src={student.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="absolute bottom-2 left-2 flex items-center bg-black bg-opacity-70 px-2 py-1 rounded-md">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                          <span className="text-white text-sm">{student.name}</span>
                        </div>
                        <div className="absolute top-2 right-2">
                          <EmotionIndicator emotion={student.emotion} size="sm" showLabel={false} />
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center">
                        <Avatar className="h-16 w-16 mb-2 opacity-50">
                          <AvatarImage src={student.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <p className="text-gray-400 text-center text-sm">{student.name}</p>
                        <p className="text-gray-500 text-xs">Offline</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Broadcast Chat area - 1/4 width */}
            <div className="col-span-1 bg-gray-800 bg-opacity-60 rounded-lg p-4 flex flex-col h-full">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white text-lg font-medium">Pesan Broadcast</h3>
                <Badge variant="outline" className="text-white border-white/20">
                  {students.filter(s => s.isOnline).length} online
                </Badge>
              </div>
              
              <div className="flex-grow bg-black bg-opacity-30 rounded-lg p-3 mb-4 overflow-y-auto">
                <p className="text-gray-400 text-center text-sm py-4">
                  Pesan akan muncul di sini
                </p>
              </div>
              
              <div className="flex gap-2">
                <Textarea 
                  placeholder="Kirim pesan ke semua siswa..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-black bg-opacity-30 text-white border-gray-700 focus:border-gray-500 min-h-[80px] resize-none"
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!message.trim()} 
                  className="self-end"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Control Bar */}
          <div className="flex justify-center items-center gap-4 mt-4">
            <Button 
              variant={isAudioOn ? "outline" : "destructive"}
              onClick={toggleAudio} 
              className="rounded-full px-4 bg-black bg-opacity-50 text-white border-white/20"
            >
              {isAudioOn ? <Mic className="h-4 w-4 mr-2" /> : <MicOff className="h-4 w-4 mr-2" />}
              {isAudioOn ? "Mikrofon Aktif" : "Mikrofon Nonaktif"}
            </Button>
            <Button 
              variant={isVideoOn ? "outline" : "destructive"}
              onClick={toggleVideo} 
              className="rounded-full px-4 bg-black bg-opacity-50 text-white border-white/20"
            >
              {isVideoOn ? <Video className="h-4 w-4 mr-2" /> : <VideoOff className="h-4 w-4 mr-2" />}
              {isVideoOn ? "Kamera Aktif" : "Kamera Nonaktif"}
            </Button>
            <Button 
              variant="destructive" 
              onClick={stopVideoCall} 
              className="rounded-full px-4"
            >
              Akhiri Kelas Virtual
            </Button>
          </div>
        </div>
      )}
    </main>
  )
}
