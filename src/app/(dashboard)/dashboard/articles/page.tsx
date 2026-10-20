"use client";

import { useCompaniesQuery } from "@/hooks/modules/company";
import { useArticleOperations } from "./_hooks/use-article-operations";
import ArticleHeader from "./_components/article-header";
import ArticleFilters from "./_components/article-filters";
import ArticleGrid from "./_components/article-grid";
import ArticleDeleteModal from "./_components/article-delete-modal";

export default function ArticlesDashboardPage() {
  const ops = useArticleOperations();
  const { data: companies = [] } = useCompaniesQuery();

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl space-y-6">
      {/* Header */}
      <ArticleHeader totalCount={ops.pagination?.total_rows} />

      {/* Filters Bar */}
      <ArticleFilters
        search={ops.search}
        onSearchChange={ops.setSearch}
        status={ops.status}
        onStatusChange={ops.setStatus}
        companyId={ops.companyId}
        onCompanyChange={ops.setCompanyId}
        companies={companies}
      />

      {/* Articles Grid */}
      <ArticleGrid
        articles={ops.articles}
        isLoading={ops.isLoading}
        onDelete={ops.handleOpenDelete}
      />

      {/* Delete Confirmation Modal */}
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
