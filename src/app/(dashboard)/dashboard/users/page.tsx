"use client"

import * as React from "react"
import { useUsersInfiniteQuery } from "@/hooks/modules/user"
import { useRolesQuery } from "@/hooks/modules/role"
import { useDepartmentsQuery } from "@/hooks/modules/department"
import { useCompaniesQuery } from "@/hooks/modules/company"
import { useProfileQuery } from "@/hooks/modules/profile"

import { useUserFilter } from "./_hooks/use-user-filter"
import { useUserDialogs } from "./_hooks/use-user-dialogs"
import { useUserPageOperations } from "./_hooks/use-user-page-operations"
import { UserHeader } from "./_components/user-header"
import { UserNotice } from "./_components/user-notice"
import { UserMetrics } from "./_components/user-metrics"
import { UserFilterBar } from "./_components/user-filter-bar"
import { UserTable } from "./_components/user-table"
import { InfiniteScrollFooter } from "@/components/shared/infinite-scroll-footer"
import { UserFormDrawer } from "./_components/user-form-drawer"
import { UserDetailDialog } from "./_components/user-detail-dialog"
import { UserDeleteDialog } from "./_components/user-delete-dialog"

const emptySubscribe = () => () => {}

export default function UserManagementPage() {
  const mounted = React.useSyncExternalStore(emptySubscribe, () => true, () => false)

  const { data: myProfile } = useProfileQuery()
  const roleName = myProfile?.role_name?.toLowerCase() || ""
  const isAdmin = roleName === "admin"
  const isIndustri = roleName === "industri" || roleName === "pembimbing industri"

  const { data: roles = [] } = useRolesQuery()
  const { data: departments = [] } = useDepartmentsQuery()
  const { data: companies = [] } = useCompaniesQuery()

  const filter = useUserFilter()
  const dialogs = useUserDialogs()
  const tableContainerRef = React.useRef<HTMLDivElement | null>(null)

  const {
    items: users,
    totalCount,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    sentinelRef,
    refetch,
  } = useUsersInfiniteQuery({
    limit: 15,
    filter: filter.filterPayload,
    rootRef: tableContainerRef,
  })

  React.useEffect(() => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop = 0
    }
  }, [filter.filterPayload])

  const ops = useUserPageOperations({
    editingUser: dialogs.editingUser,
    userToDelete: dialogs.userToDelete,
    setDeleteDialogOpen: dialogs.setDeleteDialogOpen,
    setUserToDelete: dialogs.setUserToDelete,
  })

  const metrics = React.useMemo(() => ({
    total: totalCount,
    siswaCount: users.filter((u) => u.role_name.toLowerCase() === "siswa").length,
    industriCount: users.filter((u) => u.role_name.toLowerCase().includes("industri")).length,
    guruAdminCount: users.filter((u) => ["admin", "guru"].includes(u.role_name.toLowerCase())).length,
  }), [users, totalCount])

  return (
    <div className="flex-1 min-h-0 flex flex-col w-full max-w-7xl mx-auto space-y-4">
      <UserHeader onOpenCreate={dialogs.handleOpenCreate} disabled={ops.isBusy} />
      <UserNotice notice={ops.pageNotice} onClose={ops.handleCloseNotice} />
      <UserMetrics metrics={metrics} mounted={mounted} />

      <UserFilterBar
        searchTerm={filter.searchTerm} onSearchChange={filter.setSearchTerm}
        filterRole={filter.filterRole} onRoleChange={filter.setFilterRole}
        filterDept={filter.filterDept} onDeptChange={filter.setFilterDept}
        filterCompany={filter.filterCompany} onCompanyChange={filter.setFilterCompany}
        filterStatus={filter.filterStatus} onStatusChange={filter.setFilterStatus}
        hasActiveFilters={filter.hasActiveFilters} onResetFilters={filter.handleResetFilters}
        roles={roles} departments={departments} companies={companies} isAdmin={isAdmin}
      />

      <UserTable
        scrollContainerRef={tableContainerRef}
        users={users} isLoading={isLoading} isError={isError} error={error}
        mounted={mounted} isBusy={ops.isBusy} myProfile={myProfile}
        hasActiveFilters={filter.hasActiveFilters} onResetFilters={filter.handleResetFilters}
        onRefetch={refetch} onDetail={dialogs.handleOpenDetail}
        onEdit={dialogs.handleOpenEdit} onDelete={dialogs.handleOpenDelete}
      >
        <InfiniteScrollFooter
          sentinelRef={sentinelRef} hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          currentCount={users.length} totalCount={totalCount} itemLabel="pengguna"
        />
      </UserTable>

      <UserFormDrawer
        open={dialogs.formDialogOpen} onOpenChange={dialogs.setFormDialogOpen}
        editingUser={dialogs.editingUser} roles={roles} departments={departments}
        companies={companies} isAdmin={isAdmin} isIndustri={isIndustri}
        myCompanyId={myProfile?.company_id} isSaving={ops.isSaving} onSave={ops.handleSaveUser}
      />

      <UserDetailDialog
        open={dialogs.detailDialogOpen} onOpenChange={dialogs.setDetailDialogOpen}
        user={dialogs.viewingUser}
      />

      <UserDeleteDialog
        open={dialogs.deleteDialogOpen} onOpenChange={dialogs.setDeleteDialogOpen}
        user={dialogs.userToDelete} isDeleting={ops.isDeletePending}
        onConfirm={ops.handleConfirmDelete}
      />
    </div>
  )
}
