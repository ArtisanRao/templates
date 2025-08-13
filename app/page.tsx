import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import StatsOverview from "@/components/dashboard/stats-overview"
import RecentSessions from "@/components/dashboard/recent-sessions"
import GoalsProgress from "@/components/dashboard/goals-progress"
import QuickActions from "@/components/dashboard/quick-actions"
import { getDashboardData } from "@/lib/dashboard-data"

export default async function Home() {
  // If Supabase is not configured, show setup message directly
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <h1 className="text-2xl font-bold mb-4 text-white">Connect Supabase to get started</h1>
      </div>
    )
  }

  // Get the user from the server
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If no user, redirect to login
  if (!user) {
    redirect("/auth/login")
  }

  // Get dashboard data
  const dashboardData = await getDashboardData(user.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <DashboardHeader userEmail={user.email || ""} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back!</h2>
            <p className="text-gray-300">Ready to continue your learning journey?</p>
          </div>

          {/* Stats Overview */}
          <StatsOverview {...dashboardData.stats} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              <RecentSessions sessions={dashboardData.recentSessions} />
              <GoalsProgress goals={dashboardData.goals} />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <QuickActions />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
