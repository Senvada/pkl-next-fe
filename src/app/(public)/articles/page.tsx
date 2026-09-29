import type { Metadata } from "next";
import { ARTICLES } from "@/lib/mock-data";
import FeaturedArticleHero from "./_components/featured-article-hero";
import ArticlesClient from "./_components/articles-client";
import { Badge } from "@/components/ui/badge";
import { Newspaper } from "lucide-react";

export const metadata: Metadata = {
  title: "Artikel & Panduan PKL | SMKN 6 Malang",
  description:
    "Kumpulan panduan teknis, tips karir, etika industri, dan warta pelaksanaan Praktik Kerja Lapangan SMKN 6 Malang.",
};

export default function ArticlesPage() {
  const featuredArticle = ARTICLES.find((a) => a.featured) || ARTICLES[0];

  return (
    <div className="py-24 sm:py-32 container mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-3xl mb-10">
        <Badge
          variant="outline"
          className="border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400 mb-3 px-3 py-1 text-xs font-semibold"
        >
          <Newspaper className="size-3.5 mr-1" />
          Pusat Literasi & Informasi
        </Badge>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Artikel, Tips Kerja & Panduan Magang
        </h1>
        <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
          Tingkatkan kesiapan magangmu dengan membaca wawasan seputar industri, soft skills esensial, dan regulasi akademik PKL SMKN 6 Malang.
        </p>
      </div>

      {/* Featured Banner Article */}
      {featuredArticle && <FeaturedArticleHero article={featuredArticle} />}

      {/* Interactive List of Articles */}
      <ArticlesClient articles={ARTICLES} />
    </div>
  );
}
