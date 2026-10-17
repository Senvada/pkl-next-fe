import Link from "next/link";
import Image from "next/image";
import { ARTICLES } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Calendar } from "lucide-react";

export default function LatestArticles() {
  const articles = ARTICLES.slice(0, 3);

  return (
    <section className="py-16 sm:py-24 container mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <Badge variant="outline" className="border-sky-500/30 text-sky-600 dark:text-sky-400 bg-sky-500/10 mb-2">
            Pusat Informasi
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Panduan & Kabar PKL Terkini
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl">
            Tips sukses magang, etika kerja, hingga berita kerjasama industri SMKN 6 Malang.
          </p>
        </div>

        <Button asChild variant="ghost" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-slate-100 dark:hover:bg-white/5 w-fit">
          <Link href="/articles" className="flex items-center gap-1.5 font-semibold">
            Lihat Semua Artikel
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((art) => (
          <Link
            key={art.slug}
            href={`/articles/${art.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-[#16212D] transition-[transform,border-color,box-shadow] duration-200 ease-out will-change-transform hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-xl shadow-sm dark:shadow-none"
          >
            {/* Image */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
              <Image
                src={art.coverImage}
                alt={art.title}
                fill
                className="object-cover transition-transform duration-300 ease-out will-change-transform group-hover:scale-105"
              />
              <div className="absolute top-3 left-3">
                <span className="rounded-md bg-blue-600/90 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                  {art.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3.5" />
                    {art.publishedAt}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5" />
                    {art.readTime}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors line-clamp-2">
                  {art.title}
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
                  {art.excerpt}
                </p>
              </div>

              {/* Author Info */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center gap-3">
                <div className="relative size-7 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                  <Image
                    src={art.author.avatar}
                    alt={art.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {art.author.name}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {art.author.role}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
