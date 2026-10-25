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
  children?: React.ReactNode
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>
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
  scrollContainerRef,
}: UserTableProps) {
  return (
    <Card className="rounded-2xl border border-border shadow-xs bg-card/60 flex flex-col flex-1 min-h-0 overflow-hidden">
      <CardContent className="p-0 flex flex-col flex-1 min-h-0">
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
          <div
            ref={scrollContainerRef}
            tabIndex={0}
            className="overflow-auto max-h-[calc(100dvh-21rem)] min-h-[360px] relative focus:outline-hidden"
          >
            <table className="w-full min-w-[850px] text-left text-xs text-foreground border-separate border-spacing-0">
              <thead className="sticky top-0 z-20 shadow-xs">
                <tr>
                  <th scope="col" className="sticky top-0 z-20 bg-muted dark:bg-[#16212D] text-muted-foreground uppercase tracking-wider text-[10px] font-bold px-4 py-3 border-b border-border min-w-[240px]">Pengguna</th>
                  <th scope="col" className="sticky top-0 z-20 bg-muted dark:bg-[#16212D] text-muted-foreground uppercase tracking-wider text-[10px] font-bold px-4 py-3 border-b border-border min-w-[130px]">Peran / Role</th>
                  <th scope="col" className="sticky top-0 z-20 bg-muted dark:bg-[#16212D] text-muted-foreground uppercase tracking-wider text-[10px] font-bold px-4 py-3 border-b border-border min-w-[170px]">Jurusan</th>
                  <th scope="col" className="sticky top-0 z-20 bg-muted dark:bg-[#16212D] text-muted-foreground uppercase tracking-wider text-[10px] font-bold px-4 py-3 border-b border-border min-w-[190px]">Industri Mitra</th>
                  <th scope="col" className="sticky top-0 z-20 bg-muted dark:bg-[#16212D] text-muted-foreground uppercase tracking-wider text-[10px] font-bold px-4 py-3 border-b border-border min-w-[110px]">Status</th>
                  <th scope="col" className="sticky top-0 z-20 bg-muted dark:bg-[#16212D] text-muted-foreground uppercase tracking-wider text-[10px] font-bold px-4 py-3 border-b border-border min-w-[100px] text-right">Aksi</th>
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

            {children}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
