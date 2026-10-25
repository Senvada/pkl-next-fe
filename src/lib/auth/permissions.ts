import type { User } from "@/types/auth"
import type { ArticleStatus } from "@/types/article"

export function isUserAdmin(user: User | null): boolean {
  if (!user || !user.role_name) return false
  return user.role_name.toLowerCase() === "admin"
}

export function isUserSiswa(user: User | null): boolean {
  if (!user || !user.role_name) return false
  return user.role_name.toLowerCase() === "siswa"
}

export function canAccessFeature(user: User | null, module: string): boolean {
  if (!user) return false
  if (isUserAdmin(user)) return true

  if (isUserSiswa(user)) {
    return module === "article" || module === "asset"
  }

  const modulePerms = user.permissions?.[module]
  if (!modulePerms) return false

  return Object.values(modulePerms).some(Boolean)
}

export function hasPermission(
  user: User | null,
  module: string,
  action: string
): boolean {
  if (!user) return false
  if (isUserAdmin(user)) return true

  if (isUserSiswa(user)) {
    if (module === "article" || module === "asset") {
      return action === "write"
    }
    return false
  }

  return !!user.permissions?.[module]?.[action]
}

export function canPublishArticle(user: User | null): boolean {
  return hasPermission(user, "article", "publish")
}

export function canEditArticle(user: User | null, authorId?: string | null): boolean {
  if (!user) return false
  if (isUserAdmin(user)) return true

  const isAuthor = !!authorId && user.id === authorId
  if (isAuthor) {
    return hasPermission(user, "article", "write") || isUserSiswa(user)
  }

  return hasPermission(user, "article", "update")
}

export function canDeleteArticle(user: User | null, authorId?: string | null): boolean {
  if (!user) return false
  if (isUserAdmin(user)) return true

  const isAuthor = !!authorId && user.id === authorId
  if (isAuthor) {
    return hasPermission(user, "article", "write") || isUserSiswa(user)
  }

  return hasPermission(user, "article", "delete")
}

export function getAllowedArticleStatuses(
  user: User | null,
  authorId?: string | null
): ArticleStatus[] {
  if (!user) return []
  if (isUserAdmin(user)) {
    return ["draft", "review", "reject", "published", "archived"]
  }

  const isAuthor = !!authorId && user.id === authorId
  const canPub = canPublishArticle(user)
  const canUpd = hasPermission(user, "article", "update")

  const allowed = new Set<ArticleStatus>()

  if (isAuthor || isUserSiswa(user)) {
    allowed.add("draft")
    allowed.add("review")
    allowed.add("archived")
  }

  if (canPub) {
    allowed.add("review")
    allowed.add("published")
    allowed.add("reject")
  }

  if (canUpd) {
    allowed.add("draft")
    allowed.add("review")
    allowed.add("reject")
    allowed.add("archived")
  }

  return Array.from(allowed)
}
