"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Plus, Play, Square, Edit } from "lucide-react"
import Link from "next/link"

export default function SessionsPage() {
  const [sessionTitle, setSessionTitle] = useState("")
  const [sessionDescription, setSessionDescription] = useState("")
  const [sessionSubject, setSessionSubject] = useState("")

  const sessions = [
    {
      id: 1,
      title: "Matematika - Aljabar Dasar",
      description: "Pengenalan konsep aljabar dan persamaan linear",
      subject: "Matematika",
      date: "12 Jun 2025",
      time: "09:00 - 10:30",
      participants: 28,
      status: "Completed",
    },
    {
      id: 2,
      title: "Bahasa Inggris - Grammar",
      description: "Pembelajaran tenses dan struktur kalimat",
      subject: "Bahasa Inggris",
      date: "12 Jun 2025",
      time: "11:00 - 12:30",
      participants: 25,
      status: "Ongoing",
    },
    {
      id: 3,
      title: "Ilmu Sosial - Sejarah Indonesia",
      description: "Perjuangan kemerdekaan Indonesia",
      subject: "Ilmu Sosial",
      date: "13 Jun 2025",
      time: "08:00 - 09:30",
      participants: 30,
      status: "Scheduled",
    },
  ]

  const handleCreateSession = (e) => {
    e.preventDefault()
    // Logic untuk membuat sesi baru
    console.log("Creating session:", { sessionTitle, sessionDescription, sessionSubject })
    // Reset form
    setSessionTitle("")
    setSessionDescription("")
    setSessionSubject("")
  }

  return (
    <main className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Kelola Sesi</h1>
          <p className="text-muted-foreground">Buat dan kelola sesi pembelajaran</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create New Session */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Buat Sesi Baru
            </CardTitle>
            <CardDescription>Buat sesi pembelajaran baru untuk siswa</CardDescription>
          </CardHeader>
          <form onSubmit={handleCreateSession}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Sesi</Label>
                <Input
                  id="title"
                  placeholder="Masukkan judul sesi"
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Mata Pelajaran</Label>
                <Select value={sessionSubject} onValueChange={setSessionSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih mata pelajaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matematika">Matematika</SelectItem>
                    <SelectItem value="bahasa-inggris">Bahasa Inggris</SelectItem>
                    <SelectItem value="ilmu-sosial">Ilmu Sosial</SelectItem>
                    <SelectItem value="ilmu-alam">Ilmu Alam</SelectItem>
                    <SelectItem value="seni">Seni</SelectItem>
                    <SelectItem value="olahraga">Olahraga</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  placeholder="Deskripsi sesi pembelajaran"
                  value={sessionDescription}
                  onChange={(e) => setSessionDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="date">Tanggal</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Waktu</Label>
                  <Input id="time" type="time" />
                </div>
              </div>
              <Button type="submit" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Buat Sesi
              </Button>
            </CardContent>
          </form>
        </Card>

        {/* Sessions List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Daftar Sesi ({sessions.length})</CardTitle>
            <CardDescription>Sesi pembelajaran yang telah dibuat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className="p-4 border rounded-lg hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold">{session.title}</h3>
                      <p className="text-sm text-muted-foreground">{session.description}</p>
                    </div>
                    <Badge
                      variant={
                        session.status === "Completed"
                          ? "default"
                          : session.status === "Ongoing"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {session.status === "Completed"
                        ? "Selesai"
                        : session.status === "Ongoing"
                          ? "Berlangsung"
                          : "Terjadwal"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{session.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{session.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{session.participants} siswa</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {session.status === "Scheduled" && (
                      <Button size="sm" asChild>
                        <Link href={`/classes/${session.id}/manage`}>
                          <Play className="h-4 w-4 mr-1" />
                          Mulai
                        </Link>
                      </Button>
                    )}
                    {session.status === "Ongoing" && (
                      <Button size="sm" variant="destructive">
                        <Square className="h-4 w-4 mr-1" />
                        Akhiri
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      Detail
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
