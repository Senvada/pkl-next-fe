import * as React from "react"
import { Eye, Edit3, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { UserItem } from "@/types/user"

interface UserTableRowProps {
  user: UserItem
  isSelf: boolean
  isUserAdmin: boolean
  isBusy: boolean
  onDetail: (user: UserItem) => void
  onEdit: (user: UserItem) => void
  onDelete: (user: UserItem) => void
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
}

export function UserTableRow({
  user,
  isSelf,
  isUserAdmin,
  isBusy,
  onDetail,
  onEdit,
  onDelete,
}: UserTableRowProps) {
  return (
    <tr className="hover:bg-muted/30 transition-colors">
      {/* 1. Pengguna */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-8.5 rounded-full border border-border">
            <AvatarImage src={user.avatar_url || user.image || ""} alt={user.name} />
            <AvatarFallback className="text-[11px] font-bold bg-blue-500/10 text-blue-600">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold truncate">{user.name}</span>
              {isSelf && (
                <Badge variant="outline" className="h-4 text-[9px] px-1 rounded-sm border-blue-500/30 text-blue-600">
                  Anda
                </Badge>
              )}
            </div>
            <span className="text-[11px] text-muted-foreground truncate block">{user.email}</span>
          </div>
        </div>
      </td>

      {/* 2. Role */}
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <div className="size-2 rounded-full shrink-0" style={{ backgroundColor: user.role?.color || "#3B82F6" }} />
          <span className="font-medium">{user.role_name}</span>
        </div>
      </td>

      {/* 3. Jurusan */}
      <td className="px-4 py-3 whitespace-nowrap">
        {user.department ? (
          <Badge
            variant="secondary"
            className="h-5 text-[10px] px-2 rounded-md font-medium"
            style={{
              backgroundColor: `${user.department.color || "#10B981"}15`,
              color: user.department.color || "#10B981",
              borderColor: `${user.department.color || "#10B981"}30`,
            }}
          >
            {user.department.code} - {user.department.name}
          </Badge>
        ) : (
          <span className="text-muted-foreground/60 text-[11px]">—</span>
        )}
      </td>

      {/* 4. Industri Mitra */}
      <td className="px-4 py-3">
        {user.company ? (
          <div className="flex flex-col min-w-0 max-w-[200px]">
            <span className="font-medium text-xs truncate">{user.company.name}</span>
            {user.parent_name && (
              <span className="text-[10px] text-muted-foreground truncate">PIC: {user.parent_name}</span>
            )}
            {user.sub_user_count > 0 && (
              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">
                {user.sub_user_count} Siswa Terdaftar
              </span>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground/60 text-[11px]">—</span>
        )}
      </td>

      {/* 5. Status */}
      <td className="px-4 py-3 whitespace-nowrap">
        <Badge
          variant="secondary"
          className={`h-5 text-[10px] px-2 rounded-md capitalize font-medium ${
            user.status === "active"
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
              : user.status === "waiting"
              ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20"
              : user.status === "banned"
              ? "bg-destructive/10 text-destructive border border-destructive/20"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {user.status === "active" ? "Aktif" : user.status === "waiting" ? "Menunggu" : user.status === "banned" ? "Diblokir" : "Nonaktif"}
        </Badge>
      </td>

      {/* 6. Aksi */}
      <td className="px-4 py-3 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onDetail(user)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            title="Lihat Detail"
          >
            <Eye className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(user)}
            disabled={isBusy}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-blue-600 hover:bg-blue-500/10 transition-colors cursor-pointer"
            title="Ubah Data"
          >
            <Edit3 className="size-3.5" />
          </button>
          {!isSelf && !isUserAdmin && (
            <button
              type="button"
              onClick={() => onDelete(user)}
              disabled={isBusy}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
              title="Hapus Pengguna"
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}
