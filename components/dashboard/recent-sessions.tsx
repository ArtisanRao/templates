import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

interface Session {
  id: string
  subject: string
  duration: number
  date: string
}

interface RecentSessionsProps {
  sessions: Session[]
}

export default function RecentSessions({ sessions }: RecentSessionsProps) {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Study Sessions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No study sessions yet. Start your first session!</p>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">{session.subject}</h4>
                  <p className="text-gray-400 text-sm">{session.date}</p>
                </div>
                <Badge variant="secondary" className="bg-blue-600/20 text-blue-300">
                  {session.duration}m
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
