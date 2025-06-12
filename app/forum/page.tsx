"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EmotionIndicator } from "@/components/emotion-indicator"
import { MessageSquare, Plus, Search, Heart, MessageCircle, Clock, Send, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ForumPage() {
  const [user, setUser] = useState({ name: "Guest", role: "Siswa" })
  const [searchTerm, setSearchTerm] = useState("")
  const [emotionFilter, setEmotionFilter] = useState("all")
  const [newPost, setNewPost] = useState("")
  const [showNewPost, setShowNewPost] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("userData")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    }
  }, [])

  // Data forum diskusi emosional
  const forumPosts = [
    {
      id: 1,
      title: "Bagaimana mengatasi kecemasan saat ujian?",
      content: "Saya selalu merasa cemas setiap kali akan ujian. Ada tips untuk mengelola emosi ini?",
      author: "Alice Johnson",
      authorRole: "Siswa",
      emotion: "fear",
      timestamp: "2 jam lalu",
      likes: 12,
      replies: 8,
      category: "Akademik",
      responses: [
        {
          id: 1,
          content: "Coba teknik pernapasan dalam sebelum ujian. Sangat membantu!",
          author: "Dr. Sarah",
          emotion: "joy",
          timestamp: "1 jam lalu",
        },
      ],
    },
    {
      id: 2,
      title: "Senang sekali hari ini berhasil presentasi!",
      content: "Alhamdulillah presentasi tadi berjalan lancar. Terima kasih untuk dukungan teman-teman!",
      author: "Bob Smith",
      authorRole: "Siswa",
      emotion: "joy",
      timestamp: "3 jam lalu",
      likes: 25,
      replies: 15,
      category: "Pencapaian",
      responses: [],
    },
    {
      id: 3,
      title: "Diskusi: Pengaruh emosi terhadap daya ingat",
      content: "Menurut kalian, bagaimana emosi positif dan negatif mempengaruhi kemampuan mengingat materi?",
      author: "Prof. Michael Chen",
      authorRole: "Dosen",
      emotion: "neutral",
      timestamp: "5 jam lalu",
      likes: 18,
      replies: 22,
      category: "Diskusi Akademik",
      responses: [],
    },
  ]

  const filteredPosts = forumPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEmotion = emotionFilter === "all" || post.emotion === emotionFilter
    return matchesSearch && matchesEmotion
  })

  const analyzePostEmotion = (text: string) => {
    const lowerText = text.toLowerCase()

    if (lowerText.includes("senang") || lowerText.includes("bahagia") || lowerText.includes("berhasil")) {
      return "joy"
    } else if (lowerText.includes("sedih") || lowerText.includes("kecewa")) {
      return "sadness"
    } else if (lowerText.includes("takut") || lowerText.includes("cemas") || lowerText.includes("khawatir")) {
      return "fear"
    } else if (lowerText.includes("marah") || lowerText.includes("kesal")) {
      return "anger"
    } else {
      return "neutral"
    }
  }

  const handleSubmitPost = () => {
    if (!newPost.trim()) return

    const emotion = analyzePostEmotion(newPost)
    // Here you would typically send to backend
    console.log("New post:", { content: newPost, emotion, author: user.name })

    setNewPost("")
    setShowNewPost(false)
  }

  return (
    <main className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Forum Diskusi Emosional</h1>
          <p className="text-muted-foreground">Diskusi topik pembelajaran sambil mencatat emosi tiap respon</p>
        </div>
        <Button onClick={() => setShowNewPost(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Buat Post Baru
        </Button>
      </div>

      {/* New Post Form */}
      {showNewPost && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Buat Post Baru</CardTitle>
            <CardDescription>Bagikan pemikiran atau pertanyaan Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Apa yang ingin Anda diskusikan? (emosi Anda akan terdeteksi otomatis)"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                rows={4}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Emosi terdeteksi:</span>
                  <EmotionIndicator emotion={analyzePostEmotion(newPost)} size="sm" showLabel />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowNewPost(false)}>
                    Batal
                  </Button>
                  <Button onClick={handleSubmitPost} disabled={!newPost.trim()}>
                    <Send className="mr-2 h-4 w-4" />
                    Posting
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari diskusi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={emotionFilter} onValueChange={setEmotionFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
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

      {/* Forum Posts */}
      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>{post.author.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{post.author}</h3>
                      <Badge variant="outline" className="text-xs">
                        {post.authorRole}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
                    <p className="text-muted-foreground text-sm">{post.content}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <EmotionIndicator emotion={post.emotion} size="sm" showLabel />
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {post.timestamp}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Heart className="h-4 w-4 mr-1" />
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {post.replies}
                  </Button>
                </div>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Balas
                </Button>
              </div>

              {/* Sample Response */}
              {post.responses.length > 0 && (
                <div className="mt-4 pl-4 border-l-2 border-muted">
                  {post.responses.map((response) => (
                    <div key={response.id} className="flex items-start gap-3 py-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="text-xs">{response.author.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{response.author}</span>
                          <EmotionIndicator emotion={response.emotion} size="xs" />
                          <span className="text-xs text-muted-foreground">{response.timestamp}</span>
                        </div>
                        <p className="text-sm">{response.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Tidak ada diskusi ditemukan</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? "Coba ubah kata kunci pencarian" : "Belum ada diskusi yang tersedia"}
          </p>
          <Button onClick={() => setShowNewPost(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Mulai Diskusi Pertama
          </Button>
        </div>
      )}
    </main>
  )
}
