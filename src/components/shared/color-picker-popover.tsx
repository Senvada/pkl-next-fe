"use client"

import * as React from "react"
import { Pipette, Check } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ColorPickerPopoverProps {
  color: string
  onChange: (color: string) => void
  disabled?: boolean
}

const PRESET_COLORS = [
  "#3B82F6", // Blue
  "#2563EB", // Blue Dark
  "#6366F1", // Indigo
  "#8B5CF6", // Violet
  "#A855F7", // Purple
  "#EC4899", // Pink
  "#F43F5E", // Rose
  "#EF4444", // Red
  "#F97316", // Orange
  "#F59E0B", // Amber
  "#10B981", // Emerald
  "#06B6D4", // Cyan
  "#0284C7", // Sky
  "#64748B", // Slate
  "#475569", // Slate Dark
  "#1E293B", // Navy Dark
]

export function ColorPickerPopover({
  color,
  onChange,
  disabled = false,
}: ColorPickerPopoverProps) {
  const [open, setOpen] = React.useState(false)
  const [prevColor, setPrevColor] = React.useState(color)
  const [customHex, setCustomHex] = React.useState<string | null>(null)
  const colorInputRef = React.useRef<HTMLInputElement>(null)

  if (color !== prevColor) {
    setPrevColor(color)
    setCustomHex(null)
  }

  const hexInput = customHex ?? (color || "#3B82F6")

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value
    if (!val.startsWith("#") && val.length > 0) {
      val = "#" + val
    }
    setCustomHex(val)
    if (/^#[0-9A-Fa-f]{6}$/.test(val) || /^#[0-9A-Fa-f]{3}$/.test(val)) {
      onChange(val.toUpperCase())
      setCustomHex(null)
    }
  }

  const handlePresetSelect = (preset: string) => {
    setCustomHex(null)
    onChange(preset)
  }

  const handleNativeColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase()
    setCustomHex(null)
    onChange(val)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className="group relative flex size-9 shrink-0 items-center justify-center rounded-xl border border-border shadow-xs transition-all hover:scale-105 hover:ring-2 hover:ring-blue-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          style={{ backgroundColor: color || "#3B82F6" }}
          title="Pilih warna tema role"
        >
          <span className="sr-only">Pilih warna</span>
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-3.5 space-y-3" align="start">
        <div className="flex items-center justify-between pb-1 border-b border-border/70">
          <span className="text-xs font-semibold text-foreground">Warna Badge Role</span>
          <div className="flex items-center gap-1.5">
            <div
              className="size-4 rounded-md border border-border shadow-xs"
              style={{ backgroundColor: color || "#3B82F6" }}
            />
            <span className="text-[11px] font-mono text-muted-foreground uppercase">
              {color || "#3B82F6"}
            </span>
          </div>
        </div>

        {/* Preset Color Swatches */}
        <div className="grid grid-cols-8 gap-1.5">
          {PRESET_COLORS.map((preset) => {
            const isSelected = preset.toLowerCase() === color?.toLowerCase()
            return (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className="relative size-6 rounded-md border border-black/10 dark:border-white/10 transition-transform hover:scale-110 flex items-center justify-center cursor-pointer shadow-xs"
                style={{ backgroundColor: preset }}
                title={preset}
              >
                {isSelected && (
                  <Check className="size-3 text-white stroke-[3] drop-shadow-xs" />
                )}
              </button>
            )
          })}
        </div>

        {/* Manual Hex Input & Native Picker */}
        <div className="flex items-center gap-2 pt-1 border-t border-border/70">
          <div className="relative flex-1">
            <Input
              type="text"
              value={hexInput}
              onChange={handleHexChange}
              placeholder="#3B82F6"
              maxLength={7}
              className="h-8 text-xs font-mono uppercase tracking-wider rounded-lg px-2.5"
            />
          </div>

          {/* Hidden native color input */}
          <input
            type="color"
            ref={colorInputRef}
            value={color && color.startsWith("#") ? color : "#3B82F6"}
            onChange={handleNativeColorChange}
            className="hidden"
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => colorInputRef.current?.click()}
            className="h-8 px-2.5 rounded-lg text-xs gap-1.5 cursor-pointer"
            title="Buka pemilih warna kustom"
          >
            <Pipette className="size-3.5 text-muted-foreground" />
            <span className="text-[11px]">Kustom</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
