import { DashboardLayout } from "@/components/dashboard-layout"

export default function DetectionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}
