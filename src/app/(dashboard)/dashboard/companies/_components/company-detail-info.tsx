"use client"

import * as React from "react"
import { MapPin, Mail, Phone, Globe, Users, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Company } from "@/types/company"

interface CompanyDetailInfoProps {
  company: Company
}

export function CompanyDetailInfo({ company }: CompanyDetailInfoProps) {
  const formattedCreated = company.created_at
    ? new Date(company.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-"

  const formattedUpdated = company.updated_at
    ? new Date(company.updated_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-"

  return (
    <div className="space-y-4 pt-2 text-xs">
      {/* Description */}
      {company.description && (
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
          <h5 className="font-semibold text-slate-900 dark:text-white mb-1">Tentang Industri</h5>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
            {company.description}
          </p>
        </div>
      )}

      {/* Accepted Departments */}
      <div className="space-y-1.5">
        <h5 className="font-semibold text-slate-900 dark:text-white">Jurusan yang Diterima</h5>
        {company.departments && company.departments.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {company.departments.map((dept) => (
              <Badge
                key={dept.id}
                variant="outline"
                className="text-xs px-2.5 py-1 rounded-lg border-slate-200 dark:border-white/10 font-semibold"
                style={{
                  borderColor: dept.color ? `${dept.color}60` : undefined,
                  color: dept.color || undefined,
                  backgroundColor: dept.color ? `${dept.color}15` : undefined,
                }}
              >
                {dept.name} ({dept.code})
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 italic">Belum ada jurusan yang dipetakan ke perusahaan ini.</p>
        )}
      </div>

      {/* Contact and Location details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-white/5">
        <div className="space-y-1">
          <span className="text-[11px] text-slate-400">Email Resmi</span>
          <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-medium">
            <Mail className="size-3.5 text-blue-500 shrink-0" />
            <span className="truncate">{company.email || "-"}</span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] text-slate-400">No. Telepon / WhatsApp</span>
          <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-medium">
            <Phone className="size-3.5 text-emerald-500 shrink-0" />
            <span>{company.phone_number || "-"}</span>
          </div>
        </div>

        <div className="space-y-1 sm:col-span-2">
          <span className="text-[11px] text-slate-400">Alamat Perusahaan</span>
          <div className="flex items-start gap-1.5 text-slate-800 dark:text-slate-200 font-medium">
            <MapPin className="size-3.5 text-rose-500 shrink-0 mt-0.5" />
            <span>{company.address || "-"}</span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] text-slate-400">Koordinat Peta</span>
          <div className="text-slate-700 dark:text-slate-300 font-mono text-[11px]">
            {company.lat != null && company.lng != null ? `${company.lat}, ${company.lng}` : "Belum disetel"}
          </div>
        </div>

        {company.gmaps_link && (
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400">Tautan Peta</span>
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
              <Globe className="size-3.5 shrink-0" />
              <a
                href={company.gmaps_link}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate hover:underline text-[11px]"
              >
                Buka Google Maps
              </a>
            </div>
          </div>
        )}

        <div className="space-y-1">
          <span className="text-[11px] text-slate-400">Total Akun Terhubung</span>
          <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-medium">
            <Users className="size-3.5 text-purple-500" />
            <span>{company.member_count ?? 0} akun pengguna</span>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-white/5 text-[11px] text-slate-400">
        <div className="flex items-center gap-1">
          <Calendar className="size-3" />
          <span>Dibuat: {formattedCreated}</span>
        </div>
        <div>
          <span>Terakhir diubah: {formattedUpdated}</span>
        </div>
      </div>
    </div>
  )
}
