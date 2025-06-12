"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EmotionIndicator } from "@/components/emotion-indicator"
import { LineChart, DonutChart } from "@/components/charts"
import { TrendingUp, Calendar, Award, Target, Zap, Star, Trophy, Medal } from "lucide-react"

export default function EmoScorePage() {
  const [user, setUser] = useState({ name: "Guest", role: "Siswa" })

  useEffect(() => {
    const userData = localStorage.getItem("userData")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    }
  }, [])

  // Data EmoScore harian
  const dailyEmoScore = [
    { day: "Sen", score: 85, dominant: "joy" },
    { day: "Sel", score: 78, dominant: "neutral" },
    { day: "Rab", score: 65, dominant: "sadness" },
    { day: "Kam", score: 92, dominant: "joy" },
    { day: "Jum", score: 88, dominant: "joy" },
    { day: "Sab", score: 95, dominant: "joy" },
    { day: "Min", score: 90, dominant: "neutral" },
  ]

  // Data perkembangan emosi mingguan
  const weeklyEmotionData = [
    { day: "Sen", senang: 65, sedih: 20, marah: 10, netral: 25, takut: 5 },
    { day: "Sel", senang: 70, sedih: 15, marah: 8, netral: 30, takut: 7 },
    { day: "Rab", senang: 55, sedih: 25, marah: 15, netral: 20, takut: 10 },
    { day: "Kam", senang: 80, sedih: 10, marah: 5, netral: 35, takut: 3 },
    { day: "Jum", senang: 75, sedih: 18, marah: 12, netral: 28, takut: 8 },
    { day: "Sab", senang: 85, sedih: 8, marah: 3, netral: 40, takut: 2 },
    { day: "Min", senang: 90, sedih: 5, marah: 2, netral: 45, takut: 1 },
  ]

  // Data distribusi emosi
  const emotionDistribution = [
    { name: "Senang", value: 45, color: "hsl(var(--joy))" },
    { name: "Netral", value: 25, color: "hsl(var(--neutral))" },
    { name: "Sedih", value: 15, color: "hsl(var(--sadness))" },
    { name: "Marah", value: 10, color: "hsl(var(--anger))" },
    { name: "Takut", value: 5, color: "hsl(var(--fear))" },
  ]

  // Ranking keseimbangan emosi
  const emotionRanking = [
    { rank: 1, name: "Alice Johnson", score: 95, badge: "Emotional Master", streak: 15 },
    { rank: 2, name: "Bob Smith", score: 92, badge: "Zen Learner", streak: 12 },
    { rank: 3, name: "Carol Davis", score: 88, badge: "Balanced Mind", streak: 8 },
    { rank: 4, name: "David Wilson", score: 85, badge: "Steady Progress", streak: 6 },
    { rank: 5, name: "Eva Brown", score: 82, badge: "Rising Star", streak: 4 },
  ]

  const currentScore = 88
  const weeklyAverage = 85
  const monthlyAverage = 83
  const dominantEmotion = "joy"
  const currentStreak = 7

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 80) return "text-blue-500"
    if (score >= 70) return "text-yellow-500"
    return "text-red-500"
  }

  const getScoreGrade = (score: number) => {
    if (score >= 90) return "A"
    if (score >= 80) return "B"
    if (score >= 70) return "C"
    if (score >= 60) return "D"
    return "E"
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />
      default:
        return <Star className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <main className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">EmoScore Harian</h1>
          <p className="text-muted-foreground">Skor ringkasan emosi berdasarkan interaksi Anda hari ini</p>
        </div>
      </div>

      {/* Current EmoScore */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-purple-400/20 rounded-bl-full" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">EmoScore Hari Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-3xl font-bold ${getScoreColor(currentScore)}`}>{currentScore}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={getScoreColor(currentScore)}>
                    Grade {getScoreGrade(currentScore)}
                  </Badge>
                  <EmotionIndicator emotion={dominantEmotion} size="sm" />
                </div>
              </div>
              <Zap className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rata-rata Mingguan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className={`text-2xl font-bold ${getScoreColor(weeklyAverage)}`}>{weeklyAverage}</div>
              <div className="flex items-center text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm">+3%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">7 hari terakhir</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rata-rata Bulanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className={`text-2xl font-bold ${getScoreColor(monthlyAverage)}`}>{monthlyAverage}</div>
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">30 hari terakhir</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Streak Konsistensi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-orange-500">{currentStreak}</div>
              <Target className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Hari berturut-turut</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* EmoScore Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Tren EmoScore Mingguan</CardTitle>
            <CardDescription>Perkembangan skor emosi harian Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart data={dailyEmoScore.map((d) => ({ day: d.day, score: d.score }))} />
          </CardContent>
        </Card>

        {/* Emotion Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Emosi</CardTitle>
            <CardDescription>Persentase emosi dalam 7 hari terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart data={emotionDistribution} />
            <div className="mt-4 space-y-2">
              {emotionDistribution.map((item, index) => (
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

      {/* Detailed Emotion Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Grafik Perkembangan Emosi Detail</CardTitle>
          <CardDescription>Visualisasi emosi harian/mingguan dalam bentuk chart</CardDescription>
        </CardHeader>
        <CardContent>
          <LineChart data={weeklyEmotionData} />
        </CardContent>
      </Card>

      {/* Ranking Keseimbangan Emosi */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Ranking Keseimbangan Emosi
          </CardTitle>
          <CardDescription>Siswa yang paling konsisten emosinya mendapat penghargaan motivasi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {emotionRanking.map((student) => (
              <div
                key={student.rank}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  student.name === user.name ? "bg-primary/5 border-primary/20" : "border-border/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getRankIcon(student.rank)}
                    <span className="font-bold text-lg">#{student.rank}</span>
                  </div>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {student.badge}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{student.streak} hari streak</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-bold ${getScoreColor(student.score)}`}>{student.score}</div>
                  <Badge variant="outline" className={getScoreColor(student.score)}>
                    Grade {getScoreGrade(student.score)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
