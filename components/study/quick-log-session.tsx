"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle } from "lucide-react"
import { logStudySession } from "@/lib/study-actions"
import { useRouter } from "next/navigation"

export default function QuickLogSession() {
  const [subject, setSubject] = useState("")
  const [duration, setDuration] = useState("")
  const [notes, setNotes] = useState("")
  const [isLogging, setIsLogging] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!subject.trim() || !duration.trim()) return

    setIsLogging(true)
    try {
      await logStudySession({
        subject: subject.trim(),
        duration_minutes: Number.parseInt(duration),
        notes: notes.trim() || null,
      })

      // Reset form
      setSubject("")
      setDuration("")
      setNotes("")

      // Refresh the page to show new session
      router.refresh()
    } catch (error) {
      console.error("Failed to log session:", error)
    } finally {
      setIsLogging(false)
    }
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <PlusCircle className="h-5 w-5" />
          Quick Log Session
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="quick-subject" className="block text-sm font-medium text-gray-300 mb-2">
                Subject *
              </label>
              <Input
                id="quick-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Math, History, etc."
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                required
              />
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-2">
                Duration (minutes) *
              </label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="30"
                min="1"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="quick-notes" className="block text-sm font-medium text-gray-300 mb-2">
              Notes (optional)
            </label>
            <Textarea
              id="quick-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What did you accomplish?"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              rows={2}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLogging || !subject.trim() || !duration.trim()}
          >
            {isLogging ? "Logging..." : "Log Session"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
