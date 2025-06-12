import { DashboardLayout } from "@/components/dashboard-layout"

export default function EmoscoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}
