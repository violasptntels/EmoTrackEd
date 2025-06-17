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
  const [stream, setStream] = useState(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isClassFinished, setIsClassFinished] = useState(false) // State baru untuk menandai kelas selesai
  const videoRef = useRef(null)
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
    let emotionInterval
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
  // Simulasi sesi privat selesai setelah beberapa waktu (hanya untuk demo)
  useEffect(() => {
    if (user.role === "Siswa") {
      // Simulasi sesi selesai setelah 60 detik (untuk demonstrasi)
      const classEndTimer = setTimeout(() => {
        setIsClassFinished(true)
        if (isVideoOn) {
          stopWebcam()
        }
        setError("Sesi bimbingan privat telah selesai. Fasilitator telah mengakhiri sesi.")
      }, 60000) // 60 detik untuk demonstrasi

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
const formatMeetingDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }
  // Data sesi kelas privat (simulasi)
  const classData = {
    id: params.id,
    title: "Sesi Privat - Matematika Dasar",
    instructor: "Dr. Sarah Johnson",
    description: "Sesi bimbingan privat untuk pemahaman konsep aljabar linear dengan pendekatan emosional",
    schedule: "Senin, 09:00-10:00",
    participants: 1, // Hanya 1 siswa
    maxParticipants: 1, // Maksimal 1 siswa
    status: "live",
    startTime: "09:00",
    endTime: "10:00",
    sessionType: "private", // Menandakan ini adalah sesi privat
    materials: [
      { id: 1, title: "Materi 1: Pengenalan Vektor", type: "pdf", url: "#" },
      { id: 2, title: "Video: Operasi Matriks", type: "video", url: "#" },
      { id: 3, title: "Quiz: Latihan Soal Vektor", type: "quiz", url: "#" },
    ],
    chatMessages: [
      {
        id: 1,
        user: "Alex Student",
        message: "Selamat pagi, Bu Sarah!",
        emotion: "joy",
        timestamp: "09:05",
      },
      {
        id: 2,
        user: "Dr. Sarah Johnson",
        message: "Selamat pagi Alex! Hari ini kita akan fokus pada konsep dasar vektor.",
        emotion: "neutral",
        timestamp: "09:06",
      },
    ],
  }

  // Hanya ada 1 fasilitator dan 1 siswa dalam sesi privat
  const participants = user.role === "Siswa" 
    ? [
        { id: 1, name: "Dr. Sarah Johnson", role: "Fasilitator", emotion: "neutral", isOnline: true },
      ]
    : [
        { id: 1, name: "Alex Student", role: "Siswa", emotion: "joy", isOnline: true },
      ];

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

  const analyzeTextEmotion = (text) => {
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
      // Cek permission kamera dan mikrofon
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Browser tidak mendukung akses kamera/mikrofon.")
        setIsLoading(false)
        return
      }
      
      // Coba dapatkan daftar perangkat kamera dan mikrofon
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      const audioDevices = devices.filter(device => device.kind === 'audioinput');
      
      if (videoDevices.length === 0) {
        setError("Tidak ada kamera yang terdeteksi.")
        setIsLoading(false)
        return
      }
      
      // Notifikasi jika tidak ada mikrofon terdeteksi tapi tetap lanjut dengan video saja
      if (audioDevices.length === 0) {
        console.warn("Tidak ada mikrofon yang terdeteksi, melanjutkan dengan video saja.")
      }
      
      // Dapatkan akses ke webcam dan mikrofon dengan opsi kualitas yang lebih baik
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        },
        audio: true
      })
      
      // Set stream ke state dan video element
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      
      // Aktifkan mikrofon dan video
      mediaStream.getAudioTracks().forEach(track => {
        track.enabled = true
      })
      
      // Update state
      setIsVideoOn(true)
      setIsAudioOn(true)
      setIsLoading(false)
      
      // Tampilkan pesan sukses
      console.log(`Kamera dan mikrofon aktif: ${videoDevices.length} kamera, ${audioDevices.length} mikrofon`)
    } catch (err) {
      console.error("Error accessing media devices:", err)
      
      // Coba lagi dengan video saja jika kombinasi gagal
      try {
        const videoOnlyStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        })
        
        setStream(videoOnlyStream)
        if (videoRef.current) {
          videoRef.current.srcObject = videoOnlyStream
        }
        
        setIsVideoOn(true)
        setIsAudioOn(false)
        setIsLoading(false)
        setError("Mikrofon tidak dapat diakses. Hanya kamera yang aktif.")
      } catch (videoErr) {
        console.error("Error accessing webcam:", videoErr)
        setError("Gagal mengakses kamera dan mikrofon. Periksa izin browser Anda.")
        setIsLoading(false)
      }
    }
  }
    const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
      
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
    
    setIsVideoOn(false)
    setIsAudioOn(false)
  }
  const toggleAudio = async () => {
    // Jika tidak ada stream atau tidak ada audio tracks, coba dapatkan audio
    if (!stream || stream.getAudioTracks().length === 0) {
      try {
        // Coba dapatkan akses ke mikrofon
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true
        })
        
        // Tambahkan track audio ke stream yang ada
        if (stream) {
          audioStream.getAudioTracks().forEach(track => {
            stream.addTrack(track)
          })
        } else {
          // Jika tidak ada stream sama sekali, gunakan audioStream
          setStream(audioStream)
        }
        
        // Aktifkan audio
        setIsAudioOn(true)
      } catch (err) {
        console.error("Error accessing microphone:", err)
        setError("Gagal mengakses mikrofon. Periksa izin browser Anda.")
        return
      }
    } else {
      // Toggle audio dari stream yang ada
      const newAudioState = !isAudioOn
      setIsAudioOn(newAudioState)
      
      stream.getAudioTracks().forEach(track => {
        track.enabled = newAudioState
      })
      
      // Tampilkan pesan status
      console.log(`Mikrofon ${newAudioState ? 'aktif' : 'mati'}`)
    }
  }

  const toggleScreenSharing = () => {
    setIsScreenSharing(!isScreenSharing)
    // Implentasi screen sharing aktual akan memerlukan API browser tambahan
  }

  const toggleRaiseHand = () => {
    setIsRaisingHand(!isRaisingHand)
  }

  const toggleMeetingRecording = () => {
    setIsMeetingRecording(!isMeetingRecording)
  }  // Handler untuk menyelesaikan sesi kelas privat
  const handleFinishSession = () => {
    // Konfirmasi penyelesaian sesi kelas dengan pesan yang sesuai berdasarkan peran
    const confirmMessage = user.role === "Fasilitator" 
      ? "Apakah Anda yakin ingin mengakhiri sesi privat dengan siswa?"
      : "Apakah Anda yakin ingin keluar dari sesi bimbingan privat ini?";
      
    if (window.confirm(confirmMessage)) {
      // Hentikan peralatan media
      stopWebcam()
      
      // Update state
      setClassSessionFinished(true)
        // Pesan yang sesuai berdasarkan peran
      if (user.role === "Fasilitator") {
        setError("Sesi bimbingan privat telah diakhiri. Siswa akan dialihkan ke halaman refleksi.")
        
        // Simpan ke localStorage bahwa fasilitator telah mengakhiri sesi ini
        localStorage.setItem(`sessionEnd_${params.id}`, new Date().toISOString())
        
        // Redirect fasilitator setelah 3 detik ke daftar sesi
        setTimeout(() => {
          window.location.href = "/facilitator/sessions"
        }, 3000)
      } else {
        setError("Anda telah keluar dari sesi bimbingan privat ini.")
        
        // Simpan ke localStorage bahwa siswa telah keluar dari sesi ini
        localStorage.setItem(`sessionExit_${params.id}`, new Date().toISOString())
        
        // Redirect siswa ke halaman refleksi setelah 3 detik
        setTimeout(() => {
          window.location.href = "/reflection"
        }, 3000)
      }
    }
  }

  // Daftar emosi yang terpantau dari sesi (simulasi data)
  const detectedEmotions = [
    { time: "09:05", emotion: "neutral", duration: 60 },
    { time: "09:06", emotion: "joy", duration: 30 },
    { time: "09:07", emotion: "sadness", duration: 15 },
    { time: "09:08", emotion: "neutral", duration: 45 },
    { time: "09:10", emotion: "surprise", duration: 10 },
    { time: "09:15", emotion: "fear", duration: 20 },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-4 md:p-6 space-y-6">
        {/* Breadcrumb dan header */}
        <div className="flex justify-between items-center">          <div>
            <div className="text-sm text-muted-foreground">
              {user.role === "Fasilitator" ? "Fasilitasi Bimbingan" : "Sesi Bimbingan"} &gt; Sesi Privat
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{classData.title}</h1>
              <Badge variant="outline" className="ml-2">Bimbingan 1:1</Badge>
              {user.role === "Fasilitator" && (
                <Badge variant="secondary" className="ml-1">Anda sebagai Fasilitator</Badge>
              )}
            </div>
            <div className="text-muted-foreground flex flex-wrap gap-4">
              <span className="flex items-center gap-1 text-sm">
                <Calendar className="w-4 h-4" /> {classData.schedule}
              </span>
              <span className="flex items-center gap-1 text-sm">
                <Users className="w-4 h-4" /> Bimbingan dengan {user.role === "Siswa" ? 
                  <span className="font-medium text-primary">{classData.instructor}</span> : 
                  participants.length > 0 ? 
                    <span className="font-medium text-primary">{participants[0].name}</span> : 
                    "Siswa (menunggu)"}
              </span>
            </div>
          </div><div className="flex items-center gap-2">
            <div className="text-muted-foreground flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span className="text-sm font-mono">
                {formatMeetingDuration(meetingDuration)}
              </span>
            </div>
          </div>
        </div>

        {/* Pesan error */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Layout virtual classroom - grid layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          {/* Area utama kelas - Webcam/Video */}
          <div className="xl:col-span-3 space-y-4">
            <Card className="overflow-hidden">              <CardHeader className="bg-muted flex flex-row items-center justify-between px-4 py-2">
                <div className="flex items-center gap-2">
                  <Badge variant={classData.status === "live" ? "destructive" : "outline"}>
                    {classData.status === "live" ? "LIVE" : "Offline"}
                  </Badge>
                  <Badge variant="secondary" className="mr-2">Sesi Privat 1:1</Badge>
                  <CardTitle className="text-md">{classData.title}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <EmotionIndicator emotion={currentEmotion} size="sm" showLabel />
                </div>
              </CardHeader>

              <CardContent className="p-0 relative bg-black flex justify-center items-center">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-[400px] text-white bg-muted-foreground/30">
                    <div className="loading-spinner mb-4"></div>
                    <p>Memuat kamera...</p>
                  </div>
                ) : isVideoOn ? (
                  <div className="relative w-full">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-[400px] object-cover"
                    />
                    
                    {/* Overlay status untuk emosi terdeteksi */}
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-background/70 p-2 rounded-md">
                      <EmotionIndicator emotion={currentEmotion} size="sm" />
                      <span className="text-sm font-medium">Emosi terdeteksi: {currentEmotion}</span>
                    </div>
                    
                    {/* Overlay untuk status perangkat */}
                    <div className="absolute bottom-4 left-4 flex flex-col gap-2">
                      <Badge variant="outline" className="bg-background/70">
                        {isAudioOn ? "Mikrofon Aktif" : "Mikrofon Mati"}
                      </Badge>
                      {isRaisingHand && (
                        <Badge variant="secondary" className="bg-background/70">
                          Tangan Diangkat
                        </Badge>
                      )}
                    </div>
                  </div>                ) : classSessionFinished ? (
                  <div className="flex flex-col items-center justify-center h-[400px] text-white bg-muted-foreground/30">
                    <AlertCircle className="h-16 w-16 mb-4 text-muted" />
                    <h3 className="text-xl font-semibold">Sesi Privat Telah Berakhir</h3>
                    <p className="text-center max-w-md mt-2 text-muted-foreground">
                      Terima kasih telah berpartisipasi dalam sesi bimbingan privat ini.
                      {user.role === "Siswa" && "Silakan menuju ke halaman refleksi untuk mencatat pemahaman Anda."}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-white bg-muted-foreground/30">
                    <Camera className="h-16 w-16 mb-4 text-muted" />                    <h3 className="text-lg font-semibold">Kamera tidak aktif</h3>
                    <p className="text-center max-w-md mt-2 text-muted-foreground">
                      Aktifkan kamera untuk mengikuti sesi bimbingan privat ini dan memungkinkan deteksi emosi
                    </p>
                    <Button
                      onClick={startWebcam}
                      variant="outline"
                      className="mt-4"
                      disabled={isLoading || classSessionFinished || isClassFinished}
                    >
                      Aktifkan Kamera
                    </Button>
                  </div>
                )}
              </CardContent>              {/* Kontrol media */}
              <div className="bg-muted p-3 flex items-center justify-center gap-3">
                {/* Tombol kamera dengan tooltip dan visual feedback */}
                <div className="relative group">
                  <Button
                    size="icon"
                    className={`h-10 w-10 rounded-full ${isVideoOn ? 'bg-primary hover:bg-primary/90' : 'bg-muted-foreground/20'}`}
                    onClick={() => isVideoOn ? stopWebcam() : startWebcam()}
                    disabled={isLoading || classSessionFinished || isClassFinished}
                  >
                    {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                  </Button>
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background text-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-md whitespace-nowrap">
                    {isVideoOn ? 'Matikan Kamera' : 'Aktifkan Kamera'}
                  </span>
                  <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-2 w-2 rounded-full ${isVideoOn ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
                
                {/* Tombol mikrofon dengan tooltip dan visual feedback */}
                <div className="relative group">
                  <Button
                    size="icon"
                    className={`h-10 w-10 rounded-full ${isAudioOn ? 'bg-primary hover:bg-primary/90' : 'bg-muted-foreground/20'}`}
                    onClick={toggleAudio}
                    disabled={isLoading || classSessionFinished || isClassFinished}
                  >
                    {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                  </Button>
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background text-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-md whitespace-nowrap">
                    {isAudioOn ? 'Matikan Mikrofon' : 'Aktifkan Mikrofon'}
                  </span>
                  <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-2 w-2 rounded-full ${isAudioOn ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
                
                {/* Tombol berbagi layar dengan tooltip */}
                <div className="relative group">
                  <Button
                    size="icon"
                    className={`h-10 w-10 rounded-full ${isScreenSharing ? 'bg-primary hover:bg-primary/90' : 'bg-muted-foreground/20'}`}
                    onClick={toggleScreenSharing}
                    disabled={classSessionFinished || isClassFinished}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  </Button>
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background text-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-md whitespace-nowrap">
                    {isScreenSharing ? 'Hentikan Berbagi Layar' : 'Berbagi Layar'}
                  </span>
                </div>
                
                {/* Tombol angkat tangan dengan tooltip */}
                <div className="relative group">
                  <Button
                    size="icon"
                    className={`h-10 w-10 rounded-full ${isRaisingHand ? 'bg-amber-500 hover:bg-amber-600' : 'bg-muted-foreground/20'}`}
                    onClick={toggleRaiseHand}
                    disabled={classSessionFinished || isClassFinished}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 11v5a1 1 0 0 0 1 1h5" />
                      <path d="M4 8V4m0 0h4M4 4l9 9" />
                    </svg>
                  </Button>
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background text-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-md whitespace-nowrap">
                    {isRaisingHand ? 'Turunkan Tangan' : 'Angkat Tangan'}
                  </span>
                </div>
                  {/* Tombol rekam sesi bimbingan (hanya untuk fasilitator) */}
                {user.role === "Fasilitator" && (
                  <div className="relative group">
                    <Button
                      size="icon"
                      className={`h-10 w-10 rounded-full ${isMeetingRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-muted-foreground/20'}`}
                      onClick={toggleMeetingRecording}
                      disabled={classSessionFinished || isClassFinished}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </Button>
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background text-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-md whitespace-nowrap">
                      {isMeetingRecording ? 'Hentikan Rekaman Sesi' : 'Rekam Sesi Bimbingan'}
                    </span>
                    {isMeetingRecording && (
                      <div>
                        <span className="absolute -top-2 -right-2 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        <span className="absolute top-11 left-1/2 transform -translate-x-1/2 text-xs text-red-500 whitespace-nowrap font-medium">Merekam</span>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Tombol catatan bimbingan (hanya untuk fasilitator) */}
                {user.role === "Fasilitator" && (
                  <div className="relative group">
                    <Button
                      size="icon"
                      className="h-10 w-10 rounded-full bg-muted-foreground/20"
                      onClick={() => alert('Fitur catatan bimbingan akan segera tersedia')}
                      disabled={classSessionFinished || isClassFinished}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                      </svg>
                    </Button>
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background text-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-md whitespace-nowrap">
                      Catatan Bimbingan
                    </span>
                  </div>
                )}
                  {/* Tombol keluar/akhiri sesi privat */}                
                <div className="relative group ml-2">
                  <Button
                    variant="destructive"
                    className="h-10 px-4 rounded-full"
                    onClick={handleFinishSession}
                    disabled={classSessionFinished || isClassFinished}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 18h12c.6 0 1-.4 1-1s-.4-1-1-1H6c-.6 0-1 .4-1 1s.4 1 1 1z"/>
                      <path d="M17 13a5 5 0 0 0-10 0"/>
                      <line x1="12" y1="2" x2="12" y2="10"/>
                    </svg>
                    {user.role === "Fasilitator" ? "Akhiri Sesi Privat" : "Keluar Sesi Privat"}
                  </Button>
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background text-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-md whitespace-nowrap">
                    {user.role === "Fasilitator" ? "Akhiri sesi privat" : "Keluar dari sesi bimbingan"}
                  </span>
                </div>
              </div>
            </Card>

            {/* Tabs untuk aktivitas */}
            <Tabs defaultValue="chat">              <TabsList className="mb-4 w-full justify-start">
                <TabsTrigger value="chat">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {user.role === "Fasilitator" ? "Percakapan Bimbingan" : "Chat Privat"}
                </TabsTrigger>
                <TabsTrigger value="materials">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {user.role === "Fasilitator" ? "Materi Ajar" : "Materi"}
                </TabsTrigger>
                <TabsTrigger value="analytics">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  {user.role === "Fasilitator" ? "Analisis Emosi Siswa" : "Analisis Emosi"}
                </TabsTrigger>
              </TabsList>
              
              {/* Tab Chat */}              <TabsContent value="chat" className="mt-0">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Chat Privat</CardTitle>
                    <CardDescription>
                      Diskusi privat antara siswa dan fasilitator
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-[300px] overflow-y-auto p-4 space-y-4">
                      {chatMessages.map((msg) => (
                        <div 
                          key={msg.id} 
                          className={`flex items-start gap-2 ${
                            msg.user === user.name ? 'justify-end pl-8' : 'pr-8'
                          }`}
                        >
                          {msg.user !== user.name && (
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                {msg.user.split(" ").map(name => name[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div className={`
                            rounded-lg p-3 ${
                              msg.user === user.name 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                            }
                          `}>
                            <div className="flex items-center gap-2 justify-between">
                              <span className="font-medium text-sm">{
                                msg.user === user.name ? 'Anda' : msg.user
                              }</span>
                              <div className="flex items-center gap-1">
                                <span className="text-xs opacity-70">{msg.timestamp}</span>
                                <EmotionIndicator emotion={msg.emotion} size="xs" />
                              </div>
                            </div>
                            <p className="text-sm mt-1">{msg.message}</p>
                          </div>
                          {msg.user === user.name && (
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                {user.name.split(" ").map(name => name[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="p-2 border-t flex gap-2">
                      <Input 
                        placeholder="Ketik pesan..." 
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        disabled={classSessionFinished || isClassFinished}
                      />
                      <Button 
                        size="icon"
                        onClick={handleSendMessage}
                        disabled={classSessionFinished || isClassFinished}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Tab Materi */}
              <TabsContent value="materials" className="mt-0">
                <Card>
                  <CardHeader>                    <CardTitle>Materi Bimbingan</CardTitle>
                    <CardDescription>
                      Material dan sumber daya untuk sesi bimbingan privat {classData.title}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {classData.materials.map((material) => (
                        <div key={material.id} className="flex items-center gap-2 p-2 hover:bg-muted rounded-md border border-transparent hover:border-border">
                          <div className="bg-primary/10 p-2 rounded-md">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{material.title}</p>
                            <p className="text-xs text-muted-foreground">{material.type.toUpperCase()}</p>
                          </div>
                          <div className="ml-auto flex gap-2">
                            {user.role === "Fasilitator" && (
                              <Button size="sm" variant="outline" className="text-xs">
                                Bagikan
                              </Button>
                            )}
                            <Button size="sm" variant="ghost">
                              Buka
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      {/* Hanya tampilkan untuk fasilitator */}
                      {user.role === "Fasilitator" && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium">Materi Tambahan (Hanya Fasilitator)</h4>
                            <Button size="sm" variant="ghost" className="text-xs">
                              Tambah Materi
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md border">
                            <div className="bg-amber-500/10 p-2 rounded-md">
                              <FileText className="h-5 w-5 text-amber-500" />
                            </div>
                            <div>
                              <p className="font-medium">Panduan Mengajar - Aljabar Linear</p>
                              <p className="text-xs text-muted-foreground">DOKUMEN INTERNAL</p>
                            </div>
                            <Button size="sm" variant="ghost" className="ml-auto">
                              Buka
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Tab Analisis Emosi */}
              <TabsContent value="analytics" className="mt-0">
                <Card>
                  <CardHeader>                    <CardTitle>Analisis Emosi</CardTitle>
                    <CardDescription>
                      Ringkasan emosi terdeteksi selama sesi bimbingan privat
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-4 gap-2">
                        <div className="p-3 bg-background border rounded-md text-center">
                          <div className="flex justify-center">
                            <Smile className="h-5 w-5 text-green-500" />
                          </div>
                          <p className="font-medium mt-1">Senang</p>
                          <p className="text-sm text-muted-foreground">35%</p>
                        </div>
                        <div className="p-3 bg-background border rounded-md text-center">
                          <div className="flex justify-center">
                            <Meh className="h-5 w-5 text-blue-500" />
                          </div>
                          <p className="font-medium mt-1">Netral</p>
                          <p className="text-sm text-muted-foreground">45%</p>
                        </div>
                        <div className="p-3 bg-background border rounded-md text-center">
                          <div className="flex justify-center">
                            <Frown className="h-5 w-5 text-yellow-500" />
                          </div>
                          <p className="font-medium mt-1">Sedih</p>
                          <p className="text-sm text-muted-foreground">10%</p>
                        </div>
                        <div className="p-3 bg-background border rounded-md text-center">
                          <div className="flex justify-center">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          </div>
                          <p className="font-medium mt-1">Takut</p>
                          <p className="text-sm text-muted-foreground">10%</p>
                        </div>
                      </div>
                      
                      {/* Grafik timeline emosi */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Jejak Emosi</h4>
                        <div className="space-y-2">
                          {detectedEmotions.map((entry, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground w-10">{entry.time}</span>
                              <EmotionIndicator emotion={entry.emotion} size="xs" />
                              <span className="text-sm">{entry.emotion}</span>
                              <span className="text-xs text-muted-foreground ml-auto">{entry.duration} detik</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Rekomendasi khusus untuk fasilitator */}
                      {user.role === "Fasilitator" && (
                        <div className="mt-4 p-3 bg-muted rounded-lg border">
                          <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <path d="M12 16v-4"></path>
                              <path d="M12 8h.01"></path>
                            </svg>
                            Saran Pendampingan
                          </h4>
                          <div className="text-sm space-y-2">
                            <p>Siswa menunjukkan pola emosi yang bervariasi. Beberapa saran:</p>
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Perhatikan ekspresi takut pada menit ke-15, mungkin terkait materi vektor.</li>
                              <li>Berikan penguatan positif saat siswa menunjukkan emosi senang.</li>
                              <li>Saat emosi netral dominan (45%), cobalah variasi metode pembelajaran.</li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar kanan */}
          <div className="xl:col-span-1 space-y-4">
            {/* Daftar peserta */}            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{user.role === "Siswa" ? "Fasilitator" : "Siswa"}</CardTitle>
                  <Badge variant="secondary">Sesi Privat</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {participants.length > 0 ? (
                  <div className="space-y-2">
                    {participants.map(participant => (
                      <div
                        key={participant.id}
                        className="flex items-center gap-2 p-3 rounded-md bg-primary/5 border border-primary/10"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="text-sm">
                            {participant.name.split(" ").map(name => name[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">
                              {participant.name}
                              {participant.isRaisingHand && (
                                <span className="ml-2">✋</span>
                              )}
                            </p>
                            <EmotionIndicator
                              emotion={participant.emotion}
                              size="sm"
                              showLabel
                            />
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                            <span className="text-xs text-muted-foreground">Online - {participant.role}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4 text-center text-muted-foreground">
                    <Users className="h-8 w-8 mb-2 opacity-50" />
                    <p>Menunggu {user.role === "Siswa" ? "fasilitator" : "siswa"} bergabung...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informasi kelas */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Informasi Kelas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">                <div className="text-sm">
                  <span className="font-semibold">Fasilitator:</span> {classData.instructor}
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Jadwal:</span> {classData.schedule}
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Tipe Sesi:</span> <span className="text-primary font-medium">Privat (1:1)</span>
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Deskripsi:</span> {classData.description}
                </div>                <div className="text-sm mt-2 bg-primary/10 p-2 rounded-md text-primary">
                  <span className="font-semibold">Catatan:</span> Sesi ini adalah bimbingan belajar privat 1:1 yang dirancang khusus untuk kebutuhan pembelajaran individual.
                </div>
                {user.role === "Fasilitator" && (
                  <div className="text-sm mt-2 bg-amber-500/10 p-2 rounded-md text-amber-700 border border-amber-200">
                    <span className="font-semibold">Tips Fasilitator:</span> Perhatikan emosi siswa selama sesi untuk menyesuaikan pendekatan bimbingan Anda.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}