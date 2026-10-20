"use client";

import * as React from "react";
import { BlockDispatcher } from "./_components/blocks/block-dispatcher";
import type { ArticleBlock } from "./types";

interface BlockViewerProps {
  blocks?: ArticleBlock[] | unknown;
  className?: string;
}

export function BlockViewer({ blocks, className }: BlockViewerProps) {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  const validBlocks = blocks as ArticleBlock[];

  return (
    <div className={className || "space-y-4"}>
      {validBlocks.map((block) => (
        <BlockDispatcher
          key={block.id}
          block={block}
          onUpdate={() => {}}
          previewMode={true}
        />
      ))}
    </div>
  );
}
