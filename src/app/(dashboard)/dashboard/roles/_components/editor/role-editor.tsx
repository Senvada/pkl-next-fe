import * as React from "react"
import { AlertCircle, CheckCircle2, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useCreateRole, useUpdateRole } from "@/hooks/modules/role"
import {
  MODULES_CONFIG,
  createEmptyPermissions,
  createFullPermissions,
  type Role,
  type RolesPermission,
} from "@/types/role"
import { areColorsEqual, arePermissionsEqual } from "../../_lib/role-helpers"
import { RoleEditorHeader } from "./role-editor-header"
import { RoleModuleCard } from "./role-module-card"
import { RoleEditorFooter } from "./role-editor-footer"

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

export function RoleEditor({
  role,
  allRoles,
  isCreatingNew,
  isParentBusy,
  onBack,
  onSaved,
  onCancelNew,
  onRegisterDirtyChecker,
}: RoleEditorProps) {
  const createRoleMutation = useCreateRole()
  const updateRoleMutation = useUpdateRole()

  const [baseline, setBaseline] = React.useState(() => ({
    name: role?.name || "",
    color: role?.color || "#3B82F6",
    permissions: role?.permissions || createEmptyPermissions(),
  }))

  const [roleName, setRoleName] = React.useState(role?.name || "")
  const [color, setColor] = React.useState(role?.color || "#3B82F6")
  const [permissions, setPermissions] = React.useState<RolesPermission>(
    role?.permissions || createEmptyPermissions()
  )
  const [permSearch, setPermSearch] = React.useState("")
  const [notice, setNotice] = React.useState<{ type: "success" | "error"; text: string } | null>(null)

  const isSystemAdminRole = role?.name.toLowerCase() === "admin"
  const isSaving = createRoleMutation.isPending || updateRoleMutation.isPending || isParentBusy

  const isDirty = React.useMemo(() => {
    if (isCreatingNew) {
      return (
        roleName.trim().length > 0 ||
        !areColorsEqual(color, "#3B82F6") ||
        !arePermissionsEqual(permissions, createEmptyPermissions())
      )
    }
    return (
      roleName.trim() !== baseline.name.trim() ||
      !areColorsEqual(color, baseline.color) ||
      !arePermissionsEqual(permissions, baseline.permissions)
    )
  }, [isCreatingNew, baseline, roleName, color, permissions])

  React.useEffect(() => {
    onRegisterDirtyChecker(() => isDirty)
  }, [isDirty, onRegisterDirtyChecker])

  React.useEffect(() => {
    return () => {
      onRegisterDirtyChecker(() => false)
    }
  }, [onRegisterDirtyChecker])

  const handleReset = () => {
    if (isSaving) return
    if (isCreatingNew) {
      onCancelNew()
    } else {
      setRoleName(baseline.name)
      setColor(baseline.color)
      setPermissions(baseline.permissions)
      setNotice({ type: "success", text: "Perubahan dibatalkan dan dikembalikan ke data awal." })
    }
  }

  const togglePermission = React.useCallback((module: string, action: string, actions: string[]) => {
    setPermissions((prev) => {
      const currentMod = prev[module] || {}
      const newValue = !currentMod[action]

      if (action === "read" && !newValue) {
        return { ...prev, [module]: Object.fromEntries(actions.map((a) => [a, false])) }
      }
      if (action !== "read" && newValue && !currentMod.read) {
        return { ...prev, [module]: { ...currentMod, [action]: true, read: true } }
      }
      return { ...prev, [module]: { ...currentMod, [action]: newValue } }
    })
  }, [])

  const toggleAllModule = React.useCallback((module: string, actions: string[]) => {
    setPermissions((prev) => {
      const currentMod = prev[module] || {}
      const allActive = actions.every((a) => !!currentMod[a])
      return { ...prev, [module]: Object.fromEntries(actions.map((a) => [a, !allActive])) }
    })
  }, [])

  const handleSaveRole = async () => {
    setNotice(null)
    const trimmed = roleName.trim()
    if (!trimmed) return setNotice({ type: "error", text: "Nama role wajib diisi." })
    if (trimmed.toLowerCase() === "admin" && (isCreatingNew || role?.name.toLowerCase() !== "admin")) {
      return setNotice({ type: "error", text: 'Nama "Admin" merupakan role utama sistem dan tidak dapat digunakan.' })
    }

    const isDuplicate = allRoles.some((r) => {
      if (isCreatingNew) return r.name.toLowerCase() === trimmed.toLowerCase()
      return r.id !== role?.id && r.name.toLowerCase() === trimmed.toLowerCase()
    })
    if (isDuplicate) return setNotice({ type: "error", text: `Role dengan nama "${trimmed}" sudah ada.` })

    try {
      if (isCreatingNew) {
        const created = await createRoleMutation.mutateAsync({ name: trimmed, color, permissions })
        onSaved(created, true)
      } else if (role?.id) {
        const updated = await updateRoleMutation.mutateAsync({
          id: role.id,
          payload: { name: trimmed, color, permissions },
        })
        setBaseline({
          name: updated.name,
          color: updated.color || "#3B82F6",
          permissions: updated.permissions || createEmptyPermissions(),
        })
        setRoleName(updated.name)
        setColor(updated.color || "#3B82F6")
        setPermissions(updated.permissions || createEmptyPermissions())
        setNotice({ type: "success", text: `Perubahan pada role "${updated.name}" berhasil disimpan!` })
        onSaved(updated, false)
      }
    } catch (err) {
      setNotice({ type: "error", text: err instanceof Error ? err.message : "Gagal menyimpan role ke server." })
    }
  }

  const filteredModules = React.useMemo(() => {
    const entries = Object.entries(MODULES_CONFIG)
    if (!permSearch.trim()) return entries
    const q = permSearch.toLowerCase()
    return entries.filter(([key, config]) => {
      const modMatch = key.toLowerCase().includes(q) || config.title.toLowerCase().includes(q)
      const actionMatch = Object.entries(config.actions).some(
        ([actKey, actCfg]) => actKey.toLowerCase().includes(q) || actCfg.label.toLowerCase().includes(q)
      )
      return modMatch || actionMatch
    })
  }, [permSearch])

  return (
    <Card className="rounded-2xl border border-border shadow-xs bg-card/60 flex flex-col h-full min-h-0 overflow-hidden">
      <RoleEditorHeader
        role={role}
        roleName={roleName}
        onRoleNameChange={setRoleName}
        color={color}
        onColorChange={setColor}
        permSearch={permSearch}
        onPermSearchChange={setPermSearch}
        isSystemAdminRole={isSystemAdminRole}
        isCreatingNew={isCreatingNew}
        isSaving={isSaving}
        onBack={onBack}
        onEnableAll={() => setPermissions(createFullPermissions())}
        onDisableAll={() => setPermissions(createEmptyPermissions())}
      />

      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3.5 sm:p-4 space-y-3">
        {notice && (
          <div
            className={`flex items-center justify-between gap-2 p-2.5 sm:p-3 text-xs rounded-xl border transition-colors duration-150 ${
              notice.type === "success"
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                : "bg-destructive/10 text-destructive border-destructive/20"
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              {notice.type === "success" ? (
                <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertCircle className="size-4 shrink-0 text-destructive" />
              )}
              <span className="truncate">{notice.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setNotice(null)}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          </div>
        )}

        {filteredModules.length === 0 && (
          <div className="py-12 text-center text-xs text-muted-foreground">
            Tidak ada modul yang cocok dengan &quot;{permSearch}&quot;.
          </div>
        )}

        {filteredModules.map(([moduleKey, config]) => (
          <RoleModuleCard
            key={moduleKey}
            moduleKey={moduleKey}
            config={config}
            modPermissions={permissions[moduleKey] || {}}
            isSaving={isSaving}
            forceExpanded={!!permSearch.trim()}
            onToggleAll={toggleAllModule}
            onTogglePermission={togglePermission}
          />
        ))}
      </div>

      <RoleEditorFooter
        isDirty={isDirty}
        isSaving={isSaving}
        canSave={!!roleName.trim()}
        onReset={handleReset}
        onSave={handleSaveRole}
      />
    </Card>
  )
}
