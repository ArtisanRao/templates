"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Target } from "lucide-react"
import { createGoal } from "@/lib/goals-actions"
import { useRouter } from "next/navigation"

export default function CreateGoalForm() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [targetValue, setTargetValue] = useState("")
  const [unit, setUnit] = useState("")
  const [category, setCategory] = useState("")
  const [deadline, setDeadline] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !targetValue.trim() || !unit.trim()) return

    setIsCreating(true)
    try {
      await createGoal({
        title: title.trim(),
        description: description.trim() || null,
        target_value: Number.parseInt(targetValue),
        unit: unit.trim(),
        category: category.trim() || null,
        deadline: deadline ? new Date(deadline).toISOString().split("T")[0] : null,
      })

      // Reset form
      setTitle("")
      setDescription("")
      setTargetValue("")
      setUnit("")
      setCategory("")
      setDeadline("")

      router.refresh()
    } catch (error) {
      console.error("Failed to create goal:", error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Target className="h-5 w-5" />
          Create New Goal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Goal Title *
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Study 100 hours this month"
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
              placeholder="Describe your goal..."
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="target" className="block text-sm font-medium text-gray-300 mb-2">
                Target Value *
              </label>
              <Input
                id="target"
                type="number"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                placeholder="100"
                min="1"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                required
              />
            </div>

            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-300 mb-2">
                Unit *
              </label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="sessions">Sessions</SelectItem>
                  <SelectItem value="pages">Pages</SelectItem>
                  <SelectItem value="chapters">Chapters</SelectItem>
                  <SelectItem value="exercises">Exercises</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="study">Study</SelectItem>
                <SelectItem value="reading">Reading</SelectItem>
                <SelectItem value="practice">Practice</SelectItem>
                <SelectItem value="project">Project</SelectItem>
                <SelectItem value="exam">Exam Prep</SelectItem>
                <SelectItem value="skill">Skill Building</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-300 mb-2">
              Deadline
            </label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isCreating || !title.trim() || !targetValue.trim() || !unit.trim()}
          >
            {isCreating ? "Creating..." : "Create Goal"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
