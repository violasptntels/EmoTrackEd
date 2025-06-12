"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { EmotionIndicator } from "@/components/emotion-indicator"
import { Camera, Mic, MessageSquare, Play, Square, Send, StopCircle, MicIcon } from "lucide-react"

export default function DetectionPage() {
  const [isWebcamActive, setIsWebcamActive] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [chatMessage, setChatMessage] = useState("")
  const [currentEmotion, setCurrentEmotion] = useState("neutral")
  const [audioEmotion, setAudioEmotion] = useState("neutral")
  const [textEmotion, setTextEmotion] = useState("neutral")
  const [recordingTime, setRecordingTime] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const emotionIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioEmotionIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      message: "Halo! Bagaimana perasaan Anda hari ini?",
      sender: "ai",
      emotion: "neutral",
      timestamp: "09:00",
    },
  ])

  // Fungsi untuk memulai demo deteksi webcam
  const startWebcamDemo = () => {
    setIsWebcamActive(true)

    // Mulai simulasi deteksi emosi yang realistis
    emotionIntervalRef.current = setInterval(() => {
      const emotions = ["joy", "sadness", "anger", "fear", "surprise", "neutral"]
      const weights = [0.25, 0.15, 0.1, 0.1, 0.15, 0.25] // Distribusi yang realistis

      const random = Math.random()
      let selectedEmotion = "neutral"

      let cumulativeWeight = 0
      for (let i = 0; i < emotions.length; i++) {
        cumulativeWeight += weights[i]
        if (random <= cumulativeWeight) {
          selectedEmotion = emotions[i]
          break
        }
      }

      setCurrentEmotion(selectedEmotion)
    }, 2500) // Update setiap 2.5 detik untuk terlihat lebih natural
  }

  // Fungsi untuk menghentikan demo webcam
  const stopWebcamDemo = () => {
    setIsWebcamActive(false)
    setCurrentEmotion("neutral")

    if (emotionIntervalRef.current) {
      clearInterval(emotionIntervalRef.current)
    }
  }

  // Fungsi untuk mulai demo recording audio
  const startAudioDemo = () => {
    setIsRecording(true)
    setRecordingTime(0)

    // Timer untuk recording
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1)
    }, 1000)

    // Simulasi deteksi emosi dari audio
    audioEmotionIntervalRef.current = setInterval(() => {
      const emotions = ["joy", "sadness", "anger", "fear", "surprise", "neutral"]
      const weights = [0.2, 0.2, 0.15, 0.15, 0.1, 0.2]

      const random = Math.random()
      let selectedEmotion = "neutral"

      let cumulativeWeight = 0
      for (let i = 0; i < emotions.length; i++) {
        cumulativeWeight += weights[i]
        if (random <= cumulativeWeight) {
          selectedEmotion = emotions[i]
          break
        }
      }

      setAudioEmotion(selectedEmotion)
    }, 2000)
  }

  // Fungsi untuk menghentikan demo recording
  const stopAudioDemo = () => {
    setIsRecording(false)
    setRecordingTime(0)
    setAudioEmotion("neutral")

    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current)
    }
    if (audioEmotionIntervalRef.current) {
      clearInterval(audioEmotionIntervalRef.current)
    }
  }

  // Fungsi untuk analisis emosi dari teks yang lebih akurat
  const analyzeTextEmotion = (text: string) => {
    const lowerText = text.toLowerCase()

    // Kata-kata untuk emosi senang/gembira
    const joyWords = [
      "senang",
      "bahagia",
      "gembira",
      "suka",
      "bagus",
      "hebat",
      "mantap",
      "berhasil",
      "sukses",
      "puas",
      "bangga",
      "excited",
      "antusias",
      "semangat",
      "optimis",
      "percaya diri",
      "lega",
      "syukur",
      "wow",
      "keren",
      "amazing",
      "fantastic",
    ]

    // Kata-kata untuk emosi sedih/kecewa
    const sadnessWords = [
      "sedih",
      "kecewa",
      "down",
      "murung",
      "galau",
      "putus asa",
      "depresi",
      "stress",
      "lelah",
      "capek",
      "bosan",
      "jenuh",
      "kosong",
      "hampa",
      "kehilangan",
      "gagal",
      "kalah",
      "menyesal",
      "hancur",
      "terpuruk",
      "lemah",
    ]

    // Kata-kata untuk emosi marah/kesal
    const angerWords = [
      "marah",
      "kesal",
      "jengkel",
      "dongkol",
      "sebel",
      "benci",
      "muak",
      "geram",
      "frustrated",
      "annoyed",
      "irritated",
      "upset",
      "menyebalkan",
      "tidak adil",
      "sialan",
      "kampret",
      "bangsat",
    ]

    // Kata-kata untuk emosi takut/cemas
    const fearWords = [
      "takut",
      "khawatir",
      "cemas",
      "nervous",
      "was-was",
      "panik",
      "anxiety",
      "worried",
      "scared",
      "afraid",
      "gelisah",
      "resah",
      "tegang",
      "tertekan",
      "deg-degan",
      "grogi",
    ]

    // Kata-kata untuk emosi terkejut
    const surpriseWords = [
      "terkejut",
      "kaget",
      "shock",
      "surprised",
      "amazing",
      "incredible",
      "unbelievable",
      "wow",
      "omg",
      "astaga",
      "waduh",
      "lho",
      "hah",
    ]

    // Hitung skor untuk setiap emosi
    const scores = {
      joy: joyWords.filter((word) => lowerText.includes(word)).length,
      sadness: sadnessWords.filter((word) => lowerText.includes(word)).length,
      anger: angerWords.filter((word) => lowerText.includes(word)).length,
      fear: fearWords.filter((word) => lowerText.includes(word)).length,
      surprise: surpriseWords.filter((word) => lowerText.includes(word)).length,
    }

    // Cari emosi dengan skor tertinggi
    const maxScore = Math.max(...Object.values(scores))

    if (maxScore === 0) {
      return "neutral"
    }

    const dominantEmotion = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] || "neutral"
    return dominantEmotion
  }

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return

    const detectedEmotion = analyzeTextEmotion(chatMessage)
    setTextEmotion(detectedEmotion)

    const newMessage = {
      id: chatHistory.length + 1,
      message: chatMessage,
      sender: "user",
      emotion: detectedEmotion,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    }

    setChatHistory([...chatHistory, newMessage])
    setChatMessage("")

    // Simulasi balasan AI yang lebih natural
    setTimeout(
      () => {
        const responses = {
          joy: [
            "Senang sekali mendengar Anda bahagia! Apa yang membuat Anda merasa senang?",
            "Wah, terlihat Anda sedang dalam mood yang bagus! Ceritakan lebih lanjut dong!",
            "Kebahagiaan Anda menular! Semoga hari Anda terus menyenangkan!",
          ],
          sadness: [
            "Saya turut merasakan kesedihan Anda. Apakah ada yang bisa saya bantu?",
            "Terlihat Anda sedang tidak baik-baik saja. Mau bercerita lebih lanjut?",
            "Saya di sini untuk mendengarkan. Apa yang membuat Anda merasa sedih?",
          ],
          anger: [
            "Saya memahami kekesalan Anda. Mari kita bicarakan apa yang membuat Anda kesal.",
            "Terlihat ada sesuatu yang mengganggu Anda. Mau sharing tentang hal itu?",
            "Marah itu wajar kok. Apa yang terjadi sampai Anda merasa seperti ini?",
          ],
          fear: [
            "Saya memahami kekhawatiran Anda. Mari kita bicarakan lebih lanjut.",
            "Terlihat Anda sedang cemas. Apa yang membuat Anda merasa takut?",
            "Tidak apa-apa merasa khawatir. Mau cerita tentang apa yang Anda takutkan?",
          ],
          surprise: [
            "Wah, terlihat Anda terkejut! Ada kejadian menarik nih?",
            "Sepertinya ada sesuatu yang mengejutkan! Cerita dong apa yang terjadi!",
            "Ekspresi terkejut Anda terlihat jelas! Apa yang membuatnya?",
          ],
          neutral: [
            "Terima kasih sudah berbagi. Ada hal lain yang ingin Anda ceritakan?",
            "Saya mendengarkan. Bagaimana perasaan Anda secara keseluruhan?",
            "Apa lagi yang ingin Anda sampaikan hari ini?",
          ],
        }

        const emotionResponses = responses[detectedEmotion as keyof typeof responses] || responses.neutral
        const randomResponse = emotionResponses[Math.floor(Math.random() * emotionResponses.length)]

        const aiResponse = {
          id: chatHistory.length + 2,
          message: randomResponse,
          sender: "ai",
          emotion: "neutral",
          timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        }
        setChatHistory((prev) => [...prev, aiResponse])
      },
      1000 + Math.random() * 1000,
    ) // Delay yang lebih natural
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Cleanup saat component unmount
  useEffect(() => {
    return () => {
      if (emotionIntervalRef.current) {
        clearInterval(emotionIntervalRef.current)
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
      if (audioEmotionIntervalRef.current) {
        clearInterval(audioEmotionIntervalRef.current)
      }
    }
  }, [])

  return (
    <main className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Deteksi Emosi</h1>
          <p className="text-muted-foreground">Demo deteksi emosi melalui webcam, audio, dan teks secara bersamaan</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
          <div>
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">Mode Demo Aktif</h3>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Aplikasi ini menjalankan simulasi deteksi emosi untuk demonstrasi. Semua fitur berfungsi dengan data
              simulasi yang realistis.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Webcam Detection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Demo Deteksi Webcam
            </CardTitle>
            <CardDescription>Simulasi deteksi emosi real-time melalui ekspresi wajah</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full max-w-sm mx-auto mb-4">
              <div className="aspect-[4/3] bg-muted/30 rounded-lg flex items-center justify-center relative overflow-hidden">
                {isWebcamActive ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/90 to-purple-600/90 flex items-center justify-center text-white rounded-lg">
                    <div className="text-center p-4">
                      <div className="relative">
                        <Camera className="h-12 w-12 mx-auto mb-3 animate-pulse" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                      <p className="text-sm font-medium mb-1">DEMO WEBCAM AKTIF</p>
                      <p className="text-xs opacity-90 mb-2">Simulasi Deteksi Emosi</p>
                      <div className="flex justify-center space-x-1">
                        <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                        <div
                          className="w-1 h-1 bg-white rounded-full animate-pulse"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-1 h-1 bg-white rounded-full animate-pulse"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <Camera className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">Demo webcam tidak aktif</p>
                    <p className="text-xs text-muted-foreground">
                      Klik tombol di bawah untuk memulai simulasi deteksi emosi
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={isWebcamActive ? stopWebcamDemo : startWebcamDemo}
                variant={isWebcamActive ? "destructive" : "default"}
                className="flex-1"
              >
                {isWebcamActive ? (
                  <>
                    <StopCircle className="h-4 w-4 mr-2" />
                    Hentikan Demo
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Mulai Demo Webcam
                  </>
                )}
              </Button>
            </div>

            {isWebcamActive && (
              <div className="mt-4 text-center">
                <EmotionIndicator emotion={currentEmotion} size="md" showLabel />
                <p className="text-xs text-muted-foreground mt-2">Emosi terdeteksi (simulasi)</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Audio Detection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Demo Deteksi Audio
            </CardTitle>
            <CardDescription>Simulasi deteksi emosi melalui intonasi suara</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full max-w-sm mx-auto mb-4">
              <div className="aspect-[4/3] bg-muted/30 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  {isRecording ? (
                    <div className="animate-pulse">
                      <div className="h-12 w-12 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center relative">
                        <MicIcon className="h-6 w-6 text-white" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                      </div>
                      <p className="text-red-500 font-medium text-sm">Demo Recording...</p>
                      <p className="text-xs text-muted-foreground mb-2">{formatTime(recordingTime)}</p>
                      <div className="flex justify-center mt-2">
                        <div className="flex space-x-1">
                          {[...Array(7)].map((_, i) => (
                            <div
                              key={i}
                              className="w-1 bg-red-500 rounded animate-pulse"
                              style={{
                                height: `${Math.random() * 25 + 8}px`,
                                animationDelay: `${i * 150}ms`,
                                animationDuration: `${800 + Math.random() * 400}ms`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Mic className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-1">Demo audio tidak aktif</p>
                      <p className="text-xs text-muted-foreground">Simulasi deteksi emosi dari suara</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={isRecording ? stopAudioDemo : startAudioDemo}
                variant={isRecording ? "destructive" : "default"}
                className="flex-1"
              >
                {isRecording ? (
                  <>
                    <Square className="h-4 w-4 mr-2" />
                    Hentikan Demo
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Mulai Demo Audio
                  </>
                )}
              </Button>
            </div>
            {isRecording && (
              <div className="mt-4 text-center">
                <EmotionIndicator emotion={audioEmotion} size="md" showLabel />
                <p className="text-xs text-muted-foreground mt-2">Emosi dari audio (simulasi)</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Detection */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Chat AI dengan Deteksi Emosi
            </CardTitle>
            <CardDescription>Berinteraksi dengan AI dan deteksi emosi dari teks Anda (berfungsi penuh)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 border rounded-lg p-4 overflow-y-auto mb-4 space-y-3 bg-muted/20">
              {chatHistory.map((chat) => (
                <div key={chat.id} className={`flex gap-3 ${chat.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                      chat.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background border border-border"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <EmotionIndicator emotion={chat.emotion} size="sm" />
                      <span className="text-xs opacity-70">{chat.timestamp}</span>
                    </div>
                    <p className="text-sm">{chat.message}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Ketik pesan Anda... (coba: 'saya senang sekali', 'saya sedih', 'saya marah', 'wah kaget!')"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!chatMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Combined Emotion Status */}
        <Card>
          <CardHeader>
            <CardTitle>Status Emosi Terkini</CardTitle>
            <CardDescription>Gabungan hasil deteksi dari semua sumber</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Webcam Emotion */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Demo Webcam</span>
                <span className="text-xs text-muted-foreground">{isWebcamActive ? "Aktif" : "Tidak Aktif"}</span>
              </div>
              {isWebcamActive ? (
                <div className="text-center">
                  <EmotionIndicator emotion={currentEmotion} size="md" showLabel />
                  <p className="text-xs text-muted-foreground mt-1">Simulasi real-time</p>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <Camera className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Demo tidak aktif</p>
                </div>
              )}
            </div>

            {/* Audio Emotion */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Demo Audio</span>
                <span className="text-xs text-muted-foreground">{isRecording ? "Recording" : "Tidak Aktif"}</span>
              </div>
              {isRecording ? (
                <div className="text-center">
                  <EmotionIndicator emotion={audioEmotion} size="md" showLabel />
                  <p className="text-xs text-muted-foreground mt-1">{formatTime(recordingTime)}</p>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <Mic className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Demo tidak aktif</p>
                </div>
              )}
            </div>

            {/* Text Emotion */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Deteksi Teks</span>
                <span className="text-xs text-muted-foreground">
                  {chatHistory.length > 1 ? "Aktif" : "Belum Ada Data"}
                </span>
              </div>
              {chatHistory.length > 1 ? (
                <div className="text-center">
                  <EmotionIndicator emotion={textEmotion} size="md" showLabel />
                  <p className="text-xs text-muted-foreground mt-1">Dari chat terakhir</p>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Mulai chat untuk deteksi</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
