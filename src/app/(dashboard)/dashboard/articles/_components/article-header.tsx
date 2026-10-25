"use client";

import Link from "next/link";
import { Newspaper, Plus, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ArticleHeaderProps {
  totalCount?: number;
  isUnboundSiswa?: boolean;
}

export default function ArticleHeader({ totalCount, isUnboundSiswa }: ArticleHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <Newspaper className="size-4" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Artikel & Berita Industri
          </h1>
          {typeof totalCount === "number" && (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">
              {totalCount}
            </span>
          )}
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Kelola berita, panduan magang, dan warta kegiatan kemitraan sekolah dengan DU/DI.
        </p>
      </div>

      {isUnboundSiswa ? (
        <Button
          disabled
          className="rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 text-xs gap-1.5 px-4 shadow-sm cursor-not-allowed opacity-70"
          title="Hubungkan mitra industri terlebih dahulu untuk membuat artikel"
        >
          <Lock className="size-3.5" />
          Belum Terikat Mitra
        </Button>
      ) : (
        <Link href="/dashboard/articles/create">
          <Button className="rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs gap-1.5 px-4 shadow-sm">
            <Plus className="size-4" />
            Buat Artikel Baru
          </Button>
        </Link>
      )}
    </div>
  );
}
