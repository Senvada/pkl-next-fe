"use client";

import { Company } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import {
  Users,
  Mail,
  Phone,
  Building2,
  ExternalLink,
  MapPin,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";

export default function CompanySidebar({ company }: { company: Company }) {
  const [applied, setApplied] = useState(false);

  return (
    <div className="space-y-6">
      {/* Quota & Apply Card */}
      <div className="rounded-3xl border border-blue-500/20 bg-linear-to-b from-blue-50/80 via-white to-white dark:from-[#1C2735] dark:to-[#141C26] p-6 shadow-sm dark:shadow-xl space-y-5">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Status Penerimaan PKL
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {company.openQuota}{" "}
              <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                / {company.totalQuota} kuota
              </span>
            </div>
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Lowongan Terbuka
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full bg-linear-to-r from-blue-500 to-emerald-400 rounded-full"
              style={{
                width: `${((company.totalQuota - company.openQuota) / company.totalQuota) * 100}%`,
              }}
            />
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 text-right">
            {company.totalQuota - company.openQuota} siswa sudah terverifikasi
          </p>
        </div>

        <Button
          onClick={() => setApplied(true)}
          disabled={applied}
          size="lg"
          className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
        >
          {applied ? (
            <span className="flex items-center gap-2">
              <CheckCircle className="size-4" /> Pengajuan Terkirim
            </span>
          ) : (
            "Daftar PKL di Perusahaan Ini"
          )}
        </Button>

        {applied && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 text-center bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
            Pengajuan simulasi berhasil! Di versi live, form pengajuan akan langsung terhubung ke Pokja Hubin & Mentor Industri.
          </p>
        )}
      </div>

      {/* Contact & Location Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-[#16212D] p-6 shadow-sm dark:shadow-xl space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Kontak Resmi Perusahaan
        </h4>

        <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5">
            <Mail className="size-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Email Koordinator</p>
              <p className="font-semibold truncate">{company.contactEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5">
            <Phone className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Telepon / WhatsApp HR</p>
              <p className="font-semibold truncate">{company.contactPhone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5">
            <MapPin className="size-4 text-rose-500 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Lokasi Kantor</p>
              <p className="font-medium text-xs leading-relaxed">{company.address}</p>
            </div>
          </div>
        </div>

        <a
          href={`https://maps.google.com/?q=${company.lat},${company.lng}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-semibold text-slate-700 dark:text-white transition"
        >
          <MapPin className="size-3.5 text-blue-600 dark:text-blue-400" />
          Buka Petunjuk Arah Google Maps <ExternalLink className="size-3" />
        </a>
      </div>
    </div>
  );
}
