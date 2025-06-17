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
  User,
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

export function Sidebar({ user: propUser }) {
  const pathname = usePathname()
  const [user, setUser] = useState(propUser || { name: "Guest", role: "Siswa" })
  const [routes, setRoutes] = useState([])

  useEffect(() => {
    // Update user from props or localStorage
    if (propUser) {
      setUser(propUser)
    } else {
      const userData = localStorage.getItem("userData")
      if (userData) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      }
    }    // Route configuration based on user role
    const roleRoutes = {      fasilitator: [
        {
          title: "Akun",
          routes: [
            {
              icon: User,
              label: "Profil Saya",
              href: "/profile",
            },
          ],
        },
        {
          title: "Manajemen",
          routes: [
            {
              icon: LayoutDashboard,
              label: "Dashboard",
              href: "/dashboard",
            },
            {
              icon: BookOpen,
              label: "Sesi Kelas",
              href: "/facilitator/sessions",
            },
            {
              icon: Users,
              label: "Daftar Siswa",
              href: "/facilitator/students",
            },
          ],
        },
        {
          title: "Analisis",
          routes: [
            {
              icon: BarChart3,
              label: "Data Emosi",
              href: "/facilitator/emotions",
            },
            {
              icon: FileText,
              label: "Refleksi Siswa",
              href: "/facilitator/reflections",
            },
            {
              icon: MessageSquare,
              label: "Feedback",
              href: "/facilitator/feedback",
            },
          ],
        },
      ],siswa: [
        {
          title: "Akun",
          routes: [
            {
              icon: User,
              label: "Profil Saya",
              href: "/profile",
            },
          ],
        },        {
          title: "Pembelajaran",
          routes: [
            {
              icon: LayoutDashboard,
              label: "Dashboard",
              href: "/dashboard",
            },
            {
              icon: BookOpen,
              label: "Kelas Saya",
              href: "/classes",
            },
            {
              icon: BarChart3,
              label: "Laporan Emosi",
              href: "/emotion-report",
            },
            {
              icon: Shield,
              label: "Refleksi",
              href: "/reflection",
            },
          ],
        },
      ],
    }

    // Set routes based on user role (lowercase)
    const role = user.role.toLowerCase()
    if (["fasilitator", "siswa"].includes(role)) {
      setRoutes(roleRoutes[role])
    } else {
      setRoutes(roleRoutes.siswa) // Default to siswa routes
    }
  }, [propUser])

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("userData")
    window.location.href = "/login"
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const SidebarRoutes = () => (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center gap-2 px-4">
        <Brain className="h-8 w-8 text-primary" />
        <span className="font-bold text-xl">EmoTrackEd</span>
      </div>

      <div className="flex flex-col gap-1">
        {routes.map((section, i) => (
          <div key={i} className="px-3 py-2">
            <h3 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">{section.title}</h3>
            <div className="space-y-1">
              {section.routes.map((route, j) => (
                <Button
                  key={j}
                  asChild
                  variant={pathname === route.href ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", pathname === route.href ? "bg-muted" : "")}
                >
                  <Link href={route.href}>
                    <route.icon className="mr-2 h-4 w-4" />
                    {route.label}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto px-3 py-2">
        <Button asChild variant="ghost" className="w-full justify-start">
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            Pengaturan
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Keluar
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile sidebar trigger */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full shadow-lg lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SidebarRoutes />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <aside className="fixed hidden h-full w-64 flex-col border-r lg:flex">
        <SidebarRoutes />
      </aside>

      {/* Top bar for mobile */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 lg:hidden">
        <div className="flex items-center gap-2 flex-1">
          <Brain className="h-6 w-6 text-primary" />
          <span className="font-bold">EmoTrackEd</span>
        </div>        <div className="flex items-center gap-4">
          <NotificationBell />
          <ThemeToggle />
          <Link href="/profile">
            <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80">
              {user?.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </header>
    </>
  )
}
