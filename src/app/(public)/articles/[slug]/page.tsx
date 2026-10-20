import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicArticleBySlug, getPublicArticles } from "@/services/public-api";
import { ARTICLES } from "@/lib/mock-data";
import ArticleHeader from "./_components/article-header";
import ArticleBody from "./_components/article-body";
import RelatedArticles from "./_components/related-articles";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const rawArticle = (await getPublicArticleBySlug(slug)) || ARTICLES.find((a) => a.slug === slug);

  if (!rawArticle) {
    return { title: "Artikel Tidak Ditemukan" };
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const article = rawArticle as any;
  const desc = article.excerpt || article.title;
  const image = article.cover_url || article.coverImage;

  return {
    title: `${article.title} | Artikel PKL SMKN 6 Malang`,
    description: desc,
    openGraph: {
      title: article.title,
      description: desc,
      images: image ? [image] : [],
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = (await getPublicArticleBySlug(slug)) || ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const allArticles = await getPublicArticles({ limit: 4 });
  const related = allArticles.filter((a) => a.slug !== slug);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-4xl mx-auto">
        <ArticleHeader article={article} />
        <ArticleBody article={article} />
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <RelatedArticles articles={related.length > 0 ? (related as any) : (ARTICLES.filter((a) => a.slug !== slug) as any)} />
      </div>
    </div>
  );
}
