import * as React from "react"
import { Users, Newspaper, Building2, ShieldCheck, FolderTree, Layers } from "lucide-react"
import { MODULES_CONFIG, type RolesPermission } from "@/types/role"

export const MODULE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  users: Users,
  article: Newspaper,
  company: Building2,
  role: ShieldCheck,
  department: FolderTree,
  asset: Layers,
}

// Normalize hex color for reliable comparison
export function areColorsEqual(c1?: string, c2?: string): boolean {
  const norm1 = (c1 || "#3B82F6").trim().toUpperCase()
  const norm2 = (c2 || "#3B82F6").trim().toUpperCase()
  return norm1 === norm2
}

// Deep boolean comparison of permissions across all known modules and actions
export function arePermissionsEqual(a?: RolesPermission, b?: RolesPermission): boolean {
  if (a === b) return true
  if (!a || !b) return false

  for (const [modKey, modConfig] of Object.entries(MODULES_CONFIG)) {
    for (const actKey of Object.keys(modConfig.actions)) {
      const valA = !!a[modKey]?.[actKey]
      const valB = !!b[modKey]?.[actKey]
      if (valA !== valB) return false
    }
  }
  return true
}
