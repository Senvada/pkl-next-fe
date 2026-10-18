"use client"

import * as React from "react"
import {
  useCompaniesPaginatedQuery,
  useCreateCompany,
  useUpdateCompany,
  useDeleteCompany,
} from "@/hooks/modules/company"
import { useDepartmentsQuery } from "@/hooks/modules/department"
import { useProfileQuery } from "@/hooks/modules/profile"
import type {
  CreateCompanyPayload,
  UpdateCompanyPayload,
} from "@/types/company"

import { useCompanyFilter } from "./_hooks/use-company-filter"
import { useCompanyDialogs } from "./_hooks/use-company-dialogs"
import { CompanyHeader } from "./_components/company-header"
import { CompanyNotice, type PageNotice } from "./_components/company-notice"
import { CompanyMetrics } from "./_components/company-metrics"
import { CompanyFilterBar } from "./_components/company-filter-bar"
import { CompanyTable } from "./_components/company-table"
import { CompanyPagination } from "./_components/company-pagination"
import { CompanyFormDrawer } from "./_components/company-form-drawer"
import { CompanyDetailDialog } from "./_components/company-detail-dialog"
import { CompanyDeleteDialog } from "./_components/company-delete-dialog"

const emptySubscribe = () => () => {}

export default function CompaniesManagementPage() {
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  const { data: myProfile } = useProfileQuery()
  const isAdmin = myProfile?.role_name?.toLowerCase() === "admin"
  const isIndustri =
    myProfile?.role_name?.toLowerCase() === "industri" ||
    myProfile?.role_name?.toLowerCase() === "pembimbing industri"
  const myCompanyId = myProfile?.company_id

  const { data: departments = [] } = useDepartmentsQuery()

  const filter = useCompanyFilter()
  const dialogs = useCompanyDialogs()

  const {
    data: queryResult,
    isLoading,
    refetch,
  } = useCompaniesPaginatedQuery({
    page: filter.page,
    limit: filter.limit,
    filter: filter.filterPayload,
  })

  const companies = React.useMemo(
    () => queryResult?.companies ?? [],
    [queryResult?.companies]
  )
  const pagination = queryResult?.pagination

  const createCompanyMutation = useCreateCompany()
  const updateCompanyMutation = useUpdateCompany()
  const deleteCompanyMutation = useDeleteCompany()
  const isBusy =
    createCompanyMutation.isPending ||
    updateCompanyMutation.isPending ||
    deleteCompanyMutation.isPending

  const [pageNotice, setPageNotice] = React.useState<PageNotice | null>(null)
  const handleCloseNotice = React.useCallback(() => setPageNotice(null), [])

  const editingCompany = dialogs.editingCompany
  const companyToDelete = dialogs.companyToDelete
  const setDeleteDialogOpen = dialogs.setDeleteDialogOpen
  const setCompanyToDelete = dialogs.setCompanyToDelete
  const isDeletePending = deleteCompanyMutation.isPending
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

  const metrics = React.useMemo(() => {
    const total = pagination?.total_rows ?? companies.length
    const activeCount = companies.filter((c) => c.status === "active").length
    const mappedCount = companies.filter(
      (c) => c.lat != null && c.lng != null
    ).length
    const totalMembers = companies.reduce(
      (acc, c) => acc + (c.member_count ?? 0),
      0
    )

    return {
      total,
      activeCount,
      mappedCount,
      totalMembers,
    }
  }, [companies, pagination?.total_rows])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="size-8 animate-spin rounded-full border-3 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <CompanyHeader
        canCreate={isAdmin}
        onOpenCreate={dialogs.openCreateDialog}
        onRefresh={() => refetch()}
        isLoading={isLoading}
      />

      {/* 2. Notification Banner */}
      <CompanyNotice notice={pageNotice} onClose={handleCloseNotice} />

      {/* 3. Metrics Cards */}
      <CompanyMetrics
        total={metrics.total}
        activeCount={metrics.activeCount}
        mappedCount={metrics.mappedCount}
        totalMembers={metrics.totalMembers}
      />

      {/* 4. Filter Bar */}
      <CompanyFilterBar
        searchTerm={filter.search}
        onSearchChange={filter.setSearch}
        filterDept={filter.departmentId}
        onDeptChange={filter.setDepartmentId}
        filterStatus={filter.status}
        onStatusChange={filter.setStatus}
        limit={filter.limit}
        onLimitChange={filter.setLimit}
        hasActiveFilters={filter.isFiltered}
        onResetFilters={filter.resetFilter}
        departments={departments}
      />

      {/* 5. Company Table and Mobile Cards */}
      <CompanyTable
        companies={companies}
        isLoading={isLoading}
        isAdmin={isAdmin}
        myCompanyId={isIndustri ? myCompanyId : null}
        onDetail={dialogs.openDetailDialog}
        onEdit={dialogs.openEditDialog}
        onDelete={dialogs.openDeleteDialog}
      />

      {/* 6. Pagination */}
      <CompanyPagination
        pagination={pagination}
        isBusy={isBusy}
        onPageChange={filter.setPage}
      />

      {/* 7. Create/Edit Drawer */}
      <CompanyFormDrawer
        open={dialogs.formDialogOpen}
        onOpenChange={dialogs.setFormDialogOpen}
        editingCompany={dialogs.editingCompany}
        departments={departments}
        isSaving={isBusy}
        onSave={handleSaveCompany}
      />

      {/* 8. Detail Dialog */}
      <CompanyDetailDialog
        open={dialogs.detailDialogOpen}
        onOpenChange={dialogs.setDetailDialogOpen}
        company={dialogs.detailCompany}
      />

      {/* 9. Delete Confirmation Dialog */}
      <CompanyDeleteDialog
        open={dialogs.deleteDialogOpen}
        onOpenChange={dialogs.setDeleteDialogOpen}
        company={dialogs.companyToDelete}
        isDeleting={isDeletePending}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
