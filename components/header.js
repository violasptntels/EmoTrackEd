"use client"

import { useEffect, useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationBell } from "@/components/notification-bell"
import { usePathname } from "next/navigation"

export function Header() {
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  
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
    // Don't show notification bell and theme toggle on facilitator pages
  // They will be shown next to the Facilitator title instead
  const [isFacilitatorPage, setIsFacilitatorPage] = useState(false)
  
  useEffect(() => {
    // Check if it's a facilitator page or if user is a facilitator on the dashboard
    const pathIsFacilitator = pathname.includes('/facilitator')
    
    if (pathname.includes('/dashboard') && typeof window !== 'undefined') {
      const userData = localStorage.getItem('userData')
      if (userData) {
        const user = JSON.parse(userData)
        setIsFacilitatorPage(pathIsFacilitator || user.role === 'Fasilitator')
        return
      }
    }
    
    setIsFacilitatorPage(pathIsFacilitator)
  }, [pathname])
  
  return (
    <div className="h-16 border-b border-border/40 flex items-center justify-between px-6 sticky top-0 bg-background z-10">
      <div className="text-sm font-medium">
        {/* Display current path as breadcrumb */}
        <span className="text-muted-foreground">
          {pathname === "/" ? "Home" : pathname.split("/").filter(Boolean).join(" / ")}
        </span>
      </div>
      {!isFacilitatorPage && (
        <div className="flex items-center gap-3">
          <NotificationBell />
          <ThemeToggle />
        </div>
      )}
    </div>
  )
}
