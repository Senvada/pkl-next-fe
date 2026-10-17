import * as React from "react"
import { AlertTriangle } from "lucide-react"
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

interface RoleUnsavedDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isCreatingNew: boolean
  selectedRole: Role | null
  onConfirmDiscard: () => void
  onCancelDiscard: () => void
}

export const RoleUnsavedDialog = React.memo(function RoleUnsavedDialog({
  open,
  onOpenChange,
  isCreatingNew,
  selectedRole,
  onConfirmDiscard,
  onCancelDiscard,
}: RoleUnsavedDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl shadow-none">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="size-5 shrink-0" />
            <span>Perubahan Belum Disimpan</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground pt-1 leading-relaxed">
            {isCreatingNew
              ? "Anda sedang membuat role baru yang belum disimpan. Jika berpindah sekarang, data yang telah diisi akan dibuang."
              : `Anda memiliki perubahan pada role "${selectedRole?.name || "ini"}" yang belum disimpan. Jika berpindah sekarang, semua perubahan yang belum disimpan akan hilang.`}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancelDiscard}
            className="rounded-xl h-9 text-xs cursor-pointer"
          >
            Tetap di Sini
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onConfirmDiscard}
            className="rounded-xl h-9 text-xs cursor-pointer bg-amber-600 hover:bg-amber-700 text-white"
          >
            Buang Perubahan &amp; Lanjut
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})
