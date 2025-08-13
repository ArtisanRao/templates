import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import StudyTimer from "@/components/study/study-timer"
import QuickLogSession from "@/components/study/quick-log-session"
import RecentStudySessions from "@/components/study/recent-study-sessions"

export default async function StudyPage() {
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <h1 className="text-2xl font-bold mb-4 text-white">Connect Supabase to get started</h1>
      </div>
    )
  }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get recent study sessions
  const { data: sessions } = await supabase
    .from("study_sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(10)

  const recentSessions =
    sessions?.map((session) => ({
      id: session.id,
      subject: session.subject,
      duration: session.duration_minutes,
      notes: session.notes,
      date: new Date(session.completed_at).toLocaleDateString(),
      time: new Date(session.completed_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    })) || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <DashboardHeader userEmail={user.email || ""} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Study Session Tracker</h2>
            <p className="text-gray-300">Track your study time and build consistent habits</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Timer and Quick Log */}
            <div className="space-y-8">
              <StudyTimer />
              <QuickLogSession />
            </div>

            {/* Right Column - Recent Sessions */}
            <div>
              <RecentStudySessions sessions={recentSessions} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
