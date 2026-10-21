"use client"

import * as React from "react"
import { Server, RefreshCw, Layers, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SystemSettingsTabProps {
  onClearCache: () => void
}

export function SystemSettingsTab({ onClearCache }: SystemSettingsTabProps) {
  const [clearing, setClearing] = React.useState(false)

  const handleClear = () => {
    setClearing(true)
    setTimeout(() => {
      onClearCache()
      setClearing(false)
    }, 500)
  }

  return (
    <div className="space-y-6">
      {/* Status Infrastruktur Layanan */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border/60">
          <Server className="size-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-sm sm:text-base font-bold text-foreground">
            Status Konektivitas & Infrastruktur
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-xl border border-border/60 bg-muted/20 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">Backend API</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-3" /> Online
              </span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Golang Fiber Engine (Port 3001)</div>
          </div>

          <div className="p-4 rounded-xl border border-border/60 bg-muted/20 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">Basis Data</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-3" /> Sehat
              </span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">PostgreSQL 17.6 (pkl_staging)</div>
          </div>

          <div className="p-4 rounded-xl border border-border/60 bg-muted/20 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">Cloud Storage</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-3" /> Siap
              </span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Supabase Storage S3 (pkl-assets)</div>
          </div>
        </div>
      </div>

      {/* Informasi Master Data & Versi */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border/60">
          <Layers className="size-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-sm sm:text-base font-bold text-foreground">
            Metadata Master & Versi Build
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-muted-foreground">Total Jurusan Tersinkron:</span>
            <p className="font-semibold text-foreground">11 Jurusan Kejuruan (RPL, TKJ, SIJA, DPIB, TPM, TKR, TITL, TAB, OTO, KJIJ, DKV)</p>
          </div>

          <div className="space-y-1">
            <span className="text-muted-foreground">Framework & Renderer:</span>
            <p className="font-semibold text-foreground">Next.js 16.2.9 (Turbopack SSR / Client Hybrid)</p>
          </div>

          <div className="space-y-1">
            <span className="text-muted-foreground">Lingkungan Sistem (Environment):</span>
            <p className="font-semibold text-foreground">Staging / Development (SMKN 6 Malang)</p>
          </div>

          <div className="space-y-1">
            <span className="text-muted-foreground">Protokol Keamanan:</span>
            <p className="font-semibold text-foreground">JWT Access Token + HTTPOnly Refresh Cookie</p>
          </div>
        </div>
      </div>

      {/* Pemeliharaan Cache */}
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-rose-700 dark:text-rose-400">
            Penyegaran Cache Klien
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Bersihkan cache browser lokal dan refresh state konfigurasi dashboard.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleClear}
          disabled={clearing}
          className="rounded-xl border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 text-xs font-semibold gap-2 w-fit cursor-pointer"
        >
          <RefreshCw className={`size-3.5 ${clearing ? "animate-spin" : ""}`} />
          <span>{clearing ? "Membersihkan..." : "Bersihkan Cache"}</span>
        </Button>
      </div>
    </div>
  )
}
