"use client";

import * as React from "react";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BuilderViewport } from "../types";

interface BuilderViewportControlsProps {
  viewport: BuilderViewport;
  onChange: (viewport: BuilderViewport) => void;
}

const VIEWPORTS: { id: BuilderViewport; label: string; icon: typeof Monitor }[] = [
  { id: "desktop", label: "Desktop (100%)", icon: Monitor },
  { id: "tablet", label: "Tablet (768px)", icon: Tablet },
  { id: "mobile", label: "Mobile (375px)", icon: Smartphone },
];

export function BuilderViewportControls({ viewport, onChange }: BuilderViewportControlsProps) {
  return (
    <div className="flex items-center gap-0.5 bg-muted/60 p-1 rounded-xl border border-border/50">
      {VIEWPORTS.map((item) => {
        const Icon = item.icon;
        const isActive = viewport === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            title={item.label}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all",
              isActive
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{item.id === "desktop" ? "Desktop" : item.id === "tablet" ? "Tablet" : "HP"}</span>
          </button>
        );
      })}
    </div>
  );
}
