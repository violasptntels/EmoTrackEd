import { DashboardLayout } from "@/components/dashboard-layout"

export default function RankingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}
