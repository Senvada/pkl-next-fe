"use client"

import * as React from "react"
import { UserCheck, BookOpen, GraduationCap, ChevronRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { CompanyIntern } from "@/types/company"

interface CompanyInternCardProps {
  intern: CompanyIntern
  onSelect: (intern: CompanyIntern) => void
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
}

export function CompanyInternCard({ intern, onSelect }: CompanyInternCardProps) {
  return (
    <div
      onClick={() => onSelect(intern)}
      className="group relative flex flex-col justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#16212D] hover:border-blue-500/40 hover:shadow-lg transition-all duration-200 cursor-pointer text-left"
    >
      <div className="flex items-start gap-3">
        <Avatar className="size-11 border border-slate-200/80 dark:border-white/10 shrink-0">
          <AvatarImage src={intern.avatar_url || ""} alt={intern.name} />
          <AvatarFallback className="text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
            {getInitials(intern.name)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {intern.name}
            </h4>
            <ChevronRight className="size-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>

          {intern.department ? (
            <div className="mt-1 flex items-center gap-1.5 text-xs">
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0.5 font-semibold rounded-md border-transparent"
                style={{
                  backgroundColor: `${intern.department.color || "#3B82F6"}18`,
                  color: intern.department.color || "#3B82F6",
                }}
              >
                <GraduationCap className="size-3 mr-1" />
                {intern.department.code}
              </Badge>
            </div>
          ) : (
            <span className="text-[11px] text-muted-foreground block mt-0.5">Siswa PKL</span>
          )}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1 truncate max-w-[65%]">
          <UserCheck className="size-3.5 text-blue-500 shrink-0" />
          <span className="truncate">
            {intern.supervisor?.name ? `Pembimbing: ${intern.supervisor.name}` : "Belum ada pembimbing"}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0 font-medium text-emerald-600 dark:text-emerald-400">
          <BookOpen className="size-3" />
          <span>{intern.articles.length} Karya</span>
        </div>
      </div>
    </div>
  )
}
