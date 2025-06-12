"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, MapPin, Camera } from "lucide-react"

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: "Guest",
    role: "Siswa",
    email: "user@example.com",
    phone: "+62 812 3456 7890",
    address: "Jakarta, Indonesia",
    joinDate: "1 Juni 2025",
    avatar: "",
  })
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Ambil data user dari localStorage
    const userData = localStorage.getItem("userData")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser({
        ...parsedUser,
        email: parsedUser.email || "user@example.com",
        phone: parsedUser.phone || "+62 812 3456 7890",
        address: parsedUser.address || "Jakarta, Indonesia",
        joinDate: parsedUser.joinDate || "1 Juni 2025",
        avatar: parsedUser.avatar || "",
      })

      if (parsedUser.avatar) {
        setPreviewUrl(parsedUser.avatar)
      }
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setPreviewUrl(result)

        // Update user data with new avatar
        const updatedUser = { ...user, avatar: result }
        setUser(updatedUser)
        localStorage.setItem("userData", JSON.stringify(updatedUser))
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const saveProfile = () => {
    localStorage.setItem("userData", JSON.stringify(user))
    alert("Profil berhasil disimpan!")
  }

  return (
    <main className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Profil Pengguna</h1>
          <p className="text-muted-foreground">Kelola informasi profil Anda</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
            {user.role}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Foto Profil</CardTitle>
            <CardDescription>Unggah atau perbarui foto profil Anda</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative mb-6">
              <Avatar className="h-32 w-32">
                <AvatarImage src={previewUrl || "/placeholder.svg"} />
                <AvatarFallback className="text-4xl">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Button size="icon" className="absolute bottom-0 right-0 rounded-full" onClick={triggerFileInput}>
                <Camera className="h-4 w-4" />
              </Button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
            <div className="text-center">
              <h3 className="font-medium text-lg">{user.name}</h3>
              <p className="text-muted-foreground">{user.role}</p>
              <p className="text-xs text-muted-foreground mt-1">Bergabung sejak {user.joinDate}</p>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informasi Profil</CardTitle>
            <CardDescription>Kelola detail informasi profil Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="personal">Data Pribadi</TabsTrigger>
                <TabsTrigger value="account">Akun</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <div className="flex">
                      <User className="h-4 w-4 mr-2 mt-3 text-muted-foreground" />
                      <Input id="name" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    <div className="flex">
                      <Phone className="h-4 w-4 mr-2 mt-3 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={user.phone}
                        onChange={(e) => setUser({ ...user, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex">
                      <Mail className="h-4 w-4 mr-2 mt-3 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Alamat</Label>
                    <div className="flex">
                      <MapPin className="h-4 w-4 mr-2 mt-3 text-muted-foreground" />
                      <Input
                        id="address"
                        value={user.address}
                        onChange={(e) => setUser({ ...user, address: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button onClick={saveProfile}>Simpan Perubahan</Button>
                </div>
              </TabsContent>

              <TabsContent value="account" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Password Saat Ini</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Password Baru</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Konfirmasi Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <div className="pt-4">
                  <Button>Perbarui Password</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
