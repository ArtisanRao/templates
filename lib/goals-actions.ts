"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

interface GoalData {
  title: string
  description?: string | null
  target_value: number
  unit: string
  category?: string | null
  deadline?: string | null
}

export async function createGoal(goalData: GoalData) {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("User not authenticated")
  }

  const { error } = await supabase.from("goals").insert({
    user_id: user.id,
    title: goalData.title,
    description: goalData.description,
    target_value: goalData.target_value,
    unit: goalData.unit,
    category: goalData.category,
    deadline: goalData.deadline,
    current_value: 0,
    is_completed: false,
  })

  if (error) {
    console.error("Error creating goal:", error)
    throw new Error("Failed to create goal")
  }

  revalidatePath("/goals")
  revalidatePath("/")
}

export async function updateGoalProgress(goalId: string, increment: number) {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("User not authenticated")
  }

  // Get current goal
  const { data: goal, error: fetchError } = await supabase
    .from("goals")
    .select("current_value, target_value")
    .eq("id", goalId)
    .eq("user_id", user.id)
    .single()

  if (fetchError || !goal) {
    throw new Error("Goal not found")
  }

  const newValue = Math.max(0, Math.min(goal.current_value + increment, goal.target_value))

  const { error } = await supabase
    .from("goals")
    .update({
      current_value: newValue,
      is_completed: newValue >= goal.target_value,
    })
    .eq("id", goalId)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error updating goal progress:", error)
    throw new Error("Failed to update goal progress")
  }

  revalidatePath("/goals")
  revalidatePath("/")
}

export async function toggleGoalCompletion(goalId: string) {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("User not authenticated")
  }

  // Get current goal
  const { data: goal, error: fetchError } = await supabase
    .from("goals")
    .select("is_completed, target_value")
    .eq("id", goalId)
    .eq("user_id", user.id)
    .single()

  if (fetchError || !goal) {
    throw new Error("Goal not found")
  }

  const { error } = await supabase
    .from("goals")
    .update({
      is_completed: !goal.is_completed,
      current_value: !goal.is_completed ? goal.target_value : 0,
    })
    .eq("id", goalId)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error toggling goal completion:", error)
    throw new Error("Failed to toggle goal completion")
  }

  revalidatePath("/goals")
  revalidatePath("/")
}
