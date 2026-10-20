"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Undo2, Redo2, Eye, Edit3, CheckCircle2, Loader2, AlertCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BuilderViewportControls } from "./builder-viewport-controls";
import type { BuilderViewport, AutoSaveStatus } from "../types";

interface BuilderHeaderProps {
  title: string;
  subtitle?: string;
  backUrl: string;
  viewport: BuilderViewport;
  onViewportChange: (viewport: BuilderViewport) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  autoSaveStatus: AutoSaveStatus;
  previewMode: boolean;
  onTogglePreview: () => void;
  onForceSave: () => void;
}

export function BuilderHeader({
  title,
  subtitle,
  backUrl,
  viewport,
  onViewportChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  autoSaveStatus,
  previewMode,
  onTogglePreview,
  onForceSave,
}: BuilderHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-md px-4 py-2.5">
      <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={backUrl}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            title="Kembali"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-sm font-semibold truncate leading-tight">{title}</h1>
            <p className="text-[11px] text-muted-foreground truncate">{subtitle || "Editor Konten Interaktif"}</p>
          </div>
        </div>

        {/* Center: Viewport & Undo/Redo */}
        <div className="hidden md:flex items-center gap-2">
          <BuilderViewportControls viewport={viewport} onChange={onViewportChange} />
          <div className="h-4 w-[1px] bg-border mx-1" />
          <div className="flex items-center gap-0.5 bg-muted/60 p-1 rounded-xl border border-border/50">
            <button
              type="button"
              disabled={!canUndo}
              onClick={onUndo}
              title="Undo (Ctrl+Z)"
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <Undo2 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              disabled={!canRedo}
              onClick={onRedo}
              title="Redo (Ctrl+Y)"
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <Redo2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Right: AutoSave Status & Mode Toggles */}
        <div className="flex items-center gap-2">
          {/* AutoSave Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-muted/40 border border-border/40">
            {autoSaveStatus === "saving" && (
              <>
                <Loader2 className="h-3 w-3 animate-spin text-sky-500" />
                <span className="text-[11px] text-muted-foreground">Menyimpan...</span>
              </>
            )}
            {autoSaveStatus === "saved" && (
              <>
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400">Tersimpan</span>
              </>
            )}
            {autoSaveStatus === "error" && (
              <>
                <AlertCircle className="h-3 w-3 text-rose-500" />
                <span className="text-[11px] text-rose-500">Gagal simpan</span>
              </>
            )}
            {autoSaveStatus === "idle" && (
              <span className="text-[11px] text-muted-foreground">Siap</span>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onTogglePreview}
            className="h-8 gap-1.5 text-xs rounded-xl"
          >
            {previewMode ? <Edit3 className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            <span>{previewMode ? "Edit" : "Pratinjau"}</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={onForceSave}
            disabled={autoSaveStatus === "saving"}
            className="h-8 gap-1.5 text-xs rounded-xl"
          >
            <Save className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Simpan</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
