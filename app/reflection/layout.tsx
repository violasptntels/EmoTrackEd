import { DashboardLayout } from "@/components/dashboard-layout"

export default function ReflectionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}
