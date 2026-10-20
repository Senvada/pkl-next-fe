import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight, Sparkles, Newspaper, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function FeaturedArticleHero({ article }: { article: any }) {
  const cover = article.cover_url || article.coverImage;
  const authorName = article.author?.name || "Penulis";
  const authorAvatar = article.author?.avatar_url || article.author?.avatar;
  const companyName = article.company?.name || article.category || "Informasi PKL";
  const dateStr = article.created_at
    ? new Date(article.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
    : (article.publishedAt || "Terbaru");

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-[#16212D] shadow-sm dark:shadow-2xl mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 space-y-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-600 text-white font-semibold">
              <Sparkles className="size-3 mr-1" />
              Artikel Utama
            </Badge>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
              {companyName}
            </span>
          </div>

          <Link href={`/articles/${article.slug}`}>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-300 transition-colors leading-tight">
              {article.title}
            </h2>
          </Link>

          <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-3">
            {article.excerpt || "Baca panduan lengkap dan dokumentasi pelaksanaan praktik kerja lapangan di industri mitra."}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2">
            <div className="flex items-center gap-2">
              <div className="relative size-6 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                {authorAvatar ? (
                  <Image src={authorAvatar} alt={authorName} fill className="object-cover" />
                ) : (
                  <User className="size-3.5 text-slate-400" />
                )}
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">{authorName}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Calendar className="size-3.5" />
              <span>{dateStr}</span>
            </div>
          </div>

          <div className="pt-4">
            <Button
              asChild
              className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 cursor-pointer shadow-sm"
            >
              <Link href={`/articles/${article.slug}`} className="flex items-center gap-2">
                Baca Selengkapnya
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="lg:col-span-5 relative h-64 sm:h-80 lg:h-full min-h-[320px] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          {cover ? (
            <Image
              src={cover}
              alt={article.title}
              fill
              priority
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          ) : (
            <div className="size-full flex flex-col items-center justify-center text-slate-400 gap-2">
              <Newspaper className="size-12 text-slate-400" />
              <span className="text-xs">Dokumentasi PKL</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
