import type { Asset } from "@/types/asset";

export interface AssetPickerOptions {
  accept?: string[];
  title?: string;
  folder?: string;
}

export type AssetPickerResolver = (asset: Asset | null) => void;

export interface AssetPickerContextValue {
  pick: (options?: AssetPickerOptions) => Promise<Asset | null>;
}
