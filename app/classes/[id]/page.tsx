"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { EmotionIndicator } from "@/components/emotion-indicator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Users,
  MessageSquare,
  BookOpen,
  FileText,
  Send,
  Camera,
  BarChart3,
  Clock,
  Calendar,
  AlertCircle,
} from "lucide-react"
import { useParams } from "next/navigation"

export default function ClassDetailPage() {
  const params = useParams()
  const [user, setUser] = useState({ name: "Guest", role: "Siswa" })
  const [isVideoOn, setIsVideoOn] = useState(false)
  const [isAudioOn, setIsAudioOn] = useState(false)
  const [currentEmotion, setCurrentEmotion] = useState("neutral")
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const userData = localStorage.getItem("userData")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    }

    // Simulasi deteksi emosi real-time saat video aktif
    let emotionInterval: NodeJS.Timeout
    if (isVideoOn) {
      emotionInterval = setInterval(() => {
        const emotions = ["joy", "neutral", "sadness", "surprise", "fear"]
        const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)]
        setCurrentEmotion(randomEmotion)
      }, 3000)
    }

    return () => {
      if (emotionInterval) clearInterval(emotionInterval)
    }
  }, [isVideoOn])

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
    materials: [
      { id: 1, title: "Materi 1: Pengenalan Vektor", type: "pdf", url: "#" },
      { id: 2, title: "Video: Operasi Matriks", type: "video", url: "#" },
      { id: 3, title: "Quiz: Latihan Soal Vektor", type: "quiz", url: "#" },
    ],
    chatMessages: [
      {
        id: 1,
        user: "Alice Johnson",
        message: "Selamat pagi, Bu Sarah!",
        emotion: "joy",
        timestamp: "09:05",
      },
      {
        id: 2,
        user: "Bob Smith",
        message: "Materi hari ini tentang apa ya Bu?",
        emotion: "neutral",
        timestamp: "09:06",
      },
    ],
  }

  const participants = [
    { id: 1, name: "Alice Johnson", emotion: "joy", isOnline: true },
    { id: 2, name: "Bob Smith", emotion: "neutral", isOnline: true },
    { id: 3, name: "Carol Davis", emotion: "sadness", isOnline: true },
    { id: 4, name: "David Wilson", emotion: "fear", isOnline: false },
  ]

  const [chatMessages, setChatMessages] = useState(classData.chatMessages)
  const [chatMessage, setChatMessage] = useState("")

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      // Simulasi analisis emosi dari teks
      const emotion = analyzeTextEmotion(chatMessage)
      const newMessage = {
        id: chatMessages.length + 1,
        user: user.name,
        message: chatMessage,
        emotion: emotion,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      }

      // Add message to chat
      setChatMessages([...chatMessages, newMessage])
      setChatMessage("")
    }
  }

  const analyzeTextEmotion = (text: string) => {
    const lowerText = text.toLowerCase()
    if (lowerText.includes("senang") || lowerText.includes("bagus")) return "joy"
    if (lowerText.includes("sedih") || lowerText.includes("susah")) return "sadness"
    if (lowerText.includes("bingung") || lowerText.includes("sulit")) return "fear"
    return "neutral"
  }

  const startWebcam = async () => {
    setIsLoading(true)
    setError("")
    try {
      // Cek permission kamera
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Browser tidak mendukung akses kamera.")
        setIsLoading(false)
        return
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
        audio: false,
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch((e) => {
            console.error("Error playing video:", e)
            setError("Tidak dapat memutar video. Silakan coba lagi.")
          })
        }
      } else {
        setError("Element video tidak ditemukan.")
      }
      setIsVideoOn(true)
    } catch (err) {
      console.error("Error accessing webcam:", err)
      setError("Tidak dapat mengakses kamera. Pastikan kamera tidak digunakan aplikasi lain dan izin sudah diberikan.")
    } finally {
      setIsLoading(false)
    }
  }

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsVideoOn(false)
    setCurrentEmotion("neutral")
  }

  const toggleVideo = () => {
    if (isVideoOn) {
      stopWebcam()
    } else {
      startWebcam()
    }
  }

  const toggleAudio = async () => {
    if (!isAudioOn) {
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        setIsAudioOn(true)
        // Simpan audio stream untuk digunakan nanti
        console.log("Audio started:", audioStream)
      } catch (err) {
        console.error("Error accessing microphone:", err)
        setError(
          "Tidak dapat mengakses mikrofon. Pastikan mikrofon tidak digunakan aplikasi lain dan izin sudah diberikan.",
        )
      }
    } else {
      setIsAudioOn(false)
      console.log("Audio stopped")
    }
  }

  return (
    <main className="p-4 md:p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{classData.title}</h1>
            <p className="text-muted-foreground">Instruktur: {classData.instructor}</p>
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

      {error && (
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="classroom" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="classroom">Ruang Kelas</TabsTrigger>
              <TabsTrigger value="materials">Materi</TabsTrigger>
              <TabsTrigger value="emotions">Emosi Real-time</TabsTrigger>
            </TabsList>

            <TabsContent value="classroom" className="space-y-4">
              {/* Video Conference Area */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Ruang Kelas Virtual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                    {isVideoOn && stream ? (
                      <div className="relative w-full h-full">
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                          Emotion Detection: ON
                        </div>
                        <div className="absolute bottom-4 right-4">
                          <EmotionIndicator emotion={currentEmotion} size="lg" showLabel />
                        </div>
                      </div>
                    ) : (
                      <div className="text-white text-center">
                        <VideoOff className="h-12 w-12 mx-auto mb-2" />
                        <p>Kamera Mati</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Klik tombol kamera untuk mengaktifkan deteksi emosi
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex justify-center gap-4">
                    <Button
                      variant={isVideoOn ? "default" : "outline"}
                      size="sm"
                      onClick={toggleVideo}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : isVideoOn ? (
                        <Video className="h-4 w-4" />
                      ) : (
                        <VideoOff className="h-4 w-4" />
                      )}
                      <span className="ml-2">{isVideoOn ? "Matikan Kamera" : "Nyalakan Kamera"}</span>
                    </Button>
                    <Button variant={isAudioOn ? "default" : "outline"} size="sm" onClick={toggleAudio}>
                      {isAudioOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                      <span className="ml-2">{isAudioOn ? "Matikan Mic" : "Nyalakan Mic"}</span>
                    </Button>
                  </div>

                  {isVideoOn && (
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        <Camera className="h-4 w-4" />
                        <span className="text-sm font-medium">Deteksi Emosi Aktif</span>
                      </div>
                      <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                        Sistem sedang menganalisis ekspresi wajah Anda untuk membantu pembelajaran yang lebih efektif.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Chat Area */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Chat Kelas (Emotion-Aware)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 overflow-y-auto border rounded-lg p-4 mb-4 space-y-3">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className="flex items-start gap-3">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">{msg.user.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{msg.user}</span>
                            <EmotionIndicator emotion={msg.emotion} size="sm" />
                            <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                          </div>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Ketik pesan... (emosi akan dianalisis otomatis)"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} disabled={!chatMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>

                  {chatMessage && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Emosi terdeteksi:</span>
                      <EmotionIndicator emotion={analyzeTextEmotion(chatMessage)} size="sm" showLabel />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="materials" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Materi Pembelajaran
                  </CardTitle>
                  <CardDescription>Upload materi PDF/video dan soal-soal latihan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {classData.materials.map((material) => (
                      <div key={material.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded">
                            {material.type === "pdf" && <FileText className="h-4 w-4" />}
                            {material.type === "video" && <Video className="h-4 w-4" />}
                            {material.type === "quiz" && <BarChart3 className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="font-medium">{material.title}</p>
                            <p className="text-xs text-muted-foreground">{material.type.toUpperCase()}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Buka
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="emotions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Monitor Emosi Real-time</CardTitle>
                  <CardDescription>Pantau kondisi emosional siswa selama pembelajaran berlangsung</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {participants.map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{participant.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{participant.name}</p>
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-2 rounded-full ${participant.isOnline ? "bg-green-500" : "bg-gray-400"}`}
                              />
                              <span className="text-xs text-muted-foreground">
                                {participant.isOnline ? "Online" : "Offline"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <EmotionIndicator emotion={participant.emotion} size="md" showLabel />
                      </div>
                    ))}
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
                  {classData.participants}/{classData.maxParticipants} peserta
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{classData.schedule}</span>
              </div>
              <div className="flex items-center gap-2">
                <EmotionIndicator emotion={currentEmotion} size="sm" />
                <span className="text-sm">Emosi Anda saat ini</span>
              </div>
            </CardContent>
          </Card>

          {/* Participants */}
          <Card>
            <CardHeader>
              <CardTitle>Peserta Online</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {participants
                  .filter((p) => p.isOnline)
                  .map((participant) => (
                    <div key={participant.id} className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{participant.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm flex-1">{participant.name}</span>
                      <EmotionIndicator emotion={participant.emotion} size="sm" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
