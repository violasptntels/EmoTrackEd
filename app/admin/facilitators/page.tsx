"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, MoreHorizontal, Mail, Phone, Calendar, CheckCircle, XCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function FacilitatorsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Ensure this matches the data shown on the dashboard
  const totalFacilitators = 24
  const activeFacilitators = 8

  // Data fasilitator
  const facilitators = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "+62 812 3456 7890",
      joinDate: "10 Jan 2025",
      status: "active",
      classes: 5,
      students: 120,
      avatar: "/placeholder.svg",
    },
    {
      id: 2,
      name: "Prof. Michael Chen",
      email: "michael.chen@example.com",
      phone: "+62 813 4567 8901",
      joinDate: "15 Feb 2025",
      status: "active",
      classes: 3,
      students: 85,
      avatar: "/placeholder.svg",
    },
    {
      id: 3,
      name: "Dr. Lisa Wang",
      email: "lisa.wang@example.com",
      phone: "+62 814 5678 9012",
      joinDate: "20 Mar 2025",
      status: "inactive",
      classes: 0,
      students: 0,
      avatar: "/placeholder.svg",
    },
    {
      id: 4,
      name: "Dr. John Smith",
      email: "john.smith@example.com",
      phone: "+62 815 6789 0123",
      joinDate: "25 Apr 2025",
      status: "active",
      classes: 4,
      students: 95,
      avatar: "/placeholder.svg",
    },
    {
      id: 5,
      name: "Prof. Emily Davis",
      email: "emily.davis@example.com",
      phone: "+62 816 7890 1234",
      joinDate: "30 May 2025",
      status: "active",
      classes: 2,
      students: 45,
      avatar: "/placeholder.svg",
    },
  ]

  const filteredFacilitators = facilitators.filter(
    (facilitator) =>
      facilitator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facilitator.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <main className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Kelola Fasilitator</h1>
          <p className="text-muted-foreground">Tambah, edit, dan kelola fasilitator</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Fasilitator
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Fasilitator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFacilitators}</div>
              <p className="text-xs text-muted-foreground mt-1">{activeFacilitators} aktif hari ini</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Fasilitator Aktif</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeFacilitators}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((activeFacilitators / totalFacilitators) * 100)}% dari total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Rata-rata Siswa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">69</div>
              <p className="text-xs text-muted-foreground mt-1">Per fasilitator</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Fasilitator</CardTitle>
          <CardDescription>Kelola fasilitator dan lihat informasi mereka</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari fasilitator..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fasilitator</TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Siswa</TableHead>
                  <TableHead>Tanggal Bergabung</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFacilitators.map((facilitator) => (
                  <TableRow key={facilitator.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={facilitator.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{facilitator.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{facilitator.name}</p>
                          <p className="text-xs text-muted-foreground">ID: {facilitator.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                          {facilitator.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                          {facilitator.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {facilitator.status === "active" ? (
                        <Badge className="bg-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Aktif
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <XCircle className="h-3 w-3 mr-1" />
                          Tidak Aktif
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{facilitator.classes}</TableCell>
                    <TableCell>{facilitator.students}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                        {facilitator.joinDate}
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
                          <DropdownMenuItem>Edit Fasilitator</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Hapus Fasilitator</DropdownMenuItem>
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
