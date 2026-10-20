"use client";

import * as React from "react";
import Image from "next/image";
import { Search, Check, FileQuestion } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAssetsPaginatedQuery } from "@/hooks/modules/asset";
import type { Asset } from "@/types/asset";

interface AssetPickerGridProps {
  selectedAsset: Asset | null;
  onSelect: (asset: Asset) => void;
  onConfirm: (asset: Asset) => void;
}

export function AssetPickerGrid({
  selectedAsset,
  onSelect,
  onConfirm,
}: AssetPickerGridProps) {
  const [search, setSearch] = React.useState("");
  const { data, isLoading } = useAssetsPaginatedQuery({
    limit: 24,
    filter: { search, mime_type: "image" },
  });

  const assets = data?.assets || [];

  return (
    <div className="space-y-3">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari foto di Galeri Aset..."
          className="pl-8 text-xs rounded-xl border-slate-200 dark:border-slate-800"
        />
      </div>

      {/* Grid Canvas */}
      <div className="min-h-[220px] max-h-[340px] overflow-y-auto pr-1">
        {isLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-video rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"
              />
            ))}
          </div>
        ) : assets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-400 gap-1.5 text-center">
            <FileQuestion className="size-8" />
            <span className="text-xs font-medium">Tidak ada foto di Galeri Aset</span>
            <span className="text-[11px] text-slate-400">Gunakan tab &quot;Upload Baru&quot; di atas</span>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
            {assets.map((asset) => {
              const isSelected = selectedAsset?.id === asset.id;
              return (
                <div
                  key={asset.id}
                  onClick={() => onSelect(asset)}
                  onDoubleClick={() => onConfirm(asset)}
                  className={`group relative aspect-video rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                    isSelected
                      ? "border-sky-500 ring-2 ring-sky-500/20 shadow-md"
                      : "border-slate-200 dark:border-white/10 hover:border-slate-400"
                  }`}
                >
                  <Image
                    src={asset.url}
                    alt={asset.filename}
                    fill
                    className="object-cover"
                  />
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 size-5 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-xs">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-1 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-[10px] text-white truncate px-1">
                      {asset.filename}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
