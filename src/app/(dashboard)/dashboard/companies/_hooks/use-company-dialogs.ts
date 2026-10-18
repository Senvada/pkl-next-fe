"use client"

import * as React from "react"
import type { Company } from "@/types/company"

export function useCompanyDialogs() {
  const [formDialogOpen, setFormDialogOpen] = React.useState(false)
  const [editingCompany, setEditingCompany] = React.useState<Company | null>(null)

  const [detailDialogOpen, setDetailDialogOpen] = React.useState(false)
  const [detailCompany, setDetailCompany] = React.useState<Company | null>(null)

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [companyToDelete, setCompanyToDelete] = React.useState<Company | null>(null)

  const openCreateDialog = React.useCallback(() => {
    setEditingCompany(null)
    setFormDialogOpen(true)
  }, [])

  const openEditDialog = React.useCallback((comp: Company) => {
    setEditingCompany(comp)
    setFormDialogOpen(true)
  }, [])

  const openDetailDialog = React.useCallback((comp: Company) => {
    setDetailCompany(comp)
    setDetailDialogOpen(true)
  }, [])

  const openDeleteDialog = React.useCallback((comp: Company) => {
    setCompanyToDelete(comp)
    setDeleteDialogOpen(true)
  }, [])

  const closeFormDialog = React.useCallback(() => {
    setFormDialogOpen(false)
    setEditingCompany(null)
  }, [])

  const closeDetailDialog = React.useCallback(() => {
    setDetailDialogOpen(false)
    setDetailCompany(null)
  }, [])

  const closeDeleteDialog = React.useCallback(() => {
    setDeleteDialogOpen(false)
    setCompanyToDelete(null)
  }, [])

  return {
    formDialogOpen,
    setFormDialogOpen,
    editingCompany,
    openCreateDialog,
    openEditDialog,
    closeFormDialog,

    detailDialogOpen,
    setDetailDialogOpen,
    detailCompany,
    openDetailDialog,
    closeDetailDialog,

    deleteDialogOpen,
    setDeleteDialogOpen,
    companyToDelete,
    setCompanyToDelete,
    openDeleteDialog,
    closeDeleteDialog,
  }
}
