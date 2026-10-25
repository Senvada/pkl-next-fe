"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { authStore } from "@/lib/auth/auth-store"
import {
  startTokenWorker,
  stopTokenWorker,
  checkAndRefreshTokenNow,
} from "@/lib/auth/token-worker"
import { clearCurrentUser } from "@/hooks/modules/auth/useCurrentUser"

/**
 * Global session provider that manages:
 * 1. Proactive background token refresh (before JWT expires)
 * 2. Tab focus & visibility change re-validation
 * 3. Network reconnect (online event) re-validation
 * 4. Multi-tab logout & eviction handling
 */
export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const handleSessionExpired = React.useCallback(() => {
    authStore.clearToken()
    clearCurrentUser()
    queryClient.clear()

    if (typeof window !== "undefined") {
      const pathname = window.location.pathname
      if (pathname.startsWith("/dashboard")) {
        router.replace("/login?reason=session_expired")
      }
    }
  }, [router, queryClient])

  const handleRefreshSuccess = React.useCallback(() => {
    // Silently revalidate user profile if needed
    void queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
  }, [queryClient])

  React.useEffect(() => {
    if (typeof window === "undefined") return

    // 1. Initial worker startup if user is already logged in
    const initialToken = authStore.getToken()
    if (initialToken) {
      startTokenWorker(handleSessionExpired, handleRefreshSuccess)
      void checkAndRefreshTokenNow(handleSessionExpired, handleRefreshSuccess)
    }

    // 2. React to auth token changes (login, refresh, logout)
    const unsubscribeAuthStore = authStore.subscribe((token) => {
      if (token) {
        startTokenWorker(handleSessionExpired, handleRefreshSuccess)
      } else {
        stopTokenWorker()
      }
    })

    // 3. Tab visibility change & focus listeners
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        void checkAndRefreshTokenNow(handleSessionExpired, handleRefreshSuccess)
      }
    }

    // 4. Online event listener (network reconnection)
    const handleOnline = () => {
      void checkAndRefreshTokenNow(handleSessionExpired, handleRefreshSuccess)
    }

    document.addEventListener("visibilitychange", handleVisibilityOrFocus)
    window.addEventListener("focus", handleVisibilityOrFocus)
    window.addEventListener("online", handleOnline)

    return () => {
      unsubscribeAuthStore()
      stopTokenWorker()
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus)
      window.removeEventListener("focus", handleVisibilityOrFocus)
      window.removeEventListener("online", handleOnline)
    }
  }, [handleSessionExpired, handleRefreshSuccess])

  return <>{children}</>
}
