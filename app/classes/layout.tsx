import { DashboardLayout } from "@/components/dashboard-layout"

export default function ClassesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}
