"use client";

import Link from "next/link";
import { Loader2, ArrowLeft, AlertCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CompanySelect } from "@/components/shared/company-select";
import ArticleCoverSection from "./article-cover-section";
import ArticleStyleSelector from "./article-style-selector";
import type { useArticleCreate } from "../_hooks/use-article-create";
import type { Company } from "@/types/company";

interface ArticleCreateFormProps {
  form: ReturnType<typeof useArticleCreate>;
  companies: Company[];
}

export default function ArticleCreateForm({ form }: ArticleCreateFormProps) {
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
    isCompanyLocked,
    cannotCreateReason,
    handleSubmit,
  } = form;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {cannotCreateReason && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs">
          <AlertCircle className="size-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Mitra Industri Belum Terhubung</p>
            <p>{cannotCreateReason}</p>
          </div>
        </div>
      )}

      {formError && (
        <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
          <AlertCircle className="size-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Judul Artikel */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Judul Artikel / Laporan <span className="text-rose-500">*</span>
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Contoh: Pengalaman Mengembangkan Sistem API di PT Telkom"
          className="rounded-xl border-slate-300 dark:border-slate-700 focus-visible:ring-sky-500"
          disabled={Boolean(cannotCreateReason)}
          required
        />
      </div>

      {/* Perusahaan Mitra with Combobox Infinite Scroll */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center justify-between">
          <span>
            Perusahaan Mitra Terkait <span className="text-rose-500">*</span>
          </span>
          {isCompanyLocked && (
            <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-normal">
              <Lock className="size-3" /> Terkunci pada mitra Anda
            </span>
          )}
        </label>
        <CompanySelect
          value={companyId || null}
          onChange={(val) => setCompanyId(val || "")}
          placeholder={
            cannotCreateReason
              ? "Akun belum terikat mitra industri..."
              : "Pilih perusahaan mitra tempat magang..."
          }
          disabled={isCompanyLocked || Boolean(cannotCreateReason)}
          className="h-10 text-sm rounded-xl"
          allowClear={false}
        />
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

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/10">
        <Button variant="ghost" asChild className="rounded-xl text-xs gap-1.5">
          <Link href="/dashboard/articles">
            <ArrowLeft className="size-3.5" /> Batal
          </Link>
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting || Boolean(cannotCreateReason)}
          className="rounded-xl text-xs bg-sky-600 hover:bg-sky-700 text-white gap-2 px-5 disabled:opacity-50"
        >
          {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
          Lanjut ke Editor Dokumen &rarr;
        </Button>
      </div>
    </form>
  );
}
