"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Play, Pause, Square, Clock } from "lucide-react"
import { logStudySession } from "@/lib/study-actions"
import { useRouter } from "next/navigation"

export default function StudyTimer() {
  const [time, setTime] = useState(0) // in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [subject, setSubject] = useState("")
  const [notes, setNotes] = useState("")
  const [isLogging, setIsLogging] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`
  }

  const handleStart = () => {
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleStop = async () => {
    setIsRunning(false)

    if (time > 0 && subject.trim()) {
      setIsLogging(true)
      try {
        await logStudySession({
          subject: subject.trim(),
          duration_minutes: Math.round(time / 60),
          notes: notes.trim() || null,
        })

        // Reset timer
        setTime(0)
        setSubject("")
        setNotes("")

        // Refresh the page to show new session
        router.refresh()
      } catch (error) {
        console.error("Failed to log session:", error)
      } finally {
        setIsLogging(false)
      }
    } else {
      // Just reset if no subject or time
      setTime(0)
      setSubject("")
      setNotes("")
    }
  }

  const handleReset = () => {
    setIsRunning(false)
    setTime(0)
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Study Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timer Display */}
        <div className="text-center">
          <div className="text-6xl font-mono font-bold text-white mb-4">{formatTime(time)}</div>

          {/* Timer Controls */}
          <div className="flex justify-center gap-4">
            {!isRunning ? (
              <Button
                onClick={handleStart}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={!subject.trim()}
              >
                <Play className="h-4 w-4 mr-2" />
                Start
              </Button>
            ) : (
              <Button onClick={handlePause} className="bg-yellow-600 hover:bg-yellow-700 text-white">
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}

            <Button onClick={handleStop} className="bg-red-600 hover:bg-red-700 text-white" disabled={isLogging}>
              <Square className="h-4 w-4 mr-2" />
              {isLogging ? "Saving..." : "Stop & Save"}
            </Button>

            <Button
              onClick={handleReset}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Session Details */}
        <div className="space-y-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
              Subject *
            </label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What are you studying?"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              required
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
              Notes (optional)
            </label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this study session..."
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              rows={3}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
