"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Article } from "@/types/article";

interface ArticleDeleteModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export default function ArticleDeleteModal({
  article,
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: ArticleDeleteModalProps) {
  if (!article) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-2xl p-6">
        <DialogHeader className="space-y-2">
          <div className="size-10 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-1">
            <AlertTriangle className="size-5" />
          </div>
          <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
            Hapus Artikel?
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Apakah Anda yakin ingin menghapus artikel{" "}
            <strong className="text-slate-800 dark:text-slate-200">
              &quot;{article.title}&quot;
            </strong>
            ? Tindakan ini akan menghapus draf dan membersihkan foto cover dari penyimpanan.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl text-xs"
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-xl text-xs gap-1.5 bg-rose-600 hover:bg-rose-700"
          >
            {isDeleting && <Loader2 className="size-3.5 animate-spin" />}
            Hapus Artikel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
