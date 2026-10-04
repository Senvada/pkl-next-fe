"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api/client"
import { authStore } from "@/lib/auth/auth-store"
import { setCurrentUser } from "./useCurrentUser"
import type { AuthResponse, LoginFormData } from "@/types/auth"

export interface UseLoginOptions {
  onSuccess?: (data: AuthResponse) => void
  onError?: (error: Error) => void
}

export function useLogin(options?: UseLoginOptions) {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: LoginFormData): Promise<AuthResponse> => {
      return apiClient.post<AuthResponse>("/auth/login", payload)
    },
    onSuccess: (data) => {
      authStore.setToken(data.access_token)
      setCurrentUser(data.user)
      queryClient.invalidateQueries()
      options?.onSuccess?.(data)
      router.push("/dashboard")
    },
    onError: (error) => {
      options?.onError?.(error)
    },
  })
}
