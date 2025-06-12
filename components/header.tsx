"use client"

import { useEffect, useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationBell } from "@/components/notification-bell"

export function Header() {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window !== 'undefined') {
      const checkIsMobile = () => {
        setIsMobile(window.innerWidth < 1024)
      }
      
      // Initial check
      checkIsMobile()
      
      // Add event listener for window resize
      window.addEventListener('resize', checkIsMobile)
      
      // Cleanup
      return () => window.removeEventListener('resize', checkIsMobile)
    }
  }, [])
  
  // Only show header components on desktop or larger screens
  // On mobile they are already shown in the mobile navigation bar
  if (isMobile) {
    return null
  }
  
  return (
    <div className="h-16 border-b border-border/40 flex items-center justify-end px-6 sticky top-0 bg-background z-10">
      <div className="flex items-center gap-3">
        <NotificationBell />
        <ThemeToggle />
      </div>
    </div>
  )
}
