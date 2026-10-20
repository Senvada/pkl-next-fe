"use client";

import * as React from "react";
import {
  Heading,
  AlignLeft,
  Image as ImageIcon,
  MessageSquareQuote,
  Columns2,
  Minus,
  LayoutTemplate,
} from "lucide-react";
import type { BlockType } from "../types";

interface BuilderPaletteProps {
  onAddBlock: (type: BlockType) => void;
  onOpenTemplates: () => void;
  disabled?: boolean;
}

const PALETTE_ITEMS: { type: BlockType; label: string; icon: typeof Heading }[] = [
  { type: "heading", label: "Judul", icon: Heading },
  { type: "text", label: "Teks", icon: AlignLeft },
  { type: "image", label: "Gambar", icon: ImageIcon },
  { type: "callout", label: "Catatan", icon: MessageSquareQuote },
  { type: "columns", label: "2 Kolom", icon: Columns2 },
  { type: "divider", label: "Pemisah", icon: Minus },
];

export function BuilderPalette({ onAddBlock, onOpenTemplates, disabled = false }: BuilderPaletteProps) {
  if (disabled) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 p-1.5 rounded-2xl border border-border/80 bg-background/95 backdrop-blur-md shadow-xl max-w-[95vw] overflow-x-auto">
      <div className="flex items-center gap-1">
        {PALETTE_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.type}
              type="button"
              onClick={() => onAddBlock(item.type)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-foreground hover:bg-muted transition-colors whitespace-nowrap active:scale-95"
              title={`Tambah ${item.label}`}
            >
              <Icon className="h-4 w-4 text-primary" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="h-5 w-[1px] bg-border mx-1 shrink-0" />

      <button
        type="button"
        onClick={onOpenTemplates}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors whitespace-nowrap active:scale-95 shrink-0"
        title="Gunakan Template Siap Pakai"
      >
        <LayoutTemplate className="h-4 w-4" />
        <span>Template</span>
      </button>
    </div>
  );
}
