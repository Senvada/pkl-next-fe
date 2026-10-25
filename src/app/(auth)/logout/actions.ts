"use server"

import { cookies } from "next/headers"

/**
 * Server action to securely remove authentication cookies on the server side
 */
export async function clearServerSessionAction(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete("pkl_access_token")
    cookieStore.delete("pkl-refresh-token")
    return { success: true }
  } catch {
    return { success: false }
  }
}
