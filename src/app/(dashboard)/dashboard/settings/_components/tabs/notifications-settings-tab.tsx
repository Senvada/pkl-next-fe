"use client"

import * as React from "react"
import type { NotificationSettings } from "@/types/settings"
import { Building2, UserCheck } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface NotificationsSettingsTabProps {
  data: NotificationSettings
  onChange: (patch: Partial<NotificationSettings>) => void
}

export function NotificationsSettingsTab({ data, onChange }: NotificationsSettingsTabProps) {
  return (
    <div className="space-y-6">
      {/* Notifikasi Siswa */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border/60">
          <UserCheck className="size-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-sm sm:text-base font-bold text-foreground">
            Notifikasi untuk Peserta Didik
          </h2>
        </div>

        <div className="space-y-3.5">
          <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-border/60 bg-muted/20">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-foreground">
                Email Perubahan Status Lamaran
              </p>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                Kirim email otomatis ke siswa saat lamarannya disetujui, ditolak, atau dijadwalkan wawancara.
              </p>
            </div>
            <Switch
              checked={data.emailOnStatusChange}
              onCheckedChange={(checked) => onChange({ emailOnStatusChange: checked })}
            />
          </div>

          <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-border/60 bg-muted/20">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-foreground">
                Pengingat Otomatis Pengisian Jurnal Harian
              </p>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                Kirim notifikasi setiap pukul 17:00 WIB jika siswa belum mengunggah logbook kegiatan hari ini.
              </p>
            </div>
            <Switch
              checked={data.dailyLogbookReminder}
              onCheckedChange={(checked) => onChange({ dailyLogbookReminder: checked })}
            />
          </div>
        </div>
      </div>

      {/* Notifikasi Industri & Pembimbing */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border/60">
          <Building2 className="size-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-sm sm:text-base font-bold text-foreground">
            Notifikasi untuk Mitra Industri & Guru Pembimbing
          </h2>
        </div>

        <div className="space-y-3.5">
          <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-border/60 bg-muted/20">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-foreground">
                Pemberitahuan Pelamar Baru ke Mentor Industri
              </p>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                Kirim email ke kontak HR / Pembimbing Industri saat ada siswa baru yang mengajukan penempatan.
              </p>
            </div>
            <Switch
              checked={data.emailToCompanyNewApplicant}
              onCheckedChange={(checked) => onChange({ emailToCompanyNewApplicant: checked })}
            />
          </div>

          <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-border/60 bg-muted/20">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-foreground">
                Peringatan Kuota Perusahaan Menipis
              </p>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                Beri tanda peringatan di dashboard saat kuota tersisa kurang dari 2 siswa.
              </p>
            </div>
            <Switch
              checked={data.lowQuotaAlert}
              onCheckedChange={(checked) => onChange({ lowQuotaAlert: checked })}
            />
          </div>

          <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-border/60 bg-muted/20">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-foreground">
                Rekap Mingguan Progres PKL ke Pembimbing Sekolah
              </p>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                Kirim rekap mingguan aktivitas bimbingan dan daftar siswa yang butuh penanganan khusus.
              </p>
            </div>
            <Switch
              checked={data.weeklyReportSummary}
              onCheckedChange={(checked) => onChange({ weeklyReportSummary: checked })}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
