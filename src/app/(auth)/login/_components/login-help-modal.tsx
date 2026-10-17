import * as React from "react"
import Link from "next/link"
import { HelpCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LoginHelpModalProps {
  open: boolean
  onClose: () => void
}

export function LoginHelpModal({ open, onClose }: LoginHelpModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#16212D] text-slate-900 dark:text-white space-y-4 animate-in zoom-in-95 duration-150 will-change-transform">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-base">
            <HelpCircle className="size-5 text-blue-600 dark:text-blue-400" />
            <span>Bantuan Reset Kata Sandi</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Untuk menjaga integritas dan keamanan data PKL SMKN 6 Malang, permohonan reset sandi akun siswa maupun pembimbing dilakukan secara terverifikasi melalui Tim Hubungan Industri (Hubin).
        </p>
        <div className="rounded-2xl bg-slate-50 dark:bg-white/5 p-3.5 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
          <p className="font-semibold text-slate-800 dark:text-white">Langkah yang dapat dilakukan:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Hubungi guru pembimbing PKL jurusan Anda.</li>
            <li>Atau kirim pesan ke Tim Hubin melalui halaman Kontak.</li>
            <li>Admin akan memverifikasi identitas Anda sebelum mengatur ulang sandi.</li>
          </ul>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-xl border-slate-200 dark:border-white/10"
          >
            Mengerti
          </Button>
          <Button
            asChild
            size="sm"
            className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white"
          >
            <Link href="/contact">Halaman Kontak</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
