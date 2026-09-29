import Link from "next/link";
import Image from "next/image";
import { Article } from "@/lib/mock-data";
import { Calendar, Clock, ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function FeaturedArticleHero({ article }: { article: Article }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-[#16212D] shadow-sm dark:shadow-2xl mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
        {/* Left Column: Info */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 space-y-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-600 text-white font-semibold">
              <Sparkles className="size-3 mr-1" />
              Artikel Utama
            </Badge>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
              {article.category}
            </span>
          </div>

          <Link href={`/articles/${article.slug}`}>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-300 transition-colors leading-tight">
              {article.title}
            </h2>
          </Link>

          <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-3">
            {article.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2">
            <div className="flex items-center gap-2">
              <div className="relative size-6 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">{article.author.name}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Calendar className="size-3.5" />
              <span>{article.publishedAt}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="size-3.5" />
              <span>{article.readTime}</span>
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

        {/* Right Column: Hero Image */}
        <div className="lg:col-span-5 relative h-64 sm:h-80 lg:h-full min-h-[320px] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            priority
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
}
