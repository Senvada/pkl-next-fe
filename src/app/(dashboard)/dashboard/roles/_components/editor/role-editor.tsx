import * as React from "react"
import { AlertCircle, CheckCircle2, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { createEmptyPermissions, createFullPermissions, type Role } from "@/types/role"
import { RoleEditorHeader } from "./role-editor-header"
import { RoleModuleCard } from "./role-module-card"
import { RoleEditorFooter } from "./role-editor-footer"
import { useRoleEditor } from "./use-role-editor"

export interface RoleEditorProps {
  role: Role | null
  allRoles: Role[]
  isCreatingNew: boolean
  isParentBusy: boolean
  onBack: () => void
  onSaved: (role: Role, isNew: boolean) => void
  onCancelNew: () => void
  onRegisterDirtyChecker: (fn: () => boolean) => void
}

export function RoleEditor(props: RoleEditorProps) {
  const { role, isCreatingNew, onBack } = props
  const editor = useRoleEditor(props)

  return (
    <Card className="rounded-2xl border border-border shadow-xs bg-card/60 flex flex-col h-full min-h-0 overflow-hidden">
      <RoleEditorHeader
        role={role}
        roleName={editor.roleName}
        onRoleNameChange={editor.setRoleName}
        color={editor.color}
        onColorChange={editor.setColor}
        permSearch={editor.permSearch}
        onPermSearchChange={editor.setPermSearch}
        isSystemAdminRole={editor.isSystemAdminRole}
        isCreatingNew={isCreatingNew}
        isSaving={editor.isSaving}
        onBack={onBack}
        onEnableAll={() => editor.setPermissions(createFullPermissions())}
        onDisableAll={() => editor.setPermissions(createEmptyPermissions())}
      />

      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3.5 sm:p-4 space-y-3">
        {editor.notice && (
          <div
            className={`flex items-center justify-between gap-2 p-2.5 sm:p-3 text-xs rounded-xl border transition-colors duration-150 ${
              editor.notice.type === "success"
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                : "bg-destructive/10 text-destructive border-destructive/20"
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              {editor.notice.type === "success" ? (
                <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertCircle className="size-4 shrink-0 text-destructive" />
              )}
              <span className="truncate">{editor.notice.text}</span>
            </div>
            <button
              type="button"
              onClick={() => editor.setNotice(null)}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          </div>
        )}

        {editor.filteredModules.length === 0 && (
          <div className="py-12 text-center text-xs text-muted-foreground">
            Tidak ada modul yang cocok dengan &quot;{editor.permSearch}&quot;.
          </div>
        )}

        {editor.filteredModules.map(([moduleKey, config]) => (
          <RoleModuleCard
            key={moduleKey}
            moduleKey={moduleKey}
            config={config}
            modPermissions={editor.permissions[moduleKey] || {}}
            isSaving={editor.isSaving}
            forceExpanded={!!editor.permSearch.trim()}
            onToggleAll={editor.toggleAllModule}
            onTogglePermission={editor.togglePermission}
          />
        ))}
      </div>

      <RoleEditorFooter
        isDirty={editor.isDirty}
        isSaving={editor.isSaving}
        canSave={!!editor.roleName.trim()}
        onReset={editor.handleReset}
        onSave={editor.handleSaveRole}
      />
    </Card>
  )
}
