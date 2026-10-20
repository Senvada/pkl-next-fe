"use client";

import Image from "next/image";
import { Tag, Share2, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlockViewer } from "@/components/shared/block-builder";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ArticleBody({ article }: { article: any }) {
  const cover = article.cover_url || article.coverImage;
  const isBlockContent =
    Array.isArray(article.content) &&
    article.content.length > 0 &&
    typeof article.content[0] === "object" &&
    "type" in article.content[0];

  const tags: string[] = article.tags || (article.company?.name ? [article.company.name, "PKL"] : ["PKL"]);

  return (
    <div className="space-y-8">
      {/* Featured Cover Image */}
      <div className="relative h-72 sm:h-96 lg:h-[460px] w-full overflow-hidden rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-2xl bg-slate-100 dark:bg-slate-800">
        {cover ? (
          <Image src={cover} alt={article.title} fill priority className="object-cover" />
        ) : (
          <div className="size-full flex flex-col items-center justify-center text-slate-400 gap-2">
            <Newspaper className="size-12 text-slate-400" />
            <span className="text-sm">Dokumentasi PKL</span>
          </div>
        )}
      </div>

      {/* Main Content Article Body */}
      <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-[#16212D] p-6 sm:p-10 lg:p-12 shadow-sm dark:shadow-xl space-y-6 text-slate-800 dark:text-slate-200">
        {isBlockContent ? (
          <BlockViewer blocks={article.content} />
        ) : Array.isArray(article.content) ? (
          article.content.map((paragraph: string, idx: number) => (
            <p key={idx} className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 font-normal">
              {paragraph}
            </p>
          ))
        ) : (
          <p className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300">
            {article.excerpt || "Tidak ada konten tambahan untuk artikel ini."}
          </p>
        )}

        {/* Tags & Share */}
        <div className="pt-8 border-t border-slate-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Tag className="size-4 text-slate-400" />
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">Bagikan:</span>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 text-xs gap-1.5"
              onClick={() => {
                if (typeof window !== "undefined") {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Tautan artikel berhasil disalin!");
                }
              }}
            >
              <Share2 className="size-3.5" />
              Salin Tautan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
