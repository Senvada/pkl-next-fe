import * as React from "react"
import { ArrowLeft, Lock, Search, CheckCheck, XCircle } from "lucide-react"
import { CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ColorPickerPopover } from "@/components/shared/color-picker-popover"
import type { Role } from "@/types/role"

interface RoleEditorHeaderProps {
  role: Role | null
  roleName: string
  onRoleNameChange: (v: string) => void
  color: string
  onColorChange: (v: string) => void
  permSearch: string
  onPermSearchChange: (v: string) => void
  isSystemAdminRole: boolean
  isCreatingNew: boolean
  isSaving: boolean
  onBack: () => void
  onEnableAll: () => void
  onDisableAll: () => void
}

export const RoleEditorHeader = React.memo(function RoleEditorHeader({
  role,
  roleName,
  onRoleNameChange,
  color,
  onColorChange,
  permSearch,
  onPermSearchChange,
  isSystemAdminRole,
  isCreatingNew,
  isSaving,
  onBack,
  onEnableAll,
  onDisableAll,
}: RoleEditorHeaderProps) {
  return (
    <CardHeader className="p-3.5 sm:p-4 pb-3 space-y-3 shrink-0 border-b border-border/70 bg-card/40">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onBack}
            disabled={isSaving}
            className="lg:hidden rounded-xl size-8.5 p-0 shrink-0 cursor-pointer"
            title="Kembali ke Daftar Role"
          >
            <ArrowLeft className="size-4" />
          </Button>

          <ColorPickerPopover
            color={color}
            onChange={onColorChange}
            disabled={isSaving}
          />

          <div className="flex-1 min-w-36 sm:min-w-48">
            <Input
              type="text"
              value={roleName}
              onChange={(e) => onRoleNameChange(e.target.value)}
              placeholder="Masukkan nama role..."
              disabled={isSystemAdminRole || isSaving}
              className="h-8.5 sm:h-9 text-xs sm:text-sm font-semibold rounded-xl"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {isSystemAdminRole && (
            <Badge
              variant="secondary"
              className="gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20 text-xs px-2.5 py-0.5 rounded-lg"
            >
              <Lock className="size-3" />
              <span>Role Admin Utama</span>
            </Badge>
          )}

          {role && !isCreatingNew && (
            <Badge
              variant="outline"
              className="text-xs px-2.5 py-0.5 rounded-lg text-muted-foreground"
            >
              {role.user_count || 0} Pengguna Aktif
            </Badge>
          )}
        </div>
      </div>

      {/* Permission Search & Bulk Toggle Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-border/40">
        <div className="relative flex-1 max-w-xs">
          <Search className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            value={permSearch}
            onChange={(e) => onPermSearchChange(e.target.value)}
            placeholder="Cari izin modul..."
            disabled={isSaving}
            className="h-8 text-xs pl-8.5 rounded-xl"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onEnableAll}
            disabled={isSaving}
            className="h-8 text-[11px] rounded-xl px-2.5 gap-1 cursor-pointer"
          >
            <CheckCheck className="size-3 text-emerald-600 dark:text-emerald-400" />
            <span>Aktifkan Semua</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onDisableAll}
            disabled={isSaving}
            className="h-8 text-[11px] rounded-xl px-2.5 gap-1 cursor-pointer"
          >
            <XCircle className="size-3 text-muted-foreground" />
            <span>Matikan Semua</span>
          </Button>
        </div>
      </div>
    </CardHeader>
  )
})
