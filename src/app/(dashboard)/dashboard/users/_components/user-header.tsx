import * as React from "react"
import { Users2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UserHeaderProps {
  onOpenCreate: () => void
  disabled?: boolean
}

export const UserHeader = React.memo(function UserHeader({ onOpenCreate, disabled }: UserHeaderProps) {
  return (
    <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
          <Users2 className="size-5" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
            Manajemen Pengguna
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Kelola akun siswa PKL, akun utama industri, pembimbing sekolah, dan penempatan jurusan.
          </p>
        </div>
      </div>

      <Button
        onClick={onOpenCreate}
        disabled={disabled}
        className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer shadow-xs gap-1.5 text-xs h-9 px-4 self-start sm:self-auto"
      >
        <Plus className="size-4" />
        <span>Tambah Pengguna</span>
      </Button>
    </div>
  )
})
