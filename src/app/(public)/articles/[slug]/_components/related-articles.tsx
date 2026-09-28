import { Article } from "@/lib/mock-data";
import ArticleCard from "../../_components/article-card";

export default function RelatedArticles({
  articles,
}: {
  articles: Article[];
}) {
  if (articles.length === 0) return null;

  return (
    <div className="mt-16 pt-12 border-t border-white/10">
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">
        Artikel Terkait Lainnya
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.slice(0, 3).map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
