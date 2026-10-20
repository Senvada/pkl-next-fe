"use client"

import * as React from "react"
import { useCompaniesPaginatedQuery } from "@/hooks/modules/company"
import { useDepartmentsQuery } from "@/hooks/modules/department"
import { useProfileQuery } from "@/hooks/modules/profile"

import { useCompanyFilter } from "./_hooks/use-company-filter"
import { useCompanyDialogs } from "./_hooks/use-company-dialogs"
import { useCompanyPageOperations } from "./_hooks/use-company-page-operations"
import { CompanyHeader } from "./_components/company-header"
import { CompanyNotice } from "./_components/company-notice"
import { CompanyMetrics } from "./_components/company-metrics"
import { CompanyFilterBar } from "./_components/company-filter-bar"
import { CompanyTable } from "./_components/company-table"
import { CompanyPagination } from "./_components/company-pagination"
import { CompanyFormDrawer } from "./_components/company-form-drawer"
import { CompanyDetailDialog } from "./_components/company-detail-dialog"
import { CompanyDeleteDialog } from "./_components/company-delete-dialog"

const emptySubscribe = () => () => {}

export default function CompaniesManagementPage() {
  const mounted = React.useSyncExternalStore(emptySubscribe, () => true, () => false)

  const { data: myProfile } = useProfileQuery()
  const isAdmin = myProfile?.role_name?.toLowerCase() === "admin"
  const isIndustri =
    myProfile?.role_name?.toLowerCase() === "industri" ||
    myProfile?.role_name?.toLowerCase() === "pembimbing industri"
  const myCompanyId = myProfile?.company_id

  const { data: departments = [] } = useDepartmentsQuery()
  const filter = useCompanyFilter()
  const dialogs = useCompanyDialogs()

  const { data: queryResult, isLoading, refetch } = useCompaniesPaginatedQuery({
    page: filter.page,
    limit: filter.limit,
    filter: filter.filterPayload,
  })

  const companies = React.useMemo(() => queryResult?.companies ?? [], [queryResult?.companies])
  const pagination = queryResult?.pagination

  const ops = useCompanyPageOperations({
    editingCompany: dialogs.editingCompany,
    companyToDelete: dialogs.companyToDelete,
    setDeleteDialogOpen: dialogs.setDeleteDialogOpen,
    setCompanyToDelete: dialogs.setCompanyToDelete,
  })

  const metrics = React.useMemo(() => ({
    total: pagination?.total_rows ?? companies.length,
    activeCount: companies.filter((c) => c.status === "active").length,
    mappedCount: companies.filter((c) => c.lat != null && c.lng != null).length,
    totalMembers: companies.reduce((acc, c) => acc + (c.member_count ?? 0), 0),
  }), [companies, pagination?.total_rows])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="size-8 animate-spin rounded-full border-3 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <CompanyHeader
        canCreate={isAdmin}
        onOpenCreate={dialogs.openCreateDialog}
        onRefresh={() => refetch()}
        isLoading={isLoading}
      />

      <CompanyNotice notice={ops.pageNotice} onClose={ops.handleCloseNotice} />

      <CompanyMetrics
        total={metrics.total}
        activeCount={metrics.activeCount}
        mappedCount={metrics.mappedCount}
        totalMembers={metrics.totalMembers}
      />

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

      <CompanyTable
        companies={companies}
        isLoading={isLoading}
        isAdmin={isAdmin}
        myCompanyId={isIndustri ? myCompanyId : null}
        onDetail={dialogs.openDetailDialog}
        onEdit={dialogs.openEditDialog}
        onDelete={dialogs.openDeleteDialog}
      />

      <CompanyPagination
        pagination={pagination}
        isBusy={ops.isBusy}
        onPageChange={filter.setPage}
      />

      <CompanyFormDrawer
        open={dialogs.formDialogOpen}
        onOpenChange={dialogs.setFormDialogOpen}
        editingCompany={dialogs.editingCompany}
        departments={departments}
        isSaving={ops.isBusy}
        onSave={ops.handleSaveCompany}
      />

      <CompanyDetailDialog
        open={dialogs.detailDialogOpen}
        onOpenChange={dialogs.setDetailDialogOpen}
        company={dialogs.detailCompany}
      />

      <CompanyDeleteDialog
        open={dialogs.deleteDialogOpen}
        onOpenChange={dialogs.setDeleteDialogOpen}
        company={dialogs.companyToDelete}
        isDeleting={ops.isDeletePending}
        onConfirm={ops.handleConfirmDelete}
      />
    </div>
  )
}
