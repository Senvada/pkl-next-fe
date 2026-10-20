"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useCreateArticleMutation } from "@/hooks/modules/article";
import type { ArticleCardStyle, ArticleStyleConfig } from "@/types/article";

export function useArticleCreate() {
  const router = useRouter();
  const createMutation = useCreateArticleMutation();

  const [title, setTitle] = React.useState("");
  const [companyId, setCompanyId] = React.useState("");
  const [coverUrl, setCoverUrl] = React.useState("");
  const [styleConfig, setStyleConfig] = React.useState<ArticleStyleConfig>({
    type: 1,
    height: 420,
  });
  const [formError, setFormError] = React.useState<string | null>(null);

  const setStyleType = (type: ArticleCardStyle) => {
    setStyleConfig((prev) => ({ ...prev, type }));
  };

  const setStyleHeight = (height: number) => {
    setStyleConfig((prev) => ({ ...prev, height }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim() || title.trim().length < 3) {
      setFormError("Judul artikel minimal 3 karakter.");
      return;
    }

    if (!companyId) {
      setFormError("Pilih perusahaan mitra yang terkait dengan artikel ini.");
      return;
    }

    try {
      const created = await createMutation.mutateAsync({
        title: title.trim(),
        company_id: companyId,
        cover_url: coverUrl || undefined,
        style: styleConfig,
        status: "draft",
      });

      // Redirect to builder workspace
      router.push(`/dashboard/articles/${created.id}/edit`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan draf artikel.";
      setFormError(msg);
    }
  };

  return {
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
    setFormError,
    isSubmitting: createMutation.isPending,
    handleSubmit,
  };
}
