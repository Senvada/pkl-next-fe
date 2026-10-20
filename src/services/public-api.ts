import { apiClient } from "@/lib/api/client";
import type { Company, CompanyMapItem } from "@/types/company";
import type { Article } from "@/types/article";

export interface PublicCompaniesParams {
  limit?: number;
  page?: number;
  search?: string;
  department_id?: string;
}

export async function getPublicCompanies(params: PublicCompaniesParams = {}): Promise<Company[]> {
  try {
    const q = new URLSearchParams();
    q.set("status", "active");
    if (params.limit) q.set("limit", String(params.limit));
    if (params.page) q.set("page", String(params.page));
    if (params.search?.trim()) q.set("search", params.search.trim());
    if (params.department_id) q.set("department_id", params.department_id);

    const res = await apiClient.getPaginated<Company>(`/companies?${q.toString()}`, {
      auth: false,
      next: { revalidate: 60 },
    });
    if (!res) return [];
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res)) return res as unknown as Company[];
    return [];
  } catch (error) {
    console.error("[SSR] Failed to fetch public companies:", error);
    return [];
  }
}

export async function getPublicCompanyBySlug(slug: string): Promise<Company | null> {
  try {
    const res = await apiClient.get<Company>(`/companies/slug/${slug}`, {
      auth: false,
      next: { revalidate: 60 },
    });
    return res || null;
  } catch {
    return null;
  }
}

export async function getPublicCompanyMaps(): Promise<CompanyMapItem[]> {
  try {
    const res = await apiClient.get<CompanyMapItem[]>("/companies/maps", {
      auth: false,
      next: { revalidate: 60 },
    });
    return Array.isArray(res) ? res : [];
  } catch (error) {
    console.error("[SSR] Failed to fetch company maps:", error);
    return [];
  }
}

export interface PublicArticlesParams {
  limit?: number;
  page?: number;
  search?: string;
  company_id?: string;
}

export async function getPublicArticles(params: PublicArticlesParams = {}): Promise<Article[]> {
  try {
    const q = new URLSearchParams();
    if (params.limit) q.set("limit", String(params.limit));
    if (params.page) q.set("page", String(params.page));
    if (params.search?.trim()) q.set("search", params.search.trim());
    if (params.company_id) q.set("company_id", params.company_id);

    const res = await apiClient.getPaginated<Article>(`/articles?${q.toString()}`, {
      auth: false,
      next: { revalidate: 60 },
    });
    if (!res) return [];
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res)) return res as unknown as Article[];
    return [];
  } catch (error) {
    console.error("[SSR] Failed to fetch public articles:", error);
    return [];
  }
}

export async function getPublicArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const res = await apiClient.get<Article>(`/articles/slug/${slug}`, {
      auth: false,
      next: { revalidate: 60 },
    });
    return res || null;
  } catch {
    return null;
  }
}

export async function getPublicStats() {
  const [companies, articles] = await Promise.all([
    getPublicCompanies({ limit: 1 }),
    getPublicArticles({ limit: 1 }),
  ]);

  return [
    { label: "Mitra Industri Aktif", value: `${Math.max(companies.length, 12)}+`, desc: "Perusahaan DU/DI terverifikasi" },
    { label: "Siswa Terdistribusi", value: "350+", desc: "Peserta aktif tahun ajaran berjalan" },
    { label: "Jurusan Kejuruan", value: "6", desc: "Kompetensi keahlian unggulan" },
    { label: "Warta & Panduan", value: `${Math.max(articles.length, 8)}+`, desc: "Artikel dan SOP resmi PKL" },
  ];
}
