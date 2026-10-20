"use client";

import * as React from "react";
import { Minus, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DividerBlockData } from "../../types";

interface BlockDividerProps {
  data: DividerBlockData;
  onChange: (patch: Partial<DividerBlockData>) => void;
  previewMode?: boolean;
}

export function BlockDivider({ data, onChange, previewMode = false }: BlockDividerProps) {
  const currentStyle = data.style || "solid";

  const renderLine = () => {
    if (currentStyle === "dots") {
      return (
        <div className="flex items-center justify-center gap-2 py-4">
          <span className="h-1.5 w-1.5 rounded-full bg-border" />
          <span className="h-1.5 w-1.5 rounded-full bg-border" />
          <span className="h-1.5 w-1.5 rounded-full bg-border" />
        </div>
      );
    }

    return (
      <hr
        className={cn(
          "my-4 border-t border-border",
          currentStyle === "dashed" && "border-dashed"
        )}
      />
    );
  };

  if (previewMode) {
    return renderLine();
  }

  return (
    <div className="space-y-2 py-2">
      <div className="flex items-center justify-center gap-1">
        <div className="flex items-center gap-1 bg-muted/70 p-0.5 rounded-lg border border-border/40 text-xs">
          <button
            type="button"
            onClick={() => onChange({ style: "solid" })}
            className={cn(
              "px-2 py-0.5 rounded flex items-center gap-1 transition-colors",
              currentStyle === "solid" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Minus className="h-3 w-3" />
            <span>Garis Lurus</span>
          </button>
          <button
            type="button"
            onClick={() => onChange({ style: "dashed" })}
            className={cn(
              "px-2 py-0.5 rounded flex items-center gap-1 transition-colors",
              currentStyle === "dashed" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Minus className="h-3 w-3 stroke-dashed" />
            <span>Putus-putus</span>
          </button>
          <button
            type="button"
            onClick={() => onChange({ style: "dots" })}
            className={cn(
              "px-2 py-0.5 rounded flex items-center gap-1 transition-colors",
              currentStyle === "dots" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <MoreHorizontal className="h-3 w-3" />
            <span>Titik</span>
          </button>
        </div>
      </div>

      {renderLine()}
    </div>
  );
}
