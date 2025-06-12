"use client"

import { ReactNode, useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState({ name: "Guest", role: "Siswa", avatar: undefined })

  // Load user data from localStorage on client
  useEffect(() => {
    const userData = localStorage.getItem("userData")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    }
  }, [])
  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} />
      <div className="flex-1 lg:ml-64 flex flex-col">
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
