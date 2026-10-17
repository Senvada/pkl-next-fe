import * as React from "react"
import { Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import type { Role } from "@/types/role"

interface RoleDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: Role | null
  isDeleting: boolean
  onConfirm: () => void
}

export function RoleDeleteDialog({
  open,
  onOpenChange,
  role,
  isDeleting,
  onConfirm,
}: RoleDeleteDialogProps) {
  const activeCount = role?.user_count || 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="size-5 shrink-0" />
            <span>Hapus Role &quot;{role?.name}&quot;?</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground pt-1">
            Apakah Anda yakin ingin menghapus role ini? Role yang dihapus tidak akan dapat
            diberikan lagi kepada pengguna baru.
          </DialogDescription>
        </DialogHeader>

        {role && activeCount > 0 && (
          <div className="p-3 text-xs rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200">
            Perhatian: Role ini saat ini masih terikat dengan{" "}
            <strong>{activeCount} pengguna aktif</strong>. Anda harus mengubah role pengguna tersebut terlebih dahulu sebelum dapat menghapusnya.
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="rounded-xl h-9 text-xs cursor-pointer"
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            disabled={isDeleting || activeCount > 0}
            className="rounded-xl h-9 text-xs cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-3.5 animate-spin mr-1.5" />
                <span>Menghapus...</span>
              </>
            ) : (
              "Ya, Hapus Role"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
