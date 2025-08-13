import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Target, Flame, BookOpen } from "lucide-react"

interface StatsOverviewProps {
  totalStudyHours: number
  activeGoals: number
  currentStreak: number
  sessionsThisWeek: number
}

export default function StatsOverview({
  totalStudyHours,
  activeGoals,
  currentStreak,
  sessionsThisWeek,
}: StatsOverviewProps) {
  const stats = [
    {
      title: "Total Study Hours",
      value: totalStudyHours,
      suffix: "hrs",
      icon: Clock,
      color: "text-blue-400",
    },
    {
      title: "Active Goals",
      value: activeGoals,
      suffix: "",
      icon: Target,
      color: "text-green-400",
    },
    {
      title: "Current Streak",
      value: currentStreak,
      suffix: "days",
      icon: Flame,
      color: "text-orange-400",
    },
    {
      title: "Sessions This Week",
      value: sessionsThisWeek,
      suffix: "",
      icon: BookOpen,
      color: "text-purple-400",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stat.value}
              {stat.suffix}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
