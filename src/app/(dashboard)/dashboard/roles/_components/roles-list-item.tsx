import * as React from "react"
import { ChevronRight, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Role } from "@/types/role"

interface RolesListItemProps {
  role: Role
  isSelected: boolean
  isBusy: boolean
  onSelect: (role: Role) => void
  onPromptDelete: (e: React.MouseEvent, role: Role) => void
}

export const RolesListItem = React.memo(function RolesListItem({
  role,
  isSelected,
  isBusy,
  onSelect,
  onPromptDelete,
}: RolesListItemProps) {
  const isAdmin = role.name.toLowerCase() === "admin"

  return (
    <div
      onClick={() => onSelect(role)}
      className={`group relative flex items-center justify-between p-2.5 rounded-xl border transition-colors duration-150 ease-out cursor-pointer ${
        isSelected
          ? "bg-blue-600/10 border-blue-500/40 text-foreground shadow-xs dark:bg-blue-500/15"
          : "border-transparent hover:bg-muted/50 text-foreground"
      } ${isBusy ? "pointer-events-none opacity-60" : ""}`}
    >
      <div className="flex items-center gap-2.5 min-w-0 pr-2">
        <div
          className="size-3 shrink-0 rounded-full shadow-xs ring-2 ring-background"
          style={{ backgroundColor: role.color || "#3B82F6" }}
        />
        <div className="min-w-0 flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold truncate leading-tight">
              {role.name}
            </span>
            {isAdmin && (
              <Badge
                variant="secondary"
                className="h-4 text-[9px] px-1.5 rounded-md font-mono uppercase bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20"
              >
                Sistem
              </Badge>
            )}
          </div>
          <span className="text-[11px] text-muted-foreground">
            {role.user_count !== undefined ? `${role.user_count} pengguna` : "0 pengguna"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {!isAdmin && (
          <button
            type="button"
            onClick={(e) => onPromptDelete(e, role)}
            disabled={isBusy}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-opacity duration-150 ease-out cursor-pointer disabled:pointer-events-none"
            title="Hapus role"
          >
            <Trash2 className="size-3.5" />
          </button>
        )}
        <ChevronRight
          className={`size-4 text-muted-foreground transition-transform duration-150 ease-out ${
            isSelected ? "translate-x-0.5 text-blue-600" : "opacity-40"
          }`}
        />
      </div>
    </div>
  )
})
