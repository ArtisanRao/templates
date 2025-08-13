import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, BookOpen } from "lucide-react"

interface StudySession {
  id: string
  subject: string
  duration: number
  notes?: string
  date: string
  time: string
}

interface RecentStudySessionsProps {
  sessions: StudySession[]
}

export default function RecentStudySessions({ sessions }: RecentStudySessionsProps) {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Recent Study Sessions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No study sessions yet.</p>
            <p className="text-gray-500 text-sm">Start your first session with the timer!</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {sessions.map((session) => (
              <div key={session.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-white font-medium">{session.subject}</h4>
                    <p className="text-gray-400 text-sm">
                      {session.date} at {session.time}
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-blue-600/20 text-blue-300">
                    {session.duration}m
                  </Badge>
                </div>

                {session.notes && <p className="text-gray-300 text-sm mt-2 p-2 bg-white/5 rounded">{session.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
