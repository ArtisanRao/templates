"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, Check, X } from "lucide-react"
import { toggleHabitCompletion } from "@/lib/habits-actions"
import { useRouter } from "next/navigation"

interface Habit {
  id: string
  name: string
  description: string | null
  frequency: string
  target_count: number
  is_active: boolean
  created_at: string
}

interface HabitCompletion {
  id: string
  habit_id: string
  completed_date: string
  count: number
}

interface HabitsListProps {
  habits: Habit[]
  completions: HabitCompletion[]
}

export default function HabitsList({ habits, completions }: HabitsListProps) {
  const router = useRouter()

  const handleToggleCompletion = async (habitId: string) => {
    try {
      await toggleHabitCompletion(habitId)
      router.refresh()
    } catch (error) {
      console.error("Failed to toggle habit completion:", error)
    }
  }

  const isHabitCompletedToday = (habitId: string) => {
    return completions.some((completion) => completion.habit_id === habitId)
  }

  const getHabitCompletionCount = (habitId: string) => {
    const completion = completions.find((completion) => completion.habit_id === habitId)
    return completion?.count || 0
  }

  if (habits.length === 0) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="text-center py-12">
          <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">No habits yet</p>
          <p className="text-gray-500 text-sm">Create your first habit to start building consistency!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white mb-4">Today's Habits</h3>
      {habits.map((habit) => {
        const isCompleted = isHabitCompletedToday(habit.id)
        const completionCount = getHabitCompletionCount(habit.id)

        return (
          <Card key={habit.id} className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className={`text-white font-medium ${isCompleted ? "line-through opacity-75" : ""}`}>
                      {habit.name}
                    </h4>
                    <Badge
                      variant="secondary"
                      className={`${
                        habit.frequency === "daily"
                          ? "bg-blue-600/20 text-blue-300"
                          : habit.frequency === "weekly"
                            ? "bg-green-600/20 text-green-300"
                            : "bg-purple-600/20 text-purple-300"
                      }`}
                    >
                      {habit.frequency}
                    </Badge>
                    {isCompleted && (
                      <Badge variant="secondary" className="bg-green-600/20 text-green-300">
                        ✓ Done
                      </Badge>
                    )}
                  </div>

                  {habit.description && <p className="text-gray-300 text-sm mb-2">{habit.description}</p>}

                  <div className="text-gray-400 text-sm">
                    Target: {habit.target_count} time{habit.target_count > 1 ? "s" : ""} per{" "}
                    {habit.frequency.slice(0, -2)}
                    {completionCount > 0 && (
                      <span className="ml-2">
                        • Completed: {completionCount}/{habit.target_count}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isCompleted ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                      onClick={() => handleToggleCompletion(habit.id)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Undo
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleToggleCompletion(habit.id)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
