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
  Smile,
  Frown,
  Angry,
  Meh,
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
  const [isClassFinished, setIsClassFinished] = useState(false) // State baru untuk menandai kelas selesai
  const videoRef = useRef<HTMLVideoElement>(null)
  const [classSessionFinished, setClassSessionFinished] = useState(false) // State baru untuk melacak status sesi kelas

  // Additional states for Zoom-like meeting experience
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isRaisingHand, setIsRaisingHand] = useState(false)
  const [isMeetingRecording, setIsMeetingRecording] = useState(user?.role === "Fasilitator")
  const [meetingDuration, setMeetingDuration] = useState(0)

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

  // Simulasi kelas selesai setelah beberapa waktu
  useEffect(() => {
    if (user.role === "Siswa") {
      // Simulasi kelas selesai setelah 30 detik (untuk demonstrasi)
      const classEndTimer = setTimeout(() => {
        setIsClassFinished(true)
        if (isVideoOn) {
          stopWebcam()
        }
        setError("Sesi kelas virtual telah selesai.")
      }, 30000) // 30 detik untuk demonstrasi

      return () => clearTimeout(classEndTimer)
    }
  }, [user.role])

  // Timer for meeting duration
  useEffect(() => {
    const timer = setInterval(() => {
      setMeetingDuration((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Format meeting duration as HH:MM:SS
  const formatMeetingDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

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
    
    // Pastikan tidak ada stream aktif sebelum meminta stream baru
    if (stream) {
      stopWebcam();
    }
    
    try {
      // Cek permission kamera
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Browser tidak mendukung akses kamera.")
        setIsLoading(false)
        return
      }
      
      // Coba dapatkan daftar perangkat kamera terlebih dahulu
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      if (videoDevices.length === 0) {
        setError("Tidak ada kamera yang terdeteksi pada perangkat ini.");
        setIsLoading(false);
        return;
      }
      
      // Coba akses kamera dengan constraint yang lebih fleksibel
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
        audio: false,
      }).catch(async (err) => {
        console.warn("Error dengan constraint ideal, mencoba constraint minimal:", err);
        
        // Jika gagal dengan constraint ideal, coba dengan constraint minimal
        return await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      });
      
      setStream(mediaStream)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch((e) => {
            console.error("Error playing video:", e);
            setError("Tidak dapat memutar video. Silakan coba lagi.");
          });
        };
      } else {
        setError("Element video tidak ditemukan.");
      }
      
      setIsVideoOn(true)
    } catch (err: any) {
      console.error("Error accessing webcam:", err)
      
      let errorMessage = "Tidak dapat mengakses kamera.";
      
      if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        errorMessage = "Kamera sedang digunakan aplikasi lain. Silakan tutup aplikasi tersebut dan coba lagi.";
      } else if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        errorMessage = "Akses ke kamera ditolak. Silakan berikan izin kamera dan coba lagi.";
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        errorMessage = "Tidak ada perangkat kamera yang ditemukan.";
      } else if (err.name === "OverconstrainedError") {
        errorMessage = "Konfigurasi kamera tidak didukung perangkat ini.";
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false)
    }
  }

  const stopWebcam = () => {
    if (stream) {
      try {
        // Pastikan untuk menghentikan semua track
        stream.getTracks().forEach((track) => {
          if (track.readyState === 'live') {
            track.stop();
          }
        });
      } catch (err) {
        console.error("Error stopping tracks:", err);
      }
      setStream(null);
    }
    
    // Reset video element
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      } catch (err) {
        console.error("Error resetting video element:", err);
      }
    }
    
    setIsVideoOn(false);
    setCurrentEmotion("neutral");
  }

  const toggleVideo = () => {
    if (isVideoOn) {
      stopWebcam()
    } else {
      // Periksa apakah kelas sudah selesai sebelum mengizinkan siswa untuk mengaktifkan kamera
      if (isClassFinished && user.role === "Siswa") {
        setError("Sesi kelas virtual telah selesai. Anda tidak dapat bergabung lagi.")
        return
      }
      startWebcam()
    }
  }

  const toggleAudio = async () => {
    // Periksa apakah kelas sudah selesai sebelum mengizinkan siswa untuk mengaktifkan mikrofon
    if (isClassFinished && user.role === "Siswa") {
      setError("Sesi kelas virtual telah selesai. Anda tidak dapat bergabung lagi.")
      return
    }

    if (!isAudioOn) {
      try {
        // Cek perangkat audio tersedia
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = devices.filter(device => device.kind === 'audioinput');
        
        if (audioDevices.length === 0) {
          setError("Tidak ada mikrofon yang terdeteksi pada perangkat ini.");
          return;
        }
        
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
          .catch(async (err) => {
            console.warn("Error accessing microphone with default constraints:", err);
            // Coba dengan constraint yang lebih sederhana
            return await navigator.mediaDevices.getUserMedia({ audio: true });
          });
          
        setIsAudioOn(true)
        // Simpan audio stream untuk digunakan nanti
        console.log("Audio started:", audioStream)
      } catch (err: any) {
        console.error("Error accessing microphone:", err)
        
        let errorMessage = "Tidak dapat mengakses mikrofon.";
        
        if (err.name === "NotReadableError" || err.name === "TrackStartError") {
          errorMessage = "Mikrofon sedang digunakan aplikasi lain. Silakan tutup aplikasi tersebut dan coba lagi.";
        } else if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          errorMessage = "Akses ke mikrofon ditolak. Silakan berikan izin mikrofon dan coba lagi.";
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          errorMessage = "Tidak ada perangkat mikrofon yang ditemukan.";
        }
        
        setError(errorMessage);
      }
    } else {
      setIsAudioOn(false)
      console.log("Audio stopped")
    }
  }

  // Simulasi kelas dimulai dan diakhiri oleh fasilitator
  useEffect(() => {
    // Simulasi kelas selesai setelah beberapa waktu (30 detik untuk demonstrasi)
    const classEndTimer = setTimeout(() => {
      // Jika saat ini status kelas adalah "live", kita simulasikan bahwa kelas sudah selesai
      if (classData.status === "live") {
        setClassSessionFinished(true);
        if (isVideoOn) {
          stopWebcam();
        }
        // Jika perlu, tambahkan notifikasi untuk memberi tahu pengguna bahwa kelas sudah selesai
      }
    }, 30000); // 30 detik untuk demonstrasi, bisa disesuaikan

    return () => clearTimeout(classEndTimer);
  }, []);

  // Function to handle join class button
  const handleJoinClass = () => {
    if (classSessionFinished) {
      // Jika kelas sudah selesai, tampilkan pesan error
      setError("Kelas virtual sudah selesai. Anda tidak dapat bergabung lagi.");
    } else {
      // Jika kelas masih berjalan, mulai webcam dan bergabung dengan kelas
      startWebcam();
    }
  }

  // Cleanup resources when component unmounts
  useEffect(() => {
    return () => {
      // Pastikan untuk menghentikan semua track media saat komponen unmount
      if (stream) {
        stream.getTracks().forEach((track) => {
          if (track.readyState === 'live') {
            track.stop();
          }
        });
      }
    };
  }, [stream]);

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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">          {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="classroom" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="classroom">Ruang Kelas</TabsTrigger>
              <TabsTrigger value="materials">Materi</TabsTrigger>
              <TabsTrigger value="emotions">Emosi Real-time</TabsTrigger>
            </TabsList>

            <TabsContent value="classroom" className="space-y-4">
              {/* Video Conference Area */}
              <Card className="overflow-hidden border-0 shadow-lg">
                <CardHeader className="py-3 bg-gradient-to-r from-primary/10 to-transparent">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Video className="h-5 w-5" />
                      {user.role === "Fasilitator" ? "Ruang Kelas Virtual" : "Kelas Sedang Berlangsung"}
                    </CardTitle>
                    <Badge variant={classData.status === "live" ? "default" : "outline"} className="animate-pulse">
                      {user.role === "Fasilitator" ? "🔴 Anda menjadi host" : "🔴 LIVE"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Main video grid area - optimized layout */}
                  <div className="relative">
                    {/* Instructor video area */}
                    <div className="relative w-full aspect-[16/9] bg-gray-950 flex items-center justify-center overflow-hidden">
                      {user.role === "Fasilitator" ? (
                        // If current user is facilitator, show their video
                        isVideoOn && stream ? (
                          <div className="relative w-full h-full">
                            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-4">
                              <div className="flex items-center gap-2">
                                <div className="px-3 py-1.5 bg-black/60 text-white rounded-md text-sm flex items-center backdrop-blur-sm">
                                  <span className="animate-pulse mr-2 h-2 w-2 bg-red-500 rounded-full" />
                                  {user.name} (Fasilitator) • Berbagi Layar
                                </div>
                                <div className="ml-auto bg-black/60 rounded-md p-1.5 backdrop-blur-sm">
                                  <EmotionIndicator emotion={currentEmotion} size="sm" />
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-white text-center p-8">
                            <div className="bg-primary/15 h-20 w-20 mx-auto mb-3 rounded-full flex items-center justify-center shadow-inner shadow-primary/10">
                              <VideoOff className="h-10 w-10 text-primary/70" />
                            </div>
                            <p className="font-medium text-lg">{user.name} (Fasilitator)</p>
                            <p className="text-sm text-gray-300 mt-2">
                              Klik tombol kamera untuk mengaktifkan deteksi emosi
                            </p>
                          </div>
                        )
                      ) : (
                        // If user is student, show instructor's video or placeholder with improved design
                        <div className="w-full h-full flex items-center justify-center relative">
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/70"></div>
                          <div className="relative z-10 text-center">
                            <div className="bg-blue-500/30 h-24 w-24 mx-auto mb-3 rounded-full flex items-center justify-center border-2 border-blue-400/30 shadow-lg shadow-blue-500/20">
                              <span className="text-3xl font-bold text-blue-100">SJ</span>
                            </div>
                            <p className="font-medium text-xl text-white mb-2">Dr. Sarah Johnson</p>
                            <Badge variant="secondary" className="mb-3 px-3 py-1.5 bg-blue-500/20 text-blue-100 border-0">
                              Sedang Berbagi Presentasi
                            </Badge>
                            <p className="text-sm text-white/80">Materi: Konsep Dasar Aljabar Linear</p>
                          </div>
                          {/* Student-visible controls at bottom */}
                          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                            <div className="flex justify-center space-x-2">
                              <Badge variant="outline" className="bg-white/10 backdrop-blur-sm border-0 py-1.5 flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {formatMeetingDuration(meetingDuration)}
                              </Badge>
                              
                              <Badge variant="outline" className="bg-white/10 backdrop-blur-sm border-0 py-1.5 flex items-center gap-1">
                                <Users className="h-3.5 w-3.5" />
                                {classData.participants} peserta
                              </Badge>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Emotion detection badge - improved visibility */}
                      {isVideoOn && (
                        <div className="absolute bottom-4 right-4 bg-green-500/20 px-4 py-2 rounded-full backdrop-blur-sm text-sm text-white border border-green-500/30">
                          <div className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="font-medium">Deteksi Emosi Aktif</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Participants gallery - improved design */}
                    <div className="absolute bottom-4 right-4 left-4 flex justify-center">
                      <div className="flex gap-2 overflow-x-auto px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full">
                        {participants.slice(0, 4).map((participant, index) => (
                          <div 
                            key={participant.id} 
                            className="relative min-w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 shadow-lg"
                          >
                            <Avatar className="h-full w-full">
                              <AvatarFallback className="text-sm bg-primary/20 text-primary">
                                {participant.name.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1">
                              <EmotionIndicator emotion={participant.emotion} size="xs" />
                            </div>
                            {index === 0 && (
                              <div className="absolute top-0 left-0 right-0 h-1 bg-yellow-500 animate-pulse"></div>
                            )}
                            {!participant.isOnline && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <VideoOff className="h-3 w-3 text-white/80" />
                              </div>
                            )}
                          </div>
                        ))}
                        {participants.length > 4 && (
                          <div className="flex items-center justify-center min-w-12 h-12 rounded-full bg-white/10 border-2 border-white/20">
                            <span className="text-xs font-medium text-white">+{participants.length - 4}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Meeting controls - Improved modern Zoom-style */}
                  <div className="p-4">
                    {/* Meeting info bar */}
                    <div className="flex items-center justify-between mb-4 bg-muted/20 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-primary/10 border-0">
                          <Calendar className="h-3.5 w-3.5 mr-1.5" />
                          <span>{classData.schedule.split(',')[0]}</span>
                        </Badge>
                        <Badge variant="outline" className="bg-primary/10 border-0">
                          <Clock className="h-3.5 w-3.5 mr-1.5" />
                          <span className="font-medium">{formatMeetingDuration(meetingDuration)}</span>
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-50/20 to-blue-50/5 border border-blue-200/20">
                        <span className="text-sm mr-1">Mood:</span>
                        <EmotionIndicator emotion={currentEmotion} size="sm" showLabel />
                      </div>
                    </div>
                    
                    {/* Main controls */}
                    <div className={`flex flex-wrap justify-center gap-4 p-4 rounded-xl ${user.role === "Siswa" ? "bg-gradient-to-r from-blue-50/10 to-primary/5" : "bg-gradient-to-r from-primary/10 to-primary/5"} border border-primary/10 shadow-sm`}>
                      <Button
                        variant={isVideoOn ? "default" : "outline"}
                        size="lg"
                        onClick={toggleVideo}
                        disabled={isLoading || (isClassFinished && user.role === "Siswa")}
                        className="rounded-full w-14 h-14 p-0 flex items-center justify-center relative group"
                      >
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : isVideoOn ? (
                          <Video className="h-5 w-5" />
                        ) : (
                          <VideoOff className="h-5 w-5" />
                        )}
                        <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">
                          {isVideoOn ? "Matikan Kamera" : "Nyalakan Kamera"}
                        </span>
                      </Button>

                      <Button
                        variant={isAudioOn ? "default" : "outline"}
                        size="lg"
                        onClick={toggleAudio}
                        disabled={isClassFinished && user.role === "Siswa"}
                        className="rounded-full w-14 h-14 p-0 flex items-center justify-center relative group"
                      >
                        {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                        <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">
                          {isAudioOn ? "Matikan Mic" : "Nyalakan Mic"}
                        </span>
                      </Button>

                      {user.role === "Fasilitator" && (
                        <Button
                          variant={isScreenSharing ? "default" : "outline"}
                          size="lg"
                          onClick={() => setIsScreenSharing(!isScreenSharing)}
                          className="rounded-full w-14 h-14 p-0 flex items-center justify-center relative group"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="7" width="18" height="12" rx="2" ry="2"></rect>
                            <line x1="15" y1="3" x2="21" y2="3"></line>
                            <line x1="15" y1="7" x2="21" y2="7"></line>
                          </svg>
                          <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">
                            {isScreenSharing ? "Berhenti Share" : "Share Screen"}
                          </span>
                        </Button>
                      )}

                      <Button
                        variant={isRaisingHand ? "default" : "outline"}
                        size="lg"
                        onClick={() => setIsRaisingHand(!isRaisingHand)}
                        className={`rounded-full w-14 h-14 p-0 flex items-center justify-center relative group ${isRaisingHand ? "animate-pulse" : ""}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 8a3 3 0 0 0-2-2.8 3 3 0 0 0-3.5 1.5 3 3 0 0 0-1.5 5.5L15 16V22H9v-6l-3.5-3.5a7 7 0 0 1-1.44-8.73"></path>
                          <path d="M2 13l2 2m8-9V3"></path>
                        </svg>
                        <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">
                          {isRaisingHand ? "Turunkan Tangan" : "Angkat Tangan"}
                        </span>
                      </Button>

                      {user.role === "Siswa" && (
                        <Button
                          variant="outline"
                          size="lg"
                          className="rounded-full w-14 h-14 p-0 flex items-center justify-center relative group"
                        >
                          <MessageSquare className="h-5 w-5" />
                          <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">
                            Chat
                          </span>
                        </Button>
                      )}

                      <Button
                        variant="destructive"
                        size="lg"
                        className="rounded-full w-14 h-14 p-0 flex items-center justify-center relative group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 6l6 6l-6 6"></path>
                        </svg>
                        <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">
                          Keluar Kelas
                        </span>
                      </Button>
                    </div>

                    {/* Facilitator-only controls */}
                    {user.role === "Fasilitator" && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 py-3 px-4 bg-blue-50/30 dark:bg-blue-900/20 border border-blue-100/50 dark:border-blue-800/50 rounded-xl shadow-sm">
                        <Button 
                          variant={isMeetingRecording ? "default" : "outline"} 
                          size="sm" 
                          onClick={() => setIsMeetingRecording(!isMeetingRecording)}
                          className="flex items-center gap-2"
                        >
                          <div className={`h-2 w-2 rounded-full ${isMeetingRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`} />
                          {isMeetingRecording ? "Stop Recording" : "Start Recording"}
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                            <path d="M15 15V9H9v6h6z"></path>
                            <path d="M9 15h6v2H9z"></path>
                            <path d="M5 7h14c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V9c0-1.1.9-2 2-2Z"></path>
                          </svg>
                          Presentasi
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                            <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                            <circle cx="12" cy="12" r="3"></circle>
                            <line x1="3" y1="15" x2="7" y2="15"></line>
                            <line x1="9" y1="3" x2="9" y2="7"></line>
                            <line x1="15" y1="21" x2="15" y2="17"></line>
                            <line x1="21" y1="9" x2="17" y2="9"></line>
                          </svg>
                          Whiteboard
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M4.93 4.93l14.14 14.14"></path>
                          </svg>
                          Blokir Chat
                        </Button>
                      </div>
                    )}
                  </div>

                  {isVideoOn && (
                    <div className="mx-4 mb-4 p-4 bg-gradient-to-r from-green-50/50 to-green-50/20 dark:from-green-900/30 dark:to-green-900/10 rounded-xl border border-green-200/50 dark:border-green-800/30 shadow-sm">
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        <Camera className="h-5 w-5" />
                        <span className="font-medium">EmoTrack™ Aktif</span>
                      </div>
                      <p className="text-sm text-green-600 dark:text-green-500 mt-2">
                        Sistem sedang menganalisis ekspresi wajah Anda untuk pembelajaran adaptif berdasarkan emosi. Data ini membantu fasilitator menyesuaikan cara pengajaran berdasarkan respons emosional siswa secara real-time.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Chat Area - Improved UI */}
              <Card className="border-0 shadow-lg overflow-hidden">
                <CardHeader className="py-3 bg-gradient-to-r from-blue-50/30 to-transparent dark:from-blue-900/20 dark:to-transparent border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      <span>Live Chat Kelas</span>
                    </CardTitle>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                      Emotion-Aware
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[360px] overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-transparent to-muted/5">
                    {/* System message - improved styling */}
                    <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4 text-center border border-primary/10">
                      <div className="mx-auto w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 5v14"></path>
                          <path d="M19 12H5"></path>
                        </svg>
                      </div>
                      <p className="text-sm font-medium">
                        {user.role === "Fasilitator"
                          ? "Selamat datang di kelas virtual. Anda adalah host dari kelas ini."
                          : "Selamat datang di kelas virtual. Dr. Sarah Johnson adalah host kelas ini."}
                      </p>
                      <div className="inline-flex items-center gap-1 mt-1.5 text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        <Clock className="h-3 w-3" />
                        <span>Kelas dimulai pukul 09:00</span>
                      </div>
                    </div>

                    {/* Regular chat messages with emotion indicators - improved styling */}
                    {chatMessages.map((msg, index) => (
                      <div
                        key={msg.id}
                        className={`flex items-start gap-3 px-3 py-2.5 rounded-xl transition-all ${
                          msg.user === user.name 
                            ? "bg-primary/10 border border-primary/10" 
                            : index % 2 === 0 
                              ? "bg-muted/20" 
                              : ""
                        }`}
                      >
                        <Avatar className={`h-9 w-9 ${msg.user === "Dr. Sarah Johnson" ? "ring-2 ring-blue-400 ring-offset-1" : ""}`}>
                          <AvatarFallback className={`text-sm ${msg.user === "Dr. Sarah Johnson" ? "bg-blue-500/40 text-blue-100" : ""}`}>
                            {msg.user.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`font-medium ${msg.user === "Dr. Sarah Johnson" ? "text-blue-500" : "text-primary"}`}>
                              {msg.user}
                              {msg.user === "Dr. Sarah Johnson" && (
                                <Badge variant="secondary" className="ml-1.5 text-[10px] py-0 px-1.5 bg-blue-500/20 text-blue-500 border-0">Host</Badge>
                              )}
                            </span>
                            <EmotionIndicator emotion={msg.emotion} size="xs" />
                            <span className="text-xs text-muted-foreground ml-auto">{msg.timestamp}</span>
                          </div>
                          <p className="text-sm leading-relaxed">{msg.message}</p>
                          
                          {/* Message reactions - to enhance interactivity */}
                          {index === 1 && (
                            <div className="mt-1.5 flex items-center gap-1">
                              <Badge variant="outline" className="text-xs py-0.5 px-2 hover:bg-primary/5 cursor-pointer">👍 1</Badge>
                              <Badge variant="outline" className="text-xs py-0.5 px-2 hover:bg-primary/5 cursor-pointer">❤️ 2</Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Improved typing indicator */}
                    <div className="flex items-center gap-2 py-1 px-2 bg-muted/10 rounded-lg border border-muted/20 w-fit">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs bg-primary/20 text-primary">AS</AvatarFallback>
                      </Avatar>
                      <div className="flex space-x-1 items-center">
                        <span className="text-xs font-medium">Alice Smith</span>
                        <span className="text-xs text-muted-foreground">sedang mengetik</span>
                        <span className="flex ml-1">
                          <span className="animate-bounce mx-0.5 h-1 w-1 bg-primary rounded-full"></span>
                          <span className="animate-bounce animation-delay-200 mx-0.5 h-1 w-1 bg-primary rounded-full"></span>
                          <span className="animate-bounce animation-delay-400 mx-0.5 h-1 w-1 bg-primary rounded-full"></span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Chat input area - improved styling */}
                  <div className="px-4 py-3 border-t bg-card">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          placeholder="Ketik pesan... (emosi akan dianalisis otomatis)"
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                          className="pr-12 py-6 bg-muted/20"
                        />
                        {chatMessage && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <EmotionIndicator emotion={analyzeTextEmotion(chatMessage)} size="xs" />
                          </div>
                        )}
                      </div>
                      <Button variant="default" size="icon" onClick={handleSendMessage} disabled={!chatMessage.trim()} className="h-[42px] w-[42px]">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>

                    {chatMessage && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="px-2 py-1 rounded-full bg-muted/20 text-xs flex items-center gap-1.5">
                          <span>Emosi terdeteksi:</span>
                          <EmotionIndicator emotion={analyzeTextEmotion(chatMessage)} size="xs" showLabel />
                        </div>
                        {user.role === "Fasilitator" && (
                          <span className="ml-auto text-xs px-2 py-1 bg-blue-500/10 text-blue-500 rounded-full">
                            Pesan akan dikirim sebagai fasilitator
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="materials" className="space-y-4">
              <Card className="overflow-hidden border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        Materi Pembelajaran
                      </CardTitle>
                      <CardDescription>Modul, presentasi, dan latihan untuk kelas ini</CardDescription>
                    </div>
                    {user.role === "Fasilitator" && (
                      <Button size="sm" className="gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                          <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"></path>
                          <line x1="12" y1="11" x2="12" y2="17"></line>
                          <line x1="9" y1="14" x2="15" y2="14"></line>
                        </svg>
                        Upload Materi
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-4">
                    {classData.materials.map((material) => (
                      <div key={material.id} className="flex items-center gap-4 p-4 bg-muted/10 hover:bg-muted/20 rounded-xl border border-muted/30 transition-colors">
                        <div className={`p-3 rounded-xl ${
                          material.type === "pdf" ? "bg-red-500/10 text-red-500" : 
                          material.type === "video" ? "bg-blue-500/10 text-blue-500" : 
                          "bg-green-500/10 text-green-500"
                        }`}>
                          {material.type === "pdf" && <FileText className="h-6 w-6" />}
                          {material.type === "video" && <Video className="h-6 w-6" />}
                          {material.type === "quiz" && <BarChart3 className="h-6 w-6" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-lg">{material.title}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <Badge variant="outline" className={`${
                              material.type === "pdf" ? "bg-red-500/5 text-red-500 border-red-200/20" : 
                              material.type === "video" ? "bg-blue-500/5 text-blue-500 border-blue-200/20" : 
                              "bg-green-500/5 text-green-500 border-green-200/20"
                            }`}>
                              {material.type.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-muted-foreground">Ditambahkan: 2 hari yang lalu</span>
                          </div>
                        </div>
                        <Button variant="outline" className="ml-auto gap-1.5">
                          {material.type === "pdf" && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2v6h6"></path>
                            <path d="M4 14v6h16v-7"></path>
                            <path d="M4 9v3h7"></path>
                            <path d="M22 8L15 2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8Z"></path>
                          </svg>}
                          {material.type === "video" && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="6 3 20 12 6 21"></polygon>
                          </svg>}
                          {material.type === "quiz" && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                            <path d="M13.5 14.5 A1 1 0 0 1 12.5 15.5 A1 1 0 0 1 11.5 14.5 A1 1 0 0 1 13.5 14.5 z"></path>
                            <path d="M11.5 10.5 A1 1 0 0 1 10.5 11.5 A1 1 0 0 1 9.5 10.5 A1 1 0 0 1 11.5 10.5 z"></path>
                            <path d="M16.5 7.5 A1 1 0 0 1 15.5 8.5 A1 1 0 0 1 14.5 7.5 A1 1 0 0 1 16.5 7.5 z"></path>
                            <line x1="14" y1="15" x2="10.5" y2="12"></line>
                            <line x1="12" y1="9.5" x2="16" y2="8"></line>
                          </svg>}
                          <span>Buka {material.type === "pdf" ? "Dokumen" : material.type === "video" ? "Video" : "Kuis"}</span>
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-dashed">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Pembelajaran untuk minggu ini: 2 dari 3 selesai</p>
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-2/3 bg-primary"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="emotions" className="space-y-4">
              <Card className="overflow-hidden border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-500/10 to-transparent border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                          <line x1="9" y1="9" x2="9.01" y2="9"></line>
                          <line x1="15" y1="9" x2="15.01" y2="9"></line>
                        </svg>
                        Monitor Emosi Real-time
                      </CardTitle>
                      <CardDescription>
                        {user.role === "Fasilitator" 
                          ? "Pantau kondisi emosional siswa untuk pembelajaran yang lebih adaptif" 
                          : "Lihat informasi emosi peserta kelas untuk interaksi yang lebih baik"}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-primary/10 border-primary/20">
                      EmoTrack™ Active
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {/* Emotion summary chart - for both teacher and student */}
                  <div className="mb-6 pb-6 border-b">
                    <h3 className="text-lg font-semibold mb-4">Ringkasan Emosi Kelas</h3>
                    <div className="grid grid-cols-5 gap-2 mb-2">
                      <div className="aspect-square rounded-lg flex flex-col items-center justify-center bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border border-yellow-500/20">
                        <div className="emotion-gradient-joy w-10 h-10 rounded-full flex items-center justify-center mb-1">
                          <Smile className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xs font-medium">Senang</span>
                        <Badge variant="outline" className="mt-1 text-[10px] py-0 px-1.5">30%</Badge>
                      </div>
                      <div className="aspect-square rounded-lg flex flex-col items-center justify-center bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20">
                        <div className="emotion-gradient-sadness w-10 h-10 rounded-full flex items-center justify-center mb-1">
                          <Frown className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xs font-medium">Sedih</span>
                        <Badge variant="outline" className="mt-1 text-[10px] py-0 px-1.5">15%</Badge>
                      </div>
                      <div className="aspect-square rounded-lg flex flex-col items-center justify-center bg-gradient-to-br from-red-500/20 to-red-500/5 border border-red-500/20">
                        <div className="emotion-gradient-anger w-10 h-10 rounded-full flex items-center justify-center mb-1">
                          <Angry className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xs font-medium">Marah</span>
                        <Badge variant="outline" className="mt-1 text-[10px] py-0 px-1.5">5%</Badge>
                      </div>
                      <div className="aspect-square rounded-lg flex flex-col items-center justify-center bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20">
                        <div className="emotion-gradient-fear w-10 h-10 rounded-full flex items-center justify-center mb-1">
                          <AlertCircle className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xs font-medium">Takut</span>
                        <Badge variant="outline" className="mt-1 text-[10px] py-0 px-1.5">10%</Badge>
                      </div>
                      <div className="aspect-square rounded-lg flex flex-col items-center justify-center bg-gradient-to-br from-gray-500/20 to-gray-500/5 border border-gray-500/20">
                        <div className="emotion-gradient-neutral w-10 h-10 rounded-full flex items-center justify-center mb-1">
                          <Meh className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xs font-medium">Netral</span>
                        <Badge variant="outline" className="mt-1 text-[10px] py-0 px-1.5">40%</Badge>
                      </div>
                    </div>
                    
                    <div className="bg-muted/20 p-4 rounded-lg mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">Tren Emosi Kelas</h4>
                        <Badge variant="outline">10 menit terakhir</Badge>
                      </div>
                      <div className="h-24 w-full bg-gradient-to-r from-transparent to-muted/10 rounded-md flex items-end">
                        <div className="h-3/5 w-1/5 bg-yellow-500/50 rounded-t"></div>
                        <div className="h-2/5 w-1/5 bg-blue-500/50 rounded-t"></div>
                        <div className="h-1/5 w-1/5 bg-red-500/50 rounded-t"></div>
                        <div className="h-2/5 w-1/5 bg-purple-500/50 rounded-t"></div>
                        <div className="h-4/5 w-1/5 bg-gray-500/50 rounded-t"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Individual emotions list with improved UI */}
                  <h3 className="text-lg font-semibold mb-3">Emosi Peserta</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {participants.map((participant) => (
                      <div 
                        key={participant.id} 
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                          participant.emotion === "joy" ? "bg-yellow-500/5 border-yellow-200/30" :
                          participant.emotion === "sadness" ? "bg-blue-500/5 border-blue-200/30" :
                          participant.emotion === "fear" ? "bg-purple-500/5 border-purple-200/30" :
                          participant.emotion === "anger" ? "bg-red-500/5 border-red-200/30" :
                          "bg-gray-500/5 border-gray-200/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className={`h-10 w-10 ${!participant.isOnline && "opacity-60"}`}>
                            <AvatarFallback className="bg-primary/10 text-primary">{participant.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{participant.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <div
                                className={`w-2 h-2 rounded-full ${participant.isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
                              />
                              <span className="text-xs text-muted-foreground">
                                {participant.isOnline ? "Online" : "Offline"}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end">
                          <EmotionIndicator emotion={participant.emotion} size="md" showLabel />
                          {user.role === "Fasilitator" && participant.emotion !== "joy" && participant.emotion !== "neutral" && (
                            <Button variant="ghost" size="sm" className="text-xs mt-1 h-7 px-2">Periksa</Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {user.role === "Fasilitator" && (
                    <div className="mt-6 pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-2">Rekomendasi untuk fasilitator:</p>
                      <Alert className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200/30">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <div className="text-sm">
                          <p className="font-medium">Perhatian diperlukan</p>
                          <p className="text-xs mt-1">Beberapa siswa menunjukkan emosi negatif. Pertimbangkan untuk mengubah tempo pembelajaran atau memberikan jeda singkat.</p>
                        </div>
                      </Alert>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - Improved UI */}
        <div className="space-y-5">
          {/* Class Info Card */}
          <Card className="overflow-hidden border-0 shadow-md">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                Info Kelas
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="rounded-xl bg-gradient-to-r from-muted/30 to-muted/10 p-4 space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 rounded-full">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Peserta Kelas</p>
                    <p className="text-lg font-semibold">{classData.participants}/{classData.maxParticipants}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 rounded-full">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Jadwal</p>
                    <p className="text-sm">{classData.schedule}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 rounded-full">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Durasi</p>
                    <p className="text-sm">{classData.startTime} - {classData.endTime}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg mt-5">
                  <p className="text-sm font-medium mb-2">Emosi Anda Saat Ini</p>
                  <div className="flex items-center gap-3">
                    <EmotionIndicator emotion={currentEmotion} size="md" showLabel />
                    <div>
                      <p className="text-xs text-muted-foreground">EmoTrack™ terus memantau dan menyesuaikan pengalaman belajar Anda</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Participants Card */}
          <Card className="overflow-hidden border-0 shadow-md">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-blue-500/5 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Peserta Online
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 px-4">
              <div className="space-y-3">
                {participants
                  .filter((p) => p.isOnline)
                  .map((participant) => (
                    <div 
                      key={participant.id} 
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/20 transition-colors" 
                    >
                      <Avatar className="h-9 w-9 border-2 border-muted/30">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {participant.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{participant.name}</p>
                          <EmotionIndicator emotion={participant.emotion} size="xs" />
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-muted-foreground">
                            {participant.isOnline ? "Online" : "Offline"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-dashed">
                <Button variant="outline" className="w-full text-sm" size="sm">
                  <Users className="h-3.5 w-3.5 mr-2" />
                  Lihat Semua Peserta
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
