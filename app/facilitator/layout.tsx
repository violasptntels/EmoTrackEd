import { DashboardLayout } from "../../components/dashboard-layout"

export default function FacilitatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}
