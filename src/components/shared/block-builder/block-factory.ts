import { nanoid } from "nanoid";
import type { ArticleBlock, BlockType } from "./types";

export function createDefaultBlock(type: BlockType): ArticleBlock {
  const id = nanoid();

  switch (type) {
    case "heading":
      return {
        id,
        type: "heading",
        data: { level: 2, content: "", align: "left" },
      };

    case "text":
      return {
        id,
        type: "text",
        data: {
          content: {
            type: "doc",
            content: [{ type: "paragraph" }],
          },
        },
      };

    case "image":
      return {
        id,
        type: "image",
        data: { url: "", caption: "", align: "center" },
      };

    case "callout":
      return {
        id,
        type: "callout",
        data: { intent: "info", title: "Catatan", content: "" },
      };

    case "columns":
      return {
        id,
        type: "columns",
        data: {
          ratio: "50-50",
          left: [],
          right: [],
        },
      };

    case "divider":
      return {
        id,
        type: "divider",
        data: { style: "solid" },
      };
  }
}
