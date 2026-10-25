import * as React from "react"
import { useCreateRole, useUpdateRole } from "@/hooks/modules/role"
import { MODULES_CONFIG, createEmptyPermissions, type Role, type RolesPermission } from "@/types/role"
import { areColorsEqual, arePermissionsEqual } from "../../_lib/role-helpers"

interface UseRoleEditorProps {
  role: Role | null
  allRoles: Role[]
  isCreatingNew: boolean
  isParentBusy: boolean
  onSaved: (role: Role, isNew: boolean) => void
  onCancelNew: () => void
  onRegisterDirtyChecker: (fn: () => boolean) => void
}

export function useRoleEditor({
  role,
  allRoles,
  isCreatingNew,
  isParentBusy,
  onSaved,
  onCancelNew,
  onRegisterDirtyChecker,
}: UseRoleEditorProps) {
  const createRoleMutation = useCreateRole()
  const updateRoleMutation = useUpdateRole()

  const [baseline, setBaseline] = React.useState(() => ({
    name: role?.name || "",
    color: role?.color || "#3B82F6",
    permissions: role?.permissions || createEmptyPermissions(),
  }))
  const [roleName, setRoleName] = React.useState(role?.name || "")
  const [color, setColor] = React.useState(role?.color || "#3B82F6")
  const [permissions, setPermissions] = React.useState<RolesPermission>(role?.permissions || createEmptyPermissions())
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
    return () => onRegisterDirtyChecker(() => false)
  }, [isDirty, onRegisterDirtyChecker])

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

  const togglePermission = React.useCallback((module: string, action: string) => {
    setPermissions((prev) => ({
      ...prev,
      [module]: { ...(prev[module] || {}), [action]: !(prev[module] || {})[action] },
    }))
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

    const isDuplicate = allRoles.some((r) =>
      isCreatingNew
        ? r.name.toLowerCase() === trimmed.toLowerCase()
        : r.id !== role?.id && r.name.toLowerCase() === trimmed.toLowerCase()
    )
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
        const newPerms = updated.permissions || createEmptyPermissions()
        const newColor = updated.color || "#3B82F6"
        setBaseline({ name: updated.name, color: newColor, permissions: newPerms })
        setRoleName(updated.name)
        setColor(newColor)
        setPermissions(newPerms)
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
      const actMatch = Object.entries(config.actions).some(
        ([actKey, actCfg]) => actKey.toLowerCase().includes(q) || actCfg.label.toLowerCase().includes(q)
      )
      return modMatch || actMatch
    })
  }, [permSearch])

  return {
    roleName, setRoleName, color, setColor, permissions, setPermissions,
    permSearch, setPermSearch, notice, setNotice, isDirty, isSaving,
    isSystemAdminRole, handleReset, togglePermission, toggleAllModule,
    handleSaveRole, filteredModules,
  }
}
