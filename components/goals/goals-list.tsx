"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Target, Calendar, Plus, Minus, Check } from "lucide-react"
import { updateGoalProgress, toggleGoalCompletion } from "@/lib/goals-actions"
import { useRouter } from "next/navigation"

interface Goal {
  id: string
  title: string
  description: string | null
  target_value: number
  current_value: number
  unit: string
  category: string | null
  deadline: string | null
  is_completed: boolean
  created_at: string
}

interface GoalsListProps {
  goals: Goal[]
}

export default function GoalsList({ goals }: GoalsListProps) {
  const router = useRouter()

  const handleProgressUpdate = async (goalId: string, increment: number) => {
    try {
      await updateGoalProgress(goalId, increment)
      router.refresh()
    } catch (error) {
      console.error("Failed to update progress:", error)
    }
  }

  const handleToggleCompletion = async (goalId: string) => {
    try {
      await toggleGoalCompletion(goalId)
      router.refresh()
    } catch (error) {
      console.error("Failed to toggle completion:", error)
    }
  }

  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return null
    const date = new Date(deadline)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return "Overdue"
    if (diffDays === 0) return "Due today"
    if (diffDays === 1) return "Due tomorrow"
    return `${diffDays} days left`
  }

  if (goals.length === 0) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="text-center py-12">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">No goals yet</p>
          <p className="text-gray-500 text-sm">Create your first goal to start tracking progress!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {goals.map((goal) => {
        const progress = (goal.current_value / goal.target_value) * 100
        const deadlineText = formatDeadline(goal.deadline)

        return (
          <Card key={goal.id} className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className={`text-white ${goal.is_completed ? "line-through opacity-75" : ""}`}>
                    {goal.title}
                  </CardTitle>
                  {goal.description && <p className="text-gray-300 text-sm mt-1">{goal.description}</p>}
                </div>
                <div className="flex items-center gap-2">
                  {goal.category && (
                    <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
                      {goal.category}
                    </Badge>
                  )}
                  {goal.is_completed && (
                    <Badge variant="secondary" className="bg-green-600/20 text-green-300">
                      Completed
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Progress</span>
                  <span className="text-white text-sm">
                    {goal.current_value}/{goal.target_value} {goal.unit}
                  </span>
                </div>
                <Progress value={Math.min(progress, 100)} className="h-2" />
                <div className="text-center text-gray-400 text-sm">{Math.round(progress)}% complete</div>
              </div>

              {/* Deadline */}
              {deadlineText && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className={deadlineText.includes("Overdue") ? "text-red-400" : "text-gray-300"}>
                    {deadlineText}
                  </span>
                </div>
              )}

              {/* Actions */}
              {!goal.is_completed && (
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                      onClick={() => handleProgressUpdate(goal.id, -1)}
                      disabled={goal.current_value <= 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleProgressUpdate(goal.id, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleToggleCompletion(goal.id)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Mark Complete
                  </Button>
                </div>
              )}

              {goal.is_completed && (
                <div className="pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                    onClick={() => handleToggleCompletion(goal.id)}
                  >
                    Mark Incomplete
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
