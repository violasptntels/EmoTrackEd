import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function UsersPage() {
  // Ensure this matches the data shown on the dashboard
  const totalUsers = 156
  const newUsersThisWeek = 12

  return (
    <div>
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Pengguna</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">+{newUsersThisWeek} pengguna baru minggu ini</p>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* rest of the page content here */}
    </div>
  )
}
