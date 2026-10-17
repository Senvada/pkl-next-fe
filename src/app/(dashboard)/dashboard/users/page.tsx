"use client"

import * as React from "react"
import { useUsersPaginatedQuery, useCreateUser, useUpdateUser, useDeleteUser } from "@/hooks/modules/user"
import { useRolesQuery } from "@/hooks/modules/role"
import { useDepartmentsQuery } from "@/hooks/modules/department"
import { useCompaniesQuery } from "@/hooks/modules/company"
import { useProfileQuery } from "@/hooks/modules/profile"
import type { CreateUserPayload, UpdateUserPayload } from "@/types/user"

import { useUserFilter } from "./_hooks/use-user-filter"
import { useUserDialogs } from "./_hooks/use-user-dialogs"
import { UserHeader } from "./_components/user-header"
import { UserNotice, type PageNotice } from "./_components/user-notice"
import { UserMetrics } from "./_components/user-metrics"
import { UserFilterBar } from "./_components/user-filter-bar"
import { UserTable } from "./_components/user-table"
import { UserPagination } from "./_components/user-pagination"
import { UserFormDialog } from "./_components/user-form-dialog"
import { UserDetailDialog } from "./_components/user-detail-dialog"
import { UserDeleteDialog } from "./_components/user-delete-dialog"

const emptySubscribe = () => () => {}

export default function UserManagementPage() {
  const mounted = React.useSyncExternalStore(emptySubscribe, () => true, () => false)

  const { data: myProfile } = useProfileQuery()
  const isAdmin = myProfile?.role_name?.toLowerCase() === "admin"
  const isIndustri =
    myProfile?.role_name?.toLowerCase() === "industri" ||
    myProfile?.role_name?.toLowerCase() === "pembimbing industri"

  const { data: roles = [] } = useRolesQuery()
  const { data: departments = [] } = useDepartmentsQuery()
  const { data: companies = [] } = useCompaniesQuery()

  const filter = useUserFilter()
  const dialogs = useUserDialogs()

  const { data: queryResult, isLoading, isError, error, refetch } = useUsersPaginatedQuery({
    page: filter.page,
    limit: filter.limit,
    filter: filter.filterPayload,
  })

  const users = React.useMemo(() => queryResult?.users ?? [], [queryResult?.users])
  const pagination = queryResult?.pagination

  const createUserMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()
  const deleteUserMutation = useDeleteUser()
  const isBusy = createUserMutation.isPending || updateUserMutation.isPending || deleteUserMutation.isPending

  const [pageNotice, setPageNotice] = React.useState<PageNotice | null>(null)

  const handleSaveUser = async ({
    isEdit,
    payload,
    name,
  }: {
    isEdit: boolean
    payload: CreateUserPayload | UpdateUserPayload
    name: string
  }) => {
    if (isEdit && dialogs.editingUser) {
      await updateUserMutation.mutateAsync({ id: dialogs.editingUser.id, payload: payload as UpdateUserPayload })
      setPageNotice({ type: "success", text: `Data pengguna "${name}" berhasil diperbarui.` })
    } else {
      await createUserMutation.mutateAsync(payload as CreateUserPayload)
      setPageNotice({ type: "success", text: `Pengguna baru "${name}" berhasil ditambahkan.` })
    }
  }

  const handleConfirmDelete = async () => {
    if (!dialogs.userToDelete || deleteUserMutation.isPending) return
    try {
      await deleteUserMutation.mutateAsync(dialogs.userToDelete.id)
      setPageNotice({ type: "success", text: `Pengguna "${dialogs.userToDelete.name}" berhasil dihapus.` })
      dialogs.setDeleteDialogOpen(false)
      dialogs.setUserToDelete(null)
    } catch (err) {
      setPageNotice({ type: "error", text: err instanceof Error ? err.message : "Gagal menghapus pengguna." })
      dialogs.setDeleteDialogOpen(false)
    }
  }

  const metrics = React.useMemo(() => {
    const total = pagination?.total_rows ?? users.length
    const siswaCount = users.filter((u) => u.role_name.toLowerCase() === "siswa").length
    const industriCount = users.filter((u) => u.role_name.toLowerCase().includes("industri")).length
    const guruAdminCount = users.filter(
      (u) => u.role_name.toLowerCase() === "admin" || u.role_name.toLowerCase() === "guru"
    ).length
    return { total, siswaCount, industriCount, guruAdminCount }
  }, [users, pagination])

  return (
    <div className="flex-1 min-h-0 flex flex-col w-full max-w-7xl mx-auto space-y-4">
      <UserHeader onOpenCreate={dialogs.handleOpenCreate} disabled={isBusy} />
      <UserNotice notice={pageNotice} onClose={() => setPageNotice(null)} />
      <UserMetrics metrics={metrics} mounted={mounted} />

      <UserFilterBar
        searchTerm={filter.searchTerm}
        onSearchChange={filter.setSearchTerm}
        filterRole={filter.filterRole}
        onRoleChange={(v) => { filter.setFilterRole(v); filter.setPage(1) }}
        filterDept={filter.filterDept}
        onDeptChange={(v) => { filter.setFilterDept(v); filter.setPage(1) }}
        filterCompany={filter.filterCompany}
        onCompanyChange={(v) => { filter.setFilterCompany(v); filter.setPage(1) }}
        filterStatus={filter.filterStatus}
        onStatusChange={(v) => { filter.setFilterStatus(v); filter.setPage(1) }}
        hasActiveFilters={filter.hasActiveFilters}
        onResetFilters={filter.handleResetFilters}
        roles={roles}
        departments={departments}
        companies={companies}
        isAdmin={isAdmin}
      />

      <UserTable
        users={users}
        isLoading={isLoading}
        isError={isError}
        error={error}
        mounted={mounted}
        isBusy={isBusy}
        myProfile={myProfile}
        hasActiveFilters={filter.hasActiveFilters}
        onResetFilters={filter.handleResetFilters}
        onRefetch={refetch}
        onDetail={dialogs.handleOpenDetail}
        onEdit={dialogs.handleOpenEdit}
        onDelete={dialogs.handleOpenDelete}
      >
        <UserPagination pagination={pagination} isBusy={isBusy} onPageChange={filter.setPage} />
      </UserTable>

      <UserFormDialog
        open={dialogs.formDialogOpen}
        onOpenChange={dialogs.setFormDialogOpen}
        editingUser={dialogs.editingUser}
        roles={roles}
        departments={departments}
        companies={companies}
        isAdmin={isAdmin}
        isIndustri={isIndustri}
        myCompanyId={myProfile?.company_id}
        isSaving={createUserMutation.isPending || updateUserMutation.isPending}
        onSave={handleSaveUser}
      />

      <UserDetailDialog
        open={dialogs.detailDialogOpen}
        onOpenChange={dialogs.setDetailDialogOpen}
        user={dialogs.viewingUser}
      />

      <UserDeleteDialog
        open={dialogs.deleteDialogOpen}
        onOpenChange={dialogs.setDeleteDialogOpen}
        user={dialogs.userToDelete}
        isDeleting={deleteUserMutation.isPending}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
