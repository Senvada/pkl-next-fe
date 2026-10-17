import * as React from "react"
import type { Role } from "@/types/role"

export type PendingNavigation =
  | { type: "select_role"; role: Role }
  | { type: "create_new" }
  | { type: "back_mobile" }

export function useRolesNavigation(roles: Role[], isBusy: boolean) {
  const [selectedRoleId, setSelectedRoleId] = React.useState<string | null>(null)
  const [isCreatingNew, setIsCreatingNew] = React.useState(false)
  const [mobileEditorOpen, setMobileEditorOpen] = React.useState(false)
  const [unsavedDialogOpen, setUnsavedDialogOpen] = React.useState(false)
  const [pendingNavigation, setPendingNavigation] = React.useState<PendingNavigation | null>(null)
  const isEditorDirtyRef = React.useRef<() => boolean>(() => false)

  const activeRoleId = isCreatingNew ? null : (selectedRoleId ?? roles[0]?.id ?? null)
  const selectedRole = isCreatingNew ? null : roles.find((r) => r.id === activeRoleId) || roles[0] || null

  const applySelectRole = (role: Role) => {
    setSelectedRoleId(role.id || null)
    setIsCreatingNew(false)
    setMobileEditorOpen(true)
  }

  const handleSelectRole = (role: Role) => {
    if (isBusy) return
    if (!isCreatingNew && selectedRole?.id === role.id) {
      setMobileEditorOpen(true)
      return
    }
    if (isEditorDirtyRef.current()) {
      setPendingNavigation({ type: "select_role", role })
      setUnsavedDialogOpen(true)
      return
    }
    applySelectRole(role)
  }

  const applyStartCreateRole = () => {
    setSelectedRoleId(null)
    setIsCreatingNew(true)
    setMobileEditorOpen(true)
  }

  const handleStartCreateRole = () => {
    if (isBusy) return
    if (isCreatingNew) {
      setMobileEditorOpen(true)
      return
    }
    if (isEditorDirtyRef.current()) {
      setPendingNavigation({ type: "create_new" })
      setUnsavedDialogOpen(true)
      return
    }
    applyStartCreateRole()
  }

  const handleMobileBack = () => {
    if (isEditorDirtyRef.current()) {
      setPendingNavigation({ type: "back_mobile" })
      setUnsavedDialogOpen(true)
      return
    }
    setMobileEditorOpen(false)
  }

  const handleConfirmDiscard = () => {
    setUnsavedDialogOpen(false)
    if (!pendingNavigation) return
    if (pendingNavigation.type === "select_role") applySelectRole(pendingNavigation.role)
    else if (pendingNavigation.type === "create_new") applyStartCreateRole()
    else if (pendingNavigation.type === "back_mobile") setMobileEditorOpen(false)
    setPendingNavigation(null)
  }

  const registerDirtyChecker = React.useCallback((fn: () => boolean) => {
    isEditorDirtyRef.current = fn
  }, [])

  return {
    selectedRoleId,
    setSelectedRoleId,
    isCreatingNew,
    setIsCreatingNew,
    mobileEditorOpen,
    setMobileEditorOpen,
    unsavedDialogOpen,
    setUnsavedDialogOpen,
    registerDirtyChecker,
    selectedRole,
    handleSelectRole,
    handleStartCreateRole,
    handleMobileBack,
    handleConfirmDiscard,
  }
}
