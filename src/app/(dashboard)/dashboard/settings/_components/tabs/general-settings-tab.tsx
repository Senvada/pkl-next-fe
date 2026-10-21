"use client"

import * as React from "react"
import type { GeneralSettings } from "@/types/settings"
import { School, Calendar, Mail, Phone, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"

interface GeneralSettingsTabProps {
  data: GeneralSettings
  onChange: (patch: Partial<GeneralSettings>) => void
}

export function GeneralSettingsTab({ data, onChange }: GeneralSettingsTabProps) {
  return (
    <div className="space-y-6">
      {/* Profil Instansi */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border/60">
          <School className="size-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-sm sm:text-base font-bold text-foreground">
            Identitas Sekolah & Unit Hubin
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-foreground">Nama Sekolah</label>
            <Input
              value={data.schoolName}
              onChange={(e) => onChange({ schoolName: e.target.value })}
              className="h-10 text-xs sm:text-sm rounded-xl"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-foreground">Status Keunggulan</label>
            <Input
              value={data.schoolLevel}
              onChange={(e) => onChange({ schoolLevel: e.target.value })}
              className="h-10 text-xs sm:text-sm rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Mail className="size-3.5 text-muted-foreground" /> Email Resmi Pokja Hubin
            </label>
            <Input
              type="email"
              value={data.hubinEmail}
              onChange={(e) => onChange({ hubinEmail: e.target.value })}
              className="h-10 text-xs sm:text-sm rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Phone className="size-3.5 text-muted-foreground" /> Kontak WhatsApp / Hotline
            </label>
            <Input
              value={data.hubinPhone}
              onChange={(e) => onChange({ hubinPhone: e.target.value })}
              className="h-10 text-xs sm:text-sm rounded-xl"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <MapPin className="size-3.5 text-muted-foreground" /> Alamat Lengkap Kampus
            </label>
            <Input
              value={data.schoolAddress}
              onChange={(e) => onChange({ schoolAddress: e.target.value })}
              className="h-10 text-xs sm:text-sm rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Periode Akademik PKL */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border/60">
          <Calendar className="size-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-sm sm:text-base font-bold text-foreground">
            Periode & Tahun Ajaran PKL
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Tahun Ajaran</label>
            <Input
              value={data.academicYear}
              onChange={(e) => onChange({ academicYear: e.target.value })}
              placeholder="e.g. 2025/2026"
              className="h-10 text-xs sm:text-sm rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Gelombang / Semester</label>
            <Input
              value={data.periodTerm}
              onChange={(e) => onChange({ periodTerm: e.target.value })}
              placeholder="e.g. Semester Ganjil"
              className="h-10 text-xs sm:text-sm rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Durasi Standar (Bulan)</label>
            <Input
              type="number"
              min={1}
              max={12}
              value={data.durationMonths}
              onChange={(e) => onChange({ durationMonths: Number(e.target.value) || 6 })}
              className="h-10 text-xs sm:text-sm rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Tanggal Mulai PKL</label>
            <Input
              type="date"
              value={data.startDate}
              onChange={(e) => onChange({ startDate: e.target.value })}
              className="h-10 text-xs sm:text-sm rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Tanggal Selesai PKL</label>
            <Input
              type="date"
              value={data.endDate}
              onChange={(e) => onChange({ endDate: e.target.value })}
              className="h-10 text-xs sm:text-sm rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
