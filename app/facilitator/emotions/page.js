"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EmotionIndicator } from "@/components/emotion-indicator"
import { LineChart, DonutChart } from "@/components/charts"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { 
  AlertTriangle, TrendingUp, Users, Clock, Eye, 
  MessageSquare, BarChart3, RefreshCw, Calendar,
  Download, Search, Filter
} from "lucide-react"

export default function FacilitatorEmotionsPage() {
  // Page title for monitoring student emotions, not personal emotions
  document.title = "[FASILITATOR] Monitoring Emosi Siswa";
  
  const [selectedClass, setSelectedClass] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [studentsEmotions, setStudentsEmotions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [emotionFilter, setEmotionFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [currentView, setCurrentView] = useState("monitoring"); // "monitoring" atau "detail"
  
  // Sample data for emotion distributions
  const [currentEmotionDistribution, setCurrentEmotionDistribution] = useState([
    { name: "Senang", value: 45, color: "#4caf50" },
    { name: "Netral", value: 25, color: "#9e9e9e" },
    { name: "Sedih", value: 15, color: "#2196f3" },
    { name: "Marah", value: 10, color: "#f44336" },
    { name: "Takut", value: 5, color: "#673ab7" }
  ]);
  
  // Sample data for emotion trends
  const [classEmotionData, setClassEmotionData] = useState([
    { time: "09:00", senang: 40, sedih: 20, marah: 15, takut: 10, netral: 35 },
    { time: "09:15", senang: 45, sedih: 25, marah: 10, takut: 15, netral: 30 },
    { time: "09:30", senang: 35, sedih: 30, marah: 20, takut: 20, netral: 25 },
    { time: "09:45", senang: 50, sedih: 20, marah: 15, takut: 10, netral: 35 }
  ]);
    // Load saved emotion data from localStorage
  useEffect(() => {
    try {
      // Get emotion reports from localStorage - laporan emosi SISWA
      const savedEmotionReports = localStorage.getItem("emotionReports");
      if (savedEmotionReports) {
        const parsedReports = JSON.parse(savedEmotionReports);
        
        console.log("Loaded student emotion reports:", parsedReports);
        
        // Transform the emotion reports into the format needed for studentsEmotions
        const transformedReports = parsedReports.map((report, index) => ({
          id: index + 1,
          name: report.student || report.studentName || "Student", // Ambil nama siswa
          currentEmotion: report.dominantEmotion || "neutral",
          confidence: Math.floor(Math.random() * 30) + 70, // Simulated confidence 70-99%
          lastUpdate: report.date || "Sesi terakhir",
          status: "completed",
          class: report.className || "Kelas Virtual",
          needsAttention: ["anger", "sadness", "fear", "disgust"].includes(report.dominantEmotion),
          emotionHistory: report.emotions?.map((item, i) => ({
            time: item.time || `${i*15}:00`,
            emotion: item.emotion || "neutral"
          })) || [{ time: "00:00", emotion: "neutral" }],
          date: report.date,
          classId: report.sessionId || report.classId,
          fullData: report // Simpan data lengkap untuk tampilan detail
        }));
        
        if (transformedReports.length > 0) {
          setStudentsEmotions(transformedReports);
          setIsDataLoaded(true);
          
          // Update emotion distribution based on real data
          const emotionCounts = {
            joy: 0,
            neutral: 0,
            sadness: 0, 
            anger: 0,
            fear: 0,
            surprise: 0,
            disgust: 0
          };
          
          transformedReports.forEach(student => {
            if (student.currentEmotion) {
              emotionCounts[student.currentEmotion] = (emotionCounts[student.currentEmotion] || 0) + 1;
            }
          });
          
          const total = transformedReports.length;
          
          if (total > 0) {
            const newDistribution = [
              { name: "Senang", value: Math.round((emotionCounts.joy / total) * 100) || 0, color: "#4caf50" },
              { name: "Netral", value: Math.round((emotionCounts.neutral / total) * 100) || 0, color: "#9e9e9e" },
              { name: "Sedih", value: Math.round((emotionCounts.sadness / total) * 100) || 0, color: "#2196f3" },
              { name: "Marah", value: Math.round((emotionCounts.anger / total) * 100) || 0, color: "#f44336" },
              { name: "Takut", value: Math.round((emotionCounts.fear / total) * 100) || 0, color: "#673ab7" }
            ];
            
            setCurrentEmotionDistribution(newDistribution);
          }
        }
      }
    } catch (error) {
      console.error("Error loading emotion reports:", error);
    }
  }, []);
  
  // Fallback data if no localStorage data is available
  const fallbackStudentsData = [
    {
      id: 1,
      name: "Alice Johnson",
      currentEmotion: "joy",
      confidence: 92,
      lastUpdate: "2 menit lalu",
      status: "active",
      class: "Matematika Dasar",
      needsAttention: false,
      emotionHistory: [
        { time: "09:00", emotion: "neutral" },
        { time: "09:15", emotion: "joy" },
        { time: "09:30", emotion: "joy" },
        { time: "09:45", emotion: "surprise" },
      ],
    },
    {
      id: 2,
      name: "Bob Smith",
      currentEmotion: "sadness",
      confidence: 87,
      lastUpdate: "1 menit lalu",
      status: "active",
      class: "Matematika Dasar",
      needsAttention: true,
      emotionHistory: [
        { time: "09:00", emotion: "neutral" },
        { time: "09:15", emotion: "sadness" },
        { time: "09:30", emotion: "sadness" },
        { time: "09:45", emotion: "fear" },
      ],
    },
    {
      id: 3,
      name: "Carol Davis",
      currentEmotion: "fear",
      confidence: 78,
      lastUpdate: "30 detik lalu",
      status: "active",
      class: "Bahasa Inggris",
      needsAttention: true,
      emotionHistory: [
        { time: "09:00", emotion: "neutral" },
        { time: "09:15", emotion: "neutral" },
        { time: "09:30", emotion: "fear" },
        { time: "09:45", emotion: "fear" },
      ],
    },
    {
      id: 4,
      name: "David Wilson",
      currentEmotion: "anger",
      confidence: 85,
      lastUpdate: "5 menit lalu",
      status: "inactive",
      class: "Matematika Dasar",
      needsAttention: true,
      emotionHistory: [
        { time: "09:00", emotion: "neutral" },
        { time: "09:15", emotion: "anger" },
        { time: "09:30", emotion: "anger" },
        { time: "09:45", emotion: "neutral" },
      ],
    },
  ];

  // Use fallback data if no localStorage data
  useEffect(() => {
    if (!isDataLoaded && studentsEmotions.length === 0) {
      setStudentsEmotions(fallbackStudentsData);
    }
  }, [isDataLoaded, studentsEmotions]);

  const classes = [
    { id: "all", name: "Semua Kelas" },
    { id: "math", name: "Matematika Dasar" },
    { id: "english", name: "Bahasa Inggris" },
    { id: "science", name: "Ilmu Alam" },
  ];
  
  // Apply filters
  const filteredStudents = studentsEmotions.filter((student) => {
    // Search term filter
    const matchesSearch = 
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.class?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.currentEmotion?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Class filter
    const matchesClass = 
      selectedClass === "all" ||
      (selectedClass === "math" && student.class?.toLowerCase().includes("matematika")) ||
      (selectedClass === "english" && student.class?.toLowerCase().includes("inggris")) ||
      (selectedClass === "science" && student.class?.toLowerCase().includes("ilmu"));
    
    // Emotion filter
    const matchesEmotion = 
      emotionFilter === "all" ||
      (emotionFilter === "positive" && ["joy", "surprise"].includes(student.currentEmotion)) ||
      (emotionFilter === "negative" && ["sadness", "fear", "anger", "disgust"].includes(student.currentEmotion)) ||
      emotionFilter === student.currentEmotion;
    
    return matchesSearch && matchesClass && matchesEmotion;
  });

  const needsAttentionCount = filteredStudents.filter((s) => s.needsAttention).length;
  const activeStudentsCount = filteredStudents.filter((s) => s.status === "active").length;

  const handleRefresh = () => {
    setRefreshing(true);
    // Reload data from localStorage
    try {
      const savedEmotionReports = localStorage.getItem("emotionReports");
      if (savedEmotionReports) {
        const parsedReports = JSON.parse(savedEmotionReports);
        // Similar transformation logic as in useEffect
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Handle opening feedback dialog
  const handleOpenFeedback = (student) => {
    setSelectedStudent(student);
    setFeedbackText("");
    setFeedbackDialogOpen(true);
  };
  
  // Handle sending feedback
  const handleSendFeedback = () => {
    if (!selectedStudent || !feedbackText.trim()) return;
    
    // In a real app, this would send the feedback to an API
    console.log(`Sending feedback to ${selectedStudent.name}: ${feedbackText}`);
    
    // Save feedback to localStorage for demonstration
    try {
      const feedbackData = {
        id: Date.now(),
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
        feedbackText,
        timestamp: new Date().toISOString(),
        senderName: "Fasilitator"
      };
      
      const existingFeedback = JSON.parse(localStorage.getItem("facilitatorFeedback") || "[]");
      existingFeedback.push(feedbackData);
      localStorage.setItem("facilitatorFeedback", JSON.stringify(existingFeedback));
      
      // Success notification
      alert(`Feedback berhasil dikirim ke ${selectedStudent.name}`);
    } catch (error) {
      console.error("Error saving feedback:", error);
    }
    
    setFeedbackDialogOpen(false);
  };

  const getEmotionColor = (emotion) => {
    switch (emotion) {
      case "joy":
        return "text-green-500";
      case "sadness":
        return "text-blue-500";
      case "anger":
        return "text-red-500";
      case "fear":
        return "text-orange-500";
      case "surprise":
        return "text-purple-500";
      case "disgust":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };

  // Export emotion data
  const handleExportData = () => {
    try {
      // Convert the data to a CSV format
      let csvContent = "Name,Class,Current Emotion,Date,Status,Needs Attention\n";
      
      filteredStudents.forEach(student => {
        csvContent += `"${student.name}","${student.class}","${student.currentEmotion}","${student.date || 'N/A'}","${student.status}","${student.needsAttention}"\n`;
      });
      
      // Create a blob and download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `emotion_report_${new Date().toISOString().slice(0,10)}.csv`);
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
    <main className="p-4 md:p-6">      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">          <div>
            <h1 className="text-2xl md:text-3xl font-bold">[FASILITATOR] Monitoring Emosi Siswa</h1>
            <p className="text-muted-foreground">
              Pantau kondisi emosional siswa selama pembelajaran berlangsung untuk penyesuaian pendekatan
            </p>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline">
                <Users className="h-4 w-4 mr-1" />
                Laporan emosi dari {studentsEmotions.length} siswa
              </Badge>
              <Badge variant="secondary">
                <Calendar className="h-4 w-4 mr-1" />
                Data dari sesi kelas virtual
              </Badge>
            </div>
          </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Filter dan Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama siswa atau kelas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Kelas" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={emotionFilter} onValueChange={setEmotionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter Emosi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Emosi</SelectItem>
                <SelectItem value="positive">Emosi Positif</SelectItem>
                <SelectItem value="negative">Emosi Negatif</SelectItem>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Siswa Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{activeStudentsCount}</div>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground">Dari {filteredStudents.length} total siswa</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Perlu Perhatian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-orange-500">{needsAttentionCount}</div>
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-xs text-muted-foreground">Emosi negatif berkepanjangan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Emosi Dominan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-green-500">
                {currentEmotionDistribution.sort((a, b) => b.value - a.value)[0]?.name || "Senang"}
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground">
              {currentEmotionDistribution.sort((a, b) => b.value - a.value)[0]?.value || 0}% dari siswa aktif
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Update Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">30s</div>
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground">Data real-time</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Real-time Emotion Chart */}        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tren Emosi Siswa</CardTitle>
            <CardDescription>
              Perkembangan emosi siswa selama mengikuti kelas virtual (data agregat dari semua siswa aktif)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart data={classEmotionData} />
            <div className="text-xs text-muted-foreground mt-2 italic">
              *Grafik menunjukkan persentase siswa dengan masing-masing emosi selama kelas berlangsung
            </div>
          </CardContent>
        </Card>

        {/* Current Emotion Distribution */}        <Card>
          <CardHeader>
            <CardTitle>Distribusi Emosi Siswa</CardTitle>
            <CardDescription>Keadaan emosional siswa setelah mengikuti kelas virtual</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart data={currentEmotionDistribution} />
            <div className="text-xs text-muted-foreground my-2 italic text-center">
              *Persentase siswa berdasarkan emosi dominan yang terekam
            </div>
            <div className="mt-2 space-y-2">
              {currentEmotionDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}      <Card>
        <CardHeader>
          <CardTitle>Daftar Siswa & Status Emosi ({filteredStudents.length})</CardTitle>
          <CardDescription>
            Monitor laporan emosi individual siswa dari kelas virtual dan berikan dukungan yang tepat sasaran
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className={`p-4 rounded-lg border transition-all ${
                    student.needsAttention
                      ? "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>{student.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{student.name}</p>
                          <Badge variant={student.status === "active" ? "default" : "secondary"}>
                            {student.status === "active" ? "Online" : "Offline"}
                          </Badge>
                          {student.needsAttention && <Badge variant="destructive">Perlu Perhatian</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{student.class}</p>
                        <p className="text-xs text-muted-foreground">Update terakhir: {student.lastUpdate}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <EmotionIndicator emotion={student.currentEmotion} size="lg" />
                        <p className="text-xs text-muted-foreground mt-1">{student.confidence}% confidence</p>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleOpenFeedback(student)}>
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Emotion History */}
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <p className="text-xs text-muted-foreground mb-2">Riwayat emosi (1 jam terakhir):</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {student.emotionHistory?.map((history, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">{history.time}</span>
                          <EmotionIndicator emotion={history.emotion} size="xs" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Tidak ada data emosi siswa yang tersedia.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Feedback Dialog */}
      <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
        <DialogContent className="sm:max-w-md">          <DialogHeader>
            <DialogTitle>Kirim Feedback ke Siswa</DialogTitle>
            <DialogDescription>
              Berikan masukan atau dukungan kepada siswa berdasarkan laporan emosi dari kelas virtual.
            </DialogDescription>
          </DialogHeader>
          
          {selectedStudent && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{selectedStudent.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedStudent.name}</p>
                  <div className="flex items-center gap-1 text-sm">
                    <span>Emosi dominan dari kelas:</span>
                    <EmotionIndicator emotion={selectedStudent.currentEmotion} size="xs" />
                    <span className="capitalize">{selectedStudent.currentEmotion}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Kelas: {selectedStudent.class} - {selectedStudent.date || "Terbaru"}
                  </div>
                </div>
              </div>
              
              <Textarea
                placeholder="Tulis pesan feedback ke siswa di sini..."
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
  );
}
