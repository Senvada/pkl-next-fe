import * as React from "react"
import { Users2, AlertCircle, RefreshCw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { UserTableRow } from "./user-table-row"
import type { UserItem } from "@/types/user"
import type { UserProfile } from "@/types/profile"

interface UserTableProps {
  users: UserItem[]
  isLoading: boolean
  isError: boolean
  error: Error | null
  mounted: boolean
  isBusy: boolean
  myProfile: UserProfile | null | undefined
  hasActiveFilters: boolean
  onResetFilters: () => void
  onRefetch: () => void
  onDetail: (user: UserItem) => void
  onEdit: (user: UserItem) => void
  onDelete: (user: UserItem) => void
  children?: React.ReactNode // for pagination
}

export function UserTable({
  users,
  isLoading,
  isError,
  error,
  mounted,
  isBusy,
  myProfile,
  hasActiveFilters,
  onResetFilters,
  onRefetch,
  onDetail,
  onEdit,
  onDelete,
  children,
}: UserTableProps) {
  return (
    <Card className="rounded-2xl border border-border shadow-xs bg-card/60 flex flex-col overflow-hidden">
      <CardContent className="p-0">
        {(!mounted || isLoading) && (
          <div className="p-6 space-y-3">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        )}

        {isError && mounted && (
          <div className="p-8 text-center text-xs text-destructive flex flex-col items-center gap-2">
            <AlertCircle className="size-6" />
            <span>
              {error instanceof Error ? error.message : "Gagal memuat daftar pengguna dari server."}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRefetch}
              className="h-8 text-xs rounded-xl gap-1.5 cursor-pointer mt-1"
            >
              <RefreshCw className="size-3" />
              <span>Coba Lagi</span>
            </Button>
          </div>
        )}

        {mounted && !isLoading && users.length === 0 && (
          <div className="py-16 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
            <Users2 className="size-8 stroke-[1.5] text-muted-foreground/60" />
            <span className="font-semibold text-foreground">Tidak ada data pengguna ditemukan</span>
            <span>
              {hasActiveFilters
                ? "Coba ubah kriteria pencarian atau filter yang Anda terapkan."
                : "Belum ada data pengguna yang terdaftar."}
            </span>
            {hasActiveFilters && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onResetFilters}
                className="h-8 text-xs rounded-xl cursor-pointer mt-2"
              >
                Reset Semua Filter
              </Button>
            )}
          </div>
        )}

        {mounted && !isLoading && users.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-foreground">
              <thead className="bg-muted/40 uppercase tracking-wider text-[10px] font-bold text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-4 py-3">Pengguna</th>
                  <th className="px-4 py-3">Peran / Role</th>
                  <th className="px-4 py-3">Jurusan</th>
                  <th className="px-4 py-3">Industri Mitra</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {users.map((user) => (
                  <UserTableRow
                    key={user.id}
                    user={user}
                    isSelf={myProfile?.id === user.id}
                    isUserAdmin={user.role_name.toLowerCase() === "admin"}
                    isBusy={isBusy}
                    onDetail={onDetail}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {children}
      </CardContent>
    </Card>
  )
}
