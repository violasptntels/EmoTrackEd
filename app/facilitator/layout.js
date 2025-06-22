"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "../../components/dashboard-layout"

export default function FacilitatorLayout({ children }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
    // Check if user is logged in and has facilitator role
    const userData = localStorage.getItem("userData");
    if (userData) {
      const user = JSON.parse(userData);
      const role = user.role ? user.role.toLowerCase() : "";
      
      // Strictly check for facilitator role
      if (role === "fasilitator" || role === "facilitator" || role.includes("fasil")) {
        console.log("User authorized as facilitator");
        setIsAuthorized(true);
      } else {
        // Redirect non-facilitators to dashboard with message
        console.log("User not authorized as facilitator, redirecting");
        alert("Anda tidak memiliki akses ke halaman ini. Redirecting to dashboard.");
        router.push("/dashboard");
      }
    } else {
      // Redirect unauthenticated users to login
      console.log("User not logged in, redirecting to login");
      router.push("/login");
    }
    
    setIsLoading(false);
  }, [router]);
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!isAuthorized) {
    return null; // Will redirect via useEffect
  }
  
  return <DashboardLayout>{children}</DashboardLayout>;
}
