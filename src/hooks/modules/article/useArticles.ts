"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { authStore } from "@/lib/auth/auth-store";
import type {
  Article,
  ArticleFilter,
  CreateArticlePayload,
  UpdateArticlePayload,
  PresignCoverPayload,
  PresignCoverResponse,
} from "@/types/article";
import type { PaginationMeta } from "@/types/auth";

export const ARTICLES_QUERY_KEY = ["articles"];

export interface UseArticlesQueryParams {
  page?: number;
  limit?: number;
  filter?: ArticleFilter;
  enabled?: boolean;
}

export interface ArticlesQueryResult {
  articles: Article[];
  pagination?: PaginationMeta;
}

export function useArticlesPaginatedQuery({
  page = 1,
  limit = 10,
  filter = {},
  enabled,
}: UseArticlesQueryParams = {}) {
  const token = authStore.getToken();
  const isEnabled = enabled !== undefined ? enabled : !!token;

  return useQuery({
    queryKey: [...ARTICLES_QUERY_KEY, "paginated", page, limit, filter],
    queryFn: async (): Promise<ArticlesQueryResult> => {
      const queryParams = new URLSearchParams();
      queryParams.set("page", String(page));
      queryParams.set("limit", String(limit));

      if (filter.search?.trim()) queryParams.set("search", filter.search.trim());
      if (filter.status) queryParams.set("status", filter.status);
      if (filter.company_id) queryParams.set("company_id", filter.company_id);
      if (filter.user_id) queryParams.set("user_id", filter.user_id);

      const res = await apiClient.getPaginated<Article>(
        `/articles?${queryParams.toString()}`
      );

      return {
        articles: Array.isArray(res.data) ? res.data : [],
        pagination: res.meta?.pagination,
      };
    },
    enabled: isEnabled,
  });
}

export function useArticleByIdQuery(id?: string, enabled = true) {
  const token = authStore.getToken();
  return useQuery({
    queryKey: [...ARTICLES_QUERY_KEY, "detail", id],
    queryFn: async (): Promise<Article> => {
      if (!id) throw new Error("Article ID is required");
      return apiClient.get<Article>(`/articles/${id}`);
    },
    enabled: enabled && !!id && !!token,
  });
}

export function useCreateArticleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateArticlePayload): Promise<Article> => {
      return apiClient.post<Article>("/articles", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ARTICLES_QUERY_KEY });
    },
  });
}

export function useUpdateArticleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateArticlePayload }): Promise<Article> => {
      return apiClient.put<Article>(`/articles/${id}`, payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ARTICLES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...ARTICLES_QUERY_KEY, "detail", variables.id] });
    },
  });
}

export function useDeleteArticleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.delete(`/articles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ARTICLES_QUERY_KEY });
    },
  });
}

export function usePresignArticleCoverMutation() {
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id?: string;
      payload: PresignCoverPayload;
    }): Promise<PresignCoverResponse> => {
      const endpoint = id
        ? `/articles/${id}/cover/presign`
        : "/articles/cover/presign";
      return apiClient.post<PresignCoverResponse>(endpoint, payload);
    },
  });
}
