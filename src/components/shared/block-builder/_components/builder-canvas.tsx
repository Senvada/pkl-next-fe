"use client";

import * as React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { Sparkles, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { BlockWrapper } from "./blocks/block-wrapper";
import { BlockDispatcher } from "./blocks/block-dispatcher";
import { BuilderQuickAdd } from "./builder-quick-add";
import type { ArticleBlock, BlockType, BuilderViewport } from "../types";

interface BuilderCanvasProps {
  blocks: ArticleBlock[];
  viewport: BuilderViewport;
  previewMode: boolean;
  onUpdateBlock: (id: string, patch: Partial<ArticleBlock["data"]>) => void;
  onDeleteBlock: (id: string) => void;
  onMoveBlock: (id: string, dir: "up" | "down") => void;
  onDuplicateBlock: (id: string) => void;
  onReorderBlocks: (activeId: string, overId: string) => void;
  onInsertBlockAt: (index: number, type: BlockType) => void;
  onAddNestedBlock: (columnId: string, side: "left" | "right", type: BlockType) => void;
  onOpenTemplates: () => void;
}

const VIEWPORT_WIDTHS: Record<BuilderViewport, string> = {
  desktop: "max-w-4xl",
  tablet: "max-w-[768px]",
  mobile: "max-w-[390px]",
};

export function BuilderCanvas({
  blocks,
  viewport,
  previewMode,
  onUpdateBlock,
  onDeleteBlock,
  onMoveBlock,
  onDuplicateBlock,
  onReorderBlocks,
  onInsertBlockAt,
  onAddNestedBlock,
  onOpenTemplates,
}: BuilderCanvasProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onReorderBlocks(String(active.id), String(over.id));
    }
  };

  const blockIds = React.useMemo(() => blocks.map((b) => b.id), [blocks]);

  return (
    <div className={cn("mx-auto transition-all duration-300 pb-28 pt-6 px-4", VIEWPORT_WIDTHS[viewport])}>
      {blocks.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border-2 border-dashed border-border bg-card/40 my-8">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary mb-3">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold">Mulai Menulis Konten Anda</h3>
          <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-5">
            Pilih starter template untuk struktur otomatis, atau tambahkan blok pertama Anda di bawah.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenTemplates}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Pilih Template
            </button>
            <button
              type="button"
              onClick={() => onInsertBlockAt(0, "heading")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              Tambah Judul
            </button>
          </div>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-1">
              {blocks.map((block, idx) => (
                <React.Fragment key={block.id}>
                  <BuilderQuickAdd
                    onInsert={(type) => onInsertBlockAt(idx, type)}
                    disabled={previewMode}
                  />
                  <BlockWrapper
                    block={block}
                    isFirst={idx === 0}
                    isLast={idx === blocks.length - 1}
                    previewMode={previewMode}
                    onMoveUp={() => onMoveBlock(block.id, "up")}
                    onMoveDown={() => onMoveBlock(block.id, "down")}
                    onDuplicate={() => onDuplicateBlock(block.id)}
                    onDelete={() => onDeleteBlock(block.id)}
                  >
                    <BlockDispatcher
                      block={block}
                      onUpdate={onUpdateBlock}
                      onAddNestedBlock={onAddNestedBlock}
                      previewMode={previewMode}
                    />
                  </BlockWrapper>
                </React.Fragment>
              ))}
              <BuilderQuickAdd
                onInsert={(type) => onInsertBlockAt(blocks.length, type)}
                disabled={previewMode}
              />
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
