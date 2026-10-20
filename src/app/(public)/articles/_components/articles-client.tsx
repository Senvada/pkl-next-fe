"use client";

import { useState, useMemo } from "react";
import ArticleCard from "./article-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Newspaper } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ArticlesClient({ articles }: { articles: any[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");

  const categories = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => {
      const c = a.company?.name || a.category;
      if (c) set.add(c);
    });
    return ["Semua", ...Array.from(set).slice(0, 5)];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const query = search.toLowerCase();
      const matchesSearch =
        art.title.toLowerCase().includes(query) ||
        (art.excerpt && art.excerpt.toLowerCase().includes(query));

      const cat = art.company?.name || art.category;
      const matchesCat = category === "Semua" || cat === category;

      return matchesSearch && matchesCat;
    });
  }, [articles, search, category]);

  return (
    <div className="space-y-8">
      {/* Search & Category Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-[#16212D] shadow-xs dark:shadow-lg">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-150 ease-out cursor-pointer ${
                category === cat
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Cari topik artikel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:ring-blue-500 rounded-xl text-xs"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id || article.slug} article={article} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl border border-dashed border-slate-200 dark:border-white/10 bg-white/60 dark:bg-[#16212D]/50 shadow-xs">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-400 mb-4">
            <Newspaper className="size-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Tidak ada artikel yang sesuai
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            Coba gunakan kata kunci pencarian yang berbeda atau pilih kategori Semua.
          </p>
          <Button
            onClick={() => {
              setSearch("");
              setCategory("Semua");
            }}
            variant="outline"
            size="sm"
            className="mt-5 border-slate-200 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10"
          >
            Reset Pencarian
          </Button>
        </div>
      )}
    </div>
  );
}
