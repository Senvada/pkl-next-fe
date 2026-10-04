"use client"

import { useSyncExternalStore } from "react"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"
import { authStore } from "@/lib/auth/auth-store"
import type { User } from "@/types/auth"

const USER_STORAGE_KEY = "pkl_user"

let cachedRaw: string | null = undefined as unknown as string | null
let cachedUser: User | null = null

function readUserFromStorage(): User | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY)
    if (raw === cachedRaw) return cachedUser
    cachedRaw = raw
    cachedUser = raw ? (JSON.parse(raw) as User) : null
    return cachedUser
  } catch {
    return null
  }
}

function subscribeUser(callback: () => void) {
  if (typeof window === "undefined") return () => {}
  window.addEventListener("storage", callback)
  return () => window.removeEventListener("storage", callback)
}

function notifyUserChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new StorageEvent("storage", { key: USER_STORAGE_KEY }))
  }
}

export function setCurrentUser(user: User): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    cachedRaw = JSON.stringify(user)
    cachedUser = user
    notifyUserChange()
  }
}

export function clearCurrentUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_STORAGE_KEY)
    cachedRaw = null
    cachedUser = null
    notifyUserChange()
  }
}

export function getCurrentUser(): User | null {
  return readUserFromStorage()
}

/**
 * Reactive hook to get the current logged-in user in any component.
 * Automatically synchronizes across tabs and component re-renders.
 */
export function useCurrentUser(): User | null {
  return useSyncExternalStore(subscribeUser, readUserFromStorage, () => null)
}

/**
 * TanStack query to fetch & revalidate the user profile from /auth/me
 */
export function useMeQuery() {
  const token = authStore.getToken()

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const profile = await apiClient.get<User>("/auth/me")
      setCurrentUser(profile)
      return profile
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
