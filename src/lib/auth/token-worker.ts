import { authStore } from "./auth-store"
import { getTokenRemainingTime, isTokenExpiringSoon } from "./token-utils"
import { refreshAccessToken } from "@/lib/api/client"

let workerTimeout: ReturnType<typeof setTimeout> | null = null
let isExecuting = false

// Refresh proactively 60 seconds before JWT expires
const REFRESH_THRESHOLD_MS = 60_000

/**
 * Proactively schedules a background timer to refresh the token before expiration.
 */
export function startTokenWorker(
  onLogout?: () => void,
  onRefreshSuccess?: (token: string) => void
): void {
  stopTokenWorker()
  if (typeof window === "undefined") return

  const token = authStore.getToken()
  if (!token) return

  const remaining = getTokenRemainingTime(token)
  if (remaining <= 0) {
    // Token is already expired -> immediately attempt rotation
    void executeRefresh(onLogout, onRefreshSuccess)
    return
  }

  // Schedule timer to trigger REFRESH_THRESHOLD_MS before expiration
  const delay = Math.max(remaining - REFRESH_THRESHOLD_MS, 1_000)
  workerTimeout = setTimeout(() => {
    void executeRefresh(onLogout, onRefreshSuccess)
  }, delay)
}

/**
 * Cancels any active proactive refresh timer.
 */
export function stopTokenWorker(): void {
  if (workerTimeout) {
    clearTimeout(workerTimeout)
    workerTimeout = null
  }
  isExecuting = false
}

/**
 * Checks if current token is expired or expiring soon and performs refresh immediately.
 * Perfect for visibilitychange and window focus events.
 */
export async function checkAndRefreshTokenNow(
  onLogout?: () => void,
  onRefreshSuccess?: (token: string) => void
): Promise<string | null> {
  const token = authStore.getToken()
  if (!token) return null

  if (isTokenExpiringSoon(token, REFRESH_THRESHOLD_MS)) {
    return executeRefresh(onLogout, onRefreshSuccess)
  }
  return token
}

async function executeRefresh(
  onLogout?: () => void,
  onRefreshSuccess?: (token: string) => void
): Promise<string | null> {
  if (isExecuting) return null
  isExecuting = true

  try {
    const newToken = await refreshAccessToken()
    if (newToken) {
      onRefreshSuccess?.(newToken)
      // Re-arm the worker timer for the new token lifetime
      startTokenWorker(onLogout, onRefreshSuccess)
      return newToken
    }

    // Refresh token expired or revoked -> trigger logout callback
    onLogout?.()
    return null
  } finally {
    isExecuting = false
  }
}
