"use client"

import * as React from "react"
import { ShieldCheck, Plus, CheckCircle2, AlertCircle, X } from "lucide-react"
import { useRolesQuery, useDeleteRole } from "@/hooks/modules/role"
import type { Role } from "@/types/role"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

import { useRolesNavigation } from "./_hooks/use-roles-navigation"
import { RolesHeader } from "./_components/roles-header"
import { RolesList } from "./_components/roles-list"
import { RoleDeleteDialog } from "./_components/role-delete-dialog"
import { RoleUnsavedDialog } from "./_components/role-unsaved-dialog"
import { RoleEditor } from "./_components/editor/role-editor"

const emptySubscribe = () => () => {}

export default function RolesManagementPage() {
  const mounted = React.useSyncExternalStore(emptySubscribe, () => true, () => false)
  const { data: roles = [], isLoading, isError, error, refetch } = useRolesQuery()
  const deleteRoleMutation = useDeleteRole()

  const nav = useRolesNavigation(roles, deleteRoleMutation.isPending)
  const [pageNotice, setPageNotice] = React.useState<{ type: "success" | "error"; text: string } | null>(null)
  const [roleToDelete, setRoleToDelete] = React.useState<Role | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false)

  const handleConfirmDelete = async () => {
    if (!roleToDelete?.id || deleteRoleMutation.isPending) return
    try {
      await deleteRoleMutation.mutateAsync(roleToDelete.id)
      setDeleteModalOpen(false)
      if (nav.selectedRoleId === roleToDelete.id) {
        const remaining = roles.filter((r) => r.id !== roleToDelete.id)
        nav.setSelectedRoleId(remaining[0]?.id || null)
        nav.setIsCreatingNew(false)
      }
      setPageNotice({ type: "success", text: `Role "${roleToDelete.name}" berhasil dihapus.` })
      setRoleToDelete(null)
    } catch (err) {
      setPageNotice({ type: "error", text: err instanceof Error ? err.message : "Gagal menghapus role." })
      setDeleteModalOpen(false)
    }
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col w-full max-w-7xl mx-auto">
      <RolesHeader onStartCreate={nav.handleStartCreateRole} disabled={deleteRoleMutation.isPending} />

      {pageNotice && (
        <div
          className={`shrink-0 mb-3 flex items-center justify-between gap-2 p-2.5 sm:p-3 text-xs rounded-xl border transition-all ${
            pageNotice.type === "success"
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
              : "bg-destructive/10 text-destructive border-destructive/20"
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            {pageNotice.type === "success" ? (
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="size-4 shrink-0 text-destructive" />
            )}
            <span className="truncate">{pageNotice.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setPageNotice(null)}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch">
        <div className={`lg:col-span-4 xl:col-span-4 flex flex-col h-full min-h-0 ${nav.mobileEditorOpen ? "hidden lg:flex" : "flex"}`}>
          <RolesList
            roles={roles}
            selectedRole={nav.selectedRole}
            isCreatingNew={nav.isCreatingNew}
            isBusy={deleteRoleMutation.isPending}
            isLoading={isLoading}
            isError={isError}
            error={error}
            mounted={mounted}
            onSelectRole={nav.handleSelectRole}
            onPromptDelete={(e, r) => {
              e.stopPropagation()
              setRoleToDelete(r)
              setDeleteModalOpen(true)
            }}
            onRefetch={refetch}
          />
        </div>

        <div className={`lg:col-span-8 xl:col-span-8 flex flex-col h-full min-h-0 ${!nav.mobileEditorOpen ? "hidden lg:flex" : "flex"}`}>
          {!nav.selectedRole && !nav.isCreatingNew ? (
            <Card className="rounded-2xl border border-dashed border-border p-8 text-center bg-card/40 flex flex-col items-center justify-center h-full min-h-0">
              <div className="size-14 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                <ShieldCheck className="size-7 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Pilih atau Buat Role Baru</h3>
              <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4">
                Pilih salah satu role dari panel sebelah kiri atau klik tombol di bawah untuk menambahkan role baru.
              </p>
              <Button
                onClick={nav.handleStartCreateRole}
                disabled={deleteRoleMutation.isPending}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer shadow-xs gap-1.5 text-xs h-8.5 px-3.5"
              >
                <Plus className="size-3.5" />
                <span>Buat Role Baru</span>
              </Button>
            </Card>
          ) : (
            <RoleEditor
              key={nav.isCreatingNew ? "new" : nav.selectedRole?.id || "empty"}
              role={nav.selectedRole}
              allRoles={roles}
              isCreatingNew={nav.isCreatingNew}
              isParentBusy={deleteRoleMutation.isPending}
              onBack={nav.handleMobileBack}
              onSaved={(saved, isNew) => {
                if (isNew) {
                  nav.setIsCreatingNew(false)
                  if (saved.id) nav.setSelectedRoleId(saved.id)
                  setPageNotice({ type: "success", text: `Role "${saved.name}" berhasil dibuat!` })
                }
              }}
              onCancelNew={() => {
                nav.setIsCreatingNew(false)
                if (roles.length > 0) nav.setSelectedRoleId(roles[0].id || null)
                setPageNotice({ type: "success", text: "Pembuatan role baru dibatalkan." })
              }}
              onRegisterDirtyChecker={nav.registerDirtyChecker}
            />
          )}
        </div>
      </div>

      <RoleUnsavedDialog
        open={nav.unsavedDialogOpen}
        onOpenChange={nav.setUnsavedDialogOpen}
        isCreatingNew={nav.isCreatingNew}
        selectedRole={nav.selectedRole}
        onConfirmDiscard={nav.handleConfirmDiscard}
        onCancelDiscard={() => nav.setUnsavedDialogOpen(false)}
      />

      <RoleDeleteDialog
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        role={roleToDelete}
        isDeleting={deleteRoleMutation.isPending}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
