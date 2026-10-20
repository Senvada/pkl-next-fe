"use client";

import Image from "next/image";
import { Building2, User2, ImageIcon } from "lucide-react";
import type { ArticleCardPreviewProps } from "./types";

export default function StyleClassic({
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
      className="group relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Top Image */}
      <div
        onClick={onSelectImage}
        className="flex-1 relative overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer"
      >
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={title || "Cover preview"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-2">
            <ImageIcon className="size-8" />
            <span className="text-xs font-medium">Klik untuk pilih cover</span>
          </div>
        )}
      </div>

      {/* Bottom Info Box */}
      <div className="p-4 flex-none border-t border-slate-100 dark:border-white/5 space-y-2">
        {companyName && (
          <div className="flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-400 font-medium line-clamp-1">
            <Building2 className="size-3.5 shrink-0" />
            <span>{companyName}</span>
          </div>
        )}

        <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
          {title || <span className="text-slate-400 italic font-normal">Judul artikel...</span>}
        </h3>

        <div className="flex items-center gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
          <User2 className="size-3 shrink-0" />
          <span>{authorName || "Penulis"}</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span>Draf</span>
        </div>
      </div>
    </div>
  );
}
