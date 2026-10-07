import { authStore } from "@/lib/auth/auth-store"
import { ApiError } from "./error"
import type { ApiResponse } from "@/types/auth"

export type RequestOptions = RequestInit & {
  auth?: boolean
  skipRefresh?: boolean
}

/**
 * Resolves the API Base URL:
 * - Production: Strictly enforces relative endpoint "/api/v1" on the frontend domain (handled by Gateway/Nginx).
 * - Development: Uses manual API endpoint configurable via NEXT_PUBLIC_API_URL or defaults to "http://localhost:3001/api/v1".
 */
export function getApiBaseUrl(): string {
  if (process.env.NODE_ENV === "production") {
    return "/api/v1"
  }

  const manualEndpoint = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "")
  return manualEndpoint || "http://localhost:3001/api/v1"
}

export const API_BASE_URL = getApiBaseUrl()

let refreshPromise: Promise<string | null> | null = null

function generateRequestId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Singleton function to refresh access token using backend HTTPOnly cookie.
 * Prevents multiple parallel requests from triggering concurrent refresh cycles.
 */
export async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise
  }

  refreshPromise = (async () => {
    try {
      const baseUrl = getApiBaseUrl()
      const res = await fetch(`${baseUrl}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Request-Id": generateRequestId(),
        },
        credentials: "include", // Essential: sends HTTPOnly pkl-refresh-token cookie
      })

      if (!res.ok) {
        authStore.clearToken()
        return null
      }

      const json: ApiResponse<{ access_token: string }> = await res.json()
      const newToken = json?.data?.access_token

      if (newToken) {
        authStore.setToken(newToken)
        return newToken
      }

      authStore.clearToken()
      return null
    } catch {
      authStore.clearToken()
      return null
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { auth = true, skipRefresh = false, headers, ...rest } = options

  const baseUrl = getApiBaseUrl()
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${baseUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`

  const token = auth ? authStore.getToken() : null

  const requestHeaders = new Headers(headers)
  if (!requestHeaders.has("Content-Type") && !(rest.body instanceof FormData)) {
    requestHeaders.set("Content-Type", "application/json")
  }
  if (!requestHeaders.has("X-Request-Id")) {
    requestHeaders.set("X-Request-Id", generateRequestId())
  }
  if (token && !requestHeaders.has("Authorization")) {
    requestHeaders.set("Authorization", `Bearer ${token}`)
  }

  try {
    const res = await fetch(url, {
      headers: requestHeaders,
      credentials: "include", // Always include cookies for session & refresh token
      ...rest,
    })

    // If 401 Unauthorized and not already refreshing, attempt token rotation
    if (res.status === 401 && !skipRefresh && !endpoint.includes("/auth/refresh") && !endpoint.includes("/auth/login")) {
      const newToken = await refreshAccessToken()

      if (newToken) {
        // Retry failed request with the new access token
        return apiFetch<T>(endpoint, {
          ...options,
          skipRefresh: true, // Prevent infinite loops
        })
      }
    }

    let responseData: Record<string, unknown> | null = null
    try {
      responseData = (await res.json()) as Record<string, unknown>
    } catch {
      responseData = null
    }

    if (!res.ok) {
      throw ApiError.fromResponse(res.status, responseData)
    }

    // Return the data payload if wrapped in standard ApiResponse envelope
    if (responseData && typeof responseData === "object" && "data" in responseData) {
      return responseData.data as T
    }

    return responseData as T
  } catch (err) {
    if (err instanceof ApiError) {
      throw err
    }
    throw new ApiError(
      err instanceof Error ? err.message : "Gagal terhubung ke server backend.",
      0
    )
  }
}

export const apiClient = {
  get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return apiFetch<T>(endpoint, { method: "GET", ...options })
  },

  post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return apiFetch<T>(endpoint, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    })
  },

  put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return apiFetch<T>(endpoint, {
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    })
  },

  patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return apiFetch<T>(endpoint, {
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    })
  },

  delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return apiFetch<T>(endpoint, { method: "DELETE", ...options })
  },
}
