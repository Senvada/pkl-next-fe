"use client";

import * as React from "react";
import { createDefaultBlock } from "../block-factory";
import {
  updateBlockInTree,
  deleteBlockFromTree,
  moveBlockStep,
  duplicateBlockInTree,
  reorderBlocks,
} from "../block-tree-utils";
import type { ArticleBlock, BlockType, ColumnsBlockData, StarterTemplate } from "../types";

export function useBuilderActions(
  setBlocks: (action: ArticleBlock[] | ((prev: ArticleBlock[]) => ArticleBlock[])) => void
) {
  const updateBlock = React.useCallback(
    (id: string, patch: Partial<ArticleBlock["data"]>) => {
      setBlocks((prev) => updateBlockInTree(prev, id, patch));
    },
    [setBlocks]
  );

  const deleteBlock = React.useCallback(
    (id: string) => setBlocks((prev) => deleteBlockFromTree(prev, id)),
    [setBlocks]
  );

  const moveBlock = React.useCallback(
    (id: string, dir: "up" | "down") => setBlocks((prev) => moveBlockStep(prev, id, dir)),
    [setBlocks]
  );

  const duplicateBlock = React.useCallback(
    (id: string) => setBlocks((prev) => duplicateBlockInTree(prev, id)),
    [setBlocks]
  );

  const reorder = React.useCallback(
    (activeId: string, overId: string) => setBlocks((prev) => reorderBlocks(prev, activeId, overId)),
    [setBlocks]
  );

  const insertBlockAt = React.useCallback(
    (index: number, type: BlockType) => {
      const newBlock = createDefaultBlock(type);
      setBlocks((prev) => {
        const copy = [...prev];
        copy.splice(index, 0, newBlock);
        return copy;
      });
    },
    [setBlocks]
  );

  const addBlock = React.useCallback(
    (type: BlockType) => {
      const newBlock = createDefaultBlock(type);
      setBlocks((prev) => [...prev, newBlock]);
    },
    [setBlocks]
  );

  const addNestedBlock = React.useCallback(
    (colId: string, side: "left" | "right", type: BlockType) => {
      const newBlock = createDefaultBlock(type);
      setBlocks((prev) =>
        prev.map((b) => {
          if (b.id !== colId || b.type !== "columns") return b;
          const colData = b.data as ColumnsBlockData;
          return {
            ...b,
            data: { ...colData, [side]: [...(colData[side] || []), newBlock] },
          };
        })
      );
    },
    [setBlocks]
  );

  const selectTemplate = React.useCallback(
    (template: StarterTemplate) => {
      setBlocks(structuredClone(template.blocks));
    },
    [setBlocks]
  );

  return {
    updateBlock,
    deleteBlock,
    moveBlock,
    duplicateBlock,
    reorder,
    insertBlockAt,
    addBlock,
    addNestedBlock,
    selectTemplate,
  };
}
