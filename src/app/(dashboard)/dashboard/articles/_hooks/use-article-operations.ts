"use client";

import * as React from "react";
import { useArticlesPaginatedQuery, useDeleteArticleMutation } from "@/hooks/modules/article";
import type { Article } from "@/types/article";

export function useArticleOperations() {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [companyId, setCompanyId] = React.useState("");
  const [page, setPage] = React.useState(1);

  const [articleToDelete, setArticleToDelete] = React.useState<Article | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  const { data: queryResult, isLoading, refetch } = useArticlesPaginatedQuery({
    page,
    limit: 12,
    filter: {
      search,
      status: status || undefined,
      company_id: companyId || undefined,
    },
  });

  const deleteMutation = useDeleteArticleMutation();

  const handleOpenDelete = (article: Article) => {
    setArticleToDelete(article);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDelete = () => {
    setArticleToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!articleToDelete) return;
    try {
      await deleteMutation.mutateAsync(articleToDelete.id);
      handleCloseDelete();
      refetch();
    } catch {
      // handled by global/mutation handlers
    }
  };

  return {
    search,
    setSearch,
    status,
    setStatus,
    companyId,
    setCompanyId,
    page,
    setPage,
    articles: queryResult?.articles || [],
    pagination: queryResult?.pagination,
    isLoading,
    articleToDelete,
    isDeleteModalOpen,
    isDeleting: deleteMutation.isPending,
    handleOpenDelete,
    handleCloseDelete,
    handleConfirmDelete,
    refetch,
  };
}
