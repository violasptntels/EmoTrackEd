import { DashboardLayout } from "@/components/dashboard-layout"

export default function ForumLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}
