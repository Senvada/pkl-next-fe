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
  Mail,
  Phone,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Company } from "@/types/company"

interface CompanyTableRowProps {
  comp: Company
  canEdit: boolean
  canDelete: boolean
  onDetail: (company: Company) => void
  onEdit: (company: Company) => void
  onDelete: (company: Company) => void
}

export function CompanyTableRow({
  comp,
  canEdit,
  canDelete,
  onDetail,
  onEdit,
  onDelete,
}: CompanyTableRowProps) {
  return (
    <tr className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
      {/* Perusahaan Info */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-100 dark:bg-white/5">
            {comp.image_url ? (
              <Image src={comp.image_url} alt={comp.name} fill className="object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center text-slate-400">
                <Building2 className="size-5" />
              </div>
            )}
          </div>
          <div className="min-w-0 max-w-xs">
            <div className="font-semibold text-slate-900 dark:text-white truncate">{comp.name}</div>
            <div className="text-[11px] text-slate-400 truncate">slug: {comp.slug}</div>
          </div>
        </div>
      </td>

      {/* Jurusan */}
      <td className="px-4 py-3.5 max-w-xs">
        {comp.departments && comp.departments.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {comp.departments.map((d) => (
              <Badge
                key={d.id}
                variant="outline"
                className="text-[10px] px-1.5 py-0 rounded font-medium border-slate-200 dark:border-white/10"
                style={{ borderColor: d.color ? `${d.color}60` : undefined, color: d.color || undefined }}
              >
                {d.code}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-[11px] text-slate-400 italic">Belum dipetakan</span>
        )}
      </td>

      {/* Kontak & Alamat */}
      <td className="px-4 py-3.5 max-w-xs">
        <div className="space-y-1 text-[11px]">
          {comp.address && (
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 truncate">
              <MapPin className="size-3 text-rose-500 shrink-0" /><span className="truncate">{comp.address}</span>
            </div>
          )}
          {comp.phone_number && (
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 truncate">
              <Phone className="size-3 text-emerald-500 shrink-0" /><span>{comp.phone_number}</span>
            </div>
          )}
          {comp.email && (
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 truncate">
              <Mail className="size-3 text-blue-500 shrink-0" /><span className="truncate">{comp.email}</span>
            </div>
          )}
          {!comp.address && !comp.phone_number && !comp.email && (
            <span className="text-slate-400 italic">Tidak ada kontak</span>
          )}
        </div>
      </td>

      {/* Anggota */}
      <td className="px-4 py-3.5 text-center">
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-[11px] font-medium text-slate-700 dark:text-slate-300">
          <Users className="size-3 text-slate-500" />
          <span>{comp.member_count ?? 0}</span>
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-3.5 text-center">
        {comp.status === "active" ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />Aktif
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/10 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 border border-slate-500/20">
            Nonaktif
          </span>
        )}
      </td>

      {/* Aksi */}
      <td className="px-4 py-3.5 text-right">
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => onDetail(comp)} className="size-8 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10" title="Lihat Detail Profil">
            <Eye className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" asChild className="size-8 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20" title="Halaman Publik Siswa">
            <Link href={`/companies/${comp.slug}`} target="_blank"><ExternalLink className="size-4" /></Link>
          </Button>
          {canEdit && (
            <Button variant="ghost" size="icon" onClick={() => onEdit(comp)} className="size-8 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20" title="Edit Data Mitra">
              <Pencil className="size-4" />
            </Button>
          )}
          {canDelete && (
            <Button variant="ghost" size="icon" onClick={() => onDelete(comp)} className="size-8 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20" title="Hapus Perusahaan">
              <Trash2 className="size-4" />
            </Button>
          )}
        </div>
      </td>
    </tr>
  )
}
