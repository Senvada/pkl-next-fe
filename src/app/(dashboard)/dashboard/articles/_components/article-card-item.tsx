"use client";

import Link from "next/link";
import Image from "next/image";
import { Building2, User2, Trash2, ImageIcon, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Article } from "@/types/article";

interface ArticleCardItemProps {
  article: Article;
  onDelete: (article: Article) => void;
}

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  draft: { label: "Draf", className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
  review: { label: "Review", className: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300" },
  reject: { label: "Ditolak", className: "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300" },
  published: { label: "Terbit", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300" },
  archived: { label: "Arsip", className: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300" },
};

const STYLE_LABELS: Record<number, string> = {
  1: "Klasik",
  2: "Overlay",
  3: "Frosted",
  4: "Editorial",
};

export default function ArticleCardItem({ article, onDelete }: ArticleCardItemProps) {
  const statusInfo = STATUS_BADGES[article.status] || STATUS_BADGES.draft;
  const styleName = STYLE_LABELS[article.style?.type] || "Klasik";

  return (
    <div className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between">
      {/* Cover Banner */}
      <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {article.cover_url ? (
          <Image
            src={article.cover_url}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-1.5">
            <ImageIcon className="size-7" />
            <span className="text-[11px] font-medium">Tanpa Cover</span>
          </div>
        )}

        {/* Badges on Banner */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold shadow-xs ${statusInfo.className}`}>
            {statusInfo.label}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-black/60 backdrop-blur-md text-white border border-white/20">
            Style: {styleName}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          {article.company?.name && (
            <div className="flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-400 font-medium line-clamp-1">
              <Building2 className="size-3.5 shrink-0" />
              <span>{article.company.name}</span>
            </div>
          )}

          <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
            {article.title}
          </h3>
        </div>

        {/* Footer Meta */}
        <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 line-clamp-1">
            <User2 className="size-3 shrink-0" />
            <span className="line-clamp-1">{article.author?.name || "Penulis"}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-7 text-xs rounded-lg gap-1 px-2 font-medium"
            >
              <Link href={`/dashboard/articles/${article.id}/edit`}>
                <Edit3 className="size-3" />
                <span>Tulis</span>
              </Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onDelete(article)}
              className="size-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              title="Hapus Artikel"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
