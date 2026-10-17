import Link from "next/link";
import Image from "next/image";
import { Article } from "@/lib/mock-data";
import { Calendar, Clock, ArrowUpRight } from "lucide-react";

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-[#16212D] transition-[transform,border-color,box-shadow] duration-200 ease-out will-change-transform hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-xl shadow-xs dark:shadow-none">
      {/* Cover Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-300 ease-out will-change-transform group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="rounded-md bg-blue-600/90 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
            {article.category}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata info */}
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="size-3.5" />
              {article.publishedAt}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {article.readTime}
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors line-clamp-2">
            {article.title}
          </h3>

          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
            {article.excerpt}
          </p>
        </div>

        {/* Footer Author & Link */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative size-7 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0">
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {article.author.name}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {article.author.role}
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
