"use client"

import * as React from "react"
import Image from "next/image"
import { Building2, Eye, MapPin, Users, Loader2 } from "lucide-react"
import type { Department } from "@/types/department"

interface CompanyCardLivePreviewProps {
  name: string
  description: string
  address: string
  status: "active" | "inactive"
  imageUrl: string
  selectedDepts: Department[]
  isUploading: boolean
}

export function CompanyCardLivePreview({
  name,
  description,
  address,
  status,
  imageUrl,
  selectedDepts,
  isUploading,
}: CompanyCardLivePreviewProps) {
  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-1.5">
          <Eye className="size-3.5 text-blue-500" />
          <span>Pratinjau Kartu Thumbnail (Live Preview)</span>
        </div>
        <span className="text-[10px] font-normal text-slate-400">
          Rasio 16:9 • Tampilan di Beranda &amp; Direktori
        </span>
      </div>

      <div className="w-full max-w-sm rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#16212D] overflow-hidden shadow-sm transition-all">
        {/* Card Banner 16:9 */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          {imageUrl ? (
            <>
              <Image
                src={imageUrl}
                alt={name.trim() || "Preview"}
                fill
                unoptimized
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 p-4 text-center">
              <Building2 className="size-10 mb-1 opacity-40" />
              <span className="text-[11px] font-medium">Belum ada foto thumbnail (16:9)</span>
              <span className="text-[10px] text-slate-400/80">
                Klik &apos;Unggah &amp; Potong Gambar&apos; untuk menambahkan
              </span>
            </div>
          )}

          {/* Uploading Overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center gap-2 text-white z-20">
              <Loader2 className="size-6 animate-spin text-blue-400" />
              <span className="text-xs font-medium">Mengunggah ke Storage...</span>
            </div>
          )}

          {/* Status Pill on Preview */}
          <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 rounded-full bg-black/65 px-2 py-0.5 text-[10px] font-semibold backdrop-blur-md">
            <span className={`size-1.5 rounded-full ${status === "active" ? "bg-emerald-400 animate-pulse" : "bg-slate-400"}`} />
            <span className={status === "active" ? "text-emerald-400" : "text-slate-300"}>
              {status === "active" ? "Mitra Aktif" : "Nonaktif"}
            </span>
          </div>

          {/* Department Count Pill on Preview */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="rounded-md bg-blue-600/90 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
              {selectedDepts.length > 0 ? `${selectedDepts.length} Jurusan` : "Semua Jurusan"}
            </span>
          </div>
        </div>

        {/* Card Body on Preview */}
        <div className="p-3.5 space-y-2">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
              {name.trim() || "Nama Perusahaan / Mitra Industri"}
            </h4>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
              {description.trim() || "Jelaskan profil perusahaan, lingkungan kerja, dan kesempatan belajar bagi siswa PKL..."}
            </p>
          </div>

          {/* Department Badges */}
          <div className="flex flex-wrap gap-1 pt-1">
            {selectedDepts.length > 0 ? (
              <>
                {selectedDepts.slice(0, 3).map((dept) => (
                  <span key={dept.id} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    {dept.code}
                  </span>
                ))}
                {selectedDepts.length > 3 && (
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-500">
                    +{selectedDepts.length - 3} lainnya
                  </span>
                )}
              </>
            ) : (
              <span className="text-[10px] text-slate-400 italic">Belum ada jurusan yang dipilih</span>
            )}
          </div>

          {/* Card Footer (Strictly Neutral - No Reviews) */}
          <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1 truncate max-w-[200px]">
              <MapPin className="size-3 text-rose-500 shrink-0" />
              <span className="truncate">{address.trim() || "Malang, Jawa Timur"}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
              <Users className="size-3 shrink-0" />
              <span>Terbuka PKL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
