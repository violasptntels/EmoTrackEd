"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EmotionIndicator } from "@/components/emotion-indicator"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Medal, Star, Crown, Award, TrendingUp, Target, Zap, Gift, Download } from "lucide-react"

export default function RankingPage() {
  const [user, setUser] = useState({ name: "Guest", role: "Siswa" })
  const [timeRange, setTimeRange] = useState("weekly")
  const [category, setCategory] = useState("overall")

  useEffect(() => {
    const userData = localStorage.getItem("userData")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    }
  }, [])

  // Data ranking keseimbangan emosi
  const emotionRanking = [
    {
      rank: 1,
      name: "Alice Johnson",
      score: 95,
      badge: "Emotional Master",
      streak: 15,
      class: "Matematika Dasar",
      avatar: "/placeholder.svg",
      dominantEmotion: "joy",
      improvement: "+5",
      achievements: ["7-Day Streak", "Positive Mindset", "Consistent Learner"],
      weeklyAverage: 92,
      isCurrentUser: false,
    },
    {
      rank: 2,
      name: "Bob Smith",
      score: 92,
      badge: "Zen Learner",
      streak: 12,
      class: "Bahasa Inggris",
      avatar: "/placeholder.svg",
      dominantEmotion: "neutral",
      improvement: "+3",
      achievements: ["Balanced Mind", "Steady Progress"],
      weeklyAverage: 89,
      isCurrentUser: user.name === "Bob Smith",
    },
    {
      rank: 3,
      name: "Carol Davis",
      score: 88,
      badge: "Balanced Mind",
      streak: 8,
      class: "Ilmu Alam",
      avatar: "/placeholder.svg",
      dominantEmotion: "joy",
      improvement: "+2",
      achievements: ["Rising Star", "Emotional Growth"],
      weeklyAverage: 85,
      isCurrentUser: false,
    },
    {
      rank: 4,
      name: "David Wilson",
      score: 85,
      badge: "Steady Progress",
      streak: 6,
      class: "Matematika Dasar",
      avatar: "/placeholder.svg",
      dominantEmotion: "neutral",
      improvement: "+1",
      achievements: ["Consistent Effort"],
      weeklyAverage: 82,
      isCurrentUser: false,
    },
    {
      rank: 5,
      name: "Eva Brown",
      score: 82,
      badge: "Rising Star",
      streak: 4,
      class: "Bahasa Inggris",
      avatar: "/placeholder.svg",
      dominantEmotion: "joy",
      improvement: "+4",
      achievements: ["Newcomer", "Quick Learner"],
      weeklyAverage: 78,
      isCurrentUser: false,
    },
  ]

  // Data achievement dan rewards
  const achievements = [
    {
      id: 1,
      title: "Emotional Master",
      description: "Pertahankan keseimbangan emosi selama 14 hari berturut-turut",
      icon: Crown,
      rarity: "legendary",
      unlockedBy: 1,
      reward: "Badge Emas + 100 Poin Bonus",
    },
    {
      id: 2,
      title: "Zen Learner",
      description: "Capai skor emosi rata-rata 90+ selama seminggu",
      icon: Medal,
      rarity: "epic",
      unlockedBy: 3,
      reward: "Badge Perak + 50 Poin Bonus",
    },
    {
      id: 3,
      title: "Positive Mindset",
      description: "Dominasi emosi positif selama 5 hari berturut-turut",
      icon: Star,
      rarity: "rare",
      unlockedBy: 8,
      reward: "Badge Perunggu + 25 Poin Bonus",
    },
  ]

  const categories = [
    { value: "overall", label: "Keseluruhan" },
    { value: "consistency", label: "Konsistensi" },
    { value: "improvement", label: "Peningkatan" },
    { value: "positive", label: "Emosi Positif" },
  ]

  const timeRanges = [
    { value: "daily", label: "Harian" },
    { value: "weekly", label: "Mingguan" },
    { value: "monthly", label: "Bulanan" },
    { value: "semester", label: "Semester" },
  ]

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />
      default:
        return <Star className="h-6 w-6 text-blue-500" />
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600"
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500"
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600"
      default:
        return "bg-gradient-to-r from-blue-400 to-blue-600"
    }
  }

  const getBadgeColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
      case "epic":
        return "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
      case "rare":
        return "bg-gradient-to-r from-green-500 to-blue-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const currentUserRank = emotionRanking.find((r) => r.isCurrentUser)

  return (
    <main className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Ranking Keseimbangan Emosi
          </h1>
          <p className="text-muted-foreground">Siswa yang paling konsisten emosinya mendapat penghargaan motivasi</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Current User Position */}
      {currentUserRank && (
        <Card className="mb-6 border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Posisi Anda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {getRankIcon(currentUserRank.rank)}
                  <span className="text-2xl font-bold">#{currentUserRank.rank}</span>
                </div>
                <div>
                  <p className="font-medium">{currentUserRank.name}</p>
                  <div className="flex items-center gap-2">
                    <Badge className={getBadgeColor("epic")}>{currentUserRank.badge}</Badge>
                    <span className="text-sm text-muted-foreground">{currentUserRank.streak} hari streak</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">{currentUserRank.score}</div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">{currentUserRank.improvement}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Ranking */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Leaderboard Emosi</CardTitle>
              <CardDescription>Ranking berdasarkan konsistensi dan keseimbangan emosi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emotionRanking.map((student) => (
                  <div
                    key={student.rank}
                    className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                      student.isCurrentUser
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Rank Badge */}
                        <div className={`p-3 rounded-full ${getRankColor(student.rank)}`}>
                          <div className="text-white font-bold text-lg">#{student.rank}</div>
                        </div>

                        {/* Student Info */}
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={student.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium">{student.name}</p>
                              {student.isCurrentUser && <Badge variant="outline">Anda</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground">{student.class}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getBadgeColor("rare")}>{student.badge}</Badge>
                              <EmotionIndicator emotion={student.dominantEmotion} size="xs" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Score & Stats */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary mb-1">{student.score}</div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1 text-green-600">
                            <TrendingUp className="h-3 w-3" />
                            <span className="text-xs">{student.improvement}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3 text-orange-500" />
                            <span className="text-xs">{student.streak} hari</span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">Rata-rata: {student.weeklyAverage}</div>
                      </div>
                    </div>

                    {/* Achievements */}
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <div className="flex flex-wrap gap-1">
                        {student.achievements.map((achievement, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Award className="h-3 w-3 mr-1" />
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Achievement & Rewards
              </CardTitle>
              <CardDescription>Pencapaian yang bisa diraih</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="p-3 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${getBadgeColor(achievement.rarity)}`}>
                        <achievement.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{achievement.title}</p>
                        <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {achievement.unlockedBy} siswa
                          </Badge>
                          <span className="text-xs text-muted-foreground">{achievement.reward}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Statistik Ranking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Peserta</span>
                  <Badge variant="outline">{emotionRanking.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Skor Tertinggi</span>
                  <Badge variant="outline">{Math.max(...emotionRanking.map((r) => r.score))}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Rata-rata Skor</span>
                  <Badge variant="outline">
                    {Math.round(emotionRanking.reduce((acc, r) => acc + r.score, 0) / emotionRanking.length)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Streak Terpanjang</span>
                  <Badge variant="outline">{Math.max(...emotionRanking.map((r) => r.streak))} hari</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Motivation */}
          <Card>
            <CardHeader>
              <CardTitle>Motivasi Harian</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-4">
                <div className="text-4xl mb-2">🌟</div>
                <p className="text-sm font-medium mb-2">"Konsistensi adalah kunci kesuksesan emosional"</p>
                <p className="text-xs text-muted-foreground">
                  Pertahankan keseimbangan emosi Anda untuk naik peringkat!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
