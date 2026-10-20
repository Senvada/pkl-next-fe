"use client"

import * as React from "react"
import {
  useCreateCompany,
  useUpdateCompany,
  useDeleteCompany,
} from "@/hooks/modules/company"
import type {
  Company,
  CreateCompanyPayload,
  UpdateCompanyPayload,
} from "@/types/company"
import type { PageNotice } from "../_components/company-notice"

interface UseCompanyPageOperationsProps {
  editingCompany: Company | null
  companyToDelete: Company | null
  setDeleteDialogOpen: (open: boolean) => void
  setCompanyToDelete: (company: Company | null) => void
}

export function useCompanyPageOperations({
  editingCompany,
  companyToDelete,
  setDeleteDialogOpen,
  setCompanyToDelete,
}: UseCompanyPageOperationsProps) {
  const createCompanyMutation = useCreateCompany()
  const updateCompanyMutation = useUpdateCompany()
  const deleteCompanyMutation = useDeleteCompany()

  const isBusy =
    createCompanyMutation.isPending ||
    updateCompanyMutation.isPending ||
    deleteCompanyMutation.isPending

  const isDeletePending = deleteCompanyMutation.isPending
  const [pageNotice, setPageNotice] = React.useState<PageNotice | null>(null)
  const handleCloseNotice = React.useCallback(() => setPageNotice(null), [])

  const mutateUpdateCompany = updateCompanyMutation.mutateAsync
  const mutateCreateCompany = createCompanyMutation.mutateAsync
  const mutateDeleteCompany = deleteCompanyMutation.mutateAsync

  const handleSaveCompany = React.useCallback(
    async ({
      isEdit,
      payload,
      name,
    }: {
      isEdit: boolean
      payload: CreateCompanyPayload | UpdateCompanyPayload
      name: string
    }) => {
      if (isEdit && editingCompany) {
        await mutateUpdateCompany({
          id: editingCompany.id,
          payload: payload as UpdateCompanyPayload,
        })
        setPageNotice({
          type: "success",
          text: `Data mitra "${name}" berhasil diperbarui.`,
        })
      } else {
        await mutateCreateCompany(payload as CreateCompanyPayload)
        setPageNotice({
          type: "success",
          text: `Mitra industri baru "${name}" berhasil didaftarkan.`,
        })
      }
    },
    [editingCompany, mutateUpdateCompany, mutateCreateCompany]
  )

  const handleConfirmDelete = React.useCallback(async () => {
    if (!companyToDelete || isDeletePending) return
    try {
      await mutateDeleteCompany(companyToDelete.id)
      setPageNotice({
        type: "success",
        text: `Data mitra "${companyToDelete.name}" berhasil dihapus.`,
      })
      setDeleteDialogOpen(false)
      setCompanyToDelete(null)
    } catch (err) {
      setPageNotice({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "Gagal menghapus data perusahaan mitra.",
      })
      setDeleteDialogOpen(false)
    }
  }, [
    companyToDelete,
    isDeletePending,
    mutateDeleteCompany,
    setDeleteDialogOpen,
    setCompanyToDelete,
  ])

  return {
    isBusy,
    isDeletePending,
    pageNotice,
    handleCloseNotice,
    handleSaveCompany,
    handleConfirmDelete,
  }
}
