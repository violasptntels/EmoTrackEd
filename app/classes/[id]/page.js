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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import { useParams, useRouter } from "next/navigation"

// Import camera utility functions
import { createMockVideoStream, getUserVideoStream, stopMediaStream, cleanupVideoElement, getWebcamErrorMessage, testCameraAccess } from "../camera-utils"
import { useRouter as useNavigationRouter } from "next/navigation"

export default function ClassDetailPage() {
  const params = useParams()
  const router = useRouter()
  const navigationRouter = useNavigationRouter()
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
  const [showDiagnostics, setShowDiagnostics] = useState(false) // State for showing/hiding diagnostic dialog
  
  // Function to run camera diagnostics and show results in a dialog
  const runCameraDiagnostic = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      console.log("Running camera diagnostic...");
      const results = await testCameraAccess();
      
      // Show diagnostics dialog with the results
      setShowDiagnostics(true);
      setIsLoading(false);
      
      // Log results
      console.log("Diagnostic results:", results);
      
      // Show appropriate error if diagnostics failed
      if (!results.success) {
        setError(`Diagnostik gagal: ${results.message}`);
      } else {
        setError(""); // Clear any existing errors
      }
      
      return results;
    } catch (err) {
      console.error("Error running camera diagnostic:", err);
      setError(`Error saat melakukan diagnostik kamera: ${err.message}`);
      setIsLoading(false);
      return null;
    }
  };
  
  // Function to open camera fix page
  const openCameraFixTool = () => {
    navigationRouter.push('/classes/camera-fix');
  };
  
  // Additional states for meeting experience
  const [isMeetingRecording, setIsMeetingRecording] = useState(user?.role === "Fasilitator")
  const [meetingDuration, setMeetingDuration] = useState(0)
  // State for videoRef readiness
  const [isVideoRefReady, setIsVideoRefReady] = useState(false)

  // Make sure videoRef is ready
  useEffect(() => {
    if (videoRef && videoRef.current) {
      setIsVideoRefReady(true);
      console.log("videoRef is ready");
    }
  }, [videoRef?.current]);

  // State untuk melacak emosi selama sesi kelas
  const [emotionData, setEmotionData] = useState([])
  const [dominantEmotion, setDominantEmotion] = useState("neutral")
  const [showReflectionPrompt, setShowReflectionPrompt] = useState(false)
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
        
        // Simpan data emosi setiap kali terdeteksi
        saveEmotionData(randomEmotion)
        
        // Update emosi dominan
        const dominant = calculateDominantEmotion()
        setDominantEmotion(dominant)
      }, 3000)
    }

    return () => {
      if (emotionInterval) clearInterval(emotionInterval)
    }
  }, [isVideoOn, emotionData])  // Simulasi sesi privat selesai setelah beberapa waktu (hanya untuk demo)
  useEffect(() => {
    if (user.role === "Siswa") {
      // Simulasi sesi selesai setelah 60 detik (untuk demonstrasi)
      const classEndTimer = setTimeout(() => {
        setIsClassFinished(true)
        if (isVideoOn) {
          stopWebcam()
        }
        setError("Sesi bimbingan privat telah selesai. Fasilitator telah mengakhiri sesi.")
        
        // Tampilkan prompt refleksi setelah sesi berakhir
        setTimeout(() => {
          setShowReflectionPrompt(true)
        }, 1500)
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

  // Diagnostics dialog component
  const DiagnosticsDialog = () => {
    const [diagnosticResults, setDiagnosticResults] = useState(null);
    
    // Run diagnostics when dialog is shown
    useEffect(() => {
      if (showDiagnostics) {
        const runDiagnostics = async () => {
          try {
            const results = await testCameraAccess();
            setDiagnosticResults(results);
          } catch (err) {
            console.error("Error in dialog diagnostics:", err);
          }
        };
        
        runDiagnostics();
      }
    }, [showDiagnostics]);
    
    return (
      <Dialog open={showDiagnostics} onOpenChange={setShowDiagnostics}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Hasil Diagnostik Kamera</DialogTitle>
            <DialogDescription>
              Hasil pemeriksaan kamera dan perangkat media
            </DialogDescription>
          </DialogHeader>
          
          {!diagnosticResults ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${diagnosticResults.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <h3 className="font-medium">
                  Status: {diagnosticResults.success ? "Berhasil" : "Gagal"}
                </h3>
              </div>
              
              <p>{diagnosticResults.message}</p>
              
              {diagnosticResults.devices && diagnosticResults.devices.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Perangkat kamera terdeteksi:</h4>
                  <ul className="list-disc pl-6">
                    {diagnosticResults.devices.map((device, index) => (
                      <li key={index}>{device.label || `Kamera ${index + 1}`}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setShowDiagnostics(false)}>
                  Tutup
                </Button>
                
                <Button onClick={() => window.open('/classes/camera-fix', '_blank')}>
                  Buka Tool Diagnostik Lengkap
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  };

  // Fungsi untuk menyimpan data emosi ke localStorage
  const saveEmotionData = (emotion) => {
    const now = new Date()
    const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    
    // Update emotion data array
    const newEmotionData = [
      ...emotionData,
      { time: timeString, emotion, timestamp: now.getTime() }
    ]
    
    setEmotionData(newEmotionData)
    
    // Simpan ke localStorage
    try {
      // Ambil data emosi yang sudah ada
      const existingDataString = localStorage.getItem('emotionDataHistory') || '[]'
      let existingData = JSON.parse(existingDataString)
      
      // Format data untuk disimpan
      const sessionData = {
        sessionId: params.id,
        className: classData.title,
        date: now.toLocaleDateString('id-ID'),
        emotions: newEmotionData,
        duration: meetingDuration,
        withFacilitator: classData.instructor
      }
      
      // Cek apakah sudah ada data untuk sesi ini
      const existingSessionIndex = existingData.findIndex(item => item.sessionId === params.id)
      
      if (existingSessionIndex >= 0) {
        // Update data sesi yang sudah ada
        existingData[existingSessionIndex] = sessionData
      } else {
        // Tambah data sesi baru
        existingData.push(sessionData)
      }
      
      // Batasi hanya menyimpan 10 sesi terakhir
      if (existingData.length > 10) {
        existingData = existingData.slice(-10)
      }
      
      // Simpan kembali ke localStorage
      localStorage.setItem('emotionDataHistory', JSON.stringify(existingData))
      
    } catch (error) {
      console.error("Error saving emotion data:", error)
    }
  }
  
  // Fungsi untuk menghitung emosi dominan
  const calculateDominantEmotion = () => {
    if (emotionData.length === 0) return "neutral"
    
    // Hitung frekuensi masing-masing emosi
    const emotionCounts = emotionData.reduce((counts, item) => {
      counts[item.emotion] = (counts[item.emotion] || 0) + 1
      return counts
    }, {})
    
    // Cari emosi dengan frekuensi tertinggi
    let maxCount = 0
    let dominantEmotion = "neutral"
    
    Object.entries(emotionCounts).forEach(([emotion, count]) => {
      if (count > maxCount) {
        maxCount = count
        dominantEmotion = emotion
      }
    })
    
    return dominantEmotion
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
  }  // Import functions from camera-utils.js
  const getMockVideoStream = () => createMockVideoStream(setCurrentEmotion);  // Function to start webcam
const startWebcam = async (retry = 0) => {
  if (!videoRef.current) {
    console.warn("videoRef not available at start of startWebcam, will try with delay");

    if (retry < 5) { // Coba maksimal 5x
      setTimeout(() => startWebcam(retry + 1), 500);
    } else {
      console.error("videoRef masih null setelah beberapa kali percobaan.");
    }
    return;
  }

  setIsLoading(true);
  try {
    // Tambahan: Periksa apakah API mediaDevices tersedia
    if (!navigator.mediaDevices) {
      console.error("MediaDevices API tidak tersedia di browser ini");
      setErrorMessage("Browser Anda tidak mendukung akses kamera. Silakan gunakan mode simulasi atau browser modern lainnya.");
      setIsLoading(false);
      return;
    }
    
    // Periksa perangkat yang tersedia
    let videoDevices = [];
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      videoDevices = devices.filter(device => device.kind === 'videoinput');
      console.log("Device kamera yang tersedia:", videoDevices);

      // Jika tidak ada kamera, berikan error khusus
      if (videoDevices.length === 0) {
        console.warn("Tidak ada perangkat kamera yang ditemukan");
      }
    } catch (enumError) {
      console.error("Gagal mendapatkan daftar perangkat kamera:", enumError);
      // Lanjut mencoba getUserMedia tanpa device info
    }

    // Check if we're using simulation mode (from localStorage or by URL parameter)
    const useMockCamera = localStorage.getItem('useMockCamera') === 'true';

    let mediaStream;

    // If not simulation mode, try to get real camera
    if (!useMockCamera) {
      try {
        console.log("Mengakses kamera nyata...");
        // Use our new function to get a user video stream (real webcam)
        mediaStream = await getUserVideoStream(setCurrentEmotion);

        if (!mediaStream) {
          console.warn("Could not get user video stream, falling back to mock");
          // Fall back to mock stream
          mediaStream = getMockVideoStream();
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        const errorMessage = getWebcamErrorMessage(err);
        setError(errorMessage);
        // Fall back to mock stream
        mediaStream = getMockVideoStream();
      }
    } else {
      // Use mock camera if explicitly requested
      console.log("Using mock camera for simulation mode");
      mediaStream = getMockVideoStream();
    }

    // Set the stream to state and video element
    if (mediaStream) {
      console.log("Media stream diperoleh:", mediaStream);
      setStream(mediaStream);

      // Perpanjang loading state untuk memastikan DOM siap
      setIsLoading(true);

      // Delay sedikit untuk memastikan DOM siap
      setTimeout(() => {
        setupVideoElement();
      }, 200);

      // Function to safely setup video element
      function setupVideoElement() {
        // Double check videoRef
        if (!videoRef || !videoRef.current) {
          console.warn("videoRef tidak tersedia - mencoba lagi dalam 500ms");

          // Tunggu lebih lama, mungkin DOM masih dirender
          setTimeout(() => {
            if (!videoRef || !videoRef.current) {
              console.error("videoRef masih tidak tersedia setelah delay");
              setError("Element video tidak dapat diakses. Coba muat ulang halaman.");
              setIsLoading(false);
              return;
            }

            // Retry setup
            trySetupVideo();
          }, 500);
          return;
        }

        trySetupVideo();
      }
      // Function that actually sets up the video
      function trySetupVideo() {
        try {
          if (!videoRef || !videoRef.current) {
            console.warn("videoRef masih tidak tersedia setelah delay");

            // Try one more time with longer delay
            setTimeout(() => {
              if (!videoRef || !videoRef.current) {
                setError("Element video tidak tersedia setelah beberapa kali percobaan. Coba gunakan alat diagnostik.");
                setIsLoading(false);
                return;
              }
              trySetupVideo();
            }, 1000);
            return;
          }

          console.log("Mencoba memasang stream ke video");
          videoRef.current.srcObject = mediaStream;
          videoRef.current.muted = true;
          videoRef.current.autoplay = true;
          videoRef.current.playsInline = true;
          videoRef.current.setAttribute('playsinline', '');
          videoRef.current.setAttribute('webkit-playsinline', '');
          videoRef.current.style.objectFit = 'cover';

          videoRef.current.onloadedmetadata = () => {
            console.log("Video metadata loaded - mencoba play");
            videoRef.current.play()
              .then(() => {
                console.log("Video berhasil diputar");
                setIsVideoOn(true);
                setIsLoading(false);
                setError("");
              })
              .catch(playErr => {
                console.warn("Error playing video:", playErr);

                // Retry with a delay
                setTimeout(() => {
                  videoRef.current.play()
                    .then(() => {
                      console.log("Video berhasil diputar pada percobaan kedua");
                      setIsVideoOn(true);
                      setIsLoading(false);
                    })
                    .catch(err2 => {
                      console.error("Video masih gagal diputar:", err2);
                      setError("Tidak dapat memutar video. Coba gunakan mode simulasi.");
                      setIsLoading(false);
                    });
                }, 300);
              });
          };

          // Safety timeout if metadata never loads
          setTimeout(() => {
            if (isLoading) {
              console.warn("Timeout waiting for metadata - mencoba play langsung");
              videoRef.current.play().catch(err => {
                console.warn("Error on direct play:", err);
              });
              setIsLoading(false);
              setIsVideoOn(true);
            }
          }, 3000);

        } catch (setupErr) {
          console.error("Error dalam setup video:", setupErr);
          setError(`Error saat setup video: ${setupErr.message}`);
          setIsLoading(false);
        }
      }
    } else {
      // No media stream available
      console.error("Tidak mendapatkan media stream");
      setError("Tidak dapat mengakses kamera. Coba mode simulasi.");
      setIsLoading(false);

      // Try mock camera as last resort
      const mockStream = getMockVideoStream();
      if (mockStream) {
        setStream(mockStream);
        if (videoRef && videoRef.current) {
          videoRef.current.srcObject = mockStream;
          videoRef.current.play()
            .then(() => {
              setIsVideoOn(true);
              setError("Menggunakan mode simulasi karena kamera tidak dapat diakses");
            })
            .catch(err => {
              setError("Gagal memutar video simulasi: " + err.message);
            });
        }
        setIsLoading(false);
      }
    }
  } catch (err) {
    console.error("Fatal error in startWebcam:", err);

    // As a last resort, try mock camera without showing an error
    const mockStream = getMockVideoStream();

    if (mockStream) {
      setStream(mockStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mockStream;
      }

      setIsVideoOn(true);
      setIsAudioOn(true);
      setIsLoading(false);
      setError("Mode simulasi diaktifkan karena kamera tidak dapat diakses.");
    } else {
      setError(
        "Tidak dapat mengakses kamera. Silakan periksa izin dan pastikan tidak ada aplikasi lain yang menggunakan kamera."
      );
      setIsLoading(false);
    }
  }
};

const stopWebcam = () => {
    try {
      if (stream) {
        // Use the imported utility function to stop the stream
        stopMediaStream(stream);
        setStream(null);
      }
      
      // Clean up video element using the imported utility function
      if (videoRef.current) {
        cleanupVideoElement(videoRef.current);
      }
    } catch (err) {
      console.error("Error in stopWebcam:", err);
    } finally {
      // Always update the UI state
      setIsVideoOn(false);
      setIsAudioOn(false);
    }
  }
  
  const toggleAudio = async () => {
    try {
      // Jika tidak ada stream atau tidak ada audio tracks, coba dapatkan audio
      if (!stream || stream.getAudioTracks().length === 0) {
        try {
          // Coba dapatkan akses ke mikrofon dengan beberapa opsi fallback
          let audioStream;
          
          try {
            audioStream = await navigator.mediaDevices.getUserMedia({
              audio: { 
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
              }
            });
          } catch (err) {
            console.warn("Could not access microphone with advanced settings, trying basic settings:", err);
            audioStream = await navigator.mediaDevices.getUserMedia({
              audio: true
            });
          }
          
          // Tambahkan track audio ke stream yang ada
          if (stream) {
            try {
              const audioTracks = audioStream.getAudioTracks();
              audioTracks.forEach(track => {
                try {
                  stream.addTrack(track);
                } catch (addTrackErr) {
                  console.error("Error adding audio track:", addTrackErr);
                  
                  // Jika gagal menambah track, gunakan pendekatan alternatif
                  if (videoRef.current) {
                    const combinedStream = new MediaStream();
                    stream.getTracks().forEach(track => combinedStream.addTrack(track));
                    audioTracks.forEach(track => combinedStream.addTrack(track));
                    
                    videoRef.current.srcObject = combinedStream;
                    setStream(combinedStream);
                  }
                }
              });
            } catch (trackErr) {
              console.error("Error processing audio tracks:", trackErr);
            }
          } else {
            // Jika tidak ada stream sama sekali, gunakan audioStream
            setStream(audioStream);
          }
          
          // Aktifkan audio
          setIsAudioOn(true);
          console.log("Mikrofon berhasil diaktifkan");
        } catch (err) {
          console.error("Error accessing microphone:", err);
          setError("Gagal mengakses mikrofon. Periksa izin browser atau perangkat mikrofon Anda.");
          return;
        }
      } else {
        // Toggle audio dari stream yang ada
        const newAudioState = !isAudioOn;
        setIsAudioOn(newAudioState);
        
        try {
          stream.getAudioTracks().forEach(track => {
            track.enabled = newAudioState;
          });
          
          // Tampilkan pesan status
          console.log(`Mikrofon ${newAudioState ? 'aktif' : 'mati'}`);
        } catch (trackErr) {
          console.error("Error toggling audio tracks:", trackErr);
          setError("Gagal mengubah status mikrofon");
        }
      }
    } catch (e) {
      console.error("Unexpected error in toggleAudio:", e);
      setError("Terjadi kesalahan saat mengakses mikrofon");
    }
  }
  // Screen sharing dan raise hand feature telah dihapus

  const toggleMeetingRecording = () => {
    setIsMeetingRecording(!isMeetingRecording)
  }  // Handler untuk menyelesaikan sesi kelas privat
  // Perbaikan untuk function handleFinishSession
const handleFinishSession = () => {
  // Stop webcam if it's on
  if (isVideoOn) {
    stopWebcam();
  }
  
  // Calculate session duration and dominant emotions
  const sessionDuration = meetingDuration;
  const dominantEmotionResult = calculateDominantEmotion();
  
  // Create a summary of the session
  const sessionSummary = {
    sessionId: params.id,
    className: classData.title,
    instructor: classData.instructor,
    date: new Date().toLocaleDateString('id-ID'),
    startTime: classData.startTime,
    endTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    duration: formatMeetingDuration(sessionDuration),
    emotions: emotionData,
    dominantEmotion: dominantEmotionResult,
    participants: participants.length
  };
  
  // Save session data to localStorage for reports
  try {
    // Get existing emotion report data or initialize new array
    const existingReportsStr = localStorage.getItem('emotionReports') || '[]';
    const existingReports = JSON.parse(existingReportsStr);
    
    // Add new session report
    existingReports.push(sessionSummary);
    
    // Limit to last 50 reports
    const limitedReports = existingReports.slice(-50);
    
    // Save back to localStorage
    localStorage.setItem('emotionReports', JSON.stringify(limitedReports));
    
    console.log('Session emotion data saved successfully');
  } catch (error) {
    console.error('Error saving session emotion data:', error);
  }
  
  // Mark session as finished
  setClassSessionFinished(true);
  
  // Perbedaan perilaku berdasarkan peran pengguna
  if (user.role === 'Siswa') {
    // Untuk siswa, tampilkan prompt refleksi
    setShowReflectionPrompt(true);
  } else if (user.role === 'Fasilitator') {
    // Untuk fasilitator, arahkan ke halaman analisis emosi
    router.push('/facilitator/emotions');
  } else {
    // Untuk pengunjung atau peran lain, kembali ke halaman kelas
    router.push('/reflection');
  }
};  // Function to handle reflection submission after class
  const handleReflectionSubmit = async (reflectionText, classData, emotionValue = "neutral") => {
    return new Promise((resolve, reject) => {
      try {
        // Create reflection data
        const reflectionData = {
          id: Date.now(),
          sessionId: params.id,
          className: classData.title,
          date: new Date().toLocaleDateString('id-ID'),
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          content: reflectionText,
          emotion: emotionValue, // Use provided emotion or default
          student: user.name,
          instructor: classData.instructor
        };
        
        // Get existing reflections or initialize new array
        const existingReflectionsStr = localStorage.getItem('reflections') || '[]';
        const existingReflections = JSON.parse(existingReflectionsStr);
        
        // Add new reflection
        existingReflections.push(reflectionData);
        
        // Save back to localStorage
        localStorage.setItem('reflections', JSON.stringify(existingReflections));
        
        console.log('Reflection saved successfully');
        
        // Add a small timeout to simulate async saving
        setTimeout(() => {
          // Redirect to reflection page to see all reflections
          router.push('/reflection');
          resolve(reflectionData);
        }, 500);
      } catch (error) {
        console.error('Error saving reflection:', error);
        reject(error);
      }
    });
  };
  
  // Fungsi untuk menampilkan prompt refleksi (untuk siswa)
  const showReflection = () => {
    if (user.role === "Siswa") {
      setShowReflectionPrompt(true)
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

              <CardContent className="p-0 relative bg-black flex flex-col items-center justify-center space-y-4">
  <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-muted">
    {/* Elemen video selalu dirender, agar ref tidak null */}
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      className="w-full h-full object-cover bg-black"
    />
  </div>

  <Button
    size="icon"
    className={`h-10 w-10 rounded-full ${isVideoOn ? 'bg-primary hover:bg-primary/90' : 'bg-muted-foreground/20'}`}
    onClick={() => isVideoOn ? stopWebcam() : startWebcam()}
    disabled={isLoading || classSessionFinished || isClassFinished}
  >
    {isVideoOn ? "🛑" : "📷"}
  </Button>
</CardContent>
              {/* Kontrol media */}
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
                  </span>                  <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-2 w-2 rounded-full ${isAudioOn ? 'bg-green-500' : 'bg-red-500'}`}></div>                </div>
                
                {/* Tombol diagnostic dengan tooltip */}
                <div className="relative group">
                  <Button
                    size="icon"
                    className="h-10 w-10 rounded-full bg-muted-foreground/20"
                    onClick={runCameraDiagnostic}
                    disabled={isLoading || classSessionFinished || isClassFinished}
                  >
                    <AlertCircle className="h-5 w-5" />
                  </Button>
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background text-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-md whitespace-nowrap">
                    Diagnostik Kamera
                  </span>
                </div>
                
                {/* Fitur berbagi layar dan angkat tangan telah dihapus */}
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
                          <div className="flex items-center justify-between">                            <p className="font-medium">
                              {participant.name}
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
        {/* Dialog Refleksi (untuk siswa setelah sesi selesai) */}      
      <Dialog open={showReflectionPrompt} onOpenChange={setShowReflectionPrompt}>
        <DialogContent className="sm:max-w-md" aria-describedby="session-finished-description">
          <DialogHeader>
            <DialogTitle>Sesi Bimbingan Selesai</DialogTitle>
            <DialogDescription id="session-finished-description">
              Refleksi pembelajaran setelah sesi kelas virtual
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center py-4">
            <div className="mb-4">
              <EmotionIndicator emotion={dominantEmotion} size="lg" showLabel />
            </div>
            
            <h3 className="text-lg font-semibold mb-2">Refleksi Pembelajaran</h3>
            <p className="text-center mb-4 text-muted-foreground">
              Sesi bimbingan privat Anda telah selesai. Emosi dominan Anda selama sesi adalah <span className="font-semibold text-primary">{dominantEmotion}</span>.
            </p>
            <p className="text-center mb-6">
              Luangkan waktu untuk mencatat refleksi pembelajaran Anda untuk meningkatkan pengalaman belajar berikutnya.
            </p>
            
            <div className="w-full flex flex-col sm:flex-row gap-2">
              <Button 
                variant="default" 
                className="flex-1" 
                onClick={() => {
                  setShowReflectionPrompt(false)
                  router.push('/reflection')
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                Buat Refleksi Sekarang
              </Button>
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => {
                  setShowReflectionPrompt(false)
                  router.push('/dashboard')
                }}
              >
                Nanti Saja
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Dialog Diagnostik Kamera */}
      <DiagnosticsDialog />
    </div>
  )
}

// Reflection Dialog Component
const ReflectionDialog = ({ isOpen, onClose, classData, dominantEmotion }) => {
  const [reflectionText, setReflectionText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emotion = dominantEmotion || "neutral"; // Provide a default value
  const router = useRouter(); // Get router inside component
  
  const handleSubmit = async () => {
    if (reflectionText.trim().length < 10) {
      alert("Silakan tulis refleksi minimal 10 karakter.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create reflection data
      const reflectionData = {
        id: Date.now(),
        sessionId: classData?.id || 'unknown',
        className: classData?.title || 'Unknown Class',
        date: new Date().toLocaleDateString('id-ID'),
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        content: reflectionText,
        emotion: emotion,
        student: localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")).name : "Student",
        instructor: classData?.instructor || 'Unknown Instructor'
      };
      
      // Save reflection to localStorage
      try {
        // Get existing reflections or initialize new array
        const existingReflectionsStr = localStorage.getItem('reflections') || '[]';
        const existingReflections = JSON.parse(existingReflectionsStr);
        
        // Add new reflection
        existingReflections.push(reflectionData);
        
        // Save back to localStorage
        localStorage.setItem('reflections', JSON.stringify(existingReflections));
        
        console.log('Reflection saved successfully');
        
        // Close dialog and redirect
        onClose();
        setTimeout(() => {
          router.push('/reflection');
        }, 500);
      } catch (error) {
        console.error("Error saving reflection:", error);
      }
    } catch (error) {
      console.error("Error submitting reflection:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" aria-describedby="reflection-dialog-description">        <DialogHeader>
          <DialogTitle>Refleksi Kelas</DialogTitle>          <DialogDescription id="reflection-dialog-description">
            Bagikan pengalaman dan refleksi Anda tentang sesi kelas yang baru saja selesai.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Kelas</h4>
            <p className="text-sm">{classData?.title}</p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Fasilitator</h4>
            <p className="text-sm">{classData?.instructor}</p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Emosi Dominan</h4>
            <div className="flex items-center gap-2">
              <EmotionIndicator emotion={emotion} size="sm" />
              <span className="text-sm capitalize">{emotion}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Refleksi Anda</h4>
            <textarea
              className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Bagaimana perasaan Anda tentang kelas ini? Apa yang Anda pelajari? Adakah yang masih membingungkan?"
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Batalkan
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || reflectionText.trim().length < 10}>
            {isSubmitting ? "Menyimpan..." : "Kirim Refleksi"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};