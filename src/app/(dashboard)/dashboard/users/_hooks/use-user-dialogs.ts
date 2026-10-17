import * as React from "react"
import type { UserItem } from "@/types/user"

export function useUserDialogs() {
  const [formDialogOpen, setFormDialogOpen] = React.useState(false)
  const [editingUser, setEditingUser] = React.useState<UserItem | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [userToDelete, setUserToDelete] = React.useState<UserItem | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = React.useState(false)
  const [viewingUser, setViewingUser] = React.useState<UserItem | null>(null)

  const handleOpenCreate = React.useCallback(() => {
    setEditingUser(null)
    setFormDialogOpen(true)
  }, [])

  const handleOpenEdit = React.useCallback((user: UserItem) => {
    setEditingUser(user)
    setFormDialogOpen(true)
  }, [])

  const handleOpenDetail = React.useCallback((user: UserItem) => {
    setViewingUser(user)
    setDetailDialogOpen(true)
  }, [])

  const handleOpenDelete = React.useCallback((user: UserItem) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }, [])

  return {
    formDialogOpen,
    setFormDialogOpen,
    editingUser,
    deleteDialogOpen,
    setDeleteDialogOpen,
    userToDelete,
    setUserToDelete,
    detailDialogOpen,
    setDetailDialogOpen,
    viewingUser,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDetail,
    handleOpenDelete,
  }
}
