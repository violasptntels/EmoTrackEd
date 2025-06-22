"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { EmotionIndicator } from "@/components/emotion-indicator"
import { Send, Calendar, Clock, CheckCircle, Download, FileText } from "lucide-react"

export default function ReflectionPage() {
  // Page title for student personal reflection
  document.title = "[SISWA] Buat Refleksi Baru";
  
  const [reflection, setReflection] = useState("")
  const [classId, setClassId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [analyzedEmotion, setAnalyzedEmotion] = useState(null)

  // Data kelas virtual yang sudah selesai dan belum diisi refleksi
  const completedClasses = [
    { id: "math-001", name: "Matematika Dasar - Aljabar Linear", date: "12 Jun 2025", time: "09:00-10:30" },
    { id: "eng-001", name: "Bahasa Inggris - Grammar Tenses", date: "11 Jun 2025", time: "14:00-15:30" },
    { id: "sci-001", name: "Ilmu Alam - Fotosintesis", date: "10 Jun 2025", time: "16:00-17:30" },
  ]

  // Default reflections data
  const defaultReflections = [
    {
      id: 1,
      date: "12 Jun 2025",
      time: "10:45",
      content:
        "Hari ini saya merasa sangat senang karena berhasil memahami konsep aljabar linear dengan baik. Penjelasan dosen sangat jelas dan interaktif. Saya merasa percaya diri untuk menghadapi ujian berikutnya.",
      emotion: "joy",
      className: "Matematika Dasar - Aljabar Linear",
      classId: "math-001",
      summary: "Perasaan senang dan percaya diri setelah memahami konsep aljabar linear dengan baik.",
    },
    {
      id: 2,
      date: "11 Jun 2025",
      time: "15:45",
      content:
        "Saya sedikit kesulitan dengan materi grammar tenses, terutama perfect tense. Namun saya akan belajar lebih giat dan bertanya kepada dosen di sesi berikutnya.",
      emotion: "sadness",
      className: "Bahasa Inggris - Grammar Tenses",
      classId: "eng-001",
      summary: "Kesulitan dengan materi grammar tenses, namun ada tekad untuk belajar lebih giat.",
    },
    {
      id: 3,
      date: "10 Jun 2025",
      time: "17:45",
      content:
        "Materi fotosintesis sangat menarik! Saya bisa memahami proses kompleks ini dengan bantuan animasi yang ditampilkan. Diskusi kelompok juga sangat membantu.",
      emotion: "joy",
      className: "Ilmu Alam - Fotosintesis",
      classId: "sci-001",
      summary: "Antusias dengan materi fotosintesis dan terbantu dengan metode pembelajaran interaktif.",
    },
  ]
  
  const [reflections, setReflections] = useState([])
  
  // Load reflections from localStorage on component mount
  useEffect(() => {
    const savedReflections = localStorage.getItem("userReflections")
    if (savedReflections) {
      const loadedReflections = JSON.parse(savedReflections);
      setReflections(loadedReflections);
      
      // Make sure reflection stats are in sync with the actual reflections count
      const reflectionStats = {
        completed: loadedReflections.length,
        pending: 1 // Assuming there's always one pending reflection for active classes
      };
      localStorage.setItem("reflectionStats", JSON.stringify(reflectionStats));
    } else {
      // Initialize with default data if no saved reflections exist
      setReflections(defaultReflections)
      localStorage.setItem("userReflections", JSON.stringify(defaultReflections))
      
      // Initialize reflection stats based on default reflections
      const reflectionStats = {
        completed: defaultReflections.length,
        pending: 1 // Assuming there's always one pending reflection for active classes
      };
      localStorage.setItem("reflectionStats", JSON.stringify(reflectionStats));
    }
  }, [])

  // Fungsi analisis emosi yang lebih akurat
  const analyzeEmotion = (text) => {
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
      "grateful",
      "amazing",
      "wonderful",
      "fantastic",
      "menarik",
      "memahami",
      "jelas",
      "interaktif",
    ]

    // Kata-kata untuk emosi sedih/kecewa/kesulitan
    const sadnessWords = [
      "sedih",
      "kecewa",
      "down",
      "murung",
      "galau",
      "putus asa",
      "hopeless",
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
      "rugi",
      "menyesal",
      "penyesalan",
      "kesulitan",
      "sulit",
      "bingung",
      "tidak paham",
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
      "furious",
      "annoyed",
      "frustrated",
      "irritated",
      "angry",
      "mad",
      "upset",
      "pissed",
      "annoying",
      "menyebalkan",
      "tidak adil",
    ]

    // Kata-kata untuk emosi takut/cemas
    const fearWords = [
      "takut",
      "khawatir",
      "cemas",
      "nervous",
      "was-was",
      "panik",
      "panic",
      "anxiety",
      "worried",
      "scared",
      "afraid",
      "concern",
      "gelisah",
      "resah",
      "tegang",
      "stress",
      "tertekan",
      "overwhelmed",
    ]

    // Kata-kata untuk emosi terkejut
    const surpriseWords = [
      "terkejut",
      "kaget",
      "shocked",
      "surprised",
      "wow",
      "amazing",
      "incredible",
      "unbelievable",
      "unexpected",
      "mendadak",
      "tiba-tiba",
    ]

    // Kata-kata untuk emosi jijik/muak
    const disgustWords = [
      "jijik",
      "muak",
      "mual",
      "disgusting",
      "gross",
      "yuck",
      "eww",
      "menjijikkan",
      "tidak suka",
      "benci",
      "menolak",
    ]

    // Hitung skor untuk setiap emosi
    const scores = {
      joy: joyWords.filter((word) => lowerText.includes(word)).length,
      sadness: sadnessWords.filter((word) => lowerText.includes(word)).length,
      anger: angerWords.filter((word) => lowerText.includes(word)).length,
      fear: fearWords.filter((word) => lowerText.includes(word)).length,
      surprise: surpriseWords.filter((word) => lowerText.includes(word)).length,
      disgust: disgustWords.filter((word) => lowerText.includes(word)).length,
    }

    // Cari emosi dengan skor tertinggi
    const maxScore = Math.max(...Object.values(scores))

    if (maxScore === 0) {
      return "neutral"
    }

    const dominantEmotion = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] || "neutral"
    return dominantEmotion
  }

  // Fungsi untuk generate summary otomatis
  const generateSummary = (text, emotion) => {
    const emotionDescriptions = {
      joy: "Menunjukkan perasaan positif dan kepuasan terhadap pembelajaran",
      sadness: "Mengekspresikan kesulitan atau tantangan dalam pembelajaran",
      anger: "Menunjukkan rasa frustasi terhadap materi atau metode pembelajaran",
      fear: "Mengungkapkan kekhawatiran atau kecemasan dalam proses belajar",
      surprise: "Menunjukkan rasa kagum atau terkejut dengan materi pembelajaran",
      disgust: "Mengekspresikan ketidaknyamanan dengan aspek pembelajaran",
      neutral: "Menunjukkan keadaan emosi yang stabil dan objektif terhadap pembelajaran",
    }

    const words = text.split(" ")
    const shortText = words.length > 15 ? words.slice(0, 15).join(" ") + "..." : text

    return `${emotionDescriptions[emotion]}. ${shortText}`
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!reflection || !classId) return

    setIsSubmitting(true)

    // Analisis emosi dari teks
    const detectedEmotion = analyzeEmotion(reflection)
    setAnalyzedEmotion(detectedEmotion)

    // Simulasi pengiriman data
    setTimeout(() => {
      const selectedClass = completedClasses.find((c) => c.id === classId)
      const newReflection = {
        id: reflections.length + 1,
        date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
        time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        content: reflection,
        emotion: detectedEmotion,
        className: selectedClass?.name || "",
        classId: classId,
        summary: generateSummary(reflection, detectedEmotion),
      }

      // Tambahkan refleksi baru ke awal array (terbaru di atas)
      const updatedReflections = [newReflection, ...reflections]
      
      // Update state and save to localStorage
      setReflections(updatedReflections)
      localStorage.setItem("userReflections", JSON.stringify(updatedReflections))
      
      // Update reflections stats in localStorage for dashboard
      const reflectionStats = {
        completed: updatedReflections.length,
        pending: 1 // Assuming there's always one pending reflection for active classes
      }
      localStorage.setItem("reflectionStats", JSON.stringify(reflectionStats))
      
      // Dispatch a custom event to notify the dashboard component about the update
      // This helps when both components are open in the same tab/window
      const updateEvent = new CustomEvent('reflectionUpdated', { 
        detail: { reflectionStats, reflections: updatedReflections } 
      });
      window.dispatchEvent(updateEvent);

      setIsSubmitting(false)
      setShowSuccess(true)
      setReflection("")
      setClassId("")

      // Sembunyikan notifikasi sukses setelah 3 detik
      setTimeout(() => {
        setShowSuccess(false)
        setAnalyzedEmotion(null)
      }, 3000)
    }, 1500)
  }

  const handleExportReflections = () => {
    // Export data refleksi ke CSV
    const headers = ["Tanggal", "Waktu", "Kelas", "Emosi", "Konten Refleksi", "Ringkasan"]
    const csvData = reflections.map((r) => [r.date, r.time, r.className, r.emotion, `"${r.content}"`, `"${r.summary}"`])

    const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `refleksi-pembelajaran-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <main className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Refleksi Pembelajaran</h1>
          <p className="text-muted-foreground">Catat refleksi emosi Anda setelah mengikuti kelas virtual</p>
        </div>
        <Button onClick={handleExportReflections} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Refleksi
        </Button>
      </div>

      {/* Success Notification */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <div>
            <p className="text-green-700 dark:text-green-400 font-medium">Refleksi berhasil disimpan!</p>
            <p className="text-sm text-green-600 dark:text-green-500">
              Emosi terdeteksi: <strong>{analyzedEmotion}</strong>
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>[SISWA] Buat Refleksi Baru</CardTitle>
            <CardDescription>Tuliskan refleksi emosi Anda setelah mengikuti kelas virtual</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="class">Pilih Kelas yang Sudah Selesai</Label>
                <Select value={classId} onValueChange={setClassId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kelas virtual yang sudah diikuti" />
                  </SelectTrigger>
                  <SelectContent>
                    {completedClasses.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        <div className="flex flex-col">
                          <span>{cls.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {cls.date} • {cls.time}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reflection">Refleksi Pembelajaran</Label>
                <Textarea
                  id="reflection"
                  placeholder="Tuliskan refleksi emosi Anda setelah mengikuti kelas virtual... (contoh: 'Saya merasa senang karena berhasil memahami materi dengan baik')"
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Tips: Ceritakan perasaan Anda selama kelas, pemahaman materi, dan pengalaman belajar secara
                  keseluruhan.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSubmitting || !reflection || !classId}>
                {isSubmitting ? (
                  <>
                    <span className="mr-2">Menganalisis...</span>
                    <span className="animate-spin">⏳</span>
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Kirim Refleksi
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analisis Emosi</CardTitle>
            <CardDescription>Ringkasan emosi dari refleksi Anda</CardDescription>
          </CardHeader>
          <CardContent>
            {reflection ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <EmotionIndicator emotion={analyzeEmotion(reflection)} size="lg" showLabel />
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm">
                    Refleksi Anda menunjukkan emosi <strong>{analyzeEmotion(reflection)}</strong>.
                    {analyzeEmotion(reflection) === "joy" &&
                      " Anda tampak merasa positif dan senang dengan pembelajaran."}
                    {analyzeEmotion(reflection) === "sadness" &&
                      " Anda tampak mengalami kesulitan atau tantangan dalam pembelajaran."}
                    {analyzeEmotion(reflection) === "anger" &&
                      " Anda tampak merasa frustasi dengan aspek pembelajaran."}
                    {analyzeEmotion(reflection) === "fear" &&
                      " Anda tampak merasa khawatir atau cemas dengan materi pembelajaran."}
                    {analyzeEmotion(reflection) === "surprise" &&
                      " Anda tampak terkejut atau kagum dengan pembelajaran."}
                    {analyzeEmotion(reflection) === "disgust" &&
                      " Anda tampak merasa tidak nyaman dengan aspek pembelajaran."}
                    {analyzeEmotion(reflection) === "neutral" &&
                      " Anda tampak dalam keadaan emosi yang stabil terhadap pembelajaran."}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Kata Kunci Terdeteksi:</h4>
                  <div className="flex flex-wrap gap-2">
                    {reflection
                      .toLowerCase()
                      .split(" ")
                      .filter((word) =>
                        [
                          "senang",
                          "bahagia",
                          "sedih",
                          "kecewa",
                          "marah",
                          "kesal",
                          "takut",
                          "khawatir",
                          "berhasil",
                          "gagal",
                          "puas",
                          "bangga",
                          "kesulitan",
                          "sulit",
                          "memahami",
                          "jelas",
                          "menarik",
                        ].includes(word),
                      )
                      .map((word, index) => (
                        <Badge key={index} variant="outline">
                          {word}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Mulai menulis refleksi untuk melihat analisis emosi</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>[SISWA] Riwayat Refleksi Pribadi ({reflections.length})</CardTitle>
          <CardDescription>Refleksi pembelajaran yang telah Anda buat (terbaru di atas)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reflections.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
              >
                <EmotionIndicator emotion={item.emotion} size="md" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {item.className}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {item.date}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {item.time}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm mb-2">{item.content}</p>
                  <div className="p-2 bg-muted/30 rounded text-xs text-muted-foreground">
                    <strong>Ringkasan:</strong> {item.summary}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
