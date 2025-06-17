"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"

export function DashboardLayout({ children }) {
  const [user, setUser] = useState({ name: "Guest", role: "Siswa", avatar: undefined })
  const [isLoaded, setIsLoaded] = useState(false)

  // Load user data from localStorage on client
  useEffect(() => {
    const userData = localStorage.getItem("userData")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    }
    
    // Add a small delay for animation purposes
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <div className={`flex min-h-screen bg-gradient-to-br from-background to-muted/30 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
      <Sidebar user={user} />
      <div className={`flex-1 lg:ml-64 flex flex-col ${isLoaded ? 'animate-slide-up' : 'opacity-0'}`}>
        <div className="flex-1 rounded-tl-2xl shadow-sm bg-background">
          {children}
        </div>
      </div>
    </div>
  )
}
