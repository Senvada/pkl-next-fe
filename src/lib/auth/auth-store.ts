const ACCESS_TOKEN_KEY = "pkl_access_token"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

let accessToken: string | null = null
let listeners: Array<(token: string | null) => void> = []

function getInitialToken(): string | null {
  if (typeof window === "undefined") return null

  // 1. Try reading from cookie first
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${ACCESS_TOKEN_KEY}=`))
  if (match) {
    const val = decodeURIComponent(match.split("=")[1] || "")
    if (val) return val
  }

  // 2. Fallback to localStorage
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  } catch {
    return null
  }
}

// Initialize on module load if in browser
if (typeof window !== "undefined") {
  accessToken = getInitialToken()
}

export const authStore = {
  getToken(): string | null {
    return accessToken
  },

  setToken(token: string | null) {
    accessToken = token

    if (typeof window !== "undefined") {
      if (token) {
        try {
          localStorage.setItem(ACCESS_TOKEN_KEY, token)
        } catch {
          // Ignore localStorage quota errors
        }
        document.cookie = `${ACCESS_TOKEN_KEY}=${encodeURIComponent(
          token
        )}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
      } else {
        try {
          localStorage.removeItem(ACCESS_TOKEN_KEY)
        } catch {
          // Ignore
        }
        document.cookie = `${ACCESS_TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`
      }
    }

    listeners.forEach((listener) => listener(token))
  },

  clearToken() {
    this.setToken(null)
  },

  subscribe(listener: (token: string | null) => void) {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  },
}
