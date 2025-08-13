import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Target } from "lucide-react"

interface Goal {
  id: string
  title: string
  current: number
  target: number
  unit: string
}

interface GoalsProgressProps {
  goals: Goal[]
}

export default function GoalsProgress({ goals }: GoalsProgressProps) {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Target className="h-5 w-5" />
          Goal Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        {goals.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No goals set yet. Create your first goal!</p>
        ) : (
          <div className="space-y-6">
            {goals.map((goal) => {
              const progress = (goal.current / goal.target) * 100
              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-white font-medium">{goal.title}</h4>
                    <span className="text-gray-400 text-sm">
                      {goal.current}/{goal.target} {goal.unit}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
