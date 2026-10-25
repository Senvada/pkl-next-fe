"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api/client"
import { authStore } from "@/lib/auth/auth-store"
import { clearCurrentUser } from "./useCurrentUser"

export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      try {
        await apiClient.post("/auth/logout")
      } catch {
        // Continue logout cleanup even if server call fails
      }
    },
    onSettled: () => {
      authStore.clearToken()
      clearCurrentUser()
      queryClient.clear()
      if (typeof window !== "undefined") {
        window.location.replace("/login")
      } else {
        router.replace("/login")
      }
    },
  })
}
