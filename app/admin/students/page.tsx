"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EmotionIndicator } from "@/components/emotion-indicator"
import { Search, Plus, MoreHorizontal, Mail, Phone, Calendar, BookOpen, BarChart3 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Ensure this matches the data shown on the dashboard
  const totalStudents = 132
  const activeStudents = 89

  // Data siswa
  const students = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      phone: "+62 812 3456 7890",
      joinDate: "10 Jan 2025",
      classes: 3,
      reflections: 12,
      emotion: "joy",
      avatar: "/placeholder.svg",
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob.smith@example.com",
      phone: "+62 813 4567 8901",
      joinDate: "15 Feb 2025",
      classes: 2,
      reflections: 8,
      emotion: "neutral",
      avatar: "/placeholder.svg",
    },
    {
      id: 3,
      name: "Carol Davis",
      email: "carol.davis@example.com",
      phone: "+62 814 5678 9012",
      joinDate: "20 Mar 2025",
      classes: 4,
      reflections: 15,
      emotion: "sadness",
      avatar: "/placeholder.svg",
    },
    {
      id: 4,
      name: "David Wilson",
      email: "david.wilson@example.com",
      phone: "+62 815 6789 0123",
      joinDate: "25 Apr 2025",
      classes: 1,
      reflections: 3,
      emotion: "fear",
      avatar: "/placeholder.svg",
    },
    {
      id: 5,
      name: "Eva Brown",
      email: "eva.brown@example.com",
      phone: "+62 816 7890 1234",
      joinDate: "30 May 2025",
      classes: 3,
      reflections: 10,
      emotion: "joy",
      avatar: "/placeholder.svg",
    },
  ]

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <main className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Kelola Siswa</h1>
          <p className="text-muted-foreground">Tambah, edit, dan kelola siswa</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Siswa
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Siswa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground mt-1">{activeStudents} aktif hari ini</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Rata-rata Kelas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.6</div>
              <p className="text-xs text-muted-foreground mt-1">Kelas per siswa</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Rata-rata Refleksi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">9.6</div>
              <p className="text-xs text-muted-foreground mt-1">Refleksi per siswa</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Siswa</CardTitle>
          <CardDescription>Kelola siswa dan lihat informasi mereka</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari siswa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Siswa</TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead>Emosi Terkini</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Refleksi</TableHead>
                  <TableHead>Tanggal Bergabung</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={student.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">ID: {student.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                          {student.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                          {student.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <EmotionIndicator emotion={student.emotion} size="md" showLabel />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <BookOpen className="h-3 w-3 mr-1 text-muted-foreground" />
                        {student.classes}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <BarChart3 className="h-3 w-3 mr-1 text-muted-foreground" />
                        {student.reflections}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                        {student.joinDate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Aksi</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                          <DropdownMenuItem>Edit Siswa</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Hapus Siswa</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
