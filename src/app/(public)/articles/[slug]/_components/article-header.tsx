import Link from "next/link";
import Image from "next/image";
import { Article } from "@/lib/mock-data";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ArticleHeader({ article }: { article: Article }) {
  return (
    <div className="pt-24 sm:pt-28 pb-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/80 dark:border-white/10 dark:bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 transition backdrop-blur-md shadow-xs"
        >
          <ArrowLeft className="size-4" />
          Kembali ke Semua Artikel
        </Link>
      </div>

      <div className="space-y-4 max-w-4xl">
        <Badge className="bg-blue-600 text-white font-semibold">
          {article.category}
        </Badge>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          {article.title}
        </h1>

        <p className="text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
          {article.excerpt}
        </p>

        {/* Author & Meta */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-200/80 dark:border-white/10 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2.5">
            <div className="relative size-8 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">{article.author.name}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{article.author.role}</p>
            </div>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Calendar className="size-4 text-blue-600 dark:text-blue-400" />
            <span>{article.publishedAt}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Clock className="size-4 text-sky-500" />
            <span>{article.readTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
