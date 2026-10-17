import * as React from "react"
import { Search, AlertCircle, RefreshCw } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { RolesListItem } from "./roles-list-item"
import type { Role } from "@/types/role"

interface RolesListProps {
  roles: Role[]
  selectedRole: Role | null
  isCreatingNew: boolean
  isBusy: boolean
  isLoading: boolean
  isError: boolean
  error: Error | null
  mounted: boolean
  onSelectRole: (role: Role) => void
  onPromptDelete: (e: React.MouseEvent, role: Role) => void
  onRefetch: () => void
}

export function RolesList({
  roles,
  selectedRole,
  isCreatingNew,
  isBusy,
  isLoading,
  isError,
  error,
  mounted,
  onSelectRole,
  onPromptDelete,
  onRefetch,
}: RolesListProps) {
  const [roleSearch, setRoleSearch] = React.useState("")

  const filteredRoles = React.useMemo(() => {
    if (!roleSearch.trim()) return roles
    const q = roleSearch.toLowerCase()
    return roles.filter((r) => r.name.toLowerCase().includes(q))
  }, [roles, roleSearch])

  return (
    <Card className="rounded-2xl border border-border shadow-xs bg-card/60 flex flex-col h-full min-h-0 overflow-hidden">
      <CardHeader className="p-3.5 pb-2.5 space-y-2 shrink-0 border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Daftar Role{mounted && roles.length > 0 ? ` (${roles.length})` : ""}
          </CardTitle>
        </div>

        <div className="relative">
          <Search className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            value={roleSearch}
            onChange={(e) => setRoleSearch(e.target.value)}
            placeholder="Cari nama role..."
            disabled={isBusy}
            className="h-8.5 text-xs pl-8.5 rounded-xl"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-2 space-y-1">
        {(!mounted || isLoading) && (
          <div className="space-y-2 p-2">
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        )}

        {isError && mounted && (
          <div className="p-4 text-center text-xs text-destructive flex flex-col items-center gap-2">
            <AlertCircle className="size-5" />
            <span>
              {error instanceof Error ? error.message : "Gagal memuat daftar role dari server."}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRefetch}
              className="h-7 text-xs rounded-lg gap-1.5 cursor-pointer mt-1"
            >
              <RefreshCw className="size-3" />
              <span>Coba Lagi</span>
            </Button>
          </div>
        )}

        {mounted && !isLoading && filteredRoles.length === 0 && (
          <div className="py-12 text-center text-xs text-muted-foreground">
            Tidak ada role yang sesuai.
          </div>
        )}

        {mounted &&
          !isLoading &&
          filteredRoles.map((role) => (
            <RolesListItem
              key={role.id}
              role={role}
              isSelected={!isCreatingNew && role.id === selectedRole?.id}
              isBusy={isBusy}
              onSelect={onSelectRole}
              onPromptDelete={onPromptDelete}
            />
          ))}
      </CardContent>
    </Card>
  )
}
