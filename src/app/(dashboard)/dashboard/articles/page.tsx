"use client";

import { AlertCircle } from "lucide-react";
import { useCompaniesQuery } from "@/hooks/modules/company";
import { useCurrentUser } from "@/hooks/modules/auth/useCurrentUser";
import { isUserSiswa } from "@/lib/auth/permissions";
import { useArticleOperations } from "./_hooks/use-article-operations";
import ArticleHeader from "./_components/article-header";
import ArticleFilters from "./_components/article-filters";
import ArticleGrid from "./_components/article-grid";
import ArticleDeleteModal from "./_components/article-delete-modal";

export default function ArticlesDashboardPage() {
  const ops = useArticleOperations();
  const { data: companies = [] } = useCompaniesQuery();
  const user = useCurrentUser();
  const isUnboundSiswa = isUserSiswa(user) && !user?.company_id;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl space-y-6">
      <ArticleHeader
        totalCount={ops.pagination?.total_rows}
        isUnboundSiswa={isUnboundSiswa}
      />

      {isUnboundSiswa && (
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs">
          <AlertCircle className="size-4.5 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            Akun Anda belum dihubungkan ke mitra industri PKL. Harap hubungi guru pembimbing Anda untuk mengaitkan akun dengan mitra industri tempat magang agar Anda dapat membuat artikel atau laporan PKL.
          </span>
        </div>
      )}

      <ArticleFilters
        search={ops.search}
        onSearchChange={ops.setSearch}
        status={ops.status}
        onStatusChange={ops.setStatus}
        companyId={ops.companyId}
        onCompanyChange={ops.setCompanyId}
        companies={companies}
      />

      <ArticleGrid
        articles={ops.articles}
        isLoading={ops.isLoading}
        onDelete={ops.handleOpenDelete}
      />

      <ArticleDeleteModal
        article={ops.articleToDelete}
        isOpen={ops.isDeleteModalOpen}
        onClose={ops.handleCloseDelete}
        onConfirm={ops.handleConfirmDelete}
        isDeleting={ops.isDeleting}
      />
    </div>
  );
}
