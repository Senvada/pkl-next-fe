import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ARTICLES } from "@/lib/mock-data";
import ArticleHeader from "./_components/article-header";
import ArticleBody from "./_components/article-body";
import RelatedArticles from "./_components/related-articles";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return {
      title: "Artikel Tidak Ditemukan",
    };
  }

  return {
    title: `${article.title} | Artikel PKL SMKN 6 Malang`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.coverImage],
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const related = ARTICLES.filter((a) => a.id !== article.id);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-4xl mx-auto">
        <ArticleHeader article={article} />
        <ArticleBody article={article} />
        <RelatedArticles articles={related} />
      </div>
    </div>
  );
}
