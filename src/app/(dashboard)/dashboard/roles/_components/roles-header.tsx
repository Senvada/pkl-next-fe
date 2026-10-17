import * as React from "react"
import { ShieldCheck, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RolesHeaderProps {
  onStartCreate: () => void
  disabled?: boolean
}

export function RolesHeader({ onStartCreate, disabled }: RolesHeaderProps) {
  return (
    <div className="shrink-0 mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 sm:size-9 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
            <ShieldCheck className="size-4.5 sm:size-5" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
            Hak Akses &amp; Role
          </h1>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Kelola tingkatan role dan matriks izin aksi modul sistem secara terpusat dan fleksibel.
        </p>
      </div>

      <Button
        onClick={onStartCreate}
        disabled={disabled}
        className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer shadow-xs gap-1.5 text-xs h-8.5 sm:h-9 px-3.5 self-start sm:self-auto disabled:opacity-50"
      >
        <Plus className="size-4" />
        <span>Tambah Role Baru</span>
      </Button>
    </div>
  )
}
