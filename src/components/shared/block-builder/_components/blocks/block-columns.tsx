"use client";

import * as React from "react";
import { Columns2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ColumnsBlockData, ArticleBlock, BlockType } from "../../types";

interface BlockColumnsProps {
  data: ColumnsBlockData;
  onChange: (patch: Partial<ColumnsBlockData>) => void;
  renderBlock: (block: ArticleBlock, side: "left" | "right", index: number) => React.ReactNode;
  onAddBlock: (side: "left" | "right", type: BlockType) => void;
  previewMode?: boolean;
}

const RATIO_COLS: Record<ColumnsBlockData["ratio"], { left: string; right: string }> = {
  "50-50": { left: "md:col-span-6", right: "md:col-span-6" },
  "60-40": { left: "md:col-span-7", right: "md:col-span-5" },
  "40-60": { left: "md:col-span-5", right: "md:col-span-7" },
};

export function BlockColumns({
  data,
  onChange,
  renderBlock,
  onAddBlock,
  previewMode = false,
}: BlockColumnsProps) {
  const currentRatio = data.ratio || "50-50";
  const ratioCols = RATIO_COLS[currentRatio];

  const renderColumn = (side: "left" | "right", blocks: ArticleBlock[], label: string) => {
    return (
      <div className={cn("space-y-3 p-2 rounded-xl", !previewMode && "border border-border/40 bg-muted/10 min-h-[100px]")}>
        {!previewMode && (
          <div className="text-[11px] font-medium text-muted-foreground flex items-center justify-between border-b border-border/40 pb-1">
            <span>Kolom {label}</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onAddBlock(side, "text")}
                className="px-1.5 py-0.5 rounded text-[10px] bg-muted hover:bg-muted/80 text-foreground"
              >
                + Teks
              </button>
              <button
                type="button"
                onClick={() => onAddBlock(side, "image")}
                className="px-1.5 py-0.5 rounded text-[10px] bg-muted hover:bg-muted/80 text-foreground"
              >
                + Gambar
              </button>
            </div>
          </div>
        )}

        {blocks.length === 0 && !previewMode ? (
          <div className="flex flex-col items-center justify-center py-6 text-center text-xs text-muted-foreground">
            <span>Kolom {label} masih kosong</span>
            <div className="flex gap-1.5 mt-2">
              <button
                type="button"
                onClick={() => onAddBlock(side, "text")}
                className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-background border hover:bg-muted"
              >
                <Plus className="h-3 w-3" /> Teks
              </button>
              <button
                type="button"
                onClick={() => onAddBlock(side, "image")}
                className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-background border hover:bg-muted"
              >
                <Plus className="h-3 w-3" /> Gambar
              </button>
            </div>
          </div>
        ) : (
          blocks.map((block, idx) => renderBlock(block, side, idx))
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2 my-2">
      {!previewMode && (
        <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Columns2 className="h-3.5 w-3.5" />
            <span className="font-medium text-xs">Tata Letak Kolom</span>
          </div>
          <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg">
            {(["50-50", "60-40", "40-60"] as const).map((ratio) => (
              <button
                key={ratio}
                type="button"
                onClick={() => onChange({ ratio })}
                className={cn(
                  "px-2 py-0.5 rounded text-xs transition-colors",
                  currentRatio === ratio ? "bg-background text-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className={ratioCols.left}>{renderColumn("left", data.left || [], "Kiri")}</div>
        <div className={ratioCols.right}>{renderColumn("right", data.right || [], "Kanan")}</div>
      </div>
    </div>
  );
}
