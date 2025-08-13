import { createClient } from "@/lib/supabase/server"

export async function getDashboardData(userId: string) {
  const supabase = createClient()

  // Get study sessions for stats
  const { data: sessions } = await supabase
    .from("study_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false })

  // Get active goals
  const { data: goals } = await supabase.from("goals").select("*").eq("user_id", userId).eq("is_completed", false)

  // Get habits
  const { data: habits } = await supabase.from("habits").select("*").eq("user_id", userId).eq("is_active", true)

  // Calculate stats
  const totalStudyHours = sessions?.reduce((total, session) => total + session.duration_minutes / 60, 0) || 0
  const activeGoals = goals?.length || 0

  // Calculate current streak (simplified - would need more complex logic for real streak)
  const currentStreak = 5 // Placeholder

  // Sessions this week
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const sessionsThisWeek = sessions?.filter((session) => new Date(session.completed_at) > oneWeekAgo).length || 0

  // Recent sessions (last 5)
  const recentSessions =
    sessions?.slice(0, 5).map((session) => ({
      id: session.id,
      subject: session.subject,
      duration: session.duration_minutes,
      date: new Date(session.completed_at).toLocaleDateString(),
    })) || []

  // Goals with progress
  const goalsWithProgress =
    goals?.map((goal) => ({
      id: goal.id,
      title: goal.title,
      current: goal.current_value,
      target: goal.target_value,
      unit: goal.unit || "",
    })) || []

  return {
    stats: {
      totalStudyHours: Math.round(totalStudyHours * 10) / 10,
      activeGoals,
      currentStreak,
      sessionsThisWeek,
    },
    recentSessions,
    goals: goalsWithProgress,
  }
}
