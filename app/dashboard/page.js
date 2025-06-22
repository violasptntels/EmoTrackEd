"use client"

import { useEffect, useState } from "react"
import { RoleDashboard } from "@/components/role-dashboard"

export default function DashboardPage() {
  const [user, setUser] = useState({
    name: "Guest",
    role: "Siswa",
  })

  useEffect(() => {
    // Ambil data user dari localStorage
    const userData = localStorage.getItem("userData")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    }
  }, [])
  // Konversi role untuk komponen
  const roleType = user.role ? user.role.toLowerCase() : "siswa"
  
  console.log("Dashboard - User Role:", user.role, "Role Type:", roleType);

  return <RoleDashboard role={roleType} user={user} />
}
