"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ChevronUp, ChevronDown, Copy, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ArticleBlock } from "../../types";

interface BlockWrapperProps {
  block: ArticleBlock;
  isFirst: boolean;
  isLast: boolean;
  previewMode?: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  children: React.ReactNode;
}

const TYPE_LABELS: Record<string, string> = {
  heading: "Judul",
  text: "Teks",
  image: "Gambar",
  callout: "Kutipan / Catatan",
  columns: "2 Kolom",
  divider: "Pemisah",
};

export function BlockWrapper({
  block,
  isFirst,
  isLast,
  previewMode = false,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  children,
}: BlockWrapperProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id, disabled: previewMode });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  if (previewMode) {
    return <div className="my-3">{children}</div>;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative my-3 rounded-xl border border-transparent p-2 transition-all duration-200",
        "hover:border-border hover:bg-card/40 focus-within:border-primary/40 focus-within:bg-card/40",
        isDragging && "z-50 shadow-lg ring-2 ring-primary/30"
      )}
    >
      <div className="absolute -top-3.5 right-3 z-10 flex items-center gap-1 rounded-lg border border-border bg-background px-1.5 py-0.5 shadow-sm opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus-within:opacity-100">
        <span className="text-[10px] font-medium text-muted-foreground px-1 uppercase tracking-wider">
          {TYPE_LABELS[block.type] || block.type}
        </span>
        <div className="h-3 w-[1px] bg-border my-auto" />
        <button
          type="button"
          {...attributes}
          {...listeners}
          title="Geser posisi"
          className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground rounded hover:bg-muted"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          disabled={isFirst}
          onClick={onMoveUp}
          title="Pindah ke atas"
          className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none rounded hover:bg-muted"
        >
          <ChevronUp className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          disabled={isLast}
          onClick={onMoveDown}
          title="Pindah ke bawah"
          className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none rounded hover:bg-muted"
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={onDuplicate}
          title="Duplikat blok"
          className="p-1 text-muted-foreground hover:text-foreground rounded hover:bg-muted"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          title="Hapus blok"
          className="p-1 text-rose-500 hover:text-rose-600 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="relative">{children}</div>
    </div>
  );
}
