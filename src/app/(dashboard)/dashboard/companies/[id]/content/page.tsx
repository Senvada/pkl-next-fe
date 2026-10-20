"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { useCompanyDetailQuery, useUpdateCompanyContent } from "@/hooks/modules/company";
import { BlockBuilder, type ArticleBlock } from "@/components/shared/block-builder";
import { Button } from "@/components/ui/button";

interface CompanyContentPageProps {
  params: Promise<{ id: string }>;
}

export default function CompanyContentPage({ params }: CompanyContentPageProps) {
  const { id } = React.use(params);
  const { data: company, isLoading, error } = useCompanyDetailQuery(id);
  const updateContentMutation = useUpdateCompanyContent();

  const handleSave = React.useCallback(
    async (blocks: ArticleBlock[]) => {
      if (!id) return;
      await updateContentMutation.mutateAsync({
        id,
        content: blocks,
      });
    },
    [id, updateContentMutation]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-muted/20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Memuat editor konten mitra...</p>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-muted/20 p-4">
        <div className="p-3 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-600">
          <AlertCircle className="h-8 w-8" />
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-lg font-bold">Mitra Tidak Ditemukan</h2>
          <p className="text-xs text-muted-foreground max-w-sm">
            Data perusahaan yang Anda cari tidak tersedia atau Anda tidak memiliki hak akses.
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="rounded-xl">
          <Link href="/dashboard/companies" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar Perusahaan
          </Link>
        </Button>
      </div>
    );
  }

  const initialBlocks = Array.isArray(company.content)
    ? (company.content as ArticleBlock[])
    : [];

  return (
    <BlockBuilder
      entityId={company.id}
      entityType="company"
      title={company.name}
      subtitle="Editor Profil & Konten Detail Mitra Industri"
      initialBlocks={initialBlocks}
      onSave={handleSave}
      backUrl="/dashboard/companies"
      templateCategory="company"
    />
  );
}
