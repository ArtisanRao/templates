"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Zap } from "lucide-react"
import { createHabit } from "@/lib/habits-actions"
import { useRouter } from "next/navigation"

export default function CreateHabitForm() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [frequency, setFrequency] = useState("")
  const [targetCount, setTargetCount] = useState("1")
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !frequency.trim()) return

    setIsCreating(true)
    try {
      await createHabit({
        name: name.trim(),
        description: description.trim() || null,
        frequency: frequency.trim(),
        target_count: Number.parseInt(targetCount),
      })

      // Reset form
      setName("")
      setDescription("")
      setFrequency("")
      setTargetCount("1")

      router.refresh()
    } catch (error) {
      console.error("Failed to create habit:", error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Create New Habit
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Habit Name *
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Read for 30 minutes"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your habit..."
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-300 mb-2">
                Frequency *
              </label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="target-count" className="block text-sm font-medium text-gray-300 mb-2">
                Target Count
              </label>
              <Input
                id="target-count"
                type="number"
                value={targetCount}
                onChange={(e) => setTargetCount(e.target.value)}
                placeholder="1"
                min="1"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isCreating || !name.trim() || !frequency.trim()}
          >
            {isCreating ? "Creating..." : "Create Habit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
