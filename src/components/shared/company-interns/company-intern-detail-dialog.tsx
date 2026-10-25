"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { ExternalLink, BookOpen, UserCheck, Calendar } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { CompanyIntern } from "@/types/company"

interface CompanyInternDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  intern: CompanyIntern | null
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
}

export function CompanyInternDetailDialog({ open, onOpenChange, intern }: CompanyInternDetailDialogProps) {
  if (!intern) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-6 rounded-3xl border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#16212D]">
        <DialogHeader>
          <div className="flex items-center gap-3.5">
            <Avatar className="size-14 rounded-2xl border border-slate-200/80 dark:border-white/10 shrink-0">
              <AvatarImage src={intern.avatar_url || ""} alt={intern.name} />
              <AvatarFallback className="text-base font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                {getInitials(intern.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                  {intern.name}
                </DialogTitle>
                <Badge variant="secondary" className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border-none shrink-0">
                  Peserta PKL
                </Badge>
              </div>
              {intern.department && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Program Keahlian: <span className="font-semibold text-slate-700 dark:text-slate-200">{intern.department.code} - {intern.department.name}</span>
                </p>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Guru Pembimbing Info (Strictly public data only) */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-2.5">
              <UserCheck className="size-3.5 text-blue-500" />
              <span>Guru / Pembimbing PKL</span>
            </span>
            {intern.supervisor ? (
              <div className="flex items-center gap-3">
                <Avatar className="size-9 rounded-xl border border-slate-200/80 dark:border-white/10 shrink-0">
                  <AvatarImage src={intern.supervisor.avatar_url || ""} alt={intern.supervisor.name} />
                  <AvatarFallback className="text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    {getInitials(intern.supervisor.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h5 className="font-bold text-slate-900 dark:text-white truncate">{intern.supervisor.name}</h5>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {intern.supervisor.role_name || "Guru Pembimbing"}
                    {intern.supervisor.department ? ` • ${intern.supervisor.department.code}` : ""}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 italic">Belum ada akun guru pembimbing yang terikat.</p>
            )}
          </div>

          {/* Published Articles List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <BookOpen className="size-3.5 text-emerald-500" />
                <span>Karya &amp; Laporan PKL ({intern.articles.length})</span>
              </span>
            </div>

            {intern.articles.length > 0 ? (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {intern.articles.map((art) => (
                  <Link
                    key={art.id}
                    href={`/articles/${art.slug}`}
                    target="_blank"
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200/70 dark:border-white/10 hover:border-blue-500/30 hover:bg-muted/40 transition-all group"
                  >
                    <div className="relative size-11 rounded-lg overflow-hidden bg-slate-100 dark:bg-white/5 shrink-0 border border-slate-200/60 dark:border-white/5 flex items-center justify-center">
                      {art.cover_url ? (
                        <Image src={art.cover_url} alt={art.title} fill className="object-cover" />
                      ) : (
                        <BookOpen className="size-4 text-slate-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h6 className="font-medium text-xs text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {art.title}
                      </h6>
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-0.5">
                        <Calendar className="size-3" />
                        <span>
                          {art.published_at ? new Date(art.published_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "Terdokumentasi"}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="size-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-white/10 text-center text-slate-400">
                <p className="text-xs">Siswa ini belum mempublikasikan artikel kegiatan PKL.</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="pt-2 border-t border-slate-100 dark:border-white/5">
          <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)} className="rounded-xl h-8.5 text-xs w-full">
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
