import type { ReactNode } from "react"

export default function ClassDetailLayout({
  children,
}: {
  children: ReactNode
}) {
  // We don't need to wrap this in DashboardLayout because the parent (classes/layout.tsx) already does
  return <>{children}</>
}
