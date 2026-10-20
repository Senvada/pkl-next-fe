"use client";

import * as React from "react";
import Link from "next/link";
import { Newspaper, ChevronRight } from "lucide-react";
import { useCompaniesQuery } from "@/hooks/modules/company";
import { useCurrentUser } from "@/hooks/modules/auth/useCurrentUser";
import { useArticleCreate } from "./_hooks/use-article-create";
import ArticleCreateForm from "./_components/article-create-form";
import ArticleCardPreview from "./_components/article-card-preview";

export default function ArticleCreatePage() {
  const form = useArticleCreate();
  const { data: companies = [] } = useCompaniesQuery();
  const user = useCurrentUser();

  const selectedCompanyName = React.useMemo(() => {
    return companies.find((c) => c.id === form.companyId)?.name;
  }, [companies, form.companyId]);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/dashboard" className="hover:text-slate-700 dark:hover:text-slate-200">
          Dashboard
        </Link>
        <ChevronRight className="size-3" />
        <Link href="/dashboard/articles" className="hover:text-slate-700 dark:hover:text-slate-200">
          Artikel & Berita
        </Link>
        <ChevronRight className="size-3" />
        <span className="text-slate-900 dark:text-white font-medium">Buat Baru</span>
      </nav>

      {/* Page Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <Newspaper className="size-4" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Inisialisasi Data Artikel Baru
          </h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Isi informasi pokok, tentukan mitra industri, dan pilih gaya kartu. Konten artikel dapat diedit kemudian melalui builder.
        </p>
      </div>

      {/* Split Layout: 60% Form & 40% Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: 7 cols (~58%) */}
        <div className="lg:col-span-7">
          <ArticleCreateForm form={form} companies={companies} />
        </div>

        {/* Right Sticky Live Preview: 5 cols (~42%) */}
        <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-4">
          <div className="bg-slate-50/70 dark:bg-slate-900/40 p-5 rounded-2xl border border-dashed border-slate-300 dark:border-white/10">
            <ArticleCardPreview
              title={form.title}
              companyName={selectedCompanyName}
              authorName={user?.name}
              coverUrl={form.coverUrl}
              styleConfig={form.styleConfig}
            />
          </div>
          <p className="text-center text-xs text-slate-400">
            Pratinjau kartu ini mencerminkan tampilan artikel saat tayang di katalog publik.
          </p>
        </div>
      </div>
    </div>
  );
}
