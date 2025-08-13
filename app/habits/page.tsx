import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import HabitsList from "@/components/habits/habits-list"
import CreateHabitForm from "@/components/habits/create-habit-form"

export default async function HabitsPage() {
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

  // Get user's habits with today's completions
  const { data: habits } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  // Get today's habit completions
  const today = new Date().toISOString().split("T")[0]
  const { data: completions } = await supabase
    .from("habit_completions")
    .select("*")
    .eq("user_id", user.id)
    .eq("completed_date", today)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <DashboardHeader userEmail={user.email || ""} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Habits</h2>
            <p className="text-gray-300">Build consistent daily and weekly routines</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Create Habit */}
            <div className="lg:col-span-1">
              <CreateHabitForm />
            </div>

            {/* Right Column - Habits List */}
            <div className="lg:col-span-2">
              <HabitsList habits={habits || []} completions={completions || []} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
