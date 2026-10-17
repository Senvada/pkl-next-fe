"use client"

import * as React from "react"
import Image from "next/image"
import { ImageIcon, Trash2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImagePickerDialog } from "./image-picker-dialog"
import {
  resolveAssetUrl,
  type FallbackType,
} from "@/lib/asset-resolver"
import type { Asset } from "@/types/asset"

export interface ImagePickerInputProps {
  label?: string
  description?: string
  value?: string | null
  onChange: (url: string | null, asset?: Asset) => void
  aspectRatio?: number
  cropShape?: "round" | "rect"
  placeholderType?: FallbackType
  folder?: string
  disabled?: boolean
  error?: string
  className?: string
  pickerTitle?: string
  pickerDescription?: string
}

export function ImagePickerInput({
  label,
  description,
  value,
  onChange,
  aspectRatio = 16 / 9,
  cropShape = "rect",
  placeholderType = "image",
  folder = "gallery",
  disabled = false,
  error,
  className = "",
  pickerTitle,
  pickerDescription,
}: ImagePickerInputProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (asset: Asset) => {
    onChange(asset.url || asset.path, asset)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(null)
  }

  const hasImage = !!value && value.trim() !== ""
  const displayUrl = hasImage ? resolveAssetUrl(value, placeholderType) : null

  // Compute CSS aspect ratio style
  const aspectStyle = {
    aspectRatio: `${aspectRatio}`,
  }

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-foreground flex items-center justify-between">
          <span>{label}</span>
          {hasImage && !disabled && (
            <button
              type="button"
              onClick={handleRemove}
              className="text-[11px] font-normal text-rose-500 hover:text-rose-600 hover:underline flex items-center gap-1"
            >
              <Trash2 className="size-3" />
              Hapus Gambar
            </button>
          )}
        </label>
      )}

      <div
        onClick={() => !disabled && setOpen(true)}
        style={aspectStyle}
        className={`group relative w-full overflow-hidden rounded-xl border transition-[border-color,box-shadow] duration-150 cursor-pointer ${
          cropShape === "round" ? "rounded-full max-w-[140px] mx-auto" : ""
        } ${
          error
            ? "border-destructive/80 ring-1 ring-destructive/20"
            : "border-border/80 hover:border-blue-500/80 bg-muted/20"
        } ${disabled ? "opacity-60 cursor-not-allowed pointer-events-none" : ""}`}
      >
        {hasImage && displayUrl ? (
          <>
            <Image
              src={displayUrl}
              alt={label || "Pratinjau media"}
              unoptimized
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="size-full object-cover transition-transform duration-200 group-hover:scale-102"
            />

            {/* Hover Action Overlay */}
            {!disabled && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-8 text-xs font-medium gap-1.5 shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setOpen(true)
                  }}
                >
                  <RefreshCw className="size-3.5" />
                  Ganti
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="h-8 text-xs font-medium gap-1.5 shadow-sm"
                  onClick={handleRemove}
                >
                  <Trash2 className="size-3.5" />
                  Hapus
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="size-full flex flex-col items-center justify-center p-4 text-center transition-colors group-hover:bg-blue-50/10 dark:group-hover:bg-blue-950/10">
            <div className="size-10 rounded-xl bg-muted/80 text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-center mb-2 transition-colors">
              <ImageIcon className="size-5" />
            </div>
            <p className="text-xs font-medium text-foreground">
              Pilih dari Galeri atau Unggah
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Klik di sini untuk memilih media
            </p>
          </div>
        )}
      </div>

      {description && !error && (
        <p className="text-[11px] text-muted-foreground">{description}</p>
      )}

      {error && <p className="text-[11px] text-destructive font-medium">{error}</p>}

      {/* Dialog */}
      <ImagePickerDialog
        open={open}
        onOpenChange={setOpen}
        onSelect={handleSelect}
        selectedUrl={value}
        aspectRatio={aspectRatio}
        cropShape={cropShape}
        title={pickerTitle || label || "Pilih Gambar"}
        description={pickerDescription}
        folder={folder}
      />
    </div>
  )
}
