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
import type { UserItem } from "@/types/user"

interface UserDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserItem | null
  isDeleting: boolean
  onConfirm: () => void
}

export const UserDeleteDialog = React.memo(function UserDeleteDialog({
  open,
  onOpenChange,
  user,
  isDeleting,
  onConfirm,
}: UserDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl shadow-none">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="size-5 shrink-0" />
            <span>Hapus Pengguna &quot;{user?.name}&quot;?</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground pt-1 leading-relaxed">
            Apakah Anda yakin ingin menghapus akun pengguna ini? Akun yang dihapus akan dinonaktifkan dari sistem.
          </DialogDescription>
        </DialogHeader>

        {user && user.sub_user_count > 0 && (
          <div className="p-3 text-xs rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200">
            Perhatian: Pengguna ini adalah akun pembimbing yang memiliki{" "}
            <strong>{user.sub_user_count} sub-akun siswa</strong> di bawahnya.
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
            disabled={isDeleting}
            className="rounded-xl h-9 text-xs cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-3.5 animate-spin mr-1.5" />
                <span>Menghapus...</span>
              </>
            ) : (
              "Ya, Hapus Pengguna"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})
