"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationBell } from "@/components/notification-bell"
import {
  Brain,
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  Menu,
  Users,
  BarChart3,
  TrendingUp,
  MessageSquare,
  BookOpen,
  Award,
  Target,
  Shield,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface SidebarProps {
  user?: {
    name: string
    role: string
    avatar?: string
  }
}

export function Sidebar({ user: propUser }: SidebarProps) {
  const pathname = usePathname()
  const [user, setUser] = useState(propUser || { name: "Guest", role: "Siswa" })

  useEffect(() => {
    if (!propUser) {
      const userData = localStorage.getItem("userData")
      if (userData) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      }
    }
  }, [propUser])

  const handleLogout = () => {
    localStorage.removeItem("userData")
    window.location.href = "/"
  }

  // Routes berdasarkan role yang disesuaikan
  const getRoutes = () => {
    if (user.role === "Admin") {
      return [
        {
          name: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          name: "Kelola Pengguna",
          href: "/admin/users",
          icon: Users,
        },
        {
          name: "Laporan Emosi Global",
          href: "/admin/reports",
          icon: BarChart3,
        },
        {
          name: "Manajemen Platform",
          href: "/admin/system",
          icon: Shield,
        },
      ]
    } else if (user.role === "Fasilitator") {
      return [
        {
          name: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          name: "Kelas Virtual",
          href: "/classes",
          icon: BookOpen,
        },
        {
          name: "Kelola Siswa",
          href: "/facilitator/students",
          icon: Users,
        },
        {
          name: "Emosi Siswa",
          href: "/facilitator/emotions",
          icon: TrendingUp,
        },
        {
          name: "Beri Feedback",
          href: "/facilitator/feedback",
          icon: MessageSquare,
        },
        {
          name: "EmoScore Siswa",
          href: "/emoscore",
          icon: Target,
        },
        {
          name: "Ranking Emosi",
          href: "/ranking",
          icon: Award,
        },
        {
          name: "Pengaturan",
          href: "/settings",
          icon: Settings,
        },
      ]
    } else {
      // Siswa - disesuaikan dengan requirement
      return [
        {
          name: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          name: "Kelas Virtual",
          href: "/classes",
          icon: BookOpen,
        },
        {
          name: "Refleksi Pembelajaran",
          href: "/reflection",
          icon: FileText,
        },
        {
          name: "Grafik Emosi Pribadi",
          href: "/analytics",
          icon: TrendingUp,
        },
        {
          name: "Pengaturan",
          href: "/settings",
          icon: Settings,
        },
      ]
    }
  }

  const routes = getRoutes()

  return (
    <>
      {/* Mobile Navigation */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-border/40">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
            EmoTrackEd
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-border/40">
                  <div className="flex items-center gap-2">
                    <Brain className="h-6 w-6 text-primary" />
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                      EmoTrackEd
                    </h1>
                  </div>
                </div>
                <div className="p-4 border-b border-border/40">
                  <Link href="/profile" className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.role}</p>
                    </div>
                  </Link>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                  {routes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                        pathname === route.href ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted",
                      )}
                    >
                      <route.icon className="h-5 w-5" />
                      {route.name}
                    </Link>
                  ))}
                </nav>
                <div className="p-4 border-t border-border/40">
                  <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleLogout}>
                    <LogOut className="h-5 w-5 mr-2" />
                    Keluar
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-border/40 lg:bg-background">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border/40">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                EmoTrackEd
              </h1>
            </div>
          </div>
          <div className="p-4 border-b border-border/40">
            <Link href="/profile" className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.role}</p>
              </div>
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  pathname === route.href ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted",
                )}
              >
                <route.icon className="h-5 w-5" />
                {route.name}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-border/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <NotificationBell />
              <ThemeToggle />
            </div>
            <Button variant="ghost" size="sm" className="text-destructive" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
