"use client"

import * as React from "react"
import type { RulesSettings } from "@/types/settings"
import { ShieldCheck, BookOpen } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"

interface RulesSettingsTabProps {
  data: RulesSettings
  onChange: (patch: Partial<RulesSettings>) => void
}

export function RulesSettingsTab({ data, onChange }: RulesSettingsTabProps) {
  return (
    <div className="space-y-6">
      {/* Ketentuan Pendaftaran Siswa */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border/60">
          <ShieldCheck className="size-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-sm sm:text-base font-bold text-foreground">
            Ketentuan & Validasi Pengajuan PKL
          </h2>
        </div>

        <div className="space-y-3.5">
          <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border/60 bg-muted/20">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-foreground">Buka Gerbang Pendaftaran Pengajuan</p>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">Izinkan siswa untuk mengajukan permohonan magang ke mitra industri.</p>
            </div>
            <Switch
              checked={data.isOpenRegistration}
              onCheckedChange={(checked) => onChange({ isOpenRegistration: checked })}
            />
          </div>

          <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border/60 bg-muted/20">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-foreground">Wajib Unggah CV Digital</p>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">Siswa diwajibkan melampirkan berkas Curriculum Vitae (PDF) saat melamar.</p>
            </div>
            <Switch
              checked={data.requireCvUpload}
              onCheckedChange={(checked) => onChange({ requireCvUpload: checked })}
            />
          </div>

          <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border/60 bg-muted/20">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-foreground">Wajib Tautan Portofolio Proyek</p>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">Mewajibkan siswa melampirkan URL karya atau proyek (GitHub, Behance, dsb).</p>
            </div>
            <Switch
              checked={data.requirePortfolio}
              onCheckedChange={(checked) => onChange({ requirePortfolio: checked })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Batas Maksimal Pengajuan Per Siswa</label>
              <Input
                type="number"
                min={1}
                max={5}
                value={data.maxApplicationsPerStudent}
                onChange={(e) => onChange({ maxApplicationsPerStudent: Number(e.target.value) || 1 })}
                className="h-10 text-xs sm:text-sm rounded-xl"
              />
              <span className="text-[11px] text-muted-foreground">Maksimal 5 perusahaan aktif per siswa.</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Mekanisme Verifikasi Lamaran</label>
              <select
                value={data.approvalType}
                onChange={(e) => onChange({ approvalType: e.target.value as "manual" | "auto" })}
                className="h-10 w-full px-3 rounded-xl border border-border/80 bg-background text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="manual">Kurasi Manual oleh Pokja Hubin & Perusahaan</option>
                <option value="auto">Verifikasi Otomatis (Jika Kuota Tersedia)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Ketentuan Jurnal Harian */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border/60">
          <BookOpen className="size-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-sm sm:text-base font-bold text-foreground">
            Standar Pengisian Jurnal & Logbook Harian
          </h2>
        </div>

        <div className="space-y-3.5">
          <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border/60 bg-muted/20">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-foreground">Wajib Isi Logbook Setiap Hari Kerja</p>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">Peserta magang harus mencatat uraian tugas dan presensi harian untuk dinilai guru pembimbing.</p>
            </div>
            <Switch
              checked={data.requireDailyLogbook}
              onCheckedChange={(checked) => onChange({ requireDailyLogbook: checked })}
            />
          </div>

          <div className="space-y-1.5 max-w-sm">
            <label className="text-xs font-semibold text-foreground">Batas Waktu Toleransi Pengisian (Jam)</label>
            <Input
              type="number"
              min={12}
              max={72}
              value={data.logbookGracePeriodHours}
              onChange={(e) => onChange({ logbookGracePeriodHours: Number(e.target.value) || 24 })}
              className="h-10 text-xs sm:text-sm rounded-xl"
            />
            <span className="text-[11px] text-muted-foreground">Logbook terkunci jika tidak diisi dalam {data.logbookGracePeriodHours} jam sejak jam kerja berakhir.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
