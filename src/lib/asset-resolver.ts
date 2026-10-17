/**
 * Asset Resolver & Storage Utilities
 * Resolves paths, URLs, and provides fallback media across articles, companies, and users.
 */

export type FallbackType = "image" | "avatar" | "company" | "article"

const STORAGE_PUBLIC_BASE =
  process.env.NEXT_PUBLIC_STORAGE_URL?.replace(/\/+$/, "") ||
  "http://127.0.0.1:54321/object/public/pkl-assets"

/**
 * Resolves an asset path or full URL into a valid browser-loadable URL.
 *
 * Examples:
 * - resolveAssetUrl("https://example.com/pic.jpg") -> "https://example.com/pic.jpg"
 * - resolveAssetUrl("/img/logo.svg") -> "/img/logo.svg"
 * - resolveAssetUrl("assets/2026/10/banner.webp") -> "http://127.0.0.1:54321/object/public/pkl-assets/assets/2026/10/banner.webp"
 * - resolveAssetUrl(null, "company") -> Fallback company placeholder
 */
export function resolveAssetUrl(
  pathOrUrl?: string | null,
  fallbackType: FallbackType = "image"
): string {
  if (!pathOrUrl || typeof pathOrUrl !== "string" || pathOrUrl.trim() === "") {
    return getFallbackPlaceholder(fallbackType)
  }

  const clean = pathOrUrl.trim()

  // Full protocols, browser blobs, or data URIs
  if (
    clean.startsWith("http://") ||
    clean.startsWith("https://") ||
    clean.startsWith("data:") ||
    clean.startsWith("blob:")
  ) {
    return clean
  }

  // Already a frontend root path (e.g. /assets/..., /img/...)
  if (clean.startsWith("/")) {
    return clean
  }

  // S3 / Storage Object Key
  return `${STORAGE_PUBLIC_BASE}/${clean}`
}

/**
 * Provides a dependable fallback image placeholder when media is missing.
 */
export function getFallbackPlaceholder(type: FallbackType = "image"): string {
  switch (type) {
    case "avatar":
      return "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    case "company":
      return "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80"
    case "article":
      return "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80"
    case "image":
    default:
      return "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80"
  }
}

/**
 * Formats byte size into human readable string (KB, MB, GB).
 */
export function formatFileSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/**
 * Checks if a given mime type or filename represents an image.
 */
export function isImageFile(mimeType?: string, filename?: string): boolean {
  if (mimeType && mimeType.startsWith("image/")) return true
  if (filename) {
    const ext = filename.split(".").pop()?.toLowerCase()
    return ["jpg", "jpeg", "png", "webp", "gif", "svg", "avif"].includes(ext || "")
  }
  return false
}

/**
 * Extracts file extension from filename without the dot.
 */
export function getFileExtension(filename?: string): string {
  if (!filename) return ""
  const parts = filename.split(".")
  return parts.length > 1 ? parts.pop()?.toLowerCase() || "" : ""
}
