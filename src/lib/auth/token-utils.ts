/**
 * Safely decodes standard JWT payload without external dependencies
 */
export function parseJwtPayload<T = Record<string, unknown>>(token: string): T | null {
  if (!token || typeof token !== "string") return null
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/")
    const jsonStr = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    )
    return JSON.parse(jsonStr) as T
  } catch {
    return null
  }
}

/**
 * Returns milliseconds remaining before token expiration.
 * Negative number means token is already expired.
 */
export function getTokenRemainingTime(token: string): number {
  const payload = parseJwtPayload<{ exp?: number }>(token)
  if (!payload?.exp) return 0
  return payload.exp * 1000 - Date.now()
}

/**
 * Checks whether token will expire within the given threshold.
 * Defaults to 60,000ms (1 minute).
 */
export function isTokenExpiringSoon(token: string, thresholdMs = 60_000): boolean {
  const remaining = getTokenRemainingTime(token)
  return remaining <= thresholdMs
}
