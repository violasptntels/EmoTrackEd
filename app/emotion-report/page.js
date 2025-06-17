"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, BarChart } from "@/components/charts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarIcon, LineChart as LineChartIcon, BarChart as BarChartIcon, Download, Printer, FileDown } from "lucide-react"

export default function EmotionReportPage() {
  const reportRef = useRef(null);

  // Function to handle PDF export via print
  const handlePrintPDF = () => {
    window.print();
  };

  // Data untuk grafik emosi mingguan
  const weeklyEmotionData = [
    {
      day: "Senin",
      senang: 70,
      sedih: 10,
      marah: 5,
      netral: 15
    },
    {
      day: "Selasa",
      senang: 60,
      sedih: 15,
      marah: 10,
      netral: 15
    },
    {
      day: "Rabu",
      senang: 45,
      sedih: 20,
      marah: 15,
      netral: 20
    },
    {
      day: "Kamis",
      senang: 55,
      sedih: 10,
      marah: 5,
      netral: 30
    },
    {
      day: "Jumat",
      senang: 80,
      sedih: 5,
      marah: 5,
      netral: 10
    },
  ]

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
