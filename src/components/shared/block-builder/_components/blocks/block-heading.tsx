"use client";

import * as React from "react";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HeadingBlockData } from "../../types";

interface BlockHeadingProps {
  data: HeadingBlockData;
  onChange: (patch: Partial<HeadingBlockData>) => void;
  previewMode?: boolean;
}

const LEVEL_STYLES = {
  1: "text-2xl sm:text-3xl font-extrabold tracking-tight",
  2: "text-xl sm:text-2xl font-bold tracking-tight",
  3: "text-lg sm:text-xl font-semibold",
};

export function BlockHeading({ data, onChange, previewMode = false }: BlockHeadingProps) {
  if (previewMode) {
    const Tag = `h${data.level}` as keyof React.JSX.IntrinsicElements;
    return (
      <Tag
        className={cn(
          LEVEL_STYLES[data.level],
          "text-foreground my-2",
          data.align === "center" && "text-center",
          data.align === "right" && "text-right",
          data.align === "left" && "text-left"
        )}
      >
        {data.content || "Judul Kosong"}
      </Tag>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg">
          {([1, 2, 3] as const).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => onChange({ level: lvl })}
              className={cn(
                "px-2 py-0.5 rounded text-xs font-semibold transition-all",
                data.level === lvl
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              H{lvl}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg">
          {(["left", "center", "right"] as const).map((aln) => {
            const Icon =
              aln === "left" ? AlignLeft : aln === "center" ? AlignCenter : AlignRight;
            return (
              <button
                key={aln}
                type="button"
                onClick={() => onChange({ align: aln })}
                className={cn(
                  "p-1 rounded transition-all",
                  data.align === aln
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title={`Rata ${aln}`}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            );
          })}
        </div>
      </div>

      <input
        type="text"
        value={data.content}
        onChange={(e) => onChange({ content: e.target.value })}
        placeholder={`Tulis Judul H${data.level}...`}
        className={cn(
          "w-full bg-transparent border-none p-0 focus:outline-none focus:ring-0 text-foreground placeholder:text-muted-foreground/40",
          LEVEL_STYLES[data.level],
          data.align === "center" && "text-center",
          data.align === "right" && "text-right"
        )}
      />
    </div>
  );
}
