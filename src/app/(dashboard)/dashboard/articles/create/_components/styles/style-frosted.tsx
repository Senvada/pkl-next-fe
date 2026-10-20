"use client";

import Image from "next/image";
import { Building2, User2, ImageIcon, Sparkles } from "lucide-react";
import type { ArticleCardPreviewProps } from "./types";

export default function StyleFrosted({
  title,
  companyName,
  authorName,
  coverUrl,
  styleConfig,
  onSelectImage,
}: ArticleCardPreviewProps) {
  return (
    <div
      style={{ height: styleConfig.height }}
      onClick={onSelectImage}
      className="group relative rounded-2xl bg-slate-900 border border-slate-200/20 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-end p-4"
    >
      {/* Background Image with slight zoom */}
      {coverUrl ? (
        <Image
          src={coverUrl}
          alt={title || "Cover preview"}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 bg-slate-800 gap-2">
          <ImageIcon className="size-8" />
          <span className="text-xs font-medium">Klik untuk pilih cover</span>
        </div>
      )}

      {/* Floating Frosted Glass Card Container */}
      <div className="relative z-10 rounded-xl bg-white/15 dark:bg-black/35 backdrop-blur-xl border border-white/25 dark:border-white/15 p-4 shadow-xl space-y-2">
        <div className="flex items-center justify-between gap-2">
          {companyName ? (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/90">
              <Building2 className="size-3 text-sky-300" />
              {companyName}
            </span>
          ) : <span />}
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-300/30">
            <Sparkles className="size-2.5" />
            Glass
          </span>
        </div>

        <h3 className="text-base font-bold text-white line-clamp-2 leading-snug drop-shadow-sm">
          {title || <span className="text-white/60 italic font-normal">Judul artikel...</span>}
        </h3>

        <div className="flex items-center gap-2 pt-1 text-xs text-white/70">
          <User2 className="size-3 shrink-0" />
          <span>{authorName || "Penulis"}</span>
        </div>
      </div>
    </div>
  );
}
