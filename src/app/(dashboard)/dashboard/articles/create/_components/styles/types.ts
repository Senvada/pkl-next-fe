import type { ArticleStyleConfig } from "@/types/article";

export interface ArticleCardPreviewProps {
  title: string;
  companyName?: string;
  authorName?: string;
  coverUrl?: string;
  styleConfig: ArticleStyleConfig;
  onSelectImage?: () => void;
}
