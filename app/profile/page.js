"use client"

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
  const [previewUrl, setPreviewUrl] = useState(null)
  const fileInputRef = useRef(null)

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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result
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
              <Button
                size="icon"
                variant="secondary"
                className="absolute -bottom-2 -right-2 rounded-full h-8 w-8"
                onClick={triggerFileInput}
              >
                <Camera className="h-4 w-4" />
                <span className="sr-only">Upload photo</span>
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>

            <div className="w-full">
              <Label htmlFor="user-name" className="text-xs text-muted-foreground mb-1 block">
                Nama Lengkap
              </Label>
              <h3 className="font-semibold text-lg">{user.name}</h3>
            </div>

            <div className="w-full mt-4 grid gap-4">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{user.phone}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{user.address}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informasi Profil</CardTitle>
            <CardDescription>Perbarui informasi profil Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal">
              <TabsList className="mb-6">
                <TabsTrigger value="personal">Data Pribadi</TabsTrigger>
                <TabsTrigger value="account">Akun & Keamanan</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      value={user.name}
                      onChange={(e) => setUser({ ...user, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    <Input
                      id="phone"
                      value={user.phone}
                      onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Alamat</Label>
                    <Input
                      id="address"
                      value={user.address}
                      onChange={(e) => setUser({ ...user, address: e.target.value })}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="account" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" value={user.name.toLowerCase().replace(/\s/g, "")} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" value={user.role} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Password Saat Ini</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Password Baru</Label>
                    <Input id="new-password" type="password" />
                  </div>
                </div>
              </TabsContent>

              <div className="mt-6 flex justify-end">
                <Button onClick={saveProfile}>Simpan Perubahan</Button>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
