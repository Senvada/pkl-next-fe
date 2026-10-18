"use client"

import * as React from "react"
import { Trash2, AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import type { Company } from "@/types/company"

interface CompanyDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  company: Company | null
  isDeleting: boolean
  onConfirm: () => void
}

export const CompanyDeleteDialog = React.memo(function CompanyDeleteDialog({
  open,
  onOpenChange,
  company,
  isDeleting,
  onConfirm,
}: CompanyDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#16212D] p-6 shadow-xl">
        <DialogHeader>
          <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400">
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-900/30">
              <Trash2 className="size-5" />
            </div>
            <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Hapus Mitra Industri?
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 pt-2 leading-relaxed">
            Apakah Anda yakin ingin menghapus data perusahaan mitra{" "}
            <strong className="text-slate-900 dark:text-white">
              &quot;{company?.name}&quot;
            </strong>
            ? Tindakan ini akan menonaktifkan profil perusahaan dan melepaskan seluruh pemetaan jurusan terkait.
          </DialogDescription>
        </DialogHeader>

        {company && (company.member_count ?? 0) > 0 && (
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200 text-xs">
            <AlertTriangle className="size-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div>
              <strong>Perhatian:</strong> Terdapat{" "}
              <strong>{company.member_count} akun pengguna/siswa</strong> yang terhubung ke perusahaan ini.
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 pt-3 border-t border-slate-100 dark:border-white/5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="rounded-xl h-9 text-xs border-slate-200 dark:border-white/10"
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-xl h-9 px-4 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white"
          >
            {isDeleting ? (
              <Loader2 className="size-3.5 mr-1.5 animate-spin" />
            ) : (
              <Trash2 className="size-3.5 mr-1.5" />
            )}
            {isDeleting ? "Menghapus..." : "Ya, Hapus Mitra"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})
