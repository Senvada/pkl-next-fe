import * as React from "react"
import { Eye, Mail } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import type { UserItem } from "@/types/user"

interface UserDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserItem | null
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
}

export function UserDetailDialog({ open, onOpenChange, user }: UserDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Eye className="size-5 text-blue-600" />
            <span>Detail Akun Pengguna</span>
          </DialogTitle>
        </DialogHeader>

        {user && (
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-muted/40 border border-border">
              <Avatar className="size-12 rounded-full border border-border">
                <AvatarImage src={user.avatar_url || user.image || ""} alt={user.name} />
                <AvatarFallback className="text-sm font-bold bg-blue-500/10 text-blue-600">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-foreground truncate">{user.name}</h4>
                <p className="text-xs text-muted-foreground truncate flex items-center gap-1.5 mt-0.5">
                  <Mail className="size-3 text-muted-foreground" />
                  <span>{user.email}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-border bg-card">
                <span className="text-[11px] text-muted-foreground block mb-1">Role &amp; Hak Akses</span>
                <div className="flex items-center gap-1.5 font-semibold">
                  <div
                    className="size-2 rounded-full shrink-0"
                    style={{ backgroundColor: user.role?.color || "#3B82F6" }}
                  />
                  <span>{user.role_name}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-border bg-card">
                <span className="text-[11px] text-muted-foreground block mb-1">Jurusan / Departemen</span>
                <span className="font-semibold text-foreground">
                  {user.department ? `${user.department.code} - ${user.department.name}` : "Tidak Ditentukan"}
                </span>
              </div>

              <div className="p-3 rounded-xl border border-border bg-card">
                <span className="text-[11px] text-muted-foreground block mb-1">Industri Mitra</span>
                <span className="font-semibold text-foreground">
                  {user.company?.name || "Tidak Ditautkan"}
                </span>
              </div>

              <div className="p-3 rounded-xl border border-border bg-card">
                <span className="text-[11px] text-muted-foreground block mb-1">Status Akun</span>
                <Badge variant="secondary" className="h-5 text-[10px] px-2 rounded-md capitalize font-medium">
                  {user.status}
                </Badge>
              </div>
            </div>

            {user.parent_name && (
              <div className="p-3 rounded-xl border border-border bg-muted/20 text-xs">
                <span className="text-[11px] text-muted-foreground block">Pembimbing Industri (PIC)</span>
                <span className="font-semibold text-foreground">{user.parent_name}</span>
              </div>
            )}

            {user.sub_user_count > 0 && (
              <div className="p-3 rounded-xl border border-purple-500/20 bg-purple-500/10 text-xs text-purple-700 dark:text-purple-300">
                Akun Industri ini mengelola <strong>{user.sub_user_count} siswa PKL</strong>.
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="rounded-xl h-9 text-xs cursor-pointer w-full"
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
