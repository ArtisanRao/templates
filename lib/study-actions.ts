"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

interface StudySessionData {
  subject: string
  duration_minutes: number
  notes?: string | null
}

export async function logStudySession(sessionData: StudySessionData) {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("User not authenticated")
  }

  // Insert the study session
  const { error } = await supabase.from("study_sessions").insert({
    user_id: user.id,
    subject: sessionData.subject,
    duration_minutes: sessionData.duration_minutes,
    notes: sessionData.notes,
    completed_at: new Date().toISOString(),
  })

  if (error) {
    console.error("Error logging study session:", error)
    throw new Error("Failed to log study session")
  }

  // Revalidate the pages that show study data
  revalidatePath("/")
  revalidatePath("/study")
}
