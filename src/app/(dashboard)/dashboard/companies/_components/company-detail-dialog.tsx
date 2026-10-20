"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Building2, ExternalLink } from "lucide-react"
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
import { CompanyDetailInfo } from "./company-detail-info"

interface CompanyDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  company: Company | null
}

export function CompanyDetailDialog({
  open,
  onOpenChange,
  company,
}: CompanyDetailDialogProps) {
  if (!company) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto p-6 rounded-3xl border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#16212D]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="relative size-14 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-white/10 bg-slate-100 dark:bg-white/5 shrink-0 flex items-center justify-center">
              {company.image_url ? (
                <Image src={company.image_url} alt={company.name} fill className="object-cover" />
              ) : (
                <Building2 className="size-7 text-slate-400" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                  {company.name}
                </DialogTitle>
                {company.status === "active" ? (
                  <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Aktif
                  </span>
                ) : (
                  <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-slate-500/10 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400 border border-slate-500/20">
                    Nonaktif
                  </span>
                )}
              </div>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                /companies/{company.slug}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <CompanyDetailInfo company={company} />

        <DialogFooter className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between sm:justify-between w-full">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-8.5 rounded-xl text-xs text-blue-600 dark:text-blue-400 border-slate-200 dark:border-white/10"
          >
            <Link href={`/companies/${company.slug}`} target="_blank">
              <ExternalLink className="size-3.5 mr-1.5" />
              Halaman Publik
            </Link>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8.5 rounded-xl text-xs"
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
