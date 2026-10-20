"use client";

import Link from "next/link";
import { Newspaper, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ArticleCardItem from "./article-card-item";
import type { Article } from "@/types/article";

interface ArticleGridProps {
  articles: Article[];
  isLoading: boolean;
  onDelete: (article: Article) => void;
}

export default function ArticleGrid({ articles, isLoading, onDelete }: ArticleGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200 dark:border-white/10 p-4 space-y-3 animate-pulse bg-white dark:bg-slate-900"
          >
            <div className="h-44 w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-5 w-4/5 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 dark:border-white/15 bg-white/50 dark:bg-slate-900/40 p-12 text-center space-y-4">
        <div className="size-12 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto">
          <Newspaper className="size-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Belum ada artikel ditemukan
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Mulai tulis artikel berita, panduan kegiatan magang, atau informasi industri sekarang.
          </p>
        </div>
        <Link href="/dashboard/articles/create">
          <Button className="rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs gap-1.5 px-4 shadow-sm">
            <Plus className="size-4" />
            Buat Artikel Pertama
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((art) => (
        <ArticleCardItem key={art.id} article={art} onDelete={onDelete} />
      ))}
    </div>
  );
}
