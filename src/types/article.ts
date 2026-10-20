export type ArticleStatus =
  | "draft"
  | "review"
  | "reject"
  | "published"
  | "archived";

export type ArticleCardStyle = 1 | 2 | 3 | 4;

export interface ArticleStyleConfig {
  type: ArticleCardStyle;
  height: number;
}

export interface ArticleCompany {
  id: string;
  name: string;
  slug: string;
  image_url?: string;
}

export interface ArticleAuthor {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role_name: string;
}

export interface Article {
  id: string;
  company_id: string;
  user_id: string;
  title: string;
  slug: string;
  content: unknown[];
  style: ArticleStyleConfig;
  cover_url?: string;
  status: ArticleStatus;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
  company: ArticleCompany;
  author: ArticleAuthor;
}

export interface CreateArticlePayload {
  title: string;
  company_id: string;
  cover_url?: string;
  style?: ArticleStyleConfig;
  content?: unknown[];
  status?: ArticleStatus;
}

export interface UpdateArticlePayload {
  title?: string;
  company_id?: string;
  cover_url?: string;
  style?: ArticleStyleConfig;
  content?: unknown[];
  status?: ArticleStatus;
}

export interface ArticleFilter {
  search?: string;
  status?: string;
  company_id?: string;
  user_id?: string;
}

export interface PresignCoverPayload {
  content_type: string;
  file_size: number;
}

export interface PresignCoverResponse {
  upload_url: string;
  public_url: string;
  key: string;
}
