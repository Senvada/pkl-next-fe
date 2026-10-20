"use client";

import * as React from "react";
import { Plus, X, Heading, AlignLeft, Image as ImageIcon, MessageSquareQuote, Columns2, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BlockType } from "../types";

interface BuilderQuickAddProps {
  onInsert: (type: BlockType) => void;
  disabled?: boolean;
}

const QUICK_ITEMS: { type: BlockType; label: string; icon: typeof Heading }[] = [
  { type: "heading", label: "Judul", icon: Heading },
  { type: "text", label: "Teks", icon: AlignLeft },
  { type: "image", label: "Gambar", icon: ImageIcon },
  { type: "callout", label: "Catatan", icon: MessageSquareQuote },
  { type: "columns", label: "2 Kolom", icon: Columns2 },
  { type: "divider", label: "Pemisah", icon: Minus },
];

export function BuilderQuickAdd({ onInsert, disabled = false }: BuilderQuickAddProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  if (disabled) return null;

  return (
    <div className="group relative py-1 flex items-center justify-center">
      <div className="absolute inset-x-0 h-[1px] bg-border/40 group-hover:bg-primary/30 transition-colors" />

      {isOpen ? (
        <div className="relative z-10 flex items-center gap-1 p-1 bg-background border border-primary/40 rounded-xl shadow-md">
          {QUICK_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.type}
                type="button"
                onClick={() => {
                  onInsert(item.type);
                  setIsOpen(false);
                }}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs hover:bg-muted text-foreground transition-colors"
              >
                <Icon className="h-3.5 w-3.5 text-primary" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg hover:bg-muted text-muted-foreground ml-1"
            title="Batal"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={cn(
            "relative z-10 h-5 w-5 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground",
            "opacity-0 group-hover:opacity-100 hover:text-foreground hover:scale-110 hover:border-primary/50 transition-all shadow-xs"
          )}
          title="Sisipkan blok di sini"
        >
          <Plus className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
