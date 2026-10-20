"use client";

import * as React from "react";
import { AssetPickerProvider } from "@/components/shared/asset-picker";
import { useBlockHistory } from "./_hooks/use-block-history";
import { useAutoSave } from "./_hooks/use-auto-save";
import { useBuilderActions } from "./_hooks/use-builder-actions";
import { BuilderHeader } from "./_components/builder-header";
import { BuilderCanvas } from "./_components/builder-canvas";
import { BuilderPalette } from "./_components/builder-palette";
import { BuilderTemplatePicker } from "./_components/builder-template-picker";
import type { BlockBuilderProps, BuilderViewport } from "./types";

export function BlockBuilder({
  entityType,
  title,
  subtitle,
  initialBlocks = [],
  onSave,
  backUrl,
  templateCategory,
}: BlockBuilderProps) {
  const [viewport, setViewport] = React.useState<BuilderViewport>("desktop");
  const [previewMode, setPreviewMode] = React.useState(false);
  const [isTemplateOpen, setIsTemplateOpen] = React.useState(false);

  const { blocks, setBlocks, undo, redo, canUndo, canRedo } = useBlockHistory(initialBlocks);
  const { status: autoSaveStatus, forceSave } = useAutoSave({ blocks, onSave, debounceMs: 800 });
  const actions = useBuilderActions(setBlocks);

  return (
    <AssetPickerProvider>
      <div className="min-h-screen bg-muted/15 flex flex-col">
        <BuilderHeader
          title={title}
          subtitle={subtitle}
          backUrl={backUrl}
          viewport={viewport}
          onViewportChange={setViewport}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
          autoSaveStatus={autoSaveStatus}
          previewMode={previewMode}
          onTogglePreview={() => setPreviewMode((prev) => !prev)}
          onForceSave={forceSave}
        />

        <main className="flex-1 overflow-x-hidden">
          <BuilderCanvas
            blocks={blocks}
            viewport={viewport}
            previewMode={previewMode}
            onUpdateBlock={actions.updateBlock}
            onDeleteBlock={actions.deleteBlock}
            onMoveBlock={actions.moveBlock}
            onDuplicateBlock={actions.duplicateBlock}
            onReorderBlocks={actions.reorder}
            onInsertBlockAt={actions.insertBlockAt}
            onAddNestedBlock={actions.addNestedBlock}
            onOpenTemplates={() => setIsTemplateOpen(true)}
          />
        </main>

        <BuilderPalette
          onAddBlock={actions.addBlock}
          onOpenTemplates={() => setIsTemplateOpen(true)}
          disabled={previewMode}
        />

        <BuilderTemplatePicker
          isOpen={isTemplateOpen}
          onClose={() => setIsTemplateOpen(false)}
          onSelect={actions.selectTemplate}
          category={templateCategory || entityType}
        />
      </div>
    </AssetPickerProvider>
  );
}
