import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Play, Target, Zap } from "lucide-react"
import Link from "next/link"

export default function QuickActions() {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <Link href="/study">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white h-20 flex flex-col gap-2 w-full">
              <Play className="h-6 w-6" />
              <span>Start Session</span>
            </Button>
          </Link>
          <Link href="/goals">
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 h-20 flex flex-col gap-2 bg-transparent w-full"
            >
              <Target className="h-6 w-6" />
              <span>Add Goal</span>
            </Button>
          </Link>
          <Link href="/habits">
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 h-20 flex flex-col gap-2 bg-transparent w-full"
            >
              <Zap className="h-6 w-6" />
              <span>Add Habit</span>
            </Button>
          </Link>
          <Button
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 h-20 flex flex-col gap-2 bg-transparent"
          >
            <Plus className="h-6 w-6" />
            <span>More</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
