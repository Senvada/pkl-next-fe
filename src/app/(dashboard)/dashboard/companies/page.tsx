"use client"

import * as React from "react"
import { useCompaniesInfiniteQuery } from "@/hooks/modules/company"
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
import { InfiniteScrollFooter } from "@/components/shared/infinite-scroll-footer"
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

  const {
    items: companies,
    totalCount,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    sentinelRef,
    refetch,
  } = useCompaniesInfiniteQuery({
    limit: 15,
    filter: filter.filterPayload,
  })

  const ops = useCompanyPageOperations({
    editingCompany: dialogs.editingCompany,
    companyToDelete: dialogs.companyToDelete,
    setDeleteDialogOpen: dialogs.setDeleteDialogOpen,
    setCompanyToDelete: dialogs.setCompanyToDelete,
  })

  const metrics = React.useMemo(() => ({
    total: totalCount,
    activeCount: companies.filter((c) => c.status === "active").length,
    mappedCount: companies.filter((c) => c.lat != null && c.lng != null).length,
    totalMembers: companies.reduce((acc, c) => acc + (c.member_count ?? 0), 0),
  }), [companies, totalCount])

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

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#16212D] shadow-xs">
        <CompanyTable
          companies={companies}
          isLoading={isLoading}
          isAdmin={isAdmin}
          myCompanyId={isIndustri ? myCompanyId : null}
          onDetail={dialogs.openDetailDialog}
          onEdit={dialogs.openEditDialog}
          onDelete={dialogs.openDeleteDialog}
        />

        <InfiniteScrollFooter
          sentinelRef={sentinelRef}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          currentCount={companies.length}
          totalCount={totalCount}
          itemLabel="perusahaan"
        />
      </div>

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
