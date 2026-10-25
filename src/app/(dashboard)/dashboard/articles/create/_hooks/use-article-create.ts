"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useCreateArticleMutation } from "@/hooks/modules/article";
import { useCurrentUser } from "@/hooks/modules/auth/useCurrentUser";
import { isUserSiswa } from "@/lib/auth/permissions";
import type { ArticleCardStyle, ArticleStyleConfig } from "@/types/article";

export function useArticleCreate() {
  const router = useRouter();
  const user = useCurrentUser();
  const createMutation = useCreateArticleMutation();

  const isSiswa = isUserSiswa(user);
  const isIndustri = user?.role_name?.toLowerCase() === "industri";
  const userCompanyId = user?.company_id || "";

  const cannotCreateReason = React.useMemo(() => {
    if (isSiswa && !userCompanyId) {
      return "Akun siswa Anda belum terhubung dengan mitra industri. Silakan hubungi pembimbing atau admin untuk menghubungkan akun Anda ke mitra industri sebelum membuat artikel.";
    }
    return null;
  }, [isSiswa, userCompanyId]);

  const isCompanyLocked = (isSiswa || isIndustri) && Boolean(userCompanyId);

  const [title, setTitle] = React.useState("");
  const [customCompanyId, setCustomCompanyId] = React.useState("");
  const companyId = isCompanyLocked ? userCompanyId : customCompanyId;
  const setCompanyId = setCustomCompanyId;

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

    if (cannotCreateReason) {
      setFormError(cannotCreateReason);
      return;
    }

    if (!title.trim() || title.trim().length < 3) {
      setFormError("Judul artikel minimal 3 karakter.");
      return;
    }

    const targetCompanyId = isCompanyLocked ? userCompanyId : companyId;
    if (!targetCompanyId) {
      setFormError("Pilih perusahaan mitra yang terkait dengan artikel ini.");
      return;
    }

    try {
      const created = await createMutation.mutateAsync({
        title: title.trim(),
        company_id: targetCompanyId,
        cover_url: coverUrl || undefined,
        style: styleConfig,
        status: "draft",
      });

      router.push(`/dashboard/articles/${created.id}/edit`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan draf artikel.";
      setFormError(msg);
    }
  };

  return {
    title,
    setTitle,
    companyId: isCompanyLocked ? userCompanyId : companyId,
    setCompanyId,
    coverUrl,
    setCoverUrl,
    styleConfig,
    setStyleType,
    setStyleHeight,
    formError,
    setFormError,
    isSubmitting: createMutation.isPending,
    isCompanyLocked,
    cannotCreateReason,
    handleSubmit,
  };
}
