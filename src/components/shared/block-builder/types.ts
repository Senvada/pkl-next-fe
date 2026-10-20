export type BlockType =
  | "heading"
  | "text"
  | "image"
  | "callout"
  | "columns"
  | "divider";

export interface HeadingBlockData {
  level: 1 | 2 | 3;
  content: string;
  align: "left" | "center" | "right";
}

export interface TextBlockData {
  content: unknown; // TipTap JSONContent
}

export interface ImageBlockData {
  assetId?: string;
  url: string;
  caption?: string;
  align: "center" | "full" | "left" | "right";
}

export interface CalloutBlockData {
  intent: "info" | "tip" | "warning" | "quote";
  title?: string;
  content: string;
}

export interface ColumnsBlockData {
  ratio: "50-50" | "60-40" | "40-60";
  left: ArticleBlock[];
  right: ArticleBlock[];
}

export interface DividerBlockData {
  style: "solid" | "dashed" | "dots";
}

export interface ArticleBlock {
  id: string;
  type: BlockType;
  data:
    | HeadingBlockData
    | TextBlockData
    | ImageBlockData
    | CalloutBlockData
    | ColumnsBlockData
    | DividerBlockData;
}

export type BuilderViewport = "desktop" | "tablet" | "mobile";

export type AutoSaveStatus = "idle" | "saving" | "saved" | "error";

export interface StarterTemplate {
  id: string;
  title: string;
  desc: string;
  category: "article" | "company" | "all";
  blocks: ArticleBlock[];
}

export interface BlockBuilderProps {
  entityId: string;
  entityType: "article" | "company";
  title: string;
  subtitle?: string;
  initialBlocks?: ArticleBlock[];
  onSave: (blocks: ArticleBlock[]) => Promise<void>;
  backUrl: string;
  templateCategory?: "article" | "company" | "all";
}
