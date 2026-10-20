"use client"

import * as React from "react"
import { MapPin, Globe, Sparkles, Loader2, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormDrawerSection } from "@/components/shared/form-drawer"

interface CompanyLocationSectionProps {
  gmapsLink: string
  setGmapsLink: (v: string) => void
  lat: string
  setLat: (v: string) => void
  lng: string
  setLng: (v: string) => void
  isResolving: boolean
  lastResolvedLink: string
  resolveNotice: { type: "success" | "error"; message: string } | null
  onResolveMaps: () => void
}

export function CompanyLocationSection({
  gmapsLink,
  setGmapsLink,
  lat,
  setLat,
  lng,
  setLng,
  isResolving,
  lastResolvedLink,
  resolveNotice,
  onResolveMaps,
}: CompanyLocationSectionProps) {
  const isResolvedForCurrentLink = Boolean(
    lat && lng && gmapsLink.trim() && lastResolvedLink === gmapsLink.trim()
  )

  return (
    <FormDrawerSection
      step={3}
      title="Koordinat & Peta Lokasi"
      description="Koordinat latitude & longitude untuk plot otomatis di peta interaktif Leaflet sekolah."
    >
      {/* Tautan Google Maps + Auto Resolve Button */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Globe className="size-3.5 text-blue-500" />
            <span>Tautan Google Maps / Shortlink</span>
          </label>
          <span className="text-[10px] text-slate-400">
            Mendukung maps.app.goo.gl &amp; google.com/maps
          </span>
        </div>

        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="https://maps.app.goo.gl/... atau https://www.google.com/maps/place/..."
            value={gmapsLink}
            onChange={(e) => setGmapsLink(e.target.value)}
            className="h-9.5 text-xs rounded-xl flex-1 font-mono"
          />
          <Button
            type="button"
            variant={isResolvedForCurrentLink ? "outline" : "default"}
            size="sm"
            disabled={isResolving || !gmapsLink.trim()}
            onClick={onResolveMaps}
            className={`h-9.5 px-3.5 text-xs rounded-xl shrink-0 cursor-pointer transition-all shadow-xs ${
              isResolvedForCurrentLink
                ? "border-emerald-500/40 bg-emerald-50/50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isResolving ? (
              <><Loader2 className="size-3.5 mr-1.5 animate-spin" /><span>Mendeteksi...</span></>
            ) : isResolvedForCurrentLink ? (
              <><Check className="size-3.5 mr-1.5 text-emerald-600 dark:text-emerald-400" /><span>Terdeteksi</span></>
            ) : (
              <><Sparkles className="size-3.5 mr-1.5" /><span>Ambil Koordinat</span></>
            )}
          </Button>
        </div>

        {resolveNotice && (
          <div
            className={`flex items-start gap-2 p-2.5 rounded-xl text-xs transition-all ${
              resolveNotice.type === "success"
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                : "bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300"
            }`}
          >
            {resolveNotice.type === "success" ? (
              <Check className="size-3.5 mt-0.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="size-3.5 mt-0.5 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <span className="leading-tight">{resolveNotice.message}</span>
          </div>
        )}
      </div>

      {/* Manual Coordinates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <CoordinateField label="Latitude" iconColor="text-rose-500" value={lat} onChange={setLat} placeholder="-7.9825678" />
        <CoordinateField label="Longitude" iconColor="text-sky-500" value={lng} onChange={setLng} placeholder="112.6308123" />
      </div>
    </FormDrawerSection>
  )
}

function CoordinateField({
  label,
  iconColor,
  value,
  onChange,
  placeholder,
}: {
  label: string
  iconColor: string
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
          <MapPin className={`size-3 ${iconColor}`} />
          {label}
        </label>
        {value && <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">✓ Terpasang</span>}
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9.5 text-xs rounded-xl font-mono"
      />
    </div>
  )
}

