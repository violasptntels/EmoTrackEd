"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EmotionIndicator } from "@/components/emotion-indicator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Calendar, Clock, Filter, Download, Eye, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export default function FacilitatorReflectionsPage() {
  // Page title for monitoring student reflections, not personal reflections
  document.title = "[FASILITATOR] Monitoring Refleksi Siswa";
  
  const [searchTerm, setSearchTerm] = useState("");
  const [emotionFilter, setEmotionFilter] = useState("all");
  const [savedReflections, setSavedReflections] = useState([]);
    // Load reflections from localStorage
  useEffect(() => {
    try {
      const storedReflections = localStorage.getItem("reflections");
      if (storedReflections) {
        const parsedReflections = JSON.parse(storedReflections);
        setSavedReflections(parsedReflections);
      }
    } catch (error) {
      console.error("Error loading reflections:", error);
    }
  }, []);
  
  // Combine saved reflections with static data
  const combinedReflections = [
    ...savedReflections,
    // Static data as fallback if no saved reflections
    ...(savedReflections.length === 0 ? [
      {
        id: 1,
        student: "Alice Johnson",
        date: "12 Jun 2025",
        time: "09:30",
        content:
          "Hari ini saya merasa sangat senang karena berhasil menyelesaikan tugas matematika dengan baik. Saya belajar dengan tekun dan hasilnya memuaskan.",
        emotion: "joy",
        className: "Matematika",
        summary: "Perasaan senang dan percaya diri setelah berhasil menyelesaikan tugas matematika dengan baik.",
        needsAttention: false,
        instructor: "Dr. Sarah Johnson"
      },
      {
        id: 2,
        student: "Bob Smith",
        date: "12 Jun 2025",
        time: "14:15",
        content:
          "Saya sedikit kecewa dengan nilai ujian bahasa inggris, tapi saya akan belajar lebih giat. Saya perlu meningkatkan kemampuan grammar dan vocabulary saya.",
        emotion: "sadness",
        className: "Bahasa Inggris",
        summary: "Kekecewaan dengan nilai ujian bahasa inggris, namun ada tekad untuk belajar lebih giat.",
        needsAttention: true,
        instructor: "Dr. Sarah Johnson"
      },    ] : []),
    {
      id: 3,
      student: "Carol Davis",
      date: "11 Jun 2025",
      time: "16:45",
      content:
        "Diskusi kelompok berjalan lancar, semua anggota berkontribusi dengan baik. Kami berhasil menyelesaikan presentasi tepat waktu.",
      emotion: "neutral",
      className: "Ilmu Sosial",
      summary: "Kepuasan dengan kerja sama tim dalam diskusi kelompok yang berjalan lancar.",
      needsAttention: false,
      instructor: "Dr. Sarah Johnson"
    },
  ];

  const filteredReflections = combinedReflections.filter((reflection) => {
    // Field names are now student, content, and className (formerly subject)
    const matchesSearch =
      (reflection.student || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reflection.content || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reflection.className || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEmotion = emotionFilter === "all" || reflection.emotion === emotionFilter;
    
    return matchesSearch && matchesEmotion;

    return matchesSearch && matchesEmotion
  })
  // Reference the filtered reflections instead of static data
  const needsAttentionCount = filteredReflections.filter((r) => r.needsAttention).length;
  const positiveEmotionCount = filteredReflections.filter((r) => r.emotion === "joy").length;
  
  // Feedback dialog state
  const [selectedReflection, setSelectedReflection] = useState(null);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  
  // Handle opening feedback dialog for a specific reflection
  const handleOpenFeedback = (reflection) => {
    setSelectedReflection(reflection);
    setFeedbackText("");
    setFeedbackDialogOpen(true);
  };
  
  // Handle sending feedback
  const handleSendFeedback = () => {
    if (!selectedReflection || !feedbackText.trim()) return;
    
    // Save feedback to localStorage for demonstration
    try {
      const feedbackData = {
        id: Date.now(),
        reflectionId: selectedReflection.id,
        studentName: selectedReflection.student,
        feedbackText,
        timestamp: new Date().toISOString(),
        senderName: "Fasilitator"
      };
      
      const existingFeedback = JSON.parse(localStorage.getItem("reflectionFeedback") || "[]");
      existingFeedback.push(feedbackData);
      localStorage.setItem("reflectionFeedback", JSON.stringify(existingFeedback));
      
      // Success notification
      alert(`Feedback berhasil dikirim ke ${selectedReflection.student}`);
    } catch (error) {
      console.error("Error saving feedback:", error);
    }
    
    setFeedbackDialogOpen(false);
  };
  
  // Export reflections data
  const handleExportData = () => {
    try {
      // Convert the data to a CSV format
      let csvContent = "Student,Date,Time,Class,Emotion,Content\n";
      
      filteredReflections.forEach(reflection => {
        csvContent += `"${reflection.student}","${reflection.date}","${reflection.time}","${reflection.className}","${reflection.emotion}","${reflection.content.replace(/"/g, '""')}"\n`;
      });
      
      // Create a blob and download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `reflection_report_${new Date().toISOString().slice(0,10)}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Gagal mengekspor data. Silakan coba lagi.");
    }
  };
  
  return (
    <main className="p-4 md:p-6">      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>            <h1 className="text-2xl md:text-3xl font-bold">[FASILITATOR] Monitoring Refleksi Siswa</h1>
          <p className="text-muted-foreground">Monitor refleksi emosi dari siswa dalam kelas Anda</p>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline">
              <Users className="h-4 w-4 mr-1" />
              {combinedReflections.length} refleksi siswa tersedia
            </Badge>
            <Badge variant="secondary">
              <Calendar className="h-4 w-4 mr-1" />
              Refleksi pasca kelas virtual
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" />
            Berikan Feedback
          </Button>          <Button onClick={handleExportData}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">      <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Refleksi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredReflections.length}</div>
            <p className="text-xs text-muted-foreground">Minggu ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Perlu Perhatian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {needsAttentionCount}
            </div>
            <p className="text-xs text-muted-foreground">Emosi negatif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Emosi Positif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {positiveEmotionCount}
            </div>
            <p className="text-xs text-muted-foreground">Siswa senang</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rata-rata per Siswa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.1</div>
            <p className="text-xs text-muted-foreground">Refleksi per minggu</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Refleksi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari siswa atau konten refleksi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={emotionFilter} onValueChange={setEmotionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter Emosi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Emosi</SelectItem>
                <SelectItem value="joy">Senang</SelectItem>
                <SelectItem value="sadness">Sedih</SelectItem>
                <SelectItem value="anger">Marah</SelectItem>
                <SelectItem value="fear">Takut</SelectItem>
                <SelectItem value="neutral">Netral</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reflections List */}      <Card>
        <CardHeader>
          <CardTitle>Daftar Refleksi Siswa ({filteredReflections.length})</CardTitle>
          <CardDescription>Refleksi yang diisi oleh siswa setelah mengikuti kelas virtual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReflections.map((reflection) => (
              <div
                key={reflection.id}
                className="flex gap-4 p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>{(reflection.student || "").substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <EmotionIndicator emotion={reflection.emotion} size="md" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{reflection.student}</p>
                      {reflection.needsAttention && <Badge variant="destructive">Perlu Perhatian</Badge>}
                      <Badge variant="outline" className="text-xs">
                        {reflection.className}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {reflection.date}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {reflection.time}
                      </Badge>
                    </div>                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleOpenFeedback(reflection)}>
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm mb-2">{reflection.content}</p>
                  <div className="p-2 bg-muted/30 rounded text-xs text-muted-foreground">
                    <strong>Ringkasan:</strong> {reflection.summary}
                  </div>
                </div>
              </div>
            ))}
          </div>        </CardContent>
      </Card>
      
      {/* Feedback Dialog */}
      <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Feedback untuk Refleksi Siswa</DialogTitle>
            <DialogDescription>
              Berikan tanggapan atau masukan terhadap refleksi siswa.
            </DialogDescription>
          </DialogHeader>
          
          {selectedReflection && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Siswa</h4>
                <p className="text-sm">{selectedReflection.student}</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Refleksi</h4>
                <p className="text-sm bg-muted/30 p-3 rounded">{selectedReflection.content}</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Emosi</h4>
                <div className="flex items-center gap-2">
                  <EmotionIndicator emotion={selectedReflection.emotion} size="sm" />
                  <span className="text-sm capitalize">{selectedReflection.emotion}</span>
                </div>
              </div>
              
              <Textarea
                placeholder="Tulis feedback Anda di sini..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedbackDialogOpen(false)}>
              Batalkan
            </Button>
            <Button 
              onClick={handleSendFeedback} 
              disabled={!feedbackText?.trim()}
            >
              Kirim Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
