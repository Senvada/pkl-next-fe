import { nanoid } from "nanoid";
import type { ArticleBlock, ColumnsBlockData } from "./types";

export function updateBlockInTree(
  tree: ArticleBlock[],
  id: string,
  patch: Partial<ArticleBlock["data"]>
): ArticleBlock[] {
  return tree.map((block) => {
    if (block.id === id) {
      return {
        ...block,
        data: { ...block.data, ...patch } as ArticleBlock["data"],
      };
    }

    if (block.type === "columns") {
      const data = block.data as ColumnsBlockData;
      return {
        ...block,
        data: {
          ...data,
          left: updateBlockInTree(data.left, id, patch),
          right: updateBlockInTree(data.right, id, patch),
        },
      };
    }

    return block;
  });
}

export function deleteBlockFromTree(tree: ArticleBlock[], id: string): ArticleBlock[] {
  return tree.flatMap((block) => {
    if (block.id === id) return [];

    if (block.type === "columns") {
      const data = block.data as ColumnsBlockData;
      return [
        {
          ...block,
          data: {
            ...data,
            left: deleteBlockFromTree(data.left, id),
            right: deleteBlockFromTree(data.right, id),
          },
        },
      ];
    }

    return [block];
  });
}

export function moveBlockStep(
  tree: ArticleBlock[],
  id: string,
  direction: "up" | "down"
): ArticleBlock[] {
  const index = tree.findIndex((b) => b.id === id);
  if (index !== -1) {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= tree.length) return tree;

    const copy = [...tree];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);
    return copy;
  }

  // Check columns nested blocks
  return tree.map((block) => {
    if (block.type === "columns") {
      const data = block.data as ColumnsBlockData;
      return {
        ...block,
        data: {
          ...data,
          left: moveBlockStep(data.left, id, direction),
          right: moveBlockStep(data.right, id, direction),
        },
      };
    }
    return block;
  });
}

export function duplicateBlockInTree(tree: ArticleBlock[], id: string): ArticleBlock[] {
  const index = tree.findIndex((b) => b.id === id);
  if (index !== -1) {
    const target = tree[index];
    const duplicated: ArticleBlock = {
      ...structuredClone(target),
      id: nanoid(),
    };
    const copy = [...tree];
    copy.splice(index + 1, 0, duplicated);
    return copy;
  }

  return tree.map((block) => {
    if (block.type === "columns") {
      const data = block.data as ColumnsBlockData;
      return {
        ...block,
        data: {
          ...data,
          left: duplicateBlockInTree(data.left, id),
          right: duplicateBlockInTree(data.right, id),
        },
      };
    }
    return block;
  });
}

export function reorderBlocks(
  tree: ArticleBlock[],
  activeId: string,
  overId: string
): ArticleBlock[] {
  const oldIndex = tree.findIndex((item) => item.id === activeId);
  const newIndex = tree.findIndex((item) => item.id === overId);

  if (oldIndex === -1 || newIndex === -1) return tree;

  const copy = [...tree];
  const [removed] = copy.splice(oldIndex, 1);
  copy.splice(newIndex, 0, removed);
  return copy;
}
