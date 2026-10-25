"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Building2, User2, Trash2, ImageIcon, Edit3, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Article, ArticleStatus } from "@/types/article";
import { useCurrentUser } from "@/hooks/modules/auth/useCurrentUser";
import { useUpdateArticleMutation } from "@/hooks/modules/article";
import {
  canEditArticle,
  canDeleteArticle,
  getAllowedArticleStatuses,
} from "@/lib/auth/permissions";
import { STATUS_BADGES, STYLE_LABELS } from "../_lib/article-constants";

interface ArticleCardItemProps {
  article: Article;
  onDelete: (article: Article) => void;
}

export default function ArticleCardItem({ article, onDelete }: ArticleCardItemProps) {
  const currentUser = useCurrentUser();
  const updateMutation = useUpdateArticleMutation();
  const [isUpdating, setIsUpdating] = React.useState(false);

  const authorId = article.user_id || article.author?.id;
  const canEdit = canEditArticle(currentUser, authorId);
  const canDelete = canDeleteArticle(currentUser, authorId);
  const allowedStatuses = getAllowedArticleStatuses(currentUser, authorId);

  const statusInfo = STATUS_BADGES[article.status] || STATUS_BADGES.draft;
  const styleName = STYLE_LABELS[article.style?.type] || "Klasik";

  const handleStatusChange = async (newStatus: ArticleStatus) => {
    if (newStatus === article.status || isUpdating) return;
    setIsUpdating(true);
    try {
      await updateMutation.mutateAsync({
        id: article.id,
        payload: { status: newStatus },
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between">
      <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {article.cover_url ? (
          <Image
            src={article.cover_url}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-1.5">
            <ImageIcon className="size-7" />
            <span className="text-[11px] font-medium">Tanpa Cover</span>
          </div>
        )}

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
          {allowedStatuses.length > 1 ? (
            <select
              value={article.status}
              disabled={isUpdating}
              onChange={(e) => handleStatusChange(e.target.value as ArticleStatus)}
              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold shadow-xs border-0 cursor-pointer focus:ring-1 focus:ring-ring ${statusInfo.className}`}
              title="Ubah status artikel"
            >
              <option value={article.status} disabled>{statusInfo.label}</option>
              {allowedStatuses.map((st) => (
                <option key={st} value={st} className="bg-background text-foreground">
                  {STATUS_BADGES[st]?.label || st}
                </option>
              ))}
            </select>
          ) : (
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold shadow-xs ${statusInfo.className}`}>
              {statusInfo.label}
            </span>
          )}
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-black/60 backdrop-blur-md text-white border border-white/20">
            Style: {styleName}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          {article.company?.name && (
            <div className="flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-400 font-medium line-clamp-1">
              <Building2 className="size-3.5 shrink-0" />
              <span>{article.company.name}</span>
            </div>
          )}

          <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
            {article.title}
          </h3>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 line-clamp-1">
            <User2 className="size-3 shrink-0" />
            <span className="line-clamp-1">{article.author?.name || "Penulis"}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {article.slug && (
              <Button asChild variant="ghost" size="icon" className="size-7 rounded-lg" title="Lihat Artikel">
                <Link href={`/articles/${article.slug}`} target="_blank">
                  <Eye className="size-3.5" />
                </Link>
              </Button>
            )}
            {canEdit && (
              <Button asChild variant="outline" size="sm" className="h-7 text-xs rounded-lg gap-1 px-2 font-medium">
                <Link href={`/dashboard/articles/${article.id}/edit`}>
                  <Edit3 className="size-3" />
                  <span>Tulis</span>
                </Link>
              </Button>
            )}
            {canDelete && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onDelete(article)}
                className="size-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                title="Hapus Artikel"
              >
                <Trash2 className="size-3.5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
