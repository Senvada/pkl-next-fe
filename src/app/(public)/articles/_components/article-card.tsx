import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowUpRight, Newspaper, User } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ArticleCard({ article }: { article: any }) {
  const cover = article.cover_url || article.coverImage;
  const authorName = article.author?.name || "Penulis";
  const authorRole = article.author?.role_name || article.author?.role || "Siswa PKL";
  const authorAvatar = article.author?.avatar_url || article.author?.avatar;
  const companyName = article.company?.name || article.category || "Informasi PKL";
  const dateStr = article.created_at
    ? new Date(article.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
    : (article.publishedAt || "Terbaru");

  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-[#16212D] transition-[transform,border-color,box-shadow] duration-200 ease-out will-change-transform hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-xl shadow-xs dark:shadow-none">
      {/* Cover Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        {cover ? (
          <Image
            src={cover}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 ease-out will-change-transform group-hover:scale-105"
          />
        ) : (
          <div className="size-full flex flex-col items-center justify-center text-slate-400 gap-1">
            <Newspaper className="size-8 text-slate-300 dark:text-slate-600" />
            <span className="text-[11px]">Artikel PKL</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="rounded-md bg-blue-600/90 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
            {companyName}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="size-3.5" />
              {dateStr}
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors line-clamp-2">
            {article.title}
          </h3>

          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
            {article.excerpt || "Klik untuk membaca ulasan lengkap dan dokumentasi kegiatan PKL."}
          </p>
        </div>

        {/* Footer Author & Link */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative size-7 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0 flex items-center justify-center">
              {authorAvatar ? (
                <Image src={authorAvatar} alt={authorName} fill className="object-cover" />
              ) : (
                <User className="size-3.5 text-slate-400" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {authorName}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {authorRole}
              </p>
            </div>
          </div>

          <Link
            href={`/articles/${article.slug}`}
            className="flex size-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-white/5 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-150 ease-out shrink-0 ml-2"
            aria-label={`Baca ${article.title}`}
          >
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
