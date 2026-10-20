"use client";

import * as React from "react";
import Image from "next/image";
import { Image as ImageIcon, RefreshCw, AlignCenter, Maximize2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAssetPicker } from "@/components/shared/asset-picker";
import type { ImageBlockData } from "../../types";

interface BlockImageProps {
  data: ImageBlockData;
  onChange: (patch: Partial<ImageBlockData>) => void;
  previewMode?: boolean;
}

export function BlockImage({ data, onChange, previewMode = false }: BlockImageProps) {
  const { pick } = useAssetPicker();

  const handlePickAsset = async () => {
    const asset = await pick({
      accept: ["image/*"],
      title: "Pilih Gambar untuk Konten",
    });
    if (asset) {
      onChange({ assetId: asset.id, url: asset.url });
    }
  };

  if (!data.url) {
    if (previewMode) return null;
    return (
      <button
        type="button"
        onClick={handlePickAsset}
        className="w-full flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/30 transition-all text-muted-foreground hover:text-foreground gap-2 group"
      >
        <div className="p-3 rounded-full bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
          <ImageIcon className="h-6 w-6" />
        </div>
        <span className="text-sm font-medium">Pilih Gambar dari Galeri Aset</span>
        <span className="text-xs text-muted-foreground">Klik untuk membuka galeri aset atau upload foto baru</span>
      </button>
    );
  }

  const alignClasses = {
    full: "w-full",
    center: "max-w-xl mx-auto",
    left: "max-w-md mr-auto",
    right: "max-w-md ml-auto",
  }[data.align || "center"];

  if (previewMode) {
    return (
      <figure className={cn("my-4 space-y-2", alignClasses)}>
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-sm border border-border/40">
          <Image src={data.url} alt={data.caption || "Gambar konten"} fill className="object-cover" />
        </div>
        {data.caption && (
          <figcaption className="text-xs text-center text-muted-foreground italic">
            {data.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <div className={cn("space-y-2", alignClasses)}>
      <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg">
          <button
            type="button"
            onClick={() => onChange({ align: "center" })}
            className={cn("p-1 rounded transition-colors", data.align === "center" ? "bg-background text-foreground shadow-sm" : "hover:text-foreground")}
            title="Tengah"
          >
            <AlignCenter className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onChange({ align: "full" })}
            className={cn("p-1 rounded transition-colors", data.align === "full" ? "bg-background text-foreground shadow-sm" : "hover:text-foreground")}
            title="Lebar Penuh"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePickAsset}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Ganti</span>
          </button>
          <button
            type="button"
            onClick={() => onChange({ url: "", assetId: undefined, caption: "" })}
            className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            title="Hapus Gambar"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-border shadow-xs">
        <Image src={data.url} alt={data.caption || "Gambar"} fill className="object-cover" />
      </div>

      <input
        type="text"
        value={data.caption || ""}
        onChange={(e) => onChange({ caption: e.target.value })}
        placeholder="Tambahkan keterangan gambar (opsional)..."
        className="w-full bg-transparent text-xs text-center border-b border-transparent hover:border-border focus:border-primary focus:outline-none py-1 text-muted-foreground placeholder:text-muted-foreground/40"
      />
    </div>
  );
}
