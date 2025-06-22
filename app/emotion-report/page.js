"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, BarChart } from "@/components/charts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarIcon, LineChart as LineChartIcon, BarChart as BarChartIcon, Download, Printer, FileDown, Calendar, Clock } from "lucide-react"
import { EmotionIndicator } from "@/components/emotion-indicator"

export default function EmotionReportPage() {
  const reportRef = useRef(null);
  const [emotionReports, setEmotionReports] = useState([]);
  const [user, setUser] = useState({ name: "Guest", role: "Siswa" });
  const [activeTab, setActiveTab] = useState("weekly");

  // Load emotion reports and user data on component mount
  useEffect(() => {
    // Load user data
    const userData = localStorage.getItem("userData");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    // Load saved emotion reports
    const savedReports = localStorage.getItem("emotionReports");
    if (savedReports) {
      try {
        const parsedReports = JSON.parse(savedReports);
        setEmotionReports(parsedReports);
      } catch (error) {
        console.error("Error parsing saved emotion reports:", error);
      }
    }
  }, []);

  // Function to handle PDF export via print
  const handlePrintPDF = () => {
    window.print();
  };
  
  // Process emotion reports into weekly data
  const processWeeklyEmotionData = () => {
    // Default data if no reports exist
    if (!emotionReports || emotionReports.length === 0) {
      return [
        { day: "Senin", senang: 70, sedih: 10, marah: 5, netral: 15 },
        { day: "Selasa", senang: 60, sedih: 15, marah: 10, netral: 15 },
        { day: "Rabu", senang: 45, sedih: 20, marah: 15, netral: 20 },
        { day: "Kamis", senang: 55, sedih: 10, marah: 5, netral: 30 },
        { day: "Jumat", senang: 65, sedih: 5, marah: 10, netral: 20 }
      ];
    }
    
    // Process real data
    const daysOfWeek = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const result = daysOfWeek.map(day => {
      return { 
        day, 
        senang: 0, 
        sedih: 0, 
        marah: 0, 
        netral: 0,
        takut: 0,
        terkejut: 0
      };
    });
    
    // Last 7 days only
    const lastWeekReports = emotionReports
      .filter(report => {
        const reportDate = new Date(report.date);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return reportDate >= sevenDaysAgo;
      })
      .forEach(report => {
        try {
          const reportDate = new Date(report.date);
          const dayIndex = reportDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
          
          // Count emotions
          if (report.emotions && Array.isArray(report.emotions)) {
            report.emotions.forEach(entry => {
              switch(entry.emotion) {
                case 'joy': result[dayIndex].senang++; break;
                case 'sadness': result[dayIndex].sedih++; break;
                case 'fear': result[dayIndex].takut++; break;
                case 'surprise': result[dayIndex].terkejut++; break;
                case 'anger': result[dayIndex].marah++; break;
                case 'neutral': 
                default: result[dayIndex].netral++; break;
              }
            });
          }
        } catch (err) {
          console.error("Error processing report:", err);
        }
      });
    
    // Normalize values to percentages
    return result.map(day => {
      const total = day.senang + day.sedih + day.marah + day.netral + day.takut + day.terkejut;
      if (total === 0) return day;
      
      return {
        day: day.day,
        senang: Math.round((day.senang / total) * 100),
        sedih: Math.round((day.sedih / total) * 100),
        marah: Math.round((day.marah / total) * 100),
        netral: Math.round((day.netral / total) * 100),
        takut: Math.round((day.takut / total) * 100),
        terkejut: Math.round((day.terkejut / total) * 100)
      };
    });
  };
  // Weekly emotion data
  const weeklyEmotionData = processWeeklyEmotionData();

  // Data untuk grafik bulanan
  const monthlyEmotionData = [
    {
      week: "Minggu 1",
      senang: 65,
      sedih: 15,
      marah: 10,
      netral: 10
    },
    {
      week: "Minggu 2",
      senang: 55,
      sedih: 20,
      marah: 15,
      netral: 10
    },
    {
      week: "Minggu 3",
      senang: 60,
      sedih: 10,
      marah: 10,
      netral: 20
    },
    {
      week: "Minggu 4",
      senang: 75,
      sedih: 5,
      marah: 5,
      netral: 15
    }
  ]

  // Data untuk grafik kemajuan emosi
  const emotionProgressData = [
    { name: 'Senang', value: 62 },
    { name: 'Sedih', value: 12 },
    { name: 'Marah', value: 8 },
    { name: 'Netral', value: 18 }
  ]

  // Helper function to count emotions and calculate percentages
  const countEmotions = (emotions) => {
    // Initialize counters
    const counts = {
      joy: 0,
      sadness: 0,
      fear: 0,
      surprise: 0,
      anger: 0,
      neutral: 0
    };
    
    // Count each emotion type
    emotions.forEach(entry => {
      if (counts[entry.emotion] !== undefined) {
        counts[entry.emotion]++;
      } else {
        counts.neutral++;
      }
    });
    
    // Calculate total
    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
    
    // Calculate percentages and format for display
    return [
      { name: "senang", count: counts.joy, percentage: total > 0 ? Math.round((counts.joy / total) * 100) : 0 },
      { name: "sedih", count: counts.sadness, percentage: total > 0 ? Math.round((counts.sadness / total) * 100) : 0 },
      { name: "takut", count: counts.fear, percentage: total > 0 ? Math.round((counts.fear / total) * 100) : 0 },
      { name: "terkejut", count: counts.surprise, percentage: total > 0 ? Math.round((counts.surprise / total) * 100) : 0 },
      { name: "marah", count: counts.anger, percentage: total > 0 ? Math.round((counts.anger / total) * 100) : 0 },
      { name: "netral", count: counts.neutral, percentage: total > 0 ? Math.round((counts.neutral / total) * 100) : 0 }
    ];
  };

  return (
    <>
      {/* Print styles - only visible when printing */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #report-container, #report-container * {
            visibility: visible;
          }
          #report-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          .page-break {
            page-break-before: always;
          }
        }
      `}</style>

      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Laporan Emosi</h1>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center">
                <CalendarIcon className="mr-1 h-3 w-3" />
                Minggu ini (10 - 17 Juni 2025)
              </Badge>
              <Button 
                onClick={handlePrintPDF} 
                className="no-print"
                variant="outline"
                size="sm"
              >
                <Printer className="h-4 w-4 mr-2" />
                Cetak PDF
              </Button>
            </div>
          </div>

          {/* Report container - this will be printed */}
          <div id="report-container" ref={reportRef}>
            {/* School and student info - header for the report */}
            <div className="mb-6 p-4 border border-muted rounded-lg">
              <div className="flex justify-between">
                <div>
                  <h2 className="font-semibold">EmoTrackEd Report</h2>
                  <p className="text-sm text-muted-foreground">Laporan Emosi Mingguan</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">Nama: Viola Sitanggang</p>
                  <p className="text-sm text-muted-foreground">NIM: 120597</p>
                  <p className="text-sm text-muted-foreground">Kelas: Literasi Manusia - A</p>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">Senang</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">62%</div>
                  <p className="text-xs text-muted-foreground">Rata-rata mingguan</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">Sedih</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">12%</div>
                  <p className="text-xs text-muted-foreground">Rata-rata mingguan</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">Marah</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">8%</div>
                  <p className="text-xs text-muted-foreground">Rata-rata mingguan</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">Netral</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">18%</div>
                  <p className="text-xs text-muted-foreground">Rata-rata mingguan</p>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Emotion Chart */}
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Grafik Emosi Mingguan</CardTitle>
                      <CardDescription>
                        Perkembangan emosi yang terdeteksi dalam satu minggu terakhir
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      Minggu ini
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="line" className="print-tabs">
                    <TabsList className="mb-4 no-print">
                      <TabsTrigger value="line" className="flex items-center">
                        <LineChartIcon className="mr-2 h-4 w-4" />
                        Grafik Garis
                      </TabsTrigger>
                      <TabsTrigger value="bar" className="flex items-center">
                        <BarChartIcon className="mr-2 h-4 w-4" />
                        Grafik Batang
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="line">
                      <LineChart data={weeklyEmotionData} />
                    </TabsContent>
                    <TabsContent value="bar">
                      <BarChart 
                        data={weeklyEmotionData.map(item => ({
                          name: item.day,
                          value: item.senang
                        }))} 
                      />
                    </TabsContent>
                  </Tabs>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>Grafik menunjukkan persentase emosi yang terdeteksi setiap hari dalam seminggu terakhir.</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Emotion Chart */}
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Tren Emosi Bulanan</CardTitle>
                      <CardDescription>
                        Perkembangan emosi yang terdeteksi dalam satu bulan terakhir
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      Juni 2025
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <LineChart data={monthlyEmotionData} />
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>Grafik menunjukkan persentase emosi yang terdeteksi setiap minggu dalam bulan terakhir.</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Insights Card */}
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analisis dan Wawasan</CardTitle>
                  <CardDescription>
                    Rangkuman dan analisis dari data emosi yang terdeteksi
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-md bg-muted">
                    <h3 className="font-medium mb-2">Emosi Dominan</h3>
                    <p>Emosi senang mendominasi sebesar 62%, menunjukkan kecenderungan positif dalam interaksi kelas virtual Anda.</p>
                  </div>
                  <div className="p-4 rounded-md bg-muted">
                    <h3 className="font-medium mb-2">Perubahan Signifikan</h3>
                    <p>Terjadi penurunan emosi sedih sebesar 10% dibandingkan minggu lalu, menunjukkan peningkatan suasana hati yang positif.</p>
                  </div>
                  <div className="p-4 rounded-md bg-muted">
                    <h3 className="font-medium mb-2">Rekomendasi</h3>
                    <p>Berdasarkan analisis emosi, Anda dapat mempertahankan tingkat interaksi yang baik dalam kelas virtual untuk mempertahankan emosi positif.</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Session History Section */}
            <Card className="mt-8 print-item">
              <CardHeader>
                <CardTitle>Riwayat Sesi Kelas</CardTitle>
                <CardDescription>
                  Daftar sesi kelas yang telah diikuti beserta emosi dominan
                </CardDescription>
              </CardHeader>
              <CardContent>
                {emotionReports && emotionReports.length > 0 ? (
                  <div className="space-y-4">
                    {emotionReports.map((report, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{report.className}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {report.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {report.startTime} - {report.endTime}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="capitalize">
                              {report.dominantEmotion || "neutral"}
                            </Badge>
                            <EmotionIndicator emotion={report.dominantEmotion || "neutral"} size="sm" />
                          </div>
                        </div>
                        <div className="mt-4 bg-muted/30 p-3 rounded-md">
                          <h4 className="text-sm font-medium mb-2">Statistik Emosi</h4>
                          <div className="flex flex-wrap gap-2">
                            {report.emotions && Array.isArray(report.emotions) && 
                              countEmotions(report.emotions).map((emotion, i) => (
                                <Badge key={i} variant={emotion.count > 0 ? "default" : "outline"} className="capitalize">
                                  {emotion.name}: {emotion.percentage}%
                                </Badge>
                              ))
                            }
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Belum ada riwayat sesi kelas yang tersimpan.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shared with facilitator notice */}
            <div className="mt-8 bg-muted/30 border rounded-lg p-4 flex items-center gap-3 print-item">
              <div className="bg-primary/10 p-2 rounded-full text-primary">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Data emosi dibagikan dengan fasilitator</p>
                <p className="text-sm text-muted-foreground">
                  Fasilitator dapat melihat laporan emosi Anda untuk memberi dukungan yang lebih baik dalam proses belajar.
                </p>
              </div>
            </div>

            {/* Signature section for the report */}
            <div className="mt-8 p-6 text-right">
              <p className="mb-12">Jakarta, {new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
              <p className="font-semibold">Dr. Jane Smith</p>
              <p className="text-sm text-muted-foreground">Pembimbing Fasilitator</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
