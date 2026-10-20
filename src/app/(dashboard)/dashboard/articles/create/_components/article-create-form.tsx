"use client";

import Link from "next/link";
import { Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ArticleCoverSection from "./article-cover-section";
import ArticleStyleSelector from "./article-style-selector";
import type { useArticleCreate } from "../_hooks/use-article-create";
import type { Company } from "@/types/company";

interface ArticleCreateFormProps {
  form: ReturnType<typeof useArticleCreate>;
  companies: Company[];
}

export default function ArticleCreateForm({ form, companies }: ArticleCreateFormProps) {
  const {
    title,
    setTitle,
    companyId,
    setCompanyId,
    coverUrl,
    setCoverUrl,
    styleConfig,
    setStyleType,
    setStyleHeight,
    formError,
    isSubmitting,
    handleSubmit,
  } = form;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 p-6 shadow-sm">
      {formError && (
        <div className="flex items-center gap-2 p-3 text-xs text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300 rounded-xl border border-rose-200 dark:border-rose-900/40">
          <AlertCircle className="size-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Judul Artikel */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Judul Artikel <span className="text-rose-500">*</span>
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Contoh: Pengalaman Mengembangkan Sistem API di PT Telkom"
          className="rounded-xl border-slate-300 dark:border-slate-700 focus-visible:ring-sky-500"
          required
        />
      </div>

      {/* Perusahaan Mitra */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Perusahaan Mitra Terkait <span className="text-rose-500">*</span>
        </label>
        <select
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          required
        >
          <option value="">-- Pilih Perusahaan Mitra --</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Cover Image Upload & 16:9 Cropper */}
      <ArticleCoverSection coverUrl={coverUrl} onCoverChange={setCoverUrl} />

      {/* Style & Height Selector */}
      <ArticleStyleSelector
        selectedType={styleConfig.type}
        onSelectType={setStyleType}
        height={styleConfig.height}
        onChangeHeight={setStyleHeight}
      />

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
        <Link href="/dashboard/articles">
          <Button type="button" variant="ghost" className="rounded-xl gap-2 text-xs">
            <ArrowLeft className="size-3.5" />
            Batal
          </Button>
        </Link>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs px-6 gap-2 shadow-sm"
        >
          {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
          Simpan Draf Artikel
        </Button>
      </div>
    </form>
  );
}
