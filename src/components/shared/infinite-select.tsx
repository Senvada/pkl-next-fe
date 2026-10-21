"use client"

import React, { useState, useRef, useTransition } from "react"
import { Check, ChevronsUpDown, Loader2, Search, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useInfiniteScrollQuery, type PaginatedResult } from "@/hooks/shared/use-infinite-scroll-query"

interface InfiniteSelectProps<T> {
  value?: string | null
  onChange: (value: string | null, item?: T | null) => void
  placeholder?: string
  searchPlaceholder?: string
  queryKey: (string | number | Record<string, unknown>)[]
  queryFn: (page: number, limit: number, search: string) => Promise<PaginatedResult<T>>
  getItemValue: (item: T) => string
  getItemLabel: (item: T) => string
  renderItem?: (item: T, isSelected: boolean) => React.ReactNode
  selectedLabel?: string
  disabled?: boolean
  allowClear?: boolean
  className?: string
}

export function InfiniteSelect<T>({
  value,
  onChange,
  placeholder = "Pilih salah satu...",
  searchPlaceholder = "Cari data...",
  queryKey,
  queryFn,
  getItemValue,
  getItemLabel,
  renderItem,
  selectedLabel,
  disabled = false,
  allowClear = true,
  className,
}: InfiniteSelectProps<T>) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [, startTransition] = useTransition()
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)

  const { items, isLoading, isFetchingNextPage, sentinelRef } = useInfiniteScrollQuery<T>({
    queryKey: [...queryKey, search],
    queryFn: (page, limit) => queryFn(page, limit, search),
    limit: 12,
    enabled: open,
    rootRef: scrollContainerRef,
  })

  const currentLabel = selectedLabel || (value ? items.find((i) => getItemValue(i) === value) ? getItemLabel(items.find((i) => getItemValue(i) === value)!) : value : null)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("w-full justify-between font-normal text-xs h-10 px-3 rounded-xl border-slate-200 dark:border-white/10", className)}
        >
          <span className="truncate">{currentLabel || <span className="text-slate-400">{placeholder}</span>}</span>
          <div className="flex items-center gap-1 ml-2 shrink-0">
            {allowClear && value && !disabled && (
              <span
                role="button"
                onClick={(e) => { e.stopPropagation(); onChange(null, null); }}
                className="hover:text-rose-500 text-slate-400 p-0.5"
              >
                <X className="size-3" />
              </span>
            )}
            <ChevronsUpDown className="size-3.5 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-2 rounded-2xl" align="start">
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => startTransition(() => setSearch(e.target.value))}
            placeholder={searchPlaceholder}
            className="pl-8 h-8 text-xs rounded-lg"
          />
        </div>
        <div ref={scrollContainerRef} className="max-h-60 overflow-y-auto space-y-1 pr-1 text-xs">
          {isLoading && items.length === 0 && (
            <div className="flex items-center justify-center py-6 gap-2 text-slate-400">
              <Loader2 className="size-4 animate-spin text-blue-600" />
              <span>Memuat...</span>
            </div>
          )}
          {!isLoading && items.length === 0 && (
            <div className="py-6 text-center text-slate-400">Tidak ada pilihan ditemukan.</div>
          )}
          {items.map((item) => {
            const val = getItemValue(item)
            const isSelected = val === value
            return (
              <div
                key={val}
                onClick={() => { onChange(val, item); setOpen(false); }}
                className={cn(
                  "flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors",
                  isSelected ? "bg-blue-50 text-blue-700 font-semibold dark:bg-blue-500/20 dark:text-blue-300" : "hover:bg-slate-100 dark:hover:bg-white/5"
                )}
              >
                {renderItem ? renderItem(item, isSelected) : <span>{getItemLabel(item)}</span>}
                {isSelected && <Check className="size-3.5 text-blue-600" />}
              </div>
            )
          })}
          <div ref={sentinelRef} className="h-4 w-full" />
          {isFetchingNextPage && (
            <div className="flex items-center justify-center py-2 text-[11px] text-slate-400 gap-1.5">
              <Loader2 className="size-3 animate-spin text-blue-600" />
              <span>Memuat lagi...</span>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
