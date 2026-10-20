"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { useArticleByIdQuery, useUpdateArticleMutation } from "@/hooks/modules/article";
import { BlockBuilder, type ArticleBlock } from "@/components/shared/block-builder";
import { Button } from "@/components/ui/button";

interface ArticleEditPageProps {
  params: Promise<{ id: string }>;
}

export default function ArticleEditPage({ params }: ArticleEditPageProps) {
  const { id } = React.use(params);
  const { data: article, isLoading, error } = useArticleByIdQuery(id);
  const updateMutation = useUpdateArticleMutation();

  const handleSave = React.useCallback(
    async (blocks: ArticleBlock[]) => {
      if (!id) return;
      await updateMutation.mutateAsync({
        id,
        payload: { content: blocks },
      });
    },
    [id, updateMutation]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-muted/20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Memuat builder artikel...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-muted/20 p-4">
        <div className="p-3 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-600">
          <AlertCircle className="h-8 w-8" />
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-lg font-bold">Artikel Tidak Ditemukan</h2>
          <p className="text-xs text-muted-foreground max-w-sm">
            Artikel yang Anda cari tidak tersedia atau Anda tidak memiliki akses untuk menyuntingnya.
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="rounded-xl">
          <Link href="/dashboard/articles" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar Artikel
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <BlockBuilder
      entityId={article.id}
      entityType="article"
      title={article.title}
      subtitle={article.company?.name ? `Mitra: ${article.company.name}` : undefined}
      initialBlocks={(article.content as ArticleBlock[]) || []}
      onSave={handleSave}
      backUrl="/dashboard/articles"
      templateCategory="article"
    />
  );
}
