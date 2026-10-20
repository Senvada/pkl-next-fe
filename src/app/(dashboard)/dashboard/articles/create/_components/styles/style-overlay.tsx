"use client";

import Image from "next/image";
import { Building2, User2, ImageIcon } from "lucide-react";
import type { ArticleCardPreviewProps } from "./types";

export default function StyleOverlay({
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
      className="group relative rounded-2xl bg-slate-900 border border-slate-200/20 dark:border-white/10 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-end p-5"
    >
      {/* Background Cover Image */}
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

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none" />

      {/* Foreground Content */}
      <div className="relative z-10 space-y-2">
        {companyName && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/20 backdrop-blur-md text-white border border-white/20">
            <Building2 className="size-3" />
            {companyName}
          </span>
        )}

        <h3 className="text-lg font-bold text-white line-clamp-2 leading-snug drop-shadow-sm">
          {title || <span className="text-white/60 italic font-normal">Judul artikel...</span>}
        </h3>

        <div className="flex items-center gap-2 pt-1 text-xs text-white/70">
          <User2 className="size-3 shrink-0" />
          <span>{authorName || "Penulis"}</span>
          <span>•</span>
          <span className="text-emerald-400 font-medium">Draf Baru</span>
        </div>
      </div>
    </div>
  );
}
