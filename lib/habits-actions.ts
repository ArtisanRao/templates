"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

interface HabitData {
  name: string
  description?: string | null
  frequency: string
  target_count: number
}

export async function createHabit(habitData: HabitData) {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("User not authenticated")
  }

  const { error } = await supabase.from("habits").insert({
    user_id: user.id,
    name: habitData.name,
    description: habitData.description,
    frequency: habitData.frequency,
    target_count: habitData.target_count,
    is_active: true,
  })

  if (error) {
    console.error("Error creating habit:", error)
    throw new Error("Failed to create habit")
  }

  revalidatePath("/habits")
  revalidatePath("/")
}

export async function toggleHabitCompletion(habitId: string) {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("User not authenticated")
  }

  const today = new Date().toISOString().split("T")[0]

  // Check if habit is already completed today
  const { data: existingCompletion } = await supabase
    .from("habit_completions")
    .select("*")
    .eq("habit_id", habitId)
    .eq("user_id", user.id)
    .eq("completed_date", today)
    .single()

  if (existingCompletion) {
    // Remove completion
    const { error } = await supabase
      .from("habit_completions")
      .delete()
      .eq("habit_id", habitId)
      .eq("user_id", user.id)
      .eq("completed_date", today)

    if (error) {
      console.error("Error removing habit completion:", error)
      throw new Error("Failed to remove habit completion")
    }
  } else {
    // Add completion
    const { error } = await supabase.from("habit_completions").insert({
      habit_id: habitId,
      user_id: user.id,
      completed_date: today,
      count: 1,
    })

    if (error) {
      console.error("Error adding habit completion:", error)
      throw new Error("Failed to add habit completion")
    }
  }

  revalidatePath("/habits")
  revalidatePath("/")
}
