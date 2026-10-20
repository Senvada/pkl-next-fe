"use client";

import Image from "next/image";
import { Building2, User2, ImageIcon, Bookmark } from "lucide-react";
import type { ArticleCardPreviewProps } from "./types";

export default function StyleEditorial({
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
      className="group relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-lg transition-all duration-300 p-5 flex flex-col justify-between overflow-hidden"
    >
      {/* Top Header & Headline */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          {companyName ? (
            <span className="inline-flex items-center gap-1.5 font-semibold text-sky-600 dark:text-sky-400 tracking-wide uppercase text-[10px]">
              <Building2 className="size-3" />
              {companyName}
            </span>
          ) : (
            <span className="text-[10px] uppercase font-semibold text-slate-400">Editorial</span>
          )}
          <Bookmark className="size-3.5 text-slate-300 dark:text-slate-600" />
        </div>

        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white line-clamp-3 leading-snug tracking-tight">
          {title || <span className="text-slate-400 italic font-normal">Judul artikel...</span>}
        </h3>
      </div>

      {/* Embedded Cover Image */}
      <div
        onClick={onSelectImage}
        className="relative my-3 flex-1 min-h-[140px] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer border border-slate-100 dark:border-white/5"
      >
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={title || "Cover preview"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-1.5">
            <ImageIcon className="size-6" />
            <span className="text-[11px] font-medium">Pilih cover</span>
          </div>
        )}
      </div>

      {/* Footer Author Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-1.5 font-medium">
          <User2 className="size-3" />
          <span>{authorName || "Penulis"}</span>
        </div>
        <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400">Baca Selengkapnya →</span>
      </div>
    </div>
  );
}
