"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Building2,
  ExternalLink,
  Eye,
  Pencil,
  Trash2,
  MapPin,
  Phone,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Company } from "@/types/company"

interface CompanyMobileCardProps {
  comp: Company
  canEdit: boolean
  canDelete: boolean
  onDetail: (company: Company) => void
  onEdit: (company: Company) => void
  onDelete: (company: Company) => void
}

export function CompanyMobileCard({
  comp,
  canEdit,
  canDelete,
  onDetail,
  onEdit,
  onDelete,
}: CompanyMobileCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#16212D] p-4 shadow-xs space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-100 dark:bg-white/5">
            {comp.image_url ? (
              <Image src={comp.image_url} alt={comp.name} fill className="object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center text-slate-400">
                <Building2 className="size-6" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{comp.name}</h4>
            <p className="text-[11px] text-slate-400 truncate">{comp.slug}</p>
          </div>
        </div>

        {comp.status === "active" ? (
          <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Aktif
          </span>
        ) : (
          <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-slate-500/10 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400 border border-slate-500/20">
            Nonaktif
          </span>
        )}
      </div>

      {comp.departments && comp.departments.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-1">
          {comp.departments.map((d) => (
            <Badge
              key={d.id}
              variant="outline"
              className="text-[10px] px-1.5 py-0 rounded font-medium border-slate-200 dark:border-white/10"
              style={{
                borderColor: d.color ? `${d.color}60` : undefined,
                color: d.color || undefined,
              }}
            >
              {d.code}
            </Badge>
          ))}
        </div>
      )}

      <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-white/5">
        {comp.address && (
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="size-3.5 text-rose-500 shrink-0" />
            <span className="truncate">{comp.address}</span>
          </div>
        )}
        {comp.phone_number && (
          <div className="flex items-center gap-1.5 truncate">
            <Phone className="size-3.5 text-emerald-500 shrink-0" />
            <span>{comp.phone_number}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Users className="size-3.5 text-blue-500 shrink-0" />
          <span>{comp.member_count ?? 0} akun terdaftar</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5">
        <Button variant="outline" size="sm" asChild className="h-8 text-xs rounded-xl">
          <Link href={`/companies/${comp.slug}`} target="_blank">
            <ExternalLink className="size-3.5 mr-1" />
            Publik
          </Link>
        </Button>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDetail(comp)}
            className="h-8 px-2.5 text-xs rounded-xl"
          >
            <Eye className="size-3.5 mr-1" />
            Detail
          </Button>
          {canEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(comp)}
              className="h-8 px-2.5 text-xs rounded-xl text-amber-600 dark:text-amber-400"
            >
              <Pencil className="size-3.5 mr-1" />
              Edit
            </Button>
          )}
          {canDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(comp)}
              className="size-8 p-0 rounded-xl text-rose-600 dark:text-rose-400"
            >
              <Trash2 className="size-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
