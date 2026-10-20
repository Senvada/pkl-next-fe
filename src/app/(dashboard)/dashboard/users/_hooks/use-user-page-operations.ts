"use client"

import * as React from "react"
import { useCreateUser, useUpdateUser, useDeleteUser } from "@/hooks/modules/user"
import type { UserItem, CreateUserPayload, UpdateUserPayload } from "@/types/user"
import type { PageNotice } from "../_components/user-notice"

interface UseUserPageOperationsProps {
  editingUser: UserItem | null
  userToDelete: UserItem | null
  setDeleteDialogOpen: (open: boolean) => void
  setUserToDelete: (user: UserItem | null) => void
}

export function useUserPageOperations({
  editingUser,
  userToDelete,
  setDeleteDialogOpen,
  setUserToDelete,
}: UseUserPageOperationsProps) {
  const createUserMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()
  const deleteUserMutation = useDeleteUser()

  const isBusy =
    createUserMutation.isPending ||
    updateUserMutation.isPending ||
    deleteUserMutation.isPending

  const [pageNotice, setPageNotice] = React.useState<PageNotice | null>(null)
  const handleCloseNotice = React.useCallback(() => setPageNotice(null), [])

  const mutateUpdateUser = updateUserMutation.mutateAsync
  const mutateCreateUser = createUserMutation.mutateAsync
  const mutateDeleteUser = deleteUserMutation.mutateAsync

  const handleSaveUser = React.useCallback(
    async ({
      isEdit,
      payload,
      name,
    }: {
      isEdit: boolean
      payload: CreateUserPayload | UpdateUserPayload
      name: string
    }) => {
      if (isEdit && editingUser) {
        await mutateUpdateUser({ id: editingUser.id, payload: payload as UpdateUserPayload })
        setPageNotice({ type: "success", text: `Data pengguna "${name}" berhasil diperbarui.` })
      } else {
        await mutateCreateUser(payload as CreateUserPayload)
        setPageNotice({ type: "success", text: `Pengguna baru "${name}" berhasil ditambahkan.` })
      }
    },
    [editingUser, mutateUpdateUser, mutateCreateUser]
  )

  const handleConfirmDelete = React.useCallback(async () => {
    if (!userToDelete || deleteUserMutation.isPending) return
    try {
      await mutateDeleteUser(userToDelete.id)
      setPageNotice({ type: "success", text: `Pengguna "${userToDelete.name}" berhasil dihapus.` })
      setDeleteDialogOpen(false)
      setUserToDelete(null)
    } catch (err) {
      setPageNotice({
        type: "error",
        text: err instanceof Error ? err.message : "Gagal menghapus pengguna.",
      })
      setDeleteDialogOpen(false)
    }
  }, [userToDelete, deleteUserMutation.isPending, mutateDeleteUser, setDeleteDialogOpen, setUserToDelete])

  return {
    isBusy,
    isDeletePending: deleteUserMutation.isPending,
    isSaving: createUserMutation.isPending || updateUserMutation.isPending,
    pageNotice,
    handleCloseNotice,
    handleSaveUser,
    handleConfirmDelete,
  }
}
