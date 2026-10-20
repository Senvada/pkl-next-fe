"use client";

import * as React from "react";
import { BlockHeading } from "./block-heading";
import { BlockTipTapText } from "./block-tiptap-text";
import { BlockImage } from "./block-image";
import { BlockCallout } from "./block-callout";
import { BlockDivider } from "./block-divider";
import { BlockColumns } from "./block-columns";
import type {
  ArticleBlock,
  HeadingBlockData,
  TextBlockData,
  ImageBlockData,
  CalloutBlockData,
  ColumnsBlockData,
  DividerBlockData,
  BlockType,
} from "../../types";

interface BlockDispatcherProps {
  block: ArticleBlock;
  onUpdate: (id: string, patch: Partial<ArticleBlock["data"]>) => void;
  onAddNestedBlock?: (columnId: string, side: "left" | "right", type: BlockType) => void;
  previewMode?: boolean;
}

export function BlockDispatcher({
  block,
  onUpdate,
  onAddNestedBlock,
  previewMode = false,
}: BlockDispatcherProps) {
  const handlePatch = (patch: Partial<ArticleBlock["data"]>) => {
    onUpdate(block.id, patch);
  };

  switch (block.type) {
    case "heading":
      return (
        <BlockHeading
          data={block.data as HeadingBlockData}
          onChange={handlePatch}
          previewMode={previewMode}
        />
      );

    case "text":
      return (
        <BlockTipTapText
          data={block.data as TextBlockData}
          onChange={handlePatch}
          previewMode={previewMode}
        />
      );

    case "image":
      return (
        <BlockImage
          data={block.data as ImageBlockData}
          onChange={handlePatch}
          previewMode={previewMode}
        />
      );

    case "callout":
      return (
        <BlockCallout
          data={block.data as CalloutBlockData}
          onChange={handlePatch}
          previewMode={previewMode}
        />
      );

    case "divider":
      return (
        <BlockDivider
          data={block.data as DividerBlockData}
          onChange={handlePatch}
          previewMode={previewMode}
        />
      );

    case "columns": {
      const colData = block.data as ColumnsBlockData;
      return (
        <BlockColumns
          data={colData}
          onChange={handlePatch}
          previewMode={previewMode}
          onAddBlock={(side, type) => onAddNestedBlock?.(block.id, side, type)}
          renderBlock={(nestedBlock) => (
            <div key={nestedBlock.id} className="my-1.5">
              <BlockDispatcher
                block={nestedBlock}
                onUpdate={onUpdate}
                previewMode={previewMode}
              />
            </div>
          )}
        />
      );
    }

    default:
      return null;
  }
}
